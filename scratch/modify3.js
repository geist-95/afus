const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Remove logo
const logoRegex = /<div className="flex items-center gap-2 md:gap-3">\s*<img src="\/logo\/logo\.png".*?\/>\s*<img src="\/logo\/afus\.svg".*?\/>\s*<\/div>/;
content = content.replace(logoRegex, '<div></div>');

// 2. Replace title in step 1
const oldTitle = "<h1 className=\"text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight\">{lang === 'fr' ? 'Commençons par les bases' : lang === 'ar' ? 'لنبدأ بالأساسيات' : 'Let\\'s start with the basics'}</h1>";
const newTitle = "<h1 className=\"text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight\">{lang === 'fr' ? 'Que créez-vous ou proposez-vous ?' : lang === 'ar' ? 'ماذا تصنع أو تقدم؟' : 'What do you create or offer?'}</h1>";
content = content.replace(oldTitle, newTitle);

const oldSubtitle = "<p className=\"text-neutral-500 mt-2 text-base\">{lang === 'fr' ? 'Photos, catégorie et nom de boutique' : lang === 'ar' ? 'الصور والفئة واسم المتجر' : 'Photos, category, and shop name'}</p>";
const newSubtitle = "<p className=\"text-neutral-500 mt-2 text-base\">{lang === 'fr' ? 'Photos et catégorie' : lang === 'ar' ? 'الصور والفئة' : 'Photos and category'}</p>";
content = content.replace(oldSubtitle, newSubtitle);

// 3. Fix button wrapper classes
// Current classes vary slightly (mt-6 vs mt-8)
const buttonWrapperRegex = /className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-\d+"/g;
const newButtonWrapper = 'className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-8"';

content = content.replace(buttonWrapperRegex, newButtonWrapper);

// 4. Update padding of the form container so that sticky footer doesn't overlap text when scrolled to very bottom
// Wait, sticky elements in flex-1 flex-col might need mt-auto or similar.
// Let's just make sure we remove `md:pb-10` and replace with `md:pb-0` since the sticky footer has its own padding.
const formContainerRegex = /className="px-6 pb-24 pt-32 md:px-10 lg:px-14 md:pb-10 flex-1 flex flex-col"/;
content = content.replace(formContainerRegex, 'className="px-6 pb-0 pt-32 md:px-10 lg:px-14 flex-1 flex flex-col"');

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Modifications applied successfully.");
