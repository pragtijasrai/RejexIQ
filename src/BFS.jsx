import { useState, useRef, useEffect } from "react";

const styles = `
.bfs-root { font-family: var(--font-sans, sans-serif); }
.bfs-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.bfs-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.bfs-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.bfs-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.bfs-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes bfsFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.bfs-sec { animation: bfsFade .2s ease; }
.bfs-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.bfs-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.bfs-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.bfs-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.bfs-ul { padding-left: 18px; margin: 6px 0; }
.bfs-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.bfs-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; }
.bfs-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.bfs-btn:hover { background: var(--color-background-secondary); }
.bfs-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.bfs-btn.primary:hover { opacity: .85; }
.bfs-btn:disabled { opacity: .4; cursor: default; }
.bfs-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.bfs-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.bfs-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.bfs-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.bfs-tbl tr:hover td { background: var(--color-background-secondary); }
.bfs-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.bfs-info p { color: var(--color-text-info); font-size: 13px; }
.bfs-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.bfs-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.bfs-quiz-opt:hover { background: var(--color-background-secondary); }
.bfs-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.bfs-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
.bfs-dot-row { display: flex; justify-content: center; gap: 6px; padding: 16px 0 8px; }
.bfs-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-border-secondary); cursor: pointer; transition: all .2s; }
.bfs-dot.on { background: var(--color-text-primary); transform: scale(1.3); }
.bfs-nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 0.5px solid var(--color-border-tertiary); margin-top: 24px; }
`;

// 5-node graph
const NODES = [
  { id:"A", cx:200, cy:30 },
  { id:"B", cx:330, cy:120 },
  { id:"C", cx:280, cy:250 },
  { id:"D", cx:120, cy:250 },
  { id:"E", cx:70,  cy:120 },
];
const EDGES = [["A","B"],["A","E"],["B","C"],["B","D"],["C","D"],["D","E"]];
const ADJ = { A:["B","E"], B:["A","C","D"], C:["B","D"], D:["B","C","E"], E:["A","D"] };

// BFS order from A: A, B, E, C, D
const BFS_LEVELS = [["A"],["B","E"],["C","D"]];
const BFS_ORDER = ["A","B","E","C","D"];

const LEVEL_COLORS = ["#e17055","#0984e3","#00b894","#6c5ce7","#fdcb6e"];

