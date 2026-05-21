const G = { accent:"#ff6b9d", purple:"#c084fc", muted:"#94a3b8", card:"#1a2347", border:"#2d3a5f" };

export default function TypingIndicator({ users = [], label }) {
  if (!users.length && !label) return null;
  const text = label || (users.length === 1
    ? `${users[0]} is typing`
    : users.length === 2
    ? `${users[0]} and ${users[1]} are typing`
    : `${users[0]} and ${users.length - 1} others are typing`);

  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", animation:"fadeIn 0.3s ease" }}>
      <div style={{ display:"flex", gap:3, alignItems:"center" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:6, height:6, borderRadius:"50%",
            background:`linear-gradient(135deg,${G.accent},${G.purple})`,
            animation:`typingBounce 1.2s ease-in-out ${i*0.2}s infinite`,
          }}/>
        ))}
      </div>
      <span style={{ fontSize:12, color:G.muted, fontStyle:"italic" }}>{text}...</span>
      <style>{`
        @keyframes typingBounce {
          0%,60%,100%{transform:translateY(0)}
          30%{transform:translateY(-6px)}
        }
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>
    </div>
  );
}
