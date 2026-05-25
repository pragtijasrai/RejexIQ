import { useState, useEffect, useRef } from "react";
import { getRoles } from "./careerApi";
import JobSimulator from "./JobSimulator";
import RejectionMeter from "./RejectionMeter";
import TimeEstimator from "./TimeEstimator";
import ROIAnalyzer from "./ROIAnalyzer";
import SkillChart from "./SkillChart";

const C = {
  bg: "#080c1e", surface: "#0d1225", card: "#111827",
  cardAlt: "#141b3a", border: "rgba(255,255,255,0.07)",
  accent: "#00e5ff", purple: "#c084fc", success: "#10b981",
  danger: "#ef4444", warning: "#f59e0b", text: "#f0f4ff", muted: "#64748b"
};

const TABS = [
  { id: "overview",   label: "Overview",        icon: "🎯" },
  { id: "simulator",  label: "Job Simulator",   icon: "🎮" },
  { id: "rejection",  label: "Rejection Risk",  icon: "📉" },
  { id: "timeline",   label: "Time to Job",     icon: "⏱️" },
  { id: "roi",        label: "Skill ROI",       icon: "📈" }
];

function ReadinessRing({ score, color, size = 120, label }) {
  const r = size * 0.38, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.07} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.07}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease", filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: size * 0.2, fontWeight: 900, color }}>{score}%</span>
        {label && <span style={{ fontSize: size * 0.08, color: C.muted, marginTop: 2, textAlign: "center", lineHeight: 1.2 }}>{label}</span>}
      </div>
    </div>
  );
}

function RoleCard({ role, score, isSelected, onClick }) {
  const [hov, setHov] = useState(false);
  const color = role.color;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
      style={{ padding: "16px", borderRadius: 14, border: `1.5px solid ${isSelected ? color : hov ? color + "60" : C.border}`, background: isSelected ? `${color}10` : hov ? `${color}06` : C.card, cursor: "pointer", transition: "all 0.25s", textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 6, filter: isSelected ? `drop-shadow(0 0 10px ${color})` : "none", transition: "filter 0.3s" }}>{role.icon}</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: isSelected ? color : C.text, marginBottom: 4 }}>{role.label}</div>
      <ReadinessRing score={score} color={color} size={64} />
    </div>
  );
}

function StatChip({ icon, label, value, color }) {
  return (
    <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 24, filter: `drop-shadow(0 0 6px ${color})` }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: 11, color: C.muted }}>{label}</div>
      </div>
    </div>
  );
}

