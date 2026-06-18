import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleLogos = [
  'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=400&h=400',
  'https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?auto=format&fit=crop&w=400&h=400',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=400&h=400',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&h=400',
  'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?auto=format&fit=crop&w=400&h=400',
  'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=400&h=400'
];

const sampleBanners = [
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&h=400',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&h=400',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&h=400',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&h=400',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&h=400',
  'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=1200&h=400'
];

async function run() {
  console.log('Fetching all products with _is_seeded flag...');
  // We can fetch all products since our seeded ones have _is_seeded in the translations or attributes.
  // The simplest way is to fetch all products and filter locally for safety.
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, created_at, shop_id, slug_translations');
    
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  // Filter for seeded products
  const seededProducts = products.filter(p => p.slug_translations && p.slug_translations._is_seeded === true);
  
  console.log(`Found ${seededProducts.length} seeded products. Scrambling dates...`);
  
  const now = new Date();
  const shopIds = new Set();
  
  for (const product of seededProducts) {
    shopIds.add(product.shop_id);
    
    // Generate a random offset between 0 and 7 days (in milliseconds)
    const randomOffsetMs = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    const newDate = new Date(now.getTime() - randomOffsetMs);
    
    await supabase
      .from('products')
      .update({ created_at: newDate.toISOString() })
      .eq('id', product.id);
  }
  
  console.log(`Scrambled dates for ${seededProducts.length} products.`);
  console.log(`Found ${shopIds.size} unique shops from seeded products. Updating avatars and banners...`);
  
  let i = 0;
  for (const shopId of Array.from(shopIds)) {
    const logoUrl = sampleLogos[i % sampleLogos.length];
    const bannerUrl = sampleBanners[i % sampleBanners.length];
    
    const { error: shopErr } = await supabase
      .from('shops')
      .update({ logo_url: logoUrl, banner_url: bannerUrl })
      .eq('id', shopId);
      
    if (shopErr) {
      console.error(`Error updating shop ${shopId}:`, shopErr);
    } else {
      console.log(`Updated shop ${shopId} with new logo and banner.`);
    }
    i++;
  }
  
  console.log('All updates completed successfully!');
}

run();
