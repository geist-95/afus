import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read env variables
const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = {};
envLocal.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Re-create supabase client exactly like the app does
const supabase = createClient(supabaseUrl, supabaseKey);

// Mock getActiveSession & registerUser
async function registerUser(payload) {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });

  if (signUpError) throw signUpError;
  if (!signUpData.user) throw new Error('sign up failed: no user returned');

  if (signUpData.session) {
    await supabase.auth.setSession(signUpData.session);
  }

  const userId = signUpData.user.id;
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: payload.email,
      full_name: payload.fullName,
      role: 'seller',
      phone_number: payload.phone,
      preferred_language: 'en',
    })
    .select()
    .single();

  if (profileError) throw profileError;

  const finalShopName = payload.shopName || `${payload.fullName}'s Shop`;
  const shopSlug = finalShopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
  const { data: shopData, error: shopError } = await supabase
    .from('shops')
    .insert({
      owner_id: userId,
      name: finalShopName,
      slug: shopSlug,
      merchant_city: 'Marrakech',
      pickup_address_street: 'Derb Snan, Marrakech',
      ice_number: '123456789012345',
      is_verified: true,
    })
    .select()
    .single();

  if (shopError) throw shopError;

  return { shop: shopData };
}

const legacyCategoryMapping = {
  '6f666666-6666-6666-6666-666666666666': 'cat_home_living',
};
const reverseCategoryMapping = Object.fromEntries(
  Object.entries(legacyCategoryMapping).map(([k, v]) => [v, k])
);

async function createProductListing(productData) {
  const slugTranslations = {
    en: (productData.title_translations.en || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    fr: (productData.title_translations.fr || 'produit').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ar: 'منتج-جديد',
  };
  let categoryId = productData.category_id;
  if (reverseCategoryMapping[categoryId]) {
    categoryId = reverseCategoryMapping[categoryId];
  }
  const { data, error } = await supabase.from('products').insert({
    shop_id: productData.shop_id,
    category_id: categoryId,
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

async function run() {
  const email = `test_flow_${Date.now()}@yopmail.com`;
  try {
    const result = await registerUser({
      email,
      password: 'password123',
      fullName: 'Test Flow User',
      phone: '12345678',
      shopName: `TestFlowShop${Math.floor(Math.random() * 100)}`,
    });

    console.log('1. User registered and shop created successfully:', result.shop.id);

    const product = await createProductListing({
      shop_id: result.shop.id,
      category_id: 'cat_home_living',
      title_translations: { en: 'Flow Product', fr: 'Flow Product', ar: 'Flow Product' },
      description_translations: { en: 'Desc', fr: 'Desc', ar: 'Desc' },
      base_price_mad: 100,
      media_gallery: ['https://placeholder.com/image.png'],
      stock_quantity: 99,
    });

    console.log('2. Product created successfully:', product.id);
  } catch (err) {
    console.error('Error during simulated onboarding flow:', err);
  }
}
run();
