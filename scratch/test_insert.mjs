import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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

// Use Bouchra's credentials to sign in and insert a product
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Sign in as Bouchra
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: 'boucha@yopmail.com',
    password: 'password123', // whatever password she used. Wait, we don't know the password.
  });
  
  if (signInErr) {
    console.log('SignIn failed:', signInErr.message);
    return;
  }
  
  console.log('Logged in as Bouchra, UID:', signInData.user.id);
  
  // Find shop
  const { data: shops } = await supabase.from('shops').select('*').eq('owner_id', signInData.user.id);
  if (!shops || shops.length === 0) {
    console.log('No shop found');
    return;
  }
  const shopId = shops[0].id;
  console.log('Shop ID:', shopId);

  // Insert product
  const { data: product, error: prodErr } = await supabase.from('products').insert({
    shop_id: shopId,
    category_id: '6f666666-6666-6666-6666-666666666666',
    title_translations: { en: 'Test product', fr: 'Test product', ar: 'Test product' },
    description_translations: { en: 'Test desc', fr: 'Test desc', ar: 'Test desc' },
    base_price_mad: 100,
    media_gallery: ['https://placeholder.com/image.png'],
    stock_quantity: 99,
  }).select().single();

  console.log('Insert product result:', prodErr || product);
}
run();
