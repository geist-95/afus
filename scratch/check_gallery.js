import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDI1NzQsImV4cCI6MjA5NTkxODU3NH0.rY2ayagWePOJKTOXEd-IBXgXoTEeTAJuMwk2ovONTjk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('products').select('id, title_translations, media_gallery').limit(10);
  if (error) {
    console.error(error);
    return;
  }
  data.forEach(p => {
    console.log(`Product: ${p.title_translations?.en || p.id}`);
    console.log(`Media gallery length: ${p.media_gallery?.length || 0}`);
    p.media_gallery?.forEach((url, i) => {
      console.log(`  [${i}] ${url.substring(0, 100)}...`);
    });
  });
}

check();
