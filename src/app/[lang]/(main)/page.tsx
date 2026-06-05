import Link from "next/link";
import { fetchProducts, fetchShops } from "@/lib/supabase";
import DynamicTrailsClient from "@/components/ui/DynamicTrailsClient";
import HomeCarousel from "@/components/ui/HomeCarousel";
import BrowseByCategory from "@/components/ui/BrowseByCategory";
import CitiesSection from "@/components/ui/CitiesSection";
import TrustBanner from "@/components/ui/TrustBanner";
// import ReviewsCarousel from "@/components/ui/ReviewsCarousel";

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
      {/* Editorial Hero Banner / Carousel — breaks out of main padding to go full-width */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <HomeCarousel />
      </div>

      {/* Browse by Category */}
      <BrowseByCategory lang={lang} />

      {/* Cities */}
      <CitiesSection lang={lang} />

      {/* Dynamic Trails & FAQ section */}
      <DynamicTrailsClient products={products} shops={shops} lang={lang} />

      {/* Trust Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <TrustBanner lang={lang} />
      </div>
    </div>
  );
}
