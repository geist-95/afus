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
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: products, error } = await supabase.from('products').select('id, title_translations');
  if (error) {
    console.error(error);
    return;
  }

  const toDelete = [];
  for (const p of products) {
    const title = p.title_translations?.en || '';
    if (title === 'Test product' || title === 'Flow Product') {
      toDelete.push(p.id);
    }
  }

  if (toDelete.length > 0) {
    console.log('Deleting products with IDs:', toDelete);
    const { error: delError } = await supabase.from('products').delete().in('id', toDelete);
    if (delError) console.error('Delete error:', delError);
    else console.log('Successfully deleted dummy products.');
  } else {
    console.log('No dummy products found to delete.');
  }
}
run();
