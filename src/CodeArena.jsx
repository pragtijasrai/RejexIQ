import { useState, useEffect, useRef } from "react";

const G = {
  bg:"#0a0e1a", surface:"#0f1428", card:"#131d35",
  border:"rgba(255,255,255,0.07)", accent:"#ff6b9d",
  accentDim:"rgba(255,107,157,0.15)", purple:"#c084fc",
  cyan:"#22d3ee", text:"#f0f4ff", muted:"#64748b",
  mutedBright:"#94a3b8", success:"#34d399",
  warning:"#fbbf24", danger:"#f87171",
};
const DIFF = {
  easy:  { color:"#34d399", label:"Easy"   },
  medium:{ color:"#fbbf24", label:"Med."   },
  hard:  { color:"#f87171", label:"Hard"   },
};
const LANGUAGES = ["JavaScript","Python","Java","C++","TypeScript"];

const PROBLEMS = [
  {
    id:1, title:"Two Sum", difficulty:"easy", acceptance:49.2,
    tags:["Array","Hash Table"], solved:true, premium:false,
    description:"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples:[
      {input:"nums = [2,7,11,15], target = 9",output:"[0,1]",explain:"nums[0] + nums[1] == 9"},
      {input:"nums = [3,2,4], target = 6",output:"[1,2]"},
    ],
    constraints:["2 <= nums.length <= 10^4","-10^9 <= nums[i] <= 10^9","Only one valid answer exists."],
    testCases:[
      {input:"nums = [2,7,11,15]\ntarget = 9", expected:"[0,1]"},
      {input:"nums = [3,2,4]\ntarget = 6",     expected:"[1,2]"},
      {input:"nums = [3,3]\ntarget = 6",        expected:"[0,1]"},
    ],
    hint:"Use a hash map. For each element check if (target - element) already exists.",
    starterCode:{
      JavaScript:"/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};",
      Python:"class Solution:\n    def twoSum(self, nums, target):\n        pass",
      Java:"class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
      "C++":"class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
      TypeScript:"function twoSum(nums: number[], target: number): number[] {\n    \n};",
    },
    solution:"var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp), i];\n        map.set(nums[i], i);\n    }\n};",
  },
  {
    id:20, title:"Valid Parentheses", difficulty:"easy", acceptance:40.8,
    tags:["String","Stack"], solved:true, premium:false,
    description:"Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples:[
      {input:'s = "()"',output:"true"},{input:'s = "()[]{}"',output:"true"},{input:'s = "(]"',output:"false"},
    ],
    constraints:["1 <= s.length <= 10^4"],
    testCases:[
      {input:'s = "()"',expected:"true"},{input:'s = "()[]{}"',expected:"true"},
      {input:'s = "(]"',expected:"false"},{input:'s = "([)]"',expected:"false"},
    ],
    hint:"Use a stack. Push opening brackets. When you see a closing bracket, pop and check if it matches.",
    starterCode:{
      JavaScript:"var isValid = function(s) {\n    \n};",
      Python:"class Solution:\n    def isValid(self, s):\n        pass",
      Java:"class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
      "C++":"class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};",
      TypeScript:"function isValid(s: string): boolean {\n    \n};",
    },
    solution:"var isValid = function(s) {\n    const stack = [];\n    const map = {')':'(', '}':'{', ']':'['};\n    for (const c of s) {\n        if ('({['.includes(c)) stack.push(c);\n        else if (stack.pop() !== map[c]) return false;\n    }\n    return stack.length === 0;\n};",
  },
  {
    id:3, title:"Longest Substring Without Repeating", difficulty:"medium", acceptance:34.5,
    tags:["String","Sliding Window"], solved:false, premium:false,
    description:"Given a string s, find the length of the longest substring without repeating characters.",
    examples:[{input:'s = "abcabcbb"',output:"3",explain:'Answer is "abc", length 3.'},{input:'s = "bbbbb"',output:"1"}],
    constraints:["0 <= s.length <= 5*10^4"],
    testCases:[{input:'s = "abcabcbb"',expected:"3"},{input:'s = "bbbbb"',expected:"1"},{input:'s = "pwwkew"',expected:"3"}],
    hint:"Sliding window with a Set. Expand right, shrink left when duplicate found.",
    starterCode:{JavaScript:"var lengthOfLongestSubstring = function(s) {\n    \n};",Python:"class Solution:\n    def lengthOfLongestSubstring(self, s):\n        pass",Java:"class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}","C++":"class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};",TypeScript:"function lengthOfLongestSubstring(s: string): number {\n    \n};"},
    solution:"var lengthOfLongestSubstring = function(s) {\n    const set = new Set();\n    let l = 0, max = 0;\n    for (let r = 0; r < s.length; r++) {\n        while (set.has(s[r])) set.delete(s[l++]);\n        set.add(s[r]);\n        max = Math.max(max, r - l + 1);\n    }\n    return max;\n};",
  },
  {
    id:53, title:"Maximum Subarray", difficulty:"medium", acceptance:50.7,
    tags:["Array","DP"], solved:true, premium:false,
    description:"Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples:[{input:"nums = [-2,1,-3,4,-1,2,1,-5,4]",output:"6",explain:"Subarray [4,-1,2,1] has sum 6."},{input:"nums = [1]",output:"1"}],
    constraints:["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4"],
    testCases:[{input:"nums = [-2,1,-3,4,-1,2,1,-5,4]",expected:"6"},{input:"nums = [1]",expected:"1"},{input:"nums = [5,4,-1,7,8]",expected:"23"}],
    hint:"Kadane's algorithm: keep a running sum, reset when it goes negative.",
    starterCode:{JavaScript:"var maxSubArray = function(nums) {\n    \n};",Python:"class Solution:\n    def maxSubArray(self, nums):\n        pass",Java:"class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}","C++":"class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};",TypeScript:"function maxSubArray(nums: number[]): number {\n    \n};"},
    solution:"var maxSubArray = function(nums) {\n    let max = nums[0], cur = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        cur = Math.max(nums[i], cur + nums[i]);\n        max = Math.max(max, cur);\n    }\n    return max;\n};",
  },
  {
    id:70, title:"Climbing Stairs", difficulty:"easy", acceptance:52.3,
    tags:["Math","DP"], solved:false, premium:false,
    description:"You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples:[{input:"n = 2",output:"2",explain:"1+1, 2"},{input:"n = 3",output:"3",explain:"1+1+1, 1+2, 2+1"}],
    constraints:["1 <= n <= 45"],
    testCases:[{input:"n = 2",expected:"2"},{input:"n = 3",expected:"3"},{input:"n = 5",expected:"8"}],
    hint:"It's Fibonacci! dp[i] = dp[i-1] + dp[i-2].",
    starterCode:{JavaScript:"var climbStairs = function(n) {\n    \n};",Python:"class Solution:\n    def climbStairs(self, n):\n        pass",Java:"class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}","C++":"class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};",TypeScript:"function climbStairs(n: number): number {\n    \n};"},
    solution:"var climbStairs = function(n) {\n    let a = 1, b = 1;\n    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n    return b;\n};",
  },
  {
    id:42, title:"Trapping Rain Water", difficulty:"hard", acceptance:61.4,
    tags:["Array","Two Pointers"], solved:false, premium:false,
    description:"Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
    examples:[{input:"height = [0,1,0,2,1,0,1,3,2,1,2,1]",output:"6"},{input:"height = [4,2,0,3,2,5]",output:"9"}],
    constraints:["n == height.length","1 <= n <= 2*10^4"],
    testCases:[{input:"height = [0,1,0,2,1,0,1,3,2,1,2,1]",expected:"6"},{input:"height = [4,2,0,3,2,5]",expected:"9"}],
    hint:"Two pointers: track maxLeft and maxRight. Water = min(maxL,maxR) - height[i].",
    starterCode:{JavaScript:"var trap = function(height) {\n    \n};",Python:"class Solution:\n    def trap(self, height):\n        pass",Java:"class Solution {\n    public int trap(int[] height) {\n        \n    }\n}","C++":"class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};",TypeScript:"function trap(height: number[]): number {\n    \n};"},
    solution:"var trap = function(height) {\n    let l=0,r=height.length-1,mL=0,mR=0,w=0;\n    while(l<r){if(height[l]<height[r]){height[l]>=mL?(mL=height[l]):(w+=mL-height[l]);l++;}else{height[r]>=mR?(mR=height[r]):(w+=mR-height[r]);r--;}}\n    return w;\n};",
  },
  {
    id:200, title:"Number of Islands", difficulty:"medium", acceptance:58.9,
    tags:["Array","DFS","BFS"], solved:false, premium:false,
    description:"Given an m x n 2D binary grid representing a map of '1's (land) and '0's (water), return the number of islands.",
    examples:[{input:'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]',output:"2"}],
    constraints:["1 <= m,n <= 300"],
    testCases:[{input:'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]',expected:"2"},{input:'grid = [["1","1","1"],["0","1","0"],["1","1","1"]]',expected:"1"}],
    hint:"DFS from each unvisited '1'. Mark visited cells as '0'.",
    starterCode:{JavaScript:"var numIslands = function(grid) {\n    \n};",Python:"class Solution:\n    def numIslands(self, grid):\n        pass",Java:"class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}","C++":"class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};",TypeScript:"function numIslands(grid: string[][]): number {\n    \n};"},
    solution:"var numIslands = function(grid) {\n    let count=0;\n    const dfs=(r,c)=>{if(r<0||c<0||r>=grid.length||c>=grid[0].length||grid[r][c]==='0')return;grid[r][c]='0';dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);};\n    for(let r=0;r<grid.length;r++)for(let c=0;c<grid[0].length;c++)if(grid[r][c]==='1'){dfs(r,c);count++;}\n    return count;\n};",
  },
  {
    id:146, title:"LRU Cache", difficulty:"hard", acceptance:43.6,
    tags:["Design","Hash Table","Linked List"], solved:false, premium:true,
    description:"Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    examples:[{input:'["LRUCache","put","put","get"]\n[[2],[1,1],[2,2],[1]]',output:"[null,null,null,1]"}],
    constraints:["1 <= capacity <= 3000"],
    testCases:[{input:'capacity = 2\nops = [["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2]]',expected:"[null,null,1,null,-1]"}],
    hint:"HashMap + doubly linked list. Map gives O(1) access; list maintains LRU order.",
    starterCode:{JavaScript:"var LRUCache = function(capacity) {\n    \n};\nLRUCache.prototype.get = function(key) {\n    \n};\nLRUCache.prototype.put = function(key, value) {\n    \n};",Python:"class LRUCache:\n    def __init__(self, capacity):\n        pass",Java:"class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}","C++":"class LRUCache {\npublic:\n    LRUCache(int capacity){}\n    int get(int key){return -1;}\n    void put(int key,int value){}\n};",TypeScript:"class LRUCache {\n    constructor(capacity: number){}\n    get(key: number): number { return -1; }\n    put(key: number, value: number): void {}\n}"},
    solution:"var LRUCache=function(cap){this.cap=cap;this.map=new Map();};\nLRUCache.prototype.get=function(k){if(!this.map.has(k))return -1;const v=this.map.get(k);this.map.delete(k);this.map.set(k,v);return v;};\nLRUCache.prototype.put=function(k,v){this.map.delete(k);if(this.map.size>=this.cap)this.map.delete(this.map.keys().next().value);this.map.set(k,v);};",
  },
];

