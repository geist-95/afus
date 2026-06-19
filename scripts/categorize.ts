import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Use SERVICE_ROLE_KEY to bypass RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const staticCategories = [
  { id: '1a111111-1111-1111-1111-111111111111', keywords: ['necklace', 'bracelet', 'ring', 'earring', 'jewelry'] },
  { id: '4d444444-4444-4444-4444-444444444444', keywords: ['shirt', 'pant', 'dress', 'jacket', 't-shirt', 'coat', 'clothing', 'abaya', 'caftan', 'jeans', 'hoodie', 'sweater', 'takchita'] },
  { id: '6f666666-6666-6666-6666-666666666666', keywords: ['rug', 'carpet', 'lamp', 'table', 'chair', 'pillow', 'blanket', 'decor', 'ceramic', 'pottery', 'bowl', 'plate', 'vase', 'coffre', 'osier', 'raphia', 'plateau', 'teapot'] },
  { id: '2b222222-2222-2222-2222-222222222222', keywords: ['painting', 'print', 'sculpture', 'art', 'canvas'] },
  { id: '5e555555-5555-5555-5555-555555555555', keywords: ['bag', 'purse', 'wallet', 'backpack', 'tote', 'satchel'] },
  { id: '3c333333-3333-3333-3333-333333333333', keywords: ['soap', 'lotion', 'oil', 'cream', 'argan', 'bath', 'beauty', 'spa'] }
];

function guessCategory(title: string): string {
  if (!title) return '6f666666-6666-6666-6666-666666666666'; // default home
  
  const lowerTitle = title.toLowerCase();
  
  for (const cat of staticCategories) {
    for (const keyword of cat.keywords) {
      if (lowerTitle.includes(keyword)) {
        return cat.id;
      }
    }
  }
  
  // Default to clothing for caftan/djellaba things that weren't caught
  if (lowerTitle.includes('djellaba') || lowerTitle.includes('caftan')) return '4d444444-4444-4444-4444-444444444444';
  
  // Custom checks
  if (lowerTitle.includes('box in the thuya') || lowerTitle.includes('chessboard')) return '6f666666-6666-6666-6666-666666666666'; // home / woodcraft
  if (lowerTitle.includes('trophées, têtes d\'animaux')) return '6f666666-6666-6666-6666-666666666666'; // home decor
  
  return '6f666666-6666-6666-6666-666666666666'; // fallback home
}

async function run() {
  console.log('Fetching shop "nomachine"...');
  
  const { data: shops, error: shopError } = await supabase
    .from('shops')
    .select('id, name')
    .ilike('name', '%nomachine%');
    
  if (shopError) {
    console.error('Error finding shop:', shopError);
    return;
  }
  
  if (!shops || shops.length === 0) {
    console.log('No shop found matching "nomachine".');
    return;
  }
  
  const shopId = shops[0].id;
  console.log(`Found shop: ${shops[0].name} (${shopId})`);
  
  console.log('Fetching products...');
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId);
    
  if (productError) {
    console.error('Error fetching products:', productError);
    return;
  }
  
  console.log(`Found ${products?.length || 0} products.`);
  
  for (const product of products || []) {
    const title = product.title_translations?.en || product.title_translations?.fr || '';
    const newCategory = guessCategory(title);
    
    console.log(`Product: "${title}" => Current Cat: ${product.category_id} => New Cat: ${newCategory}`);
    
    if (product.category_id !== newCategory) {
      const { data, error: updateError } = await supabase
        .from('products')
        .update({ category_id: newCategory })
        .eq('id', product.id)
        .select();
        
      if (updateError) {
        console.error(`Failed to update ${product.id}:`, updateError);
      } else if (!data || data.length === 0) {
        console.error(`Failed to update ${product.id}: Update modified 0 rows. (RLS issue?)`);
      } else {
        console.log(`✅ Updated ${product.id}`);
      }
    } else {
      console.log(`⏭️ Unchanged ${product.id}`);
    }
  }
  
  console.log('Done!');
}

run();
