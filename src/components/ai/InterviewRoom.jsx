import { useState, useEffect, useRef } from "react";
import { joinRoom, leaveRoom, emitInterviewEvent } from "../../socket.js";
import TypingIndicator from "./TypingIndicator.jsx";
const G = { bg:"#0a0e27",surface:"#141b3a",card:"#1a2347",border:"#2d3a5f",accent:"#ff6b9d",accentDim:"rgba(255,107,157,0.15)",purple:"#c084fc",cyan:"#22d3ee",text:"#f0f4ff",muted:"#94a3b8",success:"#34d399",warning:"#fbbf24",danger:"#f87171" };

const ROUNDS = [
  { id:"hr",       label:"HR Round",         icon:"👔", questions:["Tell me about yourself.","Why do you want to join this company?","Where do you see yourself in 5 years?","What are your strengths and weaknesses?","Describe a challenging situation you overcame."] },
  { id:"technical",label:"Technical Round",  icon:"💻", questions:["Explain the difference between == and === in JavaScript.","What is the event loop in Node.js?","Explain REST vs GraphQL.","What is a closure in JavaScript?","How does React's virtual DOM work?"] },
  { id:"coding",   label:"Coding Round",     icon:"⌨️", questions:["Write a function to reverse a string.","Find the two numbers that sum to a target.","Check if a string has balanced parentheses.","Find the maximum subarray sum.","Implement a debounce function."] },
  { id:"system",   label:"System Design",    icon:"🏗️", questions:["Design a URL shortener like bit.ly.","Design a real-time chat application.","Design a notification system.","How would you design Twitter's feed?","Design a rate limiter."] },
];

const TIMER_TOTAL = 120;

