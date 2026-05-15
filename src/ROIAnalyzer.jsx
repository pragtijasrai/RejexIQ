import { useState, useEffect } from "react";
import { calculateROI } from "./careerApi";

const C = {
  card: "#141b3a", border: "rgba(255,255,255,0.07)", accent: "#00e5ff",
  purple: "#c084fc", success: "#10b981", danger: "#ef4444",
  warning: "#f59e0b", text: "#f0f4ff", muted: "#64748b"
};

const SKILL_ICONS = {
  JavaScript: "⚡", React: "⚛️", CSS: "🎨", DSA: "🌳",
  SystemDesign: "🏗️", Communication: "💬", Python: "🐍"
};

function ROIBar({ skill, currentScore, readinessDelta, hoursRequired, rank, isTop }) {
  const maxDelta = 25;
  const pct = Math.min(100, (readinessDelta / maxDelta) * 100);
  const color = isTop ? C.success : readinessDelta > 8 ? C.accent : readinessDelta > 4 ? C.warning : C.muted;

  return (
    <div style={{ padding: "14px 16px", borderRadius: 12, background: isTop ? `${C.success}08` : "transparent", border: `1px solid ${isTop ? C.success + "40" : C.border}`, marginBottom: 10, transition: "all 0.3s", animation: `slideIn 0.4s ease ${rank * 0.06}s both` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{SKILL_ICONS[skill] || "📊"}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: isTop ? 700 : 500, color: C.text }}>{skill}</div>
            <div style={{ fontSize: 11, color: C.muted }}>Current: {currentScore}/100</div>
          </div>
          {isTop && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: `${C.success}20`, color: C.success, fontWeight: 700 }}>BEST ROI</span>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color }}>+{readinessDelta}%</div>
          <div style={{ fontSize: 11, color: C.muted }}>{hoursRequired}h to learn</div>
        </div>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}aa)`, borderRadius: 3, transition: "width 0.9s ease", boxShadow: `0 0 8px ${color}50` }} />
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
        +20 pts in {skill} → readiness improves by <span style={{ color, fontWeight: 600 }}>{readinessDelta}%</span>
      </div>
    </div>
  );
}

export default function ROIAnalyzer({ user, selectedRole }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    calculateROI(user?.skills || {}, selectedRole)
      .then(setData).catch(console.error).finally(() => setLoading(false));
  }, [selectedRole, user?.skills]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <div style={{ width: 32, height: 32, border: `3px solid rgba(255,255,255,0.07)`, borderTop: `3px solid #00e5ff`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const top = data[0];

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
      `}</style>

      {/* Top recommendation */}
      {top && (
        <div style={{ background: `linear-gradient(135deg,${C.success}12,${C.accent}08)`, border: `1px solid ${C.success}40`, borderRadius: 16, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.success, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>🎯 Best ROI Recommendation</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>
            Improve {SKILL_ICONS[top.skill]} {top.skill} first
          </div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
            Adding 20 points to <strong style={{ color: C.success }}>{top.skill}</strong> gives you the highest readiness boost of <strong style={{ color: C.success }}>+{top.readinessDelta}%</strong> — more than any other skill right now.
          </p>
        </div>
      )}

      {/* All skills ranked */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Skill ROI Ranking (per +20 pts)</div>
        {data.map((item, i) => (
          <ROIBar key={item.skill} {...item} rank={i} isTop={i === 0} />
        ))}
      </div>
    </div>
  );
}
