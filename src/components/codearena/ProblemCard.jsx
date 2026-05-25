import { useState } from "react";

const G = {
  card: "#1a2347", border: "#2d3a5f", accent: "#ff6b9d", purple: "#c084fc",
  text: "#f0f4ff", muted: "#94a3b8", success: "#34d399", warning: "#fbbf24", danger: "#f87171",
};

const DIFF_CONFIG = {
  easy:   { color: G.success,  label: "Easy",   bg: "rgba(52,211,153,0.12)"  },
  medium: { color: G.warning,  label: "Medium", bg: "rgba(251,191,36,0.12)"  },
  hard:   { color: G.danger,   label: "Hard",   bg: "rgba(248,113,113,0.12)" },
};

export default function ProblemCard({ problem, isActive, onSelect }) {
  const [hov, setHov] = useState(false);
  const diff = DIFF_CONFIG[problem.difficulty] || DIFF_CONFIG.easy;
  const active = isActive || hov;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(problem)}
      style={{
        background: isActive ? "rgba(255,107,157,0.06)" : G.card,
        border: `1px solid ${isActive ? G.accent + "60" : hov ? G.accent + "40" : G.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hov && !isActive ? "translateX(4px)" : "translateX(0)",
        boxShadow: active ? `0 4px 20px rgba(255,107,157,0.12)` : "none",
        marginBottom: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {}
      {isActive && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
          background: `linear-gradient(180deg, ${G.accent}, ${G.purple})`,
          borderRadius: "3px 0 0 3px",
        }} />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1, paddingLeft: isActive ? 8 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {problem.solved && (
              <span style={{ fontSize: 12, color: G.success }}>✓</span>
            )}
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14, fontWeight: 600, color: G.text,
            }}>
              {problem.id}. {problem.title}
            </span>
          </div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: diff.color,
          background: diff.bg, border: `1px solid ${diff.color}30`,
          borderRadius: 20, padding: "2px 10px", flexShrink: 0, marginLeft: 8,
        }}>
          {diff.label}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {problem.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: 10, color: G.muted,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: "2px 8px",
            }}>
              {tag}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 11, color: G.muted, flexShrink: 0, marginLeft: 8 }}>
          {problem.acceptance}% accepted
        </span>
      </div>
    </div>
  );
}
