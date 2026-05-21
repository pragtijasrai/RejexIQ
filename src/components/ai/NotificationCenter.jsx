import { useState, useEffect, useRef } from "react";
const G = { bg:"#0a0e27",surface:"#141b3a",card:"#1a2347",border:"#2d3a5f",accent:"#ff6b9d",accentDim:"rgba(255,107,157,0.15)",purple:"#c084fc",cyan:"#22d3ee",text:"#f0f4ff",muted:"#94a3b8",success:"#34d399",warning:"#fbbf24",danger:"#f87171" };

const ICONS = { interview:"🎯", message:"💬", ai:"🤖", resume:"📄", leaderboard:"🏆", coding:"💻", default:"🔔" };

export default function NotificationCenter({ socket }) {
  const [notifs, setNotifs]   = useState([]);
  const [open,   setOpen]     = useState(false);
  const [hov,    setHov]      = useState(null);
  const ref = useRef();
  const unread = notifs.filter(n => !n.read).length;

  // Demo notifications on mount
  useEffect(() => {
    setNotifs([
      { id:1, type:"interview",   title:"Interview Invite",       body:"TechCorp wants to schedule a mock interview",  read:false, time:"2m ago"  },
      { id:2, type:"ai",          title:"AI Insight Ready",       body:"Your skill gap analysis is complete",          read:false, time:"5m ago"  },
      { id:3, type:"resume",      title:"Resume Score Updated",   body:"Your ATS score improved to 87%",               read:true,  time:"1h ago"  },
      { id:4, type:"leaderboard", title:"Leaderboard Change",     body:"You moved up 3 positions this week",           read:true,  time:"3h ago"  },
    ]);
  }, []);

  // Real socket notifications
  useEffect(() => {
    if (!socket) return;
    const handler = (n) => setNotifs(prev => [n, ...prev].slice(0, 50));
    socket.on("notification", handler);
    return () => socket.off("notification", handler);
  }, [socket]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function markAll() { setNotifs(n => n.map(x => ({ ...x, read:true }))); }
  function markOne(id) { setNotifs(n => n.map(x => x.id===id ? {...x,read:true} : x)); }

  return (
    <div ref={ref} style={{ position:"relative" }}>
      {/* Bell button */}
      <button onClick={() => setOpen(o => !o)} style={{ position:"relative", background:"rgba(255,255,255,0.06)", border:`1px solid ${G.border}`, borderRadius:10, width:38, height:38, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, transition:"all 0.2s" }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,107,157,0.12)";e.currentTarget.style.borderColor=G.accent+"60";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.borderColor=G.border;}}>
        🔔
        {unread > 0 && (
          <span style={{ position:"absolute", top:-4, right:-4, background:`linear-gradient(135deg,${G.accent},${G.purple})`, color:"#fff", fontSize:9, fontWeight:800, borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", animation:"pulse 2s infinite" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position:"absolute", top:46, right:0, width:340, background:G.card, border:`1px solid ${G.border}`, borderRadius:16, boxShadow:`0 20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,107,157,0.08)`, zIndex:1000, overflow:"hidden", animation:"fadeUp 0.2s ease" }}>
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${G.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:700, color:G.text }}>Notifications {unread>0 && <span style={{ color:G.accent }}>({unread})</span>}</span>
            {unread > 0 && <button onClick={markAll} style={{ background:"none", border:"none", color:G.accent, fontSize:11, cursor:"pointer", fontWeight:600 }}>Mark all read</button>}
          </div>
          <div style={{ maxHeight:360, overflowY:"auto" }}>
            {notifs.length === 0 && <div style={{ padding:24, textAlign:"center", color:G.muted, fontSize:13 }}>No notifications yet</div>}
            {notifs.map((n,i) => (
              <div key={n.id} onClick={() => markOne(n.id)}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                style={{ padding:"12px 16px", borderBottom:`1px solid ${G.border}`, cursor:"pointer", background:hov===i?"rgba(255,255,255,0.03)":"transparent", display:"flex", gap:12, alignItems:"flex-start", transition:"background 0.15s" }}>
                <div style={{ width:36, height:36, borderRadius:10, background:n.read?"rgba(255,255,255,0.05)":`${G.accent}15`, border:`1px solid ${n.read?G.border:G.accent+"40"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                  {ICONS[n.type]||ICONS.default}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:n.read?400:600, color:n.read?G.muted:G.text, marginBottom:2 }}>{n.title}</div>
                  <div style={{ fontSize:11, color:G.muted, lineHeight:1.4 }}>{n.body}</div>
                  <div style={{ fontSize:10, color:G.muted, marginTop:4 }}>{n.time}</div>
                </div>
                {!n.read && <div style={{ width:7, height:7, borderRadius:"50%", background:G.accent, flexShrink:0, marginTop:4, boxShadow:`0 0 8px ${G.accent}` }}/>}
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}
