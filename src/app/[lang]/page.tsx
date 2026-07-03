import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import LandingPage from "@/components/LandingPage";
import MainLayout from "./(main)/layout";
export const dynamic = 'force-dynamic';
import { fetchProducts, fetchShops } from "@/lib/supabase";
import { optimizeProducts, optimizeShops } from "@/lib/utils";
import DynamicTrailsClient from "@/components/ui/DynamicTrailsClient";
import HomeCarousel from "@/components/ui/HomeCarousel";
import BrowseByCategory from "@/components/ui/BrowseByCategory";
import TrustBanner from "@/components/ui/TrustBanner";
import { headers } from 'next/headers';
import { findClosestCityWithProducts, MOROCCAN_CITIES } from '@/lib/geo';
import { APP_COLLECTIONS } from '@/lib/app_collections';


interface PageProps {
  params: Promise<{ lang: string }> | { lang: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  const translations = {
    en: {
      titlePlain: "Afus - Shop authentic, handmade, and unique Moroccan artisan crafts",
      description: "Shop on Afus. Find handmade Moroccan rugs, ceramics, leather goods, and zellige directly from artisans in Morocco.",
      keywords: "moroccan rug, berber carpet, zellige tile, moroccan crafts, fez leather, marrakech artisan, buy direct morocco, amana shipping, cod morocco"
    },
    fr: {
      titlePlain: "Afus - Achetez des produits artisanaux marocains authentiques, faits main et uniques",
      description: "Acheter sur Afus. Trouvez des tapis marocains, des céramiques, du cuir et des zelliges faits main directement par les artisans du Maroc.",
      keywords: "tapis marocain, tapis berbere, zellige marocain, artisanat marocain, cuir de fes, artisan marrakech, achat direct maroc, livraison amana, paiement a la livraison"
    },
    ar: {
      titlePlain: "Afus - تسوق منتجات يدوية مغربية أصلية وفريدة من نوعها",
      description: "تسوق على Afus. اعثر على السجاد المغربي والسيراميك والجلديات والزليج المصنوع يدويًا مباشرة من الحرفيين في المغرب.",
      keywords: "سجاد مغربي, سجاد بربري, زليج مغربي, صناعة تقليدية, جلد فاس, حرفي مراكش, شراء مباشر المغرب, شحن أمانة, الدفع عند الاستلام"
    },
    tz: {
      titlePlain: "Afus - ⵙⵖ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵉⴼⴰⵙⵙⵏ ⵜⵉⵎⵖⵔⵉⴱⵉⵢⵉⵏ ⵜⵉⵎⴰⵢⵏⵓⵜⵉⵏ",
      description: "ⵙⵖ ⴳ Afus. ⴰⴼ ⴷ ⵉⵥⵕⴱⴰⵢ, ⵉⵇⵇⵛⴰⴱⵏ, ⴰⴳⵍⵉⵎ ⴷ ⵣⵣⵍⵍⵉⵊ ⵙⴳ ⵉⵎⴳⵓⵔⵉⵢⵏ ⴳ ⵍⵎⵖⵔⵉⴱ.",
      keywords: "ⵉⵎⴳⵓⵔⵉⵢⵏ, ⵉⵥⵕⴱⴰⵢ, ⵣⵣⵍⵍⵉⵊ, ⵜⴰⵎⴳⵓⵔⵉ"
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  return {
    title: t.titlePlain,
    description: t.description,
    keywords: t.keywords,
  };
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  // Hide the landing page for the moment and make the app directly accessible
  /*
  const cookieStore = await cookies();
  const unlocked = cookieStore.get("afus_beta_unlocked")?.value === "true";

  if (!unlocked) {
    return <LandingPage lang={lang} />;
  }
  */

  const rawProducts = await fetchProducts();
  const allShops = await fetchShops();

  const products = optimizeProducts(rawProducts);
  const shops = optimizeShops(allShops);

  // Compute trails on server to avoid massive RSC payloads
  const newProducts = [...products]
    .filter(p => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(p.id)))
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 8);

  const under100Products = [...products]
    .filter(p => {
       const activePrice = (p.sale_price_mad !== null && p.sale_price_mad !== undefined && (!p.sale_expires_at || new Date(p.sale_expires_at) > new Date())) 
           ? p.sale_price_mad 
           : p.base_price_mad;
       return activePrice > 0 && activePrice < 100;
    })
    .slice(0, 10);

  const freeShippingProducts = [...products]
    .filter(p => p.metadata?.free_shipping === true)
    .slice(0, 10);

  const categoryMap: Record<string, any[]> = {};
  products.forEach(p => {
    const catId = p.category_id;
    if (!catId) return;
    if (!categoryMap[catId]) categoryMap[catId] = [];
    if (categoryMap[catId].length < 8 && p.media_gallery?.[0] && !p.media_gallery[0].includes('1579783900882-c0d3dad7b119')) {
      categoryMap[catId].push(p);
    }
  });

  const headersList = await headers();
  const ipCity = headersList.get('x-vercel-ip-city');
  const ipLat = headersList.get('x-vercel-ip-latitude');
  const ipLon = headersList.get('x-vercel-ip-longitude');

  const cityProductsCount: Record<string, number> = {};
  for (const p of products) {
    const shop = shops.find(s => s.id === p.shop_id);
    if (shop && shop.merchant_city) {
      const c = shop.merchant_city.toLowerCase();
      const matchedCity = MOROCCAN_CITIES.find(mc => c.includes(mc.name.toLowerCase()));
      if (matchedCity) {
        cityProductsCount[matchedCity.name] = (cityProductsCount[matchedCity.name] || 0) + 1;
      }
    }
  }

  const validCities = new Set(
    MOROCCAN_CITIES.filter(c => (cityProductsCount[c.name] || 0) >= 5).map(c => c.name)
  );

  let targetCity = "";
  if (ipCity) {
    const matchedCity = MOROCCAN_CITIES.find(c => c.name.toLowerCase() === ipCity.toLowerCase());
    if (matchedCity && validCities.has(matchedCity.name)) {
      targetCity = matchedCity.name;
    } else if (ipLat && ipLon) {
      targetCity = findClosestCityWithProducts(parseFloat(ipLat), parseFloat(ipLon), validCities);
    }
  }

  // Use a fallback if still empty and we have valid cities
  if (!targetCity && validCities.size > 0) {
    targetCity = "Marrakech"; // typical fallback
    if (!validCities.has(targetCity)) {
       targetCity = Array.from(validCities)[0];
    }
  }

  const geoProducts = targetCity ? products.filter(p => {
    const shop = shops.find(s => s.id === p.shop_id);
    return shop?.merchant_city?.toLowerCase().includes(targetCity.toLowerCase());
  }).slice(0, 8) : [];

  const summerKeywords = APP_COLLECTIONS["summer-2026"].keywords.map(k => k.toLowerCase());
  const summerProducts = products.filter(p => {
    const titleEn = p.title_translations?.en?.toLowerCase() || '';
    const titleFr = p.title_translations?.fr?.toLowerCase() || '';
    return summerKeywords.some(k => titleEn.includes(k) || titleFr.includes(k));
  }).slice(0, 8);

  // Trilingual hero translation strings
  const pageLabels: Record<string, Record<string, string>> = {
    en: {
      heroTitle: "Discover Handcrafted Moroccan Treasures.",
      heroSubtitle: "Buy direct from traditional artisans in Marrakech, Fez, and Sale. Pay cash on delivery via national Al Barid Bank Amana network.",
    },
    fr: {
      heroTitle: "Découvrez les trésors artisanaux du Maroc.",
      heroSubtitle: "Achetez directement auprès d'artisans traditionnels de Marrakech, Fès et Salé. Payez à la livraison par le réseau national Amana.",
    },
    ar: {
      heroTitle: "اكتشف الكنوز الحرفية المغربية.",
      heroSubtitle: "اشترِ مباشرة من الحرفيين التقليديين في مراكش وفاس وسلا. الدفع عند الاستلام عبر شبكة أمانة الوطنية لبريد المغرب.",
    }
  };

  const t = pageLabels[lang] || pageLabels.en;

  const schemaDescription = {
    en: "Buy handmade Moroccan rugs, ceramics, leather goods, and zellige tiles directly from Marrakech, Fez, and Rabat artisans. Secure Cash on Delivery (COD) shipping.",
    fr: "Achetez des tapis berbères, céramiques, articles en cuir et zelliges faits main directement aux artisans de Marrakech, Fès et Rabat. Paiement à la livraison sécurisé via Amana.",
    ar: "اشترِ السجاد المغربي، السيراميك، المنتجات الجلدية، والزليج المصنوع يدويًا مباشرة من حرفيي مراكش، فاس، والرباط. دفع آمن عند الاستلام مع شحن أمانة.",
    tz: "ⴰⴼ ⴷ ⵥⵕ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵉⴼⴰⵙⵙⵏ ⵙⴳ ⵉⵎⴳⵓⵔⵉⵢⵏ ⵉⵎⵖⵔⵉⴱⵉⵢⵏ ⵙ ⵓⴼⵓⵙ."
  }[lang] || "Buy handmade Moroccan rugs, ceramics, leather goods, and zellige tiles directly from Marrakech, Fez, and Rabat artisans. Secure Cash on Delivery (COD) shipping.";

  return (
    <MainLayout params={params}>

      <div className="space-y-8 md:space-y-16">
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "afus",
              "url": `https://afus.ma/${lang}`,
              "description": schemaDescription,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `https://afus.ma/${lang}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "afus",
              "url": `https://afus.ma/${lang}`,
              "logo": "https://afus.ma/icon.png",
              "sameAs": [
                "https://www.instagram.com/afus.marketplace",
                "https://www.facebook.com/afus.marketplace"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": "support@afus.ma"
              }
            }
          ])
        }}
      />
      {/* Editorial Hero Banner / Carousel — breaks out of main padding to go full-width */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <HomeCarousel lang={lang} />
      </div>

      {/* Categories block */}
      <div className="!mt-8 md:!mt-12">
        <BrowseByCategory lang={lang} />
      </div>

      {/* Dynamic Trails & FAQ section */}
      <div className="!mt-10 md:!mt-14">
        <DynamicTrailsClient 
        newProducts={newProducts} 
        under100Products={under100Products} 
        freeShippingProducts={freeShippingProducts} 
        categoryMap={categoryMap} 
        shops={shops} 
        lang={lang} 
        geoProducts={geoProducts}
        targetCity={targetCity}
        summerProducts={summerProducts}
      />
      </div>

      {/* Trust Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <TrustBanner lang={lang} />
      </div>
      </div>
    </MainLayout>
  );
}
