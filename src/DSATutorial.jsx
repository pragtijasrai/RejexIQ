import { useState, useEffect } from "react";

const T = {
  bg: "#0a0a0f",
  bg2: "#111118",
  bg3: "#1a1a25",
  panel: "#12121c",
  border: "#2a2a3d",
  accent1: "#6c63ff",
  accent2: "#ff6b6b",
  accent3: "#43e97b",
  accent4: "#ffd166",
  accent5: "#4ecdc4",
  text: "#e8e8f0",
  textDim: "#9090a8",
  textBright: "#ffffff",
  codeBg: "#0d0d16",
};

const dsaCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=JetBrains+Mono:wght@300;400;600&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap');

  .dsa-root {
    background: ${T.bg};
    color: ${T.text};
    font-family: 'Crimson Pro', Georgia, serif;
    font-size: 18px;
    line-height: 1.75;
    min-height: 100vh;
  }
  .dsa-root * { box-sizing: border-box; }

  .dsa-hero {
    background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1e 40%, #13101e 100%);
    border-bottom: 1px solid ${T.border};
    padding: 60px 40px 50px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .dsa-hero::before {
    content:'';
    position:absolute; inset:0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,.18) 0%, transparent 70%);
    pointer-events:none;
  }
  .dsa-badge {
    display:inline-block;
    font-family:'JetBrains Mono', monospace;
    font-size:11px; letter-spacing:3px; text-transform:uppercase;
    color: ${T.accent1};
    border:1px solid rgba(108,99,255,.4);
    padding: 5px 16px; border-radius:20px;
    margin-bottom:24px;
  }
  .dsa-hero h1 {
    font-family:'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight:900; color: ${T.textBright};
    line-height:1.15; margin-bottom:16px;
  }
  .dsa-hero h1 span { color: ${T.accent1}; }
  .dsa-hero p { font-size:1rem; color: ${T.textDim}; max-width:600px; margin:0 auto 32px; }

  .dsa-toc { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; max-width:900px; margin:0 auto; }
  .dsa-pill {
    font-family:'JetBrains Mono',monospace; font-size:11px;
    letter-spacing:.5px; padding:7px 16px; border-radius:30px;
    border:1px solid ${T.border}; color:${T.textDim};
    text-decoration:none; cursor:pointer;
    background: rgba(255,255,255,.03);
    transition: all .2s;
  }
  .dsa-pill:hover { border-color:${T.accent1}; color:${T.accent1}; background:rgba(108,99,255,.08); }

  .dsa-container { max-width:960px; margin:0 auto; padding:0 24px 80px; }

  .dsa-part {
    margin: 70px 0 0;
    padding: 36px 40px;
    border-radius:16px;
    position:relative; overflow:hidden;
  }
  .dsa-part.algo {
    background: linear-gradient(135deg, rgba(108,99,255,.15), rgba(78,205,196,.08));
    border: 1px solid rgba(108,99,255,.3);
  }
  .dsa-part.java {
    background: linear-gradient(135deg, rgba(255,107,107,.15), rgba(255,209,102,.08));
    border: 1px solid rgba(255,107,107,.3);
  }
  .dsa-part-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${T.textDim}; margin-bottom:8px; }
  .dsa-part h2 { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; color:${T.textBright}; }

  .dsa-section { margin-top:52px; }
  .dsa-section-title {
    font-family:'Playfair Display',serif; font-size:1.5rem;
    font-weight:700; color:${T.textBright};
    padding-bottom:12px; border-bottom:2px solid ${T.border};
    margin-bottom:24px; display:flex; align-items:center; gap:12px;
  }
  .dsa-num {
    font-family:'JetBrains Mono',monospace; font-size:.85rem;
    color:${T.accent1}; background:rgba(108,99,255,.12);
    border:1px solid rgba(108,99,255,.3);
    padding:3px 10px; border-radius:6px;
  }

  .dsa-sub { margin-top:28px; }
  .dsa-sub h4 {
    font-family:'JetBrains Mono',monospace; font-size:.95rem;
    font-weight:600; color:${T.accent3}; margin-bottom:10px;
    display:flex; align-items:center; gap:8px;
  }
  .dsa-sub h4::before { content:'▸'; color:${T.accent1}; font-size:.8rem; }

  .dsa-root p { margin-bottom:14px; color:${T.text}; }
  .dsa-root strong { color:${T.textBright}; font-weight:600; }
  .dsa-root em { color:${T.accent4}; font-style:italic; }

  .dsa-pre {
    background:${T.codeBg};
    border:1px solid ${T.border};
    border-left:3px solid ${T.accent1};
    border-radius:10px;
    padding:20px 24px;
    overflow-x:auto;
    margin:18px 0;
    font-family:'JetBrains Mono',monospace;
    font-size:.82rem; line-height:1.7;
    color:#c8c8e0;
    white-space: pre;
  }
  .dsa-code {
    font-family:'JetBrains Mono',monospace; font-size:.84em;
    background:rgba(108,99,255,.12); color:#a78bfa;
    padding:2px 7px; border-radius:4px;
  }

  .dsa-box {
    border-radius:12px; padding:20px 24px; margin:20px 0; border-left:4px solid;
  }
  .dsa-box.info  { background:rgba(108,99,255,.08); border-color:${T.accent1}; }
  .dsa-box.warn  { background:rgba(255,209,102,.07); border-color:${T.accent4}; }
  .dsa-box.tip   { background:rgba(67,233,123,.07);  border-color:${T.accent3}; }
  .dsa-box.danger{ background:rgba(255,107,107,.07); border-color:${T.accent2}; }
  .dsa-box-title {
    font-family:'JetBrains Mono',monospace; font-size:.75rem;
    letter-spacing:2px; text-transform:uppercase; font-weight:600; margin-bottom:8px;
  }
  .dsa-box.info  .dsa-box-title { color:${T.accent1}; }
  .dsa-box.warn  .dsa-box-title { color:${T.accent4}; }
  .dsa-box.tip   .dsa-box-title { color:${T.accent3}; }
  .dsa-box.danger .dsa-box-title { color:${T.accent2}; }

  .dsa-tbl-wrap { overflow-x:auto; margin:20px 0; }
  .dsa-tbl-wrap table { width:100%; border-collapse:collapse; font-size:.88rem; }
  .dsa-tbl-wrap th {
    background:${T.bg3}; color:${T.textBright};
    font-family:'JetBrains Mono',monospace; font-size:.78rem;
    letter-spacing:1px; text-transform:uppercase;
    padding:12px 16px; text-align:left; border-bottom:2px solid ${T.border};
  }
  .dsa-tbl-wrap td { padding:11px 16px; border-bottom:1px solid ${T.border}; vertical-align:top; }
  .dsa-tbl-wrap tr:hover td { background:rgba(255,255,255,.02); }

  .dsa-cx-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; margin:20px 0; }
  .dsa-cx-card {
    background:${T.panel}; border:1px solid ${T.border};
    border-radius:12px; padding:16px; text-align:center; transition:border-color .2s;
  }
  .dsa-cx-card:hover { border-color:${T.accent1}; }
  .dsa-cx-card .notation { font-family:'JetBrains Mono',monospace; font-size:1.2rem; font-weight:600; margin-bottom:6px; }
  .dsa-cx-card .name { font-size:.8rem; color:${T.textDim}; margin-bottom:6px; }
  .dsa-cx-card .example { font-size:.75rem; color:${T.accent3}; }
  .dsa-cx-card.o1 .notation { color:#43e97b; }
  .dsa-cx-card.ologn .notation { color:#4ecdc4; }
  .dsa-cx-card.on .notation { color:#6c63ff; }
  .dsa-cx-card.onlogn .notation { color:#ffd166; }
  .dsa-cx-card.on2 .notation { color:#ff9f43; }
  .dsa-cx-card.o2n .notation { color:#ff6b6b; }
  .dsa-cx-card.ofact .notation { color:#ee5a24; }

  .dsa-nc-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin:20px 0; }
  .dsa-nc-grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin:0 0 20px; }
  @media(max-width:600px){ .dsa-nc-grid3 { grid-template-columns:1fr; } .dsa-nc-grid { grid-template-columns:1fr; } }
  .dsa-nc-card { background:${T.panel}; border:1px solid ${T.border}; border-radius:12px; padding:18px; }
  .dsa-nc-card .sym { font-family:'JetBrains Mono',monospace; font-size:1.4rem; font-weight:700; margin-bottom:6px; }
  .dsa-nc-card .meaning { font-size:.85rem; color:${T.textDim}; margin-bottom:8px; }
  .dsa-nc-card .desc { font-size:.82rem; line-height:1.6; }
  .dsa-nc-card.big-o  { border-top:3px solid ${T.accent1}; } .dsa-nc-card.big-o  .sym { color:${T.accent1}; }
  .dsa-nc-card.big-om { border-top:3px solid ${T.accent3}; } .dsa-nc-card.big-om .sym { color:${T.accent3}; }
  .dsa-nc-card.big-th { border-top:3px solid ${T.accent4}; } .dsa-nc-card.big-th .sym { color:${T.accent4}; }
  .dsa-nc-card.lil-o  { border-top:3px solid ${T.accent5}; } .dsa-nc-card.lil-o  .sym { color:${T.accent5}; }
  .dsa-nc-card.lil-om { border-top:3px solid ${T.accent2}; } .dsa-nc-card.lil-om .sym { color:${T.accent2}; }

  .dsa-mt-formula {
    background:${T.codeBg}; border:1px solid ${T.border};
    border-radius:12px; padding:24px; margin:20px 0;
    text-align:center; font-family:'JetBrains Mono',monospace; font-size:1rem;
    color:${T.accent4}; line-height:2;
  }
  .dsa-mt-cases { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin:18px 0; }
  @media(max-width:600px){ .dsa-mt-cases { grid-template-columns:1fr; } }
  .dsa-mt-case { background:${T.panel}; border:1px solid ${T.border}; border-radius:10px; padding:16px; }
  .dsa-mt-case .case-num { font-family:'JetBrains Mono',monospace; font-size:.75rem; text-transform:uppercase; letter-spacing:1px; color:${T.accent1}; margin-bottom:8px; }
  .dsa-mt-case .condition { font-size:.82rem; color:${T.accent4}; margin-bottom:6px; font-family:'JetBrains Mono',monospace; }
  .dsa-mt-case .result { font-size:.82rem; color:${T.accent3}; font-family:'JetBrains Mono',monospace; margin-bottom:8px; }
  .dsa-mt-case .meaning { font-size:.79rem; color:${T.textDim}; }

  .dsa-problem {
    background:${T.bg3}; border:1px solid ${T.border};
    border-left:4px solid ${T.accent4};
    border-radius:0 12px 12px 0; padding:20px 24px; margin:18px 0;
  }
  .dsa-problem .pnum { font-family:'JetBrains Mono',monospace; font-size:.75rem; letter-spacing:2px; text-transform:uppercase; color:${T.accent4}; margin-bottom:8px; }
  .dsa-problem .q { color:${T.textBright}; font-weight:600; margin-bottom:10px; }
  .dsa-problem .sol { margin-top:12px; padding-top:12px; border-top:1px solid ${T.border}; font-size:.9rem; }
  .dsa-problem .sol-title { font-family:'JetBrains Mono',monospace; font-size:.72rem; letter-spacing:2px; color:${T.accent3}; margin-bottom:6px; }

  .dsa-kw-grid { display:flex; flex-wrap:wrap; gap:8px; margin:16px 0; }
  .dsa-kw-pill {
    font-family:'JetBrains Mono',monospace; font-size:.78rem;
    padding:5px 12px; border-radius:6px;
    background:rgba(108,99,255,.12); color:${T.accent1};
    border:1px solid rgba(108,99,255,.25);
  }

  .dsa-feat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; margin:20px 0; }
  .dsa-feat-card {
    background:${T.panel}; border:1px solid ${T.border};
    border-radius:12px; padding:18px; transition:border-color .2s, transform .2s;
  }
  .dsa-feat-card:hover { border-color:${T.accent2}; transform:translateY(-2px); }
  .dsa-feat-card .icon { font-size:1.4rem; margin-bottom:8px; }
  .dsa-feat-card .title { font-family:'JetBrains Mono',monospace; font-size:.85rem; font-weight:600; color:${T.textBright}; margin-bottom:6px; }
  .dsa-feat-card .desc  { font-size:.82rem; color:${T.textDim}; line-height:1.55; }

  .dsa-jvm-stack { border:1px solid ${T.border}; border-radius:14px; overflow:hidden; margin:20px 0; }
  .dsa-jvm-row { padding:14px 22px; border-bottom:1px solid ${T.border}; display:flex; align-items:center; gap:16px; }
  .dsa-jvm-row:last-child { border-bottom:none; }
  .dsa-jvm-row .lbl { font-family:'JetBrains Mono',monospace; font-size:.8rem; font-weight:600; min-width:140px; color:${T.textBright}; }
  .dsa-jvm-row .desc { font-size:.86rem; color:${T.textDim}; }
  .dsa-jvm-row.layer1 { background:rgba(108,99,255,.10); }
  .dsa-jvm-row.layer2 { background:rgba(78,205,196,.07); }
  .dsa-jvm-row.layer3 { background:rgba(67,233,123,.07); }
  .dsa-jvm-row.layer4 { background:rgba(255,209,102,.07); }
  .dsa-jvm-row.layer5 { background:rgba(255,107,107,.07); }

  .dsa-dt-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:12px; margin:20px 0; }
  .dsa-dt-card { background:${T.panel}; border:1px solid ${T.border}; border-radius:10px; padding:14px 16px; }
  .dsa-dt-card .type { font-family:'JetBrains Mono',monospace; font-size:.95rem; font-weight:600; color:${T.accent1}; }
  .dsa-dt-card .size { font-size:.75rem; color:${T.accent4}; margin:3px 0; }
  .dsa-dt-card .range { font-size:.75rem; color:${T.textDim}; line-height:1.5; }

  .dsa-step-list { list-style:none; margin:16px 0; }
  .dsa-step-list li { display:flex; gap:14px; margin-bottom:14px; align-items:flex-start; }
  .dsa-step-list li .sn {
    font-family:'JetBrains Mono',monospace; font-size:.75rem; font-weight:700;
    background:${T.accent1}; color:#fff;
    min-width:26px; height:26px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    margin-top:2px; flex-shrink:0;
  }
  .dsa-step-list li .sc { font-size:.9rem; }

  .dsa-root h3 { font-family:'Playfair Display',serif; font-size:1.2rem; color:${T.textBright}; margin:22px 0 10px; }
  .dsa-root ul, .dsa-root ol { padding-left:22px; margin-bottom:14px; }
  .dsa-root li { margin-bottom:6px; }

  .dsa-footer {
    text-align:center; padding:40px;
    border-top:1px solid ${T.border};
    font-family:'JetBrains Mono',monospace; font-size:.8rem;
    color:${T.textDim}; margin-top:80px;
  }
`;

// ── Complexity Section ──
function ComplexitySection() {
  return (
    <div className="dsa-section" id="complexity">
      <div className="dsa-section-title"><span className="dsa-num">01</span> Complexity Analysis — The Deep Foundation</div>
      <p><strong>Why do we analyze algorithms?</strong> Suppose you write two programs that both sort a list. Program A finishes in 2 seconds; Program B finishes in 0.001 seconds. Why? The answer lies in <em>algorithmic complexity</em> — the mathematical study of how many resources (time and memory) an algorithm consumes as its input grows.</p>
      <p>Complexity analysis is <strong>machine-independent</strong>. Instead of measuring wall-clock time, we count abstract operations and express the count as a function of input size <code className="dsa-code">n</code>.</p>
      <div className="dsa-box info"><div className="dsa-box-title">📌 Core Idea</div>An algorithm's <strong>time complexity</strong> is a function T(n) that counts the number of primitive operations performed on an input of size n. We care about how T(n) behaves as n → ∞.</div>
      <div className="dsa-sub">
        <h4>What is "Input Size" n?</h4>
        <ul>
          <li><strong>Array/List:</strong> n = number of elements</li>
          <li><strong>String:</strong> n = number of characters</li>
          <li><strong>Graph:</strong> n = vertices (V) and/or edges (E)</li>
          <li><strong>Integer:</strong> n = number of bits (log₂ of the value)</li>
          <li><strong>Matrix:</strong> n = dimensions (rows × columns)</li>
        </ul>
      </div>
      <div className="dsa-sub">
        <h4>Types of Complexity Analysis</h4>
        <ul>
          <li><strong>Worst-case:</strong> Maximum operations over ALL inputs of size n. Most commonly used.</li>
          <li><strong>Best-case:</strong> Minimum operations. Often trivial.</li>
          <li><strong>Average-case:</strong> Expected operations over a probability distribution of inputs.</li>
          <li><strong>Amortized:</strong> Average cost per operation over a sequence of operations.</li>
        </ul>
      </div>
      <h3>Common Complexity Classes</h3>
      <div className="dsa-cx-grid">
        {[
          { cls:"o1",    n:"O(1)",     name:"Constant",      ex:"Array access, hash lookup" },
          { cls:"ologn", n:"O(log n)", name:"Logarithmic",   ex:"Binary search, BST ops" },
          { cls:"on",    n:"O(n)",     name:"Linear",        ex:"Linear search, sum array" },
          { cls:"onlogn",n:"O(n log n)",name:"Linearithmic", ex:"Merge sort, Heap sort" },
          { cls:"on2",   n:"O(n²)",    name:"Quadratic",     ex:"Bubble sort, nested loops" },
          { cls:"o2n",   n:"O(2ⁿ)",    name:"Exponential",   ex:"Fibonacci (naive), subsets" },
          { cls:"ofact", n:"O(n!)",    name:"Factorial",     ex:"Permutations, TSP brute" },
        ].map(c => (
          <div key={c.cls} className={`dsa-cx-card ${c.cls}`}>
            <div className="notation">{c.n}</div>
            <div className="name">{c.name}</div>
            <div className="example">{c.ex}</div>
          </div>
        ))}
      </div>
      <div className="dsa-box warn"><div className="dsa-box-title">⚡ Growth Rate Reality Check</div>For n = 1,000,000: O(1) → 1 op | O(log n) → ~20 ops | O(n) → 1M ops | O(n log n) → 20M ops | O(n²) → 10¹² ops (impossible in practice!)</div>
    </div>
  );
}

// ── Time vs Space Section ──
function TradeoffsSection() {
  return (
    <div className="dsa-section" id="tradoffs">
      <div className="dsa-section-title"><span className="dsa-num">02</span> Time vs Space Trade-offs</div>
      <p>Every algorithm has two resources it consumes: <strong>time</strong> (how fast it runs) and <strong>space</strong> (how much memory it uses). These often pull in opposite directions.</p>
      <div className="dsa-tbl-wrap">
        <table>
          <thead><tr><th>Technique</th><th>Time Benefit</th><th>Space Cost</th><th>Real Example</th></tr></thead>
          <tbody>
            <tr><td><strong>Memoization / DP Table</strong></td><td>Avoid recomputation → exponential → polynomial</td><td>O(n) or O(n²) extra</td><td>Fibonacci: O(2ⁿ) → O(n)</td></tr>
            <tr><td><strong>Hash Table / Index</strong></td><td>O(n) search → O(1) lookup</td><td>O(n) extra</td><td>Database indexes</td></tr>
            <tr><td><strong>Precomputation</strong></td><td>Query time O(1)</td><td>O(n) setup + space</td><td>Prefix sums, lookup tables</td></tr>
            <tr><td><strong>Compression</strong></td><td>More I/O time</td><td>Saves disk/network space</td><td>gzip, JPEG</td></tr>
            <tr><td><strong>In-place algorithms</strong></td><td>Slower (no merge buffer)</td><td>O(1) extra space</td><td>In-place quicksort</td></tr>
          </tbody>
        </table>
      </div>
      <div className="dsa-sub">
        <h4>Classic Example: Fibonacci</h4>
        <pre className="dsa-pre">{`// Naive recursive — O(2^n) time, O(n) stack space
int fib(int n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);   // recomputes same subproblems MANY times
}

// Memoized — O(n) time, O(n) space (trade space for time)
int[] memo = new int[n+1];
int fibMemo(int n) {
  if (n <= 1) return n;
  if (memo[n] != 0) return memo[n];  // O(1) lookup
  memo[n] = fibMemo(n-1) + fibMemo(n-2);
  return memo[n];
}

// Iterative DP — O(n) time, O(1) space (best of both!)
int fibDP(int n) {
  int a = 0, b = 1;
  for (int i = 2; i <= n; i++) {
    int c = a + b; a = b; b = c;
  }
  return b;
}`}</pre>
      </div>
      <div className="dsa-box tip"><div className="dsa-box-title">💡 Space Complexity Rules</div>Space complexity counts the <strong>extra</strong> space your algorithm uses (not the input itself). O(1) = constant extra space. Recursion always uses O(depth) stack space — don't forget the call stack!</div>
    </div>
  );
}

// ── Asymptotic Notations Section ──
function NotationsSection() {
  return (
    <div className="dsa-section" id="notations">
      <div className="dsa-section-title"><span className="dsa-num">03</span> Asymptotic Notations — Ω, ω, Θ, O, o</div>
      <p>Asymptotic notation gives us a mathematical language to describe how functions grow. We express T(n) in terms of simpler functions and ignore constant factors and lower-order terms.</p>
      <div className="dsa-box info"><div className="dsa-box-title">📐 Formal Setup</div>Let f(n) and g(n) be functions from positive integers to positive reals. f(n) is our actual complexity; g(n) is our benchmark function.</div>
      <div className="dsa-nc-grid">
        <div className="dsa-nc-card big-o"><div className="sym">O — Big-O</div><div className="meaning">Upper bound (≤ growth rate)</div><div className="desc">f(n) = O(g(n)) means there exist constants c &gt; 0 and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀.<br/><br/>Intuition: f grows <em>no faster than</em> g.<br/><br/>Example: 3n² + 5n + 2 = O(n²)</div></div>
        <div className="dsa-nc-card big-om"><div className="sym">Ω — Big-Omega</div><div className="meaning">Lower bound (≥ growth rate)</div><div className="desc">f(n) = Ω(g(n)) means there exist constants c &gt; 0 and n₀ such that f(n) ≥ c·g(n) for all n ≥ n₀.<br/><br/>Intuition: f grows <em>at least as fast</em> as g.<br/><br/>Example: 3n² + 5n = Ω(n²)</div></div>
      </div>
      <div className="dsa-nc-grid3">
        <div className="dsa-nc-card big-th"><div className="sym">Θ — Theta</div><div className="meaning">Tight bound (= growth rate)</div><div className="desc">f(n) = Θ(g(n)) iff f(n) = O(g(n)) AND f(n) = Ω(g(n)).<br/><br/>Example: 3n² + 5n = Θ(n²)</div></div>
        <div className="dsa-nc-card lil-o"><div className="sym">o — little-o</div><div className="meaning">Strict upper bound (&lt; growth)</div><div className="desc">lim(n→∞) f(n)/g(n) = 0<br/><br/>f grows <em>strictly slower</em> than g.<br/>Example: n = o(n²)</div></div>
        <div className="dsa-nc-card lil-om"><div className="sym">ω — little-omega</div><div className="meaning">Strict lower bound (&gt; growth)</div><div className="desc">lim(n→∞) f(n)/g(n) = ∞<br/><br/>f grows <em>strictly faster</em> than g.<br/>Example: n² = ω(n)</div></div>
      </div>
      <div className="dsa-sub">
        <h4>Analogy: Notations as Comparisons</h4>
        <div className="dsa-tbl-wrap">
          <table>
            <thead><tr><th>Notation</th><th>Analogy</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td><code className="dsa-code">f = O(g)</code></td><td>f ≤ g</td><td>f is upper-bounded by g</td></tr>
              <tr><td><code className="dsa-code">f = Ω(g)</code></td><td>f ≥ g</td><td>f is lower-bounded by g</td></tr>
              <tr><td><code className="dsa-code">f = Θ(g)</code></td><td>f = g</td><td>f and g are same order</td></tr>
              <tr><td><code className="dsa-code">f = o(g)</code></td><td>f &lt; g</td><td>f strictly slower than g</td></tr>
              <tr><td><code className="dsa-code">f = ω(g)</code></td><td>f &gt; g</td><td>f strictly faster than g</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="dsa-sub">
        <h4>Key Properties of Big-O</h4>
        <ul>
          <li><strong>Drop constants:</strong> O(3n) = O(n); O(100) = O(1)</li>
          <li><strong>Drop lower-order terms:</strong> O(n² + n + log n) = O(n²)</li>
          <li><strong>Sum rule:</strong> O(f) + O(g) = O(max(f, g))</li>
          <li><strong>Product rule:</strong> O(f) × O(g) = O(f × g)</li>
        </ul>
      </div>
      <div className="dsa-sub">
        <h4>Hierarchy of Common Functions (slow → fast growth)</h4>
        <pre className="dsa-pre">1 &lt; log(log n) &lt; log n &lt; n^ε &lt; n &lt; n·log n &lt; n² &lt; n³ &lt; 2^n &lt; n!</pre>
      </div>
    </div>
  );
}

// ── Operation Counting Section ──
function OpCountingSection() {
  return (
    <div className="dsa-section" id="opcounting">
      <div className="dsa-section-title"><span className="dsa-num">04</span> Operation Counting — Systematic Method</div>
      <p>Operation counting is the <strong>process of deriving T(n)</strong> — the exact or approximate count of primitive operations — by reading through an algorithm line by line.</p>
      <div className="dsa-sub">
        <h4>What Counts as One Operation?</h4>
        <ul>
          <li>One arithmetic operation: +, -, *, /, %</li>
          <li>One comparison: &lt;, &gt;, ==, !=, &lt;=, &gt;=</li>
          <li>One assignment: x = y</li>
          <li>One array access: a[i]</li>
          <li>One function call (excluding the body)</li>
        </ul>
      </div>
      <div className="dsa-sub">
        <h4>Rules for Counting</h4>
        <ol>
          <li><strong>Sequential statements:</strong> Add their counts → T = T₁ + T₂ + … + Tₖ</li>
          <li><strong>Conditionals (if/else):</strong> Take the maximum branch (worst case)</li>
          <li><strong>Loops:</strong> Multiply (iterations) × (cost per iteration)</li>
          <li><strong>Nested loops:</strong> Multiply all loop counts together</li>
          <li><strong>Recursion:</strong> Set up a recurrence relation, then solve it</li>
        </ol>
      </div>
      <div className="dsa-sub">
        <h4>Worked Example 1: Single Loop</h4>
        <pre className="dsa-pre">{`int sum = 0;                         // 1 op (assignment)
for (int i = 0; i < n; i++) {        // init:1, compare:n+1, increment:n → 2n+2 ops
  sum = sum + a[i];                  // 3 ops × n iterations = 3n
}
// Total = 1 + (2n+2) + 3n = 5n+3 = O(n)`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>Worked Example 2: Nested Loops</h4>
        <pre className="dsa-pre">{`for (int i = 0; i < n; i++) {         // outer: n iterations
  for (int j = 0; j < n; j++) {       // inner: n iterations per outer
    System.out.print(i*j);            // 1 op × n×n = n² times
  }
}
// Total ≈ n² operations = O(n²)`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>Worked Example 3: Logarithmic Loop</h4>
        <pre className="dsa-pre">{`int i = n;
while (i > 1) {
  i = i / 2;   // i halves each time: n → n/2 → n/4 → … → 1
}
// How many iterations? i = n / 2^k, stops when 2^k = n → k = log₂(n)
// Total = O(log n)`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>Worked Example 4: Triangular Nested Loops</h4>
        <pre className="dsa-pre">{`for (int i = 0; i < n; i++) {
  for (int j = 0; j < i; j++) {   // j goes from 0 to i-1
    // inner runs: 0+1+2+...+(n-1) = n(n-1)/2 times
  }
}
// Sum = n(n-1)/2 = O(n²)  — triangular number`}</pre>
      </div>
    </div>
  );
}

// ── Iterative Approach Section ──
function IterativeSection() {
  return (
    <div className="dsa-section" id="iterative">
      <div className="dsa-section-title"><span className="dsa-num">05</span> Iterative Approach to Complexity</div>
      <p>The iterative approach means analyzing algorithms that use loops by counting operations across each iteration and summing them up.</p>
      <div className="dsa-sub">
        <h4>Step-by-Step Framework</h4>
        <ol>
          <li>Identify the loop variable(s) and their ranges</li>
          <li>Count operations inside the innermost loop as a function of loop variables</li>
          <li>For each loop level, compute the total by summing over all iterations</li>
          <li>Simplify using standard sums (arithmetic series, geometric series)</li>
          <li>Drop constants and lower-order terms → Big-O</li>
        </ol>
      </div>
      <div className="dsa-sub">
        <h4>Essential Summation Formulas</h4>
        <div className="dsa-tbl-wrap">
          <table>
            <thead><tr><th>Sum</th><th>Closed Form</th><th>Big-O</th></tr></thead>
            <tbody>
              <tr><td>Σᵢ₌₁ⁿ 1</td><td>n</td><td>O(n)</td></tr>
              <tr><td>Σᵢ₌₁ⁿ i</td><td>n(n+1)/2</td><td>O(n²)</td></tr>
              <tr><td>Σᵢ₌₁ⁿ i²</td><td>n(n+1)(2n+1)/6</td><td>O(n³)</td></tr>
              <tr><td>Σᵢ₌₀ⁿ 2ⁱ</td><td>2ⁿ⁺¹ − 1</td><td>O(2ⁿ)</td></tr>
              <tr><td>Σᵢ₌₁ⁿ 1/i (Harmonic)</td><td>ln(n) + γ ≈ ln(n)</td><td>O(log n)</td></tr>
              <tr><td>Σᵢ₌₀ⁿ rⁱ (r&lt;1)</td><td>(1 - rⁿ⁺¹)/(1-r) ≤ 1/(1-r)</td><td>O(1)</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Master Theorem Section ──
function MasterTheoremSection() {
  return (
    <div className="dsa-section" id="master">
      <div className="dsa-section-title"><span className="dsa-num">06</span> Master Theorem — Divide &amp; Conquer Recurrences</div>
      <p>The Master Theorem is a powerful <strong>"cookbook" formula</strong> for solving recurrence relations of the form:</p>
      <div className="dsa-mt-formula">
        T(n) = a · T(n/b) + f(n)<br/><br/>
        where a ≥ 1, b &gt; 1 are constants,<br/>
        and f(n) is an asymptotically positive function
      </div>
      <div className="dsa-sub">
        <h4>What Each Part Means</h4>
        <ul>
          <li><strong>a:</strong> Number of recursive subproblems</li>
          <li><strong>b:</strong> Factor by which input size shrinks</li>
          <li><strong>f(n):</strong> Cost of dividing + combining (non-recursive work)</li>
          <li><strong>log_b(a):</strong> The "critical exponent" — the key comparison value</li>
        </ul>
      </div>
      <div className="dsa-mt-cases">
        <div className="dsa-mt-case"><div className="case-num">Case 1</div><div className="condition">If f(n) = O(n^(log_b(a) - ε))</div><div className="result">→ T(n) = Θ(n^log_b(a))</div><div className="meaning">Recursion dominates. Leaves do most work.</div></div>
        <div className="dsa-mt-case"><div className="case-num">Case 2</div><div className="condition">If f(n) = Θ(n^log_b(a) · log^k(n))</div><div className="result">→ T(n) = Θ(n^log_b(a) · log^(k+1)(n))</div><div className="meaning">Even split. Recursion and combining are balanced.</div></div>
        <div className="dsa-mt-case"><div className="case-num">Case 3</div><div className="condition">If f(n) = Ω(n^(log_b(a) + ε)) AND a·f(n/b) ≤ c·f(n)</div><div className="result">→ T(n) = Θ(f(n))</div><div className="meaning">Combining dominates. Root does most work.</div></div>
      </div>
      <div className="dsa-sub">
        <h4>Worked Examples</h4>
        <div className="dsa-tbl-wrap">
          <table>
            <thead><tr><th>Recurrence</th><th>a</th><th>b</th><th>f(n)</th><th>log_b(a)</th><th>Case</th><th>Solution</th></tr></thead>
            <tbody>
              <tr><td>Merge Sort: T(n)=2T(n/2)+n</td><td>2</td><td>2</td><td>n</td><td>1</td><td>Case 2</td><td><strong>Θ(n log n)</strong></td></tr>
              <tr><td>Binary Search: T(n)=T(n/2)+1</td><td>1</td><td>2</td><td>1</td><td>0</td><td>Case 2</td><td><strong>Θ(log n)</strong></td></tr>
              <tr><td>Strassen: T(n)=7T(n/2)+n²</td><td>7</td><td>2</td><td>n²</td><td>≈2.81</td><td>Case 1</td><td><strong>Θ(n^2.81)</strong></td></tr>
              <tr><td>T(n)=4T(n/2)+n³</td><td>4</td><td>2</td><td>n³</td><td>2</td><td>Case 3</td><td><strong>Θ(n³)</strong></td></tr>
              <tr><td>T(n)=9T(n/3)+n</td><td>9</td><td>3</td><td>n</td><td>2</td><td>Case 1</td><td><strong>Θ(n²)</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="dsa-box warn"><div className="dsa-box-title">⚠️ When Master Theorem Doesn't Apply</div>Cannot be used when: f(n) is not polynomially larger/smaller than n^(log_b a), subproblems are unequal sizes, or there's no divide (subtract-type recurrences like T(n) = T(n-1) + 1).</div>
    </div>
  );
}

// ── Practice Problems (Algo) ──
function PracticeAlgoSection() {
  const problems = [
    { n:"01", q:"What is the time complexity of: for(i=0;i<n;i++) for(j=i;j<n;j++) sum++;", sol:"Inner loop runs (n-i) times for each i. Total = Σᵢ₌₀ⁿ⁻¹ (n-i) = n(n+1)/2 = O(n²)" },
    { n:"02", q:"Solve: T(n) = 3T(n/3) + n", sol:"a=3, b=3, f(n)=n. log₃3 = 1. f(n) = Θ(n·log⁰n) → Case 2 (k=0). Answer: T(n) = Θ(n log n)" },
    { n:"03", q:"What is the space complexity of recursive binary search?", sol:"Each recursive call reduces n by half. Max recursion depth = log₂n. Each call uses O(1) stack frame. Total: O(log n). Iterative binary search: O(1) space." },
    { n:"04", q:"Is it true that n² = O(n³)? Is n³ = O(n²)?", sol:"n² = O(n³): YES — choose c=1, n₀=1. For all n≥1: n² ≤ n³. True.\nn³ = O(n²): NO — n³/n² = n → ∞. No constant c where n³ ≤ c·n² for all large n. False." },
    { n:"05", q:"What complexity is: for(i=1; i*i <= n; i++) count++;", sol:"Loop runs while i² ≤ n, i.e., while i ≤ √n. So the loop executes √n times. Complexity: O(√n)" },
    { n:"06", q:"Find T(n) for: T(n) = T(n-1) + n, T(1) = 1", sol:"Expand: T(n) = n + (n-1) + (n-2) + … + 1 = n(n+1)/2 = Θ(n²). Subtract-type recurrence; use back-substitution." },
  ];
  return (
    <div className="dsa-section" id="practice-algo">
      <div className="dsa-section-title"><span className="dsa-num">07</span> Practice Problems — Complexity Analysis</div>
      {problems.map(p => (
        <div key={p.n} className="dsa-problem">
          <div className="pnum">Problem {p.n}</div>
          <div className="q">{p.q}</div>
          <div className="sol"><div className="sol-title">✓ Solution</div>{p.sol}</div>
        </div>
      ))}
    </div>
  );
}

// ── Java History Section ──
function JavaHistorySection() {
  const features = [
    { icon:"🌍", title:"Platform Independent", desc:"Java compiles to bytecode (.class files) that runs on any JVM, regardless of OS or hardware. WORA principle." },
    { icon:"🏗️", title:"Object-Oriented", desc:"Everything is an object (except primitives). Supports encapsulation, inheritance, polymorphism, abstraction." },
    { icon:"🔒", title:"Strongly Typed", desc:"Every variable has a declared type. Type checking at compile time catches errors early." },
    { icon:"🗑️", title:"Automatic GC", desc:"Garbage Collector automatically reclaims unused memory. No manual malloc/free like C." },
    { icon:"🔐", title:"Secure", desc:"No pointers, bytecode verification, Security Manager, sandboxed execution." },
    { icon:"🧵", title:"Multithreaded", desc:"Built-in thread support. synchronized keyword, java.util.concurrent package." },
    { icon:"⚡", title:"High Performance", desc:"JIT compilation converts hot bytecode to native machine code at runtime." },
    { icon:"📦", title:"Rich Standard Library", desc:"java.lang, java.util, java.io, java.net, java.sql — thousands of ready-made classes." },
    { icon:"🔗", title:"Distributed", desc:"Built-in support for networking (sockets, RMI, HTTP). Designed for internet-scale apps." },
  ];
  return (
    <div className="dsa-section" id="java-history">
      <div className="dsa-section-title"><span className="dsa-num">08</span> History &amp; Features of Java</div>
      <div className="dsa-sub">
        <h4>The Origin Story</h4>
        <p>Java was created at <strong>Sun Microsystems</strong> in 1991 as part of the "Green Project," led by <strong>James Gosling</strong> (the "father of Java"). Originally called <em>Oak</em>, then renamed <strong>Java</strong> (named after Java coffee from Indonesia). Sun released Java 1.0 in <strong>1996</strong> with the famous promise: <em>"Write Once, Run Anywhere" (WORA)</em>.</p>
      </div>
      <div className="dsa-tbl-wrap">
        <table>
          <thead><tr><th>Version</th><th>Year</th><th>Key Additions</th></tr></thead>
          <tbody>
            <tr><td>Java 1.0</td><td>1996</td><td>Initial release, AWT, Applets</td></tr>
            <tr><td>Java 1.2 (J2SE)</td><td>1998</td><td>Swing, Collections Framework, JIT compiler</td></tr>
            <tr><td>Java 5.0</td><td>2004</td><td>Generics, Enums, Autoboxing, Varargs, Enhanced for-loop</td></tr>
            <tr><td>Java 8</td><td>2014</td><td>Lambda expressions, Stream API, Default methods, Date/Time API</td></tr>
            <tr><td>Java 11 (LTS)</td><td>2018</td><td>var keyword, HTTP Client, removed Applets</td></tr>
            <tr><td>Java 17 (LTS)</td><td>2021</td><td>Sealed classes, Pattern matching, Records</td></tr>
            <tr><td>Java 21 (LTS)</td><td>2023</td><td>Virtual Threads, Sequenced Collections, String Templates</td></tr>
          </tbody>
        </table>
      </div>
      <div className="dsa-sub">
        <h4>Core Features of Java</h4>
        <div className="dsa-feat-grid">
          {features.map((f,i) => (
            <div key={i} className="dsa-feat-card">
              <div className="icon">{f.icon}</div>
              <div className="title">{f.title}</div>
              <div className="desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── JVM Section ──
function JVMSection() {
  return (
    <div className="dsa-section" id="jvm">
      <div className="dsa-section-title"><span className="dsa-num">09</span> JVM, JRE, and JDK — The Complete Picture</div>
      <p>These three terms are often confused. Think of them as nested containers: <strong>JDK ⊃ JRE ⊃ JVM</strong>.</p>
      <div className="dsa-jvm-stack">
        <div className="dsa-jvm-row layer1"><div className="lbl">☕ JDK</div><div className="desc"><strong>Java Development Kit</strong> — Everything a developer needs: JRE + compiler (javac) + javadoc + jdb (debugger) + jar + jshell + profiling tools. You need JDK to WRITE and COMPILE Java code.</div></div>
        <div className="dsa-jvm-row layer2"><div className="lbl">🏃 JRE</div><div className="desc"><strong>Java Runtime Environment</strong> — What's needed to RUN compiled Java programs: JVM + class libraries + supporting files. (JRE is now bundled into JDK in Java 9+)</div></div>
        <div className="dsa-jvm-row layer3"><div className="lbl">⚙️ JVM</div><div className="desc"><strong>Java Virtual Machine</strong> — An abstract computing machine that executes Java bytecode. Provides memory management (heap/stack/method area), garbage collection, security, and JIT compilation.</div></div>
      </div>
      <div className="dsa-sub">
        <h4>Inside the JVM — Architecture</h4>
        <div className="dsa-jvm-stack">
          <div className="dsa-jvm-row layer1"><div className="lbl">Class Loader</div><div className="desc">Loads .class files into memory. Three phases: Loading → Linking (verification, preparation, resolution) → Initialization. Three built-in loaders: Bootstrap, Extension, Application.</div></div>
          <div className="dsa-jvm-row layer2"><div className="lbl">Runtime Data Areas</div><div className="desc"><strong>Heap:</strong> All objects live here. Shared among threads. GC works here. <strong>Stack:</strong> One per thread. Stores frames (local vars, operand stack, return address). <strong>Method Area (Metaspace):</strong> Class metadata, static variables, constant pool.</div></div>
          <div className="dsa-jvm-row layer3"><div className="lbl">Execution Engine</div><div className="desc"><strong>Interpreter:</strong> Reads and executes bytecode line-by-line. <strong>JIT Compiler:</strong> Detects "hot" methods, compiles them to native machine code. <strong>Garbage Collector:</strong> Reclaims heap memory from objects with no live references.</div></div>
          <div className="dsa-jvm-row layer4"><div className="lbl">Native Method Interface (JNI)</div><div className="desc">Bridge between Java bytecode and native (C/C++) code.</div></div>
          <div className="dsa-jvm-row layer5"><div className="lbl">Native Method Libraries</div><div className="desc">Platform-specific native libraries (.dll on Windows, .so on Linux).</div></div>
        </div>
      </div>
      <div className="dsa-sub">
        <h4>How Java Code Executes</h4>
        <pre className="dsa-pre">{`// Step 1: You write source code
HelloWorld.java

// Step 2: javac compiles it to platform-neutral bytecode
javac HelloWorld.java → HelloWorld.class  // bytecode, not machine code

// Step 3: JVM class loader loads HelloWorld.class
// Step 4: Bytecode verifier checks for security violations
// Step 5: Interpreter starts executing bytecode
// Step 6: JIT compiler kicks in for hot methods → native code
java HelloWorld  // runs on ANY OS with a JVM installed`}</pre>
      </div>
    </div>
  );
}

// ── Setup Section ──
function SetupSection() {
  return (
    <div className="dsa-section" id="setup">
      <div className="dsa-section-title"><span className="dsa-num">10</span> Setting Up the Java Environment</div>
      <div className="dsa-sub">
        <h4>🪟 Windows Setup</h4>
        <ol className="dsa-step-list">
          <li><span className="sn">1</span><span className="sc">Go to <strong>https://adoptium.net</strong> or <strong>https://www.oracle.com/java/</strong>, download the JDK installer (.exe) for your architecture (x64).</span></li>
          <li><span className="sn">2</span><span className="sc">Run the installer. Note the installation path (e.g., <code className="dsa-code">C:\Program Files\Java\jdk-21</code>).</span></li>
          <li><span className="sn">3</span><span className="sc">Open <strong>System Properties → Advanced → Environment Variables</strong>. Create: Name = <code className="dsa-code">JAVA_HOME</code>, Value = your JDK path.</span></li>
          <li><span className="sn">4</span><span className="sc">Find the <code className="dsa-code">Path</code> System Variable, click Edit → New, add <code className="dsa-code">%JAVA_HOME%\bin</code>.</span></li>
          <li><span className="sn">5</span><span className="sc">Open a new Command Prompt and verify: <code className="dsa-code">java -version</code> and <code className="dsa-code">javac -version</code>.</span></li>
        </ol>
      </div>
      <div className="dsa-sub">
        <h4>🍎 macOS Setup</h4>
        <pre className="dsa-pre">{`# Using Homebrew (recommended)
brew install openjdk@21

# Add to PATH in ~/.zshrc or ~/.bash_profile
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"

# Reload shell and verify
source ~/.zshrc
java -version   # should show: openjdk version "21..."
javac -version`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>🐧 Linux (Ubuntu/Debian) Setup</h4>
        <pre className="dsa-pre">{`# Update packages and install OpenJDK
sudo apt update
sudo apt install openjdk-21-jdk -y

# Verify installation
java -version
javac -version

# Set JAVA_HOME in ~/.bashrc
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
source ~/.bashrc`}</pre>
      </div>
    </div>
  );
}

// ── IDE Section ──
function IDESection() {
  return (
    <div className="dsa-section" id="ide">
      <div className="dsa-section-title"><span className="dsa-num">11</span> Integrated Development Environments (IDEs)</div>
      <div className="dsa-tbl-wrap">
        <table>
          <thead><tr><th>IDE</th><th>Best For</th><th>Key Features</th><th>Free?</th></tr></thead>
          <tbody>
            <tr><td><strong>Eclipse</strong></td><td>Enterprise Java</td><td>Workspace/projects, plugin ecosystem (JDT, Maven, Git), refactoring tools</td><td>✅ Yes</td></tr>
            <tr><td><strong>IntelliJ IDEA</strong></td><td>Professional Java development</td><td>Smart code completion, built-in Spring/Kotlin support, best refactoring in industry</td><td>Community=Free, Ultimate=Paid</td></tr>
            <tr><td><strong>NetBeans</strong></td><td>Beginners, Apache-official</td><td>GUI builder (Matisse), Maven/Gradle support, clean UI</td><td>✅ Yes</td></tr>
            <tr><td><strong>VS Code</strong></td><td>Lightweight multi-language dev</td><td>Extension Pack for Java (6 extensions), integrated terminal, Git, Copilot</td><td>✅ Yes</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Compile Section ──
function CompileSection() {
  return (
    <div className="dsa-section" id="compile">
      <div className="dsa-section-title"><span className="dsa-num">12</span> Compiling and Interpreting Java Programs</div>
      <div className="dsa-box info"><div className="dsa-box-title">🔑 Key Insight</div>Java is <strong>both compiled AND interpreted</strong> — compiled to bytecode (not machine code), then interpreted/JIT-compiled by the JVM. This is why Java achieves both portability AND good performance.</div>
      <div className="dsa-sub">
        <h4>The Complete Compilation Pipeline</h4>
        <pre className="dsa-pre">{`# Compile a single file
javac HelloWorld.java

# Compile all .java files in current directory
javac *.java

# Specify output directory for .class files
javac -d bin src/HelloWorld.java

# Run with classpath
java -cp bin HelloWorld

# Enable assertions
java -ea HelloWorld

# Set JVM heap size
java -Xms256m -Xmx1g HelloWorld`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>What javac Does Internally</h4>
        <ol>
          <li><strong>Lexical Analysis:</strong> Tokenizes source code (keywords, identifiers, operators, literals)</li>
          <li><strong>Syntactic Analysis:</strong> Builds Abstract Syntax Tree (AST), checks grammar</li>
          <li><strong>Semantic Analysis:</strong> Type checking, name resolution, checks Java rules</li>
          <li><strong>Code Generation:</strong> Emits bytecode instructions (JVM instruction set)</li>
          <li><strong>Output:</strong> One .class file per class (including inner/anonymous classes)</li>
        </ol>
      </div>
      <div className="dsa-sub">
        <h4>Bytecode — What's Inside a .class File</h4>
        <pre className="dsa-pre">{`// Java source:
int a = 5, b = 3, c = a + b;

// Bytecode (readable via: javap -c HelloWorld):
0: bipush    5       // push 5 onto operand stack
2: istore_1          // store into local var 1 (a)
3: bipush    3       // push 3
5: istore_2          // store into local var 2 (b)
6: iload_1           // load a
7: iload_2           // load b
8: iadd              // integer add (pops 2, pushes result)
9: istore_3          // store result into c`}</pre>
      </div>
    </div>
  );
}

// ── Main Method Section ──
function MainMethodSection() {
  return (
    <div className="dsa-section" id="main">
      <div className="dsa-section-title"><span className="dsa-num">13</span> Understanding <code className="dsa-code">public static void main(String[] args)</code></div>
      <p>This is the <strong>entry point</strong> of every standalone Java application. The JVM looks for this exact signature when launching.</p>
      <div className="dsa-tbl-wrap">
        <table>
          <thead><tr><th>Keyword</th><th>Why It's Required</th></tr></thead>
          <tbody>
            <tr><td><code className="dsa-code">public</code></td><td>Must be public so the JVM (which is external to your class) can call it.</td></tr>
            <tr><td><code className="dsa-code">static</code></td><td>Belongs to the Class, not an instance. JVM calls main() before any objects are created.</td></tr>
            <tr><td><code className="dsa-code">void</code></td><td>main() doesn't return a value to the JVM. Use System.exit(code) to return an exit code to the OS.</td></tr>
            <tr><td><code className="dsa-code">main</code></td><td>The specific name the JVM looks for. Hardcoded in the JVM launcher.</td></tr>
            <tr><td><code className="dsa-code">String[] args</code></td><td>Command-line arguments. args[0] = first argument. Can also be written as String... args (varargs).</td></tr>
          </tbody>
        </table>
      </div>
      <div className="dsa-sub">
        <h4>Command-Line Arguments — Full Example</h4>
        <pre className="dsa-pre">{`public class CmdArgs {
  public static void main(String[] args) {
    System.out.println("Argument count: " + args.length);
    for (int i = 0; i < args.length; i++) {
      System.out.println("args[" + i + "] = " + args[i]);
    }
    // Safe argument parsing
    if (args.length >= 2) {
      int x = Integer.parseInt(args[0]);
      int y = Integer.parseInt(args[1]);
      System.out.println("Sum = " + (x + y));
    }
  }
}
// Compile: javac CmdArgs.java
// Run:     java CmdArgs 10 20
// Output:  Argument count: 2
//          args[0] = 10
//          args[1] = 20
//          Sum = 30`}</pre>
      </div>
      <div className="dsa-box warn"><div className="dsa-box-title">⚠️ Common Pitfall</div><strong>All command-line arguments are Strings!</strong> "123" is not the integer 123. You must parse: Integer.parseInt(args[0]), Double.parseDouble(args[0]), etc.</div>
    </div>
  );
}

// ── Java Basics Section ──
function JavaBasicsSection() {
  const keywords = ["abstract","assert","boolean","break","byte","case","catch","char","class","const*","continue","default","do","double","else","enum","extends","final","finally","float","for","goto*","if","implements","import","instanceof","int","interface","long","native","new","package","private","protected","public","return","short","static","strictfp","super","switch","synchronized","this","throw","throws","transient","try","void","volatile","while","var†","record†","sealed†"];
  return (
    <div className="dsa-section" id="basics">
      <div className="dsa-section-title"><span className="dsa-num">14</span> Java Basics — Identifiers &amp; Keywords</div>
      <div className="dsa-sub">
        <h4>Identifiers</h4>
        <p>An <strong>identifier</strong> is a name given to a variable, class, method, interface, or package. Rules:</p>
        <ul>
          <li>Must start with a letter (a-z, A-Z), underscore (_), or dollar sign ($)</li>
          <li>Subsequent characters can include digits (0-9)</li>
          <li>Case-sensitive: <code className="dsa-code">myVar</code> ≠ <code className="dsa-code">MyVar</code></li>
          <li>Cannot be a Java keyword or reserved word</li>
          <li>Cannot contain spaces or special characters like @, #, %, -, etc.</li>
        </ul>
      </div>
      <div className="dsa-sub">
        <h4>Java Naming Conventions</h4>
        <ul>
          <li><strong>Classes &amp; Interfaces:</strong> PascalCase — <code className="dsa-code">StudentRecord</code>, <code className="dsa-code">ArrayList</code></li>
          <li><strong>Methods &amp; Variables:</strong> camelCase — <code className="dsa-code">calculateArea()</code>, <code className="dsa-code">studentName</code></li>
          <li><strong>Constants:</strong> UPPER_SNAKE_CASE — <code className="dsa-code">MAX_SIZE</code>, <code className="dsa-code">PI</code></li>
          <li><strong>Packages:</strong> all lowercase — <code className="dsa-code">com.company.project</code></li>
        </ul>
      </div>
      <div className="dsa-sub">
        <h4>Java Keywords (53 reserved words — ALL lowercase)</h4>
        <div className="dsa-kw-grid">
          {keywords.map(k => <span key={k} className="dsa-kw-pill">{k}</span>)}
        </div>
        <p style={{ fontSize:".83rem", color:T.textDim, marginTop:8 }}>*const and goto are reserved but unused. †Context-sensitive keywords added in Java 10–17.</p>
      </div>
    </div>
  );
}

// ── Data Types Section ──
function DataTypesSection() {
  const primitives = [
    { type:"byte",    size:"8 bits (1 byte)",    range:"-128 to 127\nDefault: 0\nUse: small integers, streams" },
    { type:"short",   size:"16 bits (2 bytes)",  range:"-32,768 to 32,767\nDefault: 0\nUse: saving memory in arrays" },
    { type:"int",     size:"32 bits (4 bytes)",  range:"-2³¹ to 2³¹-1\n≈ ±2.1 billion\nDefault: 0 — Most common integer" },
    { type:"long",    size:"64 bits (8 bytes)",  range:"-2⁶³ to 2⁶³-1\nUse L suffix: 100L\nDefault: 0L" },
    { type:"float",   size:"32 bits (4 bytes)",  range:"~±3.4×10³⁸, 6-7 sig digits\nUse F suffix: 3.14F\nDefault: 0.0F" },
    { type:"double",  size:"64 bits (8 bytes)",  range:"~±1.8×10³⁰⁸, 15-16 sig digits\nDefault decimal type\nDefault: 0.0" },
    { type:"char",    size:"16 bits (2 bytes)",  range:"'\\u0000' to '\\uffff'\n0 to 65,535 (unsigned!)\nStores Unicode character" },
    { type:"boolean", size:"JVM-dependent (~1 bit)", range:"true or false only\nCannot cast to/from int\nDefault: false" },
  ];
  return (
    <div className="dsa-section" id="datatypes">
      <div className="dsa-section-title"><span className="dsa-num">15</span> Java Data Types</div>
      <p>Java has two categories: <strong>Primitive types</strong> (8 types, stored on the stack) and <strong>Reference types</strong> (objects and arrays, stored on the heap).</p>
      <div className="dsa-sub">
        <h4>The 8 Primitive Types</h4>
        <div className="dsa-dt-grid">
          {primitives.map(p => (
            <div key={p.type} className="dsa-dt-card">
              <div className="type">{p.type}</div>
              <div className="size">{p.size}</div>
              <div className="range" style={{ whiteSpace:"pre-line" }}>{p.range}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="dsa-sub">
        <h4>Type Casting — Widening &amp; Narrowing</h4>
        <pre className="dsa-pre">{`// WIDENING (automatic, safe — no data loss)
byte → short → int → long → float → double
int x = 100;
double d = x;   // automatic: 100 → 100.0
long l = x;     // automatic: 100 → 100L

// NARROWING (explicit cast required — potential data loss)
double pi = 3.14159;
int n = (int) pi;   // truncates decimal: n = 3 (not rounded!)
byte b = (byte) 300; // overflow: 300 % 256 = 44 (wraps around)

// char ↔ int conversions
char c = 'A';
int ascii = c;          // 65
char back = (char)(ascii + 1); // 'B'`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>Wrapper Classes &amp; Autoboxing</h4>
        <div className="dsa-tbl-wrap">
          <table>
            <thead><tr><th>Primitive</th><th>Wrapper</th><th>Useful Methods</th></tr></thead>
            <tbody>
              <tr><td>int</td><td>Integer</td><td>parseInt(), valueOf(), MAX_VALUE, MIN_VALUE, toBinaryString()</td></tr>
              <tr><td>double</td><td>Double</td><td>parseDouble(), isNaN(), isInfinite()</td></tr>
              <tr><td>char</td><td>Character</td><td>isDigit(), isLetter(), toUpperCase(), toLowerCase()</td></tr>
              <tr><td>boolean</td><td>Boolean</td><td>parseBoolean(), TRUE, FALSE</td></tr>
            </tbody>
          </table>
        </div>
        <pre className="dsa-pre">{`// Autoboxing: primitive → wrapper (automatic)
Integer boxed = 42;     // auto-boxes: Integer.valueOf(42)
int unboxed = boxed;    // auto-unboxes: boxed.intValue()

// Watch out for NullPointerException with unboxing!
Integer i = null;
int x = i;  // ← NullPointerException! null cannot be unboxed`}</pre>
      </div>
    </div>
  );
}

// ── Operators Section ──
function OperatorsSection() {
  const precedenceRows = [
    { level:"1 (highest)", ops:"() [] . ++ -- (postfix)", assoc:"Left→Right" },
    { level:"2", ops:"++ -- + - ! ~ (unary/prefix)", assoc:"Right→Left" },
    { level:"3", ops:"(type) new (cast, object creation)", assoc:"Right→Left" },
    { level:"4", ops:"* / %", assoc:"Left→Right" },
    { level:"5", ops:"+ - (addition, subtraction)", assoc:"Left→Right" },
    { level:"6", ops:"<< >> >>> (shift)", assoc:"Left→Right" },
    { level:"7", ops:"< > <= >= instanceof", assoc:"Left→Right" },
    { level:"8", ops:"== !=", assoc:"Left→Right" },
    { level:"9", ops:"& (bitwise AND)", assoc:"Left→Right" },
    { level:"10", ops:"^ (bitwise XOR)", assoc:"Left→Right" },
    { level:"11", ops:"| (bitwise OR)", assoc:"Left→Right" },
    { level:"12", ops:"&& (logical AND)", assoc:"Left→Right" },
    { level:"13", ops:"|| (logical OR)", assoc:"Left→Right" },
    { level:"14", ops:"?: (ternary)", assoc:"Right→Left" },
    { level:"15 (lowest)", ops:"= += -= *= /= %= etc.", assoc:"Right→Left" },
  ];
  return (
    <div className="dsa-section" id="operators">
      <div className="dsa-section-title"><span className="dsa-num">16</span> Java Operators — Complete Reference</div>
      <div className="dsa-sub">
        <h4>1. Arithmetic Operators</h4>
        <pre className="dsa-pre">{`int a = 10, b = 3;
System.out.println(a + b);   // 13  (addition)
System.out.println(a - b);   // 7   (subtraction)
System.out.println(a * b);   // 30  (multiplication)
System.out.println(a / b);   // 3   (integer division — truncates!)
System.out.println(a % b);   // 1   (modulo/remainder)
System.out.println(10.0 / 3); // 3.333... (floating division)
// Key: int/int = int. Cast one to double for real division.`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>2. Unary Operators</h4>
        <pre className="dsa-pre">{`int x = 5;
System.out.println(+x);    // 5  (unary plus)
System.out.println(-x);    // -5 (unary minus/negation)
System.out.println(++x);   // 6  (pre-increment: increment THEN return)
System.out.println(x++);   // 6  (post-increment: return THEN increment; x is now 7)
System.out.println(--x);   // 6  (pre-decrement)
System.out.println(x--);   // 6  (post-decrement; x is now 5)
boolean b = true;
System.out.println(!b);    // false (logical NOT)`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>3. Relational Operators — Always return boolean</h4>
        <pre className="dsa-pre">{`int a = 5, b = 10;
a == b   // false (equal to) — for objects, compares references!
a != b   // true  (not equal)
a <  b   // true  (less than)
a >  b   // false (greater than)
a <= b   // true  (less than or equal)
a >= b   // false (greater than or equal)

// For String equality, ALWAYS use .equals(), not ==
String s1 = new String("hello");
String s2 = new String("hello");
s1 == s2        // false! (different objects in heap)
s1.equals(s2)   // true  (compares content)`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>4. Logical Operators</h4>
        <pre className="dsa-pre">{`boolean p = true, q = false;
p && q   // false — Logical AND. Short-circuit: if p is false, q NOT evaluated
p || q   // true  — Logical OR.  Short-circuit: if p is true, q NOT evaluated
!p       // false — Logical NOT
p &  q   // false — Bitwise AND on booleans (NO short-circuit)
p |  q   // true  — Bitwise OR on booleans (no short-circuit)
p ^  q   // true  — XOR: true if exactly one operand is true

// Short-circuit is CRITICAL for null safety:
String s = null;
if (s != null && s.length() > 0) { // Safe! Second part not evaluated if s==null
  // ...
}`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>5. Bitwise &amp; Shift Operators</h4>
        <pre className="dsa-pre">{`int a = 0b1010; // binary: 10 in decimal
int b = 0b1100; // binary: 12 in decimal
a & b   // AND:  1010 & 1100 = 1000 = 8
a | b   // OR:   1010 | 1100 = 1110 = 14
a ^ b   // XOR:  1010 ^ 1100 = 0110 = 6
~a      // NOT:  ~1010 = ...11110101 = -11 (two's complement)

// Shift operators:
a << 2   // Left shift:  1010 → 101000 = 40 (multiply by 2²=4)
a >> 1   // Signed right: 1010 → 0101 = 5 (divide by 2, preserves sign bit)
a >>> 1  // Unsigned right: fills with 0

// Bit tricks:
n & 1       // check if n is odd (1=odd, 0=even)
n & (n-1)   // clears lowest set bit (0 if n is power of 2)
n | (1<<k)  // set bit k
n & ~(1<<k) // clear bit k
(n>>k) & 1  // read bit k`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>6. Ternary &amp; instanceof Operators</h4>
        <pre className="dsa-pre">{`// Ternary: condition ? value_if_true : value_if_false
int a = 5, b = 10;
int max = (a > b) ? a : b;         // max = 10
String msg = (a % 2 == 0) ? "even" : "odd"; // "odd"

// instanceof
Object obj = "Hello";
if (obj instanceof String) {
  String s = (String) obj;   // safe cast after instanceof check
  System.out.println(s.length());
}
// Java 16+: Pattern matching instanceof (cleaner)
if (obj instanceof String s) {   // binds to s automatically
  System.out.println(s.toUpperCase());
}`}</pre>
      </div>
      <div className="dsa-sub">
        <h4>Operator Precedence Table (High → Low)</h4>
        <div className="dsa-tbl-wrap">
          <table>
            <thead><tr><th>Level</th><th>Operators</th><th>Associativity</th></tr></thead>
            <tbody>
              {precedenceRows.map(r => (
                <tr key={r.level}><td>{r.level}</td><td><code className="dsa-code">{r.ops}</code></td><td>{r.assoc}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Practice Java Section ──
function PracticeJavaSection() {
  const problems = [
    { n:"01", q:'What is the output? int x=5; System.out.println(x++ + ++x);', sol:"x++ returns 5 THEN x becomes 6. ++x increments x to 7 THEN returns 7. 5 + 7 = 12. After statement: x = 7." },
    { n:"02", q:'What is the output? int a=10; a += a -= a *= 2;', sol:"Assignment operators evaluate right to left. First a*=2 → a=20. Then a-=20 → a=0. Then a+=0 → a=0." },
    { n:"03", q:'What does System.out.println(1 + 2 + "3" + 4 + 5); print?', sol:'Left to right: 1+2=3 (int), 3+"3"="33" (String concat), "33"+4="334", "334"+5="3345". Output: "3345"' },
    { n:"04", q:'Is byte b = 10; b = b + 1; valid? What about b += 1;?', sol:'b = b + 1: Compile error! b+1 promotes to int, can\'t assign int to byte without cast. Fix: b = (byte)(b+1).\nb += 1: Valid! Compound assignment operators include an implicit narrowing cast.' },
    { n:"05", q:"Write a program to check if a number is even using bitwise AND (not modulo).", sol:null, code:`int n = 42;
if ((n & 1) == 0) {
  System.out.println(n + " is even");
} else {
  System.out.println(n + " is odd");
}
// The last bit of any even number is 0, odd number is 1` },
    { n:"06", q:'What is the output? System.out.println(5 > 3 ? "yes" : 10 > 8 ? "maybe" : "no");', sol:'5>3 is true, so the result is the first branch: "yes". The nested ternary is never evaluated.' },
  ];
  return (
    <div className="dsa-section" id="practice-java">
      <div className="dsa-section-title"><span className="dsa-num">17</span> Practice Problems — Java Operators</div>
      {problems.map(p => (
        <div key={p.n} className="dsa-problem">
          <div className="pnum">Problem {p.n}</div>
          <div className="q">{p.q}</div>
          <div className="sol">
            <div className="sol-title">✓ Solution</div>
            {p.sol && <span>{p.sol}</span>}
            {p.code && <pre className="dsa-pre">{p.code}</pre>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN EXPORT ──
export default function DSATutorial({ onNext, mode = "all", onChapterChange }) {
  // DSATutorial is a single scrollable page — always on "last chapter"
  useEffect(() => { onChapterChange?.(0, 1); }, [mode]);
  // mode: "basics" = Java only, "complexity" = Algorithms only, "all" = everything

  const basicsItems = [
    { href:"#java-history", label:"Java History" },
    { href:"#jvm",          label:"JVM / JRE / JDK" },
    { href:"#compile",      label:"Compile & Interpret" },
    { href:"#main",         label:"main() Method" },
    { href:"#basics",       label:"Java Basics" },
    { href:"#datatypes",    label:"Data Types" },
    { href:"#operators",    label:"Operators" },
    { href:"#practice-java",label:"Practice Problems" },
  ];

  const complexityItems = [
    { href:"#complexity",    label:"Complexity Analysis" },
    { href:"#tradoffs",      label:"Time vs Space" },
    { href:"#notations",     label:"Asymptotic Notations" },
    { href:"#opcounting",    label:"Operation Counting" },
    { href:"#iterative",     label:"Iterative Approach" },
    { href:"#master",        label:"Master Theorem" },
    { href:"#practice-algo", label:"Practice Problems" },
  ];

  const tocItems = mode === "basics" ? basicsItems
                 : mode === "complexity" ? complexityItems
                 : [...complexityItems, ...basicsItems];

  const heroTitle  = mode === "basics"     ? "Programming Basics"
                   : mode === "complexity" ? "Complexity Analysis"
                   : "Algorithms & Java Deep Dive";

  const heroDesc   = mode === "basics"     ? "Java syntax, data types, operators, JVM, and how your code runs."
                   : mode === "complexity" ? "Big-O, asymptotic notations, operation counting, and the Master Theorem."
                   : "From Programming Basics to Stacks & Queues — every concept from first principles.";

  function scrollTo(href) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="dsa-root">
      <style>{dsaCss}</style>

      {/* HERO */}
      <div className="dsa-hero">
        <div className="dsa-badge">
          {mode === "basics" ? "Programming Basics" : mode === "complexity" ? "Complexity Analysis" : "Complete DSA Curriculum"}
        </div>
        <h1><span>{heroTitle}</span></h1>
        <p>{heroDesc}</p>
        <div className="dsa-toc">
          {tocItems.map(t => (
            <span key={t.href} className="dsa-pill" onClick={() => scrollTo(t.href)}>{t.label}</span>
          ))}
        </div>
      </div>

      <div className="dsa-container">
        {/* Complexity sections — shown in "complexity" or "all" mode */}
        {(mode === "complexity" || mode === "all") && (
          <>
            <div className="dsa-part algo">
              <div className="dsa-part-label">Algorithm Analysis</div>
              <h2>Complexity &amp; Asymptotic Notations</h2>
            </div>
            <ComplexitySection />
            <TradeoffsSection />
            <NotationsSection />
            <OpCountingSection />
            <IterativeSection />
            <MasterTheoremSection />
            <PracticeAlgoSection />
          </>
        )}

        {/* Java sections — shown in "basics" or "all" mode */}
        {(mode === "basics" || mode === "all") && (
          <>
            <div className="dsa-part java" style={{ marginTop: mode === "all" ? 80 : 0 }}>
              <div className="dsa-part-label">Java Foundation</div>
              <h2>Programming Basics</h2>
            </div>
            <JavaHistorySection />
            <JVMSection />
            <SetupSection />
            <IDESection />
            <CompileSection />
            <MainMethodSection />
            <JavaBasicsSection />
            <DataTypesSection />
            <OperatorsSection />
            <PracticeJavaSection />
          </>
        )}

        <div className="dsa-footer">
          Master Guide — Algorithms &amp; Java &nbsp;|&nbsp; All topics covered deeply for exam &amp; interview readiness
          <br /><span style={{ color: T.accent1 }}>∞</span> Keep learning. Keep coding.
        </div>

        {/* Next chapter button */}
        {onNext && (
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:32, paddingTop:24, borderTop:`1px solid ${T.border}` }}>
            <button
              onClick={onNext}
              style={{
                display:"flex", alignItems:"center", gap:10,
                background:`linear-gradient(135deg, ${T.accent1}, #4ecdc4)`,
                color:"#fff", border:"none", borderRadius:12,
                padding:"12px 28px", fontSize:15, fontFamily:"'JetBrains Mono',monospace",
                fontWeight:600, cursor:"pointer", letterSpacing:0.5,
                boxShadow:`0 4px 20px ${T.accent1}40`, transition:"all .2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
            >
              Next: Arrays &amp; Recursion →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
