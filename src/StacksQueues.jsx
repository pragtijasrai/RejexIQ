import { useState, useRef, useEffect } from "react";

const styles = `
.sq-root { font-family: var(--font-sans, sans-serif); }
.sq-wrap { max-width: 860px; margin: 0 auto; padding: 0 0 48px; }
.sq-nav { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 0 20px; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 24px; }
.sq-nb { padding: 6px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: all .15s; }
.sq-nb:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.sq-nb.on { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
@keyframes sqFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
.sq-sec { animation: sqFade .2s ease; }
.sq-tag { display: inline-block; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-bottom: 12px; font-weight: 500; }
.tag-blue   { background: var(--color-background-info);    color: var(--color-text-info); }
.tag-green  { background: var(--color-background-success); color: var(--color-text-success); }
.tag-amber  { background: var(--color-background-warning); color: var(--color-text-warning); }
.tag-red    { background: var(--color-background-danger);  color: var(--color-text-danger); }
.tag-purple { background: #f0ebff; color: #7B52E8; }
.sq-h2 { font-size: 20px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.sq-h3 { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin: 16px 0 8px; }
.sq-p  { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 8px; }
.sq-ul { padding-left: 18px; margin: 6px 0; }
.sq-ul li { font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 3px; }
.sq-viz { background: var(--color-background-secondary); border-radius: 12px; padding: 20px; margin: 14px 0; min-height: 80px; }
.sq-btn { padding: 7px 16px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); cursor: pointer; transition: all .15s; margin: 4px 2px; }
.sq-btn:hover { background: var(--color-background-secondary); }
.sq-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: transparent; }
.sq-btn.primary:hover { opacity: .85; }
.sq-btn:disabled { opacity: .4; cursor: default; }
.sq-inp { width: 80px; padding: 6px 10px; font-size: 13px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); }
.sq-code { background: var(--color-background-secondary); border-radius: 8px; padding: 12px 14px; margin: 10px 0; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; color: var(--color-text-primary); overflow-x: auto; border: 0.5px solid var(--color-border-tertiary); white-space: pre; }
.sq-tbl { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
.sq-tbl th { text-align: left; padding: 8px 10px; background: var(--color-background-secondary); color: var(--color-text-primary); font-weight: 500; }
.sq-tbl td { padding: 7px 10px; border-top: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); }
.sq-tbl tr:hover td { background: var(--color-background-secondary); }
.sq-info { border-left: 3px solid var(--color-border-info); padding: 10px 14px; margin: 10px 0; background: var(--color-background-info); border-radius: 0 8px 8px 0; }
.sq-info p { color: var(--color-text-info); font-size: 13px; }
.sq-warn { border-left: 3px solid var(--color-border-warning); padding: 10px 14px; margin: 10px 0; background: var(--color-background-warning); border-radius: 0 8px 8px 0; }
.sq-warn p { color: var(--color-text-warning); font-size: 13px; }
.sq-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
.sq-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 10px 0; }
.sq-card { background: var(--color-background-secondary); border-radius: 10px; padding: 12px; }
.sq-card h4 { font-size: 13px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
.sq-status { font-size: 13px; color: var(--color-text-secondary); margin-top: 8px; min-height: 20px; font-style: italic; }
.sq-quiz-opt { display: block; width: 100%; text-align: left; padding: 10px 14px; margin: 6px 0; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; transition: all .15s; font-family: var(--font-sans, sans-serif); }
.sq-quiz-opt:hover { background: var(--color-background-secondary); }
.sq-quiz-opt.correct { background: var(--color-background-success); border-color: var(--color-border-success); color: var(--color-text-success); }
.sq-quiz-opt.wrong   { background: var(--color-background-danger);  border-color: var(--color-border-danger);  color: var(--color-text-danger); }
@keyframes sqPop { 0%{transform:scale(0.7);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
.sq-pop { animation: sqPop .3s ease; }
@media(max-width:500px){ .sq-2col,.sq-3col{grid-template-columns:1fr;} }
`;

