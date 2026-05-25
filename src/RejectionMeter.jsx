import { useState, useEffect, useRef } from "react";
import { calculateRejection } from "./careerApi";

const C = {
  card: "#141b3a", border: "rgba(255,255,255,0.07)", accent: "#00e5ff",
  purple: "#c084fc", success: "#10b981", danger: "#ef4444",
  warning: "#f59e0b", text: "#f0f4ff", muted: "#64748b", surface: "#111827"
};

function parseProjectCount(val) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const lines = val.split('\n').filter(p => p.trim().length > 0);
    return lines.length > 0 ? lines.length : 1;
  }
  if (Array.isArray(val)) return val.length;
  return 1;
}

// Animated arc meter
function ArcMeter({ value, size = 180 }) {
  const r = size * 0.38;
  const cx = size / 2, cy = size / 2;
  const startAngle = -210, endAngle = 30;
  const totalArc = endAngle - startAngle;
  const valueArc = (value / 100) * totalArc;
  const toRad = d => (d * Math.PI) / 180;
  const arcPath = (start, end) => {
    const s = { x: cx + r * Math.cos(toRad(start)), y: cy + r * Math.sin(toRad(start)) };
    const e = { x: cx + r * Math.cos(toRad(end)), y: cy + r * Math.sin(toRad(end)) };
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const color = value >= 70 ? C.danger : value >= 40 ? C.warning : C.success;
  const label = value >= 70 ? "High Risk" : value >= 40 ? "Moderate" : "Low Risk";

  return (
    <div style={{ position: "relative", width: size, height: size * 0.75, margin: "0 auto" }}>
      <svg width={size} height={size * 0.75} viewBox={`0 0 ${size} ${size}`}>
        <path d={arcPath(startAngle, endAngle)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size * 0.06} strokeLinecap="round" />
        <path d={arcPath(startAngle, startAngle + valueArc)} fill="none" stroke={color} strokeWidth={size * 0.06} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "all 1s ease" }} />
        {/* Needle */}
        {(() => {
          const needleAngle = startAngle + valueArc;
          const nx = cx + (r - size * 0.04) * Math.cos(toRad(needleAngle));
          const ny = cy + (r - size * 0.04) * Math.sin(toRad(needleAngle));
          return <circle cx={nx} cy={ny} r={size * 0.03} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />;
        })()}
      </svg>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: size * 0.18, fontWeight: 900, color, lineHeight: 1 }}>{value}%</div>
        <div style={{ fontSize: size * 0.07, color: C.muted, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function FactorBar({ label, impact, type }) {
  const typeColor = type === "skill" ? C.danger : type === "project" ? C.warning : C.purple;
  const typeIcon = type === "skill" ? "⚡" : type === "project" ? "📁" : "💬";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.text }}>
          <span>{typeIcon}</span> {label}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: typeColor }}>+{impact}% risk</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(100, impact * 3)}%`, background: typeColor, borderRadius: 2, transition: "width 0.8s ease", boxShadow: `0 0 6px ${typeColor}60` }} />
      </div>
    </div>
  );
}

export default function RejectionMeter({ user, selectedRole }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState(() => parseProjectCount(user?.projects));
  const prevRole = useRef(null);

  useEffect(() => {
    setLoading(true);
    calculateRejection(user?.skills || {}, projects, selectedRole)
      .then(setData).catch(console.error).finally(() => setLoading(false));
  }, [selectedRole, projects, user?.skills]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.danger}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (!data) return null;

  const drop = data.probability - data.improvedProbability;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Main meter */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 20px", marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.danger, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Rejection Probability</div>
        <ArcMeter value={data.probability} size={200} />
        <p style={{ color: C.muted, fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
          You have a <strong style={{ color: data.probability >= 70 ? C.danger : data.probability >= 40 ? C.warning : C.success }}>{data.probability}% chance of rejection</strong> if you apply today.
        </p>
      </div>

      {/* Improvement scenario */}
      {data.improvements?.length > 0 && (
        <div style={{ background: `${C.success}08`, border: `1px solid ${C.success}30`, borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: C.success, fontWeight: 700, marginBottom: 8 }}>💡 If you improve:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {data.improvements.map((imp, i) => (
              <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 10, background: `${C.success}20`, color: C.success, fontWeight: 600 }}>{imp}</span>
            ))}
          </div>
          <p style={{ fontSize: 13, color: C.muted }}>
            Rejection drops to <strong style={{ color: C.success }}>{data.improvedProbability}%</strong>
            <span style={{ color: C.success, marginLeft: 8 }}>↓ {drop}% improvement</span>
          </p>
        </div>
      )}

      {/* Risk factors */}
      {data.factors?.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Risk Factors</div>
          {data.factors.map((f, i) => <FactorBar key={i} {...f} />)}
        </div>
      )}

      {/* Projects slider */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>Portfolio Projects: <span style={{ color: C.accent }}>{projects}</span></div>
        <input type="range" min={0} max={8} value={projects} onChange={e => setProjects(+e.target.value)}
          style={{ width: "100%", accentColor: C.accent }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 4 }}>
          <span>0 projects</span><span>8 projects</span>
        </div>
      </div>
    </div>
  );
}
