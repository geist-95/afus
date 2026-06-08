'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MOCK_POSTS = [
  {
    id: 1,
    slug: "art-of-moroccan-zellige",
    date: "2024-05-15",
    title: {
      en: "The Art of Moroccan Zellige",
      fr: "L'art du zellige marocain",
      ar: "فن الزليج المغربي",
      tz: "ⵜⴰⵥⵓⵕⵉ ⵏ ⵣⵣⵍⵍⵉⵊ ⴰⵎⵖⵔⵉⴱⵉ"
    },
    excerpt: {
      en: "Discover the intricate geometry and vibrant colors of traditional Moroccan tilework, a centuries-old craft that continues to inspire modern design.",
      fr: "Découvrez la géométrie complexe et les couleurs vibrantes du carrelage traditionnel marocain, un artisanat séculaire qui continue d'inspirer le design moderne.",
      ar: "اكتشف الهندسة المعقدة والألوان النابضة بالحياة للبلاط المغربي التقليدي، وهي حرفة عمرها قرون لا تزال تلهم التصميم الحديث.",
      tz: "ⴰⴼ ⵜⴰⵏⵣⴳⴳⴰⵖⵜ ⵉⵅⴰⵜⵔⵏ ⴷ ⵉⴽⵯⵍⴰⵏ ⵉⴼⴰⵡⵏ ⵏ ⵣⵣⵍⵍⵉⵊ ⴰⵎⵖⵔⵉⴱⵉ ⴰⵇⴱⵓⵔ, ⵢⴰⵜ ⵜⵎⴳⵓⵔⵉ ⵏ ⵉⴳⵉⵎⵉⵏ ⵏ ⵉⵙⴳⴳⵯⴰⵙⵏ ⵍⵍⵉ ⵉⵙⵓⵍⵏ ⴰⵔ ⵜⵙⵙⵎⵔⴰⵙ ⴳ ⵓⵙⵎⵙⴰⵙⴰ ⴰⵜⵔⴰⵔ."
    }
  },
  {
    id: 2,
    slug: "weaving-stories-berber-rugs",
    date: "2024-06-02",
    title: {
      en: "Weaving Stories: The Berber Rugs",
      fr: "Tisser des histoires : Les tapis berbères",
      ar: "نسج القصص: السجاد الأمازيغي",
      tz: "ⴰⵥⵟⵟⴰ ⵏ ⵜⵉⵏⵇⵇⵉⵙⵉⵏ: ⵉⵥⵕⴱⴰⵢ ⵉⵎⴰⵣⵉⵖⵏ"
    },
    excerpt: {
      en: "Every knot tells a story. Explore the rich symbolism and diverse styles of Berber rugs, handwoven by artisans across the Atlas Mountains.",
      fr: "Chaque nœud raconte une histoire. Explorez le riche symbolisme et les divers styles de tapis berbères, tissés à la main par des artisans à travers les montagnes de l'Atlas.",
      ar: "كل عقدة تحكي قصة. استكشف الرمزية الغنية والأنماط المتنوعة للسجاد الأمازيغي، المنسوج يدويًا من قبل الحرفيين عبر جبال الأطلس.",
      tz: "ⴽⵓ ⵜⵉⴽⵔⵙⵜ ⴰⵔ ⵜⵙⴰⵡⴰⵍ ⵢⴰⵜ ⵜⵏⵇⵇⵉⵙⵜ. ⵔⵣⵓ ⴳ ⵉⵏⵉⴳⵍⴰⵏ ⵉⵅⴰⵜⵔⵏ ⴷ ⵉⵡⵏⵏⵉⵜⵏ ⵉⵎⵢⴰⵏⴰⵡⵏ ⵏ ⵉⵥⵕⴱⴰⵢ ⵉⵎⴰⵣⵉⵖⵏ, ⵉⵜⵜⵓⵥⴹⴰⵏ ⵙ ⵓⴼⵓⵙ ⵙⴳ ⵉⵎⴳⵓⵔⵉⵢⵏ ⴳ ⵉⴷⵔⴰⵔⵏ ⵏ ⵡⴰⵟⵍⴰⵙ."
    }
  }
];

