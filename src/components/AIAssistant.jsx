import React, { useState, useRef, useEffect } from "react";
import { marked } from "marked";

export default function AIAssistant({ user }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hello ${user?.name || "there"}. I am your AI Career Assistant. I am here to help you navigate your career path, prepare for interviews, or answer any technical questions you might have. How can I assist you today?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = "AIzaSyB7R_rJqiuMw8OcoEkmGNyM2nGlc11pQKg";
  const msgRef = useRef(null);

  // Suggestions for the user
  const suggestions = [
    "How do I improve my backend skills?",
    "What skills should I learn for frontend?",
    "How to prepare for technical interviews?",
    "Tell me a relaxing fact",
    "Can you help me design my portfolio?"
  ];



  async function callGeminiAPI(userMessage) {
    if (!apiKey) {
      return "Please set your Gemini API key first to continue our chat. 🌿";
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a very calm, soothing, and helpful AI assistant in a career learning platform. 
User's Name: ${user?.name || "User"}
User's Question: ${userMessage}

Please respond in a friendly, encouraging, and soothing tone. Provide helpful and actionable advice if they ask career questions. If they ask general questions, answer them nicely. Keep your responses well-formatted and easy to read.`
            }]
          }],
          generationConfig: {
            temperature: 0.6,
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 400 && error.error?.message?.includes("API_KEY_INVALID")) {
          return "Oh no, it seems the API key is invalid. Could you please check it and try again? 🌱";
        }
        throw new Error(error.error?.message || "API request failed");
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "I'm sorry, my mind wandered for a second. Could you repeat that?";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return `I encountered a little hiccup: ${error.message}. Please check your connection or API key. 🍂`;
    }
  }



  async function send(text) {
    const q = text || input;
    if (!q.trim()) return;

    const newMsgs = [...messages, { role: "user", text: q }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      if (msgRef.current) msgRef.current.scrollTo({ top: msgRef.current.scrollHeight, behavior: "smooth" });
    }, 100);

    const response = await callGeminiAPI(q);

    setMessages([...newMsgs, { role: "assistant", text: response }]);
    setLoading(false);
  }

  // --- UI COMPONENTS ---



  return (
    <div className="soothing-container">
      <style>{soothingStyles}</style>

      <div className="chat-layout">
        {/* Main Chat Area */}
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <img src="https://img.icons8.com/3d-fluency/94/chatbot.png" alt="AI" style={{ width: 48, height: 48 }} className="float-anim" />
              <div>
                <div style={{ fontWeight: 700, color: "#334155", fontSize: 18 }}>AI Career Assistant</div>
                <div style={{ fontSize: 12, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="online-dot"></span> Online & Ready
                </div>
              </div>
            </div>

          </div>

          {/* Messages */}
          <div className="chat-messages" ref={msgRef}>
            {messages.map((m, i) => (
              <div key={i} className={`message-wrapper ${m.role}`}>
                {m.role === "assistant" && <img src="https://img.icons8.com/3d-fluency/94/chatbot.png" alt="AI" className="message-avatar" />}
                <div 
                  className={`chat-bubble ${m.role}`} 
                  dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
                />
              </div>
            ))}
            {loading && (
              <div className="message-wrapper assistant">
                <img src="https://img.icons8.com/3d-fluency/94/chatbot.png" alt="AI" className="message-avatar" />
                <div className="chat-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <input 
              className="soothing-input" 
              placeholder="Type your thoughts here..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()} 
            />
            <button className="btn-send" onClick={() => send()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-card">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#64748b", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Suggestions</h3>
            <div className="suggestion-list">
              {suggestions.map((s, i) => (
                <button key={i} className="suggestion-btn" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const soothingStyles = `
  .soothing-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 120px);
    border-radius: 24px;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.6), 0 10px 40px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', sans-serif;
  }

  .float-anim {
    animation: floatIcon 4s infinite ease-in-out;
  }

  @keyframes floatIcon {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .soothing-input {
    width: 100%;
    padding: 16px 24px;
    border-radius: 100px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    background: rgba(255, 255, 255, 0.9);
    font-size: 15px;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }

  .soothing-input:focus {
    border-color: #7dd3fc;
    box-shadow: 0 4px 20px rgba(125, 211, 252, 0.2);
  }

  .btn-soothing {
    width: 100%;
    padding: 16px 24px;
    border-radius: 100px;
    border: none;
    background: linear-gradient(135deg, #7dd3fc, #bae6fd);
    color: #0c4a6e;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(125, 211, 252, 0.3);
  }

  .btn-soothing:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(125, 211, 252, 0.4);
  }

  .chat-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 24px;
    width: 100%;
    height: 100%;
    padding: 24px;
  }

  .chat-window {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.02);
  }

  .chat-header {
    padding: 20px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
    background: rgba(255, 255, 255, 0.5);
  }

  .header-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .online-dot {
    width: 8px; height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  @keyframes pulseDot {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }

  .btn-ghost-soothing {
    background: transparent;
    border: 1px solid rgba(226, 232, 240, 0.8);
    padding: 8px 16px;
    border-radius: 100px;
    color: #64748b;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-ghost-soothing:hover {
    background: #f1f5f9;
    color: #334155;
  }

  .chat-messages {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .message-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    max-width: 80%;
  }

  .message-wrapper.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .message-avatar {
    width: 36px; height: 36px;
    object-fit: contain;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .chat-bubble {
    padding: 16px 20px;
    border-radius: 24px;
    font-size: 15px;
    line-height: 1.6;
    animation: fadeIn 0.3s ease-out;
  }
  
  .chat-bubble p {
    margin: 0 0 10px 0;
  }
  .chat-bubble p:last-child {
    margin-bottom: 0;
  }

  .chat-bubble pre, .chat-bubble code {
    background: rgba(0,0,0,0.05);
    border-radius: 8px;
    padding: 2px 6px;
    font-family: monospace;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .chat-bubble.assistant {
    background: white;
    color: #334155;
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    border: 1px solid rgba(226, 232, 240, 0.4);
  }

  .chat-bubble.user {
    background: #7dd3fc;
    color: #0c4a6e;
    border-bottom-right-radius: 4px;
  }

  .typing-indicator {
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 16px 24px !important;
  }

  .typing-indicator span {
    width: 6px; height: 6px;
    background: #94a3b8;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out both;
  }

  .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .chat-input-area {
    padding: 20px 32px;
    background: rgba(255, 255, 255, 0.5);
    border-top: 1px solid rgba(226, 232, 240, 0.5);
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .btn-send {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: #38bdf8;
    color: white;
    border: none;
    display: flex; justify-content: center; align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
  }

  .btn-send:hover {
    transform: scale(1.05);
    background: #0ea5e9;
  }

  .chat-sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sidebar-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 32px;
    padding: 24px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.02);
  }

  .suggestion-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .suggestion-btn {
    text-align: left;
    padding: 12px 16px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(226, 232, 240, 0.6);
    border-radius: 16px;
    color: #475569;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    line-height: 1.4;
  }

  .suggestion-btn:hover {
    background: white;
    border-color: #bae6fd;
    transform: translateX(4px);
  }
`;
