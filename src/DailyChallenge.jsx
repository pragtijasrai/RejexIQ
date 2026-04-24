import { useState, useEffect, useRef } from "react";

// ── Question bank ──
const MCQ_BANK = [
  { id:"m1",  q:"What is the time complexity of accessing an element in an array by index?", opts:["O(n)","O(log n)","O(1)","O(n²)"], ans:2, topic:"Arrays", xp:20 },
  { id:"m2",  q:"Which data structure uses LIFO (Last In First Out) order?", opts:["Queue","Stack","Linked List","Heap"], ans:1, topic:"Stack", xp:20 },
  { id:"m3",  q:"What is the worst-case time complexity of Quick Sort?", opts:["O(n log n)","O(n)","O(n²)","O(log n)"], ans:2, topic:"Sorting", xp:25 },
  { id:"m4",  q:"In a Binary Search Tree, where is the minimum element located?", opts:["Root","Rightmost node","Leftmost node","Any leaf"], ans:2, topic:"BST", xp:25 },
  { id:"m5",  q:"What does BFS use internally to traverse a graph?", opts:["Stack","Queue","Heap","Array"], ans:1, topic:"BFS", xp:20 },
  { id:"m6",  q:"Which sorting algorithm has O(n log n) time complexity in ALL cases?", opts:["Quick Sort","Bubble Sort","Merge Sort","Selection Sort"], ans:2, topic:"Sorting", xp:25 },
  { id:"m7",  q:"What is the space complexity of recursive DFS on a graph with V vertices?", opts:["O(1)","O(V)","O(V²)","O(E)"], ans:1, topic:"DFS", xp:25 },
  { id:"m8",  q:"In a max-heap, which element is always at the root?", opts:["Minimum","Median","Maximum","Random"], ans:2, topic:"Heap", xp:20 },
  { id:"m9",  q:"What is the average time complexity of HashMap get() in Java?", opts:["O(n)","O(log n)","O(1)","O(n log n)"], ans:2, topic:"Hashing", xp:20 },
  { id:"m10", q:"Which traversal visits nodes in Left → Root → Right order?", opts:["Preorder","Postorder","Inorder","Level order"], ans:2, topic:"Trees", xp:20 },
  { id:"m11", q:"What is the time complexity of inserting at the beginning of a Linked List?", opts:["O(n)","O(1)","O(log n)","O(n²)"], ans:1, topic:"Linked List", xp:20 },
  { id:"m12", q:"Fibonacci using memoization reduces time from O(2ⁿ) to:", opts:["O(n²)","O(n log n)","O(n)","O(log n)"], ans:2, topic:"DP", xp:30 },
  { id:"m13", q:"Which algorithm is used to find the shortest path in an unweighted graph?", opts:["DFS","BFS","Dijkstra","Bellman-Ford"], ans:1, topic:"BFS", xp:25 },
  { id:"m14", q:"What is the height of a complete binary tree with n nodes?", opts:["O(n)","O(log n)","O(n²)","O(1)"], ans:1, topic:"Trees", xp:25 },
  { id:"m15", q:"In the 0/1 Knapsack problem, what technique gives optimal solution?", opts:["Greedy","Backtracking","Dynamic Programming","Divide & Conquer"], ans:2, topic:"DP", xp:30 },
];

