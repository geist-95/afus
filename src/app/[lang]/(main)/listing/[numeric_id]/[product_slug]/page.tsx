import { Suspense } from "react";
import ListingClientWrapper from "./ListingClientWrapper";
import { ProductPageSkeleton } from "@/components/ui/Skeleton";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string; numeric_id: string; product_slug: string }>;
  searchParams: Promise<{ t?: string; p?: string; img?: string; s?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const lang = resolvedParams.lang;
  
  const title = resolvedSearchParams.t || "Artisan Craft";
  const price = resolvedSearchParams.p || "0";
  const imageUrl = resolvedSearchParams.img || "";
  const shopName = resolvedSearchParams.s || "Traditional Artisan";

  const descriptions = {
    en: `This authentic handmade item by ${shopName} is available on Afus for ${price} MAD. Buy direct from Moroccan artisans with secure delivery.`,
    fr: `Cet article authentique fait main proposé par ${shopName} est disponible sur Afus pour ${price} DH. Achetez directement aux artisans marocains avec livraison sécurisée.`,
    ar: `هذا المنتج الأصلي المصنوع يدويًا بواسطة ${shopName} متوفر على Afus مقابل ${price} درهم. اشترِ مباشرة من الحرفيين المغاربة مع توصيل آمن.`,
    tz: `ⴰⵢⴰⵡ ⴰⴷ ⵏ ⵓⴼⵓⵙ ⵙⴳ ${shopName} ⵉⵍⵍⴰ ⴳ Afus ⵙ ${price} MAD. ⵙⵖ ⵙⴳ ⵉⵎⴳⵓⵔⵉⵢⵏ ⵏ ⵍⵎⵖⵔⵉⴱ.`
  };

  const desc = (descriptions as any)[lang] || descriptions.en;
  const pageTitle = `${title} - Afus`;

  return {
    title: pageTitle,
    description: desc,
    keywords: `${title}, ${shopName}, moroccan craft, buy ${title} online, cod morocco, amana shipping, geo optimized`,
    openGraph: {
      title: pageTitle,
      description: desc,
      url: `https://afus.ma/${lang}/listing/${resolvedParams.numeric_id}/${resolvedParams.product_slug}`,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, alt: title }] : []
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      images: imageUrl ? [imageUrl] : [],
    }
  };
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

  const descriptions = {
    en: `Buy authentic handmade ${title} for ${price} MAD from ${shopName}. High-quality Moroccan craftsmanship with Cash on Delivery and Amana tracking.`,
    fr: `Achetez ${title} authentique fait main pour ${price} DH de ${shopName}. Artisanat marocain de qualité supérieure, paiement à la livraison via Amana.`,
    ar: `اشترِ ${title} أصيلة مصنوعة يدويًا مقابل ${price} درهم من ${shopName}. جودة عالية من الصناعة التقليدية المغربية مع الدفع عند الاستلام.`,
    tz: `ⵀⴰ ⵜⵉⵡⵓⵔⵉ ⵏ ⵓⴼⵓⵙ ${title} ⵙ ⵜⵉⴳⴳⵉ ${price} MAD ⵙⴳ ${shopName}.`
  };
  const desc = (descriptions as any)[lang] || descriptions.en;

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": title,
            "image": imageUrl || "https://afus.ma/icon.png",
            "description": desc,
            "offers": {
              "@type": "Offer",
              "price": price.replace(/[^0-9]/g, "") || "0",
              "priceCurrency": "MAD",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": shopName
              }
            }
          })
        }}
      />
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
