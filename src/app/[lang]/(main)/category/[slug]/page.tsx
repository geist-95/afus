import Link from "next/link";
import { fetchProducts, fetchShops, staticCategories } from "@/lib/supabase";
import ProductGrid from "@/components/ui/ProductGrid";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const activeCategory = staticCategories.find((c) => c.slug === slug);
  const categoryName = activeCategory
    ? activeCategory.name[lang as 'en'|'fr'|'ar'] || activeCategory.name.en
    : slug;

  const descriptions = {
    en: `Explore authentic, handmade ${categoryName} from Moroccan master artisans. Direct shipping and secure Cash on Delivery logistics via Amana.`,
    fr: `Découvrez des articles de ${categoryName} authentiques et faits main par des maîtres artisans marocains. Livraison directe et paiement à la livraison via Amana.`,
    ar: `اكتشف ${categoryName} الأصيلة والمصنوعة يدويًا من قبل كبار الحرفيين المغاربة. شحن مباشر ودفع آمن عند الاستلام مع أمانة.`
  };

  const desc = (descriptions as any)[lang] || descriptions.en;

  return {
    title: categoryName,
    description: desc,
    keywords: `${categoryName}, moroccan ${categoryName}, handmade ${categoryName}, afus category`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { lang, slug } = await params;

  // Find the category
  const activeCategory = staticCategories.find((c) => c.slug === slug);
  const categoryName = activeCategory
    ? activeCategory.name[lang as 'en'|'fr'|'ar'] || activeCategory.name.en
    : slug;

  // Fetch live products and shops
  const allProducts = await fetchProducts();
  const shops = await fetchShops();

  // Filter products
  const matchingProducts = allProducts.filter((p) => {
    const isDirectMatch = p.category_id === activeCategory?.id;
    const legacyMappedId = p.category_id === '1a111111-1111-1111-1111-111111111111' ? 'cat_jewelry'
      : p.category_id === '2b222222-2222-2222-2222-222222222222' ? 'cat_art_collectibles'
      : p.category_id === '3c333333-3333-3333-3333-333333333333' ? 'cat_bath_beauty'
      : p.category_id === '4d444444-4444-4444-4444-444444444444' ? 'cat_clothing'
      : p.category_id === '5e555555-5555-5555-5555-555555555555' ? 'cat_bags_purses'
      : p.category_id === '6f666666-6666-6666-6666-666666666666' ? 'cat_home_living'
      : p.category_id;
    return isDirectMatch || legacyMappedId === activeCategory?.id;
  });

  const labels: Record<string, Record<string, string>> = {
    en: {
      title: "category catalog",
      empty: "no items found in this category yet.",
      mad: "mad",
      view: "view item",
      ships: "ships from",
    },
    fr: {
      title: "catalogue de catégorie",
      empty: "aucun article trouvé dans cette catégorie.",
      mad: "dh",
      view: "voir l'article",
      ships: "expédié de",
    },
    ar: {
      title: "دليل الفئة",
      empty: "لم يتم العثور على سلع في هذه الفئة بعد.",
      mad: "درهم",
      view: "عرض السلعة",
      ships: "الشحن من",
    }
  };

  const t = labels[lang] || labels.en;

  const count = matchingProducts.length;
  const countLabel = lang === 'fr' 
    ? `${count} ${count > 1 ? 'articles trouvés' : 'article trouvé'}` 
    : lang === 'ar' 
      ? `تم العثور على ${count} ${count > 1 ? 'منتجات' : 'منتج'}` 
      : `${count} ${count > 1 ? 'items found' : 'item found'}`;

  const categoryDescription = {
    en: `Explore authentic, handmade ${categoryName} from Moroccan master artisans. Direct shipping and secure Cash on Delivery logistics via Amana.`,
    fr: `Découvrez des articles de ${categoryName} authentiques et faits main par des maîtres artisans marocains. Livraison directe et paiement à la livraison via Amana.`,
    ar: `اكتشف ${categoryName} الأصيلة والمصنوعة يدويًا من قبل كبار الحرفيين المغاربة. شحن مباشر ودفع آمن عند الاستلام مع أمانة.`
  }[lang as 'en'|'fr'|'ar'] || `Explore authentic, handmade ${categoryName} from Moroccan master artisans.`;

  const categoryTifinagh = activeCategory?.name.tz || "";

  return (
    <div className="space-y-10 pb-16">
      {/* Premium Hero Banner Inspired by Cities Card */}
      <div 
        className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 p-10 md:p-14 text-center arabic-frame shadow-sm flex flex-col items-center justify-center min-h-[160px] md:min-h-[200px]"
        style={{ backgroundColor: '#f1f1f1' }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold !font-ariom leading-tight normal-case"
            style={{ color: '#000000' }}
          >
            {categoryName}
          </h1>
          {categoryTifinagh && (
            <span
              className="text-base md:text-lg lg:text-xl leading-none"
              style={{
                color: '#4b5563',
                fontFamily: "'Noto Sans Tifinagh', sans-serif",
                opacity: 0.85,
              }}
            >
              {categoryTifinagh}
            </span>
          )}
        </div>
      </div>

      {/* Product List Section */}
      <div className="space-y-6">
        <ProductGrid 
          initialProducts={matchingProducts} 
          shops={shops} 
          lang={lang} 
          categorySlug={slug}
          categoryFilterId={activeCategory?.id}
        />
      </div>
    </div>
  );
}