function StackViz({ items, topLabel = "TOP" }) {
  if (!items.length) return (
    <div style={{textAlign:"center",padding:"20px 0",color:"var(--color-text-tertiary)",fontSize:13,fontStyle:"italic"}}>
      Stack is empty
    </div>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 0"}}>
      {[...items].reverse().map((v, i) => (
        <div key={i} className={i === 0 ? "sq-pop" : ""}
          style={{
            width:120, padding:"10px 0", textAlign:"center", fontWeight:500, fontSize:14,
            borderRadius: i===0?"8px 8px 0 0":"0",
            background: i===0 ? "var(--color-background-warning)" : "var(--color-background-info)",
            color: i===0 ? "var(--color-text-warning)" : "var(--color-text-info)",
            border: "1.5px solid",
            borderColor: i===0 ? "var(--color-border-warning)" : "var(--color-border-info)",
            borderBottom: i===0 ? "1.5px solid" : "none",
            position:"relative"
          }}>
          {v}
          {i === 0 && <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",fontSize:10,opacity:.7}}>← {topLabel}</span>}
        </div>
      ))}
      <div style={{width:120,height:4,background:"var(--color-border-secondary)",borderRadius:"0 0 4px 4px"}} />
    </div>
  );
}

function QueueViz({ items }) {
  if (!items.length) return (
    <div style={{textAlign:"center",padding:"20px 0",color:"var(--color-text-tertiary)",fontSize:13,fontStyle:"italic"}}>
      Queue is empty
    </div>
  );
  return (
    <div style={{display:"flex",alignItems:"center",gap:0,padding:"8px 0",overflowX:"auto"}}>
      <span style={{fontSize:11,color:"var(--color-text-success)",marginRight:6,whiteSpace:"nowrap"}}>FRONT →</span>
      {items.map((v, i) => (
        <div key={i} className={i === items.length-1 ? "sq-pop" : ""}
          style={{
            padding:"10px 18px", fontWeight:500, fontSize:14, textAlign:"center",
            background: i===0 ? "var(--color-background-success)" : i===items.length-1 ? "var(--color-background-warning)" : "var(--color-background-info)",
            color: i===0 ? "var(--color-text-success)" : i===items.length-1 ? "var(--color-text-warning)" : "var(--color-text-info)",
            border:"1.5px solid",
            borderColor: i===0 ? "var(--color-border-success)" : i===items.length-1 ? "var(--color-border-warning)" : "var(--color-border-info)",
            borderRight: i < items.length-1 ? "none" : "1.5px solid",
            borderRadius: i===0?"8px 0 0 8px":i===items.length-1?"0 8px 8px 0":"0",
          }}>
          {v}
        </div>
      ))}
      <span style={{fontSize:11,color:"var(--color-text-warning)",marginLeft:6,whiteSpace:"nowrap"}}>← REAR</span>
    </div>
  );
}

function SecStackIntro() {
  const [stack, setStack] = useState([10, 20, 30]);
  const [val, setVal] = useState(40);
  const [status, setStatus] = useState("Stack has 3 elements. TOP = 30");

  function push() {
    const v = parseInt(val) || 0;
    if (stack.length >= 8) { setStatus("Stack Overflow! Maximum size reached."); return; }
    setStack([...stack, v]);
    setStatus(`PUSH ${v} → placed on TOP. Stack size = ${stack.length + 1}`);
  }
  function pop() {
    if (!stack.length) { setStatus("Stack Underflow! Cannot pop from empty stack."); return; }
    const v = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setStatus(`POP → removed ${v} from TOP. Stack size = ${stack.length - 1}`);
  }
  function peek() {
    if (!stack.length) { setStatus("Stack is empty — nothing to peek."); return; }
    setStatus(`PEEK → TOP element is ${stack[stack.length - 1]} (not removed)`);
  }

  return (
    <div className="sq-sec">
      <span className="sq-tag tag-blue">Chapter 1</span>
      <div className="sq-h2">Stack — LIFO Data Structure</div>
      <p className="sq-p">A stack is a linear data structure that follows the <strong>Last In, First Out (LIFO)</strong> principle. The last element inserted is the first one to be removed — like a stack of plates.</p>

      <div className="sq-2col">
        <div className="sq-card"><h4>🍽️ Real-world analogy</h4><ul className="sq-ul"><li>Stack of plates — add/remove from top only</li><li>Browser back button — last page visited is first to go back</li><li>Undo/Redo in editors</li><li>Function call stack in programs</li></ul></div>
        <div className="sq-card"><h4>⚡ Key operations</h4><ul className="sq-ul"><li><strong>push(x)</strong> — add x to top: O(1)</li><li><strong>pop()</strong> — remove from top: O(1)</li><li><strong>peek()</strong> — view top without removing: O(1)</li><li><strong>isEmpty()</strong> — check if empty: O(1)</li></ul></div>
      </div>

      <div className="sq-h3">Interactive Stack</div>
      <div className="sq-viz">
        <StackViz items={stack} />
        <div className="sq-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <input type="number" className="sq-inp" value={val} onChange={e=>setVal(e.target.value)} placeholder="value" />
        <button className="sq-btn primary" onClick={push}>Push</button>
        <button className="sq-btn" onClick={pop}>Pop</button>
        <button className="sq-btn" onClick={peek}>Peek</button>
        <button className="sq-btn" onClick={() => { setStack([]); setStatus("Stack cleared."); }}>Clear</button>
        <button className="sq-btn" onClick={() => { setStack([10,20,30]); setStatus("Stack reset."); }}>Reset</button>
      </div>

      <div className="sq-h3">Stack using Array (Java)</div>
      <div className="sq-code">{`class Stack {
  int[] arr;
  int top;
  int capacity;

  Stack(int size) {
    arr = new int[size];
    capacity = size;
    top = -1;          
  }

  void push(int x) {
    if (top == capacity - 1)
      throw new RuntimeException("Stack Overflow");
    arr[++top] = x;    
  }

  int pop() {
    if (top == -1)
      throw new RuntimeException("Stack Underflow");
    return arr[top--]; 
  }

  int peek() {
    if (top == -1) throw new RuntimeException("Empty");
    return arr[top];   
  }

  boolean isEmpty() { return top == -1; }
  int size()        { return top + 1; }
}`}</div>

      <div className="sq-h3">Stack using Linked List (Java)</div>
      <div className="sq-code">{`class StackLL {
  Node top = null;

  void push(int x) {
    Node node = new Node(x);
    node.next = top;   
    top = node;        
  }

  int pop() {
    if (top == null) throw new RuntimeException("Underflow");
    int val = top.data;
    top = top.next;    
    return val;
  }

  int peek() { return top.data; }
  boolean isEmpty() { return top == null; }
}

      <div className="sq-info"><p>KEY: Stack overflow occurs when you push onto a full array-based stack. Stack underflow occurs when you pop from an empty stack. Always check isEmpty() before pop/peek.</p></div>
    </div>
  );
}

function SecStackApps() {
  const [expr, setExpr] = useState("({[()]})");
  const [balResult, setBalResult] = useState("");
  const [infixExpr, setInfixExpr] = useState("A+B*C");
  const [postfixResult, setPostfixResult] = useState("");

  function checkBalanced() {
    const s = [];
    const open = "({[", close = ")}]";
    for (const ch of expr) {
      if (open.includes(ch)) { s.push(ch); }
      else if (close.includes(ch)) {
        const idx = close.indexOf(ch);
        if (!s.length || s[s.length-1] !== open[idx]) {
          setBalResult(`❌ NOT balanced — '${ch}' has no matching opening bracket`);
          return;
        }
        s.pop();
      }
    }
    setBalResult(s.length === 0 ? "✅ Balanced! All brackets match correctly." : `❌ NOT balanced — ${s.length} unclosed bracket(s): ${s.join(" ")}`);
  }

  function toPostfix() {
    const prec = { "+":1, "-":1, "*":2, "/":2, "^":3 };
    const stack = [], out = [];
    for (const ch of infixExpr.replace(/\s/g,"")) {
      if (/[A-Za-z0-9]/.test(ch)) { out.push(ch); }
      else if (ch === "(") { stack.push(ch); }
      else if (ch === ")") {
        while (stack.length && stack[stack.length-1] !== "(") out.push(stack.pop());
        stack.pop();
      } else if (prec[ch]) {
        while (stack.length && stack[stack.length-1] !== "(" && (prec[stack[stack.length-1]]||0) >= prec[ch])
          out.push(stack.pop());
        stack.push(ch);
      }
    }
    while (stack.length) out.push(stack.pop());
    setPostfixResult(`Postfix: ${out.join(" ")}`);
  }

  return (
    <div className="sq-sec">
      <span className="sq-tag tag-green">Chapter 2</span>
      <div className="sq-h2">Stack Applications</div>
      <p className="sq-p">Stacks are used in compilers, expression evaluation, backtracking, and function call management.</p>

      <div className="sq-h3">Application 1 — Balanced Brackets Checker</div>
      <p className="sq-p">Use a stack to check if brackets are balanced: push opening brackets, pop when closing bracket matches.</p>
      <div className="sq-viz">
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input className="sq-inp" style={{width:200}} value={expr} onChange={e=>setExpr(e.target.value)} placeholder="e.g. ({[]})" />
          <button className="sq-btn primary" onClick={checkBalanced}>Check</button>
        </div>
        <div className="sq-status" style={{marginTop:10,fontSize:14}}>{balResult}</div>
      </div>
      <div className="sq-code">{`boolean isBalanced(String s) {
  Stack<Character> stack = new Stack<>();
  for (char ch : s.toCharArray()) {
    if (ch=='(' || ch=='{' || ch=='[')
      stack.push(ch);
    else if (ch==')' || ch=='}' || ch==']') {
      if (stack.isEmpty()) return false;
      char top = stack.pop();
      if ((ch==')' && top!='(') ||
          (ch=='}' && top!='{') ||
          (ch==']' && top!='[')) return false;
    }
  }
  return stack.isEmpty(); 
}

      <div className="sq-h3">Application 2 — Infix to Postfix Conversion</div>
      <p className="sq-p">Operators are pushed onto a stack. Higher-precedence operators are applied first.</p>
      <div className="sq-viz">
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input className="sq-inp" style={{width:200}} value={infixExpr} onChange={e=>setInfixExpr(e.target.value)} placeholder="e.g. A+B*C" />
          <button className="sq-btn primary" onClick={toPostfix}>Convert</button>
        </div>
        <div className="sq-status" style={{marginTop:10,fontSize:14}}>{postfixResult}</div>
      </div>
      <div className="sq-code">{`

      <div className="sq-h3">Application 3 — Function Call Stack</div>
      <div className="sq-code">{`

      <div className="sq-h3">Application 4 — Reverse a String</div>
      <div className="sq-code">{`String reverse(String s) {
  Stack<Character> stack = new Stack<>();
  for (char c : s.toCharArray()) stack.push(c);
  StringBuilder sb = new StringBuilder();
  while (!stack.isEmpty()) sb.append(stack.pop());
  return sb.toString();
}

      <div className="sq-3col" style={{marginTop:12}}>
        <div className="sq-card"><h4>Undo/Redo</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>Two stacks: undo stack and redo stack. Each action pushes to undo. Ctrl+Z pops from undo, pushes to redo.</p></div>
        <div className="sq-card"><h4>Browser History</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>Back button = pop from history stack. Each new page visited = push to stack.</p></div>
        <div className="sq-card"><h4>DFS Traversal</h4><p style={{fontSize:12,color:"var(--color-text-secondary)"}}>Depth-First Search uses a stack (explicit or call stack) to explore as deep as possible before backtracking.</p></div>
      </div>
    </div>
  );
}

function SecQueueIntro() {
  const [queue, setQueue] = useState([10, 20, 30]);
  const [val, setVal] = useState(40);
  const [status, setStatus] = useState("Queue has 3 elements. FRONT=10, REAR=30");

  function enqueue() {
    const v = parseInt(val) || 0;
    if (queue.length >= 8) { setStatus("Queue is full!"); return; }
    setQueue([...queue, v]);
    setStatus(`ENQUEUE ${v} → added at REAR. Size = ${queue.length + 1}`);
  }
  function dequeue() {
    if (!queue.length) { setStatus("Queue is empty — cannot dequeue!"); return; }
    const v = queue[0];
    setQueue(queue.slice(1));
    setStatus(`DEQUEUE → removed ${v} from FRONT. Size = ${queue.length - 1}`);
  }
  function front() {
    if (!queue.length) { setStatus("Queue is empty."); return; }
    setStatus(`FRONT element = ${queue[0]} (not removed)`);
  }
  function rear() {
    if (!queue.length) { setStatus("Queue is empty."); return; }
    setStatus(`REAR element = ${queue[queue.length-1]} (not removed)`);
  }

  return (
    <div className="sq-sec">
      <span className="sq-tag tag-amber">Chapter 3</span>
      <div className="sq-h2">Queue — FIFO Data Structure</div>
      <p className="sq-p">A queue follows <strong>First In, First Out (FIFO)</strong> — the first element inserted is the first to be removed. Like a line at a ticket counter.</p>

      <div className="sq-2col">
        <div className="sq-card"><h4>🎟️ Real-world analogy</h4><ul className="sq-ul"><li>Ticket counter queue — first in line served first</li><li>Print spooler — jobs printed in order received</li><li>CPU scheduling (FCFS)</li><li>BFS graph traversal</li></ul></div>
        <div className="sq-card"><h4>⚡ Key operations</h4><ul className="sq-ul"><li><strong>enqueue(x)</strong> — add x at REAR: O(1)</li><li><strong>dequeue()</strong> — remove from FRONT: O(1)</li><li><strong>front()</strong> — peek at FRONT: O(1)</li><li><strong>rear()</strong> — peek at REAR: O(1)</li><li><strong>isEmpty()</strong> — check if empty: O(1)</li></ul></div>
      </div>

      <div className="sq-h3">Interactive Queue</div>
      <div className="sq-viz">
        <QueueViz items={queue} />
        <div className="sq-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <input type="number" className="sq-inp" value={val} onChange={e=>setVal(e.target.value)} placeholder="value" />
        <button className="sq-btn primary" onClick={enqueue}>Enqueue</button>
        <button className="sq-btn" onClick={dequeue}>Dequeue</button>
        <button className="sq-btn" onClick={front}>Front</button>
        <button className="sq-btn" onClick={rear}>Rear</button>
        <button className="sq-btn" onClick={() => { setQueue([]); setStatus("Queue cleared."); }}>Clear</button>
        <button className="sq-btn" onClick={() => { setQueue([10,20,30]); setStatus("Queue reset."); }}>Reset</button>
      </div>

      <div className="sq-h3">Queue using Array (Linear)</div>
      <div className="sq-code">{`class Queue {
  int[] arr;
  int front, rear, size, capacity;

  Queue(int cap) {
    arr = new int[cap];
    capacity = cap;
    front = 0; rear = -1; size = 0;
  }

  void enqueue(int x) {
    if (size == capacity) throw new RuntimeException("Queue Full");
    rear = (rear + 1) % capacity; 
    arr[rear] = x;
    size++;
  }

  int dequeue() {
    if (size == 0) throw new RuntimeException("Queue Empty");
    int val = arr[front];
    front = (front + 1) % capacity;
    size--;
    return val;
  }

  int front() { return arr[front]; }
  boolean isEmpty() { return size == 0; }
}

      <div className="sq-warn"><p>LINEAR QUEUE PROBLEM: In a simple array queue, after many enqueue/dequeue operations, front moves right and space at the beginning is wasted. Solution: use a circular queue with modulo arithmetic.</p></div>
    </div>
  );
}

function SecCircularQueue() {
  const SIZE = 6;
  const [arr, setArr] = useState(Array(SIZE).fill(null));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [count, setCount] = useState(0);
  const [val, setVal] = useState(10);
  const [status, setStatus] = useState("Circular queue initialized. Capacity = 6");

  function enqueue() {
    const v = parseInt(val) || 0;
    if (count === SIZE) { setStatus("Queue Full! (Overflow)"); return; }
    const newRear = (rear + 1) % SIZE;
    const newArr = [...arr];
    newArr[newRear] = v;
    setArr(newArr);
    setRear(newRear);
    if (front === -1) setFront(0);
    setCount(count + 1);
    setStatus(`Enqueued ${v} at index ${newRear}. front=${front===-1?0:front}, rear=${newRear}, size=${count+1}`);
  }

  function dequeue() {
    if (count === 0) { setStatus("Queue Empty! (Underflow)"); return; }
    const v = arr[front];
    const newArr = [...arr];
    newArr[front] = null;
    const newFront = count === 1 ? -1 : (front + 1) % SIZE;
    const newRear2 = count === 1 ? -1 : rear;
    setArr(newArr);
    setFront(newFront);
    setRear(newRear2);
    setCount(count - 1);
    setStatus(`Dequeued ${v} from index ${front}. front=${newFront}, rear=${newRear2}, size=${count-1}`);
  }

  function reset() {
    setArr(Array(SIZE).fill(null));
    setFront(-1); setRear(-1); setCount(0);
    setStatus("Circular queue reset.");
  }

  return (
    <div className="sq-sec">
      <span className="sq-tag tag-blue">Chapter 4</span>
      <div className="sq-h2">Circular Queue</div>
      <p className="sq-p">A circular queue connects the last position back to the first, eliminating wasted space from linear queues. Uses modulo arithmetic: <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"var(--color-background-secondary)",padding:"1px 5px",borderRadius:4}}>rear = (rear + 1) % capacity</code></p>

      <div className="sq-viz">
        <div style={{display:"flex",justifyContent:"center",margin:"10px 0"}}>
          <svg viewBox="0 0 300 300" style={{width:260,height:260}}>
            {Array.from({length:SIZE}).map((_,i) => {
              const angle = (2*Math.PI*i/SIZE) - Math.PI/2;
              const cx = 150 + 100*Math.cos(angle);
              const cy = 150 + 100*Math.sin(angle);
              const isFront = i === front;
              const isRear = i === rear;
              const filled = arr[i] !== null;
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="28"
                    fill={filled ? (isFront ? "var(--color-background-success)" : isRear ? "var(--color-background-warning)" : "var(--color-background-info)") : "var(--color-background-secondary)"}
                    stroke={filled ? (isFront ? "var(--color-border-success)" : isRear ? "var(--color-border-warning)" : "var(--color-border-info)") : "var(--color-border-tertiary)"}
                    strokeWidth="1.5"/>
                  <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="500"
                    fill={filled ? (isFront ? "var(--color-text-success)" : isRear ? "var(--color-text-warning)" : "var(--color-text-info)") : "var(--color-text-tertiary)"}>
                    {arr[i] !== null ? arr[i] : "—"}
                  </text>
                  <text x={cx} y={cy+22} textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)">[{i}]</text>
                  {isFront && <text x={cx} y={cy-34} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--color-text-success)">F</text>}
                  {isRear  && <text x={cx} y={cy-34} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--color-text-warning)">{isFront?"F/R":"R"}</text>}
                </g>
              );
            })}
            <text x="150" y="148" textAnchor="middle" fontSize="11" fill="var(--color-text-tertiary)">size={count}</text>
            <text x="150" y="162" textAnchor="middle" fontSize="11" fill="var(--color-text-tertiary)">cap={SIZE}</text>
          </svg>
        </div>
        <div className="sq-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <input type="number" className="sq-inp" value={val} onChange={e=>setVal(e.target.value)} />
        <button className="sq-btn primary" onClick={enqueue}>Enqueue</button>
        <button className="sq-btn" onClick={dequeue}>Dequeue</button>
        <button className="sq-btn" onClick={reset}>Reset</button>
      </div>

      <div className="sq-h3">Why Circular Queue?</div>
      <div className="sq-code">{`

      <div className="sq-info"><p>GREEN = FRONT (dequeue from here) | AMBER = REAR (enqueue here) | BLUE = filled slots. The circular structure reuses freed slots automatically.</p></div>
    </div>
  );
}

function SecDeque() {
  const [deque, setDeque] = useState([20, 30, 40]);
  const [val, setVal] = useState(10);
  const [status, setStatus] = useState("Deque initialized");

  return (
    <div className="sq-sec">
      <span className="sq-tag tag-purple">Chapter 5</span>
      <div className="sq-h2">Deque & Priority Queue</div>
      <p className="sq-p">A <strong>Deque</strong> (Double-Ended Queue) allows insertion and deletion at <em>both</em> ends. A <strong>Priority Queue</strong> serves elements by priority, not arrival order.</p>

      <div className="sq-h3">Interactive Deque</div>
      <div className="sq-viz">
        <div style={{display:"flex",alignItems:"center",gap:0,padding:"8px 0",overflowX:"auto"}}>
          <span style={{fontSize:11,color:"var(--color-text-info)",marginRight:6,whiteSpace:"nowrap"}}>FRONT</span>
          {deque.length === 0
            ? <span style={{fontSize:13,color:"var(--color-text-tertiary)",fontStyle:"italic",padding:"10px 20px"}}>Empty deque</span>
            : deque.map((v,i) => (
              <div key={i} style={{padding:"10px 18px",fontWeight:500,fontSize:14,
                background:"var(--color-background-info)",color:"var(--color-text-info)",
                border:"1.5px solid var(--color-border-info)",
                borderRight: i<deque.length-1?"none":"1.5px solid var(--color-border-info)",
                borderRadius: i===0?"8px 0 0 8px":i===deque.length-1?"0 8px 8px 0":"0"}}>
                {v}
              </div>
            ))
          }
          <span style={{fontSize:11,color:"var(--color-text-info)",marginLeft:6,whiteSpace:"nowrap"}}>REAR</span>
        </div>
        <div className="sq-status">{status}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <input type="number" className="sq-inp" value={val} onChange={e=>setVal(e.target.value)} />
        <button className="sq-btn primary" onClick={() => { const v=parseInt(val)||0; setDeque([v,...deque]); setStatus(`insertFront(${v})`); }}>Insert Front</button>
        <button className="sq-btn primary" onClick={() => { const v=parseInt(val)||0; setDeque([...deque,v]); setStatus(`insertRear(${v})`); }}>Insert Rear</button>
        <button className="sq-btn" onClick={() => { if(!deque.length)return; const v=deque[0]; setDeque(deque.slice(1)); setStatus(`deleteFront() → removed ${v}`); }}>Delete Front</button>
        <button className="sq-btn" onClick={() => { if(!deque.length)return; const v=deque[deque.length-1]; setDeque(deque.slice(0,-1)); setStatus(`deleteRear() → removed ${v}`); }}>Delete Rear</button>
        <button className="sq-btn" onClick={() => { setDeque([20,30,40]); setStatus("Reset"); }}>Reset</button>
      </div>

      <div className="sq-h3">Deque in Java</div>
      <div className="sq-code">{`import java.util.ArrayDeque;
Deque<Integer> dq = new ArrayDeque<>();

dq.addFirst(10);   
dq.addLast(20);    
dq.peekFirst();    
dq.peekLast();     
dq.pollFirst();    
dq.pollLast();     

      <div className="sq-h3">Priority Queue</div>
      <p className="sq-p">Elements are served based on <strong>priority</strong>, not insertion order. Internally implemented using a <strong>heap</strong>.</p>
      <div className="sq-code">{`import java.util.PriorityQueue;

PriorityQueue<Integer> minPQ = new PriorityQueue<>();
minPQ.add(30); minPQ.add(10); minPQ.add(20);
System.out.println(minPQ.poll()); 

PriorityQueue<Integer> maxPQ = new PriorityQueue<>(
    Collections.reverseOrder());
maxPQ.add(30); maxPQ.add(10); maxPQ.add(20);
System.out.println(maxPQ.poll()); 

PriorityQueue<String> pq = new PriorityQueue<>(
    Comparator.comparingInt(String::length));`}</div>

      <div className="sq-2col" style={{marginTop:12}}>
        <div className="sq-card"><h4>Deque use cases</h4><ul className="sq-ul"><li>Sliding window maximum (monotonic deque)</li><li>Palindrome checking</li><li>Undo/Redo with history limit</li><li>Work-stealing schedulers</li></ul></div>
        <div className="sq-card"><h4>Priority Queue use cases</h4><ul className="sq-ul"><li>Dijkstra's shortest path</li><li>Huffman encoding</li><li>Task scheduling by priority</li><li>Merge K sorted lists</li></ul></div>
      </div>
    </div>
  );
}

function SecComparison() {
  return (
    <div className="sq-sec">
      <span className="sq-tag tag-red">Chapter 6</span>
      <div className="sq-h2">Stack vs Queue — Full Comparison</div>

      <table className="sq-tbl">
        <thead><tr><th>Feature</th><th>Stack</th><th>Queue</th><th>Deque</th></tr></thead>
        <tbody>
          <tr><td>Principle</td><td>LIFO</td><td>FIFO</td><td>Both ends</td></tr>
          <tr><td>Insert</td><td>push() at TOP</td><td>enqueue() at REAR</td><td>addFirst() / addLast()</td></tr>
          <tr><td>Remove</td><td>pop() from TOP</td><td>dequeue() from FRONT</td><td>pollFirst() / pollLast()</td></tr>
          <tr><td>Peek</td><td>peek() at TOP</td><td>front() / rear()</td><td>peekFirst() / peekLast()</td></tr>
          <tr><td>All ops time</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td style={{color:"var(--color-text-success)"}}>O(1)</td></tr>
          <tr><td>Java class</td><td>Stack / Deque</td><td>Queue / LinkedList</td><td>ArrayDeque</td></tr>
          <tr><td>Use case</td><td>DFS, undo, parsing</td><td>BFS, scheduling</td><td>Sliding window</td></tr>
        </tbody>
      </table>

      <div className="sq-h3">Java Collections Hierarchy</div>
      <div className="sq-code">{`
Stack<Integer> stack = new Stack<>();
stack.push(1); stack.pop(); stack.peek();

Queue<Integer> queue = new LinkedList<>();
queue.offer(1);  
queue.poll();    
queue.peek();    

Deque<Integer> stack2 = new ArrayDeque<>();
stack2.push(1);  
stack2.pop();    
stack2.peek();   

Deque<Integer> queue2 = new ArrayDeque<>();
queue2.offer(1); 
queue2.poll();   
queue2.peek();   

      <div className="sq-h3">Implementation Comparison</div>
      <table className="sq-tbl">
        <thead><tr><th>Implementation</th><th>Push/Enqueue</th><th>Pop/Dequeue</th><th>Space</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Array (fixed)</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td>O(n)</td><td>Fixed capacity, fast cache</td></tr>
          <tr><td>Array (dynamic)</td><td style={{color:"var(--color-text-success)"}}>O(1) amortized</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td>O(n)</td><td>Doubles when full</td></tr>
          <tr><td>Linked List</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td style={{color:"var(--color-text-success)"}}>O(1)</td><td>O(n)</td><td>No overflow, extra pointer</td></tr>
        </tbody>
      </table>

      <div className="sq-h3">Common Interview Problems</div>
      <div className="sq-code">{`
class QueueUsing2Stacks {
  Stack<Integer> s1 = new Stack<>(), s2 = new Stack<>();
  void enqueue(int x) { s1.push(x); }
  int dequeue() {
    if (s2.isEmpty())
      while (!s1.isEmpty()) s2.push(s1.pop()); 
    return s2.pop();
  }
}

class MinStack {
  Stack<Integer> stack = new Stack<>(), minStack = new Stack<>();
  void push(int x) {
    stack.push(x);
    if (minStack.isEmpty() || x <= minStack.peek())
      minStack.push(x);
  }
  int pop() {
    int val = stack.pop();
    if (val == minStack.peek()) minStack.pop();
    return val;
  }
  int getMin() { return minStack.peek(); } 
}`}</div>

      <div className="sq-info"><p>EXAM TIP: "Implement Queue using 2 Stacks" and "Min Stack" are among the most frequently asked stack/queue interview questions. Master both.</p></div>
    </div>
  );
}

const QUESTIONS = [
  { q:"What does LIFO stand for?", opts:["Last In First Out","Last Index First Out","Linear In First Out","Last In Final Out"], ans:0 },
  { q:"Which operation adds an element to a stack?", opts:["enqueue","insert","push","append"], ans:2 },
  { q:"What is the time complexity of push and pop in a stack?", opts:["O(n)","O(log n)","O(1)","O(n²)"], ans:2 },
  { q:"In a queue, where is an element inserted?", opts:["Front","Rear","Middle","Top"], ans:1 },
  { q:"What problem does a circular queue solve?", opts:["Stack overflow","Wasted space in linear queue","Slow enqueue","Memory leak"], ans:1 },
  { q:"Which data structure is used for BFS traversal?", opts:["Stack","Queue","Tree","Heap"], ans:1 },
  { q:"Which data structure is used for DFS traversal?", opts:["Queue","Stack","Array","Linked List"], ans:1 },
  { q:"What does peek() do in a stack?", opts:["Removes top element","Returns top without removing","Adds element","Clears stack"], ans:1 },
  { q:"A Deque allows insertion and deletion at:", opts:["Only front","Only rear","Both front and rear","Only middle"], ans:2 },
  { q:"In a Priority Queue (min-heap), poll() returns:", opts:["Last inserted","Largest element","Smallest element","Random element"], ans:2 },
];

function SecQuiz() {
  const [answered, setAnswered] = useState(new Array(QUESTIONS.length).fill(null));
  const [done, setDone] = useState(false);

  function answer(qi, oi) {
    if (answered[qi] !== null) return;
    const next = [...answered]; next[qi] = oi;
    setAnswered(next);
    if (next.every(a => a !== null)) setDone(true);
  }
  function reset() { setAnswered(new Array(QUESTIONS.length).fill(null)); setDone(false); }
  const score = answered.filter((a,i) => a === QUESTIONS[i].ans).length;

  return (
    <div className="sq-sec">
      <span className="sq-tag tag-blue">Chapter 7</span>
      <div className="sq-h2">Quiz — Stacks & Queues</div>
      <p className="sq-p" style={{marginBottom:14}}>Test your understanding across all chapters.</p>

      {QUESTIONS.map((q, qi) => (
        <div key={qi} style={{marginBottom:20,padding:16,background:"var(--color-background-secondary)",borderRadius:12}}>
          <p style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>{qi+1}. {q.q}</p>
          {q.opts.map((opt, oi) => {
            let cls = "sq-quiz-opt";
            if (answered[qi] !== null) {
              if (oi === q.ans) cls += " correct";
              else if (oi === answered[qi]) cls += " wrong";
            }
            return <button key={oi} className={cls} disabled={answered[qi]!==null} onClick={() => answer(qi,oi)}>{opt}</button>;
          })}
        </div>
      ))}

      {done && (
        <div style={{marginTop:16,padding:16,background:"var(--color-background-secondary)",borderRadius:12}}>
          <p style={{fontSize:14,color:"var(--color-text-secondary)",marginBottom:4}}>Your score</p>
          <div style={{fontSize:24,fontWeight:500,color:"var(--color-text-primary)"}}>{score} / {QUESTIONS.length}</div>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",marginTop:6}}>
            {score===QUESTIONS.length?"Perfect! 🎉":score>=7?"Great job!":"Keep reviewing the chapters."}
          </p>
          <button className="sq-btn" style={{marginTop:12}} onClick={reset}>Retry</button>
        </div>
      )}
    </div>
  );
}

const CHAPTERS = [
  { id:"stack",    label:"1. Stack" },
  { id:"stackapp", label:"2. Stack Apps" },
  { id:"queue",    label:"3. Queue" },
  { id:"circular", label:"4. Circular Queue" },
  { id:"deque",    label:"5. Deque & PQ" },
  { id:"compare",  label:"6. Comparison" },
  { id:"quiz",     label:"7. Quiz" },
];

export default function StacksQueues({ onPrev, onNext, _startAt, onChapterChange }) {
  const [active, setActive] = useState(_startAt || "stack");
  const curIdx = CHAPTERS.findIndex(c => c.id === active);
  useEffect(() => { onChapterChange?.(curIdx, CHAPTERS.length); }, [active]);

  function switchTab(id) {
    const newIdx = CHAPTERS.findIndex(c => c.id === id);
    onChapterChange?.(newIdx, CHAPTERS.length);
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="sq-root">
      <style>{styles}</style>
      <div className="sq-wrap">
        <div className="sq-nav">
          {CHAPTERS.map(ch => (
            <button key={ch.id} className={`sq-nb${active===ch.id?" on":""}`} onClick={() => switchTab(ch.id)}>
              {ch.label}
            </button>
          ))}
        </div>

        {active === "stack"    && <SecStackIntro />}
        {active === "stackapp" && <SecStackApps />}
        {active === "queue"    && <SecQueueIntro />}
        {active === "circular" && <SecCircularQueue />}
        {active === "deque"    && <SecDeque />}
        {active === "compare"  && <SecComparison />}
        {active === "quiz"     && <SecQuiz />}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:48,paddingTop:24,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
          {curIdx > 0 ? (
            <button className="sq-btn primary" onClick={() => switchTab(CHAPTERS[curIdx-1].id)}>
              ← {CHAPTERS[curIdx-1].label}
            </button>
          ) : onPrev ? (
            <button className="sq-btn primary" onClick={onPrev}>← Linked Lists</button>
          ) : <div />}

          <div style={{display:"flex",gap:6}}>
            {CHAPTERS.map(ch => (
              <div key={ch.id} onClick={() => switchTab(ch.id)}
                style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",transition:"background .2s",
                  background: active===ch.id ? "var(--color-text-primary)" : "var(--color-border-secondary)"}} />
            ))}
          </div>

          {curIdx < CHAPTERS.length-1 ? (
            <button className="sq-btn primary" onClick={() => switchTab(CHAPTERS[curIdx+1].id)}>
              {CHAPTERS[curIdx+1].label} →
            </button>
          ) : onNext ? (
            <button className="sq-btn primary" onClick={onNext}>Next Chapter →</button>
          ) : (
            <div style={{fontSize:13,color:"var(--color-text-secondary)",fontStyle:"italic"}}>✓ All chapters complete</div>
          )}
        </div>
      </div>
    </div>
  );
}
