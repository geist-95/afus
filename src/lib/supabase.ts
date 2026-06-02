import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const isPlaceholder = supabaseUrl.includes('placeholder');

export const staticCategories = [
  { id: 'cat_jewelry', slug: 'jewelry', name: { en: 'Jewelry', fr: 'Bijoux', ar: 'مجوهرات' } },
  { id: 'cat_clothing', slug: 'clothing', name: { en: 'Clothing', fr: 'Vêtements', ar: 'ملابس' } },
  { id: 'cat_home_living', slug: 'home-living', name: { en: 'Home & Living', fr: 'Maison & Vie', ar: 'المنزل والمعيشة' } },
  { id: 'cat_art_collectibles', slug: 'art-collectibles', name: { en: 'Art & Collectibles', fr: 'Art & Objets de Collection', ar: 'الفن والمقتنيات' } },
  { id: 'cat_craft_supplies', slug: 'craft-supplies', name: { en: 'Craft Supplies & Tools', fr: 'Fournitures d\'Artisanat', ar: 'مستلزمات الحرف والأدوات' } },
  { id: 'cat_accessories', slug: 'accessories', name: { en: 'Accessories', fr: 'Accessoires', ar: 'إكسسوارات' } },
  { id: 'cat_bags_purses', slug: 'bags-purses', name: { en: 'Bags & Purses', fr: 'Sacs & Porte-Monnaie', ar: 'الحقائب والمحافظ' } },
  { id: 'cat_bath_beauty', slug: 'bath-beauty', name: { en: 'Bath & Beauty', fr: 'Bain & Beauté', ar: 'الاستحمام والتجميل' } },
  { id: 'cat_weddings', slug: 'weddings', name: { en: 'Weddings', fr: 'Mariages', ar: 'حفلات الزفاف' } },
  { id: 'cat_toys_games', slug: 'toys-games', name: { en: 'Toys & Games', fr: 'Jouets & Jeux', ar: 'الألعاب والدمى' } },
  { id: 'cat_kids_baby', slug: 'kids-baby', name: { en: 'Kids & Baby', fr: 'Enfants & Bébés', ar: 'الأطفال والرضع' } },
  { id: 'cat_paper_party', slug: 'paper-party', name: { en: 'Paper & Party Supplies', fr: 'Papier & Fournitures de Fête', ar: 'الورق ومستلزمات الحفلات' } },
  { id: 'cat_electronics', slug: 'electronics', name: { en: 'Electronics & Accessories', fr: 'Électronique & Accessoires', ar: 'الإلكترونيات وملحقاتها' } },
  { id: 'cat_pet_supplies', slug: 'pet-supplies', name: { en: 'Pet Supplies', fr: 'Fournitures pour Animaux', ar: 'مستلزمات الحيوانات الأليفة' } },
  { id: 'cat_shoes', slug: 'shoes', name: { en: 'Shoes', fr: 'Chaussures', ar: 'الأحذية' } },
  { id: 'cat_books_media', slug: 'books-media', name: { en: 'Books, Movies & Music', fr: 'Livres, Films & Musique', ar: 'الكتب والأفلام والموسيقى' } },
  { id: 'cat_gifts', slug: 'gifts', name: { en: 'Gifts', fr: 'Cadeaux', ar: 'الهدايا' } }
];

export const legacyCategoryMapping: Record<string, string> = {
  '1a111111-1111-1111-1111-111111111111': 'cat_jewelry',
  '2b222222-2222-2222-2222-222222222222': 'cat_art_collectibles',
  '3c333333-3333-3333-3333-333333333333': 'cat_bath_beauty',
  '4d444444-4444-4444-4444-444444444444': 'cat_clothing',
  '5e555555-5555-5555-5555-555555555555': 'cat_bags_purses',
  '6f666666-6666-6666-6666-666666666666': 'cat_home_living',
};


