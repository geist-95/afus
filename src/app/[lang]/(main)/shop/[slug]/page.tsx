import { fetchProducts, fetchShopBySlug, fetchProfile, fetchShopReviews } from "@/lib/supabase";
import ShopClientWrapper from "./ShopClientWrapper";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const shop = await fetchShopBySlug(slug);
  if (!shop) {
    return {
      title: "Shop Not Found"
    };
  }

  const desc = shop.metadata?.description || shop.description_translations?.[lang as 'en'|'fr'|'ar'] || shop.description_translations?.en || `Visit ${shop.name} to view their unique handcrafted Moroccan collection.`;

  return {
    title: shop.name,
    description: desc,
    keywords: `${shop.name}, moroccan shop, authentic artisan ${shop.name}, moroccan crafts, geo optimized`,
    openGraph: {
      title: `${shop.name} - afus`,
      description: desc,
      url: `https://afus.ma/${lang}/shop/${slug}`,
      type: "website",
      images: shop.metadata?.cover_url ? [{ url: shop.metadata.cover_url, alt: shop.name }] : []
    }
  };
}

export default async function ShopPage({ params }: PageProps) {
  const { lang, slug } = await params;

  // Find the shop matching the slug
  const shop = await fetchShopBySlug(slug);

  // Filter products by this shop
  const allProducts = await fetchProducts();
  const shopProducts = allProducts.filter((p) => p.shop_id === shop.id);

  let owner = null;
  try {
    if (shop.owner_id) {
      owner = await fetchProfile(shop.owner_id);
    }
  } catch (error) {
    console.error("Failed to fetch shop owner", error);
  }

  let reviews: any[] = [];
  try {
    reviews = await fetchShopReviews(shop.id);
  } catch (error) {
    console.error("Failed to fetch shop reviews", error);
  }
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : (shop.average_rating || "5.0");

  const logoPlaceholder = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80";
  const logoUrl = shop.metadata?.logo_url || shop.logo_url || logoPlaceholder;

  return (
    <div className="w-full pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "name": shop.name,
            "image": logoUrl || "https://afus.ma/icon.png",
            "description": shop.metadata?.description || shop.description_translations?.en || `Visit ${shop.name} to view their unique handcrafted Moroccan collection.`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": shop.merchant_city || "Marrakech",
              "addressCountry": "MA"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": shop.average_rating || "5.0",
              "reviewCount": reviews.length || "1"
            }
          })
        }}
      />
      <ShopClientWrapper
        initialShop={shop}
        shopProducts={shopProducts}
        owner={owner}
        reviews={reviews}
        averageRating={averageRating}
        lang={lang}
        slug={slug}
      />
    </div>
  );
}
