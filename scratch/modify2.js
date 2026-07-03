const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Change price input in step2
const oldPriceInput = `<input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder={t.productPricePlaceholder}
                          />`;
const newPriceInput = `<div className="relative">
                            <input
                              type="number"
                              value={productPrice}
                              onChange={(e) => setProductPrice(e.target.value)}
                              className="w-full border border-neutral-200 rounded-2xl pl-4 pr-24 py-3 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                              placeholder={t.productPricePlaceholder}
                            />
                            <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 pointer-events-none">
                              <div className="h-6 w-px bg-neutral-200 mr-3"></div>
                              <span className="text-lg leading-none mr-1.5">🇲🇦</span>
                              <span className="text-sm font-bold text-black">DH</span>
                            </div>
                          </div>`;
content = content.replace(oldPriceInput, newPriceInput);


// 2. Extract Shop Name block from step1
const shopNameBlockRegex = /<div className="space-y-1">\s*<label className="text-sm font-semibold text-black block text-left">Nom de la boutique <span className="text-red-500">\*<\/span><\/label>\s*<div className="relative">.*?<\/p>\s*\)}?\s*<\/div>/s;
const shopNameMatch = content.match(shopNameBlockRegex);
let shopNameBlock = shopNameMatch ? shopNameMatch[0] : '';
if (!shopNameBlock) {
    console.error("Shop name block not found!");
    process.exit(1);
}

// Remove Shop Name block from step1
content = content.replace(shopNameBlockRegex, '');

// 3. Inject Shop Name block into account step
// Find where the form for handleAccountNext ends (before the submit button)
const accountFormSubmitRegex = /(<button\s*type="submit"\s*disabled={loading}\s*className="flex-1 w-full flex items-center justify-center gap-2)/s;
// Let's add it right above the submit buttons container in account step.
// The account step has a div for the fixed bottom buttons.
const accountButtonsRegex = /(<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">\s*<button\s*type="submit"\s*disabled={loading}\s*className="flex-1 w-full flex items-center)/s;
content = content.replace(accountButtonsRegex, shopNameBlock + '\n\n                      $1');

// 4. Update hasSession rendering in account step
// The account step is wrapped in `{step === 'account' && !isLoginMode && (`
// If hasSession is true, the user shouldn't see the email/password fields.
// We can wrap the email/password fields in `{!hasSession && (`
const accountFieldsRegex = /(<div className="grid grid-cols-1 md:grid-cols-2 gap-4">.*?<label className="text-sm font-semibold text-black block text-left">\s*{t.password}\s*<span className="text-red-500">\*<\/span>.*?<\/div>)/s;
content = content.replace(accountFieldsRegex, '{!hasSession && (\n                        <>\n                          $1\n                        </>\n                      )}');


// 5. Update handlers
// handleStep1Next: remove shopName validation
const handleStep1NameValidation = /const cleanName = shopName\.trim\(\);\s*if \(!cleanName\) \{ setError\(t\.errShopNameEmpty \|\| 'Shop name is required'\); return; \}/;
const handleStep1SlugValidation = /const shopSlug = cleanName\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\);\s*const isAvailable = await checkShopSlugAvailable\(shopSlug\);\s*if \(!isAvailable\) \{\s*setError\(t\.errShopNameTaken\);\s*setLoading\(false\);\s*return;\s*\}/;
content = content.replace(handleStep1NameValidation, '');
content = content.replace(handleStep1SlugValidation, '');

// handleStep2Next: always go to account step!
// Change:
// if (hasSession) {
//   await handleCreateShop();
// } else {
//   setStep('account');
// }
// To: setStep('account');
content = content.replace(/if \(hasSession\) \{\s*await handleCreateShop\(\);\s*\} else \{\s*setStep\('account'\);\s*\}/, "setStep('account');");

// handleAccountNext: add shop name validation and check slug!
// Before:
// if (!fullName || !email || !password) { setError(t.errFillRequired); return; }
// if (password.length < 6) { setError(t.errPasswordLength); return; }
// setError('');
// await handleCreateShop();
const newHandleAccountNext = `if (!hasSession) {
      if (!fullName || !email || !password) { setError(t.errFillRequired); return; }
      if (password.length < 6) { setError(t.errPasswordLength); return; }
    }
    const cleanName = shopName.trim();
    if (!cleanName) { setError(t.errShopNameEmpty || 'Shop name is required'); return; }
    
    setLoading(true);
    try {
      const shopSlug = cleanName.toLowerCase().replace(/\\s+/g, '-');
      const isAvailable = await checkShopSlugAvailable(shopSlug);
      if (!isAvailable) {
        setError(t.errShopNameTaken);
        setLoading(false);
        return;
      }
      await handleCreateShop();
    } catch (err) {
      setError(t.errVerifyingShop || 'Error verifying shop');
      setLoading(false);
    }
`;
content = content.replace(/if \(!fullName \|\| !email \|\| !password\) \{ setError\(t\.errFillRequired\); return; \}\s*if \(password\.length < 6\) \{ setError\(t\.errPasswordLength\); return; \}\s*setError\(''\);\s*await handleCreateShop\(\);/, newHandleAccountNext);

// 6. Update contentSteps logic so hasSession has 'account' step too
content = content.replace(/const contentSteps: Step\[\] = hasSession \? \['step1', 'step2'\] : \['step1', 'step2', 'account'\];/, "const contentSteps: Step[] = hasSession ? ['step1', 'step2', 'account'] : ['step1', 'step2', 'account'];");
// Wait, if contentSteps is always the same, just remove the ternary.

// 7. Change the title in account step for hasSession
const accountTitleRegex = /(<h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">)(.*?)(<\/h1>\s*<p className="text-neutral-500 mt-2 text-base">)(.*?)(<\/p>)/s;
content = content.replace(accountTitleRegex, '$1{hasSession ? (lang === "fr" ? "Finalisation" : lang === "ar" ? "إتمام" : "Finalization") : $2}$3{hasSession ? (lang === "fr" ? "Dernière étape pour créer votre boutique" : lang === "ar" ? "الخطوة الأخيرة لإنشاء متجرك" : "Last step to create your shop") : $4}$5');

// Write out
fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
