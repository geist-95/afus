const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Reduce modal width
// Current: className={`relative z-10 w-full max-w-xl md:max-w-2xl bg-white shadow-2xl...
content = content.replace(
  /className=\{(?:\`|")relative z-10 w-full max-w-xl md:max-w-2xl/,
  'className={`relative z-10 w-full max-w-lg md:max-w-xl'
);
// Make sure to match both double quotes or backticks if it has variables
content = content.replace(
  'className="relative z-10 w-full max-w-xl md:max-w-2xl bg-white shadow-2xl arabic-frame flex flex-col min-h-[100dvh] md:min-h-0 md:max-h-[90vh] overflow-hidden border-0 md:border font-tifinagh"',
  'className="relative z-10 w-full max-w-lg md:max-w-xl bg-white shadow-2xl arabic-frame flex flex-col min-h-[100dvh] md:min-h-0 md:max-h-[90vh] overflow-hidden border-0 md:border font-tifinagh"'
);
content = content.replace(
  /w-full max-w-xl md:max-w-2xl/g,
  'w-full max-w-lg md:max-w-xl'
);


// 2. Change MOROCCAN_CITIES_SECTORS
const oldCities = /const MOROCCAN_CITIES_SECTORS: Record<string, string\[\]> = \{[\s\S]*?\};/;
const newCities = `const MOROCCAN_CITIES_SECTORS: Record<string, string[]> = {
  'Marrakech': ['Médina', 'Guéliz', 'Hivernage', 'Palmeraie', 'Targa', 'Sidi Youssef Ben Ali', 'Daoudiate', 'Autre secteur'],
  'Fès': ['Fès El Bali', 'Fès El Jdid', 'Ville Nouvelle', 'Narjiss', 'Mont Fleuri', 'Agdal', 'Autre secteur'],
  'Meknès': ['Médina', 'Hamria', 'Ville Nouvelle', 'Bassatine', 'Toulal', 'Autre secteur'],
  'Rabat': ['Médina', 'Agdal', 'Hassan', 'Hay Riad', 'Souissi', 'Les Orangers', 'Youssoufia', 'Océan', 'Autre secteur'],
  'Tétouan': ['Médina', 'Ensanche', 'Sania Rmel', 'Kabila', 'Autre secteur'],
};`;
content = content.replace(oldCities, newCities);

// 3. Make sector show by default
const oldSectorLogic = /\{city && MOROCCAN_CITIES_SECTORS\[city\] && \([\s\S]*?<div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">([\s\S]*?)<\/div>\s*\}\)/;
const newSectorLogic = `<div className="space-y-1">
                            <label className="text-sm font-semibold text-black block text-left">
                              Secteur <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                value={secteur}
                                onChange={(e) => setSecteur(e.target.value)}
                                disabled={!city}
                                className="w-full border border-neutral-200 rounded-2xl pl-4 pr-10 py-3.5 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300 appearance-none cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="" disabled>{city ? 'Sélectionner un secteur...' : 'Sélectionnez d\\'abord une ville...'}</option>
                                {city && MOROCCAN_CITIES_SECTORS[city] && MOROCCAN_CITIES_SECTORS[city].map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <IconSelector className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" strokeWidth={1.8} />
                            </div>
                          </div>`;

content = content.replace(/\{city && MOROCCAN_CITIES_SECTORS\[city\] && \(\s*<div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">[\s\S]*?<\/div>\s*\)\}/, newSectorLogic);


// 4. Fix flex layouts to push footers to the bottom
// Step 1:
content = content.replace(
  /<div className="space-y-6 text-center">([\s\S]*?<form onSubmit=[\s\S]*?className="space-y-6 text-left">)/,
  '<div className="space-y-6 text-center flex-1 flex flex-col">$1'
);

content = content.replace(
  /className="space-y-6 text-left">/,
  'className="space-y-6 text-left flex-1 flex flex-col">'
);

// We need to change `mt-8` to `mt-auto` in all sticky footers
content = content.replace(/mt-8/g, 'mt-auto');

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
