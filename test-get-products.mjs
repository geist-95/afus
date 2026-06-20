import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDI1NzQsImV4cCI6MjA5NTkxODU3NH0.rY2ayagWePOJKTOXEd-IBXgXoTEeTAJuMwk2ovONTjk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('products').select('slug_translations, title_translations').eq('id', '4a0379f3-e9c1-4659-92bf-a8f7cc9b9f41').single();
  console.log(JSON.stringify(data, null, 2));
}

check();
