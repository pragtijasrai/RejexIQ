import { useState, useRef, useEffect } from "react";

const styles = `
.sort-root { font-family: var(--font-sans, sans-serif); }
.sort-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.sort-nav { display:flex; flex-wrap:wrap; gap:6px; padding:16px 0 20px; border-bottom:0.5px solid var(--color-border-tertiary); margin-bottom:24px; }
.sort-nb { padding:6px 14px; font-size:12px; border-radius:20px; border:0.5px solid var(--color-border-secondary); background:transparent; color:var(--color-text-secondary); cursor:pointer; transition:all .15s; }
.sort-nb:hover { background:var(--color-background-secondary); color:var(--color-text-primary); }
.sort-nb.on { background:var(--color-text-primary); color:var(--color-background-primary); border-color:transparent; }
@keyframes sortFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.sort-sec { animation:sortFade .2s ease; }
.sort-tag { display:inline-block; font-size:11px; padding:2px 10px; border-radius:12px; margin-bottom:12px; font-weight:500; }
.tag-blue   { background:var(--color-background-info);    color:var(--color-text-info); }
.tag-green  { background:var(--color-background-success); color:var(--color-text-success); }
.tag-amber  { background:var(--color-background-warning); color:var(--color-text-warning); }
.tag-red    { background:var(--color-background-danger);  color:var(--color-text-danger); }
.tag-purple { background:#f0ebff; color:#7B52E8; }
.sort-h2 { font-size:20px; font-weight:500; color:var(--color-text-primary); margin-bottom:6px; }
.sort-h3 { font-size:15px; font-weight:500; color:var(--color-text-primary); margin:16px 0 8px; }
.sort-p  { font-size:14px; line-height:1.7; color:var(--color-text-secondary); margin-bottom:8px; }
.sort-ul { padding-left:18px; margin:6px 0; }
.sort-ul li { font-size:14px; line-height:1.7; color:var(--color-text-secondary); margin-bottom:3px; }
.sort-viz { background:var(--color-background-secondary); border-radius:12px; padding:20px; margin:14px 0; min-height:80px; }
.sort-btn { padding:7px 16px; font-size:13px; border-radius:8px; border:0.5px solid var(--color-border-secondary); background:transparent; color:var(--color-text-primary); cursor:pointer; transition:all .15s; margin:4px 2px; }
.sort-btn:hover { background:var(--color-background-secondary); }
.sort-btn.primary { background:var(--color-text-primary); color:var(--color-background-primary); border-color:transparent; }
.sort-btn.primary:hover { opacity:.85; }
.sort-btn:disabled { opacity:.4; cursor:default; }
.sort-inp { width:80px; padding:6px 10px; font-size:13px; border-radius:8px; border:0.5px solid var(--color-border-secondary); background:var(--color-background-primary); color:var(--color-text-primary); }
.sort-code { background:var(--color-background-secondary); border-radius:8px; padding:12px 14px; margin:10px 0; font-family:var(--font-mono,monospace); font-size:12px; line-height:1.6; color:var(--color-text-primary); overflow-x:auto; border:0.5px solid var(--color-border-tertiary); white-space:pre; }
.sort-tbl { width:100%; border-collapse:collapse; margin:10px 0; font-size:13px; }
.sort-tbl th { text-align:left; padding:8px 10px; background:var(--color-background-secondary); color:var(--color-text-primary); font-weight:500; }
.sort-tbl td { padding:7px 10px; border-top:0.5px solid var(--color-border-tertiary); color:var(--color-text-secondary); }
.sort-tbl tr:hover td { background:var(--color-background-secondary); }
.sort-info { border-left:3px solid var(--color-border-info); padding:10px 14px; margin:10px 0; background:var(--color-background-info); border-radius:0 8px 8px 0; }
.sort-info p { color:var(--color-text-info); font-size:13px; }
.sort-warn { border-left:3px solid var(--color-border-warning); padding:10px 14px; margin:10px 0; background:var(--color-background-warning); border-radius:0 8px 8px 0; }
.sort-warn p { color:var(--color-text-warning); font-size:13px; }
.sort-2col { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:10px 0; }
.sort-card { background:var(--color-background-secondary); border-radius:10px; padding:12px; }
.sort-card h4 { font-size:13px; font-weight:500; color:var(--color-text-primary); margin-bottom:6px; }
.sort-status { font-size:13px; color:var(--color-text-secondary); margin-top:8px; min-height:20px; font-style:italic; }
.sort-bar-wrap { display:flex; align-items:flex-end; gap:3px; height:140px; padding:8px 0; }
.sort-bar { border-radius:4px 4px 0 0; transition:all .3s; display:flex; align-items:flex-end; justify-content:center; padding-bottom:3px; font-size:10px; font-weight:600; min-width:28px; }
.sort-quiz-opt { display:block; width:100%; text-align:left; padding:10px 14px; margin:6px 0; border-radius:8px; border:0.5px solid var(--color-border-secondary); background:transparent; color:var(--color-text-primary); font-size:14px; cursor:pointer; transition:all .15s; font-family:var(--font-sans,sans-serif); }
.sort-quiz-opt:hover { background:var(--color-background-secondary); }
.sort-quiz-opt.correct { background:var(--color-background-success); border-color:var(--color-border-success); color:var(--color-text-success); }
.sort-quiz-opt.wrong   { background:var(--color-background-danger);  border-color:var(--color-border-danger);  color:var(--color-text-danger); }
@media(max-width:500px){ .sort-2col{grid-template-columns:1fr;} }
`;

