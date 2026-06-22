import fs from 'fs';
const file = '/Users/yazidtalbi/afus/src/components/ui/StoreOnboardingModal.tsx';
const content = fs.readFileSync(file, 'utf8');

// A very simple tag parser
const regex = /<\/?([a-zA-Z0-9]+|React\.Fragment|><)/g;
// We can also extract JSX tags manually. Let's find tags in lines:
let stack = [];
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  // Simple check for tags
  // Match things like <div, </div, <form, </form, <button, </button, <>, </>
  let matches = line.matchAll(/<(\/?[a-zA-Z0-9]+|>?)/g);
  for (let match of matches) {
    let tag = match[0];
    if (tag.startsWith('<-') || tag.startsWith('<=') || tag.startsWith('< ') || tag.includes('?') || tag.includes('"')) {
      continue;
    }
    // Filter common js expressions
    if (tag === '<' || tag === '>') continue;
    
    // We only care about known tags or tag-like structures in JSX
    if (/^<\/?(div|form|button|span|h1|h2|h3|p|img|input|select|option|textarea|svg|path|label|Pop|Com|Command|Popover|Icon|a|React|Fragment|><|>$)/i.test(tag) || tag === '<>' || tag === '</>') {
      if (tag.startsWith('</') || tag === '</>') {
        let last = stack.pop();
        let expected = tag.replace('/', '');
        // console.log(`Close ${tag} on line ${i+1}, popped ${last?.tag} from line ${last?.line}`);
      } else {
        stack.push({ tag, line: i + 1 });
        // console.log(`Open ${tag} on line ${i+1}`);
      }
    }
  }
}

console.log('Remaining unclosed tags in stack:');
for (let item of stack) {
  console.log(`Line ${item.line}: ${item.tag}`);
}
