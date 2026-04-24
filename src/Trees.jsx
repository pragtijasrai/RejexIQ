import { useState, useRef, useEffect } from "react";

const styles = `
.tree-root { font-family: var(--font-sans, sans-serif); }
.tree-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.tree-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.tree-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.tree-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.tree-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes treeFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.tree-sec { animation: treeFade .2s ease; }
.tree-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.tree-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.tree-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.tree-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.tree-ul { padding-left: 18px; margin: 6px 0; }
.tree-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.tree-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; }
.tree-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.tree-btn:hover { background: var(--color-background-secondary); }
.tree-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.tree-btn.primary:hover { opacity: .85; }
.tree-btn:disabled { opacity: .4; cursor: default; }
.tree-inp { width: 80px; padding: 6px 10px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); }
.tree-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.tree-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.tree-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.tree-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.tree-tbl tr:hover td { background: var(--color-background-secondary); }
.tree-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.tree-info p { color: var(--color-text-info); font-size: 13px; }
.tree-warn { border-left: 3px solid var(--color-border-warning); padding: 10px 14px; margin: 10px 0; background: var(--color-background-warning); border-radius: 0 8px 8px 0; }
.tree-warn p { color: var(--color-text-warning); font-size: 13px; }
.tree-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
.tree-card { background: var(--color-background-secondary); border-radius: 10px; padding: 12px; }
.tree-card h4 { font-size: 13px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.tree-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.tree-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.tree-quiz-opt:hover { background: var(--color-background-secondary); }
.tree-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.tree-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
.tree-dot-row { display: flex; justify-content: center; gap: 6px; padding: 16px 0 8px; }
.tree-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-border-secondary); cursor: pointer; transition: all .2s; }
.tree-dot.on { background: var(--color-text-primary); transform: scale(1.3); }
.tree-nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 0.5px solid var(--color-border-tertiary); margin-top: 24px; }
@media(max-width:500px){ .tree-2col{grid-template-columns:1fr;} }
`;

// ── Tree SVG helper ──
const NODES = [
  { id:1, cx:200, cy:30,  val:1 },
  { id:2, cx:120, cy:90,  val:2 },
  { id:3, cx:280, cy:90,  val:3 },
  { id:4, cx:80,  cy:150, val:4 },
  { id:5, cx:160, cy:150, val:5 },
  { id:6, cx:240, cy:150, val:6 },
  { id:7, cx:320, cy:150, val:7 },
];
const EDGES = [[1,2],[1,3],[2,4],[2,5],[3,6],[3,7]];

