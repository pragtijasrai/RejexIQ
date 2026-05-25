import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { fetchMissions, submitAnswer } from "./storyApi";

const STATIC_MISSIONS = {
  arrays:[
    {id:"arr_m1",worldId:"arrays",question:"What is the time complexity of accessing an element by index in an array?",options:["O(n)","O(1)","O(log n)","O(n²)"],correctAnswer:"O(1)",explanation:"Array access is O(1) — elements are stored contiguously in memory so the CPU computes the address directly.",xp:10},
    {id:"arr_m2",worldId:"arrays",question:"What is the time complexity of inserting at the beginning of an array?",options:["O(1)","O(log n)","O(n)","O(n²)"],correctAnswer:"O(n)",explanation:"Inserting at the beginning requires shifting all existing elements one position right — O(n) operations.",xp:10},
    {id:"arr_m3",worldId:"arrays",question:"Which operation is most efficient on a sorted array?",options:["Linear Search","Binary Search","Bubble Sort","Insertion at index 0"],correctAnswer:"Binary Search",explanation:"Binary Search runs in O(log n) on a sorted array by halving the search space each step.",xp:15},
    {id:"arr_m4",worldId:"arrays",question:"What does arr.push() do in JavaScript?",options:["Removes first element","Adds element to beginning","Adds element to end","Removes last element"],correctAnswer:"Adds element to end",explanation:"arr.push() appends an element to the end of the array in O(1) amortized time.",xp:10},
    {id:"arr_m5",worldId:"arrays",question:"What is the space complexity of an array of n elements?",options:["O(1)","O(log n)","O(n)","O(n²)"],correctAnswer:"O(n)",explanation:"An array of n elements requires O(n) space — one memory slot per element.",xp:10},
  ],
  linkedlist:[
    {id:"ll_m1",worldId:"linkedlist",question:"What is the time complexity of accessing the nth element in a singly linked list?",options:["O(1)","O(log n)","O(n)","O(n²)"],correctAnswer:"O(n)",explanation:"Unlike arrays, linked lists have no index. You must traverse from the head node one by one — O(n) worst case.",xp:10},
    {id:"ll_m2",worldId:"linkedlist",question:"What is the time complexity of inserting a node at the HEAD of a linked list?",options:["O(n)","O(log n)","O(n²)","O(1)"],correctAnswer:"O(1)",explanation:"Inserting at the head only requires updating the new node's next pointer and the head pointer — constant time O(1).",xp:10},
    {id:"ll_m3",worldId:"linkedlist",question:"What does each node in a singly linked list contain?",options:["Only data","Data + two pointers","Data + next pointer","Only a pointer"],correctAnswer:"Data + next pointer",explanation:"Each node stores a value (data) and a reference (next pointer) to the next node in the chain.",xp:10},
    {id:"ll_m4",worldId:"linkedlist",question:"Which technique detects a cycle in a linked list efficiently?",options:["Binary Search","Floyd's Cycle Detection (slow/fast pointers)","Merge Sort","BFS"],correctAnswer:"Floyd's Cycle Detection (slow/fast pointers)",explanation:"Floyd's algorithm uses two pointers — slow (1 step) and fast (2 steps). If they meet, a cycle exists. O(n) time, O(1) space.",xp:20},
    {id:"ll_m5",worldId:"linkedlist",question:"What is the main advantage of a linked list over an array?",options:["Faster random access","Less memory usage","Dynamic size + O(1) insert/delete at head","Better cache performance"],correctAnswer:"Dynamic size + O(1) insert/delete at head",explanation:"Linked lists grow/shrink dynamically and allow O(1) insertion/deletion at the head without shifting elements.",xp:15},
    {id:"ll_m6",worldId:"linkedlist",question:"In a doubly linked list, each node has:",options:["One pointer (next)","Two pointers (prev + next)","Three pointers","No pointers"],correctAnswer:"Two pointers (prev + next)",explanation:"A doubly linked list node stores data, a pointer to the next node, and a pointer to the previous node.",xp:10},
  ],
  stacks:[
    {id:"stk_m1",worldId:"stacks",question:"What principle does a Stack follow?",options:["FIFO","LIFO","LILO","FILO"],correctAnswer:"LIFO",explanation:"Stack follows Last In, First Out (LIFO) — the last element pushed is the first one popped.",xp:10},
    {id:"stk_m2",worldId:"stacks",question:"What is the time complexity of push and pop on a stack?",options:["O(n)","O(log n)","O(1)","O(n²)"],correctAnswer:"O(1)",explanation:"Both push and pop are O(1) — they only touch the top element, no traversal needed.",xp:10},
    {id:"stk_m3",worldId:"stacks",question:"Which real-world use case uses a stack?",options:["Print queue","Browser back button history","CPU scheduling","Network packet routing"],correctAnswer:"Browser back button history",explanation:"The browser back button uses a stack — each page visited is pushed, pressing back pops the most recent page.",xp:15},
    {id:"stk_m4",worldId:"stacks",question:"What error occurs when you pop from an empty stack?",options:["Overflow","Underflow","Null Pointer","Index Out of Bounds"],correctAnswer:"Underflow",explanation:"Stack underflow occurs when you try to pop from an empty stack — there's nothing to remove.",xp:10},
    {id:"stk_m5",worldId:"stacks",question:"Which algorithm uses a stack to check balanced parentheses?",options:["Binary Search","DFS","Iterative matching with a stack","BFS"],correctAnswer:"Iterative matching with a stack",explanation:"Push opening brackets onto a stack. When a closing bracket is found, pop and check if it matches.",xp:20},
    {id:"stk_m6",worldId:"stacks",question:"What does the 'peek' operation do on a stack?",options:["Removes the top element","Adds a new element","Returns the top element without removing it","Clears the stack"],correctAnswer:"Returns the top element without removing it",explanation:"Peek returns the top element without modifying the stack — useful for checking what's next.",xp:10},
  ],
  queues:[
    {id:"que_m1",worldId:"queues",question:"What principle does a Queue follow?",options:["LIFO","FIFO","LILO","Random"],correctAnswer:"FIFO",explanation:"Queue follows First In, First Out (FIFO) — the first element enqueued is the first one dequeued.",xp:10},
    {id:"que_m2",worldId:"queues",question:"What are the two primary operations of a Queue?",options:["Push & Pop","Insert & Delete","Enqueue & Dequeue","Add & Remove"],correctAnswer:"Enqueue & Dequeue",explanation:"Enqueue adds to the rear, Dequeue removes from the front. Both are O(1).",xp:10},
    {id:"que_m3",worldId:"queues",question:"Which traversal algorithm uses a Queue?",options:["DFS","Inorder Traversal","BFS","Postorder Traversal"],correctAnswer:"BFS",explanation:"Breadth-First Search uses a queue to process nodes level by level.",xp:15},
    {id:"que_m4",worldId:"queues",question:"What is a Circular Queue?",options:["A queue that sorts elements","A queue where the last position connects back to the first","A queue with two ends","A queue with priority"],correctAnswer:"A queue where the last position connects back to the first",explanation:"A circular queue reuses empty spaces at the front by wrapping the rear pointer around.",xp:15},
    {id:"que_m5",worldId:"queues",question:"What is a Priority Queue?",options:["Elements sorted alphabetically","Elements served based on priority not insertion order","A queue with fixed size","A double-ended queue"],correctAnswer:"Elements served based on priority not insertion order",explanation:"In a priority queue, the element with the highest priority is dequeued first. Usually implemented with a heap.",xp:20},
    {id:"que_m6",worldId:"queues",question:"What is a Deque (Double-Ended Queue)?",options:["Two separate queues","Insertion and deletion at both ends","A sorted queue","A circular queue"],correctAnswer:"Insertion and deletion at both ends",explanation:"A Deque allows enqueue and dequeue from both front and rear — combining features of stacks and queues.",xp:15},
  ],
  trees:[
    {id:"tre_m1",worldId:"trees",question:"What is the maximum number of children a Binary Tree node can have?",options:["1","2","3","Unlimited"],correctAnswer:"2",explanation:"In a Binary Tree, each node has at most 2 children — left and right.",xp:10},
    {id:"tre_m2",worldId:"trees",question:"What is the time complexity of searching in a balanced BST?",options:["O(n)","O(n²)","O(log n)","O(1)"],correctAnswer:"O(log n)",explanation:"In a balanced BST, each comparison eliminates half the remaining nodes — O(log n) search.",xp:15},
    {id:"tre_m3",worldId:"trees",question:"Which tree traversal visits nodes in Left → Root → Right order?",options:["Preorder","Postorder","Inorder","Level-order"],correctAnswer:"Inorder",explanation:"Inorder traversal (Left → Root → Right) visits a BST's nodes in sorted ascending order.",xp:15},
    {id:"tre_m4",worldId:"trees",question:"What is the height of a complete binary tree with n nodes?",options:["O(n)","O(n²)","O(log n)","O(1)"],correctAnswer:"O(log n)",explanation:"A complete binary tree with n nodes has height floor(log₂n) — each level doubles the node count.",xp:15},
    {id:"tre_m5",worldId:"trees",question:"What property makes a tree an AVL tree?",options:["All leaves at same level","Balance factor of every node is -1, 0, or 1","All nodes have exactly 2 children","Root has no parent"],correctAnswer:"Balance factor of every node is -1, 0, or 1",explanation:"An AVL tree is a self-balancing BST where the height difference between left and right subtrees is at most 1.",xp:20},
    {id:"tre_m6",worldId:"trees",question:"Which traversal uses a queue and visits nodes level by level?",options:["Inorder","Preorder","Postorder","Level-order (BFS)"],correctAnswer:"Level-order (BFS)",explanation:"Level-order traversal uses a queue to visit all nodes at depth 0, then depth 1, etc.",xp:15},
  ],
  sorting:[
    {id:"srt_m1",worldId:"sorting",question:"What is the average time complexity of Quick Sort?",options:["O(n)","O(n log n)","O(n²)","O(log n)"],correctAnswer:"O(n log n)",explanation:"Quick Sort averages O(n log n) by partitioning around a pivot. Worst case is O(n²).",xp:15},
    {id:"srt_m2",worldId:"sorting",question:"Which sorting algorithm is stable and has O(n log n) worst-case?",options:["Quick Sort","Heap Sort","Merge Sort","Bubble Sort"],correctAnswer:"Merge Sort",explanation:"Merge Sort is stable and guarantees O(n log n) in all cases by dividing and merging sorted halves.",xp:15},
    {id:"srt_m3",worldId:"sorting",question:"What is the time complexity of Bubble Sort in the worst case?",options:["O(n)","O(n log n)","O(n²)","O(log n)"],correctAnswer:"O(n²)",explanation:"Bubble Sort makes n*(n-1)/2 comparisons in the worst case = O(n²).",xp:10},
    {id:"srt_m4",worldId:"sorting",question:"Which algorithm sorts by building a max-heap and extracting elements?",options:["Merge Sort","Quick Sort","Heap Sort","Insertion Sort"],correctAnswer:"Heap Sort",explanation:"Heap Sort builds a max-heap then repeatedly extracts the maximum. O(n log n), O(1) extra space.",xp:20},
    {id:"srt_m5",worldId:"sorting",question:"Which sorting algorithm is best for nearly sorted data?",options:["Quick Sort","Merge Sort","Insertion Sort","Heap Sort"],correctAnswer:"Insertion Sort",explanation:"Insertion Sort is O(n) on nearly sorted data — it only shifts elements that are out of place.",xp:15},
    {id:"srt_m6",worldId:"sorting",question:"What is the space complexity of Merge Sort?",options:["O(1)","O(log n)","O(n)","O(n log n)"],correctAnswer:"O(n)",explanation:"Merge Sort requires O(n) extra space for the temporary arrays used during the merge step.",xp:15},
  ],
  recursion:[
    {id:"rec_m1",worldId:"recursion",question:"What are the two essential parts of a recursive function?",options:["Loop + condition","Base case + recursive call","Stack + queue","Input + output"],correctAnswer:"Base case + recursive call",explanation:"Every recursive function needs a base case (to stop) and a recursive call (to reduce the problem).",xp:10},
    {id:"rec_m2",worldId:"recursion",question:"What is the time complexity of computing Fibonacci(n) with naive recursion?",options:["O(n)","O(n log n)","O(2ⁿ)","O(log n)"],correctAnswer:"O(2ⁿ)",explanation:"Naive Fibonacci makes two recursive calls per step, creating an exponential call tree of size ~2ⁿ.",xp:15},
    {id:"rec_m3",worldId:"recursion",question:"What data structure does the call stack resemble?",options:["Queue","Heap","Stack","Graph"],correctAnswer:"Stack",explanation:"The call stack is literally a stack — LIFO. Each function call pushes a frame; returning pops it.",xp:10},
  ],
  graphs:[
    {id:"grp_m1",worldId:"graphs",question:"What traversal algorithm uses a queue?",options:["DFS","BFS","Dijkstra","Prim's"],correctAnswer:"BFS",explanation:"Breadth-First Search uses a queue (FIFO) to explore nodes level by level.",xp:10},
    {id:"grp_m2",worldId:"graphs",question:"What is the time complexity of BFS on a graph with V vertices and E edges?",options:["O(V)","O(E)","O(V + E)","O(V × E)"],correctAnswer:"O(V + E)",explanation:"BFS visits every vertex once (O(V)) and traverses every edge once (O(E)), giving O(V + E) total.",xp:15},
    {id:"grp_m3",worldId:"graphs",question:"Which algorithm finds the shortest path in a weighted graph?",options:["BFS","DFS","Dijkstra's","Kruskal's"],correctAnswer:"Dijkstra's",explanation:"Dijkstra's algorithm uses a priority queue to greedily pick the nearest unvisited node.",xp:15},
  ],
};

