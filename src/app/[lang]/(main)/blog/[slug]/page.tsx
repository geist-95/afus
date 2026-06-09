import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const TwitterIcon = (props: any) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
);

const FacebookIcon = (props: any) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const LinkedinIcon = (props: any) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

interface PageProps {
  params: Promise<{ lang: string; slug: string }> | { lang: string; slug: string };
}

const MOCK_POSTS = {
  "art-of-moroccan-zellige": {
    id: 1,
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
    },
    image: "/cities-2/fes.jpg",
    date: "2024-05-15",
    author: "Fatima Zahra",
    color: "#0d1f2d",
    textColor: "#c9e0f0",
  },
  "weaving-stories-berber-rugs": {
    id: 2,
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
    },
    image: "/cities-2/marrakesh.avif",
    date: "2024-06-02",
    author: "Youssef Amrani",
    color: "#2a0a1e",
    textColor: "#f5deb3",
  },
  "scent-of-the-medina-spices": {
    id: 3,
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
    },
    image: "/cities-2/meknes-2.jpg",
    date: "2024-07-20",
    author: "Amina Bennis",
    color: "#1e0a2e",
    textColor: "#e8d5f0",
  },
  "leather-tanneries-fes": {
    id: 4,
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
    },
    image: "/cities-2/rabat.jpg",
    date: "2024-08-10",
    author: "Omar Tariq",
    color: "#0a1a0e",
    textColor: "#c5e8cc",
  },
  "andalusian-echoes-tetouan": {
    id: 5,
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
    },
    image: "/cities-2/hamama.jpg",
    date: "2024-09-05",
    author: "Leila Mernissi",
    color: "#1a1200",
    textColor: "#f5e6b0",
  },
  "ultimate-gift-guide-artisanal-moroccan-finds": {
    id: 6,
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
    },
    image: "/cities-2/fes.jpg",
    date: "2026-05-02",
    author: "Salma Rizqi",
    tags: ["Gift Guide", "Handmade"],
    color: "#2a0a1e",
    textColor: "#f5deb3",
    content: (lang: string) => {
      const allTexts = {
        en: {
          intro: "Looking for a truly unique present that speaks volumes? In a world dominated by mass production, choosing a handmade gift means you are not just giving a physical item—you are sharing a rich story, supporting a lineage of master craftsmen, and preserving cultural heritage. Here is our ultimate, hand-picked guide to the best artisanal Moroccan finds that are guaranteed to delight anyone on your list.",
          artTitle: "The Art of Meaningful Gifting",
          artDesc: "There is a profound joy in unboxing a gift that has been shaped by human hands. This guide is designed to help you navigate the vibrant souks of Morocco right from your screen.",
          h1: "1. Exquisite Hand-Painted Ceramics",
          p1: "For the home chef, traditional Moroccan ceramics are an absolute treasure.",
          h2: "2. Hand-Woven Berber Rugs and Textiles",
          p2: "Nothing quite compares to a genuine Berber rug. Smaller textiles are exceptional choices.",
          h3: "3. Hand-Tooled Leather Goods",
          p3: "Moroccan leather is world-renowned for its quality and durability.",
          quote: "A handmade gift is a silent conversation between the artisan, the giver, and the receiver.",
          outro: "Explore our full collection to discover more hidden gems directly from the medina."
        },
        fr: {
          intro: "Vous cherchez un cadeau vraiment unique ? Choisir un cadeau fait main signifie partager une histoire et soutenir des maîtres artisans. Voici notre guide des meilleures trouvailles marocaines.",
          artTitle: "L'art d'offrir avec sens",
          artDesc: "Il y a une joie profonde à déballer un cadeau façonné par des mains humaines. Ce guide vous aide à naviguer dans les souks du Maroc.",
          h1: "1. Céramiques exquises peintes à la main",
          p1: "Pour le chef, les céramiques marocaines traditionnelles sont un trésor absolu.",
          h2: "2. Tapis et textiles berbères tissés à la main",
          p2: "Rien ne se compare à un authentique tapis berbère. Les petits textiles sont aussi d'excellents choix.",
          h3: "3. Articles en cuir travaillés à la main",
          p3: "Le cuir marocain est mondialement reconnu pour sa qualité et sa durabilité.",
          quote: "Un cadeau fait main est une conversation silencieuse entre l'artisan, celui qui donne et celui qui reçoit.",
          outro: "Explorez notre collection complète pour découvrir plus de trésors cachés de la médina."
        },
        ar: {
          intro: "هل تبحث عن هدية فريدة حقًا؟ اختيار هدية مصنوعة يدويًا يعني مشاركة قصة ودعم الحرفيين المهرة. إليك دليلنا لأفضل المنتجات المغربية.",
          artTitle: "فن الهدايا ذات المعنى",
          artDesc: "هناك فرحة عميقة في فتح هدية شكلتها أيدي البشر. يساعدك هذا الدليل على تصفح أسواق المغرب.",
          h1: "1. سيراميك رائع مطلي يدويًا",
          p1: "بالنسبة للطاهي، يعد السيراميك المغربي التقليدي كنزًا مطلقًا.",
          h2: "2. سجاد ومنسوجات أمازيغية منسوجة يدويًا",
          p2: "لا شيء يقارن بسجادة أمازيغية أصلية. المنسوجات الصغيرة هي خيارات استثنائية.",
          h3: "3. سلع جلدية مشغولة يدويًا",
          p3: "يشتهر الجلد المغربي عالميًا بجودته ومتانته.",
          quote: "الهدية المصنوعة يدويًا هي محادثة صامتة بين الحرفي والمانح والمتلقي.",
          outro: "استكشف مجموعتنا الكاملة لاكتشاف المزيد من الجواهر الخفية من المدينة القديمة."
        },
        tz: {
          intro: "ⴰⵔ ⵜⵔⵣⵣⵓⴷ ⴼ ⵜⴰⵔⵣⵉⴼⵜ ⵉⵥⵉⵍⵏ? ⴰⵙⵜⴰⵢ ⵏ ⵜⴰⵔⵣⵉⴼⵜ ⵏ ⵓⴼⵓⵙ ⵉⴳⴰ ⴰⴱⵟⵟⵓ ⵏ ⵜⵏⵇⵇⵉⵙⵜ ⴷ ⵡⴰⵏⵏⴰⵍ ⵏ ⵉⵏⴰⵥⵓⵕⵏ. ⴰⵢⴰ ⵉⴳⴰ ⴰⵎⴰⵏⴰⵔ ⵏⵏⵖ ⵉ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵜⵉⵎⵖⵔⵉⴱⵉⵢⵉⵏ.",
          artTitle: "ⵜⴰⵥⵓⵕⵉ ⵏ ⵜⵉⴽⴽⵉ ⵉⵍⴰⵏ ⴰⵏⴰⵎⴽ",
          artDesc: "ⵜⵍⵍⴰ ⵜⵓⵎⵔⵜ ⴳ ⵓⵕⵥⵥⵓⵎ ⵏ ⵜⴰⵔⵣⵉⴼⵜ ⵉⵜⵜⵓⵙⴽⴰⵔⵏ ⵙ ⵉⴼⴰⵙⵙⵏ. ⴰⵎⴰⵏⴰⵔ ⴰⴷ ⴰⵔ ⴰⴽ ⵉⵜⵜⴰⵡⵙ ⴰⴷ ⵜⵏⵉⴳⴷ ⴳ ⵉⵙⵡⴰⵇⵏ ⵏ ⵍⵎⵖⵔⵉ.",
          h1: "1. ⵍⵅⵣⴼ ⵉⵥⵉⵍⵏ ⵉⵜⵜⵓⴽⵍⵓⵏ ⵙ ⵓⴼⵓⵙ",
          p1: "ⵉ ⵓⵎⴰⵙⵜⴰⵏ ⵏ ⵓⵏⵡⴰⵍ, ⵍⵅⵣⴼ ⴰⵎⵖⵔⵉⴱⵉ ⵉⴳⴰ ⴰⴳⵔⵔⵓⵊ.",
          h2: "2. ⵉⵥⵕⴱⴰⵢ ⴷ ⵜⵉⵎⵍⵙⵉⵜ ⵜⴰⵎⴰⵣⵉⵖⵜ",
          p2: "ⵓⵔ ⵉⵍⵍⵉ ⵎⴰⵢⴷ ⵉⵜⵜⵎⵢⴰⵏⴰⵡⵏ ⴷ ⵓⵥⵕⴱⵉⵢ ⴰⵎⴰⵣⵉⵖ. ⵜⵉⵎⵍⵙⵉⵜ ⵜⵉⵎⵥⵥⵢⴰⵏⵉⵏ ⴳⴰⵏⵜ ⵉⵙⵜⴰⵢⵏ ⵉⴼⴰⵡⵏ.",
          h3: "3. ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵉⵍⵎ",
          p3: "ⵉⵍⵎ ⴰⵎⵖⵔⵉⴱⵉ ⵉⵜⵜⵡⴰⵙⵙⵏ ⴳ ⵓⵎⴰⴹⴰⵍ ⵙ ⵜⵖⴰⵔⴰ ⵏⵏⵙ.",
          quote: "ⵜⴰⵔⵣⵉⴼⵜ ⵏ ⵓⴼⵓⵙ ⵜⴳⴰ ⴰⵎⵙⴰⵡⴰⵍ ⵉⵙⵙⵓⵙⵎⵏ ⴳⵔ ⵓⵎⴰⵙⵜⴰⵏ, ⵡⴰⵍⵍⵉ ⵉⵜⵜⴰⴽⴽⴰⵏ, ⴷ ⵡⴰⵍⵍⵉ ⵉⵜⵜⴰⵎⵥⵏ.",
          outro: "ⵔⵣⵓ ⴳ ⵜⴳⵔⵓⵎⵎⴰ ⵏⵏⵖ ⴰⴼⴰⴷ ⴰⴷ ⵜⴰⴼⴷ ⵓⴳⴳⴰⵔ ⵏ ⵉⴳⵔⵔⵓⵊⵏ ⵙⴳ ⵜⵖⵔⵎⵜ."
        }
      };
      const texts = (allTexts as any)[lang] || allTexts.en;
      
      return (
        <>
          <p className="lead font-medium text-2xl text-[#2a0a1e] mb-8">{texts.intro}</p>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <h2>{texts.artTitle}</h2>
          <p>{texts.artDesc}</p>
          
          <h3>{texts.h1}</h3>
          <p>{texts.p1}</p>
          
          <h3>{texts.h2}</h3>
          <p>{texts.p2}</p>
          
          <h3>{texts.h3}</h3>
          <p>{texts.p3}</p>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <blockquote>"{texts.quote}"</blockquote>
          
          <p>{texts.outro}</p>
        </>
      );
    }
  },
  "behind-the-brand-magic-in-medina": {
    id: 7,
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
    },
    image: "/cities-2/marrakesh.avif",
    date: "2026-05-18",
    author: "Salma Rizqi",
    tags: ["Creator Story", "Craftsmanship"],
    color: "#1e0a2e",
    textColor: "#e8d5f0",
    content: (lang: string) => {
      const allTexts = {
        en: {
          intro: "Every beautiful piece on our platform begins with a spark of inspiration. Today, we're taking you into the labyrinthine alleys of the medina to explore the creative process of master artisan Youssef.",
          h1: "The Workspace: A Sensory Overload",
          p1: "Tucked away in the heart of the ancient medina, Youssef's workshop is a sanctuary of creation. The walls are lined with tools and vibrant dyes sit in terracotta pots.",
          h2: "The Process: Patience and Precision",
          p2: "Watching a master at work is a mesmerizing experience. It takes years to master the techniques used here. Every step is deliberate.",
          quote: "Our work is a dialogue between the past and the present. We are keeping a language alive.",
          h3: "A Commitment to the Future",
          p3: "The magic created here goes beyond aesthetics. It's about sustaining a micro-economy and passing on skills to the next generation."
        },
        fr: {
          intro: "Chaque belle pièce commence par une étincelle d'inspiration. Aujourd'hui, nous vous emmenons dans la médina pour explorer le processus créatif du maître artisan Youssef.",
          h1: "L'Espace de Travail : Une surcharge sensorielle",
          p1: "L'atelier de Youssef est un sanctuaire de création. Les murs sont recouverts d'outils et des teintures vibrantes reposent dans des pots en terre cuite.",
          h2: "Le Processus : Patience et Précision",
          p2: "Regarder un maître à l'œuvre est fascinant. Il faut des années pour maîtriser ces techniques. Chaque étape est délibérée.",
          quote: "Notre travail est un dialogue entre le passé et le présent. Nous maintenons un langage en vie.",
          h3: "Un Engagement envers l'Avenir",
          p3: "La magie créée ici va au-delà de l'esthétique. Il s'agit de soutenir une micro-économie et de transmettre des compétences."
        },
        ar: {
          intro: "كل قطعة جميلة تبدأ بشرارة إلهام. اليوم، نأخذك إلى المدينة القديمة لاستكشاف العملية الإبداعية للحرفي الماهر يوسف.",
          h1: "مساحة العمل: تجربة حسية",
          p1: "ورشة يوسف هي ملاذ للإبداع. تصطف الأدوات على الجدران وتوجد الأصباغ النابضة بالحياة في أواني من الطين.",
          h2: "العملية: الصبر والدقة",
          p2: "مشاهدة أستاذ في العمل تجربة رائعة. يستغرق إتقان التقنيات سنوات. كل خطوة مدروسة.",
          quote: "عملنا هو حوار بين الماضي والحاضر. نحن نحافظ على لغة حية.",
          h3: "التزام نحو المستقبل",
          p3: "السحر الذي يُصنع هنا يتجاوز الجماليات. يتعلق الأمر بدعم الاقتصاد وتمرير المهارات."
        },
        tz: {
          intro: "ⴽⵓ ⵜⴰⵖⴰⵡⵙⴰ ⵉⴼⴰⵡⵏ ⴰⵔ ⵜⴱⴷⴷⴰ ⵙ ⵢⴰⵜ ⵜⵙⵉⴷⵉⵜ ⵏ ⵓⵙⵏⴼⵍⵓⵍ. ⴰⵙⵙⴰ, ⵔⴰⴷ ⴽ ⵏⴰⵡⵉ ⵖⵔ ⵜⵖⵔⵎⵜ ⴰⴼⴰⴷ ⴰⴷ ⵜⵥⵕⴷ ⵜⴰⵡⵓⵔⵉ ⵏ ⵓⵎⴰⵙⵜⴰⵏ ⵢⵓⵙⴼ.",
          h1: "ⴰⴷⵖⴰⵔ ⵏ ⵜⵡⵓⵔⵉ: ⵢⴰⵜ ⵜⵉⵔⵎⵉⵜ",
          p1: "ⵜⴰⵅⵅⴰⵎⵜ ⵏ ⵢⵓⵙⴼ ⵜⴳⴰ ⴰⴷⵖⴰⵔ ⵏ ⵓⵙⵏⴼⵍⵓⵍ. ⵉⵎⴰⵙⵙⵏ ⵍⵍⴰⵏ ⴳ ⵉⵖⵔⴰⴱⵏ ⴷ ⵉⴽⵯⵍⴰⵏ ⵍⵍⴰⵏ ⴳ ⵉⵇⵚⵕⵉⵢⵏ.",
          h2: "ⵜⴰⵡⵓⵔⵉ: ⴰⵚⴱⵕ ⴷ ⵓⵙⵖⵥⵏ",
          p2: "ⴰⵥⵕⵉ ⵏ ⵓⵎⴰⵙⵜⴰⵏ ⴰⵔ ⵉⵙⵡⵓⵔⵉ ⵉⴳⴰ ⵢⴰⵜ ⵜⵖⴰⵡⵙⴰ ⵉⴼⴰⵡⵏ. ⵉⵅⵚⵚⴰ ⵉⵙⴳⴳⵯⴰⵙⵏ ⴰⴼⴰⴷ ⴰⴷ ⵉⵙⵙⵏ ⵜⵉⵖⴰⵔⴰⵙⵉⵏ.",
          quote: "ⵜⴰⵡⵓⵔⵉ ⵏⵏⵖ ⵜⴳⴰ ⴰⵎⵙⴰⵡⴰⵍ ⴳⵔ ⵉⵣⵔⵉ ⴷ ⵖⵉⵍⴰ. ⴰⵔ ⵏⵃⵟⵟⵓ ⵢⴰⵜ ⵜⵓⵜⵍⴰⵢⵜ ⵜⵉⴷⵔⵜ.",
          h3: "ⴰⵙⵓⵊⴷ ⵉ ⵉⵎⴰⵍ",
          p3: "ⵜⴰⵥⵓⵕⵉ ⴰⴷ ⵜⵣⵔⵉ ⴰⴼⴰⵍⴽⴰⵢ. ⵜⴳⴰ ⴰⵙⵏⴰⵍ ⵏ ⵜⴷⴰⵎⵙⴰ ⴷ ⵓⵙⵣⵔⵉ ⵏ ⵜⵎⵓⵣⴰⵢ."
        }
      };
      const texts = (allTexts as any)[lang] || allTexts.en;
      
      return (
        <>
          <p className="lead font-medium text-2xl text-[#1e0a2e] mb-8">{texts.intro}</p>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <h2>{texts.h1}</h2>
          <p>{texts.p1}</p>
          
          <h2>{texts.h2}</h2>
          <p>{texts.p2}</p>
          
          <blockquote>"{texts.quote}"</blockquote>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <h2>{texts.h3}</h2>
          <p>{texts.p3}</p>
        </>
      );
    }
  },
  "refresh-home-spring-handcrafted-decor": {
    id: 8,
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
    },
    image: "/blog/3-ways.png",
    date: "2026-06-03",
    author: "Salma Rizqi",
    tags: ["Home Decor", "Inspiration"],
    color: "#0a1a0e",
    textColor: "#c5e8cc",
    content: (lang: string) => {
      const allTexts = {
        en: {
          intro: "Summer is the season of warmth, light, and vibrant energy. It's the perfect time to breathe new life into your living space with handcrafted touches that reflect the sunny days ahead. By introducing authentic, handmade pieces, you can easily transform your home into a serene and inviting summer sanctuary.",
          h1: "1. Swap Out Heavy Textiles for Light, Breathable Cottons",
          p1: "As the temperatures rise, it's essential to put away the heavy wool rugs and thick throws. Instead, replace them with hand-loomed cotton blankets and lightweight Sabra silk cushions from Moroccan artisans. These natural fibers not only feel cooler against the skin but also bring a relaxed, airy vibe to your living room and bedroom. Drape a bright, woven cotton throw over your sofa or bed to instantly uplift the room's mood while keeping things comfortable for the warmer months.",
          h2: "2. Introduce Artistic and Cooling Ceramics",
          p2: "Summer is all about bringing vibrant colors and refreshing elements back into our lives. Hand-painted Moroccan ceramics, with their intricate geometric patterns and striking blues and greens, are incredibly versatile pieces of art. Use large ceramic bowls as stunning centerpieces on your dining table, or serve refreshing summer salads and chilled fruits in beautifully crafted tagines. The cool touch of glazed pottery adds both visual interest and a subtle cooling effect to your home's aesthetic.",
          h3: "3. Add Natural Texture with Woven Baskets and Rattan",
          p3: "Nothing screams summer quite like natural, woven materials. Hand-woven baskets made from palm leaves or esparto grass add a vital layer of organic texture that softens modern interiors and brings a touch of the outdoors inside. You can use these sturdy, artisanal baskets as stylish planters for your indoor tropical plants, as practical storage for summer reading materials, or even hang them on the wall as a unique bohemian gallery. The earthy tones of woven materials effortlessly complement a bright, summer-ready home.",
          outro: "Embrace the summer season by bringing the enduring beauty, cooling textures, and vibrant colors of handmade artistry into your everyday environment. A few thoughtful, handcrafted additions can make your home feel like a permanent holiday retreat."
        },
        fr: {
          intro: "L'été est la saison de la chaleur, de la lumière et de l'énergie vibrante. C'est le moment idéal pour donner un nouveau souffle à votre espace de vie avec des touches artisanales qui reflètent les beaux jours à venir. En introduisant des pièces authentiques et faites à la main, vous pouvez transformer votre maison en un sanctuaire estival serein et accueillant.",
          h1: "1. Échangez les textiles lourds contre des cotons légers et respirants",
          p1: "À mesure que les températures augmentent, remplacez la laine lourde par des couvertures en coton tissées à la main et des coussins légers en soie Sabra d'artisans marocains. Ces fibres naturelles apportent une ambiance détendue et aérée à votre salon et à votre chambre tout en vous gardant au frais.",
          h2: "2. Introduisez des céramiques artistiques et rafraîchissantes",
          p2: "L'été ramène la couleur et des éléments rafraîchissants dans nos vies. Les céramiques marocaines peintes à la main sont des pièces d'art polyvalentes. Utilisez de grands bols en céramique comme centres de table éblouissants, ou servez des salades estivales et des fruits frais dans des tajines magnifiquement conçus.",
          h3: "3. Ajoutez une texture naturelle avec des paniers tressés et du rotin",
          p3: "Rien ne crie autant l'été que les matériaux naturels et tressés. Les paniers tressés à la main à partir de feuilles de palmier ajoutent une couche vitale de texture organique qui adoucit les intérieurs modernes et apporte une touche de nature à l'intérieur. Utilisez-les comme cache-pots élégants pour vos plantes tropicales ou comme rangement pratique.",
          outro: "Accueillez la saison estivale en apportant la beauté durable, les textures rafraîchissantes et les couleurs vibrantes de l'artisanat dans votre environnement quotidien. Quelques ajouts réfléchis peuvent faire de votre maison un lieu de vacances permanent."
        },
        ar: {
          intro: "الصيف هو موسم الدفء والضوء والطاقة النابضة بالحياة. إنه الوقت المثالي لبث حياة جديدة في مساحة معيشتك بلمسات مصنوعة يدويًا تعكس الأيام المشمسة القادمة. من خلال إدخال قطع أصلية ومصنوعة يدويًا، يمكنك بسهولة تحويل منزلك إلى ملاذ صيفي هادئ وجذاب.",
          h1: "1. استبدل المنسوجات الثقيلة بقطنيات خفيفة ومسامية",
          p1: "مع ارتفاع درجات الحرارة، استبدل الصوف الثقيل ببطانيات قطنية منسوجة يدويًا ووسائد خفيفة من حرير الصبار من قبل الحرفيين المغاربة. لا تبدو هذه الألياف الطبيعية أكثر برودة على البشرة فحسب، بل تجلب أيضًا أجواء مريحة ومتجددة الهواء لغرفة المعيشة وغرفة النوم.",
          h2: "2. أدخل السيراميك الفني والمنعش",
          p2: "الصيف يعيد الألوان النابضة بالحياة والعناصر المنعشة إلى حياتنا. السيراميك المغربي المطلي يدويًا هو قطع فنية متعددة الاستخدامات. استخدم أوعية خزفية كبيرة كقطع مركزية مذهلة على طاولة طعامك، أو قدم السلطات الصيفية والفواكه المبردة في طواجن مصممة بشكل جميل.",
          h3: "3. أضف ملمسًا طبيعيًا مع السلال المنسوجة والروطان",
          p3: "لا شيء يعبر عن الصيف مثل المواد الطبيعية المنسوجة. تضيف السلال المنسوجة يدويًا من أوراق النخيل طبقة حيوية من النسيج العضوي الذي يخفف من التصميمات الداخلية الحديثة ويجلب لمسة من الهواء الطلق إلى الداخل. يمكنك استخدامها كأحواض نباتات أنيقة أو كمساحة تخزين عملية.",
          outro: "استقبل فصل الصيف من خلال جلب الجمال الدائم والأنسجة المنعشة والألوان النابضة بالحياة للحرف اليدوية إلى بيئتك اليومية. القليل من الإضافات المدروسة يمكن أن تجعل منزلك يبدو وكأنه ملاذ دائم للعطلات."
        },
        tz: {
          intro: "ⴰⵏⴱⴷⵓ ⵉⴳⴰ ⴰⵙⴳⴳⵯⴰⵙ ⵏ ⵜⴰⴼⵓⴽⵜ ⴷ ⵓⵥⵖⴰⵍ. ⵉⴳⴰ ⴰⴽⵓⴷ ⵉⵖⵓⴷⴰⵏ ⴰⴼⴰⴷ ⴰⴷ ⵜⵙⵎⴰⵢⵏⵓⵜ ⵜⴰⴷⴷⴰⵔⵜ ⵏⵏⴽ ⵙ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⴼⵓⵙ. ⵙ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⴰⴷ, ⵜⵥⴹⴰⵕⴷ ⴰⴷ ⵜⵙⴽⵔⴷ ⵜⴰⴷⴷⴰⵔⵜ ⵏⵏⴽ ⴰⵎ ⵢⴰⵏ ⵓⴷⵖⴰⵔ ⵏ ⵓⵙⵓⵏⴼⵓ.",
          h1: "1. ⵙⵏⴼⵍ ⵜⵉⵎⵍⵙⵉⵜ ⵉⵥⴰⵢⵢⵏ ⵙ ⵍⵇⵟⵏ ⵉⴼⵙⵙⵓⵙⵏ",
          p1: "ⵍⵍⵉⵖ ⵉⵖⵍⵉ ⵓⵥⵖⴰⵍ, ⵙⵏⴼⵍ ⵜⴰⴹⵓⵜ ⵙ ⵉⴱⵔⴷⵉⵢⵏ ⵏ ⵍⵇⵟⵏ ⴷ ⵜⵙⵓⵎⵔⵉⵏ ⵏ ⵍⵃⵔⵉⵔ ⵉⵜⵜⵓⵥⴹⴰⵏ ⵙ ⵓⴼⵓⵙ. ⴰⵔ ⵜⴰⴽⴽⴰⵏⵜ ⵢⴰⵏ ⵓⵃⵙⵙⴰⵙ ⵏ ⵓⵙⵎⵎⵉⴹ ⴷ ⵜⵓⵏⴼⵉⵜ ⵉ ⵜⵅⵅⴰⵎⵜ ⵏⵏⴽ.",
          h2: "2. ⵙⴽⵛⵎ ⵍⵅⵣⴼ ⵏ ⵜⴰⵥⵓⵕⵉ",
          p2: "ⴰⵏⴱⴷⵓ ⴰⵔ ⴷ ⵉⵜⵜⴰⵡⵉ ⵉⴽⵯⵍⴰⵏ ⵉⴼⴰⵡⵏ. ⵍⵅⵣⴼ ⴰⵎⵖⵔⵉⴱⵉ ⵉⴳⴰ ⵜⴰⵥⵓⵕⵉ ⵉⵎⵢⴰⵏⴰⵡⵏ. ⵙⵙⵎⵔⵙ ⵉⵇⵚⵕⵉⵢⵏ ⵎⵇⵇⵓⵕⵏⵉⵏ ⵉ ⵜⵉⵔⴰⵎ ⵏ ⵓⵏⴱⴷⵓ ⴷ ⵉⴳⵓⵎⴰ.",
          h3: "3. ⵔⵏⵓ ⵜⴰⵖⴰⵔⴰ ⵜⴰⴳⴰⵎⴰⵏⵜ ⵙ ⵉⵙⴽⴽⵉⵏⵏ",
          p3: "ⵉⵙⴽⴽⵉⵏⵏ ⵉⵜⵜⵓⵥⴹⴰⵏ ⵙ ⵜⵉⴼⵔⵉⵏ ⵏ ⵡⴰⴳⴳⴰⵔ ⴰⵔ ⵔⵏⵏⵓⵏ ⵢⴰⵜ ⵜⵖⴰⵔⴰ ⵜⴰⴳⴰⵎⴰⵏⵜ ⵉ ⵜⴰⴷⴷⴰⵔⵜ. ⵜⵥⴹⴰⵕⴷ ⴰⴷ ⵜⵏ ⵜⵙⵙⵎⵔⵙⴷ ⵉ ⵉⵎⵖⴰⵢⵏ ⵏⵖ ⴰⴼⴰⴷ ⴰⴷ ⴳⵉⵙⵏ ⵜⵃⵟⵟⵓⴷ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏⵏⴽ.",
          outro: "ⵙⵏⵓⴱⴳ ⴰⵏⴱⴷⵓ ⵙ ⵓⵙⵉⴷⴼ ⵏ ⵜⴰⵥⵓⵕⵉ ⵏ ⵓⴼⵓⵙ ⴳ ⵜⴰⴷⴷⴰⵔⵜ ⵏⵏⴽ. ⴽⵔⴰ ⵏ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵉⴼⴰⵡⵏ ⴰⵔ ⵜⵙⵙⵎⴰⵢⵏⵓⵏ ⵓⴷⵎ ⵏ ⵜⴰⴷⴷⴰⵔⵜ."
        }
      };
      const texts = (allTexts as any)[lang] || allTexts.en;
      
      return (
        <>
          <p className="lead font-medium text-2xl text-[#0a1a0e] mb-8">{texts.intro}</p>
          
          <h3>{texts.h1}</h3>
          <p>{texts.p1}</p>
          
          <h3>{texts.h2}</h3>
          <p>{texts.p2}</p>
          
          <h3>{texts.h3}</h3>
          <p>{texts.p3}</p>
          
          <p>{texts.outro}</p>
        </>
      );
    }
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";
  const slug = resolvedParams?.slug;

  const post = MOCK_POSTS[slug as keyof typeof MOCK_POSTS];
  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const titleText = (post.title as any)[lang] || post.title.en;
  const descText = (post.excerpt as any)[lang] || post.excerpt.en;

  const keywordsMap: Record<string, string> = {
    "art-of-moroccan-zellige": "moroccan zellige, traditional tilework, fes clay tile, handmade ceramic, moroccan geometry, geo optimized",
    "weaving-stories-berber-rugs": "berber rugs, handwoven rug, atlas mountains weaving, moroccan carpet, berber symbol, geo optimized",
    "scent-of-the-medina-spices": "moroccan spices, guide to medina spices, ras el hanout, moroccan saffron, culinary heritage, geo optimized",
    "leather-tanneries-fes": "fes tanneries, chouara tannery, moroccan leather, traditional tanning, handmade leather goods, geo optimized",
    "andalusian-echoes-tetouan": "tetouan medina, andalusian heritage, white dove morocco, andalusian music, geo optimized",
    "ultimate-gift-guide-artisanal-moroccan-finds": "moroccan gifts, handmade gift guide, artisanal finds, moroccan shopping, geo optimized",
    "behind-the-brand-magic-in-medina": "artisan process, behind the brand, moroccan crafts design, master artisan, geo optimized",
    "refresh-home-spring-handcrafted-decor": "spring home decor, handcrafted decor, moroccan interior, home refresh, geo optimized"
  };

  const keywords = keywordsMap[slug] || "moroccan crafts, artisanal, handmade, heritage";

  return {
    title: titleText,
    description: descText,
    keywords,
    openGraph: {
      title: `${titleText} - afus`,
      description: descText,
      url: `https://afus.ma/${lang}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image,
          alt: titleText,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleText} - afus`,
      description: descText,
      images: [post.image],
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { lang, slug } = await params;
  
  const post = MOCK_POSTS[slug as keyof typeof MOCK_POSTS];

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-12 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": (post.title as any)[lang] || post.title.en,
            "description": (post.excerpt as any)[lang] || post.excerpt.en,
            "image": `https://afus.ma${post.image}`,
            "datePublished": post.date,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "afus",
              "logo": "https://afus.ma/icon.png"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://afus.ma/${lang}/blog/${slug}`
            }
          })
        }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 px-4 md:px-0">
        <Link href={`/${lang}`} className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${lang}/blog`} className="hover:text-black transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-black font-medium line-clamp-1">{(post.title as any)[lang] || post.title.en}</span>
      </nav>

      {/* Hero */}
      <div
        className="relative w-full arabic-frame overflow-hidden min-h-[300px] md:min-h-[400px] flex flex-col md:flex-row mx-auto"
        style={{ backgroundColor: post.color }}
      >
        {/* Left: solid bg + text */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-14 py-12 z-10">
          <div className="mb-4 text-sm font-medium tracking-wider uppercase" style={{ color: post.textColor, opacity: 0.8 }}>
            {post.date} &bull; {post.author}
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold !font-ariom mb-6"
            style={{ color: post.textColor, lineHeight: "100%" }}
          >
            {(post.title as any)[lang] || post.title.en}
          </h1>
          <p className="max-w-xl text-base md:text-lg" style={{ color: post.textColor, opacity: 0.9 }}>
            {(post.excerpt as any)[lang] || post.excerpt.en}
          </p>
        </div>

        {/* Right: image */}
        <div className="relative w-full md:w-[45%] h-[300px] md:h-auto flex-shrink-0">
          <Image
            src={post.image}
            alt={(post.title as any)[lang] || post.title.en}
            fill
            className="object-cover banner-img"
            sizes="(max-width: 768px) 100vw, 45vw"
            quality={90}
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-0 prose prose-lg prose-neutral prose-headings:!font-ariom prose-a:text-[#2a0a1e] hover:prose-a:text-black prose-p:text-xl prose-p:text-neutral-600 prose-p:leading-relaxed [&_p]:mb-8 prose-p:mb-8">
        {/* @ts-ignore - dynamic content */}
        {post.content ? (typeof post.content === 'function' ? post.content(lang) : (post.content[lang as 'en'|'fr'|'ar'|'tz'] || post.content.en)) : (
          <>
            <p>
              {{
                en: "This is a placeholder for the actual blog content. The design focuses on reading experience, with a generous line height and comfortable line length.",
                fr: "Ceci est un espace réservé pour le contenu réel du blog. La conception met l'accent sur l'expérience de lecture, avec une hauteur de ligne généreuse et une longueur de ligne confortable.",
                ar: "هذا عنصر نائب لمحتوى المدونة الفعلي. يركز التصميم على تجربة القراءة، مع ارتفاع خط سخي وطول خط مريح.",
                tz: "ⴰⵢⴰ ⵉⴳⴰ ⴰⴷⵖⴰⵔ ⵏ ⵓⵎⴳⵔⴰⴷ ⵏ ⵓⴱⵍⵓⴳ ⴰⵎⴰⴷⴷⵓⴷ. ⴰⵙⵎⵙⴰⵙⴰ ⴰⵔ ⵉⵙⵙⵉⵙⴼⵉⵡ ⴰⵙⴰⵢⵙ ⵏ ⵜⵖⵔⵉ, ⵙ ⵜⵉⵖⵣⵉ ⴷ ⵜⵉⵔⵔⵓⵜ ⵉⴼⴰⵡⵏ."
              }[lang as 'en'|'fr'|'ar'|'tz'] || "This is a placeholder for the actual blog content. The design focuses on reading experience, with a generous line height and comfortable line length."}
            </p>
            
            <div className="my-8 w-full h-80 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center">
              <span className="text-neutral-400">Placeholder Image</span>
            </div>

            <h2>
              {{
                en: "The Origins of the Craft",
                fr: "Les origines de l'artisanat",
                ar: "أصول الحرفة",
                tz: "ⵉⵥⵓⵕⴰⵏ ⵏ ⵜⵎⴳⵓⵔⵉ"
              }[lang as 'en'|'fr'|'ar'|'tz'] || "The Origins of the Craft"}
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <blockquote>
              {{
                en: "\"Artisanry is not just about making things; it is about preserving a culture and a way of life that has existed for centuries.\"",
                fr: "\"L'artisanat ne consiste pas seulement à fabriquer des objets ; il s'agit de préserver une culture et un mode de vie qui existent depuis des siècles.\"",
                ar: "\"الحرفية ليست مجرد صنع الأشياء؛ بل هي الحفاظ على ثقافة وطريقة حياة موجودة منذ قرون.\"",
                tz: "\"ⵜⴰⵎⴳⵓⵔⵉ ⵓⵔ ⵜⴳⵉ ⵖⴰⵙ ⴰⵙⴽⴽⵉⵔ ⵏ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ; ⵜⴳⴰ ⴰⵃⵟⵟⵓ ⵏ ⵜⵓⵙⵙⵏⴰ ⴷ ⵜⵖⴰⵔⴰⵙⵜ ⵏ ⵜⵓⴷⵔⵜ ⵍⵍⵉ ⵉⵍⵍⴰⵏ ⴳ ⵉⴳⵉⵎⵉⵏ ⵏ ⵉⵙⴳⴳⵯⴰⵙⵏ.\""
              }[lang as 'en'|'fr'|'ar'|'tz'] || "\"Artisanry is not just about making things; it is about preserving a culture and a way of life that has existed for centuries.\""}
            </blockquote>

            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
            </p>

            <div className="my-8 w-full h-80 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center">
              <span className="text-neutral-400">Placeholder Image</span>
            </div>

            <h3>
              {{
                en: "Modern Interpretations",
                fr: "Interprétations modernes",
                ar: "تفسيرات حديثة",
                tz: "ⵉⵙⴼⵔⵓⵜⵏ ⵉⵜⵔⴰⵔⵏ"
              }[lang as 'en'|'fr'|'ar'|'tz'] || "Modern Interpretations"}
            </h3>
            <p>
              Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi neque rutrum erat, eu congue orci lorem eget lorem. Vestibulum non ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium.
            </p>
          </>
        )}
        
        <div className="my-10 arabic-frame bg-neutral-200 p-[1px]">
          <div className="arabic-frame overflow-hidden bg-neutral-50 p-8 text-center">
            <h3 className="!font-ariom text-2xl text-[#2a0a1e] mb-2">Want to learn more?</h3>
            <p className="text-neutral-600 mb-4">Subscribe to our newsletter for more stories from the medina.</p>
            <div className="flex justify-center gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2a0a1e] focus:ring-offset-2" />
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#2a0a1e] text-white hover:bg-[#2a0a1e]/90 h-10 px-4 py-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex items-center justify-between not-prose">
          <span className="font-bold text-[#2a0a1e] !font-ariom text-xl">Share this article</span>
          <div className="flex gap-2">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent((post.title as any)[lang] || post.title.en)}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-neutral-100 hover:bg-[#2a0a1e] hover:text-white text-neutral-600 transition-colors" aria-label="Share on Twitter">
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-neutral-100 hover:bg-[#2a0a1e] hover:text-white text-neutral-600 transition-colors" aria-label="Share on Facebook">
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=&title=${encodeURIComponent((post.title as any)[lang] || post.title.en)}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-neutral-100 hover:bg-[#2a0a1e] hover:text-white text-neutral-600 transition-colors" aria-label="Share on LinkedIn">
              <LinkedinIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-8 pt-8 border-t border-neutral-200 flex items-center gap-4 not-prose">
          <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden shrink-0">
             <svg className="w-8 h-8 text-neutral-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold !font-ariom text-[#2a0a1e]">{post.author}</h3>
            <p className="text-neutral-600 text-sm">Writer & Heritage Enthusiast</p>
          </div>
        </div>
      </div>

      {/* Other Articles */}
      <div className="max-w-4xl mx-auto px-4 md:px-0 mt-24">
        <h2 className="text-3xl font-bold !font-ariom mb-8 text-[#2a0a1e]">Other Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(MOCK_POSTS)
            .filter(([s]) => s !== slug)
            .slice(0, 2)
            .map(([s, p]) => (
              <Link href={`/${lang}/blog/${s}`} key={p.id} className="group h-full hover:shadow-xl transition-shadow duration-300 arabic-frame bg-neutral-300 p-[1px]">
                <div className="flex flex-col h-full bg-white arabic-frame overflow-hidden">
                  <div className="relative h-48 w-full overflow-hidden bg-neutral-200 arabic-frame flex items-center justify-center">
                    <span className="text-neutral-400">Placeholder Image</span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs text-neutral-400 mb-2">{p.date}</div>
                    <h3 className="text-xl font-bold !font-ariom mb-2 group-hover:text-[#2a0a1e] transition-colors line-clamp-2">{(p.title as any)[lang] || p.title.en}</h3>
                    <p className="text-neutral-600 text-sm line-clamp-2 mb-4 flex-grow">{(p.excerpt as any)[lang] || p.excerpt.en}</p>
                    <div className="text-sm font-medium text-[#2a0a1e] mt-auto flex items-center gap-2">
                      Read
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
