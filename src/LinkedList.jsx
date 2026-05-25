import { useState, useEffect, useRef } from "react";

const styles = `
* { box-sizing: border-box; }
.ll-root { font-family: var(--font-sans, sans-serif); }
.ll-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.ll-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.ll-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.ll-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.ll-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes llFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.ll-sec { animation: llFade .2s ease; }
.ll-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue { background: var(--color-background-info); color: var(--color-text-info); }
.tag-green { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red { background: var(--color-background-danger); color: var(--color-text-danger); }
.ll-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.ll-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.ll-p { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.ll-ul { padding-left: 18px; margin: 6px 0; }
.ll-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.ll-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; min-height: 80px; }
.ll-render { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; min-height: 60px; padding: 8px 0; }
.ll-node { display: flex; align-items: stretch; border-radius: 8px; overflow: hidden; border: 1.5px solid var(--color-border-secondary); font-size: 13px; font-weight: 500; transition: all .3s; }
.ll-node .data { padding: 10px 14px; background: var(--color-background-info); color: var(--color-text-info); min-width: 36px; text-align: center; }
.ll-node .ptr  { padding: 10px 10px; background: var(--color-background-success); color: var(--color-text-success); font-size: 11px; }
.ll-node.hl .data    { background: var(--color-background-warning); color: var(--color-text-warning); }
.ll-node.found .data { background: var(--color-background-success); color: var(--color-text-success); }
.ll-node.del .data   { background: var(--color-background-danger); color: var(--color-text-danger); text-decoration: line-through; }
.ll-node.new .data   { background: #EAF3DE; color: #3B6D11; animation: llPulse .6s ease; }
@keyframes llPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
.ll-arrow { font-size: 18px; color: var(--color-text-tertiary); }
.ll-null  { font-size: 12px; color: var(--color-text-tertiary); font-style: italic; padding: 10px 8px; }
.ll-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.ll-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.ll-btn:hover { background: var(--color-background-secondary); }
.ll-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.ll-btn.primary:hover { opacity: .85; }
.ll-btn:disabled { opacity: .4; cursor: default; }
.ll-inp { width: 80px; padding: 6px 10px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); }
.ll-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.ll-kw { color: #534AB7; } .ll-cm { color: var(--color-text-tertiary); } .ll-str { color: #3B6D11; } .ll-num { color: #BA7517; }
.ll-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.ll-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.ll-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.ll-tbl tr:hover td { background: var(--color-background-secondary); }
.ll-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.ll-info p { color: var(--color-text-info); font-size: 13px; }
.ll-warn { border-left: 3px solid var(--color-border-warning); padding: 10px 14px; margin: 10px 0; background: var(--color-background-warning); border-radius: 0 8px 8px 0; }
.ll-warn p { color: var(--color-text-warning); font-size: 13px; }
.ll-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
.ll-card { background: var(--color-background-secondary); border-radius: 10px; padding: 12px; }
.ll-card h4 { font-size: 13px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.ll-mem-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; margin: 10px 0; }
.ll-mem-cell { border-radius: 6px; padding: 8px 6px; text-align: center; font-size: 11px; border: 0.5px solid var(--color-border-tertiary); background: var(--color-background-primary); }
.ll-mem-cell.used { background: var(--color-background-info); border-color: var(--color-border-info); }
.ll-mem-cell .addr { color: var(--color-text-tertiary); font-size: 10px; }
.ll-mem-cell .val  { font-weight: 500; color: var(--color-text-primary); font-size: 13px; margin: 2px 0; }
.ll-mem-cell .nxt  { color: var(--color-text-success); font-size: 10px; }
.ll-mem-cell.used .addr { color: var(--color-text-info); }
.ll-tabs { display: flex; gap: 4px; margin-bottom: 14px; }
.ll-tab { padding: 5px 12px; font-size: 12px; border-radius: 6px; border: 0.5px solid var(--color-border-tertiary); background: transparent; color: var(--color-text-secondary); cursor: pointer; }
.ll-tab.on { background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.ll-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.ll-quiz-opt:hover { background: var(--color-background-secondary); }
.ll-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.ll-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
@media(max-width:500px){ .ll-2col{grid-template-columns:1fr;} }
`;

function LLRender({ nodes, highlights = {} }) {
  if (!nodes.length) return <span className="ll-null">Empty list (HEAD → NULL)</span>;
  return (
    <>
      {nodes.map((v, i) => (
        <span key={i} style={{display:"flex",alignItems:"center",gap:4}}>
          <div className={`ll-node ${highlights[i] || ""}`}>
            <div className="data">{v}</div>
            <div className="ptr">{i === nodes.length - 1 ? "NULL" : "→"}</div>
          </div>
          {i < nodes.length - 1 && <span className="ll-arrow"></span>}
        </span>
      ))}
    </>
  );
}

