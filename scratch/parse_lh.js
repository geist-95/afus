import fs from 'fs';

const r = JSON.parse(fs.readFileSync('lh-report.json', 'utf8'));
for (const catId of ['performance', 'seo', 'agentic-browsing']) {
  console.log('=== Category:', catId);
  const cat = r.categories[catId];
  if (!cat) {
    console.log('Not found');
    continue;
  }
  cat.auditRefs.forEach(ref => {
    const audit = r.audits[ref.id];
    if (audit && audit.score !== null && audit.score < 0.9) {
      console.log(` - ${ref.id}: score=${audit.score}, title="${audit.title}", displayValue="${audit.displayValue || ''}"`);
      if (audit.description) {
        console.log(`   Desc: ${audit.description.substring(0, 150)}...`);
      }
    }
  });
}
