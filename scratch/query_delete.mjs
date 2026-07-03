import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log('Finding products with title "azd"...');
  
  // Search for the product
  const { data: products, error: findError } = await supabase
    .from('products')
    .select('*')
    //.eq('title_translations->>fr', 'azd') // Try exact match first
    
  if (findError) {
    console.error('Error:', findError);
    return;
  }
  
  // Filter manually just in case
  const match = products.filter(p => {
      const titleFr = p.title_translations?.fr || '';
      const price = p.price;
      return titleFr.includes('azd') || price === 2332;
  });
  
  console.log(`Found ${match.length} matching product(s):`, JSON.stringify(match, null, 2));
  
  if (match.length > 0) {
      const p = match[0];
      const shopId = p.shop_id;
      console.log('Shop ID:', shopId);
      
      const { data: shop } = await supabase.from('shops').select('*').eq('id', shopId).single();
      console.log('Shop:', shop);
      
      if (shop) {
          const sellerId = shop.seller_id;
          console.log('Seller ID (user ID):', sellerId);
          
          const { data: user } = await supabase.auth.admin.getUserById(sellerId);
          console.log('User:', user?.user?.email);
      }
  }
}

run();
