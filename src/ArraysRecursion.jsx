import { useState, useEffect } from "react";

const styles = `
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --c1: #1a6fbd; --c2: #0f9b6e; --c3: #b85c00; --c4: #7b3fcf; --c5: #c0392b;
  --card: var(--color-background-primary); --bg: var(--color-background-secondary);
  --border: var(--color-border-tertiary); --border2: var(--color-border-secondary);
  --txt: var(--color-text-primary); --muted: var(--color-text-secondary);
  --mono: var(--font-mono); --code-bg: #161b22;
  --kw:#e06c75; --fn:#61afef; --str:#98c379; --num:#d19a66; --cmt:#5c6370; --typ:#e5c07b;
}
.arr-root { font-family: var(--font-sans); background: transparent; color: var(--txt); padding-bottom: 48px; }
.wrap { max-width: 880px; margin: 0 auto; }
.nav { display: flex; gap: 6px; flex-wrap: wrap; padding: 14px 0 18px; border-bottom: 0.5px solid var(--border); margin-bottom: 24px; }
.nb { font-size: 12px; font-weight: 500; padding: 5px 13px; border-radius: 20px; border: 0.5px solid var(--border); background: var(--bg); color: var(--muted); cursor: pointer; transition: all .18s; }
.nb:hover { color: var(--txt); background: var(--card); }
.nb.on { color: #fff; border-color: transparent; }
.nb.on[data-c="1"] { background: var(--c1); }
.nb.on[data-c="2"] { background: var(--c2); }
.nb.on[data-c="3"] { background: var(--c3); }
.nb.on[data-c="4"] { background: var(--c4); }
.nb.on[data-c="5"] { background: var(--c5); }
@keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.section-fade { animation: fadeUp .28s ease; }
.stag { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; margin-bottom: 10px; }
.s1 { background:#dbeafe; color:var(--c1); } .s2 { background:#d1fae5; color:var(--c2); }
.s3 { background:#fef3c7; color:var(--c3); } .s4 { background:#ede9fe; color:var(--c4); }
.s5 { background:#fee2e2; color:var(--c5); }
.stitle { font-size: 26px; font-weight: 500; margin-bottom: 8px; }
.sdesc { font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 700px; margin-bottom: 24px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 20px 0; }
.grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin: 20px 0; }
.card { background: var(--card); border: 0.5px solid var(--border); border-radius: 12px; padding: 18px; }
.card:hover { border-color: var(--border2); }
.card h4 { font-size: 14px; font-weight: 500; margin-bottom: 6px; }
.card p { font-size: 13px; color: var(--muted); line-height: 1.6; }
.card-blue { border-left: 3px solid var(--c1); border-radius: 0 12px 12px 0; }
.card-green { border-left: 3px solid var(--c2); border-radius: 0 12px 12px 0; }
.card-amber { border-left: 3px solid var(--c3); border-radius: 0 12px 12px 0; }
.card-purple { border-left: 3px solid var(--c4); border-radius: 0 12px 12px 0; }
.card-red { border-left: 3px solid var(--c5); border-radius: 0 12px 12px 0; }
pre.code { background: var(--code-bg); border-radius: 10px; padding: 16px 18px; font-family: var(--mono); font-size: 12.5px; line-height: 1.85; overflow-x: auto; color: #abb2bf; margin: 16px 0; }
.kw{color:var(--kw)} .fn{color:var(--fn)} .str{color:var(--str)} .num{color:var(--num)} .cmt{color:var(--cmt);font-style:italic} .typ{color:var(--typ)}
.ch { background: var(--code-bg); border-radius: 10px; overflow: hidden; margin: 16px 0; }
.ch-hd { display: flex; align-items: center; gap: 6px; padding: 9px 14px; background: rgba(255,255,255,.04); border-bottom: 0.5px solid rgba(255,255,255,.07); }
.dot { width:9px; height:9px; border-radius:50%; }
.ch-lbl { font-size: 11px; color: #5c6370; margin-left: auto; font-family: var(--mono); }
.alert { border-radius: 10px; padding: 13px 16px; margin: 14px 0; font-size: 13.5px; line-height: 1.65; }
.a-blue { background:#eff6ff; border-left:4px solid var(--c1); color:#1e3a5f; }
.a-green { background:#f0fdf4; border-left:4px solid var(--c2); color:#14532d; }
.a-amber { background:#fffbeb; border-left:4px solid var(--c3); color:#78350f; }
.a-red { background:#fff1f2; border-left:4px solid var(--c5); color:#7f1d1d; }
.a-purple { background:#faf5ff; border-left:4px solid var(--c4); color:#4c1d95; }
.tbl { width:100%; border-collapse:collapse; font-size:13px; margin:16px 0; }
.tbl th { background:var(--bg); font-weight:500; padding:9px 13px; text-align:left; border-bottom:1px solid var(--border); }
.tbl td { padding:9px 13px; border-bottom:0.5px solid var(--border); color:var(--txt); vertical-align:top; }
.tbl tr:last-child td { border:none; }
.tbl tr:hover td { background:var(--bg); }
.badge { display:inline-block; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:600; }
.b-blue{background:#dbeafe;color:var(--c1)} .b-green{background:#d1fae5;color:var(--c2)}
.b-amber{background:#fef3c7;color:var(--c3)} .b-red{background:#fee2e2;color:var(--c5)}
.fw { background:var(--card); border:0.5px solid var(--border); border-radius:12px; padding:22px; margin:18px 0; }
.fw h3 { font-size:15px; font-weight:500; margin-bottom:14px; }
.ctrl-row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; padding:12px 0; }
.inp { font-family:var(--mono); font-size:13px; padding:6px 10px; border-radius:6px; border:0.5px solid var(--border); background:var(--card); color:var(--txt); width:70px; }
.inp-wide { width:160px; }
.btn { font-size:13px; font-weight:500; padding:6px 16px; border-radius:8px; border:none; cursor:pointer; transition:opacity .18s; }
.btn:hover { opacity:.82; }
.btn-blue { background:var(--c1); color:#fff; }
.btn-green { background:var(--c2); color:#fff; }
.btn-red { background:#e74c3c; color:#fff; }
.btn-amber { background:var(--c3); color:#fff; }
.btn-purple { background:var(--c4); color:#fff; }
.lbl { font-size:13px; color:var(--muted); }
.out { font-family:var(--mono); font-size:12.5px; background:var(--code-bg); border-radius:10px; padding:13px 16px; color:#a8ff78; line-height:1.75; min-height:52px; max-height:260px; overflow-y:auto; margin-top:10px; white-space:pre-wrap; }
.mem-row { display:flex; align-items:stretch; gap:0; margin:16px 0; font-family:var(--mono); font-size:12px; }
.mem-cell { flex:1; border:0.5px solid var(--border2); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:8px 4px 6px; min-height:58px; background:var(--card); transition:background .2s; }
.mem-cell:first-child { border-radius:8px 0 0 8px; }
.mem-cell:last-child { border-radius:0 8px 8px 0; }
.mem-cell.hi { background:#dbeafe; }
.mem-cell.ins { background:#d1fae5; }
.mem-cell.del { background:#fee2e2; text-decoration:line-through; opacity:.5; }
.mem-val { font-size:15px; font-weight:500; color:var(--txt); }
.mem-idx { font-size:10px; color:var(--muted); margin-top:4px; }
.mem-addr { font-size:9.5px; color:var(--muted); margin-top:2px; }
.matrix-grid { display:inline-grid; gap:3px; margin:10px 0; }
.m-cell { width:42px; height:42px; display:flex; align-items:center; justify-content:center; font-family:var(--mono); font-size:13px; font-weight:500; border-radius:5px; background:var(--bg); border:0.5px solid var(--border); color:var(--txt); transition:background .25s, color .25s; }
.m-cell.row-hi { background:#dbeafe; color:var(--c1); }
.m-cell.col-hi { background:#d1fae5; color:var(--c2); }
.m-cell.diag-hi { background:#fef3c7; color:var(--c3); }
.m-cell.res-hi { background:#ede9fe; color:var(--c4); }
.stack-vis { display:flex; flex-direction:column-reverse; gap:3px; margin:12px 0; }
.sf { background:var(--bg); border:0.5px solid var(--border2); border-radius:6px; padding:8px 14px; font-family:var(--mono); font-size:12.5px; display:flex; justify-content:space-between; transition:all .3s; }
.sf.top { background:#ede9fe; border-color:var(--c4); }
.sf-name { font-weight:500; color:var(--txt); }
.sf-val { color:var(--muted); }
@media (max-width:600px) { .grid2,.grid3{grid-template-columns:1fr;} }
`;