function SecIntro() {
  return (
    <div className="ll-sec">
      <span className="ll-tag tag-blue">Foundation</span>
      <div className="ll-h2">What is a Linked List?</div>
      <p className="ll-p">A linked list is a <strong>linear dynamic data structure</strong> where elements (called <em>nodes</em>) are stored at non-contiguous memory locations, and each node points to the next node via a <em>pointer/reference</em>.</p>

      <div className="ll-h3">Anatomy of a Node</div>
      <div className="ll-viz">
        <svg viewBox="0 0 560 110" style={{width:"100%"}} xmlns="http://www.w3.org/2000/svg">
          <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
          <rect x="30" y="30" width="70" height="50" rx="6" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1.5"/>
          <rect x="100" y="30" width="70" height="50" rx="6" fill="#EAF3DE" stroke="#639922" strokeWidth="1.5"/>
          <text x="65" y="50" textAnchor="middle" fontSize="11" fill="#0C447C" fontWeight="500">DATA</text>
          <text x="65" y="68" textAnchor="middle" fontSize="18" fill="#0C447C" fontWeight="500">10</text>
          <text x="135" y="50" textAnchor="middle" fontSize="11" fill="#3B6D11" fontWeight="500">NEXT</text>
          <text x="135" y="68" textAnchor="middle" fontSize="12" fill="#3B6D11">0x204</text>
          <line x1="175" y1="55" x2="230" y2="55" stroke="#888" strokeWidth="1.5" markerEnd="url(#arr)"/>
          <rect x="235" y="30" width="70" height="50" rx="6" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1.5"/>
          <rect x="305" y="30" width="70" height="50" rx="6" fill="#EAF3DE" stroke="#639922" strokeWidth="1.5"/>
          <text x="270" y="50" textAnchor="middle" fontSize="11" fill="#0C447C" fontWeight="500">DATA</text>
          <text x="270" y="68" textAnchor="middle" fontSize="18" fill="#0C447C" fontWeight="500">25</text>
          <text x="340" y="50" textAnchor="middle" fontSize="11" fill="#3B6D11" fontWeight="500">NEXT</text>
          <text x="340" y="68" textAnchor="middle" fontSize="12" fill="#3B6D11">0x308</text>
          <line x1="380" y1="55" x2="430" y2="55" stroke="#888" strokeWidth="1.5" markerEnd="url(#arr)"/>
          <rect x="435" y="30" width="70" height="50" rx="6" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1.5"/>
          <rect x="505" y="30" width="50" height="50" rx="6" fill="#EAF3DE" stroke="#639922" strokeWidth="1.5"/>
          <text x="470" y="50" textAnchor="middle" fontSize="11" fill="#0C447C" fontWeight="500">DATA</text>
          <text x="470" y="68" textAnchor="middle" fontSize="18" fill="#0C447C" fontWeight="500">40</text>
          <text x="530" y="55" textAnchor="middle" fontSize="12" fill="#3B6D11" fontWeight="500">NULL</text>
          <text x="65" y="98" textAnchor="middle" fontSize="11" fill="#888">Head (0x100)</text>
          <text x="270" y="98" textAnchor="middle" fontSize="11" fill="#888">0x204</text>
          <text x="470" y="98" textAnchor="middle" fontSize="11" fill="#888">Tail (0x308)</text>
        </svg>
      </div>

      <div className="ll-h3">Array vs Linked List</div>
      <div className="ll-2col">
        <div className="ll-card"><h4>📦 Array</h4><ul className="ll-ul"><li>Contiguous memory</li><li>Fixed size (static)</li><li>Random access O(1)</li><li>Insert/Delete O(n)</li><li>No extra pointer space</li></ul></div>
        <div className="ll-card"><h4>🔗 Linked List</h4><ul className="ll-ul"><li>Non-contiguous memory</li><li>Dynamic size</li><li>Sequential access O(n)</li><li>Insert/Delete O(1) at head</li><li>Extra pointer per node</li></ul></div>
      </div>

      <div className="ll-h3">Types of Linked Lists</div>
      <div className="ll-viz">
        <svg viewBox="0 0 560 180" style={{width:"100%"}} xmlns="http://www.w3.org/2000/svg">
          <defs><marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#378ADD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
          <text x="10" y="20" fontSize="12" fill="#888" fontWeight="500">Singly</text>
          <rect x="10" y="28" width="90" height="32" rx="6" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1"/><text x="55" y="49" textAnchor="middle" fontSize="13" fill="#0C447C" fontWeight="500">10 | →</text>
          <line x1="102" y1="44" x2="130" y2="44" stroke="#378ADD" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <rect x="132" y="28" width="90" height="32" rx="6" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1"/><text x="177" y="49" textAnchor="middle" fontSize="13" fill="#0C447C" fontWeight="500">20 | →</text>
          <line x1="224" y1="44" x2="252" y2="44" stroke="#378ADD" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <rect x="254" y="28" width="90" height="32" rx="6" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1"/><text x="299" y="49" textAnchor="middle" fontSize="13" fill="#0C447C" fontWeight="500">30 | ∅</text>
          <text x="10" y="95" fontSize="12" fill="#888" fontWeight="500">Doubly</text>
          <rect x="10" y="103" width="110" height="32" rx="6" fill="#F4C0D1" stroke="#D4537E" strokeWidth="1"/><text x="65" y="123" textAnchor="middle" fontSize="12" fill="#72243E" fontWeight="500">∅ | 10 | →</text>
          <line x1="122" y1="119" x2="148" y2="119" stroke="#D4537E" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <line x1="148" y1="125" x2="122" y2="125" stroke="#D4537E" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <rect x="150" y="103" width="110" height="32" rx="6" fill="#F4C0D1" stroke="#D4537E" strokeWidth="1"/><text x="205" y="123" textAnchor="middle" fontSize="12" fill="#72243E" fontWeight="500">← | 20 | →</text>
          <line x1="262" y1="119" x2="288" y2="119" stroke="#D4537E" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <line x1="288" y1="125" x2="262" y2="125" stroke="#D4537E" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <rect x="290" y="103" width="110" height="32" rx="6" fill="#F4C0D1" stroke="#D4537E" strokeWidth="1"/><text x="345" y="123" textAnchor="middle" fontSize="12" fill="#72243E" fontWeight="500">← | 30 | ∅</text>
          <text x="10" y="170" fontSize="12" fill="#888" fontWeight="500">Circular</text>
          <rect x="60" y="152" width="80" height="26" rx="5" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1"/><text x="100" y="169" textAnchor="middle" fontSize="12" fill="#085041" fontWeight="500">10 | →</text>
          <rect x="175" y="152" width="80" height="26" rx="5" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1"/><text x="215" y="169" textAnchor="middle" fontSize="12" fill="#085041" fontWeight="500">20 | →</text>
          <rect x="290" y="152" width="80" height="26" rx="5" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1"/><text x="330" y="169" textAnchor="middle" fontSize="12" fill="#085041" fontWeight="500">30 | →</text>
          <line x1="142" y1="165" x2="173" y2="165" stroke="#1D9E75" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <line x1="257" y1="165" x2="288" y2="165" stroke="#1D9E75" strokeWidth="1.5" markerEnd="url(#arr2)"/>
          <path d="M370 165 Q420 165 420 145 Q420 135 340 135 Q200 135 100 135 Q60 135 60 152" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr2)"/>
        </svg>
      </div>

      <div className="ll-h3">When to use a Linked List?</div>
      <ul className="ll-ul">
        <li>Frequent insertions/deletions at the beginning or middle</li>
        <li>Size of data is unknown in advance (dynamic)</li>
        <li>Implementing stacks, queues, hash chaining</li>
        <li>When you don't need random access</li>
      </ul>
    </div>
  );
}

