const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Remove the label "Catégorie *"
const categoryLabelRegex = /<label className="text-sm font-semibold text-black block">\{t\.productCategory\} <span className="text-red-500">\*<\/span><\/label>/;
content = content.replace(categoryLabelRegex, '');

// 2. Change all titles like "Choisissez une catégorie" to match h2 style
// Current h1 style is: className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight"
// Let's change it to: className="text-2xl md:text-3xl font-semibold tracking-[-1px] text-neutral-900 leading-tight"
// We'll replace all instances of the old class string.
const oldH1Class = 'text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight';
const newH2Class = 'text-2xl md:text-3xl font-semibold tracking-[-1px] text-neutral-900 leading-tight';
content = content.split(oldH1Class).join(newH2Class);

// There might be variations, let's also check for:
const oldH1Class2 = 'text-3xl md:text-4xl font-bold text-neutral-900 leading-tight';
content = content.split(oldH1Class2).join(newH2Class);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
