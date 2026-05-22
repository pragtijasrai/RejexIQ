import { useState, useEffect, useRef } from "react";
import DSAHub from "./DSAHub.jsx";

const LEVELS = [
  { min: 0, max: 199, name: "Beginner", icon: "🌱", color: "#74b9ff" },
  { min: 200, max: 499, name: "Apprentice", icon: "⚡", color: "#55efc4" },
  { min: 500, max: 899, name: "Coder", icon: "💻", color: "#6c63ff" },
  { min: 900, max: 1399, name: "Developer", icon: "🔥", color: "#ffd166" },
  { min: 1400, max: 1999, name: "Engineer", icon: "🚀", color: "#ff9f43" },
  { min: 2000, max: 9999, name: "DSA Master", icon: "👑", color: "#ff6b6b" },
];

const TOPICS_META = [
  { id: "basics", label: "Programming Basics", icon: "💻", color: "#6c63ff", xp: 100 },
  { id: "complex", label: "Complexity Analysis", icon: "📐", color: "#4ecdc4", xp: 100 },
  { id: "arrays", label: "Arrays", icon: "🗂️", color: "#43e97b", xp: 100 },
  { id: "strings", label: "Strings", icon: "🔤", color: "#ffd166", xp: 100 },
  { id: "recursion", label: "Recursion", icon: "🔄", color: "#ff9f43", xp: 100 },
  { id: "control", label: "Control Flow", icon: "🔁", color: "#ff6b6b", xp: 100 },
  { id: "ll", label: "Linked Lists", icon: "🔗", color: "#a29bfe", xp: 100 },
  { id: "stack", label: "Stack", icon: "📦", color: "#fd79a8", xp: 100 },
  { id: "queue", label: "Queue", icon: "🚶", color: "#55efc4", xp: 100 },
  { id: "trees", label: "Trees", icon: "🌳", color: "#00b894", xp: 120 },
  { id: "bst", label: "Binary Search Tree", icon: "🔍", color: "#0984e3", xp: 120 },
  { id: "heap", label: "Heap", icon: "⛰️", color: "#e17055", xp: 120 },
  { id: "hashing", label: "Hashing", icon: "#️⃣", color: "#fdcb6e", xp: 120 },
  { id: "graphs", label: "Graphs", icon: "🕸️", color: "#74b9ff", xp: 150 },
  { id: "bfs", label: "BFS", icon: "🌊", color: "#00cec9", xp: 150 },
  { id: "dfs", label: "DFS", icon: "🏔️", color: "#6c5ce7", xp: 150 },
  { id: "backtrack", label: "Backtracking", icon: "↩️", color: "#e84393", xp: 150 },
  { id: "greedy", label: "Greedy", icon: "💰", color: "#f9ca24", xp: 150 },
  { id: "dp", label: "Dynamic Programming", icon: "🧩", color: "#badc58", xp: 200 },
];

const ACHIEVEMENTS = [
  { id: "first_topic", icon: "🎯", title: "First Step", desc: "Complete your first topic", xp: 50 },
  { id: "five_done", icon: "⭐", title: "Getting Warm", desc: "Complete 5 topics", xp: 100 },
  { id: "half_done", icon: "🌟", title: "Halfway There", desc: "Complete 10 topics", xp: 150 },
  { id: "all_done", icon: "👑", title: "DSA Master", desc: "Complete all 19 topics", xp: 500 },
  { id: "speed_run", icon: "⚡", title: "Speed Learner", desc: "Complete 3 topics in one session", xp: 100 },
  { id: "quiz_ace", icon: "🎓", title: "Quiz Ace", desc: "Answer daily challenge correctly", xp: 75 },
  { id: "night_owl", icon: "🦉", title: "Night Owl", desc: "Study after 10 PM", xp: 30 },
  { id: "early_bird", icon: "🌅", title: "Early Bird", desc: "Study before 8 AM", xp: 30 },
];

const DAILY_CHALLENGES = [
  { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], ans: 1, xp: 30 },
  { q: "Which data structure uses LIFO order?", opts: ["Queue", "Array", "Stack", "Linked List"], ans: 2, xp: 20 },
  { q: "What does BFS use internally?", opts: ["Stack", "Queue", "Heap", "Array"], ans: 1, xp: 25 },
  { q: "Merge sort worst case time complexity?", opts: ["O(n^2)", "O(n)", "O(n log n)", "O(log n)"], ans: 2, xp: 30 },
  { q: "In a BST, where is the smallest element?", opts: ["Root", "Rightmost", "Leftmost", "Any leaf"], ans: 2, xp: 25 },
  { q: "Hash table average lookup time?", opts: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], ans: 2, xp: 20 },
  { q: "Fibonacci DP reduces time from O(2^n) to?", opts: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], ans: 2, xp: 35 },
];

