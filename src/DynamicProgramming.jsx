import { useState, useRef, useEffect } from "react";

const styles = `
.dp-root { font-family: var(--font-sans, sans-serif); }
.dp-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.dp-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.dp-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.dp-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.dp-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes dpFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.dp-sec { animation: dpFade .2s ease; }
.dp-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.dp-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.dp-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.dp-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.dp-ul { padding-left: 18px; margin: 6px 0; }
.dp-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.dp-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; }
.dp-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.dp-btn:hover { background: var(--color-background-secondary); }
.dp-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.dp-btn.primary:hover { opacity: .85; }
.dp-btn:disabled { opacity: .4; cursor: default; }
.dp-inp { width: 80px; padding: 6px 10px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); }
.dp-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.dp-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.dp-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.dp-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.dp-tbl tr:hover td { background: var(--color-background-secondary); }
.dp-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.dp-info p { color: var(--color-text-info); font-size: 13px; }
.dp-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.dp-cell { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 6px; border: 1.5px solid var(--color-border-secondary); font-size: 14px; font-weight: 600; margin: 2px; background: var(--color-background-primary); color: var(--color-text-primary); transition: all .3s; }
.dp-cell.filled { background: rgba(186,220,88,0.2); border-color: #badc58; color: var(--color-text-primary); }
.dp-cell.current { background: #badc58; border-color: #badc58; color: #333; }
.dp-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.dp-quiz-opt:hover { background: var(--color-background-secondary); }
.dp-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.dp-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
.dp-dot-row { display: flex; justify-content: center; gap: 6px; padding: 16px 0 8px; }
.dp-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-border-secondary); cursor: pointer; transition: all .2s; }
.dp-dot.on { background: var(--color-text-primary); transform: scale(1.3); }
.dp-nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 0.5px solid var(--color-border-tertiary); margin-top: 24px; }
`;

// ── Chapter 1: Introduction ──
function SecIntro() {
  return (
    <div className="dp-sec">
      <span className="dp-tag tag-blue">Foundation</span>
      <div className="dp-h2">Dynamic Programming</div>
      <p className="dp-p">DP solves problems by breaking them into <strong>overlapping subproblems</strong> and storing results to avoid recomputation. Two key properties:</p>
      <div className="dp-viz">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{background:"var(--color-background-primary)",borderRadius:8,padding:12,border:"1.5px solid var(--color-border-info)"}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--color-text-info)",marginBottom:6}}>Overlapping Subproblems</div>
            <p style={{fontSize:13,color:"var(--color-text-secondary)"}}>The same subproblems are solved multiple times. DP stores results (memoization/tabulation) to avoid redundant work.</p>
          </div>
          <div style={{background:"var(--color-background-primary)",borderRadius:8,padding:12,border:"1.5px solid var(--color-border-success)"}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--color-text-success)",marginBottom:6}}>Optimal Substructure</div>
            <p style={{fontSize:13,color:"var(--color-text-secondary)"}}>The optimal solution to the problem can be constructed from optimal solutions to its subproblems.</p>
          </div>
        </div>
      </div>
      <div className="dp-h3">Memoization vs Tabulation</div>
      <table className="dp-tbl">
        <thead><tr><th>Property</th><th>Memoization (Top-Down)</th><th>Tabulation (Bottom-Up)</th></tr></thead>
        <tbody>
          <tr><td>Approach</td><td>Recursive + cache</td><td>Iterative, fill table</td></tr>
          <tr><td>Order</td><td>Computes only needed subproblems</td><td>Computes all subproblems</td></tr>
          <tr><td>Space</td><td>O(n) + call stack</td><td>O(n) table only</td></tr>
          <tr><td>Speed</td><td>Slightly slower (recursion overhead)</td><td>Usually faster</td></tr>
        </tbody>
      </table>
      <div className="dp-info"><p>DP vs Greedy: DP considers ALL choices and picks the best. Greedy makes one locally optimal choice. DP is always correct but slower.</p></div>
    </div>
  );
}

// ── Chapter 2: Fibonacci DP ──
const FIB_FULL = [0,1,1,2,3,5,8,13,21,34];

