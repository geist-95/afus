import type { Metadata } from "next";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";

export const metadata: Metadata = {
  title: "afus - moroccan cash on delivery artisan marketplace",
  description: "redefining moroccan crafts with transparent cod tracking and amana barid bank logistics integration.",
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  // Translated system labels
  const labels: Record<string, Record<string, string>> = {
    en: {
      promo: "free amana shipping across morocco for all cash on delivery orders",
      footerDesc: "afus is a modern two-sided multi-vendor marketplace connecting moroccan artisans directly with clients. fully optimized for cash on delivery (cod) markets using al barid bank amana tracking.",
      rights: "all rights reserved.",
    },
    fr: {
      promo: "livraison amana gratuite partout au maroc pour toutes les commandes en paiement à la livraison",
      footerDesc: "afus est une place de marché moderne reliant directement les artisans marocains aux clients. entièrement optimisée pour le paiement à la livraison (cod) avec suivi amana d'al barid bank.",
      rights: "tous droits réservés.",
    },
    ar: {
      promo: "شحن أمانة مجاني في جميع أنحاء المغرب لجميع طلبات الدفع عند الاستلام",
      footerDesc: "أفوس هي منصة سوقية حديثة تربط الحرفيين المغاربة مباشرة بالزبائن. معززة بالكامل لنظام الدفع عند الاستلام مع تتبع أمانة بريد بنك المغرب.",
      rights: "جميع الحقوق محفوظة.",
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <html lang={lang} dir={dir} className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-black font-sans antialiased" suppressHydrationWarning>
        <WishlistProvider>
        <CartProvider>
          {/* Promotional Banner */}
          <div className="bg-black text-white text-center py-2 px-4 text-xs tracking-wider lowercase border-b border-black font-mono">
            {t.promo}
          </div>

          {/* Auth-aware NavBar (client component) */}
          <NavBar lang={lang} />

          {/* Page Content */}
          <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Flat Footer */}
          <Footer lang={lang} />
          <SpeedInsights />
        </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
