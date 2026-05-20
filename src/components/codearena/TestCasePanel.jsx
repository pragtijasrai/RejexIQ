import { useState } from "react";

const G = {
  card: "#1a2347", surface: "#141b3a", border: "#2d3a5f",
  accent: "#ff6b9d", purple: "#c084fc", cyan: "#22d3ee",
  text: "#f0f4ff", muted: "#94a3b8", success: "#34d399", danger: "#f87171",
};

const TABS = ["Test Cases", "Output", "Console"];

export default function TestCasePanel({ problem, runResult }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{
      background: G.surface,
      border: `1px solid ${G.border}`,
      borderRadius: 16,
      overflow: "hidden",
      marginTop: 12,
    }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", borderBottom: `1px solid ${G.border}`,
        background: "rgba(0,0,0,0.2)",
      }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "10px 18px",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${activeTab === i ? G.accent : "transparent"}`,
              color: activeTab === i ? G.accent : G.muted,
              fontSize: 13,
              fontWeight: activeTab === i ? 600 : 400,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px", minHeight: 120 }}>
        {activeTab === 0 && (
          <div>
            {(problem?.testCases || []).map((tc, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: G.muted, marginBottom: 6, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  Case {i + 1}
                </div>
                <div style={{
                  background: "rgba(0,0,0,0.3)", borderRadius: 8,
                  padding: "10px 14px", fontFamily: "'Fira Code', monospace",
                  fontSize: 12, color: G.text, lineHeight: 1.7,
                }}>
                  {Object.entries(tc.input).map(([k, v]) => (
                    <div key={k}>
                      <span style={{ color: G.cyan }}>{k}</span>
                      <span style={{ color: G.muted }}> = </span>
                      <span style={{ color: G.accent }}>{JSON.stringify(v)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 6, fontSize: 11, color: G.muted }}>Expected:</div>
                <div style={{
                  background: "rgba(0,0,0,0.3)", borderRadius: 8,
                  padding: "8px 14px", fontFamily: "'Fira Code', monospace",
                  fontSize: 12, color: G.success, marginTop: 4,
                }}>
                  {JSON.stringify(tc.expected)}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div>
            {runResult ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: runResult.passed ? G.success : G.danger,
                    background: runResult.passed ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
                    border: `1px solid ${runResult.passed ? G.success + "40" : G.danger + "40"}`,
                    borderRadius: 20, padding: "4px 14px",
                    boxShadow: runResult.passed ? `0 0 12px rgba(52,211,153,0.3)` : "none",
                  }}>
                    {runResult.passed ? "✓ Accepted" : "✗ Wrong Answer"}
                  </span>
                  <span style={{ fontSize: 11, color: G.muted }}>{runResult.runtime} ms</span>
                  <span style={{ fontSize: 11, color: G.muted }}>{runResult.memory} MB</span>
                </div>
                {runResult.outputs?.map((out, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: G.muted, marginBottom: 4 }}>Case {i + 1}:</div>
                    <div style={{
                      background: "rgba(0,0,0,0.3)", borderRadius: 8,
                      padding: "8px 14px", fontFamily: "'Fira Code', monospace",
                      fontSize: 12, color: out.passed ? G.success : G.danger,
                    }}>
                      {JSON.stringify(out.value)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: G.muted, fontSize: 13, textAlign: "center", paddingTop: 20 }}>
                Run your code to see output here
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div style={{
            fontFamily: "'Fira Code', monospace", fontSize: 12,
            color: G.muted, lineHeight: 1.8,
          }}>
            {runResult?.logs?.length ? (
              runResult.logs.map((log, i) => (
                <div key={i} style={{ color: log.type === "error" ? G.danger : G.text }}>
                  <span style={{ color: G.muted, marginRight: 8 }}>&gt;</span>{log.msg}
                </div>
              ))
            ) : (
              <div style={{ color: G.muted, textAlign: "center", paddingTop: 20 }}>
                Console output will appear here
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
