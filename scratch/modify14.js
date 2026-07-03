const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// Replace the padding-bottom classes on the scrollable content wrapper
const regex = /className="flex-1 flex flex-col justify-start pt-28 md:pt-10 pb-24 md:pb-10 px-6 md:px-10 lg:px-14 lg:pb-14 min-h-full"/;
const newClass = 'className="flex-1 flex flex-col justify-start pt-28 md:pt-10 pb-0 px-6 md:px-10 lg:px-14 min-h-full"';

content = content.replace(regex, newClass);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
