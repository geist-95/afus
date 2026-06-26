import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function findAndDelete() {
  console.log("Searching for product...");
  
  // Find product by matching title, description or price
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title_translations, description_translations, base_price_mad, shop_id')
    .eq('base_price_mad', 1221);

  if (error) {
    console.error("Error finding product:", error);
    return;
  }

  if (!products || products.length === 0) {
    console.log("No matching product found.");
    return;
  }

  console.log("Found products:", products);

  for (const product of products) {
    console.log(`\nProcessing product: ${product.title} (${product.id})`);
    
    // Find shop
    if (product.shop_id) {
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id, owner_id')
        .eq('id', product.shop_id)
        .single();
        
      if (shopError) {
        console.error("Error finding shop:", shopError);
      } else if (shop) {
        console.log("Found shop:", shop);
        
        const userId = shop.owner_id;
        
        // 1. Delete product
        console.log(`Deleting product ${product.id}...`);
        const { error: delProdErr } = await supabase.from('products').delete().eq('id', product.id);
        if (delProdErr) console.error("Error deleting product:", delProdErr);
        else console.log("Product deleted.");

        // 2. Delete shop
        console.log(`Deleting shop ${shop.id}...`);
        const { error: delShopErr } = await supabase.from('shops').delete().eq('id', shop.id);
        if (delShopErr) console.error("Error deleting shop:", delShopErr);
        else console.log("Shop deleted.");

        // 3. Delete user
        if (userId) {
          console.log(`Deleting user profiles for ${userId}...`);
          // Note: In Supabase, deleting from auth.users might require admin api
          const { error: delProfileErr } = await supabase.from('profiles').delete().eq('id', userId);
          if (delProfileErr) console.error("Error deleting profile:", delProfileErr);
          else console.log("Profile deleted.");
          
          console.log(`Deleting auth user ${userId}...`);
          const { data: authData, error: authErr } = await supabase.auth.admin.deleteUser(userId);
          if (authErr) console.error("Error deleting auth user:", authErr);
          else console.log("Auth user deleted.");
        }
      }
    } else {
      console.log("Product has no shop_id.");
    }
  }
}

findAndDelete();
