import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDI1NzQsImV4cCI6MjA5NTkxODU3NH0.rY2ayagWePOJKTOXEd-IBXgXoTEeTAJuMwk2ovONTjk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('shops').select('id, name, logo_url, banner_url').limit(20);
  if (error) {
    console.error(error);
    return;
  }
  data.forEach(s => {
    console.log(`Shop: ${s.name}`);
    console.log(`  logo_url: ${s.logo_url ? s.logo_url.substring(0, 100) : 'none'}...`);
    console.log(`  banner_url: ${s.banner_url ? s.banner_url.substring(0, 100) : 'none'}...`);
  });
}

check();
