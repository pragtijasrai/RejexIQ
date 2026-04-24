import { useState, useRef, useEffect } from "react";

const styles = `
.hash-root { font-family: var(--font-sans, sans-serif); }
.hash-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.hash-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.hash-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.hash-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.hash-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes hashFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.hash-sec { animation: hashFade .2s ease; }
.hash-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.hash-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.hash-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.hash-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.hash-ul { padding-left: 18px; margin: 6px 0; }
.hash-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.hash-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; }
.hash-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.hash-btn:hover { background: var(--color-background-secondary); }
.hash-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.hash-btn.primary:hover { opacity: .85; }
.hash-btn:disabled { opacity: .4; cursor: default; }
.hash-inp { width: 80px; padding: 6px 10px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); }
.hash-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.hash-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.hash-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.hash-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.hash-tbl tr:hover td { background: var(--color-background-secondary); }
.hash-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.hash-info p { color: var(--color-text-info); font-size: 13px; }
.hash-warn { border-left: 3px solid var(--color-border-warning); padding: 10px 14px; margin: 10px 0; background: var(--color-background-warning); border-radius: 0 8px 8px 0; }
.hash-warn p { color: var(--color-text-warning); font-size: 13px; }
.hash-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.hash-bucket { min-height: 36px; border: 1.5px solid var(--color-border-secondary); border-radius: 6px; padding: 6px 10px; margin: 3px 0; display: flex; align-items: center; gap: 6px; font-size: 13px; transition: all .3s; }
.hash-bucket.hl { border-color: #fdcb6e; background: rgba(253,203,110,0.1); }
.hash-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.hash-quiz-opt:hover { background: var(--color-background-secondary); }
.hash-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.hash-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
.hash-dot-row { display: flex; justify-content: center; gap: 6px; padding: 16px 0 8px; }
.hash-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-border-secondary); cursor: pointer; transition: all .2s; }
.hash-dot.on { background: var(--color-text-primary); transform: scale(1.3); }
.hash-nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 0.5px solid var(--color-border-tertiary); margin-top: 24px; }
`;

// ── Chapter 1: Introduction ──
function SecIntro() {
  return (
    <div className="hash-sec">
      <span className="hash-tag tag-blue">Foundation</span>
      <div className="hash-h2">What is Hashing?</div>
      <p className="hash-p">Hashing maps keys to array indices using a <strong>hash function</strong>, enabling O(1) average-case lookup, insert, and delete.</p>
      <div className="hash-viz">
        <svg viewBox="0 0 400 120" style={{width:"100%",maxWidth:400}}>
          <defs><marker id="ha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#fdcb6e" strokeWidth="1.5"/></marker></defs>
          <rect x="10" y="40" width="80" height="30" rx="6" fill="var(--color-background-primary)" stroke="var(--color-border-secondary)" strokeWidth="1.5"/>
          <text x="50" y="59" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-text-primary)">key=42</text>
          <path d="M92 55 L140 55" stroke="#fdcb6e" strokeWidth="2" markerEnd="url(#ha)"/>
          <rect x="142" y="30" width="100" height="50" rx="8" fill="rgba(253,203,110,0.1)" stroke="#fdcb6e" strokeWidth="1.5"/>
          <text x="192" y="52" textAnchor="middle" fontSize="11" fill="#fdcb6e" fontWeight="600">hash(key)</text>
          <text x="192" y="68" textAnchor="middle" fontSize="11" fill="#fdcb6e">= key % 7</text>
          <path d="M244 55 L292 55" stroke="#fdcb6e" strokeWidth="2" markerEnd="url(#ha)"/>
          <rect x="294" y="40" width="80" height="30" rx="6" fill="var(--color-background-primary)" stroke="var(--color-border-success)" strokeWidth="1.5"/>
          <text x="334" y="59" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-text-success)">index=0</text>
          <text x="50" y="100" textAnchor="middle" fontSize="10" fill="var(--color-text-tertiary)">Key</text>
          <text x="192" y="100" textAnchor="middle" fontSize="10" fill="var(--color-text-tertiary)">Hash Function</text>
          <text x="334" y="100" textAnchor="middle" fontSize="10" fill="var(--color-text-tertiary)">Bucket Index</text>
        </svg>
      </div>
      <div className="hash-h3">Properties of a Good Hash Function</div>
      <ul className="hash-ul">
        <li>Deterministic — same key always gives same hash</li>
        <li>Uniform distribution — spreads keys evenly</li>
        <li>Fast to compute — O(1)</li>
        <li>Minimizes collisions</li>
      </ul>
      <div className="hash-h3">Time Complexity</div>
      <table className="hash-tbl">
        <thead><tr><th>Operation</th><th>Average</th><th>Worst</th></tr></thead>
        <tbody>
          <tr><td>Insert</td><td>O(1)</td><td>O(n)</td></tr>
          <tr><td>Search</td><td>O(1)</td><td>O(n)</td></tr>
          <tr><td>Delete</td><td>O(1)</td><td>O(n)</td></tr>
        </tbody>
      </table>
      <div className="hash-info"><p>Worst case O(n) occurs when all keys hash to the same bucket (all collisions). A good hash function makes this extremely unlikely.</p></div>
    </div>
  );
}

