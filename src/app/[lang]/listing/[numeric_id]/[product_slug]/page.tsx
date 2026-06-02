import { Suspense } from "react";
import ListingClientWrapper from "./ListingClientWrapper";
import { ProductPageSkeleton } from "@/components/ui/Skeleton";

interface PageProps {
  params: Promise<{ lang: string; numeric_id: string; product_slug: string }>;
  searchParams: Promise<{ t?: string; p?: string; img?: string; s?: string }>;
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const lang = resolvedParams.lang;
  const numericId = parseInt(resolvedParams.numeric_id, 10);
  const productSlug = resolvedParams.product_slug;

  const title = resolvedSearchParams.t || "artisan craft";
  const price = resolvedSearchParams.p || "0";
  const imageUrl = resolvedSearchParams.img || "";
  const shopName = resolvedSearchParams.s || "traditional artisan";

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ListingClientWrapper
        lang={lang}
        numericId={numericId}
        productSlug={productSlug}
        initialTitle={title}
        initialPrice={price}
        initialImage={imageUrl}
        initialShopName={shopName}
      />
    </Suspense>
  );
}
