const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Update STEPS type and array
content = content.replace(
  "type Step = 'step1' | 'step2' | 'account' | 'success';",
  "type Step = 'step1' | 'step_category' | 'step2' | 'account' | 'success';"
);
content = content.replace(
  "const STEPS: Step[] = ['step1', 'step2', 'account', 'success'];",
  "const STEPS: Step[] = ['step1', 'step_category', 'step2', 'account', 'success'];"
);

// 2. Update contentSteps
content = content.replace(
  "const contentSteps: Step[] = hasSession ? ['step1', 'step2', 'account'] : ['step1', 'step2', 'account'];",
  "const contentSteps: Step[] = hasSession ? ['step1', 'step_category', 'step2', 'account'] : ['step1', 'step_category', 'step2', 'account'];"
);

// 3. Update Stepper text
// Remove:
/*
<div className="flex items-center justify-between text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
  <span>{t.step} {contentStepIndex + 1} {t.of} {contentSteps.length}</span>
  <span>{Math.round(progressPercent)}%</span>
</div>
*/
const stepperTextRegex = /<div className="flex items-center justify-between text-neutral-500 text-\[10px\] font-bold uppercase tracking-wider">\s*<span>\{t\.step\} \{contentStepIndex \+ 1\} \{t\.of\} \{contentSteps\.length\}<\/span>\s*<span>\{Math\.round\(progressPercent\)\}%<\/span>\s*<\/div>/;
content = content.replace(stepperTextRegex, '');

// 4. Extract Category block from step1
const categoryBlockRegex = /<div className="space-y-1">\s*<label className="text-sm font-semibold text-black block">\{t\.productCategory\} <span className="text-red-500">\*<\/span><\/label>\s*<div className="grid grid-cols-2 md:grid-cols-3 gap-3">.*?<\/div>\s*<\/div>/s;
const categoryMatch = content.match(categoryBlockRegex);
if (!categoryMatch) {
    console.error("Category block not found!");
    process.exit(1);
}
let categoryBlock = categoryMatch[0];
content = content.replace(categoryBlockRegex, '');

// 5. Update validation in step1
const step1ValRegex = /if \(!productCategory\) \{\s*setError\(lang === 'fr' \? 'Veuillez sélectionner une catégorie.' : lang === 'ar' \? 'يرجى اختيار فئة.' : 'Please select a category.'\);\s*return;\s*\}/;
content = content.replace(step1ValRegex, '');
content = content.replace(/setStep\('step2'\);/, "setStep('step_category');");

// 6. Create step_category section and handleStepCategoryNext
// We will insert step_category right after step1
const step1EndRegex = /\{\/\* ── STEP 2: DETAILS ── \*\/\}/;

const stepCategoryJSX = `
                {/* ── STEP 1.5: CATEGORY ── */}
                {step === 'step_category' && !isLoginMode && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">
                        {lang === 'fr' ? 'Choisissez une catégorie' : lang === 'ar' ? 'اختر فئة' : 'Choose a category'}
                      </h1>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setError('');
                      if (!productCategory) {
                        setError(lang === 'fr' ? 'Veuillez sélectionner une catégorie.' : lang === 'ar' ? 'يرجى اختيار فئة.' : 'Please select a category.');
                        return;
                      }
                      setStep('step2');
                    }} className="space-y-6 text-left">
                      
                      ${categoryBlock}

                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-8">
                        <button
                          type="submit"
                          disabled={!productCategory}
                          className="flex-1 w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t.continue}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── STEP 2: DETAILS ── */}`;

content = content.replace(step1EndRegex, stepCategoryJSX);

// 7. Update back button in header to work for both step2 and step_category
// Original header back button:
// `{!isLoginMode && step === 'step2' && (`
// Change to: `{!isLoginMode && (step === 'step2' || step === 'step_category' || step === 'account') && (`
// Wait, account step is after step2. We only want back buttons if there is a previous step.
// And we need to go back to the correct step!
// If step === 'step_category', back is 'step1'.
// If step === 'step2', back is 'step_category'.
// If step === 'account', back is 'step2'.

const backButtonRegex = /\{\!isLoginMode && step === 'step2' && \(\s*<button\s*onClick=\{\(\) => \{\s*setError\(''\);\s*setStep\('step1'\);\s*\}\}\s*className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-black transition-colors"\s*>\s*<IconArrowLeft className="w-5 h-5" strokeWidth=\{2\} \/>\s*<span className="hidden md:inline">\{t\.back\}<\/span>\s*<\/button>\s*\)\}/;
const newBackButton = `{!isLoginMode && (step === 'step2' || step === 'step_category' || (step === 'account' && !hasSession)) && (
              <button
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
              </button>
            )}`;
content = content.replace(backButtonRegex, newBackButton);

// Wait! If step === 'account' and hasSession, we DO want a back button to 'step2'!
// Wait, actually `step === 'account'` is the 3rd step for hasSession too!
// So:
const newBackButton2 = `{!isLoginMode && (step === 'step2' || step === 'step_category' || step === 'account') && (
              <button
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
              </button>
            )}`;
content = content.replace(newBackButton, newBackButton2);

// 8. Fix disabled state of step 1 continue button
const step1SubmitRegex = /disabled=\{loading \|\| productImageFiles\.length === 0 \|\| !productCategory \|\| !city \|\| \(MOROCCAN_CITIES_SECTORS\[city\] && !secteur\)\}/;
content = content.replace(step1SubmitRegex, "disabled={loading || productImageFiles.length === 0 || !city || (MOROCCAN_CITIES_SECTORS[city] && !secteur)}");

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully.");
