import fs from 'fs';

const r = JSON.parse(fs.readFileSync('lh-report.json', 'utf8'));
const networkRequestsAudit = r.audits['network-requests'];
if (networkRequestsAudit && networkRequestsAudit.details && networkRequestsAudit.details.items) {
  const items = networkRequestsAudit.details.items;
  console.log('Top 15 largest network requests:');
  items
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 15)
    .forEach(item => {
      console.log(`- URL: ${item.url}`);
      console.log(`  Size: ${(item.transferSize / 1024).toFixed(2)} KB, Type: ${item.resourceType || 'unknown'}`);
    });
} else {
  console.log('No network-requests details found');
}
