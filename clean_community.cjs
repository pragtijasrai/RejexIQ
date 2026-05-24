const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'Community.jsx');

let content = fs.readFileSync(file, 'utf8');

// Fix duplicate background
content = content.replace(
  /background: OCEAN\.surface,([\s\S]*?)background: "rgba\(15, 23, 42, 0\.6\)"/g,
  'background: "rgba(15, 23, 42, 0.6)",$1'
);
content = content.replace(
  /background: OCEAN\.surface,([\s\S]*?)background: "rgba\(15, 23, 42, 0\.5\)"/g,
  'background: "rgba(15, 23, 42, 0.5)",$1'
);
content = content.replace(
  /background: OCEAN\.surface,([\s\S]*?)background: "rgba\(15, 23, 42, 0\.7\)"/g,
  'background: "rgba(15, 23, 42, 0.7)",$1'
);

// General duplicate background remover if it's explicitly in the same line
content = content.replace(/background: OCEAN\.surface,([^}]*)background: "rgba/g, '$1background: "rgba');

// Fix duplicate backdropFilter
content = content.replace(/backdropFilter: "blur\(12px\)", backdropFilter: "blur\(12px\)"/g, 'backdropFilter: "blur(12px)"');
content = content.replace(/backdropFilter: "blur\(16px\)", backdropFilter: "blur\(16px\)"/g, 'backdropFilter: "blur(16px)"');
content = content.replace(/backdropFilter: "blur\(20px\)", backdropFilter: "blur\(20px\)"/g, 'backdropFilter: "blur(20px)"');

// Also check for any other duplicate `background` in the same style object
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('style={{') && lines[i].match(/background: /g) && lines[i].match(/background: /g).length > 1) {
    // If it has multiple backgrounds, remove the first one if it's `background: OCEAN...`
    lines[i] = lines[i].replace(/background: [^,]+, (.*?background: )/g, '$1');
  }
  if (lines[i].includes('style={{') && lines[i].match(/backdropFilter: /g) && lines[i].match(/backdropFilter: /g).length > 1) {
    lines[i] = lines[i].replace(/backdropFilter: [^,]+, (.*?backdropFilter: )/g, '$1');
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log("Community.jsx cleaned up!");
