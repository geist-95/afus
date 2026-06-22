import fs from 'fs';

const r = JSON.parse(fs.readFileSync('lh-report.json', 'utf8'));
const networkRequestsAudit = r.audits['network-requests'];
if (networkRequestsAudit && networkRequestsAudit.details && networkRequestsAudit.details.items) {
  const items = networkRequestsAudit.details.items;
  items.forEach(item => {
    if (item.url.startsWith('data:image/')) {
      console.log('Base64 URL:', item.url.substring(0, 150) + '...');
      console.log('Size:', item.transferSize, 'bytes');
      console.log('Initiator:', JSON.stringify(item.initiator, null, 2));
    }
  });
}
