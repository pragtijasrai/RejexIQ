import { useState, useEffect } from "react";

const styles = `
.bt-root { font-family:var(--font-sans,sans-serif); }
.bt-wrap { max-width:860px; margin:0 auto; padding:0 0 48px; }
.bt-nav { display:flex; flex-wrap:wrap; gap:6px; padding:16px 0 20px; border-bottom:0.5px solid var(--color-border-tertiary); margin-bottom:24px; }
.bt-nb { padding:6px 14px; font-size:12px; border-radius:20px; border:0.5px solid var(--color-border-secondary); background:transparent; color:var(--color-text-secondary); cursor:pointer; transition:all .15s; }
.bt-nb:hover { background:var(--color-background-secondary); color:var(--color-text-primary); }
.bt-nb.on { background:var(--color-text-primary); color:var(--color-background-primary); border-color:transparent; }
@keyframes btFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.bt-sec { animation:btFade .2s ease; }
.bt-tag { display:inline-block; font-size:11px; padding:2px 10px; border-radius:12px; margin-bottom:12px; font-weight:500; }
.tag-blue   { background:var(--color-background-info);    color:var(--color-text-info); }
.tag-green  { background:var(--color-background-success); color:var(--color-text-success); }
.tag-amber  { background:var(--color-background-warning); color:var(--color-text-warning); }
.tag-red    { background:var(--color-background-danger);  color:var(--color-text-danger); }
.bt-h2 { font-size:20px; font-weight:500; color:var(--color-text-primary); margin-bottom:6px; }
.bt-h3 { font-size:15px; font-weight:500; color:var(--color-text-primary); margin:16px 0 8px; }
.bt-p  { font-size:14px; line-height:1.7; color:var(--color-text-secondary); margin-bottom:8px; }
.bt-ul { padding-left:18px; margin:6px 0; }
.bt-ul li { font-size:14px; line-height:1.7; color:var(--color-text-secondary); margin-bottom:3px; }
.bt-viz { background:var(--color-background-secondary); border-radius:12px; padding:20px; margin:14px 0; }
.bt-btn { padding:7px 16px; font-size:13px; border-radius:8px; border:0.5px solid var(--color-border-secondary); background:transparent; color:var(--color-text-primary); cursor:pointer; transition:all .15s; margin:4px 2px; }
.bt-btn:hover { background:var(--color-background-secondary); }
.bt-btn.primary { background:var(--color-text-primary); color:var(--color-background-primary); border-color:transparent; }
.bt-btn.primary:hover { opacity:.85; }
.bt-inp { width:60px; padding:6px 10px; font-size:13px; border-radius:8px; border:0.5px solid var(--color-border-secondary); background:var(--color-background-primary); color:var(--color-text-primary); }
.bt-code { background:var(--color-background-secondary); border-radius:8px; padding:12px 14px; margin:10px 0; font-family:var(--font-mono,monospace); font-size:12px; line-height:1.6; color:var(--color-text-primary); overflow-x:auto; border:0.5px solid var(--color-border-tertiary); white-space:pre; }
.bt-info { border-left:3px solid var(--color-border-info); padding:10px 14px; margin:10px 0; background:var(--color-background-info); border-radius:0 8px 8px 0; }
.bt-info p { color:var(--color-text-info); font-size:13px; }
.bt-warn { border-left:3px solid var(--color-border-warning); padding:10px 14px; margin:10px 0; background:var(--color-background-warning); border-radius:0 8px 8px 0; }
.bt-warn p { color:var(--color-text-warning); font-size:13px; }
.bt-2col { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:10px 0; }
.bt-card { background:var(--color-background-secondary); border-radius:10px; padding:12px; }
.bt-card h4 { font-size:13px; font-weight:500; color:var(--color-text-primary); margin-bottom:6px; }
.bt-status { font-size:13px; color:var(--color-text-secondary); margin-top:8px; min-height:20px; font-style:italic; }
.bt-board { display:inline-grid; gap:2px; margin:10px 0; }
.bt-cell { width:44px; height:44px; display:flex; align-items:center; justify-content:center; font-size:20px; border-radius:4px; border:0.5px solid var(--color-border-tertiary); }
.bt-cell.dark  { background:var(--color-background-secondary); }
.bt-cell.light { background:var(--color-background-primary); }
.bt-cell.queen { background:var(--color-background-warning); border-color:var(--color-border-warning); }
.bt-cell.attack { background:var(--color-background-danger); border-color:var(--color-border-danger); opacity:.4; }
.bt-out { font-family:var(--font-mono,monospace); font-size:12px; background:var(--color-background-secondary); border-radius:8px; padding:12px; color:var(--color-text-primary); max-height:200px; overflow-y:auto; margin-top:10px; white-space:pre-wrap; }
@media(max-width:500px){ .bt-2col{grid-template-columns:1fr;} }
`;

