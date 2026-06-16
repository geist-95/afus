import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDI1NzQsImV4cCI6MjA5NTkxODU3NH0.rY2ayagWePOJKTOXEd-IBXgXoTEeTAJuMwk2ovONTjk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const shopId = '8f16baa7-2f1d-462d-b301-620a6b1b6dd3'; // YazidStore
  const categoryId = '6f666666-6666-6666-6666-666666666666'; // home-living
  
  const { data, error } = await supabase.from('products').insert({
    shop_id: shopId,
    category_id: categoryId,
    title_translations: { en: 'Test Product', fr: 'Produit Test' },
    description_translations: { en: 'Test Description', fr: 'Description Test' },
    slug_translations: { en: 'test-product', fr: 'produit-test' },
    base_price_mad: 100,
    media_gallery: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&fit=crop'],
    stock_quantity: 10,
    is_active: true
  }).select();

  console.log('Insert Result:', data, error);
}

testInsert();
