
import { useState, useEffect, useRef, useCallback } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from "recharts";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ROLES = {
  frontend: {
    label: "Frontend Developer",
    icon: "🎨",
    color: "#00e5ff",
    skills: { JavaScript: 85, React: 80, CSS: 75, ProblemSolving: 70, Communication: 65, SystemDesign: 40, Python: 20, DataStructures: 55 }
  },
  backend: {
    label: "Backend Developer",
    icon: "⚙️",
    color: "#7c3aed",
    skills: { JavaScript: 75, Python: 80, SystemDesign: 80, DataStructures: 75, ProblemSolving: 80, Communication: 60, React: 30, CSS: 25 }
  },
  fullstack: {
    label: "Full Stack Developer",
    icon: "🔥",
    color: "#f59e0b",
    skills: { JavaScript: 85, React: 75, Python: 70, SystemDesign: 70, DataStructures: 70, ProblemSolving: 75, Communication: 65, CSS: 65 }
  },
  dataAnalyst: {
    label: "Data Analyst",
    icon: "📊",
    color: "#10b981",
    skills: { Python: 85, DataStructures: 75, ProblemSolving: 80, Communication: 75, SystemDesign: 60, JavaScript: 40, React: 20, CSS: 15 }
  },
  devops: {
    label: "DevOps Engineer",
    icon: "🚀",
    color: "#ef4444",
    skills: { SystemDesign: 90, ProblemSolving: 80, Python: 70, DataStructures: 65, Communication: 65, JavaScript: 50, React: 25, CSS: 20 }
  }
};

const SKILL_KEYS = ["JavaScript", "React", "Python", "CSS", "SystemDesign", "DataStructures", "ProblemSolving", "Communication"];
const SKILL_ICONS = { JavaScript: "⚡", React: "⚛️", Python: "🐍", CSS: "🎨", SystemDesign: "🏗️", DataStructures: "🌳", ProblemSolving: "🧩", Communication: "💬" };

const MARKET_DATA = [
  { skill: "JavaScript", demand: 92 }, { skill: "Python", demand: 88 },
  { skill: "React", demand: 85 }, { skill: "Node.js", demand: 81 },
  { skill: "SQL", demand: 79 }, { skill: "TypeScript", demand: 76 },
  { skill: "AWS", demand: 73 }, { skill: "Docker", demand: 70 }
];

const TREND_DATA = [
  { month: "Jul", jobs: 12000 }, { month: "Aug", jobs: 14500 },
  { month: "Sep", jobs: 13800 }, { month: "Oct", jobs: 16200 },
  { month: "Nov", jobs: 15600 }, { month: "Dec", jobs: 18900 },
  { month: "Jan", jobs: 21000 }, { month: "Feb", jobs: 23400 }
];

const DEMO_USER = {
  name: "Demo User", email: "demo@rejexiq.com",
  skills: { JavaScript: 72, React: 68, Python: 45, CSS: 80, SystemDesign: 35, DataStructures: 55, ProblemSolving: 70, Communication: 75 },
  assessmentDone: true
};

const TOUR_STEPS = [
  { target: "dashboard", title: "Welcome to RejexIQ! 👋", text: "This is your Career Intelligence Dashboard. Everything you need is here." },
  { target: "assessment", title: "Skill Assessment 🎯", text: "Rate yourself on key technical skills. We'll calculate your career readiness score." },
  { target: "career", title: "Career Match 🏆", text: "See which roles you're best suited for based on your skill profile." },
  { target: "market", title: "Market Demand 📈", text: "Real industry data showing which skills are most in demand right now." },
  { target: "resume", title: "Resume Builder 📄", text: "Build a professional resume with live preview and PDF export." }
];

// ─── UTILS ────────────────────────────────────────────────────────────────────

function calcReadiness(userSkills, roleKey) {
  const role = ROLES[roleKey];
  if (!role) return 0;
  let total = 0, count = 0;
  for (const [skill, required] of Object.entries(role.skills)) {
    const user = userSkills[skill] || 0;
    total += Math.min(100, (user / required) * 100);
    count++;
  }
  return Math.round(total / count);
}

function getBestRole(userSkills) {
  let best = null, bestScore = 0;
  for (const key of Object.keys(ROLES)) {
    const score = calcReadiness(userSkills, key);
    if (score > bestScore) { best = key; bestScore = score; }
  }
  return { key: best, score: bestScore };
}

function getSkillGap(userSkills, roleKey) {
  const role = ROLES[roleKey];
  return Object.entries(role.skills)
    .map(([skill, required]) => ({ skill, required, user: userSkills[skill] || 0, gap: Math.max(0, required - (userSkills[skill] || 0)) }))
    .filter(x => x.gap > 0)
    .sort((a, b) => b.gap - a.gap);
}

function validateEmail(email) {
  if (/[,\s]/.test(email)) return "Email cannot contain spaces or commas";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
  return null;
}

function validatePassword(pwd) {
  if (pwd.length < 6) return "Password must be at least 6 characters";
  return null;
}

function passwordStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "#374151" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#374151", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  return { score, label: labels[score], color: colors[score] };
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const G = {
  bg: "#0a0e27",
  surface: "#141b3a",
  card: "#1a2347",
  border: "#2d3a5f",
  accent: "#ff6b9d",
  accentDim: "rgba(255,107,157,0.15)",
  purple: "#c084fc",
  cyan: "#22d3ee",
  text: "#f0f4ff",
  muted: "#94a3b8",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171"
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body, #root { 
    background: linear-gradient(135deg, ${G.bg} 0%, #1a1f3a 100%);
    color: ${G.text}; 
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${G.bg}; }
  ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${G.accent}; }

  .syne { font-family: 'Space Grotesk', sans-serif; }
  .mono { font-family: 'Fira Code', monospace; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(255,107,157,0.3); } 50% { box-shadow: 0 0 40px rgba(255,107,157,0.6); } }
  @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
  @keyframes floatSkill { 
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(10px, -10px) rotate(5deg); }
    50% { transform: translate(-5px, -20px) rotate(-5deg); }
    75% { transform: translate(-10px, -10px) rotate(3deg); }
  }
  @keyframes typewriter { from { width: 0; } to { width: 100%; } }
  @keyframes blink { 0%,100% { border-color: ${G.accent}; } 50% { border-color: transparent; } }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

  .fade-up { animation: fadeUp 0.6s ease forwards; }
  .fade-in { animation: fadeIn 0.4s ease forwards; }
  .float-anim { animation: float 3s ease-in-out infinite; }
  .glow-anim { animation: glow 2s ease-in-out infinite; }
  .pulse-anim { animation: pulse 2s ease-in-out infinite; }
  .bounce-anim { animation: bounce 2s ease-in-out infinite; }

  .floating-skill {
    position: absolute;
    padding: 12px 20px;
    background: linear-gradient(135deg, ${G.card}, ${G.surface});
    border: 2px solid ${G.border};
    border-radius: 50px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: ${G.text};
    cursor: pointer;
    transition: all 0.3s ease;
    animation: floatSkill 8s ease-in-out infinite;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .floating-skill:hover {
    transform: scale(1.1) !important;
    border-color: ${G.accent};
    box-shadow: 0 0 30px ${G.accent}80;
    background: linear-gradient(135deg, ${G.accent}40, ${G.purple}40);
  }

  .btn-primary {
    background: linear-gradient(135deg, ${G.accent}, ${G.purple});
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(255,107,157,0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,107,157,0.5); }
  .btn-primary:active { transform: translateY(0); }

  .btn-outline {
    background: transparent;
    color: ${G.accent};
    border: 1px solid ${G.accent};
    padding: 11px 28px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-outline:hover { background: ${G.accentDim}; transform: translateY(-2px); }

  .btn-ghost {
    background: transparent;
    color: ${G.muted};
    border: 1px solid ${G.border};
    padding: 10px 20px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { color: ${G.text}; border-color: ${G.muted}; }

  .card {
    background: ${G.card};
    border: 1px solid ${G.border};
    border-radius: 16px;
    padding: 24px;
    transition: all 0.3s ease;
  }
  .card:hover { border-color: rgba(0,229,255,0.3); box-shadow: 0 8px 40px rgba(0,0,0,0.4); }

  .input-field {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid ${G.border};
    border-radius: 10px;
    padding: 12px 16px;
    color: ${G.text};
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
  }
  .input-field:focus { border-color: ${G.accent}; box-shadow: 0 0 0 3px rgba(255,107,157,0.1); }
  .input-field::placeholder { color: ${G.muted}; }
  .input-field.error { border-color: ${G.danger}; }
  
  .input-field option {
    background: ${G.card};
    color: ${G.text};
    padding: 12px;
  }
  
  .input-field select option {
    background: ${G.card};
    color: ${G.text};
  }
  
  select.input-field {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff6b9d' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }

  .slider-custom {
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: ${G.border};
    outline: none;
    transition: all 0.2s;
  }
  .slider-custom::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${G.accent};
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,229,255,0.5);
  }
  .slider-custom:hover { background: rgba(0,229,255,0.2); }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-radius: 10px;
    color: ${G.muted};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }
  .nav-link:hover { color: ${G.text}; background: rgba(255,255,255,0.05); }
  .nav-link.active { color: ${G.accent}; background: ${G.accentDim}; }

  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'Syne', sans-serif;
    letter-spacing: 0.5px;
  }

  .gradient-text {
    background: linear-gradient(135deg, ${G.accent}, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-border {
    position: relative;
    background: ${G.card};
    border-radius: 16px;
  }
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 17px;
    background: linear-gradient(135deg, ${G.accent}, #7c3aed);
    z-index: -1;
  }

  .hero-grid {
    background-image: 
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .score-ring {
    position: relative;
    width: 140px;
    height: 140px;
  }
  .score-ring svg { transform: rotate(-90deg); }
  .score-ring .score-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .progress-bar {
    height: 8px;
    background: ${G.border};
    border-radius: 4px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 1s ease;
  }

  .tour-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 9998;
    pointer-events: none;
  }
  .tour-popup {
    position: fixed;
    background: ${G.card};
    border: 1px solid ${G.accent};
    border-radius: 16px;
    padding: 20px;
    width: 300px;
    z-index: 9999;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,229,255,0.2);
  }

  .section-enter { animation: fadeUp 0.5s ease forwards; }

  .chat-bubble {
    background: rgba(0,229,255,0.08);
    border: 1px solid rgba(0,229,255,0.2);
    border-radius: 12px 12px 12px 0;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 1.5;
  }
  .chat-bubble.user {
    background: rgba(124,58,237,0.15);
    border-color: rgba(124,58,237,0.3);
    border-radius: 12px 12px 0 12px;
  }

  .resume-preview {
    background: white;
    color: #111;
    padding: 40px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    line-height: 1.5;
    min-height: 600px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .stat-card {
    background: linear-gradient(135deg, rgba(0,229,255,0.05), rgba(124,58,237,0.05));
    border: 1px solid ${G.border};
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s;
  }
  .stat-card:hover { border-color: rgba(0,229,255,0.3); transform: translateY(-2px); }

  .leaderboard-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    transition: background 0.2s;
  }
  .leaderboard-row:hover { background: rgba(255,255,255,0.03); }

  .tooltip-custom { 
    background: ${G.surface}; 
    border: 1px solid ${G.border}; 
    border-radius: 8px; 
    padding: 8px 12px;
    font-size: 12px;
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 140, color = G.accent, label = "" }) {
  const r = (size / 2) - 12;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={G.border} strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s ease", filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div className="score-text">
        <span className="syne" style={{ fontSize: size * 0.22, fontWeight: 800, color }}>{score}%</span>
        {label && <span style={{ fontSize: 10, color: G.muted, marginTop: 2 }}>{label}</span>}
      </div>
    </div>
  );
}