// Mock database for offline fallback
export const mockShops = [
  {
    id: 's1',
    owner_id: 's1_owner',
    name: 'Atlas Artisanat',
    slug: 'atlas-artisanat',
    logo_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=80&h=80&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&fit=crop',
    description_translations: {
      en: 'authentic hand-crafted moroccan carpets and brass decor direct from marrakech.',
      fr: 'tapis marocains artisanaux authentiques et décorations en laiton en direct de marrakech.',
      ar: 'سجاد مغربي تقليدي وديكورات نحاسية أصلية مباشرة من مراكش.'
    },
    store_policy_translations: {
      en: 'delivery via amana COD. returns accepted within 7 days. return shipping paid by buyer.',
      fr: 'livraison via amana paiement à la livraison. retours acceptés sous 7 jours. frais de retour à la charge de l\'acheteur.',
      ar: 'الشحن عبر أمانة الدفع عند الاستلام. يُقبل الإرجاع خلال 7 أيام. المشتري يتكفل بمصاريف الشحن.'
    },
    faq_translations: [
      {
        q: { en: 'how long does shipping take?', fr: 'combien de temps prend la livraison?', ar: 'كم يستغرق الشحن؟' },
        a: { en: 'amana delivery typically takes 2-3 business days inside morocco.', fr: 'la livraison amana prend généralement 2 à 3 jours ouvrables au maroc.', ar: 'يستغرق شحن أمانة عادةً من يومين إلى 3 أيام عمل داخل المغرب.' }
      }
    ],
    merchant_city: 'Marrakech',
    pickup_address_street: '32 derb snan, bab doukkala, marrakech',
    ice_number: '123456789012345',
    is_verified: true,
    is_vacation_mode: false,
    average_rating: 4.8,
    completed_orders_count: 142
  },
  {
    id: 's2',
    owner_id: 's2_owner',
    name: 'Maison du Cuir Fez',
    slug: 'maison-du-cuir-fez',
    logo_url: 'https://images.unsplash.com/photo-1473187983305-f6150a1e8f96?w=80&h=80&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1524295988766-414ebc361e25?w=800&fit=crop',
    description_translations: {
      en: 'premium leather goods made with traditional vegetable tanning in fez.',
      fr: 'maroquinerie haut de gamme tannée de manière végétale traditionnelle à fès.',
      ar: 'منتجات جلدية فاخرة مصنوعة بالدباغة النباتية التقليدية بفاس.'
    },
    store_policy_translations: {
      en: 'flat rates. cash on delivery only. inspection upon delivery allowed.',
      fr: 'tarifs fixes. paiement à la livraison. vérification autorisée à la livraison.',
      ar: 'أسعار ثابتة. الدفع عند الاستلام. يُسمح بفحص المنتج عند التسليم.'
    },
    faq_translations: [
      {
        q: { en: 'is the leather genuine?', fr: 'est-ce du vrai cuir?', ar: 'هل الجلد طبيعي؟' },
        a: { en: '100% genuine goat and camel leather from Chouara tannery.', fr: '100% cuir de chèvre et de chameau authentique de la tannerie chouara.', ar: 'جلد ماعز وجمال طبيعي 100٪ من مدبغة الشوارة.' }
      }
    ],
    merchant_city: 'Fes',
    pickup_address_street: '15 derb el mitar, fez el bali',
    ice_number: '987654321098765',
    is_verified: true,
    is_vacation_mode: false,
    average_rating: 4.9,
    completed_orders_count: 89
  }
];