const FAKE_LB = [
  { name: "Arjun S.", xp: 2840, avatar: "🧑‍💻" },
  { name: "Priya M.", xp: 2610, avatar: "👩‍💻" },
  { name: "Rahul K.", xp: 2390, avatar: "🧑‍🎓" },
  { name: "Sneha R.", xp: 2100, avatar: "👩‍🎓" },
  { name: "You", xp: 0, avatar: "⭐", isMe: true },
  { name: "Vikram P.", xp: 1650, avatar: "🧑‍💻" },
  { name: "Ananya T.", xp: 1420, avatar: "👩‍💻" },
];

function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[LEVELS.length - 1];
}

function getXpProgress(xp) {
  const lvl = getLevel(xp);
  const range = lvl.max - lvl.min;
  const progress = xp - lvl.min;
  return Math.round((progress / range) * 100);
}

const GAME_CSS = `
  .game-root { font-family: 'Inter', sans-serif; background: #0a0e27; min-height: 100vh; color: #f0f4ff; }

  .game-hud {
    position: sticky; top: 0; z-index: 100;
    background: rgba(10,14,39,0.92); backdrop-filter: blur(14px);
    border-bottom: 1px solid transparent;
    background-clip: padding-box;
    box-shadow: 0 1px 0 0 rgba(108,99,255,0.4);
    padding: 10px 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  }

  .game-avatar { font-size: 32px; line-height: 1; }

  .game-level-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 20px;
    font-weight: 700; font-size: 13px;
    border: 1px solid currentColor;
  }

  .game-xp-wrap { flex: 1; min-width: 140px; max-width: 260px; }
  .game-xp-label { font-size: 11px; color: #94a3b8; margin-bottom: 4px; display: flex; justify-content: space-between; }
  .game-xp-bar { height: 8px; background: #2d3a5f; border-radius: 4px; overflow: hidden; }
  .game-xp-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #ff9f43, #ff6b6b); transition: width 0.6s ease; box-shadow: 0 0 8px rgba(255,107,107,0.4); }

  .game-chip {
    display: flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600;
  }

  .game-tabs { display: flex; gap: 8px; padding: 14px 20px 0; flex-wrap: wrap; }
  .game-tab {
    padding: 8px 18px; border-radius: 20px; border: 1px solid #2d3a5f;
    background: transparent; color: #94a3b8; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .game-tab:hover { border-color: #6c63ff; color: #f0f4ff; }
  .game-tab.active { background: #6c63ff; border-color: #6c63ff; color: #fff; }

  .game-section { padding: 20px; animation: fadeUp 0.4s ease; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

  .topic-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 10px; margin-top: 14px; }

  .topic-card {
    border-radius: 10px; padding: 10px 6px; text-align: center; cursor: pointer;
    background: #141b3a; border: 1px solid #2d3a5f; border-top: 3px solid transparent;
    transition: all 0.2s; position: relative;
  }
  .topic-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
  .topic-card.active { box-shadow: 0 0 0 2px var(--tc); }
  .topic-card.done .topic-check { display: flex; }

  .topic-icon { font-size: 22px; margin-bottom: 4px; }
  .topic-label { font-size: 9px; color: #94a3b8; line-height: 1.3; }
  .topic-xp { font-size: 9px; font-weight: 700; margin-top: 3px; }
  .topic-check {
    display: none; position: absolute; top: 4px; right: 4px;
    width: 16px; height: 16px; background: #43e97b; border-radius: 50%;
    align-items: center; justify-content: center; font-size: 9px;
  }
`;

