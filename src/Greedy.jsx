import { useState, useRef, useEffect } from "react";

const styles = `
.greedy-root { font-family: var(--font-sans, sans-serif); }
.greedy-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.greedy-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.greedy-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.greedy-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.greedy-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes greedyFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.greedy-sec { animation: greedyFade .2s ease; }
.greedy-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.greedy-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.greedy-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.greedy-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.greedy-ul { padding-left: 18px; margin: 6px 0; }
.greedy-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.greedy-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; }
.greedy-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.greedy-btn:hover { background: var(--color-background-secondary); }
.greedy-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.greedy-btn.primary:hover { opacity: .85; }
.greedy-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.greedy-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.greedy-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.greedy-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.greedy-tbl tr:hover td { background: var(--color-background-secondary); }
.greedy-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.greedy-info p { color: var(--color-text-info); font-size: 13px; }
.greedy-warn { border-left: 3px solid var(--color-border-warning); padding: 10px 14px; margin: 10px 0; background: var(--color-background-warning); border-radius: 0 8px 8px 0; }
.greedy-warn p { color: var(--color-text-warning); font-size: 13px; }
.greedy-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.greedy-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.greedy-quiz-opt:hover { background: var(--color-background-secondary); }
.greedy-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.greedy-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
.greedy-dot-row { display: flex; justify-content: center; gap: 6px; padding: 16px 0 8px; }
.greedy-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-border-secondary); cursor: pointer; transition: all .2s; }
.greedy-dot.on { background: var(--color-text-primary); transform: scale(1.3); }
.greedy-nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 0.5px solid var(--color-border-tertiary); margin-top: 24px; }
`;

// ── Chapter 1: Introduction ──
function SecIntro() {
  return (
    <div className="greedy-sec">
      <span className="greedy-tag tag-blue">Foundation</span>
      <div className="greedy-h2">Greedy Algorithms</div>
      <p className="greedy-p">A greedy algorithm makes the <strong>locally optimal choice</strong> at each step, hoping to find a global optimum. It never reconsiders past choices.</p>
      <div className="greedy-h3">Two Key Properties Required</div>
      <div className="greedy-viz">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{background:"var(--color-background-primary)",borderRadius:8,padding:12,border:"1.5px solid var(--color-border-info)"}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--color-text-info)",marginBottom:6}}>1. Greedy Choice Property</div>
            <p style={{fontSize:13,color:"var(--color-text-secondary)"}}>A globally optimal solution can be reached by making locally optimal (greedy) choices at each step.</p>
          </div>
          <div style={{background:"var(--color-background-primary)",borderRadius:8,padding:12,border:"1.5px solid var(--color-border-success)"}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--color-text-success)",marginBottom:6}}>2. Optimal Substructure</div>
            <p style={{fontSize:13,color:"var(--color-text-secondary)"}}>An optimal solution to the problem contains optimal solutions to its subproblems.</p>
          </div>
        </div>
      </div>
      <div className="greedy-warn"><p>CAUTION: Greedy doesn't always work! For 0/1 Knapsack, greedy fails. Always prove the greedy choice property before applying.</p></div>
      <div className="greedy-h3">Greedy vs Dynamic Programming</div>
      <table className="greedy-tbl">
        <thead><tr><th>Property</th><th>Greedy</th><th>DP</th></tr></thead>
        <tbody>
          <tr><td>Choices</td><td>One greedy choice per step</td><td>All choices considered</td></tr>
          <tr><td>Speed</td><td>Usually faster</td><td>Usually slower</td></tr>
          <tr><td>Correctness</td><td>Only when greedy property holds</td><td>Always correct</td></tr>
          <tr><td>Examples</td><td>Activity selection, Huffman</td><td>0/1 Knapsack, LCS</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Chapter 2: Activity Selection ──
const ACTIVITIES = [
  { id:"A1", start:1, end:4 },
  { id:"A2", start:3, end:5 },
  { id:"A3", start:0, end:6 },
  { id:"A4", start:5, end:7 },
  { id:"A5", start:3, end:9 },
  { id:"A6", start:5, end:9 },
  { id:"A7", start:6, end:10 },
  { id:"A8", start:8, end:11 },
  { id:"A9", start:8, end:12 },
];

function activitySelection(acts) {
  const sorted = [...acts].sort((a,b) => a.end - b.end);
  const selected = [sorted[0]];
  let lastEnd = sorted[0].end;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start >= lastEnd) {
      selected.push(sorted[i]);
      lastEnd = sorted[i].end;
    }
  }
  return selected.map(a => a.id);
}

