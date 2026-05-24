const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'Community.jsx');

let content = fs.readFileSync(file, 'utf8');

// 1. Remove the tab-specific background ternaries and pattern rendering
// The current background patterns block:
//       {/* Background patterns based on tab */}
//       {activeTab === "discover" ? ( ... ) : ( ... )}
// Let's replace the whole thing with just the ocean background.
const bgRegex = /\{\/\* Background patterns based on tab \*\/\}[\s\S]*?(?=<div style=\{\{ position: "relative", zIndex: 10, padding: "0 40px", paddingTop: 40, maxWidth: 1400, margin: "0 auto" \}\}\>)/;

const newBg = `
      {/* Background patterns */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          <style>
            {\`
              @keyframes swimRight {
                0% { transform: translateX(-100px) translateY(0px) scaleX(-1); }
                50% { transform: translateX(50vw) translateY(20px) scaleX(-1); }
                100% { transform: translateX(100vw) translateY(-10px) scaleX(-1); }
              }
              @keyframes swimLeft {
                0% { transform: translateX(100vw) translateY(0px); }
                50% { transform: translateX(50vw) translateY(-30px); }
                100% { transform: translateX(-100px) translateY(10px); }
              }
              .fish-1 { position: absolute; top: 15%; animation: swimRight 25s linear infinite; font-size: 40px; opacity: 0.6; }
              .fish-2 { position: absolute; top: 40%; animation: swimLeft 30s linear infinite; font-size: 50px; opacity: 0.5; }
              .fish-3 { position: absolute; top: 70%; animation: swimRight 20s linear infinite; font-size: 30px; opacity: 0.7; }
              .fish-4 { position: absolute; top: 85%; animation: swimLeft 35s linear infinite; font-size: 45px; opacity: 0.4; }
              .bubble { position: absolute; bottom: -20px; animation: rise 10s ease-in infinite; font-size: 20px; opacity: 0.5; }
              @keyframes rise {
                0% { transform: translateY(0) scale(1); opacity: 0.5; }
                100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
              }
            \`}
          </style>
          <div className="fish-1">🐟</div>
          <div className="fish-2">🐠</div>
          <div className="fish-3">🐡</div>
          <div className="fish-4">🐟</div>
          <div className="bubble" style={{ left: "20%", animationDelay: "0s" }}>🫧</div>
          <div className="bubble" style={{ left: "50%", animationDelay: "3s" }}>🫧</div>
          <div className="bubble" style={{ left: "80%", animationDelay: "1s" }}>🫧</div>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(180deg, rgba(224,242,254,0.1) 0%, rgba(186,230,253,0.5) 100%)", zIndex: -1 }} />
        </div>
      
      `;

content = content.replace(bgRegex, newBg);

// Remove the inline style ternaries for background
content = content.replace(/background: activeTab === "discover" \? G\.bg : OCEAN\.bg/g, 'background: OCEAN.bg');

// Header Text & Muted
content = content.replace(/color: activeTab === "discover" \? G\.text : OCEAN\.text/g, 'color: OCEAN.text');
content = content.replace(/color: activeTab === "discover" \? G\.muted : OCEAN\.muted/g, 'color: OCEAN.muted');
content = content.replace(/background: activeTab === "discover" \? G\.surface : OCEAN\.surface/g, 'background: OCEAN.surface');

// Tabs
content = content.replace(/background: activeTab === "discover" \? G\.accent : "transparent"/g, 'background: activeTab === "discover" ? OCEAN.accent : "transparent"');
content = content.replace(/color: activeTab === "discover" \? "#fff" : G\.muted/g, 'color: activeTab === "discover" ? "#fff" : OCEAN.muted');

content = content.replace(/color: activeTab === "friends" \? "#fff" : G\.muted/g, 'color: activeTab === "friends" ? "#fff" : OCEAN.muted');

// Discover Cards
content = content.replace(/background: G\.surface/g, 'background: OCEAN.surface');
content = content.replace(/border: \`1px solid \$\{G\.border\}\`/g, 'border: `1px solid ${OCEAN.border}`');
content = content.replace(/boxShadow: "0 4px 20px rgba\(159,18,57,0\.05\)"/g, 'boxShadow: "0 4px 20px rgba(14,165,233,0.05)"');
content = content.replace(/boxShadow: "0 12px 30px rgba\(159,18,57,0\.12\)"/g, 'boxShadow: "0 12px 30px rgba(14,165,233,0.12)"');
content = content.replace(/background: G\.card/g, 'background: OCEAN.card');
content = content.replace(/background: u\.status === "online" \? G\.success : "#cbd5e1"/g, 'background: u.status === "online" ? "#10b981" : "#cbd5e1"');
content = content.replace(/border: \`2px solid \$\{G\.surface\}\`/g, 'border: `2px solid ${OCEAN.surface}`');
content = content.replace(/color: G\.muted/g, 'color: OCEAN.muted');
content = content.replace(/color: G\.accent/g, 'color: OCEAN.accent');
content = content.replace(/color: G\.text/g, 'color: OCEAN.text');
content = content.replace(/background: \`linear-gradient\(135deg, \$\{G\.accent\}, #be123c\)\`/g, 'background: `linear-gradient(135deg, ${OCEAN.accent}, #0284c7)`');


// Non-logged in screen
content = content.replace(/color: G\.accent/g, 'color: OCEAN.accent');
content = content.replace(/background: G\.bg/g, 'background: OCEAN.bg');


fs.writeFileSync(file, content);
console.log("Discover tab updated to OCEAN theme!");