const GAME_CSS2 = `
  .mark-btn {
    padding: 9px 22px; border-radius: 10px; border: none; cursor: pointer; font-weight: 700;
    font-size: 13px; background: linear-gradient(135deg, #43e97b, #00b894); color: #0a0e27;
    transition: all 0.2s; margin-bottom: 14px;
  }
  .mark-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(67,233,123,0.4); }
  .mark-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .ach-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
  .ach-card {
    background: #141b3a; border: 1px solid #2d3a5f; border-radius: 12px; padding: 14px;
    display: flex; gap: 12px; align-items: flex-start; transition: all 0.2s;
  }
  .ach-card.earned { border-color: #ffd166; box-shadow: 0 0 12px rgba(255,209,102,0.2); }
  .ach-card.locked { filter: grayscale(0.8); opacity: 0.6; }
  .ach-icon { font-size: 26px; line-height: 1; }
  .ach-title { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
  .ach-desc { font-size: 11px; color: #94a3b8; }
  .ach-xp { font-size: 11px; font-weight: 700; color: #ffd166; margin-top: 4px; }

  .lb-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 14px;
    border-radius: 10px; margin-bottom: 6px; background: #141b3a; border: 1px solid #2d3a5f;
    transition: background 0.2s;
  }
  .lb-row.me { border-color: #a29bfe; background: rgba(162,155,254,0.1); }
  .lb-rank { font-size: 18px; width: 28px; text-align: center; }
  .lb-avatar { font-size: 22px; }
  .lb-name { flex: 1; font-size: 13px; font-weight: 600; }
  .lb-xp { font-size: 13px; font-weight: 700; color: #ffd166; font-family: monospace; }

  .dc-card { background: #141b3a; border: 1px solid #2d3a5f; border-radius: 14px; padding: 20px; max-width: 560px; }
  .dc-q { font-size: 15px; font-weight: 600; margin-bottom: 16px; line-height: 1.5; }
  .dc-opts { display: flex; flex-direction: column; gap: 8px; }
  .dc-opt {
    padding: 10px 16px; border-radius: 8px; border: 1px solid #2d3a5f;
    background: #1a2347; cursor: pointer; font-size: 13px; text-align: left;
    transition: all 0.2s; color: #f0f4ff;
  }
  .dc-opt:hover:not(:disabled) { border-color: #6c63ff; background: rgba(108,99,255,0.15); }
  .dc-opt.correct { border-color: #43e97b; background: rgba(67,233,123,0.15); color: #43e97b; font-weight: 700; }
  .dc-opt.wrong { border-color: #ff6b6b; background: rgba(255,107,107,0.1); color: #ff6b6b; }

  @keyframes xpPop { 0% { opacity:0; transform:scale(0.7) translateY(0); } 20% { opacity:1; transform:scale(1.1) translateY(-8px); } 80% { opacity:1; transform:scale(1) translateY(-24px); } 100% { opacity:0; transform:scale(0.9) translateY(-40px); } }  .xp-popup {
    position: fixed; top: 80px; right: 24px; z-index: 9999;
    background: linear-gradient(135deg, #ff9f43, #ff6b6b); color: #fff;
    padding: 10px 20px; border-radius: 24px; font-weight: 800; font-size: 15px;
    pointer-events: none; animation: xpPop 1.4s ease forwards;
    box-shadow: 0 4px 20px rgba(255,107,107,0.5);
  }

  @keyframes achSlide { from { opacity:0; transform:translateX(120px); } to { opacity:1; transform:translateX(0); } }
  .ach-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: #1a2347; border: 1px solid #ffd166; border-radius: 14px;
    padding: 14px 18px; display: flex; gap: 12px; align-items: center;
    animation: achSlide 0.4s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    max-width: 300px;
  }
  .ach-toast-icon { font-size: 28px; }
  .ach-toast-title { font-size: 13px; font-weight: 700; color: #ffd166; }
  .ach-toast-desc { font-size: 11px; color: #94a3b8; margin-top: 2px; }
`;

