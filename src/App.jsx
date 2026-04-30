
import { useState, useEffect, useRef, useCallback } from "react";
import NewAuthPage from "./AuthPage.jsx";
import NewProfilePage from "./ProfilePage.jsx";
import PremiumResumeBuilder from "./ResumeBuilderLanding.jsx";
import DSATutorial from "./DSATutorial.jsx";
import ArraysRecursion from "./ArraysRecursion.jsx";
import ControlFlow from "./ControlFlow.jsx";
import StringsTutorial from "./StringsTutorial.jsx";
import LinkedList from "./LinkedList.jsx";
import StacksQueues from "./StacksQueues.jsx";
import DSAHub from "./DSAHub.jsx";
import DSAGame from "./DSAGame.jsx";
import Sorting from "./Sorting.jsx";
import Searching from "./Searching.jsx";
import Backtracking from "./Backtracking.jsx";
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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={G.border} strokeWidth={10} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={10}
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

// AUTH PAGE — uses the new standalone AuthPage component
function AuthPage({ type, onLogin, onNav }) {
  return <NewAuthPage onLogin={onLogin} onNav={onNav} initialMode={type === "login" ? "signin" : "signup"} />;
}

// SIDEBAR
function Sidebar({ active, onNav, user, onLogout }) {
  const navItems = [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "profile", icon: "👤", label: "Profile" },
    { key: "assessment", icon: "🎯", label: "Skill Assessment" },
    { key: "dsa", icon: "📚", label: "DSA Tutorial" },
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

// PROFILE PAGE — uses the new standalone ProfilePage component
function ProfilePage({ user, onUpdateUser, onNav }) {
  return <NewProfilePage user={user} onUpdateUser={onUpdateUser} onNav={onNav} />;
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

// ─── MARKET DEMAND DATA ───────────────────────────────────────────────────────

const MD_ROLES = {
  "Software Engineer": {
    icon: "💻", color: "#00e5ff",
    salary: { min: "₹8L", max: "₹35L", avg: "₹18L" },
    trend: "increasing", trendPct: "+23%",
    openings: "42,000+",
    trendingSkills: ["JavaScript", "TypeScript", "React.js", "Node.js", "System Design", "Docker", "AWS", "SQL", "Git", "REST APIs"],
    skills: [
      { name: "JavaScript", demand: 92, userHas: true },
      { name: "Data Structures", demand: 88, userHas: true },
      { name: "System Design", demand: 82, userHas: false },
      { name: "React / Vue", demand: 78, userHas: true },
      { name: "Node.js", demand: 74, userHas: false },
      { name: "SQL / NoSQL", demand: 70, userHas: false },
      { name: "Git & CI/CD", demand: 68, userHas: true },
      { name: "TypeScript", demand: 65, userHas: false },
    ],
    aiRecs: [
      { type: "skill", icon: "⚡", text: "Learn System Design fundamentals — it's asked in 82% of SWE interviews." },
      { type: "skill", icon: "🟢", text: "Add Node.js to your stack. Full-stack ability increases offers by 40%." },
      { type: "project", icon: "🛠️", text: "Build a REST API with authentication — demonstrates backend readiness." },
      { type: "resume", icon: "📄", text: "Quantify your impact: 'Reduced load time by 40%' beats 'Improved performance'." },
    ]
  },
  "Frontend Developer": {
    icon: "🎨", color: "#c084fc",
    salary: { min: "₹6L", max: "₹28L", avg: "₹14L" },
    trend: "increasing", trendPct: "+18%",
    openings: "28,000+",
    trendingSkills: ["React.js", "JavaScript", "TypeScript", "Next.js", "CSS / Tailwind", "Vue.js", "Webpack", "Testing", "Accessibility", "Performance"],
    skills: [
      { name: "React.js", demand: 94, userHas: true },
      { name: "JavaScript", demand: 92, userHas: true },
      { name: "CSS / Tailwind", demand: 88, userHas: true },
      { name: "TypeScript", demand: 80, userHas: false },
      { name: "Next.js", demand: 74, userHas: false },
      { name: "Performance Opt.", demand: 68, userHas: false },
      { name: "Testing (Jest)", demand: 60, userHas: false },
      { name: "Accessibility", demand: 55, userHas: false },
    ],
    aiRecs: [
      { type: "skill", icon: "⚡", text: "TypeScript is now required at 80% of frontend roles — prioritize it." },
      { type: "skill", icon: "🟢", text: "Next.js expertise can increase your salary band by ₹3–5L." },
      { type: "project", icon: "🛠️", text: "Build a portfolio with Lighthouse score 90+ to stand out." },
      { type: "resume", icon: "📄", text: "List specific component libraries and bundle size optimizations." },
    ]
  },
  "Backend Developer": {
    icon: "⚙️", color: "#34d399",
    salary: { min: "₹8L", max: "₹40L", avg: "₹20L" },
    trend: "increasing", trendPct: "+21%",
    openings: "35,000+",
    trendingSkills: ["Node.js", "Python", "SQL", "REST APIs", "GraphQL", "Docker", "Kubernetes", "AWS", "Redis", "System Design"],
    skills: [
      { name: "Node.js / Python", demand: 90, userHas: false },
      { name: "REST / GraphQL APIs", demand: 88, userHas: false },
      { name: "SQL Databases", demand: 85, userHas: false },
      { name: "System Design", demand: 82, userHas: false },
      { name: "Docker / K8s", demand: 72, userHas: false },
      { name: "Redis / Caching", demand: 65, userHas: false },
      { name: "AWS / GCP", demand: 70, userHas: false },
      { name: "Security Basics", demand: 60, userHas: false },
    ],
    aiRecs: [
      { type: "skill", icon: "⚡", text: "Master SQL — it's tested in 85% of backend interviews." },
      { type: "skill", icon: "🟢", text: "Docker knowledge is now a baseline expectation, not a bonus." },
      { type: "project", icon: "🛠️", text: "Build a microservices project with auth, caching, and a database." },
      { type: "resume", icon: "📄", text: "Highlight API throughput numbers and database query optimizations." },
    ]
  },
  "Data Analyst": {
    icon: "📊", color: "#fbbf24",
    salary: { min: "₹5L", max: "₹22L", avg: "₹11L" },
    trend: "stable", trendPct: "+9%",
    openings: "18,000+",
    trendingSkills: ["Python", "SQL", "Excel", "Power BI", "Tableau", "Statistics", "Data Viz", "Pandas", "Machine Learning", "Communication"],
    skills: [
      { name: "Python (Pandas)", demand: 92, userHas: false },
      { name: "SQL", demand: 90, userHas: false },
      { name: "Data Visualization", demand: 82, userHas: false },
      { name: "Excel / Sheets", demand: 78, userHas: false },
      { name: "Statistics", demand: 75, userHas: false },
      { name: "Power BI / Tableau", demand: 68, userHas: false },
      { name: "Machine Learning", demand: 55, userHas: false },
      { name: "Communication", demand: 80, userHas: true },
    ],
    aiRecs: [
      { type: "skill", icon: "⚡", text: "Python + Pandas is the #1 skill gap for aspiring data analysts." },
      { type: "skill", icon: "🟢", text: "Learn Power BI — it's requested in 68% of analyst job postings." },
      { type: "project", icon: "🛠️", text: "Create a public Kaggle notebook with EDA and visualizations." },
      { type: "resume", icon: "📄", text: "Mention specific datasets, tools, and business insights you derived." },
    ]
  },
  "DevOps Engineer": {
    icon: "🚀", color: "#f87171",
    salary: { min: "₹10L", max: "₹45L", avg: "₹24L" },
    trend: "increasing", trendPct: "+31%",
    openings: "22,000+",
    trendingSkills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "Python", "Monitoring", "Ansible", "Jenkins"],
    skills: [
      { name: "Docker / Kubernetes", demand: 94, userHas: false },
      { name: "CI/CD Pipelines", demand: 90, userHas: false },
      { name: "AWS / Azure / GCP", demand: 88, userHas: false },
      { name: "Linux / Shell", demand: 85, userHas: false },
      { name: "Terraform / IaC", demand: 75, userHas: false },
      { name: "Monitoring (Grafana)", demand: 68, userHas: false },
      { name: "Python / Bash", demand: 72, userHas: false },
      { name: "Security / IAM", demand: 65, userHas: false },
    ],
    aiRecs: [
      { type: "skill", icon: "⚡", text: "Kubernetes is the fastest-growing DevOps skill — get certified." },
      { type: "skill", icon: "🟢", text: "Terraform (IaC) is now expected at senior DevOps roles." },
      { type: "project", icon: "🛠️", text: "Deploy a full-stack app on AWS with CI/CD and monitoring." },
      { type: "resume", icon: "📄", text: "Highlight uptime improvements, deployment frequency, and cost savings." },
    ]
  },
  "AI/ML Engineer": {
    icon: "🤖", color: "#818cf8",
    salary: { min: "₹12L", max: "₹60L", avg: "₹28L" },
    trend: "increasing", trendPct: "+47%",
    openings: "15,000+",
    trendingSkills: ["Python", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "LLMs", "MLOps", "Statistics", "Data Engineering", "NLP"],
    skills: [
      { name: "Python", demand: 98, userHas: false },
      { name: "Machine Learning", demand: 95, userHas: false },
      { name: "Deep Learning / NNs", demand: 88, userHas: false },
      { name: "PyTorch / TensorFlow", demand: 85, userHas: false },
      { name: "LLMs / Prompt Eng.", demand: 80, userHas: false },
      { name: "MLOps", demand: 70, userHas: false },
      { name: "Statistics / Math", demand: 82, userHas: false },
      { name: "Data Engineering", demand: 65, userHas: false },
    ],
    aiRecs: [
      { type: "skill", icon: "⚡", text: "LLM fine-tuning and prompt engineering are the hottest skills of 2025." },
      { type: "skill", icon: "🟢", text: "MLOps knowledge separates junior from senior ML engineers." },
      { type: "project", icon: "🛠️", text: "Build and deploy a fine-tuned model on HuggingFace with a demo." },
      { type: "resume", icon: "📄", text: "Include model accuracy metrics, dataset sizes, and inference speed." },
    ]
  }
};

// Master skill database with real-time market data
const MD_ALL_SKILLS = {
  "JavaScript": { demand: 92, growth: "+5%", category: "Web", color: "#f7df1e", icon: "⚡" },
  "Python": { demand: 90, growth: "+12%", category: "AI/Backend", color: "#3776ab", icon: "🐍" },
  "React.js": { demand: 88, growth: "+8%", category: "Frontend", color: "#61dafb", icon: "⚛️" },
  "TypeScript": { demand: 84, growth: "+22%", category: "Web", color: "#3178c6", icon: "📘" },
  "Node.js": { demand: 81, growth: "+10%", category: "Backend", color: "#68a063", icon: "🟢" },
  "Docker": { demand: 78, growth: "+18%", category: "DevOps", color: "#2496ed", icon: "🐳" },
  "AWS": { demand: 76, growth: "+15%", category: "Cloud", color: "#ff9900", icon: "☁️" },
  "SQL": { demand: 82, growth: "+6%", category: "Data", color: "#336791", icon: "🗄️" },
  "Kubernetes": { demand: 70, growth: "+31%", category: "DevOps", color: "#326ce5", icon: "⚙️" },
  "LLM / AI": { demand: 74, growth: "+47%", category: "AI", color: "#818cf8", icon: "🤖" },
  "Next.js": { demand: 72, growth: "+28%", category: "Frontend", color: "#ffffff", icon: "▲" },
  "GraphQL": { demand: 62, growth: "+14%", category: "API", color: "#e535ab", icon: "🔗" },
  "System Design": { demand: 82, growth: "+11%", category: "Backend", color: "#00e5ff", icon: "🏗️" },
  "CSS / Tailwind": { demand: 85, growth: "+9%", category: "Frontend", color: "#38bdf8", icon: "🎨" },
  "Vue.js": { demand: 68, growth: "+7%", category: "Frontend", color: "#42b883", icon: "💚" },
  "Terraform": { demand: 75, growth: "+25%", category: "DevOps", color: "#7b42bc", icon: "🔧" },
  "CI/CD": { demand: 90, growth: "+16%", category: "DevOps", color: "#f87171", icon: "🔄" },
  "Linux": { demand: 85, growth: "+8%", category: "DevOps", color: "#fcc419", icon: "🐧" },
  "REST APIs": { demand: 88, growth: "+10%", category: "Backend", color: "#34d399", icon: "🔗" },
  "Redis": { demand: 65, growth: "+13%", category: "Backend", color: "#dc2626", icon: "⚡" },
  "Power BI": { demand: 68, growth: "+19%", category: "Data", color: "#f2c811", icon: "📊" },
  "Tableau": { demand: 66, growth: "+15%", category: "Data", color: "#e97627", icon: "📈" },
  "Excel": { demand: 78, growth: "+3%", category: "Data", color: "#217346", icon: "📑" },
  "Pandas": { demand: 92, growth: "+14%", category: "Data", color: "#150458", icon: "🐼" },
  "Statistics": { demand: 75, growth: "+10%", category: "Data", color: "#8b5cf6", icon: "📐" },
  "Data Viz": { demand: 82, growth: "+12%", category: "Data", color: "#10b981", icon: "📊" },
  "Machine Learning": { demand: 95, growth: "+35%", category: "AI", color: "#818cf8", icon: "🤖" },
  "Deep Learning": { demand: 88, growth: "+42%", category: "AI", color: "#6366f1", icon: "🧠" },
  "PyTorch": { demand: 85, growth: "+38%", category: "AI", color: "#ee4c2c", icon: "🔥" },
  "TensorFlow": { demand: 83, growth: "+33%", category: "AI", color: "#ff6f00", icon: "🔶" },
  "LLMs": { demand: 80, growth: "+52%", category: "AI", color: "#a78bfa", icon: "💬" },
  "MLOps": { demand: 70, growth: "+45%", category: "AI", color: "#34d399", icon: "⚙️" },
  "NLP": { demand: 78, growth: "+40%", category: "AI", color: "#c084fc", icon: "📝" },
  "Data Engineering": { demand: 65, growth: "+28%", category: "Data", color: "#fbbf24", icon: "🔧" },
  "Webpack": { demand: 60, growth: "+5%", category: "Frontend", color: "#8dd6f9", icon: "📦" },
  "Testing": { demand: 60, growth: "+11%", category: "Frontend", color: "#94a3b8", icon: "🧪" },
  "Accessibility": { demand: 55, growth: "+18%", category: "Frontend", color: "#10b981", icon: "♿" },
  "Performance": { demand: 68, growth: "+14%", category: "Frontend", color: "#f59e0b", icon: "⚡" },
  "Monitoring": { demand: 68, growth: "+20%", category: "DevOps", color: "#06b6d4", icon: "📡" },
  "Ansible": { demand: 62, growth: "+12%", category: "DevOps", color: "#ee0000", icon: "🔴" },
  "Jenkins": { demand: 58, growth: "+8%", category: "DevOps", color: "#d24939", icon: "🔨" },
  "Git": { demand: 68, growth: "+4%", category: "Web", color: "#f05032", icon: "🌿" },
  "Communication": { demand: 80, growth: "+6%", category: "Soft", color: "#94a3b8", icon: "💬" },
};

const MD_TRENDING = [
  { skill: "JavaScript", demand: 92, growth: "+5%", category: "Web", color: "#f7df1e", icon: "⚡" },
  { skill: "Python", demand: 90, growth: "+12%", category: "AI/Backend", color: "#3776ab", icon: "🐍" },
  { skill: "React.js", demand: 88, growth: "+8%", category: "Frontend", color: "#61dafb", icon: "⚛️" },
  { skill: "TypeScript", demand: 84, growth: "+22%", category: "Web", color: "#3178c6", icon: "📘" },
  { skill: "Node.js", demand: 81, growth: "+10%", category: "Backend", color: "#68a063", icon: "🟢" },
  { skill: "Docker", demand: 78, growth: "+18%", category: "DevOps", color: "#2496ed", icon: "🐳" },
  { skill: "AWS", demand: 76, growth: "+15%", category: "Cloud", color: "#ff9900", icon: "☁️" },
  { skill: "SQL", demand: 82, growth: "+6%", category: "Data", color: "#336791", icon: "🗄️" },
  { skill: "Kubernetes", demand: 70, growth: "+31%", category: "DevOps", color: "#326ce5", icon: "⚙️" },
  { skill: "LLM / AI", demand: 74, growth: "+47%", category: "AI", color: "#818cf8", icon: "🤖" },
  { skill: "Next.js", demand: 72, growth: "+28%", category: "Frontend", color: "#ffffff", icon: "▲" },
  { skill: "GraphQL", demand: 62, growth: "+14%", category: "API", color: "#e535ab", icon: "🔗" },
];

const MD_TREND_DATA = [
  { month: "Jul '24", jobs: 12000, ai: 3200 },
  { month: "Aug '24", jobs: 14500, ai: 4100 },
  { month: "Sep '24", jobs: 13800, ai: 4800 },
  { month: "Oct '24", jobs: 16200, ai: 5900 },
  { month: "Nov '24", jobs: 15600, ai: 6700 },
  { month: "Dec '24", jobs: 18900, ai: 8200 },
  { month: "Jan '25", jobs: 21000, ai: 10500 },
  { month: "Feb '25", jobs: 23400, ai: 13200 },
];

// Maps each MD_ROLES skill display name → user skill key + minimum score to "have" it
// User skills are scored 0–100 in the Skill Assessment page
const MD_SKILL_MAP = {
  // Software Engineer
  "JavaScript": { key: "JavaScript", threshold: 40 },
  "Data Structures": { key: "DataStructures", threshold: 40 },
  "System Design": { key: "SystemDesign", threshold: 40 },
  "React / Vue": { key: "React", threshold: 40 },
  "Node.js": { key: "JavaScript", threshold: 70 }, // proxy: strong JS implies Node familiarity
  "SQL / NoSQL": { key: "DataStructures", threshold: 60 }, // proxy
  "Git & CI/CD": { key: "ProblemSolving", threshold: 50 }, // proxy
  "TypeScript": { key: "JavaScript", threshold: 80 }, // proxy: high JS → likely TS
  // Frontend Developer
  "React.js": { key: "React", threshold: 40 },
  "CSS / Tailwind": { key: "CSS", threshold: 40 },
  "Next.js": { key: "React", threshold: 70 },
  "Performance Opt.": { key: "SystemDesign", threshold: 50 },
  "Testing (Jest)": { key: "ProblemSolving", threshold: 60 },
  "Accessibility": { key: "CSS", threshold: 70 },
  // Backend Developer
  "Node.js / Python": { key: "Python", threshold: 40 },
  "REST / GraphQL APIs": { key: "SystemDesign", threshold: 40 },
  "SQL Databases": { key: "DataStructures", threshold: 50 },
  "Docker / K8s": { key: "SystemDesign", threshold: 65 },
  "Redis / Caching": { key: "SystemDesign", threshold: 70 },
  "AWS / GCP": { key: "SystemDesign", threshold: 75 },
  "Security Basics": { key: "ProblemSolving", threshold: 60 },
  // Data Analyst
  "Python (Pandas)": { key: "Python", threshold: 40 },
  "SQL": { key: "DataStructures", threshold: 50 },
  "Data Visualization": { key: "Python", threshold: 60 },
  "Excel / Sheets": { key: "Communication", threshold: 50 },
  "Statistics": { key: "ProblemSolving", threshold: 55 },
  "Power BI / Tableau": { key: "Python", threshold: 70 },
  "Machine Learning": { key: "Python", threshold: 65 },
  "Communication": { key: "Communication", threshold: 40 },
  // DevOps Engineer
  "Docker / Kubernetes": { key: "SystemDesign", threshold: 50 },
  "CI/CD Pipelines": { key: "SystemDesign", threshold: 55 },
  "AWS / Azure / GCP": { key: "SystemDesign", threshold: 65 },
  "Linux / Shell": { key: "ProblemSolving", threshold: 55 },
  "Terraform / IaC": { key: "SystemDesign", threshold: 70 },
  "Monitoring (Grafana)": { key: "SystemDesign", threshold: 75 },
  "Python / Bash": { key: "Python", threshold: 40 },
  "Security / IAM": { key: "SystemDesign", threshold: 80 },
  // AI/ML Engineer — "Machine Learning" key already defined above (shared with Data Analyst)
  "Python": { key: "Python", threshold: 40 },
  "Deep Learning / NNs": { key: "Python", threshold: 75 },
  "PyTorch / TensorFlow": { key: "Python", threshold: 80 },
  "LLMs / Prompt Eng.": { key: "Python", threshold: 85 },
  "MLOps": { key: "SystemDesign", threshold: 70 },
  "Statistics / Math": { key: "ProblemSolving", threshold: 60 },
  "Data Engineering": { key: "DataStructures", threshold: 65 },
};

// Returns true if the user's skills satisfy the threshold for a given skill display name
function userHasSkill(userSkills, skillName) {
  const mapping = MD_SKILL_MAP[skillName];
  if (!mapping) return false;
  const score = (userSkills || {})[mapping.key] || 0;
  return score >= mapping.threshold;
}

// Animated counter hook — animates from previous value to new target (up or down)
function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    const from = prevTarget.current;
    prevTarget.current = target;
    if (from === target) return;

    const startTime = performance.now();
    const diff = target - from;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
}

