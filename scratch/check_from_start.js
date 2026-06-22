import fs from 'fs';
const file = '/Users/yazidtalbi/afus/src/components/ui/StoreOnboardingModal.tsx';
const content = fs.readFileSync(file, 'utf8');

let braces = 0;
let lines = content.split('\n');
for (let i = 0; i < 340; i++) {
  let line = lines[i];
  for (let char of line) {
    if (char === '{') braces++;
    if (char === '}') braces--;
  }
  console.log(`Line ${i + 1}: braces count = ${braces} (content: ${line.trim()})`);
}
