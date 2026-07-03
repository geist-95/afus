const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

const oldHeaderBackButton = `<button
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

const newHeaderBackButton = `<button
                onClick={() => {
                  setError('');
                  if (step === 'step_category') setStep('step1');
                  else if (step === 'step2') setStep('step_category');
                  else if (step === 'account') setStep('step2');
                }}
                className="w-10 h-10 rounded-full bg-neutral-50 md:bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all shrink-0"
              >
                <IconArrowLeft className="w-5 h-5" strokeWidth={2} />
              </button>`;

content = content.replace(oldHeaderBackButton, newHeaderBackButton);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