const ArrayKingdom     = lazy(() => import("./ArrayKingdom"));
const RecursionDungeon = lazy(() => import("./RecursionDungeon"));
const GraphMaze        = lazy(() => import("./GraphMaze"));

function GenericQuiz({ mission, onAnswer, answerStates, feedback, accentColor }) {
  if (!mission) return null;
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      height:"100%", padding:"24px 32px", gap:20,
    }}>
      {}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:16,
        width:"100%", maxWidth:640,
      }}>
        {mission.options.map((opt, i) => {
          const state = answerStates?.[opt];
          const isCorrect = state === "correct";
          const isWrong   = state === "wrong";
          const bg = isCorrect
            ? "rgba(52,211,153,0.18)"
            : isWrong
            ? "rgba(248,113,113,0.18)"
            : "rgba(255,255,255,0.04)";
          const border = isCorrect
            ? "2px solid #34d399"
            : isWrong
            ? "2px solid #f87171"
            : `1.5px solid rgba(255,255,255,0.1)`;
          const glow = isCorrect
            ? "0 0 20px rgba(52,211,153,0.4)"
            : isWrong
            ? "0 0 20px rgba(248,113,113,0.3)"
            : "none";

          return (
            <button key={opt} onClick={() => onAnswer(opt)}
              disabled={!!feedback}
              style={{
                background: bg, border, borderRadius:16,
                padding:"18px 20px", color:"#f0f4ff",
                fontSize:14, fontWeight:600, cursor: feedback ? "default" : "pointer",
                fontFamily:"'Space Grotesk',sans-serif",
                transition:"all 0.25s", textAlign:"center",
                boxShadow: glow,
                transform: isCorrect ? "scale(1.03)" : "scale(1)",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}
              onMouseEnter={e => { if (!feedback) { e.currentTarget.style.background = `${accentColor}18`; e.currentTarget.style.border = `1.5px solid ${accentColor}60`; }}}
              onMouseLeave={e => { if (!feedback && !isCorrect && !isWrong) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.1)"; }}}
            >
              {isCorrect && <span style={{fontSize:16}}>✓</span>}
              {isWrong   && <span style={{fontSize:16}}>✗</span>}
              {opt}
            </button>
          );
        })}
      </div>

      {}
      {feedback && (
        <div style={{
          maxWidth:600, background: feedback.correct ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
          border:`1px solid ${feedback.correct ? "#34d399" : "#f87171"}30`,
          borderRadius:14, padding:"14px 18px", textAlign:"center",
          animation:"fadeUp 0.3s ease",
        }}>
          <div style={{fontSize:13, color: feedback.correct ? "#34d399" : "#f87171", fontWeight:700, marginBottom:6}}>
            {feedback.correct ? "✓ Correct!" : `✗ Correct answer: ${feedback.correctAnswer}`}
          </div>
          <div style={{fontSize:12, color:"#94a3b8", lineHeight:1.6}}>{feedback.explanation}</div>
        </div>
      )}
    </div>
  );
}

