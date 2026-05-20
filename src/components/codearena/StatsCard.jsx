import { useState } from "react";

const G = {
  bg: "#0a0e27", surface: "#141b3a", card: "#1a2347", border: "#2d3a5f",
  accent: "#ff6b9d", purple: "#c084fc", cyan: "#22d3ee",
  text: "#f0f4ff", muted: "#94a3b8", success: "#34d399", warning: "#fbbf24"
};

export default function StatsCard({ icon, label, value, sub, color, progress, rank }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: G.card,
        border: `1px solid ${hov ? color + "60" : G.border}`,
        borderRadius: 20,
        padding: "20px 22px",
        cursor: "default",
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 12px 40px ${color}25, 0 0 0 1px ${color}20` : "0 4px 20px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80,
        background: color, borderRadius: "50%", opacity: hov ? 0.12 : 0.06,
        filter: "blur(20px)", transition: "opacity 0.3s",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>
          {icon}
        </div>
        {rank && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: G.warning,
            background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)",
            borderRadius: 20, padding: "3px 10px", letterSpacing: 0.5,
          }}>
            {rank}
          </span>
        )}
      </div>

      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 28, fontWeight: 800, color, marginBottom: 2,
        textShadow: hov ? `0 0 20px ${color}60` : "none", transition: "text-shadow 0.3s",
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: G.muted, marginBottom: sub || progress ? 12 : 0 }}>{label}</div>

      {sub && (
        <div style={{ fontSize: 11, color: G.muted, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {sub.map((s, i) => (
            <span key={i} style={{
              background: `${s.color}15`, color: s.color,
              border: `1px solid ${s.color}30`, borderRadius: 20,
              padding: "2px 8px", fontWeight: 600,
            }}>
              {s.label}: {s.val}
            </span>
          ))}
        </div>
      )}

      {progress !== undefined && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: G.muted, marginBottom: 4 }}>
            <span>Progress</span>
            <span style={{ color }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: `linear-gradient(90deg, ${color}, ${color}aa)`,
              borderRadius: 2, boxShadow: `0 0 8px ${color}80`,
              transition: "width 1s ease",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
