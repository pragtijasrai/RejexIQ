const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.jsx');

let content = fs.readFileSync(file, 'utf8');

const regex = /\{SKILL_KEYS\.map\(key => \([\s\S]*?\)\)}\n      <\/div>/;

const newCards = `{SKILL_KEYS.map(key => (
          <div key={key} style={{
            position: "relative",
            overflow: "hidden",
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
            transformStyle: "preserve-3d"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 24px 48px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.15)";
            e.currentTarget.style.background = "rgba(15, 23, 42, 0.95)";
            e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.6)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.3)";
            e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)";
            e.currentTarget.style.borderColor = "rgba(14, 165, 233, 0.3)";
          }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 140, height: 140, background: "rgba(56, 189, 248, 0.15)", filter: "blur(40px)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 140, height: 140, background: "rgba(99, 102, 241, 0.15)", filter: "blur(40px)", borderRadius: "50%", pointerEvents: "none" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(30, 41, 59, 0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0,0,0,0.2)", border: "1px solid rgba(56,189,248,0.3)", position: "relative", zIndex: 2 }}>
                  {SKILL_ICONS[key]}
                </div>
                <span className="syne" style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", position: "relative", zIndex: 2, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{key}</span>
              </div>
              <div style={{ background: "rgba(14,165,233,0.15)", padding: "4px 14px", borderRadius: 20, color: "#38bdf8", fontWeight: 800, fontSize: 16, border: "1px solid rgba(56,189,248,0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", position: "relative", zIndex: 2 }}>
                {skills[key]}
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, minHeight: 38, lineHeight: 1.5, position: "relative", zIndex: 2, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{descriptions[key]}</p>
            
            <div style={{ position: "relative", height: 10, background: "rgba(30, 41, 59, 0.8)", borderRadius: 5, marginBottom: 12, overflow: "visible", boxShadow: "inset 0 1px 4px rgba(0,0,0,0.5)", zIndex: 2 }}>
               <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "linear-gradient(90deg, #0284c7, #38bdf8)", borderRadius: 5, width: \`\${skills[key]}%\`, transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 0 15px rgba(56, 189, 248, 0.6)" }} />
               
               <input type="range" min={0} max={100} value={skills[key]} onChange={e => setSkills({ ...skills, [key]: Number(e.target.value) })} style={{ position: "absolute", top: -8, left: 0, width: "100%", opacity: 0, cursor: "pointer", height: 26, zIndex: 3 }} />
               
               <div style={{ position: "absolute", top: -7, left: \`calc(\${skills[key]}% - 12px)\`, width: 24, height: 24, background: "#fff", border: "4px solid #38bdf8", borderRadius: "50%", pointerEvents: "none", boxShadow: "0 0 15px rgba(56, 189, 248, 0.8)", transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 1 }} />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", fontWeight: 700, position: "relative", zIndex: 2 }}>
              <span>Beginner</span><span>Intermediate</span><span>Expert</span>
            </div>
          </div>
        ))}
      </div>`;

content = content.replace(regex, newCards);

// Also let's fix the header text to match a dark/neon aesthetic instead of yellow
content = content.replace(
  /background: "linear-gradient\(90deg, #fde047, #f59e0b\)"/g,
  'background: "linear-gradient(90deg, #38bdf8, #818cf8)"'
);

// Also the "Live preview" card underneath should probably have a consistent dark glassy theme instead of a light glassy one if the whole section is dark
content = content.replace(
  /className="card" style=\{\{ marginBottom: 32, background: "rgba\(255,255,255,0\.6\)", backdropFilter: "blur\(20px\)", border: "1px solid rgba\(255,255,255,0\.8\)", borderRadius: 24, padding: 32, boxShadow: "0 12px 32px rgba\(31,38,135,0\.05\)" \}\}/,
  `className="card" style={{ marginBottom: 32, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(14, 165, 233, 0.2)", borderRadius: 24, padding: 32, boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}`
);
content = content.replace(
  /<h3 className="syne" style=\{\{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: "#1e293b", textAlign: "center" \}\}>Live Score Preview<\/h3>/,
  `<h3 className="syne" style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: "#f8fafc", textAlign: "center" }}>Live Score Preview</h3>`
);
content = content.replace(
  /style=\{\{ textAlign: "center", background: "rgba\(255,255,255,0\.9\)", padding: 16, borderRadius: 20, boxShadow: "0 4px 16px rgba\(0,0,0,0\.05\)" \}\}/g,
  `style={{ textAlign: "center", background: "rgba(30, 41, 59, 0.8)", padding: 16, borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", border: "1px solid rgba(56,189,248,0.2)" }}`
);
content = content.replace(
  /color: "#475569"/g,
  'color: "#cbd5e1"'
);

fs.writeFileSync(file, content);
console.log("Updated to dark bluish black glassmorphism!");
