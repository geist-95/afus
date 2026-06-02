import Link from "next/link";
import { fetchProducts, fetchShops } from "@/lib/supabase";
import DynamicTrailsClient from "@/components/ui/DynamicTrailsClient";

interface PageProps {
  params: Promise<{ lang: string }> | { lang: string };
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  const products = await fetchProducts();
  const shops = await fetchShops();

  // Trilingual hero translation strings
  const pageLabels: Record<string, Record<string, string>> = {
    en: {
      heroTitle: "Discover Handcrafted Moroccan Treasures.",
      heroSubtitle: "Buy direct from traditional artisans in Marrakech, Fez, and Sale. Pay cash on delivery via national Al Barid Bank Amana network.",
    },
    fr: {
      heroTitle: "Découvrez les trésors artisanaux du Maroc.",
      heroSubtitle: "Achetez directement auprès d'artisans traditionnels de Marrakech, Fès et Salé. Payez à la livraison par le réseau national Amana.",
    },
    ar: {
      heroTitle: "اكتشف الكنوز الحرفية المغربية.",
      heroSubtitle: "اشترِ مباشرة من الحرفيين التقليديين في مراكش وفاس وسلا. الدفع عند الاستلام عبر شبكة أمانة الوطنية لبريد المغرب.",
    }
  };

  const t = pageLabels[lang] || pageLabels.en;

  return (
    <div className="space-y-16">
      {/* Editorial Hero Banner */}
      <section className="bg-primary/5 rounded-3xl p-8 md:p-16 flex flex-col justify-center items-start text-left min-h-[350px]">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black max-w-3xl leading-tight">
          {t.heroTitle}
        </h1>
        <p className="mt-6 text-sm md:text-base font-medium text-black/75 max-w-2xl leading-relaxed">
          {t.heroSubtitle}
        </p>
      </section>

      {/* Dynamic Trails & FAQ section */}
      <DynamicTrailsClient products={products} shops={shops} lang={lang} />
    </div>
  );
}
