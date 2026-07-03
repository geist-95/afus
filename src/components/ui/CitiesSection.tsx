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
    description: {
      en: "The Red City, home to souks, dyers, weavers and centuries of artisan tradition.",
      fr: "La Ville Rouge, berceau des souks, des teinturiers, des tisserands et de siècles de tradition artisanale.",
      ar: "المدينة الحمراء، موطن الأسواق والصباغين والنساجين وقرون من التراث الحرفي.",
    },
    image: "/cities-2/marrakesh.avif",
    bg: "#2a0a1e",
    textColor: "#f5deb3",
  },
  {
    slug: "fes",
    name: "Fès",
    names: { en: "Fez", fr: "Fès", ar: "فاس", tz: "ⴼⴰⵙ" },
    tifinagh: "ⴼⴰⵙ",
    description: {
      en: "The spiritual capital, famous for its leather tanneries, zellige tilework and intricate woodcarving.",
      fr: "La capitale spirituelle, célèbre pour ses tanneries, le zellige et la marqueterie en bois.",
      ar: "العاصمة الروحية، شهيرة بمدابغها وفسيفساء الزليج ونقوشها الخشبية الرقيقة.",
    },
    image: "/cities-2/fes.jpg",
    bg: "#0d1f2d",
    textColor: "#c9e0f0",
  },
  {
    slug: "meknes",
    name: "Meknès",
    names: { en: "Meknes", fr: "Meknès", ar: "مكناس", tz: "ⵎⴽⵏⴰⵙ" },
    tifinagh: "ⵎⴽⵏⴰⵙ",
    description: {
      en: "City of a hundred minarets, celebrated for ironwork, embroidery and fine Moroccan pottery.",
      fr: "Ville aux cent minarets, réputée pour sa ferronnerie, ses broderies et sa belle poterie marocaine.",
      ar: "مدينة المائة مئذنة، مشهورة بأعمال الحديد والتطريز والفخار المغربي الرفيع.",
    },
    image: "/cities-2/meknes-2.jpg",
    bg: "#1e0a2e",
    textColor: "#e8d5f0",
  },
  {
    slug: "rabat",
    name: "Rabat",
    names: { en: "Rabat", fr: "Rabat", ar: "الرباط", tz: "ⵕⴱⴰⵟ" },
    tifinagh: "ⵕⴱⴰⵟ",
    description: {
      en: "The royal capital, a UNESCO Heritage city known for its carpets, pottery and traditional crafts.",
      fr: "La capitale royale, classée au patrimoine de l'UNESCO pour ses tapis, poteries et artisanat traditionnel.",
      ar: "العاصمة الملكية، مدينة تراث اليونسكو المشهورة بسجادها وفخارها وحرفها التقليدية.",
    },
    image: "/cities-2/rabat.jpg",
    bg: "#0a1a0e",
    textColor: "#c5e8cc",
  },
  {
    slug: "tetouan",
    name: "Tétouan",
    names: { en: "Tetouan", fr: "Tétouan", ar: "تطوان", tz: "ⵟⵉⵟⵡⴰⵏ" },
    tifinagh: "ⵟⵉⵟⵡⴰⵏ",
    description: {
      en: "The White Dove, a UNESCO medina celebrated for Andalusian-Moroccan crafts, textiles and music.",
      fr: "La Colombe Blanche, médina classée à l'UNESCO, célébrée pour ses artisanats andalou-marocains, textiles et musique.",
      ar: "الحمامة البيضاء، مدينة عتيقة في قائمة اليونسكو مشهورة بحرف أندلسية-مغربية، نسيج وموسيقى.",
    },
    image: "/cities-2/hamama.jpg",
    bg: "#1a1200",
    textColor: "#f5e6b0",
  },
  {
    slug: "casablanca",
    name: "Casablanca",
    names: { en: "Casablanca", fr: "Casablanca", ar: "الدار البيضاء", tz: "ⴰⵏⴼⴰ" },
    tifinagh: "ⴰⵏⴼⴰ",
    description: {
      en: "The economic heart of Morocco, blending modern architecture with Art Deco heritage.",
      fr: "Le cœur économique du Maroc, alliant architecture moderne et héritage Art Déco.",
      ar: "القلب الاقتصادي للمغرب، يمزج بين الهندسة المعمارية الحديثة وتراث الآرت ديكو.",
    },
    image: "/cities-2/casablanca.jpg",
    bg: "#0f172a",
    textColor: "#e2e8f0",
  },
  {
    slug: "tangier",
    name: "Tangier",
    names: { en: "Tangier", fr: "Tanger", ar: "طنجة", tz: "ⵟⴰⵏⵊⴰ" },
    tifinagh: "ⵟⴰⵏⵊⴰ",
    description: {
      en: "The gateway between Africa and Europe, a melting pot of cultures and historic medina.",
      fr: "La porte entre l'Afrique et l'Europe, un creuset de cultures et une médina historique.",
      ar: "بوابة بين أفريقيا وأوروبا، بوتقة تنصهر فيها الثقافات والمدينة التاريخية.",
    },
    image: "/cities-2/tangier.jpg",
    bg: "#1e3a8a",
    textColor: "#bfdbfe",
  },
  {
    slug: "agadir",
    name: "Agadir",
    names: { en: "Agadir", fr: "Agadir", ar: "أكادير", tz: "ⴰⴳⴰⴷⵉⵔ" },
    tifinagh: "ⴰⴳⴰⴷⵉⵔ",
    description: {
      en: "The sunny capital of Souss, known for its beautiful beaches and Amazigh culture.",
      fr: "La capitale ensoleillée du Souss, connue pour ses belles plages et sa culture amazighe.",
      ar: "عاصمة سوس المشمسة، معروفة بشواطئها الجميلة والثقافة الأمازيغية.",
    },
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

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0 scroll-pl-4 sm:scroll-pl-0 scroll-smooth after:content-[''] after:w-px after:shrink-0">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/${lang}/city/${city.slug}`}
            className="flex-shrink-0 snap-start w-[85vw] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.6px)] group"
          >
            <div
              className="relative w-full arabic-frame overflow-hidden min-h-[120px] md:min-h-[140px] flex flex-row transition-transform duration-300 group-hover:scale-[0.98]"
              style={{ backgroundColor: city.bg }}
            >
              {/* Left: solid bg + text */}
              <div className="flex-1 flex flex-col justify-center px-4 md:px-6 py-4 z-10 w-2/3">
                <p
                  className="mb-1 text-sm md:text-base"
                  style={{ color: city.textColor, fontFamily: "'Noto Sans Tifinagh', sans-serif", opacity: 0.8 }}
                >
                  {city.tifinagh}
                </p>
                <h3
                  className="text-2xl md:text-3xl font-bold !font-ariom leading-tight"
                  style={{ color: city.textColor }}
                >
                  {city.names[lang as 'en'|'fr'|'ar'|'tz'] || city.name}
                </h3>
              </div>

              {/* Right: image */}
              <div className="relative w-1/3 flex-shrink-0">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover banner-img"
                  sizes="(max-width: 768px) 33vw, 20vw"
                  quality={80}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