// ── Chapter 2: Collision Handling ──
function SecCollision() {
  return (
    <div className="hash-sec">
      <span className="hash-tag tag-amber">Collision Handling</span>
      <div className="hash-h2">Handling Collisions</div>
      <p className="hash-p">A collision occurs when two keys hash to the same index. Two main strategies:</p>
      <div className="hash-h3">1. Chaining (Separate Chaining)</div>
      <p className="hash-p">Each bucket holds a linked list. Multiple keys can share a bucket.</p>
      <div className="hash-code">{`// Bucket 2 has a chain: [12] → [22] → [32]
// hash(12) = 12 % 10 = 2
// hash(22) = 22 % 10 = 2  ← collision!
// hash(32) = 32 % 10 = 2  ← collision!

// Java HashMap uses chaining (with tree for long chains)
// Load factor = n/capacity
// When load factor > 0.75, rehash (double capacity)`}</div>
      <div className="hash-h3">2. Open Addressing — Linear Probing</div>
      <p className="hash-p">If a bucket is occupied, probe the next one linearly.</p>
      <div className="hash-code">{`// Linear probing: if index i is full, try i+1, i+2, ...
// hash(key) = key % size
// probe(i)  = (hash(key) + i) % size

// Example: size=7, insert 10, 17, 24
// hash(10) = 3 → bucket[3] = 10
// hash(17) = 3 → collision! try 4 → bucket[4] = 17
// hash(24) = 3 → collision! try 4 → collision! try 5 → bucket[5] = 24

// Problem: Clustering — long runs of filled buckets
// Solution: Quadratic probing or Double hashing`}</div>
      <table className="hash-tbl">
        <thead><tr><th>Method</th><th>Pros</th><th>Cons</th></tr></thead>
        <tbody>
          <tr><td>Chaining</td><td>Simple, handles high load</td><td>Extra memory for pointers</td></tr>
          <tr><td>Linear Probing</td><td>Cache-friendly, no extra memory</td><td>Clustering problem</td></tr>
          <tr><td>Quadratic Probing</td><td>Reduces clustering</td><td>May not find empty slot</td></tr>
          <tr><td>Double Hashing</td><td>Best distribution</td><td>Two hash functions needed</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Chapter 3: Java HashMap ──
function SecHashMap() {
  return (
    <div className="hash-sec">
      <span className="hash-tag tag-blue">Java</span>
      <div className="hash-h2">Java HashMap</div>
      <div className="hash-code">{`// Basic operations
HashMap<String, Integer> map = new HashMap<>();

// put(key, value) — O(1) avg
map.put("Alice", 90);
map.put("Bob", 85);
map.put("Charlie", 92);

// get(key) — O(1) avg
int score = map.get("Alice"); // 90

// containsKey — O(1) avg
boolean exists = map.containsKey("Bob"); // true

// remove — O(1) avg
map.remove("Bob");

// Iterate
for (Map.Entry<String, Integer> e : map.entrySet()) {
  System.out.println(e.getKey() + " → " + e.getValue());
}

// getOrDefault
int val = map.getOrDefault("Dave", 0); // 0 (not found)`}</div>
      <div className="hash-h3">Load Factor & Rehashing</div>
      <div className="hash-code">{`// Default initial capacity: 16
// Default load factor: 0.75
// When size > 16 * 0.75 = 12 entries → rehash!
// Rehashing: create new array (2x size), re-insert all entries
// This is O(n) but amortized O(1) per insert

// Custom capacity and load factor:
HashMap<String, Integer> map = new HashMap<>(32, 0.5f);
// Lower load factor = fewer collisions, more memory`}</div>
      <div className="hash-h3">HashMap vs HashSet vs Hashtable</div>
      <table className="hash-tbl">
        <thead><tr><th>Class</th><th>Stores</th><th>Null keys</th><th>Thread-safe</th></tr></thead>
        <tbody>
          <tr><td>HashMap</td><td>Key-Value pairs</td><td>1 null key</td><td>No</td></tr>
          <tr><td>HashSet</td><td>Unique values</td><td>1 null</td><td>No</td></tr>
          <tr><td>Hashtable</td><td>Key-Value pairs</td><td>No null</td><td>Yes (slow)</td></tr>
          <tr><td>LinkedHashMap</td><td>Key-Value (ordered)</td><td>1 null key</td><td>No</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Chapter 4: Interactive Hash Table ──
function SecInteractive() {
  const SIZE = 7;
  const [buckets, setBuckets] = useState(Array.from({length:SIZE}, () => []));
  const [inp, setInp] = useState(14);
  const [highlighted, setHighlighted] = useState(-1);
  const [status, setStatus] = useState("Hash table of size 7. Hash function: key % 7");

  function insertKey() {
    const k = parseInt(inp);
    if (isNaN(k)) return;
    const idx = ((k % SIZE) + SIZE) % SIZE;
    const newBuckets = buckets.map(b => [...b]);
    if (!newBuckets[idx].includes(k)) newBuckets[idx].push(k);
    setBuckets(newBuckets);
    setHighlighted(idx);
    setStatus(`key=${k} → hash(${k}) = ${k} % 7 = ${idx} → bucket[${idx}]`);
    setTimeout(() => setHighlighted(-1), 1500);
  }

  function clearAll() {
    setBuckets(Array.from({length:SIZE}, () => []));
    setStatus("Hash table cleared");
    setHighlighted(-1);
  }

  return (
    <div className="hash-sec">
      <span className="hash-tag tag-green">Interactive</span>
      <div className="hash-h2">Interactive Hash Table (size=7)</div>
      <div className="hash-viz">
        {buckets.map((b, i) => (
          <div key={i} className={`hash-bucket${highlighted===i?" hl":""}`}>
            <span style={{fontSize:11,color:"var(--color-text-tertiary)",minWidth:60,fontFamily:"var(--font-mono)"}}>bucket[{i}]</span>
            <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>→</span>
            {b.length === 0
              ? <span style={{fontSize:12,color:"var(--color-text-tertiary)",fontStyle:"italic"}}>empty</span>
              : b.map((v,j) => (
                <span key={j} style={{padding:"2px 8px",borderRadius:4,background:"rgba(253,203,110,0.15)",border:"1px solid #fdcb6e",fontSize:12,color:"#fdcb6e",fontWeight:600}}>{v}</span>
              ))
            }
          </div>
        ))}
        <div className="hash-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <input type="number" className="hash-inp" value={inp} onChange={e=>setInp(e.target.value)} placeholder="key" />
        <button className="hash-btn primary" onClick={insertKey}>Insert</button>
        <button className="hash-btn" onClick={clearAll}>Clear</button>
      </div>
    </div>
  );
}

// ── Chapter 5: Quiz ──
const QUIZ = [
  { q:"What is the average time complexity of HashMap.get()?", opts:["O(log n)","O(1)","O(n)","O(n log n)"], ans:1 },
  { q:"Java HashMap's default load factor is:", opts:["0.5","0.75","1.0","0.25"], ans:1 },
  { q:"Which collision resolution uses a linked list per bucket?", opts:["Open addressing","Linear probing","Chaining","Double hashing"], ans:2 },
  { q:"When does Java HashMap rehash?", opts:["Every insert","When load factor > 0.75","When size > 100","Never"], ans:1 },
  { q:"HashSet internally uses:", opts:["TreeMap","LinkedList","HashMap","Array"], ans:2 },
  { q:"Which allows null keys in Java?", opts:["Hashtable","HashMap","Both","Neither"], ans:1 },
];

function SecQuiz() {
  const [answers, setAnswers] = useState({});
  function pick(i, opt) { setAnswers({...answers, [i]: opt}); }
  return (
    <div className="hash-sec">
      <span className="hash-tag tag-red">Quiz</span>
      <div className="hash-h2">Test Your Knowledge</div>
      {QUIZ.map((q, i) => {
        const chosen = answers[i];
        const correct = chosen === q.ans;
        return (
          <div key={i} style={{marginBottom:16}}>
            <p className="hash-p" style={{fontWeight:500}}>{i+1}. {q.q}</p>
            {q.opts.map((opt, oi) => (
              <button key={oi} className={`hash-quiz-opt${chosen===oi?(correct?" correct":" wrong"):""}`}
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
  { id:"intro",  label:"Introduction",    comp: SecIntro },
  { id:"coll",   label:"Collision",       comp: SecCollision },
  { id:"java",   label:"Java HashMap",    comp: SecHashMap },
  { id:"inter",  label:"Interactive",     comp: SecInteractive },
  { id:"quiz",   label:"Quiz",            comp: SecQuiz },
];

export default function Hashing({ onPrev, onNext, onChapterChange }) {
  const [ch, setCh] = useState(0);
  const Comp = CHAPTERS[ch].comp;
  return (
    <div className="hash-root">
      <style>{styles}</style>
      <div className="hash-wrap">
        <div className="hash-nav">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} className={`hash-nb${ch===i?" on":""}`} onClick={() => setCh(i)}>
              {i+1}. {c.label}
            </button>
          ))}
        </div>
        <Comp />
        <div className="hash-dot-row">
          {CHAPTERS.map((_, i) => <div key={i} className={`hash-dot${ch===i?" on":""}`} onClick={() => setCh(i)} />)}
        </div>
        <div className="hash-nav-bar">
          <button className="hash-btn" onClick={onPrev} disabled={!onPrev}>← Prev Topic</button>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Chapter {ch+1}/{CHAPTERS.length}</span>
          <button className="hash-btn primary" onClick={onNext} disabled={!onNext}>Next Topic →</button>
        </div>
      </div>
    </div>
  );
}
