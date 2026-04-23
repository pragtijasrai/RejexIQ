import { useState, useRef, useEffect } from "react";

const styles = `
.srch-root { font-family:var(--font-sans,sans-serif); }
.srch-wrap { max-width:860px; margin:0 auto; padding:0 0 48px; }
.srch-nav { display:flex; flex-wrap:wrap; gap:6px; padding:16px 0 20px; border-bottom:0.5px solid var(--color-border-tertiary); margin-bottom:24px; }
.srch-nb { padding:6px 14px; font-size:12px; border-radius:20px; border:0.5px solid var(--color-border-secondary); background:transparent; color:var(--color-text-secondary); cursor:pointer; transition:all .15s; }
.srch-nb:hover { background:var(--color-background-secondary); color:var(--color-text-primary); }
.srch-nb.on { background:var(--color-text-primary); color:var(--color-background-primary); border-color:transparent; }
@keyframes srchFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.srch-sec { animation:srchFade .2s ease; }
.srch-tag { display:inline-block; font-size:11px; padding:2px 10px; border-radius:12px; margin-bottom:12px; font-weight:500; }
.tag-blue   { background:var(--color-background-info);    color:var(--color-text-info); }
.tag-green  { background:var(--color-background-success); color:var(--color-text-success); }
.tag-amber  { background:var(--color-background-warning); color:var(--color-text-warning); }
.tag-red    { background:var(--color-background-danger);  color:var(--color-text-danger); }
.srch-h2 { font-size:20px; font-weight:500; color:var(--color-text-primary); margin-bottom:6px; }
.srch-h3 { font-size:15px; font-weight:500; color:var(--color-text-primary); margin:16px 0 8px; }
.srch-p  { font-size:14px; line-height:1.7; color:var(--color-text-secondary); margin-bottom:8px; }
.srch-ul { padding-left:18px; margin:6px 0; }
.srch-ul li { font-size:14px; line-height:1.7; color:var(--color-text-secondary); margin-bottom:3px; }
.srch-viz { background:var(--color-background-secondary); border-radius:12px; padding:20px; margin:14px 0; min-height:80px; }
.srch-btn { padding:7px 16px; font-size:13px; border-radius:8px; border:0.5px solid var(--color-border-secondary); background:transparent; color:var(--color-text-primary); cursor:pointer; transition:all .15s; margin:4px 2px; }
.srch-btn:hover { background:var(--color-background-secondary); }
.srch-btn.primary { background:var(--color-text-primary); color:var(--color-background-primary); border-color:transparent; }
.srch-btn.primary:hover { opacity:.85; }
.srch-inp { width:80px; padding:6px 10px; font-size:13px; border-radius:8px; border:0.5px solid var(--color-border-secondary); background:var(--color-background-primary); color:var(--color-text-primary); }
.srch-code { background:var(--color-background-secondary); border-radius:8px; padding:12px 14px; margin:10px 0; font-family:var(--font-mono,monospace); font-size:12px; line-height:1.6; color:var(--color-text-primary); overflow-x:auto; border:0.5px solid var(--color-border-tertiary); white-space:pre; }
.srch-tbl { width:100%; border-collapse:collapse; margin:10px 0; font-size:13px; }
.srch-tbl th { text-align:left; padding:8px 10px; background:var(--color-background-secondary); color:var(--color-text-primary); font-weight:500; }
.srch-tbl td { padding:7px 10px; border-top:0.5px solid var(--color-border-tertiary); color:var(--color-text-secondary); }
.srch-tbl tr:hover td { background:var(--color-background-secondary); }
.srch-info { border-left:3px solid var(--color-border-info); padding:10px 14px; margin:10px 0; background:var(--color-background-info); border-radius:0 8px 8px 0; }
.srch-info p { color:var(--color-text-info); font-size:13px; }
.srch-warn { border-left:3px solid var(--color-border-warning); padding:10px 14px; margin:10px 0; background:var(--color-background-warning); border-radius:0 8px 8px 0; }
.srch-warn p { color:var(--color-text-warning); font-size:13px; }
.srch-2col { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:10px 0; }
.srch-card { background:var(--color-background-secondary); border-radius:10px; padding:12px; }
.srch-card h4 { font-size:13px; font-weight:500; color:var(--color-text-primary); margin-bottom:6px; }
.srch-status { font-size:13px; color:var(--color-text-secondary); margin-top:8px; min-height:20px; font-style:italic; }
.srch-arr { display:flex; gap:3px; flex-wrap:wrap; padding:8px 0; }
.srch-cell { width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:6px; font-size:13px; font-weight:500; border:1.5px solid; transition:all .3s; }
.srch-quiz-opt { display:block; width:100%; text-align:left; padding:10px 14px; margin:6px 0; border-radius:8px; border:0.5px solid var(--color-border-secondary); background:transparent; color:var(--color-text-primary); font-size:14px; cursor:pointer; transition:all .15s; font-family:var(--font-sans,sans-serif); }
.srch-quiz-opt:hover { background:var(--color-background-secondary); }
.srch-quiz-opt.correct { background:var(--color-background-success); border-color:var(--color-border-success); color:var(--color-text-success); }
.srch-quiz-opt.wrong   { background:var(--color-background-danger);  border-color:var(--color-border-danger);  color:var(--color-text-danger); }
@media(max-width:500px){ .srch-2col{grid-template-columns:1fr;} }
`;

