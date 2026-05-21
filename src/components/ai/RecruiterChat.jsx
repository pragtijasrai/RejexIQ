import { useState, useEffect, useRef } from "react";
import { joinRoom, leaveRoom, sendMessage, emitTyping, emitStopTyping } from "../../socket.js";
import TypingIndicator from "./TypingIndicator.jsx";
import PresenceIndicator from "./PresenceIndicator.jsx";
const G = { bg:"#0a0e27",surface:"#141b3a",card:"#1a2347",border:"#2d3a5f",accent:"#ff6b9d",accentDim:"rgba(255,107,157,0.15)",purple:"#c084fc",cyan:"#22d3ee",text:"#f0f4ff",muted:"#94a3b8",success:"#34d399",warning:"#fbbf24",danger:"#f87171" };

const DEMO_RECRUITERS = [
  { id:"r1", name:"Priya Sharma",   company:"Google",    role:"Senior Recruiter",  avatar:"P", online:true,  unread:2 },
  { id:"r2", name:"Rahul Mehta",    company:"Amazon",    role:"Tech Recruiter",    avatar:"R", online:true,  unread:0 },
  { id:"r3", name:"Ananya Singh",   company:"Microsoft", role:"HR Manager",        avatar:"A", online:false, unread:1 },
  { id:"r4", name:"Dev Kapoor",     company:"Flipkart",  role:"Campus Recruiter",  avatar:"D", online:false, unread:0 },
];

export default function RecruiterChat({ socket, user }) {
  const [selected,  setSelected]  = useState(DEMO_RECRUITERS[0]);
  const [messages,  setMessages]  = useState({ r1:[{id:1,from:"r1",text:"Hi! I saw your profile on RejexIQ. Your React skills are impressive. Are you open to opportunities at Google?",time:"10:32 AM"}], r2:[], r3:[{id:1,from:"r3",text:"We have an opening for a Full Stack Developer. Would you be interested?",time:"Yesterday"}], r4:[] });
  const [input,     setInput]     = useState("");
  const [typing,    setTyping]    = useState([]);
  const typingTimer = useRef(null);
  const msgRef      = useRef(null);
  const roomId      = `recruiter_${selected.id}`;

  useEffect(() => {
    if (!socket) return;
    joinRoom(roomId, "recruiter");
    const onMsg = (msg) => {
      if (msg.roomId !== roomId) return;
      setMessages(prev => ({ ...prev, [selected.id]: [...(prev[selected.id]||[]), { id:msg.id, from:msg.sender.id, text:msg.text, time:new Date(msg.timestamp).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }] }));
    };
    const onTyping = (data) => { if (data.roomId === roomId) setTyping(data.users); };
    socket.on("receive-message", onMsg);
    socket.on("typing-update", onTyping);
    return () => { leaveRoom(roomId); socket.off("receive-message", onMsg); socket.off("typing-update", onTyping); };
  }, [socket, roomId]);

  useEffect(() => {
    msgRef.current?.scrollTo({ top: msgRef.current.scrollHeight, behavior:"smooth" });
  }, [messages, selected.id]);

  function handleSend() {
    if (!input.trim()) return;
    const msg = { id:Date.now(), from:"me", text:input.trim(), time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
    setMessages(prev => ({ ...prev, [selected.id]: [...(prev[selected.id]||[]), msg] }));
    if (socket) sendMessage(roomId, input.trim());
    setInput("");
    emitStopTyping(roomId);
  }

  function handleInputChange(v) {
    setInput(v);
    if (socket) {
      emitTyping(roomId);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => emitStopTyping(roomId), 1500);
    }
  }

  const msgs = messages[selected.id] || [];

  return (
    <div style={{ display:"flex", height:480, borderRadius:16, overflow:"hidden", border:`1px solid ${G.border}` }}>
      {/* Sidebar */}
      <div style={{ width:220, background:G.surface, borderRight:`1px solid ${G.border}`, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"14px 14px 10px", borderBottom:`1px solid ${G.border}` }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:G.text }}>💼 Recruiters</div>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {DEMO_RECRUITERS.map(r => (
            <div key={r.id} onClick={() => setSelected(r)}
              style={{ padding:"10px 14px", cursor:"pointer", background:selected.id===r.id?G.accentDim:"transparent", borderLeft:`3px solid ${selected.id===r.id?G.accent:"transparent"}`, transition:"all 0.15s", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${G.accent},${G.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>{r.avatar}</div>
                <div style={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", background:r.online?G.success:G.muted, border:`2px solid ${G.surface}` }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:G.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.name}</div>
                <div style={{ fontSize:10, color:G.muted }}>{r.company}</div>
              </div>
              {r.unread > 0 && <span style={{ background:`linear-gradient(135deg,${G.accent},${G.purple})`, color:"#fff", fontSize:9, fontWeight:800, borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center" }}>{r.unread}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:G.card }}>
        {/* Header */}
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${G.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${G.accent},${G.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>{selected.avatar}</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:G.text }}>{selected.name}</div>
            <div style={{ fontSize:11, color:G.muted, display:"flex", alignItems:"center", gap:4 }}>
              <PresenceIndicator online={selected.online} size={6}/>
              {selected.company} · {selected.role}
            </div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            <button style={{ background:"rgba(52,211,153,0.1)", border:`1px solid ${G.success}30`, borderRadius:8, padding:"5px 12px", color:G.success, fontSize:11, fontWeight:600, cursor:"pointer" }}>📅 Schedule</button>
          </div>
        </div>

        {/* Messages */}
        <div ref={msgRef} style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map(m => (
            <div key={m.id} style={{ display:"flex", flexDirection:"column", alignItems:m.from==="me"?"flex-end":"flex-start" }}>
              <div style={{ maxWidth:"75%", padding:"10px 14px", borderRadius:m.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.from==="me"?`linear-gradient(135deg,${G.accent},${G.purple})`:"rgba(255,255,255,0.06)", color:G.text, fontSize:13, lineHeight:1.5 }}>
                {m.text}
              </div>
              <div style={{ fontSize:10, color:G.muted, marginTop:3 }}>{m.time}</div>
            </div>
          ))}
          {typing.length > 0 && <TypingIndicator users={typing}/>}
        </div>

        {/* Input */}
        <div style={{ padding:"10px 14px", borderTop:`1px solid ${G.border}`, display:"flex", gap:8 }}>
          <input value={input} onChange={e=>handleInputChange(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend()} placeholder={`Message ${selected.name}...`}
            style={{ flex:1, background:"rgba(255,255,255,0.04)", border:`1px solid ${G.border}`, borderRadius:10, padding:"9px 14px", color:G.text, fontSize:13, outline:"none", fontFamily:"'Inter',sans-serif" }}/>
          <button onClick={handleSend} style={{ background:`linear-gradient(135deg,${G.accent},${G.purple})`, border:"none", borderRadius:10, padding:"9px 16px", color:"#fff", fontSize:14, cursor:"pointer" }}>→</button>
        </div>
      </div>
    </div>
  );
}