const CERT_CSS = `
  @keyframes certIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes confettiFall {
    0%   { transform: translateY(-20px) rotate(0deg);   opacity:1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity:0; }
  }
  .cert-overlay {
    position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,.85); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    padding:20px; overflow-y:auto;
  }
  .cert-wrap {
    background:#fff; border-radius:20px; max-width:720px; width:100%;
    position:relative; overflow:hidden;
    animation:certIn .5s cubic-bezier(.34,1.56,.64,1);
    box-shadow:0 32px 80px rgba(0,0,0,.6);
  }
  .cert-top-bar { height:10px; background:linear-gradient(90deg,#6c63ff,#4ecdc4,#43e97b,#ffd166,#ff6b6b); }
  .cert-body { padding:48px 56px 40px; text-align:center; }
  .cert-logo { font-size:13px; font-weight:800; letter-spacing:2px; color:#6c63ff; margin-bottom:24px; }
  .cert-headline { font-size:13px; color:#888; letter-spacing:3px; text-transform:uppercase; margin-bottom:8px; }
  .cert-title {
    font-size:36px; font-weight:900; margin-bottom:4px;
    background:linear-gradient(135deg,#6c63ff,#4ecdc4);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .cert-subtitle { font-size:14px; color:#888; margin-bottom:32px; }
  .cert-name-label { font-size:12px; color:#aaa; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
  .cert-name {
    font-size:42px; font-weight:700; color:#1a1a2e;
    font-family:Georgia,serif; border-bottom:2px solid #6c63ff;
    display:inline-block; padding-bottom:6px; margin-bottom:28px;
  }
  .cert-desc { font-size:15px; color:#555; line-height:1.7; max-width:480px; margin:0 auto 32px; }
  .cert-topics {
    display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:32px;
  }
  .cert-topic-pill {
    font-size:11px; font-weight:700; padding:4px 12px; border-radius:20px;
    background:#f0f0ff; color:#6c63ff; border:1px solid #d0d0ff;
  }
  .cert-stats { display:flex; justify-content:center; gap:40px; margin-bottom:36px; }
  .cert-stat-val { font-size:28px; font-weight:900; color:#1a1a2e; }
  .cert-stat-lbl { font-size:11px; color:#aaa; text-transform:uppercase; letter-spacing:1px; margin-top:2px; }
  .cert-seal {
    width:80px; height:80px; border-radius:50%; margin:0 auto 24px;
    background:linear-gradient(135deg,#6c63ff,#4ecdc4);
    display:flex; align-items:center; justify-content:center;
    font-size:36px; box-shadow:0 8px 24px rgba(108,99,255,.4);
  }
  .cert-footer { font-size:11px; color:#bbb; margin-top:8px; }
  .cert-bottom-bar { height:6px; background:linear-gradient(90deg,#6c63ff,#4ecdc4,#43e97b); }
  .cert-close {
    position:absolute; top:16px; right:16px;
    width:32px; height:32px; border-radius:50%; border:none; cursor:pointer;
    background:rgba(0,0,0,.08); font-size:16px; display:flex; align-items:center; justify-content:center;
    transition:background .15s;
  }
  .cert-close:hover { background:rgba(0,0,0,.15); }
  .cert-download {
    padding:12px 32px; border-radius:10px; border:none; cursor:pointer;
    background:linear-gradient(135deg,#6c63ff,#4ecdc4); color:#fff;
    font-size:14px; font-weight:700; margin-right:10px;
    box-shadow:0 4px 16px rgba(108,99,255,.35); transition:all .2s;
  }
  .cert-download:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(108,99,255,.45); }
  .cert-share {
    padding:12px 24px; border-radius:10px; border:1.5px solid #6c63ff;
    background:transparent; color:#6c63ff; font-size:14px; font-weight:700; cursor:pointer;
    transition:all .2s;
  }
  .cert-share:hover { background:#f0f0ff; }
  /* Confetti */
  .confetti-piece {
    position:fixed; width:10px; height:10px; border-radius:2px;
    animation:confettiFall linear forwards; pointer-events:none; z-index:10000;
  }
`;

// ── Confetti ──
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ["#6c63ff", "#4ecdc4", "#43e97b", "#ffd166", "#ff6b6b", "#fd79a8", "#a29bfe"][i % 7],
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    size: 6 + Math.random() * 8,
  }));
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, top: "-20px",
          background: p.color, width: p.size, height: p.size,
          animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
        }} />
      ))}
    </>
  );
}

