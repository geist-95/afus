import Image from "next/image";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string }> | { lang: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  const translations = {
    en: {
      titlePlain: "Blog & Artisan Journals - Stories from Moroccan Medinas",
      description: "Discover the rich history, master techniques, and stories behind Moroccan rugs, zellige tilework, spice souks, and leather tanneries.",
      keywords: "Moroccan culture, Fez tanneries, Berber rug stories, Moroccan zellige, spice guide Morocco"
    },
    fr: {
      titlePlain: "Blog & Carnets d'Artisans - Histoires des Médinas Marocaines",
      description: "Découvrez l'histoire riche, les techniques et les récits derrière les tapis marocains, le zellige, les souks d'épices et les tanneries.",
      keywords: "culture marocaine, tannerie de fes, histoire tapis berbere, zellige marocain, guide epices maroc"
    },
    ar: {
      titlePlain: "المدونة ويوميات الحرفي - قصص من المدن المغربية العتيقة",
      description: "اكتشف التاريخ الغني والتقنيات والقصص الكامنة وراء السجاد المغربي والزليج وأسواق التوابل ومدابغ الجلود.",
      keywords: "الثقافة المغربية, مدابغ فاس, قصص السجاد الأمازيغي, زليج مغربي, دليل التوابل المغرب"
    },
    tz: {
      titlePlain: "ⴰⴱⵍⵓⴳ - ⵜⵉⵏⵇⵇⵉⵙⵉⵏ ⵏ ⵉⵎⴳⵓⵔⵉⵢⵏ",
      description: "ⴰⴼ ⴷ ⵥⵕ ⵜⵉⵏⵇⵇⵉⵙⵉⵏ ⴷ ⵜⴰⵡⵓⵔⵉ ⵏ ⵉⵏⴰⵥⵓⵕⵏ ⵉⵎⵖⵔِⵉⴱⵉⵢⵏ.",
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

const MOCK_POSTS = [
  {
    id: 1,
    slug: "art-of-moroccan-zellige",
    image: "/cities-2/fes.jpg",
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
    image: "/cities-2/marrakesh.avif",
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
  },
  {
    id: 3,
    slug: "scent-of-the-medina-spices",
    image: "/cities-2/meknes-2.jpg",
    date: "2024-07-20",
    title: {
      en: "The Scent of the Medina: A Guide to Spices",
      fr: "Le parfum de la Médina : Guide des épices",
      ar: "عطر المدينة: دليل التوابل",
      tz: "ⴰⵙⵜⵜⵉ ⵏ ⵜⵖⵔⵎⵜ: ⴰⵎⴰⵏⴰⵔ ⵏ ⵜⴰⵇⵇⴰⵢⵉⵏ"
    },
    excerpt: {
      en: "From ras el hanout to saffron, journey through the aromatic world of Moroccan spices and learn how they define the country's culinary landscape.",
      fr: "Du ras el hanout au safran, voyagez à travers le monde aromatique des épices marocaines et découvrez comment elles définissent le paysage culinaire du pays.",
      ar: "من رأس الحانوت إلى الزعفران، سافر عبر العالم العطري للتوابل المغربية وتعرف على كيفية تحديدها للمشهد الطهوي في البلاد.",
      tz: "ⵙⴳ ⵔⴰⵙ ⵍⵃⴰⵏⵓⵜ ⴰⵔ ⵣⵣⵄⴼⵔⴰⵏ, ⵎⵓⴷⴷⵓ ⴳ ⵓⵎⴰⴹⴰⵍ ⴰⵎⵙⵜⵉ ⵏ ⵜⴰⵇⵇⴰⵢⵉⵏ ⵜⵉⵎⵖⵔⵉⴱⵉⵢⵉⵏ ⴷ ⵍⵎⴷ ⵎⴰⵎⴽ ⵙⵙⵏⵜⵍⵏⵜ ⵜⵉⵔⴰⵎ ⵏ ⵜⵎⵓⵔⵜ."
    }
  },
  {
    id: 4,
    slug: "leather-tanneries-fes",
    image: "/cities-2/rabat.jpg",
    date: "2024-08-10",
    title: {
      en: "Leather Tanneries of Fes: A Timeless Tradition",
      fr: "Les tanneries de Fès : Une tradition intemporelle",
      ar: "مدابغ الجلود في فاس: تقليد خالد",
      tz: "ⵉⵎⵍⴰⵏ ⵏ ⵉⵍⵎⴰⵡⵏ ⵏ ⴼⴰⵙ: ⵢⴰⵜ ⵜⴰⵏⵙⴰⵢⵜ ⵓⵔ ⵉⵜⵜⵎⵜⵜⴰⵜⵏ"
    },
    excerpt: {
      en: "Step into the iconic Chouara Tannery and witness the traditional methods used to produce some of the world's finest leather goods.",
      fr: "Entrez dans l'emblématique tannerie Chouara et découvrez les méthodes traditionnelles utilisées pour produire certains des meilleurs articles en cuir au monde.",
      ar: "ادخل إلى مدبغة شوارة الشهيرة وشاهد الأساليب التقليدية المستخدمة لإنتاج بعض أفضل المنتجات الجلدية في العالم.",
      tz: "ⴽⵛⵎ ⵖⵔ ⵜⵎⵍⴰ ⵏ ⵛⵡⵡⴰⵔⴰ ⵉⵜⵜⵡⴰⵙⵙⵏⵏ ⴷ ⵥⵕ ⵜⵉⵖⴰⵔⴰⵙⵉⵏ ⵜⵉⵇⴱⵓⵔⵉⵏ ⵉⵜⵜⵓⵙⵎⵔⴰⵙⵏ ⵉ ⵓⴼⴰⵔⵙ ⵏ ⴽⵔⴰ ⵏ ⵜⴳⴰⵡⵉⵏ ⵏ ⵉⵍⵎⴰⵡⵏ ⵉⵥⵉⵍⵏ ⴳ ⵓⵎⴰⴹⴰⵍ."
    }
  },
  {
    id: 5,
    slug: "andalusian-echoes-tetouan",
    image: "/cities-2/hamama.jpg",
    date: "2024-09-05",
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
  },
  {
    id: 6,
    slug: "ultimate-gift-guide-artisanal-moroccan-finds",
    image: "/cities-2/fes.jpg",
    date: "2026-05-02",
    title: {
      en: "The Ultimate Gift Guide for Artisanal Moroccan Finds",
      fr: "Le guide ultime des cadeaux artisanaux marocains",
      ar: "الدليل الشامل لهدايا الصناعة التقليدية المغربية",
      tz: "ⴰⵎⴰⵏⴰⵔ ⴰⵎⴳⴳⴰⵔⵓ ⵉ ⵜⵔⵣⵉⴼⵉⵏ ⵏ ⵜⵎⴳⵓⵔⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ"
    },
    excerpt: {
      en: "Find the perfect, one-of-a-kind handmade gift with our curated guide to artisanal Moroccan crafts.",
      fr: "Trouvez le cadeau fait main idéal et unique grâce à notre sélection d'artisanat marocain.",
      ar: "اعثر على الهدية المثالية والفريدة المصنوعة يدويًا من خلال دليلنا المنسق للحرف اليدوية المغربية.",
      tz: "ⴰⴼ ⵜⴰⵔⵣⵉⴼⵜ ⵉⵥⵉⵍⵏ, ⵢⴰⵜ ⴳ ⵡⴰⵏⴰⵡ ⵏⵏⵙ, ⵉⵜⵜⵓⵙⴽⴰⵔⵏ ⵙ ⵓⴼⵓⵙ ⵙ ⵓⵎⴰⵏⴰⵔ ⵏⵏⵖ ⵉⵜⵜⵓⵙⵜⴰⵢⵏ ⵉ ⵜⵎⴳⵓⵔⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ."
    }
  },
  {
    id: 7,
    slug: "behind-the-brand-magic-in-medina",
    image: "/cities-2/marrakesh.avif",
    date: "2026-05-18",
    title: {
      en: "Behind the Brand: Creating Magic in the Medina",
      fr: "Dans les coulisses : Créer de la magie dans la Médina",
      ar: "خلف العلامة التجارية: صنع السحر في المدينة",
      tz: "ⴷⴼⴼⵉⵔ ⵏ ⵜⵎⴰⵜⴰⵔⵜ: ⴰⵙⵏⴼⵍⵓⵍ ⵏ ⵜⵎⴰⴳⵉⵜ ⴳ ⵜⵖⵔⵎⵜ"
    },
    excerpt: {
      en: "Step into the workspace of a master artisan and see how raw materials are transformed into breathtaking art.",
      fr: "Entrez dans l'atelier d'un maître artisan et découvrez comment les matières premières se transforment en art à couper le souffle.",
      ar: "ادخل إلى مساحة عمل حرفي خبير وشاهد كيف تتحول المواد الخام إلى فن يخطف الأنفاس.",
      tz: "ⴽⵛⵎ ⵖⵔ ⵓⴷⵖⴰⵔ ⵏ ⵜⵡⵓⵔⵉ ⵏ ⵢⴰⵏ ⵓⵎⴰⵙⵜⴰⵏ ⵓⵎⴳⵓⵔⵉ ⴷ ⵥⵕ ⵎⴰⵎⴽ ⵜⵜⵓⵙⵏⴼⵍⵏⵜ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵜⵉⵎⵣⵡⵓⵔⴰ ⵖⵔ ⵜⴰⵥⵓⵕⵉ ⵉⴼⴰⵡⵏ."
    }
  },
  {
    id: 8,
    slug: "refresh-home-spring-handcrafted-decor",
    image: "/blog/3-ways.png",
    date: "2026-06-03",
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
  }
];

export default async function BlogPage({ params }: PageProps) {
  const { lang } = await params;

  const t = {
    en: { home: "Home", blog: "Blog", journal: "Journal", desc: "Stories, insights, and guides exploring the rich heritage of Moroccan craftsmanship and culture.", read: "Read Article" },
    fr: { home: "Accueil", blog: "Blog", journal: "Journal", desc: "Histoires, découvertes et guides explorant le riche patrimoine de l'artisanat et de la culture marocaine.", read: "Lire l'article" },
    ar: { home: "الرئيسية", blog: "المدونة", journal: "اليوميات", desc: "قصص ورؤى وأدلة تستكشف التراث الغني للحرف اليدوية والثقافة المغربية.", read: "اقرأ المقال" },
    tz: { home: "ⴰⵙⵏⵓⴱⴳ", blog: "ⴰⴱⵍⵓⴳ", journal: "ⴰⵖⵎⵉⵙ", desc: "ⵜⵉⵏⵇⵇⵉⵙⵉⵏ, ⵜⵉⵡⵏⴳⵉⵎⵉⵏ ⴷ ⵉⵎⴰⵏⴰⵔⵏ ⵉⵔⵣⵣⵓⵏ ⴳ ⵜⴰⵢⵙⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ.", read: "ⵖⵔ ⴰⵎⴳⵔⴰⴷ" }
  }[lang] || { home: "Home", blog: "Blog", journal: "Journal", desc: "Stories, insights, and guides exploring the rich heritage of Moroccan craftsmanship and culture.", read: "Read Article" };

  return (
    <div className="space-y-12 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 px-4 md:px-0">
        <Link href={`/${lang}`} className="hover:text-black transition-colors">{t.home}</Link>
        <span>/</span>
        <span className="text-black font-medium">{t.blog}</span>
      </nav>

      {/* Hero */}
      <div
        className="relative w-full arabic-frame overflow-hidden min-h-[220px] md:min-h-[300px] flex flex-row mx-auto"
        style={{ backgroundColor: "#2a0a1e" }}
      >
        {/* Left: solid bg + text */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-14 py-10 z-10">
          <p
            className="mb-2 text-xl md:text-2xl"
            style={{ color: "#f5deb3", fontFamily: "'Noto Sans Tifinagh', sans-serif", opacity: 0.8 }}
          >
            ⴱⵍⵓⴳ
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold !font-ariom leading-tight"
            style={{ color: "#f5deb3" }}
          >
            {t.journal}
          </h1>
          <p className="mt-4 max-w-sm text-sm md:text-base" style={{ color: "#f5deb3", opacity: 0.85 }}>
            {t.desc}
          </p>
        </div>

        {/* Right: image */}
        <div className="relative w-[45%] md:w-[42%] flex-shrink-0 hidden sm:block">
          <Image
            src="/cities-2/marrakesh.avif"
            alt="Blog Hero"
            fill
            className="object-cover banner-img"
            sizes="(max-width: 768px) 45vw, 42vw"
            quality={90}
          />
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        {MOCK_POSTS.map((post) => (
          <Link href={`/${lang}/blog/${post.slug}`} key={post.id} className="group h-full hover:shadow-xl transition-shadow duration-300 arabic-frame bg-neutral-300 p-[1px]">
            <div className="flex flex-col h-full bg-white arabic-frame overflow-hidden">
              <div className="relative h-60 w-full overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={(post.title as any)[lang] || post.title.en} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs text-neutral-400 mb-3">{post.date}</div>
                <h2 className="text-2xl font-bold !font-ariom mb-3 group-hover:text-[#2a0a1e] transition-colors">{(post.title as any)[lang] || post.title.en}</h2>
                <p className="text-neutral-600 text-sm line-clamp-3 mb-6 flex-grow">{(post.excerpt as any)[lang] || post.excerpt.en}</p>
                <div className="text-sm font-medium text-black mt-auto flex items-center gap-2">
                  {t.read}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="pt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
