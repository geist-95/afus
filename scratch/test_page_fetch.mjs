import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read env variables
const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = {};
envLocal.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchShopBySlug(slug) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  let query = supabase.from('shops').select('*');
  if (isUUID) {
    query = query.eq('id', slug);
  } else {
    query = query.eq('slug', slug);
  }
  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}

async function fetchShopProducts(shopId) {
  const { data, error } = await supabase.from('products').select('*, shops(*), product_variants(*)').eq('shop_id', shopId);
  if (error) throw error;
  return (data || []).map((p) => ({ ...p, variants: p.product_variants || [] }));
}

async function fetchProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

async function fetchShopReviews(shopId) {
  const { data, error } = await supabase.from('reviews').select('*, reviewer_profile:profiles!reviewer_id(full_name, avatar_url), product:products!product_id(title_translations, media_gallery)').eq('shop_id', shopId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function test() {
  const slug = 'ouraintribalweaves';
  console.log('Testing page fetches for slug:', slug);
  try {
    const shop = await fetchShopBySlug(slug);
    console.log('1. Shop fetched successfully:', shop.id);

    const shopProducts = await fetchShopProducts(shop.id);
    console.log('2. Products fetched successfully. Count:', shopProducts.length);

    let owner = null;
    if (shop.owner_id) {
      owner = await fetchProfile(shop.owner_id);
      console.log('3. Owner fetched successfully:', owner.id, owner.full_name);
    }

    const reviews = await fetchShopReviews(shop.id);
    console.log('4. Reviews fetched successfully. Count:', reviews.length);
  } catch (err) {
    console.error('Fetch failed with error:', err);
  }
}

test();
