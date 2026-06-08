import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LanguageModal from "@/components/ui/LanguageModal";
import { Readex_Pro } from 'next/font/google';
import "../globals.css";

const readexPro = Readex_Pro({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-readex-pro',
});

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

  return (
    <html lang={lang} dir={dir} className={`h-full ${readexPro.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-black antialiased font-sans" suppressHydrationWarning>
        <WishlistProvider>
        <CartProvider>
          <LanguageModal currentLang={lang} />
          {children}
          <SpeedInsights />
        </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
