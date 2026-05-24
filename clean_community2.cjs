const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'Community.jsx');

let content = fs.readFileSync(file, 'utf8');

// Regex to find multiple backdropFilter keys in the same style object
// We can just match backdropFilter: "blur(12px)", backdropFilter: "blur(12px)" with optional spaces
content = content.replace(/backdropFilter:\s*"blur\(\d+px\)",\s*backdropFilter:\s*"blur\(\d+px\)"/g, 'backdropFilter: "blur(12px)"');

// Just to be extremely robust, let's remove any second backdropFilter in a line
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('backdropFilter:') && lines[i].indexOf('backdropFilter:') !== lines[i].lastIndexOf('backdropFilter:')) {
    // Replace the second occurrence onwards
    lines[i] = lines[i].replace(/(backdropFilter:\s*[^,]+,\s*)(.*?)backdropFilter:\s*[^,]+,?/g, '$1$2');
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log("Community.jsx backdrop filters cleaned up!");
