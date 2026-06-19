import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('products')
    .insert({
      shop_id: '11111111-1111-1111-1111-111111111111', // Fake shop UUID
      category_id: 'cat_weddings',
      title_translations: { en: 'Test', fr: 'Test', ar: 'Test' },
      description_translations: { en: 'Test', fr: 'Test', ar: 'Test' },
      slug_translations: { en: 'test', fr: 'test', ar: 'test' },
      base_price_mad: 100,
      media_gallery: [],
      stock_quantity: 1,
      is_active: true,
    });
  console.log('Error:', error);
}
test();
