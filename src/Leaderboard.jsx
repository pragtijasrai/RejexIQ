import React, { useState, useEffect } from "react";

const G = {
  bg: "#0a0e27",
  surface: "#141b3a",
  card: "#1a2347",
  border: "#2d3a5f",
  accent: "#ff6b9d",
  purple: "#c084fc",
  cyan: "#22d3ee",
  text: "#f0f4ff",
  muted: "#94a3b8",
  danger: "#f87171"
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FUN_NAMES = ["Code Ninja", "Mystery Hacker", "Tech Wizard", "Pixel Pioneer", "Cyber Surfer", "Data Jedi", "Logic Lord", "Bug Hunter", "Byte Boss", "Syntax Slayer"];
function getFunName(id) {
  if (!id) return "Mystery Coder";
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return FUN_NAMES[Math.abs(hash) % FUN_NAMES.length];
}

export default function Leaderboard() {
  const [tab, setTab] = useState("Daily");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("rejexiq_token") || "";
        const res = await fetch(`${API}/api/community/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setLeaderboardData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [tab]); 

  
  const top3 = leaderboardData.slice(0, 3);
  
  const pedestals = [
    top3[1] ? { ...top3[1], position: 2 } : null,
    top3[0] ? { ...top3[0], position: 1 } : null,
    top3[2] ? { ...top3[2], position: 3 } : null
  ].filter(Boolean);

  if (loading) {
    return <div style={{ padding: 64, textAlign: "center" }}>Loading leaderboard...</div>;
  }

  return (
    <div className="section-enter" style={{ paddingBottom: 64, background: "#fdfbf7", minHeight: "100vh", padding: "32px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, color: "#451a1a" }}>Leader Board</h1>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 80, background: "rgba(128,0,0,0.05)", padding: 6, borderRadius: 12, width: "fit-content" }}>
        {["Daily", "Weekly", "Monthly"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              background: tab === t ? "linear-gradient(135deg, #991b1b, #7f1d1d)" : "transparent",
              color: tab === t ? "#fff" : "#7f1d1d",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", height: 350, gap: 16, marginBottom: 64 }}>
        {pedestals.map((p, i) => (
          p && <Pedestal key={i} rank={p.position} player={p} height={p.position === 1 ? 260 : p.position === 2 ? 180 : 150} />
        ))}
      </div>

      {}
      <div style={{ background: "#ffffff", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(128,0,0,0.1)", boxShadow: "0 10px 30px rgba(128,0,0,0.05)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 100px", padding: "16px 24px", fontSize: 12, fontWeight: 800, color: "#7f1d1d", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid rgba(128,0,0,0.1)" }}>
          <span>Place</span>
          <span>User</span>
          <span>Points</span>
          <span style={{ textAlign: "right" }}>Prize</span>
        </div>
        
        {leaderboardData.slice(3).map((p, i) => (
          <div key={i} style={{ 
            display: "grid", 
            gridTemplateColumns: "80px 1fr 100px 100px", 
            padding: "16px 24px", 
            alignItems: "center",
            background: p.isYou ? "rgba(128,0,0,0.05)" : "transparent",
            borderBottom: "1px solid rgba(128,0,0,0.05)",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => { if(!p.isYou) e.currentTarget.style.background = "rgba(128,0,0,0.02)" }}
          onMouseLeave={e => { if(!p.isYou) e.currentTarget.style.background = "transparent" }}
          >
            <div style={{ fontWeight: 800, fontSize: 16, color: "#991b1b" }}>{p.rank}th</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src={p.avatar} onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.id}&backgroundColor=transparent`; }} style={{ width: 32, height: 32, borderRadius: "50%", background: "#fdfbf7", border: "1px solid rgba(128,0,0,0.1)", objectFit: "cover" }} alt="" />
              <span style={{ fontWeight: 700, color: "#451a1a" }}>{p.name || getFunName(p.id)} {p.isYou && "(You)"}</span>
            </div>
            <div style={{ fontWeight: 700, color: "#451a1a" }}>{(p.points || 0).toFixed(2)}</div>
            <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#7f1d1d", fontSize: 12 }}>⭐</span>
              <span style={{ fontWeight: 700, color: "#451a1a" }}>{(p.prize || 0).toFixed(2)}</span>
            </div>
          </div>
        ))}
        {leaderboardData.length <= 3 && (
           <div style={{ padding: "16px 24px", color: "#991b1b", fontStyle: "italic", textAlign: "center" }}>No other players on the board yet!</div>
        )}
      </div>
    </div>
  );
}

function Pedestal({ rank, player, height }) {
  const isWinner = rank === 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 260, position: "relative" }}>
      {}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 20, zIndex: 10, position: "relative" }}>
        {isWinner && (
          <div style={{ position: "absolute", top: -55, zIndex: 11 }}>
            <img src="https://www.pngarts.com/files/12/Winner-Award-Badge-PNG-Photo.png" style={{ width: 70, height: 70, filter: "drop-shadow(0 4px 10px rgba(128,0,0,0.3))" }} alt="Winner Crown" />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {}
          <div style={{ position: "relative" }}>
            <img src={player.avatar} onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${player.id}&backgroundColor=transparent`; }} style={{ width: isWinner ? 80 : 64, height: isWinner ? 80 : 64, borderRadius: "50%", border: `3px solid #fdfbf7`, background: "#fdfbf7", boxShadow: "0 10px 20px rgba(128,0,0,0.2)", objectFit: "cover" }} alt="" />
            <div style={{ position: "absolute", bottom: -2, right: -2, background: "#7f1d1d", color: "white", fontSize: 11, fontWeight: 800, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fdfbf7", boxShadow: "0 2px 5px rgba(128,0,0,0.3)" }}>
              {rank}
            </div>
          </div>
          
          {}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#451a1a" }}>{player.name || getFunName(player.id)} {player.isYou && "(You)"}</div>
            <div style={{ background: "linear-gradient(135deg, #991b1b, #7f1d1d)", border: "1px solid rgba(128,0,0,0.2)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 10px rgba(128,0,0,0.2)" }}>
               <span style={{ background: "#fff", color: "#991b1b", borderRadius: "50%", width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>✦</span> 
               {(player.points || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {}
      <div style={{ position: "relative", width: "100%", height: height }}>
        {}
        <div style={{
           position: "absolute",
           top: -40, left: 0, width: "100%", height: 40,
           border: "1px solid rgba(128,0,0,0.4)",
           background: "rgba(128,0,0,0.15)",
           transform: "perspective(300px) rotateX(45deg)",
           transformOrigin: "bottom center",
           zIndex: 2,
           boxShadow: "inset 0 0 20px rgba(128,0,0,0.05)"
        }} />
        {}
        <div style={{
           position: "absolute",
           top: 0, left: 0, width: "100%", height: "100%",
           border: "1px solid rgba(128,0,0,0.4)",
           borderTop: "none",
           background: "linear-gradient(to bottom, rgba(128,0,0,0.15), rgba(128,0,0,0.02))",
           display: "flex",
           justifyContent: "center",
           alignItems: "center",
           zIndex: 3,
           boxShadow: "inset 0 20px 50px rgba(128,0,0,0.05)"
        }}>
          <span style={{ 
            fontSize: isWinner ? 100 : 70, 
            fontWeight: 900, 
            color: "rgba(128,0,0,0.15)",
            fontFamily: "'Space Grotesk', sans-serif",
            textShadow: "0 2px 10px rgba(253,251,247,0.5)"
          }}>
            {rank}{rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'}
          </span>
        </div>
      </div>
    </div>
  );
}
