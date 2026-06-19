import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmFqZG54YWpsZGFheHdxcXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey);

const shopNameMap = {
  'AtlasBoucherouiteCo': 'Artisanat cuir',
  'BeniOurainBoutique': 'Mode bohème',
  'MoorishWroughtIron': 'Tapis berbères',
  'SafiTerracottaHome': 'Savons naturels',
  'ZanafiFlatweaves': 'Chaussures velours',
  'MedinaBaboucheMules': 'Huile d\'olive pure',
  'BaboucheSlipperCo': 'Impressions d\'art',
  'EssaouiraThuyaCrafts': 'Céramique marocaine',
  'TamegrouteSaharaGlaze': 'Décoration murale',
  'MarrakechFiligreeLamps': 'Vêtements artisanaux',
  'RoyalMarrakeshLeather': 'Poterie traditionnelle',
  'BerberKilimArtisans': 'Bijoux personnalisés',
  'ZellijMosaicBistros': 'Bijoux nomades'
};

async function run() {
  console.log('Fetching shops to rename...');
  
  for (const [oldName, newName] of Object.entries(shopNameMap)) {
    const { data: shops, error: shopErr } = await supabase
      .from('shops')
      .select('id')
      .eq('name', oldName);
      
    if (shopErr || !shops || shops.length === 0) {
      console.log(`Could not find shop: ${oldName}`);
      continue;
    }
    
    const shopId = shops[0].id;
    const { error: updateErr } = await supabase
      .from('shops')
      .update({ name: newName })
      .eq('id', shopId);
      
    if (updateErr) {
      console.error(`Error updating shop ${oldName}:`, updateErr);
    } else {
      console.log(`Renamed "${oldName}" -> "${newName}"`);
    }
  }
  
  console.log('Finished renaming shops.');
}

run();
