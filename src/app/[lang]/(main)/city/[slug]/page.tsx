import Image from "next/image";
import Link from "next/link";
import { fetchProducts, fetchShops } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { SimpleProductCard } from "@/components/ui/ProductGrid";

interface PageProps {
  params: Promise<{ lang: string; slug: string }> | { lang: string; slug: string };
}

const CITIES: Record<string, {
  name: string;
  tifinagh: string;
  description: { en: string; fr: string; ar: string };
  image: string;
  color: string;
  textColor: string;
}> = {
  marrakech: {
    name: "Marrakech",
    tifinagh: "ⵎⵕⵕⴰⴽⵛ",
    description: {
      en: "The Red City, home to souks, dyers, weavers and centuries of artisan tradition.",
      fr: "La Ville Rouge, berceau des souks, des teinturiers, des tisserands et de siècles de tradition artisanale.",
      ar: "المدينة الحمراء، موطن الأسواق والصباغين والنساجين وقرون من التراث الحرفي.",
    },
    image: "/cities-2/marrakesh.avif",
    color: "#2a0a1e",
    textColor: "#f5deb3",
  },
  fes: {
    name: "Fès",
    tifinagh: "ⴼⴰⵙ",
    description: {
      en: "The spiritual capital, famous for its leather tanneries, zellige tilework and intricate woodcarving.",
      fr: "La capitale spirituelle, célèbre pour ses tanneries, le zellige et la marqueterie en bois.",
      ar: "العاصمة الروحية، شهيرة بمدابغها وفسيفساء الزليج ونقوشها الخشبية الرقيقة.",
    },
    image: "/cities-2/fes.jpg",
    color: "#0d1f2d",
    textColor: "#c9e0f0",
  },
  meknes: {
    name: "Meknès",
    tifinagh: "ⵎⴽⵏⴰⵙ",
    description: {
      en: "City of a hundred minarets, celebrated for ironwork, embroidery and fine Moroccan pottery.",
      fr: "Ville aux cent minarets, réputée pour sa ferronnerie, ses broderies et sa belle poterie marocaine.",
      ar: "مدينة المائة مئذنة، مشهورة بأعمال الحديد والتطريز والفخار المغربي الرفيع.",
    },
    image: "/cities-2/meknes-2.jpg",
    color: "#1e0a2e",
    textColor: "#e8d5f0",
  },
  rabat: {
    name: "Rabat",
    tifinagh: "ⵕⴱⴰⵟ",
    description: {
      en: "The royal capital, a UNESCO Heritage city known for its carpets, pottery and traditional crafts.",
      fr: "La capitale royale, classée au patrimoine de l'UNESCO pour ses tapis, poteries et artisanat traditionnel.",
      ar: "العاصمة الملكية، مدينة تراث اليونسكو المشهورة بسجادها وفخارها وحرفها التقليدية.",
    },
    image: "/cities-2/rabat.jpg",
    color: "#0a1a0e",
    textColor: "#c5e8cc",
  },
  tetouan: {
    name: "Tétouan",
    tifinagh: "ⵟⵉⵟⵡⴰⵏ",
    description: {
      en: "The White Dove, a UNESCO medina celebrated for Andalusian-Moroccan crafts, textiles and music.",
      fr: "La Colombe Blanche, médina classée à l'UNESCO, célébrée pour ses artisanats andalou-marocains, textiles et musique.",
      ar: "الحمامة البيضاء، مدينة عتيقة في قائمة اليونسكو مشهورة بحرف أندلسية-مغربية، نسيج وموسيقى.",
    },
    image: "/cities-2/hamama.jpg",
    color: "#1a1200",
    textColor: "#f5e6b0",
  },
};

import type { Metadata } from "next";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";
  const slug = resolvedParams?.slug;

  const city = CITIES[slug as keyof typeof CITIES];
  if (!city) {
    return {
      title: "City Not Found",
    };
  }

  const desc = city.description[lang as keyof typeof city.description] ?? city.description.en;

  const keywordsMap: Record<string, string> = {
    marrakech: "Marrakech artisans, Marrakech souks, handcrafted items Marrakech, moroccan carpet Marrakech, geo optimized",
    fes: "Fez leather, Chouara tanneries Fez, Fez zellige tiles, traditional crafts Fez, geo optimized",
    meknes: "Meknes ironwork, Meknes embroidery, Meknes pottery, handcrafted Meknes, geo optimized",
    rabat: "Rabat carpet weaving, Rabat pottery, UNESCO heritage crafts Rabat, geo optimized",
    tetouan: "Tetouan textiles, Andalusian crafts Tetouan, white dove medina crafts, geo optimized"
  };

  const keywords = keywordsMap[slug] || "moroccan artisan city, medina crafts, morocco, geo optimized";

  return {
    title: `${city.name} Artisanal Heritage`,
    description: desc,
    keywords,
  };
}

export default async function CityPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const city = CITIES[slug];

  if (!city) notFound();

  const [allProducts, allShops] = await Promise.all([fetchProducts(), fetchShops()]);
  const desc = city.description[lang as keyof typeof city.description] ?? city.description.en;

  // Filter products/shops by city (best-effort via merchant_city)
  const cityShops = allShops.filter(
    (s: any) => (s.merchant_city ?? "").toLowerCase() === slug.toLowerCase()
  );
  const cityShopIds = new Set(cityShops.map((s: any) => s.id));
  const cityProducts = allProducts.filter((p: any) => cityShopIds.has(p.shop_id));

  // Fallback: show all if nothing found for demo
  const displayProducts = cityProducts.length > 0 ? cityProducts : allProducts.slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href={`/${lang}`} className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${lang}/cities`} className="hover:text-black transition-colors">Cities</Link>
        <span>/</span>
        <span className="text-black font-medium">{city.name}</span>
      </nav>

      {/* Hero */}
      <div
        className="relative w-full arabic-frame overflow-hidden min-h-[220px] md:min-h-[300px] flex flex-row"
        style={{ backgroundColor: city.color }}
      >
        {/* Left: solid bg + text */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-14 py-10 z-10">
          <p
            className="mb-2 text-xl md:text-2xl"
            style={{ color: city.textColor, fontFamily: "'Noto Sans Tifinagh', sans-serif", opacity: 0.8 }}
          >
            {city.tifinagh}
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold !font-ariom leading-tight"
            style={{ color: city.textColor }}
          >
            {city.name}
          </h1>
          <p className="mt-4 max-w-sm text-sm md:text-base" style={{ color: city.textColor, opacity: 0.85 }}>
            {desc}
          </p>
        </div>

        {/* Right: image */}
        <div className="relative w-[45%] md:w-[42%] flex-shrink-0">
          <Image
            src={city.image}
            alt={city.name}
            fill
            className="object-cover banner-img"
            sizes="(max-width: 768px) 45vw, 42vw"
            quality={90}
          />
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6 !text-black">
          Artisan products from {city.name}
        </h2>
        {displayProducts.length === 0 ? (
          <p className="text-neutral-500">No products yet from this city.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayProducts.map((product: any) => {
              const shop = allShops.find((s: any) => s.id === product.shop_id) || allShops[0];
              return <SimpleProductCard key={product.id} product={product} lang={lang} shop={shop} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