function Bars({ arr, comparing = [], sorted = [], pivot = -1 }) {
  const max = Math.max(...arr, 1);
  const colors = arr.map((_, i) => {
    if (sorted.includes(i)) return "var(--color-text-success)";
    if (i === pivot) return "var(--color-text-warning)";
    if (comparing.includes(i)) return "var(--color-text-info)";
    return "var(--color-border-secondary)";
  });
  return (
    <div className="sort-bar-wrap">
      {arr.map((v, i) => (
        <div key={i} className="sort-bar"
          style={{ height: `${(v / max) * 120}px`, background: colors[i], color: colors[i] === "var(--color-border-secondary)" ? "var(--color-text-secondary)" : "#fff" }}>
          {v}
        </div>
      ))}
    </div>
  );
}

function SecBubble() {
  const INIT = [64, 34, 25, 12, 22, 11, 90];
  const [arr, setArr] = useState([...INIT]);
  const [cmp, setCmp] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [status, setStatus] = useState("Press Step or Auto to visualize");
  const stateRef = useRef({ arr: [...INIT], i: 0, j: 0, sorted: [] });
  const timerRef = useRef(null);

  function step() {
    const s = stateRef.current;
    const n = s.arr.length;
    if (s.i >= n - 1) { setSorted(s.arr.map((_,i)=>i)); setStatus("✓ Sorted!"); setCmp([]); return; }
    if (s.j >= n - 1 - s.i) {
      s.sorted = [...s.sorted, n - 1 - s.i];
      setSorted([...s.sorted]);
      s.i++; s.j = 0;
    }
    const a = [...s.arr];
    setCmp([s.j, s.j + 1]);
    if (a[s.j] > a[s.j + 1]) {
      [a[s.j], a[s.j + 1]] = [a[s.j + 1], a[s.j]];
      s.arr = a; setArr([...a]);
      setStatus(`Swapped ${a[s.j+1]} and ${a[s.j]} at positions ${s.j} & ${s.j+1}`);
    } else {
      setStatus(`No swap: ${a[s.j]} ≤ ${a[s.j+1]}`);
    }
    s.j++;
  }

  function auto() {
    reset();
    timerRef.current = setInterval(() => {
      const s = stateRef.current;
      if (s.i >= s.arr.length - 1) { clearInterval(timerRef.current); return; }
      step();
    }, 500);
  }

  function reset() {
    clearInterval(timerRef.current);
    stateRef.current = { arr: [...INIT], i: 0, j: 0, sorted: [] };
    setArr([...INIT]); setCmp([]); setSorted([]); setStatus("Press Step or Auto to visualize");
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="sort-sec">
      <span className="sort-tag tag-blue">Chapter 1</span>
      <div className="sort-h2">Bubble Sort</div>
      <p className="sort-p">Repeatedly compare adjacent elements and swap if out of order. After each pass, the largest unsorted element "bubbles up" to its correct position.</p>
      <div className="sort-viz">
        <Bars arr={arr} comparing={cmp} sorted={sorted} />
        <div className="sort-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <button className="sort-btn primary" onClick={step}>Step</button>
        <button className="sort-btn" onClick={auto}>Auto Play</button>
        <button className="sort-btn" onClick={reset}>Reset</button>
      </div>
      <div className="sort-h3">Algorithm</div>
      <div className="sort-code">{`void bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}
`}</div>
      <div className="sort-info"><p>OPTIMIZATION: Add a boolean flag. If no swaps occur in a full pass, the array is already sorted → break early. Best case becomes O(n).</p></div>
    </div>
  );
}

