import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const file = new Blob(['test content'], { type: 'image/jpeg' });
  const fileName = `test_${Date.now()}.jpg`;
  
  console.log('Testing upload with ANON key...');
  const { data, error } = await supabase.storage.from('media').upload(fileName, file);
  
  if (error) {
    console.error('Upload failed:', error.message);
  } else {
    console.log('Upload succeeded!', data);
  }
}
run();