export default function HomeBlogSection({ lang }: { lang: string }) {
  const pathname = usePathname();
  
  // Only show on home page
  if (pathname !== `/${lang}` && pathname !== `/${lang}/`) {
    return null;
  }

  const t = {
    en: { title: "From the Journal", desc: "Discover stories behind the craftsmanship.", viewAll: "View all articles →", readArticle: "Read Article" },
    fr: { title: "Du Journal", desc: "Découvrez les histoires derrière l'artisanat.", viewAll: "Voir tous les articles →", readArticle: "Lire l'article" },
    ar: { title: "من اليوميات", desc: "اكتشف القصص وراء الحرف اليدوية.", viewAll: "عرض جميع المقالات ←", readArticle: "اقرأ المقال" },
    tz: { title: "ⵙⴳ ⵓⵖⵎⵉⵙ", desc: "ⴰⴼ ⵜⵉⵏⵇⵇⵉⵙⵉⵏ ⵏ ⵜⵉⴳⴰⵡⵉⵏ ⵏ ⵓⴼⵓⵙ.", viewAll: "ⵥⵕ ⴰⴽⴽⵯ ⵉⵎⴳⵔⴰⴷⵏ →", readArticle: "ⵖⵔ ⴰⵎⴳⵔⴰⴷ" }
  }[lang] || { title: "From the Journal", desc: "Discover stories behind the craftsmanship.", viewAll: "View all articles →", readArticle: "Read Article" };

  return (
    <div className="w-full relative z-0 overflow-hidden mt-12">
      <div className="w-full bg-[#1D0D2C] text-white py-3 flex overflow-hidden whitespace-nowrap border-b border-black/5">
        <div className="flex animate-marquee items-center text-sm md:text-base font-bold tracking-[0.2em] opacity-90">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="mx-6 font-ariom font-normal text-lg mt-1 tracking-normal">afus</span>
              <span className="text-[#C495E5] text-xs">✦</span>
              <span className="mx-6 text-lg font-normal font-tifinagh mt-1">ⴰⴼⵓⵙ</span>
              <span className="text-[#C495E5] text-xs">✦</span>
              <span className="mx-6 text-lg font-normal mt-1">أفوس</span>
              <span className="text-[#C495E5] text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-start !text-black mb-2">{t.title}</h2>
            <p className="text-sm text-neutral-600 leading-relaxed pt-2">{t.desc}</p>
          </div>
          <Link href={`/${lang}/blog`} className="hidden md:inline-flex items-center gap-2 text-sm font-medium hover:underline text-[#2a0a1e]">
            {t.viewAll}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_POSTS.map((post) => (
            <Link href={`/${lang}/blog/${post.slug}`} key={post.id} className="group h-full hover:shadow-xl transition-shadow duration-300 arabic-frame bg-neutral-300 p-[1px]">
              <div className="flex flex-col h-full bg-white arabic-frame overflow-hidden">
                <div className="relative h-60 w-full overflow-hidden bg-neutral-200 arabic-frame flex items-center justify-center">
                  <span className="text-neutral-400">Placeholder Image</span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-neutral-400 mb-3">{post.date}</div>
                  <h3 className="text-2xl font-bold !font-ariom mb-3 group-hover:text-[#2a0a1e] transition-colors">{(post.title as any)[lang] || post.title.en}</h3>
                  <p className="text-neutral-600 text-sm line-clamp-3 mb-6 flex-grow">{(post.excerpt as any)[lang] || post.excerpt.en}</p>
                  <div className="text-sm font-medium text-[#2a0a1e] mt-auto flex items-center gap-2">
                    {t.readArticle}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-sm font-medium hover:underline text-[#2a0a1e]">
            {t.viewAll}
          </Link>
        </div>
      </div>
    </div>
  );
}
