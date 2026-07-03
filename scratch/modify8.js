const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// Replace all instances of `className="space-y-6 text-center"` and `className="space-y-6 text-center flex-1 flex flex-col"` (to normalize)
content = content.replace(/className="space-y-6 text-center flex-1 flex flex-col"/g, 'className="space-y-6 text-center"');
content = content.replace(/className="space-y-6 text-center"/g, 'className="space-y-6 text-center flex-1 flex flex-col"');

// Same for form `className="space-y-6 text-left"`
content = content.replace(/className="space-y-6 text-left flex-1 flex flex-col"/g, 'className="space-y-6 text-left"');
content = content.replace(/className="space-y-6 text-left"/g, 'className="space-y-6 text-left flex-1 flex flex-col"');

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
