const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Make the "Sign in" button in the footer visible on desktop too
content = content.replace(
  /className="md:hidden flex-1 flex items-center justify-center/g,
  'className="flex-1 flex items-center justify-center'
);

// 2. Remove the "ou" divider and the desktop "Already have account" link
const orDividerRegex = /\{!hasSession && \(\s*<>\s*<div className="hidden md:flex items-center gap-3 my-2">[\s\S]*?<div className="hidden md:text-center">[\s\S]*?<\/button>\s*<\/div>\s*<\/>\s*\)\}/;
content = content.replace(orDividerRegex, '');

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