function SecActivitySelection() {
  const selected = activitySelection(ACTIVITIES);
  const maxTime = 13;
  return (
    <div className="greedy-sec">
      <span className="greedy-tag tag-green">Interactive</span>
      <div className="greedy-h2">Activity Selection Problem</div>
      <p className="greedy-p">Given activities with start/end times, select the maximum number of non-overlapping activities. <strong>Greedy: always pick the activity that ends earliest.</strong></p>
      <div className="greedy-viz">
        <div style={{overflowX:"auto"}}>
          {ACTIVITIES.map(a => {
            const isSel = selected.includes(a.id);
            const left = (a.start / maxTime) * 100;
            const width = ((a.end - a.start) / maxTime) * 100;
            return (
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontSize:11,minWidth:24,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)"}}>{a.id}</span>
                <div style={{flex:1,height:22,position:"relative",background:"var(--color-background-primary)",borderRadius:4,border:"1px solid var(--color-border-tertiary)"}}>
                  <div style={{
                    position:"absolute",left:`${left}%`,width:`${width}%`,height:"100%",
                    background: isSel ? "#f9ca24" : "var(--color-background-secondary)",
                    border: isSel ? "1.5px solid #f9ca24" : "1px solid var(--color-border-secondary)",
                    borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:10,fontWeight:600,color: isSel ? "#333" : "var(--color-text-tertiary)"
                  }}>
                    {a.start}-{a.end}
                  </div>
                </div>
                {isSel && <span style={{fontSize:10,color:"#f9ca24",fontWeight:700}}>✓</span>}
              </div>
            );
          })}
        </div>
        <p className="greedy-status">Selected: [{selected.join(", ")}] — {selected.length} activities (maximum possible)</p>
      </div>
      <div className="greedy-code">{`// Sort by finish time, then greedily select
List<int[]> activitySelection(int[][] acts) {
  Arrays.sort(acts, (a,b) -> a[1] - b[1]); // sort by end time
  List<int[]> result = new ArrayList<>();
  int lastEnd = -1;
  for (int[] act : acts) {
    if (act[0] >= lastEnd) { // start >= last end
      result.add(act);
      lastEnd = act[1];
    }
  }
  return result;
}
// Time: O(n log n) for sorting + O(n) for selection`}</div>
    </div>
  );
}

// ── Chapter 3: Fractional Knapsack ──
function SecKnapsack() {
  return (
    <div className="greedy-sec">
      <span className="greedy-tag tag-amber">Algorithm</span>
      <div className="greedy-h2">Fractional Knapsack</div>
      <p className="greedy-p">Unlike 0/1 Knapsack, you can take <strong>fractions</strong> of items. Greedy works here: sort by value/weight ratio, take as much as possible of the highest ratio item.</p>
      <div className="greedy-code">{`// Items: {weight, value}
// Capacity: W
double fractionalKnapsack(int[][] items, int W) {
  // Sort by value/weight ratio (descending)
  Arrays.sort(items, (a,b) -> Double.compare(
    (double)b[1]/b[0], (double)a[1]/a[0]));

  double totalValue = 0;
  int remaining = W;

  for (int[] item : items) {
    if (remaining <= 0) break;
    int take = Math.min(item[0], remaining);
    totalValue += (double) take / item[0] * item[1];
    remaining -= take;
  }
  return totalValue;
}
// Time: O(n log n)
// WHY greedy works: taking highest ratio first maximizes value per unit weight`}</div>
      <div className="greedy-h3">Example</div>
      <table className="greedy-tbl">
        <thead><tr><th>Item</th><th>Weight</th><th>Value</th><th>Ratio</th><th>Take</th></tr></thead>
        <tbody>
          <tr><td>A</td><td>10</td><td>60</td><td>6.0</td><td>10 (full)</td></tr>
          <tr><td>B</td><td>20</td><td>100</td><td>5.0</td><td>20 (full)</td></tr>
          <tr><td>C</td><td>30</td><td>120</td><td>4.0</td><td>20 (2/3)</td></tr>
        </tbody>
      </table>
      <p className="greedy-p">Capacity=50: Take all of A (10kg, $60) + all of B (20kg, $100) + 2/3 of C (20kg, $80) = Total: $240</p>
    </div>
  );
}

