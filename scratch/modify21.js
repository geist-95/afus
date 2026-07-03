const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

const oldCondition = `const hasUnsavedChanges = productImageFiles.length > 0 || category !== '' || price !== '' || title !== '' || description !== '' || city !== '' || sector !== '' || shopName !== '' || fullName !== '' || email !== '';`;
const newCondition = `const hasUnsavedChanges = productImageFiles.length > 0 || productCategory !== '' || productPrice !== '' || productTitle !== '' || productDesc !== '' || city !== '' || secteur !== '' || shopName !== '' || fullName !== '' || email !== '';`;

content = content.replace(oldCondition, newCondition);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