export const mockProducts = [
  {
    id: 'p1',
    shop_id: 's1',
    category_id: '6f666666-6666-6666-6666-666666666666',
    numeric_id: 1083921,
    slug_translations: {
      en: 'handwoven-wool-tazar-rug',
      fr: 'tapis-tazar-en-laine-tisse-main',
      ar: 'سجاد-تازار-صوف-منسوج-يدويا'
    },
    title_translations: {
      en: 'handwoven wool tazar rug - authentic marrakech Berber art',
      fr: 'tapis tazar en laine tissé main - art berbère authentique de marrakech',
      ar: 'سجاد تازار صوف منسوج يدوياً - فن بربري أصيل من مراكش'
    },
    description_translations: {
      en: 'this exquisite wool rug is hand-woven by local berber women in the high atlas mountains. features traditional geometric patterns using organic dyes.',
      fr: 'ce magnifique tapis en laine est tissé à la main par des femmes berbères locales dans le haut atlas. présente des motifs géométriques traditionnels utilisant des colorants organiques.',
      ar: 'هذه السجادة الصوفية الرائعة منسوجة يدوياً بواسطة نساء بربريات محليات في جبال الأطلس الكبير. تتميز بنقوش هندسية تقليدية باستخدام أصباغ عضوية.'
    },
    base_price_mad: 1250.00,
    media_gallery: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&fit=crop'
    ],
    stock_quantity: 3,
    is_active: true,
    created_at: '2026-05-10T12:00:00Z',
    variants: [
      { id: 'v1_1', product_id: 'p1', sku: 'TAZ-RUG-S', price_override_mad: 1000.00, stock_quantity: 1, attributes: { en: { size: 'small (1mx1.5m)' }, fr: { taille: 'petit (1mx1.5m)' }, ar: { الحجم: 'صغير (1م×1.5م)' } } },
      { id: 'v1_2', product_id: 'p1', sku: 'TAZ-RUG-M', price_override_mad: 1250.00, stock_quantity: 2, attributes: { en: { size: 'medium (1.5mx2.5m)' }, fr: { taille: 'moyen (1.5mx2.5m)' }, ar: { الحجم: 'متوسط (1.5م×2.5م)' } } }
    ]
  },
  {
    id: 'p2',
    shop_id: 's2',
    category_id: '5e555555-5555-5555-5555-555555555555',
    numeric_id: 2049582,
    slug_translations: {
      en: 'classic-fez-leather-satchel',
      fr: 'sacoche-classique-en-cuir-de-fes',
      ar: 'حقيبة-جلدية-كلاسيكية-من-فاس'
    },
    title_translations: {
      en: 'classic fez leather satchel - vegetable tanned camel leather',
      fr: 'sacoche classique en cuir de fès - cuir de chameau tanné végétal',
      ar: 'حقيبة جلدية كلاسيكية من فاس - جلد جمال مدبوغ نباتياً'
    },
    description_translations: {
      en: 'durable satchel with brass buckles and adjustable shoulder strap. fits 13 inch laptops. smells like authentic premium moroccan leather.',
      fr: 'sacoche durable avec boucles en laiton et bandoulière réglable. convient aux ordinateurs de 13 pouces. sent le cuir marocain authentique.',
      ar: 'حقيبة متينة بإبزيم نحاسي وحزام كتف قابل للتعديل. تتسع للابتوب 13 بوصة. تفوح برائحة الجلد المغربي الفاخر الأصيل.'
    },
    base_price_mad: 450.00,
    media_gallery: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&fit=crop'
    ],
    stock_quantity: 12,
    is_active: true,
    created_at: '2026-05-15T15:30:00Z',
    variants: [
      { id: 'v2_1', product_id: 'p2', sku: 'FEZ-SAT-BR', price_override_mad: 450.00, stock_quantity: 8, attributes: { en: { color: 'natural brown' }, fr: { couleur: 'marron naturel' }, ar: { اللون: 'بني طبيعي' } } },
      { id: 'v2_2', product_id: 'p2', sku: 'FEZ-SAT-BL', price_override_mad: 480.00, stock_quantity: 4, attributes: { en: { color: 'onyx black' }, fr: { couleur: 'noir onyx' }, ar: { اللون: 'أسود أونيكس' } } }
    ]
  },
  {
    id: 'p3',
    shop_id: 's1',
    category_id: '1a111111-1111-1111-1111-111111111111',
    numeric_id: 3058291,
    slug_translations: {
      en: 'filigree-brass-lantern',
      fr: 'lanterne-en-laiton-filigrane',
      ar: 'فانوس-نحاسي-مخرم'
    },
    title_translations: {
      en: 'filigree brass lantern - intricate shadows lamp',
      fr: 'lanterne en laiton filigrane - lampe à ombres complexes',
      ar: 'فانوس نحاسي مخرم - مصباح ظلال معقدة'
    },
    description_translations: {
      en: 'cast beautiful shadows across your room with this hand-carved copper lantern. includes pre-wired bulb fixture.',
      fr: 'projetez de magnifiques ombres dans votre pièce avec cette lanterne en cuivre sculptée à la main. comprend un luminaire pré-câblé.',
      ar: 'اصنع ظلالاً جميلة في غرفتك مع هذا الفانوس النحاسي المحفور يدوياً. يشمل مقبس لمبة مجهز.'
    },
    base_price_mad: 320.00,
    media_gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&fit=crop'
    ],
    stock_quantity: 5,
    is_active: true,
    created_at: '2026-05-18T09:00:00Z',
    variants: []
  }
];

