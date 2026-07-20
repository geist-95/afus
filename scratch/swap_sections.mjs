import fs from 'fs';

let content = fs.readFileSync('src/components/ui/DynamicTrailsClient.tsx', 'utf8');

const storeSectionRegex = /(\/\* 5\. Newest Stores Trail \*\/[\s\S]*?<\/section>)/;
const under100SectionRegex = /(\/\* Under 100 DH Trail \*\/[\s\S]*?<\/section>\n\s*\})/;

const storeMatch = content.match(storeSectionRegex);
const under100Match = content.match(under100SectionRegex);

if (storeMatch && under100Match) {
    const storeText = storeMatch[1];
    const under100Text = under100Match[1];
    
    // Replace the combined text with the swapped text
    // The structure is currently:
    // storeText
    //
    // under100Text
    
    const combinedOriginal = storeText + '\n\n' + under100Text;
    const combinedSwapped = under100Text + '\n\n' + storeText;
    
    content = content.replace(combinedOriginal, combinedSwapped);
    
    fs.writeFileSync('src/components/ui/DynamicTrailsClient.tsx', content);
    console.log("Sections swapped successfully!");
} else {
    console.log("Could not find sections.");
}
