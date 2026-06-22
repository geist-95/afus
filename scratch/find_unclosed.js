import fs from 'fs';
const file = '/Users/yazidtalbi/afus/src/components/ui/StoreOnboardingModal.tsx';
const content = fs.readFileSync(file, 'utf8');

// We find the labels object, and trace how many opening and closing braces we have inside
const startIdx = content.indexOf('const labels');
const endIdx = content.indexOf('const MOROCCAN_CITIES');
const labelsContent = content.slice(startIdx, endIdx);

let braces = 0;
let lines = labelsContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let char of line) {
    if (char === '{') braces++;
    if (char === '}') braces--;
  }
  console.log(`Line ${i + 38}: braces count = ${braces} (content: ${line.trim()})`);
}
