import Link from "next/link";
import type { Metadata } from "next";
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { fetchProducts, fetchShops } from "@/lib/supabase";
import DynamicTrailsClient from "@/components/ui/DynamicTrailsClient";
import HomeCarousel from "@/components/ui/HomeCarousel";
import BrowseByCategory from "@/components/ui/BrowseByCategory";
import CitiesSection from "@/components/ui/CitiesSection";
import TrustBanner from "@/components/ui/TrustBanner";

interface PageProps {
  params: Promise<{ lang: string }> | { lang: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  const translations = {
    en: {
      titlePlain: "Authentic Moroccan Artisan Marketplace",
      description: "Buy handmade Moroccan rugs, ceramics, leather goods, and zellige tiles directly from Marrakech, Fez, and Rabat artisans. Secure Cash on Delivery (COD) shipping.",
      keywords: "moroccan rug, berber carpet, zellige tile, moroccan crafts, fez leather, marrakech artisan, buy direct morocco, amana shipping, cod morocco"
    },
    fr: {
      titlePlain: "Marché Artisanal Marocain Authentique",
      description: "Achetez des tapis berbères, céramiques, articles en cuir et zelliges faits main directement aux artisans de Marrakech, Fès et Rabat. Paiement à la livraison sécurisé via Amana.",
      keywords: "tapis marocain, tapis berbere, zellige marocain, artisanat marocain, cuir de fes, artisan marrakech, achat direct maroc, livraison amana, paiement a la livraison"
    },
    ar: {
      titlePlain: "سوق الحرف اليدوية المغربية الأصيلة",
      description: "اشترِ السجاد المغربي، السيراميك، المنتجات الجلدية، والزليج المصنوع يدويًا مباشرة من حرفيي مراكش، فاس، والرباط. دفع آمن عند الاستلام مع شحن أمانة.",
      keywords: "سجاد مغربي, سجاد بربري, زليج مغربي, صناعة تقليدية, جلد فاس, حرفي مراكش, شراء مباشر المغرب, شحن أمانة, الدفع عند الاستلام"
    },
    tz: {
      titlePlain: "ⴰⴷⵖⴰⵔ ⵏ ⵜⵎⴳⵓⵔⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ",
      description: "ⴰⴼ ⴷ ⵥⵕ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵉⴼⴰⵙⵙⵏ ⵙⴳ ⵉⵎⴳⵓⵔⵉⵢⵏ ⵉⵎⵖⵔⵉⴱⵉⵢⵏ ⵙ ⵓⴼⵓⵙ.",
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

  const products = await fetchProducts();
  const shops = await fetchShops();

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
    <div className="space-y-16">
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

      {/* Browse by Category */}
      <BrowseByCategory lang={lang} />

      {/* Cities */}
      <CitiesSection lang={lang} />

      {/* Dynamic Trails & FAQ section */}
      <DynamicTrailsClient products={products} shops={shops} lang={lang} />

      {/* Trust Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <TrustBanner lang={lang} />
      </div>
    </div>
  );
}
