import { useState, useEffect } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap');
* { box-sizing: border-box; }
:root {
  --bl:#0A7EA4; --gr:#2D9E5F; --am:#f59e0b; --pu:#7B52E8; --re:#D04040; --te:#22d3ee; --pk:#ff6b9d;
  --card:var(--color-background-primary); --bg:var(--color-background-secondary);
  --bdr:var(--color-border-tertiary); --bdr2:var(--color-border-secondary);
  --tx:var(--color-text-primary); --mu:var(--color-text-secondary);
  --mono:'JetBrains Mono',monospace;
  --kb:#ff9d00; --kf:#e0aaff; --ks:#7ec8e3; --kn:#a8ff78; --kc:#6a7f8f; --kt:#ff9d00;
}
.str-root { font-family:'DM Sans',sans-serif; background:transparent; }
.str-wrap { max-width:860px; margin:0 auto; padding:0 0 40px; }
.str-nav { display:flex; gap:6px; flex-wrap:wrap; padding:16px 0 20px; border-bottom:0.5px solid var(--bdr); margin-bottom:24px; }
.str-nb { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; padding:6px 14px; border-radius:20px; border:0.5px solid var(--bdr); background:var(--bg); color:var(--mu); cursor:pointer; transition:all .2s; }
.str-nb:hover { background:var(--card); color:var(--tx); }
.str-nb.on { color:#fff; }
@keyframes strFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.str-sec { animation:strFade .3s ease; }
.str-tag { display:inline-block; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:3px 10px; border-radius:4px; margin-bottom:10px; }
.tag-bl{background:#e3f4fb;color:var(--bl)} .tag-gr{background:#e6f9ee;color:var(--gr)}
.tag-am{background:#fff3e0;color:var(--am)} .tag-pu{background:#f0ebff;color:var(--pu)}
.tag-re{background:#fde8e8;color:var(--re)} .tag-te{background:#e0f7fa;color:var(--te)}
.tag-pk{background:#ffe0ec;color:var(--pk)}
.str-title { font-size:26px; font-weight:700; color:var(--tx); margin-bottom:8px; }
.str-desc { font-size:15px; color:var(--mu); line-height:1.7; max-width:680px; margin-bottom:24px; }
.str-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:24px 0; }
.str-card { background:var(--card); border:0.5px solid var(--bdr); border-radius:12px; padding:20px; transition:border-color .2s; }
.str-card:hover { border-color:var(--bdr2); }
.str-card .icon { font-size:22px; margin-bottom:10px; }
.str-card .ctitle { font-size:15px; font-weight:700; color:var(--tx); margin-bottom:6px; }
.str-card .cbody { font-size:13px; color:var(--mu); line-height:1.65; }
.acc-bl{border-left:3px solid var(--bl)} .acc-gr{border-left:3px solid var(--gr)}
.acc-am{border-left:3px solid var(--am)} .acc-pu{border-left:3px solid var(--pu)}
.acc-re{border-left:3px solid var(--re)} .acc-te{border-left:3px solid var(--te)}
.acc-pk{border-left:3px solid var(--pk)}
.str-code { background:#161b22; border-radius:12px; overflow:hidden; margin:20px 0; font-family:var(--mono); font-size:13px; line-height:1.8; }
.str-code-hd { display:flex; align-items:center; gap:8px; padding:10px 16px; background:rgba(255,255,255,0.04); border-bottom:0.5px solid rgba(255,255,255,0.08); }
.str-dot { width:10px; height:10px; border-radius:50%; }
.str-lbl { font-family:'DM Sans',sans-serif; font-size:12px; color:#6a7f8f; margin-left:auto; }
.str-code pre { padding:16px 20px; overflow-x:auto; color:#e6edf3; white-space:pre; }
.str-tbl { width:100%; border-collapse:collapse; margin:20px 0; font-size:13px; }
.str-tbl th { background:var(--bg); color:var(--tx); font-weight:600; padding:10px 14px; text-align:left; border-bottom:1.5px solid var(--bdr); }
.str-tbl td { padding:10px 14px; border-bottom:0.5px solid var(--bdr); color:var(--tx); vertical-align:top; }
.str-tbl tr:last-child td { border-bottom:none; }
.str-tbl tr:hover td { background:var(--bg); }
.str-bdg { display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600; }
.bdg-bl{background:#e3f4fb;color:var(--bl)} .bdg-gr{background:#e6f9ee;color:var(--gr)}
.bdg-am{background:#fff3e0;color:var(--am)} .bdg-pu{background:#f0ebff;color:var(--pu)}
.bdg-re{background:#fde8e8;color:var(--re)} .bdg-te{background:#e0f7fa;color:var(--te)}
.str-alert { border-radius:10px; padding:14px 18px; margin:16px 0; font-size:14px; line-height:1.65; }
.al-bl{background:#e8f5fc;border-left:4px solid var(--bl);color:#0a4d65}
.al-gr{background:#edfaf3;border-left:4px solid var(--gr);color:#1a5c3a}
.al-am{background:#fff8ed;border-left:4px solid var(--am);color:#7a4800}
.al-pu{background:#f5f0ff;border-left:4px solid var(--pu);color:#3d1f8a}
.al-re{background:#fdf0f0;border-left:4px solid var(--re);color:#6b1f1f}
.al-te{background:#e0f7fa;border-left:4px solid var(--te);color:#006064}
.al-pk{background:#ffe0ec;border-left:4px solid var(--pk);color:#880e4f}
.str-fw { background:var(--card); border:0.5px solid var(--bdr); border-radius:12px; padding:24px; margin:20px 0; }
.str-fw h3 { font-size:16px; font-weight:700; color:var(--tx); margin-bottom:12px; }
.syn-row { display:flex; align-items:flex-start; gap:12px; margin:12px 0; }
.syn-n { min-width:24px; height:24px; border-radius:50%; background:var(--bl); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; }
.syn-t { font-size:14px; color:var(--tx); line-height:1.65; }
.syn-t code { font-family:var(--mono); font-size:12px; background:var(--bg); padding:2px 6px; border-radius:4px; color:var(--bl); }
.demo-ctrl { background:var(--bg); border-radius:10px; padding:16px; margin:16px 0; display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end; }
.demo-lbl { font-size:13px; color:var(--mu); font-weight:500; margin-bottom:4px; }
.demo-inp { font-family:var(--mono); font-size:13px; padding:6px 10px; border-radius:6px; border:0.5px solid var(--bdr); background:var(--card); color:var(--tx); width:180px; }
.demo-inp-sm { font-family:var(--mono); font-size:13px; padding:6px 10px; border-radius:6px; border:0.5px solid var(--bdr); background:var(--card); color:var(--tx); width:80px; }
.demo-sel { font-family:'DM Sans',sans-serif; font-size:13px; padding:6px 10px; border-radius:6px; border:0.5px solid var(--bdr); background:var(--card); color:var(--tx); }
.demo-btn { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; padding:7px 18px; border-radius:8px; border:none; background:var(--bl); color:#fff; cursor:pointer; transition:opacity .2s; }
.demo-btn:hover { opacity:.85; }
.demo-out { font-family:var(--mono); font-size:12px; background:#161b22; border-radius:10px; padding:14px 16px; color:#a8ff78; line-height:1.7; min-height:60px; max-height:280px; overflow-y:auto; margin-top:10px; white-space:pre-wrap; }
.str-mem { display:flex; gap:16px; flex-wrap:wrap; margin:20px 0; }
.str-mem-box { background:var(--card); border:1.5px solid var(--bdr); border-radius:10px; padding:16px; flex:1; min-width:200px; }
.str-mem-box h4 { font-size:13px; font-weight:700; color:var(--tx); margin-bottom:10px; }
.str-mem-cell { font-family:var(--mono); font-size:12px; background:var(--bg); border:0.5px solid var(--bdr); border-radius:6px; padding:6px 10px; margin:4px 0; color:var(--tx); }
.str-pool { background:#161b22; border-radius:12px; padding:20px; margin:20px 0; }
.str-pool h4 { font-size:13px; font-weight:700; color:#e6edf3; margin-bottom:12px; }
.str-pool-item { display:inline-block; font-family:var(--mono); font-size:12px; background:rgba(255,255,255,0.07); border:0.5px solid rgba(255,255,255,0.15); border-radius:6px; padding:4px 10px; margin:4px; color:#a8ff78; }
.str-method-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; margin:20px 0; }
.str-method-card { background:var(--card); border:0.5px solid var(--bdr); border-radius:10px; padding:14px; }
.str-method-card .mname { font-family:var(--mono); font-size:12px; font-weight:700; color:var(--pu); margin-bottom:4px; }
.str-method-card .mdesc { font-size:12px; color:var(--mu); line-height:1.5; }
.str-method-card .mret { font-family:var(--mono); font-size:11px; color:var(--gr); margin-top:4px; }
.str-quiz-q { background:var(--card); border:0.5px solid var(--bdr); border-radius:10px; padding:16px; margin:12px 0; }
.str-quiz-q .qtext { font-size:14px; font-weight:600; color:var(--tx); margin-bottom:10px; }
.str-quiz-opt { display:block; width:100%; text-align:left; background:var(--bg); border:0.5px solid var(--bdr); border-radius:6px; padding:8px 12px; margin:4px 0; font-size:13px; color:var(--tx); cursor:pointer; transition:all .15s; font-family:'DM Sans',sans-serif; }
.str-quiz-opt:hover { border-color:var(--bl); background:var(--card); }
.str-quiz-opt.correct { background:#edfaf3; border-color:var(--gr); color:#1a5c3a; }
.str-quiz-opt.wrong { background:#fdf0f0; border-color:var(--re); color:#6b1f1f; }
.divider { height:0.5px; background:var(--bdr); margin:28px 0; }
@media(max-width:640px){ .str-grid2{grid-template-columns:1fr;} }
`;

function CodeBlock({ label, children }) {
  return (
    <div className="str-code">
      <div className="str-code-hd">
        <div className="str-dot" style={{background:"#ff5f57"}} />
        <div className="str-dot" style={{background:"#ffbd2e"}} />
        <div className="str-dot" style={{background:"#28c840"}} />
        <span className="str-lbl">{label}</span>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

function SecIntro() {
  return (
    <div className="str-sec">
      <div className="str-tag tag-bl">Chapter 1</div>
      <div className="str-title">char[] vs String</div>
      <div className="str-desc">In Java, text can be stored as a primitive <strong>char array</strong> or as a <strong>String object</strong>. Understanding the difference is fundamental to writing correct, secure Java code.</div>
      <div className="str-grid2">
        <div className="str-card acc-bl"><div className="icon">🔡</div><div className="ctitle">char[] array</div><div className="cbody">A raw array of Unicode characters. Mutable — you can change individual characters. Used in security-sensitive code (passwords) because it can be zeroed out after use.</div></div>
        <div className="str-card acc-pu"><div className="icon">📝</div><div className="ctitle">String object</div><div className="cbody">An immutable sequence of characters backed by a char[]. Lives in the String Pool. Has 60+ built-in methods. The standard choice for all text manipulation.</div></div>
        <div className="str-card acc-gr"><div className="icon">🔒</div><div className="ctitle">Immutability</div><div className="cbody">Once a String is created, its content cannot change. Any "modification" creates a new String object. This enables safe sharing and caching in the String Pool.</div></div>
        <div className="str-card acc-am"><div className="icon">🏊</div><div className="ctitle">String Pool</div><div className="cbody">A special heap area where string literals are cached. Two variables with the same literal share one object. Created with new String() bypasses the pool.</div></div>
      </div>
      <CodeBlock label="char[] vs String — key differences">{`
char[] charArr = {'H','e','l','l','o'};
charArr[0] = 'J';                        
System.out.println(charArr);             
System.out.println(charArr.length);      

String str = "Hello";

String modified = "J" + str.substring(1); 
System.out.println(str);                 
System.out.println(str.length());        

String fromArr = new String(charArr);    
char[] fromStr = str.toCharArray();      

char[] password = {'s','e','c','r','e','t'};
java.util.Arrays.fill(password, '\\0');  
`}</CodeBlock>
      <div className="str-mem">
        <div className="str-mem-box">
          <h4>char[] in memory</h4>
          <div className="str-mem-cell">charArr -&gt; [H][e][l][l][o]</div>
          <div className="str-mem-cell">charArr[0]='J' -&gt; [J][e][l][l][o]</div>
          <div style={{fontSize:12,color:"var(--mu)",marginTop:8}}>Direct array — each slot is a char (2 bytes)</div>
        </div>
        <div className="str-mem-box">
          <h4>String in memory</h4>
          <div className="str-mem-cell">str -&gt; String@1a2b {"{value:[H,e,l,l,o]}"}</div>
          <div className="str-mem-cell">str="World" -&gt; String@3c4d (new!)</div>
          <div style={{fontSize:12,color:"var(--mu)",marginTop:8}}>Object wrapping a final char[] — immutable</div>
        </div>
      </div>
      <table className="str-tbl">
        <thead><tr><th>Feature</th><th>char[]</th><th>String</th></tr></thead>
        <tbody>
          <tr><td>Mutability</td><td><span className="str-bdg bdg-gr">Mutable</span></td><td><span className="str-bdg bdg-re">Immutable</span></td></tr>
          <tr><td>Length access</td><td><code>.length</code> (field)</td><td><code>.length()</code> (method)</td></tr>
          <tr><td>Built-in methods</td><td>None (use Arrays)</td><td>60+ methods</td></tr>
          <tr><td>String Pool</td><td>No</td><td>Yes (literals)</td></tr>
          <tr><td>Security</td><td><span className="str-bdg bdg-gr">Can zero out</span></td><td><span className="str-bdg bdg-am">Stays in memory</span></td></tr>
          <tr><td>Comparison</td><td><code>Arrays.equals()</code></td><td><code>.equals()</code></td></tr>
        </tbody>
      </table>
      <div className="str-alert al-am"><strong>⚠️ == vs .equals():</strong> For Strings, <code>==</code> compares references (memory addresses), not content. Always use <code>.equals()</code> to compare string values.</div>
    </div>
  );
}

function SecCreate() {
  return (
    <div className="str-sec">
      <div className="str-tag tag-gr">Chapter 2</div>
      <div className="str-title">Creating Strings</div>
      <div className="str-desc">Java provides multiple ways to create String objects. The method you choose affects memory usage, performance, and whether the String Pool is used.</div>
      <CodeBlock label="All ways to create a String">{`
String s1 = "Hello";
String s2 = "Hello";
System.out.println(s1 == s2);        

String s3 = new String("Hello");
System.out.println(s1 == s3);        
System.out.println(s1.equals(s3));   

String s4 = s3.intern();
System.out.println(s1 == s4);        

char[] chars = {'J','a','v','a'};
String s5 = new String(chars);       
String s6 = String.valueOf(chars);   

String fromInt    = String.valueOf(42);    
String fromDouble = String.valueOf(3.14); 
String fromBool   = String.valueOf(true); 

String s7 = "Hello" + " " + "World";     
String s8 = "Count: " + 5;               

String s9 = String.format("Name: %s, Age: %d", "Alice", 25);

String empty = "";
String blank = "   ";
System.out.println(empty.isEmpty());  
System.out.println(blank.isBlank());  
`}</CodeBlock>
      <div className="str-pool">
        <h4>String Pool visualization</h4>
        <div style={{fontSize:12,color:"#8b949e",marginBottom:10}}>Literals are cached — same content shares one object</div>
        <div>
          <span className="str-pool-item">"Hello"</span>
          <span className="str-pool-item">"World"</span>
          <span className="str-pool-item">"Java"</span>
          <span className="str-pool-item">"Hello World"</span>
          <span className="str-pool-item">"42"</span>
          <span className="str-pool-item">"true"</span>
        </div>
        <div style={{fontSize:12,color:"#8b949e",marginTop:10}}>new String("Hello") → separate heap object, NOT in pool</div>
      </div>
      <table className="str-tbl">
        <thead><tr><th>Creation method</th><th>Pool?</th><th>Use when</th></tr></thead>
        <tbody>
          <tr><td><code>"literal"</code></td><td><span className="str-bdg bdg-gr">Yes</span></td><td>Default — always prefer this</td></tr>
          <tr><td><code>new String("...")</code></td><td><span className="str-bdg bdg-re">No</span></td><td>Rarely — when you need a distinct object</td></tr>
          <tr><td><code>String.valueOf(x)</code></td><td><span className="str-bdg bdg-gr">Yes</span></td><td>Converting primitives to String</td></tr>
          <tr><td><code>str.intern()</code></td><td><span className="str-bdg bdg-gr">Yes</span></td><td>Force pool for dynamically created strings</td></tr>
          <tr><td><code>String.format()</code></td><td><span className="str-bdg bdg-re">No</span></td><td>Formatted output strings</td></tr>
        </tbody>
      </table>
      <div className="str-alert al-gr"><strong>💡 Concatenation with + in loops is slow!</strong> Each + creates a new String object. For building strings in a loop, always use StringBuilder — it is up to 100x faster for large concatenations.</div>
    </div>
  );
}

function SecImmut() {
  return (
    <div className="str-sec">
      <div className="str-tag tag-am">Chapter 3</div>
      <div className="str-title">Immutability</div>
      <div className="str-desc">String immutability means once a String object is created, its character sequence can never change. Every "modification" operation returns a brand-new String object.</div>
      <div className="str-grid2">
        <div className="str-card acc-am"><div className="icon">🔐</div><div className="ctitle">Thread Safety</div><div className="cbody">Immutable objects are inherently thread-safe. Multiple threads can read the same String without synchronization — no race conditions possible.</div></div>
        <div className="str-card acc-bl"><div className="icon">🏊</div><div className="ctitle">String Pool Possible</div><div className="cbody">Because Strings cannot change, the JVM can safely share pool objects. If they were mutable, one thread changing "Hello" would corrupt all references to it.</div></div>
        <div className="str-card acc-gr"><div className="icon">🔑</div><div className="ctitle">Safe HashMap Keys</div><div className="cbody">Strings are the most common HashMap key. Immutability guarantees the hashCode never changes after insertion — the key always maps to the same bucket.</div></div>
        <div className="str-card acc-pu"><div className="icon">🛡️</div><div className="ctitle">Security</div><div className="cbody">Class names, file paths, and network URLs are Strings. If they were mutable, malicious code could change them after a security check but before use.</div></div>
      </div>
      <CodeBlock label="Immutability in action">{`String s = "Hello";

String upper    = s.toUpperCase();       
String trimmed  = "  Hi  ".trim();      
String replaced = s.replace('l','r');   
System.out.println(s);                  

String a = "Hello";
String b = a + " World";               
System.out.println(a == b);            

String x = "Java";
x = x + " 21";  

String result = "";
for (int i = 0; i < 1000; i++) {
  result += i;  
}

StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
  sb.append(i); 
}
String efficient = sb.toString();`}</CodeBlock>
      <div className="str-alert al-pu"><strong>🔍 How immutability is enforced:</strong> The String class is declared <code>final</code> (cannot be subclassed) and its internal <code>char[]</code> field is <code>private final</code>. No setter methods exist. The JVM also caches the hashCode after first computation since it can never change.</div>
      <div className="str-alert al-am"><strong>⚠️ Common misconception:</strong> <code>String s = "Hello"; s = "World";</code> does NOT modify the String. It reassigns the variable <code>s</code> to point to a different String object. The original "Hello" object is unchanged.</div>
    </div>
  );
}

function SecMethods() {
  const [input, setInput] = useState("Hello, World!");
  const [method, setMethod] = useState("length");
  const [arg, setArg] = useState("");
  const [output, setOutput] = useState("Click Run to see the result");

  function runMethod() {
    const s = input;
    let out = "";
    try {
      if (method === "length")           out = String(s.length);
      else if (method === "charAt")      out = s.charAt(parseInt(arg) || 0);
      else if (method === "indexOf")     out = String(s.indexOf(arg));
      else if (method === "lastIndexOf") out = String(s.lastIndexOf(arg));
      else if (method === "substring") {
        const p = arg.split(",");
        out = s.substring(parseInt(p[0]) || 0, p[1] !== undefined ? parseInt(p[1]) : undefined);
      }
      else if (method === "toUpperCase")      out = s.toUpperCase();
      else if (method === "toLowerCase")      out = s.toLowerCase();
      else if (method === "trim")             out = s.trim();
      else if (method === "strip")            out = s.trim();
      else if (method === "replace") {
        const p = arg.split(",");
        out = s.split(p[0] || "").join(p[1] || "");
      }
      else if (method === "replaceAll") {
        const p = arg.split(",");
        out = s.replace(new RegExp(p[0] || "", "g"), p[1] || "");
      }
      else if (method === "contains")         out = String(s.includes(arg));
      else if (method === "startsWith")       out = String(s.startsWith(arg));
      else if (method === "endsWith")         out = String(s.endsWith(arg));
      else if (method === "equals")           out = String(s === arg);
      else if (method === "equalsIgnoreCase") out = String(s.toLowerCase() === (arg || "").toLowerCase());
      else if (method === "split")            out = JSON.stringify(s.split(arg || ","));
      else if (method === "concat")           out = s + (arg || "");
      else if (method === "isEmpty")          out = String(s.length === 0);
      else if (method === "isBlank")          out = String(s.trim().length === 0);
      else if (method === "toCharArray")      out = "[" + s.split("").join(", ") + "]";
      else if (method === "intern")           out = s + " (interned — same pool reference)";
      else if (method === "repeat")           out = s.repeat(parseInt(arg) || 2);
      else if (method === "compareTo")        out = String(s < arg ? -1 : s > arg ? 1 : 0);
      else out = "Unknown method";
      setOutput(method + "(" + (arg ? '"' + arg + '"' : "") + ") → " + out);
    } catch(e) {
      setOutput("Error: " + e.message);
    }
  }

  const methods = [
    {name:"length()",ret:"int",desc:"Number of characters"},
    {name:"charAt(i)",ret:"char",desc:"Character at index i"},
    {name:"indexOf(s)",ret:"int",desc:"First occurrence of s, or -1"},
    {name:"lastIndexOf(s)",ret:"int",desc:"Last occurrence of s"},
    {name:"substring(i,j)",ret:"String",desc:"Chars from i to j (exclusive)"},
    {name:"toUpperCase()",ret:"String",desc:"All chars uppercase"},
    {name:"toLowerCase()",ret:"String",desc:"All chars lowercase"},
    {name:"trim()",ret:"String",desc:"Remove leading/trailing spaces"},
    {name:"strip()",ret:"String",desc:"Unicode-aware trim (Java 11+)"},
    {name:"replace(a,b)",ret:"String",desc:"Replace all a with b"},
    {name:"replaceAll(r,b)",ret:"String",desc:"Replace by regex pattern"},
    {name:"contains(s)",ret:"boolean",desc:"True if s is a substring"},
    {name:"startsWith(s)",ret:"boolean",desc:"True if starts with s"},
    {name:"endsWith(s)",ret:"boolean",desc:"True if ends with s"},
    {name:"equals(s)",ret:"boolean",desc:"Content equality (case-sensitive)"},
    {name:"equalsIgnoreCase(s)",ret:"boolean",desc:"Content equality (ignore case)"},
    {name:"compareTo(s)",ret:"int",desc:"Lexicographic comparison"},
    {name:"split(delim)",ret:"String[]",desc:"Split by delimiter"},
    {name:"concat(s)",ret:"String",desc:"Append s to this string"},
    {name:"isEmpty()",ret:"boolean",desc:"True if length == 0"},
    {name:"isBlank()",ret:"boolean",desc:"True if empty or whitespace only"},
    {name:"toCharArray()",ret:"char[]",desc:"Convert to char array"},
    {name:"intern()",ret:"String",desc:"Return pool canonical form"},
    {name:"repeat(n)",ret:"String",desc:"Repeat string n times (Java 11+)"},
  ];

  return (
    <div className="str-sec">
      <div className="str-tag tag-pu">Chapter 4</div>
      <div className="str-title">String Methods</div>
      <div className="str-desc">Java's String class has 60+ methods. Here are the most important ones — with an interactive explorer to try them live.</div>
      <div className="str-method-grid">
        {methods.map((m,i) => (
          <div key={i} className="str-method-card">
            <div className="mname">{m.name}</div>
            <div className="mdesc">{m.desc}</div>
            <div className="mret">→ {m.ret}</div>
          </div>
        ))}
      </div>
      <div className="str-fw">
        <h3>Interactive Method Explorer</h3>
        <div className="demo-ctrl">
          <div>
            <div className="demo-lbl">Input string</div>
            <input className="demo-inp" value={input} onChange={e => setInput(e.target.value)} style={{width:200}} />
          </div>
          <div>
            <div className="demo-lbl">Method</div>
            <select className="demo-sel" value={method} onChange={e => setMethod(e.target.value)} style={{width:180}}>
              <option value="length">length()</option>
              <option value="charAt">charAt(i)</option>
              <option value="indexOf">indexOf(s)</option>
              <option value="lastIndexOf">lastIndexOf(s)</option>
              <option value="substring">substring(i,j)</option>
              <option value="toUpperCase">toUpperCase()</option>
              <option value="toLowerCase">toLowerCase()</option>
              <option value="trim">trim()</option>
              <option value="strip">strip()</option>
              <option value="replace">replace(a,b)</option>
              <option value="replaceAll">replaceAll(regex,b)</option>
              <option value="contains">contains(s)</option>
              <option value="startsWith">startsWith(s)</option>
              <option value="endsWith">endsWith(s)</option>
              <option value="equals">equals(s)</option>
              <option value="equalsIgnoreCase">equalsIgnoreCase(s)</option>
              <option value="compareTo">compareTo(s)</option>
              <option value="split">split(delim)</option>
              <option value="concat">concat(s)</option>
              <option value="isEmpty">isEmpty()</option>
              <option value="isBlank">isBlank()</option>
              <option value="toCharArray">toCharArray()</option>
              <option value="intern">intern()</option>
              <option value="repeat">repeat(n)</option>
            </select>
          </div>
          <div>
            <div className="demo-lbl">Argument</div>
            <input className="demo-inp-sm" value={arg} onChange={e => setArg(e.target.value)} placeholder="optional" style={{width:120}} />
          </div>
          <button className="demo-btn" onClick={runMethod}>▶ Run</button>
        </div>
        <div className="demo-out">{output}</div>
      </div>
      <CodeBlock label="Common String method patterns">{`String s = "  Hello, World!  ";

String clean = s.trim().toLowerCase().replace(",","");

boolean hasHello = s.contains("Hello");      
boolean startsH  = s.trim().startsWith("H"); 

String word  = s.trim().substring(0, 5);     
String[] parts = "a,b,c".split(",");         

"Java".equals("java");            
"Java".equalsIgnoreCase("java");  
"Apple".compareTo("Banana");      

"  ".isBlank();                   
"ha".repeat(3);                   
`}</CodeBlock>
    </div>
  );
}

function SecSB() {
  const [sbState, setSbState] = useState("Hello");
  const [sbLog, setSbLog] = useState(["Initial: \"Hello\""]);
  const [op, setOp] = useState("append");
  const [arg1, setArg1] = useState("");
  const [arg2, setArg2] = useState("");

  function sbOp() {
    let s = sbState;
    let logMsg = "";
    if (op === "append") {
      s = s + (arg1 || "!");
      logMsg = 'append("' + (arg1 || "!") + '") → "' + s + '"';
    } else if (op === "insert") {
      const idx = parseInt(arg1) || 0;
      const val = arg2 || "X";
      s = s.slice(0, idx) + val + s.slice(idx);
      logMsg = 'insert(' + idx + ',"' + val + '") → "' + s + '"';
    } else if (op === "delete") {
      const st = parseInt(arg1) || 0;
      const en = parseInt(arg2) || 1;
      s = s.slice(0, st) + s.slice(en);
      logMsg = 'delete(' + st + ',' + en + ') → "' + s + '"';
    } else if (op === "reverse") {
      s = s.split("").reverse().join("");
      logMsg = 'reverse() → "' + s + '"';
    } else if (op === "toUpperCase") {
      s = s.toUpperCase();
      logMsg = 'toUpperCase() → "' + s + '"';
    } else if (op === "replace") {
      const stIdx = parseInt(arg1) || 0;
      const enIdx = parseInt(arg2) || s.length;
      const val = arg2 ? (arg1.includes(",") ? arg1.split(",")[1] : "NEW") : "NEW";
      s = s.slice(0, stIdx) + val + s.slice(enIdx);
      logMsg = 'replace(' + stIdx + ',' + enIdx + ',"' + val + '") → "' + s + '"';
    } else if (op === "clear") {
      s = "";
      logMsg = 'delete(0,length) → "" (cleared)';
    } else if (op === "toString") {
      logMsg = 'toString() → "' + s + '" (String object)';
    }
    if (op !== "toString") setSbState(s);
    setSbLog(prev => [...prev, logMsg]);
  }

  function resetSb() {
    setSbState("Hello");
    setSbLog(["Reset: \"Hello\""]);
  }

  return (
    <div className="str-sec">
      <div className="str-tag tag-te">Chapter 5</div>
      <div className="str-title">StringBuffer &amp; StringBuilder</div>
      <div className="str-desc">When you need to build or modify strings repeatedly, use <strong>StringBuilder</strong> (single-threaded) or <strong>StringBuffer</strong> (thread-safe). Both are mutable — they modify in place without creating new objects.</div>
      <div className="str-grid2">
        <div className="str-card acc-te"><div className="icon">⚡</div><div className="ctitle">StringBuilder</div><div className="cbody">Mutable, NOT thread-safe. Fastest option for single-threaded string building. Use in loops, parsers, and any place you would otherwise concatenate with +.</div></div>
        <div className="str-card acc-bl"><div className="icon">🔒</div><div className="ctitle">StringBuffer</div><div className="cbody">Mutable, thread-safe (synchronized methods). Slower than StringBuilder due to synchronization overhead. Use only when multiple threads share the buffer.</div></div>
      </div>
      <CodeBlock label="StringBuilder — all key methods">{`StringBuilder sb = new StringBuilder("Hello");

sb.append(" World");          
sb.append(42);                
sb.insert(5, ",");            
sb.delete(11, 13);            
sb.replace(7, 12, "Java");    
sb.reverse();                 
sb.reverse();                 
sb.deleteCharAt(sb.length()-1); 
sb.setCharAt(0, 'h');         

int len = sb.length();        
int cap = sb.capacity();      

String result = sb.toString(); 

String s = new StringBuilder()
  .append("Java")
  .append(" ")
  .append(21)
  .toString();                 
`}</CodeBlock>
      <div className="str-fw">
        <h3>StringBuilder Playground</h3>
        <div style={{fontFamily:"var(--mono)",fontSize:13,background:"#161b22",borderRadius:8,padding:"10px 14px",color:"#a8ff78",marginBottom:12}}>
          Current value: "{sbState}"  (length: {sbState.length})
        </div>
        <div className="demo-ctrl">
          <div>
            <div className="demo-lbl">Operation</div>
            <select className="demo-sel" value={op} onChange={e => setOp(e.target.value)} style={{width:160}}>
              <option value="append">append(str)</option>
              <option value="insert">insert(idx, str)</option>
              <option value="delete">delete(start, end)</option>
              <option value="replace">replace(start,end)</option>
              <option value="reverse">reverse()</option>
              <option value="toUpperCase">toUpperCase()</option>
              <option value="clear">clear()</option>
              <option value="toString">toString()</option>
            </select>
          </div>
          <div>
            <div className="demo-lbl">Arg 1</div>
            <input className="demo-inp-sm" value={arg1} onChange={e => setArg1(e.target.value)} placeholder="value/index" />
          </div>
          <div>
            <div className="demo-lbl">Arg 2</div>
            <input className="demo-inp-sm" value={arg2} onChange={e => setArg2(e.target.value)} placeholder="end/str" />
          </div>
          <button className="demo-btn" onClick={sbOp}>▶ Run</button>
          <button className="demo-btn" style={{background:"var(--re)"}} onClick={resetSb}>↺ Reset</button>
        </div>
        <div className="demo-out">{sbLog.join("\n")}</div>
      </div>
      <table className="str-tbl">
        <thead><tr><th>Feature</th><th>String</th><th>StringBuilder</th><th>StringBuffer</th></tr></thead>
        <tbody>
          <tr><td>Mutable</td><td><span className="str-bdg bdg-re">No</span></td><td><span className="str-bdg bdg-gr">Yes</span></td><td><span className="str-bdg bdg-gr">Yes</span></td></tr>
          <tr><td>Thread-safe</td><td><span className="str-bdg bdg-gr">Yes</span></td><td><span className="str-bdg bdg-re">No</span></td><td><span className="str-bdg bdg-gr">Yes</span></td></tr>
          <tr><td>Performance</td><td>Slow (new obj)</td><td><span className="str-bdg bdg-gr">Fastest</span></td><td>Medium</td></tr>
          <tr><td>Use case</td><td>Fixed text</td><td>Single-thread building</td><td>Multi-thread building</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function SecToStr() {
  const [className, setClassName] = useState("Person");
  const [fields, setFields] = useState("name,age");
  const [output, setOutput] = useState("");

  function genToString() {
    const cls = className || "MyClass";
    const flds = fields.split(",").map(f => f.trim()).filter(f => f);
    if (flds.length === 0) {
      setOutput("");
      return;
    }
    let code = "@Override\npublic String toString() {\n  return \"" + cls + "{\" +\n";
    flds.forEach((f, i) => {
      code += "    \"" + f + "=\" + " + f;
      if (i < flds.length - 1) code += " + \", \" +\n";
    });
    code += " +\n    \"}\";\n}";
    setOutput(code);
  }

  return (
    <div className="str-sec">
      <div className="str-tag tag-pk">Chapter 6</div>
      <div className="str-title">toString()</div>
      <div className="str-desc">Every Java object inherits <code>toString()</code> from Object. By default, it returns <code>ClassName@hashCode</code>. Override it to provide a human-readable representation of your object.</div>
      <CodeBlock label="Default vs custom toString()">{`class Person {
  String name;
  int age;
  
  
}

class Person {
  String name;
  int age;
  
  @Override
  public String toString() {
    return "Person{name=" + name + ", age=" + age + "}";
  }
}

Person p = new Person();
p.name = "Alice";
p.age = 25;
System.out.println(p);  
`}</CodeBlock>
      <div className="str-fw">
        <h3>toString() Generator</h3>
        <div className="demo-ctrl">
          <div>
            <div className="demo-lbl">Class name</div>
            <input className="demo-inp" value={className} onChange={e => setClassName(e.target.value)} placeholder="Person" style={{width:140}} />
          </div>
          <div>
            <div className="demo-lbl">Fields (comma-separated)</div>
            <input className="demo-inp" value={fields} onChange={e => setFields(e.target.value)} placeholder="name,age,email" style={{width:240}} />
          </div>
          <button className="demo-btn" onClick={genToString}>▶ Generate</button>
        </div>
        <div className="demo-out">{output || "Click Generate to see the code"}</div>
      </div>
      <div className="str-alert al-pk"><strong>💡 IDE shortcut:</strong> In IntelliJ/Eclipse, right-click → Generate → toString() to auto-generate this method. Modern IDEs can also generate using StringBuilder for better performance.</div>
      <div className="str-alert al-bl"><strong>🔍 When to override toString():</strong> Always override for domain objects (Person, Product, Order). It makes debugging infinitely easier — logs and debuggers show meaningful data instead of memory addresses.</div>
    </div>
  );
}

function SecTok() {
  const [input, setInput] = useState("apple,banana,cherry");
  const [delim, setDelim] = useState(",");
  const [returnDelims, setReturnDelims] = useState(false);
  const [output, setOutput] = useState("");

  function runTokenizer() {
    if (!input) {
      setOutput("(empty input)");
      return;
    }
    const d = delim || ",";
    const tokens = input.split(d);
    let out = "Tokens:\n";
    tokens.forEach((t, i) => {
      out += (i + 1) + ". \"" + t + "\"\n";
    });
    out += "\nTotal: " + tokens.length + " tokens";
    if (returnDelims) {
      out += "\n\n(returnDelimiters=true would also return \"" + d + "\" as tokens)";
    }
    setOutput(out);
  }

  return (
    <div className="str-sec">
      <div className="str-tag tag-re">Chapter 7</div>
      <div className="str-title">StringTokenizer</div>
      <div className="str-desc">StringTokenizer is a legacy class for splitting strings by delimiters. Modern code uses <code>String.split()</code> instead, but StringTokenizer still appears in older codebases and some interview questions.</div>
      <CodeBlock label="StringTokenizer vs String.split()">{`import java.util.StringTokenizer;

String text = "apple,banana,cherry";

StringTokenizer st = new StringTokenizer(text, ",");
while (st.hasMoreTokens()) {
  System.out.println(st.nextToken());
}

String[] tokens = text.split(",");
for (String token : tokens) {
  System.out.println(token);
}

StringTokenizer st2 = new StringTokenizer("a,b;c:d", ",;:");

StringTokenizer st3 = new StringTokenizer("a,b", ",", true);
`}</CodeBlock>
      <div className="str-fw">
        <h3>StringTokenizer Demo</h3>
        <div className="demo-ctrl">
          <div>
            <div className="demo-lbl">Input string</div>
            <input className="demo-inp" value={input} onChange={e => setInput(e.target.value)} style={{width:240}} />
          </div>
          <div>
            <div className="demo-lbl">Delimiter</div>
            <input className="demo-inp-sm" value={delim} onChange={e => setDelim(e.target.value)} placeholder="," style={{width:60}} />
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <input type="checkbox" checked={returnDelims} onChange={e => setReturnDelims(e.target.checked)} id="retDelim" />
            <label htmlFor="retDelim" style={{fontSize:13,color:"var(--mu)",cursor:"pointer"}}>returnDelimiters</label>
          </div>
          <button className="demo-btn" onClick={runTokenizer}>▶ Run</button>
        </div>
        <div className="demo-out">{output || "Click Run to tokenize"}</div>
      </div>
      <table className="str-tbl">
        <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>hasMoreTokens()</code></td><td>boolean</td><td>True if more tokens remain</td></tr>
          <tr><td><code>nextToken()</code></td><td>String</td><td>Returns next token</td></tr>
          <tr><td><code>countTokens()</code></td><td>int</td><td>Number of remaining tokens</td></tr>
        </tbody>
      </table>
      <div className="str-alert al-re"><strong>⚠️ Deprecated in modern code:</strong> StringTokenizer is not recommended for new code. Use <code>String.split(regex)</code> or <code>Scanner</code> instead. StringTokenizer cannot handle regex patterns and has a clunky API.</div>
    </div>
  );
}

function SecPlay() {
  const [probType, setProbType] = useState("reverse");
  const [input1, setInput1] = useState("hello");
  const [input2, setInput2] = useState("");
  const [output, setOutput] = useState("");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const quizPool = [
    {q:"String is immutable in Java",opts:["True","False"],ans:0},
    {q:"Which method compares String content?",opts:[".equals()",".compareTo()","==",".compare()"],ans:0},
    {q:"String literals go into the String Pool",opts:["True","False"],ans:0},
    {q:"StringBuilder is thread-safe",opts:["True","False"],ans:1},
    {q:"Which is fastest for building strings in a loop?",opts:["String +","StringBuilder","StringBuffer","concat()"],ans:1},
    {q:"str.length is a field, not a method",opts:["True","False"],ans:1},
    {q:"new String(\"x\") creates a pool object",opts:["True","False"],ans:1},
    {q:"Which method removes whitespace?",opts:[".trim()",".strip()",".clean()",".removeSpaces()"],ans:0},
    {q:"String.valueOf(42) returns",opts:["\"42\"","42","'42'","error"],ans:0},
    {q:"StringTokenizer is recommended for new code",opts:["True","False"],ans:1},
  ];

  function runProblem() {
    const s = input1;
    const s2 = input2;
    let out = "";
    if (probType === "reverse") {
      out = "Reversed: \"" + s.split("").reverse().join("") + "\"";
    } else if (probType === "palindrome") {
      const rev = s.split("").reverse().join("");
      out = s === rev ? "\"" + s + "\" is a palindrome" : "\"" + s + "\" is NOT a palindrome";
    } else if (probType === "vowels") {
      const count = (s.match(/[aeiouAEIOU]/g) || []).length;
      out = "Vowel count: " + count;
    } else if (probType === "anagram") {
      const sort1 = s.split("").sort().join("");
      const sort2 = s2.split("").sort().join("");
      out = sort1 === sort2 ? "\"" + s + "\" and \"" + s2 + "\" are anagrams" : "NOT anagrams";
    } else if (probType === "capitalize") {
      out = "Capitalized: \"" + s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + "\"";
    } else if (probType === "removeSpaces") {
      out = "No spaces: \"" + s.replace(/ /g, "") + "\"";
    } else if (probType === "countWords") {
      const words = s.trim().split(/\s+/).filter(w => w);
      out = "Word count: " + words.length;
    } else if (probType === "longestWord") {
      const words = s.split(/\s+/);
      const longest = words.reduce((a, b) => a.length >= b.length ? a : b, "");
      out = "Longest word: \"" + longest + "\" (length " + longest.length + ")";
    } else if (probType === "charFreq") {
      const freq = {};
      for (let c of s) freq[c] = (freq[c] || 0) + 1;
      out = "Character frequency:\n" + Object.entries(freq).map(([k, v]) => k + ": " + v).join("\n");
    } else if (probType === "firstNonRepeat") {
      const freq = {};
      for (let c of s) freq[c] = (freq[c] || 0) + 1;
      const first = s.split("").find(c => freq[c] === 1);
      out = first ? "First non-repeating: \"" + first + "\"" : "All characters repeat";
    } else if (probType === "compress") {
      let comp = "";
      let i = 0;
      while (i < s.length) {
        let c = s[i];
        let count = 1;
        while (i + count < s.length && s[i + count] === c) count++;
        comp += c + (count > 1 ? count : "");
        i += count;
      }
      out = "Compressed: \"" + comp + "\"";
    } else if (probType === "rotation") {
      const doubled = s + s;
      out = doubled.includes(s2) ? "\"" + s2 + "\" is a rotation of \"" + s + "\"" : "NOT a rotation";
    } else if (probType === "removeDuplicates") {
      const unique = [...new Set(s.split(""))].join("");
      out = "No duplicates: \"" + unique + "\"";
    } else if (probType === "permutation") {
      const sort1 = s.split("").sort().join("");
      const sort2 = s2.split("").sort().join("");
      out = sort1 === sort2 ? "\"" + s + "\" is a permutation of \"" + s2 + "\"" : "NOT a permutation";
    } else if (probType === "subsequence") {
      let j = 0;
      for (let i = 0; i < s2.length && j < s.length; i++) {
        if (s2[i] === s[j]) j++;
      }
      out = j === s.length ? "\"" + s + "\" is a subsequence of \"" + s2 + "\"" : "NOT a subsequence";
    } else if (probType === "toggleCase") {
      const toggled = s.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
      out = "Toggled case: \"" + toggled + "\"";
    } else if (probType === "replaceSpaces") {
      out = "Replaced: \"" + s.replace(/ /g, "%20") + "\"";
    } else if (probType === "isPangram") {
      const letters = new Set(s.toLowerCase().match(/[a-z]/g) || []);
      out = letters.size === 26 ? "\"" + s + "\" is a pangram" : "NOT a pangram (has " + letters.size + "/26 letters)";
    } else if (probType === "longestSubstring") {
      let maxLen = 0, start = 0, seen = {};
      for (let i = 0; i < s.length; i++) {
        if (seen[s[i]] !== undefined && seen[s[i]] >= start) {
          start = seen[s[i]] + 1;
        }
        seen[s[i]] = i;
        maxLen = Math.max(maxLen, i - start + 1);
      }
      out = "Longest substring without repeating chars: length " + maxLen;
    } else if (probType === "countSubstring") {
      const regex = new RegExp(s2, "g");
      const matches = (s.match(regex) || []).length;
      out = "\"" + s2 + "\" appears " + matches + " times in \"" + s + "\"";
    }
    setOutput(out);
  }

  function buildQuiz() {
    const shuffled = [...quizPool].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(shuffled);
    setAnswers({});
    setFeedback(false);
    setScore(0);
  }

  function checkQuiz() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.ans) correct++;
    });
    setScore(correct);
    setFeedback(true);
  }

  return (
    <div className="str-sec">
      <div className="str-tag tag-bl">Chapter 8</div>
      <div className="str-title">Practice Lab</div>
      <div className="str-desc">Test your String skills with 20 common problems and a randomized quiz. These patterns appear frequently in coding interviews and real-world Java development.</div>
      <div className="str-fw">
        <h3>Problem Runner</h3>
        <div className="demo-ctrl">
          <div>
            <div className="demo-lbl">Problem</div>
            <select className="demo-sel" value={probType} onChange={e => setProbType(e.target.value)} style={{width:220}}>
              <option value="reverse">Reverse string</option>
              <option value="palindrome">Check palindrome</option>
              <option value="vowels">Count vowels</option>
              <option value="anagram">Check anagram</option>
              <option value="capitalize">Capitalize words</option>
              <option value="removeSpaces">Remove all spaces</option>
              <option value="countWords">Count words</option>
              <option value="longestWord">Find longest word</option>
              <option value="charFreq">Character frequency</option>
              <option value="firstNonRepeat">First non-repeating char</option>
              <option value="compress">String compression (aabcc → a2bc2)</option>
              <option value="rotation">Check string rotation</option>
              <option value="removeDuplicates">Remove duplicate chars</option>
              <option value="permutation">Check permutation</option>
              <option value="subsequence">Check subsequence</option>
              <option value="toggleCase">Toggle case</option>
              <option value="replaceSpaces">Replace spaces with %20</option>
              <option value="isPangram">Check pangram</option>
              <option value="longestSubstring">Longest substring no repeat</option>
              <option value="countSubstring">Count substring occurrences</option>
            </select>
          </div>
          <div>
            <div className="demo-lbl">Input 1</div>
            <input className="demo-inp" value={input1} onChange={e => setInput1(e.target.value)} style={{width:160}} />
          </div>
          <div>
            <div className="demo-lbl">Input 2 (if needed)</div>
            <input className="demo-inp" value={input2} onChange={e => setInput2(e.target.value)} style={{width:160}} />
          </div>
          <button className="demo-btn" onClick={runProblem}>▶ Run</button>
        </div>
        <div className="demo-out">{output || "Select a problem and click Run"}</div>
      </div>
      <div className="divider" />
      <div className="str-fw">
        <h3>String Quiz</h3>
        {questions.length === 0 ? (
          <div style={{textAlign:"center",padding:20}}>
            <button className="demo-btn" onClick={buildQuiz}>🎲 Generate Random Quiz (6 questions)</button>
          </div>
        ) : (
          <>
            {questions.map((q, i) => (
              <div key={i} className="str-quiz-q">
                <div className="qtext">{i + 1}. {q.q}</div>
                {q.opts.map((opt, j) => (
                  <button
                    key={j}
                    className={"str-quiz-opt" + (feedback ? (j === q.ans ? " correct" : answers[i] === j ? " wrong" : "") : "")}
                    onClick={() => !feedback && setAnswers({...answers, [i]: j})}
                    disabled={feedback}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}
            <div style={{display:"flex",gap:12,marginTop:16}}>
              {!feedback && <button className="demo-btn" onClick={checkQuiz}>✓ Check Answers</button>}
              <button className="demo-btn" style={{background:"var(--re)"}} onClick={buildQuiz}>↺ New Quiz</button>
            </div>
            {feedback && (
              <div className="str-alert al-gr" style={{marginTop:16}}>
                <strong>Score: {score}/{questions.length}</strong> ({Math.round(score / questions.length * 100)}%)
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const CHAPTERS = [
  { id:"intro",   label:"Char[] vs String",      color:"bl" },
  { id:"create",  label:"Creating Strings",       color:"gr" },
  { id:"immut",   label:"Immutability",           color:"am" },
  { id:"methods", label:"String Methods",         color:"pu" },
  { id:"sb",      label:"StringBuffer & Builder", color:"te" },
  { id:"tostr",   label:"toString()",             color:"pk" },
  { id:"tok",     label:"StringTokenizer",        color:"re" },
  { id:"play",    label:"Practice Lab",           color:"bl" },
];

const COLOR_MAP = {
  bl:"var(--bl)", gr:"var(--gr)", am:"var(--am)",
  pu:"var(--pu)", te:"var(--te)", pk:"var(--pk)", re:"var(--re)"
};

export default function StringsTutorial({ onPrev, onNext, onChapterChange }) {
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
    <div className="str-root">
      <style>{styles}</style>
      <div className="str-wrap">

        {}
        <div className="str-nav">
          {CHAPTERS.map(ch => (
            <button key={ch.id}
              className={"str-nb" + (active === ch.id ? " on" : "")}
              style={active === ch.id ? {background:COLOR_MAP[ch.color], borderColor:COLOR_MAP[ch.color]} : {}}
              onClick={() => switchTab(ch.id)}>
              {ch.label}
            </button>
          ))}
        </div>

        {}
        {active === "intro"   && <SecIntro />}
        {active === "create"  && <SecCreate />}
        {active === "immut"   && <SecImmut />}
        {active === "methods" && <SecMethods />}
        {active === "sb"      && <SecSB />}
        {active === "tostr"   && <SecToStr />}
        {active === "tok"     && <SecTok />}
        {active === "play"    && <SecPlay />}

        {}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          marginTop:48,paddingTop:24,borderTop:"0.5px solid var(--bdr)"}}>

          {curIdx > 0 ? (
            <button className="demo-btn"
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14,background:"var(--bl)"}}
              onClick={() => switchTab(CHAPTERS[curIdx-1].id)}>
              ← {CHAPTERS[curIdx-1].label}
            </button>
          ) : onPrev ? (
            <button className="demo-btn"
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14,background:"var(--bl)"}}
              onClick={onPrev}>
              ← Control Flow
            </button>
          ) : <div />}

          {}
          <div style={{display:"flex",gap:6}}>
            {CHAPTERS.map(ch => (
              <div key={ch.id} onClick={() => switchTab(ch.id)}
                style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",transition:"background .2s",
                  background: active === ch.id ? COLOR_MAP[ch.color] : "var(--bdr)"}} />
            ))}
          </div>

          {curIdx < CHAPTERS.length - 1 ? (
            <button className="demo-btn"
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14}}
              onClick={() => switchTab(CHAPTERS[curIdx+1].id)}>
              {CHAPTERS[curIdx+1].label} →
            </button>
          ) : onNext ? (
            <button className="demo-btn"
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",fontSize:14}}
              onClick={onNext}>
              Next Chapter →
            </button>
          ) : (
            <div style={{fontSize:13,color:"var(--mu)",fontStyle:"italic"}}>✓ All chapters complete</div>
          )}
        </div>

      </div>
    </div>
  );
}