function SecIntro() {
  return (
    <div className="bt-sec">
      <span className="bt-tag tag-blue">Chapter 1</span>
      <div className="bt-h2">What is Backtracking?</div>
      <p className="bt-p">Backtracking is an algorithmic technique that builds a solution incrementally, <strong>abandoning a path as soon as it determines the path cannot lead to a valid solution</strong> (pruning), and then tries the next option.</p>
      <div className="bt-2col">
        <div className="bt-card"><h4>🌳 Think of it as a tree</h4><ul className="bt-ul"><li>Each node = a partial solution</li><li>Each branch = a choice</li><li>Leaf = complete solution or dead end</li><li>Backtrack = go back to parent, try next branch</li></ul></div>
        <div className="bt-card"><h4>✂️ Pruning</h4><ul className="bt-ul"><li>Don't explore branches that can't work</li><li>Check constraints before going deeper</li><li>Dramatically reduces search space</li><li>Makes exponential problems tractable</li></ul></div>
      </div>
      <div className="bt-h3">Template — Every backtracking problem follows this pattern</div>
      <div className="bt-code">{`void backtrack(state, choices) {
  
  if (isSolution(state)) {
    addToResults(state);
    return;
  }

  for (choice : choices) {
    if (isValid(state, choice)) {   
      makeChoice(state, choice);    
      backtrack(state, choices);    
      undoChoice(state, choice);    
    }
  }
}
`}</div>
      <div className="bt-info"><p>KEY INSIGHT: Backtracking = DFS + pruning + undo. The undo step restores state so the next branch starts fresh. This is why it's called "backtracking" — you literally go back.</p></div>
      <div className="bt-h3">Classic Problems</div>
      <div className="bt-2col">
        <div className="bt-card"><h4>N-Queens</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>Place N queens on N×N board so no two attack each other.</p></div>
        <div className="bt-card"><h4>Sudoku Solver</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>Fill 9×9 grid with digits 1-9 satisfying row/col/box constraints.</p></div>
        <div className="bt-card"><h4>Permutations</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>Generate all arrangements of a set of elements.</p></div>
        <div className="bt-card"><h4>Subsets / Power Set</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>Generate all possible subsets of a set.</p></div>
      </div>
    </div>
  );
}

