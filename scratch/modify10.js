const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Remove .slice(0, ...)
content = content.replace(/\.slice\(0,\s*showAllCategories \? staticCategories\.length : 5\)/, '');

// 2. Remove the "More" button logic
const moreButtonRegex = /\{!showAllCategories && staticCategories\.length > 5 && \(\s*<button[\s\S]*?<\/button>\s*\)\}/;
content = content.replace(moreButtonRegex, '');

// 3. Update onChange to set category AND go to next step
// Wait, the radio input might exist in multiple places if we didn't remove it from step1?
// I DID remove it from step1 and put it into step_category.
// Let's replace the specific onChange.
const oldOnChange = /onChange=\{\(\) => setProductCategory\(c\.id\)\}/g;
const newOnChange = `onChange={() => {
                                      setProductCategory(c.id);
                                      setTimeout(() => setStep('step2'), 150);
                                    }}`;
content = content.replace(oldOnChange, newOnChange);

// 4. Remove the sticky footer submit button for step_category
const stepCategoryFooterRegex = /<div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">\s*<button\s*type="submit"\s*disabled=\{!productCategory\}\s*className="flex-1 w-full flex items-center justify-center gap-2 bg-primary text-white py-3\.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-primary\/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"\s*>\s*\{t\.next\}\s*<\/button>\s*<\/div>/;
content = content.replace(stepCategoryFooterRegex, '');

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
