import { useState, useRef, useEffect } from "react";

const styles = `
.heap-root { font-family: var(--font-sans, sans-serif); }
.heap-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.heap-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.heap-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.heap-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.heap-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes heapFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.heap-sec { animation: heapFade .2s ease; }
.heap-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.heap-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.heap-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.heap-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.heap-ul { padding-left: 18px; margin: 6px 0; }
.heap-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.heap-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; }
.heap-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.heap-btn:hover { background: var(--color-background-secondary); }
.heap-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.heap-btn.primary:hover { opacity: .85; }
.heap-btn:disabled { opacity: .4; cursor: default; }
.heap-inp { width: 80px; padding: 6px 10px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); }
.heap-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.heap-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.heap-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.heap-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.heap-tbl tr:hover td { background: var(--color-background-secondary); }
.heap-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.heap-info p { color: var(--color-text-info); font-size: 13px; }
.heap-warn { border-left: 3px solid var(--color-border-warning); padding: 10px 14px; margin: 10px 0; background: var(--color-background-warning); border-radius: 0 8px 8px 0; }
.heap-warn p { color: var(--color-text-warning); font-size: 13px; }
.heap-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.heap-arr-cell { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 6px; border: 1.5px solid var(--color-border-secondary); font-size: 13px; font-weight: 600; margin: 2px; background: var(--color-background-primary); color: var(--color-text-primary); transition: all .3s; }
.heap-arr-cell.hl { background: #e17055; border-color: #e17055; color: #fff; }
.heap-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.heap-quiz-opt:hover { background: var(--color-background-secondary); }
.heap-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.heap-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
.heap-dot-row { display: flex; justify-content: center; gap: 6px; padding: 16px 0 8px; }
.heap-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-border-secondary); cursor: pointer; transition: all .2s; }
.heap-dot.on { background: var(--color-text-primary); transform: scale(1.3); }
.heap-nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 0.5px solid var(--color-border-tertiary); margin-top: 24px; }
`;

// ── Heap SVG (7 nodes) ──
const HEAP_POS = [
  { cx:200, cy:25 },
  { cx:120, cy:80 }, { cx:280, cy:80 },
  { cx:80,  cy:135 }, { cx:160, cy:135 }, { cx:240, cy:135 }, { cx:320, cy:135 },
];
const HEAP_EDGES = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