function SecNQueens() {
  const [n, setN] = useState(4);
  const [solutions, setSolutions] = useState([]);
  const [viewIdx, setViewIdx] = useState(0);
  const [status, setStatus] = useState("Press Solve to find all solutions");

  function solve() {
    const size = Math.min(parseInt(n) || 4, 8);
    const results = [];
    const board = Array(size).fill(-1);

    function isSafe(row, col) {
      for (let r = 0; r < row; r++) {
        if (board[r] === col) return false;
        if (Math.abs(board[r] - col) === Math.abs(r - row)) return false;
      }
      return true;
    }

    function bt(row) {
      if (row === size) { results.push([...board]); return; }
      for (let col = 0; col < size; col++) {
        if (isSafe(row, col)) {
          board[row] = col;
          bt(row + 1);
          board[row] = -1; 
        }
      }
    }

    bt(0);
    setSolutions(results);
    setViewIdx(0);
    setStatus(`Found ${results.length} solution(s) for ${size}-Queens`);
  }

  const board = solutions[viewIdx] || [];
  const size = board.length || parseInt(n) || 4;

  return (
    <div className="bt-sec">
      <span className="bt-tag tag-green">Chapter 2</span>
      <div className="bt-h2">N-Queens Problem</div>
      <p className="bt-p">Place N queens on an N×N chessboard such that no two queens attack each other (no same row, column, or diagonal).</p>
      <div className="bt-viz">
        <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
          <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>N =</span>
          <input className="bt-inp" type="number" value={n} min="1" max="8" onChange={e=>setN(e.target.value)} />
          <button className="bt-btn primary" onClick={solve}>Solve</button>
          {solutions.length > 1 && (
            <>
              <button className="bt-btn" onClick={() => setViewIdx(i => Math.max(0, i-1))} disabled={viewIdx===0}>← Prev</button>
              <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{viewIdx+1}/{solutions.length}</span>
              <button className="bt-btn" onClick={() => setViewIdx(i => Math.min(solutions.length-1, i+1))} disabled={viewIdx===solutions.length-1}>Next →</button>
            </>
          )}
        </div>
        {board.length > 0 && (
          <div className="bt-board" style={{gridTemplateColumns:`repeat(${size}, 44px)`}}>
            {Array.from({length:size}).map((_,r) =>
              Array.from({length:size}).map((_,c) => {
                const isQueen = board[r] === c;
                const isDark = (r+c)%2===1;
                return (
                  <div key={`${r}-${c}`} className={`bt-cell ${isQueen?"queen":isDark?"dark":"light"}`}>
                    {isQueen ? "♛" : ""}
                  </div>
                );
              })
            )}
          </div>
        )}
        <div className="bt-status">{status}</div>
      </div>
      <div className="bt-code">{`void solveNQueens(int n) {
  int[] board = new int[n]; 
  Arrays.fill(board, -1);
  backtrack(board, 0, n);
}

void backtrack(int[] board, int row, int n) {
  if (row == n) {
    printSolution(board); 
    return;
  }
  for (int col = 0; col < n; col++) {
    if (isSafe(board, row, col)) {
      board[row] = col;          
      backtrack(board, row+1, n); 
      board[row] = -1;           
    }
  }
}

boolean isSafe(int[] board, int row, int col) {
  for (int r = 0; r < row; r++) {
    if (board[r] == col) return false;           
    if (Math.abs(board[r]-col)==Math.abs(r-row)) 
      return false;
  }
  return true;
}`}</div>
    </div>
  );
}

function SecPermSubsets() {
  const [permInput, setPermInput] = useState("1,2,3");
  const [permOut, setPermOut] = useState("");
  const [subInput, setSubInput] = useState("1,2,3");
  const [subOut, setSubOut] = useState("");

  function genPerms() {
    const nums = permInput.split(",").map(s=>s.trim()).filter(Boolean);
    const results = [];
    function bt(current, remaining) {
      if (!remaining.length) { results.push([...current]); return; }
      for (let i = 0; i < remaining.length; i++) {
        current.push(remaining[i]);
        bt(current, remaining.filter((_,j)=>j!==i));
        current.pop();
      }
    }
    bt([], nums);
    setPermOut(`${results.length} permutations:\n${results.map(p=>"["+p.join(",")+"]").join("  ")}`);
  }

  function genSubsets() {
    const nums = subInput.split(",").map(s=>s.trim()).filter(Boolean);
    const results = [];
    function bt(idx, current) {
      results.push([...current]);
      for (let i = idx; i < nums.length; i++) {
        current.push(nums[i]);
        bt(i+1, current);
        current.pop();
      }
    }
    bt(0, []);
    setSubOut(`${results.length} subsets (2^${nums.length}):\n${results.map(s=>"["+s.join(",")+"]").join("  ")}`);
  }

  return (
    <div className="bt-sec">
      <span className="bt-tag tag-amber">Chapter 3</span>
      <div className="bt-h2">Permutations & Subsets</div>

      <div className="bt-h3">Permutations — all orderings</div>
      <div className="bt-viz">
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input className="bt-inp" style={{width:120}} value={permInput} onChange={e=>setPermInput(e.target.value)} placeholder="1,2,3" />
          <button className="bt-btn primary" onClick={genPerms}>Generate</button>
        </div>
        <div className="bt-out" style={{marginTop:10}}>{permOut || "Enter comma-separated values and click Generate"}</div>
      </div>
      <div className="bt-code">{`void permutations(int[] nums, List<Integer> current, boolean[] used) {
  if (current.size() == nums.length) {
    results.add(new ArrayList<>(current));
    return;
  }
  for (int i = 0; i < nums.length; i++) {
    if (used[i]) continue;       
    used[i] = true;
    current.add(nums[i]);        
    permutations(nums, current, used); 
    current.remove(current.size()-1);  
    used[i] = false;             
  }
}
`}</div>
      <div className="bt-h3">Subsets (Power Set) — all combinations</div>
      <div className="bt-viz">
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input className="bt-inp" style={{width:120}} value={subInput} onChange={e=>setSubInput(e.target.value)} placeholder="1,2,3" />
          <button className="bt-btn primary" onClick={genSubsets}>Generate</button>
        </div>
        <div className="bt-out" style={{marginTop:10}}>{subOut || "Enter comma-separated values and click Generate"}</div>
      </div>
      <div className="bt-code">{`void subsets(int[] nums, int idx, List<Integer> current) {
  results.add(new ArrayList<>(current)); 
  for (int i = idx; i < nums.length; i++) {
    current.add(nums[i]);          
    subsets(nums, i+1, current);   
    current.remove(current.size()-1); 
  }
}
`}</div>
      <div className="bt-warn"><p>BACKTRACKING vs RECURSION: All backtracking is recursive, but not all recursion is backtracking. The key difference is the UNDO step — backtracking explicitly reverses the choice before trying the next option.</p></div>
    </div>
  );
}

