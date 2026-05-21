import { useState, useEffect } from "react";
const G = { accent:"#ff6b9d",accentDim:"rgba(255,107,157,0.15)",purple:"#c084fc",cyan:"#22d3ee",text:"#f0f4ff",muted:"#94a3b8",success:"#34d399",warning:"#fbbf24",danger:"#f87171",border:"#2d3a5f",surface:"#141b3a",card:"#1a2347" };

export default function LiveDashboardCard({ socket, user }) {
  const [stats, setStats] = useState({
    onlineUsers: 1,
    activeSessions: 0,
    interviewsToday: 0,
    codingStreak: 7,
    aiChats: 0,
    resumeScore: 87,
  });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!socket) return;
    const handler = ({ type, data }) => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
      setStats(prev => ({ ...prev, ...data }));
    };
    socket.on("dashboard-sync", handler);
    const onUsers = (users) => setStats(prev => ({ ...prev, onlineUsers: users.length }));
    socket.on("online-users", onUsers);
    return () => { socket.off("dashboard-sync", handler); socket.off("online-users", onUsers); };
  }, [socket]);

  const cards = [
    { label:"Online Now",      value:stats.onlineUsers,      icon:"🟢", color:G.success,  suffix:"" },
    { label:"Coding Streak",   value:stats.codingStreak,     icon:"🔥", color:G.warning,  suffix:" days" },
    { label:"Resume Score",    value:stats.resumeScore,      icon:"📄", color:G.accent,   suffix:"%" },
    { label:"AI Chats Today",  value:stats.aiChats,          icon:"🤖", color:G.purple,   suffix:"" },
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
      {cards.map((c,i) => (
        <div key={i} style={{ background:G.surface, border:`1px solid ${pulse?c.color+"40":G.border}`, borderRadius:14, padding:"14px 16px", transition:"border-color 0.4s", position:"relative", overflow:"hidden" }}>
          {pulse && <div style={{ position:"absolute", inset:0, background:`${c.color}06`, borderRadius:14, animation:"fadeIn 0.4s ease" }}/>}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
            <span style={{ fontSize:20 }}>{c.icon}</span>
            <span style={{ fontSize:9, color:G.success, background:"rgba(52,211,153,0.1)", borderRadius:20, padding:"2px 6px", fontWeight:700 }}>LIVE</span>
          </div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800, color:c.color }}>{c.value}{c.suffix}</div>
          <div style={{ fontSize:11, color:G.muted, marginTop:2 }}>{c.label}</div>
        </div>
      ))}
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}