function SecFibonacci() {
  const [step, setStep] = useState(0);

  function nextStep() { setStep(s => Math.min(s+1, FIB_FULL.length)); }
  function reset() { setStep(0); }

  return (
    <div className="dp-sec">
      <span className="dp-tag tag-green">Interactive</span>
      <div className="dp-h2">Fibonacci DP Table</div>
      <p className="dp-p">Watch the DP table fill left to right. Each cell = sum of previous two.</p>
      <div className="dp-viz">
        <div style={{display:"flex",flexWrap:"wrap",gap:2,marginBottom:8}}>
          {FIB_FULL.map((v, i) => (
            <div key={i} className={`dp-cell${i < step ? (i === step-1 ? " current" : " filled") : ""}`}>
              {i < step ? v : "?"}
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:2,marginBottom:8}}>
          {FIB_FULL.map((_, i) => (
            <div key={i} style={{width:44,textAlign:"center",fontSize:10,color:"var(--color-text-tertiary)"}}>dp[{i}]</div>
          ))}
        </div>
        <div className="dp-status">
          {step === 0 ? "Press Step to fill the table"
            : step <= FIB_FULL.length
            ? `dp[${step-1}] = ${step <= 2 ? "base case" : `dp[${step-2}] + dp[${step-3}] = ${FIB_FULL[step-3]} + ${FIB_FULL[step-2]} = ${FIB_FULL[step-1]}`}`
            : "✓ Table complete!"}
        </div>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button className="dp-btn primary" onClick={nextStep} disabled={step >= FIB_FULL.length}>Step →</button>
        <button className="dp-btn" onClick={reset}>Reset</button>
      </div>
      <div className="dp-h3">Naive vs DP</div>
      <div className="dp-code">{`// Naive recursive — O(2ⁿ) — recomputes same values!
int fib(int n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2); // fib(3) computed many times!
}

// Memoization — O(n) time, O(n) space
int[] memo = new int[n+1];
int fibMemo(int n) {
  if (n <= 1) return n;
  if (memo[n] != 0) return memo[n]; // cached!
  return memo[n] = fibMemo(n-1) + fibMemo(n-2);
}

// Tabulation — O(n) time, O(n) space
int fibDP(int n) {
  int[] dp = new int[n+1];
  dp[0] = 0; dp[1] = 1;
  for (int i = 2; i <= n; i++)
    dp[i] = dp[i-1] + dp[i-2];
  return dp[n];
}

// Space-optimized — O(n) time, O(1) space
int fibOpt(int n) {
  int a = 0, b = 1;
  for (int i = 2; i <= n; i++) { int c = a+b; a=b; b=c; }
  return b;
}`}</div>
    </div>
  );
}

// ── Chapter 3: 0/1 Knapsack ──
function SecKnapsack() {
  const [weights] = useState([2,3,4,5]);
  const [values]  = useState([3,4,5,6]);
  const [capacity] = useState(5);
  const n = weights.length;
  const W = capacity;

  // Build DP table
  const dp = Array.from({length:n+1}, () => Array(W+1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i-1] <= w)
        dp[i][w] = Math.max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]]);
      else
        dp[i][w] = dp[i-1][w];
    }
  }

  return (
    <div className="dp-sec">
      <span className="dp-tag tag-amber">Algorithm</span>
      <div className="dp-h2">0/1 Knapsack</div>
      <p className="dp-p">Given items with weights and values, maximize value in a knapsack of capacity W. Each item can be taken (1) or not (0).</p>
      <div className="dp-h3">Items: weights={JSON.stringify(weights)}, values={JSON.stringify(values)}, capacity={W}</div>
      <div className="dp-viz" style={{overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",fontSize:12,fontFamily:"var(--font-mono)"}}>
          <thead>
            <tr>
              <th style={{padding:"4px 8px",background:"var(--color-background-primary)",color:"var(--color-text-tertiary)"}}>i\w</th>
              {Array.from({length:W+1},(_,w) => (
                <th key={w} style={{padding:"4px 8px",background:"var(--color-background-primary)",color:"var(--color-text-tertiary)"}}>{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <td style={{padding:"4px 8px",color:"var(--color-text-tertiary)",fontWeight:600}}>{i}</td>
                {row.map((v, w) => (
                  <td key={w} style={{
                    padding:"4px 8px",textAlign:"center",
                    background: (i===n&&w===W) ? "#badc58" : v>0 ? "rgba(186,220,88,0.1)" : "var(--color-background-primary)",
                    color: (i===n&&w===W) ? "#333" : "var(--color-text-primary)",
                    fontWeight: (i===n&&w===W) ? 700 : 400,
                    border:"1px solid var(--color-border-tertiary)"
                  }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="dp-status">Maximum value = dp[{n}][{W}] = {dp[n][W]}</p>
      </div>
      <div className="dp-code">{`int knapsack(int[] weights, int[] values, int W) {
  int n = weights.length;
  int[][] dp = new int[n+1][W+1];
  for (int i = 1; i <= n; i++) {
    for (int w = 0; w <= W; w++) {
      // Don't take item i
      dp[i][w] = dp[i-1][w];
      // Take item i (if it fits)
      if (weights[i-1] <= w)
        dp[i][w] = Math.max(dp[i][w],
          values[i-1] + dp[i-1][w - weights[i-1]]);
    }
  }
  return dp[n][W];
}
// Time: O(n*W)  |  Space: O(n*W)`}</div>
    </div>
  );
}

// ── Chapter 4: LCS ──
function SecLCS() {
  const s1 = "ABCBDAB", s2 = "BDCAB";
  const m = s1.length, n = s2.length;
  const dp = Array.from({length:m+1}, () => Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = s1[i-1] === s2[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);

  return (
    <div className="dp-sec">
      <span className="dp-tag tag-blue">Algorithm</span>
      <div className="dp-h2">Longest Common Subsequence</div>
      <p className="dp-p">LCS finds the longest sequence present in both strings (not necessarily contiguous). Classic DP problem.</p>
      <p className="dp-p">s1 = "{s1}", s2 = "{s2}" → LCS length = {dp[m][n]}</p>
      <div className="dp-viz" style={{overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",fontSize:11,fontFamily:"var(--font-mono)"}}>
          <thead>
            <tr>
              <th style={{padding:"3px 6px",color:"var(--color-text-tertiary)"}}></th>
              <th style={{padding:"3px 6px",color:"var(--color-text-tertiary)"}}>""</th>
              {s2.split("").map((c,j) => <th key={j} style={{padding:"3px 6px",color:"var(--color-text-info)"}}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <td style={{padding:"3px 6px",color:"var(--color-text-info)",fontWeight:600}}>{i===0?"\"\"":s1[i-1]}</td>
                {row.map((v, j) => (
                  <td key={j} style={{
                    padding:"3px 6px",textAlign:"center",
                    background: v>0 ? "rgba(186,220,88,0.1)" : "var(--color-background-primary)",
                    color:"var(--color-text-primary)",
                    border:"1px solid var(--color-border-tertiary)"
                  }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dp-code">{`int lcs(String s1, String s2) {
  int m = s1.length(), n = s2.length();
  int[][] dp = new int[m+1][n+1];
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (s1.charAt(i-1) == s2.charAt(j-1))
        dp[i][j] = dp[i-1][j-1] + 1;  // match!
      else
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}
// Time: O(m*n)  |  Space: O(m*n)`}</div>
    </div>
  );
}

// ── Chapter 5: Quiz ──
const QUIZ = [
  { q:"DP requires which two properties?", opts:["Greedy choice + optimal substructure","Overlapping subproblems + optimal substructure","Divide & conquer + memoization","Recursion + backtracking"], ans:1 },
  { q:"Memoization is a __ approach:", opts:["Bottom-up","Top-down","Greedy","Divide & conquer"], ans:1 },
  { q:"Time complexity of Fibonacci with DP:", opts:["O(2ⁿ)","O(n²)","O(n)","O(log n)"], ans:2 },
  { q:"0/1 Knapsack time complexity:", opts:["O(n)","O(n log n)","O(n*W)","O(2ⁿ)"], ans:2 },
  { q:"LCS of 'ABCD' and 'ACBD' has length:", opts:["2","3","4","1"], ans:1 },
  { q:"Tabulation fills the DP table:", opts:["Top-down","Bottom-up","Randomly","Recursively"], ans:1 },
];

function SecQuiz() {
  const [answers, setAnswers] = useState({});
  function pick(i, opt) { setAnswers({...answers, [i]: opt}); }
  return (
    <div className="dp-sec">
      <span className="dp-tag tag-red">Quiz</span>
      <div className="dp-h2">Test Your Knowledge</div>
      {QUIZ.map((q, i) => {
        const chosen = answers[i];
        const correct = chosen === q.ans;
        return (
          <div key={i} style={{marginBottom:16}}>
            <p className="dp-p" style={{fontWeight:500}}>{i+1}. {q.q}</p>
            {q.opts.map((opt, oi) => (
              <button key={oi} className={`dp-quiz-opt${chosen===oi?(correct?" correct":" wrong"):""}`}
                onClick={() => pick(i, oi)} disabled={chosen !== undefined}>
                {opt}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

const CHAPTERS = [
  { id:"intro", label:"Introduction", comp: SecIntro },
  { id:"fib",   label:"Fibonacci DP", comp: SecFibonacci },
  { id:"knap",  label:"0/1 Knapsack", comp: SecKnapsack },
  { id:"lcs",   label:"LCS",          comp: SecLCS },
  { id:"quiz",  label:"Quiz",         comp: SecQuiz },
];

export default function DynamicProgramming({ onPrev, onNext }) {
  const [ch, setCh] = useState(0);
  const Comp = CHAPTERS[ch].comp;
  return (
    <div className="dp-root">
      <style>{styles}</style>
      <div className="dp-wrap">
        <div className="dp-nav">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} className={`dp-nb${ch===i?" on":""}`} onClick={() => setCh(i)}>
              {i+1}. {c.label}
            </button>
          ))}
        </div>
        <Comp />
        <div className="dp-dot-row">
          {CHAPTERS.map((_, i) => <div key={i} className={`dp-dot${ch===i?" on":""}`} onClick={() => setCh(i)} />)}
        </div>
        <div className="dp-nav-bar">
          <button className="dp-btn" onClick={onPrev} disabled={!onPrev}>← Prev Topic</button>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Chapter {ch+1}/{CHAPTERS.length}</span>
          <button className="dp-btn primary" onClick={onNext} disabled={!onNext}>Next Topic →</button>
        </div>
      </div>
    </div>
  );
}