// ── Section 1: 1D Arrays ──
function Sec1Arrays() {
  const [arrInput, setArrInput] = useState("10,20,30,40,50");
  const [hiIdx, setHiIdx] = useState(2);
  const [arrData, setArrData] = useState([10,20,30,40,50]);
  const [arrInfo, setArrInfo] = useState("Array built: [10,20,30,40,50]\nLength = 5 | Type: int[]");
  const [highlighted, setHighlighted] = useState(-1);

  function buildArr() {
    const data = arrInput.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    setArrData(data);
    setHighlighted(-1);
    setArrInfo(`Array built: [${data.join(", ")}]\nLength = ${data.length} | Type: int[]`);
  }

  function highlightIdx() {
    const idx = parseInt(hiIdx);
    setHighlighted(idx);
    if (idx < 0 || idx >= arrData.length) {
      setArrInfo(`Index ${idx} is out of bounds! Valid: 0 to ${arrData.length - 1}`);
    } else {
      setArrInfo(`arr[${idx}] = ${arrData[idx]}\nAddress = base + ${idx} × 4 = base + ${idx * 4}`);
    }
  }

  return (
    <div id="s-arr" className="section-fade">
      <div className="stag s1">Chapter 1</div>
      <div className="stitle">Introduction to Linear Arrays</div>
      <div className="sdesc">An array is a contiguous block of memory holding a fixed number of elements of the same type. Every element is accessed in O(1) time via its index — this is the defining superpower of arrays.</div>
      <div className="grid2">
        <div className="card card-blue"><h4>Fixed size at creation</h4><p>Java arrays are allocated once with a declared size. You cannot resize them later — that's what ArrayList is for. Size is stored in <code>.length</code>.</p></div>
        <div className="card card-green"><h4>Zero-indexed</h4><p>First element is at index 0, last at index <code>length - 1</code>. Accessing index ≥ length throws <code>ArrayIndexOutOfBoundsException</code>.</p></div>
        <div className="card card-amber"><h4>Homogeneous type</h4><p>All elements must be the same type: <code>int[]</code>, <code>double[]</code>, <code>String[]</code>, etc. Java enforces this at compile time.</p></div>
        <div className="card card-purple"><h4>Reference type in Java</h4><p>Array variables hold a reference (address), not the data itself. Assigning one array to another copies the reference, not the elements!</p></div>
      </div>

      <div className="ch">
        <div className="ch-hd">
          <div className="dot" style={{background:"#ff5f57"}}></div>
          <div className="dot" style={{background:"#ffbd2e"}}></div>
          <div className="dot" style={{background:"#28c840"}}></div>
          <span className="ch-lbl">Array declaration, creation, initialization</span>
        </div>
        <pre className="code">{`// ===== 3 ways to declare + create =====
// Method 1: declare then allocate (default values: 0, false, null)
int[] arr1 = new int[5];        // [0, 0, 0, 0, 0]

// Method 2: declare, allocate, assign separately
int[] arr2;
arr2 = new int[5];
arr2[0] = 10;  arr2[1] = 20;  // assign element by element

// Method 3: array literal (size is implicit)
int[] arr3 = {10, 20, 30, 40, 50};

// ===== Key properties =====
System.out.println(arr3.length);       // 5 (field, NOT method — no ()!)
System.out.println(arr3[0]);           // 10  ← first element
System.out.println(arr3[arr3.length-1]); // 50  ← last element

// ===== Traversal methods =====
// 1. for loop (index access — can modify)
for (int i = 0; i < arr3.length; i++)
  System.out.print(arr3[i] + " ");   // 10 20 30 40 50

// 2. for-each (cleaner, no modification)
for (int val : arr3)
  System.out.print(val + " ");

// 3. Arrays utility class
System.out.println(java.util.Arrays.toString(arr3)); // [10, 20, 30, 40, 50]

// ===== Reference trap! =====
int[] a = {1, 2, 3};
int[] b = a;           // b points to SAME array!
b[0] = 99;
System.out.println(a[0]); // 99 ← a also changed!

// Correct copy: Arrays.copyOf
int[] c = java.util.Arrays.copyOf(a, a.length); // true copy`}</pre>
      </div>

      <div className="fw">
        <h3>Interactive array visualizer</h3>
        <div style={{display:"flex", gap:3, flexWrap:"wrap", margin:"12px 0"}}>
          {arrData.map((v, i) => (
            <div key={i} className={`mem-cell${highlighted === i ? " hi" : ""}`} style={{flex:"none", width:56, minHeight:58, borderRadius: i===0?"8px 0 0 8px": i===arrData.length-1?"0 8px 8px 0":"0", border:"0.5px solid var(--border2)"}}>
              <div className="mem-val">{v}</div>
              <div className="mem-idx">[{i}]</div>
            </div>
          ))}
        </div>
        <div className="ctrl-row">
          <span className="lbl">Array:</span>
          <input className="inp inp-wide" value={arrInput} onChange={e => setArrInput(e.target.value)} placeholder="comma-separated" />
          <button className="btn btn-blue" onClick={buildArr}>Build</button>
          <span className="lbl">Index:</span>
          <input className="inp" value={hiIdx} onChange={e => setHiIdx(e.target.value)} type="number" min="0" style={{width:60}} />
          <button className="btn btn-amber" onClick={highlightIdx}>Highlight</button>
        </div>
        <div className="out">{arrInfo}</div>
      </div>

      <div className="alert a-blue"><strong>Default values when using <code>new int[n]</code>:</strong> int/byte/short/long → 0 | float/double → 0.0 | boolean → false | char → '\u0000' | Object → null</div>

      <div className="ch">
        <div className="ch-hd">
          <div className="dot" style={{background:"#ff5f57"}}></div>
          <div className="dot" style={{background:"#ffbd2e"}}></div>
          <div className="dot" style={{background:"#28c840"}}></div>
          <span className="ch-lbl">Linear search, max/min, sum, reverse</span>
        </div>
        <pre className="code">{`// Linear search — O(n)
static int linearSearch(int[] arr, int key) {
  for (int i = 0; i < arr.length; i++)
    if (arr[i] == key) return i;     // return index
  return -1;                          // not found
}

// Max element — O(n)
static int findMax(int[] arr) {
  int max = arr[0];                   // start with first
  for (int i = 1; i < arr.length; i++)
    if (arr[i] > max) max = arr[i];
  return max;
}

// Reverse array in-place — O(n)
static void reverse(int[] arr) {
  int left = 0, right = arr.length - 1;
  while (left < right) {
    int temp = arr[left];             // swap
    arr[left++] = arr[right];
    arr[right--] = temp;
  }
}`}</pre>
      </div>
    </div>
  );
}

