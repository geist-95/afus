import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c'; // using service role

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: shops, error: shopError } = await supabase.from('shops').select('id, name');
  const matchingShops = shops?.filter(s => typeof s.name === 'string' && (s.name.toLowerCase().includes('potrie') || s.name.toLowerCase().includes('poterie')));
  console.log('Shops with Potrie:', matchingShops);
  
  const { data: products, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error(error);
    return;
  }
  
  const targetProducts = products.filter(p => 
    p.base_price_mad === 350 || 
    (p.title_translations && JSON.stringify(p.title_translations).includes('طاجين')) ||
    (p.title_translations && JSON.stringify(p.title_translations).toLowerCase().includes('tajine'))
  );
  
  console.log('Found targets:', targetProducts.map(p => ({
    id: p.id,
    title: p.title_translations,
    price: p.base_price_mad,
    shop_id: p.shop_id
  })));
}

main();
