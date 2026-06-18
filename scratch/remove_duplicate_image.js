import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: product, error } = await supabase
    .from('products')
    .select('id, media_gallery')
    .eq('slug_translations->>en', 'ancient-tree-extra-virgin-olive-oil-750ml')
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return;
  }

  // Remove the duplicate image (the second one)
  const updatedGallery = product.media_gallery.filter(img => img !== '/afus-products/MedinaBaboucheMules/1/il_794xN.7211059994_lmsi.avif');

  const { error: updateError } = await supabase
    .from('products')
    .update({ media_gallery: updatedGallery })
    .eq('id', product.id);

  if (updateError) {
    console.error('Error updating product:', updateError);
  } else {
    console.log('Successfully removed duplicate image.');
  }
}

run();
