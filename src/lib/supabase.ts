import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const staticCategories = [
  { id: 'cat_jewelry', slug: 'jewelry', name: { en: 'Jewelry', fr: 'Bijoux', ar: 'مجوهرات', tz: 'ⵜⵉⵣⴱⴳⴰⵏ' } },
  { id: 'cat_clothing', slug: 'clothing', name: { en: 'Clothing', fr: 'Vêtements', ar: 'ملابس', tz: 'ⵉⵀⴷⵓⵎⵏ' } },
  { id: 'cat_home_living', slug: 'home-living', name: { en: 'Home & Living', fr: 'Maison & Vie', ar: 'المنزل والمعيشة', tz: 'ⵜⴰⴷⴷⴰⵔⵜ' } },
  { id: 'cat_art_collectibles', slug: 'art-collectibles', name: { en: 'Art & Collectibles', fr: 'Art & Objets de Collection', ar: 'الفن والمقتنيات', tz: 'ⵜⴰⵥⵓⵕⵉ' } },
  { id: 'cat_craft_supplies', slug: 'craft-supplies', name: { en: 'Craft Supplies & Tools', fr: 'Fournitures d\'Artisanat', ar: 'مستلزمات الحرف والأدوات', tz: 'ⵜⵉⵙⵖⴰⵏ ⵏ ⵜⵥⵓⵕⵉ' } },
  { id: 'cat_accessories', slug: 'accessories', name: { en: 'Accessories', fr: 'Accessoires', ar: 'إكسسوارات', tz: 'ⵉⵙⵎⴰⵎⵓⵜⵏ' } },
  { id: 'cat_bags_purses', slug: 'bags-purses', name: { en: 'Bags & Purses', fr: 'Sacs & Porte-Monnaie', ar: 'الحقائب والمحافظ', tz: 'ⵉⵇⵕⴰⴱⵏ' } },
  { id: 'cat_bath_beauty', slug: 'bath-beauty', name: { en: 'Bath & Beauty', fr: 'Bain & Beauté', ar: 'الاستحمام والتجميل', tz: 'ⴰⴼⴰⵍⴽⴰⵢ' } },
  { id: 'cat_weddings', slug: 'weddings', name: { en: 'Weddings', fr: 'Mariages', ar: 'حفلات الزفاف', tz: 'ⵜⵉⵎⵖⵔⵉⵡⵉⵏ' } },
  { id: 'cat_toys_games', slug: 'toys-games', name: { en: 'Toys & Games', fr: 'Jouets & Jeux', ar: 'الألعاب والدمى', tz: 'ⵉⵓⵔⴰⵔⵏ' } },
  { id: 'cat_kids_baby', slug: 'kids-baby', name: { en: 'Kids & Baby', fr: 'Enfants & Bébés', ar: 'الأطفال والرضع', tz: 'ⵉⵎⵥⵥⵢⴰⵏⵏ ⴷ ⵉⵣⴳⵣⴰⵡⵏ' } },
  { id: 'cat_paper_party', slug: 'paper-party', name: { en: 'Paper & Party Supplies', fr: 'Papier & Fournitures de Fête', ar: 'الورق ومستلزمات الحفلات', tz: 'ⵜⴰⵏⴼⵓⵍⵜ ⴷ ⵜⵉⴼⴼⵓⴳⵍⵉⵡⵉⵏ' } },
  { id: 'cat_electronics', slug: 'electronics', name: { en: 'Electronics & Accessories', fr: 'Électronique & Accessoires', ar: 'الإلكترونيات وملحقاتها', tz: 'ⵜⵉⵍⵉⴽⵜⵕⵓⵏⵉⵏ' } },
  { id: 'cat_pet_supplies', slug: 'pet-supplies', name: { en: 'Pet Supplies', fr: 'Fournitures pour Animaux', ar: 'مستلزمات الحيوانات الأليفة', tz: 'ⵉⵎⵓⴷⴰⵔ ⵏ ⵜⴰⴷⴷⴰⵔⵜ' } },
  { id: 'cat_shoes', slug: 'shoes', name: { en: 'Shoes', fr: 'Chaussures', ar: 'الأحذية', tz: 'ⵉⴷⵓⴽⴰⵏ' } },
  { id: 'cat_books_media', slug: 'books-media', name: { en: 'Books, Movies & Music', fr: 'Livres, Films & Musique', ar: 'الكتب والأفلام والموسيقى', tz: 'ⵉⴷⵍⵉⵙⵏ, ⵉⵙⵓⵔⴰ, ⴷ ⵓⵥⴰⵡⴰⵏ' } },
  { id: 'cat_gifts', slug: 'gifts', name: { en: 'Gifts', fr: 'Cadeaux', ar: 'الهدايا', tz: 'ⵜⵉⵙⵎⵖⵓⵔⵉⵏ' } }
];

