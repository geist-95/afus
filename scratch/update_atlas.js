import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Read the new French description from the info file
  const infoTxt = fs.readFileSync('public/afus-products/AtlasBoucherouiteCo/1/info.txt', 'utf-8');
  const lines = infoTxt.split('\n');
  
  // Extract description (from line 9 to 25 approx based on previous view)
  const descLines = [];
  let inDesc = false;
  for (const line of lines) {
    if (line.trim() === "Entrez dans l'élégance intemporelle avec nos bijoux en cuir fabriqués à la main ! ??") {
      inDesc = true;
    }
    if (inDesc && line.startsWith('-----')) {
      break;
    }
    if (inDesc) {
      descLines.push(line);
    }
  }
  const newFrDesc = descLines.join('\n').trim();

  // Get current product
  const { data: prodData, error: prodErr } = await supabase.from('products').select('*').eq('shop_id', '55900fb0-2331-4e17-beb7-ea465127f62b').single();
  if (prodErr) throw prodErr;

  const currentDesc = prodData.description_translations;
  currentDesc.fr = newFrDesc;

  // Update DB
  const { data, error } = await supabase.from('products').update({ description_translations: currentDesc }).eq('id', prodData.id);
  if (error) {
    console.error('Update failed:', error);
  } else {
    console.log('Update successful! New FR description:', newFrDesc.slice(0, 100) + '...');
  }
}
run();
