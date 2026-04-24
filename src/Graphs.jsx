import { useState, useRef, useEffect } from "react";

const styles = `
.graph-root { font-family: var(--font-sans, sans-serif); }
.graph-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.graph-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.graph-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.graph-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.graph-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes graphFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.graph-sec { animation: graphFade .2s ease; }
.graph-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.graph-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.graph-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.graph-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.graph-ul { padding-left: 18px; margin: 6px 0; }
.graph-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.graph-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; }
.graph-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.graph-btn:hover { background: var(--color-background-secondary); }
.graph-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.graph-btn.primary:hover { opacity: .85; }
.graph-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.graph-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.graph-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.graph-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.graph-tbl tr:hover td { background: var(--color-background-secondary); }
.graph-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.graph-info p { color: var(--color-text-info); font-size: 13px; }
.graph-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
.graph-card { background: var(--color-background-secondary); border-radius: 10px; padding: 12px; }
.graph-card h4 { font-size: 13px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.graph-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.graph-quiz-opt:hover { background: var(--color-background-secondary); }
.graph-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.graph-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
.graph-dot-row { display: flex; justify-content: center; gap: 6px; padding: 16px 0 8px; }
.graph-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-border-secondary); cursor: pointer; transition: all .2s; }
.graph-dot.on { background: var(--color-text-primary); transform: scale(1.3); }
.graph-nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 0.5px solid var(--color-border-tertiary); margin-top: 24px; }
@media(max-width:500px){ .graph-2col{grid-template-columns:1fr;} }
`;

// 5-node graph: A-E in pentagon
const GRAPH_NODES = [
  { id:"A", cx:200, cy:30 },
  { id:"B", cx:330, cy:120 },
  { id:"C", cx:280, cy:260 },
  { id:"D", cx:120, cy:260 },
  { id:"E", cx:70,  cy:120 },
];
const GRAPH_EDGES = [["A","B"],["A","E"],["B","C"],["B","D"],["C","D"],["D","E"]];

