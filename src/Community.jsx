import React, { useState } from "react";

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
  success: "#34d399",
};

const MOCK_COMMUNITY = [
  { id: 1, name: "StealthNinja42", role: "Frontend Developer", rank: 1, points: 2450, tags: ["React", "UI/UX", "CSS"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stealth&backgroundColor=e2e8f0", status: "online" },
  { id: 2, name: "EpicGamerX", role: "Full Stack Developer", rank: 2, points: 2100, tags: ["Node.js", "Python", "DSA"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Epic&backgroundColor=e2e8f0", status: "offline" },
  { id: 3, name: "PixelWarrior99", role: "Backend Engineer", rank: 3, points: 1980, tags: ["Go", "System Design", "AWS"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel&backgroundColor=e2e8f0", status: "online" },
  { id: 4, name: "DataGuru", role: "Data Scientist", rank: 14, points: 1540, tags: ["Python", "ML", "SQL"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Data&backgroundColor=e2e8f0", status: "online" },
  { id: 5, name: "AlgoMaster", role: "Student", rank: 25, points: 1200, tags: ["C++", "Competitive Programming"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Algo&backgroundColor=e2e8f0", status: "offline" },
  { id: 6, name: "DesignQueen", role: "Product Designer", rank: 42, points: 950, tags: ["Figma", "User Research"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Design&backgroundColor=e2e8f0", status: "online" },
];

export default function Community() {
  const [connections, setConnections] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMsg, setInputMsg] = useState("");

  const handleConnect = (id) => {
    if (connections.includes(id)) {
      setConnections(connections.filter(c => c !== id));
    } else {
      setConnections([...connections, id]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeChat) return;

    const newMsg = { id: Date.now(), text: inputMsg, sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    setInputMsg("");

    // Simulate auto-reply
    setTimeout(() => {
      const reply = { id: Date.now(), text: `Thanks for sharing! Let's discuss this more later.`, sender: "them", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), reply]
      }));
    }, 1500);
  };

  const handleShareNote = () => {
    if (!activeChat) return;
    const newMsg = { id: Date.now(), text: "📎 Shared 'DSA_Cheatsheet.pdf'", sender: "me", isFile: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
  };

  return (
    <div className="section-enter" style={{ paddingBottom: 64, position: "relative", minHeight: "100vh" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Community & Networking</h1>
        <p style={{ color: G.muted }}>Connect with peers, check rankings, and share study materials.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {MOCK_COMMUNITY.map(user => (
          <div key={user.id} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ position: "relative" }}>
                <img src={user.avatar} style={{ width: 64, height: 64, borderRadius: "50%", background: "#1e293b" }} alt="" />
                <div style={{
                  position: "absolute", bottom: 0, right: 0, width: 14, height: 14,
                  borderRadius: "50%", background: user.status === "online" ? G.success : G.muted,
                  border: `2px solid ${G.bg}`
                }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: G.muted, fontWeight: 600, textTransform: "uppercase" }}>Rank</div>
                <div className="syne" style={{ fontSize: 20, fontWeight: 800, color: G.cyan }}>#{user.rank}</div>
              </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{user.name}</h3>
            <p style={{ fontSize: 13, color: G.muted, marginBottom: 16 }}>{user.role} • {user.points} pts</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              {user.tags.map(tag => (
                <span key={tag} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: G.text }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button 
                onClick={() => handleConnect(user.id)}
                style={{
                  background: connections.includes(user.id) ? "rgba(255,255,255,0.1)" : G.accent,
                  color: connections.includes(user.id) ? G.text : "#000",
                  border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                {connections.includes(user.id) ? "Connected" : "Connect"}
              </button>
              <button 
                onClick={() => setActiveChat(user)}
                style={{
                  background: "transparent", color: G.text,
                  border: `1px solid ${G.border}`, borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                💬 Chat
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Overlay */}
      {activeChat && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, width: 340, height: 450,
          background: G.surface, border: `1px solid ${G.border}`, borderRadius: 16,
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column",
          zIndex: 1000, overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={activeChat.avatar} style={{ width: 32, height: 32, borderRadius: "50%", background: "#1e293b" }} alt="" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{activeChat.name}</div>
                <div style={{ fontSize: 11, color: activeChat.status === "online" ? G.success : G.muted }}>{activeChat.status === "online" ? "Online" : "Offline"}</div>
              </div>
            </div>
            <button onClick={() => setActiveChat(null)} style={{ background: "transparent", border: "none", color: G.muted, cursor: "pointer", fontSize: 18 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ textAlign: "center", fontSize: 11, color: G.muted, margin: "10px 0" }}>Today</div>
            {(messages[activeChat.id] || []).map(msg => (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "me" ? "flex-end" : "flex-start" }}>
                <div style={{
                  background: msg.isFile ? "rgba(255,107,157,0.15)" : msg.sender === "me" ? G.accent : "rgba(255,255,255,0.05)",
                  color: msg.sender === "me" && !msg.isFile ? "#000" : G.text,
                  border: msg.isFile ? `1px solid ${G.accent}` : "none",
                  padding: "10px 14px", borderRadius: 12, fontSize: 13, maxWidth: "85%",
                  borderBottomRightRadius: msg.sender === "me" ? 2 : 12,
                  borderBottomLeftRadius: msg.sender === "me" ? 12 : 2
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 10, color: G.muted, marginTop: 4 }}>{msg.time}</div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: 12, borderTop: `1px solid ${G.border}`, background: "rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button onClick={handleShareNote} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: G.muted, cursor: "pointer" }}>
                📎 Share Note
              </button>
            </div>
            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, borderRadius: 8, padding: "10px 14px", color: G.text, fontSize: 13, outline: "none" }}
              />
              <button type="submit" style={{ background: G.accent, color: "#000", border: "none", borderRadius: 8, padding: "0 16px", fontWeight: 600, cursor: "pointer" }}>Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
