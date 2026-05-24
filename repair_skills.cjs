const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.jsx');

let content = fs.readFileSync(file, 'utf8');

// Find the start and end of the SkillAssessment component
const startIndex = content.indexOf('function SkillAssessment({');
const endIndex = content.indexOf('// ─── MARKET DEMAND DATA');

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find boundaries!");
  process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newComponent = `function SkillAssessment({ user, onSave, onNav }) {
  const [skills, setSkills] = useState(() =>
    Object.fromEntries(SKILL_KEYS.map(k => [k, user.skills?.[k] || 50]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const descriptions = {
    JavaScript: "Core web programming, ES6+, async/await, DOM manipulation",
    React: "Component architecture, hooks, state management, routing",
    Python: "Data structures, scripting, OOP, libraries like NumPy/Pandas",
    Java: "JVM, Spring Boot, object-oriented design, multithreading",
    "C++": "Memory management, STL, competitive programming, pointers",
    TypeScript: "Static typing, interfaces, advanced generic patterns",
    SQL: "Relational DBs, complex queries, joins, indexing, normalization",
    CSS: "Layouts, Flexbox, Grid, animations, responsive design",
    SystemDesign: "Architecture, scalability, databases, APIs, microservices",
    DataStructures: "Arrays, trees, graphs, sorting, dynamic programming",
    ProblemSolving: "Algorithmic thinking, LeetCode/DSA, optimization",
    Communication: "Technical writing, presentations, cross-functional collaboration",
    Teamwork: "Agile methodologies, pair programming, conflict resolution, code reviews"
  };

  function handleSave() {
    setLoading(true);
    setTimeout(() => {
      onSave(skills);
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  if (submitted) {
    const avgScore = Math.round(Object.values(skills).reduce((a, b) => a + b, 0) / Object.values(skills).length);
    const best = getBestRole(skills);
    return (
      <div className="section-enter" style={{ textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
        <h2 className="syne" style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Assessment Complete!</h2>
        <p style={{ color: G.muted, marginBottom: 32 }}>Your career readiness score has been calculated</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 40, flexWrap: "wrap" }}>
          <ScoreRing score={avgScore} label="Readiness" />
          <ScoreRing score={best.score} color={ROLES[best.key]?.color} label="Best Role" />
        </div>
        <div className="card" style={{ maxWidth: 400, margin: "0 auto 32px", padding: "20px" }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>{ROLES[best.key]?.icon}</div>
          <div className="syne" style={{ fontSize: 18, fontWeight: 700 }}>Best Match: {ROLES[best.key]?.label}</div>
          <div style={{ color: G.muted, fontSize: 14, marginTop: 4 }}>You are {best.score}% ready for this role</div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => onNav("career")}>View Career Analysis →</button>
          <button className="btn-outline" onClick={() => setSubmitted(false)}>Reassess Skills</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-enter">
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1 className="syne" style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Interactive Skill Assessment</h1>
        <p style={{ color: G.muted, fontSize: 16 }}>Hover over the cards to see the 3D effect. Drag the sliders to update your proficiency.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24, marginBottom: 40, padding: "20px" }}>
        {SKILL_KEYS.map(key => (
          <div key={key} style={{
            position: "relative",
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 12px 32px rgba(31, 38, 135, 0.08)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
            transformStyle: "preserve-3d"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 24px 48px rgba(31, 38, 135, 0.15)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
            e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 1)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(31, 38, 135, 0.08)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
            e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.8)";
          }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 120, height: 120, background: "rgba(56, 189, 248, 0.2)", filter: "blur(40px)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -50, left: -50, width: 120, height: 120, background: "rgba(129, 140, 248, 0.15)", filter: "blur(40px)", borderRadius: "50%", pointerEvents: "none" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(255, 255, 255, 0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,1)", position: "relative", zIndex: 2 }}>
                  {SKILL_ICONS[key]}
                </div>
                <span className="syne" style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", position: "relative", zIndex: 2 }}>{key}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.9)", padding: "4px 14px", borderRadius: 20, color: "#0ea5e9", fontWeight: 800, fontSize: 16, border: "1px solid rgba(14,165,233,0.2)", boxShadow: "0 4px 12px rgba(14,165,233,0.15)", position: "relative", zIndex: 2 }}>
                {skills[key]}
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#475569", marginBottom: 24, minHeight: 38, lineHeight: 1.5, position: "relative", zIndex: 2 }}>{descriptions[key]}</p>
            
            <div style={{ position: "relative", height: 12, background: "rgba(226, 232, 240, 0.8)", borderRadius: 6, marginBottom: 12, overflow: "visible", boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)", zIndex: 2 }}>
               <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "linear-gradient(90deg, #38bdf8, #818cf8)", borderRadius: 6, width: \`\${skills[key]}%\`, transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 2px 12px rgba(56, 189, 248, 0.5)" }} />
               
               <input type="range" min={0} max={100} value={skills[key]} onChange={e => setSkills({ ...skills, [key]: Number(e.target.value) })} style={{ position: "absolute", top: -8, left: 0, width: "100%", opacity: 0, cursor: "pointer", height: 28, zIndex: 3 }} />
               
               <div style={{ position: "absolute", top: -6, left: \`calc(\${skills[key]}% - 12px)\`, width: 24, height: 24, background: "#fff", border: "4px solid #818cf8", borderRadius: "50%", pointerEvents: "none", boxShadow: "0 4px 16px rgba(129, 140, 248, 0.6)", transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 1 }} />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", fontWeight: 700, position: "relative", zIndex: 2 }}>
              <span>Beginner</span><span>Intermediate</span><span>Expert</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div className="card" style={{ marginBottom: 32, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 24, padding: 32, boxShadow: "0 12px 32px rgba(31,38,135,0.05)" }}>
        <h3 className="syne" style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: "#1e293b", textAlign: "center" }}>Live Score Preview</h3>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          {Object.entries(ROLES).map(([key, role]) => {
            const score = calcReadiness(skills, key);
            return (
              <div key={key} style={{ textAlign: "center", background: "rgba(255,255,255,0.9)", padding: 16, borderRadius: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                <ScoreRing score={score} size={80} color={role.color} label={role.icon} />
                <div style={{ fontSize: 12, color: "#475569", marginTop: 8, fontWeight: 700 }}>{role.label.split(" ")[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="btn-primary" style={{ padding: "16px 48px", fontSize: 16, display: "flex", alignItems: "center", gap: 12, borderRadius: 30, background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", boxShadow: "0 8px 24px rgba(56, 189, 248, 0.4)", cursor: "pointer", transition: "transform 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          onClick={handleSave} disabled={loading}>
          {loading ? <><LoadingSpinner size={18} /> Calculating...</> : "Generate Career Report →"}
        </button>
      </div>
    </div>
  );
}

`

fs.writeFileSync(file, before + newComponent + after);
console.log("Skill Assessment fully repaired and upgraded!");
