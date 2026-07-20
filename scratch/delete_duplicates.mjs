import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c'; // using service role

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const shopIds = [
    '64c16268-8d68-42f2-aeae-8c9cf29341cc',
    '563a6757-1059-4f52-9541-7c741d982ea5',
    '951998e8-4c5f-44a9-8803-c407c9dd4096'
  ];
  
  const productIds = [
    '11b43ff4-9bfa-46f2-a15e-1baa82c251ba',
    '4088fe59-d4af-4411-9c28-eba252ed0cce',
    '42cb94c0-321e-4cc5-ab4a-6348e9eaedab'
  ];

  // We will keep the first product and its shop, and delete the rest.
  const shopToKeep = shopIds[0];
  const shopsToDelete = shopIds.slice(1);
  const productsToDelete = productIds.filter(id => id !== '42cb94c0-321e-4cc5-ab4a-6348e9eaedab'); // keep the one in the first shop

  // Delete products
  const { data: pd, error: pe } = await supabase.from('products').delete().in('id', productsToDelete);
  if (pe) console.error('Error deleting products:', pe);
  else console.log('Deleted products:', productsToDelete);

  // Delete shops
  const { data: sd, error: se } = await supabase.from('shops').delete().in('id', shopsToDelete);
  if (se) console.error('Error deleting shops:', se);
  else console.log('Deleted shops:', shopsToDelete);
}

main();
