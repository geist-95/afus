const fs = require('fs');
let content = fs.readFileSync('src/components/ui/NavBar.tsx', 'utf8');

const oldCode = `<button
                onClick={() => window.dispatchEvent(new Event('open-welcome-modal'))}
                className="hover:opacity-80 transition-opacity cursor-pointer text-[13px]"
              >
                {t.about}
              </button>
              <Link className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-[13px]" href={\`/\${lang}#faq\`}>`;

const newCode = `<button
                onClick={() => window.dispatchEvent(new Event('open-welcome-modal'))}
                className="hover:opacity-80 transition-opacity cursor-pointer text-[13px]"
              >
                {t.about}
              </button>
              <span className="text-black/30 select-none text-[10px] flex-shrink-0">✦</span>
              <Link className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-[13px]" href={\`/\${lang}#faq\`}>`;

content = content.replace(oldCode, newCode);

fs.writeFileSync('src/components/ui/NavBar.tsx', content);
console.log("Changes applied successfully!");