const WORLD_COMPONENTS = {
  arrays:     ArrayKingdom,
  recursion:  RecursionDungeon,
  graphs:     GraphMaze,
  
  linkedlist: null,
  stacks:     null,
  queues:     null,
  trees:      null,
  sorting:    null,
};
const WORLD_COLORS = {
  arrays:     "#00e5ff",
  recursion:  "#c084fc",
  graphs:     "#34d399",
  linkedlist: "#f59e0b",
  stacks:     "#ff6b9d",
  queues:     "#34d399",
  trees:      "#a78bfa",
  sorting:    "#fbbf24",
};
const TIMER_SECONDS    = 30;

function FireworksCanvas() {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    const W = canvas.width, H = canvas.height;
    const COLS = ["#00e5ff","#c084fc","#fbbf24","#34d399","#f87171","#f0f4ff"];
    const bursts = [];
    function spawn() {
      const x = Math.random()*W, y = Math.random()*H*0.6+50;
      const c = COLS[Math.floor(Math.random()*COLS.length)];
      for (let i=0;i<40;i++) {
        const a=(i/40)*Math.PI*2, s=Math.random()*5+2;
        bursts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,alpha:1,color:c,r:Math.random()*2.5+1});
      }
    }
    spawn(); spawn();
    const iv = setInterval(spawn, 450);
    let raf;
    function draw() {
      ctx.fillStyle="rgba(6,9,18,0.18)"; ctx.fillRect(0,0,W,H);
      for (let i=bursts.length-1;i>=0;i--) {
        const p=bursts[i];
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.09; p.alpha-=0.018;
        if (p.alpha<=0){bursts.splice(i,1);continue;}
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color+Math.floor(p.alpha*255).toString(16).padStart(2,"0");
        ctx.fill();
      }
      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>{cancelAnimationFrame(raf);clearInterval(iv);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

function StreakBadge({streak}) {
  if (streak<2) return null;
  const labels={2:"2× Combo!",3:"3× ULTRA!",4:"4× INSANE!",5:"5× GODLIKE!"};
  const colors={2:"#f59e0b",3:"#ef4444",4:"#c084fc",5:"#00e5ff"};
  const label=labels[Math.min(streak,5)]||`${streak}× STREAK!`;
  const color=colors[Math.min(streak,5)]||"#00e5ff";
  return (
    <div style={{position:"absolute",top:80,left:"50%",transform:"translateX(-50%)",zIndex:30,animation:"streakPop 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>
      <div style={{background:`${color}20`,border:`2px solid ${color}`,borderRadius:24,padding:"8px 24px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:900,fontSize:18,color,boxShadow:`0 0 30px ${color}60`,letterSpacing:1,whiteSpace:"nowrap"}}>
        🔥 {label}
      </div>
    </div>
  );
}

function XpTicker({value}) {
  const [disp,setDisp]=useState(0);
  const prev=useRef(0);
  useEffect(()=>{
    const diff=value-prev.current; if(!diff) return;
    const start=prev.current; let step=0;
    const id=setInterval(()=>{
      step++; setDisp(Math.round(start+(diff*step)/20));
      if(step>=20){clearInterval(id);prev.current=value;}
    },30);
    return ()=>clearInterval(id);
  },[value]);
  return <span>{disp}</span>;
}

function CountdownRing({seconds,total,color}) {
  const r=20,circ=2*Math.PI*r,dash=(seconds/total)*circ,urgent=seconds<=8;
  return (
    <div style={{position:"relative",width:52,height:52}}>
      <svg width={52} height={52} style={{transform:"rotate(-90deg)"}}>
        <circle cx={26} cy={26} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4}/>
        <circle cx={26} cy={26} r={r} fill="none" stroke={urgent?"#ef4444":color} strokeWidth={4}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{transition:"stroke-dasharray 0.9s linear",filter:`drop-shadow(0 0 4px ${urgent?"#ef4444":color})`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:14,color:urgent?"#ef4444":"#f0f4ff",animation:urgent?"pulse 0.5s ease infinite":"none"}}>
        {seconds}
      </div>
    </div>
  );
}

function WorldCompleteScreen({world,totalXp,accuracy,onExit,accentColor}) {
  const stars=accuracy>=80?3:accuracy>=50?2:1;
  return (
    <div style={{position:"relative",minHeight:"100vh",background:"#060912",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <FireworksCanvas/>
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"40px 24px",animation:"fadeUp 0.6s ease"}}>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>
          {[1,2,3].map(n=>(
            <div key={n} style={{fontSize:48,filter:n<=stars?`drop-shadow(0 0 20px #fbbf24)`:"grayscale(1) opacity(0.2)",animation:n<=stars?`starPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${n*0.15}s both`:"none"}}>⭐</div>
          ))}
        </div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:"#64748b",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>World Conquered</div>
        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:42,fontWeight:900,color:accentColor,marginBottom:4,textShadow:`0 0 40px ${accentColor}80`}}>{world.name}</h2>
        <div style={{color:"#64748b",marginBottom:36,fontSize:14}}>{world.icon} All missions complete</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,maxWidth:420,margin:"0 auto 36px"}}>
          {[{label:"XP Earned",value:`+${totalXp}`,color:"#fbbf24",icon:"⭐"},{label:"Accuracy",value:`${accuracy}%`,color:"#34d399",icon:"🎯"},{label:"Stars",value:`${stars}/3`,color:"#c084fc",icon:"🏅"}].map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"18px 12px",animation:`cardEntrance 0.5s ease ${0.3+i*0.1}s both`}}>
              <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,color:s.color}}>{s.value}</div>
              <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={onExit}
          style={{background:`linear-gradient(135deg,${accentColor},${accentColor}bb)`,border:"none",color:"#060912",padding:"14px 40px",borderRadius:28,fontWeight:900,fontSize:16,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",boxShadow:`0 8px 30px ${accentColor}50`}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          ← Back to World Map
        </button>
      </div>
    </div>
  );
}