function SecMemory() {
  const addrs = ['0x100','0x104','0x108','0x10C','0x110','0x114','0x118','0x11C','0x120','0x124','0x128','0x12C','0x130','0x134','0x138','0x13C'];
  const used = {
    '0x100': { val:'10',   nxt:'→0x118' },
    '0x104': { val:'0x118',nxt:'' },
    '0x118': { val:'25',   nxt:'→0x130' },
    '0x11C': { val:'0x130',nxt:'' },
    '0x130': { val:'40',   nxt:'→NULL' },
    '0x134': { val:'NULL', nxt:'' },
  };
  return (
    <div className="ll-sec">
      <span className="ll-tag tag-amber">Deep Dive</span>
      <div className="ll-h2">Memory Representation</div>
      <p className="ll-p">Unlike arrays, nodes can sit <em>anywhere</em> in memory — they're connected only by pointers.</p>

      <div className="ll-h3">Simulated RAM</div>
      <div className="ll-viz">
        <div className="ll-mem-grid">
          {addrs.map(a => {
            const u = used[a];
            return u ? (
              <div key={a} className="ll-mem-cell used">
                <div className="addr">{a}</div>
                <div className="val">{u.val}</div>
                <div className="nxt">{u.nxt}</div>
              </div>
            ) : (
              <div key={a} className="ll-mem-cell">
                <div className="addr">{a}</div>
                <div className="val" style={{color:"var(--color-text-tertiary)"}}>—</div>
                <div className="nxt"> </div>
              </div>
            );
          })}
        </div>
        <p style={{fontSize:12,color:"var(--color-text-tertiary)",marginTop:8}}>Blue = allocated node cells. Each node uses 2 addresses: one for data, one for the next pointer.</p>
      </div>

      <div className="ll-info"><p>KEY INSIGHT: Losing the HEAD pointer = losing the entire list. Always update HEAD carefully during insertions/deletions at the front.</p></div>

      <div className="ll-h3">Node Structure in C</div>
      <div className="ll-code">{`struct Node {
  int  data;           
  struct Node *next;   
};

struct Node* createNode(int val) {
  struct Node* n = (struct Node*) malloc(sizeof(struct Node));
  n->data = val;
  n->next = NULL;
  return n;
}`}</div>

      <div className="ll-h3">Memory Layout: Array vs Linked List</div>
      <div className="ll-viz">
        <svg viewBox="0 0 560 200" style={{width:"100%"}} xmlns="http://www.w3.org/2000/svg">
          <defs><marker id="a3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#D4537E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
          <text x="10" y="20" fontSize="12" fontWeight="500" fill="#888">Array [10,20,30,40] — Contiguous</text>
          {[10,20,30,40].map((v,i) => (
            <g key={i}>
              <rect x={10+i*62} y="28" width="60" height="38" rx="4" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1"/>
              <text x={40+i*62} y="42" textAnchor="middle" fontSize="15" fontWeight="500" fill="#0C447C">{v}</text>
              <text x={40+i*62} y="58" textAnchor="middle" fontSize="10" fill="#378ADD">{100+i*4}</text>
            </g>
          ))}
          <text x="10" y="100" fontSize="12" fontWeight="500" fill="#888">Linked List [10→20→30→40] — Scattered</text>
          <rect x="10"  y="108" width="50" height="36" rx="4" fill="#F4C0D1" stroke="#D4537E" strokeWidth="1"/>
          <text x="35"  y="122" textAnchor="middle" fontSize="14" fontWeight="500" fill="#72243E">10</text>
          <text x="35"  y="136" textAnchor="middle" fontSize="9" fill="#D4537E">→0x1C4</text>
          <text x="35"  y="155" textAnchor="middle" fontSize="9" fill="#888">0x100</text>
          <rect x="180" y="108" width="50" height="36" rx="4" fill="#F4C0D1" stroke="#D4537E" strokeWidth="1"/>
          <text x="205" y="122" textAnchor="middle" fontSize="14" fontWeight="500" fill="#72243E">20</text>
          <text x="205" y="136" textAnchor="middle" fontSize="9" fill="#D4537E">→0x380</text>
          <text x="205" y="155" textAnchor="middle" fontSize="9" fill="#888">0x1C4</text>
          <rect x="380" y="108" width="50" height="36" rx="4" fill="#F4C0D1" stroke="#D4537E" strokeWidth="1"/>
          <text x="405" y="122" textAnchor="middle" fontSize="14" fontWeight="500" fill="#72243E">30</text>
          <text x="405" y="136" textAnchor="middle" fontSize="9" fill="#D4537E">→0x290</text>
          <text x="405" y="155" textAnchor="middle" fontSize="9" fill="#888">0x380</text>
          <rect x="280" y="160" width="50" height="36" rx="4" fill="#F4C0D1" stroke="#D4537E" strokeWidth="1"/>
          <text x="305" y="174" textAnchor="middle" fontSize="14" fontWeight="500" fill="#72243E">40</text>
          <text x="305" y="188" textAnchor="middle" fontSize="9" fill="#D4537E">→NULL</text>
          <path d="M62 126 Q120 126 178 126" fill="none" stroke="#D4537E" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#a3)"/>
          <path d="M232 126 Q300 80 378 126" fill="none" stroke="#D4537E" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#a3)"/>
          <path d="M406 144 Q406 178 332 178" fill="none" stroke="#D4537E" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#a3)"/>
        </svg>
      </div>
      <div className="ll-warn"><p>EXAM TIP: On a 64-bit system, a pointer is 8 bytes. A node with one int takes 4 + 8 = 12 bytes (with padding, often 16 bytes).</p></div>
    </div>
  );
}

