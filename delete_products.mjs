import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const productId = 'ba5573ca-0c73-4511-a878-fdf6194c6f44';
  
  console.log('Deleting order items for product', productId);
  const { error: orderItemsError } = await supabase
    .from('order_items')
    .delete()
    .eq('product_id', productId);
    
  if (orderItemsError) {
    console.error('Failed to delete order items:', orderItemsError);
    return;
  }
  
  console.log('Deleting product', productId);
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
    
  if (deleteError) {
    console.error('Failed to delete product', deleteError);
  } else {
    console.log('Successfully deleted product', productId);
  }
}

run();