const CODING_BANK = [
  {
    id:"c1", topic:"Arrays", difficulty:"Easy", xp:50,
    title:"Two Sum",
    desc:`Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.

Example:
  Input:  nums = [2, 7, 11, 15], target = 9
  Output: [0, 1]  (nums[0] + nums[1] = 2 + 7 = 9)

Constraints:
  • Each input has exactly one solution
  • You may not use the same element twice`,
    starterCode: `// Write your solution here
function twoSum(nums, target) {
  // Your code here
  
}

// Test cases (edit to test)
console.log(twoSum([2,7,11,15], 9));   // [0,1]
console.log(twoSum([3,2,4], 6));       // [1,2]
console.log(twoSum([3,3], 6));         // [0,1]`,
    hint:"Use a HashMap to store each number and its index. For each element, check if (target - element) exists in the map.",
    solution:`function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
}`,
    testCases:[
      { input:"[2,7,11,15], 9", expected:"[0,1]" },
      { input:"[3,2,4], 6",     expected:"[1,2]" },
      { input:"[3,3], 6",       expected:"[0,1]" },
    ]
  },
  {
    id:"c2", topic:"Linked List", difficulty:"Easy", xp:50,
    title:"Reverse a Linked List",
    desc:`Given the head of a singly linked list, reverse the list and return the reversed list.

Example:
  Input:  1 → 2 → 3 → 4 → 5
  Output: 5 → 4 → 3 → 2 → 1

Constraints:
  • The number of nodes is in range [0, 5000]
  • Node values are integers`,
    starterCode:`// Node class is already defined
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  // Your code here
  
}

// Helper: array to linked list
function toList(arr) {
  let head = null;
  for (let i = arr.length-1; i >= 0; i--)
    head = new ListNode(arr[i], head);
  return head;
}

// Helper: linked list to array
function toArray(head) {
  const res = [];
  while (head) { res.push(head.val); head = head.next; }
  return res;
}

// Test
console.log(toArray(reverseList(toList([1,2,3,4,5]))));  // [5,4,3,2,1]
console.log(toArray(reverseList(toList([1,2]))));         // [2,1]`,
    hint:"Use three pointers: prev (null), curr (head), next. In each step: save next, point curr.next to prev, move prev to curr, move curr to next.",
    solution:`function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    testCases:[
      { input:"[1,2,3,4,5]", expected:"[5,4,3,2,1]" },
      { input:"[1,2]",       expected:"[2,1]" },
      { input:"[]",          expected:"[]" },
    ]
  },
  {
    id:"c3", topic:"Stack", difficulty:"Easy", xp:50,
    title:"Valid Parentheses",
    desc:`Given a string s containing only '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

A string is valid if:
  1. Open brackets are closed by the same type of bracket
  2. Open brackets are closed in the correct order

Example:
  Input:  "()[]{}"  →  Output: true
  Input:  "([)]"    →  Output: false
  Input:  "{[]}"    →  Output: true`,
    starterCode:`function isValid(s) {
  // Your code here
  
}

console.log(isValid("()"));      // true
console.log(isValid("()[]{}"));  // true
console.log(isValid("(]"));      // false
console.log(isValid("([)]"));    // false
console.log(isValid("{[]}"));    // true`,
    hint:"Use a stack. Push opening brackets. When you see a closing bracket, check if the top of the stack is the matching opening bracket.",
    solution:`function isValid(s) {
  const stack = [];
  const map = { ')':'(', '}':'{', ']':'[' };
  for (const ch of s) {
    if ('({['.includes(ch)) stack.push(ch);
    else if (stack.pop() !== map[ch]) return false;
  }
  return stack.length === 0;
}`,
    testCases:[
      { input:'"()[]{}"', expected:"true" },
      { input:'"([)]"',   expected:"false" },
      { input:'"{[]}"',   expected:"true" },
    ]
  },
  {
    id:"c4", topic:"Recursion", difficulty:"Medium", xp:75,
    title:"Fibonacci Number",
    desc:`Given n, calculate F(n) where F(n) is the nth Fibonacci number.
F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n > 1.

Solve it using DYNAMIC PROGRAMMING (memoization or tabulation) — NOT naive recursion.

Example:
  F(0) = 0
  F(1) = 1
  F(4) = 3
  F(10) = 55`,
    starterCode:`function fib(n) {
  // Solve using DP (memoization or tabulation)
  // Naive recursion O(2^n) will NOT be accepted
  
}

console.log(fib(0));   // 0
console.log(fib(1));   // 1
console.log(fib(4));   // 3
console.log(fib(10));  // 55
console.log(fib(30));  // 832040`,
    hint:"Use a dp array where dp[i] = dp[i-1] + dp[i-2]. Or use two variables (space O(1)).",
    solution:`function fib(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
    testCases:[
      { input:"0",  expected:"0" },
      { input:"4",  expected:"3" },
      { input:"10", expected:"55" },
    ]
  },
  {
    id:"c5", topic:"Arrays", difficulty:"Medium", xp:75,
    title:"Maximum Subarray (Kadane's Algorithm)",
    desc:`Given an integer array nums, find the subarray with the largest sum and return its sum.

Example:
  Input:  [-2, 1, -3, 4, -1, 2, 1, -5, 4]
  Output: 6  (subarray [4, -1, 2, 1])

  Input:  [1]
  Output: 1

Constraints: 1 ≤ nums.length ≤ 10⁵`,
    starterCode:`function maxSubArray(nums) {
  // Implement Kadane's Algorithm — O(n) time, O(1) space
  
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));  // 6
console.log(maxSubArray([1]));                        // 1
console.log(maxSubArray([5,4,-1,7,8]));               // 23`,
    hint:"Track currentSum and maxSum. At each element: currentSum = max(num, currentSum + num). Update maxSum = max(maxSum, currentSum).",
    solution:`function maxSubArray(nums) {
  let maxSum = nums[0], curr = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i]);
    maxSum = Math.max(maxSum, curr);
  }
  return maxSum;
}`,
    testCases:[
      { input:"[-2,1,-3,4,-1,2,1,-5,4]", expected:"6" },
      { input:"[1]",                      expected:"1" },
      { input:"[5,4,-1,7,8]",             expected:"23" },
    ]
  },
];

