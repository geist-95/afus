import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read env variables
const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = {};
envLocal.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
  console.log('Buckets:', buckets, bucketsErr);

  const mediaBucketExists = buckets && buckets.some(b => b.name === 'media');
  if (!mediaBucketExists) {
    console.log('Creating media bucket...');
    const { data, error } = await supabase.storage.createBucket('media', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    });
    console.log('Bucket creation result:', data, error);
  } else {
    console.log('media bucket already exists.');
  }

  // Try listing files in media bucket
  const { data: files, error: filesErr } = await supabase.storage.from('media').list();
  console.log('Files in media bucket:', files ? files.length : 0, filesErr);
}
run();
