const fs = require('fs');

const file = 'src/components/ui/ProductFirstOnboardingModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Type Step
content = content.replace(
  /type Step = 'product' \| 'account' \| 'store' \| 'success';/,
  "type Step = 'step1' | 'step2' | 'account' | 'success';"
);

// 2. contentSteps
content = content.replace(
  /const contentSteps: Step\[\] = hasSession \? \['product', 'store'\] : \['product', 'account', 'store'\];/,
  "const contentSteps: Step[] = hasSession ? ['step1', 'step2'] : ['step1', 'step2', 'account'];"
);

// 3. Initial state
content = content.replace(
  /return hasSession \? 'product' : 'product';/,
  "return 'step1';"
);

// 4. Back button
content = content.replace(
  /if \(step === 'store'\) setStep\(hasSession \? 'product' : 'account'\);/,
  "if (step === 'step2') setStep('step1');\n                      else if (step === 'account') setStep('step2');"
);

// 5. Handlers
// We need to replace handleProductNext and handleCreateShop.
// We will just do a string replacement for the handlers later, or inject them.

fs.writeFileSync('scratch/ProductFirstOnboardingModal_modified.tsx', content);
console.log("Initial string replacements done.");
