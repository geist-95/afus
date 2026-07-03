const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Remove border from header and adjust padding
content = content.replace(
  '<div className="flex items-center px-6 py-4 md:px-10 lg:px-14 md:py-6 border-b border-neutral-100 bg-white z-20 gap-4 md:gap-8 lg:gap-12">',
  '<div className="flex items-center px-6 pt-6 pb-2 md:px-10 lg:px-14 md:pt-8 md:pb-2 bg-white z-20 gap-4 md:gap-8 lg:gap-12">'
);

// 2. Adjust header back button styles
const oldHeaderBackButton = `<button
                onClick={() => {
                  setError('');
                  if (step === 'step_category') setStep('step1');
                  else if (step === 'step2') setStep('step_category');
                  else if (step === 'account') setStep('step2');
                }}
                className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-black transition-colors"
              >
                <IconArrowLeft className="w-5 h-5" strokeWidth={2} />
                <span className="hidden md:inline">{t.back}</span>
              </button>`;
const newHeaderBackButton = `<button
                onClick={() => {
                  setError('');
                  if (step === 'step_category') setStep('step1');
                  else if (step === 'step2') setStep('step_category');
                  else if (step === 'account') setStep('step2');
                }}
                className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-bold text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-neutral-200"
              >
                <IconArrowLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                <span>{t.back}</span>
              </button>`;
content = content.replace(oldHeaderBackButton, newHeaderBackButton);

// 3. Adjust scrollable content wrapper padding
content = content.replace(
  '<div className="flex-1 flex flex-col justify-start pt-28 md:pt-10 pb-0 px-6 md:px-10 lg:px-14 min-h-full">',
  '<div className="flex-1 flex flex-col justify-start pt-4 md:pt-6 pb-0 px-6 md:px-10 lg:px-14 min-h-full">'
);

// 4. Remove step2 footer back button
const oldStep2Footer = `<div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">
                        <button
                          type="submit"
                          className="flex-1 w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-primary/90 transition-all"
                        >
                          {step === 'account' ? (
                            hasSession ? t.createShop : (lang === 'fr' ? 'Finaliser l\\'inscription' : lang === 'ar' ? 'إتمام التسجيل' : 'Complete sign up')
                          ) : (
                            <>
                              {hasSession ? t.createShop : t.next}
                              {hasSession ? <IconCheck className="w-5 h-5" strokeWidth={2.5} /> : <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setError(''); setStep('step1'); }}
                          className="flex-1 flex items-center justify-center gap-1.5 text-sm md:text-base font-bold text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors py-3.5 md:py-4 rounded-full border border-neutral-200"
                        >
                          <IconArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                          <span>{t.back}</span>
                        </button>
                      </div>`;
// Actually, let's use a regex to cleanly remove the button.
// The button is:
const buttonToRemoveRegex = /<button\s*type="button"\s*onClick=\{\(\) => \{\s*setError\(''\);\s*setStep\('step1'\);\s*\}\}\s*className="flex-1 flex items-center justify-center gap-1.5 text-sm md:text-base font-bold text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors py-3.5 md:py-4 rounded-full border border-neutral-200"\s*>\s*<IconArrowLeft className="w-5 h-5" strokeWidth=\{2.5\}\s*\/>\s*<span>\{t.back\}<\/span>\s*<\/button>/;

content = content.replace(buttonToRemoveRegex, '');

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
