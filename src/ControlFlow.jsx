import { useState, useEffect } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --java-orange:#E76F00; --java-blue:#0A7EA4; --java-green:#2D9E5F;
  --java-purple:#7B52E8; --java-red:#D04040;
  --java-bg:var(--color-background-secondary); --java-card:var(--color-background-primary);
  --java-border:var(--color-border-tertiary); --java-text:var(--color-text-primary);
  --java-muted:var(--color-text-secondary);
  --code-bg:#1a1a2e; --code-kw:#ff9d00; --code-str:#7ec8e3;
  --code-num:#a8ff78; --code-cmt:#6a7f8f; --code-fn:#e0aaff; --code-var:#ffffff;
}
.cf-root { font-family:'DM Sans',sans-serif; background:transparent; }
.cf-wrap { max-width:860px; margin:0 auto; padding:0 0 40px; }
.cf-nav { display:flex; gap:6px; flex-wrap:wrap; padding:16px 0 20px; border-bottom:0.5px solid var(--java-border); margin-bottom:24px; }
.cf-nb { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; padding:6px 14px; border-radius:20px; border:0.5px solid var(--java-border); background:var(--java-bg); color:var(--java-muted); cursor:pointer; transition:all .2s; }
.cf-nb:hover { background:var(--java-card); color:var(--java-text); }
.cf-nb.on { background:var(--java-orange); border-color:var(--java-orange); color:#fff; }
@keyframes cfFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.cf-sec { animation:cfFade .3s ease; }
.cf-tag { display:inline-block; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:3px 10px; border-radius:4px; margin-bottom:10px; }
.tag-orange{background:#fff3e0;color:var(--java-orange)} .tag-blue{background:#e3f4fb;color:var(--java-blue)}
.tag-green{background:#e6f9ee;color:var(--java-green)} .tag-purple{background:#f0ebff;color:var(--java-purple)}
.tag-red{background:#fde8e8;color:var(--java-red)}
.cf-title { font-size:26px; font-weight:700; color:var(--java-text); margin-bottom:8px; }
.cf-desc { font-size:15px; color:var(--java-muted); line-height:1.7; max-width:680px; margin-bottom:24px; }
.cf-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:24px 0; }
.cf-card { background:var(--java-card); border:0.5px solid var(--java-border); border-radius:12px; padding:20px; transition:border-color .2s; }
.cf-card:hover { border-color:var(--color-border-secondary); }
.cf-card .icon { font-size:22px; margin-bottom:10px; }
.cf-card .ctitle { font-size:15px; font-weight:700; color:var(--java-text); margin-bottom:6px; }
.cf-card .cbody { font-size:13px; color:var(--java-muted); line-height:1.65; }
.acc-orange{border-left:3px solid var(--java-orange)} .acc-blue{border-left:3px solid var(--java-blue)}
.acc-green{border-left:3px solid var(--java-green)} .acc-purple{border-left:3px solid var(--java-purple)}
.acc-red{border-left:3px solid var(--java-red)}
.cf-code { background:var(--code-bg); border-radius:12px; overflow:hidden; margin:20px 0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.8; }
.cf-code-hd { display:flex; align-items:center; gap:8px; padding:10px 16px; background:rgba(255,255,255,0.04); border-bottom:0.5px solid rgba(255,255,255,0.08); }
.cf-dot { width:10px; height:10px; border-radius:50%; }
.cf-lbl { font-family:'DM Sans',sans-serif; font-size:12px; color:#6a7f8f; margin-left:auto; }
.cf-code pre { padding:16px 20px; overflow-x:auto; color:var(--code-var); white-space:pre; }
.kw{color:var(--code-kw);font-weight:500} .str{color:var(--code-str)} .num{color:var(--code-num)}
.cmt{color:var(--code-cmt);font-style:italic} .fn{color:var(--code-fn)}
.cf-tbl { width:100%; border-collapse:collapse; margin:20px 0; font-size:13px; }
.cf-tbl th { background:var(--java-bg); color:var(--java-text); font-weight:600; padding:10px 14px; text-align:left; border-bottom:1.5px solid var(--java-border); }
.cf-tbl td { padding:10px 14px; border-bottom:0.5px solid var(--java-border); color:var(--java-text); vertical-align:top; }
.cf-tbl tr:last-child td { border-bottom:none; }
.cf-tbl tr:hover td { background:var(--java-bg); }
.bdg { display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600; }
.bdg-orange{background:#fff3e0;color:var(--java-orange)} .bdg-green{background:#e6f9ee;color:var(--java-green)}
.bdg-blue{background:#e3f4fb;color:var(--java-blue)} .bdg-red{background:#fde8e8;color:var(--java-red)}
.cf-alert { border-radius:10px; padding:14px 18px; margin:16px 0; font-size:14px; line-height:1.65; }
.al-orange{background:#fff8ed;border-left:4px solid var(--java-orange);color:#7a4800}
.al-blue{background:#e8f5fc;border-left:4px solid var(--java-blue);color:#0a4d65}
.al-green{background:#edfaf3;border-left:4px solid var(--java-green);color:#1a5c3a}
.al-red{background:#fdf0f0;border-left:4px solid var(--java-red);color:#6b1f1f}
.cf-fw { background:var(--java-card); border:0.5px solid var(--java-border); border-radius:12px; padding:24px; margin:20px 0; }
.cf-fw h3 { font-size:16px; font-weight:700; color:var(--java-text); margin-bottom:12px; }
.syn-row { display:flex; align-items:flex-start; gap:12px; margin:12px 0; }
.syn-n { min-width:24px; height:24px; border-radius:50%; background:var(--java-orange); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; }
.syn-t { font-size:14px; color:var(--java-text); line-height:1.65; }
.syn-t code { font-family:'JetBrains Mono',monospace; font-size:12px; background:var(--java-bg); padding:2px 6px; border-radius:4px; color:var(--java-orange); }
.pat-sec { background:var(--java-card); border:0.5px solid var(--java-border); border-radius:12px; padding:20px; margin:16px 0; }
.pat-title { font-size:15px; font-weight:700; color:var(--java-text); margin-bottom:4px; }
.pat-sub { font-size:12px; color:var(--java-muted); margin-bottom:12px; }
.pat-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.pat-out { font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.6; color:#a8ff78; background:var(--code-bg); border-radius:8px; padding:12px 16px; white-space:pre; overflow-x:auto; }
.demo-ctrl { background:var(--java-bg); border-radius:10px; padding:16px; margin:16px 0; display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end; }
.demo-lbl { font-size:13px; color:var(--java-muted); font-weight:500; margin-bottom:4px; }
.demo-inp { font-family:'JetBrains Mono',monospace; font-size:13px; padding:6px 10px; border-radius:6px; border:0.5px solid var(--java-border); background:var(--java-card); color:var(--java-text); width:70px; }
.demo-sel { font-family:'DM Sans',sans-serif; font-size:13px; padding:6px 10px; border-radius:6px; border:0.5px solid var(--java-border); background:var(--java-card); color:var(--java-text); }
.demo-btn { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; padding:7px 18px; border-radius:8px; border:none; background:var(--java-orange); color:#fff; cursor:pointer; transition:opacity .2s; }
.demo-btn:hover { opacity:.85; }
.demo-out { font-family:'JetBrains Mono',monospace; font-size:12px; background:var(--code-bg); border-radius:10px; padding:14px 16px; color:#a8ff78; line-height:1.7; min-height:60px; max-height:280px; overflow-y:auto; margin-top:10px; white-space:pre-wrap; }
.divider { height:0.5px; background:var(--java-border); margin:28px 0; }
@media(max-width:640px){ .cf-grid2,.pat-grid{grid-template-columns:1fr;} }
`;

function CodeBlock({ label, children }) {
  return (
    <div className="cf-code">
      <div className="cf-code-hd">
        <div className="cf-dot" style={{background:"#ff5f57"}} />
        <div className="cf-dot" style={{background:"#ffbd2e"}} />
        <div className="cf-dot" style={{background:"#28c840"}} />
        <span className="cf-lbl">{label}</span>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

// ── Chapter 1: Decision Constructs ──
function SecDecision() {
  return (
    <div className="cf-sec">
      <div className="cf-tag tag-orange">Chapter 1</div>
      <div className="cf-title">Decision Constructs</div>
      <div className="cf-desc">Decision constructs let your program choose a path based on conditions. Java has <strong>if, if-else, if-else if ladder, nested if,</strong> and <strong>switch</strong> — each with specific use cases.</div>

      <div className="cf-grid2">
        <div className="cf-card acc-orange"><div className="icon">🔀</div><div className="ctitle">if statement</div><div className="cbody">Executes a block only when the condition is <code>true</code>. If false, the block is skipped entirely. The simplest form of branching.</div></div>
        <div className="cf-card acc-blue"><div className="icon">⚖️</div><div className="ctitle">if-else</div><div className="cbody">Provides a two-way fork. One block runs when condition is true, the other when false. Exactly one of the two blocks always executes.</div></div>
        <div className="cf-card acc-green"><div className="icon">📊</div><div className="ctitle">if-else if ladder</div><div className="cbody">Multiple mutually exclusive conditions checked top-to-bottom. First true condition wins. An optional trailing <code>else</code> is the default.</div></div>
        <div className="cf-card acc-purple"><div className="icon">🎛️</div><div className="ctitle">switch statement</div><div className="cbody">Multi-way branch on an integer, char, String or enum. Each <code>case</code> is a label; <code>break</code> exits. Without break, execution <em>falls through</em> to the next case.</div></div>
      </div>

      <CodeBlock label="if / if-else / ladder / nested if">{`// 1. Simple if
int age = 20;
if (age >= 18) {
  System.out.println("Adult");           // prints because 20 >= 18
}

// 2. if-else
int num = -5;
if (num >= 0) {
  System.out.println("Positive");
} else {
  System.out.println("Negative");        // executes
}

// 3. if-else if ladder
int marks = 75;
if      (marks >= 90) System.out.println("A+");
else if (marks >= 80) System.out.println("A");
else if (marks >= 70) System.out.println("B");  // executes (75 falls here)
else if (marks >= 60) System.out.println("C");
else                  System.out.println("Fail");

// 4. Nested if
int x = 15;
if (x > 0) {
  if (x % 2 == 0) System.out.println("Positive Even");
  else             System.out.println("Positive Odd");  // executes
}`}</CodeBlock>

      <CodeBlock label="switch — classic & enhanced (Java 14+)">{`// Classic switch with fall-through danger
int day = 3;
switch (day) {
  case 1: System.out.println("Monday");    break;
  case 2: System.out.println("Tuesday");   break;
  case 3: System.out.println("Wednesday"); break;  // executes
  default: System.out.println("Weekend");
}

// Fall-through intentionally used (group multiple cases)
switch (day) {
  case 1: case 2: case 3: case 4: case 5:
    System.out.println("Weekday"); break;
  case 6: case 7:
    System.out.println("Weekend");
}

// Enhanced switch expression (Java 14+) — no break needed
String result = switch (day) {
  case 1, 2, 3, 4, 5 -> "Weekday";
  case 6, 7           -> "Weekend";
  default             -> "Invalid";
};
System.out.println(result);`}</CodeBlock>

      <table className="cf-tbl">
        <thead><tr><th>Construct</th><th>Use when</th><th>Condition type</th><th>Fall-through?</th></tr></thead>
        <tbody>
          <tr><td><code>if</code></td><td>Single optional action</td><td>Any boolean</td><td><span className="bdg bdg-green">N/A</span></td></tr>
          <tr><td><code>if-else</code></td><td>Two mutually exclusive paths</td><td>Any boolean</td><td><span className="bdg bdg-green">N/A</span></td></tr>
          <tr><td><code>if-else if</code></td><td>Range checks / complex logic</td><td>Any boolean</td><td><span className="bdg bdg-green">N/A</span></td></tr>
          <tr><td><code>switch</code></td><td>Exact value matching</td><td>int, char, String, enum</td><td><span className="bdg bdg-red">Yes (dangerous!)</span></td></tr>
          <tr><td><code>switch expr</code></td><td>Clean value matching</td><td>Same as switch</td><td><span className="bdg bdg-green">No</span></td></tr>
        </tbody>
      </table>

      <div className="cf-alert al-orange"><strong>⚠️ Fall-through trap:</strong> In a classic <code>switch</code>, if you forget <code>break</code>, execution continues into the next <code>case</code>! This is one of the most common Java bugs for beginners. Always add <code>break</code> unless you intentionally want fall-through.</div>
      <div className="cf-alert al-blue"><strong>💡 Ternary operator — inline if-else:</strong><br/><code>int max = (a &gt; b) ? a : b;</code><br/>Equivalent to a 2-line if-else but in a single expression. Use for simple assignments. Never nest ternaries — it destroys readability.</div>
    </div>
  );
}

// ── Chapter 2: Loop Constructs ──
function SecLoops() {
  return (
    <div className="cf-sec">
      <div className="cf-tag tag-blue">Chapter 2</div>
      <div className="cf-title">Loop Constructs</div>
      <div className="cf-desc">Loops repeat a block of code. Java provides <strong>for, while, do-while,</strong> and <strong>enhanced for-each</strong>. Choosing the right loop is about knowing when you know the iteration count.</div>

      <div className="cf-grid2">
        <div className="cf-card acc-blue"><div className="icon">🔢</div><div className="ctitle">for loop</div><div className="cbody">Use when the number of iterations is known. Has initialization, condition, and update in one line. Counter variable scoped to the loop.</div></div>
        <div className="cf-card acc-orange"><div className="icon">❓</div><div className="ctitle">while loop</div><div className="cbody">Use when iterations depend on a condition. Checks condition <em>before</em> executing. May execute 0 times if condition is false initially.</div></div>
        <div className="cf-card acc-green"><div className="icon">✅</div><div className="ctitle">do-while loop</div><div className="cbody">Like while, but checks condition <em>after</em> executing. Guaranteed to run at least once. Ideal for input validation and menus.</div></div>
        <div className="cf-card acc-purple"><div className="icon">📋</div><div className="ctitle">for-each loop</div><div className="cbody">Syntactic sugar for iterating over arrays or collections. No index, cleaner syntax, but cannot modify elements or iterate in reverse.</div></div>
      </div>

      <CodeBlock label="All 4 loop types with deep notes">{`// ===== for loop anatomy =====
// for (init; condition; update) { body }
// init   → runs once at start
// cond   → checked before every iteration
// update → runs after every iteration
for (int i = 1; i <= 5; i++) {
  System.out.print(i + " ");    // 1 2 3 4 5
}

// Step by 2, or count backwards
for (int i = 10; i >= 1; i -= 2) {
  System.out.print(i + " ");    // 10 8 6 4 2
}

// ===== while loop =====
int i = 1;
while (i <= 5) {
  System.out.print(i + " ");    // 1 2 3 4 5
  i++;                           // MUST update, else infinite loop!
}

// while(true) with break — useful pattern
int n = 1;
while (true) {
  System.out.print(n + " ");
  n++;
  if (n > 5) break;              // exit when done
}

// ===== do-while loop =====
// body runs FIRST, condition checked AFTER
int x = 1;
do {
  System.out.print(x + " ");    // runs at least once
  x++;
} while (x <= 5);                // Note the semicolon!

// do-while with false condition still runs once
int k = 100;
do {
  System.out.println("Runs once!"); // prints even though k > 5
} while (k <= 5);

// ===== for-each loop =====
// for (type element : arrayOrCollection)
int[] arr = {10, 20, 30, 40};
for (int val : arr) {
  System.out.print(val + " ");   // 10 20 30 40
}

String[] fruits = {"Apple", "Mango", "Banana"};
for (String fruit : fruits) {
  System.out.println(fruit);
}`}</CodeBlock>

      <table className="cf-tbl">
        <thead><tr><th>Loop</th><th>Check</th><th>Min Executions</th><th>Best for</th></tr></thead>
        <tbody>
          <tr><td><code>for</code></td><td>Before</td><td>0</td><td>Known count, index needed</td></tr>
          <tr><td><code>while</code></td><td>Before</td><td>0</td><td>Unknown count, condition-driven</td></tr>
          <tr><td><code>do-while</code></td><td>After</td><td><strong>1</strong></td><td>Must run at least once (menus, validation)</td></tr>
          <tr><td><code>for-each</code></td><td>Before</td><td>0</td><td>Iterating collections/arrays cleanly</td></tr>
        </tbody>
      </table>

      <div className="cf-alert al-green"><strong>🔁 Infinite loop patterns (used deliberately):</strong><br/><code>for(;;) {"{ }"}</code> — "forever for loop"<br/><code>while(true) {"{ }"}</code> — clearest intentional infinite loop<br/>Always paired with a <code>break</code> condition or <code>return</code> inside.</div>
    </div>
  );
}

// ── Chapter 3: Jump Statements ──
function SecJump() {
  return (
    <div className="cf-sec">
      <div className="cf-tag tag-red">Chapter 3</div>
      <div className="cf-title">Jump Statements</div>
      <div className="cf-desc">Jump statements transfer control to a different point. Java has <strong>break</strong>, <strong>continue</strong>, and <strong>return</strong>. Mastering them prevents redundant loops and enables elegant exit strategies.</div>

      <div className="cf-grid2">
        <div className="cf-card acc-red"><div className="icon">🛑</div><div className="ctitle">break</div><div className="cbody">Exits the <em>innermost</em> enclosing loop or switch immediately. With a label, can break outer loops too. Execution continues after the loop body.</div></div>
        <div className="cf-card acc-blue"><div className="icon">⏭️</div><div className="ctitle">continue</div><div className="cbody">Skips the <em>rest of the current iteration</em> and jumps to the next one. The loop itself keeps running — only that one pass is cut short.</div></div>
        <div className="cf-card acc-green"><div className="icon">↩️</div><div className="ctitle">return</div><div className="cbody">Exits the entire method. Can optionally carry a value back to the caller. Also terminates any loop the method happens to be in.</div></div>
      </div>

      <CodeBlock label="break — simple, labeled, and in switch">{`// break exits the innermost loop
for (int i = 1; i <= 10; i++) {
  if (i == 5) break;           // stops at 5
  System.out.print(i + " ");   // prints: 1 2 3 4
}

// Labeled break — escape nested loops
outer:                           // label for outer loop
for (int i = 1; i <= 3; i++) {
  for (int j = 1; j <= 3; j++) {
    if (i == 2 && j == 2) break outer; // exits BOTH loops
    System.out.println(i + "," + j);
  }
}
// Prints: 1,1  1,2  1,3  2,1  (stops at 2,2)`}</CodeBlock>

      <CodeBlock label="continue — with and without label">{`// continue skips the rest of THIS iteration
for (int i = 1; i <= 10; i++) {
  if (i % 2 == 0) continue;    // skip even numbers
  System.out.print(i + " ");   // prints: 1 3 5 7 9
}

// continue with label — skip to outer loop's next iteration
outer:
for (int i = 1; i <= 3; i++) {
  for (int j = 1; j <= 3; j++) {
    if (j == 2) continue outer; // skip j=2,3 for each i
    System.out.println(i + "," + j);
  }
}
// Prints: 1,1   2,1   3,1   (j=2 skips rest of inner loop)`}</CodeBlock>

      <CodeBlock label="return — exiting methods from within loops">{`// return exits the entire method
static boolean isPrime(int n) {
  if (n < 2) return false;          // early exit
  for (int i = 2; i * i <= n; i++) {
    if (n % i == 0) return false;   // exit as soon as found
  }
  return true;                       // only reaches here if prime
}

// void return — just exits method
static void printUntilNeg(int[] arr) {
  for (int val : arr) {
    if (val < 0) return;            // stop processing
    System.out.println(val);
  }
}`}</CodeBlock>

      <div className="cf-fw">
        <h3>break vs continue vs return — at a glance</h3>
        <table className="cf-tbl" style={{margin:0}}>
          <thead><tr><th>Statement</th><th>Exits</th><th>Loop continues?</th><th>Method continues?</th></tr></thead>
          <tbody>
            <tr><td><code>break</code></td><td>Innermost loop/switch</td><td>No (that loop ends)</td><td>Yes</td></tr>
            <tr><td><code>break label</code></td><td>Labeled loop</td><td>No (labeled loop ends)</td><td>Yes</td></tr>
            <tr><td><code>continue</code></td><td>Current iteration only</td><td>Yes (next iteration)</td><td>Yes</td></tr>
            <tr><td><code>continue label</code></td><td>Current iteration, jumps to outer</td><td>Yes (outer loop next)</td><td>Yes</td></tr>
            <tr><td><code>return</code></td><td>Entire method</td><td>No</td><td>No</td></tr>
          </tbody>
        </table>
      </div>
      <div className="cf-alert al-blue"><strong>💡 Pro tip — avoid labels when possible.</strong> Labeled break/continue is valid Java but can hurt readability. Often, extracting the inner loop into a separate method + using <code>return</code> is cleaner.</div>
    </div>
  );
}

// ── Chapter 4: Nested Loops ──
function SecNested() {
  return (
    <div className="cf-sec">
      <div className="cf-tag tag-purple">Chapter 4</div>
      <div className="cf-title">Nested Loops</div>
      <div className="cf-desc">A loop inside another loop. The inner loop completes <em>all its iterations</em> for each single iteration of the outer loop. Total iterations = outer_count × inner_count.</div>

      <div className="cf-alert al-blue"><strong>Mental model:</strong> Think of a clock. The seconds hand (inner loop) completes 60 rotations for every 1 rotation of the minute hand (outer loop). Nested loops work exactly like this.</div>

      <CodeBlock label="Nested loops — mechanics & multiplication table">{`// Trace: outer i runs 1..3, inner j runs 1..3 for EACH i
// Total iterations = 3 × 3 = 9
for (int i = 1; i <= 3; i++) {
  for (int j = 1; j <= 3; j++) {
    System.out.print("(" + i + "," + j + ") ");
  }
  System.out.println();  // newline after each row
}
// (1,1)(1,2)(1,3)
// (2,1)(2,2)(2,3)
// (3,1)(3,2)(3,3)

// 5×5 Multiplication Table
for (int i = 1; i <= 5; i++) {
  for (int j = 1; j <= 5; j++) {
    System.out.printf("%4d", i * j);  // formatted width
  }
  System.out.println();
}
//    1   2   3   4   5
//    2   4   6   8  10
//    3   6   9  12  15
//    4   8  12  16  20
//    5  10  15  20  25

// Mixed loop types — while outer, for inner
int row = 1;
while (row <= 3) {
  for (int col = 1; col <= row; col++) {
    System.out.print("* ");
  }
  System.out.println();
  row++;
}
// *
// * *
// * * *`}</CodeBlock>

      <div className="cf-fw">
        <h3>Key rules for nested loop variables</h3>
        <div className="syn-row"><div className="syn-n">1</div><div className="syn-t">Use different variable names: outer <code>i</code>, inner <code>j</code>, deepest <code>k</code>. Never reuse the same name across levels.</div></div>
        <div className="syn-row"><div className="syn-n">2</div><div className="syn-t">The inner loop variable resets on every outer iteration. <code>j</code> starts fresh at its initial value every time <code>i</code> increments.</div></div>
        <div className="syn-row"><div className="syn-n">3</div><div className="syn-t">To print rows, put <code>println()</code> after the inner loop ends — not inside it.</div></div>
        <div className="syn-row"><div className="syn-n">4</div><div className="syn-t">Time complexity: a 3-level nested loop on N elements = O(N³). Avoid deep nesting for large inputs.</div></div>
      </div>
    </div>
  );
}

// ── Chapter 5: Pattern Problems ──
function SecPatterns() {
  const patterns = [
    { title:"Right Triangle (stars)", sub:"Inner loop: j runs from 1 to i", code:`for(int i=1;i<=5;i++){
  for(int j=1;j<=i;j++)
    System.out.print("* ");
  System.out.println();
}`, out:`* 
* * 
* * * 
* * * * 
* * * * * ` },
    { title:"Inverted Triangle", sub:"Inner loop: j runs from i to N (decreasing)", code:`int n=5;
for(int i=n;i>=1;i--){
  for(int j=1;j<=i;j++)
    System.out.print("* ");
  System.out.println();
}`, out:`* * * * * 
* * * * 
* * * 
* * 
* ` },
    { title:"Number Triangle", sub:"Print j (the inner variable) instead of star", code:`for(int i=1;i<=5;i++){
  for(int j=1;j<=i;j++)
    System.out.print(j+" ");
  System.out.println();
}`, out:`1 
1 2 
1 2 3 
1 2 3 4 
1 2 3 4 5 ` },
    { title:"Right-aligned Triangle", sub:"Two inner loops: spaces (N-i), then stars (i)", code:`int n=5;
for(int i=1;i<=n;i++){
  for(int sp=1;sp<=n-i;sp++)
    System.out.print(" ");
  for(int j=1;j<=i;j++)
    System.out.print("*");
  System.out.println();
}`, out:`    *
   **
  ***
 ****
*****` },
    { title:"Pyramid (centered)", sub:"Spaces: N-i, Stars: 2*i-1", code:`int n=5;
for(int i=1;i<=n;i++){
  for(int s=1;s<=n-i;s++)
    System.out.print(" ");
  for(int j=1;j<=2*i-1;j++)
    System.out.print("*");
  System.out.println();
}`, out:`    *
   ***
  *****
 *******
*********` },
    { title:"Floyd's Triangle", sub:"Use a separate counter variable outside loops", code:`int num=1;
for(int i=1;i<=5;i++){
  for(int j=1;j<=i;j++)
    System.out.print(num+++" ");
  System.out.println();
}`, out:`1 
2 3 
4 5 6 
7 8 9 10 
11 12 13 14 15 ` },
  ];

  return (
    <div className="cf-sec">
      <div className="cf-tag tag-green">Chapter 5</div>
      <div className="cf-title">Pattern Problems</div>
      <div className="cf-desc">Patterns are the ultimate test of nested loop mastery. The trick: outer loop = <strong>rows</strong>, inner loop(s) = <strong>columns</strong>. Control what prints by relating the loop variables.</div>

      <div className="cf-alert al-green"><strong>Universal pattern formula:</strong> For an N-row pattern, outer loop runs <code>i = 1 to N</code>. Inner loop bounds depend on <code>i</code>. Spaces use another inner loop. Print newline at end of each outer iteration.</div>

      {patterns.map((p, idx) => (
        <div key={idx} className="pat-sec">
          <div className="pat-title">Pattern {idx+1} — {p.title}</div>
          <div className="pat-sub">{p.sub}</div>
          <div className="pat-grid">
            <div className="cf-code" style={{margin:0}}>
              <div className="cf-code-hd"><span className="cf-lbl">Java Code</span></div>
              <pre style={{fontSize:12}}>{p.code}</pre>
            </div>
            <div className="pat-out">{p.out}</div>
          </div>
        </div>
      ))}

      <div className="cf-fw" style={{marginTop:24}}>
        <h3>Pattern-solving strategy (works for any pattern)</h3>
        <div className="syn-row"><div className="syn-n">1</div><div className="syn-t">Count the rows → that's your outer loop range (1 to N).</div></div>
        <div className="syn-row"><div className="syn-n">2</div><div className="syn-t">For each row, count columns printed → express as a formula involving <code>i</code> (e.g., <code>j=1 to i</code>, or <code>j=1 to 2*i-1</code>).</div></div>
        <div className="syn-row"><div className="syn-n">3</div><div className="syn-t">If there are leading spaces, add a second inner loop for spaces before the stars.</div></div>
        <div className="syn-row"><div className="syn-n">4</div><div className="syn-t">Decide what to print: <code>*</code>, <code>j</code>, <code>i</code>, or a counter variable?</div></div>
        <div className="syn-row"><div className="syn-n">5</div><div className="syn-t">Always add <code>System.out.println()</code> after the inner loop(s) to move to the next row.</div></div>
      </div>
    </div>
  );
}

// ── Chapter 6: Live Playground ──
function SecPlayground() {
  const [patType, setPatType] = useState("right");
  const [patSize, setPatSize] = useState(5);
  const [patOut, setPatOut] = useState("Click Run to see the pattern output!");
  const [loopType, setLoopType] = useState("for");
  const [loopN, setLoopN] = useState(5);
  const [loopOut, setLoopOut] = useState("Click Run to see loop execution!");
  const [probType, setProbType] = useState("prime");
  const [probN, setProbN] = useState(20);
  const [probOut, setProbOut] = useState("Select a problem and click Run!");

  function runPattern() {
    const n = Math.min(12, Math.max(1, parseInt(patSize) || 5));
    let out = "";
    if (patType === "right") {
      for (let i=1;i<=n;i++){for(let j=1;j<=i;j++) out+="* "; out+="\n";}
    } else if (patType === "inverted") {
      for (let i=n;i>=1;i--){for(let j=1;j<=i;j++) out+="* "; out+="\n";}
    } else if (patType === "number") {
      for (let i=1;i<=n;i++){for(let j=1;j<=i;j++) out+=j+" "; out+="\n";}
    } else if (patType === "pyramid") {
      for (let i=1;i<=n;i++){for(let s=1;s<=n-i;s++) out+=" "; for(let j=1;j<=2*i-1;j++) out+="*"; out+="\n";}
    } else if (patType === "diamond") {
      for (let i=1;i<=n;i++){for(let s=1;s<=n-i;s++) out+=" "; for(let j=1;j<=2*i-1;j++) out+="*"; out+="\n";}
      for (let i=n-1;i>=1;i--){for(let s=1;s<=n-i;s++) out+=" "; for(let j=1;j<=2*i-1;j++) out+="*"; out+="\n";}
    } else if (patType === "floyd") {
      let num=1; for(let i=1;i<=n;i++){for(let j=1;j<=i;j++) out+=(num++)+" "; out+="\n";}
    } else if (patType === "hollow") {
      let cols=n+2; for(let i=1;i<=n;i++){for(let j=1;j<=cols;j++) out+=(i===1||i===n||j===1||j===cols)?"* ":"  "; out+="\n";}
    } else if (patType === "checkerboard") {
      for(let i=1;i<=n;i++){for(let j=1;j<=n;j++) out+=((i+j)%2===0)?"* ":"  "; out+="\n";}
    }
    setPatOut(out || "(empty)");
  }

  function runLoop() {
    const n = Math.min(10, Math.max(1, parseInt(loopN) || 5));
    let out = "";
    if (loopType === "for") {
      out += `for(int i=1; i<=${n}; i++) prints:\n`;
      for(let i=1;i<=n;i++) out+=i+" ";
      out += `\n\nfor(int i=${n}; i>=1; i--) prints:\n`;
      for(let i=n;i>=1;i--) out+=i+" ";
    } else if (loopType === "while") {
      out += `while(i <= ${n}) prints:\n`;
      let i=1; while(i<=n){out+=i+" ";i++;}
    } else if (loopType === "dowhile") {
      out += `do-while (runs at least once even if n=0):\n`;
      let i=1; do{out+=i+" ";i++;}while(i<=n);
      out += `\n\ndo-while with false initial condition (n=-1):\n`;
      let k=100; do{out+="Executed once! k="+k;}while(k<0);
    } else if (loopType === "break") {
      out += `Loop 1..${n*2} but BREAK at i==${n+1}:\n`;
      for(let i=1;i<=n*2;i++){if(i===n+1){out+=`\n[BREAK hit at i=${i}, loop exits]\n`;break;}out+=i+" ";}
    } else if (loopType === "continue") {
      out += `Loop 1..${n*2} but CONTINUE (skip even):\n`;
      for(let i=1;i<=n*2;i++){if(i%2===0) continue; out+=i+" ";}
      out += "\n\nAll evens were skipped by continue";
    } else if (loopType === "nested") {
      out += `Nested loop i=1..${n}, j=1..i:\n`;
      for(let i=1;i<=n;i++){out+=`i=${i}: `;for(let j=1;j<=i;j++) out+=`(${i},${j}) `;out+="\n";}
      out += `\nTotal iterations: ${n*(n+1)/2}`;
    }
    setLoopOut(out);
  }

  function runProblem() {
    const n = Math.min(100, Math.max(1, parseInt(probN) || 20));
    let out = "";
    if (probType === "prime") {
      out = `Primes up to ${n}:\n`;
      for(let i=2;i<=n;i++){let p=true;for(let j=2;j*j<=i;j++){if(i%j===0){p=false;break;}}if(p) out+=i+" ";}
    } else if (probType === "factorial") {
      out = `Factorials 1 to ${Math.min(n,15)}:\n`;
      for(let i=1;i<=Math.min(n,15);i++){let f=1;for(let j=1;j<=i;j++) f*=j;out+=`${i}! = ${f}\n`;}
    } else if (probType === "fib") {
      out = `Fibonacci (${n} terms):\n`;
      let a=0,b=1;for(let i=0;i<n;i++){out+=a+" ";let t=a+b;a=b;b=t;}
    } else if (probType === "armstrong") {
      out = `Armstrong numbers up to ${n}:\n`;
      for(let i=1;i<=n;i++){let s=0,tmp=i,d=String(i).length;while(tmp>0){s+=Math.pow(tmp%10,d);tmp=Math.floor(tmp/10);}if(s===i) out+=i+" ";}
    } else if (probType === "reverse") {
      out = `Reverse digits of numbers 1 to ${Math.min(n,20)}:\n`;
      for(let i=1;i<=Math.min(n,20);i++){let rev=0,tmp=i;while(tmp>0){rev=rev*10+tmp%10;tmp=Math.floor(tmp/10);}out+=`${i} → ${rev}\n`;}
    }
    setProbOut(out || "(no output)");
  }

  return (
    <div className="cf-sec">
      <div className="cf-tag tag-orange">Chapter 6</div>
      <div className="cf-title">Live Playground</div>
      <div className="cf-desc">See real output. Run pattern generators and loop demos instantly.</div>

      {/* Pattern Generator */}
      <div className="cf-fw">
        <h3>Pattern Generator</h3>
        <div className="demo-ctrl">
          <div>
            <div className="demo-lbl">Pattern type</div>
            <select className="demo-sel" value={patType} onChange={e=>setPatType(e.target.value)} style={{width:170}}>
              <option value="right">Right Triangle</option>
              <option value="inverted">Inverted Triangle</option>
              <option value="number">Number Triangle</option>
              <option value="pyramid">Pyramid</option>
              <option value="diamond">Diamond</option>
              <option value="floyd">Floyd's Triangle</option>
              <option value="hollow">Hollow Rectangle</option>
              <option value="checkerboard">Checkerboard</option>
            </select>
          </div>
          <div>
            <div className="demo-lbl">Size (N)</div>
            <input type="number" className="demo-inp" value={patSize} onChange={e=>setPatSize(e.target.value)} min="1" max="12" />
          </div>
          <button className="demo-btn" onClick={runPattern}>▶ Run</button>
        </div>
        <div className="demo-out">{patOut}</div>
      </div>

      {/* Loop Explorer */}
      <div className="cf-fw" style={{marginTop:20}}>
        <h3>Loop Behavior Explorer</h3>
        <div className="demo-ctrl">
          <div>
            <div className="demo-lbl">Loop type</div>
            <select className="demo-sel" value={loopType} onChange={e=>setLoopType(e.target.value)} style={{width:160}}>
              <option value="for">for loop</option>
              <option value="while">while loop</option>
              <option value="dowhile">do-while</option>
              <option value="break">break demo</option>
              <option value="continue">continue demo</option>
              <option value="nested">nested loop</option>
            </select>
          </div>
          <div>
            <div className="demo-lbl">N value</div>
            <input type="number" className="demo-inp" value={loopN} onChange={e=>setLoopN(e.target.value)} min="1" max="10" />
          </div>
          <button className="demo-btn" onClick={runLoop}>▶ Run</button>
        </div>
        <div className="demo-out">{loopOut}</div>
      </div>

      {/* Problem Checker */}
      <div className="cf-fw" style={{marginTop:20}}>
        <h3>Practice Problem Checker</h3>
        <div className="demo-ctrl">
          <div>
            <div className="demo-lbl">Problem</div>
            <select className="demo-sel" value={probType} onChange={e=>setProbType(e.target.value)} style={{width:220}}>
              <option value="prime">Print primes up to N</option>
              <option value="factorial">Factorials 1..N</option>
              <option value="fib">Fibonacci series N terms</option>
              <option value="armstrong">Armstrong numbers up to N</option>
              <option value="reverse">Reverse number digits</option>
            </select>
          </div>
          <div>
            <div className="demo-lbl">Input N</div>
            <input type="number" className="demo-inp" value={probN} onChange={e=>setProbN(e.target.value)} min="1" max="100" />
          </div>
          <button className="demo-btn" onClick={runProblem}>▶ Run</button>
        </div>
        <div className="demo-out">{probOut}</div>
      </div>
    </div>
  );
}

// ── Main Export ──
const CHAPTERS = [
  { id:"decision", label:"Decision Constructs", color:"orange" },
  { id:"loops",    label:"Loop Constructs",     color:"blue"   },
  { id:"jump",     label:"Jump Statements",     color:"red"    },
  { id:"nested",   label:"Nested Loops",        color:"purple" },
  { id:"patterns", label:"Pattern Problems",    color:"green"  },
  { id:"playground",label:"Live Playground",   color:"orange" },
];

const COLOR_MAP = {
  orange:"var(--java-orange)", blue:"var(--java-blue)",
  red:"var(--java-red)", purple:"var(--java-purple)", green:"var(--java-green)"
};

export default function ControlFlow({ onPrev, onNext, onChapterChange }) {
  const [active, setActive] = useState("decision");
  const curIdx = CHAPTERS.findIndex(c => c.id === active);
  useEffect(() => { onChapterChange?.(curIdx, CHAPTERS.length); }, [active]);

  function switchTab(id) {
    const newIdx = CHAPTERS.findIndex(c => c.id === id);
    onChapterChange?.(newIdx, CHAPTERS.length);
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="cf-root">
      <style>{styles}</style>
      <div className="cf-wrap">

        {/* Tab nav */}
        <div className="cf-nav">
          {CHAPTERS.map(ch => (
            <button key={ch.id} className={`cf-nb${active===ch.id?" on":""}`}
              style={active===ch.id ? {background:COLOR_MAP[ch.color], borderColor:COLOR_MAP[ch.color]} : {}}
              onClick={() => switchTab(ch.id)}>
              {ch.label}
            </button>
          ))}
        </div>

        {/* Active section */}
        {active === "decision"   && <SecDecision />}
        {active === "loops"      && <SecLoops />}
        {active === "jump"       && <SecJump />}
        {active === "nested"     && <SecNested />}
        {active === "patterns"   && <SecPatterns />}
        {active === "playground" && <SecPlayground />}

        {/* Prev / Next bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          marginTop:48,paddingTop:24,borderTop:"0.5px solid var(--java-border)"}}>

          {/* Prev: within chapters, or back to Arrays & Recursion */}
          {curIdx > 0 ? (
            <button className="demo-btn" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14,background:"var(--java-blue)"}}
              onClick={() => switchTab(CHAPTERS[curIdx-1].id)}>
              ← {CHAPTERS[curIdx-1].label}
            </button>
          ) : onPrev ? (
            <button className="demo-btn" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14,background:"var(--java-blue)"}}
              onClick={onPrev}>
              ← Arrays &amp; Recursion
            </button>
          ) : <div />}

          {/* Dot indicators */}
          <div style={{display:"flex",gap:6}}>
            {CHAPTERS.map((ch,i) => (
              <div key={ch.id} onClick={() => switchTab(ch.id)}
                style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",transition:"background .2s",
                  background: active===ch.id ? COLOR_MAP[ch.color] : "var(--java-border)"}} />
            ))}
          </div>

          {/* Next: within chapters, or forward to next tutorial */}
          {curIdx < CHAPTERS.length-1 ? (
            <button className="demo-btn" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14}}
              onClick={() => switchTab(CHAPTERS[curIdx+1].id)}>
              {CHAPTERS[curIdx+1].label} →
            </button>
          ) : onNext ? (
            <button className="demo-btn" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14}}
              onClick={onNext}>
              Next Chapter →
            </button>
          ) : (
            <div style={{fontSize:13,color:"var(--java-muted)",fontStyle:"italic"}}>✓ All chapters complete</div>
          )}
        </div>

      </div>
    </div>
  );
}
