import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const targetStoreSlugs = [
  'nomachine-287',
  'maisonkacem-478',
  'dardmanashop-296',
  'caftanger-692',
  'dimna-645'
];

async function run() {
  console.log('Fetching shop "nomachine" (original)...');
  
  const { data: originalShops, error: shopError } = await supabase
    .from('shops')
    .select('id, name, slug')
    .ilike('name', 'nomachine');
    
  if (shopError || !originalShops || originalShops.length === 0) {
    console.error('Error finding original nomachine shop');
    return;
  }
  
  const originalShopId = originalShops[0].id;
  console.log(`Original shop ID: ${originalShopId}`);

  console.log('Fetching target stores...');
  const { data: targetShops, error: targetError } = await supabase
    .from('shops')
    .select('id, slug, name')
    .in('slug', targetStoreSlugs);
    
  if (targetError || !targetShops || targetShops.length === 0) {
    console.error('Error finding target shops:', targetError);
    return;
  }
  
  console.log(`Found ${targetShops.length} target shops:`, targetShops.map(s => s.slug));
  
  if (targetShops.length < targetStoreSlugs.length) {
    console.warn(`Warning: Only found ${targetShops.length} out of ${targetStoreSlugs.length} shops!`);
  }

  console.log('Fetching products from original nomachine store...');
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', originalShopId);
    
  if (productError || !products || products.length === 0) {
    console.error('Error fetching products:', productError);
    return;
  }
  
  console.log(`Found ${products.length} products to distribute.`);
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const targetShop = targetShops[i % targetShops.length];
    
    // Add _is_seeded flag and append [Seeded] to the english title
    const newTitleTranslations = {
      ...product.title_translations,
      en: `${product.title_translations?.en || ''} [Seeded]`,
      _is_seeded: true
    };
    
    console.log(`Moving product "${product.title_translations?.en}" to shop "${targetShop.name}"...`);
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        shop_id: targetShop.id,
        title_translations: newTitleTranslations
      })
      .eq('id', product.id);
      
    if (updateError) {
      console.error(`Failed to update product ${product.id}:`, updateError);
    } else {
      console.log(`✅ Success for ${product.id}`);
    }
  }
  
  console.log('Distribution complete!');
}

run();
