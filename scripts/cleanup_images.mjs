import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey);

function isInvalidUrl(url) {
  if (!url) return false;
  return url.startsWith('blob:') || url.startsWith('data:image');
}

async function run() {
  console.log('Cleaning up invalid image URLs from DB...');
  
  // Clean shops table
  const { data: shops, error: shopsError } = await supabase.from('shops').select('*');
  if (shopsError) {
    console.error('Error fetching shops:', shopsError);
    return;
  }
  
  for (const shop of shops) {
    const updates = {};
    if (isInvalidUrl(shop.logo_url)) updates.logo_url = null;
    if (isInvalidUrl(shop.banner_url)) updates.banner_url = null;
    
    if (shop.metadata) {
      let metaUpdated = false;
      const newMeta = { ...shop.metadata };
      if (isInvalidUrl(newMeta.logo_url)) {
        newMeta.logo_url = '';
        metaUpdated = true;
      }
      if (isInvalidUrl(newMeta.cover_url)) {
        newMeta.cover_url = '';
        metaUpdated = true;
      }
      if (metaUpdated) updates.metadata = newMeta;
    }
    
    if (Object.keys(updates).length > 0) {
      console.log(`Cleaning shop ${shop.id}:`, Object.keys(updates));
      await supabase.from('shops').update(updates).eq('id', shop.id);
    }
  }

  // Clean products table
  const { data: products, error: productsError } = await supabase.from('products').select('*');
  if (productsError) {
    console.error('Error fetching products:', productsError);
    return;
  }
  
  for (const product of products) {
    if (product.media_gallery && Array.isArray(product.media_gallery)) {
      const validMedia = product.media_gallery.filter(url => !isInvalidUrl(url));
      if (validMedia.length !== product.media_gallery.length) {
        console.log(`Cleaning product ${product.id}: removed ${product.media_gallery.length - validMedia.length} invalid media URLs.`);
        await supabase.from('products').update({ media_gallery: validMedia }).eq('id', product.id);
      }
    }
  }
  
  // Clean reviews table
  const { data: reviews, error: reviewsError } = await supabase.from('reviews').select('*');
  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
    return;
  }
  for (const review of reviews) {
    if (review.media_urls && Array.isArray(review.media_urls)) {
      const validMedia = review.media_urls.filter(url => !isInvalidUrl(url));
      if (validMedia.length !== review.media_urls.length) {
         console.log(`Cleaning review ${review.id}: removed invalid media URLs.`);
         await supabase.from('reviews').update({ media_urls: validMedia }).eq('id', review.id);
      }
    }
  }
  
  console.log('Cleanup complete!');
}

run().catch(console.error);
