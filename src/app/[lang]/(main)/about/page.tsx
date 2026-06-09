import Image from "next/image";
import Link from "next/link";
import TrustBanner from "@/components/ui/TrustBanner";
import FAQSection from "@/components/ui/FAQSection";
import { IconHeartHandshake, IconTools, IconShieldCheck, IconTruckDelivery } from '@tabler/icons-react';
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string }> | { lang: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  const translations = {
    en: {
      titlePlain: "About Us - Supporting Moroccan Crafts",
      description: "Learn about the mission of afus: empowering traditional artisans across Marrakech, Fez, and Rabat, and preserving authentic Moroccan heritage.",
    },
    fr: {
      titlePlain: "À propos de nous - Soutien de l'artisanat marocain",
      description: "Découvrez la mission d'afus : valoriser les artisans traditionnels de Marrakech, Fès et Rabat, et préserver le patrimoine marocain.",
    },
    ar: {
      titlePlain: "قصتنا - دعم الحرف اليدوية المغربية",
      description: "تعرف على مهمة أفوس: تمكين الحرفيين التقليديين في مراكش وفاس والرباط، والحفاظ على التراث المغربي الأصيل.",
    },
    tz: {
      titlePlain: "ⵖⴼ ⴰⴼⵓⵙ - ⵜⴰⵢⵙⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ",
      description: "ⵙⵙⵏ ⵜⴰⵡⵓⵔⵉ ⵏ ⴰⴼⵓⵙ ⴳ ⵓⵃⵟⵟⵓ ⵏ ⵜⵎⴳⵓⵔⵉ ⵜⴰⵎⵖⵔⵉⴱِⵉⵜ.",
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  return {
    title: t.titlePlain,
    description: t.description,
  };
}

export default async function AboutPage({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  const t = {
    en: {
      breadcrumb: "About Us",
      heroTitle: "Our Story",
      heroSubtitle: "ⴰⵎⵣⵔⵓⵢ ⵏⵏⵖ",
      heroDesc: "Afus was born from a deep respect for Moroccan heritage and a desire to connect traditional artisans with the world. We travel across the kingdom, from the bustling souks of Marrakech to the ancient medinas of Fez, to bring you authentic, handcrafted treasures. Our mission is to empower local creators and preserve centuries-old craftsmanship.",
      statsTitle: "Afus in Numbers",
      stat1Value: "15+",
      stat1Label: "Product Categories",
      stat2Value: "50+",
      stat2Label: "Local Cooperatives",
      stat3Value: "12",
      stat3Label: "Cities Covered",
      stat4Value: "100%",
      stat4Label: "Authenticity",
      teamTitle: "Meet our dedicated team supporting Moroccan artisans",
      teamDesc: "To be the marketplace our community wants us to be, it takes an eclectic group of passionate operators from all around the world. Get to know the people leading the way at Afus.",
      valuesTitle: "Our Core Values",
      valuesDesc: "Everything we do at Afus is guided by our commitment to preserving Moroccan heritage and empowering the artisans who keep it alive.",
      val1Title: "Direct from Source",
      val1Desc: "We connect you directly with artisans across Morocco, cutting out the middlemen to support local communities.",
      val2Title: "Empowering Artisans",
      val2Desc: "Our platform ensures fair trade and provides a direct-to-consumer model that puts more money directly into the hands of the creators.",
      val3Title: "Quality & Heritage",
      val3Desc: "We curate high-quality products that reflect centuries of tradition, from intricate zellige to masterful leatherwork.",
    },
    fr: {
      breadcrumb: "À propos",
      heroTitle: "Notre Histoire",
      heroSubtitle: "ⴰⵎⵣⵔⵓⵢ ⵏⵏⵖ",
      heroDesc: "Afus est né d'un profond respect pour le patrimoine marocain et du désir de connecter les artisans traditionnels avec le monde. Nous parcourons le royaume, des souks animés de Marrakech aux anciennes médinas de Fès, pour vous apporter des trésors authentiques faits à la main. Notre mission est de soutenir les créateurs locaux et de préserver un savoir-faire séculaire.",
      statsTitle: "Afus en Chiffres",
      stat1Value: "+15",
      stat1Label: "Catégories de Produits",
      stat2Value: "+50",
      stat2Label: "Coopératives Locales",
      stat3Value: "12",
      stat3Label: "Villes Couvertes",
      stat4Value: "100%",
      stat4Label: "Authenticité",
      teamTitle: "Rencontrez notre équipe dédiée au soutien des artisans marocains",
      teamDesc: "Pour être la place de marché que notre communauté souhaite, il faut un groupe éclectique d'opérateurs passionnés venus du monde entier. Apprenez à connaître les personnes qui ouvrent la voie chez Afus.",
      valuesTitle: "Nos Valeurs Fondamentales",
      valuesDesc: "Tout ce que nous faisons chez Afus est guidé par notre engagement à préserver le patrimoine marocain et à soutenir les artisans qui le maintiennent en vie.",
      val1Title: "Directement de la Source",
      val1Desc: "Nous vous connectons directement avec des artisans à travers le Maroc, en supprimant les intermédiaires pour soutenir les communautés locales.",
      val2Title: "Soutenir les Artisans",
      val2Desc: "Notre plateforme assure un commerce équitable et offre un modèle direct au consommateur qui valorise les créateurs.",
      val3Title: "Qualité et Patrimoine",
      val3Desc: "Nous sélectionnons des produits de haute qualité qui reflètent des siècles de tradition, du zellige complexe au travail du cuir magistral.",
    },
    ar: {
      breadcrumb: "معلومات عنا",
      heroTitle: "قصتنا",
      heroSubtitle: "ⴰⵎⵣⵔⵓⵢ ⵏⵏⵖ",
      heroDesc: "ولدت أفوس من احترام عميق للتراث المغربي ورغبة في ربط الحرفيين التقليديين بالعالم. نحن نسافر عبر المملكة، من أسواق مراكش المزدحمة إلى المدن العتيقة في فاس، لنقدم لك كنوزًا أصلية مصنوعة يدويًا. مهمتنا هي دعم المبدعين المحليين والحفاظ على الحرف اليدوية التي تعود إلى قرون.",
      statsTitle: "أفوس في أرقام",
      stat1Value: "+15",
      stat1Label: "فئات المنتجات",
      stat2Value: "+50",
      stat2Label: "تعاونيات محلية",
      stat3Value: "12",
      stat3Label: "مدينة مغطاة",
      stat4Value: "100%",
      stat4Label: "أصالة",
      teamTitle: "تعرف على فريقنا المخصص لدعم الحرفيين المغاربة",
      teamDesc: "لنكون المنصة التي يريدها مجتمعنا، نحتاج إلى مجموعة متنوعة من المشغلين الشغوفين من جميع أنحاء العالم. تعرف على الأشخاص الذين يقودون الطريق في أفوس.",
      valuesTitle: "قيمنا الأساسية",
      valuesDesc: "كل ما نقوم به في أفوس يسترشد بالتزامنا بالحفاظ على التراث المغربي ودعم الحرفيين الذين يبقونه حياً.",
      val1Title: "مباشرة من المصدر",
      val1Desc: "نحن نربطك مباشرة مع الحرفيين في جميع أنحاء المغرب، متجاوزين الوسطاء لدعم المجتمعات المحلية.",
      val2Title: "تمكين الحرفيين",
      val2Desc: "تضمن منصتنا التجارة العادلة وتوفر نموذجًا مباشرًا للمستهلك يضع المزيد من الأموال مباشرة في أيدي المبدعين.",
      val3Title: "الجودة والتراث",
      val3Desc: "نقوم برعاية منتجات عالية الجودة تعكس قرونًا من التقاليد، من الزليج المعقد إلى الصناعات الجلدية البارعة.",
    },
    tz: {
      breadcrumb: "ⵖⴼ ⴰⴼⵓⵙ",
      heroTitle: "ⵜⴰⵏⵇⵇⵉⵙⵜ ⵏⵏⵖ",
      heroSubtitle: "ⴰⵎⵣⵔⵓⵢ ⵏⵏⵖ",
      heroDesc: "ⵜⵍⵓⵍ ⴰⴼⵓⵙ ⵙⴳ ⵢⴰⵏ ⵓⵣⵔⴰⴽ ⵉⵅⴰⵜⵔⵏ ⵉ ⵜⴰⵢⵙⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ ⴷ ⵢⴰⵜ ⵜⵉⵔⴰⵜ ⵏ ⵓⵣⴷⴰⵢ ⵏ ⵉⵏⴰⵥⵓⵕⵏ ⵉⵇⴱⵓⵔⵏ ⴷ ⵓⵎⴰⴹⴰⵍ. ⴰⵔ ⵏⵜⵜⵎⵓⴷⴷⵓ ⴳ ⵜⴳⵍⴷⵉⵜ ⴰⴽⴽⵯ, ⵙⴳ ⵉⵙⵡⴰⵇⵏ ⵏ ⵎⵕⵕⴰⴽⵛ ⴰⵔ ⵜⵉⵖⵔⵎⵉⵏ ⵜⵉⵇⴱⵓⵔⵉⵏ ⵏ ⴼⴰⵙ, ⴰⴼⴰⴷ ⴰⴷ ⴰⵡⵏ ⴷ ⵏⴰⵡⵉ ⵉⴳⵔⵔⵓⵊⵏ ⵉⵥⵉⵍⵏ ⵉⵜⵜⵓⵙⴽⴰⵔⵏ ⵙ ⵓⴼⵓⵙ. ⵜⴰⵡⵓⵔⵉ ⵏⵏⵖ ⵜⴳⴰ ⴰⵙⵏⴰⵍ ⵏ ⵉⵎⵙⵏⴼⵍⵓⵍⵏ ⵉⴷⵖⴰⵔⴰⵏⵏ ⴷ ⵓⵃⵟⵟⵓ ⵏ ⵜⵎⴳⵓⵔⵉ ⵍⵍⵉ ⵉⵍⵍⴰⵏ ⴳ ⵉⴳⵉⵎⵉⵏ ⵏ ⵉⵙⴳⴳⵯⴰⵙⵏ.",
      statsTitle: "ⴰⴼⵓⵙ ⵙ ⵉⵣⵡⵉⵍⵏ",
      stat1Value: "15+",
      stat1Label: "ⴰⵏⴰⵡⵏ ⵏ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ",
      stat2Value: "50+",
      stat2Label: "ⵜⵉⵎⵙⵎⵓⵏⵉⵏ ⵜⵉⴷⵖⴰⵔⴰⵏⵉⵏ",
      stat3Value: "12",
      stat3Label: "ⵜⵉⵖⵔⵎⵉⵏ",
      stat4Value: "100%",
      stat4Label: "ⵜⴰⵖⴰⵔⴰ ⵉⵥⵉⵍⵏ",
      teamTitle: "ⵎⵎⴰⴳⴳⴰⵔ ⴷ ⵜⵔⴰⴱⴱⵓⵜ ⵏⵏⵖ ⵍⵍⵉ ⵉⵙⵏⴰⵍⵏ ⵉⵏⴰⵥⵓⵕⵏ ⵉⵎⵖⵔⵉⴱⵉⵢⵏ",
      teamDesc: "ⴰⴼⴰⴷ ⴰⴷ ⵏⴳ ⴰⴳⴰⴷⴰⵣ ⵍⵍⵉ ⵜⵔⴰ ⵜⵎⵜⵜⴰ ⵏⵏⵖ, ⵉⵅⵚⵚⴰ ⵢⴰⵜ ⵜⵔⴰⴱⴱⵓⵜ ⵉⵎⵢⴰⵏⴰⵡⵏ ⵏ ⵉⵎⵙⵡⵓⵔⵉⵢⵏ ⵉⵙⵙⵓⵙⵎⵏ ⵙⴳ ⵓⵎⴰⴹⴰⵍ ⴰⴽⴽⵯ. ⵙⵙⵏ ⵉⵎⴷⴰⵏⵏ ⵍⵍⵉ ⵉⵙⵙⵓⴳⵔⵏ ⴰⴱⵔⵉⴷ ⴳ ⴰⴼⵓⵙ.",
      valuesTitle: "ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏⵏⵖ ⵜⵉⴷⵙⵍⴰⵏⵉⵏ",
      valuesDesc: "ⴽⵓ ⵜⴰⵖⴰⵡⵙⴰ ⵍⵍⵉ ⵏⵙⴽⴰⵔ ⴳ ⴰⴼⵓⵙ ⵜⴱⴷⴷⴰ ⴼ ⵜⵉⵔⴰⵜ ⵏⵏⵖ ⵏ ⵓⵃⵟⵟⵓ ⵏ ⵜⴰⵢⵙⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ ⴷ ⵓⵙⵏⴰⵍ ⵏ ⵉⵏⴰⵥⵓⵕⵏ ⵍⵍⵉ ⵜⵜ ⵉⵙⵙⵉⴷⵉⵔⵏ.",
      val1Title: "ⵙⴳ ⵓⵙⴰⴳⵯⵎ",
      val1Desc: "ⴰⵔ ⴽⵯⵏ ⵏⵣⴷⴰⵢ ⵙ ⵓⵎⴰⴷⴷⴰⵙ ⴷ ⵉⵏⴰⵥⵓⵕⵏ ⴳ ⵍⵎⵖⵔⵉⴱ ⴰⴽⴽⵯ, ⴰⵔ ⵏⴽⴽⵙ ⵉⵏⴰⵎⵎⴰⵙⵏ ⴰⴼⴰⴷ ⴰⴷ ⵏⵙⵏⴰⵍ ⵜⵉⵎⵜⵜⵉⵡⵉⵏ ⵜⵉⴷⵖⴰⵔⴰⵏⵉⵏ.",
      val2Title: "ⴰⵙⵏⴰⵍ ⵏ ⵉⵏⴰⵥⵓⵕⵏ",
      val2Desc: "ⴰⵏⵙⴰ ⵏⵏⵖ ⴰⵔ ⵉⵜⵜⵃⵟⵟⵓ ⵜⴰⵙⴱⴱⴰⴱⵜ ⵜⴰⵣⵔⴼⴰⵏⵜ ⴷ ⴰⵔ ⵉⵜⵜⴰⴽⴽⴰ ⵢⴰⵏ ⵡⴰⵏⴰⵡ ⵓⵙⵔⵉⴷ ⵉ ⵓⵎⵙⵙⵖ ⵍⵍⵉ ⵉⵜⵜⴳⴳⴰⵏ ⵓⴳⴳⴰⵔ ⵏ ⵉⵇⴰⵕⵉⴹⵏ ⴳ ⵉⴼⴰⵙⵙⵏ ⵏ ⵉⵎⵙⵏⴼⵍⵓⵍⵏ.",
      val3Title: "ⵜⴰⵖⴰⵔⴰ ⴷ ⵜⴰⵢⵙⵉ",
      val3Desc: "ⴰⵔ ⵏⵙⵜⴰⵢ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵉⵍⴰⵏ ⵜⴰⵖⴰⵔⴰ ⵢⴰⵜⵜⵓⵢⵏ ⵍⵍⵉ ⵉⵎⵎⴰⵍⵏ ⵉⴳⵉⵎⵉⵏ ⵏ ⵉⵙⴳⴳⵯⴰⵙⵏ ⵏ ⵜⴰⵏⵙⴰⵢⵜ, ⵙⴳ ⵣⵣⵍⵍⵉⵊ ⵉⴼⴰⵡⵏ ⴰⵔ ⵜⴰⵡⵓⵔⵉ ⵏ ⵉⵍⵎ ⵉⵥⵉⵍⵏ.",
    }
  }[lang] || {
      breadcrumb: "About Us",
      heroTitle: "Our Story",
      heroSubtitle: "ⴰⵎⵣⵔⵓⵢ ⵏⵏⵖ",
      heroDesc: "Afus was born from a deep respect for Moroccan heritage and a desire to connect traditional artisans with the world. We travel across the kingdom, from the bustling souks of Marrakech to the ancient medinas of Fez, to bring you authentic, handcrafted treasures. Our mission is to empower local creators and preserve centuries-old craftsmanship.",
      statsTitle: "Afus in Numbers",
      stat1Value: "15+",
      stat1Label: "Product Categories",
      stat2Value: "50+",
      stat2Label: "Local Cooperatives",
      stat3Value: "12",
      stat3Label: "Cities Covered",
      stat4Value: "100%",
      stat4Label: "Authenticity",
      teamTitle: "Meet our dedicated team supporting Moroccan artisans",
      teamDesc: "To be the marketplace our community wants us to be, it takes an eclectic group of passionate operators from all around the world. Get to know the people leading the way at Afus.",
      valuesTitle: "Our Core Values",
      valuesDesc: "Everything we do at Afus is guided by our commitment to preserving Moroccan heritage and empowering the artisans who keep it alive.",
      val1Title: "Direct from Source",
      val1Desc: "We connect you directly with artisans across Morocco, cutting out the middlemen to support local communities.",
      val2Title: "Empowering Artisans",
      val2Desc: "Our platform ensures fair trade and provides a direct-to-consumer model that puts more money directly into the hands of the creators.",
      val3Title: "Quality & Heritage",
      val3Desc: "We curate high-quality products that reflect centuries of tradition, from intricate zellige to masterful leatherwork.",
    };

  const TEAM_MEMBERS = [
    {
      name: "Amélie Laurent",
      role: "Founder & CEO",
      bio: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Nikolas Gibbons",
      role: "Engineering Manager",
      bio: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Sienna Hewitt",
      role: "Product Manager",
      bio: "Former PM for Linear, Lambda School, Squarespace Domains, and On Deck.",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1b4492?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Zahra Christensen",
      role: "Backend Developer",
      bio: "Lead backend dev at Clearbit. Former Clearbit and Loom.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Yazid Talbi",
      role: "Operations Manager",
      bio: "Expert in supply chain and logistics. Ensuring smooth delivery across Morocco.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Salma Rizqi",
      role: "Artisan Relations",
      bio: "On-the-ground support for our artisans. Helping them digitize their historic businesses.",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Amine Benali",
      role: "Marketing Director",
      bio: "Telling the story of Afus to the world. Former marketing lead at global retail brands.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Leila Tahiri",
      role: "Customer Success",
      bio: "Dedicated to providing exceptional support for both buyers and sellers.",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80",
    }
  ];

  return (
    <div className="space-y-12 pb-12 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": t.breadcrumb,
            "description": t.heroDesc,
            "publisher": {
              "@type": "Organization",
              "name": "afus",
              "logo": "https://afus.ma/icon.png"
            }
          })
        }}
      />

      {/* Hero (History) - Inspired by City Page */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative w-full arabic-frame overflow-hidden min-h-[300px] md:min-h-[400px] flex flex-col"
          style={{ backgroundColor: "#38103e" }}
        >
          <div className="flex-1 flex flex-col items-center text-center justify-center px-8 md:px-14 py-12 md:py-20 z-10">
            <p
              className="mb-2 text-xl md:text-2xl"
              style={{ color: "#f5eafb", fontFamily: "'Noto Sans Tifinagh', sans-serif", opacity: 0.8 }}
            >
              {t.heroSubtitle}
            </p>
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold !font-ariom leading-tight mb-4"
              style={{ color: "#f5eafb" }}
            >
              {t.heroTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed" style={{ color: "#f5eafb", opacity: 0.9 }}>
              {t.heroDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics - Inspired by Shop Page */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-neutral-200 arabic-frame p-[1px]">
          <div className="flex flex-wrap justify-center items-center py-8 bg-neutral-50 arabic-frame">
            <div className="flex w-full flex-col md:flex-row justify-center items-center text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200">
              <div className="flex flex-col items-center px-8 py-4 md:py-0 w-full md:w-auto">
                <span className="font-bold text-black text-3xl md:text-4xl leading-none mb-2">{t.stat1Value}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{t.stat1Label}</span>
              </div>
              <div className="flex flex-col items-center px-8 py-4 md:py-0 w-full md:w-auto">
                <span className="font-bold text-black text-3xl md:text-4xl leading-none mb-2">{t.stat2Value}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{t.stat2Label}</span>
              </div>
              <div className="flex flex-col items-center px-8 py-4 md:py-0 w-full md:w-auto">
                <span className="font-bold text-black text-3xl md:text-4xl leading-none mb-2">{t.stat3Value}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{t.stat3Label}</span>
              </div>
              <div className="flex flex-col items-center px-8 py-4 md:py-0 w-full md:w-auto">
                <span className="font-bold text-black text-3xl md:text-4xl leading-none mb-2">{t.stat4Value}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{t.stat4Label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-3xl mb-20 text-center mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold !font-ariom text-[#2a0a1e] mb-4">
            {t.valuesTitle}
          </h2>
          <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
            {t.valuesDesc}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neutral-200 arabic-frame p-[1px]">
            <div className="flex flex-col items-center text-center pt-12 px-6 pb-10 bg-white arabic-frame h-full">
              <div className="relative flex items-center justify-center h-12 w-12 mb-4">
                <svg className="absolute inset-0 h-full w-full scale-[1.5] text-[#f5eafb] opacity-100" width="24" height="24" viewBox="0 0 108 110" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M54.1416 0.291992L70.5439 16.6943H92.1592V38.8096L107.913 54.5645L107.991 54.6426L92.1592 70.4746V92.8408H70.5439L54.1416 109.243V109.535L53.9951 109.389L53.8496 109.535V109.243L37.4473 92.8408H15.832V70.4746L0 54.6426L0.078125 54.5645L15.832 38.8096V16.6943H37.4473L53.8496 0.291992V0L53.9951 0.145508L54.1416 0V0.291992Z"></path>
                </svg>
                <div className="relative z-10 text-[#532e71]">
                  <IconShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-[#2a0a1e] mb-2">{t.val1Title}</h3>
              <p className="text-base text-neutral-600 max-w-[80%]">{t.val1Desc}</p>
            </div>
          </div>
          <div className="bg-neutral-200 arabic-frame p-[1px]">
            <div className="flex flex-col items-center text-center pt-12 px-6 pb-10 bg-white arabic-frame h-full">
              <div className="relative flex items-center justify-center h-12 w-12 mb-4">
                <svg className="absolute inset-0 h-full w-full scale-[1.5] text-[#f5eafb] opacity-100" width="24" height="24" viewBox="0 0 108 110" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M54.1416 0.291992L70.5439 16.6943H92.1592V38.8096L107.913 54.5645L107.991 54.6426L92.1592 70.4746V92.8408H70.5439L54.1416 109.243V109.535L53.9951 109.389L53.8496 109.535V109.243L37.4473 92.8408H15.832V70.4746L0 54.6426L0.078125 54.5645L15.832 38.8096V16.6943H37.4473L53.8496 0.291992V0L53.9951 0.145508L54.1416 0V0.291992Z"></path>
                </svg>
                <div className="relative z-10 text-[#532e71]">
                  <IconHeartHandshake className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-[#2a0a1e] mb-2">{t.val2Title}</h3>
              <p className="text-base text-neutral-600 max-w-[80%]">{t.val2Desc}</p>
            </div>
          </div>
          <div className="bg-neutral-200 arabic-frame p-[1px]">
            <div className="flex flex-col items-center text-center pt-12 px-6 pb-10 bg-white arabic-frame h-full">
              <div className="relative flex items-center justify-center h-12 w-12 mb-4">
                <svg className="absolute inset-0 h-full w-full scale-[1.5] text-[#f5eafb] opacity-100" width="24" height="24" viewBox="0 0 108 110" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M54.1416 0.291992L70.5439 16.6943H92.1592V38.8096L107.913 54.5645L107.991 54.6426L92.1592 70.4746V92.8408H70.5439L54.1416 109.243V109.535L53.9951 109.389L53.8496 109.535V109.243L37.4473 92.8408H15.832V70.4746L0 54.6426L0.078125 54.5645L15.832 38.8096V16.6943H37.4473L53.8496 0.291992V0L53.9951 0.145508L54.1416 0V0.291992Z"></path>
                </svg>
                <div className="relative z-10 text-[#532e71]">
                  <IconTools className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-[#2a0a1e] mb-2">{t.val3Title}</h3>
              <p className="text-base text-neutral-600 max-w-[80%]">{t.val3Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section (Hidden for now) */}
      {/*
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl md:text-5xl font-medium !font-ariom text-[#2a0a1e] mb-4">
            {t.teamTitle}
          </h2>
          <p className="text-neutral-600 text-lg leading-relaxed">
            {t.teamDesc}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {TEAM_MEMBERS.map((member, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="w-full aspect-square bg-neutral-200 mb-4 overflow-hidden shadow-sm">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-lg text-black">{member.name}</h3>
              <p className="text-[#2a0a1e] font-medium text-sm mb-2">{member.role}</p>
              <p className="text-neutral-500 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
      */}

      {/* Trust Banner */}
      <div className="w-full pt-12">
        <TrustBanner lang={lang} />
      </div>

    </div>
  );
}
