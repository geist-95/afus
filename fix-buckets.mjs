import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dprajdnxajldaaxwqqsf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateBuckets() {
  const bucketsToEnsure = ['media']; // We know 'media' is used by uploadImage
  
  const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }
  
  const existingNames = existingBuckets.map(b => b.name);
  console.log('Existing buckets:', existingNames);
  
  for (const bucketName of bucketsToEnsure) {
    if (!existingNames.includes(bucketName)) {
      console.log(`Bucket '${bucketName}' not found. Creating it...`);
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'video/mp4'],
        fileSizeLimit: 10485760 // 10MB
      });
      if (error) {
        console.error(`Failed to create bucket '${bucketName}':`, error);
      } else {
        console.log(`Successfully created bucket '${bucketName}'.`);
      }
    } else {
      console.log(`Bucket '${bucketName}' already exists. Making sure it is public...`);
      const { data, error } = await supabase.storage.updateBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'video/mp4'],
        fileSizeLimit: 10485760 // 10MB
      });
      if (error) {
        console.error(`Failed to update bucket '${bucketName}':`, error);
      } else {
        console.log(`Successfully updated bucket '${bucketName}'.`);
      }
    }
  }
}

checkAndCreateBuckets();
