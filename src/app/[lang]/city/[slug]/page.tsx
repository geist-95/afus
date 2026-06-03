import Image from "next/image";
import Link from "next/link";
import { fetchProducts, fetchShops } from "@/lib/supabase";
import { notFound } from "next/navigation";

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
    image: "/cities-2/tetouan.jpg",
    color: "#1a1200",
    textColor: "#f5e6b0",
  },
};

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
      {/* Hero */}
      <div
        className="relative w-full rounded-3xl overflow-hidden min-h-[340px] flex items-end arabic-frame"
        style={{ backgroundColor: city.color }}
      >
        <Image
          src={city.image}
          alt={city.name}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 px-10 pb-12 pt-32">
          <h1
            className="text-5xl md:text-7xl font-bold !font-ariom"
            style={{ color: city.textColor }}
          >
            {city.name}
          </h1>
          <p
            className="mt-2 text-2xl md:text-3xl"
            style={{ color: city.textColor, fontFamily: "'Noto Sans Tifinagh', sans-serif", opacity: 0.8 }}
          >
            {city.tifinagh}
          </p>
          <p className="mt-4 max-w-2xl text-base md:text-lg" style={{ color: city.textColor, opacity: 0.85 }}>
            {desc}
          </p>
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
              const title =
                product.title_translations?.[lang] ||
                product.title_translations?.en ||
                "Artisan product";
              const price = product.base_price_mad;
              const img = product.media_gallery?.[0];
              const numId = product.numeric_id;
              const slug_ =
                product.slug_translations?.[lang] ||
                product.slug_translations?.en ||
                "product";
              return (
                <Link
                  key={product.id}
                  href={`/${lang}/listing/${numId}/${slug_}`}
                  className="group block"
                >
                  <div className="aspect-square relative overflow-hidden rounded-xl bg-neutral-100 arabic-frame">
                    {img ? (
                      <Image
                        src={img}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-4xl">🧶</div>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-black line-clamp-2">{title}</p>
                  <p className="text-sm font-bold text-primary">{price} MAD</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
