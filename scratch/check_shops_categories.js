import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDI1NzQsImV4cCI6MjA5NTkxODU3NH0.rY2ayagWePOJKTOXEd-IBXgXoTEeTAJuMwk2ovONTjk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: shops, error: shopsErr } = await supabase.from('shops').select('*');
  const { data: categories, error: catsErr } = await supabase.from('categories').select('*');
  const { data: profiles, error: profsErr } = await supabase.from('profiles').select('*');
  console.log('Shops:', JSON.stringify(shops, null, 2));
  console.log('Categories:', JSON.stringify(categories, null, 2));
  console.log('Profiles:', JSON.stringify(profiles, null, 2));
}

check();