export const legacyCategoryMapping: Record<string, string> = {
  '1a111111-1111-1111-1111-111111111111': 'cat_jewelry',
  '2b222222-2222-2222-2222-222222222222': 'cat_art_collectibles',
  '3c333333-3333-3333-3333-333333333333': 'cat_bath_beauty',
  '4d444444-4444-4444-4444-444444444444': 'cat_clothing',
  '5e555555-5555-5555-5555-555555555555': 'cat_bags_purses',
  '6f666666-6666-6666-6666-666666666666': 'cat_home_living',
  '7a777777-7777-7777-7777-777777777777': 'cat_craft_supplies',
  '8b888888-8888-8888-8888-888888888888': 'cat_accessories',
  '9c999999-9999-9999-9999-999999999999': 'cat_weddings',
  '0a000000-0000-0000-0000-000000000000': 'cat_toys_games',
  '1b111111-1111-1111-1111-111111111112': 'cat_kids_baby',
  '2c222222-2222-2222-2222-222222222223': 'cat_paper_party',
  '3d333333-3333-3333-3333-333333333334': 'cat_electronics',
  '4e444444-4444-4444-4444-444444444445': 'cat_pet_supplies',
  '5f555555-5555-5555-5555-555555555556': 'cat_shoes',
  '6a666666-6666-6666-6666-666666666667': 'cat_books_media',
  '7b777777-7777-7777-7777-777777777778': 'cat_gifts',
};

export const reverseCategoryMapping: Record<string, string> = Object.fromEntries(
  Object.entries(legacyCategoryMapping).map(([k, v]) => [v, k])
);

export async function fetchShops() {
  const { data, error } = await supabase.from('shops').select('*');
  if (error) throw error;
  return data;
}

export async function fetchShopBySlug(slug: string) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  let query = supabase.from('shops').select('*');
  if (isUUID) {
    query = query.eq('id', slug);
  } else {
    query = query.eq('slug', slug);
  }
  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}

export async function checkShopSlugAvailable(slug: string): Promise<boolean> {
  const { data, error } = await supabase.from('shops').select('id').eq('slug', slug).single();
  if (error && error.code === 'PGRST116') return true;
  return !data;
}

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)');
  if (error) throw error;
  return (data || []).map((p: any) => ({ ...p, variants: p.product_variants || [] }));
}

export async function fetchShopProducts(shopId: string) {
  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)').eq('shop_id', shopId);
  if (error) throw error;
  return (data || []).map((p: any) => ({ ...p, variants: p.product_variants || [] }));
}

export async function fetchCategoryProducts(categoryId: string) {
  const legacyId = Object.keys(legacyCategoryMapping).find(k => legacyCategoryMapping[k] === categoryId);
  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  
  const idsToSearch = [];
  if (isUUID(categoryId)) idsToSearch.push(categoryId);
  if (legacyId && isUUID(legacyId)) idsToSearch.push(legacyId);
  
  if (idsToSearch.length === 0) return [];

  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)').in('category_id', idsToSearch);
  if (error) throw error;
  return (data || []).map((p: any) => ({ ...p, variants: p.product_variants || [] }));
}

export async function fetchCityProducts(city: string) {
  // First find shops in the city
  const { data: shops, error: shopsError } = await supabase.from('shops').select('id').ilike('merchant_city', `%${city}%`);
  if (shopsError) throw shopsError;
  const shopIds = (shops || []).map(s => s.id);
  
  if (shopIds.length === 0) return [];

  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)').in('shop_id', shopIds);
  if (error) throw error;
  return (data || []).map((p: any) => ({ ...p, variants: p.product_variants || [] }));
}

