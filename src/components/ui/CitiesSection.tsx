import Image from "next/image";
import Link from "next/link";

const cities = [
  {
    slug: "marrakech",
    name: "Marrakech",
    tifinagh: "ⵎⵕⵕⴰⴽⵛ",
    image: "/cities-2/marrakesh.avif",
    bg: "#2a0a1e",
    textColor: "#f5deb3",
  },
  {
    slug: "fes",
    name: "Fès",
    tifinagh: "ⴼⴰⵙ",
    image: "/cities-2/fes.jpg",
    bg: "#0d1f2d",
    textColor: "#c9e0f0",
  },
  {
    slug: "meknes",
    name: "Meknès",
    tifinagh: "ⵎⴽⵏⴰⵙ",
    image: "/cities-2/meknes-2.jpg",
    bg: "#1e0a2e",
    textColor: "#e8d5f0",
  },
  {
    slug: "rabat",
    name: "Rabat",
    tifinagh: "ⵕⴱⴰⵟ",
    image: "/cities-2/rabat.jpg",
    bg: "#0a1a0e",
    textColor: "#c5e8cc",
  },
  {
    slug: "tetouan",
    name: "Tétouan",
    tifinagh: "ⵟⵉⵟⵡⴰⵏ",
    image: "/cities-2/tetouan.jpg",
    bg: "#1a1200",
    textColor: "#f5e6b0",
  },
];

export default function CitiesSection({ lang }: { lang: string }) {
  return (
    <section>
      <div className="max-w-[100rem] mx-auto px-2 md:px-12 py-2 md:py-8">
      <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-[30px] text-left md:text-center !text-black">Discover wonders from cities</h2>
      <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-5 md:overflow-visible pb-2 md:pb-0">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/${lang}/city/${city.slug}`}
            className="flex-shrink-0 w-44 md:w-auto group"
          >
            <div
              className="relative arabic-frame overflow-hidden aspect-square w-full flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-[0.97]"
              style={{ backgroundColor: city.bg }}
            >
              {/* Background city image */}
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
              />

              {/* Text content */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-2 px-4 text-center">
                <span
                  className="text-xl md:text-2xl lg:text-3xl font-bold !font-ariom leading-tight"
                  style={{ color: city.textColor }}
                >
                  {city.name}
                </span>
                <span
                  className="text-sm md:text-base lg:text-lg leading-none"
                  style={{
                    color: city.textColor,
                    fontFamily: "'Noto Sans Tifinagh', sans-serif",
                    opacity: 0.75,
                  }}
                >
                  {city.tifinagh}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}