// ── Array cell renderer ──
function ArrCells({ arr, lo = -1, hi = -1, mid = -1, found = -1, visited = [] }) {
  return (
    <div className="srch-arr">
      {arr.map((v, i) => {
        let bg = "var(--color-background-primary)", bc = "var(--color-border-tertiary)", tc = "var(--color-text-primary)";
        if (i === found)   { bg="var(--color-background-success)"; bc="var(--color-border-success)"; tc="var(--color-text-success)"; }
        else if (i === mid){ bg="var(--color-background-warning)"; bc="var(--color-border-warning)"; tc="var(--color-text-warning)"; }
        else if (i >= lo && i <= hi && lo !== -1) { bg="var(--color-background-info)"; bc="var(--color-border-info)"; tc="var(--color-text-info)"; }
        else if (visited.includes(i)) { bg="var(--color-background-secondary)"; bc="var(--color-border-tertiary)"; tc="var(--color-text-tertiary)"; }
        return (
          <div key={i} className="srch-cell" style={{background:bg,borderColor:bc,color:tc}}>
            <div style={{textAlign:"center"}}>
              <div>{v}</div>
              <div style={{fontSize:9,opacity:.7}}>[{i}]</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Linear Search ──
function SecLinear() {
  const ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const [target, setTarget] = useState(23);
  const [step, setStep] = useState(-1);
  const [found, setFound] = useState(-1);
  const [status, setStatus] = useState("Enter a target and press Step");
  const [visited, setVisited] = useState([]);

  function doStep() {
    const next = step + 1;
    if (next >= ARR.length) { setStatus(`${target} not found in array`); return; }
    setStep(next);
    const newVisited = [...visited, next];
    setVisited(newVisited);
    if (ARR[next] === parseInt(target)) {
      setFound(next);
      setStatus(`✅ Found ${target} at index ${next}! Checked ${next+1} element(s).`);
    } else {
      setStatus(`Checking index ${next}: ${ARR[next]} ≠ ${target}, continue...`);
    }
  }

  function reset() { setStep(-1); setFound(-1); setStatus("Enter a target and press Step"); setVisited([]); }

  return (
    <div className="srch-sec">
      <span className="srch-tag tag-blue">Chapter 1</span>
      <div className="srch-h2">Linear Search</div>
      <p className="srch-p">Check each element one by one from left to right until the target is found or the array ends. Works on <strong>any array</strong> — sorted or unsorted.</p>
      <div className="srch-viz">
        <ArrCells arr={ARR} found={found} visited={visited} />
        <div className="srch-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>Target:</span>
        <input className="srch-inp" type="number" value={target} onChange={e=>{setTarget(e.target.value);reset();}} />
        <button className="srch-btn primary" onClick={doStep} disabled={found!==-1}>Step</button>
        <button className="srch-btn" onClick={reset}>Reset</button>
      </div>
      <div className="srch-code">{`int linearSearch(int[] arr, int key) {
  for (int i = 0; i < arr.length; i++) {
    if (arr[i] == key) return i;   // found at index i
  }
  return -1;                        // not found
}
// Time: O(n) worst/avg | O(1) best (first element)
// Space: O(1)
// Works on: unsorted AND sorted arrays`}</div>
    </div>
  );
}

// ── Binary Search ──
function SecBinary() {
  const ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const [target, setTarget] = useState(23);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(ARR.length - 1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState(-1);
  const [status, setStatus] = useState("Array must be sorted. Press Step.");
  const [done, setDone] = useState(false);
  const stateRef = useRef({ lo: 0, hi: ARR.length - 1 });

  function doStep() {
    if (done) return;
    const s = stateRef.current;
    if (s.lo > s.hi) { setStatus(`${target} not found`); setDone(true); setMid(-1); return; }
    const m = Math.floor((s.lo + s.hi) / 2);
    setMid(m); setLo(s.lo); setHi(s.hi);
    const t = parseInt(target);
    if (ARR[m] === t) {
      setFound(m); setDone(true);
      setStatus(`✅ Found ${t} at index ${m}! Only ${Math.ceil(Math.log2(ARR.length))} steps max.`);
    } else if (ARR[m] < t) {
      setStatus(`arr[${m}]=${ARR[m]} < ${t} → search RIGHT half [${m+1}..${s.hi}]`);
      stateRef.current = { lo: m + 1, hi: s.hi };
    } else {
      setStatus(`arr[${m}]=${ARR[m]} > ${t} → search LEFT half [${s.lo}..${m-1}]`);
      stateRef.current = { lo: s.lo, hi: m - 1 };
    }
  }

  function reset() {
    stateRef.current = { lo: 0, hi: ARR.length - 1 };
    setLo(0); setHi(ARR.length-1); setMid(-1); setFound(-1); setDone(false);
    setStatus("Array must be sorted. Press Step.");
  }

  return (
    <div className="srch-sec">
      <span className="srch-tag tag-green">Chapter 2</span>
      <div className="srch-h2">Binary Search</div>
      <p className="srch-p">On a <strong>sorted array</strong>, compare the target with the middle element. Eliminate half the search space each step. O(log n) — extremely fast.</p>
      <div className="srch-viz">
        <ArrCells arr={ARR} lo={lo} hi={hi} mid={mid} found={found} />
        <div style={{display:"flex",gap:16,marginTop:8,fontSize:12}}>
          <span style={{color:"var(--color-text-info)"}}>■ Search range</span>
          <span style={{color:"var(--color-text-warning)"}}>■ Mid (comparing)</span>
          <span style={{color:"var(--color-text-success)"}}>■ Found</span>
        </div>
        <div className="srch-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>Target:</span>
        <input className="srch-inp" type="number" value={target} onChange={e=>{setTarget(e.target.value);reset();}} />
        <button className="srch-btn primary" onClick={doStep} disabled={done}>Step</button>
        <button className="srch-btn" onClick={reset}>Reset</button>
      </div>
      <div className="srch-code">{`// Iterative Binary Search
int binarySearch(int[] arr, int key) {
  int lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;  // avoids overflow
    if (arr[mid] == key) return mid;
    else if (arr[mid] < key) lo = mid + 1;  // go right
    else hi = mid - 1;                       // go left
  }
  return -1; // not found
}

// Recursive Binary Search
int binarySearch(int[] arr, int lo, int hi, int key) {
  if (lo > hi) return -1;
  int mid = lo + (hi - lo) / 2;
  if (arr[mid] == key) return mid;
  if (arr[mid] < key) return binarySearch(arr, mid+1, hi, key);
  return binarySearch(arr, lo, mid-1, key);
}
// Time: O(log n) | Space: O(1) iterative, O(log n) recursive`}</div>
      <div className="srch-info"><p>For n=1,000,000: Linear search needs up to 1,000,000 comparisons. Binary search needs at most log₂(1,000,000) ≈ 20 comparisons. That's 50,000× faster!</p></div>
    </div>
  );
}

// ── Comparison & Quiz ──
function SecSearchComparison() {
  const QUESTIONS = [
    { q:"What is the time complexity of Binary Search?", opts:["O(n)","O(log n)","O(n log n)","O(1)"], ans:1 },
    { q:"Binary Search requires the array to be:", opts:["Unsorted","Sorted","Partially sorted","Random"], ans:1 },
    { q:"Linear Search worst case time complexity is:", opts:["O(1)","O(log n)","O(n)","O(n²)"], ans:2 },
    { q:"Which search is better for a small unsorted array?", opts:["Binary Search","Linear Search","Both same","Neither works"], ans:1 },
    { q:"int mid = lo + (hi - lo) / 2 is used instead of (lo+hi)/2 to:", opts:["Save memory","Avoid integer overflow","Run faster","Handle negatives"], ans:1 },
  ];
  const [answered, setAnswered] = useState(new Array(QUESTIONS.length).fill(null));
  const [done, setDone] = useState(false);
  function answer(qi, oi) {
    if (answered[qi] !== null) return;
    const next = [...answered]; next[qi] = oi;
    setAnswered(next);
    if (next.every(a => a !== null)) setDone(true);
  }
  function reset() { setAnswered(new Array(QUESTIONS.length).fill(null)); setDone(false); }
  const score = answered.filter((a,i) => a === QUESTIONS[i].ans).length;

  return (
    <div className="srch-sec">
      <span className="srch-tag tag-amber">Chapter 3</span>
      <div className="srch-h2">Comparison & Quiz</div>
      <table className="srch-tbl">
        <thead><tr><th>Feature</th><th>Linear Search</th><th>Binary Search</th></tr></thead>
        <tbody>
          <tr><td>Time (worst)</td><td style={{color:"var(--color-text-warning)"}}>O(n)</td><td style={{color:"var(--color-text-success)"}}>O(log n)</td></tr>
          <tr><td>Time (best)</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td style={{color:"var(--color-text-success)"}}>O(1)</td></tr>
          <tr><td>Space</td><td>O(1)</td><td>O(1) iterative</td></tr>
          <tr><td>Requires sorted?</td><td>No</td><td>Yes</td></tr>
          <tr><td>Works on linked list?</td><td>Yes</td><td>No (no random access)</td></tr>
          <tr><td>Best for</td><td>Small/unsorted data</td><td>Large sorted arrays</td></tr>
        </tbody>
      </table>
      <div className="srch-h3">Quiz</div>
      {QUESTIONS.map((q, qi) => (
        <div key={qi} style={{marginBottom:16,padding:14,background:"var(--color-background-secondary)",borderRadius:10}}>
          <p style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:8}}>{qi+1}. {q.q}</p>
          {q.opts.map((opt, oi) => {
            let cls = "srch-quiz-opt";
            if (answered[qi] !== null) { if (oi===q.ans) cls+=" correct"; else if (oi===answered[qi]) cls+=" wrong"; }
            return <button key={oi} className={cls} disabled={answered[qi]!==null} onClick={() => answer(qi,oi)}>{opt}</button>;
          })}
        </div>
      ))}
      {done && (
        <div style={{padding:16,background:"var(--color-background-secondary)",borderRadius:10}}>
          <div style={{fontSize:22,fontWeight:500,color:"var(--color-text-primary)"}}>{score} / {QUESTIONS.length}</div>
          <button className="srch-btn" style={{marginTop:10}} onClick={reset}>Retry</button>
        </div>
      )}
    </div>
  );
}

const CHAPTERS = [
  { id:"linear",  label:"1. Linear Search" },
  { id:"binary",  label:"2. Binary Search" },
  { id:"compare", label:"3. Comparison & Quiz" },
];

export default function Searching({ onPrev, onNext }) {
  const [active, setActive] = useState("linear");
  const curIdx = CHAPTERS.findIndex(c => c.id === active);
  function switchTab(id) { setActive(id); window.scrollTo({ top:0, behavior:"smooth" }); }
  return (
    <div className="srch-root">
      <style>{styles}</style>
      <div className="srch-wrap">
        <div className="srch-nav">
          {CHAPTERS.map(ch => (
            <button key={ch.id} className={`srch-nb${active===ch.id?" on":""}`} onClick={() => switchTab(ch.id)}>{ch.label}</button>
          ))}
        </div>
        {active === "linear"  && <SecLinear />}
        {active === "binary"  && <SecBinary />}
        {active === "compare" && <SecSearchComparison />}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:48,paddingTop:24,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
          {curIdx > 0 ? (
            <button className="srch-btn primary" onClick={() => switchTab(CHAPTERS[curIdx-1].id)}>← {CHAPTERS[curIdx-1].label}</button>
          ) : onPrev ? (
            <button className="srch-btn primary" onClick={onPrev}>← Previous Topic</button>
          ) : <div />}
          <div style={{display:"flex",gap:6}}>
            {CHAPTERS.map(ch => (
              <div key={ch.id} onClick={() => switchTab(ch.id)} style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",transition:"background .2s",background:active===ch.id?"var(--color-text-primary)":"var(--color-border-secondary)"}} />
            ))}
          </div>
          {curIdx < CHAPTERS.length-1 ? (
            <button className="srch-btn primary" onClick={() => switchTab(CHAPTERS[curIdx+1].id)}>{CHAPTERS[curIdx+1].label} →</button>
          ) : onNext ? (
            <button className="srch-btn primary" onClick={onNext}>Next Topic →</button>
          ) : <div style={{fontSize:13,color:"var(--color-text-secondary)",fontStyle:"italic"}}>✓ Complete</div>}
        </div>
      </div>
    </div>
  );
}