function GraphSVG({ highlighted = [], edgeHighlighted = [] }) {
  const nodeMap = {};
  GRAPH_NODES.forEach(n => { nodeMap[n.id] = n; });
  return (
    <svg viewBox="0 0 400 290" style={{width:"100%",maxWidth:400}}>
      <defs><marker id="garr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="var(--color-border-secondary)" strokeWidth="1.5"/></marker></defs>
      {GRAPH_EDGES.map(([a,b]) => {
        const na = nodeMap[a], nb = nodeMap[b];
        const ehl = edgeHighlighted.some(([x,y]) => (x===a&&y===b)||(x===b&&y===a));
        return <line key={`${a}-${b}`} x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
          stroke={ehl ? "#74b9ff" : "var(--color-border-secondary)"} strokeWidth={ehl?2.5:1.5}/>;
      })}
      {GRAPH_NODES.map(n => {
        const hl = highlighted.includes(n.id);
        return (
          <g key={n.id}>
            <circle cx={n.cx} cy={n.cy} r="22"
              fill={hl ? "#74b9ff" : "var(--color-background-primary)"}
              stroke={hl ? "#74b9ff" : "var(--color-border-secondary)"}
              strokeWidth="2"/>
            <text x={n.cx} y={n.cy+5} textAnchor="middle" fontSize="14" fontWeight="700"
              fill={hl ? "#fff" : "var(--color-text-primary)"}>{n.id}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Chapter 1: Introduction ──
function SecIntro() {
  return (
    <div className="graph-sec">
      <span className="graph-tag tag-blue">Foundation</span>
      <div className="graph-h2">What is a Graph?</div>
      <p className="graph-p">A graph G = (V, E) consists of a set of <strong>vertices (nodes)</strong> V and a set of <strong>edges</strong> E connecting pairs of vertices. Graphs model relationships — social networks, maps, web links.</p>
      <div className="graph-viz"><GraphSVG /></div>
      <div className="graph-h3">Types of Graphs</div>
      <div className="graph-2col">
        <div className="graph-card"><h4>Undirected</h4><p style={{fontSize:13,color:"var(--color-text-secondary)"}}>Edges have no direction. A-B means you can go A→B or B→A. Example: friendship network.</p></div>
        <div className="graph-card"><h4>Directed (Digraph)</h4><p style={{fontSize:13,color:"var(--color-text-secondary)"}}>Edges have direction. A→B doesn't imply B→A. Example: Twitter follows, web links.</p></div>
        <div className="graph-card"><h4>Weighted</h4><p style={{fontSize:13,color:"var(--color-text-secondary)"}}>Edges have weights/costs. Example: road distances, network latency.</p></div>
        <div className="graph-card"><h4>Unweighted</h4><p style={{fontSize:13,color:"var(--color-text-secondary)"}}>All edges are equal. Used when only connectivity matters.</p></div>
      </div>
      <div className="graph-h3">Adjacency Matrix vs Adjacency List</div>
      <table className="graph-tbl">
        <thead><tr><th>Property</th><th>Matrix</th><th>List</th></tr></thead>
        <tbody>
          <tr><td>Space</td><td>O(V²)</td><td>O(V+E)</td></tr>
          <tr><td>Check edge (u,v)</td><td>O(1)</td><td>O(degree)</td></tr>
          <tr><td>Find all neighbors</td><td>O(V)</td><td>O(degree)</td></tr>
          <tr><td>Best for</td><td>Dense graphs</td><td>Sparse graphs</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Chapter 2: Representation ──
function SecRepresentation() {
  return (
    <div className="graph-sec">
      <span className="graph-tag tag-amber">Representation</span>
      <div className="graph-h2">Graph Representation</div>
      <div className="graph-h3">Adjacency Matrix (5 nodes A-E)</div>
      <div className="graph-viz">
        <svg viewBox="0 0 300 200" style={{width:"100%",maxWidth:300}}>
          {["","A","B","C","D","E"].map((h,i) => (
            <text key={i} x={20+i*44} y="20" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--color-text-primary)">{h}</text>
          ))}
          {["A","B","C","D","E"].map((row,r) => {
            const adj = {A:["B","E"],B:["A","C","D"],C:["B","D"],D:["B","C","E"],E:["A","D"]};
            return (
              <g key={row}>
                <text x="20" y={42+r*32} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--color-text-primary)">{row}</text>
                {["A","B","C","D","E"].map((col,c) => {
                  const val = adj[row].includes(col) ? 1 : 0;
                  return (
                    <g key={col}>
                      <rect x={4+c*44+22} y={28+r*32} width="36" height="26" rx="4"
                        fill={val ? "rgba(116,185,255,0.15)" : "var(--color-background-primary)"}
                        stroke={val ? "#74b9ff" : "var(--color-border-tertiary)"} strokeWidth="1"/>
                      <text x={22+c*44+22} y={46+r*32} textAnchor="middle" fontSize="13" fontWeight={val?"600":"400"}
                        fill={val ? "#74b9ff" : "var(--color-text-tertiary)"}>{val}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="graph-h3">Adjacency List</div>
      <div className="graph-code">{`// Java: Adjacency List using HashMap
Map<String, List<String>> graph = new HashMap<>();
graph.put("A", Arrays.asList("B", "E"));
graph.put("B", Arrays.asList("A", "C", "D"));
graph.put("C", Arrays.asList("B", "D"));
graph.put("D", Arrays.asList("B", "C", "E"));
graph.put("E", Arrays.asList("A", "D"));

// Or using int array (0-indexed):
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
adj.get(0).add(1); // edge 0→1
adj.get(1).add(0); // edge 1→0 (undirected)`}</div>
    </div>
  );
}

// ── Chapter 3: Graph Terminology ──
function SecTerminology() {
  return (
    <div className="graph-sec">
      <span className="graph-tag tag-green">Terminology</span>
      <div className="graph-h2">Graph Terminology</div>
      <table className="graph-tbl">
        <thead><tr><th>Term</th><th>Definition</th></tr></thead>
        <tbody>
          <tr><td>Degree</td><td>Number of edges incident to a vertex. In directed: in-degree + out-degree.</td></tr>
          <tr><td>Path</td><td>Sequence of vertices where each consecutive pair is connected by an edge.</td></tr>
          <tr><td>Cycle</td><td>A path that starts and ends at the same vertex.</td></tr>
          <tr><td>Connected</td><td>Undirected graph where there's a path between every pair of vertices.</td></tr>
          <tr><td>Strongly Connected</td><td>Directed graph where every vertex is reachable from every other.</td></tr>
          <tr><td>Tree</td><td>Connected acyclic undirected graph. N vertices, N-1 edges.</td></tr>
          <tr><td>DAG</td><td>Directed Acyclic Graph — no directed cycles. Used in scheduling, dependencies.</td></tr>
          <tr><td>Spanning Tree</td><td>Subgraph that includes all vertices with minimum edges (no cycles).</td></tr>
        </tbody>
      </table>
      <div className="graph-info"><p>For the 5-node graph above: V=5, E=6. Degree of B = 3 (connected to A, C, D). The graph is connected — you can reach any node from any other.</p></div>
    </div>
  );
}

// ── Chapter 4: Quiz ──
const QUIZ = [
  { q:"Space complexity of adjacency matrix for V vertices:", opts:["O(V)","O(E)","O(V²)","O(V+E)"], ans:2 },
  { q:"A tree with N vertices has how many edges?", opts:["N","N-1","N+1","2N"], ans:1 },
  { q:"Which is best for sparse graphs?", opts:["Adjacency matrix","Adjacency list","Both equal","Neither"], ans:1 },
  { q:"A DAG stands for:", opts:["Directed Acyclic Graph","Dense Adjacency Graph","Dynamic Array Graph","Directed Adjacent Graph"], ans:0 },
  { q:"In a directed graph, in-degree of a vertex is:", opts:["Edges going out","Edges coming in","Total edges","Degree/2"], ans:1 },
  { q:"Checking if edge (u,v) exists is O(1) in:", opts:["Adjacency list","Adjacency matrix","Both","Neither"], ans:1 },
];

function SecQuiz() {
  const [answers, setAnswers] = useState({});
  function pick(i, opt) { setAnswers({...answers, [i]: opt}); }
  return (
    <div className="graph-sec">
      <span className="graph-tag tag-red">Quiz</span>
      <div className="graph-h2">Test Your Knowledge</div>
      {QUIZ.map((q, i) => {
        const chosen = answers[i];
        const correct = chosen === q.ans;
        return (
          <div key={i} style={{marginBottom:16}}>
            <p className="graph-p" style={{fontWeight:500}}>{i+1}. {q.q}</p>
            {q.opts.map((opt, oi) => (
              <button key={oi} className={`graph-quiz-opt${chosen===oi?(correct?" correct":" wrong"):""}`}
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
  { id:"intro",  label:"Introduction",  comp: SecIntro },
  { id:"repr",   label:"Representation",comp: SecRepresentation },
  { id:"terms",  label:"Terminology",   comp: SecTerminology },
  { id:"quiz",   label:"Quiz",          comp: SecQuiz },
];

export default function Graphs({ onPrev, onNext, onChapterChange }) {
  const [ch, setCh] = useState(0);
  const Comp = CHAPTERS[ch].comp;
  return (
    <div className="graph-root">
      <style>{styles}</style>
      <div className="graph-wrap">
        <div className="graph-nav">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} className={`graph-nb${ch===i?" on":""}`} onClick={() => setCh(i)}>
              {i+1}. {c.label}
            </button>
          ))}
        </div>
        <Comp />
        <div className="graph-dot-row">
          {CHAPTERS.map((_, i) => <div key={i} className={`graph-dot${ch===i?" on":""}`} onClick={() => setCh(i)} />)}
        </div>
        <div className="graph-nav-bar">
          <button className="graph-btn" onClick={onPrev} disabled={!onPrev}>← Prev Topic</button>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Chapter {ch+1}/{CHAPTERS.length}</span>
          <button className="graph-btn primary" onClick={onNext} disabled={!onNext}>Next Topic →</button>
        </div>
      </div>
    </div>
  );
}