function SecSelection() {
  const INIT = [64, 25, 12, 22, 11];
  const [arr, setArr] = useState([...INIT]);
  const [cmp, setCmp] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [minIdx, setMinIdx] = useState(-1);
  const [status, setStatus] = useState("Press Step to visualize");
  const stateRef = useRef({ arr: [...INIT], i: 0, sorted: [] });
  const timerRef = useRef(null);

  function step() {
    const s = stateRef.current;
    const a = [...s.arr];
    const n = a.length;
    if (s.i >= n - 1) { setSorted(a.map((_,i)=>i)); setStatus("✓ Sorted!"); setCmp([]); setMinIdx(-1); return; }
    let mi = s.i;
    for (let k = s.i + 1; k < n; k++) if (a[k] < a[mi]) mi = k;
    setCmp(Array.from({length: n - s.i}, (_, k) => s.i + k));
    setMinIdx(mi);
    if (mi !== s.i) { [a[s.i], a[mi]] = [a[mi], a[s.i]]; s.arr = a; setArr([...a]); }
    s.sorted = [...s.sorted, s.i];
    setSorted([...s.sorted]);
    setStatus(`Pass ${s.i+1}: min=${a[s.i]} at idx ${mi}, placed at idx ${s.i}`);
    s.i++;
  }

  function reset() {
    clearInterval(timerRef.current);
    stateRef.current = { arr: [...INIT], i: 0, sorted: [] };
    setArr([...INIT]); setCmp([]); setSorted([]); setMinIdx(-1); setStatus("Press Step to visualize");
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="sort-sec">
      <span className="sort-tag tag-green">Chapter 2</span>
      <div className="sort-h2">Selection Sort</div>
      <p className="sort-p">Find the minimum element in the unsorted portion and place it at the beginning. Repeat for the remaining unsorted portion.</p>
      <div className="sort-viz">
        <Bars arr={arr} comparing={cmp} sorted={sorted} pivot={minIdx} />
        <div className="sort-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <button className="sort-btn primary" onClick={step}>Step</button>
        <button className="sort-btn" onClick={reset}>Reset</button>
      </div>
      <div className="sort-code">{`void selectionSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++)
      if (arr[j] < arr[minIdx]) minIdx = j;
    
    int temp = arr[minIdx];
    arr[minIdx] = arr[i];
    arr[i] = temp;
  }
}
`}</div>
    </div>
  );
}

function SecInsertion() {
  return (
    <div className="sort-sec">
      <span className="sort-tag tag-amber">Chapter 3</span>
      <div className="sort-h2">Insertion Sort</div>
      <p className="sort-p">Build the sorted array one element at a time. Pick each element and insert it into its correct position among the already-sorted elements.</p>
      <div className="sort-code">{`void insertionSort(int[] arr) {
  int n = arr.length;
  for (int i = 1; i < n; i++) {
    int key = arr[i];   
    int j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;   
  }
}
`}</div>
      <div className="sort-info"><p>Insertion sort is the fastest O(n²) sort for small n (≤ 20) and nearly-sorted data. Java's Arrays.sort() uses it for small subarrays within TimSort.</p></div>
      <div className="sort-h3">Trace: [5, 3, 4, 1, 2]</div>
      <div className="sort-code">{`Pass 1: key=3 → [3, 5, 4, 1, 2]
Pass 2: key=4 → [3, 4, 5, 1, 2]
Pass 3: key=1 → [1, 3, 4, 5, 2]
Pass 4: key=2 → [1, 2, 3, 4, 5] ✓`}</div>
    </div>
  );
}

