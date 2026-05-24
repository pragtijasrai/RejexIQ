const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.jsx');

let content = fs.readFileSync(file, 'utf8');

// 1. Update SKILL_KEYS and SKILL_ICONS
content = content.replace(
  /const SKILL_KEYS = \["JavaScript".*?\];/,
  'const SKILL_KEYS = ["JavaScript", "React", "Python", "Java", "C++", "TypeScript", "SQL", "CSS", "SystemDesign", "DataStructures", "ProblemSolving", "Communication", "Teamwork"];'
);
content = content.replace(
  /const SKILL_ICONS = \{ JavaScript: "⚡".*?\};/,
  'const SKILL_ICONS = { JavaScript: "⚡", React: "⚛️", Python: "🐍", Java: "☕", "C++": "⚙️", TypeScript: "📘", SQL: "🗄️", CSS: "🎨", SystemDesign: "🏗️", DataStructures: "🌳", ProblemSolving: "🧩", Communication: "💬", Teamwork: "🤝" };'
);

// 2. Update handleSaveSkills
content = content.replace(
  /function handleSaveSkills\(skills\) \{[\s\S]*?\}\);[\s\S]*?\}/,
  `function handleSaveSkills(skills) {\n    handleUpdateUser({ skills, assessmentDone: true });\n  }`
);

// 3. Update descriptions
content = content.replace(
  /const descriptions = \{[\s\S]*?Communication: "Technical writing, presentations, teamwork, documentation"[\s\S]*?\};/,
  `const descriptions = {
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
  };`
);

// 4. Update the card rendering
const oldCard = `          <div key={key} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{SKILL_ICONS[key]}</span>
                <span className="syne" style={{ fontSize: 15, fontWeight: 700 }}>{key}</span>
              </div>
              <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: skills[key] >= 70 ? G.success : skills[key] >= 40 ? G.warning : G.danger }}>
                {skills[key]}
              </span>
            </div>
            <p style={{ fontSize: 12, color: G.muted, marginBottom: 12 }}>{descriptions[key]}</p>
            <input type="range" className="slider-custom" min={0} max={100}
              value={skills[key]}
              onChange={e => setSkills({ ...skills, [key]: Number(e.target.value) })}
              style={{ background: \`linear-gradient(90deg, \${G.accent} \${skills[key]}%, \${G.border} \${skills[key]}%)\` }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: G.muted, marginTop: 4 }}>
              <span>Beginner</span><span>Intermediate</span><span>Expert</span>
            </div>
          </div>`;

const newCard = `          <div key={key} style={{ 
            background: "#fff", 
            border: "2px solid #fce7f3", 
            borderRadius: 24, 
            padding: 24, 
            boxShadow: "0 8px 24px rgba(244, 63, 94, 0.08)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(244, 63, 94, 0.15)";
            e.currentTarget.style.borderColor = "#fbcfe8";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(244, 63, 94, 0.08)";
            e.currentTarget.style.borderColor = "#fce7f3";
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "inset 0 2px 4px rgba(244, 63, 94, 0.1)" }}>
                  {SKILL_ICONS[key]}
                </div>
                <span className="syne" style={{ fontSize: 18, fontWeight: 800, color: "#4a0e2e" }}>{key}</span>
              </div>
              <div style={{ background: "#fdf2f8", padding: "4px 12px", borderRadius: 20, color: "#9f1239", fontWeight: 800, fontSize: 16 }}>
                {skills[key]}
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#885a6b", marginBottom: 20, minHeight: 38, lineHeight: 1.4 }}>{descriptions[key]}</p>
            <div style={{ position: "relative", height: 8, background: "#fce7f3", borderRadius: 4, marginBottom: 12 }}>
               <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "#f43f5e", borderRadius: 4, width: \`\${skills[key]}%\`, transition: "width 0.3s" }} />
               <input type="range" min={0} max={100} value={skills[key]} onChange={e => setSkills({ ...skills, [key]: Number(e.target.value) })} style={{ position: "absolute", top: -8, left: 0, width: "100%", opacity: 0, cursor: "pointer", height: 24, zIndex: 2 }} />
               <div style={{ position: "absolute", top: -6, left: \`calc(\${skills[key]}% - 10px)\`, width: 20, height: 20, background: "#fff", border: "3px solid #f43f5e", borderRadius: "50%", pointerEvents: "none", boxShadow: "0 2px 8px rgba(244, 63, 94, 0.4)", transition: "left 0.3s", zIndex: 1 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#fda4af", fontWeight: 700 }}>
              <span>Beginner</span><span>Intermediate</span><span>Expert</span>
            </div>
          </div>`;

content = content.replace(oldCard, newCard);

fs.writeFileSync(file, content);
console.log("Skill Assessment updated!");
