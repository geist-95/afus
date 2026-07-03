const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Remove the sign-in button
const signInButtonRegex = /\s*\{!hasSession && \(\s*<button[\s\S]*?<\/button>\s*\)\}/;
content = content.replace(signInButtonRegex, '');

// 2. Change the submit button text in the account step
// The account step submit button uses `{t.next}`.
// But wait, step1 also uses `{t.next}`? No, step1 uses `{t.next}`. Step2 also uses `{t.next}`?
// Let's replace only the `{t.next}` inside the `account` step form.
// I will just replace the exact block of the account step footer.
const oldFooter = `<div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">
                        <button
                          type="submit"
                          className="flex-1 w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-primary/90 transition-all"
                        >
                          {t.next}
                          <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                        </button>`;

const newFooter = `<div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">
                        <button
                          type="submit"
                          className="flex-1 w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-primary/90 transition-all"
                        >
                          {lang === 'fr' ? 'Publier mon produit' : lang === 'ar' ? 'نشر منتجي' : 'Publish my product'}
                          <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                        </button>`;

content = content.replace(oldFooter, newFooter);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
