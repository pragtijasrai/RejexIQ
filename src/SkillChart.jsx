import { useState } from "react";

const C = {
  card: "#141b3a", border: "rgba(255,255,255,0.07)", accent: "#00e5ff",
  purple: "#c084fc", success: "#10b981", danger: "#ef4444",
  warning: "#f59e0b", text: "#f0f4ff", muted: "#64748b"
};

const SKILL_ICONS = {
  JavaScript: "⚡", React: "⚛️", CSS: "🎨", DSA: "🌳",
  SystemDesign: "🏗️", Communication: "💬", Python: "🐍", ProblemSolving: "🧩"
};

function RadarChart({ skills, required, size = 260 }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.38;
  const keys = Object.keys(required);
  const n = keys.length;

  const angleStep = (2 * Math.PI) / n;
  const getPoint = (i, val, maxVal = 100) => {
    const angle = i * angleStep - Math.PI / 2;
    const dist = (val / maxVal) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const userPoints = keys.map((k, i) => getPoint(i, skills[k] || 0));
  const reqPoints  = keys.map((k, i) => getPoint(i, required[k] || 0));
  const gridLevels = [20, 40, 60, 80, 100];

  const toPath = pts => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {gridLevels.map(lvl => {
        const pts = keys.map((_, i) => getPoint(i, lvl));
        return <polygon key={lvl} points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />;
      })}
      {/* Axis lines */}
      {keys.map((_, i) => {
        const outer = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
      })}
      {/* Required area */}
      <path d={toPath(reqPoints)} fill={`${C.danger}15`} stroke={C.danger} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7} />
      {/* User area */}
      <path d={toPath(userPoints)} fill={`${C.accent}20`} stroke={C.accent} strokeWidth={2} />
      {/* User dots */}
      {userPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={C.accent} style={{ filter: `drop-shadow(0 0 4px ${C.accent})` }} />
      ))}
      {/* Labels */}
      {keys.map((k, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const lx = cx + (r + 22) * Math.cos(angle);
        const ly = cy + (r + 22) * Math.sin(angle);
        return (
          <text key={k} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={C.muted}>
            {SKILL_ICONS[k] || ""} {k}
          </text>
        );
      })}
    </svg>
  );
}

function SkillBar({ skill, value, required, onChange }) {
  const gap = Math.max(0, required - value);
  const color = value >= required ? C.success : value >= required * 0.7 ? C.warning : C.danger;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.text }}>
          <span>{SKILL_ICONS[skill] || "📊"}</span> {skill}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {gap > 0 && <span style={{ fontSize: 11, color: C.danger }}>-{gap} gap</span>}
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color }}>{value}</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${value}%`, background: `linear-gradient(90deg,${color},${color}cc)`, borderRadius: 3, transition: "width 0.5s ease", boxShadow: `0 0 6px ${color}50` }} />
        {/* Required marker */}
        <div style={{ position: "absolute", left: `${required}%`, top: 0, width: 2, height: "100%", background: C.danger, opacity: 0.6 }} />
      </div>
      {onChange && (
        <input type="range" min={0} max={100} value={value} onChange={e => onChange(skill, +e.target.value)}
          style={{ width: "100%", marginTop: 4, accentColor: color, height: 2 }} />
      )}
    </div>
  );
}

export default function SkillChart({ skills, requiredSkills, onSkillChange, showSliders = false }) {
  const [view, setView] = useState("bars");

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      {/* View toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["bars", "radar"].map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${view === v ? C.accent : C.border}`, background: view === v ? `${C.accent}15` : "transparent", color: view === v ? C.accent : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>
            {v === "bars" ? "📊 Bars" : "🕸️ Radar"}
          </button>
        ))}
      </div>

      {view === "radar" ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
          <RadarChart skills={skills} required={requiredSkills} size={280} />
        </div>
      ) : (
        <div>
          {Object.entries(requiredSkills).map(([skill, req]) => (
            <SkillBar key={skill} skill={skill} value={skills[skill] || 0} required={req} onChange={showSliders ? onSkillChange : null} />
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: C.muted }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 12, height: 3, background: C.accent, borderRadius: 2 }} /> Your score
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 12, height: 3, background: C.danger, borderRadius: 2, opacity: 0.6 }} /> Required
        </div>
      </div>
    </div>
  );
}