export const mockOrders = [
  {
    id: 'o1',
    shop_id: 's1',
    buyer_id: 'b1',
    customer_name: 'Amine Bensouda',
    customer_phone: '+212661234567',
    shipping_city: 'Casablanca',
    shipping_address: '24 Rue de la Liberté, Gauthier, Casablanca',
    subtotal_mad: 1250.00,
    shipping_cost_mad: 45.00,
    total_mad: 1295.00,
    order_status: 'pending',
    amana_delivery_status: 'pending_collection',
    amana_tracking_number: 'AM918273645MA',
    amana_history: [
      {
        status: 'pending_collection',
        timestamp: '2026-05-31T14:32:00Z',
        location: 'Marrakech Hub',
        note: 'shipment manifest created, awaiting courier collection'
      }
    ],
    items: [
      {
        id: 'oi1',
        product_id: 'p1',
        title: 'handwoven wool tazar rug - authentic marrakech Berber art',
        quantity: 1,
        price_mad: 1250.00,
        variant_sku: 'TAZ-RUG-M',
        attributes: { size: 'medium (1.5mx2.5m)' }
      }
    ],
    created_at: '2026-05-31T14:30:00Z'
  },
  {
    id: 'o2',
    shop_id: 's2',
    buyer_id: 'b2',
    customer_name: 'Youssef El Alami',
    customer_phone: '+212678901234',
    shipping_city: 'Rabat',
    shipping_address: '12 Avenue Mohammed V, Center Ville, Rabat',
    subtotal_mad: 450.00,
    shipping_cost_mad: 45.00,
    total_mad: 495.00,
    order_status: 'confirmed',
    amana_delivery_status: 'collected',
    amana_tracking_number: 'AM102938475MA',
    amana_history: [
      {
        status: 'collected',
        timestamp: '2026-05-30T16:00:00Z',
        location: 'Fes Principal',
        note: 'package scanned and collected by amana driver'
      },
      {
        status: 'pending_collection',
        timestamp: '2026-05-30T10:00:00Z',
        location: 'Fes Hub',
        note: 'order accepted by seller'
      }
    ],
    items: [
      {
        id: 'oi2',
        product_id: 'p2',
        title: 'classic fez leather satchel - vegetable tanned camel leather',
        quantity: 1,
        price_mad: 450.00,
        variant_sku: 'FEZ-SAT-BR',
        attributes: { color: 'natural brown' }
      }
    ],
    created_at: '2026-05-30T09:45:00Z'
  }
];

export const mockChats = [
  {
    id: 'cr1',
    shop_id: 's1',
    shop_name: 'Atlas Artisanat',
    buyer_id: 'b1',
    buyer_name: 'Amine Bensouda',
    messages: [
      {
        id: 'm1_1',
        sender_id: 'b1',
        message: 'salaam, is this rug available for fast shipping to casablanca?',
        created_at: '2026-05-31T14:15:00Z',
        product_context: { product_id: 'p1', title: 'handwoven wool tazar rug', price: 1250 }
      },
      {
        id: 'm1_2',
        sender_id: 's1_owner',
        message: 'wa alaykum salaam! yes, it is ready. if you order now, amana will collect it tomorrow and deliver it within 48 hours to casablanca.',
        created_at: '2026-05-31T14:22:00Z'
      }
    ]
  }
];

export const mockNotifications = [
  {
    id: 'n1',
    recipient_id: 'b1',
    category: 'order_update',
    slug_route: '/en/dashboard/orders',
    message_translations: {
      en: 'your order AM918273645MA from Atlas Artisanat is registered for amana pick-up.',
      fr: 'votre commande AM918273645MA chez Atlas Artisanat est enregistrée pour ramassage amana.',
      ar: 'تم تسجيل طلبيتك AM918273645MA من أطلس لإنتاج الحرف اليدوية للاستلام من طرف أمانة.'
    },
    is_read: false,
    created_at: '2026-05-31T14:32:00Z'
  }
];