export async function fetchRecentProductsForShops(shopIds: string[], sinceTime: number) {
  if (!shopIds || shopIds.length === 0) return [];
  const sinceIso = new Date(sinceTime).toISOString();
  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)').in('shop_id', shopIds).gt('created_at', sinceIso);
  if (error) throw error;
  return (data || []).map((p: any) => ({ ...p, variants: p.product_variants || [] }));
}

export async function fetchRelatedProducts(categoryId: string, excludeProductId: string) {
  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  let searchId = categoryId;
  
  if (!isUUID(categoryId)) {
    const legacyId = Object.keys(legacyCategoryMapping).find(k => legacyCategoryMapping[k] === categoryId);
    if (legacyId) {
      searchId = legacyId;
    } else {
      return []; // Invalid UUID
    }
  }

  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)').eq('category_id', searchId).neq('id', excludeProductId).limit(10);
  if (error) throw error;
  return (data || []).map((p: any) => ({ ...p, variants: p.product_variants || [] }));
}

export async function fetchProductsByIds(productIds: string[]) {
  if (!productIds || productIds.length === 0) return [];
  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)').in('id', productIds);
  if (error) throw error;
  return (data || []).map((p: any) => ({ ...p, variants: p.product_variants || [] }));
}

export async function fetchProductByNumericId(numericId: number) {
  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)').eq('numeric_id', numericId).single();
  if (error) throw error;
  return { ...data, variants: data.product_variants || [] };
}

