import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const productId = '8adaf8b5-ae60-4686-a070-a0daaea835d8';
  const shopId = 'c44419da-6cef-4340-b9dd-05e41f6c1bad';
  const ownerId = '599c201d-9006-4986-a79f-2d1e07f34bc3';

  console.log('Deleting product:', productId);
  const { error: pErr } = await supabase.from('products').delete().eq('id', productId);
  if (pErr) console.error('Product error:', pErr);
  else console.log('Product deleted.');

  console.log('Deleting shop:', shopId);
  const { error: sErr } = await supabase.from('shops').delete().eq('id', shopId);
  if (sErr) console.error('Shop error:', sErr);
  else console.log('Shop deleted.');

  console.log('Deleting user:', ownerId);
  const { error: uErr } = await supabase.auth.admin.deleteUser(ownerId);
  if (uErr) console.error('User error:', uErr);
  else console.log('User deleted.');
}

run();
