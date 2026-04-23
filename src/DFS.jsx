import { useState, useRef, useEffect } from "react";

const styles = `
.dfs-root { font-family: var(--font-sans, sans-serif); }
.dfs-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.dfs-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.dfs-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.dfs-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.dfs-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes dfsFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.dfs-sec { animation: dfsFade .2s ease; }
.dfs-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.dfs-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.dfs-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.dfs-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.dfs-ul { padding-left: 18px; margin: 6px 0; }
.dfs-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.dfs-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; }
.dfs-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.dfs-btn:hover { background: var(--color-background-secondary); }
.dfs-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.dfs-btn.primary:hover { opacity: .85; }
.dfs-btn:disabled { opacity: .4; cursor: default; }
.dfs-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.dfs-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.dfs-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.dfs-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.dfs-tbl tr:hover td { background: var(--color-background-secondary); }
.dfs-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.dfs-info p { color: var(--color-text-info); font-size: 13px; }
.dfs-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.dfs-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.dfs-quiz-opt:hover { background: var(--color-background-secondary); }
.dfs-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.dfs-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
.dfs-dot-row { display: flex; justify-content: center; gap: 6px; padding: 16px 0 8px; }
.dfs-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-border-secondary); cursor: pointer; transition: all .2s; }
.dfs-dot.on { background: var(--color-text-primary); transform: scale(1.3); }
.dfs-nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 0.5px solid var(--color-border-tertiary); margin-top: 24px; }
`;

const NODES = [
  { id:"A", cx:200, cy:30 },
  { id:"B", cx:330, cy:120 },
  { id:"C", cx:280, cy:250 },
  { id:"D", cx:120, cy:250 },
  { id:"E", cx:70,  cy:120 },
];
const EDGES = [["A","B"],["A","E"],["B","C"],["B","D"],["C","D"],["D","E"]];
// DFS from A (recursive, adj order A:[B,E], B:[A,C,D], ...): A,B,C,D,E
const DFS_ORDER = ["A","B","C","D","E"];

