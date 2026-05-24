const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'Community.jsx');

let content = fs.readFileSync(file, 'utf8');

// Replace OCEAN palette
content = content.replace(
  /const OCEAN = \{[\s\S]*?\};/,
  `const OCEAN = {
  bg: "#2b3544",
  surface: "rgba(15, 23, 42, 0.45)",
  card: "rgba(255, 255, 255, 0.05)",
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#93c5fd",
  text: "#f8fafc",
  muted: "#cbd5e1",
  bubbleMe: "#334155",
  bubbleThem: "rgba(255, 255, 255, 0.05)",
};`
);

// Update background gradient in the top level element
content = content.replace(
  /<div className="section-enter" style=\{\{ minHeight: "100vh", background: OCEAN\.bg, transition: "background 0\.4s ease" \}\}>/g,
  `<div className="section-enter" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #7b8ea8 0%, #3a4b66 50%, #1e2638 100%)", transition: "background 0.4s ease" }}>`
);

// Update fish container to have blur backdrop for elements inside, and we need to fix the glassmorphism.
// Since surface is rgba(..., 0.45), we must add backdropFilter: "blur(12px)" to the elements that use OCEAN.surface
content = content.replace(
  /background: OCEAN\.surface, borderRadius: 30/g,
  'background: OCEAN.surface, borderRadius: 30, backdropFilter: "blur(12px)"'
);
content = content.replace(
  /background: OCEAN\.surface, border: \`1px solid \$\{OCEAN\.border\}\`, borderRadius: 16/g,
  'background: OCEAN.surface, border: `1px solid ${OCEAN.border}`, borderRadius: 16, backdropFilter: "blur(12px)"'
);
content = content.replace(
  /background: OCEAN\.surface, borderRadius: 20, padding: 20/g,
  'background: OCEAN.surface, borderRadius: 20, padding: 20, backdropFilter: "blur(12px)"'
);
content = content.replace(
  /background: OCEAN\.surface, borderRadius: 24, padding: 20/g,
  'background: OCEAN.surface, borderRadius: 24, padding: 20, backdropFilter: "blur(12px)"'
);
content = content.replace(
  /background: OCEAN\.surface, borderRadius: 24, boxShadow: "0 10px 40px rgba\(14,165,233,0\.1\)"/g,
  'background: OCEAN.surface, borderRadius: 24, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", backdropFilter: "blur(12px)"'
);

// The chat header was #ffffff, make it glass too
content = content.replace(
  /background: "#ffffff", zIndex: 2/g,
  'background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(10px)", zIndex: 2'
);

// Chat body background
content = content.replace(
  /background: "linear-gradient\(180deg, #ffffff 0%, #e0f2fe 100%\)"/g,
  'background: "transparent"' // Let the glassmorphism show through
);

// Chat input area
content = content.replace(
  /background: "#fff"/g,
  'background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(10px)"'
);

// Emoji Popover
content = content.replace(
  /background: "#fff",\s*border: \`1px solid \$\{OCEAN\.border\}\`/g,
  'background: "rgba(30, 41, 59, 0.9)", backdropFilter: "blur(10px)", border: `1px solid ${OCEAN.border}`'
);

// Connect Now button background for discover
content = content.replace(
  /background: "rgba\(224, 242, 254, 0\.4\)"/g,
  'background: "rgba(255, 255, 255, 0.1)"'
);
content = content.replace(
  /background = "rgba\(224, 242, 254, 0\.7\)"/g,
  'background = "rgba(255, 255, 255, 0.2)"'
);
content = content.replace(
  /background = "rgba\(224, 242, 254, 0\.4\)"/g,
  'background = "rgba(255, 255, 255, 0.1)"'
);

// "My Friends" tag buttons in discover
content = content.replace(
  /background: OCEAN\.card, border: \`1px solid \$\{OCEAN\.border\}\`, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: OCEAN\.accent/g,
  'background: "rgba(255,255,255,0.05)", border: `1px solid ${OCEAN.border}`, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: OCEAN.accent'
);

fs.writeFileSync(file, content);
console.log("Community.jsx updated with twilight ocean theme!");
