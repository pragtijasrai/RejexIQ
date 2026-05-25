import { useState, useEffect } from "react";
import { getSimulation, evaluateSimulation } from "./careerApi";

const C = {
  bg: "#0a0e27", surface: "#111827", card: "#141b3a",
  border: "rgba(255,255,255,0.07)", accent: "#00e5ff",
  purple: "#c084fc", success: "#10b981", danger: "#ef4444",
  warning: "#f59e0b", text: "#f0f4ff", muted: "#64748b"
};

function TaskCard({ task, index, selected, onSelect, revealed, result }) {
  return (
    <div style={{ marginBottom: 28, animation: `slideIn 0.4s ease ${index * 0.1}s both` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: revealed && result?.correct ? `${C.success}20` : revealed ? `${C.danger}20` : `${C.accent}15`, border: `1px solid ${revealed && result?.correct ? C.success : revealed ? C.danger : C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: revealed && result?.correct ? C.success : revealed ? C.danger : C.accent, flexShrink: 0 }}>
          {revealed ? (result?.correct ? "✓" : "✗") : index + 1}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{task.title}</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{task.description}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 38 }}>
        {task.choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isCorrectRevealed = revealed && result?.choiceText === choice.text && result?.correct;
          const isWrongRevealed = revealed && isSelected && !result?.correct;
          let borderColor = C.border;
          let bg = "transparent";
          if (isSelected && !revealed) { borderColor = C.accent; bg = `${C.accent}10`; }
          if (isCorrectRevealed) { borderColor = C.success; bg = `${C.success}12`; }
          if (isWrongRevealed) { borderColor = C.danger; bg = `${C.danger}12`; }

          return (
            <button key={choice.id} onClick={() => !revealed && onSelect(task.id, choice.id)}
              style={{ textAlign: "left", padding: "12px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: bg, color: C.text, cursor: revealed ? "default" : "pointer", fontSize: 13, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: borderColor, flexShrink: 0 }}>
                {choice.id.toUpperCase()}
              </span>
              {choice.text}
            </button>
          );
        })}
      </div>

      {revealed && result && (
        <div style={{ marginTop: 12, paddingLeft: 38, padding: "12px 16px 12px 38px", background: result.correct ? `${C.success}08` : `${C.danger}08`, borderLeft: `3px solid ${result.correct ? C.success : C.danger}`, borderRadius: "0 8px 8px 0", marginLeft: 38 }}>
          <div style={{ fontSize: 12, color: result.correct ? C.success : C.danger, fontWeight: 700, marginBottom: 4 }}>
            {result.correct ? `✅ +${result.xp} XP` : `❌ ${result.xp} XP`}
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{result.feedback}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {Object.entries(result.skillImpact || {}).map(([skill, delta]) => (
              <span key={skill} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: delta > 0 ? `${C.success}20` : `${C.danger}20`, color: delta > 0 ? C.success : C.danger, fontWeight: 600 }}>
                {skill} {delta > 0 ? `+${delta}` : delta}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultScreen({ result, roleLabel, onRetry, onClose }) {
  const pct = Math.round((result.correctCount / result.totalTasks) * 100);
  const perfColor = result.performance === "Excellent" ? C.success : result.performance === "Good" ? C.warning : C.danger;
  return (
    <div style={{ textAlign: "center", padding: "32px 0", animation: "fadeUp 0.5s ease" }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>
        {result.performance === "Excellent" ? "🏆" : result.performance === "Good" ? "👍" : "📚"}
      </div>
      <div style={{ fontSize: 13, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Simulation Complete</div>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 900, color: perfColor, marginBottom: 4 }}>{result.performance}</h2>
      <p style={{ color: C.muted, marginBottom: 28 }}>{result.correctCount}/{result.totalTasks} tasks handled correctly as {roleLabel}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 400, margin: "0 auto 28px" }}>
        {[
          { label: "XP Earned", value: result.totalXp > 0 ? `+${result.totalXp}` : result.totalXp, color: C.warning, icon: "⭐" },
          { label: "Score", value: `${pct}%`, color: perfColor, icon: "🎯" },
          { label: "Tasks", value: `${result.correctCount}/${result.totalTasks}`, color: C.accent, icon: "✅" }
        ].map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 10px" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {}
      {Object.keys(result.skillDeltas).length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", maxWidth: 400, margin: "0 auto 24px", textAlign: "left" }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Skill Impact</div>
          {Object.entries(result.skillDeltas).map(([skill, delta]) => (
            <div key={skill} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: C.text }}>{skill}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: delta > 0 ? C.success : C.danger }}>{delta > 0 ? `+${delta}` : delta} pts</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={onRetry} style={{ padding: "10px 24px", borderRadius: 20, border: `1px solid ${C.accent}`, background: `${C.accent}15`, color: C.accent, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Try Again</button>
        <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 20, border: "none", background: `linear-gradient(135deg,${C.accent},${C.purple})`, color: "#0a0e27", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Back to Dashboard</button>
      </div>
    </div>
  );
}

export default function JobSimulator({ user, selectedRole, onClose }) {
  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true); setAnswers({}); setSubmitted(false); setResult(null);
    getSimulation(selectedRole)
      .then(d => setSim(d.simulation))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedRole]);

  async function handleSubmit() {
    if (Object.keys(answers).length < sim.tasks.length) return;
    setSubmitting(true);
    try {
      const res = await evaluateSimulation(selectedRole, answers);
      setResult(res);
      setSubmitted(true);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  }

  const allAnswered = sim && Object.keys(answers).length === sim.tasks.length;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (!sim) return <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Simulation not available for this role.</div>;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      <div style={{ display: submitted ? "grid" : "block", gridTemplateColumns: submitted ? "1fr 1fr" : "1fr", gap: 32, alignItems: "start" }}>
        <div style={{ maxWidth: submitted ? "none" : 720 }}>
          {}
          <div style={{ background: `linear-gradient(135deg,${C.card},${C.surface})`, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Job Simulation</div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6 }}>{sim.title}</h3>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{sim.context}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: `${C.accent}15`, color: C.accent, fontWeight: 600 }}>{sim.tasks.length} Tasks</span>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: `${C.warning}15`, color: C.warning, fontWeight: 600 }}>Real Scenarios</span>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: `${C.success}15`, color: C.success, fontWeight: 600 }}>XP Rewards</span>
            </div>
          </div>

          {}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6 }}>
              <span>Progress</span>
              <span>{Object.keys(answers).length}/{sim.tasks.length} answered</span>
            </div>
            <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(Object.keys(answers).length / sim.tasks.length) * 100}%`, background: `linear-gradient(90deg,${C.accent},${C.purple})`, borderRadius: 2, transition: "width 0.4s ease" }} />
            </div>
          </div>

          {}
          {sim.tasks.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i}
              selected={answers[task.id]}
              onSelect={(taskId, choiceId) => setAnswers(prev => ({ ...prev, [taskId]: choiceId }))}
              revealed={submitted} result={result?.taskResults?.find(r => r.taskId === task.id) || null} />
          ))}

          {!submitted && (
            <button onClick={handleSubmit} disabled={!allAnswered || submitting}
              style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: allAnswered ? `linear-gradient(135deg,${C.accent},${C.purple})` : C.border, color: allAnswered ? "#0a0e27" : C.muted, fontWeight: 800, fontSize: 15, cursor: allAnswered ? "pointer" : "not-allowed", fontFamily: "'Space Grotesk',sans-serif", transition: "all 0.2s", marginTop: 8 }}>
              {submitting ? "Evaluating..." : allAnswered ? "Submit & See Results →" : `Answer all ${sim.tasks.length} tasks to continue`}
            </button>
          )}
        </div>

        {submitted && (
          <div style={{ position: "sticky", top: 24, padding: "24px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 }}>
            <ResultScreen result={result} roleLabel={sim.title} onRetry={() => { setAnswers({}); setSubmitted(false); setResult(null); }} onClose={onClose} />
          </div>
        )}
      </div>
    </div>
  );
}
