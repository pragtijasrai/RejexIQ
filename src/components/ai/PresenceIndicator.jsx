const G = { success:"#34d399", muted:"#94a3b8", warning:"#fbbf24" };

export default function PresenceIndicator({ online = true, label, size = 8 }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{
        width:size, height:size, borderRadius:"50%",
        background: online ? G.success : G.muted,
        display:"inline-block",
        boxShadow: online ? `0 0 ${size}px ${G.success}80` : "none",
        animation: online ? "presencePulse 2s ease-in-out infinite" : "none",
        flexShrink:0,
      }}/>
      {label && <span style={{ fontSize:11, color: online ? G.success : G.muted }}>{label}</span>}
      <style>{`
        @keyframes presencePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.3)}}
      `}</style>
    </span>
  );
}
