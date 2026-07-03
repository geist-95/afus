const fs = require('fs');
let content = fs.readFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', 'utf8');

// 1. Import IconBuildingStore
if (!content.includes('IconBuildingStore')) {
  content = content.replace('IconPlus', 'IconPlus,\n  IconBuildingStore');
}

// 2. Add shopName block to account step
const oldFormStart = '<form onSubmit={handleAccountNext} className="space-y-4 text-left">';
const newFormStart = `<form onSubmit={handleAccountNext} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.shopName} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconBuildingStore className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder={t.shopNamePlaceholder}
                          />
                        </div>
                      </div>

                      {!hasSession && (
                        <>`;

// Find where `{error && (` was after `form onSubmit={handleAccountNext}`
const regex = /<form onSubmit=\{handleAccountNext\} className="space-y-4 text-left">\s*\{error && \([\s\S]*?<\/div>\s*\)\}/;
content = content.replace(regex, newFormStart);

// 3. Add closing `</>` before the sticky footer
const footerRegex = /(<div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">)/;
content = content.replace(footerRegex, `</>\n                      )}\n\n                      $1`);

// 4. Wrap "Already have account" in `{!hasSession && ( ... )}`
const alreadyRegex = /(<div className="hidden md:flex items-center gap-3 my-2">[\s\S]*?<div className="hidden md:text-center">[\s\S]*?<\/button>\s*<\/div>)/;
content = content.replace(alreadyRegex, `{!hasSession && (\n                        <>\n                          $1\n                        </>\n                      )}`);

fs.writeFileSync('src/components/ui/ProductFirstOnboardingModal.tsx', content);
console.log("Changes applied successfully!");