export default function InterviewRoom({ socket, user, apiKey }) {
  const [round,      setRound]      = useState(null);
  const [qIdx,       setQIdx]       = useState(0);
  const [answer,     setAnswer]     = useState("");
  const [feedback,   setFeedback]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [timeLeft,   setTimeLeft]   = useState(TIMER_TOTAL);
  const [score,      setScore]      = useState(0);
  const [done,       setDone]       = useState(false);
  const [aiTyping,   setAiTyping]   = useState(false);
  const timerRef = useRef(null);
  const roomId   = `interview_${user?.id || "guest"}_${round?.id || ""}`;

  useEffect(() => {
    if (!round || done) return;
    setTimeLeft(TIMER_TOTAL);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qIdx, round]);

  useEffect(() => {
    if (!socket || !round) return;
    joinRoom(roomId, "interview");
    const handler = (data) => {
      if (data.event === "feedback") setFeedback(data.data);
    };
    socket.on("interview-update", handler);
    return () => { leaveRoom(roomId); socket.off("interview-update", handler); };
  }, [socket, round, roomId]);

  async function handleSubmit(timedOut = false) {
    clearInterval(timerRef.current);
    if (!answer.trim() && !timedOut) return;
    setLoading(true); setAiTyping(true);

    const q = round.questions[qIdx];
    const prompt = `You are an expert interviewer. Evaluate this answer for the question: "${q}"\n\nAnswer: "${answer || "(No answer — timed out)"}"\n\nProvide: 1) Score out of 10, 2) What was good, 3) What to improve, 4) Model answer in 2-3 sentences. Be concise.`;

    let fb = { score:5, good:"Attempted the question.", improve:"Provide more detail.", model:"A strong answer would include specific examples and technical depth." };
    try {
      if (apiKey) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{temperature:0.5,maxOutputTokens:400} })
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates[0]?.content?.parts[0]?.text || "";
          const scoreMatch = text.match(/(\d+)\s*\/\s*10/);
          fb = { score: scoreMatch ? parseInt(scoreMatch[1]) : 6, raw: text, good:"", improve:"", model:"" };
        }
      }
    } catch {}

    setAiTyping(false);
    setFeedback(fb);
    setScore(s => s + (fb.score || 5));
    if (socket) emitInterviewEvent(roomId, "feedback", fb);
    setLoading(false);
  }

  function nextQuestion() {
    if (qIdx < round.questions.length - 1) {
      setQIdx(i => i + 1); setAnswer(""); setFeedback(null);
    } else {
      setDone(true);
    }
  }

  const urgent = timeLeft <= 20;
  const pct    = (timeLeft / TIMER_TOTAL) * 100;

  if (!round) return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:700, color:G.text }}>🎯 Mock Interview Simulator</div>
      <div style={{ fontSize:13, color:G.muted, marginBottom:4 }}>Choose a round to start your AI-powered mock interview</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {ROUNDS.map(r => (
          <button key={r.id} onClick={() => { setRound(r); setQIdx(0); setAnswer(""); setFeedback(null); setScore(0); setDone(false); }}
            style={{ background:G.surface, border:`1px solid ${G.border}`, borderRadius:14, padding:"18px 16px", cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=G.accent+"60";e.currentTarget.style.background=G.accentDim;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=G.border;e.currentTarget.style.background=G.surface;}}>
            <div style={{ fontSize:24, marginBottom:8 }}>{r.icon}</div>
            <div style={{ fontSize:13, fontWeight:700, color:G.text, marginBottom:4 }}>{r.label}</div>
            <div style={{ fontSize:11, color:G.muted }}>{r.questions.length} questions · AI feedback</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (done) return (
    <div style={{ textAlign:"center", padding:"24px 0" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🏆</div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:800, color:G.accent, marginBottom:8 }}>Interview Complete!</div>
      <div style={{ fontSize:14, color:G.muted, marginBottom:20 }}>{round.label} · {round.questions.length} questions</div>
      <div style={{ display:"inline-block", background:`linear-gradient(135deg,${G.accent}20,${G.purple}20)`, border:`1px solid ${G.accent}40`, borderRadius:16, padding:"16px 32px", marginBottom:20 }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:36, fontWeight:900, color:G.accent }}>{Math.round(score/round.questions.length)}/10</div>
        <div style={{ fontSize:12, color:G.muted }}>Average Score</div>
      </div>
      <br/>
      <button onClick={() => { setRound(null); setDone(false); }} style={{ background:`linear-gradient(135deg,${G.accent},${G.purple})`, border:"none", borderRadius:10, padding:"10px 24px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Try Another Round</button>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>{round.icon}</span>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:700, color:G.text }}>{round.label}</span>
          <span style={{ fontSize:11, color:G.muted }}>Q{qIdx+1}/{round.questions.length}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ position:"relative", width:44, height:44 }}>
            <svg width={44} height={44} style={{ transform:"rotate(-90deg)" }}>
              <circle cx={22} cy={22} r={18} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={3}/>
              <circle cx={22} cy={22} r={18} fill="none" stroke={urgent?G.danger:G.accent} strokeWidth={3}
                strokeDasharray={`${(pct/100)*113} 113`} strokeLinecap="round"
                style={{ transition:"stroke-dasharray 0.9s linear", filter:`drop-shadow(0 0 4px ${urgent?G.danger:G.accent})` }}/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:urgent?G.danger:G.text }}>{timeLeft}</div>
          </div>
          <button onClick={() => setRound(null)} style={{ background:"none", border:`1px solid ${G.border}`, borderRadius:8, padding:"5px 10px", color:G.muted, fontSize:11, cursor:"pointer" }}>✕ Exit</button>
        </div>
      </div>

      {/* Question */}
      <div style={{ background:G.surface, borderRadius:14, padding:"16px 18px", border:`1px solid ${G.border}` }}>
        <div style={{ fontSize:11, color:G.accent, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Question {qIdx+1}</div>
        <div style={{ fontSize:15, color:G.text, lineHeight:1.6, fontWeight:500 }}>{round.questions[qIdx]}</div>
      </div>

      {/* Answer */}
      {!feedback && (
        <>
          <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Type your answer here..." rows={5}
            style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${G.border}`, borderRadius:12, padding:"12px 14px", color:G.text, fontSize:13, outline:"none", resize:"vertical", fontFamily:"'Inter',sans-serif", lineHeight:1.6 }}/>
          <button onClick={() => handleSubmit(false)} disabled={loading}
            style={{ background:loading?"rgba(255,107,157,0.3)":`linear-gradient(135deg,${G.accent},${G.purple})`, border:"none", borderRadius:10, padding:"11px 0", color:"#fff", fontSize:13, fontWeight:700, cursor:loading?"not-allowed":"pointer" }}>
            {loading ? "AI is evaluating..." : "Submit Answer →"}
          </button>
          {aiTyping && <TypingIndicator label="AI Interviewer is evaluating"/>}
        </>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{ background:G.surface, borderRadius:14, padding:"16px 18px", border:`1px solid ${G.success}30`, animation:"fadeUp 0.3s ease" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:700, color:G.text }}>AI Feedback</span>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:900, color:feedback.score>=7?G.success:feedback.score>=5?G.warning:G.danger }}>{feedback.score}/10</span>
          </div>
          {feedback.raw ? (
            <div style={{ fontSize:12, color:G.muted, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{feedback.raw}</div>
          ) : (
            <>
              <div style={{ fontSize:12, color:G.success, marginBottom:6 }}>✓ {feedback.good}</div>
              <div style={{ fontSize:12, color:G.warning, marginBottom:6 }}>→ {feedback.improve}</div>
              <div style={{ fontSize:12, color:G.muted }}>💡 {feedback.model}</div>
            </>
          )}
          <button onClick={nextQuestion} style={{ marginTop:12, background:`linear-gradient(135deg,${G.accent},${G.purple})`, border:"none", borderRadius:10, padding:"9px 20px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            {qIdx < round.questions.length-1 ? "Next Question →" : "Finish Interview 🏆"}
          </button>
        </div>
      )}
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