// ============================================
// LIVE DATABASE CONNECTION API WRAPPERS
// ============================================

export async function fetchShops() {
  try {
    if (isPlaceholder) throw new Error('placeholder');
    const { data, error } = await supabase.from('shops').select('*');
    if (error || !data || data.length === 0) throw error || new Error('empty shops');
    return data;
  } catch (err) {
    console.warn('using mock fallback for shops:', err);
    return mockShops;
  }
}

export async function fetchShopBySlug(slug: string) {
  try {
    if (isPlaceholder) throw new Error('placeholder');
    const { data, error } = await supabase.from('shops').select('*').eq('slug', slug).single();
    if (error || !data) throw error || new Error('shop not found');
    return data;
  } catch (err) {
    console.warn(`using mock fallback for shop ${slug}:`, err);
    return mockShops.find((s) => s.slug === slug) || mockShops[0];
  }
}

export async function fetchProducts() {
  let list: any[] = [];
  try {
    if (isPlaceholder) throw new Error('placeholder');
    const { data, error } = await supabase
      .from('products')
      .select('*, shops(*), product_variants(*)');
    if (error || !data || data.length === 0) throw error || new Error('empty products');
    
    list = data.map((p: any) => ({
      ...p,
      variants: p.product_variants || [],
    }));
  } catch (err) {
    console.warn('using mock fallback for products:', err);
    list = [...mockProducts];
  }

  // Always merge localStorage custom items on the client browser
  if (typeof window !== 'undefined') {
    try {
      const localRaw = localStorage.getItem('local_products');
      if (localRaw) {
        const localProducts = JSON.parse(localRaw);
        if (Array.isArray(localProducts)) {
          const validLocal = localProducts.filter(
            (p) => p && typeof p === 'object' && p.title_translations
          );
          // Filter duplicates
          const existingIds = new Set(list.map((p) => p.numeric_id || p.id));
          const uniqueLocal = validLocal.filter((p) => !existingIds.has(p.numeric_id || p.id));
          list = [...uniqueLocal, ...list];
        }
      }
    } catch (e) {
      console.error('Failed to parse local_products in fetchProducts:', e);
    }
  }

  return list;
}

export async function fetchProductByNumericId(numericId: number) {
  try {
    if (isPlaceholder) throw new Error('placeholder');
    const { data, error } = await supabase
      .from('products')
      .select('*, shops(*), product_variants(*)')
      .eq('numeric_id', numericId)
      .single();
    if (error || !data) throw error || new Error('product not found');
    return {
      ...data,
      variants: data.product_variants || [],
    };
  } catch (err) {
    console.warn(`using mock fallback for product ID ${numericId}:`, err);
    return mockProducts.find((p) => p.numeric_id === numericId) || mockProducts[0];
  }
}

export async function fetchOrders(shopId?: string, buyerId?: string) {
  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  // Helper to load/save mock orders from localStorage if in client environment
  let localOrders: any[] = [];
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('local_orders');
    if (cached) {
      try {
        localOrders = JSON.parse(cached);
      } catch (e) {}
    } else {
      localOrders = JSON.parse(JSON.stringify(mockOrders));
      localStorage.setItem('local_orders', JSON.stringify(localOrders));
    }
  } else {
    localOrders = JSON.parse(JSON.stringify(mockOrders));
  }

  if ((shopId && !isUUID(shopId)) || (buyerId && !isUUID(buyerId))) {
    let list = [...localOrders];
    if (shopId) list = list.filter((o) => o.shop_id === shopId);
    if (buyerId) list = list.filter((o) => o.buyer_id === buyerId);
    return list;
  }

  try {
    if (isPlaceholder) throw new Error('placeholder');
    let query = supabase.from('orders').select('*, order_items(*, products(*))');
    if (shopId) query = query.eq('shop_id', shopId);
    if (buyerId) query = query.eq('buyer_id', buyerId);
    
    const { data, error } = await query;
    if (error || !data || data.length === 0) throw error || new Error('empty orders');
    
    return data.map((o: any) => ({
      ...o,
      items: (o.order_items || []).map((oi: any) => ({
        id: oi.id,
        product_id: oi.product_id,
        title: oi.products?.title_translations?.en || 'artisan craft',
        quantity: oi.quantity,
        price_mad: oi.price_mad,
        variant_sku: oi.variant_id,
      })),
    }));
  } catch (err) {
    console.warn('using mock fallback for orders:', err);
    let list = localOrders;
    try {
      const { data: dbShops } = await supabase.from('shops').select('id');
      if (dbShops && dbShops.length > 0) {
        list = list.map((o: any) => {
          if (o.shop_id === 's1') o.shop_id = dbShops[0].id;
          if (o.shop_id === 's2' && dbShops.length > 1) o.shop_id = dbShops[1].id;
          return o;
        });
      }
    } catch (e) {
      // Ignore fallback mapping error
    }

    if (shopId) list = list.filter((o: any) => o.shop_id === shopId);
    if (buyerId) list = list.filter((o: any) => o.buyer_id === buyerId);
    return list;
  }
}

