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

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: shops } = await supabase.from('shops').select('*').eq('slug', 'bouchra-759');
  console.log('Shops with slug bouchra-759:', shops);
  if (shops && shops.length > 0) {
    const shopId = shops[0].id;
    const { data: products } = await supabase.from('products').select('*').eq('shop_id', shopId);
    console.log('Products for shop_id:', products);

    const { data: profiles } = await supabase.from('profiles').select('*').eq('id', shops[0].owner_id);
    console.log('Owner Profile:', profiles);
  }
}
run();
