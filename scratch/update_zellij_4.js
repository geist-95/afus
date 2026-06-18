import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('id').eq('slug_translations->>en', 'handmade-tuareg-sterling-silver-ring-yaz-z');
  if (data && data.length > 0) {
    const pId = data[0].id;
    const { error: updateErr } = await supabase.from('products').update({
      media_gallery: [
        '/afus-products/ZellijMosaicBistros/4/il_794xN.7741719893_hghz.webp',
        '/afus-products/ZellijMosaicBistros/4/il_794xN.7741722105_h6fw.webp',
        '/afus-products/ZellijMosaicBistros/4/il_794xN.7741783947_u906.avif'
      ]
    }).eq('id', pId);
    if (!updateErr) console.log(`Successfully updated media_gallery for product ${pId}`);
    else console.error(updateErr);
  } else {
    console.log("Product not found");
  }
}
run();