export async function placeCODCheckout(checkoutData: {
  buyer_id?: string;
  customer_name: string;
  customer_phone: string;
  shipping_city: string;
  shipping_address: string;
  items: Array<{ product_id: string; variant_id: string | null; quantity: number }>;
}) {
  try {
    if (isPlaceholder) throw new Error('placeholder');
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
  } catch (err) {
    console.warn('using mock fallback for placing order:', err);
    // Add custom checkout to local storage orders if possible
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('local_orders') || '[]';
      try {
        const localOrders = JSON.parse(cached);
        const newOrderId = 'o_' + Math.random().toString(36).substring(2, 9);
        const newOrder = {
          id: newOrderId,
          shop_id: 's1',
          customer_name: checkoutData.customer_name,
          customer_phone: checkoutData.customer_phone,
          shipping_city: checkoutData.shipping_city,
          shipping_address: checkoutData.shipping_address,
          subtotal_mad: checkoutData.items.reduce((acc, item) => acc + (item.quantity * 200), 0),
          shipping_cost_mad: 45,
          total_mad: checkoutData.items.reduce((acc, item) => acc + (item.quantity * 200), 0) + 45,
          order_status: 'pending',
          amana_delivery_status: 'pending_collection',
          amana_tracking_number: 'AM' + Math.floor(100000000 + Math.random() * 900000000) + 'MA',
          amana_history: [{
            status: 'pending_collection',
            timestamp: new Date().toISOString(),
            location: checkoutData.shipping_city,
            note: 'order placed successfully'
          }],
          items: checkoutData.items.map((item, index) => ({
            id: 'oi_' + index,
            product_id: item.product_id,
            title: 'artisan craft item',
            quantity: item.quantity,
            price_mad: 200
          })),
          created_at: new Date().toISOString()
        };
        localOrders.unshift(newOrder);
        localStorage.setItem('local_orders', JSON.stringify(localOrders));
        return { success: true, order_ids: [newOrderId] };
      } catch (e) {}
    }
    return { success: true, order_ids: [Math.random().toString()] };
  }
}

