import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDI1NzQsImV4cCI6MjA5NTkxODU3NH0.rY2ayagWePOJKTOXEd-IBXgXoTEeTAJuMwk2ovONTjk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: profiles, error: pe } = await supabase.from('profiles').select('*');
  console.log('Profiles:', JSON.stringify(profiles, null, 2), pe);

  const { data: shops, error: se } = await supabase.from('shops').select('id, name, slug, owner_id');
  console.log('Shops:', JSON.stringify(shops, null, 2), se);

  const { data: products, error: pre } = await supabase.from('products').select('id, title_translations, shop_id');
  console.log('Products count:', products?.length, pre);
}

check();