// ── Certificate ──
function Certificate({ xp, completed, onClose }) {
  const totalTopics = completed.length;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const certId = "DSA-" + Date.now().toString(36).toUpperCase();

  return (
    <div className="cert-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <Confetti />
      <div className="cert-wrap">
        <button className="cert-close" onClick={onClose}>✕</button>
        <div className="cert-top-bar" />
        <div className="cert-body">
          <div className="cert-logo">🎓 RejexIQ</div>
          <div className="cert-headline">Certificate of Completion</div>
          <div className="cert-title">Data Structures & Algorithms</div>
          <div className="cert-subtitle">Complete Java DSA Mastery Course</div>

          <div className="cert-name-label">This certifies that</div>
          <div className="cert-name">DSA Champion</div>

          <div className="cert-desc">
            has successfully completed all modules of the <strong>Data Structures & Algorithms</strong> course,
            demonstrating mastery of core computer science concepts from Programming Basics to Dynamic Programming.
          </div>

          <div className="cert-topics">
            {["Programming Basics", "Complexity Analysis", "Arrays", "Strings", "Recursion",
              "Control Flow", "Linked Lists", "Stack", "Queue", "Trees", "BST", "Heap",
              "Hashing", "Graphs", "BFS", "DFS", "Backtracking", "Greedy", "Dynamic Programming"
            ].map(t => <span key={t} className="cert-topic-pill">{t}</span>)}
          </div>

          <div className="cert-stats">
            <div>
              <div className="cert-stat-val">{totalTopics}</div>
              <div className="cert-stat-lbl">Topics Completed</div>
            </div>
            <div>
              <div className="cert-stat-val">{xp.toLocaleString()}</div>
              <div className="cert-stat-lbl">XP Earned</div>
            </div>
            <div>
              <div className="cert-stat-val">100%</div>
              <div className="cert-stat-lbl">Completion</div>
            </div>
          </div>

          <div className="cert-seal">👑</div>

          <div style={{ marginBottom: 20 }}>
            <button className="cert-download" onClick={() => window.print()}>⬇ Download Certificate</button>
            <button className="cert-share" onClick={() => navigator.clipboard?.writeText(`I just completed the DSA course on RejexIQ! 🎓 #DSA #Coding`)}>
              🔗 Share
            </button>
          </div>

          <div className="cert-footer">
            Issued on {today} &nbsp;·&nbsp; Certificate ID: {certId}
          </div>
        </div>
        <div className="cert-bottom-bar" />
      </div>
    </div>
  );
}

