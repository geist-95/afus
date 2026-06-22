import fs from 'fs';
const file = '/Users/yazidtalbi/afus/src/components/ui/StoreOnboardingModal.tsx';
const content = fs.readFileSync(file, 'utf8');

let braces = 0;
let parens = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let char of line) {
    if (char === '{') braces++;
    if (char === '}') braces--;
    if (char === '(') parens++;
    if (char === ')') parens--;
  }
  if (braces < 0 || parens < 0) {
    console.log(`Mismatch at line ${i + 1}: braces=${braces}, parens=${parens}`);
    break;
  }
}
console.log(`Final: braces=${braces}, parens=${parens}`);