export async function updateAmanaMilestone(orderId: string, milestone: {
  status: string;
  location: string;
  note: string;
  tracking_number?: string;
  order_status?: string;
}) {
  try {
    if (isPlaceholder) throw new Error('placeholder');
    // 1. Get current history log
    const { data: order } = await supabase.from('orders').select('amana_history').eq('id', orderId).single();
    const history = order?.amana_history || [];
    
    const newHistoryEntry = {
      status: milestone.status,
      timestamp: new Date().toISOString(),
      location: milestone.location,
      note: milestone.note,
    };

    // Determine target order state mapping
    let generalStatus = milestone.order_status;
    if (!generalStatus) {
      generalStatus = 'shipped';
      if (milestone.status === 'delivered') generalStatus = 'delivered';
      else if (milestone.status === 'returned_to_sender') generalStatus = 'returned';
      else if (milestone.status === 'collected') generalStatus = 'confirmed';
    }

    const updates: any = {
      order_status: generalStatus,
      amana_delivery_status: milestone.status,
      amana_history: [newHistoryEntry, ...history],
    };

    if (milestone.tracking_number) {
      updates.amana_tracking_number = milestone.tracking_number;
    }

    const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn(`using mock fallback for updating order milestones for ID ${orderId}:`, err);
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('local_orders');
      if (cached) {
        try {
          const localOrders = JSON.parse(cached);
          const idx = localOrders.findIndex((o: any) => o.id === orderId);
          if (idx !== -1) {
            const order = localOrders[idx];
            const history = order.amana_history || [];
            const newHistoryEntry = {
              status: milestone.status,
              timestamp: new Date().toISOString(),
              location: milestone.location,
              note: milestone.note,
            };
            
            let generalStatus = milestone.order_status;
            if (!generalStatus) {
              generalStatus = 'shipped';
              if (milestone.status === 'delivered') generalStatus = 'delivered';
              else if (milestone.status === 'returned_to_sender') generalStatus = 'returned';
              else if (milestone.status === 'collected') generalStatus = 'confirmed';
            }

            localOrders[idx] = {
              ...order,
              order_status: generalStatus,
              amana_delivery_status: milestone.status,
              amana_history: [newHistoryEntry, ...history],
              amana_tracking_number: milestone.tracking_number || order.amana_tracking_number,
            };
            localStorage.setItem('local_orders', JSON.stringify(localOrders));
          }
        } catch (e) {
          console.error('Failed to update local order milestone:', e);
        }
      }
    }
    return true;
  }
}

export async function createProductListing(productData: {
  shop_id: string;
  category_id: string;
  title_translations: Record<string, string>;
  description_translations: Record<string, string>;
  base_price_mad: number;
  media_gallery: string[];
  stock_quantity: number;
}) {
  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  if (!isUUID(productData.shop_id) || !isUUID(productData.category_id)) {
    const newProduct = {
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      shop_id: productData.shop_id,
      category_id: productData.category_id,
      numeric_id: Math.floor(100000 + Math.random() * 900000),
      slug_translations: {
        en: (productData.title_translations.en || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        fr: (productData.title_translations.fr || 'produit').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ar: 'منتج-جديد',
      },
      title_translations: productData.title_translations as { en: string; fr: string; ar: string; },
      description_translations: productData.description_translations as { en: string; fr: string; ar: string; },
      base_price_mad: productData.base_price_mad,
      media_gallery: productData.media_gallery && productData.media_gallery.length > 0
        ? productData.media_gallery
        : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop'],
      stock_quantity: productData.stock_quantity,
      is_active: true,
      created_at: new Date().toISOString(),
      variants: [],
    };
    mockProducts.push(newProduct);
    return newProduct;
  }

  try {
    if (isPlaceholder) throw new Error('placeholder');
    const slugTranslations = {
      en: (productData.title_translations.en || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      fr: (productData.title_translations.fr || 'produit').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ar: 'منتج-جديد',
    };

    const { data, error } = await supabase
      .from('products')
      .insert({
        shop_id: productData.shop_id,
        category_id: productData.category_id,
        title_translations: productData.title_translations,
        description_translations: productData.description_translations,
        slug_translations: slugTranslations,
        base_price_mad: productData.base_price_mad,
        media_gallery: productData.media_gallery,
        stock_quantity: productData.stock_quantity,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    if (data && !data.numeric_id) {
      data.numeric_id = Math.floor(100000 + Math.random() * 900000);
    }
    return data;
  } catch (err) {
    console.warn('using mock fallback for product insertion:', err);
    const newProduct = {
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      shop_id: productData.shop_id,
      category_id: productData.category_id,
      numeric_id: Math.floor(100000 + Math.random() * 900000),
      slug_translations: {
        en: (productData.title_translations.en || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        fr: (productData.title_translations.fr || 'produit').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ar: 'منتج-جديد',
      },
      title_translations: productData.title_translations as { en: string; fr: string; ar: string; },
      description_translations: productData.description_translations as { en: string; fr: string; ar: string; },
      base_price_mad: productData.base_price_mad,
      media_gallery: productData.media_gallery && productData.media_gallery.length > 0
        ? productData.media_gallery
        : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop'],
      stock_quantity: productData.stock_quantity,
      is_active: true,
      created_at: new Date().toISOString(),
      variants: [],
    };
    mockProducts.push(newProduct);
    return newProduct;
  }
}