function GraphSVG({ visited = [] }) {
  const nodeMap = {};
  NODES.forEach(n => { nodeMap[n.id] = n; });
  const colors = ["#6c5ce7","#a29bfe","#74b9ff","#00cec9","#55efc4"];
  return (
    <svg viewBox="0 0 400 280" style={{width:"100%",maxWidth:400}}>
      {EDGES.map(([a,b]) => (
        <line key={`${a}-${b}`} x1={nodeMap[a].cx} y1={nodeMap[a].cy} x2={nodeMap[b].cx} y2={nodeMap[b].cy}
          stroke="var(--color-border-secondary)" strokeWidth="1.5"/>
      ))}
      {NODES.map((n,i) => {
        const vIdx = visited.indexOf(n.id);
        const color = vIdx >= 0 ? colors[vIdx % colors.length] : "var(--color-background-primary)";
        return (
          <g key={n.id}>
            <circle cx={n.cx} cy={n.cy} r="22" fill={color}
              stroke={vIdx >= 0 ? color : "var(--color-border-secondary)"} strokeWidth="2"/>
            <text x={n.cx} y={n.cy+5} textAnchor="middle" fontSize="14" fontWeight="700"
              fill={vIdx >= 0 ? "#fff" : "var(--color-text-primary)"}>{n.id}</text>
            {vIdx >= 0 && <text x={n.cx} y={n.cy+36} textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)">step {vIdx+1}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ── Chapter 1: Introduction ──
function SecIntro() {
  return (
    <div className="dfs-sec">
      <span className="dfs-tag tag-blue">Foundation</span>
      <div className="dfs-h2">Depth-First Search</div>
      <p className="dfs-p">DFS explores as <strong>deep as possible</strong> along each branch before backtracking. It uses a <strong>Stack</strong> (or recursion's call stack) to track the path.</p>
      <div className="dfs-viz"><GraphSVG visited={DFS_ORDER} /></div>
      <div className="dfs-h3">Key Properties</div>
      <ul className="dfs-ul">
        <li>Goes deep before going wide</li>
        <li>Uses Stack (explicit or call stack via recursion)</li>
        <li>Does NOT guarantee shortest path</li>
        <li>Time: O(V+E), Space: O(V)</li>
        <li>Natural for tree/graph problems involving paths</li>
      </ul>
      <div className="dfs-info"><p>DFS from A: A → B → C → D → E (backtracking when no unvisited neighbors). The exact order depends on adjacency list ordering.</p></div>
    </div>
  );
}

// ── Chapter 2: Algorithm + Code ──
function SecAlgorithm() {
  return (
    <div className="dfs-sec">
      <span className="dfs-tag tag-amber">Algorithm</span>
      <div className="dfs-h2">DFS — Recursive & Iterative</div>
      <div className="dfs-h3">Recursive DFS</div>
      <div className="dfs-code">{`void dfsRecursive(Map<String,List<String>> graph,
                   String node, Set<String> visited) {
  visited.add(node);
  System.out.print(node + " ");
  for (String neighbor : graph.get(node)) {
    if (!visited.contains(neighbor))
      dfsRecursive(graph, neighbor, visited);
  }
}
// Call: dfsRecursive(graph, "A", new HashSet<>());
// Output: A B C D E
// Uses call stack — risk of StackOverflow for deep graphs`}</div>
      <div className="dfs-h3">Iterative DFS (explicit Stack)</div>
      <div className="dfs-code">{`void dfsIterative(Map<String,List<String>> graph, String start) {
  Stack<String> stack = new Stack<>();
  Set<String> visited = new HashSet<>();
  stack.push(start);
  while (!stack.isEmpty()) {
    String node = stack.pop();
    if (visited.contains(node)) continue;
    visited.add(node);
    System.out.print(node + " ");
    // Push neighbors in reverse for same order as recursive
    List<String> neighbors = graph.get(node);
    for (int i = neighbors.size()-1; i >= 0; i--)
      if (!visited.contains(neighbors.get(i)))
        stack.push(neighbors.get(i));
  }
}`}</div>
      <div className="dfs-h3">BFS vs DFS Comparison</div>
      <table className="dfs-tbl">
        <thead><tr><th>Property</th><th>BFS</th><th>DFS</th></tr></thead>
        <tbody>
          <tr><td>Data structure</td><td>Queue</td><td>Stack / Recursion</td></tr>
          <tr><td>Shortest path</td><td>Yes (unweighted)</td><td>No</td></tr>
          <tr><td>Memory</td><td>O(V) — wide</td><td>O(h) — deep</td></tr>
          <tr><td>Use case</td><td>Shortest path, level order</td><td>Topological sort, cycles</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Chapter 3: Interactive DFS ──
function SecInteractive() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("Press Step to start DFS from A");

  function nextStep() {
    const next = Math.min(step + 1, DFS_ORDER.length);
    setStep(next);
    if (next === 0) setStatus("Press Step to start DFS from A");
    else if (next <= DFS_ORDER.length) {
      setStatus(`Visiting: ${DFS_ORDER[next-1]} (step ${next}/${DFS_ORDER.length})`);
      if (next === DFS_ORDER.length) setStatus("✓ DFS complete! Order: A → B → C → D → E");
    }
  }

  function reset() { setStep(0); setStatus("Press Step to start DFS from A"); }

  return (
    <div className="dfs-sec">
      <span className="dfs-tag tag-green">Interactive</span>
      <div className="dfs-h2">Interactive DFS</div>
      <div className="dfs-viz">
        <GraphSVG visited={DFS_ORDER.slice(0, step)} />
        <div className="dfs-status">{status}</div>
        <div style={{marginTop:8,fontSize:12,color:"var(--color-text-tertiary)"}}>
          Visited: [{DFS_ORDER.slice(0,step).join(" → ")}]
        </div>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button className="dfs-btn primary" onClick={nextStep} disabled={step >= DFS_ORDER.length}>Step →</button>
        <button className="dfs-btn" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

// ── Chapter 4: Applications ──
function SecApplications() {
  return (
    <div className="dfs-sec">
      <span className="dfs-tag tag-blue">Applications</span>
      <div className="dfs-h2">DFS Applications</div>
      <div className="dfs-h3">Topological Sort (DAG)</div>
      <div className="dfs-code">{`// Topological sort: linear ordering of vertices
// such that for every edge u→v, u comes before v
void topoSort(int v, boolean[] visited,
              Stack<Integer> stack, List<List<Integer>> adj) {
  visited[v] = true;
  for (int u : adj.get(v))
    if (!visited[u]) topoSort(u, visited, stack, adj);
  stack.push(v); // push AFTER visiting all descendants
}
// Use case: task scheduling, build systems, course prerequisites`}</div>
      <div className="dfs-h3">Cycle Detection</div>
      <div className="dfs-code">{`// Detect cycle in directed graph using DFS
boolean hasCycle(int v, boolean[] visited,
                 boolean[] recStack, List<List<Integer>> adj) {
  visited[v] = true;
  recStack[v] = true; // in current DFS path
  for (int u : adj.get(v)) {
    if (!visited[u] && hasCycle(u, visited, recStack, adj))
      return true;
    if (recStack[u]) return true; // back edge = cycle!
  }
  recStack[v] = false;
  return false;
}`}</div>
      <div className="dfs-h3">Other Applications</div>
      <ul className="dfs-ul">
        <li>Maze solving — explore paths until exit found</li>
        <li>Connected components — find all nodes in a component</li>
        <li>Strongly connected components (Kosaraju's, Tarjan's)</li>
        <li>Solving puzzles (Sudoku, N-Queens)</li>
        <li>Finding bridges and articulation points</li>
      </ul>
    </div>
  );
}

// ── Chapter 5: Quiz ──
const QUIZ = [
  { q:"DFS uses which data structure?", opts:["Queue","Stack","Heap","Array"], ans:1 },
  { q:"DFS guarantees shortest path?", opts:["Yes, always","Only in trees","No","Only in DAGs"], ans:2 },
  { q:"Time complexity of DFS:", opts:["O(V)","O(E)","O(V+E)","O(V*E)"], ans:2 },
  { q:"Topological sort is only possible on:", opts:["Any graph","Undirected graphs","DAGs","Trees"], ans:2 },
  { q:"In recursive DFS, the call stack acts as:", opts:["Queue","Explicit stack","Heap","None"], ans:1 },
];

function SecQuiz() {
  const [answers, setAnswers] = useState({});
  function pick(i, opt) { setAnswers({...answers, [i]: opt}); }
  return (
    <div className="dfs-sec">
      <span className="dfs-tag tag-red">Quiz</span>
      <div className="dfs-h2">Test Your Knowledge</div>
      {QUIZ.map((q, i) => {
        const chosen = answers[i];
        const correct = chosen === q.ans;
        return (
          <div key={i} style={{marginBottom:16}}>
            <p className="dfs-p" style={{fontWeight:500}}>{i+1}. {q.q}</p>
            {q.opts.map((opt, oi) => (
              <button key={oi} className={`dfs-quiz-opt${chosen===oi?(correct?" correct":" wrong"):""}`}
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
  { id:"algo",  label:"Algorithm",    comp: SecAlgorithm },
  { id:"inter", label:"Interactive",  comp: SecInteractive },
  { id:"apps",  label:"Applications", comp: SecApplications },
  { id:"quiz",  label:"Quiz",         comp: SecQuiz },
];

export default function DFS({ onPrev, onNext }) {
  const [ch, setCh] = useState(0);
  const Comp = CHAPTERS[ch].comp;
  return (
    <div className="dfs-root">
      <style>{styles}</style>
      <div className="dfs-wrap">
        <div className="dfs-nav">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} className={`dfs-nb${ch===i?" on":""}`} onClick={() => setCh(i)}>
              {i+1}. {c.label}
            </button>
          ))}
        </div>
        <Comp />
        <div className="dfs-dot-row">
          {CHAPTERS.map((_, i) => <div key={i} className={`dfs-dot${ch===i?" on":""}`} onClick={() => setCh(i)} />)}
        </div>
        <div className="dfs-nav-bar">
          <button className="dfs-btn" onClick={onPrev} disabled={!onPrev}>← Prev Topic</button>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Chapter {ch+1}/{CHAPTERS.length}</span>
          <button className="dfs-btn primary" onClick={onNext} disabled={!onNext}>Next Topic →</button>
        </div>
      </div>
    </div>
  );
}
