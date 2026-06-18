import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // First, find the shop
  const { data: shops, error: shopErr } = await supabase
    .from('shops')
    .select('id')
    .eq('name', 'AtlasBoucherouiteCo');
    
  if (shopErr || !shops || shops.length === 0) {
    console.error('Could not find AtlasBoucherouiteCo shop:', shopErr);
    return;
  }
  
  const shopId = shops[0].id;
  
  // Now find the product
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, media_gallery')
    .eq('shop_id', shopId)
    .ilike('title_translations->>fr', '%Mocassins Huarache%');
    
  if (prodErr || !products || products.length === 0) {
    console.error('Could not find product:', prodErr);
    return;
  }
  
  const product = products[0];
  const gallery = product.media_gallery;
  
  if (gallery && gallery.length > 1) {
    // The first image should be the last one
    const firstImage = gallery.shift(); // removes first element
    gallery.push(firstImage); // adds to the end
    
    const { error: updateErr } = await supabase
      .from('products')
      .update({ media_gallery: gallery })
      .eq('id', product.id);
      
    if (updateErr) {
      console.error('Failed to update product:', updateErr);
    } else {
      console.log(`Successfully updated media_gallery for product ${product.id}`);
      console.log('New gallery:', gallery);
    }
  } else {
    console.log('Not enough images to rearrange.');
  }
}

run();
