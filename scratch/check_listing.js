const fs = require('fs');
const content = fs.readFileSync('/Users/yazidtalbi/afus/src/app/[lang]/(main)/listing/[numeric_id]/[product_slug]/ListingClientWrapper.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('isSeeded')) console.log(`${i+1}: ${line}`);
});