const TOPIC_TAGS = [
  {label:"Array",count:2145},{label:"String",count:867},{label:"Hash Table",count:808},
  {label:"Math",count:666},{label:"Dynamic Programming",count:653},{label:"Sorting",count:512},
  {label:"Greedy",count:460},{label:"Depth-First Search",count:441},{label:"Binary Search",count:380},
  {label:"Tree",count:356},{label:"Graph",count:320},{label:"Linked List",count:218},
];
const COMPANIES = [
  {name:"Google",count:2273,color:"#4285f4"},{name:"Amazon",count:1961,color:"#ff9900"},
  {name:"Uber",count:364,color:"#e2e8f0"},{name:"Apple",count:303,color:"#a2aaad"},
  {name:"Meta",count:1369,color:"#0866ff"},{name:"Bloomberg",count:1187,color:"#ff6b00"},
  {name:"Microsoft",count:1375,color:"#00a4ef"},{name:"Adobe",count:158,color:"#ff0000"},
  {name:"Airbnb",count:61,color:"#ff5a5f"},{name:"TikTok",count:360,color:"#69c9d0"},
];

// --- EXECUTION ENGINE ---
function parseTestInput(str) {
  const vars = {};
  str.trim().split("\n").forEach(line => {
    const eq = line.indexOf("=");
    if (eq === -1) return;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    try { vars[key] = JSON.parse(val); } catch(e2) { vars[key] = val.replace(/^["']|["']$/g, ""); }
  });
  return vars;
}

function detectFnName(code) {
  const pats = [
    /var\s+(\w+)\s*=\s*function/,
    /const\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\()/,
    /function\s+(\w+)\s*\(/,
  ];
  for (const p of pats) {
    const m = code.match(p);
    if (m && m[1] && m[1] !== "function") return m[1];
  }
  return null;
}

function analyseComplexity(code) {
  const triple = /for[\s\S]{0,200}for[\s\S]{0,200}for/.test(code);
  const nested = /for[\s\S]{0,200}for/.test(code);
  const hasRec = /function\s+(\w+)[^{]*\{[\s\S]*?\1\s*\(/.test(code);
  const hasSort = /\.sort\s*\(/.test(code);
  const hasMap = /new\s+Map|new\s+Set/.test(code);
  if (triple) return { time:"O(n^3)", space:"O(1)", warn:true,  msg:"Triple nested loops -- very slow! Consider a better approach." };
  if (nested) return { time:"O(n^2)", space:"O(1)", warn:true,  msg:"Nested loops detected -- O(n^2). A hash map could reduce this to O(n)." };
  if (hasRec && !hasMap) return { time:"O(2^n)", space:"O(n)", warn:true, msg:"Recursion without memoization -- exponential time complexity!" };
  if (hasSort) return { time:"O(n log n)", space:"O(1)", warn:false, msg:null };
  if (hasMap)  return { time:"O(n)",       space:"O(n)", warn:false, msg:null };
  return         { time:"O(n)",       space:"O(1)", warn:false, msg:null };
}

function classifyError(err) {
  const msg = err.message || String(err);
  const name = err.name || "";
  if (name === "SyntaxError")
    return { type:"Compile Error",    color:G.danger,   detail:msg, tip:"Check for missing brackets, semicolons, or typos.", category:"syntax" };
  if (name === "RangeError" || msg.includes("Maximum call stack"))
    return { type:"Stack Overflow",   color:G.danger,   detail:"Infinite recursion detected. Check your base case.", tip:"Add a base case to stop the recursion.", category:"stackoverflow" };
  if (name === "TypeError")
    return { type:"TypeError",        color:G.danger,   detail:msg, tip:"You may be calling a method on undefined/null.", category:"typeerror" };
  if (name === "ReferenceError")
    return { type:"ReferenceError",   color:G.danger,   detail:msg, tip:"A variable is used before it is defined.", category:"referenceerror" };
  return   { type:"Runtime Error",   color:G.danger,   detail:msg, tip:"", category:"runtime" };
}

function normalizeOutput(val) {
  if (val === null || val === undefined) return "null";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number")  return String(val);
  return JSON.stringify(val);
}

function outputsMatch(actual, expected) {
  const a = normalizeOutput(actual).trim();
  const e = expected.trim();
  if (a === e) return true;
  try {
    const pa = JSON.parse(a), pe = JSON.parse(e);
    if (Array.isArray(pa) && Array.isArray(pe))
      return JSON.stringify([...pa].sort((x,y)=>x-y)) === JSON.stringify([...pe].sort((x,y)=>x-y));
  } catch(err2) {}
  return false;
}

function runJS(code, problem) {
  const logs = [];
  const con = {
    log:  (...a) => logs.push({ type:"log",   msg:a.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" ") }),
    error:(...a) => logs.push({ type:"error", msg:a.map(x => String(x)).join(" ") }),
    warn: (...a) => logs.push({ type:"warn",  msg:a.map(x => String(x)).join(" ") }),
  };
  try { new Function(code); } catch(e) { return { ok:false, error:classifyError(e), logs }; }
  const fnName = detectFnName(code);
  if (!fnName) return {
    ok:false,
    error:{ type:"Compile Error", color:G.danger, detail:"Cannot detect your function name. Use: var myFn = function(...){...}", tip:"", category:"syntax" },
    logs,
  };
  const complexity = analyseComplexity(code);
  const cases = [];
  let totalMs = 0;
  for (const tc of problem.testCases) {
    const vars = parseTestInput(tc.input);
    const args = Object.values(vars).map(v => JSON.stringify(v)).join(", ");
    let output, ms;
    try {
      const fn = new Function("console", code + "\nreturn " + fnName + "(" + args + ");");
      const t0 = performance.now();
      output = fn(con);
      ms = performance.now() - t0;
      if (ms > 3000) return {
        ok:false,
        error:{ type:"Time Limit Exceeded", color:G.warning, detail:"Took " + ms.toFixed(0) + "ms -- limit is 3000ms.", tip:"Try a more efficient algorithm (hash map, binary search, DP).", category:"tle" },
        logs, complexity,
      };
      totalMs += ms;
    } catch(e) {
      const err = classifyError(e);
      cases.push({ input:tc.input, expected:tc.expected, output:"Error: " + e.message, passed:false, ms:0, error:err });
      return { ok:false, error:err, cases, logs, complexity };
    }
    cases.push({ input:tc.input, expected:tc.expected, output:normalizeOutput(output), passed:outputsMatch(output, tc.expected), ms:+ms.toFixed(2) });
  }
  return { ok:true, passed:cases.every(c => c.passed), cases, avgMs:+(totalMs/cases.length).toFixed(2), logs, complexity };
}

// --- SYNTAX HIGHLIGHTER ---
const KW = new Set(["function","return","const","let","var","if","else","for","while","do",
  "switch","case","break","continue","class","new","this","typeof","instanceof","import",
  "export","default","from","async","await","try","catch","finally","throw","void","delete",
  "in","of","true","false","null","undefined","def","self","pass","and","or","not","is",
  "lambda","yield","with","as","elif","except","raise","int","long","double","float",
  "boolean","char","public","private","protected","static","final","abstract","interface",
  "extends","implements","super","vector","string","auto","using","namespace","std"]);

function highlightLine(line) {
  if (!line.trim()) return <span>&nbsp;</span>;
  const t = line.trimStart();
  if (t.startsWith("//") || t.startsWith("#") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("*/"))
    return <span style={{ color:"#4a5568", fontStyle:"italic" }}>{line}</span>;
  const tokens = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/\/.*|#.*|\b\w+\b|[^\w\s])/g);
  return tokens.map((tok, i) => {
    if (!tok) return null;
    if (tok.startsWith("//") || tok.startsWith("#")) return <span key={i} style={{ color:"#4a5568", fontStyle:"italic" }}>{tok}</span>;
    if (/^["'`]/.test(tok))  return <span key={i} style={{ color:"#34d399" }}>{tok}</span>;
    if (KW.has(tok))          return <span key={i} style={{ color:"#c084fc", fontWeight:600 }}>{tok}</span>;
    if (/^\d+(\.\d+)?$/.test(tok)) return <span key={i} style={{ color:"#fbbf24" }}>{tok}</span>;
    if (/^[A-Z]\w*$/.test(tok))    return <span key={i} style={{ color:"#22d3ee" }}>{tok}</span>;
    if (/^[{}()[\]]$/.test(tok))   return <span key={i} style={{ color:"#ff6b9d" }}>{tok}</span>;
    if (/^[=+\-*/<>!&|^~%]+$/.test(tok)) return <span key={i} style={{ color:"#94a3b8" }}>{tok}</span>;
    return <span key={i} style={{ color:"#f0f4ff" }}>{tok}</span>;
  });
}

// --- CODE EDITOR ---
function CodeEditor({ code, onChange }) {
  const taRef = useRef();
  const hlRef = useRef();
  const lines = code.split("\n");
  const LH = 22;

  function syncScroll() {
    if (hlRef.current && taRef.current) {
      hlRef.current.scrollTop  = taRef.current.scrollTop;
      hlRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  }

  function onKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = taRef.current, s = ta.selectionStart, end = ta.selectionEnd;
      const next = code.slice(0, s) + "    " + code.slice(end);
      onChange(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 4; });
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const ta = taRef.current, s = ta.selectionStart;
      const lineStart = code.lastIndexOf("\n", s - 1) + 1;
      const currentLine = code.slice(lineStart, s);
      const indent = currentLine.match(/^(\s*)/)[1];
      const extra = currentLine.trimEnd().endsWith("{") ? "    " : "";
      const next = code.slice(0, s) + "\n" + indent + extra + code.slice(ta.selectionEnd);
      onChange(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 1 + indent.length + extra.length; });
    }
  }

  const shared = {
    fontFamily: "'Fira Code','Consolas',monospace",
    fontSize: 13, lineHeight: LH + "px",
    padding: "14px 14px 14px 0",
    whiteSpace: "pre", overflowWrap: "normal", tabSize: 4,
  };

  return (
    <div style={{ position:"relative", flex:1, overflow:"hidden", background:"#0d1117", display:"flex" }}>
      <div style={{ width:44, flexShrink:0, background:"#0d1117", borderRight:"1px solid rgba(255,255,255,0.06)", paddingTop:14, userSelect:"none", overflowY:"hidden" }}>
        {lines.map((_, i) => (
          <div key={i} style={{ height:LH, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:10, fontSize:12, color:"#3d4f6e", fontFamily:"'Fira Code',monospace" }}>{i + 1}</div>
        ))}
      </div>
      <div ref={hlRef} style={{ position:"absolute", left:44, top:0, right:0, bottom:0, ...shared, paddingLeft:14, overflow:"hidden", pointerEvents:"none", zIndex:1 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ height:LH, display:"flex", alignItems:"center" }}>{highlightLine(line)}</div>
        ))}
      </div>
      <textarea ref={taRef} value={code} onChange={e => onChange(e.target.value)}
        onScroll={syncScroll} onKeyDown={onKeyDown}
        spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
        style={{ position:"absolute", left:44, top:0, right:0, bottom:0, ...shared, paddingLeft:14, background:"transparent", border:"none", outline:"none", resize:"none", color:"rgba(240,244,255,0.01)", caretColor:G.accent, zIndex:2, width:"calc(100% - 44px)" }}
      />
    </div>
  );
}

// --- SUB-COMPONENTS (all OUTSIDE SolveView -- prevents white screen) ---
function ComplexityRow({ c }) {
  if (!c) return null;
  return (
    <div style={{ background:c.warn ? "rgba(251,191,36,0.07)" : "rgba(34,211,238,0.05)", border:"1px solid " + (c.warn ? G.warning : G.cyan) + "25", borderRadius:10, padding:"10px 14px", marginBottom:12, display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
      <span style={{ fontSize:11, color:G.muted }}>Time: <span style={{ fontFamily:"'Fira Code',monospace", color:c.warn ? G.warning : G.cyan, fontWeight:700 }}>{c.time}</span></span>
      <span style={{ fontSize:11, color:G.muted }}>Space: <span style={{ fontFamily:"'Fira Code',monospace", color:G.cyan, fontWeight:700 }}>{c.space}</span></span>
      {c.warn && <span style={{ fontSize:11, color:G.warning }}>Warning: {c.msg}</span>}
    </div>
  );
}

function LogsPanel({ logs }) {
  if (!logs || !logs.length) return null;
  return (
    <div style={{ marginTop:12 }}>
      <div style={{ fontSize:11, fontWeight:700, color:G.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Console</div>
      <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:8, padding:"10px 14px", fontFamily:"'Fira Code',monospace", fontSize:12, lineHeight:1.9, maxHeight:130, overflowY:"auto" }}>
        {logs.map((l, i) => (
          <div key={i} style={{ color:l.type === "error" ? G.danger : l.type === "warn" ? G.warning : G.mutedBright }}>
            <span style={{ color:G.muted, marginRight:8 }}>{l.type === "error" ? "x" : l.type === "warn" ? "!" : ">"}</span>{l.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

function TCTabs({ problem, result, activeTC, setActiveTC }) {
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
        {problem.testCases.map((_, i) => {
          const cr = result && result.cases && result.cases[i];
          return (
            <button key={i} onClick={() => setActiveTC(i)} style={{ padding:"5px 14px", borderRadius:8, background:activeTC === i ? G.accentDim : "rgba(255,255,255,0.04)", border:"1px solid " + (activeTC === i ? G.accent + "50" : G.border), color:activeTC === i ? G.accent : G.muted, fontSize:12, fontWeight:activeTC === i ? 700 : 400, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", gap:5 }}>
              {cr && <span style={{ width:6, height:6, borderRadius:"50%", background:cr.passed ? G.success : G.danger, display:"inline-block" }} />}
              Case {i + 1}
            </button>
          );
        })}
      </div>
      <div>
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:G.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Input</div>
          <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:8, padding:"10px 14px", fontFamily:"'Fira Code',monospace", fontSize:12, color:G.text, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{problem.testCases[activeTC] && problem.testCases[activeTC].input}</div>
        </div>
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:G.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Expected Output</div>
          <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:8, padding:"10px 14px", fontFamily:"'Fira Code',monospace", fontSize:12, color:G.success }}>{problem.testCases[activeTC] && problem.testCases[activeTC].expected}</div>
        </div>
        {result && result.cases && result.cases[activeTC] && (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:G.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Your Output</div>
            <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:8, padding:"10px 14px", fontFamily:"'Fira Code',monospace", fontSize:12, color:result.cases[activeTC].passed ? G.success : G.danger }}>
              {result.cases[activeTC].output}
            </div>
            {!result.cases[activeTC].passed && (
              <div style={{ marginTop:8, fontSize:12, color:G.danger }}>
                Expected: <code style={{ background:"rgba(0,0,0,0.3)", padding:"1px 6px", borderRadius:4 }}>{result.cases[activeTC].expected}</code> -- Got: <code style={{ background:"rgba(0,0,0,0.3)", padding:"1px 6px", borderRadius:4 }}>{result.cases[activeTC].output}</code>
              </div>
            )}
            <div style={{ marginTop:6, fontSize:11, color:G.muted }}>{result.cases[activeTC].ms}ms</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsPanel({ result, problem, activeTC, setActiveTC }) {
  if (!result) return (
    <div style={{ padding:"20px 16px" }}>
      <p style={{ color:G.muted, fontSize:13, marginBottom:20 }}>Run your code to see results here.</p>
      <TCTabs problem={problem} result={result} activeTC={activeTC} setActiveTC={setActiveTC} />
    </div>
  );
  if (result.notJS) return (
    <div style={{ padding:"20px 16px" }}>
      <div style={{ background:"rgba(251,191,36,0.08)", border:"1px solid " + G.warning + "30", borderRadius:12, padding:"16px 18px" }}>
        <div style={{ fontSize:14, fontWeight:700, color:G.warning, marginBottom:8 }}>Browser Execution Limitation</div>
        <div style={{ fontSize:13, color:G.text, lineHeight:1.8 }}>
          Real-time execution only works for <strong style={{ color:G.accent }}>JavaScript</strong> in the browser.<br />
          Switch to JavaScript to run and test your code live.
        </div>
      </div>
    </div>
  );
  if (!result.ok) {
    const err = result.error;
    return (
      <div style={{ padding:"16px" }}>
        <div style={{ background:err.color + "10", border:"1px solid " + err.color + "40", borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:800, color:err.color, background:err.color + "20", borderRadius:6, padding:"2px 8px" }}>{err.type}</span>
          </div>
          <div style={{ fontFamily:"'Fira Code',monospace", fontSize:12, color:G.text, background:"rgba(0,0,0,0.35)", borderRadius:8, padding:"10px 12px", lineHeight:1.8, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
            {err.detail}
          </div>
          {err.tip && <div style={{ marginTop:10, fontSize:12, color:G.warning }}>Tip: {err.tip}</div>}
        </div>
        <ComplexityRow c={result.complexity} />
        <LogsPanel logs={result.logs} />
      </div>
    );
  }
  const ok = result.passed;
  return (
    <div style={{ padding:"16px" }}>
      <div style={{ background:ok ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border:"1px solid " + (ok ? G.success : G.danger) + "40", borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontSize:15, fontWeight:700, color:ok ? G.success : G.danger }}>
                {result.isSubmit ? (ok ? "Accepted" : "Wrong Answer") : (ok ? "All Test Cases Passed" : "Wrong Answer")}
              </span>
            </div>
            {result.isSubmit && ok && <div style={{ fontSize:12, color:G.muted }}>Beats <span style={{ color:G.success, fontWeight:700 }}>{result.beats}%</span> of JavaScript submissions</div>}
            {!ok && result.cases && result.cases.find(c => !c.passed) && (
              <div style={{ fontSize:12, color:G.muted, marginTop:4 }}>
                Failed on: {result.cases.find(c => !c.passed).input.split("\n")[0]}
              </div>
            )}
          </div>
          <div style={{ textAlign:"right", fontSize:12, color:G.muted }}>
            <div style={{ color:G.text, fontWeight:600, fontSize:14 }}>{result.avgMs}ms</div>
            <div>Runtime</div>
            {result.isSubmit && result.mem && <><div style={{ color:G.text, fontWeight:600, marginTop:4 }}>{result.mem}MB</div><div>Memory</div></>}
          </div>
        </div>
      </div>
      <ComplexityRow c={result.complexity} />
      <TCTabs problem={problem} result={result} activeTC={activeTC} setActiveTC={setActiveTC} />
      <LogsPanel logs={result.logs} />
    </div>
  );
}


// --- SOLVE VIEW ---
function SolveView({ problem, onBack }) {
  const diff = DIFF[problem.difficulty];
  const [descTab,  setDescTab]  = useState("description");
  const [rightTab, setRightTab] = useState("code");
  const [language, setLanguage] = useState("JavaScript");
  const [code,     setCode]     = useState(problem.starterCode && problem.starterCode.JavaScript || "");
  const [running,  setRunning]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [activeTC, setActiveTC] = useState(0);
  const [seconds,  setSeconds]  = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSol,  setShowSol]  = useState(false);
  const [history,  setHistory]  = useState([]);
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    setCode(problem.starterCode && problem.starterCode[language] || "");
    setResult(null);
  }, [language, problem.id]);

  const fmt = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

  function execute(isSubmit) {
    if (language !== "JavaScript") {
      setResult({ notJS:true, lang:language });
      setRightTab("results");
      return;
    }
    setRunning(true);
    setResult(null);
    setRightTab("results");
    setTimeout(() => {
      const r = runJS(code, problem);
      const now = new Date().toLocaleTimeString();
      if (isSubmit) {
        const mem = (Math.random() * 5 + 38).toFixed(1);
        const beats = Math.floor(Math.random() * 20 + 75);
        const status = !r.ok ? r.error.type : r.passed ? "Accepted" : "Wrong Answer";
        setHistory(h => [{ status, lang:language, runtime:r.ok ? r.avgMs + "ms" : "--", memory:r.ok ? mem + "MB" : "--", date:now, beats:r.passed ? beats : null }, ...h]);
        setResult({ ...r, isSubmit:true, mem, beats });
      } else {
        setResult({ ...r, isSubmit:false });
      }
      setRunning(false);
    }, 60);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:G.bg, zIndex:200, display:"flex", flexDirection:"column", fontFamily:"'Inter',sans-serif" }}>

      {/* TOP BAR */}
      <div style={{ height:46, background:G.surface, borderBottom:"1px solid " + G.border, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", color:G.mutedBright, cursor:"pointer", fontSize:13, padding:"4px 8px", borderRadius:6, transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = G.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = G.mutedBright; }}
          >
            &larr; Problems
          </button>
          <div style={{ width:1, height:20, background:G.border }} />
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:G.text }}>{problem.id}. {problem.title}</span>
          <span style={{ fontSize:11, fontWeight:700, color:diff.color, background:diff.color + "15", border:"1px solid " + diff.color + "30", borderRadius:20, padding:"2px 10px" }}>{diff.label}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(0,0,0,0.3)", border:"1px solid " + G.border, borderRadius:20, padding:"4px 12px" }}>
            <span style={{ fontSize:11 }}>Timer:</span>
            <span style={{ fontFamily:"'Fira Code',monospace", fontSize:12, color:seconds > 1800 ? G.danger : G.mutedBright }}>{fmt(seconds)}</span>
          </div>
          <button onClick={() => setShowHint(h => !h)} style={{ background:"rgba(192,132,252,0.1)", border:"1px solid " + G.purple + "30", borderRadius:8, padding:"5px 12px", color:G.purple, fontSize:12, fontWeight:600, cursor:"pointer" }}>Hint</button>
          <button onClick={() => setShowSol(s => !s)} style={{ background:"rgba(34,211,238,0.08)", border:"1px solid " + G.cyan + "25", borderRadius:8, padding:"5px 12px", color:G.cyan, fontSize:12, fontWeight:600, cursor:"pointer" }}>Solution</button>
        </div>
      </div>

      {/* HINT BANNER */}
      {showHint && (
        <div style={{ background:"rgba(192,132,252,0.08)", borderBottom:"1px solid " + G.purple + "25", padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:13, color:G.text }}><strong style={{ color:G.purple }}>Hint:</strong> {problem.hint}</span>
          <button onClick={() => setShowHint(false)} style={{ background:"none", border:"none", color:G.muted, cursor:"pointer", fontSize:18 }}>x</button>
        </div>
      )}

      {/* SOLUTION BANNER */}
      {showSol && (
        <div style={{ background:"rgba(34,211,238,0.06)", borderBottom:"1px solid " + G.cyan + "20", padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:G.cyan, marginBottom:6 }}>Reference Solution</div>
            <pre style={{ fontFamily:"'Fira Code',monospace", fontSize:12, color:G.text, margin:0, whiteSpace:"pre-wrap" }}>{problem.solution}</pre>
          </div>
          <button onClick={() => setShowSol(false)} style={{ background:"none", border:"none", color:G.muted, cursor:"pointer", fontSize:18, flexShrink:0, marginLeft:16 }}>x</button>
        </div>
      )}

      {/* SPLIT PANE */}
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", overflow:"hidden" }}>

        {/* LEFT -- Description */}
        <div style={{ borderRight:"1px solid " + G.border, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ display:"flex", borderBottom:"1px solid " + G.border, background:"rgba(0,0,0,0.15)", flexShrink:0 }}>
            {["description","editorial","solutions","submissions"].map(t => (
              <button key={t} onClick={() => setDescTab(t)} style={{ padding:"10px 14px", background:"none", border:"none", borderBottom:"2px solid " + (descTab === t ? G.accent : "transparent"), color:descTab === t ? G.accent : G.muted, fontSize:12, fontWeight:descTab === t ? 600 : 400, cursor:"pointer", textTransform:"capitalize", transition:"all 0.2s", fontFamily:"'Inter',sans-serif" }}>{t}</button>
            ))}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"20px 22px" }}>
            {descTab === "description" && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:800, color:G.text }}>{problem.id}. {problem.title}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:diff.color, background:diff.color + "15", border:"1px solid " + diff.color + "30", borderRadius:20, padding:"3px 10px" }}>{diff.label}</span>
                </div>
                <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
                  {problem.tags.map(t => <span key={t} style={{ fontSize:11, color:G.cyan, background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.18)", borderRadius:20, padding:"3px 10px" }}>{t}</span>)}
                </div>
                <p style={{ fontSize:14, color:G.text, lineHeight:1.9, marginBottom:18 }}>{problem.description}</p>
                {problem.examples.map((ex, i) => (
                  <div key={i} style={{ marginBottom:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:G.mutedBright, marginBottom:6 }}>Example {i + 1}:</div>
                    <div style={{ background:"rgba(0,0,0,0.35)", borderRadius:10, padding:"12px 14px", fontFamily:"'Fira Code',monospace", fontSize:12, lineHeight:1.9 }}>
                      <div><span style={{ color:G.mutedBright }}>Input: </span><span style={{ color:G.text }}>{ex.input}</span></div>
                      <div><span style={{ color:G.mutedBright }}>Output: </span><span style={{ color:G.success }}>{ex.output}</span></div>
                      {ex.explain && <div><span style={{ color:G.mutedBright }}>Explanation: </span><span style={{ color:G.muted }}>{ex.explain}</span></div>}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:G.mutedBright, marginBottom:8 }}>Constraints:</div>
                  <ul style={{ paddingLeft:20, margin:0 }}>
                    {problem.constraints.map((c, i) => <li key={i} style={{ fontSize:13, color:G.text, lineHeight:1.8, fontFamily:"'Fira Code',monospace" }}>{c}</li>)}
                  </ul>
                </div>
                <div style={{ marginTop:18, padding:"12px 14px", background:"rgba(255,107,157,0.06)", border:"1px solid " + G.accent + "20", borderRadius:10 }}>
                  <div style={{ fontSize:11, color:G.muted }}>Acceptance Rate</div>
                  <div style={{ fontSize:16, fontWeight:700, color:G.success, marginTop:2 }}>{problem.acceptance}%</div>
                </div>
              </div>
            )}
            {descTab === "editorial" && (
              <div style={{ color:G.muted, fontSize:13, lineHeight:1.8 }}>
                <div style={{ fontSize:15, fontWeight:700, color:G.text, marginBottom:12 }}>Editorial</div>
                <p>Key insight: {problem.hint}</p>
                <p style={{ marginTop:12 }}>Time: <span style={{ color:G.cyan, fontFamily:"'Fira Code',monospace" }}>{analyseComplexity(problem.solution).time}</span></p>
                <p>Space: <span style={{ color:G.cyan, fontFamily:"'Fira Code',monospace" }}>{analyseComplexity(problem.solution).space}</span></p>
              </div>
            )}
            {descTab === "solutions" && (
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:G.text, marginBottom:14 }}>Community Solutions</div>
                {[
                  { title:"Hash Map -- O(n)", lang:"JavaScript", votes:2341, author:"coder_pro" },
                  { title:"Two Pass -- O(n)", lang:"Python", votes:1892, author:"algo_master" },
                  { title:"Brute Force -- O(n^2)", lang:"Java", votes:432, author:"beginner_dev" },
                ].map((s, i) => (
                  <div key={i} style={{ background:G.surface, border:"1px solid " + G.border, borderRadius:10, padding:"12px 14px", marginBottom:10, cursor:"pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = G.accent + "40"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:13, fontWeight:600, color:G.text }}>{s.title}</span>
                      <span style={{ fontSize:11, color:G.muted }}>{s.votes} votes</span>
                    </div>
                    <div style={{ fontSize:11, color:G.muted, marginTop:4 }}>{s.lang} by {s.author}</div>
                  </div>
                ))}
              </div>
            )}
            {descTab === "submissions" && (
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:G.text, marginBottom:14 }}>My Submissions</div>
                {history.length === 0 && <div style={{ color:G.muted, fontSize:13 }}>No submissions yet. Submit your code to see history.</div>}
                {history.map((s, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid " + G.border }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:s.status === "Accepted" ? G.success : G.danger }}>{s.status}</div>
                      <div style={{ fontSize:11, color:G.muted, marginTop:2 }}>{s.lang} -- {s.date}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:12, color:G.text }}>{s.runtime}</div>
                      <div style={{ fontSize:11, color:G.muted }}>{s.memory}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT -- Editor + Results */}
        <div style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px", height:44, borderBottom:"1px solid " + G.border, background:"rgba(0,0,0,0.15)", flexShrink:0 }}>
            <div style={{ display:"flex", gap:2 }}>
              {[{ id:"code", label:"Code" }, { id:"results", label:"Test Cases" }, { id:"console", label:"Console" }].map(t => (
                <button key={t.id} onClick={() => setRightTab(t.id)} style={{ padding:"4px 14px", background:"none", border:"none", borderBottom:"2px solid " + (rightTab === t.id ? G.accent : "transparent"), color:rightTab === t.id ? G.accent : G.muted, fontSize:12, fontWeight:rightTab === t.id ? 600 : 400, cursor:"pointer", transition:"all 0.2s", fontFamily:"'Inter',sans-serif" }}>{t.label}</button>
              ))}
            </div>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ background:G.card, border:"1px solid " + G.border, borderRadius:6, padding:"4px 10px", color:G.text, fontSize:12, outline:"none", cursor:"pointer" }}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {rightTab === "code" && (
            <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <CodeEditor code={code} onChange={setCode} />
            </div>
          )}
          {rightTab === "results" && (
            <div style={{ flex:1, overflowY:"auto" }}>
              <ResultsPanel result={result} problem={problem} activeTC={activeTC} setActiveTC={setActiveTC} />
            </div>
          )}
          {rightTab === "console" && (
            <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:G.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Console Output</div>
              {!result || !result.logs || !result.logs.length
                ? <div style={{ color:G.muted, fontSize:12 }}>No output yet. Use console.log() in your code.</div>
                : <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:8, padding:"10px 14px", fontFamily:"'Fira Code',monospace", fontSize:12, lineHeight:1.9 }}>
                    {result.logs.map((l, i) => (
                      <div key={i} style={{ color:l.type === "error" ? G.danger : l.type === "warn" ? G.warning : G.mutedBright }}>
                        <span style={{ color:G.muted, marginRight:8 }}>{l.type === "error" ? "x" : l.type === "warn" ? "!" : ">"}</span>{l.msg}
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* Bottom action bar */}
          <div style={{ height:52, borderTop:"1px solid " + G.border, background:"rgba(0,0,0,0.2)", display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"0 16px", gap:10, flexShrink:0 }}>
            <button onClick={() => execute(false)} disabled={running}
              style={{ background:running ? "rgba(34,211,238,0.06)" : "rgba(34,211,238,0.12)", border:"1px solid " + G.cyan + "30", borderRadius:8, padding:"7px 20px", color:G.cyan, fontSize:13, fontWeight:600, cursor:running ? "not-allowed" : "pointer", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s" }}
              onMouseEnter={e => { if (!running) e.currentTarget.style.background = "rgba(34,211,238,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,211,238,0.12)"; }}>
              {running ? "Running..." : "Run"}
            </button>
            <button onClick={() => execute(true)} disabled={running}
              style={{ background:running ? "rgba(255,107,157,0.1)" : "linear-gradient(135deg," + G.accent + "," + G.purple + ")", border:"none", borderRadius:8, padding:"7px 24px", color:"#fff", fontSize:13, fontWeight:700, cursor:running ? "not-allowed" : "pointer", boxShadow:running ? "none" : "0 4px 14px rgba(255,107,157,0.3)", transition:"all 0.2s" }}
              onMouseEnter={e => { if (!running) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,107,157,0.5)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(255,107,157,0.3)"; }}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- PROBLEMS LIST PAGE ---
function StreakCalendar() {
  const firstDay = 2, daysInMonth = 31;
  const solved = new Set([1,3,5,7,8,9,12,14,15,16,17,18,19]);
  const days = ["S","M","T","W","T","F","S"];
  return (
    <div style={{ background:G.card, border:"1px solid " + G.border, borderRadius:16, padding:"16px 14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg," + G.warning + ",#f97316)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:"0 0 16px rgba(251,191,36,0.4)" }}>*</div>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:G.text }}>Day 19</div>
            <div style={{ fontSize:10, color:G.muted }}>May 2026</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {["<",">"].map((a, i) => <button key={i} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid " + G.border, borderRadius:6, width:24, height:24, color:G.muted, cursor:"pointer", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>{a}</button>)}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
        {days.map((d, i) => <div key={i} style={{ textAlign:"center", fontSize:10, color:G.muted, fontWeight:600, padding:"2px 0" }}>{d}</div>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
        {Array.from({ length:firstDay }).map((_, i) => <div key={"e" + i} />)}
        {Array.from({ length:daysInMonth }).map((_, i) => {
          const d = i + 1, isT = d === 19, isS = solved.has(d);
          return (
            <div key={d} style={{ aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6, fontSize:11, fontWeight:isT ? 800 : 400, background:isT ? "linear-gradient(135deg," + G.accent + "," + G.purple + ")" : isS ? "rgba(52,211,153,0.18)" : "transparent", color:isT ? "#fff" : isS ? G.success : G.muted, border:isT ? "none" : isS ? "1px solid rgba(52,211,153,0.3)" : "1px solid transparent", cursor:"pointer", boxShadow:isT ? "0 0 10px rgba(255,107,157,0.4)" : "none" }}>{d}</div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:6, marginTop:12, justifyContent:"center" }}>
        {["W1","W2","W3","W4","W5"].map((w, i) => <div key={w} style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, background:i < 3 ? "linear-gradient(135deg," + G.accent + "," + G.purple + ")" : "rgba(255,255,255,0.05)", color:i < 3 ? "#fff" : G.muted, border:i < 3 ? "none" : "1px solid " + G.border, boxShadow:i < 3 ? "0 0 8px rgba(255,107,157,0.3)" : "none" }}>{w}</div>)}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10, paddingTop:10, borderTop:"1px solid " + G.border }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:14 }}>Coins:</span>
          <span style={{ fontSize:12, color:G.muted }}>0</span>
          <button style={{ fontSize:11, color:G.accent, background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Redeem</button>
        </div>
        <button style={{ fontSize:11, color:G.muted, background:"none", border:"none", cursor:"pointer" }}>Rules</button>
      </div>
    </div>
  );
}

function TrendingCompanies() {
  const [search, setSearch] = useState("");
  const [hov, setHov] = useState(null);
  const list = COMPANIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ background:G.card, border:"1px solid " + G.border, borderRadius:16, padding:"16px 14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:G.text }}>Trending Companies</span>
        <div style={{ display:"flex", gap:4 }}>
          {["<",">"].map((a, i) => <button key={i} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid " + G.border, borderRadius:6, width:22, height:22, color:G.muted, cursor:"pointer", fontSize:9, display:"flex", alignItems:"center", justifyContent:"center" }}>{a}</button>)}
        </div>
      </div>
      <div style={{ position:"relative", marginBottom:10 }}>
        <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:12, color:G.muted }}>Search:</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for a company..." style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid " + G.border, borderRadius:8, padding:"7px 10px 7px 60px", color:G.text, fontSize:11, outline:"none", fontFamily:"'Inter',sans-serif" }} />
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {list.map((c, i) => (
          <div key={c.name} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ display:"flex", alignItems:"center", gap:5, background:hov === i ? c.color + "18" : "rgba(255,255,255,0.04)", border:"1px solid " + (hov === i ? c.color + "40" : G.border), borderRadius:20, padding:"4px 10px", cursor:"pointer", transition:"all 0.2s" }}>
            <span style={{ fontSize:11, fontWeight:600, color:G.text }}>{c.name}</span>
            <span style={{ fontSize:10, fontWeight:700, color:c.color, background:c.color + "20", borderRadius:10, padding:"1px 5px" }}>{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyPremium() {
  return (
    <div style={{ background:"linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.06))", border:"1px solid rgba(251,191,36,0.25)", borderRadius:16, padding:"14px 14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <span style={{ fontSize:12, fontWeight:700, color:G.warning }}>Weekly Premium</span>
        <span style={{ fontSize:10, color:G.muted, background:"rgba(255,255,255,0.06)", borderRadius:20, padding:"2px 8px" }}>2 days left</span>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:10 }}>
        {["W1","W2","W3","W4","W5"].map((w, i) => <div key={w} style={{ flex:1, height:28, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, background:i < 3 ? "linear-gradient(135deg," + G.warning + ",#f97316)" : "rgba(255,255,255,0.05)", color:i < 3 ? "#000" : G.muted, boxShadow:i < 3 ? "0 0 8px rgba(251,191,36,0.3)" : "none" }}>{w}</div>)}
      </div>
      <button style={{ width:"100%", background:"linear-gradient(135deg," + G.warning + ",#f97316)", border:"none", borderRadius:8, padding:"8px 0", color:"#000", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", boxShadow:"0 4px 16px rgba(251,191,36,0.3)" }}>Unlock Premium</button>
    </div>
  );
}

// --- MAIN EXPORT ---
export default function CodeArena({ user }) {
  const [solving,     setSolving]     = useState(null);
  const [search,      setSearch]      = useState("");
  const [difficulty,  setDifficulty]  = useState("all");
  const [activeTopic, setActiveTopic] = useState("all");
  const [topicExp,    setTopicExp]    = useState(false);
  const [category,    setCategory]    = useState("all");
  const [hovRow,      setHovRow]      = useState(null);
  const [searchFocus, setSearchFocus] = useState(false);
  const [leftNav,     setLeftNav]     = useState("problems");
  const [hovNav,      setHovNav]      = useState(null);
  const [hovPromo,    setHovPromo]    = useState(null);

  if (solving) return <SolveView problem={solving} onBack={() => setSolving(null)} />;

  const filtered = PROBLEMS.filter(p => {
    const ms = p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const md = difficulty === "all" || p.difficulty === difficulty;
    const mt = activeTopic === "all" || p.tags.some(t => t.toLowerCase().includes(activeTopic.toLowerCase()));
    return ms && md && mt;
  });
  const solvedCount = PROBLEMS.filter(p => p.solved).length;
  const visibleTopics = topicExp ? TOPIC_TAGS : TOPIC_TAGS.slice(0, 8);

  const CATS = [
    { id:"all", label:"All Topics" }, { id:"algorithms", label:"Algorithms" },
    { id:"database", label:"Database" }, { id:"shell", label:"Shell" },
    { id:"concurrency", label:"Concurrency" }, { id:"javascript", label:"JavaScript" },
  ];
  const PROMOS = [
    { title:"Code Arena at Your Fingertips", sub:"Solve problems anywhere, anytime", bg:"linear-gradient(135deg,#1a2347,#0f1535)", accent:"#ff6b9d", border:"rgba(255,107,157,0.3)" },
    { title:"Interview Crash Course:", sub:"System Design for Interviews and Beyond", bg:"linear-gradient(135deg,#1a3a2a,#0f2a1a)", accent:"#34d399", border:"rgba(52,211,153,0.3)" },
    { title:"Interview Crash Course:", sub:"Data Structures and Algorithms", bg:"linear-gradient(135deg,#2a1a3a,#1a0f2a)", accent:"#c084fc", border:"rgba(192,132,252,0.3)" },
  ];
  const LEFT_NAV = [
    { id:"problems", label:"Problems" }, { id:"quest", label:"Quest", badge:"New" },
    { id:"explore", label:"Explore" }, { id:"study", label:"Study Plan" },
  ];

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", minHeight:"100vh" }}>
      <div style={{ marginBottom:20 }}>
        <h1 className="syne" style={{ fontSize:26, fontWeight:800, marginBottom:4, background:"linear-gradient(135deg," + G.text + "," + G.accent + ")", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Code Arena</h1>
        <p style={{ color:G.muted, fontSize:13 }}>Practice coding problems and improve your interview skills.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"180px 1fr 280px", gap:16, alignItems:"start" }}>

        {/* LEFT NAV */}
        <div style={{ background:G.card, border:"1px solid " + G.border, borderRadius:16, padding:"12px 8px", position:"sticky", top:0 }}>
          {LEFT_NAV.map((item, i) => {
            const isA = leftNav === item.id;
            return (
              <button key={item.id} onMouseEnter={() => setHovNav(i)} onMouseLeave={() => setHovNav(null)} onClick={() => setLeftNav(item.id)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, background:isA ? G.accentDim : hovNav === i ? "rgba(255,255,255,0.04)" : "transparent", border:"1px solid " + (isA ? G.accent + "40" : "transparent"), color:isA ? G.accent : hovNav === i ? G.text : G.mutedBright, fontSize:13, fontWeight:isA ? 700 : 400, cursor:"pointer", transition:"all 0.2s", textAlign:"left", width:"100%", marginBottom:2 }}>
                <span style={{ flex:1 }}>{item.label}</span>
                {item.badge && <span style={{ fontSize:9, fontWeight:800, color:"#fff", background:"linear-gradient(135deg," + G.accent + "," + G.purple + ")", borderRadius:20, padding:"2px 6px" }}>{item.badge}</span>}
              </button>
            );
          })}
          <div style={{ height:1, background:G.border, margin:"8px 0" }} />
          <div style={{ padding:"6px 14px", fontSize:11, fontWeight:700, color:G.muted, textTransform:"uppercase", letterSpacing:0.8 }}>My Lists</div>
          {[{ label:"Favorite" }, { label:"Rewind 2025" }].map(item => (
            <button key={item.label}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = G.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = G.mutedBright; }}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 14px", borderRadius:10, background:"transparent", border:"none", color:G.mutedBright, fontSize:13, cursor:"pointer", transition:"all 0.2s", textAlign:"left", width:"100%", marginBottom:2 }}>
              <span style={{ flex:1 }}>{item.label}</span>
              <span style={{ fontSize:12, color:G.muted }}>lock</span>
            </button>
          ))}
        </div>

        {/* CENTER */}
        <div>
          {/* Promo banners */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
            {PROMOS.map((c, i) => (
              <div key={i} onMouseEnter={() => setHovPromo(i)} onMouseLeave={() => setHovPromo(null)}
                style={{ background:c.bg, border:"1px solid " + (hovPromo === i ? c.border : G.border), borderRadius:14, padding:"18px 16px", cursor:"pointer", transition:"all 0.25s", transform:hovPromo === i ? "translateY(-3px)" : "translateY(0)", boxShadow:hovPromo === i ? "0 12px 32px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.3)", minHeight:100, display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, background:c.accent, borderRadius:"50%", opacity:0.12, filter:"blur(20px)" }} />
                <div>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:c.accent, marginBottom:4 }}>{c.title}</div>
                  <div style={{ fontSize:11, color:G.mutedBright, lineHeight:1.5 }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Topic tags */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12, alignItems:"center" }}>
            {visibleTopics.map(t => {
              const active = activeTopic === t.label;
              return (
                <button key={t.label} onClick={() => setActiveTopic(active ? "all" : t.label)}
                  style={{ background:active ? G.accentDim : "transparent", border:"1px solid " + (active ? G.accent + "60" : G.border), borderRadius:20, padding:"4px 12px", color:active ? G.accent : G.mutedBright, fontSize:12, fontWeight:active ? 700 : 400, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", gap:5 }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = G.accent + "40"; e.currentTarget.style.color = G.text; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.color = G.mutedBright; } }}>
                  {t.label} <span style={{ fontSize:10, color:active ? G.accent : G.muted }}>{t.count}</span>
                </button>
              );
            })}
            <button onClick={() => setTopicExp(e => !e)} style={{ background:"transparent", border:"1px solid " + G.border, borderRadius:20, padding:"4px 12px", color:G.muted, fontSize:12, cursor:"pointer" }}
              onMouseEnter={e => { e.currentTarget.style.color = G.text; }} onMouseLeave={e => { e.currentTarget.style.color = G.muted; }}>
              {topicExp ? "Collapse" : "Expand"}
            </button>
          </div>

          {/* Category pills */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
            {CATS.map(p => {
              const isA = category === p.id;
              return (
                <button key={p.id} onClick={() => setCategory(p.id)}
                  style={{ display:"flex", alignItems:"center", gap:6, background:isA ? G.accentDim : "rgba(255,255,255,0.04)", border:"1px solid " + (isA ? G.accent + "50" : G.border), borderRadius:20, padding:"6px 14px", color:isA ? G.accent : G.mutedBright, fontSize:12, fontWeight:isA ? 700 : 400, cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e => { if (!isA) { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = G.text; } }}
                  onMouseLeave={e => { if (!isA) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = G.mutedBright; } }}>
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Search + filter row */}
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12, flexWrap:"wrap" }}>
            <div style={{ position:"relative", flex:1, minWidth:160 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)} placeholder="Search questions"
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid " + (searchFocus ? G.accent : G.border), borderRadius:8, padding:"8px 12px", color:G.text, fontSize:12, outline:"none", fontFamily:"'Inter',sans-serif", transition:"border-color 0.2s", boxShadow:searchFocus ? "0 0 0 3px rgba(255,107,157,0.08)" : "none" }} />
            </div>
            <div style={{ fontSize:12, color:G.muted, whiteSpace:"nowrap" }}><span style={{ color:G.success, fontWeight:700 }}>{solvedCount}</span>/{PROBLEMS.length} Solved</div>
          </div>

          {/* Difficulty filter */}
          <div style={{ display:"flex", gap:6, marginBottom:12 }}>
            {[{ id:"all", label:"All" }, { id:"easy", label:"Easy", color:G.success }, { id:"medium", label:"Medium", color:G.warning }, { id:"hard", label:"Hard", color:G.danger }].map(d => (
              <button key={d.id} onClick={() => setDifficulty(d.id)}
                style={{ background:difficulty === d.id ? (d.color ? d.color + "18" : G.accentDim) : "rgba(255,255,255,0.03)", border:"1px solid " + (difficulty === d.id ? (d.color || G.accent) + "50" : G.border), borderRadius:20, padding:"5px 14px", color:difficulty === d.id ? (d.color || G.accent) : G.muted, fontSize:12, fontWeight:difficulty === d.id ? 700 : 400, cursor:"pointer", transition:"all 0.2s" }}>
                {d.label}
              </button>
            ))}
          </div>

          {/* Problem table */}
          <div style={{ background:G.card, border:"1px solid " + G.border, borderRadius:16, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"36px 1fr 90px 80px 36px", padding:"10px 16px", borderBottom:"1px solid " + G.border, background:"rgba(0,0,0,0.2)" }}>
              {["","Title","Acceptance","Difficulty",""].map((h, i) => <div key={i} style={{ fontSize:11, fontWeight:700, color:G.muted, textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>)}
            </div>
            {filtered.length === 0
              ? <div style={{ padding:"40px 0", textAlign:"center", color:G.muted, fontSize:13 }}>No problems match your filters</div>
              : filtered.map((p, i) => {
                  const d = DIFF[p.difficulty];
                  return (
                    <div key={p.id} onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)} onClick={() => setSolving(p)}
                      style={{ display:"grid", gridTemplateColumns:"36px 1fr 90px 80px 36px", padding:"12px 16px", background:hovRow === i ? "rgba(255,255,255,0.03)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)", borderBottom:"1px solid " + G.border, cursor:"pointer", transition:"background 0.15s", alignItems:"center" }}>
                      <div style={{ fontSize:14 }}>{p.solved ? <span style={{ color:G.success }}></span> : <span style={{ color:G.border, fontSize:10 }}></span>}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:13, color:hovRow === i ? G.accent : G.text, fontWeight:hovRow === i ? 600 : 400, transition:"color 0.15s" }}>{p.id}. {p.title}</span>
                        {p.premium && <span style={{ fontSize:10, color:G.warning }}>Premium</span>}
                      </div>
                      <div style={{ fontSize:12, color:G.muted }}>{p.acceptance}%</div>
                      <div style={{ fontSize:12, fontWeight:600, color:d.color }}>{d.label}</div>
                      <div style={{ fontSize:13, color:G.muted, textAlign:"center" }}>{p.premium ? "lock" : "save"}</div>
                    </div>
                  );
                })
            }
          </div>

          {/* Pagination */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:6, marginTop:16 }}>
            {["<", 1, 2, 3, "...", 20, ">"].map((pg, i) => (
              <button key={i} style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:pg === 1 ? G.accentDim : "rgba(255,255,255,0.04)", border:"1px solid " + (pg === 1 ? G.accent + "40" : G.border), color:pg === 1 ? G.accent : G.muted, fontSize:12, fontWeight:pg === 1 ? 700 : 400, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e => { if (pg !== 1) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = G.text; } }}
                onMouseLeave={e => { if (pg !== 1) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = G.muted; } }}>
                {pg}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display:"flex", flexDirection:"column", gap:14, position:"sticky", top:0 }}>
          <StreakCalendar />
          <WeeklyPremium />
          <TrendingCompanies />
        </div>
      </div>
    </div>
  );
}

