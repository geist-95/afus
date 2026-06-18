import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data: p1 } = await supabase.from('products').select('id').eq('slug_translations->>en', 'handmade-moroccan-wool-rug-ivory-black').single();
  const { data: p2 } = await supabase.from('products').select('id').eq('slug_translations->>en', 'handmade-moroccan-wool-rug-geometric-brown-white').single();

  // Re-insert variants for p1
  await supabase.from('product_variants').delete().eq('product_id', p1.id);
  await supabase.from('product_variants').insert([
    { product_id: p1.id, sku: 'RUG-P1-90x120', price_override_mad: 470, stock_quantity: 2, attributes: { en: { size: '90x120cm' }, fr: { taille: '90x120cm' }, ar: { المقاس: '90x120cm' }, _is_seeded: true } },
    { product_id: p1.id, sku: 'RUG-P1-130x180', price_override_mad: 620, stock_quantity: 2, attributes: { en: { size: '130x180cm' }, fr: { taille: '130x180cm' }, ar: { المقاس: '130x180cm' }, _is_seeded: true } },
  ]);

  // Re-insert variants for p2
  await supabase.from('product_variants').delete().eq('product_id', p2.id);
  await supabase.from('product_variants').insert([
    { product_id: p2.id, sku: 'RUG-P2-90x120', price_override_mad: 477, stock_quantity: 2, attributes: { en: { size: '90x120cm' }, fr: { taille: '90x120cm' }, ar: { المقاس: '90x120cm' }, _is_seeded: true } },
    { product_id: p2.id, sku: 'RUG-P2-130x180', price_override_mad: 627, stock_quantity: 2, attributes: { en: { size: '130x180cm' }, fr: { taille: '130x180cm' }, ar: { المقاس: '130x180cm' }, _is_seeded: true } },
    { product_id: p2.id, sku: 'RUG-P2-200x260', price_override_mad: 777, stock_quantity: 2, attributes: { en: { size: '200x260cm' }, fr: { taille: '200x260cm' }, ar: { المقاس: '200x260cm' }, _is_seeded: true } },
  ]);
  console.log('Fixed variants!');
}
fix();
