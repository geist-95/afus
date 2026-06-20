import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0MjU3NCwiZXhwIjoyMDk1OTE4NTc0fQ.ol_bQOATJV8BUmlNKWxNhkRMCWMLQuQUgExFJz4Dk9c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.storage.createBucket('media', { public: true });
  if (error) {
    console.error('Failed to create bucket:', error);
  } else {
    console.log('Bucket created:', data);
  }
}

check();
