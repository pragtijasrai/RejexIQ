import { useState, useEffect, useRef, useCallback } from "react";

// ─── useInView hook ──────────────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.unobserve(el); }
    }, { threshold: 0.12, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Animated Section wrapper ────────────────────────────────────────────────
function Section({ children, className = "", delay = 0, direction = "up" }) {
  const [ref, inView] = useInView();
  const transforms = { up: "translateY(48px)", left: "translateX(-48px)", right: "translateX(48px)", scale: "scale(0.93)" };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : transforms[direction],
        transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Skill Bar ───────────────────────────────────────────────────────────────
function SkillBar({ label, pct, color }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#3d3a35" }}>{label}</span>
        <span style={{ fontSize: "0.75rem", color: "#9a9590" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "#eee8e0", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: color || "linear-gradient(90deg,#2d5a45,#4a8c6a)",
          width: inView ? `${pct}%` : "0%",
          transition: "width 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s",
        }} />
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ num, label, icon }) {
  const [ref, inView] = useInView();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0; const end = parseInt(num.replace(/\D/g, ""));
    const dur = 1500; const step = Math.ceil(end / (dur / 16));
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(start);
    }, 16);
    return () => clearInterval(t);
  }, [inView, num]);
  return (
    <div ref={ref} className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-num">{count}{num.replace(/\d/g, "")}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ─── Timeline Item ───────────────────────────────────────────────────────────
function TimelineItem({ title, org, period, desc, tags, index }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className="tl-item"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateX(-32px)",
        transition: `all 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 120}ms`,
      }}
    >
      <div className="tl-dot" />
      <div className="tl-content">
        <div className="tl-period">{period}</div>
        <div className="tl-title">{title}</div>
        <div className="tl-org">{org}</div>
        {desc && <p className="tl-desc">{desc}</p>}
        {tags && (
          <div className="tl-tags">
            {tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState("about");
  const [editMode, setEditMode] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallaxBg = -scrollY * 0.35;
  const parallaxAvatar = -scrollY * 0.12;
  const headerOpacity = Math.min(scrollY / 120, 1);

  const roadmapItems = [
    { icon: "🌱", level: "Beginner", label: "Foundations", items: ["Python basics", "Math & Logic", "Problem Solving"] },
    { icon: "🌿", level: "Intermediate", label: "Core Skills", items: ["Data Structures", "Algorithms", "System Design basics"] },
    { icon: "🌳", level: "Advanced", label: "Specialise", items: ["Machine Learning", "System Architecture", "Open Source"] },
    { icon: "🏆", level: "Expert", label: "Mastery", items: ["Research Papers", "Leadership", "Mentoring others"] },
  ];

  const experience = [
    { title: "Senior Frontend Engineer", org: "TechCorp Inc.", period: "2023 – Present", desc: "Led redesign of core product dashboard, improving performance by 40% and user retention by 22%.", tags: ["React", "TypeScript", "Figma", "AWS"] },
    { title: "Full Stack Developer", org: "Startup Labs", period: "2021 – 2023", desc: "Built scalable REST APIs and React applications serving 50k+ daily users.", tags: ["Node.js", "MongoDB", "React", "Docker"] },
    { title: "Software Developer Intern", org: "Infosys", period: "2020 – 2021", desc: "Contributed to enterprise banking portal, resolved 60+ bugs and shipped 3 features.", tags: ["Java", "Spring Boot", "MySQL"] },
  ];

  const education = [
    { title: "B.Tech Computer Science", org: "IIT Delhi", period: "2017 – 2021", desc: "CGPA 8.6 / 10. Specialised in AI & Machine Learning. Dean's Merit List 3 years.", tags: ["AI/ML", "Algorithms", "Distributed Systems"] },
    { title: "Higher Secondary (XII)", org: "Delhi Public School", period: "2016 – 2017", desc: "PCM + CS stream. 96.2% aggregate.", tags: ["Mathematics", "Physics", "Computer Science"] },
  ];

  const skills = [
    { label: "Data Structures & Algorithms", pct: 88, color: "linear-gradient(90deg,#1a3028,#4a8c6a)" },
    { label: "React / Next.js", pct: 92, color: "linear-gradient(90deg,#2d5a45,#6dbf8a)" },
    { label: "System Design", pct: 75, color: "linear-gradient(90deg,#3b6b52,#8dbfa0)" },
    { label: "Machine Learning", pct: 68, color: "linear-gradient(90deg,#4a7c63,#a8d5b5)" },
    { label: "Node.js / Express", pct: 82, color: "linear-gradient(90deg,#2d5a45,#4a8c6a)" },
    { label: "MongoDB / PostgreSQL", pct: 78, color: "linear-gradient(90deg,#1a3028,#3b6b52)" },
  ];

  const certifications = [
    { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2023", color: "#f59e0b" },
    { name: "Google Professional Data Engineer", issuer: "Google Cloud", year: "2022", color: "#4285f4" },
    { name: "Meta React Developer Certificate", issuer: "Meta / Coursera", year: "2022", color: "#1877f2" },
    { name: "Stanford ML Specialization", issuer: "Coursera / Stanford", year: "2021", color: "#8c1515" },
  ];

  const projects = [
    { name: "CareerForest", desc: "A platform helping 20k+ students discover optimal learning paths toward their dream roles.", tech: ["React", "Node.js", "MongoDB", "OpenAI API"], stars: "1.2k", link: "#" },
    { name: "DSA Visualizer", desc: "Interactive visualizer for 50+ data structures and algorithms with step-by-step animations.", tech: ["React", "D3.js", "TypeScript"], stars: "3.4k", link: "#" },
    { name: "ResumeAI", desc: "AI-powered resume analyser that gives ATS score + suggestions in under 3 seconds.", tech: ["Python", "FastAPI", "Claude API", "React"], stars: "890", link: "#" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --g-dark: #1a3028; --g-mid: #2d5a45; --g-light: #4a8c6a; --g-pale: #8dbfa0;
          --cream: #f4f1ec; --white: #ffffff;
          --gray-100: #f8f7f5; --gray-200: #e8e4de; --gray-400: #9a9590;
          --gray-600: #6b6560; --gray-800: #2c2a27;
          --card-shadow: 0 4px 24px rgba(26,48,40,0.08), 0 1px 6px rgba(26,48,40,0.05);
          --card-hover: 0 12px 40px rgba(26,48,40,0.14), 0 2px 10px rgba(26,48,40,0.08);
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--gray-800); overflow-x: hidden; }

        /* ── Sticky nav ── */
        .prof-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 14px 32px; display: flex; align-items: center; justify-content: space-between;
          backdrop-filter: blur(16px);
          background: rgba(244,241,236,0.82);
          border-bottom: 1px solid rgba(26,48,40,0.06);
          transition: box-shadow 0.3s;
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 500;
          color: var(--g-dark); letter-spacing: -0.02em; text-decoration: none;
          display: flex; align-items: center; gap: 8px;
        }
        .nav-logo-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--g-light); }
        .nav-actions { display: flex; gap: 10px; align-items: center; }
        .nav-btn {
          padding: 7px 18px; border-radius: 50px;
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.03em;
        }
        .nav-btn-outline {
          background: transparent; border: 1.5px solid var(--g-mid); color: var(--g-mid);
        }
        .nav-btn-outline:hover { background: var(--g-mid); color: white; }
        .nav-btn-solid {
          background: linear-gradient(135deg, var(--g-dark), var(--g-mid));
          border: none; color: white;
        }
        .nav-btn-solid:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(26,48,40,0.28); }

        /* ── Hero ── */
        .hero {
          position: relative; height: 100vh; min-height: 600px;
          display: flex; align-items: flex-end; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(160deg, var(--g-dark) 0%, #224438 40%, var(--g-mid) 75%, var(--g-light) 100%);
          will-change: transform;
        }
        .hero-bg-leaves {
          position: absolute; inset: 0; overflow: hidden; pointer-events: none;
        }
        .hero-leaf-big {
          position: absolute; color: rgba(255,255,255,0.06);
          animation: heroLeaf 20s ease-in-out infinite;
        }
        .hero-leaf-big:nth-child(1) { width: 280px; right: -40px; top: -20px; animation-delay: 0s; }
        .hero-leaf-big:nth-child(2) { width: 180px; left: -30px; bottom: 10%; animation-delay: -8s; transform: rotate(160deg); }
        .hero-leaf-big:nth-child(3) { width: 120px; left: 35%; top: 15%; animation-delay: -4s; transform: rotate(45deg); opacity: 0.04; }
        @keyframes heroLeaf {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
        }

        .hero-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(26,48,40,0.65) 0%, transparent 50%);
        }
        .hero-content {
          position: relative; z-index: 2;
          width: 100%; max-width: 1100px; margin: 0 auto;
          padding: 0 40px 64px; display: flex; align-items: flex-end; gap: 40px;
        }
        .hero-avatar-wrap {
          flex-shrink: 0; position: relative; will-change: transform;
        }
        .hero-avatar {
          width: 130px; height: 130px; border-radius: 28px;
          background: linear-gradient(135deg, var(--g-light), var(--g-pale));
          border: 3px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 500;
          color: white; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .hero-badge {
          position: absolute; bottom: -8px; right: -8px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white; border-radius: 20px; padding: 3px 10px;
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.05em;
          box-shadow: 0 4px 12px rgba(249,115,22,0.35);
        }
        .hero-text { color: white; flex: 1; }
        .hero-greeting { font-size: 0.78rem; opacity: 0.6; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
        .hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 500;
          line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 8px;
        }
        .hero-role { font-size: 0.95rem; opacity: 0.75; font-weight: 300; margin-bottom: 16px; }
        .hero-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .hero-tag {
          padding: 4px 12px; border-radius: 50px;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          font-size: 0.72rem; color: rgba(255,255,255,0.85); backdrop-filter: blur(8px);
        }
        .hero-actions { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
        .hero-btn {
          padding: 10px 22px; border-radius: 50px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500;
          cursor: pointer; transition: all 0.25s; letter-spacing: 0.02em;
        }
        .hero-btn-primary { background: white; color: var(--g-dark); border: none; }
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .hero-btn-outline { background: transparent; border: 1.5px solid rgba(255,255,255,0.5); color: white; }
        .hero-btn-outline:hover { background: rgba(255,255,255,0.1); }

        /* ── Scroll indicator ── */
        .scroll-cue {
          position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
          z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.4); font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase;
          animation: pulseDown 2s ease-in-out infinite;
        }
        .scroll-cue svg { opacity: 0.5; }
        @keyframes pulseDown {
          0%,100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
          50% { transform: translateX(-50%) translateY(8px); opacity: 1; }
        }

        /* ── Main layout ── */
        .profile-body { max-width: 1100px; margin: 0 auto; padding: 60px 32px 100px; }

        /* ── Section heading ── */
        .section-head { margin-bottom: 36px; }
        .section-label { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--g-light); font-weight: 500; margin-bottom: 6px; }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 500; color: var(--gray-800); letter-spacing: -0.02em; }

        /* ── Stats row ── */
        .stats-row { display: flex; gap: 20px; margin-bottom: 64px; flex-wrap: wrap; }
        .stat-card {
          flex: 1; min-width: 140px; background: white; border-radius: 20px;
          padding: 24px 20px; text-align: center;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
          transition: all 0.3s ease;
        }
        .stat-card:hover { transform: translateY(-4px); box-shadow: var(--card-hover); }
        .stat-icon { font-size: 1.5rem; margin-bottom: 8px; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 600; color: var(--g-dark); line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 0.72rem; color: var(--gray-400); font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; }

        /* ── About card ── */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 64px; }
        .about-card {
          background: white; border-radius: 20px; padding: 32px;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
        }
        .about-card-bio { grid-column: 1 / -1; }
        .bio-text { font-size: 0.95rem; line-height: 1.8; color: var(--gray-600); font-weight: 300; }
        .bio-text strong { color: var(--gray-800); font-weight: 500; }
        .contact-row { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
        .contact-item { display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: var(--gray-600); }
        .contact-icon { width: 28px; height: 28px; border-radius: 8px; background: var(--gray-100); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .social-row { display: flex; gap: 10px; margin-top: 16px; }
        .social-btn {
          flex: 1; padding: 10px; border-radius: 12px; border: 1.5px solid var(--gray-200);
          background: white; font-size: 0.75rem; font-weight: 500; color: var(--gray-600);
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
        }
        .social-btn:hover { border-color: var(--g-light); color: var(--g-mid); transform: translateY(-1px); }

        /* ── Roadmap ── */
        .roadmap-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 64px; }
        .roadmap-card {
          background: white; border-radius: 18px; padding: 24px 20px;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
          transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .roadmap-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--g-dark), var(--g-light));
        }
        .roadmap-card:hover { transform: translateY(-6px); box-shadow: var(--card-hover); }
        .roadmap-icon { font-size: 1.8rem; margin-bottom: 10px; }
        .roadmap-level { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--g-light); font-weight: 600; margin-bottom: 4px; }
        .roadmap-label { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 500; color: var(--gray-800); margin-bottom: 14px; }
        .roadmap-items { display: flex; flex-direction: column; gap: 7px; }
        .roadmap-item { display: flex; align-items: center; gap: 6px; font-size: 0.76rem; color: var(--gray-600); }
        .roadmap-item::before { content: '→'; color: var(--g-light); font-size: 0.7rem; }

        /* ── Timeline ── */
        .timeline { position: relative; padding-left: 32px; margin-bottom: 64px; }
        .timeline::before {
          content: ''; position: absolute; left: 8px; top: 8px; bottom: 8px;
          width: 1.5px; background: linear-gradient(to bottom, var(--g-dark), var(--g-pale), transparent);
        }
        .tl-item { position: relative; margin-bottom: 32px; }
        .tl-dot {
          position: absolute; left: -28px; top: 5px;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--g-mid); border: 2px solid white;
          box-shadow: 0 0 0 2px var(--g-light);
        }
        .tl-period { font-size: 0.7rem; color: var(--g-light); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 5px; }
        .tl-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 500; color: var(--gray-800); margin-bottom: 2px; }
        .tl-org { font-size: 0.8rem; color: var(--gray-400); margin-bottom: 8px; font-weight: 500; }
        .tl-desc { font-size: 0.82rem; color: var(--gray-600); line-height: 1.65; margin-bottom: 10px; font-weight: 300; }
        .tl-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag {
          padding: 3px 10px; border-radius: 50px;
          background: #f0f7f3; border: 1px solid #c8e6d4;
          font-size: 0.7rem; color: var(--g-mid); font-weight: 500;
        }

        /* ── Skills ── */
        .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 64px; }
        .skills-card { background: white; border-radius: 20px; padding: 32px; box-shadow: var(--card-shadow); border: 1px solid var(--gray-200); }

        /* ── Certifications ── */
        .cert-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; margin-bottom: 64px; }
        .cert-card {
          background: white; border-radius: 16px; padding: 20px 22px;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
          display: flex; align-items: center; gap: 16px; transition: all 0.25s;
        }
        .cert-card:hover { transform: translateX(4px); box-shadow: var(--card-hover); }
        .cert-badge { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        .cert-name { font-size: 0.85rem; font-weight: 500; color: var(--gray-800); margin-bottom: 3px; }
        .cert-meta { font-size: 0.72rem; color: var(--gray-400); }

        /* ── Projects ── */
        .projects-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 64px; }
        .project-card {
          background: white; border-radius: 20px; padding: 26px 22px;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
          transition: all 0.3s; display: flex; flex-direction: column;
        }
        .project-card:hover { transform: translateY(-6px); box-shadow: var(--card-hover); }
        .project-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .project-name { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 500; color: var(--gray-800); }
        .project-stars { font-size: 0.72rem; color: var(--gray-400); display: flex; align-items: center; gap: 3px; }
        .project-desc { font-size: 0.8rem; line-height: 1.6; color: var(--gray-600); flex: 1; margin-bottom: 14px; font-weight: 300; }
        .project-tech { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
        .project-link {
          display: inline-flex; align-items: center; gap: 5px; font-size: 0.75rem;
          color: var(--g-mid); font-weight: 500; text-decoration: none; cursor: pointer;
          transition: gap 0.2s;
        }
        .project-link:hover { gap: 8px; }

        /* ── Resume CTA ── */
        .resume-cta {
          background: linear-gradient(135deg, var(--g-dark) 0%, var(--g-mid) 100%);
          border-radius: 24px; padding: 48px 44px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; color: white; margin-bottom: 64px;
          position: relative; overflow: hidden;
        }
        .resume-cta::before {
          content: ''; position: absolute; right: -60px; top: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .resume-cta-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 500; margin-bottom: 6px; }
        .resume-cta-sub { font-size: 0.82rem; opacity: 0.65; font-weight: 300; }
        .resume-btn {
          padding: 13px 28px; border-radius: 50px;
          background: white; color: var(--g-dark); border: none;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
          cursor: pointer; transition: all 0.25s; white-space: nowrap; letter-spacing: 0.03em;
          flex-shrink: 0;
        }
        .resume-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.3); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .roadmap-grid { grid-template-columns: repeat(2,1fr); }
          .projects-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 680px) {
          .hero-content { flex-direction: column; align-items: flex-start; padding: 0 24px 48px; }
          .about-grid { grid-template-columns: 1fr; }
          .skills-grid { grid-template-columns: 1fr; }
          .cert-grid { grid-template-columns: 1fr; }
          .roadmap-grid { grid-template-columns: 1fr; }
          .projects-grid { grid-template-columns: 1fr; }
          .profile-body { padding: 40px 20px 80px; }
          .resume-cta { flex-direction: column; text-align: center; }
          .stats-row { gap: 12px; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav className="prof-nav">
        <a className="nav-logo" href="#">
          <span className="nav-logo-dot" />
          CareerForest
        </a>
        <div className="nav-actions">
          <button className="nav-btn nav-btn-outline" onClick={() => setEditMode(v => !v)}>
            {editMode ? "✓ Save Profile" : "✏ Edit Profile"}
          </button>
          <button className="nav-btn nav-btn-solid">Explore Paths</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" style={{ transform: `translateY(${parallaxBg}px)` }}>
          <div className="hero-bg-leaves">
            {[1,2,3].map(i => (
              <svg key={i} viewBox="0 0 80 120" className="hero-leaf-big">
                <path d="M40 5 C10 20,-5 60,10 90 C20 110,40 118,40 118 C40 118,60 110,70 90 C85 60,70 20,40 5Z" fill="currentColor" />
              </svg>
            ))}
          </div>
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-avatar-wrap" style={{ transform: `translateY(${parallaxAvatar}px)` }}>
            <div className="hero-avatar">A</div>
            <div className="hero-badge">⭐ Pro</div>
          </div>
          <div className="hero-text">
            <div className="hero-greeting">Software Engineer & Mentor</div>
            <div className="hero-name">Arjun Sharma</div>
            <div className="hero-role">Senior Frontend Engineer · IIT Delhi · Open to Opportunities</div>
            <div className="hero-tags">
              {["DSA Expert","React","Machine Learning","System Design","Open Source"].map(t => (
                <span key={t} className="hero-tag">{t}</span>
              ))}
            </div>
            <div className="hero-actions">
              <button className="hero-btn hero-btn-primary">Download Resume</button>
              <button className="hero-btn hero-btn-outline">Connect →</button>
            </div>
          </div>
        </div>
        <div className="scroll-cue">
          <span>Scroll</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 1v14M1 9l6 8 6-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="profile-body">

        {/* Stats */}
        <Section direction="up" delay={0}>
          <div className="stats-row">
            <StatCard num="4+" label="Years Experience" icon="💼" />
            <StatCard num="18" label="Projects Shipped" icon="🚀" />
            <StatCard num="5200" label="GitHub Stars" icon="⭐" />
            <StatCard num="900" label="LeetCode Solved" icon="🧩" />
            <StatCard num="12" label="Mentees" icon="🌱" />
          </div>
        </Section>

        {/* About */}
        <Section direction="up" delay={0}>
          <div className="section-head">
            <div className="section-label">About</div>
            <div className="section-title">Who I Am</div>
          </div>
          <div className="about-grid">
            <div className="about-card about-card-bio">
              <p className="bio-text">
                I'm a <strong>Senior Frontend Engineer</strong> passionate about turning complex problems into elegant, performant products. My journey started with competitive programming at IIT Delhi, where I fell in love with algorithms and system thinking.
                <br /><br />
                Today I build at the intersection of <strong>engineering craftsmanship and user experience</strong> — shipping products used by tens of thousands of people. Outside work, I mentor aspiring developers and contribute to open-source tools that simplify learning paths in tech.
                <br /><br />
                I believe the best career isn't the fastest one — it's the most <strong>intentional</strong> one.
              </p>
            </div>
            <div className="about-card">
              <div className="section-label" style={{ marginBottom: 14 }}>Contact</div>
              <div className="contact-row">
                {[
                  { icon: "📧", text: "arjun@careerforest.dev" },
                  { icon: "📍", text: "Bengaluru, India" },
                  { icon: "🌐", text: "careerforest.dev/arjun" },
                  { icon: "📅", text: "Available for freelance" },
                ].map(c => (
                  <div key={c.text} className="contact-item">
                    <div className="contact-icon">{c.icon}</div>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-card">
              <div className="section-label" style={{ marginBottom: 14 }}>Socials</div>
              <div className="social-row">
                {[["🐙","GitHub"],["💼","LinkedIn"],["🐦","Twitter"],["📝","Blog"]].map(([icon, name]) => (
                  <button key={name} className="social-btn">{icon} {name}</button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Career Roadmap */}
        <Section direction="up" delay={0}>
          <div className="section-head">
            <div className="section-label">Career Paths</div>
            <div className="section-title">Learning Roadmap</div>
          </div>
          <div className="roadmap-grid">
            {roadmapItems.map((r, i) => (
              <Section key={r.level} direction="up" delay={i * 80}>
                <div className="roadmap-card">
                  <div className="roadmap-icon">{r.icon}</div>
                  <div className="roadmap-level">{r.level}</div>
                  <div className="roadmap-label">{r.label}</div>
                  <div className="roadmap-items">
                    {r.items.map(it => <div key={it} className="roadmap-item">{it}</div>)}
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section direction="left" delay={0}>
          <div className="section-head">
            <div className="section-label">Career</div>
            <div className="section-title">Experience</div>
          </div>
          <div className="timeline">
            {experience.map((e, i) => (
              <TimelineItem key={e.title} {...e} index={i} />
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section direction="left" delay={0}>
          <div className="section-head">
            <div className="section-label">Academic</div>
            <div className="section-title">Education</div>
          </div>
          <div className="timeline">
            {education.map((e, i) => (
              <TimelineItem key={e.title} {...e} index={i} />
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section direction="up" delay={0}>
          <div className="section-head">
            <div className="section-label">Expertise</div>
            <div className="section-title">Skills</div>
          </div>
          <div className="skills-grid">
            <div className="skills-card">
              <div className="section-label" style={{ marginBottom: 20 }}>Technical Skills</div>
              {skills.map(s => <SkillBar key={s.label} {...s} />)}
            </div>
            <div className="skills-card">
              <div className="section-label" style={{ marginBottom: 20 }}>Soft Skills</div>
              {[
                { label: "Technical Leadership", pct: 85 },
                { label: "Mentoring & Teaching", pct: 90 },
                { label: "Communication", pct: 88 },
                { label: "Problem Solving", pct: 95 },
                { label: "Agile / Scrum", pct: 80 },
              ].map(s => <SkillBar key={s.label} {...s} />)}
              <div style={{ marginTop: 24 }}>
                <div className="section-label" style={{ marginBottom: 12 }}>Languages</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Hindi (Native)","English (C2)","Kannada (B1)"].map(l => (
                    <span key={l} className="tag" style={{ fontSize: "0.78rem", padding: "5px 14px" }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Certifications */}
        <Section direction="up" delay={0}>
          <div className="section-head">
            <div className="section-label">Credentials</div>
            <div className="section-title">Certifications</div>
          </div>
          <div className="cert-grid">
            {certifications.map((c, i) => (
              <Section key={c.name} direction="up" delay={i * 80}>
                <div className="cert-card">
                  <div className="cert-badge" style={{ background: c.color + "18" }}>
                    <span style={{ fontSize: "1.1rem" }}>🏅</span>
                  </div>
                  <div>
                    <div className="cert-name">{c.name}</div>
                    <div className="cert-meta">{c.issuer} · {c.year}</div>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section direction="up" delay={0}>
          <div className="section-head">
            <div className="section-label">Portfolio</div>
            <div className="section-title">Featured Projects</div>
          </div>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <Section key={p.name} direction="up" delay={i * 100}>
                <div className="project-card">
                  <div className="project-header">
                    <div className="project-name">{p.name}</div>
                    <div className="project-stars">⭐ {p.stars}</div>
                  </div>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tech">
                    {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <a className="project-link" href={p.link}>View project →</a>
                </div>
              </Section>
            ))}
          </div>
        </Section>

        {/* Resume CTA */}
        <Section direction="up" delay={0}>
          <div className="resume-cta">
            <div>
              <div className="resume-cta-title">Ready to collaborate?</div>
              <div className="resume-cta-sub">Download my full resume or reach out directly — let's build something great.</div>
            </div>
            <button className="resume-btn">📄 Download Resume</button>
          </div>
        </Section>

      </div>
    </>
  );
}
