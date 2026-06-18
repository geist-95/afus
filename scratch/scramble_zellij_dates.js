import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const shopId = 'e3dfde37-5432-47ea-87f8-c7e265f7a683';
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, created_at')
    .eq('shop_id', shopId);
    
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  if (!products || products.length === 0) {
    console.log('No products found for ZellijMosaicBistros.');
    return;
  }
  
  console.log(`Found ${products.length} products. Scrambling dates...`);
  
  // Base date: Now (June 18, 2026 approx)
  const now = new Date();
  
  for (const product of products) {
    // Generate a random offset between 0 and 7 days (in milliseconds)
    const randomOffsetMs = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    const newDate = new Date(now.getTime() - randomOffsetMs);
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ created_at: newDate.toISOString() })
      .eq('id', product.id);
      
    if (updateError) {
      console.error(`Error updating product ${product.id}:`, updateError);
    } else {
      console.log(`Updated product ${product.id} created_at to ${newDate.toISOString()}`);
    }
  }
  
  console.log('Finished scrambling dates.');
}

run();