function SecMerge() {
  return (
    <div className="sort-sec">
      <span className="sort-tag tag-blue">Chapter 4</span>
      <div className="sort-h2">Merge Sort</div>
      <p className="sort-p">Divide the array in half, recursively sort each half, then merge the two sorted halves. Classic divide-and-conquer. Guaranteed O(n log n).</p>
      <div className="sort-viz">
        <svg viewBox="0 0 560 200" style={{width:"100%"}} xmlns="http://www.w3.org/2000/svg">
          {}
          <rect x="180" y="10" width="200" height="28" rx="6" fill="var(--color-background-info)" stroke="var(--color-border-info)" strokeWidth="1"/>
          <text x="280" y="29" textAnchor="middle" fontSize="12" fill="var(--color-text-info)" fontWeight="500">[38, 27, 43, 3, 9, 82]</text>
          {}
          <rect x="60"  y="60" width="160" height="28" rx="6" fill="var(--color-background-success)" stroke="var(--color-border-success)" strokeWidth="1"/>
          <text x="140" y="79" textAnchor="middle" fontSize="12" fill="var(--color-text-success)" fontWeight="500">[38, 27, 43]</text>
          <rect x="340" y="60" width="160" height="28" rx="6" fill="var(--color-background-success)" stroke="var(--color-border-success)" strokeWidth="1"/>
          <text x="420" y="79" textAnchor="middle" fontSize="12" fill="var(--color-text-success)" fontWeight="500">[3, 9, 82]</text>
          {}
          <rect x="20"  y="115" width="70" height="26" rx="5" fill="var(--color-background-warning)" stroke="var(--color-border-warning)" strokeWidth="1"/>
          <text x="55"  y="132" textAnchor="middle" fontSize="11" fill="var(--color-text-warning)">[38]</text>
          <rect x="105" y="115" width="90" height="26" rx="5" fill="var(--color-background-warning)" stroke="var(--color-border-warning)" strokeWidth="1"/>
          <text x="150" y="132" textAnchor="middle" fontSize="11" fill="var(--color-text-warning)">[27, 43]</text>
          <rect x="310" y="115" width="70" height="26" rx="5" fill="var(--color-background-warning)" stroke="var(--color-border-warning)" strokeWidth="1"/>
          <text x="345" y="132" textAnchor="middle" fontSize="11" fill="var(--color-text-warning)">[3]</text>
          <rect x="395" y="115" width="90" height="26" rx="5" fill="var(--color-background-warning)" stroke="var(--color-border-warning)" strokeWidth="1"/>
          <text x="440" y="132" textAnchor="middle" fontSize="11" fill="var(--color-text-warning)">[9, 82]</text>
          {}
          <rect x="140" y="168" width="280" height="26" rx="5" fill="var(--color-background-info)" stroke="var(--color-border-info)" strokeWidth="1"/>
          <text x="280" y="185" textAnchor="middle" fontSize="12" fill="var(--color-text-info)" fontWeight="500">Merge → [3, 9, 27, 38, 43, 82] ✓</text>
          {}
          <line x1="240" y1="38" x2="180" y2="60" stroke="var(--color-border-tertiary)" strokeWidth="1" markerEnd="url(#ma)"/>
          <line x1="320" y1="38" x2="380" y2="60" stroke="var(--color-border-tertiary)" strokeWidth="1" markerEnd="url(#ma)"/>
          <defs><marker id="ma" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="var(--color-border-tertiary)" strokeWidth="1.5"/></marker></defs>
        </svg>
      </div>
      <div className="sort-code">{`void mergeSort(int[] arr, int l, int r) {
  if (l >= r) return;           
  int mid = (l + r) / 2;
  mergeSort(arr, l, mid);       
  mergeSort(arr, mid + 1, r);   
  merge(arr, l, mid, r);        
}

void merge(int[] arr, int l, int mid, int r) {
  int[] temp = new int[r - l + 1];
  int i = l, j = mid + 1, k = 0;
  while (i <= mid && j <= r)
    temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
  while (i <= mid) temp[k++] = arr[i++];
  while (j <= r)   temp[k++] = arr[j++];
  for (int x = 0; x < temp.length; x++) arr[l + x] = temp[x];
}
`}</div>
    </div>
  );
}

