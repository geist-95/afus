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

async function run() {
  const email = `test_onboard_${Date.now()}@yopmail.com`;
  const password = 'password123';
  const fullName = 'Test Onboard';
  const shopName = `Shop${Math.floor(Math.random() * 1000)}`;

  console.log('1. Signing up user:', email);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error('Sign up error:', signUpError);
    return;
  }

  const session = signUpData.session;
  console.log('Session returned on signup:', !!session);

  if (session) {
    console.log('2. Authenticating client with session...');
    const { error: setSessionErr } = await supabase.auth.setSession(session);
    if (setSessionErr) console.error('setSession error:', setSessionErr);
  }

  const userId = signUpData.user.id;
  console.log('3. Inserting profile for userId:', userId);
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email,
      full_name: fullName,
      role: 'seller',
      phone_number: '12345678',
      preferred_language: 'en',
    })
    .select()
    .single();

  if (profileError) {
    console.error('Profile insertion error:', profileError);
    return;
  }

  console.log('4. Inserting shop...');
  const shopSlug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .insert({
      owner_id: userId,
      name: shopName,
      slug: shopSlug,
      merchant_city: 'Marrakech',
      pickup_address_street: 'Derb Snan, Marrakech',
      ice_number: '123456789012345',
      is_verified: true,
    })
    .select()
    .single();

  if (shopError) {
    console.error('Shop insertion error:', shopError);
    return;
  }

  console.log('Shop inserted successfully:', shop.slug);

  console.log('5. Inserting product for shop:', shop.id);
  const { data: product, error: productError } = await supabase.from('products').insert({
    shop_id: shop.id,
    category_id: '6f666666-6666-6666-6666-666666666666',
    title_translations: { en: 'Test product', fr: 'Test product', ar: 'Test product' },
    description_translations: { en: 'Test desc', fr: 'Test desc', ar: 'Test desc' },
    base_price_mad: 100,
    media_gallery: ['https://placeholder.com/image.png'],
    stock_quantity: 99,
  }).select().single();

  if (productError) {
    console.error('Product insertion error:', productError);
  } else {
    console.log('Product inserted successfully:', product.id);
  }
}
run();