function SecTraversal() {
  const BASE = [10,20,30,40,50];
  const [list] = useState(BASE);
  const [idx, setIdx] = useState(-1);
  const timerRef = useRef(null);

  function step() {
    setIdx(i => {
      const next = i + 1;
      return next > list.length ? -1 : next;
    });
  }

  function reset() {
    clearInterval(timerRef.current);
    setIdx(-1);
  }

  function autoPlay() {
    reset();
    let i = 0;
    timerRef.current = setInterval(() => {
      setIdx(i);
      i++;
      if (i > list.length) { clearInterval(timerRef.current); }
    }, 700);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  const hl = {};
  if (idx >= 0 && idx < list.length) hl[idx] = "hl";

  const statusMsg = idx === -1 ? "Press Step to start traversal"
    : idx >= list.length ? "✓ Traversal complete! curr = NULL → Loop ends"
    : `Visiting node ${idx}: data = ${list[idx]}, moving curr to curr→next`;

  const currLabel = idx === -1 ? "HEAD" : idx >= list.length ? "NULL" : `node[${idx}] = ${list[idx]}`;

  return (
    <div className="ll-sec">
      <span className="ll-tag tag-green">Interactive</span>
      <div className="ll-h2">Traversing a Linked List</div>
      <p className="ll-p">A temporary pointer <code>curr</code> walks through the list — we never move HEAD itself.</p>
      <div className="ll-viz">
        <div className="ll-render"><LLRender nodes={list} highlights={hl} /></div>
        <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>curr →</span>
          <span style={{fontSize:13,fontWeight:500,color:"var(--color-text-warning)",minWidth:40}}>{currLabel}</span>
        </div>
        <div className="ll-status">{statusMsg}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <button className="ll-btn primary" onClick={step}>Step →</button>
        <button className="ll-btn" onClick={reset}>Reset</button>
        <button className="ll-btn" onClick={autoPlay}>Auto Play</button>
      </div>

      <div className="ll-h3">Algorithm</div>
      <div className="ll-code">{`void traverse(Node *head) {
  Node *curr = head;           
  while (curr != NULL) {       
    printf("%d ", curr->data); 
    curr = curr->next;         
  }
}
`}</div>
      <div className="ll-h3">Traversal for Search</div>
      <div className="ll-code">{`Node* search(Node *head, int key) {
  Node *curr = head;
  while (curr != NULL) {
    if (curr->data == key) return curr; 
    curr = curr->next;
  }
  return NULL; 
}
`}</div>
      <div className="ll-h3">Counting Nodes</div>
      <div className="ll-code">{`int countNodes(Node *head) {
  int count = 0;
  Node *curr = head;
  while (curr != NULL) { count++; curr = curr->next; }
  return count;
}
`}</div>
      <div className="ll-info"><p>KEY RULE: Always use a temporary pointer for traversal. Never move <code>head</code> directly — if you do, you lose access to the beginning of the list forever.</p></div>
    </div>
  );
}

function SecInsert() {
  const [tab, setTab] = useState("unsorted");
  
  const [uList, setUList] = useState([10,20,30,40]);
  const [uVal, setUVal] = useState(55);
  const [uPos, setUPos] = useState(2);
  const [uStatus, setUStatus] = useState("");
  const [uHl, setUHl] = useState({});
  
  const [sList, setSList] = useState([5,15,25,45,60]);
  const [sVal, setSVal] = useState(35);
  const [sStatus, setSStatus] = useState("List is sorted ascending");
  const [sHl, setSHl] = useState({});

  function flash(setHl, idx, setList, newList, msg, setStatus) {
    setHl({[idx]:"new"});
    setList(newList);
    setStatus(msg);
    setTimeout(() => setHl({}), 800);
  }

  function insertBegin() {
    const v = parseInt(uVal) || 55;
    const nl = [v, ...uList];
    flash(setUHl, 0, setUList, nl, `Inserted ${v} at beginning. newNode→next = old_head. head = newNode. O(1)`, setUStatus);
  }
  function insertEnd() {
    const v = parseInt(uVal) || 55;
    const nl = [...uList, v];
    flash(setUHl, nl.length-1, setUList, nl, `Inserted ${v} at end. Traversed to last node, set last→next = newNode. O(n)`, setUStatus);
  }
  function insertAtPos() {
    const v = parseInt(uVal) || 55, p = parseInt(uPos) || 0;
    if (p < 0 || p > uList.length) { setUStatus("Invalid position!"); return; }
    const nl = [...uList]; nl.splice(p, 0, v);
    flash(setUHl, p, setUList, nl, `Inserted ${v} at position ${p}. Traversed to pos ${p-1}, updated pointers. O(n)`, setUStatus);
  }
  function insertSorted() {
    const v = parseInt(sVal) || 35;
    let i = 0; while (i < sList.length && sList[i] < v) i++;
    const nl = [...sList]; nl.splice(i, 0, v);
    flash(setSHl, i, setSList, nl, `Inserted ${v} at position ${i}. Found correct spot where prev < ${v} ≤ next. O(n)`, setSStatus);
  }

  return (
    <div className="ll-sec">
      <span className="ll-tag tag-green">Interactive</span>
      <div className="ll-h2">Insertion into a Linked List</div>
      <div className="ll-tabs">
        <button className={`ll-tab ${tab==="unsorted"?"on":""}`} onClick={() => setTab("unsorted")}>Unsorted List</button>
        <button className={`ll-tab ${tab==="sorted"?"on":""}`} onClick={() => setTab("sorted")}>Sorted List</button>
      </div>

      {tab === "unsorted" && (
        <>
          <p className="ll-p">Insert at <strong>beginning</strong>, <strong>end</strong>, or <strong>at a position</strong>.</p>
          <div className="ll-viz">
            <div className="ll-render"><LLRender nodes={uList} highlights={uHl} /></div>
            <div className="ll-status">{uStatus}</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:10}}>
            <input type="number" className="ll-inp" value={uVal} onChange={e=>setUVal(e.target.value)} placeholder="value" />
            <input type="number" className="ll-inp" value={uPos} onChange={e=>setUPos(e.target.value)} placeholder="pos" style={{width:60}} />
            <button className="ll-btn primary" onClick={insertBegin}>At Beginning</button>
            <button className="ll-btn" onClick={insertEnd}>At End</button>
            <button className="ll-btn" onClick={insertAtPos}>At Position</button>
            <button className="ll-btn" onClick={() => { setUList([10,20,30,40]); setUStatus(""); }}>Reset</button>
          </div>
          <div className="ll-h3">At Beginning — O(1)</div>
          <div className="ll-code">{`void insertBegin(Node **head, int val) {
  Node *newNode = createNode(val);
  newNode->next = *head;  
  *head = newNode;        
}
`}</div>
          <div className="ll-h3">At End — O(n)</div>
          <div className="ll-code">{`void insertEnd(Node **head, int val) {
  Node *newNode = createNode(val);
  if (*head == NULL) { *head = newNode; return; }
  Node *curr = *head;
  while (curr->next != NULL)  
    curr = curr->next;
  curr->next = newNode;       
}
`}</div>
          <div className="ll-warn"><p>CRITICAL ORDER: Always set newNode→next BEFORE updating curr→next. If you reverse this, you lose the rest of the list!</p></div>
        </>
      )}

      {tab === "sorted" && (
        <>
          <p className="ll-p">Insert such that: <strong>all nodes before ≤ new node ≤ all nodes after</strong>.</p>
          <div className="ll-viz">
            <div className="ll-render"><LLRender nodes={sList} highlights={sHl} /></div>
            <div className="ll-status">{sStatus}</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            <input type="number" className="ll-inp" value={sVal} onChange={e=>setSVal(e.target.value)} placeholder="value" />
            <button className="ll-btn primary" onClick={insertSorted}>Insert Sorted</button>
            <button className="ll-btn" onClick={() => { setSList([5,15,25,45,60]); setSStatus("List is sorted ascending"); }}>Reset</button>
          </div>
          <div className="ll-h3">Algorithm — O(n)</div>
          <div className="ll-code">{`void insertSorted(Node **head, int val) {
  Node *newNode = createNode(val);
  
  if (*head == NULL || (*head)->data >= val) {
    newNode->next = *head;
    *head = newNode; return;
  }
  
  Node *curr = *head;
  while (curr->next != NULL && curr->next->data < val)
    curr = curr->next;
  newNode->next = curr->next;
  curr->next = newNode;
}
`}</div>
          <div className="ll-info"><p>Three cases: (1) empty list, (2) insert before head (new minimum), (3) insert in middle or at end. Always check all three in exams!</p></div>
        </>
      )}
    </div>
  );
}

