import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data: p1 } = await supabase.from('products').select('id').eq('slug_translations->>en', 'handmade-palestinian-nabulsi-olive-oil-soap').single();
  const { data: p2 } = await supabase.from('products').select('id').eq('slug_translations->>en', 'handmade-palestinian-nabulsi-olive-oil-soap-ostrich').single();

  await supabase.from('product_variants').delete().eq('product_id', p1.id);
  await supabase.from('product_variants').insert([
    { product_id: p1.id, sku: 'SOAP-P1-DEF', price_override_mad: null, stock_quantity: 50, attributes: { _is_seeded: true } }
  ]);

  await supabase.from('product_variants').delete().eq('product_id', p2.id);
  await supabase.from('product_variants').insert([
    { product_id: p2.id, sku: 'SOAP-P2-DEF', price_override_mad: null, stock_quantity: 50, attributes: { _is_seeded: true } }
  ]);
  console.log('Fixed variants for Safi!');
}
fix();