const CHAPTERS = [
  { id:"intro",   label:"1. Introduction" },
  { id:"nqueens", label:"2. N-Queens" },
  { id:"permsub", label:"3. Permutations & Subsets" },
];

export default function Backtracking({ onPrev, onNext, onChapterChange }) {
  const [active, setActive] = useState("intro");
  const curIdx = CHAPTERS.findIndex(c => c.id === active);
  useEffect(() => { onChapterChange?.(curIdx, CHAPTERS.length); }, [active]);
  function switchTab(id) { const newIdx = CHAPTERS.findIndex(c => c.id === id); onChapterChange?.(newIdx, CHAPTERS.length); setActive(id); window.scrollTo({ top:0, behavior:"smooth" }); }
  return (
    <div className="bt-root">
      <style>{styles}</style>
      <div className="bt-wrap">
        <div className="bt-nav">
          {CHAPTERS.map(ch => (
            <button key={ch.id} className={`bt-nb${active===ch.id?" on":""}`} onClick={() => switchTab(ch.id)}>{ch.label}</button>
          ))}
        </div>
        {active === "intro"   && <SecIntro />}
        {active === "nqueens" && <SecNQueens />}
        {active === "permsub" && <SecPermSubsets />}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:48,paddingTop:24,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
          {curIdx > 0 ? (
            <button className="bt-btn primary" onClick={() => switchTab(CHAPTERS[curIdx-1].id)}>← {CHAPTERS[curIdx-1].label}</button>
          ) : onPrev ? (
            <button className="bt-btn primary" onClick={onPrev}>← Previous Topic</button>
          ) : <div />}
          <div style={{display:"flex",gap:6}}>
            {CHAPTERS.map(ch => (
              <div key={ch.id} onClick={() => switchTab(ch.id)} style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",transition:"background .2s",background:active===ch.id?"var(--color-text-primary)":"var(--color-border-secondary)"}} />
            ))}
          </div>
          {curIdx < CHAPTERS.length-1 ? (
            <button className="bt-btn primary" onClick={() => switchTab(CHAPTERS[curIdx+1].id)}>{CHAPTERS[curIdx+1].label} →</button>
          ) : onNext ? (
            <button className="bt-btn primary" onClick={onNext}>Next Topic →</button>
          ) : <div style={{fontSize:13,color:"var(--color-text-secondary)",fontStyle:"italic"}}>✓ Complete</div>}
        </div>
      </div>
    </div>
  );
}
