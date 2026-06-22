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
const supabase = createClient(supabaseUrl, supabaseKey);

const legacyCategoryMapping = {
  '1a111111-1111-1111-1111-111111111111': 'cat_jewelry',
  '2b222222-2222-2222-2222-222222222222': 'cat_art_collectibles',
  '3c333333-3333-3333-3333-333333333333': 'cat_bath_beauty',
  '4d444444-4444-4444-4444-444444444444': 'cat_clothing',
  '5e555555-5555-5555-5555-555555555555': 'cat_bags_purses',
  '6f666666-6666-6666-6666-666666666666': 'cat_home_living',
  '7a777777-7777-7777-7777-777777777778': 'cat_craft_supplies',
  '8b888888-8888-8888-8888-888888888888': 'cat_accessories',
  '9c999999-9999-9999-9999-999999999999': 'cat_weddings',
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
  let catId = productData.category_id;
  if (reverseCategoryMapping[catId]) {
    catId = reverseCategoryMapping[catId];
  }
  const { data, error } = await supabase.from('products').insert({
    shop_id: productData.shop_id,
    category_id: catId,
    title_translations: productData.title_translations,
    description_translations: productData.description_translations,
    slug_translations: slugTranslations,
    base_price_mad: productData.base_price_mad,
    media_gallery: productData.media_gallery,
    stock_quantity: productData.stock_quantity,
    is_active: true,
  }).select().single();
  return { data, error };
}

async function run() {
  const result = await createProductListing({
    shop_id: 'a76c375c-59e0-435e-9337-dd02e41de4ba',
    category_id: 'cat_home_living',
    title_translations: { en: 'Bouchra Test Product', fr: 'Bouchra Test Product', ar: 'Bouchra Test Product' },
    description_translations: { en: 'Test desc', fr: 'Test desc', ar: 'Test desc' },
    base_price_mad: 100,
    media_gallery: ['https://placeholder.com/image.png'],
    stock_quantity: 99,
  });

  console.log('Insert result (unauthenticated):', result.data, result.error);
}
run();
