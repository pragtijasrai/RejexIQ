import { useState, useEffect } from "react";
import { calculateTime } from "./careerApi";

const C = {
  card: "#141b3a", border: "rgba(255,255,255,0.07)", accent: "#00e5ff",
  purple: "#c084fc", success: "#10b981", danger: "#ef4444",
  warning: "#f59e0b", text: "#f0f4ff", muted: "#64748b"
};

function MonthsDisplay({ months }) {
  const color = months <= 2 ? C.success : months <= 5 ? C.warning : C.danger;
  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 64, fontWeight: 900, color, lineHeight: 1, filter: `drop-shadow(0 0 20px ${color}60)`, transition: "all 0.5s ease" }}>
        {months}
      </div>
      <div style={{ fontSize: 16, color: C.muted, marginTop: 4 }}>months to job-ready</div>
    </div>
  );
}

function ScenarioBar({ hours, months, isActive }) {
  const color = hours === 1 ? C.danger : hours === 2 ? C.warning : hours === 3 ? C.accent : C.success;
  const maxMonths = 12;
  const pct = Math.min(100, (months / maxMonths) * 100);
  return (
    <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: isActive ? `${color}10` : "transparent", border: `1px solid ${isActive ? color : C.border}`, transition: "all 0.3s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{hours === 1 ? "🐢" : hours === 2 ? "🚶" : hours === 3 ? "🏃" : "🚀"}</span>
          <span style={{ fontSize: 13, color: C.text, fontWeight: isActive ? 700 : 400 }}>{hours}h/day</span>
          {isActive && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 8, background: `${color}20`, color, fontWeight: 700 }}>CURRENT</span>}
        </div>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 800, color }}>{months}mo</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${100 - pct}%`, background: color, borderRadius: 2, transition: "width 0.8s ease", boxShadow: `0 0 6px ${color}60` }} />
      </div>
    </div>
  );
}

export default function TimeEstimator({ user, selectedRole }) {
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [projects, setProjects] = useState(user?.projects || 1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    calculateTime(user?.skills || {}, projects, selectedRole, hoursPerDay)
      .then(setData).catch(console.error).finally(() => setLoading(false));
  }, [selectedRole, hoursPerDay, projects, user?.skills]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (!data) return null;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Main display */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Time to Job-Ready</div>
        <MonthsDisplay months={data.months} />
        <p style={{ textAlign: "center", color: C.muted, fontSize: 13 }}>
          ~{data.totalHours} total study hours at <strong style={{ color: C.accent }}>{hoursPerDay}h/day</strong>
        </p>
      </div>

      {/* Hours slider */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>
          Daily Study Time: <span style={{ color: C.accent }}>{hoursPerDay} hour{hoursPerDay > 1 ? "s" : ""}/day</span>
        </div>
        <input type="range" min={1} max={4} step={1} value={hoursPerDay} onChange={e => setHoursPerDay(+e.target.value)}
          style={{ width: "100%", accentColor: C.accent }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 4 }}>
          {["1h","2h","3h","4h"].map(l => <span key={l}>{l}</span>)}
        </div>
      </div>

      {/* Scenarios */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Study Pace Comparison</div>
        {data.scenarios?.map(s => (
          <ScenarioBar key={s.hoursPerDay} hours={s.hoursPerDay} months={s.months} isActive={s.hoursPerDay === hoursPerDay} />
        ))}
      </div>

      {/* Breakdown */}
      {data.breakdown?.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Time Breakdown</div>
          {data.breakdown.map((b, i) => {
            const pct = Math.min(100, (b.hoursNeeded / data.totalHours) * 100);
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: C.text }}>{b.skill}</span>
                  <span style={{ color: C.accent, fontWeight: 600 }}>{b.hoursNeeded}h</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${C.accent},${C.purple})`, borderRadius: 2, transition: "width 0.8s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
