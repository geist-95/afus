'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const FEATURED_POSTS = [
  {
    id: 1,
    slug: "refresh-home-spring-handcrafted-decor",
    date: "2026-06-03",
    image: "/blog/3-ways.png",
    title: {
      en: "3 Ways to Refresh Your Home for Summer with Handcrafted Decor",
      fr: "3 façons de rafraîchir votre maison pour l'été avec de la déco faite main",
      ar: "3 طرق لتجديد منزلك في الصيف بديكور مصنوع يدويًا",
      tz: "3 ⵜⵖⴰⵔⴰⵙⵉⵏ ⴰⴷ ⵜⵙⵎⴰⵢⵏⵓⵜ ⵜⴰⴷⴷⴰⵔⵜ ⵏⵏⴽ ⵉ ⵓⵏⴱⴷⵓ ⵙ ⵓⵙⵎⵙⴰⵙⴰ ⵏ ⵓⴼⵓⵙ"
    },
    excerpt: {
      en: "Welcome the sunny season by incorporating vibrant, breathable hand-woven textiles, cooling ceramics, and natural textures into your living space.",
      fr: "Accueillez la saison estivale en intégrant des textiles tissés à la main respirants, des céramiques rafraîchissantes et des textures naturelles.",
      ar: "استقبل الموسم المشمس بدمج المنسوجات المنسوجة يدويًا القابلة للتنفس، والسيراميك المنعش، والأنسجة الطبيعية في مساحة معيشتك.",
      tz: "ⵙⵏⵓⴱⴳ ⴰⵏⴱⴷⵓ ⵙ ⵓⵙⵉⴷⴼ ⵏ ⵜⵉⵥⵕⴱⴰⵢ ⵉⵜⵜⵓⵥⴹⴰⵏ ⵙ ⵓⴼⵓⵙ, ⵍⵅⵣⴼ, ⴷ ⵜⵖⴰⵔⴰⵙⵉⵏ ⵜⵉⴳⴰⵎⴰⵏⵉⵏ ⴳ ⵓⴷⵖⴰⵔ ⵏⵏⴽ."
    }
  },
  {
    id: 2,
    slug: "andalusian-echoes-tetouan",
    date: "2024-09-05",
    image: "/cities-2/hamama.jpg",
    title: {
      en: "Andalusian Echoes in Tetouan",
      fr: "Échos andalous à Tétouan",
      ar: "أصداء أندلسية في تطوان",
      tz: "ⵜⵉⴷⵉⴽⵍⵜ ⵜⴰⵏⴷⴰⵍⵓⵙⵉⵜ ⴳ ⵟⵉⵟⵡⴰⵏ"
    },
    excerpt: {
      en: "Explore how the 'White Dove' of Morocco preserves the artistic and musical heritage brought by Andalusian refugees centuries ago.",
      fr: "Découvrez comment la « Colombe Blanche » du Maroc préserve le patrimoine artistique et musical apporté par les réfugiés andalous il y a des siècles.",
      ar: "استكشف كيف تحافظ «الحمامة البيضاء» في المغرب على التراث الفني والموسيقي الذي جلبه اللاجئون الأندلسيون قبل قرون.",
      tz: "ⵔⵣⵓ ⵎⴰⵎⴽ ⵜⵙⵙⴼⵔⵖ 'ⵜⵉⵜⴱⵉⵔⵜ ⵜⵓⵎⵍⵉⵍⵜ' ⵏ ⵍⵎⵖⵔⵉⴱ ⵜⴰⵢⵙⵉ ⵜⴰⵥⵓⵕⴰⵏⵜ ⴷ ⵜⵎⵓⵣⵉⵇⵜ ⵏⵏⴰ ⴷ ⵉⵡⵉⵏ ⵉⵎⵣⵡⴰⴳⵏ ⵉⵏⴷⴰⵍⵓⵙⵉⵢⵏ ⴳ ⵉⴳⵉⵎⵉⵏ ⵏ ⵉⵙⴳⴳⵯⴰⵙⵏ."
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
          {FEATURED_POSTS.map((post) => (
            <Link href={`/${lang}/blog/${post.slug}`} key={post.id} className="group h-full hover:shadow-xl transition-shadow duration-300 arabic-frame bg-neutral-300 p-[1px]">
              <div className="flex flex-col h-full bg-white arabic-frame overflow-hidden">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={(post.title as any)[lang] || post.title.en}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
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