export default function MissionEngine({world,userId,onExit,onXpUpdate}) {
  const [missions,setMissions]         = useState([]);
  const [currentIdx,setCurrentIdx]     = useState(0);
  const [loading,setLoading]           = useState(true);
  const [answerStates,setAnswerStates] = useState(["idle","idle","idle","idle"]);
  const [feedback,setFeedback]         = useState(null);
  const [answered,setAnswered]         = useState(false);
  const [totalXp,setTotalXp]           = useState(0);
  const [streak,setStreak]             = useState(0);
  const [correctCount,setCorrectCount] = useState(0);
  const [worldComplete,setWorldComplete] = useState(false);
  const [timeLeft,setTimeLeft]         = useState(TIMER_SECONDS);
  const [showStreak,setShowStreak]     = useState(false);
  const timerRef = useRef();

  const accentColor    = WORLD_COLORS[world.id] || "#00e5ff";
  const WorldComponent = WORLD_COMPONENTS[world.id] || null;
  const isGeneric      = !WorldComponent;

  useEffect(()=>{
    fetchMissions(world.id)
      .then(d => setMissions(d.missions))
      .catch(()=>{
        
        const staticMs = STATIC_MISSIONS[world.id] || [];
        
        setMissions(staticMs.map(({correctAnswer,...rest})=>rest));
      })
      .finally(()=>setLoading(false));
  },[world.id]);

  
  useEffect(()=>{
    if (answered||loading) return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if (t<=1){clearInterval(timerRef.current);handleTimeUp();return 0;}
        return t-1;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[currentIdx,answered,loading]);

  function handleTimeUp(){
    if (answered) return;
    setAnswered(true); setStreak(0);
    setFeedback({correct:false,xpGained:0,correctAnswer:"—",explanation:"⏰ Time's up! No XP awarded.",timedOut:true});
  }

  const handleAnswer=useCallback(async(selectedOption,optionIndex)=>{
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    const mission=missions[currentIdx]; if (!mission) return;
    try {
      let result;
      try {
        result = await submitAnswer(userId, mission.id, selectedOption);
      } catch(fetchErr) {
        
        const staticMission = (STATIC_MISSIONS[world.id]||[]).find(m=>m.id===mission.id);
        const correct = staticMission ? selectedOption === staticMission.correctAnswer : false;
        result = {
          correct,
          xpGained: correct ? (staticMission?.xp || 10) : 0,
          correctAnswer: staticMission?.correctAnswer || "",
          explanation: staticMission?.explanation || "",
          progress: { xp: 0, level: "Beginner" },
        };
      }
      let bonusXp=0;
      if (result.correct){
        const newStreak=streak+1; setStreak(newStreak);
        if (newStreak>=2){bonusXp=result.xpGained*(Math.min(newStreak,5)-1);setShowStreak(true);setTimeout(()=>setShowStreak(false),1800);}
        setCorrectCount(c=>c+1);
      } else { setStreak(0); }
      setAnswerStates(mission.options.map((opt,i)=>{
        if (i===optionIndex) return result.correct?"correct":"wrong";
        if (!result.correct&&opt===result.correctAnswer) return "correct";
        return "idle";
      }));
      setFeedback({...result,bonusXp});
      if (result.correct){setTotalXp(p=>p+result.xpGained+bonusXp);onXpUpdate?.(result.progress);}
    } catch(e){console.error(e);}
  },[answered,missions,currentIdx,userId,streak,onXpUpdate]);

  function handleNext(){
    if (currentIdx<missions.length-1){
      setCurrentIdx(i=>i+1);
      setAnswerStates(["idle","idle","idle","idle"]);
      setFeedback(null); setAnswered(false);
    } else { setWorldComplete(true); }
  }

  if (loading) return <div style={S.center}><div style={{...S.spinner,borderTopColor:accentColor}}/><p style={{color:"#94a3b8",marginTop:16}}>Loading {world.name}...</p></div>;

  if (worldComplete) {
    const accuracy=missions.length>0?Math.round((correctCount/missions.length)*100):0;
    return <><style>{KF}</style><WorldCompleteScreen world={world} totalXp={totalXp} accuracy={accuracy} onExit={onExit} accentColor={accentColor}/></>;
  }

  const mission=missions[currentIdx];

  return (
    <div style={S.container}>
      <style>{KF}</style>

      {}
      <div style={S.hud}>
        <div style={S.hudLeft}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>{world.icon}</span>
            <span style={{color:accentColor,fontWeight:700,fontSize:14,fontFamily:"'Space Grotesk',sans-serif"}}>{world.name}</span>
          </div>
          <div style={{display:"flex",gap:4,marginTop:4}}>
            {missions.map((_,i)=>(
              <div key={i} style={{width:26,height:4,borderRadius:2,background:i<currentIdx?accentColor:i===currentIdx?`${accentColor}70`:"rgba(255,255,255,0.07)",transition:"background 0.3s",boxShadow:i<currentIdx?`0 0 6px ${accentColor}80`:"none"}}/>
            ))}
          </div>
          <span style={{color:"#64748b",fontSize:11,marginTop:2}}>Mission {currentIdx+1} / {missions.length}</span>
        </div>

        <div style={S.questionBox}>
          <p style={S.questionText}>{mission?.question}</p>
        </div>

        <div style={S.hudRight}>
          {streak>=2&&<div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:16,padding:"4px 10px",fontSize:12,color:"#ef4444",fontWeight:700}}>🔥 {streak}×</div>}
          <div style={S.xpChip}><span style={{color:"#fbbf24"}}>⭐</span><span style={{color:"#f0f4ff",fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}><XpTicker value={totalXp}/> XP</span></div>
          <CountdownRing seconds={timeLeft} total={TIMER_SECONDS} color={accentColor}/>
          <button onClick={onExit} style={S.exitBtn}>✕</button>
        </div>
      </div>

      {showStreak&&<StreakBadge streak={streak}/>}

      {}
      <div style={S.canvas}>
        {isGeneric ? (
          <GenericQuiz
            mission={mission}
            onAnswer={(opt) => {
              const idx = mission.options.indexOf(opt);
              handleAnswer(opt, idx);
            }}
            answerStates={
              mission && answerStates
                ? Object.fromEntries(mission.options.map((o, i) => [o, answerStates[i] === "idle" ? null : answerStates[i]]))
                : {}
            }
            feedback={feedback}
            accentColor={accentColor}
          />
        ) : (
          <Suspense fallback={<div style={S.center}><div style={{...S.spinner,borderTopColor:accentColor}}/></div>}>
            <WorldComponent mission={mission} onAnswer={handleAnswer} answerStates={answerStates} feedback={feedback}/>
          </Suspense>
        )}
      </div>

      {answered&&(
        <div style={S.nextWrap}>
          <button onClick={handleNext}
            style={{...S.nextBtn,background:`linear-gradient(135deg,${accentColor},${accentColor}bb)`,boxShadow:`0 8px 30px ${accentColor}50`}}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            {currentIdx<missions.length-1?"Next Mission →":"Complete World 🏆"}
          </button>
        </div>
      )}

      {!answered&&<div style={S.hint}>🖱️ Click a cube to answer</div>}
    </div>
  );
}

