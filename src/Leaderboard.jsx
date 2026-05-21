import React, { useState, useMemo } from "react";

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

// Raw unsorted users with mock scores
const RAW_USERS = [
  { name: "StealthNinja42", points: 100.00, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Stealth&backgroundColor=transparent", prize: 500.00 },
  { name: "EpicGamerX", points: 70.00, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Epic&backgroundColor=transparent", prize: 250.00 },
  { name: "PixelWarrior99", points: 20.00, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pixel&backgroundColor=transparent", prize: 100.00 },
  { name: "NinjaWarriorZ", points: 512.00, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ninja&backgroundColor=transparent", prize: 120.50 },
  { name: "PixelProwler99", points: 789.00, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prowler&backgroundColor=transparent", prize: 85.75 },
  { name: "CodeMaster", points: 642.00, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=CodeMaster&backgroundColor=transparent", prize: 50.00 },
  { name: "ShadowCoder", points: 590.00, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Shadow&backgroundColor=transparent", prize: 30.00 },
  { name: "BugHunter", points: 410.00, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=BugHunter&backgroundColor=transparent", prize: 15.00 },
  { name: "You", points: 850.00, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=You&backgroundColor=transparent", prize: 0.00, isYou: true },
];

export default function Leaderboard() {
  const [tab, setTab] = useState("Daily");

  // Dynamically sort and assign ranks
  const leaderboardData = useMemo(() => {
    // Sort descending by points
    const sorted = [...RAW_USERS].sort((a, b) => b.points - a.points);
    // Assign rank
    return sorted.map((user, index) => ({ ...user, rank: index + 1 }));
  }, []);

  // Top 3 for Pedestals
  const top3 = leaderboardData.slice(0, 3);
  // Reorder for UI rendering: 2nd on left, 1st in center, 3rd on right
  const pedestals = [
    { ...top3[1], position: 2 },
    { ...top3[0], position: 1 },
    { ...top3[2], position: 3 }
  ];

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

      {/* 3D Pedestals */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", height: 350, gap: 16, marginBottom: 64 }}>
        {pedestals.map((p, i) => (
          p && <Pedestal key={i} rank={p.position} player={p} height={p.position === 1 ? 260 : p.position === 2 ? 180 : 150} />
        ))}
      </div>

      {/* Leaderboard Table */}
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
              <img src={p.avatar} style={{ width: 32, height: 32, borderRadius: "50%", background: "#fdfbf7", border: "1px solid rgba(128,0,0,0.1)" }} alt="" />
              <span style={{ fontWeight: 700, color: "#451a1a" }}>{p.name} {p.isYou && "(You)"}</span>
            </div>
            <div style={{ fontWeight: 700, color: "#451a1a" }}>{p.points.toFixed(2)}</div>
            <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#7f1d1d", fontSize: 12 }}>⭐</span>
              <span style={{ fontWeight: 700, color: "#451a1a" }}>{p.prize.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pedestal({ rank, player, height }) {
  const isWinner = rank === 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 260, position: "relative" }}>
      {/* Player Info layout exactly like image */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 20, zIndex: 10, position: "relative" }}>
        {isWinner && (
          <div style={{ position: "absolute", top: -55, zIndex: 11 }}>
            <img src="https://img.icons8.com/fluency/96/jester-hat.png" style={{ width: 70, height: 70, filter: "drop-shadow(0 4px 10px rgba(128,0,0,0.3))" }} alt="Winner Hat" />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Avatar with rank pill inside */}
          <div style={{ position: "relative" }}>
            <img src={player.avatar} style={{ width: isWinner ? 80 : 64, height: isWinner ? 80 : 64, borderRadius: "50%", border: `3px solid #fdfbf7`, background: "#fdfbf7", boxShadow: "0 10px 20px rgba(128,0,0,0.2)" }} alt="" />
            <div style={{ position: "absolute", bottom: -2, right: -2, background: "#7f1d1d", color: "white", fontSize: 11, fontWeight: 800, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fdfbf7", boxShadow: "0 2px 5px rgba(128,0,0,0.3)" }}>
              {rank}
            </div>
          </div>
          
          {/* Name and Points pill to the right */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#451a1a" }}>{player.name}</div>
            <div style={{ background: "linear-gradient(135deg, #991b1b, #7f1d1d)", border: "1px solid rgba(128,0,0,0.2)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 10px rgba(128,0,0,0.2)" }}>
               <span style={{ background: "#fff", color: "#991b1b", borderRadius: "50%", width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>✦</span> 
               {player.points.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Box Simulation using perspective on top face */}
      <div style={{ position: "relative", width: "100%", height: height }}>
        {/* Top Face */}
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
        {/* Front Face */}
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
            {rank}{rank === 1 ? 'st' : rank === 2 ? 'nd' : 'rd'}
          </span>
        </div>
      </div>
    </div>
  );
}

