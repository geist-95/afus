import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching seeded products...');
  
  // Find products where title_translations contains _is_seeded
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, title_translations')
    // A quick way to find them is filtering on the JSON property. 
    // We can just fetch all or filter by those containing [Seeded]
    .ilike('title_translations->>en', '%[Seeded]%');
    
  if (productError) {
    console.error('Error fetching products:', productError);
    return;
  }
  
  if (!products || products.length === 0) {
    console.log('No seeded products found with the label.');
    return;
  }
  
  console.log(`Found ${products.length} products to update.`);
  
  for (const product of products) {
    let currentEnTitle = product.title_translations?.en || '';
    
    // Remove the "[Seeded]" string and any trailing whitespace
    let newEnTitle = currentEnTitle.replace('[Seeded]', '').trim();
    
    const newTitleTranslations = {
      ...product.title_translations,
      en: newEnTitle
    };
    
    console.log(`Updating "${currentEnTitle}" -> "${newEnTitle}"`);
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        title_translations: newTitleTranslations
      })
      .eq('id', product.id);
      
    if (updateError) {
      console.error(`Failed to update product ${product.id}:`, updateError);
    } else {
      console.log(`✅ Success for ${product.id}`);
    }
  }
  
  console.log('Update complete!');
}

run();
