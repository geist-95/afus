const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/components/ui/ProductFirstOnboardingModal.tsx');
let content = fs.readFileSync(file, 'utf8');

// Update Step type
content = content.replace(/type Step = 'product' \| 'account' \| 'store' \| 'success';/, "type Step = 'step1' | 'step2' | 'account' | 'success';");

// Update initial step
content = content.replace(/return hasSession \? 'product' : 'product';/, "return 'step1';");

// Update contentSteps
content = content.replace(/const contentSteps: Step\[\] = hasSession \? \['product', 'store'\] : \['product', 'account', 'store'\];/, "const contentSteps: Step[] = hasSession ? ['step1', 'step2'] : ['step1', 'step2', 'account'];");

// Update back button logic
content = content.replace(/if \(step === 'store'\) setStep\(hasSession \? 'product' : 'account'\);\n[ \t]*\}\}/, `if (step === 'step2') setStep('step1');\n                      else if (step === 'account') setStep('step2');\n                    }}`);

// Remove handleProductSkip (no longer relevant as steps are mandatory or different)
// Actually we can just keep it or remove it. Let's just remove the button later.

console.log("Basic replacements done. Need to reorder JSX.");