function SecQuick() {
  return (
    <div className="sort-sec">
      <span className="sort-tag tag-red">Chapter 5</span>
      <div className="sort-h2">Quick Sort</div>
      <p className="sort-p">Pick a pivot, partition the array so all elements less than pivot are on the left and greater on the right, then recursively sort both sides.</p>
      <div className="sort-code">{`void quickSort(int[] arr, int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);   
    quickSort(arr, pi + 1, high);  
  }
}

int partition(int[] arr, int low, int high) {
  int pivot = arr[high];  
  int i = low - 1;        
  for (int j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
  }
  
  int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;
  return i + 1;
}
`}</div>
      <div className="sort-warn"><p>WORST CASE: If the array is already sorted and you always pick the last element as pivot, every partition creates one empty side → O(n²). Fix: randomize the pivot.</p></div>
      <div className="sort-h3">Trace: [3, 6, 8, 10, 1, 2, 1] pivot=1</div>
      <div className="sort-code">{`Initial:   [3, 6, 8, 10, 1, 2, 1]  pivot=1 (last)
After partition: [1, 1, 8, 10, 3, 2, 6]  pivot at idx 1
Left:  [1]  → already sorted
Right: [8, 10, 3, 2, 6] → recurse`}</div>
    </div>
  );
}

function SecSortingComparison() {
  const QUESTIONS = [
    { q:"Which sorting algorithm has O(n log n) guaranteed time complexity?", opts:["Quick Sort","Bubble Sort","Merge Sort","Selection Sort"], ans:2 },
    { q:"Which sort is best for nearly-sorted small arrays?", opts:["Merge Sort","Quick Sort","Insertion Sort","Heap Sort"], ans:2 },
    { q:"Which sorting algorithm is NOT stable?", opts:["Bubble Sort","Insertion Sort","Merge Sort","Quick Sort"], ans:3 },
    { q:"What is the space complexity of Merge Sort?", opts:["O(1)","O(log n)","O(n)","O(n²)"], ans:2 },
    { q:"Quick Sort worst case occurs when:", opts:["Array is random","Array is already sorted","Array has duplicates","Array is reversed"], ans:1 },
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
    <div className="sort-sec">
      <span className="sort-tag tag-purple">Chapter 6</span>
      <div className="sort-h2">Comparison & Quiz</div>
      <table className="sort-tbl">
        <thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead>
        <tbody>
          <tr><td>Bubble Sort</td><td style={{color:"var(--color-text-success)"}}>O(n)</td><td style={{color:"var(--color-text-warning)"}}>O(n²)</td><td style={{color:"var(--color-text-danger)"}}>O(n²)</td><td>O(1)</td><td>✅</td></tr>
          <tr><td>Selection Sort</td><td style={{color:"var(--color-text-warning)"}}>O(n²)</td><td style={{color:"var(--color-text-warning)"}}>O(n²)</td><td style={{color:"var(--color-text-danger)"}}>O(n²)</td><td>O(1)</td><td>❌</td></tr>
          <tr><td>Insertion Sort</td><td style={{color:"var(--color-text-success)"}}>O(n)</td><td style={{color:"var(--color-text-warning)"}}>O(n²)</td><td style={{color:"var(--color-text-danger)"}}>O(n²)</td><td>O(1)</td><td>✅</td></tr>
          <tr><td>Merge Sort</td><td style={{color:"var(--color-text-success)"}}>O(n log n)</td><td style={{color:"var(--color-text-success)"}}>O(n log n)</td><td style={{color:"var(--color-text-success)"}}>O(n log n)</td><td>O(n)</td><td>✅</td></tr>
          <tr><td>Quick Sort</td><td style={{color:"var(--color-text-success)"}}>O(n log n)</td><td style={{color:"var(--color-text-success)"}}>O(n log n)</td><td style={{color:"var(--color-text-danger)"}}>O(n²)</td><td>O(log n)</td><td>❌</td></tr>
        </tbody>
      </table>
      <div className="sort-h3">Quiz</div>
      {QUESTIONS.map((q, qi) => (
        <div key={qi} style={{marginBottom:16,padding:14,background:"var(--color-background-secondary)",borderRadius:10}}>
          <p style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:8}}>{qi+1}. {q.q}</p>
          {q.opts.map((opt, oi) => {
            let cls = "sort-quiz-opt";
            if (answered[qi] !== null) { if (oi===q.ans) cls+=" correct"; else if (oi===answered[qi]) cls+=" wrong"; }
            return <button key={oi} className={cls} disabled={answered[qi]!==null} onClick={() => answer(qi,oi)}>{opt}</button>;
          })}
        </div>
      ))}
      {done && (
        <div style={{padding:16,background:"var(--color-background-secondary)",borderRadius:10}}>
          <div style={{fontSize:22,fontWeight:500,color:"var(--color-text-primary)"}}>{score} / {QUESTIONS.length}</div>
          <button className="sort-btn" style={{marginTop:10}} onClick={reset}>Retry</button>
        </div>
      )}
    </div>
  );
}

