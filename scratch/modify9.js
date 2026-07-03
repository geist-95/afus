const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Remove required asterisk from Secteur label
content = content.replace(
  /Secteur <span className="text-red-500">\*<\/span>/,
  'Secteur <span className="text-neutral-400 font-normal ml-1">(Optionnel)</span>'
);

// 2. Remove validation from handleStep1Next
content = content.replace(
  /if \(!city \|\| \(MOROCCAN_CITIES_SECTORS\[city\] && !secteur\)\) \{ setError\(t\.errSelectCity\); return; \}/,
  'if (!city) { setError(t.errSelectCity); return; }'
);

// 3. Remove validation from disabled button state
content = content.replace(
  /disabled=\{loading \|\| productImageFiles\.length === 0 \|\| !city \|\| \(MOROCCAN_CITIES_SECTORS\[city\] && !secteur\)\}/,
  'disabled={loading || productImageFiles.length === 0 || !city}'
);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