// Pick today's challenge set: 5 MCQs + 2 coding questions
function getTodaysChallenge() {
  const seed = new Date().toDateString();
  let hash = 0;
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  const mcqStart = Math.abs(hash) % (MCQ_BANK.length - 5);
  const codeStart = Math.abs(hash >> 4) % (CODING_BANK.length - 2);
  return {
    mcqs: MCQ_BANK.slice(mcqStart, mcqStart + 5),
    coding: CODING_BANK.slice(codeStart, codeStart + 2),
    totalXP: MCQ_BANK.slice(mcqStart, mcqStart+5).reduce((s,q)=>s+q.xp,0)
           + CODING_BANK.slice(codeStart, codeStart+2).reduce((s,q)=>s+q.xp,0),
  };
}

const dcCss = `
@keyframes dcFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:.6} }
.dc-root { font-family:var(--font-sans,sans-serif); max-width:860px; margin:0 auto; padding-bottom:48px; }

/* Timer */
.dc-timer {
  display:inline-flex; align-items:center; gap:8px;
  padding:6px 16px; border-radius:20px; font-family:var(--font-mono,monospace);
  font-size:14px; font-weight:700; border:1px solid;
}
.dc-timer.ok   { color:#43e97b; border-color:rgba(67,233,123,.3); background:rgba(67,233,123,.08); }
.dc-timer.warn { color:#ffd166; border-color:rgba(255,209,102,.3); background:rgba(255,209,102,.08); animation:timerPulse 1s infinite; }
.dc-timer.danger { color:#ff6b6b; border-color:rgba(255,107,107,.3); background:rgba(255,107,107,.08); animation:timerPulse .5s infinite; }

/* Section headers */
.dc-section-hd {
  display:flex; align-items:center; gap:10px;
  padding:14px 0 10px; border-bottom:1px solid var(--color-border-tertiary);
  margin-bottom:16px;
}
.dc-section-hd .title { font-size:16px; font-weight:700; color:var(--color-text-primary); }
.dc-section-hd .badge {
  font-size:11px; font-weight:700; padding:3px 10px; border-radius:12px;
  background:var(--color-background-info); color:var(--color-text-info);
}

/* MCQ card */
.dc-mcq {
  background:var(--color-background-primary); border:1px solid var(--color-border-secondary);
  border-radius:14px; padding:20px; margin-bottom:14px; animation:dcFade .3s ease;
}
.dc-mcq .qnum { font-size:11px; font-weight:700; color:var(--color-text-tertiary); margin-bottom:6px; font-family:var(--font-mono,monospace); }
.dc-mcq .qtopic { display:inline-block; font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px; background:var(--color-background-secondary); color:var(--color-text-secondary); margin-bottom:10px; }
.dc-mcq .qtext { font-size:14px; font-weight:600; color:var(--color-text-primary); line-height:1.6; margin-bottom:14px; }
.dc-mcq .opts { display:flex; flex-direction:column; gap:7px; }
.dc-opt {
  padding:10px 14px; border-radius:8px; border:1px solid var(--color-border-secondary);
  background:var(--color-background-secondary); color:var(--color-text-primary);
  font-size:13px; cursor:pointer; text-align:left; transition:all .15s;
  font-family:var(--font-sans,sans-serif);
}
.dc-opt:hover:not(:disabled) { border-color:var(--color-text-info); background:var(--color-background-info); }
.dc-opt.correct { border-color:var(--color-border-success)!important; background:var(--color-background-success)!important; color:var(--color-text-success)!important; font-weight:700; }
.dc-opt.wrong   { border-color:var(--color-border-danger)!important;  background:var(--color-background-danger)!important;  color:var(--color-text-danger)!important; }
.dc-opt.reveal  { border-color:var(--color-border-success)!important; background:var(--color-background-success)!important; color:var(--color-text-success)!important; opacity:.6; }

/* Coding question */
.dc-coding {
  background:var(--color-background-primary); border:1px solid var(--color-border-secondary);
  border-radius:14px; overflow:hidden; margin-bottom:16px; animation:dcFade .3s ease;
}
.dc-coding-hd {
  display:flex; align-items:center; gap:10px; padding:14px 18px;
  background:var(--color-background-secondary); border-bottom:1px solid var(--color-border-tertiary);
}
.dc-diff { font-size:11px; font-weight:700; padding:3px 10px; border-radius:10px; }
.dc-diff.Easy   { background:rgba(67,233,123,.15); color:#43e97b; }
.dc-diff.Medium { background:rgba(255,209,102,.15); color:#ffd166; }
.dc-diff.Hard   { background:rgba(255,107,107,.15); color:#ff6b6b; }
.dc-coding-body { display:grid; grid-template-columns:1fr 1fr; min-height:360px; }
@media(max-width:640px){ .dc-coding-body{grid-template-columns:1fr;} }
.dc-desc { padding:18px; border-right:1px solid var(--color-border-tertiary); overflow-y:auto; }
.dc-desc pre { font-family:var(--font-mono,monospace); font-size:12px; background:var(--color-background-secondary); padding:10px 12px; border-radius:6px; margin:10px 0; white-space:pre-wrap; color:var(--color-text-primary); }
.dc-editor-wrap { display:flex; flex-direction:column; }
.dc-editor-hd { display:flex; align-items:center; gap:6px; padding:8px 12px; background:#161b22; border-bottom:1px solid #2d3a5f; }
.dc-editor-dot { width:10px; height:10px; border-radius:50%; }
.dc-editor {
  flex:1; font-family:var(--font-mono,monospace); font-size:12.5px; line-height:1.7;
  background:#0d1117; color:#e6edf3; border:none; outline:none; resize:none;
  padding:14px 16px; min-height:220px;
}
.dc-editor-footer { display:flex; gap:8px; padding:10px 12px; background:#161b22; border-top:1px solid #2d3a5f; flex-wrap:wrap; }
.dc-run-btn {
  padding:7px 18px; border-radius:8px; border:none; cursor:pointer; font-weight:700; font-size:13px;
  background:linear-gradient(135deg,#43e97b,#00b894); color:#0d1117; transition:all .2s;
}
.dc-run-btn:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(67,233,123,.3); }
.dc-hint-btn {
  padding:7px 14px; border-radius:8px; border:1px solid var(--color-border-secondary);
  background:transparent; color:var(--color-text-secondary); font-size:13px; cursor:pointer;
}
.dc-hint-btn:hover { border-color:var(--color-text-info); color:var(--color-text-info); }
.dc-sol-btn {
  padding:7px 14px; border-radius:8px; border:1px solid rgba(255,107,107,.3);
  background:transparent; color:#ff6b6b; font-size:13px; cursor:pointer; margin-left:auto;
}
.dc-output {
  font-family:var(--font-mono,monospace); font-size:12px; padding:10px 14px;
  background:#0d1117; color:#a8ff78; border-top:1px solid #2d3a5f;
  min-height:44px; max-height:120px; overflow-y:auto; white-space:pre-wrap;
}
.dc-output.error { color:#ff6b6b; }
.dc-hint-box { margin:10px 14px; padding:10px 14px; border-radius:8px; background:rgba(255,209,102,.08); border-left:3px solid #ffd166; font-size:13px; color:#ffd166; }

/* Results */
.dc-results {
  background:var(--color-background-primary); border:1px solid var(--color-border-secondary);
  border-radius:14px; padding:28px; text-align:center; animation:dcFade .4s ease;
}
.dc-score-ring { font-size:56px; font-weight:900; margin:8px 0; }
.dc-result-row { display:flex; justify-content:center; gap:32px; margin:20px 0; flex-wrap:wrap; }
.dc-result-stat .rv { font-size:22px; font-weight:800; color:var(--color-text-primary); }
.dc-result-stat .rl { font-size:11px; color:var(--color-text-tertiary); text-transform:uppercase; letter-spacing:1px; margin-top:2px; }
`;