const KF=`
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cardEntrance{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes streakPop{from{opacity:0;transform:translateX(-50%) scale(0.5)}to{opacity:1;transform:translateX(-50%) scale(1)}}
  @keyframes starPop{from{opacity:0;transform:scale(0) rotate(-30deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
`;

const S={
  container:{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:"#060912",fontFamily:"'Inter',sans-serif",position:"relative",overflow:"hidden"},
  center:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",background:"#060912",color:"#f0f4ff"},
  spinner:{width:40,height:40,border:"3px solid #1e2a4a",borderTop:"3px solid #00e5ff",borderRadius:"50%",animation:"spin 0.8s linear infinite"},
  hud:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",background:"rgba(6,9,18,0.96)",borderBottom:"1px solid rgba(255,255,255,0.05)",backdropFilter:"blur(16px)",zIndex:10,gap:12,flexShrink:0},
  hudLeft:{display:"flex",flexDirection:"column",gap:2,minWidth:180},
  questionBox:{flex:1,textAlign:"center",padding:"0 16px"},
  questionText:{color:"#f0f4ff",fontSize:14,fontWeight:600,lineHeight:1.5,margin:0},
  hudRight:{display:"flex",alignItems:"center",gap:10,flexShrink:0},
  xpChip:{display:"flex",alignItems:"center",gap:6,background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:16,padding:"5px 12px",fontSize:13},
  exitBtn:{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"#64748b",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:14},
  canvas:{flex:1,position:"relative",minHeight:0},
  nextWrap:{position:"absolute",bottom:90,left:"50%",transform:"translateX(-50%)",zIndex:20},
  nextBtn:{padding:"13px 36px",borderRadius:28,border:"none",color:"#060912",fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",transition:"transform 0.2s"},
  hint:{position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",color:"#64748b",fontSize:12,background:"rgba(6,9,18,0.85)",padding:"6px 18px",borderRadius:20,border:"1px solid rgba(255,255,255,0.05)",zIndex:10,whiteSpace:"nowrap"}
};
