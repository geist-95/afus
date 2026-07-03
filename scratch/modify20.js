const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Disable clicking outside the modal
const oldBackdrop = `<div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={() => {
          if (step === 'success') {
            handleSuccessRedirect();
          } else {
            onClose();
          }
        }}
      />`;
const newBackdrop = `<div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={() => {
          if (step === 'success') {
            handleSuccessRedirect();
          }
        }}
      />`;
content = content.replace(oldBackdrop, newBackdrop);

// 2. Add confirmation on X button
const oldXButton = `<button
              onClick={() => {
                if (step === 'success') {
                  handleSuccessRedirect();
                } else {
                  onClose();
                }
              }}
              className="w-10 h-10 rounded-full bg-neutral-50 md:bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all shrink-0"
            >`;
const newXButton = `<button
              onClick={() => {
                if (step === 'success') {
                  handleSuccessRedirect();
                } else {
                  const hasUnsavedChanges = productImageFiles.length > 0 || category !== '' || price !== '' || title !== '' || description !== '' || city !== '' || sector !== '' || shopName !== '' || fullName !== '' || email !== '';
                  if (hasUnsavedChanges) {
                    const confirmMessage = lang === 'fr' 
                      ? "Êtes-vous sûr de vouloir quitter ? Vos informations seront perdues." 
                      : lang === 'ar' 
                      ? "هل أنت متأكد أنك تريد الخروج؟ سيتم فقدان معلوماتك."
                      : "Are you sure you want to leave? Your information will be lost.";
                    if (window.confirm(confirmMessage)) {
                      onClose();
                    }
                  } else {
                    onClose();
                  }
                }
              }}
              className="w-10 h-10 rounded-full bg-neutral-50 md:bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all shrink-0"
            >`;
content = content.replace(oldXButton, newXButton);

// 3. Remove separator above "Continuer" button (border-t border-neutral-100)
// Current footer classes: className="sticky bottom-0 left-0 right-0 pt-4 pb-6 md:pb-8 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto"
content = content.replace(
  /className="sticky bottom-0 left-0 right-0 pt-4 pb-6 md:pb-8 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto"/g,
  'className="sticky bottom-0 left-0 right-0 pt-4 pb-6 md:pb-8 bg-white z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto"'
);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