// ── Chapter 4: Huffman Coding ──
function SecHuffman() {
  return (
    <div className="greedy-sec">
      <span className="greedy-tag tag-blue">Concept</span>
      <div className="greedy-h2">Huffman Coding</div>
      <p className="greedy-p">Huffman coding is a greedy algorithm for lossless data compression. Frequent characters get shorter codes, rare characters get longer codes.</p>
      <div className="greedy-code">{`// Algorithm:
// 1. Count frequency of each character
// 2. Create a min-heap of (frequency, char) nodes
// 3. Repeatedly: extract 2 minimum nodes, merge them
//    into a new node with combined frequency
// 4. Repeat until 1 node remains (the root)
// 5. Assign 0 for left branch, 1 for right branch

// Example: "ABRACADABRA"
// Frequencies: A=5, B=2, R=2, C=1, D=1
// Huffman codes:
//   A → 0       (most frequent → shortest)
//   B → 110
//   R → 111
//   C → 100
//   D → 101
// Original: 11 chars × 8 bits = 88 bits
// Compressed: 5×1 + 2×3 + 2×3 + 1×3 + 1×3 = 23 bits
// Compression ratio: 23/88 ≈ 26%!`}</div>
      <div className="greedy-info"><p>Huffman coding is optimal for character-by-character encoding. It's used in ZIP, JPEG, MP3, and many other compression formats.</p></div>
    </div>
  );
}

// ── Chapter 5: Quiz ──
const QUIZ = [
  { q:"Greedy algorithms make choices that are:", opts:["Globally optimal","Locally optimal","Random","Exhaustive"], ans:1 },
  { q:"Activity selection greedy strategy: pick activity with:", opts:["Earliest start","Latest start","Earliest finish","Latest finish"], ans:2 },
  { q:"Fractional Knapsack greedy: sort by:", opts:["Weight","Value","Value/Weight ratio","Weight/Value ratio"], ans:2 },
  { q:"Greedy works for 0/1 Knapsack?", opts:["Yes","No","Sometimes","Only for small n"], ans:1 },
  { q:"Huffman coding is used for:", opts:["Sorting","Data compression","Graph traversal","Searching"], ans:1 },
  { q:"Time complexity of Activity Selection (with sorting):", opts:["O(n)","O(n log n)","O(n²)","O(2ⁿ)"], ans:1 },
];

function SecQuiz() {
  const [answers, setAnswers] = useState({});
  function pick(i, opt) { setAnswers({...answers, [i]: opt}); }
  return (
    <div className="greedy-sec">
      <span className="greedy-tag tag-red">Quiz</span>
      <div className="greedy-h2">Test Your Knowledge</div>
      {QUIZ.map((q, i) => {
        const chosen = answers[i];
        const correct = chosen === q.ans;
        return (
          <div key={i} style={{marginBottom:16}}>
            <p className="greedy-p" style={{fontWeight:500}}>{i+1}. {q.q}</p>
            {q.opts.map((opt, oi) => (
              <button key={oi} className={`greedy-quiz-opt${chosen===oi?(correct?" correct":" wrong"):""}`}
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
  { id:"intro",  label:"Introduction",       comp: SecIntro },
  { id:"act",    label:"Activity Selection", comp: SecActivitySelection },
  { id:"knap",   label:"Frac. Knapsack",     comp: SecKnapsack },
  { id:"huff",   label:"Huffman Coding",     comp: SecHuffman },
  { id:"quiz",   label:"Quiz",               comp: SecQuiz },
];

export default function Greedy({ onPrev, onNext, onChapterChange }) {
  const [ch, setCh] = useState(0);
  const Comp = CHAPTERS[ch].comp;
  return (
    <div className="greedy-root">
      <style>{styles}</style>
      <div className="greedy-wrap">
        <div className="greedy-nav">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} className={`greedy-nb${ch===i?" on":""}`} onClick={() => setCh(i)}>
              {i+1}. {c.label}
            </button>
          ))}
        </div>
        <Comp />
        <div className="greedy-dot-row">
          {CHAPTERS.map((_, i) => <div key={i} className={`greedy-dot${ch===i?" on":""}`} onClick={() => setCh(i)} />)}
        </div>
        <div className="greedy-nav-bar">
          <button className="greedy-btn" onClick={onPrev} disabled={!onPrev}>← Prev Topic</button>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Chapter {ch+1}/{CHAPTERS.length}</span>
          <button className="greedy-btn primary" onClick={onNext} disabled={!onNext}>Next Topic →</button>
        </div>
      </div>
    </div>
  );
}
