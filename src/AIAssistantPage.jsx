import { useState, useEffect, useRef, useCallback } from "react";
import { connectSocket, disconnectSocket, getSocket, joinRoom, leaveRoom, sendMessage, emitTyping, emitStopTyping } from "./socket.js";
import TypingIndicator   from "./components/ai/TypingIndicator.jsx";
import PresenceIndicator from "./components/ai/PresenceIndicator.jsx";
import NotificationCenter from "./components/ai/NotificationCenter.jsx";
import ResumeAnalyzer    from "./components/ai/ResumeAnalyzer.jsx";
import RecruiterChat     from "./components/ai/RecruiterChat.jsx";
import InterviewRoom     from "./components/ai/InterviewRoom.jsx";
import CodingSession     from "./components/ai/CodingSession.jsx";
import LiveDashboardCard from "./components/ai/LiveDashboardCard.jsx";

const G = { bg:"#0a0e27",surface:"#141b3a",card:"#1a2347",border:"#2d3a5f",accent:"#ff6b9d",accentDim:"rgba(255,107,157,0.15)",purple:"#c084fc",cyan:"#22d3ee",text:"#f0f4ff",muted:"#94a3b8",success:"#34d399",warning:"#fbbf24",danger:"#f87171" };

const TABS = [
  { id:"chat",      icon:"🤖", label:"AI Chat"       },
  { id:"interview", icon:"🎯", label:"Interview"     },
  { id:"coding",    icon:"💻", label:"Coding"        },
  { id:"resume",    icon:"📄", label:"Resume"        },
  { id:"recruiter", icon:"💼", label:"Recruiters"    },
];

const SUGGESTIONS = [
  "How do I improve my backend skills?",
  "What skills should I learn for frontend?",
  "How to prepare for technical interviews?",
  "What projects should I build for my portfolio?",
  "How to improve my system design knowledge?",
  "What is the best way to learn DSA?",
];

