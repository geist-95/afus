import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ lang: string }> | { lang: string };
}

const CITIES = [
  {
    slug: "marrakech",
    name: "Marrakech",
    tifinagh: "ⵎⵕⵕⴰⴽⵛ",
    image: "/cities-2/marrakesh.avif",
    color: "#2a0a1e",
    textColor: "#f5deb3",
    description: {
      en: "The Red City, home to souks, dyers, weavers and centuries of artisan tradition.",
      fr: "La Ville Rouge, berceau des souks, des teinturiers, des tisserands et de siècles de tradition artisanale.",
      ar: "المدينة الحمراء، موطن الأسواق والصباغين والنساجين وقرون من التراث الحرفي.",
    },
  },
  {
    slug: "fes",
    name: "Fès",
    tifinagh: "ⴼⴰⵙ",
    image: "/cities-2/fes.jpg",
    color: "#0d1f2d",
    textColor: "#c9e0f0",
    description: {
      en: "The spiritual capital, famous for its leather tanneries, zellige tilework and intricate woodcarving.",
      fr: "La capitale spirituelle, célèbre pour ses tanneries, le zellige et la marqueterie en bois.",
      ar: "العاصمة الروحية، شهيرة بمدابغها وفسيفساء الزليج ونقوشها الخشبية الرقيقة.",
    },
  },
  {
    slug: "meknes",
    name: "Meknès",
    tifinagh: "ⵎⴽⵏⴰⵙ",
    image: "/cities-2/meknes-2.jpg",
    color: "#1e0a2e",
    textColor: "#e8d5f0",
    description: {
      en: "City of a hundred minarets, celebrated for ironwork, embroidery and fine Moroccan pottery.",
      fr: "Ville aux cent minarets, réputée pour sa ferronnerie, ses broderies et sa belle poterie marocaine.",
      ar: "مدينة المائة مئذنة، مشهورة بأعمال الحديد والتطريز والفخار المغربي الرفيع.",
    },
  },
  {
    slug: "rabat",
    name: "Rabat",
    tifinagh: "ⵕⴱⴰⵟ",
    image: "/cities-2/rabat.jpg",
    color: "#0a1a0e",
    textColor: "#c5e8cc",
    description: {
      en: "The royal capital, a UNESCO Heritage city known for its carpets, pottery and traditional crafts.",
      fr: "La capitale royale, classée au patrimoine de l'UNESCO pour ses tapis, poteries et artisanat traditionnel.",
      ar: "العاصمة الملكية، مدينة تراث اليونسكو المشهورة بسجادها وفخارها وحرفها التقليدية.",
    },
  },
  {
    slug: "tetouan",
    name: "Tétouan",
    tifinagh: "ⵟⵉⵟⵡⴰⵏ",
    image: "/cities-2/hamama.jpg",
    color: "#1a1200",
    textColor: "#f5e6b0",
    description: {
      en: "The White Dove, a UNESCO medina celebrated for Andalusian-Moroccan crafts, textiles and music.",
      fr: "La Colombe Blanche, médina classée à l'UNESCO, célébrée pour ses artisanats andalou-marocains, textiles et musique.",
      ar: "الحمامة البيضاء، مدينة عتيقة في قائمة اليونسكو مشهورة بحرف أندلسية-مغربية، نسيج وموسيقى.",
    },
  },
];

export default async function CitiesPage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href={`/${lang}`} className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">Cities</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-5xl font-bold !font-ariom !text-black">Discover wonders from cities</h1>
        <p className="mt-2 text-neutral-500 text-sm md:text-base max-w-xl">
          Explore Morocco's finest artisan cities and their centuries-old craft traditions.
        </p>
      </div>

      {/* Cities grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CITIES.map((city) => {
          const desc = city.description[lang as keyof typeof city.description] ?? city.description.en;
          return (
            <Link
              key={city.slug}
              href={`/${lang}/city/${city.slug}`}
              className="group block"
            >
              <div
                className="relative arabic-frame overflow-hidden flex flex-row min-h-[160px]"
                style={{ backgroundColor: city.color }}
              >
                {/* Text */}
                <div className="flex-1 flex flex-col justify-center px-6 py-6 z-10">
                  <p
                    className="text-base mb-1"
                    style={{ color: city.textColor, fontFamily: "'Noto Sans Tifinagh', sans-serif", opacity: 0.75 }}
                  >
                    {city.tifinagh}
                  </p>
                  <h2
                    className="text-2xl font-bold !font-ariom leading-tight"
                    style={{ color: city.textColor }}
                  >
                    {city.name}
                  </h2>
                  <p
                    className="mt-2 text-xs leading-relaxed line-clamp-2"
                    style={{ color: city.textColor, opacity: 0.8 }}
                  >
                    {desc}
                  </p>
                </div>

                {/* Image */}
                <div className="relative w-[42%] flex-shrink-0 overflow-hidden">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover banner-img group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 42vw, (max-width: 1024px) 28vw, 20vw"
                    quality={85}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