export async function fetchOrders(shopId?: string, buyerId?: string) {
  let query = supabase.from('orders').select('*, order_items(*, products(*))');
  if (shopId) query = query.eq('shop_id', shopId);
  if (buyerId) query = query.eq('buyer_id', buyerId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((o: any) => ({
    ...o,
    items: (o.order_items || []).map((oi: any) => ({
      id: oi.id,
      product_id: oi.product_id,
      title: oi.title || oi.product_title || oi.product_name || oi.products?.title_translations?.en || 'artisan craft',
      quantity: oi.quantity,
      price_mad: oi.price_mad,
      variant_sku: oi.variant_id,
      image_url: oi.products?.media_gallery?.[0] || null,
      attributes: oi.attributes || {},
      customization_instructions: oi.products?.metadata?.personalization?.instructions || null,
    })),
  }));
}

export async function placeCODCheckout(checkoutData: any) {
  const { data, error } = await supabase.rpc('place_cod_checkout', {
    p_buyer_id: checkoutData.buyer_id || null,
    p_customer_name: checkoutData.customer_name,
    p_customer_phone: checkoutData.customer_phone,
    p_shipping_city: checkoutData.shipping_city,
    p_shipping_address: checkoutData.shipping_address,
    p_items: checkoutData.items,
  });
  if (error) throw error;
  return data;
}

export async function updateAmanaMilestone(orderId: string, milestone: any) {
  const { data: order } = await supabase.from('orders').select('amana_history').eq('id', orderId).single();
  const history = order?.amana_history || [];
  const newHistoryEntry = { status: milestone.status, timestamp: new Date().toISOString(), location: milestone.location, note: milestone.note };
  let generalStatus = milestone.order_status;
  if (!generalStatus) {
    generalStatus = 'shipped';
    if (milestone.status === 'delivered') generalStatus = 'delivered';
    else if (milestone.status === 'returned_to_sender') generalStatus = 'returned';
    else if (milestone.status === 'collected') generalStatus = 'confirmed';
  }
  let updates: any = { order_status: generalStatus, amana_delivery_status: milestone.status };
  if (!milestone.skip_history) {
    updates.amana_history = [newHistoryEntry, ...history];
  }
  if (milestone.tracking_number) updates.amana_tracking_number = milestone.tracking_number;
  const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
  if (error) throw error;
  return true;
}

export async function updateOrderTracking(orderId: string, trackingNumber: string, trackingHistory?: any[], amanaStatus?: string) {
  const updates: any = { amana_tracking_number: trackingNumber };
  if (trackingHistory) updates.amana_history = trackingHistory;
  if (amanaStatus) updates.amana_delivery_status = amanaStatus;
  
  const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
  if (error) throw error;
  return true;
}

export async function createProductListing(productData: any) {
  const slugTranslations = {
    en: (productData.title_translations.en || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    fr: (productData.title_translations.fr || 'produit').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ar: 'منتج-جديد',
  };
  if (reverseCategoryMapping[productData.category_id]) {
    productData.category_id = reverseCategoryMapping[productData.category_id];
  }
  const { data, error } = await supabase.from('products').insert({
    shop_id: productData.shop_id,
    category_id: productData.category_id,
    title_translations: productData.title_translations,
    description_translations: productData.description_translations,
    slug_translations: slugTranslations,
    base_price_mad: productData.base_price_mad,
    media_gallery: productData.media_gallery,
    stock_quantity: productData.stock_quantity,
    is_active: true,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function fetchProductById(id: string) {
  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)').eq('id', id).single();
  if (error) throw error;
  return { ...data, variants: data.product_variants || [] };
}

export async function updateProductListing(productId: string, productData: any) {
  const slugTranslations = {
    en: (productData.title_translations.en || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    fr: (productData.title_translations.fr || 'produit').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ar: 'منتج-جديد',
  };
  const { data, error } = await supabase.from('products').update({
    category_id: productData.category_id || null,
    title_translations: productData.title_translations,
    description_translations: productData.description_translations,
    slug_translations: slugTranslations,
    base_price_mad: productData.base_price_mad,
    media_gallery: productData.media_gallery,
    stock_quantity: productData.stock_quantity,
    ...(productData.status ? { is_active: productData.status === 'active' } : {})
  }).eq('id', productId).select().single();
  if (error) throw error;
  return data;
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function searchProducts(searchTerm: string, filters: any = {}) {
  const { data, error } = await supabase.rpc('search_products', {
    search_term: searchTerm || '',
    min_price: filters.minPrice || null,
    max_price: filters.maxPrice || null,
    location_filter: filters.location || null,
    sort_by: filters.sortBy || 'relevant'
  });
  
  if (error) {
    console.warn("search_products RPC failed, using fallback:", error.message);
    let q = supabase.from('products').select(`*, shops(*)`).eq('status', 'active');
    if (searchTerm) {
      // Basic fallback search across all languages
      q = q.or(`title_translations->>en.ilike.%${searchTerm}%,title_translations->>fr.ilike.%${searchTerm}%,title_translations->>ar.ilike.%${searchTerm}%`);
    }
    const { data: fallbackData } = await q.limit(20);
    return fallbackData || [];
  }
  
  return (data || []).map((item: any) => ({ ...item, shops: item.shop_data }));
}

export async function fetchProductReviews(productId: string) {
  const { data, error } = await supabase.from('reviews').select('*, reviewer_profile:profiles!reviewer_id(full_name, avatar_url)').eq('product_id', productId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchShopReviews(shopId: string) {
  const { data, error } = await supabase.from('reviews').select('*, reviewer_profile:profiles!reviewer_id(full_name, avatar_url), product:products!product_id(title_translations, media_gallery)').eq('shop_id', shopId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchUserReviews(userId: string) {
  const { data, error } = await supabase.from('reviews').select('*, shop:shops!shop_id(name), product:products!product_id(title_translations, media_gallery)').eq('reviewer_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function submitReview(payload: any) {
  const { data, error } = await supabase.from('reviews').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function submitBetaReport(payload: any) {
  const { error } = await supabase.from('beta_reports').insert([payload]);
  if (error) throw error;
  return { success: true };
}

// COLLECTION APIS
export async function fetchCollections(shopId: string) {
  const { data, error } = await supabase.from('collections').select('*').eq('shop_id', shopId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createCollection(payload: { shop_id: string; name_translations: any; product_ids: string[] }) {
  const { data, error } = await supabase.from('collections').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCollection(id: string) {
  const { error } = await supabase.from('collections').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

// STORAGE APIS
export async function uploadImage(file: File | Blob, bucket: string = 'media'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Upload failed');
  }

  const data = await res.json();
  return data.publicUrl;
}
