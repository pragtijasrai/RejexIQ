import { useState, useEffect, useRef } from "react";
import TestCasePanel from "./TestCasePanel.jsx";

const G = {
  bg: "#0a0e27", surface: "#141b3a", card: "#1a2347", border: "#2d3a5f",
  accent: "#ff6b9d", purple: "#c084fc", cyan: "#22d3ee",
  text: "#f0f4ff", muted: "#94a3b8", success: "#34d399", warning: "#fbbf24", danger: "#f87171",
};

const DIFF_CONFIG = {
  easy:   { color: G.success,  label: "Easy"   },
  medium: { color: G.warning,  label: "Medium" },
  hard:   { color: G.danger,   label: "Hard"   },
};

const LANGUAGES = ["JavaScript", "Python", "Java", "C++", "TypeScript"];

const DEFAULT_STARTERS = {
  JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solve(nums, target) {
  // Your solution here
  
}`,
  Python: `class Solution:
    def solve(self, nums: list[int], target: int) -> list[int]:
        # Your solution here
        pass`,
  Java: `class Solution {
    public int[] solve(int[] nums, int target) {
        // Your solution here
        return new int[]{};
    }
}`,
  "C++": `class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        // Your solution here
        return {};
    }
};`,
  TypeScript: `function solve(nums: number[], target: number): number[] {
    // Your solution here
    return [];
}`,
};

// Syntax-highlighted code display (Monaco-style placeholder)
function CodeDisplay({ code, language }) {
  const keywords = ["function", "return", "const", "let", "var", "if", "else", "for", "while", "class", "def", "int", "void", "public", "vector", "new"];
  const lines = code.split("\n");

  function colorize(line) {
    // Simple tokenizer for visual effect
    let result = [];
    let remaining = line;
    let key = 0;

    // Comments
    if (remaining.trimStart().startsWith("//") || remaining.trimStart().startsWith("#")) {
      return [<span key={0} style={{ color: "#64748b", fontStyle: "italic" }}>{line}</span>];
    }
    if (remaining.trimStart().startsWith("*") || remaining.trimStart().startsWith("/**") || remaining.trimStart().startsWith("*/")) {
      return [<span key={0} style={{ color: "#64748b", fontStyle: "italic" }}>{line}</span>];
    }

    // Tokenize
    const tokens = remaining.split(/(\b\w+\b|[{}()\[\];,.]|"[^"]*"|'[^']*')/g);
    return tokens.map((tok, i) => {
      if (!tok) return null;
      if (keywords.includes(tok)) return <span key={i} style={{ color: "#c084fc" }}>{tok}</span>;
      if (/^[0-9]+$/.test(tok)) return <span key={i} style={{ color: "#fbbf24" }}>{tok}</span>;
      if (/^["']/.test(tok)) return <span key={i} style={{ color: "#34d399" }}>{tok}</span>;
      if (/^[A-Z]/.test(tok)) return <span key={i} style={{ color: "#22d3ee" }}>{tok}</span>;
      if (/^[{}()\[\]]$/.test(tok)) return <span key={i} style={{ color: "#ff6b9d" }}>{tok}</span>;
      return <span key={i} style={{ color: "#f0f4ff" }}>{tok}</span>;
    });
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Line numbers */}
      <div style={{
        padding: "16px 0", minWidth: 44, textAlign: "right",
        borderRight: `1px solid ${G.border}`, userSelect: "none",
        background: "rgba(0,0,0,0.2)",
      }}>
        {lines.map((_, i) => (
          <div key={i} style={{
            padding: "0 12px", lineHeight: "22px",
            fontSize: 12, color: "#3d4f6e",
            fontFamily: "'Fira Code', monospace",
          }}>
            {i + 1}
          </div>
        ))}
      </div>
      {/* Code */}
      <div style={{ flex: 1, padding: "16px 20px", overflowX: "auto" }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            lineHeight: "22px", fontSize: 13,
            fontFamily: "'Fira Code', monospace",
            whiteSpace: "pre",
          }}>
            {colorize(line)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditorPanel({ problem }) {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(DEFAULT_STARTERS["JavaScript"]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [hint, setHint] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [problem?.id]);

  useEffect(() => {
    setSeconds(0);
    setRunResult(null);
    setCode(DEFAULT_STARTERS[language] || DEFAULT_STARTERS["JavaScript"]);
  }, [problem?.id]);

  useEffect(() => {
    setCode(DEFAULT_STARTERS[language] || DEFAULT_STARTERS["JavaScript"]);
  }, [language]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  function handleRun() {
    setRunning(true);
    setRunResult(null);
    setTimeout(() => {
      setRunning(false);
      setRunResult({
        passed: true,
        runtime: Math.floor(Math.random() * 80 + 40),
        memory: (Math.random() * 5 + 38).toFixed(1),
        outputs: problem?.testCases?.map(tc => ({ value: tc.expected, passed: true })) || [],
        logs: [{ type: "log", msg: "Running test cases..." }, { type: "log", msg: "All test cases passed ✓" }],
      });
    }, 1400);
  }

  function handleSubmit() {
    setRunning(true);
    setRunResult(null);
    setTimeout(() => {
      setRunning(false);
      setRunResult({
        passed: true,
        runtime: Math.floor(Math.random() * 60 + 30),
        memory: (Math.random() * 4 + 38).toFixed(1),
        outputs: problem?.testCases?.map(tc => ({ value: tc.expected, passed: true })) || [],
        logs: [{ type: "log", msg: "Submitted successfully" }, { type: "log", msg: "Runtime: beats 94% of submissions" }],
      });
    }, 2000);
  }

  function handleHint() {
    setShowHint(true);
    setHintLoading(true);
    setTimeout(() => {
      setHintLoading(false);
      setHint(problem?.hint || "Try using a hash map to store values you've seen. For each element, check if its complement exists in the map.");
    }, 1200);
  }

  const diff = DIFF_CONFIG[problem?.difficulty] || DIFF_CONFIG.easy;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{
        background: G.surface, border: `1px solid ${G.border}`,
        borderRadius: 16, padding: "14px 18px", marginBottom: 12,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 15, fontWeight: 700, color: G.text,
          }}>
            {problem?.id}. {problem?.title}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: diff.color,
            background: `${diff.color}15`, border: `1px solid ${diff.color}30`,
            borderRadius: 20, padding: "3px 10px",
          }}>
            {diff.label}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Timer */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,0,0,0.3)", border: `1px solid ${G.border}`,
            borderRadius: 20, padding: "5px 12px",
          }}>
            <span style={{ fontSize: 12 }}>⏱</span>
            <span style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 13, color: seconds > 1800 ? G.danger : G.text,
            }}>
              {formatTime(seconds)}
            </span>
          </div>

          {/* Language selector */}
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              background: G.card, border: `1px solid ${G.border}`,
              borderRadius: 8, padding: "6px 12px",
              color: G.text, fontSize: 12, outline: "none", cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Editor */}
      <div style={{
        flex: 1, background: "#0d1117",
        border: `1px solid ${G.border}`,
        borderRadius: 16, overflow: "hidden",
        boxShadow: `0 0 0 1px rgba(255,107,157,0.08), 0 8px 32px rgba(0,0,0,0.4)`,
        minHeight: 280,
        position: "relative",
      }}>
        {/* Editor glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${G.accent}40, transparent)`,
        }} />

        {/* Editable textarea overlay */}
        <div style={{ position: "relative", height: "100%", minHeight: 280 }}>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              background: "transparent", border: "none", outline: "none",
              color: "transparent", caretColor: G.accent,
              fontFamily: "'Fira Code', monospace", fontSize: 13,
              lineHeight: "22px", padding: "16px 20px 16px 64px",
              resize: "none", zIndex: 2,
            }}
          />
          <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden" }}>
            <CodeDisplay code={code} language={language} />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button
          onClick={handleRun}
          disabled={running}
          style={{
            background: running ? "rgba(34,211,238,0.1)" : "rgba(34,211,238,0.15)",
            border: `1px solid ${G.cyan}40`,
            borderRadius: 10, padding: "10px 20px",
            color: G.cyan, fontSize: 13, fontWeight: 600,
            cursor: running ? "not-allowed" : "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 6,
          }}
          onMouseEnter={e => { if (!running) { e.currentTarget.style.background = "rgba(34,211,238,0.25)"; e.currentTarget.style.boxShadow = `0 4px 16px rgba(34,211,238,0.2)`; } }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,211,238,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {running ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> : "▶"}
          {running ? "Running..." : "Run Code"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={running}
          style={{
            background: running ? "rgba(255,107,157,0.1)" : `linear-gradient(135deg, ${G.accent}, ${G.purple})`,
            border: "none", borderRadius: 10, padding: "10px 24px",
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: running ? "not-allowed" : "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            transition: "all 0.2s",
            boxShadow: running ? "none" : `0 4px 16px rgba(255,107,157,0.3)`,
          }}
          onMouseEnter={e => { if (!running) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(255,107,157,0.5)`; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 16px rgba(255,107,157,0.3)`; }}
        >
          🚀 Submit
        </button>

        <button
          onClick={handleHint}
          style={{
            background: "rgba(192,132,252,0.12)",
            border: `1px solid ${G.purple}40`,
            borderRadius: 10, padding: "10px 18px",
            color: G.purple, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
            transition: "all 0.2s", marginLeft: "auto",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(192,132,252,0.22)"; e.currentTarget.style.boxShadow = `0 4px 16px rgba(192,132,252,0.2)`; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(192,132,252,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          🤖 AI Hint
        </button>
      </div>

      {/* AI Hint panel */}
      {showHint && (
        <div style={{
          marginTop: 10, background: "rgba(192,132,252,0.08)",
          border: `1px solid ${G.purple}30`, borderRadius: 12, padding: "14px 16px",
          animation: "fadeUp 0.3s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: G.purple }}>🤖 AI Hint</span>
            <button onClick={() => setShowHint(false)} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
          {hintLoading ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: G.purple,
                  animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
              <span style={{ fontSize: 12, color: G.muted, marginLeft: 4 }}>Thinking...</span>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: G.text, lineHeight: 1.6, margin: 0 }}>{hint}</p>
          )}
        </div>
      )}

      {/* Test cases */}
      <TestCasePanel problem={problem} runResult={runResult} />
    </div>
  );
}