function HeapSVG({ arr, highlighted = [] }) {
  return (
    <svg viewBox="0 0 400 170" style={{width:"100%",maxWidth:400}}>
      {HEAP_EDGES.map(([a,b]) => {
        if (a >= arr.length || b >= arr.length) return null;
        const pa = HEAP_POS[a], pb = HEAP_POS[b];
        return <line key={`${a}-${b}`} x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy} stroke="var(--color-border-secondary)" strokeWidth="2"/>;
      })}
      {arr.map((v, i) => {
        const p = HEAP_POS[i];
        const hl = highlighted.includes(i);
        return (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r="20"
              fill={hl ? "#e17055" : "var(--color-background-primary)"}
              stroke={hl ? "#e17055" : "var(--color-border-secondary)"}
              strokeWidth="2"/>
            <text x={p.cx} y={p.cy+5} textAnchor="middle" fontSize="13" fontWeight="600"
              fill={hl ? "#fff" : "var(--color-text-primary)"}>{v}</text>
            <text x={p.cx} y={p.cy+32} textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)">[{i}]</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Chapter 1: Introduction ──
function SecIntro() {
  return (
    <div className="heap-sec">
      <span className="heap-tag tag-blue">Foundation</span>
      <div className="heap-h2">What is a Heap?</div>
      <p className="heap-p">A heap is a <strong>complete binary tree</strong> that satisfies the <strong>heap property</strong>. It's stored efficiently as an array — no pointers needed!</p>
      <div className="heap-viz">
        <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-start"}}>
          <div style={{flex:1,minWidth:200}}>
            <p style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:8}}>Max-Heap: parent ≥ children</p>
            <HeapSVG arr={[90,70,80,50,60,30,40]} />
          </div>
          <div style={{flex:1,minWidth:200}}>
            <p style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:8}}>Array representation:</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:8}}>
              {[90,70,80,50,60,30,40].map((v,i) => (
                <div key={i} className="heap-arr-cell">{v}</div>
              ))}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:4}}>
              {[0,1,2,3,4,5,6].map(i => (
                <div key={i} style={{width:38,textAlign:"center",fontSize:10,color:"var(--color-text-tertiary)"}}>[{i}]</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="heap-h3">Array Index Formulas</div>
      <div className="heap-code">{`// For node at index i (0-based):
Parent:      (i - 1) / 2
Left child:  2 * i + 1
Right child: 2 * i + 2

// Example: node at index 1 (value 70)
Parent:      (1-1)/2 = 0  → value 90 ✓
Left child:  2*1+1  = 3  → value 50 ✓
Right child: 2*1+2  = 4  → value 60 ✓`}</div>
      <div className="heap-h3">Min-Heap vs Max-Heap</div>
      <table className="heap-tbl">
        <thead><tr><th>Property</th><th>Max-Heap</th><th>Min-Heap</th></tr></thead>
        <tbody>
          <tr><td>Root</td><td>Maximum element</td><td>Minimum element</td></tr>
          <tr><td>Parent rule</td><td>parent ≥ children</td><td>parent ≤ children</td></tr>
          <tr><td>Use case</td><td>Priority queue (max), Heap Sort</td><td>Dijkstra's, scheduling</td></tr>
          <tr><td>Get max/min</td><td>O(1)</td><td>O(1)</td></tr>
        </tbody>
      </table>
      <div className="heap-info"><p>KEY: A heap is NOT fully sorted — only the root is guaranteed to be max/min. Siblings have no ordering relationship.</p></div>
    </div>
  );
}

// ── Chapter 2: Heap Operations ──
function SecOperations() {
  const [heap, setHeap] = useState([90,70,80,50,60,30,40]);
  const [inp, setInp] = useState(95);
  const [highlighted, setHighlighted] = useState([]);
  const [status, setStatus] = useState("Max-Heap initialized");

  function pushVal() {
    const v = parseInt(inp);
    if (isNaN(v)) return;
    const newHeap = [...heap, v];
    // heapify up
    let i = newHeap.length - 1;
    const steps = [i];
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (newHeap[parent] < newHeap[i]) {
        [newHeap[parent], newHeap[i]] = [newHeap[i], newHeap[parent]];
        steps.push(parent);
        i = parent;
      } else break;
    }
    setHeap(newHeap);
    setHighlighted(steps);
    setStatus(`Inserted ${v}, heapified up through ${steps.length} swap(s)`);
    setTimeout(() => setHighlighted([]), 1500);
  }

  function popMax() {
    if (!heap.length) { setStatus("Heap is empty"); return; }
    const max = heap[0];
    const newHeap = [...heap];
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();
    // heapify down
    let i = 0;
    while (true) {
      const l = 2*i+1, r = 2*i+2;
      let largest = i;
      if (l < newHeap.length && newHeap[l] > newHeap[largest]) largest = l;
      if (r < newHeap.length && newHeap[r] > newHeap[largest]) largest = r;
      if (largest === i) break;
      [newHeap[i], newHeap[largest]] = [newHeap[largest], newHeap[i]];
      i = largest;
    }
    setHeap(newHeap);
    setStatus(`Removed max = ${max}, heapified down`);
  }

  return (
    <div className="heap-sec">
      <span className="heap-tag tag-green">Interactive</span>
      <div className="heap-h2">Heap Operations</div>
      <div className="heap-viz">
        <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-start"}}>
          <div style={{flex:1,minWidth:200}}>
            <HeapSVG arr={heap} highlighted={highlighted} />
          </div>
          <div style={{flex:1,minWidth:160}}>
            <p style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:6}}>Array:</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
              {heap.map((v,i) => (
                <div key={i} className={`heap-arr-cell${highlighted.includes(i)?" hl":""}`}>{v}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="heap-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <input type="number" className="heap-inp" value={inp} onChange={e=>setInp(e.target.value)} />
        <button className="heap-btn primary" onClick={pushVal}>Push</button>
        <button className="heap-btn" onClick={popMax}>Pop Max</button>
        <button className="heap-btn" onClick={() => { setHeap([90,70,80,50,60,30,40]); setStatus("Reset"); }}>Reset</button>
      </div>
      <div className="heap-h3">Heapify-Up (after insert)</div>
      <div className="heap-code">{`void heapifyUp(int[] arr, int i) {
  while (i > 0) {
    int parent = (i - 1) / 2;
    if (arr[parent] < arr[i]) {
      swap(arr, parent, i);
      i = parent;
    } else break;
  }
}
// Time: O(log n) — at most height swaps`}</div>
      <div className="heap-h3">Heapify-Down (after delete-max)</div>
      <div className="heap-code">{`void heapifyDown(int[] arr, int n, int i) {
  int largest = i;
  int l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    swap(arr, i, largest);
    heapifyDown(arr, n, largest);
  }
}
// Time: O(log n)`}</div>
    </div>
  );
}

// ── Chapter 3: Heap Sort ──
function SecHeapSort() {
  return (
    <div className="heap-sec">
      <span className="heap-tag tag-amber">Algorithm</span>
      <div className="heap-h2">Heap Sort</div>
      <p className="heap-p">Heap Sort uses a max-heap to sort in O(n log n) time with O(1) extra space — in-place!</p>
      <div className="heap-h3">Phase 1: Build Max-Heap — O(n)</div>
      <div className="heap-code">{`void buildMaxHeap(int[] arr) {
  int n = arr.length;
  // Start from last non-leaf node, heapify down
  for (int i = n/2 - 1; i >= 0; i--)
    heapifyDown(arr, n, i);
}
// Surprisingly O(n) — not O(n log n)!
// Most nodes are near leaves and need few swaps`}</div>
      <div className="heap-h3">Phase 2: Sort — O(n log n)</div>
      <div className="heap-code">{`void heapSort(int[] arr) {
  int n = arr.length;
  buildMaxHeap(arr);           // Phase 1: O(n)
  for (int i = n-1; i > 0; i--) {
    swap(arr, 0, i);           // Move max to end
    heapifyDown(arr, i, 0);    // Restore heap for remaining
  }
}
// Total: O(n) + O(n log n) = O(n log n)
// Space: O(1) — in-place!
// NOT stable — equal elements may swap`}</div>
      <table className="heap-tbl">
        <thead><tr><th>Algorithm</th><th>Time</th><th>Space</th><th>Stable</th></tr></thead>
        <tbody>
          <tr><td>Heap Sort</td><td>O(n log n)</td><td>O(1)</td><td>No</td></tr>
          <tr><td>Merge Sort</td><td>O(n log n)</td><td>O(n)</td><td>Yes</td></tr>
          <tr><td>Quick Sort</td><td>O(n log n) avg</td><td>O(log n)</td><td>No</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Chapter 4: Priority Queue ──
function SecPriorityQueue() {
  return (
    <div className="heap-sec">
      <span className="heap-tag tag-blue">Connection</span>
      <div className="heap-h2">Priority Queue</div>
      <p className="heap-p">A Priority Queue is an ADT where each element has a priority. The element with the highest (or lowest) priority is served first. <strong>Heap is the most efficient implementation.</strong></p>
      <div className="heap-code">{`// Java PriorityQueue (min-heap by default)
PriorityQueue<Integer> minPQ = new PriorityQueue<>();
minPQ.offer(30);
minPQ.offer(10);
minPQ.offer(20);
System.out.println(minPQ.poll()); // 10 (minimum)

// Max-heap using reverseOrder
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Collections.reverseOrder());
maxPQ.offer(30);
maxPQ.offer(10);
maxPQ.offer(20);
System.out.println(maxPQ.poll()); // 30 (maximum)

// Custom priority (e.g., by task priority)
PriorityQueue<int[]> taskPQ = new PriorityQueue<>((a,b) -> b[1] - a[1]);
// [taskId, priority]`}</div>
      <div className="heap-h3">Applications</div>
      <ul className="heap-ul">
        <li>Dijkstra's shortest path algorithm</li>
        <li>A* search algorithm</li>
        <li>CPU task scheduling (OS)</li>
        <li>Huffman coding (data compression)</li>
        <li>K largest/smallest elements</li>
      </ul>
    </div>
  );
}

// ── Chapter 5: Quiz ──
const QUIZ = [
  { q:"In a max-heap, the root always contains:", opts:["Minimum element","Maximum element","Median element","Any element"], ans:1 },
  { q:"What is the time complexity of inserting into a heap?", opts:["O(1)","O(log n)","O(n)","O(n log n)"], ans:1 },
  { q:"For a node at index i, its left child is at:", opts:["i+1","2i","2i+1","2i+2"], ans:2 },
  { q:"Building a heap from n elements takes:", opts:["O(n log n)","O(n)","O(log n)","O(n²)"], ans:1 },
  { q:"Heap sort is:", opts:["Stable, O(n log n)","Unstable, O(n log n)","Stable, O(n²)","Unstable, O(n²)"], ans:1 },
  { q:"Java's PriorityQueue is by default a:", opts:["Max-heap","Min-heap","Sorted array","Balanced BST"], ans:1 },
];

function SecQuiz() {
  const [answers, setAnswers] = useState({});
  function pick(i, opt) { setAnswers({...answers, [i]: opt}); }
  return (
    <div className="heap-sec">
      <span className="heap-tag tag-red">Quiz</span>
      <div className="heap-h2">Test Your Knowledge</div>
      {QUIZ.map((q, i) => {
        const chosen = answers[i];
        const correct = chosen === q.ans;
        return (
          <div key={i} style={{marginBottom:16}}>
            <p className="heap-p" style={{fontWeight:500}}>{i+1}. {q.q}</p>
            {q.opts.map((opt, oi) => (
              <button key={oi} className={`heap-quiz-opt${chosen===oi?(correct?" correct":" wrong"):""}`}
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
  { id:"intro", label:"Introduction",    comp: SecIntro },
  { id:"ops",   label:"Heap Operations", comp: SecOperations },
  { id:"sort",  label:"Heap Sort",       comp: SecHeapSort },
  { id:"pq",    label:"Priority Queue",  comp: SecPriorityQueue },
  { id:"quiz",  label:"Quiz",            comp: SecQuiz },
];

export default function Heap({ onPrev, onNext }) {
  const [ch, setCh] = useState(0);
  const Comp = CHAPTERS[ch].comp;
  return (
    <div className="heap-root">
      <style>{styles}</style>
      <div className="heap-wrap">
        <div className="heap-nav">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} className={`heap-nb${ch===i?" on":""}`} onClick={() => setCh(i)}>
              {i+1}. {c.label}
            </button>
          ))}
        </div>
        <Comp />
        <div className="heap-dot-row">
          {CHAPTERS.map((_, i) => <div key={i} className={`heap-dot${ch===i?" on":""}`} onClick={() => setCh(i)} />)}
        </div>
        <div className="heap-nav-bar">
          <button className="heap-btn" onClick={onPrev} disabled={!onPrev}>← Prev Topic</button>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Chapter {ch+1}/{CHAPTERS.length}</span>
          <button className="heap-btn primary" onClick={onNext} disabled={!onNext}>Next Topic →</button>
        </div>
      </div>
    </div>
  );
}
