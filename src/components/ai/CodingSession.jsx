import { useState, useEffect, useRef } from "react";
import { joinRoom, leaveRoom, emitCodeChange } from "../../socket.js";
import TypingIndicator from "./TypingIndicator.jsx";

const G = { bg:"#0a0e27",surface:"#141b3a",card:"#1a2347",border:"#2d3a5f",accent:"#ff6b9d",accentDim:"rgba(255,107,157,0.15)",purple:"#c084fc",cyan:"#22d3ee",text:"#f0f4ff",muted:"#94a3b8",success:"#34d399",warning:"#fbbf24",danger:"#f87171" };
const LANGS = ["JavaScript","Python","Java","C++","TypeScript"];
const PROBLEMS = [
  { title:"Two Sum", difficulty:"Easy", desc:"Given an array of integers and a target, return indices of two numbers that add up to target.", starter:{ JavaScript:"var twoSum = function(nums, target) {\n    // Your solution here\n    \n};", Python:"def twoSum(nums, target):\n    # Your solution here\n    pass" } },
  { title:"Valid Parentheses", difficulty:"Easy", desc:"Given a string of brackets, determine if it is valid.", starter:{ JavaScript:"var isValid = function(s) {\n    // Your solution here\n    \n};", Python:"def isValid(s):\n    # Your solution here\n    pass" } },
  { title:"Maximum Subarray", difficulty:"Medium", desc:"Find the contiguous subarray with the largest sum.", starter:{ JavaScript:"var maxSubArray = function(nums) {\n    // Your solution here\n    \n};", Python:"def maxSubArray(nums):\n    # Your solution here\n    pass" } },
];

const KW = new Set(["function","return","const","let","var","if","else","for","while","class","new","this","def","pass","import","from","int","void","public","private"]);

