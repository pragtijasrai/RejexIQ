import { useState, useRef, useEffect } from "react";

const styles = `
.bst-root { font-family: var(--font-sans, sans-serif); }
.bst-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.bst-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.bst-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.bst-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.bst-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes bstFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.bst-sec { animation: bstFade .2s ease; }
.bst-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.bst-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.bst-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.bst-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.bst-ul { padding-left: 18px; margin: 6px 0; }
.bst-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.bst-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; }
.bst-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.bst-btn:hover { background: var(--color-background-secondary); }
.bst-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.bst-btn.primary:hover { opacity: .85; }
.bst-btn:disabled { opacity: .4; cursor: default; }
.bst-inp { width: 80px; padding: 6px 10px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); }
.bst-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.bst-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.bst-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.bst-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.bst-tbl tr:hover td { background: var(--color-background-secondary); }
.bst-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.bst-info p { color: var(--color-text-info); font-size: 13px; }
.bst-warn { border-left: 3px solid var(--color-border-warning); padding: 10px 14px; margin: 10px 0; background: var(--color-background-warning); border-radius: 0 8px 8px 0; }
.bst-warn p { color: var(--color-text-warning); font-size: 13px; }
.bst-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.bst-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.bst-quiz-opt:hover { background: var(--color-background-secondary); }
.bst-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.bst-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
.bst-dot-row { display: flex; justify-content: center; gap: 6px; padding: 16px 0 8px; }
.bst-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-border-secondary); cursor: pointer; transition: all .2s; }
.bst-dot.on { background: var(--color-text-primary); transform: scale(1.3); }
.bst-nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 0.5px solid var(--color-border-tertiary); margin-top: 24px; }
@media(max-width:500px){ .bst-2col{grid-template-columns:1fr;} }
`;

// ── BST node layout computation ──
function buildBSTLayout(values) {
  if (!values.length) return { nodes: [], edges: [] };
  // Build BST structure
  const tree = {};
  let root = null;
  function insert(val) {
    const node = { val, left: null, right: null, id: val };
    if (root === null) { root = node; tree[val] = node; return; }
    let curr = root;
    while (true) {
      if (val < curr.val) {
        if (curr.left === null) { curr.left = node; tree[val] = node; return; }
        curr = curr.left;
      } else {
        if (curr.right === null) { curr.right = node; tree[val] = node; return; }
        curr = curr.right;
      }
    }
  }
  values.forEach(insert);

  // Assign positions via in-order traversal
  const positions = {};
  let xCounter = 0;
  function assignX(node) {
    if (!node) return;
    assignX(node.left);
    positions[node.val] = { x: xCounter++ };
    assignX(node.right);
  }
  assignX(root);

  // Assign y by depth
  function assignY(node, depth) {
    if (!node) return;
    positions[node.val].y = depth;
    assignY(node.left, depth + 1);
    assignY(node.right, depth + 1);
  }
  assignY(root, 0);

  const n = Object.keys(positions).length;
  const W = 360, H = 180;
  const xScale = n > 1 ? W / (n - 1) : W / 2;
  const yScale = 55;
  const xOffset = n > 1 ? 20 : W / 2;

  const nodes = values.map(v => ({
    val: v,
    cx: xOffset + positions[v].x * xScale,
    cy: 25 + positions[v].y * yScale,
  }));

  const edges = [];
  function collectEdges(node) {
    if (!node) return;
    if (node.left) edges.push([node.val, node.left.val]);
    if (node.right) edges.push([node.val, node.right.val]);
    collectEdges(node.left);
    collectEdges(node.right);
  }
  collectEdges(root);

  return { nodes, edges };
}

