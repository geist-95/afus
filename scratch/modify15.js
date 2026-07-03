const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// Update English
content = content.replace(
  "accountTitle: 'Create your account',",
  "accountTitle: 'Finalization',"
);
content = content.replace(
  "accountSubtitle: 'Your personal details for signing in.',",
  "accountSubtitle: 'Last step to create your shop.',"
);

// Update French
content = content.replace(
  "accountTitle: 'Créez votre compte',",
  "accountTitle: 'Finalisation',"
);
content = content.replace(
  "accountSubtitle: 'Vos informations personnelles pour vous connecter.',",
  "accountSubtitle: 'Dernière étape pour créer votre boutique.',"
);

// Update Arabic
content = content.replace(
  "accountTitle: 'أنشئ حسابك',",
  "accountTitle: 'إتمام',"
);
content = content.replace(
  "accountSubtitle: 'بياناتك الشخصية لتسجيل الدخول.',",
  "accountSubtitle: 'الخطوة الأخيرة لإنشاء متجرك.',"
);

// Update Tamazight (just use the new text roughly or leave as is, I will replace it with Finalization/Last step)
content = content.replace(
  "accountTitle: 'ⵙⵏⴼⵍ ⴰⵎⵉⴹⴰⵏ ⵏⵏⴽ',",
  "accountTitle: 'Finalization',"
);
content = content.replace(
  "accountSubtitle: 'ⵉⵏⵖ密ⵙⵏ ⵏⵏⴽ ⵉ ⵓⴽⵛⵛⵓⵎ.',",
  "accountSubtitle: 'Last step to create your shop.',"
);

// Simplify the JSX
const oldH1 = /<h1 className="text-2xl md:text-3xl font-semibold tracking-\[-1px\] text-neutral-900 leading-tight">\{hasSession \? \(lang === 'fr' \? 'Finalisation' : lang === 'ar' \? 'إتمام' : 'Finalization'\) : t\.accountTitle\}<\/h1>/;
const newH1 = `<h1 className="text-2xl md:text-3xl font-semibold tracking-[-1px] text-neutral-900 leading-tight">{t.accountTitle}</h1>`;
content = content.replace(oldH1, newH1);

const oldP = /<p className="text-neutral-500 mt-2 text-base">\{hasSession \? \(lang === 'fr' \? 'Dernière étape pour créer votre boutique' : lang === 'ar' \? 'الخطوة الأخيرة لإنشاء متجرك' : 'Last step to create your shop'\) : t\.accountSubtitle\}<\/p>/;
const newP = `<p className="text-neutral-500 mt-2 text-base">{t.accountSubtitle}</p>`;
content = content.replace(oldP, newP);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
