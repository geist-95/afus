import fs from 'fs';
const file = '/Users/yazidtalbi/afus/src/components/ui/StoreOnboardingModal.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');
// Remove lines 326 to 367 inclusive
lines.splice(325, 42);
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Cleaned successfully!');
