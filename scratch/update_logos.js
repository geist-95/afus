import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  await supabase
    .from('shops')
    .update({ logo_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&h=400' })
    .eq('name', 'Vêtements artisanaux');
    
  await supabase
    .from('shops')
    .update({ logo_url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=400&h=400' })
    .eq('name', "Impressions d'art");

  console.log('Updated logos');
}
run();