function TreeSVG({ highlighted = [] }) {
  return (
    <svg viewBox="0 0 400 190" style={{width:"100%",maxWidth:400}}>
      {EDGES.map(([a,b]) => {
        const na = NODES.find(n=>n.id===a), nb = NODES.find(n=>n.id===b);
        return <line key={`${a}-${b}`} x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy} stroke="var(--color-border-secondary)" strokeWidth="2"/>;
      })}
      {NODES.map(n => {
        const hl = highlighted.includes(n.id);
        return (
          <g key={n.id}>
            <circle cx={n.cx} cy={n.cy} r="20"
              fill={hl ? "#00b894" : "var(--color-background-primary)"}
              stroke={hl ? "#00b894" : "var(--color-border-secondary)"}
              strokeWidth="2"/>
            <text x={n.cx} y={n.cy+5} textAnchor="middle" fontSize="14" fontWeight="600"
              fill={hl ? "#fff" : "var(--color-text-primary)"}>{n.val}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Chapter 1: Introduction ──
function SecIntro() {
  return (
    <div className="tree-sec">
      <span className="tree-tag tag-blue">Foundation</span>
      <div className="tree-h2">What is a Tree?</div>
      <p className="tree-p">A tree is a <strong>hierarchical, non-linear data structure</strong> consisting of nodes connected by edges. Unlike arrays or linked lists, trees branch out — each node can have multiple children.</p>
      <div className="tree-viz"><TreeSVG highlighted={[]} /></div>
      <div className="tree-h3">Key Terminology</div>
      <table className="tree-tbl">
        <thead><tr><th>Term</th><th>Definition</th></tr></thead>
        <tbody>
          <tr><td>Root</td><td>The topmost node (no parent) — node 1 above</td></tr>
          <tr><td>Leaf</td><td>A node with no children — nodes 4,5,6,7 above</td></tr>
          <tr><td>Height</td><td>Longest path from root to a leaf — height = 2 above</td></tr>
          <tr><td>Depth</td><td>Distance from root to a given node</td></tr>
          <tr><td>Degree</td><td>Number of children a node has</td></tr>
          <tr><td>Subtree</td><td>A node and all its descendants</td></tr>
        </tbody>
      </table>
      <div className="tree-h3">Types of Trees</div>
      <div className="tree-2col">
        <div className="tree-card"><h4>Binary Tree</h4><p style={{fontSize:13,color:"var(--color-text-secondary)"}}>Each node has at most 2 children (left and right). Foundation for BST, heaps, and expression trees.</p></div>
        <div className="tree-card"><h4>N-ary Tree</h4><p style={{fontSize:13,color:"var(--color-text-secondary)"}}>Each node can have up to N children. Used in file systems, XML/HTML DOM.</p></div>
        <div className="tree-card"><h4>Full Binary Tree</h4><p style={{fontSize:13,color:"var(--color-text-secondary)"}}>Every node has 0 or 2 children — never just 1.</p></div>
        <div className="tree-card"><h4>Complete Binary Tree</h4><p style={{fontSize:13,color:"var(--color-text-secondary)"}}>All levels filled except possibly the last, which fills left to right. Used in heaps.</p></div>
      </div>
      <div className="tree-info"><p>KEY: Trees have no cycles. A tree with N nodes always has exactly N-1 edges.</p></div>
    </div>
  );
}

// ── Chapter 2: Binary Tree Traversals ──
const INORDER    = [4,2,5,1,6,3,7];
const PREORDER   = [1,2,4,5,3,6,7];
const POSTORDER  = [4,5,2,6,7,3,1];

function SecBinaryTree() {
  const [mode, setMode] = useState("inorder");
  const [step, setStep] = useState(-1);
  const orders = { inorder: INORDER, preorder: PREORDER, postorder: POSTORDER };
  const order = orders[mode];
  const highlighted = step >= 0 ? order.slice(0, step + 1) : [];

  function nextStep() { setStep(s => Math.min(s + 1, order.length - 1)); }
  function reset() { setStep(-1); }

  const statusMsg = step < 0
    ? "Press Step to start traversal"
    : step === order.length - 1
    ? `✓ ${mode} traversal complete! Visited: [${order.join(", ")}]`
    : `Visiting node ${order[step]} (step ${step + 1}/${order.length})`;

  return (
    <div className="tree-sec">
      <span className="tree-tag tag-green">Interactive</span>
      <div className="tree-h2">Binary Tree Traversals</div>
      <p className="tree-p">Three classic ways to visit all nodes in a binary tree. Each produces a different order.</p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
        {["inorder","preorder","postorder"].map(m => (
          <button key={m} className={`tree-btn${mode===m?" primary":""}`} onClick={() => { setMode(m); setStep(-1); }}>{m}</button>
        ))}
      </div>
      <div className="tree-viz">
        <TreeSVG highlighted={highlighted} />
        <div className="tree-status">{statusMsg}</div>
        <div style={{marginTop:8,fontSize:12,color:"var(--color-text-tertiary)"}}>
          Order: [{order.join(", ")}]
        </div>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button className="tree-btn primary" onClick={nextStep} disabled={step >= order.length - 1}>Step →</button>
        <button className="tree-btn" onClick={reset}>Reset</button>
      </div>
      <div className="tree-h3">Inorder (Left → Root → Right)</div>
      <div className="tree-code">{`void inorder(Node root) {
  if (root == null) return;
  inorder(root.left);   // visit left subtree
  visit(root);          // visit root
  inorder(root.right);  // visit right subtree
}
// Result for above tree: 4 2 5 1 6 3 7
// KEY USE: Gives sorted output for a BST!`}</div>
      <div className="tree-h3">Preorder (Root → Left → Right)</div>
      <div className="tree-code">{`void preorder(Node root) {
  if (root == null) return;
  visit(root);           // visit root FIRST
  preorder(root.left);
  preorder(root.right);
}
// Result: 1 2 4 5 3 6 7
// KEY USE: Copy/serialize a tree`}</div>
      <div className="tree-h3">Postorder (Left → Right → Root)</div>
      <div className="tree-code">{`void postorder(Node root) {
  if (root == null) return;
  postorder(root.left);
  postorder(root.right);
  visit(root);           // visit root LAST
}
// Result: 4 5 2 6 7 3 1
// KEY USE: Delete a tree, evaluate expression trees`}</div>
    </div>
  );
}

// ── Chapter 3: Tree Operations ──
function SecOperations() {
  return (
    <div className="tree-sec">
      <span className="tree-tag tag-amber">Operations</span>
      <div className="tree-h2">Tree Operations</div>
      <div className="tree-h3">Insert (Binary Tree — level order)</div>
      <div className="tree-code">{`void insert(Node root, int val) {
  // Use BFS to find first node with empty child
  Queue<Node> q = new LinkedList<>();
  q.add(root);
  while (!q.isEmpty()) {
    Node curr = q.poll();
    if (curr.left == null) { curr.left = new Node(val); return; }
    else q.add(curr.left);
    if (curr.right == null) { curr.right = new Node(val); return; }
    else q.add(curr.right);
  }
}
// Time: O(n) — must find first empty spot`}</div>
      <div className="tree-h3">Search</div>
      <div className="tree-code">{`boolean search(Node root, int key) {
  if (root == null) return false;
  if (root.data == key) return true;
  return search(root.left, key) || search(root.right, key);
}
// Time: O(n) — may visit every node in worst case`}</div>
      <div className="tree-h3">Height of Tree</div>
      <div className="tree-code">{`int height(Node root) {
  if (root == null) return -1; // or 0 depending on definition
  int leftH  = height(root.left);
  int rightH = height(root.right);
  return 1 + Math.max(leftH, rightH);
}
// Time: O(n) — visits every node once`}</div>
      <div className="tree-h3">Delete (deepest rightmost node)</div>
      <div className="tree-code">{`void delete(Node root, int key) {
  // 1. Find the node to delete
  // 2. Find the deepest rightmost node
  // 3. Replace target's data with deepest node's data
  // 4. Delete the deepest rightmost node
  // This maintains the complete binary tree property
}`}</div>
      <table className="tree-tbl">
        <thead><tr><th>Operation</th><th>Time</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Traversal</td><td>O(n)</td><td>Must visit all nodes</td></tr>
          <tr><td>Search</td><td>O(n)</td><td>No ordering guarantee</td></tr>
          <tr><td>Insert</td><td>O(n)</td><td>Find first empty spot</td></tr>
          <tr><td>Height</td><td>O(n)</td><td>Recursive post-order</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Chapter 4: Quiz ──
const QUIZ = [
  { q:"What is the maximum number of nodes at level L in a binary tree?", opts:["L","2^L","2L","L^2"], ans:1 },
  { q:"A binary tree with height h has at most how many nodes?", opts:["2^h","2^(h+1) - 1","h^2","2h"], ans:1 },
  { q:"Which traversal gives sorted output for a BST?", opts:["Preorder","Inorder","Postorder","Level order"], ans:1 },
  { q:"A tree with N nodes has how many edges?", opts:["N","N-1","N+1","2N"], ans:1 },
  { q:"Which traversal visits root LAST?", opts:["Inorder","Preorder","Postorder","None"], ans:2 },
  { q:"A full binary tree has nodes with:", opts:["0 or 1 child","0 or 2 children","Exactly 2 children","Any number"], ans:1 },
  { q:"What is the height of a tree with only 1 node (root)?", opts:["-1","0","1","Undefined"], ans:1 },
  { q:"Which traversal is used to copy a tree?", opts:["Inorder","Preorder","Postorder","Level order"], ans:1 },
];

function SecQuiz() {
  const [answers, setAnswers] = useState({});
  function pick(i, opt) { setAnswers({...answers, [i]: opt}); }
  return (
    <div className="tree-sec">
      <span className="tree-tag tag-red">Quiz</span>
      <div className="tree-h2">Test Your Knowledge</div>
      {QUIZ.map((q, i) => {
        const chosen = answers[i];
        const correct = chosen === q.ans;
        const wrong = chosen !== undefined && !correct;
        return (
          <div key={i} style={{marginBottom:16}}>
            <p className="tree-p" style={{fontWeight:500}}>{i+1}. {q.q}</p>
            {q.opts.map((opt, oi) => (
              <button key={oi} className={`tree-quiz-opt${chosen===oi?(correct?" correct":" wrong"):""}`}
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

// ── Main Component ──
const CHAPTERS = [
  { id:"intro",   label:"Introduction",   comp: SecIntro },
  { id:"binary",  label:"Binary Tree",    comp: SecBinaryTree },
  { id:"ops",     label:"Operations",     comp: SecOperations },
  { id:"quiz",    label:"Quiz",           comp: SecQuiz },
];

export default function Trees({ onPrev, onNext, onChapterChange }) {
  const [ch, setCh] = useState(0);
  const Comp = CHAPTERS[ch].comp;
  return (
    <div className="tree-root">
      <style>{styles}</style>
      <div className="tree-wrap">
        <div className="tree-nav">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} className={`tree-nb${ch===i?" on":""}`} onClick={() => setCh(i)}>
              {i+1}. {c.label}
            </button>
          ))}
        </div>
        <Comp />
        <div className="tree-dot-row">
          {CHAPTERS.map((_, i) => <div key={i} className={`tree-dot${ch===i?" on":""}`} onClick={() => setCh(i)} />)}
        </div>
        <div className="tree-nav-bar">
          <button className="tree-btn" onClick={onPrev} disabled={!onPrev}>← Prev Topic</button>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Chapter {ch+1}/{CHAPTERS.length}</span>
          <button className="tree-btn primary" onClick={onNext} disabled={!onNext}>Next Topic →</button>
        </div>
      </div>
    </div>
  );
}
