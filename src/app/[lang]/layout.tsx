import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LanguageModal from "@/components/ui/LanguageModal";
import BetaReportFab from "@/components/ui/BetaReportFab";
import { Readex_Pro } from 'next/font/google';
import { Toaster } from "sonner";
import "../globals.css";

const readexPro = Readex_Pro({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-readex-pro',
});

const metaTranslations: Record<string, {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDesc: string;
}> = {
  en: {
    title: "afus - moroccan cash on delivery artisan marketplace",
    description: "redefining moroccan crafts with transparent cod tracking and amana barid bank logistics integration. Buy direct from Marrakech, Fez, Rabat artisans.",
    keywords: "Moroccan artisans, handmade Moroccan rugs, traditional zellige tilework, cash on delivery Morocco, Marrakech artisan crafts, Fez leather tanneries, buy direct from Moroccan weavers, Amana shipping Morocco, authentic Berber carpets, Moroccan pottery, handcrafted Moroccan home decor, how to buy Berber rug online",
    ogTitle: "afus | Authentic Handcrafted Moroccan Marketplace",
    ogDesc: "Discover, buy, and track authentic Moroccan artisan crafts directly from the makers with national Cash on Delivery tracking."
  },
  fr: {
    title: "afus - marché artisanal marocain avec paiement à la livraison",
    description: "redéfinir l'artisanat marocain avec un suivi transparent du paiement à la livraison et de la logistique Amana d'Al Barid Bank. Achetez directement auprès d'artisans à Marrakech, Fès, Rabat.",
    keywords: "artisans marocains, tapis berbères fait main, zellige traditionnel, paiement à la livraison Maroc, artisanat Marrakech, tanneries Fès, acheter direct artisans, livraison Amana, déco marocaine, poterie marocaine, artisanat marocain de luxe, comment acheter un vrai tapis berbère",
    ogTitle: "afus | Place de marché de l'artisanat marocain authentique",
    ogDesc: "Découvrez, achetez et suivez l'artisanat marocain authentique directement auprès des créateurs avec suivi national du paiement à la livraison."
  },
  ar: {
    title: "أفوس - سوق الحرف اليدوية المغربية بالدفع عند الاستلام",
    description: "إعادة تعريف الحرف اليدوية المغربية مع تتبع شفاف للدفع عند الاستلام والتكامل اللوجستي لأمانة بريد المغرب. اشترِ مباشرة من حرفيي مراكش وفاس والرباط.",
    keywords: "حرفيين مغاربة, صناعة تقليدية مغربية, زليج مغربي, الدفع عند الاستلام المغرب, سجاد أمازيغي, دباغة الجلود فاس, سوق الحرفيين مراكش, شحن أمانة بريد المغرب, الفخار المغربي, ديكور مغربي مصنوع يدويًا, شراء سجاد بربري أصلي",
    ogTitle: "أفوس | سوق الحرف اليدوية المغربية الأصيلة",
    ogDesc: "اكتشف واشترِ وتتبع الحرف المغربية الأصيلة مباشرة من الصانعين مع تتبع وطني للدفع عند الاستلام."
  },
  tz: {
    title: "afus - ⵜⴰⵣⵣⵓⵍⵜ ⵏ ⵜⵎⴳⵓⵔⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ ⵙ ⵓⴼⵓⵙ",
    description: "ⴰⴼⵓⵙ ⵉⴳⴰ ⴰⴷⵖⴰⵔ ⵏ ⵓⵙⴳⴷⵣ ⵏ ⵜⵎⴳⵓⵔⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ ⵜⴰⵇⴱⵓⵔⵜ. ⵙⵉⴷⴼ ⴷ ⵥⵕ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵉⴼⴰⵙⵙⵏ ⵙⴳ ⵎⵕⵕⴰⴽⵛ, ⴼⴰⵙ, ⵕⴱⴰⵟ.",
    keywords: "ⵉⵎⴳⵓⵔⵉⵢⵏ ⵉⵎⵖⵔⵉⴱⵉⵢⵏ, ⵉⵥⵕⴱⴰⵢ ⵉⵎⴰⵣⵉⵖⵏ, ⵣⵣⵍⵍⵉⵊ ⴰⵎⵖⵔⵉⴱⵉ, ⵜⴰⵎⴳⵓⵔⵉ ⵜⴰⵇⴱⵓⵔⵜ",
    ogTitle: "afus | ⵜⴰⴳⵔⵓⵎⵎⴰ ⵏ ⵜⵎⴳⵓⵔⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ",
    ogDesc: "ⴰⴼ ⴷ ⵥⵕ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵉⴼⴰⵙⵙⵏ ⵙⴳ ⵉⵎⴳⵓⵔⵉⵢⵏ ⵉⵎⵖⵔⵉⴱⵉⵢⵏ ⵙ ⵜⵡⵓⵔⵉ ⵏ ⵓⴼⵓⵙ."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> | { lang: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";
  const t = metaTranslations[lang as keyof typeof metaTranslations] || metaTranslations.en;

  return {
    title: {
      template: "%s - afus",
      default: t.title,
    },
    description: t.description,
    keywords: t.keywords,
    metadataBase: new URL("https://afus.ma"),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        fr: "/fr",
        ar: "/ar",
        tz: "/tz",
      } as any,
    },
    openGraph: {
      title: t.ogTitle,
      description: t.ogDesc,
      url: `https://afus.ma/${lang}`,
      siteName: "afus",
      images: [
        {
          url: "/icon.png",
          width: 512,
          height: 512,
          alt: "afus logo",
        },
      ],
      locale: lang === "ar" ? "ar_MA" : lang === "fr" ? "fr_MA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.ogTitle,
      description: t.ogDesc,
      images: ["/icon.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} className={`h-full ${readexPro.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-black antialiased font-sans" suppressHydrationWarning>
        <WishlistProvider>
        <CartProvider>
          <LanguageModal currentLang={lang} />
          {children}
          <BetaReportFab />
          <Toaster position="top-center" richColors />
          <SpeedInsights />
        </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