function SecDelete() {
  const [list, setList] = useState([10,20,30,40,50]);
  const [delVal, setDelVal] = useState(30);
  const [status, setStatus] = useState("");
  const [hl, setHl] = useState({});

  function animateDel(idx, msg, newList) {
    setHl({[idx]:"del"});
    setStatus(msg);
    setTimeout(() => { setList(newList); setHl({}); setStatus(`✓ Done. O(${idx === 0 || idx === list.length-1 ? "1" : "n"})`); }, 800);
  }

  function deleteByVal() {
    const v = parseInt(delVal) || 30;
    const i = list.indexOf(v);
    if (i === -1) { setStatus(`Value ${v} not found`); return; }
    animateDel(i, `Found ${v} at index ${i}. Linking prev→next to bypass it...`, list.filter((_,j) => j !== i));
  }
  function deleteFirst() {
    if (!list.length) { setStatus("List is empty!"); return; }
    animateDel(0, `Deleting head (${list[0]}). Moving head to head→next...`, list.slice(1));
  }
  function deleteLast() {
    if (!list.length) { setStatus("List is empty!"); return; }
    animateDel(list.length-1, `Traversing to second-to-last. Setting its next = NULL...`, list.slice(0,-1));
  }

  return (
    <div className="ll-sec">
      <span className="ll-tag tag-red">Interactive</span>
      <div className="ll-h2">Deleting Elements</div>
      <p className="ll-p">Deletion requires updating the pointer of the previous node to skip the deleted node, then freeing its memory.</p>
      <div className="ll-viz">
        <div className="ll-render"><LLRender nodes={list} highlights={hl} /></div>
        <div className="ll-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:12}}>
        <input type="number" className="ll-inp" value={delVal} onChange={e=>setDelVal(e.target.value)} placeholder="value" />
        <button className="ll-btn primary" onClick={deleteByVal}>Delete by Value</button>
        <button className="ll-btn" onClick={deleteFirst}>Delete First</button>
        <button className="ll-btn" onClick={deleteLast}>Delete Last</button>
        <button className="ll-btn" onClick={() => { setList([10,20,30,40,50]); setStatus(""); setHl({}); }}>Reset</button>
      </div>

      <div className="ll-h3">Delete by Value — O(n)</div>
      <div className="ll-code">{`void deleteByVal(Node **head, int key) {
  if (*head == NULL) return;
  
  if ((*head)->data == key) {
    Node *temp = *head;
    *head = (*head)->next;
    free(temp); return;
  }
  
  Node *curr = *head;
  while (curr->next != NULL && curr->next->data != key)
    curr = curr->next;
  if (curr->next == NULL) return; 
  Node *temp = curr->next;
  curr->next = curr->next->next;  
  free(temp);
}
`}</div>
      <div className="ll-h3">Delete First — O(1)</div>
      <div className="ll-code">{`void deleteFirst(Node **head) {
  if (*head == NULL) return;
  Node *temp = *head;       
  *head = (*head)->next;    
  free(temp);               
}
`}</div>
      <div className="ll-warn"><p>NEVER forget to free() memory in C/C++! Always save the node in a temp pointer before unlinking it.</p></div>

      <div className="ll-h3">Complexity Summary</div>
      <table className="ll-tbl">
        <thead><tr><th>Operation</th><th>At Head</th><th>At Tail</th><th>By Value</th></tr></thead>
        <tbody>
          <tr><td>Insert</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td style={{color:"var(--color-text-warning)"}}>O(n)</td><td style={{color:"var(--color-text-warning)"}}>O(n)</td></tr>
          <tr><td>Delete</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td style={{color:"var(--color-text-warning)"}}>O(n)</td><td style={{color:"var(--color-text-warning)"}}>O(n)</td></tr>
          <tr><td>Search</td><td>O(1)</td><td style={{color:"var(--color-text-warning)"}}>O(n)</td><td style={{color:"var(--color-text-warning)"}}>O(n)</td></tr>
          <tr><td>Access (by index)</td><td>O(1)</td><td style={{color:"var(--color-text-warning)"}}>O(n)</td><td style={{color:"var(--color-text-warning)"}}>O(n)</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function DoublyRender({ nodes, msg }) {
  if (!nodes.length) return <span className="ll-null">Empty (HEAD = NULL)</span>;
  return (
    <>
      {nodes.map((v, i) => (
        <span key={i} style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{display:"flex",alignItems:"stretch",borderRadius:8,overflow:"hidden",border:"1.5px solid var(--color-border-secondary)",fontSize:12,fontWeight:500}}>
            <div style={{padding:"8px",background:"var(--color-background-danger)",color:"var(--color-text-danger)",fontSize:11}}>{i===0?"∅":"←"}</div>
            <div style={{padding:"8px 12px",background:"var(--color-background-info)",color:"var(--color-text-info)"}}>{v}</div>
            <div style={{padding:"8px",background:"var(--color-background-success)",color:"var(--color-text-success)",fontSize:11}}>{i===nodes.length-1?"∅":"→"}</div>
          </div>
          {i < nodes.length-1 && <span style={{fontSize:16,color:"var(--color-text-tertiary)"}}>⇄</span>}
        </span>
      ))}
    </>
  );
}

function SecDoubly() {
  const [list, setList] = useState([10,20,30,40]);
  const [val, setVal] = useState(50);
  const [status, setStatus] = useState("");

  return (
    <div className="ll-sec">
      <span className="ll-tag tag-blue">Advanced</span>
      <div className="ll-h2">Doubly Linked List</div>
      <p className="ll-p">Each node has <strong>two pointers</strong>: <code>prev</code> pointing backward and <code>next</code> pointing forward.</p>

      <div className="ll-h3">Node Structure</div>
      <div className="ll-viz">
        <svg viewBox="0 0 560 90" style={{width:"100%"}} xmlns="http://www.w3.org/2000/svg">
          <defs><marker id="a4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#D4537E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
          {[[10,10,"NULL","→"],[230,20,"←","→"],[407,30,"←","NULL"]].map(([x,dx,prev,next],i) => (
            <g key={i}>
              <rect x={x}    y="20" width="52" height="46" rx="6" fill="#FBEAF0" stroke="#D4537E" strokeWidth="1.5"/>
              <rect x={x+52} y="20" width="52" height="46" rx="6" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1.5"/>
              <rect x={x+104}y="20" width="52" height="46" rx="6" fill="#FBEAF0" stroke="#D4537E" strokeWidth="1.5"/>
              <text x={x+26}    y="38" textAnchor="middle" fontSize="10" fill="#72243E" fontWeight="500">PREV</text>
              <text x={x+78}    y="38" textAnchor="middle" fontSize="10" fill="#0C447C" fontWeight="500">DATA</text>
              <text x={x+130}   y="38" textAnchor="middle" fontSize="10" fill="#72243E" fontWeight="500">NEXT</text>
              <text x={x+26}    y="55" textAnchor="middle" fontSize="12" fill="#72243E">{prev}</text>
              <text x={x+78}    y="55" textAnchor="middle" fontSize="18" fill="#0C447C" fontWeight="500">{[10,20,30][i]}</text>
              <text x={x+130}   y="55" textAnchor="middle" fontSize="12" fill="#72243E">{next}</text>
            </g>
          ))}
          <line x1="168" y1="38" x2="228" y2="38" stroke="#D4537E" strokeWidth="1.5" markerEnd="url(#a4)"/>
          <line x1="388" y1="38" x2="453" y2="38" stroke="#D4537E" strokeWidth="1.5" markerEnd="url(#a4)"/>
          <line x1="228" y1="50" x2="168" y2="50" stroke="#378ADD" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#a4)"/>
          <line x1="453" y1="50" x2="388" y2="50" stroke="#378ADD" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#a4)"/>
        </svg>
      </div>

      <div className="ll-h3">Interactive Doubly LL</div>
      <div className="ll-viz">
        <div className="ll-render"><DoublyRender nodes={list} /></div>
        <div className="ll-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <input type="number" className="ll-inp" value={val} onChange={e=>setVal(e.target.value)} placeholder="value" />
        <button className="ll-btn primary" onClick={() => { const v=parseInt(val)||50; setList([v,...list]); setStatus(`Inserted ${v} at front. Updated new→next=old_head, old_head→prev=new. O(1)`); }}>Insert Front</button>
        <button className="ll-btn" onClick={() => { const v=parseInt(val)||50; setList([...list,v]); setStatus(`Inserted ${v} at end. Updated new→prev=old_last, old_last→next=new. O(n)`); }}>Insert End</button>
        <button className="ll-btn" onClick={() => { if(!list.length)return; const v=list[0]; setList(list.slice(1)); setStatus(`Deleted front (${v}). new_head→prev=NULL. O(1)`); }}>Delete Front</button>
        <button className="ll-btn" onClick={() => { if(!list.length)return; const v=list[list.length-1]; setList(list.slice(0,-1)); setStatus(`Deleted end (${v}). new_tail→next=NULL. O(n)`); }}>Delete End</button>
        <button className="ll-btn" onClick={() => setStatus("Backward: "+[...list].reverse().join(" ← ")+" (via prev pointers)")}>Traverse ←</button>
        <button className="ll-btn" onClick={() => { setList([10,20,30,40]); setStatus(""); }}>Reset</button>
      </div>

      <div className="ll-h3">Delete a Given Node — O(1) if pointer is known</div>
      <div className="ll-code">{`void deleteNode(DNode **head, DNode *del) {
  if (*head == NULL || del == NULL) return;
  if (*head == del) *head = del->next;
  if (del->next != NULL)
    del->next->prev = del->prev;  
  if (del->prev != NULL)
    del->prev->next = del->next;  
  free(del);
}
`}</div>
      <div className="ll-2col" style={{marginTop:12}}>
        <div className="ll-card"><h4>Advantages</h4><ul className="ll-ul"><li>Traverse in both directions</li><li>Delete given node in O(1)</li><li>Insert before given node in O(1)</li></ul></div>
        <div className="ll-card"><h4>Disadvantages</h4><ul className="ll-ul"><li>Extra memory (prev pointer)</li><li>More complex insert/delete code</li><li>Must update both prev & next</li></ul></div>
      </div>
    </div>
  );
}

function CircularSVG({ nodes, highlight }) {
  const n = nodes.length;
  if (!n) return <text x="280" y="100" textAnchor="middle" fontSize="14" fill="#888">Empty Circular List</text>;
  const cx = 280, cy = 100, r = 70;
  const positions = nodes.map((_, i) => {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return (
    <>
      <defs><marker id="ac" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
      {positions.map((p, i) => {
        const next = positions[(i + 1) % n];
        const dx = next.x - p.x, dy = next.y - p.y, dist = Math.sqrt(dx*dx+dy*dy);
        const ux = dx/dist, uy = dy/dist;
        const sx = p.x+ux*22, sy = p.y+uy*22, ex = next.x-ux*22, ey = next.y-uy*22;
        const isBack = i === n-1;
        return (
          <g key={`arrow-${i}`}>
            <path d={`M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`} fill="none"
              stroke={isBack?"#1D9E75":"#888"} strokeWidth={isBack?2:1.5}
              strokeDasharray={isBack?"5 3":""} markerEnd="url(#ac)"/>
            {isBack && <text x={(sx+ex)/2+5} y={cy+r*0.4} textAnchor="middle" fontSize="10" fill="#1D9E75">wraps to HEAD</text>}
          </g>
        );
      })}
      {positions.map((p, i) => {
        const isHead = i === 0, isHL = i === highlight;
        const fill = isHL?"#FAEEDA":isHead?"#E1F5EE":"#E6F1FB";
        const stroke = isHL?"#BA7517":isHead?"#1D9E75":"#378ADD";
        const tc = isHL?"#633806":isHead?"#085041":"#0C447C";
        return (
          <g key={`node-${i}`}>
            <circle cx={p.x} cy={p.y} r="20" fill={fill} stroke={stroke} strokeWidth="1.5"/>
            <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="500" fill={tc}>{nodes[i]}</text>
            {isHead && <text x={p.x} y={p.y-26} textAnchor="middle" fontSize="10" fill="#1D9E75" fontWeight="500">HEAD</text>}
          </g>
        );
      })}
    </>
  );
}

function SecCircular() {
  const [list, setList] = useState([10,20,30,40]);
  const [val, setVal] = useState(60);
  const [status, setStatus] = useState("");
  const [hl, setHl] = useState(-1);
  const timerRef = useRef(null);

  function animateTraversal() {
    clearInterval(timerRef.current);
    let i = 0;
    setStatus("Traversing...");
    timerRef.current = setInterval(() => {
      setHl(i);
      setStatus(`Visiting node: ${list[i]}${i===0?" (HEAD)":""}`);
      i = (i+1) % list.length;
      if (i === 0) {
        clearInterval(timerRef.current);
        setTimeout(() => { setHl(-1); setStatus("✓ Reached HEAD again — traversal complete!"); }, 600);
      }
    }, 600);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="ll-sec">
      <span className="ll-tag tag-amber">Applications</span>
      <div className="ll-h2">Circular Linked List</div>
      <p className="ll-p">The last node's <code>next</code> pointer points back to the <strong>HEAD</strong> instead of NULL.</p>

      <div className="ll-viz" style={{minHeight:220}}>
        <svg viewBox="0 0 560 200" style={{width:"100%"}} xmlns="http://www.w3.org/2000/svg">
          <CircularSVG nodes={list} highlight={hl} />
        </svg>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:12}}>
        <input type="number" className="ll-inp" value={val} onChange={e=>setVal(e.target.value)} placeholder="value" />
        <button className="ll-btn primary" onClick={() => { const v=parseInt(val)||60; setList([...list,v]); setHl(list.length); setStatus(`Inserted ${v}. Last node's next now points to HEAD. O(1) with last pointer.`); setTimeout(()=>setHl(-1),800); }}>Insert</button>
        <button className="ll-btn" onClick={() => { if(!list.length)return; const v=list[0]; setList(list.slice(1)); setStatus(`Deleted ${v} (was HEAD). New HEAD = next node.`); }}>Delete First</button>
        <button className="ll-btn" onClick={animateTraversal}>Animate Traversal</button>
        <button className="ll-btn" onClick={() => { setList([10,20,30,40]); setHl(-1); setStatus(""); }}>Reset</button>
      </div>
      <div className="ll-status">{status}</div>

      <div className="ll-h3">Key Properties</div>
      <ul className="ll-ul">
        <li>No NULL pointer — last node points to head</li>
        <li>Any node can be a starting point</li>
        <li>Traversal must stop when we reach the starting node again</li>
        <li>Keep a <code>last</code> pointer for O(1) insertion at both ends</li>
      </ul>

      <div className="ll-h3">Traversal — Must Use a Do-While</div>
      <div className="ll-code">{`void traverse(Node *last) {
  if (last == NULL) return;
  Node *curr = last->next;       
  do {
    printf("%d ", curr->data);
    curr = curr->next;
  } while (curr != last->next);  
}
`}</div>
      <div className="ll-h3">Real-World Applications</div>
      <div className="ll-2col">
        <div className="ll-card"><h4>OS Round-Robin Scheduling</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>CPU gives each process a time slice. After the last process, scheduler wraps back to the first.</p></div>
        <div className="ll-card"><h4>Multiplayer Board Games</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>Players take turns in a circle. After the last player, it's back to the first.</p></div>
        <div className="ll-card"><h4>Browser Tab Cycling</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>Ctrl+Tab cycles through tabs endlessly using a circular structure.</p></div>
        <div className="ll-card"><h4>Media Playlist (Loop)</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>After the last song, the first plays again.</p></div>
      </div>
    </div>
  );
}

const QUESTIONS = [
  { q:"What is the time complexity of inserting at the beginning of a singly linked list?", opts:["O(n)","O(1)","O(log n)","O(n²)"], ans:1 },
  { q:"Which pointer must NEVER be moved during traversal?", opts:["curr","temp","HEAD","prev"], ans:2 },
  { q:"What does the last node of a circular linked list point to?", opts:["NULL","Itself","HEAD","Tail"], ans:2 },
  { q:"What is the main advantage of doubly LL over singly LL for deletion?", opts:["Uses less memory","Can delete a node in O(1) given its pointer","Faster search","Simpler code"], ans:1 },
  { q:"In sorted insertion, if inserting 15 into [10→20→30], where does it go?", opts:["Before 10","Between 10 and 20","Between 20 and 30","After 30"], ans:1 },
  { q:"What is the time complexity of finding the length of a linked list?", opts:["O(1)","O(log n)","O(n)","O(n²)"], ans:2 },
  { q:"Which traversal loop is MANDATORY for circular linked list traversal?", opts:["for","while","do-while","foreach"], ans:2 },

  { q:"Which traversal loop is MANDATORY for circular linked list traversal?", opts:["for","while","do-while","foreach"], ans:2 },
  { q:"Memory per node in a doubly LL (32-bit system, int data) =?", opts:["4 bytes","8 bytes","12 bytes","16 bytes"], ans:2 },
  { q:"What happens if you update curr→next BEFORE setting newNode→next during insertion?", opts:["Nothing, both orders work","You lose the rest of the list","Only works at head","Infinite loop"], ans:1 },
  { q:"Which data structure is best modeled using a circular linked list?", opts:["Stack","Binary search tree","Round-robin CPU scheduler","Hash table"], ans:2 },
];

function SecQuiz() {
  const [answered, setAnswered] = useState(new Array(QUESTIONS.length).fill(null));
  const [done, setDone] = useState(false);

  function answer(qi, oi) {
    if (answered[qi] !== null) return;
    const next = [...answered];
    next[qi] = oi;
    setAnswered(next);
    if (next.every(a => a !== null)) setDone(true);
  }

  function reset() { setAnswered(new Array(QUESTIONS.length).fill(null)); setDone(false); }

  const score = answered.filter((a, i) => a === QUESTIONS[i].ans).length;

  return (
    <div className="ll-sec">
      <span className="ll-tag tag-blue">Test Yourself</span>
      <div className="ll-h2">Master Quiz</div>
      <p className="ll-p" style={{marginBottom:14}}>Answer all 10 questions to test your mastery.</p>

      {QUESTIONS.map((q, qi) => (
        <div key={qi} style={{marginBottom:20,padding:16,background:"var(--color-background-secondary)",borderRadius:12}}>
          <p style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>{qi+1}. {q.q}</p>
          {q.opts.map((opt, oi) => {
            let cls = "ll-quiz-opt";
            if (answered[qi] !== null) {
              if (oi === q.ans) cls += " correct";
              else if (oi === answered[qi]) cls += " wrong";
            }
            return (
              <button key={oi} className={cls} disabled={answered[qi] !== null} onClick={() => answer(qi, oi)}>
                {opt}
              </button>
            );
          })}
        </div>
      ))}

      {done && (
        <div style={{marginTop:16,padding:16,background:"var(--color-background-secondary)",borderRadius:12}}>
          <p style={{fontSize:14,color:"var(--color-text-secondary)",marginBottom:4}}>Your score</p>
          <div style={{fontSize:24,fontWeight:500,color:"var(--color-text-primary)"}}>{score} / {QUESTIONS.length}</div>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",marginTop:6}}>
            {score === QUESTIONS.length ? "Perfect mastery! 🎉" : score >= 7 ? "Great job!" : "Keep studying!"}
          </p>
          <button className="ll-btn" style={{marginTop:12}} onClick={reset}>Retry Quiz</button>
        </div>
      )}
    </div>
  );
}

const CHAPTERS = [
  { id:"intro",    label:"1. Introduction" },
  { id:"memory",   label:"2. Memory" },
  { id:"traverse", label:"3. Traversal" },
  { id:"insert",   label:"4. Insertion" },
  { id:"delete",   label:"5. Deletion" },
  { id:"doubly",   label:"6. Doubly LL" },
  { id:"circular", label:"7. Circular LL" },
  { id:"quiz",     label:"8. Quiz" },
];

export default function LinkedList({ onPrev, onNext, onChapterChange }) {
  const [active, setActive] = useState("intro");
  const curIdx = CHAPTERS.findIndex(c => c.id === active);
  useEffect(() => { onChapterChange?.(curIdx, CHAPTERS.length); }, [active]);

  function switchTab(id) {
    const newIdx = CHAPTERS.findIndex(c => c.id === id);
    onChapterChange?.(newIdx, CHAPTERS.length);
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="ll-root">
      <style>{styles}</style>
      <div className="ll-wrap">
        <div className="ll-nav">
          {CHAPTERS.map(ch => (
            <button key={ch.id} className={`ll-nb${active===ch.id?" on":""}`} onClick={() => switchTab(ch.id)}>
              {ch.label}
            </button>
          ))}
        </div>

        {active === "intro"    && <SecIntro />}
        {active === "memory"   && <SecMemory />}
        {active === "traverse" && <SecTraversal />}
        {active === "insert"   && <SecInsert />}
        {active === "delete"   && <SecDelete />}
        {active === "doubly"   && <SecDoubly />}
        {active === "circular" && <SecCircular />}
        {active === "quiz"     && <SecQuiz />}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:48,paddingTop:24,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
          {curIdx > 0 ? (
            <button className="ll-btn primary" onClick={() => switchTab(CHAPTERS[curIdx-1].id)}>
              ← {CHAPTERS[curIdx-1].label}
            </button>
          ) : onPrev ? (
            <button className="ll-btn primary" onClick={onPrev}>← Strings</button>
          ) : <div />}

          <div style={{display:"flex",gap:6}}>
            {CHAPTERS.map((ch) => (
              <div key={ch.id} onClick={() => switchTab(ch.id)}
                style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",transition:"background .2s",
                  background: active===ch.id ? "var(--color-text-primary)" : "var(--color-border-secondary)"}} />
            ))}
          </div>

          {curIdx < CHAPTERS.length-1 ? (
            <button className="ll-btn primary" onClick={() => switchTab(CHAPTERS[curIdx+1].id)}>
              {CHAPTERS[curIdx+1].label} →
            </button>
          ) : onNext ? (
            <button className="ll-btn primary" onClick={onNext}>Next Chapter →</button>
          ) : (
            <div style={{fontSize:13,color:"var(--color-text-secondary)",fontStyle:"italic"}}>✓ All chapters complete</div>
          )}
        </div>
      </div>
    </div>
  );
}