function GraphSVG({ visited = [], current = null }) {
  const nodeMap = {};
  NODES.forEach(n => { nodeMap[n.id] = n; });
  return (
    <svg viewBox="0 0 400 280" style={{width:"100%",maxWidth:400}}>
      {EDGES.map(([a,b]) => (
        <line key={`${a}-${b}`} x1={nodeMap[a].cx} y1={nodeMap[a].cy} x2={nodeMap[b].cx} y2={nodeMap[b].cy}
          stroke="var(--color-border-secondary)" strokeWidth="1.5"/>
      ))}
      {NODES.map(n => {
        const vIdx = visited.indexOf(n.id);
        const isCurr = n.id === current;
        const color = vIdx >= 0 ? LEVEL_COLORS[vIdx % LEVEL_COLORS.length] : "var(--color-background-primary)";
        return (
          <g key={n.id}>
            <circle cx={n.cx} cy={n.cy} r="22"
              fill={color}
              stroke={isCurr ? "#fff" : (vIdx >= 0 ? color : "var(--color-border-secondary)")}
              strokeWidth={isCurr ? 3 : 2}/>
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
    <div className="bfs-sec">
      <span className="bfs-tag tag-blue">Foundation</span>
      <div className="bfs-h2">Breadth-First Search</div>
      <p className="bfs-p">BFS explores a graph <strong>level by level</strong> — visiting all neighbors of a node before moving deeper. It uses a <strong>Queue (FIFO)</strong> to track the next nodes to visit.</p>
      <div className="bfs-viz"><GraphSVG visited={BFS_ORDER} /></div>
      <div className="bfs-h3">Key Properties</div>
      <ul className="bfs-ul">
        <li>Explores all nodes at distance k before nodes at distance k+1</li>
        <li>Guarantees shortest path in unweighted graphs</li>
        <li>Uses a Queue — FIFO order</li>
        <li>Needs a visited set to avoid revisiting nodes</li>
        <li>Time: O(V+E), Space: O(V)</li>
      </ul>
      <div className="bfs-info"><p>BFS from A visits: A → B, E (level 1) → C, D (level 2). The order within a level depends on adjacency list order.</p></div>
    </div>
  );
}

// ── Chapter 2: Algorithm + Code ──
function SecAlgorithm() {
  return (
    <div className="bfs-sec">
      <span className="bfs-tag tag-amber">Algorithm</span>
      <div className="bfs-h2">BFS Algorithm</div>
      <div className="bfs-code">{`void bfs(Map<String, List<String>> graph, String start) {
  Queue<String> queue = new LinkedList<>();
  Set<String> visited = new HashSet<>();

  queue.offer(start);
  visited.add(start);

  while (!queue.isEmpty()) {
    String node = queue.poll();       // dequeue
    System.out.print(node + " ");     // process

    for (String neighbor : graph.get(node)) {
      if (!visited.contains(neighbor)) {
        visited.add(neighbor);
        queue.offer(neighbor);        // enqueue unvisited
      }
    }
  }
}
// BFS from A: A B E C D
// Time:  O(V + E)
// Space: O(V) — queue + visited set`}</div>
      <div className="bfs-h3">Step-by-step trace (start=A)</div>
      <table className="bfs-tbl">
        <thead><tr><th>Step</th><th>Dequeue</th><th>Queue after</th><th>Visited</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>A</td><td>[B, E]</td><td>{"{A}"}</td></tr>
          <tr><td>2</td><td>B</td><td>[E, C, D]</td><td>{"{A,B}"}</td></tr>
          <tr><td>3</td><td>E</td><td>[C, D]</td><td>{"{A,B,E}"}</td></tr>
          <tr><td>4</td><td>C</td><td>[D]</td><td>{"{A,B,E,C}"}</td></tr>
          <tr><td>5</td><td>D</td><td>[]</td><td>{"{A,B,E,C,D}"}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Chapter 3: Interactive BFS ──
function SecInteractive() {
  const [visited, setVisited] = useState([]);
  const [status, setStatus] = useState("Click 'Start BFS' to begin from node A");
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  function startBFS() {
    if (running) return;
    setVisited([]);
    setRunning(true);
    setStatus("BFS starting from A...");
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setVisited(BFS_ORDER.slice(0, i));
      setStatus(`Visiting: ${BFS_ORDER[i-1]} (step ${i}/${BFS_ORDER.length})`);
      if (i >= BFS_ORDER.length) {
        clearInterval(timerRef.current);
        setRunning(false);
        setStatus("✓ BFS complete! Order: A → B → E → C → D");
      }
    }, 600);
  }

  function reset() {
    clearInterval(timerRef.current);
    setVisited([]);
    setRunning(false);
    setStatus("Click 'Start BFS' to begin from node A");
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="bfs-sec">
      <span className="bfs-tag tag-green">Interactive</span>
      <div className="bfs-h2">Interactive BFS</div>
      <div className="bfs-viz">
        <GraphSVG visited={visited} />
        <div className="bfs-status">{status}</div>
        <div style={{marginTop:8,fontSize:12,color:"var(--color-text-tertiary)"}}>
          Visited order: [{visited.join(" → ")}]
        </div>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button className="bfs-btn primary" onClick={startBFS} disabled={running}>Start BFS</button>
        <button className="bfs-btn" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

// ── Chapter 4: Applications ──
function SecApplications() {
  return (
    <div className="bfs-sec">
      <span className="bfs-tag tag-blue">Applications</span>
      <div className="bfs-h2">BFS Applications</div>
      <div className="bfs-h3">Shortest Path (Unweighted)</div>
      <div className="bfs-code">{`Map<String, Integer> shortestPath(Map<String,List<String>> g, String src) {
  Map<String, Integer> dist = new HashMap<>();
  Queue<String> q = new LinkedList<>();
  dist.put(src, 0);
  q.offer(src);
  while (!q.isEmpty()) {
    String u = q.poll();
    for (String v : g.get(u)) {
      if (!dist.containsKey(v)) {
        dist.put(v, dist.get(u) + 1);
        q.offer(v);
      }
    }
  }
  return dist; // dist[v] = shortest hops from src to v
}`}</div>
      <div className="bfs-h3">Real-world Applications</div>
      <ul className="bfs-ul">
        <li>GPS navigation — shortest route in road networks</li>
        <li>Web crawlers — explore web pages level by level</li>
        <li>Social networks — find friends within N degrees</li>
        <li>Peer-to-peer networks — find nearest peers</li>
        <li>Garbage collection — mark reachable objects</li>
        <li>Level-order traversal of trees</li>
      </ul>
    </div>
  );
}

// ── Chapter 5: Quiz ──
const QUIZ = [
  { q:"BFS uses which data structure?", opts:["Stack","Queue","Heap","Array"], ans:1 },
  { q:"BFS guarantees shortest path in:", opts:["Weighted graphs","Unweighted graphs","Both","Neither"], ans:1 },
  { q:"Time complexity of BFS:", opts:["O(V)","O(E)","O(V+E)","O(V*E)"], ans:2 },
  { q:"BFS explores nodes in what order?", opts:["Depth-first","Level by level","Random","Sorted"], ans:1 },
  { q:"What prevents revisiting nodes in BFS?", opts:["Queue","Stack","Visited set","Counter"], ans:2 },
];

function SecQuiz() {
  const [answers, setAnswers] = useState({});
  function pick(i, opt) { setAnswers({...answers, [i]: opt}); }
  return (
    <div className="bfs-sec">
      <span className="bfs-tag tag-red">Quiz</span>
      <div className="bfs-h2">Test Your Knowledge</div>
      {QUIZ.map((q, i) => {
        const chosen = answers[i];
        const correct = chosen === q.ans;
        return (
          <div key={i} style={{marginBottom:16}}>
            <p className="bfs-p" style={{fontWeight:500}}>{i+1}. {q.q}</p>
            {q.opts.map((opt, oi) => (
              <button key={oi} className={`bfs-quiz-opt${chosen===oi?(correct?" correct":" wrong"):""}`}
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

export default function BFS({ onPrev, onNext, onChapterChange }) {
  const [ch, setCh] = useState(0);
  const Comp = CHAPTERS[ch].comp;
  return (
    <div className="bfs-root">
      <style>{styles}</style>
      <div className="bfs-wrap">
        <div className="bfs-nav">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} className={`bfs-nb${ch===i?" on":""}`} onClick={() => setCh(i)}>
              {i+1}. {c.label}
            </button>
          ))}
        </div>
        <Comp />
        <div className="bfs-dot-row">
          {CHAPTERS.map((_, i) => <div key={i} className={`bfs-dot${ch===i?" on":""}`} onClick={() => setCh(i)} />)}
        </div>
        <div className="bfs-nav-bar">
          <button className="bfs-btn" onClick={onPrev} disabled={!onPrev}>← Prev Topic</button>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Chapter {ch+1}/{CHAPTERS.length}</span>
          <button className="bfs-btn primary" onClick={onNext} disabled={!onNext}>Next Topic →</button>
        </div>
      </div>
    </div>
  );
}
