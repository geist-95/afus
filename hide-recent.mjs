import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  console.log('Hiding products created after:', cutoff);
  const { data, error } = await supabase.from('products').update({ is_active: false }).gte('created_at', cutoff).select('id, title_translations');
  if (error) {
    console.error('Error updating products:', error);
  } else {
    console.log(`Successfully hidden ${data.length} products.`);
  }
}
run();
