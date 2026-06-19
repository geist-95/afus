import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function optimizeProducts(products: any[]) {
  if (!products) return [];
  return products.map(p => ({
    id: p.id,
    numeric_id: p.numeric_id,
    shop_id: p.shop_id,
    category_id: p.category_id,
    title_translations: p.title_translations,
    slug_translations: p.slug_translations,
    base_price_mad: p.base_price_mad,
    sale_price_mad: p.sale_price_mad,
    sale_expires_at: p.sale_expires_at,
    media_gallery: p.media_gallery ? p.media_gallery.slice(0, 2) : [],
    reviews: p.reviews ? p.reviews.map((r: any) => ({ rating: r.rating })) : [],
    created_at: p.created_at,
    metadata: p.metadata?.free_shipping ? { free_shipping: true } : null
  }));
}

export function optimizeShops(shops: any[], activeShopIds?: Set<string>) {
  if (!shops) return [];
  let filtered = shops;
  if (activeShopIds) {
    filtered = shops.filter(s => activeShopIds.has(s.id));
  }
  return filtered.map(s => ({
    id: s.id,
    name: s.name,
    merchant_city: s.merchant_city,
    is_verified: s.is_verified,
    slug: s.slug,
    logo_url: s.metadata?.logo_url || s.logo_url,
    is_placeholder: s.is_placeholder,
    created_at: s.created_at
  }));
}