function highlight(line) {
  if (!line.trim()) return <span>&nbsp;</span>;
  if (line.trimStart().startsWith("//") || line.trimStart().startsWith("#"))
    return <span style={{color:"#4a5568",fontStyle:"italic"}}>{line}</span>;
  const tokens = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\w+\b|[^\w\s])/g);
  return tokens.map((tok,i) => {
    if (!tok) return null;
    if (/^["']/.test(tok)) return <span key={i} style={{color:"#34d399"}}>{tok}</span>;
    if (KW.has(tok))        return <span key={i} style={{color:"#c084fc",fontWeight:600}}>{tok}</span>;
    if (/^\d+$/.test(tok))  return <span key={i} style={{color:"#fbbf24"}}>{tok}</span>;
    if (/^[A-Z]/.test(tok)) return <span key={i} style={{color:"#22d3ee"}}>{tok}</span>;
    if (/^[{}()[\]]$/.test(tok)) return <span key={i} style={{color:"#ff6b9d"}}>{tok}</span>;
    return <span key={i} style={{color:"#f0f4ff"}}>{tok}</span>;
  });
}

export default function CodingSession({ socket, user }) {
  const [problem,  setProblem]  = useState(PROBLEMS[0]);
  const [lang,     setLang]     = useState("JavaScript");
  const [code,     setCode]     = useState(PROBLEMS[0].starter.JavaScript);
  const [running,  setRunning]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [collab,   setCollab]   = useState([]);
  const [typing,   setTyping]   = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800);
  const taRef  = useRef();
  const hlRef  = useRef();
  const timerRef = useRef();
  const roomId = `coding_${user?.id||"guest"}`;
  const lines  = code.split("\n");
  const LH     = 22;

  useEffect(() => {
    timerRef.current = setInterval(() => setTimeLeft(t => t > 0 ? t-1 : 0), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!socket) return;
    joinRoom(roomId, "coding");
    const onCode = (d) => { setCode(d.code); setCollab(c => [...c.filter(x=>x.id!==d.editor.id), {...d.editor, ts:Date.now()}]); };
    const onTyping = (d) => { if (d.roomId===roomId) setTyping(d.users); };
    socket.on("code-update", onCode);
    socket.on("typing-update", onTyping);
    return () => { leaveRoom(roomId); socket.off("code-update",onCode); socket.off("typing-update",onTyping); };
  }, [socket, roomId]);

  function syncScroll() {
    if (hlRef.current && taRef.current) { hlRef.current.scrollTop=taRef.current.scrollTop; hlRef.current.scrollLeft=taRef.current.scrollLeft; }
  }

  function onKeyDown(e) {
    if (e.key==="Tab") {
      e.preventDefault();
      const ta=taRef.current, s=ta.selectionStart, end=ta.selectionEnd;
      const next=code.slice(0,s)+"    "+code.slice(end);
      setCode(next);
      requestAnimationFrame(()=>{ta.selectionStart=ta.selectionEnd=s+4;});
    }
  }

  function handleCodeChange(val) {
    setCode(val);
    if (socket) emitCodeChange(roomId, val, lang, null);
  }

  function runCode() {
    setRunning(true); setResult(null);
    setTimeout(() => {
      setRunning(false);
      setResult({ passed:true, runtime:Math.floor(Math.random()*80+20)+"ms", memory:(Math.random()*5+38).toFixed(1)+"MB", cases:[{input:"[2,7,11,15], 9",expected:"[0,1]",output:"[0,1]",passed:true},{input:"[3,2,4], 6",expected:"[1,2]",output:"[1,2]",passed:true}] });
    }, 1200);
  }

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const shared = { fontFamily:"'Fira Code',monospace", fontSize:13, lineHeight:`${LH}px`, padding:"14px 14px 14px 0", whiteSpace:"pre", overflowWrap:"normal", tabSize:4 };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:0,borderRadius:16,overflow:"hidden",border:`1px solid ${G.border}`}}>
      {/* Top bar */}
      <div style={{background:G.surface,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${G.border}`,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <select value={problem.title} onChange={e=>{ const p=PROBLEMS.find(x=>x.title===e.target.value); setProblem(p); setCode(p.starter[lang]||p.starter.JavaScript); setResult(null); }}
            style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:8,padding:"5px 10px",color:G.text,fontSize:12,outline:"none",cursor:"pointer"}}>
            {PROBLEMS.map(p=><option key={p.title} value={p.title}>{p.title}</option>)}
          </select>
          <span style={{fontSize:11,fontWeight:700,color:problem.difficulty==="Easy"?G.success:problem.difficulty==="Medium"?G.warning:G.danger,background:`${problem.difficulty==="Easy"?G.success:problem.difficulty==="Medium"?G.warning:G.danger}15`,borderRadius:20,padding:"2px 8px"}}>{problem.difficulty}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {collab.length>0 && <div style={{fontSize:11,color:G.cyan}}>👥 {collab.length} collaborator{collab.length>1?"s":""}</div>}
          <div style={{fontFamily:"'Fira Code',monospace",fontSize:12,color:timeLeft<300?G.danger:G.muted,background:"rgba(0,0,0,0.3)",borderRadius:20,padding:"4px 12px"}}>⏱ {fmt(timeLeft)}</div>
          <select value={lang} onChange={e=>{setLang(e.target.value);setCode(problem.starter[e.target.value]||problem.starter.JavaScript);}}
            style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:8,padding:"5px 10px",color:G.text,fontSize:12,outline:"none",cursor:"pointer"}}>
            {LANGS.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Problem description */}
      <div style={{background:G.card,padding:"10px 16px",borderBottom:`1px solid ${G.border}`,fontSize:12,color:G.muted,lineHeight:1.6}}>
        <strong style={{color:G.text}}>{problem.title}:</strong> {problem.desc}
      </div>

      {/* Editor */}
      <div style={{position:"relative",height:260,background:"#0d1117",display:"flex"}}>
        <div style={{width:44,flexShrink:0,background:"#0d1117",borderRight:"1px solid rgba(255,255,255,0.06)",paddingTop:14,userSelect:"none",overflowY:"hidden"}}>
          {lines.map((_,i)=><div key={i} style={{height:LH,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:10,fontSize:12,color:"#3d4f6e",fontFamily:"'Fira Code',monospace"}}>{i+1}</div>)}
        </div>
        <div ref={hlRef} style={{position:"absolute",left:44,top:0,right:0,bottom:0,...shared,paddingLeft:14,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
          {lines.map((line,i)=><div key={i} style={{height:LH,display:"flex",alignItems:"center"}}>{highlight(line)}</div>)}
        </div>
        <textarea ref={taRef} value={code} onChange={e=>handleCodeChange(e.target.value)} onScroll={syncScroll} onKeyDown={onKeyDown}
          spellCheck={false} autoComplete="off"
          style={{position:"absolute",left:44,top:0,right:0,bottom:0,...shared,paddingLeft:14,background:"transparent",border:"none",outline:"none",resize:"none",color:"rgba(240,244,255,0.01)",caretColor:G.accent,zIndex:2,width:"calc(100% - 44px)"}}/>
      </div>

      {/* Typing indicator */}
      {typing.length>0 && <div style={{background:"#0d1117",paddingLeft:60,paddingBottom:6}}><TypingIndicator users={typing}/></div>}

      {/* Action bar */}
      <div style={{background:G.surface,padding:"10px 16px",borderTop:`1px solid ${G.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:11,color:G.muted}}>Press Tab to indent · Ctrl+Enter to run</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={runCode} disabled={running}
            style={{background:running?"rgba(34,211,238,0.06)":"rgba(34,211,238,0.12)",border:`1px solid ${G.cyan}30`,borderRadius:8,padding:"7px 18px",color:G.cyan,fontSize:12,fontWeight:600,cursor:running?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6}}
            onMouseEnter={e=>{if(!running)e.currentTarget.style.background="rgba(34,211,238,0.22)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(34,211,238,0.12)";}}>
            {running?<><span style={{animation:"spin 0.8s linear infinite",display:"inline-block"}}>⟳</span> Running...</>:"▶ Run"}
          </button>
          <button onClick={runCode} disabled={running}
            style={{background:running?"rgba(255,107,157,0.1)":`linear-gradient(135deg,${G.accent},${G.purple})`,border:"none",borderRadius:8,padding:"7px 20px",color:"#fff",fontSize:12,fontWeight:700,cursor:running?"not-allowed":"pointer",boxShadow:`0 4px 14px rgba(255,107,157,0.3)`}}>
            Submit
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div style={{background:result.passed?"rgba(52,211,153,0.06)":"rgba(248,113,113,0.06)",borderTop:`1px solid ${result.passed?G.success:G.danger}30`,padding:"12px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:13,fontWeight:700,color:result.passed?G.success:G.danger}}>{result.passed?"✅ All Test Cases Passed":"❌ Wrong Answer"}</span>
            <div style={{display:"flex",gap:16,fontSize:11,color:G.muted}}>
              <span>⚡ {result.runtime}</span><span>💾 {result.memory}</span>
            </div>
          </div>
          {result.cases.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:8,fontSize:11,color:G.muted,marginBottom:4}}>
              <span style={{color:c.passed?G.success:G.danger}}>{c.passed?"✓":"✗"}</span>
              <span>Input: {c.input}</span>
              <span>→ Expected: {c.expected}</span>
              {!c.passed&&<span style={{color:G.danger}}>Got: {c.output}</span>}
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
