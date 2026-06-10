import Image from "next/image";
import Link from "next/link";

const categories = [
  { label: "Jewelry",     labels: { en: "Jewelry", fr: "Bijoux", ar: "مجوهرات", tz: "ⵜⵉⵣⴱⴳⴰⵏ" },     href: "/category/jewelry",     img: "/categories/jewelry.png" },
  { label: "Art",         labels: { en: "Art", fr: "Art", ar: "فن", tz: "ⵜⴰⵥⵓⵕⵉ" },         href: "/category/art-collectibles",         img: "/categories/11.png"      },
  { label: "Beauty",      labels: { en: "Beauty", fr: "Beauté", ar: "جمال", tz: "ⴰⴼⴰⵍⴽⴰⵢ" },      href: "/category/bath-beauty",      img: "/categories/beauty.png"  },
  { label: "Clothing",    labels: { en: "Clothing", fr: "Vêtements", ar: "ملابس", tz: "ⵉⵀⴷⵓⵎⵏ" },    href: "/category/clothing",    img: "/categories/clothing.png"},
  { label: "Bags",        labels: { en: "Bags", fr: "Sacs", ar: "حقائب", tz: "ⵉⵇⵕⴰⴱⵏ" },        href: "/category/bags-purses",        img: "/categories/bags.png"    },
  { label: "Home Living", labels: { en: "Home Living", fr: "Maison", ar: "المنزل", tz: "ⵜⴰⴷⴷⴰⵔⵜ" }, href: "/category/home-living", img: "/categories/home.png"    },
  { label: "Baby",        labels: { en: "Baby", fr: "Bébé", ar: "أطفال", tz: "ⴰⵣⴳⵣⴰⵡ" },        href: "/category/kids-baby",        img: "/categories/baby.png"    },
];

export default function BrowseByCategory({ lang }: { lang: string }) {
  const titles: Record<string, string> = {
    en: "Browse By Category",
    fr: "Parcourir par catégorie",
    ar: "تصفح حسب الفئة",
    tz: "ⵔⵣⵓ ⵙ ⵜⴰⴳⴳⴰⵢⵜ"
  };
  const title = titles[lang] || titles.en;

  return (
    <div className="max-w-[100rem] mx-auto px-4 md:px-12 py-2 md:py-8">
      <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-[30px] text-center !text-black">{title}</h2>
      
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={`/${lang}${cat.href}`}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                <Image
                  alt={cat.label}
                  src={cat.img}
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-xs font-medium text-neutral-900 text-center whitespace-nowrap">
                {cat.labels[lang as 'en' | 'fr' | 'ar' | 'tz'] || cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: evenly distributed row */}
      <div className="hidden md:flex items-center justify-between w-full max-w-7xl mx-auto gap-1">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={`/${lang}${cat.href}`}
            className="flex flex-col items-center gap-2 lg:gap-3 hover:opacity-80 transition-opacity flex-1"
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex items-center justify-center flex-shrink-0">
              <Image
                alt={cat.label}
                src={cat.img}
                width={112}
                height={112}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="text-xs md:text-sm font-medium text-neutral-900 text-center whitespace-nowrap">
              {cat.labels[lang as 'en' | 'fr' | 'ar' | 'tz'] || cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
