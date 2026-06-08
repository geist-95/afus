'use client';

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const cities = [
  {
    slug: "marrakech",
    name: "Marrakech",
    names: { en: "Marrakech", fr: "Marrakech", ar: "مراكش", tz: "ⵎⵕⵕⴰⴽⵛ" },
    tifinagh: "ⵎⵕⵕⴰⴽⵛ",
    image: "/cities-2/marrakesh.avif",
    bg: "#2a0a1e",
    textColor: "#f5deb3",
  },
  {
    slug: "fes",
    name: "Fès",
    names: { en: "Fez", fr: "Fès", ar: "فاس", tz: "ⴼⴰⵙ" },
    tifinagh: "ⴼⴰⵙ",
    image: "/cities-2/fes.jpg",
    bg: "#0d1f2d",
    textColor: "#c9e0f0",
  },
  {
    slug: "meknes",
    name: "Meknès",
    names: { en: "Meknes", fr: "Meknès", ar: "مكناس", tz: "ⵎⴽⵏⴰⵙ" },
    tifinagh: "ⵎⴽⵏⴰⵙ",
    image: "/cities-2/meknes-2.jpg",
    bg: "#1e0a2e",
    textColor: "#e8d5f0",
  },
  {
    slug: "rabat",
    name: "Rabat",
    names: { en: "Rabat", fr: "Rabat", ar: "الرباط", tz: "ⵕⴱⴰⵟ" },
    tifinagh: "ⵕⴱⴰⵟ",
    image: "/cities-2/rabat.jpg",
    bg: "#0a1a0e",
    textColor: "#c5e8cc",
  },
  {
    slug: "tetouan",
    name: "Tétouan",
    names: { en: "Tetouan", fr: "Tétouan", ar: "تطوان", tz: "ⵟⵉⵟⵡⴰⵏ" },
    tifinagh: "ⵟⵉⵟⵡⴰⵏ",
    image: "/cities-2/hamama.jpg",
    bg: "#1a1200",
    textColor: "#f5e6b0",
  },
  {
    slug: "casablanca",
    name: "Casablanca",
    names: { en: "Casablanca", fr: "Casablanca", ar: "الدار البيضاء", tz: "ⴰⵏⴼⴰ" },
    tifinagh: "ⴰⵏⴼⴰ",
    image: "/cities-2/casablanca.jpg",
    bg: "#0f172a",
    textColor: "#e2e8f0",
  },
  {
    slug: "tangier",
    name: "Tangier",
    names: { en: "Tangier", fr: "Tanger", ar: "طنجة", tz: "ⵟⴰⵏⵊⴰ" },
    tifinagh: "ⵟⴰⵏⵊⴰ",
    image: "/cities-2/tangier.jpg",
    bg: "#1e3a8a",
    textColor: "#bfdbfe",
  },
  {
    slug: "agadir",
    name: "Agadir",
    names: { en: "Agadir", fr: "Agadir", ar: "أكادير", tz: "ⴰⴳⴰⴷⵉⵔ" },
    tifinagh: "ⴰⴳⴰⴷⵉⵔ",
    image: "/cities-2/agadir.jpg",
    bg: "#451a03",
    textColor: "#fef3c7",
  },
];

export default function CitiesSection({ lang }: { lang: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const titles: Record<string, string> = {
    en: "Discover wonders from cities",
    fr: "Découvrez les merveilles des villes",
    ar: "اكتشف عجائب المدن",
    tz: "ⴰⴼ ⵉⴷⵖⴰⵔⵏ ⵙⴳ ⵜⵉⵖⵔⵎⵉⵏ"
  };
  const title = titles[lang] || titles.en;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-4 md:mb-[30px]">
        <h2 className="text-xl md:text-3xl font-bold text-start !text-black">{title}</h2>
        <div className="flex items-center gap-2 hidden sm:flex" dir="ltr">
          <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/${lang}/city/${city.slug}`}
            className="flex-shrink-0 snap-start w-44 md:w-56 lg:w-[calc(20%-12.8px)] group"
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
                  {city.names[lang as 'en' | 'fr' | 'ar' | 'tz'] || city.name}
                </span>
                {lang !== 'tz' && (
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
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