// ── Timer hook ──
function useTimer(seconds, onExpire) {
  const [left, setLeft] = useState(seconds);
  const ref = useRef(null);
  useEffect(() => {
    ref.current = setInterval(() => {
      setLeft(s => {
        if (s <= 1) { clearInterval(ref.current); onExpire(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2,"0");
  const ss = String(left % 60).padStart(2,"0");
  const cls = left > 300 ? "ok" : left > 60 ? "warn" : "danger";
  return { display:`${mm}:${ss}`, cls, left };
}

// ── MCQ Section ──
function MCQSection({ questions, answers, onAnswer }) {
  return (
    <div>
      <div className="dc-section-hd">
        <span className="title">📝 Multiple Choice Questions</span>
        <span className="badge">{questions.length} Questions</span>
        <span style={{fontSize:12,color:"var(--color-text-tertiary)",marginLeft:"auto"}}>
          {Object.keys(answers).length}/{questions.length} answered
        </span>
      </div>
      {questions.map((q, qi) => {
        const ans = answers[q.id];
        const submitted = ans !== undefined;
        return (
          <div key={q.id} className="dc-mcq">
            <div className="qnum">Q{qi+1} · +{q.xp} XP</div>
            <span className="qtopic">{q.topic}</span>
            <div className="qtext">{q.q}</div>
            <div className="opts">
              {q.opts.map((opt, oi) => {
                let cls = "dc-opt";
                if (submitted) {
                  if (oi === q.ans) cls += " correct";
                  else if (oi === ans) cls += " wrong";
                }
                return (
                  <button key={oi} className={cls} disabled={submitted} onClick={() => onAnswer(q.id, oi)}>
                    <span style={{marginRight:8,opacity:.5}}>{String.fromCharCode(65+oi)}.</span>{opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div style={{marginTop:10,fontSize:12,color: ans===q.ans?"var(--color-text-success)":"var(--color-text-danger)",fontWeight:600}}>
                {ans === q.ans ? `✅ Correct! +${q.xp} XP` : `❌ Wrong. Correct answer: ${q.opts[q.ans]}`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Coding Question ──
function CodingQuestion({ q, idx, onSolve, solved }) {
  const [code, setCode] = useState(q.starterCode);
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSol, setShowSol] = useState(false);

  function runCode() {
    try {
      const logs = [];
      const fakeConsole = { log: (...args) => logs.push(args.map(a => JSON.stringify(a)).join(" ")) };
      // eslint-disable-next-line no-new-func
      const fn = new Function("console", code);
      fn(fakeConsole);
      const out = logs.join("\n") || "(no output)";
      setOutput(out); setIsError(false);
      // Check if any test case passes to award XP
      if (!solved) {
        const passing = q.testCases.some(tc => {
          try {
            const check = logs.some(l => l.includes(tc.expected.replace(/"/g,"")));
            return check;
          } catch { return false; }
        });
        if (passing) onSolve(q.id, q.xp);
      }
    } catch(e) {
      setOutput("Error: " + e.message); setIsError(true);
    }
  }

  return (
    <div className="dc-coding">
      <div className="dc-coding-hd">
        <span style={{fontSize:14,fontWeight:700,color:"var(--color-text-primary)"}}>
          {idx+1}. {q.title}
        </span>
        <span className={`dc-diff ${q.difficulty}`}>{q.difficulty}</span>
        <span style={{fontSize:11,color:"var(--color-text-tertiary)",marginLeft:4}}>{q.topic}</span>
        <span style={{fontSize:12,fontWeight:700,color:"#ffd166",marginLeft:"auto"}}>+{q.xp} XP</span>
        {solved && <span style={{fontSize:12,color:"#43e97b",fontWeight:700,marginLeft:8}}>✅ Solved</span>}
      </div>
      <div className="dc-coding-body">
        {/* Description */}
        <div className="dc-desc">
          <p style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{q.desc}</p>
          {showHint && <div className="dc-hint-box">💡 Hint: {q.hint}</div>}
          {showSol && (
            <div style={{marginTop:12}}>
              <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:6}}>Solution:</div>
              <pre style={{fontFamily:"var(--font-mono,monospace)",fontSize:12,background:"var(--color-background-secondary)",padding:"10px 12px",borderRadius:6,color:"var(--color-text-primary)",whiteSpace:"pre-wrap"}}>{q.solution}</pre>
            </div>
          )}
        </div>
        {/* Editor */}
        <div className="dc-editor-wrap">
          <div className="dc-editor-hd">
            <div className="dc-editor-dot" style={{background:"#ff5f57"}}/>
            <div className="dc-editor-dot" style={{background:"#ffbd2e"}}/>
            <div className="dc-editor-dot" style={{background:"#28c840"}}/>
            <span style={{fontSize:11,color:"#5c6370",marginLeft:"auto",fontFamily:"monospace"}}>JavaScript</span>
          </div>
          <textarea className="dc-editor" value={code} onChange={e => setCode(e.target.value)} spellCheck={false}/>
          <div className="dc-editor-footer">
            <button className="dc-run-btn" onClick={runCode}>▶ Run Code</button>
            <button className="dc-hint-btn" onClick={() => setShowHint(h => !h)}>💡 Hint</button>
            <button className="dc-sol-btn" onClick={() => setShowSol(s => !s)}>👁 Solution</button>
          </div>
          {output && <div className={`dc-output${isError?" error":""}`}>{output}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Results Screen ──
function ResultsScreen({ mcqs, mcqAnswers, codingSolved, totalXP, earnedXP, onRetry, onClose }) {
  const mcqCorrect = mcqs.filter(q => mcqAnswers[q.id] === q.ans).length;
  const pct = Math.round((earnedXP / totalXP) * 100);
  const grade = pct >= 90 ? "S" : pct >= 75 ? "A" : pct >= 60 ? "B" : pct >= 40 ? "C" : "D";
  const gradeColor = { S:"#ffd166", A:"#43e97b", B:"#4ecdc4", C:"#ff9f43", D:"#ff6b6b" }[grade];

  return (
    <div className="dc-results">
      <div style={{fontSize:13,color:"var(--color-text-tertiary)",marginBottom:8,letterSpacing:2,textTransform:"uppercase"}}>Challenge Complete!</div>
      <div className="dc-score-ring" style={{color:gradeColor}}>{grade}</div>
      <div style={{fontSize:14,color:"var(--color-text-secondary)",marginBottom:20}}>
        {pct >= 75 ? "🎉 Excellent work!" : pct >= 50 ? "👍 Good effort!" : "📚 Keep practicing!"}
      </div>
      <div className="dc-result-row">
        <div className="dc-result-stat">
          <div className="rv" style={{color:"#ffd166"}}>+{earnedXP}</div>
          <div className="rl">XP Earned</div>
        </div>
        <div className="dc-result-stat">
          <div className="rv" style={{color:"#43e97b"}}>{mcqCorrect}/{mcqs.length}</div>
          <div className="rl">MCQ Correct</div>
        </div>
        <div className="dc-result-stat">
          <div className="rv" style={{color:"#4ecdc4"}}>{codingSolved}/{2}</div>
          <div className="rl">Code Solved</div>
        </div>
        <div className="dc-result-stat">
          <div className="rv">{pct}%</div>
          <div className="rl">Score</div>
        </div>
      </div>
      {/* MCQ breakdown */}
      <div style={{textAlign:"left",maxWidth:480,margin:"0 auto 20px"}}>
        {mcqs.map((q,i) => {
          const correct = mcqAnswers[q.id] === q.ans;
          return (
            <div key={q.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
              <span style={{fontSize:14}}>{correct?"✅":"❌"}</span>
              <span style={{fontSize:12,color:"var(--color-text-secondary)",flex:1}}>Q{i+1}: {q.q.slice(0,60)}...</span>
              <span style={{fontSize:11,fontWeight:700,color:correct?"#43e97b":"#ff6b6b"}}>{correct?`+${q.xp} XP`:"0 XP"}</span>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={onRetry} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#6c63ff,#4ecdc4)",color:"#fff",fontWeight:700,fontSize:14}}>
          🔄 Try Again
        </button>
        <button onClick={onClose} style={{padding:"10px 24px",borderRadius:10,border:"1px solid var(--color-border-secondary)",cursor:"pointer",background:"transparent",color:"var(--color-text-primary)",fontWeight:600,fontSize:14}}>
          Back to Learn
        </button>
      </div>
    </div>
  );
}

// ── Main Export ──
export default function DailyChallenge({ onXPEarned }) {
  const today = new Date().toDateString();
  const savedKey = "dc_" + today;
  const [phase, setPhase] = useState(() => localStorage.getItem(savedKey) ? "results_view" : "intro");
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [codingSolved, setCodingSolved] = useState({});
  const [earnedXP, setEarnedXP] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { mcqs, coding, totalXP } = getTodaysChallenge();

  function handleMCQAnswer(id, idx) {
    if (mcqAnswers[id] !== undefined) return;
    const q = mcqs.find(q => q.id === id);
    const correct = idx === q.ans;
    const gained = correct ? q.xp : 0;
    setMcqAnswers(prev => ({...prev, [id]: idx}));
    if (gained > 0) {
      setEarnedXP(e => e + gained);
      onXPEarned?.(gained);
    }
  }

  function handleCodeSolve(id, xp) {
    if (codingSolved[id]) return;
    setCodingSolved(prev => ({...prev, [id]: true}));
    setEarnedXP(e => e + xp);
    onXPEarned?.(xp);
  }

  function handleSubmit() {
    setSubmitted(true);
    setPhase("results");
    localStorage.setItem(savedKey, "done");
  }

  function handleRetry() {
    setMcqAnswers({}); setCodingSolved({}); setEarnedXP(0); setSubmitted(false);
    localStorage.removeItem(savedKey);
    setPhase("challenge");
  }

  const allMCQDone = mcqs.every(q => mcqAnswers[q.id] !== undefined);
  const timer = useTimer(30 * 60, handleSubmit); // 30 min

  if (phase === "intro") return (
    <div className="dc-root">
      <style>{dcCss}</style>
      <div style={{textAlign:"center",padding:"40px 20px",animation:"dcFade .4s ease"}}>
        <div style={{fontSize:48,marginBottom:16}}>⚡</div>
        <div style={{fontSize:24,fontWeight:800,color:"var(--color-text-primary)",marginBottom:8}}>Daily Challenge</div>
        <div style={{fontSize:14,color:"var(--color-text-secondary)",maxWidth:440,margin:"0 auto 24px",lineHeight:1.7}}>
          A fresh set of <strong>5 MCQs</strong> + <strong>2 coding problems</strong> every day.
          Complete them to earn XP and climb the leaderboard.
        </div>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
          {[["⏱️","30 Minutes"],["📝","5 MCQs"],["💻","2 Coding Qs"],["⚡",`${totalXP} XP`]].map(([icon,label]) => (
            <div key={label} style={{padding:"12px 20px",borderRadius:12,background:"var(--color-background-secondary)",border:"1px solid var(--color-border-secondary)",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>{icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:"var(--color-text-primary)"}}>{label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("challenge")} style={{padding:"13px 36px",borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#6c63ff,#4ecdc4)",color:"#fff",fontWeight:800,fontSize:16,boxShadow:"0 4px 20px rgba(108,99,255,.35)"}}>
          Start Challenge →
        </button>
      </div>
    </div>
  );

  if (phase === "results" || phase === "results_view") return (
    <div className="dc-root">
      <style>{dcCss}</style>
      <ResultsScreen mcqs={mcqs} mcqAnswers={mcqAnswers} codingSolved={Object.keys(codingSolved).length}
        totalXP={totalXP} earnedXP={earnedXP} onRetry={handleRetry} onClose={() => setPhase("intro")} />
    </div>
  );

  return (
    <div className="dc-root">
      <style>{dcCss}</style>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:18,fontWeight:800,color:"var(--color-text-primary)"}}>⚡ Daily Challenge</div>
          <div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>{today}</div>
        </div>
        <div className={`dc-timer ${timer.cls}`}>⏱ {timer.display}</div>
        <button onClick={handleSubmit} disabled={submitted} style={{padding:"8px 20px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#ff6b6b,#ff9f43)",color:"#fff",fontWeight:700,fontSize:13,opacity:submitted?.5:1}}>
          Submit All
        </button>
      </div>

      {/* MCQs */}
      <MCQSection questions={mcqs} answers={mcqAnswers} onAnswer={handleMCQAnswer} />

      {/* Coding */}
      <div className="dc-section-hd" style={{marginTop:28}}>
        <span className="title">💻 Coding Problems</span>
        <span className="badge">{coding.length} Problems</span>
        <span style={{fontSize:12,color:"var(--color-text-tertiary)",marginLeft:"auto"}}>
          {Object.keys(codingSolved).length}/{coding.length} solved
        </span>
      </div>
      {coding.map((q, i) => (
        <CodingQuestion key={q.id} q={q} idx={i}
          solved={!!codingSolved[q.id]}
          onSolve={handleCodeSolve} />
      ))}

      {/* Submit bar */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0",borderTop:"1px solid var(--color-border-tertiary)",marginTop:8,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>
          MCQ: {Object.keys(mcqAnswers).length}/{mcqs.length} answered &nbsp;·&nbsp;
          Code: {Object.keys(codingSolved).length}/{coding.length} solved &nbsp;·&nbsp;
          <span style={{color:"#ffd166",fontWeight:700}}>+{earnedXP} XP earned so far</span>
        </div>
        <button onClick={handleSubmit} disabled={submitted} style={{padding:"10px 28px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#6c63ff,#4ecdc4)",color:"#fff",fontWeight:700,fontSize:14,opacity:submitted?.5:1}}>
          🏁 Submit & See Results
        </button>
      </div>
    </div>
  );
}