// ── Section 2: Memory ──
function Sec2Memory() {
  const [baseAddr, setBaseAddr] = useState(1000);
  const [dtype, setDtype] = useState(4);
  const [arrSizeM, setArrSizeM] = useState(6);
  const [memCells, setMemCells] = useState([]);
  const [memFormula, setMemFormula] = useState("");

  function calcMem() {
    const base = parseInt(baseAddr), sz = parseInt(dtype), n = parseInt(arrSizeM);
    const cells = Array.from({length: n}, (_, i) => ({ idx: i, addr: base + i * sz }));
    setMemCells(cells);
    setMemFormula(
      `Formula: addr(A[i]) = base + i × size\nbase = ${base}, element size = ${sz} bytes\n` +
      `A[0] = ${base}  |  A[1] = ${base+sz}  |  A[3] = ${base+3*sz}  |  A[${n-1}] = ${base+(n-1)*sz}`
    );
  }

  useEffect(() => { calcMem(); }, []);

  return (
    <div id="s-mem" className="section-fade">
      <div className="stag s2">Chapter 2</div>
      <div className="stitle">Memory Representation of Arrays</div>
      <div className="sdesc">Understanding exactly how arrays live in memory explains why random access is O(1), why arrays are cache-friendly, and how the address formula works.</div>
      <div className="grid2">
        <div className="card card-green"><h4>Contiguous memory</h4><p>All elements occupy adjacent memory locations. No gaps, no pointers between elements. This is why arrays beat linked lists for random access.</p></div>
        <div className="card card-blue"><h4>Address formula</h4><p>Address of element i = Base Address + (i × size_of_type). For int[]: base + i×4. This is computed in constant time — hence O(1) access.</p></div>
        <div className="card card-amber"><h4>Cache locality</h4><p>Because elements are contiguous, when you access element[i], the CPU also loads nearby elements into cache. Sequential traversal is blazing fast.</p></div>
        <div className="card card-purple"><h4>Heap allocation in Java</h4><p>Array objects live on the heap. The variable on the stack holds a reference (pointer) to the heap memory. GC manages deallocation automatically.</p></div>
      </div>

      <div className="fw">
        <h3>Memory address calculator</h3>
        <p style={{fontSize:13, color:"var(--muted)", marginBottom:14}}>Visualize how the address formula works for any data type and base address</p>
        <div className="ctrl-row">
          <span className="lbl">Base addr:</span>
          <input className="inp" value={baseAddr} onChange={e => setBaseAddr(e.target.value)} type="number" style={{width:80}} />
          <span className="lbl">Type:</span>
          <select className="inp" value={dtype} onChange={e => setDtype(e.target.value)} style={{width:120}}>
            <option value="4">int (4B)</option>
            <option value="8">double (8B)</option>
            <option value="1">byte (1B)</option>
            <option value="2">short (2B)</option>
            <option value="2">char (2B)</option>
          </select>
          <span className="lbl">Size:</span>
          <input className="inp" value={arrSizeM} onChange={e => setArrSizeM(e.target.value)} type="number" min="1" max="10" style={{width:60}} />
          <button className="btn btn-green" onClick={calcMem}>Calculate</button>
        </div>
        <div style={{marginTop:14, overflowX:"auto"}}>
          <div style={{display:"flex", gap:0}}>
            {memCells.map((c, i) => (
              <div key={i} className="mem-cell" style={{flex:"none", width:72, borderRadius: i===0?"8px 0 0 8px": i===memCells.length-1?"0 8px 8px 0":"0", border:"0.5px solid var(--border2)"}}>
                <div className="mem-val">[{c.idx}]</div>
                <div className="mem-addr">{c.addr}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="out" style={{marginTop:10, minHeight:40}}>{memFormula}</div>
      </div>

      <div className="ch">
        <div className="ch-hd">
          <div className="dot" style={{background:"#ff5f57"}}></div>
          <div className="dot" style={{background:"#ffbd2e"}}></div>
          <div className="dot" style={{background:"#28c840"}}></div>
          <span className="ch-lbl">Address formula — row-major & column-major</span>
        </div>
        <pre className="code">{`// 1D Array address formula:
// addr(A[i]) = base + i × sizeof(type)
// Example: int[] at base=1000, sizeof(int)=4
// addr(A[3]) = 1000 + 3×4 = 1012

// 2D Array (m rows × n cols) — Row-Major (Java uses this!):
// addr(A[i][j]) = base + (i×n + j) × sizeof(type)
// Row-major: entire row 0 stored first, then row 1, etc.

// Column-Major (Fortran, MATLAB):
// addr(A[i][j]) = base + (j×m + i) × sizeof(type)

// Java proof — 2D array is array of arrays (each row separate!)
int[][] mat = {{1,2,3},{4,5,6},{7,8,9}};
// mat itself → reference to array of row-references
// mat[0]    → reference to {1,2,3}  (on heap)
// mat[1]    → reference to {4,5,6}  (on heap, may be elsewhere!)
// This is why jagged arrays work in Java but not C!`}</pre>
      </div>

      <div className="alert a-green"><strong>Why O(1) random access?</strong> The formula <code>base + i × size</code> requires exactly 1 multiplication and 1 addition — two operations regardless of array size. In contrast, a linked list must traverse i nodes: O(i) = O(n).</div>

      <table className="tbl">
        <thead><tr><th>Operation</th><th>Array</th><th>Linked List</th><th>Reason</th></tr></thead>
        <tbody>
          <tr><td>Access by index</td><td><span className="badge b-green">O(1)</span></td><td><span className="badge b-red">O(n)</span></td><td>Address formula vs. traverse</td></tr>
          <tr><td>Search (unsorted)</td><td><span className="badge b-amber">O(n)</span></td><td><span className="badge b-amber">O(n)</span></td><td>Both need linear scan</td></tr>
          <tr><td>Insert at end</td><td><span className="badge b-green">O(1)</span></td><td><span className="badge b-green">O(1)*</span></td><td>*if tail pointer maintained</td></tr>
          <tr><td>Insert at middle</td><td><span className="badge b-red">O(n)</span></td><td><span className="badge b-green">O(1)</span></td><td>Array shifts; LL just re-links</td></tr>
          <tr><td>Delete at middle</td><td><span className="badge b-red">O(n)</span></td><td><span className="badge b-green">O(1)</span></td><td>Same reason</td></tr>
          <tr><td>Memory overhead</td><td><span className="badge b-green">Low</span></td><td><span className="badge b-red">High</span></td><td>LL stores next/prev pointers</td></tr>
          <tr><td>Cache performance</td><td><span className="badge b-green">Excellent</span></td><td><span className="badge b-red">Poor</span></td><td>Contiguous vs scattered</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Section 3: Insert & Delete ──
function Sec3Ops() {
  const CAPACITY = 10;
  const [opsArr, setOpsArr] = useState([10,20,30,40,50,0,0,0,0,0]);
  const [opsSize, setOpsSize] = useState(5);
  const [insVal, setInsVal] = useState(99);
  const [insPos, setInsPos] = useState(2);
  const [log, setLog] = useState("Initial array: [10, 20, 30, 40, 50]");
  const [highlight, setHighlight] = useState({ type: null, idx: -1 });

  function insertOp() {
    const val = parseInt(insVal), pos = parseInt(insPos);
    if (opsSize >= CAPACITY) { setLog(l => l + "\nArray full! Max size 10."); return; }
    if (pos < 0 || pos > opsSize) { setLog(l => l + `\nInvalid position ${pos}. Valid: 0 to ${opsSize}`); return; }
    const arr = [...opsArr];
    for (let i = opsSize - 1; i >= pos; i--) arr[i + 1] = arr[i];
    arr[pos] = val;
    setOpsArr(arr);
    setOpsSize(s => s + 1);
    setHighlight({ type: "ins", idx: pos });
    setLog(l => l + `\nInserted ${val} at index ${pos} → [${arr.slice(0, opsSize + 1).join(", ")}] (size=${opsSize + 1})`);
  }

  function deleteOp() {
    const pos = parseInt(insPos);
    if (pos < 0 || pos >= opsSize) { setLog(l => l + `\nInvalid position ${pos}`); return; }
    const arr = [...opsArr];
    const deleted = arr[pos];
    for (let i = pos; i < opsSize - 1; i++) arr[i] = arr[i + 1];
    arr[opsSize - 1] = 0;
    setOpsArr(arr);
    setOpsSize(s => s - 1);
    setHighlight({ type: "del", idx: pos });
    setLog(l => l + `\nDeleted ${deleted} from index ${pos} → [${arr.slice(0, opsSize - 1).join(", ")}] (size=${opsSize - 1})`);
  }

  function resetOps() {
    setOpsArr([10,20,30,40,50,0,0,0,0,0]);
    setOpsSize(5);
    setHighlight({ type: null, idx: -1 });
    setLog("Reset to [10, 20, 30, 40, 50]");
  }

  return (
    <div id="s-ops" className="section-fade">
      <div className="stag s3">Chapter 3</div>
      <div className="stitle">Insertion & Deletion in Arrays</div>
      <div className="sdesc">Arrays have fixed size in Java, so insertion and deletion are simulated by shifting elements. Understanding exactly which elements shift — and which direction — is the key to mastering this topic.</div>
      <div className="grid2">
        <div className="card card-amber"><h4>Insertion — shift right</h4><p>To insert at position k, shift elements from position k onwards one step to the right (from right to left in the loop), then place the new element at k.</p></div>
        <div className="card card-red"><h4>Deletion — shift left</h4><p>To delete at position k, shift elements from position k+1 onwards one step to the left (from left to right in the loop). Decrement the logical size counter.</p></div>
      </div>

      <div className="fw">
        <h3>Interactive insertion & deletion</h3>
        <div style={{display:"flex", gap:0, flexWrap:"wrap", marginBottom:12}}>
          {Array.from({length: CAPACITY}, (_, i) => {
            let cls = "mem-cell";
            if (i >= opsSize) cls += "";
            if (highlight.type === "ins" && i === highlight.idx) cls += " ins";
            if (highlight.type === "del" && i === highlight.idx) cls += " del";
            return (
              <div key={i} className={cls} style={{flex:"none", width:52, opacity: i >= opsSize ? 0.3 : 1, borderRadius: i===0?"8px 0 0 8px": i===CAPACITY-1?"0 8px 8px 0":"0", border:"0.5px solid var(--border2)"}}>
                <div className="mem-val">{i < opsSize ? opsArr[i] : "_"}</div>
                <div className="mem-idx">[{i}]</div>
              </div>
            );
          })}
        </div>
        <div className="ctrl-row">
          <span className="lbl">Value:</span>
          <input className="inp" value={insVal} onChange={e => setInsVal(e.target.value)} type="number" />
          <span className="lbl">Position:</span>
          <input className="inp" value={insPos} onChange={e => setInsPos(e.target.value)} type="number" min="0" />
          <button className="btn btn-green" onClick={insertOp}>Insert</button>
          <button className="btn btn-red" onClick={deleteOp}>Delete</button>
          <button className="btn btn-amber" onClick={resetOps}>Reset</button>
        </div>
        <div className="out" style={{minHeight:44}}>{log}</div>
      </div>

      <div className="ch">
        <div className="ch-hd">
          <div className="dot" style={{background:"#ff5f57"}}></div>
          <div className="dot" style={{background:"#ffbd2e"}}></div>
          <div className="dot" style={{background:"#28c840"}}></div>
          <span className="ch-lbl">Insert & delete — full Java implementation</span>
        </div>
        <pre className="code">{`// Working with a fixed-capacity array + logical size counter
int[] arr = new int[10];           // physical capacity = 10
int size = 5;                      // logical size = 5
// arr = [10, 20, 30, 40, 50, _, _, _, _, _]
//         0   1   2   3   4

// ===== INSERT at position pos =====
static int insert(int[] arr, int size, int pos, int val) {
  if (size >= arr.length) { System.out.println("Array full!"); return size; }
  if (pos < 0 || pos > size) { System.out.println("Invalid position!"); return size; }
  // Shift elements RIGHT from end to pos (MUST go right to left!)
  for (int i = size - 1; i >= pos; i--)
    arr[i + 1] = arr[i];
  arr[pos] = val;                   // place new element
  return size + 1;                  // new logical size
}
// After insert(arr, 5, 2, 99):
// [10, 20, 99, 30, 40, 50, _, _, _, _]
//          ↑ inserted here, 30,40,50 shifted right

// ===== DELETE at position pos =====
static int delete(int[] arr, int size, int pos) {
  if (pos < 0 || pos >= size) { System.out.println("Invalid position!"); return size; }
  // Shift elements LEFT from pos+1 onwards (left to right!)
  for (int i = pos; i < size - 1; i++)
    arr[i] = arr[i + 1];
  arr[size - 1] = 0;              // optional: clear last slot
  return size - 1;                // new logical size
}
// delete(arr, 6, 2) removes 99:
// [10, 20, 30, 40, 50, _, _, _, _, _]
//              ← 30,40,50 shifted left`}</pre>
      </div>

      <div className="alert a-amber"><strong>Critical direction rule:</strong> For insertion, the shifting loop must go from RIGHT to LEFT (i = size-1 down to pos). If you go left to right, you'll overwrite elements before moving them — a classic bug!</div>

      <table className="tbl">
        <thead><tr><th>Operation</th><th>Position</th><th>Shifts needed</th><th>Time</th></tr></thead>
        <tbody>
          <tr><td>Insert</td><td>Beginning (pos=0)</td><td>All n elements right</td><td><span className="badge b-red">O(n)</span></td></tr>
          <tr><td>Insert</td><td>End (pos=size)</td><td>Zero shifts</td><td><span className="badge b-green">O(1)</span></td></tr>
          <tr><td>Insert</td><td>Middle</td><td>(n - pos) shifts right</td><td><span className="badge b-amber">O(n) avg</span></td></tr>
          <tr><td>Delete</td><td>Beginning (pos=0)</td><td>All n-1 elements left</td><td><span className="badge b-red">O(n)</span></td></tr>
          <tr><td>Delete</td><td>End (pos=size-1)</td><td>Zero shifts</td><td><span className="badge b-green">O(1)</span></td></tr>
          <tr><td>Delete</td><td>Middle</td><td>(n - pos - 1) shifts left</td><td><span className="badge b-amber">O(n) avg</span></td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Section 4: Multi-Dim ──
const matA = [[1,2,3],[4,5,6],[7,8,9]];
const matB = [[9,8,7],[6,5,4],[3,2,1]];

function MatrixGrid({ mat, highlight, label }) {
  const n = mat.length, m = mat[0].length;
  return (
    <div style={{marginRight:16}}>
      <div style={{fontSize:12, color:"var(--muted)", marginBottom:6}}>{label}</div>
      <div className="matrix-grid" style={{gridTemplateColumns:`repeat(${m}, 42px)`}}>
        {mat.map((row, i) => row.map((val, j) => {
          let cls = "m-cell";
          if (highlight) cls += " " + (highlight(i, j, n, m) || "");
          return <div key={`${i}-${j}`} className={cls}>{val}</div>;
        }))}
      </div>
    </div>
  );
}

function Sec4Multi() {
  const [matView, setMatView] = useState("row");
  const [matDesc, setMatDesc] = useState("");

  function getMatrixContent() {
    if (matView === "row") {
      return (
        <div style={{display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap"}}>
          <MatrixGrid mat={matA} highlight={(i) => i===1 ? "row-hi" : ""} label="Matrix A — row 1 highlighted" />
        </div>
      );
    } else if (matView === "col") {
      return (
        <div style={{display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap"}}>
          <MatrixGrid mat={matA} highlight={(i,j) => j===1 ? "col-hi" : ""} label="Matrix A — col 1 highlighted" />
        </div>
      );
    } else if (matView === "diag") {
      return (
        <div style={{display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap"}}>
          <MatrixGrid mat={matA} highlight={(i,j) => i===j ? "diag-hi" : ""} label="Matrix A — main diagonal" />
        </div>
      );
    } else if (matView === "trans") {
      const T = matA[0].map((_, j) => matA.map(row => row[j]));
      return (
        <div style={{display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap"}}>
          <MatrixGrid mat={matA} highlight={null} label="Original A" />
          <MatrixGrid mat={T} highlight={null} label="Transposed Aᵀ" />
        </div>
      );
    } else if (matView === "mult") {
      const C = [[0,0,0],[0,0,0],[0,0,0]];
      for (let i=0;i<3;i++) for (let j=0;j<3;j++) for (let k=0;k<3;k++) C[i][j]+=matA[i][k]*matB[k][j];
      return (
        <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
          <MatrixGrid mat={matA} highlight={null} label="A" />
          <div style={{fontSize:22, color:"var(--muted)", padding:"0 4px"}}>×</div>
          <MatrixGrid mat={matB} highlight={null} label="B" />
          <div style={{fontSize:22, color:"var(--muted)", padding:"0 4px"}}>=</div>
          <MatrixGrid mat={C} highlight={(i,j) => i===1&&j===1 ? "res-hi" : ""} label="C = A×B" />
        </div>
      );
    }
  }

  function getDesc() {
    if (matView === "row") return `Row 1 as a 1D array: [${matA[1].join(", ")}]\nIn Java: mat[1] gives you this entire row as a reference to a 1D int[]\nTraverse: for(int j=0; j<mat[1].length; j++) use mat[1][j]`;
    if (matView === "col") return `Column 1 as a 1D array: [${matA.map(r=>r[1]).join(", ")}]\nNOTE: In Java, columns are NOT stored contiguously (row-major order).\nTo get a column: for(int i=0; i<mat.length; i++) collect mat[i][1]`;
    if (matView === "diag") { const d = matA.map((r,i)=>r[i]); return `Main diagonal (where row index == col index): [${d.join(", ")}]\nTrace = sum of diagonal = ${d.reduce((a,b)=>a+b,0)}\nCondition: mat[i][j] where i == j`; }
    if (matView === "trans") return `Transpose: A[i][j] → T[j][i]\nOriginal: 3×3, Transpose: 3×3 (square matrix)\nKey insight: rows become columns and vice versa.`;
    if (matView === "mult") { const C=[[0,0,0],[0,0,0],[0,0,0]]; for(let i=0;i<3;i++) for(let j=0;j<3;j++) for(let k=0;k<3;k++) C[i][j]+=matA[i][k]*matB[k][j]; return `C[1][1] = A[1][0]×B[0][1] + A[1][1]×B[1][1] + A[1][2]×B[2][1]\n       = ${matA[1][0]}×${matB[0][1]} + ${matA[1][1]}×${matB[1][1]} + ${matA[1][2]}×${matB[2][1]} = ${C[1][1]}\nTime complexity: O(n³) for n×n matrices.`; }
    return "";
  }

  return (
    <div id="s-multi" className="section-fade">
      <div className="stag s4">Chapter 4</div>
      <div className="stitle">Multi-Dimensional Arrays & Real-World Applications</div>
      <div className="sdesc">A 2D array is an array of 1D arrays. A 3D array is an array of 2D arrays. This "collection of 1D arrays" mental model — plus understanding of row-major storage — unlocks matrix operations, databases, caching, and more.</div>

      <div className="fw">
        <h3>Matrix explorer — select a visualization</h3>
        <div className="ctrl-row">
          {[["row","Row as 1D","btn-blue"],["col","Column as 1D","btn-green"],["diag","Diagonal","btn-amber"],["trans","Transpose","btn-purple"],["mult","Multiply","btn-red"]].map(([v,l,c]) => (
            <button key={v} className={`btn ${c}`} onClick={() => setMatView(v)}>{l}</button>
          ))}
        </div>
        <div style={{marginTop:16, overflowX:"auto"}}>{getMatrixContent()}</div>
        <div className="out" style={{marginTop:10, minHeight:48}}>{getDesc()}</div>
      </div>

      <div className="ch">
        <div className="ch-hd">
          <div className="dot" style={{background:"#ff5f57"}}></div>
          <div className="dot" style={{background:"#ffbd2e"}}></div>
          <div className="dot" style={{background:"#28c840"}}></div>
          <span className="ch-lbl">2D array creation, traversal, jagged arrays</span>
        </div>
        <pre className="code">{`// 2D array declaration and creation
int[][] mat = new int[3][4];         // 3 rows, 4 cols
int[][] mat2 = {{1,2,3},{4,5,6},{7,8,9}};

// Key: mat is array of arrays
// mat[0] → {1,2,3}  (a 1D array, the first row)
// mat.length    = 3  (rows)
// mat[0].length = 3  (cols of row 0)

// Traversal: row by row (row-major order — cache friendly)
for (int i = 0; i < mat2.length; i++) {        // rows
  for (int j = 0; j < mat2[i].length; j++)     // cols
    System.out.printf("%3d", mat2[i][j]);
  System.out.println();
}

// Jagged arrays — different row sizes (only in Java!)
int[][] jagged = new int[3][];
jagged[0] = new int[1];               // row 0 has 1 col
jagged[1] = new int[3];               // row 1 has 3 cols
jagged[2] = new int[2];               // row 2 has 2 cols

// Matrix transpose — swap [i][j] with [j][i]
static int[][] transpose(int[][] A) {
  int r = A.length, c = A[0].length;
  int[][] T = new int[c][r];
  for (int i = 0; i < r; i++)
    for (int j = 0; j < c; j++)
      T[j][i] = A[i][j];
  return T;
}

// Matrix multiplication — O(n³)
// C[i][j] = sum of A[i][k] * B[k][j] for all k
static int[][] multiply(int[][] A, int[][] B) {
  int n = A.length;
  int[][] C = new int[n][n];
  for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
      for (int k = 0; k < n; k++)
        C[i][j] += A[i][k] * B[k][j];
  return C;
}`}</pre>
      </div>

      <div className="grid3">
        <div className="card card-blue"><h4>Database tables</h4><p>A DB table is a 2D array: rows are records, columns are fields. <code>table[i][j]</code> = value at row i, column j.</p></div>
        <div className="card card-green"><h4>Cache grids (LRU)</h4><p>Cache can be modeled as a 2D array where each row is a cache set and each column is a way. Cache hits navigate this 2D structure in O(1).</p></div>
        <div className="card card-purple"><h4>Image pixels</h4><p>A grayscale image is literally a 2D int array. An RGB image is a 3D array: <code>img[row][col][channel]</code> where channel = 0(R), 1(G), 2(B).</p></div>
      </div>
    </div>
  );
}

// ── Section 5: Recursion ──
function Sec5Recursion() {
  const [recType, setRecType] = useState("fact");
  const [recN, setRecN] = useState(5);
  const [stackFrames, setStackFrames] = useState([]);
  const [recOut, setRecOut] = useState("");
  const [probSel, setProbSel] = useState("fact");
  const [probN, setProbN] = useState(5);
  const [probOut, setProbOut] = useState("Pick a problem and click Run!");

  function runRec() {
    const n = parseInt(recN);
    let frames = [], trace = "";

    if (recType === "fact") {
      const steps = [];
      function fact(x) { steps.push(`factorial(${x})`); if(x===0){steps.push("→ base case: return 1"); return 1;} const r=x*fact(x-1); steps.push(`factorial(${x}) = ${x} × ${r/x} = ${r}`); return r; }
      const result = fact(n);
      frames = steps.slice(0, Math.min(8, steps.length)).map((s,i) => ({name:`factorial(${Math.max(0,n-i)})`, val:s}));
      trace = steps.join("\n") + `\n\nFinal result: ${result}`;
    } else if (recType === "fib") {
      const memo = {};
      function fibM(x) { if(x<=1)return x; if(memo[x])return memo[x]; memo[x]=fibM(x-1)+fibM(x-2); return memo[x]; }
      const result = fibM(n);
      trace = `fib(${n}) = ${result}\nCall chain: fib(${n}) → fib(${n-1}) + fib(${n-2})\n`;
      for(let i=0;i<=n;i++) trace+=`fib(${i}) = ${fibM(i)}\n`;
      frames = Array.from({length:Math.min(n+1,8)},(_,i)=>({name:`fib(${n-i})`,val:`= ${fibM(n-i)}`}));
    } else if (recType === "sum") {
      let sm = 0; for(let i=1;i<=n;i++) sm+=i;
      trace = `sum(${n}) unrolls to: ${Array.from({length:n+1},(_,i)=>i).join(" + ")} = ${sm}`;
      frames = Array.from({length:Math.min(n+1,8)},(_,i)=>({name:`sum(${n-i})`,val:i===n?"returns 0":`calls sum(${n-i-1})`}));
    } else if (recType === "pow") {
      function pw(b,e){return e===0?1:b*pw(b,e-1);}
      const result = pw(2,n);
      trace = `power(2, ${n}) = ${result}\nCall chain:\n`;
      for(let i=n;i>=0;i--) trace+=`power(2,${i}) = ${pw(2,i)}\n`;
      frames = Array.from({length:Math.min(n+1,8)},(_,i)=>({name:`power(2,${n-i})`,val:`= ${pw(2,n-i)}`}));
    } else if (recType === "gcd") {
      const a = n, b = Math.max(1, n-1);
      function gcd(x,y){return y===0?x:gcd(y,x%y);}
      const result = gcd(a,b);
      trace = `GCD(${a},${b}) = ${result}\nEuclidean algorithm:\n`;
      let tx=a,ty=b; while(ty!==0){trace+=`GCD(${tx},${ty}) → GCD(${ty},${tx%ty})\n`;const tmp=ty;ty=tx%ty;tx=tmp;}
      trace+=`GCD(${tx},0) → ${tx} (base case)`;
      frames = [{name:`GCD(${a},${b})`,val:`calls GCD(${b},${a%b})`},{name:"...",val:"Euclidean steps"},{name:`GCD(result,0)`,val:`returns ${result}`}];
    }

    setStackFrames(frames);
    setRecOut(trace);
  }

  function runProblem() {
    const n = parseInt(probN);
    let out = "";
    if (probSel === "fact") {
      function f(x){return x===0?1:x*f(x-1);}
      out = "Factorial using recursion:\n";
      for(let i=0;i<=n;i++) out+=`factorial(${i}) = ${f(i)}\n`;
    } else if (probSel === "fib") {
      const m={};
      function fm(x){if(x<=1)return x;if(m[x])return m[x];m[x]=fm(x-1)+fm(x-2);return m[x];}
      out = "Fibonacci (memoized) — O(n):\n";
      for(let i=0;i<=n;i++) out+=`fib(${i}) = ${fm(i)}\n`;
    } else if (probSel === "pow") {
      function pw(b,e){return e===0?1:b*pw(b,e-1);}
      out = "Powers of 2 using recursion:\n";
      for(let i=0;i<=n;i++) out+=`2^${i} = ${pw(2,i)}\n`;
    } else if (probSel === "hanoi") {
      const moves = [];
      function h(disks,s,d,a){if(disks===1){moves.push(`Disk 1: ${s} → ${d}`);return;}h(disks-1,s,a,d);moves.push(`Disk ${disks}: ${s} → ${d}`);h(disks-1,a,d,s);}
      h(Math.min(n,5),"A","C","B");
      out = `Tower of Hanoi with ${Math.min(n,5)} disks (${moves.length} moves = 2^n-1):\n${moves.join("\n")}`;
    } else if (probSel === "bsearch") {
      const arr = Array.from({length:n*2},(_,i)=>i*5);
      const key = Math.round(n*3/2)*5;
      const steps = [];
      function bs(lo,hi,k){if(lo>hi){steps.push("Not found");return -1;}const mid=Math.floor((lo+hi)/2);steps.push(`lo=${lo} hi=${hi} mid=${mid} arr[mid]=${arr[mid]}`);if(arr[mid]===k)return mid;return k<arr[mid]?bs(lo,mid-1,k):bs(mid+1,hi,k);}
      const idx = bs(0,arr.length-1,key);
      out = `Array: [${arr.slice(0,10).join(", ")}...]\nSearching for: ${key}\n${steps.join("\n")}\nResult: index ${idx}`;
    } else if (probSel === "revArr") {
      const arr2 = Array.from({length:n},(_,i)=>(i+1)*10);
      const orig = [...arr2];
      function rev(a,lo,hi){if(lo>=hi)return;const t=a[lo];a[lo]=a[hi];a[hi]=t;rev(a,lo+1,hi-1);}
      rev(arr2,0,arr2.length-1);
      out = `Original: [${orig.join(", ")}]\nReversed (recursion): [${arr2.join(", ")}]\n\nHow: swap(arr[0],arr[n-1]) then recurse on arr[1..n-2]`;
    }
    setProbOut(out);
  }

  return (
    <div id="s-rec" className="section-fade">
      <div className="stag s5">Chapter 5</div>
      <div className="stitle">Recursion in Java</div>
      <div className="sdesc">Recursion is when a method calls itself to solve a smaller version of the same problem. Every recursive solution has exactly two parts: a base case (stop condition) and a recursive case (calls itself with smaller input).</div>

      <div className="alert a-purple"><strong>The golden rule:</strong> Every recursive call must move closer to the base case. If it doesn't, you get infinite recursion → StackOverflowError.</div>

      <div className="grid2">
        <div className="card card-red"><h4>Base case</h4><p>The condition where the function stops calling itself and returns a direct value. Without it, recursion never ends. <code>if (n == 0) return 1;</code></p></div>
        <div className="card card-purple"><h4>Recursive case</h4><p>The function calls itself with a simpler input. Each call pushes a new frame onto the call stack. Returns propagate back up when the base case is hit.</p></div>
      </div>

      <div className="fw">
        <h3>Call stack visualizer</h3>
        <div className="ctrl-row">
          <select className="inp" value={recType} onChange={e => setRecType(e.target.value)} style={{width:200}}>
            <option value="fact">Factorial (n!)</option>
            <option value="fib">Fibonacci(n)</option>
            <option value="sum">Sum 1 to n</option>
            <option value="pow">Power(base,n)</option>
            <option value="gcd">GCD(a,b)</option>
          </select>
          <input className="inp" value={recN} onChange={e => setRecN(e.target.value)} type="number" min="0" max="10" />
          <button className="btn btn-purple" onClick={runRec}>Trace</button>
        </div>
        {stackFrames.length > 0 && (
          <div style={{marginTop:14}}>
            <div style={{fontSize:12, color:"var(--muted)", marginBottom:6}}>Call stack (top = current frame):</div>
            <div className="stack-vis">
              {stackFrames.map((f, i) => (
                <div key={i} className={`sf${i===stackFrames.length-1?" top":""}`}>
                  <span className="sf-name">{f.name}</span>
                  <span className="sf-val">{f.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="out" style={{marginTop:10, minHeight:60}}>{recOut}</div>
      </div>

      <div className="ch">
        <div className="ch-hd">
          <div className="dot" style={{background:"#ff5f57"}}></div>
          <div className="dot" style={{background:"#ffbd2e"}}></div>
          <div className="dot" style={{background:"#28c840"}}></div>
          <span className="ch-lbl">Core recursive functions — deeply explained</span>
        </div>
        <pre className="code">{`// ===== Factorial =====
// factorial(5) = 5 × 4 × 3 × 2 × 1 = 120
// Recurrence: fact(n) = n × fact(n-1), fact(0)=1
static long factorial(int n) {
  if (n == 0) return 1;           // base case
  return n * factorial(n - 1);    // recursive case
}
// Call stack for factorial(4):
// fact(4) → 4 * fact(3)
//   fact(3) → 3 * fact(2)
//     fact(2) → 2 * fact(1)
//       fact(1) → 1 * fact(0)
//         fact(0) → 1  ← BASE CASE HIT
//       fact(1) → 1*1 = 1  (return up)
//     fact(2) → 2*1 = 2
//   fact(3) → 3*2 = 6
// fact(4) → 4*6 = 24

// ===== Fibonacci =====
// WARNING: naive recursion is O(2^n) — exponential!
static int fib(int n) {
  if (n <= 1) return n;             // base cases: fib(0)=0, fib(1)=1
  return fib(n-1) + fib(n-2);      // TWO recursive calls
}

// Memoized Fibonacci — O(n) with HashMap cache
static Map<Integer,Long> memo = new HashMap<>();
static long fibMemo(int n) {
  if (n <= 1) return n;
  if (memo.containsKey(n)) return memo.get(n); // cache hit
  long result = fibMemo(n-1) + fibMemo(n-2);
  memo.put(n, result);
  return result;
}

// ===== Binary Search (recursive) — O(log n) =====
static int binarySearch(int[] arr, int lo, int hi, int key) {
  if (lo > hi) return -1;           // base case: not found
  int mid = lo + (hi - lo) / 2;    // avoid integer overflow
  if (arr[mid] == key) return mid;  // base case: found!
  if (key < arr[mid])
    return binarySearch(arr, lo, mid-1, key); // search left
  else
    return binarySearch(arr, mid+1, hi, key); // search right
}

// ===== Tower of Hanoi — classic recursion =====
static void hanoi(int n, char src, char dest, char aux) {
  if (n == 1) { System.out.println("Move disk 1: " + src + " → " + dest); return; }
  hanoi(n-1, src, aux, dest);     // move top n-1 to aux
  System.out.println("Move disk "+n+": "+src+" → "+dest);
  hanoi(n-1, aux, dest, src);     // move n-1 from aux to dest
}
// hanoi(3,'A','C','B') requires 2^n - 1 = 7 moves`}</pre>
      </div>

      <div className="fw">
        <h3>Recursion vs Iteration playground</h3>
        <div className="ctrl-row">
          <select className="inp" value={probSel} onChange={e => setProbSel(e.target.value)} style={{width:220}}>
            <option value="fact">Factorial</option>
            <option value="fib">Fibonacci (memoized)</option>
            <option value="pow">Power</option>
            <option value="hanoi">Tower of Hanoi</option>
            <option value="bsearch">Binary search</option>
            <option value="revArr">Reverse array</option>
          </select>
          <input className="inp" value={probN} onChange={e => setProbN(e.target.value)} type="number" min="0" max="12" />
          <button className="btn btn-red" onClick={runProblem}>Run</button>
        </div>
        <div className="out" style={{minHeight:80}}>{probOut}</div>
      </div>

      <table className="tbl">
        <thead><tr><th>Recursive function</th><th>Base case(s)</th><th>Recursive case</th><th>Complexity</th></tr></thead>
        <tbody>
          <tr><td>Factorial(n)</td><td>n == 0 → 1</td><td>n × fact(n-1)</td><td><span className="badge b-green">O(n)</span></td></tr>
          <tr><td>Fibonacci(n)</td><td>n ≤ 1 → n</td><td>fib(n-1) + fib(n-2)</td><td><span className="badge b-red">O(2ⁿ) naive</span></td></tr>
          <tr><td>Fibonacci (memo)</td><td>n ≤ 1 → n</td><td>memo-cached</td><td><span className="badge b-green">O(n)</span></td></tr>
          <tr><td>Binary Search</td><td>lo&gt;hi → -1, found → mid</td><td>search left or right half</td><td><span className="badge b-green">O(log n)</span></td></tr>
          <tr><td>Tower of Hanoi</td><td>n == 1 → move</td><td>2 recursive calls</td><td><span className="badge b-red">O(2ⁿ)</span></td></tr>
          <tr><td>Array sum</td><td>n == 0 → 0</td><td>arr[n-1] + sum(arr, n-1)</td><td><span className="badge b-green">O(n)</span></td></tr>
        </tbody>
      </table>

      <div className="alert a-red"><strong>StackOverflowError</strong> occurs when recursion goes too deep — Java's call stack has a finite size (~500-1000 frames by default). Always ensure your base case is reachable and n is not too large. For large inputs, prefer iteration or memoization.</div>
    </div>
  );
}

// ── Main Export ──

// ── Main Export ──
const CHAPTERS = [
  { id:"arr",   label:"1D Arrays",       color:"1" },
  { id:"mem",   label:"Memory & Address", color:"2" },
  { id:"ops",   label:"Insert & Delete",  color:"3" },
  { id:"multi", label:"Multi-Dim & Apps", color:"4" },
  { id:"rec",   label:"Recursion",        color:"5" },
];

export default function ArraysRecursion({ onPrev, onNext, _startAt }) {
  const [active, setActive] = useState(_startAt || "arr");
  const curIdx = CHAPTERS.findIndex(c => c.id === active);

  function switchTab(id) {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="arr-root">
      <style>{styles}</style>
      <div className="wrap">

        {/* Chapter tabs */}
        <div className="nav">
          {CHAPTERS.map((ch, i) => (
            <button key={ch.id} className={`nb${active===ch.id?" on":""}`} data-c={ch.color}
              onClick={() => switchTab(ch.id)}>
              {i+1}. {ch.label}
            </button>
          ))}
        </div>

        {/* Active section */}
        {active === "arr"   && <Sec1Arrays />}
        {active === "mem"   && <Sec2Memory />}
        {active === "ops"   && <Sec3Ops />}
        {active === "multi" && <Sec4Multi />}
        {active === "rec"   && <Sec5Recursion />}

        {/* Prev / Next bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          marginTop:48,paddingTop:24,borderTop:"0.5px solid var(--border)"}}>

          {curIdx > 0 ? (
            <button className="btn btn-blue"
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14}}
              onClick={() => switchTab(CHAPTERS[curIdx-1].id)}>
              ← {CHAPTERS[curIdx-1].label}
            </button>
          ) : onPrev ? (
            <button className="btn btn-blue"
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14}}
              onClick={onPrev}>
              ← Algorithms &amp; Java
            </button>
          ) : <div />}

          {/* Dot indicators */}
          <div style={{display:"flex",gap:6}}>
            {CHAPTERS.map((ch, i) => (
              <div key={ch.id} onClick={() => switchTab(ch.id)}
                style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",transition:"background .2s",
                  background: active===ch.id
                    ? ["var(--c1)","var(--c2)","var(--c3)","var(--c4)","var(--c5)"][i]
                    : "var(--border)"}} />
            ))}
          </div>

          {curIdx < CHAPTERS.length-1 ? (
            <button className="btn btn-blue"
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14}}
              onClick={() => switchTab(CHAPTERS[curIdx+1].id)}>
              {CHAPTERS[curIdx+1].label} →
            </button>
          ) : onNext ? (
            <button className="btn btn-blue"
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14}}
              onClick={onNext}>
              Next: Control Flow →
            </button>
          ) : (
            <div style={{fontSize:13,color:"var(--muted)",fontStyle:"italic"}}>
              ✓ All chapters complete
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