// Animated skill bar
function AnimatedBar({ value, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(0); // reset first so re-mount always animates from 0
    const t = setTimeout(() => setWidth(value), delay + 80);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${width}%`, borderRadius: 4,
        background: `linear-gradient(90deg, ${color}, ${color}bb)`,
        boxShadow: `0 0 12px ${color}60`,
        transition: "width 1s cubic-bezier(0.4,0,0.2,1)"
      }} />
    </div>
  );
}

// Animated percentage number — counts from 0 to value on mount
function AnimatedNumber({ value, color, suffix = "%" }) {
  const count = useCounter(value, 900);
  return (
    <span className="mono" style={{ fontSize: 20, fontWeight: 800, color }}>
      {count}{suffix}
    </span>
  );
}

// Circular match indicator
function CircleMatch({ pct, color, size = 120 }) {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const [dash, setDash] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDash((pct / 100) * circ), 300);
    return () => clearTimeout(t);
  }, [pct, circ]);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span className="syne" style={{ fontSize: size * 0.2, fontWeight: 800, color }}>{pct}%</span>
        <span style={{ fontSize: 10, color: G.muted }}>Match</span>
      </div>
    </div>
  );
}

// MARKET DEMAND — Premium Dashboard
function MarketDemand({ onNav, user }) {
  const [tab, setTab] = useState("trending");
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [filterCat, setFilterCat] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const userSkills = (user && user.skills) ? user.skills : {};
  const roleData = MD_ROLES[selectedRole];
  const roleColor = roleData.color;

  // Compute match % dynamically from user's actual skill scores
  const enrichedSkills = roleData.skills.map(s => ({
    ...s,
    userHas: userHasSkill(userSkills, s.name)
  }));
  const matchedSkills = enrichedSkills.filter(s => s.userHas).length;
  const matchPct = Math.round((matchedSkills / enrichedSkills.length) * 100);

  // Build role-specific trending skills from the master skill database
  // Priority order: role's own trendingSkills list first, then fill with global top skills
  const roleTrendingSkills = roleData.trendingSkills
    .map(name => {
      const data = MD_ALL_SKILLS[name];
      if (!data) return null;
      return { skill: name, ...data };
    })
    .filter(Boolean);

  // Derive unique categories from the role's trending skills
  const roleCategories = ["All", ...Array.from(new Set(roleTrendingSkills.map(s => s.category)))];

  const filteredTrending = filterCat === "All"
    ? roleTrendingSkills
    : roleTrendingSkills.filter(s => s.category === filterCat);

  // Reset category filter when role changes
  const prevRole = useRef(selectedRole);
  if (prevRole.current !== selectedRole) {
    prevRole.current = selectedRole;
    if (filterCat !== "All") setFilterCat("All");
  }

  const tabs = [
    { key: "trending", label: "🔥 Trending Skills" },
    { key: "match", label: "🎯 Your Match" },
    { key: "role", label: "💼 Role Insights" },
    { key: "ai", label: "🤖 AI Recommendations" },
  ];

  // Role-specific monthly postings data
  const MD_MONTHLY_POSTINGS = {
    "Software Engineer": 23400,
    "Frontend Developer": 16800,
    "Backend Developer": 19200,
    "Data Analyst": 11500,
    "DevOps Engineer": 13700,
    "AI/ML Engineer": 9800,
  };

  const openingsNum = parseInt(roleData.openings.replace(/[^0-9]/g, ""), 10);
  const monthlyNum = MD_MONTHLY_POSTINGS[selectedRole] || 23400;

  // Parse salary avg (e.g. "₹18L") → number in lakhs for delta comparison
  const parseSalary = s => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
  const salaryNum = parseSalary(roleData.salary.avg);

  // Parse hiring trend (e.g. "+23%") → number for delta comparison
  const parseTrend = s => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
  const trendNum = parseTrend(roleData.trendPct);

  // Track previous values to compute deltas on role change
  const prevOpenings = useRef(openingsNum);
  const prevMonthly = useRef(monthlyNum);
  const prevSalary = useRef(salaryNum);
  const prevTrend = useRef(trendNum);
  const prevMatch = useRef(matchPct);

  const [openingsDelta, setOpeningsDelta] = useState(0);
  const [monthlyDelta, setMonthlyDelta] = useState(0);
  const [salaryDelta, setSalaryDelta] = useState(0);
  const [trendDelta, setTrendDelta] = useState(0);
  const [matchDelta, setMatchDelta] = useState(0);
  // Increments every role change — used as key to re-mount AnimatedBar so bars re-animate from 0
  const [roleChangeKey, setRoleChangeKey] = useState(0);

  useEffect(() => {
    setOpeningsDelta(openingsNum - prevOpenings.current);
    setMonthlyDelta(monthlyNum - prevMonthly.current);
    setSalaryDelta(salaryNum - prevSalary.current);
    setTrendDelta(trendNum - prevTrend.current);
    setMatchDelta(matchPct - prevMatch.current);
    setRoleChangeKey(k => k + 1);
    prevOpenings.current = openingsNum;
    prevMonthly.current = monthlyNum;
    prevSalary.current = salaryNum;
    prevTrend.current = trendNum;
    prevMatch.current = matchPct;
  }, [selectedRole]); // eslint-disable-line

  // Animated salary counter (in lakhs)
  const c1 = useCounter(openingsNum, 1200);
  const c2 = useCounter(monthlyNum, 1200);
  const c3 = useCounter(matchPct, 1000);
  const cSalary = useCounter(salaryNum, 1000);
  const cTrend = useCounter(trendNum, 1000);

  return (
    <div className="section-enter" style={{ paddingBottom: 48 }}>
      {/* ── HEADER ── */}
      <div style={{
        position: "relative", borderRadius: 24, overflow: "hidden",
        background: "linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(124,58,237,0.12) 50%, rgba(255,107,157,0.08) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "36px 40px", marginBottom: 32
      }}>
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, left: "30%", width: 160, height: 160, background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24, position: "relative" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.25)", borderRadius: 20, padding: "4px 14px", marginBottom: 14, fontSize: 11, color: "#22d3ee", fontWeight: 700, letterSpacing: 1 }}>
              <span style={{ width: 6, height: 6, background: "#22d3ee", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
              LIVE MARKET DATA · 2025
            </div>
            <h1 className="syne" style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, marginBottom: 10, lineHeight: 1.2 }}>
              Market Demand{" "}
              <span style={{ background: "linear-gradient(135deg, #00e5ff, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Analytics
              </span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, maxWidth: 520 }}>
              Real-time skill demand data, job market trends, and personalized AI recommendations to accelerate your career.
            </p>
          </div>

          {/* Role selector */}
          <div style={{ minWidth: 220 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: 1 }}>SELECT JOB ROLE</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              style={{
                width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12, padding: "12px 16px", color: "#f0f4ff", fontSize: 14, fontWeight: 600,
                cursor: "pointer", outline: "none", fontFamily: "inherit",
                appearance: "none",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300e5ff' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center"
              }}
            >
              {Object.keys(MD_ROLES).map(r => (
                <option key={r} value={r} style={{ background: "#1a2347" }}>{MD_ROLES[r].icon} {r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginTop: 28 }}>
          {[
            {
              label: "Open Positions",
              val: `${c1.toLocaleString()}+`,
              icon: "💼", color: "#22d3ee",
              sub: "Tech sector, India",
              delta: openingsDelta,
              deltaLabel: openingsDelta !== 0 ? `${openingsDelta > 0 ? "▲" : "▼"} ${Math.abs(openingsDelta).toLocaleString()} vs prev role` : null,
            },
            {
              label: "Monthly Postings",
              val: c2.toLocaleString(),
              icon: "📈", color: "#c084fc",
              sub: "Feb 2025",
              delta: monthlyDelta,
              deltaLabel: monthlyDelta !== 0 ? `${monthlyDelta > 0 ? "▲" : "▼"} ${Math.abs(monthlyDelta).toLocaleString()} vs prev role` : null,
            },
            {
              label: "Your Match Score",
              val: `${c3}%`,
              icon: "🎯", color: roleColor,
              sub: selectedRole,
              delta: matchDelta,
              deltaLabel: matchDelta !== 0
                ? `${matchDelta > 0 ? "▲" : "▼"} ${Math.abs(matchDelta)}% vs prev role`
                : null,
            },
            {
              label: "Avg Salary",
              val: `₹${cSalary}L`,
              icon: "💰", color: "#34d399",
              sub: `${roleData.salary.min} – ${roleData.salary.max}`,
              delta: salaryDelta,
              deltaLabel: salaryDelta !== 0
                ? `${salaryDelta > 0 ? "▲" : "▼"} ₹${Math.abs(salaryDelta)}L avg vs prev role`
                : null,
            },
            {
              label: "Hiring Trend",
              val: `+${cTrend}%`,
              icon: roleData.trend === "increasing" ? "🚀" : "📊",
              color: roleData.trend === "increasing" ? "#34d399" : "#fbbf24",
              sub: "YoY growth",
              delta: trendDelta,
              deltaLabel: trendDelta !== 0
                ? `${trendDelta > 0 ? "▲" : "▼"} ${Math.abs(trendDelta)}% vs prev role`
                : null,
            },
          ].map((kpi, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "16px 18px",
              transition: "all 0.3s ease", cursor: "default"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = `${kpi.color}40`; e.currentTarget.style.boxShadow = `0 8px 24px ${kpi.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{kpi.icon}</div>
              <div className="syne mono" style={{ fontSize: 22, fontWeight: 800, color: kpi.color, lineHeight: 1 }}>{kpi.val}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#f0f4ff", marginTop: 4 }}>{kpi.label}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{kpi.sub}</div>
              {kpi.deltaLabel && (
                <div style={{
                  marginTop: 8, fontSize: 11, fontWeight: 700,
                  color: kpi.delta > 0 ? "#34d399" : "#f87171",
                  background: kpi.delta > 0 ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                  border: `1px solid ${kpi.delta > 0 ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
                  borderRadius: 6, padding: "3px 8px", display: "inline-block"
                }}>
                  {kpi.deltaLabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "10px 22px", borderRadius: 10, border: `1px solid ${tab === t.key ? roleColor : "rgba(255,255,255,0.1)"}`,
            background: tab === t.key ? `${roleColor}18` : "transparent",
            color: tab === t.key ? roleColor : "#94a3b8",
            cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s",
            fontFamily: "inherit",
            boxShadow: tab === t.key ? `0 0 16px ${roleColor}30` : "none"
          }}>{t.label}</button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          TAB 1 — TRENDING SKILLS
      ══════════════════════════════════════════════════════ */}
      {tab === "trending" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Category filter chips — dynamic per role */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {roleCategories.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{
                padding: "6px 16px", borderRadius: 20, border: `1px solid ${filterCat === cat ? "#22d3ee" : "rgba(255,255,255,0.1)"}`,
                background: filterCat === cat ? "rgba(0,229,255,0.12)" : "transparent",
                color: filterCat === cat ? "#22d3ee" : "#94a3b8",
                cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s", fontFamily: "inherit"
              }}>{cat}</button>
            ))}
          </div>

          {/* Skills grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {filteredTrending.map((s, i) => (
              <div key={`${roleChangeKey}-${i}`}
                onMouseEnter={() => setHoveredSkill(s.skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                style={{
                  background: hoveredSkill === s.skill
                    ? `linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04))`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${hoveredSkill === s.skill ? s.color + "50" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 16, padding: "20px 22px",
                  transition: "all 0.3s ease",
                  transform: hoveredSkill === s.skill ? "translateY(-4px) scale(1.02)" : "none",
                  boxShadow: hoveredSkill === s.skill ? `0 12px 32px ${s.color}20` : "none",
                  cursor: "default",
                  backdropFilter: "blur(8px)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff" }}>{s.skill}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{s.category}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <AnimatedNumber value={s.demand} color={s.color} />
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: "#34d399",
                      background: "rgba(52,211,153,0.1)", borderRadius: 6, padding: "2px 8px", marginTop: 2
                    }}>{s.growth}</div>
                  </div>
                </div>
                <AnimatedBar value={s.demand} color={s.color} delay={i * 60} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "#94a3b8" }}>
                  <span>Demand Index</span>
                  <span style={{ color: s.demand >= 85 ? "#34d399" : s.demand >= 70 ? "#fbbf24" : "#f87171", fontWeight: 600 }}>
                    {s.demand >= 85 ? "🔥 Very High" : s.demand >= 70 ? "📈 High" : "📊 Moderate"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div key={roleChangeKey} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "28px 24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h3 className="syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
                  {roleData.icon} {selectedRole} — Skill Demand Index
                </h3>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>Top skills ranked by market demand for this role · 2025</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={roleTrendingSkills.slice(0, 8)} barGap={4}>
                <defs>
                  <linearGradient id="mdGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={roleColor} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={roleColor} stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ background: "#1a2347", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f0f4ff", fontSize: 13 }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  formatter={(val, name) => [`${val}% demand`, "Market Demand"]}
                />
                <Bar dataKey="demand" fill="url(#mdGrad1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 2 — YOUR MATCH
      ══════════════════════════════════════════════════════ */}
      {tab === "match" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Match overview */}
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "center",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "32px 36px"
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <CircleMatch pct={matchPct} color={roleColor} size={140} />
              <div style={{ textAlign: "center" }}>
                <div className="syne" style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff" }}>{selectedRole}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                  {matchedSkills}/{enrichedSkills.length} skills matched
                </div>
              </div>
            </div>
            <div>
              <h3 className="syne" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                {matchPct >= 70 ? "Strong Match! 🎉" : matchPct >= 40 ? "Good Progress 📈" : "Room to Grow 🌱"}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                {matchPct >= 70
                  ? `You already have ${matchedSkills} of the key skills for ${selectedRole}. Focus on the gaps below to become a top candidate.`
                  : matchPct >= 40
                    ? `You're on the right track. Building the missing skills will significantly boost your interview success rate.`
                    : `Start with the high-demand skills below. Even 2–3 additions can dramatically improve your match score.`}
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 10, padding: "10px 18px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Skills You Have</div>
                  <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: "#34d399" }}>{matchedSkills}</div>
                </div>
                <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 10, padding: "10px 18px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Skills to Add</div>
                  <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: "#f87171" }}>{enrichedSkills.length - matchedSkills}</div>
                </div>
                <div style={{ background: `${roleColor}15`, border: `1px solid ${roleColor}30`, borderRadius: 10, padding: "10px 18px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Match Score</div>
                  <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: roleColor }}>{matchPct}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill comparison list */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 28px" }}>
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
              Skill-by-Skill Comparison — <span style={{ color: roleColor }}>{selectedRole}</span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {enrichedSkills.map((s, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto",
                  alignItems: "center", gap: 16,
                  padding: "14px 18px", borderRadius: 12,
                  background: s.userHas ? "rgba(52,211,153,0.05)" : "rgba(248,113,113,0.04)",
                  border: `1px solid ${s.userHas ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.12)"}`,
                  transition: "all 0.2s"
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{s.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                        background: s.userHas ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
                        color: s.userHas ? "#34d399" : "#f87171"
                      }}>{s.userHas ? "✓ You have this" : "✗ Missing"}</span>
                    </div>
                    <AnimatedBar value={s.demand} color={s.userHas ? "#34d399" : "#f87171"} delay={i * 80} />
                  </div>
                  <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: s.userHas ? "#34d399" : "#f87171", minWidth: 48, textAlign: "right" }}>
                    {s.demand}%
                  </div>
                  <div style={{ fontSize: 20 }}>{s.userHas ? "✅" : "❌"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing skills callout */}
          {enrichedSkills.filter(s => !s.userHas).length > 0 && (
            <div style={{
              background: "linear-gradient(135deg, rgba(248,113,113,0.08), rgba(251,191,36,0.06))",
              border: "1px solid rgba(248,113,113,0.2)", borderRadius: 16, padding: "22px 24px"
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", marginBottom: 12 }}>
                🎯 Priority Skills to Add
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {enrichedSkills.filter(s => !s.userHas).sort((a, b) => b.demand - a.demand).map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "8px 14px", fontSize: 13
                  }}>
                    <span style={{ fontWeight: 600, color: "#f0f4ff" }}>{s.name}</span>
                    <span className="mono" style={{ fontSize: 11, color: "#f87171", fontWeight: 700 }}>{s.demand}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 3 — ROLE INSIGHTS
      ══════════════════════════════════════════════════════ */}
      {tab === "role" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Role header card */}
          <div style={{
            background: `linear-gradient(135deg, ${roleColor}12, ${roleColor}06)`,
            border: `1px solid ${roleColor}30`, borderRadius: 20, padding: "32px 36px",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, background: `radial-gradient(circle, ${roleColor}20 0%, transparent 70%)`, borderRadius: "50%" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 52 }}>{roleData.icon}</div>
              <div>
                <h2 className="syne" style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff", marginBottom: 4 }}>{selectedRole}</h2>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: roleData.trend === "increasing" ? "#34d399" : "#fbbf24",
                    background: roleData.trend === "increasing" ? "rgba(52,211,153,0.12)" : "rgba(251,191,36,0.12)",
                    border: `1px solid ${roleData.trend === "increasing" ? "rgba(52,211,153,0.3)" : "rgba(251,191,36,0.3)"}`,
                    borderRadius: 8, padding: "3px 10px"
                  }}>
                    {roleData.trend === "increasing" ? "🚀 Hiring Increasing" : "📊 Stable Demand"}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: roleColor, background: `${roleColor}15`, border: `1px solid ${roleColor}30`, borderRadius: 8, padding: "3px 10px" }}>
                    {roleData.trendPct} YoY
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "3px 10px" }}>
                    {roleData.openings} openings
                  </span>
                </div>
              </div>
            </div>

            {/* Salary range */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { label: "Entry Level", val: roleData.salary.min, sub: "0–2 years" },
                { label: "Average CTC", val: roleData.salary.avg, sub: "2–5 years", highlight: true },
                { label: "Senior Level", val: roleData.salary.max, sub: "5+ years" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: s.highlight ? `${roleColor}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${s.highlight ? roleColor + "40" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 14, padding: "18px 20px", textAlign: "center"
                }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>{s.label}</div>
                  <div className="syne" style={{ fontSize: 24, fontWeight: 800, color: s.highlight ? roleColor : "#f0f4ff" }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Required skills ranked */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 28px" }}>
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Top Required Skills — Ranked by Demand</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...enrichedSkills].sort((a, b) => b.demand - a.demand).map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr auto", alignItems: "center", gap: 14 }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: i < 3 ? roleColor : "#94a3b8" }}>#{i + 1}</div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{s.name}</span>
                      <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: roleColor }}>{s.demand}%</span>
                    </div>
                    <AnimatedBar value={s.demand} color={i < 3 ? roleColor : "#94a3b8"} delay={i * 70} />
                  </div>
                  <div style={{ fontSize: 16 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "⭐"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring trend chart */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px" }}>
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Hiring Trend — Tech Sector</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Total job postings vs AI/ML roles (Jul 2024 – Feb 2025)</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MD_TREND_DATA}>
                <defs>
                  <linearGradient id="mdTrendGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={roleColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={roleColor} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mdTrendGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ background: "#1a2347", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f0f4ff", fontSize: 13 }} />
                <Area type="monotone" dataKey="jobs" name="All Tech Jobs" stroke={roleColor} fill="url(#mdTrendGrad1)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="ai" name="AI/ML Roles" stroke="#818cf8" fill="url(#mdTrendGrad2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 20, marginTop: 12, justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
                <div style={{ width: 24, height: 3, background: roleColor, borderRadius: 2 }} />
                All Tech Jobs
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
                <div style={{ width: 24, height: 3, background: "#818cf8", borderRadius: 2 }} />
                AI/ML Roles
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 4 — AI RECOMMENDATIONS
      ══════════════════════════════════════════════════════ */}
      {tab === "ai" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* AI header */}
          <div style={{
            background: "linear-gradient(135deg, rgba(129,140,248,0.1), rgba(192,132,252,0.08))",
            border: "1px solid rgba(129,140,248,0.25)", borderRadius: 20, padding: "28px 32px",
            display: "flex", alignItems: "center", gap: 20
          }}>
            <div style={{ fontSize: 52, animation: "float 3s ease-in-out infinite" }}>🤖</div>
            <div>
              <h3 className="syne" style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
                AI Career Advisor
              </h3>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
                Personalized recommendations for <strong style={{ color: roleColor }}>{selectedRole}</strong> based on current market demand and your profile gaps.
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {roleData.aiRecs.map((rec, i) => {
              const typeColors = { skill: "#22d3ee", project: "#c084fc", resume: "#fbbf24" };
              const typeLabels = { skill: "SKILL TO ADD", project: "PROJECT IDEA", resume: "RESUME TIP" };
              const c = typeColors[rec.type] || "#94a3b8";
              return (
                <div key={i} style={{
                  background: `${c}08`, border: `1px solid ${c}25`,
                  borderRadius: 16, padding: "22px 22px",
                  transition: "all 0.3s ease", cursor: "default"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${c}20`; e.currentTarget.style.borderColor = `${c}50`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = `${c}25`; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 26 }}>{rec.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: c, background: `${c}15`, border: `1px solid ${c}30`, borderRadius: 6, padding: "3px 10px", letterSpacing: 0.8 }}>
                      {typeLabels[rec.type]}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "#f0f4ff", lineHeight: 1.7 }}>{rec.text}</p>
                </div>
              );
            })}
          </div>

          {/* General market insights */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 28px" }}>
            <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Market Intelligence — 2025</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {[
                { icon: "🔥", title: "Hottest Skill", val: "TypeScript", desc: "+22% demand growth YoY. Now required at 80% of frontend roles.", color: "#f87171" },
                { icon: "🚀", title: "Fastest Growing", val: "LLM / AI Engineering", desc: "+47% YoY. Entry-level AI skills expected at 34% of tech companies.", color: "#34d399" },
                { icon: "🎯", title: "Most Underrated", val: "System Design", desc: "Only 28% of candidates can demonstrate system design skills.", color: "#fbbf24" },
                { icon: "💼", title: "Highest Paying", val: "DevOps / Cloud", desc: "Average ₹24L. Kubernetes + AWS combo commands premium offers.", color: "#22d3ee" },
                { icon: "⚡", title: "Quick Win", val: "Docker Basics", desc: "2-week learning curve, required in 78% of backend job postings.", color: "#c084fc" },
                { icon: "🌐", title: "Remote Demand", val: "JavaScript + APIs", desc: "92% of remote tech jobs require strong JavaScript fundamentals.", color: "#818cf8" },
              ].map((c, i) => (
                <div key={i} style={{
                  background: `${c.color}08`, border: `1px solid ${c.color}20`,
                  borderRadius: 14, padding: "18px 18px",
                  transition: "all 0.3s ease"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = `${c.color}40`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = `${c.color}20`; }}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: 0.8, marginBottom: 4 }}>{c.title.toUpperCase()}</div>
                  <div className="syne" style={{ fontSize: 16, fontWeight: 800, color: c.color, marginBottom: 6 }}>{c.val}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: "linear-gradient(135deg, rgba(255,107,157,0.1), rgba(124,58,237,0.1))",
            border: "1px solid rgba(255,107,157,0.2)", borderRadius: 16, padding: "24px 28px",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
          }}>
            <div>
              <div className="syne" style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Ready to close the skill gap?</div>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>Update your resume with the skills you've added and track your progress.</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-primary" style={{ fontSize: 13, padding: "10px 22px" }} onClick={() => onNav("resume")}>
                📄 Update Resume
              </button>
              <button className="btn-outline" style={{ fontSize: 13, padding: "9px 22px" }} onClick={() => onNav("assessment")}>
                🎯 Re-assess Skills
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// RESUME BUILDER — delegates to the premium standalone component
function ResumeBuilder({ user }) {
  return <PremiumResumeBuilder user={user} />;
}

// OLD RESUME BUILDER (replaced) — keeping stub for reference
function _OldResumeBuilder_UNUSED({ user }) {
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
// END _OldResumeBuilder_UNUSED

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
                  {[0, 1, 2].map(i => <span key={i} className="pulse-anim" style={{ width: 8, height: 8, background: G.accent, borderRadius: "50%", display: "inline-block", animationDelay: `${i * 0.2}s` }} />)}
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
            {appPage === "dsa" && <DSAGame />}
            {appPage === "career" && <CareerMatch user={user} onNav={setAppPage} />}
            {appPage === "market" && <MarketDemand onNav={setAppPage} user={user} />}
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
