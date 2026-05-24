import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Main Community Palette (Maroon/Cream)
const G = {
  bg: "#fcf8f2",
  surface: "#ffffff",
  card: "rgba(159,18,57,0.04)",
  border: "rgba(159,18,57,0.15)",
  accent: "#9f1239",
  text: "#4a0e2e",
  muted: "#885a6b",
  success: "#10b981",
  highlight: "#f43f5e",
};

// Cute Pastel Palette for "My Friends" Tab
const OCEAN = {
  bg: "#2b3544",
  surface: "rgba(15, 23, 42, 0.45)",
  card: "rgba(255, 255, 255, 0.05)",
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#93c5fd",
  text: "#f8fafc",
  muted: "#cbd5e1",
  bubbleMe: "#334155",
  bubbleThem: "rgba(255, 255, 255, 0.05)",
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Community({ user }) {
  const [activeTab, setActiveTab] = useState("discover"); // "discover" | "friends"
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMsg, setInputMsg] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [uploading, setUploading] = useState(false);
  
  const chatScrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, activeChat, typingUsers]);

  const fetchInitialData = () => {
    const token = localStorage.getItem("rejexiq_token") || "";
    if (!token) return;

    fetch(`${API}/api/community/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${API}/api/community/connections`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setConnections(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${API}/api/community/connections/pending`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setPendingRequests(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    if (user && user.id) fetchInitialData();
  }, [user]);

  // Socket setup
  useEffect(() => {
    if (!user || !user.id) return;
    
    const newSocket = io(API, { withCredentials: true });
    
    newSocket.on("connect", () => {
      newSocket.emit("join", user.id);
    });

    newSocket.on("userStatusChange", ({ userId, status, lastSeen }) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status, lastSeen } : u));
    });

    newSocket.on("receiveMessage", (msg) => {
      setMessages(prev => {
        const chatId = msg.senderId;
        return { ...prev, [chatId]: [...(prev[chatId] || []), msg] };
      });
    });

    newSocket.on("messageSent", (msg) => {
      setMessages(prev => {
        const chatId = msg.receiverId;
        return { ...prev, [chatId]: [...(prev[chatId] || []), msg] };
      });
    });

    newSocket.on("typing", ({ senderId }) => {
      setTypingUsers(prev => ({ ...prev, [senderId]: true }));
    });

    newSocket.on("stopTyping", ({ senderId }) => {
      setTypingUsers(prev => ({ ...prev, [senderId]: false }));
    });

    newSocket.on("userProfileUpdated", () => {
      fetchInitialData(); // Refetch users to get new avatars/data
    });

    newSocket.on("newConnectionRequest", () => {
      fetchInitialData(); // Refetch pending requests
    });

    newSocket.on("connectionAccepted", () => {
      fetchInitialData(); // Refetch connections
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user]);

  // Fetch chat history when opening a chat
  useEffect(() => {
    if (activeChat) {
      const token = localStorage.getItem("rejexiq_token") || "";
      fetch(`${API}/api/community/chat/${activeChat.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => setMessages(prev => ({ ...prev, [activeChat.id]: data })))
      .catch(console.error);
    }
  }, [activeChat]);

  const handleConnect = async (targetId, currentStatus) => {
    if (currentStatus === "pending") return; // Waiting for them to accept
    const token = localStorage.getItem("rejexiq_token") || "";
    try {
      const res = await fetch(`${API}/api/community/connect/${targetId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.status === "pending") {
        if (socket) socket.emit("connectionRequest", { senderId: user.id, receiverId: targetId });
        alert("Connection request sent! Waiting for approval.");
      } else if (data.status === "removed") {
        setConnections(connections.filter(c => c !== targetId));
      } else if (data.connected) {
        setConnections([...connections, targetId]);
        if (socket) socket.emit("connectionAccepted", { senderId: user.id, receiverId: targetId });
      }
      fetchInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptRequest = async (senderId) => {
    const token = localStorage.getItem("rejexiq_token") || "";
    await fetch(`${API}/api/community/connect/${senderId}/accept`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` }
    });
    if (socket) socket.emit("connectionAccepted", { senderId: user.id, receiverId: senderId });
    fetchInitialData();
  };

  const handleRejectRequest = async (senderId) => {
    const token = localStorage.getItem("rejexiq_token") || "";
    await fetch(`${API}/api/community/connect/${senderId}/reject`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` }
    });
    fetchInitialData();
  };

  const handleRemoveFriend = async (targetId) => {
    if (!window.confirm("Are you sure you want to remove this connection?")) return;
    const token = localStorage.getItem("rejexiq_token") || "";
    try {
      await fetch(`${API}/api/community/connect/${targetId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      setConnections(connections.filter(c => c !== targetId));
      if (activeChat?.id === targetId) setActiveChat(null);
      fetchInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTyping = (e) => {
    setInputMsg(e.target.value);
    if (!socket || !activeChat || !user?.id) return;
    socket.emit("typing", { senderId: user.id, receiverId: activeChat.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { senderId: user.id, receiverId: activeChat.id });
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeChat || !socket || !user?.id) return;
    socket.emit("sendMessage", {
      senderId: user.id,
      receiverId: activeChat.id,
      text: inputMsg,
      isFile: false
    });
    socket.emit("stopTyping", { senderId: user.id, receiverId: activeChat.id });
    setInputMsg("");
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat || !socket || !user?.id) return;

    setUploading(true);
    const token = localStorage.getItem("rejexiq_token") || "";
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (data.fileUrl) {
        socket.emit("sendMessage", {
          senderId: user.id,
          receiverId: activeChat.id,
          text: `Shared a file: ${data.fileName}`,
          isFile: true,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileType: data.fileType
        });
      }
    } catch (err) {
      console.error("File upload failed", err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  };

  if (!user || !user.id) {
    return (
      <div style={{ padding: 64, textAlign: "center", color: OCEAN.accent, minHeight: "100vh", background: OCEAN.bg }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Join the Community</h2>
        <p style={{ marginTop: 12, color: OCEAN.muted }}>Please sign in to connect with peers, chat in real-time, and check rankings.</p>
      </div>
    );
  }

  const friends = users.filter(u => connections.includes(u.id));
  const discoverableUsers = users.filter(u => !connections.includes(u.id));

  return (
    <div className="section-enter" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #7b8ea8 0%, #3a4b66 50%, #1e2638 100%)", transition: "background 0.4s ease" }}>
      
      {/* Background patterns */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          <style>
            {`
              @keyframes swimRight {
                0% { transform: translateX(-100px) translateY(0px) scaleX(-1); }
                50% { transform: translateX(50vw) translateY(20px) scaleX(-1); }
                100% { transform: translateX(100vw) translateY(-10px) scaleX(-1); }
              }
              @keyframes swimLeft {
                0% { transform: translateX(100vw) translateY(0px); }
                50% { transform: translateX(50vw) translateY(-30px); }
                100% { transform: translateX(-100px) translateY(10px); }
              }
              .fish-1 { position: absolute; top: 15%; animation: swimRight 25s linear infinite; font-size: 40px; opacity: 0.6; }
              .fish-2 { position: absolute; top: 40%; animation: swimLeft 30s linear infinite; font-size: 50px; opacity: 0.5; }
              .fish-3 { position: absolute; top: 70%; animation: swimRight 20s linear infinite; font-size: 30px; opacity: 0.7; }
              .fish-4 { position: absolute; top: 85%; animation: swimLeft 35s linear infinite; font-size: 45px; opacity: 0.4; }
              .bubble { position: absolute; bottom: -20px; animation: rise 10s ease-in infinite; font-size: 20px; opacity: 0.5; }
              @keyframes rise {
                0% { transform: translateY(0) scale(1); opacity: 0.5; }
                100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
              }
            `}
          </style>
          <div className="fish-1">🐟</div>
          <div className="fish-2">🐠</div>
          <div className="fish-3">🐡</div>
          <div className="fish-4">🐟</div>
          <div className="bubble" style={{ left: "20%", animationDelay: "0s" }}>🫧</div>
          <div className="bubble" style={{ left: "50%", animationDelay: "3s" }}>🫧</div>
          <div className="bubble" style={{ left: "80%", animationDelay: "1s" }}>🫧</div>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(180deg, rgba(224,242,254,0.1) 0%, rgba(186,230,253,0.5) 100%)", zIndex: -1 }} />
        </div>
      
      <div style={{ position: "relative", zIndex: 10, padding: "0 40px", paddingTop: 40, maxWidth: 1400, margin: "0 auto" }}>
        
        {/* Header & Tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h1 className="syne" style={{ fontSize: 32, fontWeight: 800, color: OCEAN.text, marginBottom: 8, transition: "color 0.4s" }}>Community & Networking</h1>
            <p style={{ color: OCEAN.muted, fontSize: 16 }}>Connect with peers, share knowledge, and build your network.</p>
          </div>
          
          <div style={{ display: "flex", background: OCEAN.surface, borderRadius: 30, backdropFilter: "blur(12px)", padding: 6, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <button 
              onClick={() => setActiveTab("discover")}
              style={{
                padding: "10px 24px", borderRadius: 24, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.3s",
                background: activeTab === "discover" ? OCEAN.accent : "transparent",
                color: activeTab === "discover" ? "#fff" : OCEAN.muted
              }}
            >
              🌍 Discover
            </button>
            <button 
              onClick={() => { setActiveTab("friends"); setActiveChat(null); }}
              style={{
                padding: "10px 24px", borderRadius: 24, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", gap: 8,
                background: activeTab === "friends" ? OCEAN.accent : "transparent",
                color: activeTab === "friends" ? "#fff" : OCEAN.muted
              }}
            >
              💕 My Friends
              {pendingRequests.length > 0 && (
                <span style={{ background: "#ff4d4d", color: "#fff", borderRadius: "50%", padding: "2px 8px", fontSize: 11 }}>{pendingRequests.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* ─── DISCOVER TAB ───────────────────────────────────────────────────────── */}
        {activeTab === "discover" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, paddingBottom: 64 }}>
            {discoverableUsers.map(u => (
              <div key={u.id} style={{
                background: OCEAN.surface, border: `1px solid ${OCEAN.border}`, borderRadius: 16, backdropFilter: "blur(12px)", padding: 24,
                boxShadow: "0 4px 20px rgba(14,165,233,0.05)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(159,18,57,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(159,18,57,0.05)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ position: "relative" }}>
                    <img src={u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.name}&backgroundColor=transparent`} onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.name}&backgroundColor=transparent`; }} style={{ width: 64, height: 64, borderRadius: "50%", background: OCEAN.card, objectFit: "cover" }} alt="" />
                    <div style={{
                      position: "absolute", bottom: 2, right: 2, width: 14, height: 14,
                      borderRadius: "50%", background: u.status === "online" ? "#10b981" : "#cbd5e1",
                      border: `2px solid ${OCEAN.surface}`
                    }} title={u.status} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: OCEAN.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Rank</div>
                    <div className="syne" style={{ fontSize: 24, fontWeight: 800, color: OCEAN.accent }}>#{u.rank}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: OCEAN.text, marginBottom: 4 }}>
                  {u.name} {u.privacy === "private" && <span title="Private Profile" style={{ fontSize: 14 }}>🔒</span>}
                </h3>
                <p style={{ fontSize: 13, color: OCEAN.muted, marginBottom: 16, fontWeight: 500 }}>{u.role} • {u.points} pts</p>

                {u.bio && <p style={{ fontSize: 13, color: OCEAN.text, opacity: 0.8, marginBottom: 16, fontStyle: "italic" }}>"{u.bio}"</p>}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                  {(u.tags || []).map(tag => (
                    <span key={tag} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${OCEAN.border}`, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: OCEAN.accent }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => handleConnect(u.id, "none")}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 10,
                    background: "rgba(255, 255, 255, 0.1)",
                    border: `1px solid rgba(14, 165, 233, 0.3)`,
                    backdropFilter: "blur(10px)",
                    color: OCEAN.text,
                    fontWeight: 800, cursor: "pointer", transition: "all 0.2s",
                    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.08)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.borderColor = `rgba(14, 165, 233, 0.5)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.borderColor = `rgba(14, 165, 233, 0.3)`;
                  }}
                >
                  {u.privacy === "private" ? "Send Connection Request" : "Connect Now"}
                </button>
              </div>
            ))}
            {discoverableUsers.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 60, color: OCEAN.muted, fontStyle: "italic" }}>
                You've connected with everyone available right now!
              </div>
            )}
          </div>
        )}

        {/* ─── MY FRIENDS TAB ─────────────────────────────────────────────────────── */}
        {activeTab === "friends" && (
          <div style={{ display: "flex", gap: 24, height: "calc(100vh - 200px)", paddingBottom: 40 }}>
            
            {/* Left Sidebar (Friends List & Requests) */}
            <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div style={{ background: OCEAN.surface, borderRadius: 20, padding: 20, backdropFilter: "blur(12px)", boxShadow: "0 10px 30px rgba(14,165,233,0.15)", border: `2px dashed ${OCEAN.border}` }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: OCEAN.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>💌</span> Connection Requests
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {pendingRequests.map(req => (
                      <div key={req.connectionId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: OCEAN.card, padding: 12, borderRadius: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <img src={req.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${req.name}&backgroundColor=transparent`} onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${req.name}&backgroundColor=transparent`; }} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(10px)" }} alt="" />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: OCEAN.text }}>{req.name}</div>
                            <div style={{ fontSize: 11, color: OCEAN.muted }}>Wants to connect</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => handleAcceptRequest(req.senderId)} style={{ background: OCEAN.accent, color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</button>
                          <button onClick={() => handleRejectRequest(req.senderId)} style={{ background: "transparent", color: OCEAN.muted, border: `1px solid ${OCEAN.border}`, borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Friends List */}
              <div style={{ flex: 1, background: OCEAN.surface, borderRadius: 24, padding: 20, backdropFilter: "blur(12px)", boxShadow: "0 10px 40px rgba(14,165,233,0.1)", overflowY: "auto" }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: OCEAN.text, marginBottom: 16 }}>My Besties ✨</h3>
                {friends.length === 0 ? (
                  <p style={{ color: OCEAN.muted, fontSize: 13, textAlign: "center", marginTop: 40 }}>Go to Discover to find friends!</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {friends.map(f => (
                      <div 
                        key={f.id}
                        onClick={() => setActiveChat(f)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, cursor: "pointer",
                          background: activeChat?.id === f.id ? OCEAN.card : "transparent",
                          transition: "background 0.2s"
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <img src={f.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${f.name}&backgroundColor=transparent`} onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${f.name}&backgroundColor=transparent`; }} style={{ width: 48, height: 48, borderRadius: 24, objectFit: "cover", background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(10px)" }} alt="" />
                          <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: f.status === "online" ? "#10b981" : "#cbd5e1", border: "2px solid #fff" }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: OCEAN.text }}>{f.name}</div>
                          <div style={{ fontSize: 12, color: OCEAN.muted }}>{f.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Chat Area */}
            <div style={{ flex: 1, background: OCEAN.surface, borderRadius: 24, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
              {activeChat ? (
                <>
                  <div style={{ padding: "20px 24px", borderBottom: `1px solid ${OCEAN.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(10px)", zIndex: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img src={activeChat.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${activeChat.name}&backgroundColor=transparent`} onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${activeChat.name}&backgroundColor=transparent`; }} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", background: "#fdfbf7", border: "1px solid rgba(159,18,57,0.1)" }} alt="" />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: OCEAN.text }}>{activeChat.name}</div>
                        <div style={{ fontSize: 12, color: activeChat.status === "online" ? "#10b981" : OCEAN.muted, fontWeight: 600 }}>
                          {typingUsers[activeChat.id] ? "Typing..." : activeChat.status === "online" ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFriend(activeChat.id)}
                      style={{
                        background: "transparent", border: `1px solid ${OCEAN.border}`, borderRadius: 20,
                        padding: "6px 16px", fontSize: 12, fontWeight: 700, color: OCEAN.muted,
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#ef4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = OCEAN.muted; e.currentTarget.style.borderColor = OCEAN.border; }}
                    >
                      Remove Connection
                    </button>
                  </div>

                  <div ref={chatScrollRef} style={{ flex: 1, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, background: "transparent" }}>
                    {!(messages[activeChat.id] || []).length && (
                      <div style={{ margin: "auto", textAlign: "center", color: OCEAN.muted, fontSize: 14 }}>
                        Say hi to {activeChat.name}! 👋
                      </div>
                    )}
                    {(messages[activeChat.id] || []).map((msg, i) => {
                      const isMe = (msg.senderId || msg.sender) === user.id;
                      return (
                        <div key={i} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                          <div style={{
                            padding: "12px 16px",
                            borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                            background: isMe ? OCEAN.bubbleMe : OCEAN.bubbleThem,
                            color: isMe ? "#fff" : OCEAN.text,
                            boxShadow: isMe ? "0 4px 12px rgba(255,141,161,0.3)" : "0 4px 12px rgba(0,0,0,0.03)",
                            fontSize: 14,
                            lineHeight: 1.5,
                            border: isMe ? "none" : `1px solid ${OCEAN.border}`
                          }}>
                            {msg.text && <div>{msg.text}</div>}
                            {(msg.isFile || msg.fileUrl) && (
                              <div style={{ marginTop: 10, padding: 10, background: isMe ? "rgba(255,255,255,0.2)" : OCEAN.card, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 24 }}>📄</span>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                  <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{msg.fileName}</div>
                                  <a href={msg.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: isMe ? "#fff" : OCEAN.accent, textDecoration: "underline", fontWeight: 600 }}>Download File</a>
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: 10, color: OCEAN.muted, marginTop: 4, textAlign: isMe ? "right" : "left", opacity: 0.7 }}>
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ padding: 20, borderTop: `1px solid ${OCEAN.border}`, background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(10px)" }}>
                    <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        style={{ display: "none" }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        title="Share File"
                        style={{
                          background: OCEAN.card, border: "none", width: 44, height: 44, borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: uploading ? "wait" : "pointer",
                          color: OCEAN.accent, fontSize: 18, transition: "transform 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      >
                        {uploading ? "⏳" : "📎"}
                      </button>

                      <button 
                        type="button" 
                        onClick={() => setShowEmojis(!showEmojis)}
                        title="Add Emoji"
                        style={{
                          background: "transparent", border: "none", fontSize: 24, cursor: "pointer",
                          transition: "transform 0.2s", padding: "0 4px"
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      >
                        😊
                      </button>

                      {/* Emoji Picker Popover */}
                      {showEmojis && (
                        <div style={{
                          position: "absolute", bottom: 80, left: 80, background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(10px)",
                          border: `1px solid ${OCEAN.border}`, borderRadius: 16, padding: 12,
                          boxShadow: "0 10px 30px rgba(14,165,233,0.2)", display: "flex", flexWrap: "wrap",
                          width: 200, gap: 8, zIndex: 10
                        }}>
                          {['😀', '😂', '😍', '😭', '🔥', '✨', '💯', '❤️', '👍', '🙏', '🎉', '💡', '🚀', '👀'].map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => { setInputMsg(prev => prev + emoji); setShowEmojis(false); }}
                              style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer", padding: 4 }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      <input
                        value={inputMsg}
                        onChange={handleTyping}
                        placeholder="Type a friendly message..."
                        style={{
                          flex: 1, padding: "14px 20px", borderRadius: 24, border: `2px solid ${OCEAN.border}`,
                          outline: "none", fontSize: 14, background: OCEAN.bg, color: OCEAN.text
                        }}
                      />

                      <button 
                        type="submit"
                        disabled={!inputMsg.trim()}
                        style={{
                          background: inputMsg.trim() ? OCEAN.accent : OCEAN.card,
                          color: inputMsg.trim() ? "#fff" : OCEAN.muted,
                          border: "none", padding: "0 24px", height: 48, borderRadius: 24,
                          fontWeight: 700, cursor: inputMsg.trim() ? "pointer" : "default",
                          transition: "all 0.2s", boxShadow: inputMsg.trim() ? "0 4px 16px rgba(14,165,233,0.4)" : "none"
                        }}
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div style={{ margin: "auto", textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>✨</div>
                  <h2 className="syne" style={{ fontSize: 24, fontWeight: 800, color: OCEAN.text, marginBottom: 8 }}>Your Networking Space</h2>
                  <p style={{ color: OCEAN.muted, fontSize: 14, maxWidth: 300, margin: "0 auto" }}>Select a friend from the sidebar to start chatting and sharing files.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
