const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Change title and remove subtitle
content = content.replace(
  "{lang === 'fr' ? 'Que créez-vous ou proposez-vous ?' : lang === 'ar' ? 'ماذا تصنع أو تقدم؟' : 'What do you create or offer?'}",
  "{lang === 'fr' ? 'Quelle est votre création ?' : lang === 'ar' ? 'ما هو إبداعك؟' : 'What is your creation?'}"
);

// Remove the subtitle from step 1
content = content.replace(
  /<p className="text-neutral-500 mt-2 text-base">\{lang === 'fr' \? 'Photos et catégorie' : lang === 'ar' \? 'الصور والفئة' : 'Photos and category'\}<\/p>/,
  ""
);

// 2. Extract stepper and back button, and move them to the header
// The header currently looks like:
/*
        {/* Unified header *\/}
        <div className="flex items-center justify-between px-6 py-4 md:px-10 lg:px-14 md:py-6 border-b border-neutral-100 bg-white z-20">
          <div></div>
          <div className="flex items-center gap-4">

            {/* Close button *\/}
*/

// Let's replace the header and remove the old global stepper.
const oldStepperRegex = /\{\/\* ── GLOBAL STEPPER ── \*\/}.*?(?=\n\s*<div className="flex-1 flex flex-col justify-start)/s;
content = content.replace(oldStepperRegex, '');

// Also remove `pt-28 md:pt-32` from the scrollable content container since the stepper is gone
content = content.replace(/className="flex-1 flex flex-col justify-start pt-28 md:pt-32 pb-0 px-6 md:px-10 lg:px-14 min-h-full"/, 'className="flex-1 flex flex-col justify-start pt-8 md:pt-12 pb-0 px-6 md:px-10 lg:px-14 min-h-full"');
// Wait, the previous replacement might have made it "px-6 pb-0 pt-32 md:px-10 lg:px-14 flex-1 flex flex-col"
// Let's replace ANY pt-28 or pt-32 to pt-8 or pt-12.
content = content.replace(/pt-32/, 'pt-10');
content = content.replace(/pt-28 md:pt-32/, 'pt-8 md:pt-10');

// Now, replace the header
const headerRegex = /\{\/\* Unified header \*\/}.*?(?=\{\/\* Scrollable content \*\/})/s;

const newHeader = `{/* Unified header */}
        <div className="flex items-center justify-between px-6 py-4 md:px-10 lg:px-14 md:py-6 border-b border-neutral-100 bg-white z-20">
          <div className="flex-1">
            {!isLoginMode && step === 'step2' && (
              <button
                onClick={() => {
                  setError('');
                  setStep('step1');
                }}
                className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-black transition-colors"
              >
                <IconArrowLeft className="w-5 h-5" strokeWidth={2} />
                <span className="hidden md:inline">{t.back}</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-6 justify-end flex-1">
            {!isLoginMode && step !== 'success' && (
              <div className="hidden sm:block w-48 space-y-2">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                  <span>{t.step} {contentStepIndex + 1} {t.of} {contentSteps.length}</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="flex gap-1">
                  {contentSteps.map((s, i) => (
                    <div
                      key={s}
                      className={\`h-1.5 flex-1 rounded-full transition-all duration-300 \${
                        i <= contentStepIndex ? 'bg-primary' : 'bg-neutral-200'
                      }\`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => {
                if (step === 'success') {
                  handleSuccessRedirect();
                } else {
                  onClose();
                }
              }}
              className="w-10 h-10 rounded-full bg-neutral-50 md:bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all shrink-0"
            >
              <IconX className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        `;

content = content.replace(headerRegex, newHeader);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied!");