function OverviewTab({ user, roles, selectedRole, onRoleChange }) {
  const role = roles.find(r => r.key === selectedRole);
  if (!role) return null;

  const skills = user.skills || {};
  const score = calcReadiness(skills, role.requiredSkills);
  const bestRole = getBestRole(skills, roles);
  const gaps = Object.entries(role.requiredSkills)
    .map(([s, r]) => ({ skill: s, gap: Math.max(0, r - (skills[s] || 0)) }))
    .filter(x => x.gap > 0).sort((a, b) => b.gap - a.gap);

  const [editSkills, setEditSkills] = useState(skills);
  const [liveScore, setLiveScore] = useState(score);

  function handleSkillChange(skill, val) {
    const updated = { ...editSkills, [skill]: val };
    setEditSkills(updated);
    setLiveScore(calcReadiness(updated, role.requiredSkills));
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {}
      <div>
        {}
        <div style={{ background: `linear-gradient(135deg,${bestRole.color}15,${C.cardAlt})`, border: `1px solid ${bestRole.color}40`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Your Best Match</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ReadinessRing score={bestRole.score} color={bestRole.color} size={90} />
            <div>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{bestRole.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color: bestRole.color }}>{bestRole.label}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>You are {bestRole.score}% ready</div>
              <div style={{ fontSize: 12, color: C.success, marginTop: 4 }}>{bestRole.avgSalary} · {bestRole.growthRate} growth</div>
            </div>
          </div>
        </div>

        {}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {roles.map(r => (
            <RoleCard key={r.key} role={r} score={calcReadiness(skills, r.requiredSkills)} isSelected={selectedRole === r.key} onClick={() => onRoleChange(r.key)} />
          ))}
        </div>

        {}
        {role && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <StatChip icon="💰" label="Avg Salary" value={role.avgSalary} color={C.success} />
            <StatChip icon="📋" label="Open Jobs" value={`${(role.openings / 1000).toFixed(0)}k+`} color={C.accent} />
            <StatChip icon="📈" label="Growth Rate" value={role.growthRate} color={C.warning} />
            <StatChip icon="🎯" label="Your Readiness" value={`${liveScore}%`} color={role.color} />
          </div>
        )}
      </div>

      {}
      <div>
        <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Skill Analysis — {role.label}</div>
          <SkillChart skills={editSkills} requiredSkills={role.requiredSkills} onSkillChange={handleSkillChange} showSliders={true} />
        </div>

        {}
        {gaps.length > 0 && (
          <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Priority Gaps</div>
            {gaps.slice(0, 3).map((g, i) => (
              <div key={g.skill} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 13, color: C.text }}>{g.skill}</span>
                <span style={{ fontSize: 12, color: C.danger, fontWeight: 600 }}>-{g.gap} pts to bridge</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function calcReadiness(skills, requiredSkills) {
  if (!requiredSkills) return 0;
  let totalUser = 0, totalReq = 0;
  for (const [skill, required] of Object.entries(requiredSkills)) {
    const user = skills[skill] || 0;
    totalUser += Math.min(user, required);
    totalReq += required;
  }
  return totalReq === 0 ? 0 : Math.round((totalUser / totalReq) * 100);
}

function getBestRole(skills, roles) {
  let best = null, bestScore = -1, bestReq = 0;
  for (const r of roles) {
    const score = calcReadiness(skills, r.requiredSkills);
    const req = Object.values(r.requiredSkills).reduce((a, b) => a + b, 0);
    if (score > bestScore || (score === bestScore && req > bestReq)) {
      best = r;
      bestScore = score;
      bestReq = req;
    }
  }
  return best ? { ...best, score: bestScore } : { label: "—", color: C.accent, icon: "🎯", score: 0, avgSalary: "—", growthRate: "—" };
}

export default function CareerMatch({ user, onNav }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("frontend");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const skills = user?.skills || {};
  const hasSkills = Object.keys(skills).length > 0;

  useEffect(() => {
    getRoles().then(d => {
      setRoles(d.roles);
      
      if (d.roles.length > 0 && hasSkills) {
        const best = getBestRole(skills, d.roles);
        setSelectedRole(best.key);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (!hasSkills) return (
    <div style={{ textAlign: "center", paddingTop: 80, fontFamily: "'Inter',sans-serif" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 800, color: "#1a0a0c", marginBottom: 10 }}>Complete Assessment First</h2>
      <p style={{ color: "#475569", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>Take the skill assessment to unlock your personalized career match, rejection predictor, and time estimator.</p>
      <button onClick={() => onNav("assessment")} style={{ padding: "12px 32px", borderRadius: 20, border: "none", background: `linear-gradient(135deg,${C.accent},${C.purple})`, color: "#080c1e", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>
        Go to Assessment →
      </button>
    </div>
  );

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const currentRole = roles.find(r => r.key === selectedRole);

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", color: C.text, minHeight: "100vh" }}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tabIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        * { box-sizing: border-box; }
      `}</style>

      {}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 900, color: "#1a0a0c", marginBottom: 4 }}>
              Career Match System
            </h1>
            <p style={{ color: "#475569", fontSize: 14 }}>Simulate real jobs · Predict rejection · Plan your path</p>
          </div>
          {}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {roles.map(r => (
              <button key={r.key} onClick={() => setSelectedRole(r.key)}
                style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${selectedRole === r.key ? r.color : C.border}`, background: selectedRole === r.key ? `${r.color}15` : "transparent", color: selectedRole === r.key ? r.color : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: C.card, borderRadius: 14, padding: 6, border: `1px solid ${C.border}`, overflowX: "auto" }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, minWidth: 110, padding: "10px 12px", borderRadius: 10, border: "none", background: activeTab === tab.id ? `linear-gradient(135deg,${C.accent}20,${C.purple}15)` : "transparent", color: activeTab === tab.id ? C.accent : C.muted, cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, transition: "all 0.2s", whiteSpace: "nowrap", borderBottom: activeTab === tab.id ? `2px solid ${C.accent}` : "2px solid transparent" }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {}
      <div style={{ animation: "tabIn 0.3s ease" }} key={activeTab}>
        {activeTab === "overview" && (
          <OverviewTab user={user} roles={roles} selectedRole={selectedRole} onRoleChange={setSelectedRole} />
        )}

        {activeTab === "simulator" && (
          <div>
            <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px" }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 6 }}>🎮 Job Reality Simulator</h3>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
                  Step into a real job scenario. Make decisions under pressure. See how your choices affect your career readiness score.
                </p>
              </div>
              {}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {roles.filter(r => ["frontend","backend","fullstack","dataAnalyst"].includes(r.key)).map(r => (
                  <button key={r.key} onClick={() => setSelectedRole(r.key)}
                    style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${selectedRole === r.key ? r.color : C.border}`, background: selectedRole === r.key ? `${r.color}15` : "transparent", color: selectedRole === r.key ? r.color : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
              <JobSimulator user={user} selectedRole={selectedRole} onClose={() => setActiveTab("overview")} />
            </div>
          </div>
        )}

        {activeTab === "rejection" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📉 Rejection Predictor</h3>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Rule-based analysis of your rejection probability for {currentRole?.label}.</p>
                <RejectionMeter user={user} selectedRole={selectedRole} />
              </div>
            </div>
            <div>
              <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>🎯 Skill Gap vs Required</h3>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Your current skills vs what {currentRole?.label} requires.</p>
                {currentRole && <SkillChart skills={skills} requiredSkills={currentRole.requiredSkills} showSliders={false} />}
              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>⏱️ Time to Job Calculator</h3>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Estimate how long until you're job-ready for {currentRole?.label}.</p>
              <TimeEstimator user={user} selectedRole={selectedRole} />
            </div>
            <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📋 Learning Roadmap</h3>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Prioritized steps to reach {currentRole?.label} readiness.</p>
              {currentRole && <Roadmap skills={skills} requiredSkills={currentRole.requiredSkills} />}
            </div>
          </div>
        )}

        {activeTab === "roi" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📈 Skill ROI Analyzer</h3>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Which skill gives you the biggest readiness boost per hour invested?</p>
              <ROIAnalyzer user={user} selectedRole={selectedRole} />
            </div>
            <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>🕸️ Skill Radar</h3>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Visual comparison of your skills vs {currentRole?.label} requirements.</p>
              {currentRole && <SkillChart skills={skills} requiredSkills={currentRole.requiredSkills} showSliders={false} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Roadmap({ skills, requiredSkills }) {
  const RESOURCES = {
    JavaScript: ["javascript.info", "Eloquent JavaScript", "30 Days of JS"],
    React: ["react.dev docs", "Build 3 projects with hooks", "React Query + Zustand"],
    CSS: ["CSS Tricks", "Flexbox Froggy", "Build responsive layouts"],
    DSA: ["LeetCode Easy→Medium", "NeetCode 150", "Visualgo.net"],
    SystemDesign: ["System Design Primer", "Grokking System Design", "Design Twitter/URL shortener"],
    Communication: ["Mock interviews", "Write technical blog posts", "Explain concepts to others"]
  };

  const gaps = Object.entries(requiredSkills)
    .map(([s, r]) => ({ skill: s, gap: Math.max(0, r - (skills[s] || 0)), required: r, current: skills[s] || 0 }))
    .filter(x => x.gap > 0).sort((a, b) => b.gap - a.gap);

  if (gaps.length === 0) return (
    <div style={{ textAlign: "center", padding: 32 }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
      <p style={{ color: "#10b981", fontWeight: 600 }}>You meet all requirements!</p>
    </div>
  );

  return (
    <div>
      {gaps.slice(0, 5).map((g, i) => (
        <div key={g.skill} style={{ display: "flex", gap: 14, marginBottom: 20, animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${C.accent}15`, border: `1px solid ${C.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.accent, flexShrink: 0 }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 3 }}>Improve {g.skill}</div>
            <div style={{ fontSize: 12, color: C.danger, marginBottom: 6 }}>{g.current} → {g.required} (+{g.gap} pts needed)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {(RESOURCES[g.skill] || [`Study ${g.skill} fundamentals`, `Build a project using ${g.skill}`]).map((r, j) => (
                <div key={j} style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.accent, fontSize: 10 }}>▸</span> {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