export default function DSAGame() {
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("dsa_xp") || "0"));
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("dsa_completed") || "[]"));
  const [earned, setEarned] = useState(() => JSON.parse(localStorage.getItem("dsa_earned") || "[]"));
  const [tab, setTab] = useState("learn");
  const [topicIdx, setTopicIdx] = useState(0);
  const [xpPopup, setXpPopup] = useState(null);
  const [achToast, setAchToast] = useState(null);
  const [showCert, setShowCert] = useState(false);
  const allDone = completed.length >= TOPICS_META.length;
  const sessionDone = useRef(0);
  const [challenge] = useState(() => DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)]);
  const [dcAnswer, setDcAnswer] = useState(null);
  const [dcDone, setDcDone] = useState(false);

  const level = getLevel(xp);
  const xpPct = getXpProgress(xp);

  function saveXp(val) { localStorage.setItem("dsa_xp", val); setXp(val); }
  function saveCompleted(arr) { localStorage.setItem("dsa_completed", JSON.stringify(arr)); setCompleted(arr); }
  function saveEarned(arr) { localStorage.setItem("dsa_earned", JSON.stringify(arr)); setEarned(arr); }

  function showXpPopup(amount) {
    setXpPopup(amount);
    setTimeout(() => setXpPopup(null), 1400);
  }

  function unlockAchievement(id) {
    if (earned.includes(id)) return 0;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return 0;
    const newEarned = [...earned, id];
    saveEarned(newEarned);
    setAchToast(ach);
    setTimeout(() => setAchToast(null), 3000);
    return ach.xp;
  }

  function addXp(amount) {
    const newXp = xp + amount;
    saveXp(newXp);
    showXpPopup(amount);
    return newXp;
  }

  function checkTimeAchievements(currentEarned) {
    const h = new Date().getHours();
    let bonus = 0;
    if (h >= 22 && !currentEarned.includes("night_owl")) bonus += unlockAchievement("night_owl");
    if (h < 8 && !currentEarned.includes("early_bird")) bonus += unlockAchievement("early_bird");
    return bonus;
  }

  function handleMarkComplete(topicId) {
    const topic = TOPICS_META.find(t => t.id === topicId);
    if (!topic || completed.includes(topicId)) return;
    const newCompleted = [...completed, topicId];
    saveCompleted(newCompleted);
    sessionDone.current += 1;
    let bonus = 0;
    bonus += checkTimeAchievements(earned);
    const count = newCompleted.length;
    if (count === 1) bonus += unlockAchievement("first_topic");
    if (count === 5) bonus += unlockAchievement("five_done");
    if (count === 10) bonus += unlockAchievement("half_done");
    if (count === 19) { bonus += unlockAchievement("all_done"); setTimeout(() => setShowCert(true), 1800); }
    if (sessionDone.current === 3) bonus += unlockAchievement("speed_run");
    const total = topic.xp + bonus;
    addXp(total);
  }

  function handleDcAnswer(idx) {
    if (dcDone) return;
    setDcAnswer(idx);
    setDcDone(true);
    if (idx === challenge.ans) {
      const bonus = unlockAchievement("quiz_ace");
      addXp(challenge.xp + bonus);
    }
  }

  const leaderboard = FAKE_LB.map(e => e.isMe ? { ...e, xp } : e)
    .sort((a, b) => b.xp - a.xp);
  const rankIcons = ["🥇", "🥈", "🥉"];

  const tabs = [
    { id: "learn", label: "📚 Learn" },
    { id: "challenge", label: "⚡ Daily Challenge" },
    { id: "achievements", label: "🏆 Achievements" },
    { id: "leaderboard", label: "🥇 Leaderboard" },
  ];

  return (
    <div className="game-root">
      <style>{GAME_CSS}{GAME_CSS2}{CERT_CSS}</style>

      {/* HUD */}
      <div className="game-hud">
        <div className="game-avatar">🧑‍💻</div>
        <div className="game-level-badge" style={{ color: level.color, borderColor: level.color }}>
          {level.icon} {level.name}
        </div>
        <div className="game-xp-wrap">
          <div className="game-xp-label">
            <span>XP Progress</span>
            <span style={{ color: level.color, fontWeight: 700 }}>{xp} XP</span>
          </div>
          <div className="game-xp-bar">
            <div className="game-xp-fill" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
        <div className="game-chip">📚 {completed.length}/{TOPICS_META.length} topics</div>
        <div className="game-chip">🏆 {earned.length} achievements</div>
        {allDone && (
          <button onClick={() => setShowCert(true)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid #ffd166",
            background: "rgba(255,209,102,.12)", color: "#ffd166",
            fontSize: 12, fontWeight: 700, cursor: "pointer"
          }}>🎓 View Certificate</button>
        )}
      </div>

      {/* Tabs */}
      <div className="game-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`game-tab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Learn Tab */}
      {tab === "learn" && (
        <div className="game-section">
          <DSAHub
            onMarkComplete={handleMarkComplete}
            completedTopics={completed}
          />
        </div>
      )}

      {/* Daily Challenge Tab */}
      {tab === "challenge" && (
        <div className="game-section">
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9090a8" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#e0e0f0" }}>Coming Soon</div>
            <div style={{ fontSize: 14 }}>Daily challenges are under construction. Check back soon!</div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {tab === "achievements" && (
        <div className="game-section">
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🏆 Achievements</div>
          <div className="ach-grid">
            {ACHIEVEMENTS.map(a => {
              const isEarned = earned.includes(a.id);
              return (
                <div key={a.id} className={`ach-card${isEarned ? " earned" : " locked"}`}>
                  <div className="ach-icon">{a.icon}</div>
                  <div>
                    <div className="ach-title">{a.title}</div>
                    <div className="ach-desc">{a.desc}</div>
                    <div className="ach-xp">+{a.xp} XP {isEarned ? "✅" : "🔒"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {tab === "leaderboard" && (
        <div className="game-section">
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🥇 Leaderboard</div>
          {leaderboard.map((entry, i) => (
            <div key={entry.name} className={`lb-row${entry.isMe ? " me" : ""}`}>
              <div className="lb-rank">{rankIcons[i] || `#${i + 1}`}</div>
              <div className="lb-avatar">{entry.avatar}</div>
              <div className="lb-name">{entry.name}{entry.isMe ? " (You)" : ""}</div>
              <div className="lb-xp">{entry.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate */}
      {showCert && <Certificate xp={xp} completed={completed} onClose={() => setShowCert(false)} />}

      {/* XP Popup */}
      {xpPopup !== null && (
        <div className="xp-popup">+{xpPopup} XP ⚡</div>
      )}

      {/* Achievement Toast */}
      {achToast && (
        <div className="ach-toast">
          <div className="ach-toast-icon">{achToast.icon}</div>
          <div>
            <div className="ach-toast-title">Achievement Unlocked: {achToast.title}</div>
            <div className="ach-toast-desc">{achToast.desc} · +{achToast.xp} XP</div>
          </div>
        </div>
      )}
    </div>
  );
}
