import fs from 'fs';

let content = fs.readFileSync('src/components/ui/DynamicTrailsClient.tsx', 'utf8');

const storeStart = content.indexOf('{/* 5. Newest Stores Trail */}');
const under100Start = content.indexOf('{/* Under 100 DH Trail */}');
const geoStart = content.indexOf('{/* Geo-IP Trail */}');

if (storeStart !== -1 && under100Start !== -1 && geoStart !== -1) {
    const storeSection = content.substring(storeStart, under100Start);
    const under100Section = content.substring(under100Start, geoStart);
    
    // Replace the combined sections with the reversed order
    const originalCombined = storeSection + under100Section;
    const swappedCombined = under100Section + storeSection;
    
    content = content.replace(originalCombined, swappedCombined);
    
    fs.writeFileSync('src/components/ui/DynamicTrailsClient.tsx', content);
    console.log("Sections swapped successfully!");
} else {
    console.log("Could not find sections by index.");
}