function ProgressBar({ value, color = G.accent, animated = true }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{
        width: animated ? `${value}%` : `${value}%`,
        background: `linear-gradient(90deg, ${color}, ${color}aa)`,
        boxShadow: `0 0 10px ${color}40`
      }} />
    </div>
  );
}

function Tooltip({ children, text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)", background: G.surface, border: `1px solid ${G.border}`,
          borderRadius: 8, padding: "6px 12px", fontSize: 12, color: G.muted,
          whiteSpace: "nowrap", zIndex: 100, pointerEvents: "none"
        }}>{text}</span>
      )}
    </span>
  );
}

function LoadingSpinner({ size = 24 }) {
  return (
    <div style={{
      width: size, height: size, border: `2px solid ${G.border}`,
      borderTop: `2px solid ${G.accent}`, borderRadius: "50%",
      animation: "spin 0.8s linear infinite"
    }} />
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

// LANDING PAGE
function LandingPage({ onNav, onDemo }) {
  const [typeIdx, setTypeIdx] = useState(0);
  const phrases = ["Evaluate Your Skills", "Analyze Career Readiness", "Build Your Professional Resume", "Discover Your Best Role"];
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const charRef = useRef(0);

  useEffect(() => {
    const phrase = phrases[typeIdx];
    if (typing) {
      if (charRef.current < phrase.length) {
        const t = setTimeout(() => {
          setDisplayed(phrase.slice(0, charRef.current + 1));
          charRef.current++;
        }, 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (charRef.current > 0) {
        const t = setTimeout(() => {
          setDisplayed(phrase.slice(0, charRef.current - 1));
          charRef.current--;
        }, 30);
        return () => clearTimeout(t);
      } else {
        setTypeIdx((i) => (i + 1) % phrases.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, typeIdx]);

  const features = [
    { icon: "🎯", title: "Skill Assessment", desc: "Rate yourself across 8 technical & soft skills. Get an instant readiness score.", action: () => onNav("assessment") },
    { icon: "📊", title: "Career Readiness Score", desc: "AI-powered analysis comparing your profile to real job requirements.", action: () => onNav("career") },
    { icon: "📈", title: "Market Demand Analysis", desc: "See which skills are trending and how your profile stacks up to industry demand.", action: () => onNav("market") },
    { icon: "📄", title: "Interactive Resume Builder", desc: "Drag-and-drop builder with live preview. Download as PDF instantly.", action: () => onNav("resume") }
  ];

  const steps = [
    { n: "01", title: "Create Account", desc: "Sign up in seconds. No credit card." },
    { n: "02", title: "Take Assessment", desc: "Rate your skills with our interactive slider quiz." },
    { n: "03", title: "View Score", desc: "Get your career readiness score and best-matching roles." },
    { n: "04", title: "Improve & Build", desc: "Follow your personalized roadmap and build your resume." }
  ];

  const sampleSkills = [
    { name: "Programming", val: 85, color: G.accent },
    { name: "Problem Solving", val: 72, color: "#7c3aed" },
    { name: "Communication", val: 60, color: G.warning }
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(10,14,39,0.95)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${G.border}`, padding: "0 40px"
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="syne" style={{ fontSize: 24, fontWeight: 800, cursor: "pointer" }} onClick={() => onNav("home")}>
            <span style={{ background: `linear-gradient(135deg, ${G.accent}, ${G.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Rejex</span>
            <span style={{ color: G.text }}>IQ</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="btn-primary" onClick={() => onNav("signup")}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-grid" style={{ paddingTop: 160, paddingBottom: 100, position: "relative", overflow: "hidden", minHeight: "100vh" }}>
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, background: `radial-gradient(circle, ${G.accent}20 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "30%", right: "10%", width: 500, height: 500, background: `radial-gradient(circle, ${G.purple}20 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "40%", width: 350, height: 350, background: `radial-gradient(circle, ${G.cyan}15 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none", filter: "blur(60px)" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", textAlign: "center", position: "relative" }}>
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: G.accentDim, border: `1px solid rgba(0,229,255,0.3)`, borderRadius: 20, padding: "6px 16px", marginBottom: 32, fontSize: 12, color: G.accent, fontWeight: 600 }}>
            <span className="pulse-anim" style={{ width: 6, height: 6, background: G.accent, borderRadius: "50%", display: "inline-block" }} />
            Career Intelligence Platform
          </div>

          <h1 className="syne fade-up" style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, animationDelay: "0.1s" }}>
            Analyze Your Skills.<br />
            <span className="gradient-text">Build Your Career.</span>
          </h1>

          <p className="fade-up" style={{ fontSize: 18, color: G.muted, maxWidth: 560, margin: "0 auto 16px", lineHeight: 1.6, animationDelay: "0.2s" }}>
            RejexIQ helps students evaluate their technical skills and measure career readiness using intelligent analytics and real market data.
          </p>

          <div className="fade-up mono" style={{ fontSize: 20, color: G.accent, height: 36, marginBottom: 40, animationDelay: "0.3s" }}>
            {displayed}<span style={{ borderRight: `2px solid ${G.accent}`, animation: "blink 1s infinite", marginLeft: 2 }} />
          </div>

          <div className="fade-up" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animationDelay: "0.4s" }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => onNav("assessment")}>
              🚀 Start Assessment
            </button>
            <button className="btn-outline" style={{ fontSize: 16, padding: "13px 36px" }} onClick={() => onNav("dashboard")}>
              Explore Dashboard
            </button>
            <button className="btn-ghost" onClick={onDemo} style={{ fontSize: 16, padding: "13px 36px" }}>
              ✨ Try Demo Mode
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 40px", background: G.surface }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="syne" style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
              Everything You Need to <span className="gradient-text">Land the Job</span>
            </h2>
            <p style={{ color: G.muted, fontSize: 16 }}>Four powerful tools working together to accelerate your career</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ cursor: "pointer", animationDelay: `${i * 0.1}s` }} onClick={f.action}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: G.text }}>{f.title}</h3>
                <p style={{ color: G.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{f.desc}</p>
                <span style={{ color: G.accent, fontSize: 13, fontWeight: 600 }}>Explore →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="syne" style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>How It Works</h2>
            <p style={{ color: G.muted }}>Four steps to your career clarity</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative" }}>
                {i < steps.length - 1 && <div style={{ position: "absolute", top: 24, left: "60%", right: "-40%", height: 1, background: `linear-gradient(90deg, ${G.accent}40, transparent)`, display: "none" }} />}
                <div className="mono" style={{ fontSize: 42, fontWeight: 800, color: G.border, marginBottom: 12 }}>{s.n}</div>
                <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: G.muted, fontSize: 14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section style={{ padding: "80px 40px", background: G.surface }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <h2 className="syne" style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
                Your Personal<br /><span className="gradient-text">Career Dashboard</span>
              </h2>
              <p style={{ color: G.muted, marginBottom: 24, lineHeight: 1.7 }}>
                See exactly where you stand. Track skill progress, compare with market demand, and get actionable improvement plans — all in one place.
              </p>
              <button className="btn-primary" onClick={() => onNav("signup")}>View Dashboard →</button>
            </div>
            <div className="card float-anim">
              <div style={{ marginBottom: 20, fontSize: 14, color: G.muted, fontWeight: 600 }}>SKILL OVERVIEW</div>
              {sampleSkills.map((s, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span>{s.name}</span>
                    <span className="mono" style={{ color: s.color }}>{s.val}%</span>
                  </div>
                  <ProgressBar value={s.val} color={s.color} />
                </div>
              ))}
              <div style={{ marginTop: 24, padding: "16px", background: G.accentDim, borderRadius: 10, border: `1px solid rgba(0,229,255,0.2)` }}>
                <div style={{ fontSize: 12, color: G.muted }}>Career Readiness Score</div>
                <div className="syne" style={{ fontSize: 32, fontWeight: 800, color: G.accent }}>72%</div>
                <div style={{ fontSize: 12, color: G.success }}>▲ Best Match: Frontend Developer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI ASSISTANT */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div className="float-anim" style={{ fontSize: 72, marginBottom: 24 }}>🤖</div>
          <h2 className="syne" style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            Meet Your <span className="gradient-text">AI Career Assistant</span>
          </h2>
          <p style={{ color: G.muted, fontSize: 16, maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Get guidance on improving skills, preparing for technical roles, and navigating your career path with our intelligent assistant.
          </p>
          <button className="btn-outline" onClick={() => onNav("signup")}>Try AI Assistant →</button>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 40px", background: "linear-gradient(135deg, rgba(0,229,255,0.05), rgba(124,58,237,0.05))", borderTop: `1px solid ${G.border}` }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 className="syne" style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
            Ready to Evaluate Your Skills?
          </h2>
          <p style={{ color: G.muted, marginBottom: 32, fontSize: 16 }}>
            Join students who've already discovered their career readiness score.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ padding: "14px 40px", fontSize: 16 }} onClick={() => onNav("signup")}>Create Account</button>
            <button className="btn-ghost" onClick={onDemo}>Try Demo First</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: G.surface, borderTop: `1px solid ${G.border}`, padding: "40px", textAlign: "center" }}>
        <div className="syne" style={{ fontSize: 20, fontWeight: 800, color: G.accent, marginBottom: 16 }}>
          Rejex<span style={{ color: G.text }}>IQ</span>
        </div>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 24 }}>
          {["About", "Features", "Assessment", "Resume Builder"].map(l => (
            <span key={l} style={{ color: G.muted, fontSize: 14, cursor: "pointer" }}
              onClick={() => onNav(l === "Assessment" ? "assessment" : l === "Resume Builder" ? "resume" : "signup")}>{l}</span>
          ))}
          <a href="https://github.com/pragtijasrai/RejexIQ" target="_blank" rel="noreferrer" style={{ color: G.muted, fontSize: 14 }}>GitHub</a>
        </div>
        <p style={{ color: G.muted, fontSize: 13 }}>© 2025 RejexIQ — Skill Evaluation & Career Readiness Platform</p>
      </footer>
    </div>
  );
}

// AUTH PAGES - Multi-Stage Registration
function AuthPage({ type, onLogin, onNav }) {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({
    // Stage 1: Basic Info
    name: "", email: "", username: "", password: "", confirm: "",
    // Stage 2: Education
    education: "", university: "", graduationYear: "", major: "",
    // Stage 3: Skills
    skills: {},
    // Stage 4: Projects & Links
    github: "", linkedin: "", portfolio: "", projects: "",
    // Stage 5: Additional
    bio: "", experience: "", interests: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pwStrength, setPwStrength] = useState({ score: 0 });

  const isLogin = type === "login";
  const totalStages = isLogin ? 1 : 5;

  function validateStage() {
    const e = {};
    if (isLogin || stage === 1) {
      if (!isLogin && !form.name.trim()) e.name = "Name is required";
      if (!isLogin && !form.username.trim()) e.username = "Username is required";
      const emailErr = validateEmail(form.email);
      if (emailErr) e.email = emailErr;
      const pwErr = validatePassword(form.password);
      if (pwErr) e.password = pwErr;
      if (!isLogin && form.password !== form.confirm) e.confirm = "Passwords do not match";
    }
    if (stage === 2 && !isLogin) {
      if (!form.education) e.education = "Education level is required";
      if (!form.university.trim()) e.university = "University/School name is required";
    }
    return e;
  }

  function handleNext() {
    const e = validateStage();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    
    if (isLogin || stage === totalStages) {
      setLoading(true);
      setTimeout(() => {
        const userData = { 
          ...form,
          name: form.name || form.email.split("@")[0],
          assessmentDone: false 
        };
        setLoading(false);
        onLogin(userData);
      }, 1200);
    } else {
      setStage(stage + 1);
    }
  }

  function handleBack() {
    if (stage > 1) setStage(stage - 1);
  }

  const stageInfo = [
    { title: "Basic Information", icon: "👤", desc: "Let's start with the basics" },
    { title: "Education Details", icon: "🎓", desc: "Tell us about your education" },
    { title: "Your Skills", icon: "💡", desc: "What are you good at?" },
    { title: "Projects & Links", icon: "🔗", desc: "Show us your work" },
    { title: "About You", icon: "✨", desc: "Final touches" }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: `linear-gradient(135deg, ${G.bg} 0%, #1a1f3a 100%)` }}>
      <div style={{ position: "fixed", top: "20%", left: "5%", width: 300, height: 300, background: `radial-gradient(circle, ${G.accent}15 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none", filter: "blur(40px)" }} />
      <div style={{ position: "fixed", bottom: "20%", right: "5%", width: 400, height: 400, background: `radial-gradient(circle, ${G.purple}15 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none", filter: "blur(40px)" }} />

      <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="syne" style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            <span style={{ background: `linear-gradient(135deg, ${G.accent}, ${G.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Rejex</span>IQ
          </div>
          <h1 className="syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {isLogin ? "Welcome Back!" : stageInfo[stage - 1].title}
          </h1>
          <p style={{ color: G.muted, fontSize: 14 }}>
            {isLogin ? "Sign in to continue your journey" : stageInfo[stage - 1].desc}
          </p>
        </div>

        {/* Progress Bar for Signup */}
        {!isLogin && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              {stageInfo.map((s, i) => (
                <div key={i} style={{ textAlign: "center", flex: 1, cursor: i + 1 <= stage ? "pointer" : "default" }}
                  onClick={() => i + 1 <= stage && setStage(i + 1)}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: i + 1 === stage ? `linear-gradient(135deg, ${G.accent}, ${G.purple})` : i + 1 < stage ? G.surface : G.surface,
                    border: `2px solid ${i + 1 === stage ? G.accent : i + 1 < stage ? G.purple : G.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 8px", fontSize: 18,
                    transition: "all 0.3s ease",
                    opacity: i + 1 <= stage ? 1 : 0.5
                  }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: 10, color: i + 1 === stage ? G.accent : i + 1 < stage ? G.purple : G.muted, fontWeight: 600 }}>
                    Step {i + 1}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: 4, background: G.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(stage / totalStages) * 100}%`,
                background: `linear-gradient(90deg, ${G.accent}, ${G.purple})`,
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>
        )}

        <div className="card" style={{ padding: 40, background: `${G.card}dd`, backdropFilter: "blur(20px)", border: `1px solid ${G.border}` }}>
          {/* Stage 1: Basic Info */}
          {(isLogin || stage === 1) && (
            <div className="fade-in">
              {!isLogin && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Full Name *</label>
                    <input className={`input-field ${errors.name ? "error" : ""}`} placeholder="John Doe"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    {errors.name && <p style={{ color: G.danger, fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Username *</label>
                    <input className={`input-field ${errors.username ? "error" : ""}`} placeholder="johndoe"
                      value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, "") })} />
                    {errors.username && <p style={{ color: G.danger, fontSize: 12, marginTop: 4 }}>{errors.username}</p>}
                  </div>
                </>
              )}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Email Address *</label>
                <input className={`input-field ${errors.email ? "error" : ""}`} type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                {errors.email && <p style={{ color: G.danger, fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
              </div>
              <div style={{ marginBottom: !isLogin ? 8 : 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Password *</label>
                <input className={`input-field ${errors.password ? "error" : ""}`} type="password" placeholder="Min 6 characters"
                  value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setPwStrength(passwordStrength(e.target.value)); }} />
                {errors.password && <p style={{ color: G.danger, fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
              </div>
              {!isLogin && form.password && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= pwStrength.score ? pwStrength.color : G.border, transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: pwStrength.color }}>{pwStrength.label}</span>
                </div>
              )}
              {!isLogin && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Confirm Password *</label>
                  <input className={`input-field ${errors.confirm ? "error" : ""}`} type="password" placeholder="Repeat password"
                    value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
                  {errors.confirm && <p style={{ color: G.danger, fontSize: 12, marginTop: 4 }}>{errors.confirm}</p>}
                </div>
              )}
            </div>
          )}

          {/* Stage 2: Education */}
          {!isLogin && stage === 2 && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Education Level *</label>
                <select className={`input-field ${errors.education ? "error" : ""}`}
                  value={form.education} onChange={e => setForm({ ...form, education: e.target.value })}>
                  <option value="">Select your education level</option>
                  <option value="high-school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
                {errors.education && <p style={{ color: G.danger, fontSize: 12, marginTop: 4 }}>{errors.education}</p>}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>University/School *</label>
                <input className={`input-field ${errors.university ? "error" : ""}`} placeholder="Your institution name"
                  value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} />
                {errors.university && <p style={{ color: G.danger, fontSize: 12, marginTop: 4 }}>{errors.university}</p>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Graduation Year</label>
                  <input className="input-field" type="number" placeholder="2024"
                    value={form.graduationYear} onChange={e => setForm({ ...form, graduationYear: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Major/Field</label>
                  <input className="input-field" placeholder="Computer Science"
                    value={form.major} onChange={e => setForm({ ...form, major: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {/* Stage 3: Skills */}
          {!isLogin && stage === 3 && (
            <div className="fade-in">
              <p style={{ color: G.muted, fontSize: 14, marginBottom: 20 }}>
                Select your skill levels (you can update these later in the assessment)
              </p>
              {SKILL_KEYS.slice(0, 5).map(skill => (
                <div key={skill} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: G.text }}>{SKILL_ICONS[skill]} {skill}</label>
                    <span className="mono" style={{ fontSize: 14, color: G.accent }}>{form.skills[skill] || 50}</span>
                  </div>
                  <input type="range" className="slider-custom" min={0} max={100}
                    value={form.skills[skill] || 50}
                    onChange={e => setForm({ ...form, skills: { ...form.skills, [skill]: Number(e.target.value) } })}
                    style={{ background: `linear-gradient(90deg, ${G.accent} ${form.skills[skill] || 50}%, ${G.border} ${form.skills[skill] || 50}%)` }} />
                </div>
              ))}
            </div>
          )}

          {/* Stage 4: Projects & Links */}
          {!isLogin && stage === 4 && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>GitHub Profile</label>
                <input className="input-field" placeholder="https://github.com/yourusername"
                  value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>LinkedIn Profile</label>
                <input className="input-field" placeholder="https://linkedin.com/in/yourusername"
                  value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Portfolio Website</label>
                <input className="input-field" placeholder="https://yourportfolio.com"
                  value={form.portfolio} onChange={e => setForm({ ...form, portfolio: e.target.value })} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Notable Projects</label>
                <textarea className="input-field" rows={4} placeholder="Describe your best projects (one per line)"
                  value={form.projects} onChange={e => setForm({ ...form, projects: e.target.value })} />
              </div>
            </div>
          )}

          {/* Stage 5: Additional Info */}
          {!isLogin && stage === 5 && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Bio</label>
                <textarea className="input-field" rows={3} placeholder="Tell us about yourself..."
                  value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Years of Experience</label>
                <select className="input-field" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}>
                  <option value="">Select experience level</option>
                  <option value="0">No experience (Student)</option>
                  <option value="1">Less than 1 year</option>
                  <option value="2">1-2 years</option>
                  <option value="3">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Interests & Goals</label>
                <textarea className="input-field" rows={3} placeholder="What are you interested in? What are your career goals?"
                  value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onClick={handleNext} disabled={loading}>
              {loading ? <><LoadingSpinner size={18} /> Processing...</> : 
                (isLogin ? "Sign In" : stage === totalStages ? "Complete Registration" : "Next")}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: G.muted }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: G.accent, cursor: "pointer", fontWeight: 600 }}
              onClick={() => { onNav(isLogin ? "signup" : "login"); setStage(1); }}>
              {isLogin ? "Sign Up" : "Log In"}
            </span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button className="btn-ghost" onClick={() => onNav("home")}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

// SIDEBAR
function Sidebar({ active, onNav, user, onLogout }) {
  const navItems = [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "profile", icon: "👤", label: "Profile" },
    { key: "assessment", icon: "🎯", label: "Skill Assessment" },
    { key: "career", icon: "🏆", label: "Career Match" },
    { key: "market", icon: "📈", label: "Market Demand" },
    { key: "resume", icon: "📄", label: "Resume Builder" },
    { key: "assistant", icon: "🤖", label: "AI Assistant" },
    { key: "leaderboard", icon: "🥇", label: "Leaderboard" }
  ];

  return (
    <div style={{
      width: 240, background: G.surface, borderRight: `1px solid ${G.border}`,
      display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: `1px solid ${G.border}` }}>
        <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>
          <span style={{ color: G.accent }}>Rejex</span>IQ
        </div>
        <div style={{ fontSize: 11, color: G.muted, marginTop: 2 }}>Career Intelligence</div>
      </div>

      {/* User */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${G.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${G.accent}, #7c3aed)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: G.text }}>{user.name}</div>
            <div style={{ fontSize: 11, color: G.muted }}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
        {navItems.map(item => (
          <button key={item.key} className={`nav-link ${active === item.key ? "active" : ""}`}
            onClick={() => onNav(item.key)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 12px", borderTop: `1px solid ${G.border}` }}>
        <button className="nav-link" onClick={onLogout} style={{ color: G.danger }}>
          <span>🚪</span><span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

// PROFILE PAGE
function ProfilePage({ user, onUpdateUser, onNav }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    university: user.university || "",
    major: user.major || "",
    graduationYear: user.graduationYear || "",
    github: user.github || "",
    linkedin: user.linkedin || "",
    portfolio: user.portfolio || "",
    experience: user.experience || ""
  });
  const [profilePic, setProfilePic] = useState(user.profilePic || null);
  const [uploading, setUploading] = useState(false);

  function handleSave() {
    onUpdateUser({ ...form, profilePic });
    setEditing(false);
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="section-enter">
      <div style={{ marginBottom: 32 }}>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          My Profile
        </h1>
        <p style={{ color: G.muted }}>Manage your account settings and personal information</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32 }}>
        {/* Left Column - Profile Picture */}
        <div>
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 20px" }}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: `3px solid ${G.accent}` }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${G.accent}, ${G.purple})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 72, fontWeight: 800, color: "#fff"
                }}>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              {editing && (
                <label style={{
                  position: "absolute", bottom: 10, right: 10,
                  width: 40, height: 40, borderRadius: "50%",
                  background: G.accent, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: 20, border: `2px solid ${G.card}`
                }}>
                  📷
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <h2 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{user.name}</h2>
            <p style={{ color: G.muted, fontSize: 14, marginBottom: 4 }}>@{user.username || "username"}</p>
            <p style={{ color: G.muted, fontSize: 13 }}>{user.email}</p>
            
            {!editing && (
              <>
                <button className="btn-primary" style={{ width: "100%", marginTop: 20 }} onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
                <button className="btn-outline" style={{ width: "100%", marginTop: 8, fontSize: 12 }} 
                  onClick={() => {
                    const dataStr = JSON.stringify(user, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `rejexiq-backup-${Date.now()}.json`;
                    link.click();
                  }}>
                  📥 Export Data
                </button>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card" style={{ padding: 20, marginTop: 16 }}>
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Stats</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: G.muted, fontSize: 14 }}>Skills Assessed</span>
                <span className="mono" style={{ color: G.accent, fontWeight: 600 }}>{Object.keys(user.skills || {}).length}/8</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: G.muted, fontSize: 14 }}>Profile Complete</span>
                <span className="mono" style={{ color: G.success, fontWeight: 600 }}>
                  {Math.round(([user.name, user.email, user.bio, user.university, user.github].filter(Boolean).length / 5) * 100)}%
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: G.muted, fontSize: 14 }}>Member Since</span>
                <span style={{ color: G.text, fontSize: 14 }}>2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          <div className="card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 className="syne" style={{ fontSize: 20, fontWeight: 700 }}>Personal Information</h3>
              {editing && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-ghost" onClick={() => { setEditing(false); setForm({ name: user.name, username: user.username, email: user.email, bio: user.bio, university: user.university, major: user.major, graduationYear: user.graduationYear, github: user.github, linkedin: user.linkedin, portfolio: user.portfolio, experience: user.experience }); }}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSave}>Save Changes</button>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Full Name</label>
                {editing ? (
                  <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                ) : (
                  <p style={{ fontSize: 15, color: G.text }}>{user.name || "Not set"}</p>
                )}
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Username</label>
                {editing ? (
                  <input className="input-field" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                ) : (
                  <p style={{ fontSize: 15, color: G.text }}>@{user.username || "Not set"}</p>
                )}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Email</label>
                {editing ? (
                  <input className="input-field" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                ) : (
                  <p style={{ fontSize: 15, color: G.text }}>{user.email}</p>
                )}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Bio</label>
                {editing ? (
                  <textarea className="input-field" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." />
                ) : (
                  <p style={{ fontSize: 15, color: G.text, lineHeight: 1.6 }}>{user.bio || "No bio added yet"}</p>
                )}
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${G.border}`, marginTop: 32, paddingTop: 24 }}>
              <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Education</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>University/School</label>
                  {editing ? (
                    <input className="input-field" value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} />
                  ) : (
                    <p style={{ fontSize: 15, color: G.text }}>{user.university || "Not set"}</p>
                  )}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Major</label>
                  {editing ? (
                    <input className="input-field" value={form.major} onChange={e => setForm({ ...form, major: e.target.value })} />
                  ) : (
                    <p style={{ fontSize: 15, color: G.text }}>{user.major || "Not set"}</p>
                  )}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Graduation Year</label>
                  {editing ? (
                    <input className="input-field" value={form.graduationYear} onChange={e => setForm({ ...form, graduationYear: e.target.value })} />
                  ) : (
                    <p style={{ fontSize: 15, color: G.text }}>{user.graduationYear || "Not set"}</p>
                  )}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Experience</label>
                  {editing ? (
                    <select className="input-field" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}>
                      <option value="">Select</option>
                      <option value="0">No experience</option>
                      <option value="1">Less than 1 year</option>
                      <option value="2">1-2 years</option>
                      <option value="3">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  ) : (
                    <p style={{ fontSize: 15, color: G.text }}>{user.experience || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${G.border}`, marginTop: 32, paddingTop: 24 }}>
              <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Links & Social</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>GitHub</label>
                  {editing ? (
                    <input className="input-field" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/username" />
                  ) : (
                    user.github ? <a href={user.github} target="_blank" rel="noreferrer" style={{ fontSize: 15, color: G.accent }}>{user.github}</a> : <p style={{ fontSize: 15, color: G.muted }}>Not set</p>
                  )}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>LinkedIn</label>
                  {editing ? (
                    <input className="input-field" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
                  ) : (
                    user.linkedin ? <a href={user.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: 15, color: G.accent }}>{user.linkedin}</a> : <p style={{ fontSize: 15, color: G.muted }}>Not set</p>
                  )}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted }}>Portfolio</label>
                  {editing ? (
                    <input className="input-field" value={form.portfolio} onChange={e => setForm({ ...form, portfolio: e.target.value })} placeholder="https://yourportfolio.com" />
                  ) : (
                    user.portfolio ? <a href={user.portfolio} target="_blank" rel="noreferrer" style={{ fontSize: 15, color: G.accent }}>{user.portfolio}</a> : <p style={{ fontSize: 15, color: G.muted }}>Not set</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// DASHBOARD
function Dashboard({ user, onNav, showTour, setShowTour }) {
  const hasAssessment = user.assessmentDone && Object.keys(user.skills || {}).length > 0;
  const skills = user.skills || {};
  const best = hasAssessment ? getBestRole(skills) : null;
  const avgScore = hasAssessment ? Math.round(Object.values(skills).reduce((a, b) => a + b, 0) / Object.values(skills).length) : 0;

  const radarData = SKILL_KEYS.map(k => ({ subject: k.replace(/([A-Z])/g, " $1").trim(), A: skills[k] || 0, fullMark: 100 }));

  return (
    <div className="section-enter">
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Welcome back, {user.name} 👋
        </h1>
        <p style={{ color: G.muted }}>
          {hasAssessment ? "Here's your career readiness overview" : "Complete your skill assessment to unlock full insights"}
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Readiness Score", val: hasAssessment ? `${avgScore}%` : "—", icon: "⚡", color: G.accent },
          { label: "Best Role Match", val: hasAssessment ? ROLES[best?.key]?.label.split(" ")[0] : "—", icon: "🏆", color: G.warning },
          { label: "Skills Assessed", val: hasAssessment ? `${SKILL_KEYS.length}/8` : "0/8", icon: "🎯", color: G.purple },
          { label: "Market Rank", val: hasAssessment ? "Top 35%" : "—", icon: "📈", color: G.success }
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span className="tag" style={{ background: `${s.color}20`, color: s.color }}>LIVE</span>
            </div>
            <div className="syne" style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: G.muted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {!hasAssessment ? (
        /* Onboarding CTA */
        <div className="gradient-border" style={{ padding: 40, textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <h2 className="syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Start Your Skill Assessment</h2>
          <p style={{ color: G.muted, marginBottom: 24 }}>Rate yourself on 8 key skills to unlock your personalized career readiness score, role matches, and improvement plan.</p>
          <button className="btn-primary" style={{ padding: "14px 40px", fontSize: 16 }} onClick={() => onNav("assessment")}>
            🚀 Begin Assessment
          </button>
        </div>
      ) : (
        /* Main content grid */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          {/* Radar chart */}
          <div className="card">
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Skill Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={G.border} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: G.muted, fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: G.muted, fontSize: 9 }} />
                <Radar dataKey="A" stroke={G.accent} fill={G.accent} fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Career readiness */}
          <div className="card">
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Career Readiness</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(ROLES).slice(0, 5).map(([key, role]) => {
                const score = calcReadiness(skills, key);
                return (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span>{role.icon} {role.label}</span>
                      <span className="mono" style={{ color: role.color }}>{score}%</span>
                    </div>
                    <ProgressBar value={score} color={role.color} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Skill scores */}
      {hasAssessment && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700 }}>Your Skill Profile</h3>
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => onNav("assessment")}>Re-assess</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {SKILL_KEYS.map(key => (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span>{SKILL_ICONS[key]} {key}</span>
                  <span className="mono" style={{ color: G.accent }}>{skills[key] || 0}%</span>
                </div>
                <ProgressBar value={skills[key] || 0} color={G.accent} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { icon: "📊", label: "View Market Trends", action: () => onNav("market"), color: G.accent },
          { icon: "📄", label: "Build Resume", action: () => onNav("resume"), color: G.warning },
          { icon: "🤖", label: "Ask AI Assistant", action: () => onNav("assistant"), color: G.purple },
          { icon: "🏆", label: "Career Roadmap", action: () => onNav("career"), color: G.success }
        ].map((a, i) => (
          <button key={i} className="card" style={{ textAlign: "left", cursor: "pointer", border: `1px solid ${G.border}`, background: "none" }}
            onClick={a.action}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: a.color }}>{a.label} →</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// SKILL ASSESSMENT
function SkillAssessment({ user, onSave, onNav }) {
  const [skills, setSkills] = useState(() =>
    Object.fromEntries(SKILL_KEYS.map(k => [k, user.skills?.[k] || 50]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const descriptions = {
    JavaScript: "Core web programming, ES6+, async/await, DOM manipulation",
    React: "Component architecture, hooks, state management, routing",
    Python: "Data structures, scripting, OOP, libraries like NumPy/Pandas",
    CSS: "Layouts, Flexbox, Grid, animations, responsive design",
    SystemDesign: "Architecture, scalability, databases, APIs, microservices",
    DataStructures: "Arrays, trees, graphs, sorting, dynamic programming",
    ProblemSolving: "Algorithmic thinking, LeetCode/DSA, optimization",
    Communication: "Technical writing, presentations, teamwork, documentation"
  };

  function handleSave() {
    setLoading(true);
    setTimeout(() => {
      onSave(skills);
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  if (submitted) {
    const avgScore = Math.round(Object.values(skills).reduce((a, b) => a + b, 0) / Object.values(skills).length);
    const best = getBestRole(skills);
    return (
      <div className="section-enter" style={{ textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
        <h2 className="syne" style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Assessment Complete!</h2>
        <p style={{ color: G.muted, marginBottom: 32 }}>Your career readiness score has been calculated</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 40, flexWrap: "wrap" }}>
          <ScoreRing score={avgScore} label="Readiness" />
          <ScoreRing score={best.score} color={ROLES[best.key]?.color} label="Best Role" />
        </div>
        <div className="card" style={{ maxWidth: 400, margin: "0 auto 32px", padding: "20px" }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>{ROLES[best.key]?.icon}</div>
          <div className="syne" style={{ fontSize: 18, fontWeight: 700 }}>Best Match: {ROLES[best.key]?.label}</div>
          <div style={{ color: G.muted, fontSize: 14, marginTop: 4 }}>You are {best.score}% ready for this role</div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => onNav("career")}>View Career Analysis →</button>
          <button className="btn-outline" onClick={() => setSubmitted(false)}>Reassess Skills</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-enter">
      <div style={{ marginBottom: 32 }}>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Skill Assessment</h1>
        <p style={{ color: G.muted }}>Rate yourself honestly on each skill (0–100). This generates your career readiness score.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20, marginBottom: 32 }}>
        {SKILL_KEYS.map(key => (
          <div key={key} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{SKILL_ICONS[key]}</span>
                <span className="syne" style={{ fontSize: 15, fontWeight: 700 }}>{key}</span>
              </div>
              <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: skills[key] >= 70 ? G.success : skills[key] >= 40 ? G.warning : G.danger }}>
                {skills[key]}
              </span>
            </div>
            <p style={{ fontSize: 12, color: G.muted, marginBottom: 12 }}>{descriptions[key]}</p>
            <input type="range" className="slider-custom" min={0} max={100}
              value={skills[key]}
              onChange={e => setSkills({ ...skills, [key]: Number(e.target.value) })}
              style={{ background: `linear-gradient(90deg, ${G.accent} ${skills[key]}%, ${G.border} ${skills[key]}%)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: G.muted, marginTop: 4 }}>
              <span>Beginner</span><span>Intermediate</span><span>Expert</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div className="card" style={{ marginBottom: 32, background: "linear-gradient(135deg, rgba(0,229,255,0.03), rgba(124,58,237,0.03))" }}>
        <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Live Score Preview</h3>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          {Object.entries(ROLES).map(([key, role]) => {
            const score = calcReadiness(skills, key);
            return (
              <div key={key} style={{ textAlign: "center" }}>
                <ScoreRing score={score} size={80} color={role.color} label={role.icon} />
                <div style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>{role.label.split(" ")[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="btn-primary" style={{ padding: "14px 48px", fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}
        onClick={handleSave} disabled={loading}>
        {loading ? <><LoadingSpinner size={18} /> Calculating...</> : "Generate Career Report →"}
      </button>
    </div>
  );
}

// CAREER MATCH
function CareerMatch({ user, onNav }) {
  const [selectedRole, setSelectedRole] = useState("fullstack");
  const skills = user.skills || {};
  const hasSkills = Object.keys(skills).length > 0;

  if (!hasSkills) {
    return (
      <div className="section-enter" style={{ textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🏆</div>
        <h2 className="syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Complete Assessment First</h2>
        <p style={{ color: G.muted, marginBottom: 24 }}>Take the skill assessment to see your career matches and personalized recommendations.</p>
        <button className="btn-primary" onClick={() => onNav("assessment")}>Go to Assessment →</button>
      </div>
    );
  }

  const best = getBestRole(skills);
  const gaps = getSkillGap(skills, selectedRole);
  const readinessScore = calcReadiness(skills, selectedRole);

  const gapData = gaps.map(g => ({ name: g.skill, required: g.required, yours: g.user }));

  const roadmap = gaps.slice(0, 4).map((g, i) => ({
    step: i + 1,
    title: `Improve ${g.skill}`,
    desc: g.skill === "JavaScript" ? "Practice ES6+, async/await, closures" :
      g.skill === "React" ? "Build 3 real React projects with hooks" :
      g.skill === "SystemDesign" ? "Study system design patterns and scalability" :
      g.skill === "DataStructures" ? "Solve 50 LeetCode problems (Easy → Medium)" :
      `Study and practice ${g.skill} fundamentals`,
    gap: g.gap
  }));

  return (
    <div className="section-enter">
      <div style={{ marginBottom: 32 }}>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Career Recommendations</h1>
        <p style={{ color: G.muted }}>Personalized analysis based on your skill profile</p>
      </div>

      {/* Best match banner */}
      <div className="gradient-border" style={{ padding: 28, marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: G.muted, marginBottom: 4 }}>YOUR BEST ROLE MATCH</div>
          <div style={{ fontSize: 32, marginBottom: 4 }}>{ROLES[best.key]?.icon}</div>
          <h2 className="syne" style={{ fontSize: 24, fontWeight: 800 }}>{ROLES[best.key]?.label}</h2>
          <p style={{ color: G.muted, marginTop: 4 }}>You are {best.score}% ready for this role</p>
        </div>
        <ScoreRing score={best.score} color={ROLES[best.key]?.color} size={120} label="Readiness" />
      </div>

      {/* Role selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {Object.entries(ROLES).map(([key, role]) => (
          <button key={key}
            style={{
              padding: "8px 16px", borderRadius: 8, border: `1px solid ${selectedRole === key ? role.color : G.border}`,
              background: selectedRole === key ? `${role.color}20` : "transparent",
              color: selectedRole === key ? role.color : G.muted, cursor: "pointer", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s"
            }}
            onClick={() => setSelectedRole(key)}>
            {role.icon} {role.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Gap analysis */}
        <div className="card">
          <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Skill Gap Analysis</h3>
          <p style={{ fontSize: 12, color: G.muted, marginBottom: 16 }}>Your scores vs required for {ROLES[selectedRole]?.label}</p>
          {gapData.length === 0 ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <p style={{ color: G.success }}>You meet all requirements for this role!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={gapData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: G.muted, fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: G.muted, fontSize: 11 }} width={90} />
                <RechartsTooltip contentStyle={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 8 }} />
                <Bar dataKey="required" fill={`${G.danger}60`} name="Required" radius={[0, 4, 4, 0]} />
                <Bar dataKey="yours" fill={G.accent} name="Yours" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Readiness */}
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <ScoreRing score={readinessScore} color={ROLES[selectedRole]?.color} size={150} label={ROLES[selectedRole]?.label} />
          <div style={{ textAlign: "center" }}>
            <p style={{ color: G.muted, fontSize: 14 }}>
              {readinessScore >= 80 ? "🟢 Excellent — You're ready to apply!" :
               readinessScore >= 60 ? "🟡 Good — A few improvements needed" :
               "🔴 Needs work — Follow the roadmap below"}
            </p>
          </div>
        </div>
      </div>

      {/* Learning Roadmap */}
      {roadmap.length > 0 && (
        <div className="card">
          <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📍 Personalized Learning Roadmap</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {roadmap.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, background: G.accentDim, border: `1px solid rgba(0,229,255,0.3)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="syne" style={{ fontSize: 14, fontWeight: 700, color: G.accent }}>{r.step}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: G.muted }}>{r.desc}</div>
                  <div style={{ fontSize: 11, color: G.danger, marginTop: 4 }}>Gap: {r.gap} points to bridge</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// MARKET DEMAND
function MarketDemand({ onNav }) {
  const [tab, setTab] = useState("demand");

  return (
    <div className="section-enter">
      <div style={{ marginBottom: 32 }}>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Market Demand Analysis</h1>
        <p style={{ color: G.muted }}>Real-time skill demand data from the tech job market</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[["demand", "Skill Demand"], ["trends", "Job Trends"], ["insights", "Insights"]].map(([k, l]) => (
          <button key={k} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${tab === k ? G.accent : G.border}`, background: tab === k ? G.accentDim : "transparent", color: tab === k ? G.accent : G.muted, cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}
            onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "demand" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div className="card">
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Top Skills by Demand</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MARKET_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
                <XAxis dataKey="skill" tick={{ fill: G.muted, fontSize: 11 }} />
                <YAxis domain={[60, 100]} tick={{ fill: G.muted, fontSize: 11 }} />
                <RechartsTooltip contentStyle={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 8, color: G.text }} />
                <Bar dataKey="demand" fill={G.accent} radius={[4, 4, 0, 0]}
                  label={{ position: "top", fill: G.muted, fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Demand Index</h3>
            {MARKET_DATA.map((d, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                  <span>{d.skill}</span>
                  <span className="mono" style={{ color: d.demand > 85 ? G.success : d.demand > 75 ? G.accent : G.warning }}>{d.demand}%</span>
                </div>
                <ProgressBar value={d.demand} color={d.demand > 85 ? G.success : d.demand > 75 ? G.accent : G.warning} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "trends" && (
        <div className="card">
          <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Job Postings Trend (Tech Sector)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={G.accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={G.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
              <XAxis dataKey="month" tick={{ fill: G.muted, fontSize: 12 }} />
              <YAxis tick={{ fill: G.muted, fontSize: 12 }} />
              <RechartsTooltip contentStyle={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 8, color: G.text }} />
              <Area type="monotone" dataKey="jobs" stroke={G.accent} fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === "insights" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            { icon: "🔥", title: "Hottest Skill 2025", val: "TypeScript", desc: "76% demand growth YoY. Essential for enterprise projects.", color: G.danger },
            { icon: "📈", title: "Fastest Growing", val: "AI/ML Fundamentals", desc: "Entry-level ML skills now expected at 34% of tech companies.", color: G.success },
            { icon: "🎯", title: "Most Underrated", val: "System Design", desc: "Only 28% of candidates can demonstrate system design skills.", color: G.warning },
            { icon: "💼", title: "Highest Paying", val: "Full Stack (React + Node)", desc: "Average salary ₹18–35 LPA for 2–4 years experience.", color: G.accent },
            { icon: "⚡", title: "Quick Win Skill", val: "CSS/TailwindCSS", desc: "Easy to learn, high ROI for frontend developer roles.", color: G.purple },
            { icon: "🌐", title: "Remote Job Demand", val: "JavaScript + APIs", desc: "92% of remote tech jobs require strong JavaScript fundamentals.", color: G.muted }
          ].map((c, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 11, color: G.muted, marginBottom: 4, fontWeight: 600 }}>{c.title}</div>
              <div className="syne" style={{ fontSize: 18, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.val}</div>
              <div style={{ fontSize: 12, color: G.muted, lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// RESUME BUILDER
function ResumeBuilder({ user }) {
  const [form, setForm] = useState({
    name: user.name || "",
    title: "Full Stack Developer",
    email: user.email || "",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    summary: "Passionate developer with strong skills in modern web technologies. Seeking opportunities to build impactful products.",
    skills: Object.keys(user.skills || {}).filter(k => (user.skills[k] || 0) >= 50).join(", ") || "JavaScript, React, Node.js",
    exp: "Final Year Student | XYZ University | 2022–Present\nWorked on full-stack projects using React and Node.js",
    projects: "RejexIQ – Career Readiness Platform | React, Node.js, JWT | github.com\nPersonal Portfolio – responsive design website | HTML, CSS, JS",
    education: "B.Tech Computer Science | XYZ University | 2022–2026 | CGPA: 8.2",
    certifications: "AWS Cloud Practitioner | FreeCodeCamp Full Stack Cert"
  });
  const [template, setTemplate] = useState("modern");
  const [copied, setCopied] = useState(false);

  function suggestSkills(current) {
    const suggestions = { JavaScript: ["TypeScript", "Node.js", "Express"], React: ["Next.js", "Redux", "GraphQL"], Python: ["Django", "FastAPI", "NumPy"], CSS: ["TailwindCSS", "SASS", "Bootstrap"] };
    const currentArr = current.toLowerCase().split(",").map(s => s.trim());
    for (const [k, sug] of Object.entries(suggestions)) {
      if (currentArr.includes(k.toLowerCase())) {
        const newSkills = sug.filter(s => !currentArr.includes(s.toLowerCase()));
        if (newSkills.length > 0) return newSkills[0];
      }
    }
    return null;
  }

  const suggestion = suggestSkills(form.skills);

  function handlePrint() {
    const content = document.getElementById("resume-preview-content");
    if (!content) return;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Resume - ${form.name}</title><style>body{font-family:sans-serif;padding:40px;color:#111;font-size:13px;line-height:1.5} h1{color:#0a0a0a;margin-bottom:4px} h2{border-bottom:2px solid #000;padding-bottom:4px;font-size:14px;margin-top:16px} p{margin:4px 0} .subtitle{color:#555;font-size:13px}</style></head><body>${content.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  }

  return (
    <div className="section-enter">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Resume Builder</h1>
          <p style={{ color: G.muted }}>Build your professional resume with live preview</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["modern", "classic", "minimal"].map(t => (
            <button key={t} style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${template === t ? G.accent : G.border}`, background: template === t ? G.accentDim : "transparent", color: template === t ? G.accent : G.muted, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              onClick={() => setTemplate(t)}>{t}</button>
          ))}
          <button className="btn-primary" style={{ fontSize: 13, padding: "8px 20px" }} onClick={handlePrint}>📥 Download PDF</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            ["Full Name", "name", "text"], ["Job Title", "title", "text"],
            ["Email", "email", "email"], ["Phone", "phone", "text"],
            ["Location", "location", "text"]
          ].map(([label, key, type]) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: G.muted, marginBottom: 6 }}>{label}</label>
              <input type={type} className="input-field" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          {[["Professional Summary", "summary"], ["Skills (comma-separated)", "skills"], ["Experience", "exp"], ["Projects", "projects"], ["Education", "education"], ["Certifications", "certifications"]].map(([label, key]) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: G.muted, marginBottom: 6 }}>{label}</label>
              <textarea className="input-field" rows={3} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ resize: "vertical" }} />
              {key === "skills" && suggestion && (
                <div style={{ marginTop: 4, fontSize: 11, color: G.warning }}>
                  💡 Consider adding: <span style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => setForm({ ...form, skills: form.skills + `, ${suggestion}` })}>{suggestion}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Preview */}
        <div style={{ position: "sticky", top: 20, height: "fit-content" }}>
          <div className="resume-preview" id="resume-preview-content" style={{
            background: template === "minimal" ? "#fafafa" : "white",
            fontFamily: template === "classic" ? "Georgia, serif" : template === "minimal" ? "Arial, sans-serif" : "'Inter', sans-serif"
          }}>
            {/* Header - Different for each template */}
            {template === "modern" && (
              <div style={{ background: "linear-gradient(135deg, #0097a7, #00bcd4)", padding: 20, marginBottom: 16, borderRadius: "8px 8px 0 0" }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", marginBottom: 4 }}>{form.name || "Your Name"}</h1>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{form.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>
                  {form.email} {form.phone && `• ${form.phone}`} {form.location && `• ${form.location}`}
                </div>
              </div>
            )}

            {template === "classic" && (
              <div style={{ textAlign: "center", borderBottom: "3px double #1a1a1a", paddingBottom: 16, marginBottom: 16 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 6, fontFamily: "Georgia, serif" }}>{form.name || "Your Name"}</h1>
                <div style={{ fontSize: 14, color: "#555", fontStyle: "italic", marginBottom: 6 }}>{form.title}</div>
                <div style={{ fontSize: 11, color: "#666" }}>
                  {form.email} {form.phone && `| ${form.phone}`} {form.location && `| ${form.location}`}
                </div>
              </div>
            )}

            {template === "minimal" && (
              <div style={{ borderLeft: "4px solid #888", paddingLeft: 16, marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 600, color: "#222", marginBottom: 2 }}>{form.name || "Your Name"}</h1>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>{form.title}</div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  {form.email} • {form.phone} • {form.location}
                </div>
              </div>
            )}

            {/* Summary */}
            {form.summary && (
              <div style={{ marginBottom: 16 }}>
                <h2 style={{
                  fontSize: template === "classic" ? 15 : 13,
                  fontWeight: template === "minimal" ? 600 : 700,
                  borderBottom: template === "modern" ? "2px solid #0097a7" : template === "classic" ? "none" : "1px solid #ddd",
                  color: template === "modern" ? "#0097a7" : "#1a1a1a",
                  paddingBottom: 4,
                  marginBottom: 8,
                  textTransform: template === "classic" ? "none" : "uppercase",
                  letterSpacing: template === "minimal" ? 0 : 1,
                  fontFamily: template === "classic" ? "Georgia, serif" : "inherit"
                }}>
                  {template === "classic" ? "Professional Summary" : "Summary"}
                </h2>
                <p style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>{form.summary}</p>
              </div>
            )}

            {/* Skills */}
            {form.skills && (
              <div style={{ marginBottom: 16 }}>
                <h2 style={{
                  fontSize: template === "classic" ? 15 : 13,
                  fontWeight: template === "minimal" ? 600 : 700,
                  borderBottom: template === "modern" ? "2px solid #0097a7" : template === "classic" ? "none" : "1px solid #ddd",
                  color: template === "modern" ? "#0097a7" : "#1a1a1a",
                  paddingBottom: 4,
                  marginBottom: 8,
                  textTransform: template === "classic" ? "none" : "uppercase",
                  letterSpacing: template === "minimal" ? 0 : 1,
                  fontFamily: template === "classic" ? "Georgia, serif" : "inherit"
                }}>
                  {template === "classic" ? "Core Competencies" : "Skills"}
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: template === "minimal" ? 4 : 6 }}>
                  {form.skills.split(",").map((s, i) => (
                    <span key={i} style={{
                      background: template === "modern" ? "#e0f7fa" : template === "classic" ? "transparent" : "#f5f5f5",
                      border: template === "modern" ? "1px solid #00bcd4" : template === "classic" ? "1px solid #666" : "none",
                      padding: template === "minimal" ? "2px 6px" : "3px 10px",
                      borderRadius: template === "classic" ? 0 : template === "minimal" ? 2 : 12,
                      fontSize: 11,
                      color: template === "modern" ? "#00838f" : "#444"
                    }}>{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {form.exp && (
              <div style={{ marginBottom: 16 }}>
                <h2 style={{
                  fontSize: template === "classic" ? 15 : 13,
                  fontWeight: template === "minimal" ? 600 : 700,
                  borderBottom: template === "modern" ? "2px solid #0097a7" : template === "classic" ? "none" : "1px solid #ddd",
                  color: template === "modern" ? "#0097a7" : "#1a1a1a",
                  paddingBottom: 4,
                  marginBottom: 8,
                  textTransform: template === "classic" ? "none" : "uppercase",
                  letterSpacing: template === "minimal" ? 0 : 1,
                  fontFamily: template === "classic" ? "Georgia, serif" : "inherit"
                }}>
                  {template === "classic" ? "Professional Experience" : "Experience"}
                </h2>
                {form.exp.split("\n").map((l, i) => (
                  <p key={i} style={{ fontSize: 12, color: "#444", marginBottom: 4, lineHeight: 1.5 }}>{l}</p>
                ))}
              </div>
            )}

            {/* Projects */}
            {form.projects && (
              <div style={{ marginBottom: 16 }}>
                <h2 style={{
                  fontSize: template === "classic" ? 15 : 13,
                  fontWeight: template === "minimal" ? 600 : 700,
                  borderBottom: template === "modern" ? "2px solid #0097a7" : template === "classic" ? "none" : "1px solid #ddd",
                  color: template === "modern" ? "#0097a7" : "#1a1a1a",
                  paddingBottom: 4,
                  marginBottom: 8,
                  textTransform: template === "classic" ? "none" : "uppercase",
                  letterSpacing: template === "minimal" ? 0 : 1,
                  fontFamily: template === "classic" ? "Georgia, serif" : "inherit"
                }}>Projects</h2>
                {form.projects.split("\n").map((l, i) => (
                  <p key={i} style={{ fontSize: 12, color: "#444", marginBottom: 6, lineHeight: 1.5 }}>{l}</p>
                ))}
              </div>
            )}

            {/* Education */}
            {form.education && (
              <div style={{ marginBottom: 16 }}>
                <h2 style={{
                  fontSize: template === "classic" ? 15 : 13,
                  fontWeight: template === "minimal" ? 600 : 700,
                  borderBottom: template === "modern" ? "2px solid #0097a7" : template === "classic" ? "none" : "1px solid #ddd",
                  color: template === "modern" ? "#0097a7" : "#1a1a1a",
                  paddingBottom: 4,
                  marginBottom: 8,
                  textTransform: template === "classic" ? "none" : "uppercase",
                  letterSpacing: template === "minimal" ? 0 : 1,
                  fontFamily: template === "classic" ? "Georgia, serif" : "inherit"
                }}>Education</h2>
                <p style={{ fontSize: 12, color: "#444", lineHeight: 1.5 }}>{form.education}</p>
              </div>
            )}

            {/* Certifications */}
            {form.certifications && (
              <div>
                <h2 style={{
                  fontSize: template === "classic" ? 15 : 13,
                  fontWeight: template === "minimal" ? 600 : 700,
                  borderBottom: template === "modern" ? "2px solid #0097a7" : template === "classic" ? "none" : "1px solid #ddd",
                  color: template === "modern" ? "#0097a7" : "#1a1a1a",
                  paddingBottom: 4,
                  marginBottom: 8,
                  textTransform: template === "classic" ? "none" : "uppercase",
                  letterSpacing: template === "minimal" ? 0 : 1,
                  fontFamily: template === "classic" ? "Georgia, serif" : "inherit"
                }}>Certifications</h2>
                {form.certifications.split("\n").map((l, i) => (
                  <p key={i} style={{ fontSize: 12, color: "#444", lineHeight: 1.5 }}>{l}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// AI ASSISTANT - Real AI Integration
function AIAssistant({ user }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hi ${user.name}! 👋 I'm your AI Career Assistant powered by Google Gemini. I can help you with skill improvement tips, career guidance, interview preparation, and learning resources. What would you like to know?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem("gemini_api_key"));
  const msgRef = useRef(null);

  const suggestions = [
    "How do I improve my backend skills?",
    "What skills should I learn for frontend?",
    "How to prepare for technical interviews?",
    "What projects should I build for my portfolio?",
    "How to improve my system design knowledge?"
  ];

  async function callGeminiAPI(userMessage) {
    if (!apiKey) {
      return "Please set your Gemini API key first. You can get a free API key from https://makersuite.google.com/app/apikey";
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a career advisor AI assistant helping ${user.name}, a student/professional. 
              
User's Profile:
- Skills: ${Object.keys(user.skills || {}).join(", ") || "Not assessed yet"}
- Education: ${user.university || "Not specified"}
- Experience: ${user.experience || "Not specified"}

User's Question: ${userMessage}

Provide helpful, actionable career advice. Be concise but thorough. Use bullet points when appropriate. Focus on practical steps they can take.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 400 && error.error?.message?.includes("API_KEY_INVALID")) {
          localStorage.removeItem("gemini_api_key");
          setShowApiKeyInput(true);
          return "Invalid API key. Please enter a valid Gemini API key. Get one free at: https://makersuite.google.com/app/apikey";
        }
        throw new Error(error.error?.message || "API request failed");
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return `Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`;
    }
  }

  function saveApiKey() {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setShowApiKeyInput(false);
      setMessages([{ role: "assistant", text: `API key saved! I'm now connected to Google Gemini AI. Ask me anything about your career! 🚀` }]);
    }
  }

  async function send(text) {
    const q = text || input;
    if (!q.trim()) return;
    
    const newMsgs = [...messages, { role: "user", text: q }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    const response = await callGeminiAPI(q);
    
    setMessages([...newMsgs, { role: "assistant", text: response }]);
    setLoading(false);
    setTimeout(() => msgRef.current?.scrollTo({ top: msgRef.current.scrollHeight, behavior: "smooth" }), 100);
  }

  if (showApiKeyInput) {
    return (
      <div className="section-enter">
        <div style={{ marginBottom: 24 }}>
          <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>AI Career Assistant</h1>
          <p style={{ color: G.muted }}>Powered by Google Gemini AI</p>
        </div>

        <div className="card" style={{ padding: 40, maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🤖</div>
          <h2 className="syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Connect to AI</h2>
          <p style={{ color: G.muted, marginBottom: 24, lineHeight: 1.6 }}>
            To use the AI Career Assistant, you need a free Google Gemini API key.
          </p>
          
          <div style={{ background: G.surface, padding: 20, borderRadius: 12, marginBottom: 24, textAlign: "left" }}>
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>How to get your API key:</h3>
            <ol style={{ color: G.muted, fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: G.accent }}>Google AI Studio</a></li>
              <li>Sign in with your Google account</li>
              <li>Click "Get API Key" or "Create API Key"</li>
              <li>Copy the API key</li>
              <li>Paste it below</li>
            </ol>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: G.muted, textAlign: "left" }}>
              Gemini API Key
            </label>
            <input 
              className="input-field" 
              type="password"
              placeholder="AIza..." 
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              onKeyPress={e => e.key === "Enter" && saveApiKey()}
            />
            <p style={{ fontSize: 12, color: G.muted, marginTop: 8, textAlign: "left" }}>
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <button className="btn-primary" style={{ width: "100%", padding: 14 }} onClick={saveApiKey}>
            Connect AI Assistant
          </button>

          <div style={{ marginTop: 16, padding: 12, background: G.accentDim, borderRadius: 8, fontSize: 12, color: G.muted }}>
            💡 The Gemini API is free for personal use with generous limits
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-enter">
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>AI Career Assistant</h1>
          <p style={{ color: G.muted }}>Powered by Google Gemini AI - Ask anything about your career</p>
        </div>
        <button className="btn-ghost" onClick={() => { localStorage.removeItem("gemini_api_key"); setShowApiKeyInput(true); }}>
          Change API Key
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column", height: 520 }}>
          {/* Header */}
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <div className="float-anim" style={{ fontSize: 28 }}>🤖</div>
            <div>
              <div className="syne" style={{ fontWeight: 700 }}>Gemini AI</div>
              <div style={{ fontSize: 12, color: G.success }}>● Online</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={msgRef} style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && <div style={{ fontSize: 20, marginBottom: 4 }}>🤖</div>}
                <div className={`chat-bubble ${m.role}`} style={{ maxWidth: "80%", whiteSpace: "pre-line" }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <div className="chat-bubble" style={{ display: "flex", gap: 4 }}>
                  {[0,1,2].map(i => <span key={i} className="pulse-anim" style={{ width: 8, height: 8, background: G.accent, borderRadius: "50%", display: "inline-block", animationDelay: `${i * 0.2}s` }} />)}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: 16, borderTop: `1px solid ${G.border}`, display: "flex", gap: 8 }}>
            <input className="input-field" placeholder="Ask me anything..." value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()} style={{ flex: 1 }} />
            <button className="btn-primary" onClick={() => send()} style={{ padding: "10px 16px", fontSize: 16 }}>→</button>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: G.muted }}>QUICK QUESTIONS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {suggestions.map((s, i) => (
                <button key={i} className="btn-ghost" style={{ textAlign: "left", fontSize: 12, padding: "8px 12px" }}
                  onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>

          {user.skills && Object.keys(user.skills).length > 0 && (
            <div className="card">
              <h3 className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: G.muted }}>YOUR PROFILE</h3>
              <div style={{ fontSize: 12, color: G.muted, lineHeight: 1.6 }}>
                <div style={{ marginBottom: 4 }}>Best role: <span style={{ color: G.accent }}>{ROLES[getBestRole(user.skills).key]?.label}</span></div>
                <div>Readiness: <span style={{ color: G.accent }}>{getBestRole(user.skills).score}%</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// LEADERBOARD
function Leaderboard() {
  const entries = [
    { name: "Rahul Sharma", score: 94, role: "Frontend Dev", badge: "🥇" },
    { name: "Priya Patel", score: 91, role: "Full Stack", badge: "🥈" },
    { name: "Arjun Singh", score: 88, role: "Backend Dev", badge: "🥉" },
    { name: "Sneha Rao", score: 84, role: "Data Analyst", badge: "4️⃣" },
    { name: "Dev Kumar", score: 81, role: "DevOps", badge: "5️⃣" },
    { name: "Ananya Iyer", score: 78, role: "Frontend Dev", badge: "6️⃣" },
    { name: "Karan Mehta", score: 75, role: "Full Stack", badge: "7️⃣" },
    { name: "Lakshmi N.", score: 72, role: "Backend Dev", badge: "8️⃣" },
    { name: "You", score: 68, role: "In Progress", badge: "—", isYou: true },
  ];

  return (
    <div className="section-enter">
      <div style={{ marginBottom: 32 }}>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Skill Leaderboard</h1>
        <p style={{ color: G.muted }}>See how you rank among other students</p>
      </div>

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 100px", padding: "8px 16px", marginBottom: 8, fontSize: 11, fontWeight: 700, color: G.muted, textTransform: "uppercase", letterSpacing: 1 }}>
          <span>Rank</span><span>Student</span><span>Best Role</span><span style={{ textAlign: "right" }}>Score</span>
        </div>
        {entries.map((e, i) => (
          <div key={i} className="leaderboard-row" style={{ gridTemplateColumns: "50px 1fr 100px 100px", display: "grid", background: e.isYou ? `${G.accentDim}` : undefined, border: e.isYou ? `1px solid rgba(0,229,255,0.2)` : "1px solid transparent", borderRadius: 10 }}>
            <span style={{ fontSize: 20, textAlign: "center" }}>{e.badge}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${G.accent}30, #7c3aed30)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
                {e.name[0]}
              </div>
              <span style={{ fontWeight: e.isYou ? 700 : 400, color: e.isYou ? G.accent : G.text }}>{e.name}</span>
            </div>
            <span style={{ fontSize: 12, color: G.muted, display: "flex", alignItems: "center" }}>{e.role}</span>
            <div style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <span className="mono" style={{ fontWeight: 700, color: i === 0 ? G.warning : i < 3 ? G.success : G.text }}>{e.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// TOUR COMPONENT
function GuidedTour({ step, total, onNext, onSkip, targetPos }) {
  return (
    <>
      <div className="tour-overlay" />
      <div className="tour-popup" style={{ top: targetPos.y || "50%", left: targetPos.x || "50%", transform: "translateY(-50%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span className="tag" style={{ background: G.accentDim, color: G.accent }}>Step {step + 1} of {total}</span>
          <button onClick={onSkip} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
        <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{TOUR_STEPS[step].title}</h3>
        <p style={{ color: G.muted, fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>{TOUR_STEPS[step].text}</p>
        <div style={{ display: "flex", gap: 8 }}>
          {step < total - 1 ? (
            <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={onNext}>Next →</button>
          ) : (
            <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={onSkip}>Let's Go! 🚀</button>
          )}
          <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: 12 }} onClick={onSkip}>Skip Tour</button>
        </div>
      </div>
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [appPage, setAppPage] = useState("dashboard");
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("rejexiq_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setPage("app");
      } catch (e) {
        console.error("Failed to load user data:", e);
        localStorage.removeItem("rejexiq_user");
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("rejexiq_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("rejexiq_user");
    }
  }, [user]);

  function handleLogin(userData) {
    const isNew = !userData.assessmentDone;
    setUser(userData);
    setPage("app");
    setAppPage("dashboard");
    if (isNew) {
      setIsFirstLogin(true);
      setTimeout(() => setShowTour(true), 600);
    }
  }

  function handleDemo() {
    handleLogin({ ...DEMO_USER });
  }

  function handleLogout() {
    setUser(null);
    setPage("home");
    setShowTour(false);
    localStorage.removeItem("rejexiq_user");
  }

  function handleSaveSkills(skills) {
    setUser(prev => {
      const updated = { ...prev, skills, assessmentDone: true };
      return updated;
    });
  }

  function handleUpdateUser(updates) {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      return updated;
    });
  }

  function navigate(dest) {
    if (["login", "signup", "home", "assessment", "career", "market", "resume", "dashboard"].includes(dest)) {
      if (dest === "home") { setPage("home"); return; }
      if (dest === "login" || dest === "signup") { setPage(dest); return; }
      // Allow assessment without login
      if (dest === "assessment") { 
        if (user) { setAppPage(dest); setPage("app"); }
        else { setPage("assessment"); }
        return;
      }
      // Other pages require login
      if (user) { setAppPage(dest); setPage("app"); } else { setPage("login"); }
    }
  }

  // Tour navigation labels → app pages
  const tourPageMap = ["dashboard", "assessment", "career", "market", "resume"];

  const tourPositions = [
    { x: "calc(240px + 32px)", y: "30%" },
    { x: "calc(240px + 32px)", y: "30%" },
    { x: "calc(240px + 32px)", y: "30%" },
    { x: "calc(240px + 32px)", y: "30%" },
    { x: "calc(240px + 32px)", y: "30%" }
  ];

  return (
    <>
      <style>{css}</style>

      {page === "home" && <LandingPage onNav={navigate} onDemo={handleDemo} />}
      {page === "login" && <AuthPage type="login" onLogin={handleLogin} onNav={navigate} />}
      {page === "signup" && <AuthPage type="signup" onLogin={handleLogin} onNav={navigate} />}
      {page === "assessment" && !user && (
        <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${G.bg} 0%, #1a1f3a 100%)` }}>
          <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
            background: "rgba(10,14,39,0.9)", backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${G.border}`, padding: "0 40px"
          }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>
                <span style={{ background: `linear-gradient(135deg, ${G.accent}, ${G.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Rejex</span>IQ
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button className="btn-ghost" onClick={() => navigate("home")}>← Home</button>
                <button className="btn-primary" onClick={() => navigate("login")}>Login to Save Progress</button>
              </div>
            </div>
          </nav>
          <div style={{ paddingTop: 100, paddingLeft: 40, paddingRight: 40, maxWidth: 1400, margin: "0 auto" }}>
            <SkillAssessment 
              user={{ skills: {} }} 
              onSave={(skills) => {
                alert("Assessment complete! Login to save your progress and unlock all features.");
                navigate("signup");
              }} 
              onNav={navigate} 
            />
          </div>
        </div>
      )}

      {page === "app" && user && (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar active={appPage} onNav={setAppPage} user={user} onLogout={handleLogout} />

          {/* Main content */}
          <div style={{ marginLeft: 240, flex: 1, padding: 32, overflowY: "auto", minHeight: "100vh" }}>
            {/* Demo badge */}
            {user.email === "demo@rejexiq.com" && (
              <div style={{ marginBottom: 16, padding: "8px 16px", background: "rgba(245,158,11,0.1)", border: `1px solid rgba(245,158,11,0.3)`, borderRadius: 8, fontSize: 12, color: G.warning, display: "inline-flex", alignItems: "center", gap: 8 }}>
                ✨ Demo Mode — All features available. Data is pre-loaded for demonstration.
              </div>
            )}

            {appPage === "dashboard" && <Dashboard user={user} onNav={setAppPage} showTour={showTour} setShowTour={setShowTour} />}
            {appPage === "profile" && <ProfilePage user={user} onUpdateUser={handleUpdateUser} onNav={setAppPage} />}
            {appPage === "assessment" && <SkillAssessment user={user} onSave={handleSaveSkills} onNav={setAppPage} />}
            {appPage === "career" && <CareerMatch user={user} onNav={setAppPage} />}
            {appPage === "market" && <MarketDemand onNav={setAppPage} />}
            {appPage === "resume" && <ResumeBuilder user={user} />}
            {appPage === "assistant" && <AIAssistant user={user} />}
            {appPage === "leaderboard" && <Leaderboard />}
          </div>

          {/* Guided Tour */}
          {showTour && (
            <GuidedTour
              step={tourStep}
              total={TOUR_STEPS.length}
              targetPos={tourPositions[tourStep]}
              onNext={() => {
                if (tourStep < TOUR_STEPS.length - 1) {
                  setTourStep(t => t + 1);
                  setAppPage(tourPageMap[tourStep + 1]);
                } else {
                  setShowTour(false);
                }
              }}
              onSkip={() => { setShowTour(false); setTourStep(0); setAppPage("dashboard"); }}
            />
          )}
        </div>
      )}
    </>
  );
}
