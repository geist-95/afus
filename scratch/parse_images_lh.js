import fs from 'fs';

const r = JSON.parse(fs.readFileSync('lh-report.json', 'utf8'));

// Audits related to images: 'modern-image-formats', 'uses-optimized-images', 'responsive-images', 'image-size-responsive', etc.
const auditsToCheck = ['modern-image-formats', 'uses-optimized-images', 'responsive-images', 'image-size-responsive', 'image-delivery-insight'];

auditsToCheck.forEach(auditId => {
  const audit = r.audits[auditId];
  if (audit) {
    console.log(`=== Audit: ${auditId} (Score: ${audit.score}) ===`);
    if (audit.details && audit.details.items) {
      audit.details.items.forEach((item, index) => {
        console.log(`[${index}] URL: ${item.url}`);
        console.log(`    Wasted bytes/savings: ${item.wastedBytes || item.wastedPercent || ''}`);
      });
    } else {
      console.log('No items details');
    }
  } else {
    console.log(`Audit ${auditId} not found`);
  }
});