// ── Streaming text animation ──────────────────────────────────────────────────
function StreamingText({ text, speed = 12 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span style={{ whiteSpace:"pre-wrap" }}>{displayed}{!done && <span style={{ borderRight:`2px solid ${G.accent}`, animation:"blink 0.7s infinite", marginLeft:1 }}/>}</span>;
}

// ── Code block renderer ───────────────────────────────────────────────────────
function renderMessage(text) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const lang  = lines[0].trim();
      const code  = lines.slice(1).join("\n");
      return (
        <div key={i} style={{ background:"#0d1117", borderRadius:10, padding:"12px 14px", margin:"8px 0", border:`1px solid ${G.border}`, position:"relative" }}>
          {lang && <div style={{ fontSize:10, color:G.accent, marginBottom:6, fontWeight:700, textTransform:"uppercase" }}>{lang}</div>}
          <pre style={{ fontFamily:"'Fira Code',monospace", fontSize:12, color:"#f0f4ff", margin:0, overflowX:"auto", lineHeight:1.7 }}>{code}</pre>
        </div>
      );
    }
    // Render **bold** and bullet points
    const formatted = part
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f0f4ff">$1</strong>')
      .replace(/^• /gm, '&bull; ')
      .replace(/^- /gm, '&bull; ');
    return <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} style={{ whiteSpace:"pre-wrap", lineHeight:1.7 }}/>;
  });
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AIAssistantPage({ user }) {
  const [tab,          setTab]          = useState("chat");
  const [messages,     setMessages]     = useState([
    { id:1, role:"assistant", text:`Hi ${user?.name || "there"}! 👋 I'm your AI Career Assistant powered by Google Gemini.\n\nI can help you with:\n• **Skill improvement** tips\n• **Career guidance** and role matching\n• **Interview preparation**\n• **Portfolio project** ideas\n• **System design** concepts\n\nWhat would you like to explore today?`, ts: new Date().toISOString(), streaming:false }
  ]);
  const [input,        setInput]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [apiKey,       setApiKey]       = useState(() => {
    // Prefer localStorage (user-entered) over env key, so a manually entered key takes priority
    const stored = localStorage.getItem("gemini_api_key");
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const key = stored || (envKey && envKey !== "your_gemini_api_key" ? envKey : "");
    return key;
  });
  const [showKeyInput, setShowKeyInput] = useState(false); // No longer needed — backend handles API key
  const [socket,       setSocket]       = useState(null);
  const [connected,    setConnected]    = useState(false);
  const [aiTyping,     setAiTyping]     = useState(false);
  const [onlineCount,  setOnlineCount]  = useState(1);
  const msgRef      = useRef(null);
  const typingTimer = useRef(null);
  const ROOM_ID     = `ai_chat_${user?.id || "guest"}`;

  // ── Connect socket ──────────────────────────────────────────────────────────
  useEffect(() => {
    const s = connectSocket(user);
    setSocket(s);
    s.on("connect",    () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("online-users", (users) => setOnlineCount(users.length));
    joinRoom(ROOM_ID, "ai");
    return () => { leaveRoom(ROOM_ID); };
  }, []);

  // ── Auto scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setTimeout(() => msgRef.current?.scrollTo({ top: msgRef.current.scrollHeight, behavior:"smooth" }), 80);
  }, [messages, aiTyping]);

  // ── Send message ────────────────────────────────────────────────────────────
  const send = useCallback(async (text) => {
    const q = (text || input).trim();
    if (!q) return;
    emitStopTyping(ROOM_ID);
    const userMsg = { id:Date.now(), role:"user", text:q, ts:new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setAiTyping(true);
    if (socket) sendMessage(ROOM_ID, q);
    const response = await callGemini(q, apiKey);
    setAiTyping(false);
    setLoading(false);
    const aiMsg = { id:Date.now()+1, role:"assistant", text:response, ts:new Date().toISOString(), streaming:true };
    setMessages(prev => [...prev, aiMsg]);
    setTimeout(() => setMessages(prev => prev.map(m => m.id===aiMsg.id ? {...m,streaming:false} : m)), response.length*12+500);
  }, [input, apiKey, socket]);

  async function callGemini(userMessage, apiKey = "") {
    try {
      // Use relative URL so Vite proxy handles it — no CORS issues
      const res = await fetch(`/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          userName: user?.name || "User",
          skills: user?.skills || {},
          geminiApiKey: apiKey.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI request failed");
      return data.text;
    } catch(e) {
      return `Sorry, I encountered an error: ${e.message}. Make sure the backend server is running (npm run server).`;
    }
  }

  function handleInputChange(v) {
    setInput(v);
    if (socket) {
      emitTyping(ROOM_ID);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => emitStopTyping(ROOM_ID), 1500);
    }
  }

  function saveApiKey() {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setShowKeyInput(false);
      setMessages([{ id:Date.now(), role:"assistant", text:"API key saved! I'm now connected to Google Gemini AI. Ask me anything about your career! 🚀", ts:new Date().toISOString(), streaming:false }]);
    }
  }

  // ── API Key setup screen ────────────────────────────────────────────────────
  if (showKeyInput) return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:"40px 0" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:64, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>🤖</div>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:800, color:G.text, marginBottom:8 }}>AI Career Assistant</h1>
        <p style={{ color:G.muted }}>Powered by Google Gemini AI</p>
      </div>
      <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:20, padding:32 }}>
        <div style={{ background:G.surface, borderRadius:12, padding:20, marginBottom:24 }}>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:700, color:G.text, marginBottom:12 }}>How to get your free API key:</h3>
          <ol style={{ color:G.muted, fontSize:13, lineHeight:2, paddingLeft:20 }}>
            <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color:G.accent }}>Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Click "Create API Key"</li>
            <li>Copy and paste it below</li>
          </ol>
        </div>
        <label style={{ display:"block", fontSize:12, fontWeight:700, color:G.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Gemini API Key</label>
        <input type="password" placeholder="AIza..." value={apiKey} onChange={e=>setApiKey(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveApiKey()}
          style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid ${G.border}`, borderRadius:10, padding:"12px 16px", color:G.text, fontSize:14, outline:"none", marginBottom:16, fontFamily:"'Inter',sans-serif", transition:"border-color 0.2s" }}
          onFocus={e=>{e.target.style.borderColor=G.accent;}} onBlur={e=>{e.target.style.borderColor=G.border;}}/>
        <button onClick={saveApiKey} style={{ width:"100%", background:`linear-gradient(135deg,${G.accent},${G.purple})`, border:"none", borderRadius:12, padding:"13px 0", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 20px rgba(255,107,157,0.3)` }}>
          Connect AI Assistant →
        </button>
        <p style={{ fontSize:11, color:G.muted, textAlign:"center", marginTop:12 }}>Your API key is stored locally and used to connect this session to Google Gemini.</p>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .ai-tab:hover{background:rgba(255,255,255,0.06)!important;color:#f0f4ff!important}
        .ai-tab.active{background:rgba(255,107,157,0.15)!important;color:#ff6b9d!important;border-color:rgba(255,107,157,0.4)!important}
        .msg-bubble{animation:fadeUp 0.3s ease}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:800, color:G.text, marginBottom:4, background:`linear-gradient(135deg,${G.text},${G.accent})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            ⚡ AI Career Platform
          </h1>
          <div style={{ display:"flex", alignItems:"center", gap:12, fontSize:12, color:G.muted }}>
            <PresenceIndicator online={connected} label={connected?"Socket Connected":"Connecting..."}/>
            <span>·</span>
            <span>🟢 {onlineCount} online</span>
            <span>·</span>
            <span style={{ color:G.accent }}>Gemini AI Active</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <NotificationCenter socket={socket}/>
          <button onClick={() => { localStorage.removeItem("gemini_api_key"); setShowKeyInput(true); }}
            style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${G.border}`, borderRadius:8, padding:"7px 14px", color:G.muted, fontSize:12, cursor:"pointer" }}>
            Change API Key
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`ai-tab${tab===t.id?" active":""}`}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, border:`1px solid ${G.border}`, background:"rgba(255,255,255,0.03)", color:G.muted, fontSize:13, fontWeight:500, cursor:"pointer", transition:"all 0.2s", fontFamily:"'Inter',sans-serif" }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── AI CHAT TAB ── */}
      {tab === "chat" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:20, alignItems:"start" }}>
          {/* Chat panel */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:20, display:"flex", flexDirection:"column", height:580, overflow:"hidden" }}>
            {/* Chat header */}
            <div style={{ padding:"14px 20px", borderBottom:`1px solid ${G.border}`, display:"flex", alignItems:"center", gap:12, background:"rgba(0,0,0,0.15)" }}>
              <div style={{ fontSize:28, animation:"float 3s ease-in-out infinite" }}>🤖</div>
              <div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:700, color:G.text }}>Gemini AI Assistant</div>
                <PresenceIndicator online={true} label="Online · Powered by Google Gemini" size={6}/>
              </div>
              <div style={{ marginLeft:"auto", fontSize:11, color:G.muted, background:"rgba(255,255,255,0.04)", borderRadius:20, padding:"3px 10px" }}>
                {messages.length - 1} messages
              </div>
            </div>

            {/* Messages */}
            <div ref={msgRef} style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>
              {messages.map(m => (
                <div key={m.id} className="msg-bubble" style={{ display:"flex", flexDirection:"column", alignItems:m.role==="user"?"flex-end":"flex-start" }}>
                  {m.role==="assistant" && (
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <span style={{ fontSize:16 }}>🤖</span>
                      <span style={{ fontSize:11, color:G.muted }}>Gemini AI · {new Date(m.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                  )}
                  <div style={{ maxWidth:"82%", padding:"12px 16px", borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", background:m.role==="user"?`linear-gradient(135deg,${G.accent},${G.purple})`:"rgba(255,255,255,0.06)", border:m.role==="assistant"?`1px solid ${G.border}`:"none", color:G.text, fontSize:13, lineHeight:1.7 }}>
                    {m.role==="assistant"
                      ? (m.streaming ? <StreamingText text={m.text}/> : renderMessage(m.text))
                      : m.text}
                  </div>
                  {m.role==="user" && <div style={{ fontSize:10, color:G.muted, marginTop:3 }}>{new Date(m.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>}
                </div>
              ))}
              {aiTyping && (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:16 }}>🤖</span>
                  <TypingIndicator label="AI is thinking"/>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding:"12px 16px", borderTop:`1px solid ${G.border}`, display:"flex", gap:8, background:"rgba(0,0,0,0.1)" }}>
              <input value={input} onChange={e=>handleInputChange(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Ask me anything about your career..."
                style={{ flex:1, background:"rgba(255,255,255,0.05)", border:`1px solid ${G.border}`, borderRadius:12, padding:"11px 16px", color:G.text, fontSize:13, outline:"none", fontFamily:"'Inter',sans-serif", transition:"border-color 0.2s" }}
                onFocus={e=>{e.target.style.borderColor=G.accent;}} onBlur={e=>{e.target.style.borderColor=G.border;}}/>
              <button onClick={() => send()} disabled={loading || !input.trim()}
                style={{ background:loading||!input.trim()?"rgba(255,107,157,0.2)":`linear-gradient(135deg,${G.accent},${G.purple})`, border:"none", borderRadius:12, padding:"11px 18px", color:"#fff", fontSize:16, cursor:loading||!input.trim()?"not-allowed":"pointer", boxShadow:`0 4px 14px rgba(255,107,157,0.3)`, transition:"all 0.2s" }}>
                {loading ? <span style={{ animation:"spin 0.8s linear infinite", display:"inline-block" }}>⟳</span> : "→"}
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Live dashboard */}
            <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:G.text, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
                📊 Live Stats
                <span style={{ fontSize:9, color:G.success, background:"rgba(52,211,153,0.1)", borderRadius:20, padding:"2px 6px", fontWeight:700 }}>LIVE</span>
              </div>
              <LiveDashboardCard socket={socket} user={user}/>
            </div>

            {/* Quick prompts */}
            <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, fontWeight:700, color:G.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>Quick Questions</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {SUGGESTIONS.map((s,i) => (
                  <button key={i} onClick={() => send(s)}
                    style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${G.border}`, borderRadius:8, padding:"8px 12px", color:G.muted, fontSize:11, cursor:"pointer", textAlign:"left", transition:"all 0.2s", lineHeight:1.4 }}
                    onMouseEnter={e=>{e.currentTarget.style.background=G.accentDim;e.currentTarget.style.color=G.accent;e.currentTarget.style.borderColor=G.accent+"40";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.color=G.muted;e.currentTarget.style.borderColor=G.border;}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* User profile card */}
            {user?.skills && Object.keys(user.skills).length > 0 && (
              <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:16, padding:16 }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, fontWeight:700, color:G.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>Your Profile</div>
                {Object.entries(user.skills).slice(0,4).map(([k,v]) => (
                  <div key={k} style={{ marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                      <span style={{ color:G.muted }}>{k}</span>
                      <span style={{ color:G.accent, fontWeight:700 }}>{v}%</span>
                    </div>
                    <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
                      <div style={{ height:"100%", width:`${v}%`, background:`linear-gradient(90deg,${G.accent},${G.purple})`, borderRadius:2 }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── INTERVIEW TAB ── */}
      {tab === "interview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:20, padding:24 }}>
            <InterviewRoom socket={socket} user={user} apiKey={apiKey}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:G.text, marginBottom:12 }}>Interview Tips</div>
              {["Use the STAR method for behavioral questions","Think out loud during coding rounds","Ask clarifying questions before solving","Practice system design with diagrams","Research the company beforehand"].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:12, color:G.muted, lineHeight:1.5 }}>
                  <span style={{ color:G.accent, flexShrink:0 }}>→</span>{t}
                </div>
              ))}
            </div>
            <LiveDashboardCard socket={socket} user={user}/>
          </div>
        </div>
      )}

      {/* ── CODING TAB ── */}
      {tab === "coding" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>
          <CodingSession socket={socket} user={user}/>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:G.text, marginBottom:12 }}>Coding Tips</div>
              {["Always clarify constraints first","Start with brute force, then optimize","Test with edge cases","Explain your thought process","Use meaningful variable names"].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:12, color:G.muted, lineHeight:1.5 }}>
                  <span style={{ color:G.cyan, flexShrink:0 }}>→</span>{t}
                </div>
              ))}
            </div>
            <LiveDashboardCard socket={socket} user={user}/>
          </div>
        </div>
      )}

      {/* ── RESUME TAB ── */}
      {tab === "resume" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:20, padding:24 }}>
            <ResumeAnalyzer socket={socket}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:G.text, marginBottom:12 }}>Resume Tips</div>
              {["Keep it to 1 page for < 5 years experience","Use action verbs: Built, Designed, Led","Quantify achievements with numbers","Tailor keywords to each job description","Include GitHub and LinkedIn links"].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:12, color:G.muted, lineHeight:1.5 }}>
                  <span style={{ color:G.purple, flexShrink:0 }}>→</span>{t}
                </div>
              ))}
            </div>
            <LiveDashboardCard socket={socket} user={user}/>
          </div>
        </div>
      )}

      {/* ── RECRUITER TAB ── */}
      {tab === "recruiter" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>
          <RecruiterChat socket={socket} user={user}/>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:16, padding:16 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:G.text, marginBottom:12 }}>Messaging Tips</div>
              {["Respond within 24 hours","Be professional and concise","Ask about the role and team culture","Confirm interview details in writing","Follow up after interviews"].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:12, color:G.muted, lineHeight:1.5 }}>
                  <span style={{ color:G.success, flexShrink:0 }}>→</span>{t}
                </div>
              ))}
            </div>
            <LiveDashboardCard socket={socket} user={user}/>
          </div>
        </div>
      )}
    </>
  );
}
