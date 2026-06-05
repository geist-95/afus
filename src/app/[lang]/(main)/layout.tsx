import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import FAQSection from "@/components/ui/FAQSection";

interface MainLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}

export default async function MainLayout({ children, params }: MainLayoutProps) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  // Translated system labels
  const labels: Record<string, Record<string, string>> = {
    en: {
      promo: "Free amana shipping across morocco for all cash on delivery orders",
      footerDesc: "afus is a modern two-sided multi-vendor marketplace connecting moroccan artisans directly with clients. fully optimized for cash on delivery (cod) markets using al barid bank amana tracking.",
      rights: "all rights reserved.",
    },
    fr: {
      promo: "Livraison amana gratuite partout au maroc pour toutes les commandes en paiement à la livraison",
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
    <>
      {/* Auth-aware NavBar (client component) */}

      {/* Auth-aware NavBar (client component) */}
      <NavBar lang={lang} />

      {/* Page Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <FAQSection lang={lang} />
      {/* Flat Footer */}
      <Footer lang={lang} />
    </>
  );
}
