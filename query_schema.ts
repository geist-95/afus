import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function main() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);
  if (error) console.error(error);
  if (data) {
    if (data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log("No rows, but query succeeded");
    }
  }
}
main();
