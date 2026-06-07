'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';

interface ProductGridProps {
  initialProducts: any[];
  shops: any[];
  lang: string;
  categorySlug?: string;
  categoryFilterId?: string;
  shopFilterId?: string;
}

export function SimpleProductCard({ product, lang, shop, className }: { product: any; lang: string; shop?: any; className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const title =
    product?.title_translations?.[lang as 'en' | 'fr' | 'ar'] ||
    product?.title_translations?.en ||
    'Artisan product';
  const price = product?.base_price_mad;
  const img = product?.media_gallery?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop';
  const imgHover = product?.media_gallery?.[1];
  const numId = product?.numeric_id;
  const slug =
    product?.slug_translations?.[lang as 'en' | 'fr' | 'ar'] ||
    product?.slug_translations?.en ||
    'product';
  const shopName = shop?.name || 'Artisan';

  return (
    <Link 
      href={`/${lang}/listing/${numId}/${slug}`} 
      className={`group block ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative overflow-hidden bg-neutral-100 arabic-frame">
        <img
          src={isHovered && imgHover ? imgHover : img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-sm font-medium text-neutral-800 truncate leading-tight">{title}</p>
        <p className="text-xs font-light text-neutral-500 line-clamp-1">{shopName}</p>
        <p className="text-base font-bold text-black">{price} MAD</p>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-black">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          ))}
          <span className="text-[10px] text-neutral-500 ml-1 font-medium">(24)</span>
        </div>
      </div>
    </Link>
  );
}

export function ProductCard({
  product,
  shop,
  lang,
  t,
}: {
  product: any;
  shop: any;
  lang: string;
  t: Record<string, string>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const title = product?.title_translations?.[lang as 'en' | 'fr' | 'ar'] || product?.title_translations?.en || 'artisan craft';
  const isSaleActive = product.sale_price_mad !== null && product.sale_price_mad !== undefined &&
    (!product.sale_expires_at || new Date(product.sale_expires_at) > new Date());
  const prodSlug = product?.slug_translations?.[lang as 'en' | 'fr' | 'ar'] || product?.slug_translations?.en || 'product';
  const destinationUrl = `/${lang}/listing/${product.numeric_id}/${prodSlug}`;

  const firstMedia = product.media_gallery?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop';
  const secondMedia = product.media_gallery?.[1];
  const hasSecondMedia = !!secondMedia;

  const isVideo = (url?: string) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.includes('data:video/') || url.includes('video');
  };

  const hasVideo = isVideo(firstMedia) || isVideo(secondMedia);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-default`,
      product_id: product.id,
      variant_id: null,
      shop_id: product.shop_id,
      shop_city: shop?.merchant_city || 'Marrakech',
      title: title,
      price_mad: isSaleActive ? product.sale_price_mad : product.base_price_mad,
      quantity: 1,
      image: firstMedia,
    });
  };

  return (
    <div
      className="flex flex-col bg-transparent overflow-hidden transition-all duration-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image / Media Container */}
      <div className="h-72 relative bg-neutral-50 overflow-hidden rounded-2xl">
        <Link href={destinationUrl} className="w-full h-full block">
          {isHovered && hasSecondMedia ? (
            isVideo(secondMedia) ? (
              <video
                src={secondMedia}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <img
                src={secondMedia}
                alt={title}
                className="w-full h-full object-cover rounded-2xl transition-opacity duration-300"
              />
            )
          ) : isHovered && isVideo(firstMedia) ? (
            <video
              src={firstMedia}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <img
              src={firstMedia}
              alt={title}
              className="w-full h-full object-cover rounded-2xl"
            />
          )}
        </Link>

        {/* Popular / Sale Tag */}
        {isSaleActive ? (
          <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold rounded-full border border-neutral-100 px-3 py-1 shadow-sm uppercase">
            sale
          </span>
        ) : shop?.is_verified ? (
          <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold rounded-full border border-neutral-100 px-3 py-1 shadow-sm">
            Populaire
          </span>
        ) : null}

        {/* Video Indicator (Play Button Icon) */}
        {hasVideo && (
          <div className="absolute bottom-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-black">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="py-3.5 flex flex-col gap-2.5 flex-1 justify-between">
        <div className="space-y-1">
          <Link href={destinationUrl} className="hover:underline block">
            <h3 className="text-sm font-normal text-neutral-800 line-clamp-2 leading-tight">
              {title}
            </h3>
          </Link>

          {/* Rating, Orders & Shop */}
          <div className="text-[11px] text-neutral-500 flex items-center gap-1 flex-wrap pt-0.5">
            <span className="font-bold text-neutral-800">{shop?.average_rating || '4.9'}</span>
            <span className="text-amber-500">★</span>
            <span>({shop?.completed_orders_count || '18'})</span>
            <span className="text-neutral-300">•</span>
            <span>{t.shopLabel} : {shop?.name || 'artisan'}</span>
          </div>

          {/* Price */}
          <div className="pt-0.5">
            {isSaleActive ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900">
                  {product.sale_price_mad} {t.mad}
                </span>
                <span className="text-xs text-neutral-400 line-through">
                  {product.base_price_mad} {t.mad}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-neutral-900">
                {product.base_price_mad} {t.mad}
              </span>
            )}
          </div>
        </div>

        {/* Buttons at the bottom */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100/50">
          <button
            onClick={handleAddToCart}
            className="border border-neutral-800 hover:bg-neutral-50 text-neutral-800 text-[11px] font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="text-sm font-normal leading-none">+</span> {t.addToCart}
          </button>

          <Link
            href={destinationUrl}
            className="text-[11px] font-semibold text-neutral-600 hover:text-black flex items-center gap-1 transition-colors"
          >
            {t.similarItems} <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({
  initialProducts,
  shops,
  lang,
  categorySlug,
  categoryFilterId,
  shopFilterId,
}: ProductGridProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);

  useEffect(() => {
    // Load client-published items from localStorage
    const localRaw = localStorage.getItem('local_products');
    if (localRaw) {
      try {
        const localProducts = JSON.parse(localRaw);
        if (Array.isArray(localProducts) && localProducts.length > 0) {
          const validLocal = localProducts.filter(
            (p) => p && typeof p === 'object' && p.title_translations
          );
          let all = [...validLocal, ...initialProducts];

          if (categoryFilterId) {
            all = all.filter((p) => {
              const isDirectMatch = p.category_id === categoryFilterId;
              const legacyMappedId = p.category_id === '1a111111-1111-1111-1111-111111111111' ? 'cat_jewelry'
                : p.category_id === '2b222222-2222-2222-2222-222222222222' ? 'cat_art_collectibles'
                  : p.category_id === '3c333333-3333-3333-3333-333333333333' ? 'cat_bath_beauty'
                    : p.category_id === '4d444444-4444-4444-4444-444444444444' ? 'cat_clothing'
                      : p.category_id === '5e555555-5555-5555-5555-555555555555' ? 'cat_bags_purses'
                        : p.category_id === '6f666666-6666-6666-6666-666666666666' ? 'cat_home_living'
                          : p.category_id;
              return isDirectMatch || legacyMappedId === categoryFilterId;
            });
          }

          if (shopFilterId) {
            all = all.filter((p) => p.shop_id === shopFilterId);
          }

          const seen = new Set();
          const unique = all.filter((p) => {
            const key = p.numeric_id || p.id;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          setProducts(unique);
        }
      } catch (e) {
        console.error('Failed to parse local_products:', e);
      }
    }
  }, [initialProducts, categoryFilterId]);

  const labels: Record<string, Record<string, string>> = {
    en: {
      empty: "No items found in this category yet.",
      mad: "MAD",
      view: "View Item",
      ships: "Ships from",
      verified: "Verified",
      addToCart: "Add to cart",
      similarItems: "Similar items",
      shopLabel: "Shop",
    },
    fr: {
      empty: "Aucun article trouvé dans cette catégorie.",
      mad: "DH",
      view: "Voir l'article",
      ships: "Expédié de",
      verified: "Vérifié",
      addToCart: "Ajouter au panier",
      similarItems: "Articles similaires",
      shopLabel: "Boutique",
    },
    ar: {
      empty: "لم يتم العثور على سلع في هذه الفئة بعد.",
      mad: "درهم",
      view: "عرض السلعة",
      ships: "الشحن من",
      verified: "موثق",
      addToCart: "أضف إلى السلة",
      similarItems: "منتجات مماثلة",
      shopLabel: "متجر",
    }
  };

  const t = labels[lang] || labels.en;

  if (products.length === 0) {
    return (
      <div className="border border-primary/20 rounded-xl p-12 text-center text-primary/40 bg-white">
        {t.empty}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => {
        const shop = shops.find((s) => s.id === product.shop_id) || shops[0];
        return (
          <SimpleProductCard
            key={product.id}
            product={product}
            shop={shop}
            lang={lang}
          />
        );
      })}
    </div>
  );
}
