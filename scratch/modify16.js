const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Remove the footer "Retour" button in step2
// Let's find the step2 footer.
const step2FooterRegex = /(<div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">)\s*<button\s*type="submit"[\s\S]*?<\/button>\s*<button\s*type="button"\s*onClick=\{\(\) => setStep\('step1'\)\}[\s\S]*?<\/button>/;
// Wait, the footer in step2 is currently:
// <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">
//   <button type="submit" ... > ... </button>
//   <button type="button" onClick={() => setStep('step1')} ... > ... </button>
// </div>
// Let's look exactly at the step2 footer.
