import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDI1NzQsImV4cCI6MjA5NTkxODU3NH0.rY2ayagWePOJKTOXEd-IBXgXoTEeTAJuMwk2ovONTjk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('products')
    .select('*, shops(*), product_variants(*)');
  if (error) {
    console.error('Query failed:', error);
  } else {
    console.log('Query succeeded! Total products:', data?.length);
    if (data && data.length > 0) {
      console.log('First product keys:', Object.keys(data[0]));
    }
  }
}

check();