const CHAPTERS = [
  { id:"bubble",    label:"1. Bubble Sort" },
  { id:"selection", label:"2. Selection Sort" },
  { id:"insertion", label:"3. Insertion Sort" },
  { id:"merge",     label:"4. Merge Sort" },
  { id:"quick",     label:"5. Quick Sort" },
  { id:"compare",   label:"6. Comparison & Quiz" },
];

export default function Sorting({ onPrev, onNext, onChapterChange }) {
  const [active, setActive] = useState("bubble");
  const curIdx = CHAPTERS.findIndex(c => c.id === active);
  useEffect(() => { onChapterChange?.(curIdx, CHAPTERS.length); }, [active]);
  function switchTab(id) { const newIdx = CHAPTERS.findIndex(c => c.id === id); onChapterChange?.(newIdx, CHAPTERS.length); setActive(id); window.scrollTo({ top:0, behavior:"smooth" }); }
  return (
    <div className="sort-root">
      <style>{styles}</style>
      <div className="sort-wrap">
        <div className="sort-nav">
          {CHAPTERS.map(ch => (
            <button key={ch.id} className={`sort-nb${active===ch.id?" on":""}`} onClick={() => switchTab(ch.id)}>{ch.label}</button>
          ))}
        </div>
        {active === "bubble"    && <SecBubble />}
        {active === "selection" && <SecSelection />}
        {active === "insertion" && <SecInsertion />}
        {active === "merge"     && <SecMerge />}
        {active === "quick"     && <SecQuick />}
        {active === "compare"   && <SecSortingComparison />}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:48,paddingTop:24,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
          {curIdx > 0 ? (
            <button className="sort-btn primary" onClick={() => switchTab(CHAPTERS[curIdx-1].id)}>← {CHAPTERS[curIdx-1].label}</button>
          ) : onPrev ? (
            <button className="sort-btn primary" onClick={onPrev}>← Previous Topic</button>
          ) : <div />}
          <div style={{display:"flex",gap:6}}>
            {CHAPTERS.map(ch => (
              <div key={ch.id} onClick={() => switchTab(ch.id)} style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",transition:"background .2s",background:active===ch.id?"var(--color-text-primary)":"var(--color-border-secondary)"}} />
            ))}
          </div>
          {curIdx < CHAPTERS.length-1 ? (
            <button className="sort-btn primary" onClick={() => switchTab(CHAPTERS[curIdx+1].id)}>{CHAPTERS[curIdx+1].label} →</button>
          ) : onNext ? (
            <button className="sort-btn primary" onClick={onNext}>Next Topic →</button>
          ) : <div style={{fontSize:13,color:"var(--color-text-secondary)",fontStyle:"italic"}}>✓ Complete</div>}
        </div>
      </div>
    </div>
  );
}
