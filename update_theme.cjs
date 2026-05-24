const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'Community.jsx');

let content = fs.readFileSync(file, 'utf8');

// Replace palette definition
content = content.replace(
  /const CUTE = \{[\s\S]*?\};/,
  `const OCEAN = {
  bg: "#e0f2fe",
  surface: "#ffffff",
  card: "#f0f9ff",
  border: "#bae6fd",
  accent: "#0ea5e9",
  text: "#0c4a6e",
  muted: "#0284c7",
  bubbleMe: "#38bdf8",
  bubbleThem: "#ffffff",
};`
);

// Replace CUTE with OCEAN globally
content = content.replace(/CUTE/g, 'OCEAN');

// Replace the friends background
const oldBg = `<div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,141,161,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />`;

const newBg = `
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

content = content.replace(oldBg, newBg);

// Remove glassmorphism and update pink shadows to ocean blue
content = content.replace(/background: "rgba\(255,255,255,0\.8\)", backdropFilter: "blur\(10px\)",/g, 'background: "#ffffff",');
content = content.replace(/boxShadow: "0 10px 30px rgba\(255,141,161,0\.2\)"/g, 'boxShadow: "0 10px 30px rgba(14,165,233,0.2)"');
content = content.replace(/boxShadow: "0 10px 40px rgba\(255,141,161,0\.1\)"/g, 'boxShadow: "0 10px 40px rgba(14,165,233,0.1)"');
content = content.replace(/boxShadow: "0 4px 12px rgba\(255,141,161,0\.3\)"/g, 'boxShadow: "0 4px 12px rgba(14,165,233,0.3)"');
content = content.replace(/boxShadow: inputMsg\.trim\(\) \? "0 4px 16px rgba\(255,141,161,0\.4\)"/g, 'boxShadow: inputMsg.trim() ? "0 4px 16px rgba(14,165,233,0.4)"');
content = content.replace(/background: "linear-gradient\(180deg, #ffffff 0%, #fff5f8 100%\)"/g, 'background: "linear-gradient(180deg, #ffffff 0%, #e0f2fe 100%)"');
content = content.replace(/boxShadow: "0 10px 30px rgba\(255,141,161,0\.15\)"/g, 'boxShadow: "0 10px 30px rgba(14,165,233,0.15)"');

fs.writeFileSync(file, content);
console.log("Community.jsx updated with Ocean theme!");