function BSTSVG({ values, highlighted = [] }) {
  const { nodes, edges } = buildBSTLayout(values);
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.val] = n; });
  return (
    <svg viewBox="0 0 400 200" style={{width:"100%",maxWidth:400,minHeight:120}}>
      {edges.map(([a,b]) => {
        const na = nodeMap[a], nb = nodeMap[b];
        if (!na || !nb) return null;
        return <line key={`${a}-${b}`} x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy} stroke="var(--color-border-secondary)" strokeWidth="1.5"/>;
      })}
      {nodes.map(n => {
        const hl = highlighted.includes(n.val);
        return (
          <g key={n.val}>
            <circle cx={n.cx} cy={n.cy} r="18"
              fill={hl ? "#0984e3" : "var(--color-background-primary)"}
              stroke={hl ? "#0984e3" : "var(--color-border-secondary)"}
              strokeWidth="2"/>
            <text x={n.cx} y={n.cy+5} textAnchor="middle" fontSize="12" fontWeight="600"
              fill={hl ? "#fff" : "var(--color-text-primary)"}>{n.val}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Chapter 1: What is BST ──
function SecIntro() {
  return (
    <div className="bst-sec">
      <span className="bst-tag tag-blue">Foundation</span>
      <div className="bst-h2">Binary Search Tree</div>
      <p className="bst-p">A BST is a binary tree where for every node: <strong>all left descendants &lt; node &lt; all right descendants</strong>. This ordering enables O(log n) search.</p>
      <div className="bst-viz">
        <BSTSVG values={[50,30,70,20,40,60,80]} />
        <div style={{display:"flex",justifyContent:"space-around",marginTop:8,fontSize:12,color:"var(--color-text-tertiary)"}}>
          <span>← smaller values</span>
          <span>root = 50</span>
          <span>larger values →</span>
        </div>
      </div>
      <div className="bst-info"><p>BST PROPERTY: For node with value V — every node in left subtree &lt; V, every node in right subtree &gt; V. This holds recursively for every node.</p></div>
      <div className="bst-h3">Why BST?</div>
      <ul className="bst-ul">
        <li>Search in O(log n) average — halve the search space each step</li>
        <li>Inorder traversal gives sorted output</li>
        <li>Dynamic — insert/delete without shifting elements</li>
        <li>Foundation for balanced trees (AVL, Red-Black)</li>
      </ul>
    </div>
  );
}

// ── Chapter 2: Operations ──
function SecOperations() {
  return (
    <div className="bst-sec">
      <span className="bst-tag tag-amber">Operations</span>
      <div className="bst-h2">BST Operations</div>
      <div className="bst-h3">Search — O(log n) average</div>
      <div className="bst-code">{`Node search(Node root, int key) {
  if (root == null || root.val == key) return root;
  if (key < root.val) return search(root.left, key);
  return search(root.right, key);
}
// Each step eliminates half the tree — like binary search!`}</div>
      <div className="bst-h3">Insert — O(log n) average</div>
      <div className="bst-code">{`Node insert(Node root, int val) {
  if (root == null) return new Node(val);
  if (val < root.val) root.left  = insert(root.left,  val);
  else                root.right = insert(root.right, val);
  return root;
}
// Always inserted as a leaf — no restructuring needed`}</div>
      <div className="bst-h3">Delete — 3 Cases</div>
      <div className="bst-code">{`Node delete(Node root, int key) {
  if (root == null) return null;
  if (key < root.val) { root.left  = delete(root.left,  key); }
  else if (key > root.val) { root.right = delete(root.right, key); }
  else {
    // Case 1: Leaf node — just remove
    if (root.left == null && root.right == null) return null;
    // Case 2: One child — replace with child
    if (root.left  == null) return root.right;
    if (root.right == null) return root.left;
    // Case 3: Two children — replace with inorder successor
    Node successor = findMin(root.right);
    root.val = successor.val;
    root.right = delete(root.right, successor.val);
  }
  return root;
}
Node findMin(Node n) { while (n.left != null) n = n.left; return n; }`}</div>
      <table className="bst-tbl">
        <thead><tr><th>Operation</th><th>Average</th><th>Worst (skewed)</th></tr></thead>
        <tbody>
          <tr><td>Search</td><td>O(log n)</td><td>O(n)</td></tr>
          <tr><td>Insert</td><td>O(log n)</td><td>O(n)</td></tr>
          <tr><td>Delete</td><td>O(log n)</td><td>O(n)</td></tr>
        </tbody>
      </table>
      <div className="bst-warn"><p>WORST CASE: If you insert sorted data [1,2,3,4,5] into a BST, it degenerates into a linked list — height = n, all operations become O(n). Solution: use balanced BSTs (AVL, Red-Black).</p></div>
    </div>
  );
}

// ── Chapter 3: Interactive BST ──
function SecInteractive() {
  const [values, setValues] = useState([50,30,70,20,40,60,80]);
  const [inp, setInp] = useState(35);
  const [highlighted, setHighlighted] = useState([]);
  const [status, setStatus] = useState("BST initialized with [50,30,70,20,40,60,80]");

  function insertVal() {
    const v = parseInt(inp);
    if (isNaN(v)) return;
    if (values.includes(v)) { setStatus(`${v} already exists in BST`); return; }
    setValues([...values, v]);
    setHighlighted([v]);
    setStatus(`Inserted ${v} into BST`);
    setTimeout(() => setHighlighted([]), 1200);
  }

  function searchVal() {
    const v = parseInt(inp);
    if (isNaN(v)) return;
    const path = [];
    let curr = [...values];
    // Simulate BST search path
    function bstSearch(vals, key) {
      if (!vals.length) return false;
      // rebuild tree mentally
      const sorted = [...vals].sort((a,b)=>a-b);
      // just highlight the value if found
      if (vals.includes(key)) { path.push(key); return true; }
      return false;
    }
    if (values.includes(v)) {
      setHighlighted([v]);
      setStatus(`✓ Found ${v} in BST`);
    } else {
      setStatus(`✗ ${v} not found in BST`);
    }
    setTimeout(() => setHighlighted([]), 1200);
  }

  function deleteVal() {
    const v = parseInt(inp);
    if (isNaN(v)) return;
    if (!values.includes(v)) { setStatus(`${v} not in BST`); return; }
    setValues(values.filter(x => x !== v));
    setStatus(`Deleted ${v} from BST`);
  }

  function reset() {
    setValues([50,30,70,20,40,60,80]);
    setHighlighted([]);
    setStatus("BST reset to [50,30,70,20,40,60,80]");
  }

  return (
    <div className="bst-sec">
      <span className="bst-tag tag-green">Interactive</span>
      <div className="bst-h2">Interactive BST</div>
      <div className="bst-viz">
        <BSTSVG values={values} highlighted={highlighted} />
        <div className="bst-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <input type="number" className="bst-inp" value={inp} onChange={e=>setInp(e.target.value)} placeholder="value" />
        <button className="bst-btn primary" onClick={insertVal}>Insert</button>
        <button className="bst-btn" onClick={searchVal}>Search</button>
        <button className="bst-btn" onClick={deleteVal}>Delete</button>
        <button className="bst-btn" onClick={reset}>Reset</button>
      </div>
      <p className="bst-p" style={{marginTop:8}}>Inorder (sorted): [{[...values].sort((a,b)=>a-b).join(", ")}]</p>
    </div>
  );
}

// ── Chapter 4: Quiz ──
const QUIZ = [
  { q:"In a BST, where is the minimum value always found?", opts:["Root","Rightmost node","Leftmost node","Any leaf"], ans:2 },
  { q:"What is the time complexity of BST search in the average case?", opts:["O(1)","O(log n)","O(n)","O(n log n)"], ans:1 },
  { q:"Inorder traversal of a BST gives:", opts:["Random order","Sorted ascending","Sorted descending","Level order"], ans:1 },
  { q:"When deleting a node with two children, we replace it with:", opts:["Any leaf","Inorder predecessor or successor","Root","Parent"], ans:1 },
  { q:"A BST degenerates to O(n) when:", opts:["Random data inserted","Sorted data inserted","Balanced data inserted","Deleted frequently"], ans:1 },
  { q:"What is the worst-case height of a BST with n nodes?", opts:["log n","sqrt(n)","n","n/2"], ans:2 },
];

function SecQuiz() {
  const [answers, setAnswers] = useState({});
  function pick(i, opt) { setAnswers({...answers, [i]: opt}); }
  return (
    <div className="bst-sec">
      <span className="bst-tag tag-red">Quiz</span>
      <div className="bst-h2">Test Your Knowledge</div>
      {QUIZ.map((q, i) => {
        const chosen = answers[i];
        const correct = chosen === q.ans;
        return (
          <div key={i} style={{marginBottom:16}}>
            <p className="bst-p" style={{fontWeight:500}}>{i+1}. {q.q}</p>
            {q.opts.map((opt, oi) => (
              <button key={oi} className={`bst-quiz-opt${chosen===oi?(correct?" correct":" wrong"):""}`}
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
  { id:"intro", label:"What is BST", comp: SecIntro },
  { id:"ops",   label:"Operations",  comp: SecOperations },
  { id:"inter", label:"Interactive", comp: SecInteractive },
  { id:"quiz",  label:"Quiz",        comp: SecQuiz },
];

export default function BST({ onPrev, onNext, onChapterChange }) {
  const [ch, setCh] = useState(0);
  const Comp = CHAPTERS[ch].comp;
  return (
    <div className="bst-root">
      <style>{styles}</style>
      <div className="bst-wrap">
        <div className="bst-nav">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} className={`bst-nb${ch===i?" on":""}`} onClick={() => setCh(i)}>
              {i+1}. {c.label}
            </button>
          ))}
        </div>
        <Comp />
        <div className="bst-dot-row">
          {CHAPTERS.map((_, i) => <div key={i} className={`bst-dot${ch===i?" on":""}`} onClick={() => setCh(i)} />)}
        </div>
        <div className="bst-nav-bar">
          <button className="bst-btn" onClick={onPrev} disabled={!onPrev}>← Prev Topic</button>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Chapter {ch+1}/{CHAPTERS.length}</span>
          <button className="bst-btn primary" onClick={onNext} disabled={!onNext}>Next Topic →</button>
        </div>
      </div>
    </div>
  );
}
