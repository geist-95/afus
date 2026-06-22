import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDI1NzQsImV4cCI6MjA5NTkxODU3NH0.rY2ayagWePOJKTOXEd-IBXgXoTEeTAJuMwk2ovONTjk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Check products
  const { data: products } = await supabase.from('products').select('id, title_translations, media_gallery');
  products?.forEach(p => {
    p.media_gallery?.forEach((url, i) => {
      if (url.startsWith('data:')) {
        console.log(`Product ${p.id} (${p.title_translations?.en}) media_gallery[${i}] is base64 of size ${url.length}`);
      }
    });
  });

  // Check profiles
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url');
  profiles?.forEach(pr => {
    if (pr.avatar_url && pr.avatar_url.startsWith('data:')) {
      console.log(`Profile ${pr.id} (${pr.full_name}) avatar_url is base64 of size ${pr.avatar_url.length}`);
    }
  });

  // Check shops
  const { data: shops } = await supabase.from('shops').select('id, name, logo_url, banner_url');
  shops?.forEach(s => {
    if (s.logo_url && s.logo_url.startsWith('data:')) {
      console.log(`Shop ${s.id} (${s.name}) logo_url is base64 of size ${s.logo_url.length}`);
    }
    if (s.banner_url && s.banner_url.startsWith('data:')) {
      console.log(`Shop ${s.id} (${s.name}) banner_url is base64 of size ${s.banner_url.length}`);
    }
  });
  console.log('Search complete.');
}

check();
