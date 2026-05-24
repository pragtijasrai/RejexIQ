import { useState, useEffect, useRef } from "react";

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
function SkillBar({ label, pct, color, editMode, onChangePct, onDelete }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ marginBottom: 14, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "center" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--gray-800)" }}>
          {label}
          {editMode && onDelete && (
            <button
              onClick={onDelete}
              style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", marginLeft: 8, fontSize: "0.75rem" }}
              title="Delete skill"
            >
              ❌
            </button>
          )}
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--gray-600)" }}>{pct}%</span>
      </div>
      {editMode ? (
        <input
          type="range"
          min="0"
          max="100"
          value={pct}
          onChange={e => onChangePct(parseInt(e.target.value))}
          style={{ width: "100%", accentColor: "var(--g-light)", cursor: "pointer" }}
        />
      ) : (
        <div style={{ height: 6, borderRadius: 3, background: "var(--gray-200)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3,
            background: color || "linear-gradient(90deg, var(--g-mid), var(--g-light))",
            width: inView ? `${pct}%` : "0%",
            transition: "width 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }} />
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ num, label, icon, editMode, onNumChange, onLabelChange }) {
  const [ref, inView] = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || editMode) return;
    let start = 0;
    const end = parseInt(String(num).replace(/\D/g, "")) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const dur = 1500; const step = Math.ceil(end / (dur / 16));
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(start);
    }, 16);
    return () => clearInterval(t);
  }, [inView, num, editMode]);

  return (
    <div ref={ref} className="stat-card">
      <div className="stat-icon">{icon}</div>
      {editMode ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
          <input
            type="text"
            value={num || ""}
            onChange={e => onNumChange(e.target.value)}
            placeholder="e.g. 4+"
            style={{ width: "100%", textAlign: "center", border: "1px solid var(--gray-200)", borderRadius: 8, padding: "4px", fontSize: "1.2rem", fontWeight: 700, outline: "none", background: "var(--gray-100)", color: "var(--gray-800)" }}
          />
          <input
            type="text"
            value={label || ""}
            onChange={e => onLabelChange(e.target.value)}
            placeholder="Label"
            style={{ width: "100%", textAlign: "center", border: "1px solid var(--gray-200)", borderRadius: 6, padding: "2px", fontSize: "0.7rem", color: "var(--gray-600)", outline: "none", background: "var(--gray-100)" }}
          />
        </div>
      ) : (
        <>
          <div className="stat-num">{editMode ? num : `${count}${String(num).replace(/\d/g, "")}`}</div>
          <div className="stat-label">{label}</div>
        </>
      )}
    </div>
  );
}

// ─── Timeline Item ───────────────────────────────────────────────────────────
function TimelineItem({ title, org, period, desc, tags, index, editMode, onUpdate, onDelete }) {
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
      <div className="tl-content" style={{ position: "relative" }}>
        {editMode && onDelete && (
          <button
            onClick={onDelete}
            style={{ position: "absolute", top: 0, right: 0, background: "rgba(248,113,113,0.1)", border: "none", color: "#f87171", cursor: "pointer", padding: "4px 8px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 600 }}
          >
            ❌ Delete
          </button>
        )}

        {editMode ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.68rem", color: "var(--gray-400)", textTransform: "uppercase" }}>Job Title / Degree</label>
                <input type="text" value={title || ""} onChange={e => onUpdate({ title: e.target.value })} style={{ width: "100%", padding: 8, border: "1px solid var(--gray-200)", borderRadius: 6, background: "var(--gray-100)", color: "var(--gray-800)", fontSize: "0.82rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.68rem", color: "var(--gray-400)", textTransform: "uppercase" }}>Organization / College</label>
                <input type="text" value={org || ""} onChange={e => onUpdate({ org: e.target.value })} style={{ width: "100%", padding: 8, border: "1px solid var(--gray-200)", borderRadius: 6, background: "var(--gray-100)", color: "var(--gray-800)", fontSize: "0.82rem" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.68rem", color: "var(--gray-400)", textTransform: "uppercase" }}>Period</label>
                <input type="text" value={period || ""} onChange={e => onUpdate({ period: e.target.value })} placeholder="e.g. 2023 - Present" style={{ width: "100%", padding: 8, border: "1px solid var(--gray-200)", borderRadius: 6, background: "var(--gray-100)", color: "var(--gray-800)", fontSize: "0.82rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.68rem", color: "var(--gray-400)", textTransform: "uppercase" }}>Tags (comma-separated)</label>
                <input type="text" value={Array.isArray(tags) ? tags.join(", ") : (typeof tags === "string" ? tags : "")} onChange={e => onUpdate({ tags: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })} style={{ width: "100%", padding: 8, border: "1px solid var(--gray-200)", borderRadius: 6, background: "var(--gray-100)", color: "var(--gray-800)", fontSize: "0.82rem" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.68rem", color: "var(--gray-400)", textTransform: "uppercase" }}>Description</label>
              <textarea value={desc || ""} onChange={e => onUpdate({ desc: e.target.value })} rows={2} style={{ width: "100%", padding: 8, border: "1px solid var(--gray-200)", borderRadius: 6, background: "var(--gray-100)", color: "var(--gray-800)", fontSize: "0.82rem", resize: "vertical" }} />
            </div>
          </div>
        ) : (
          <>
            <div className="tl-period">{period}</div>
            <div className="tl-title">{title}</div>
            <div className="tl-org">{org}</div>
            {desc && <p className="tl-desc">{desc}</p>}
            {Array.isArray(tags) && tags.length > 0 && (
              <div className="tl-tags">
                {tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const FAMOUS_SCHOOLS = [
  "Chitkara University", "IIT Delhi", "IIT Bombay", "IIT Madras", "IIT Kharagpur",
  "BITS Pilani", "Delhi University", "Stanford University", "MIT",
  "Harvard University", "UC Berkeley", "Carnegie Mellon", "Oxford University",
  "Cambridge University", "VIT", "Amity University", "Manipal Academy"
];

const FAMOUS_BRANCHS = [
  "Computer Science & Engineering", "Information Technology", "AI & Machine Learning",
  "Data Science", "Software Engineering", "Electronics & Communication Engineering",
  "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
  "Cybersecurity", "Cloud Computing", "Business Administration"
];

const POPULAR_SKILLS = [
  "React", "Python", "Data Structures & Algorithms", "System Design",
  "Node.js / Express", "Machine Learning", "MongoDB / SQL", "Technical Writing",
  "Java", "TypeScript", "HTML5 & CSS3", "AWS / Cloud Computing",
  "UI/UX Design", "Git & GitHub", "Docker & Kubernetes", "Agile Methodologies"
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ProfilePage({ user, onUpdateUser, onNav } = {}) {
  const [scrollY, setScrollY] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const SectionMenu = ({ sectionId }) => {
    const isOpen = activeMenu === sectionId;
    return (
      <div style={{ position: "relative" }}>
        <button className="icon-btn" style={{ padding: "6px", background: "var(--white)", border: "1px solid var(--gray-200)", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--gray-100)'}
          onMouseOut={e => { if (!isOpen) e.currentTarget.style.background = 'var(--white)'; }}
          onClick={() => setActiveMenu(isOpen ? null : sectionId)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        </button>
        {isOpen && (
          <div style={{ position: "absolute", top: "35px", right: 0, width: "150px", background: "var(--white)", borderRadius: "12px", padding: "8px", boxShadow: "var(--card-hover)", border: "1px solid var(--gray-200)", zIndex: 100, display: "flex", flexDirection: "column", gap: "4px" }}>
            {editingSection === sectionId ? (
              <button className="dropdown-item" onClick={() => { setActiveMenu(null); setEditingSection(null); handleSave(); }}>✓ Save Section</button>
            ) : (
              <button className="dropdown-item" onClick={() => { setActiveMenu(null); setEditingSection(sectionId); }}>✏️ Edit Section</button>
            )}
          </div>
        )}
      </div>
    );
  };
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");
  const heroRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);

  // Core Identity States
  const [tempName, setTempName] = useState(user?.name || "Arjun Sharma");
  const [tempTrack, setTempTrack] = useState(user?.track || "Senior Frontend Engineer");
  const [tempBio, setTempBio] = useState(user?.bio || "Passionate about building performant, elegant digital products. My journey started with competitive programming, where I fell in love with algorithms and system thinking. Today I build at the intersection of engineering craftsmanship and user experience.");
  const [tempUsername, setTempUsername] = useState(user?.username || "arjun_codes");
  const [tempSchool, setTempSchool] = useState(user?.school || "IIT Delhi");
  const [tempBranch, setTempBranch] = useState(user?.branch || "Computer Science");
  const [tempPrivacy, setTempPrivacy] = useState(user?.privacy || "public");

  // Stats
  const [tempStats, setTempStats] = useState(user?.stats || [
    { num: "4+", label: "Years Experience", icon: "💼" },
    { num: "18", label: "Projects Shipped", icon: "🚀" },
    { num: "5200", label: "GitHub Stars", icon: "⭐" },
    { num: "900", label: "LeetCode Solved", icon: "🧩" },
    { num: "12", label: "Mentees", icon: "🌱" }
  ]);

  // Contact Info
  const [tempContact, setTempContact] = useState(user?.contactInfo || {
    email: user?.email || "arjun@rejexiq.dev",
    location: "Bengaluru, India",
    website: "rejexiq.com/arjun",
    availability: "Available for freelance"
  });

  // Social Links
  const [tempSocials, setTempSocials] = useState(user?.socialLinks || {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    blog: "https://medium.com"
  });

  // Timelines (Experience & Education)
  const [tempExperience, setTempExperience] = useState(user?.experience || [
    { title: "Senior Frontend Engineer", org: "TechCorp Inc.", period: "2023 – Present", desc: "Led redesign of core product dashboard, improving performance by 40% and user retention by 22%.", tags: ["React", "TypeScript", "Figma", "AWS"] },
    { title: "Full Stack Developer", org: "Startup Labs", period: "2021 – 2023", desc: "Built scalable REST APIs and React applications serving 50k+ daily users.", tags: ["Node.js", "MongoDB", "React", "Docker"] },
    { title: "Software Developer Intern", org: "Infosys", period: "2020 – 2021", desc: "Contributed to enterprise banking portal, resolved 60+ bugs and shipped 3 features.", tags: ["Java", "Spring Boot", "MySQL"] }
  ]);

  const [tempEducation, setTempEducation] = useState(user?.education || [
    { title: "B.Tech Computer Science", org: "IIT Delhi", period: "2017 – 2021", desc: "CGPA 8.6 / 10. Specialised in AI & Machine Learning. Dean's Merit List 3 years.", tags: ["AI/ML", "Algorithms", "Distributed Systems"] },
    { title: "Higher Secondary (XII)", org: "Delhi Public School", period: "2016 – 2017", desc: "PCM + CS stream. 96.2% aggregate.", tags: ["Mathematics", "Physics", "Computer Science"] }
  ]);

  // Roadmap Items
  const [tempRoadmaps, setTempRoadmaps] = useState(user?.roadmaps || [
    { icon: "🌱", level: "Beginner", label: "Foundations", items: ["Python basics", "Math & Logic", "Problem Solving"] },
    { icon: "🌿", level: "Intermediate", label: "Core Skills", items: ["Data Structures", "Algorithms", "System Design basics"] },
    { icon: "🌳", level: "Advanced", label: "Specialise", items: ["Machine Learning", "System Architecture", "Open Source"] },
    { icon: "🏆", level: "Expert", label: "Mastery", items: ["Research Papers", "Leadership", "Mentoring others"] }
  ]);

  // Skills
  const [tempSkills, setTempSkills] = useState(() => {
    if (user?.skillsData && Array.isArray(user.skillsData)) {
      return user.skillsData;
    }
    if (user?.skills && Array.isArray(user.skills) && user.skills.length > 0) {
      return user.skills.map((s, idx) => ({
        label: s,
        pct: 80 - (idx * 5) > 50 ? 80 - (idx * 5) : 60,
        color: idx % 2 === 0 ? "linear-gradient(90deg, var(--g-mid), var(--g-light))" : "linear-gradient(90deg, var(--g-dark), var(--g-mid))"
      }));
    }
    return [
      { label: "Data Structures & Algorithms", pct: 88, color: "linear-gradient(90deg, var(--g-mid), var(--g-light))" },
      { label: "React / Next.js", pct: 92, color: "linear-gradient(90deg, var(--g-dark), var(--g-mid))" },
      { label: "System Design", pct: 75, color: "linear-gradient(90deg, var(--g-mid), var(--g-dark))" },
      { label: "Machine Learning", pct: 68, color: "linear-gradient(90deg, var(--g-light), var(--g-mid))" },
      { label: "Node.js / Express", pct: 82, color: "linear-gradient(90deg, var(--g-mid), var(--g-light))" },
      { label: "MongoDB / PostgreSQL", pct: 78, color: "linear-gradient(90deg, var(--g-dark), var(--g-light))" }
    ];
  });

  const [tempSoftSkills, setTempSoftSkills] = useState(user?.softSkillsData || [
    { label: "Technical Leadership", pct: 85, color: "linear-gradient(90deg, var(--g-mid), var(--g-light))" },
    { label: "Mentoring & Teaching", pct: 90, color: "linear-gradient(90deg, var(--g-mid), var(--g-light))" },
    { label: "Communication", pct: 88, color: "linear-gradient(90deg, var(--g-mid), var(--g-light))" },
    { label: "Problem Solving", pct: 95, color: "linear-gradient(90deg, var(--g-dark), var(--g-mid))" },
    { label: "Agile / Scrum", pct: 80, color: "linear-gradient(90deg, var(--g-mid), var(--g-light))" }
  ]);

  const [tempLanguages, setTempLanguages] = useState(user?.languages || ["Hindi (Native)", "English (C2)", "Kannada (B1)"]);

  // Certifications & Projects
  const [tempCertifications, setTempCertifications] = useState(user?.certifications || [
    { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2023", color: "var(--g-light)" },
    { name: "Google Professional Data Engineer", issuer: "Google Cloud", year: "2022", color: "var(--g-mid)" },
    { name: "Meta React Developer Certificate", issuer: "Meta / Coursera", year: "2022", color: "var(--accent)" },
    { name: "Stanford ML Specialization", issuer: "Coursera / Stanford", year: "2021", color: "var(--purple)" }
  ]);

  const [tempProjects, setTempProjects] = useState(user?.projects || [
    { name: "CareerForest", desc: "A platform helping 20k+ students discover optimal learning paths toward their dream roles.", tech: ["React", "Node.js", "MongoDB", "OpenAI API"], stars: "1.2k", link: "https://github.com" },
    { name: "DSA Visualizer", desc: "Interactive visualizer for 50+ data structures and algorithms with step-by-step animations.", tech: ["React", "D3.js", "TypeScript"], stars: "3.4k", link: "https://github.com" },
    { name: "ResumeAI", desc: "AI-powered resume analyser that gives ATS score + suggestions in under 3 seconds.", tech: ["Python", "FastAPI", "Claude API", "React"], stars: "890", link: "https://github.com" }
  ]);

  // Social Features
  const [tempFollowers, setTempFollowers] = useState(user?.followers || 1240);
  const [tempFollowing, setTempFollowing] = useState(user?.following || 45);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // Custom Sections
  const [tempCustomSections, setTempCustomSections] = useState(user?.customSections || []);

  // Activity Stats
  const [activityStats, setActivityStats] = useState(user?.activityStats || {
    currentStreak: 12,
    maxStreak: 45,
    contestsParticipated: 8
  });

  const [activityGrid] = useState(() => {
    const data = [];
    const colors = ["#f8f6f0", "#93c5fd", "#3b82f6", "#1e3a8a", "#0f172a"]; // Adjusted base color to match the cream background of stats cards
    const today = new Date();
    const streak = activityStats.currentStreak || 12;

    // Exactly 365 days (1 year)
    const TOTAL_DAYS = 365;

    for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      // Force "no activity" for dates before February 2026
      const isBeforeFeb = d.getFullYear() < 2026 || (d.getFullYear() === 2026 && d.getMonth() < 1);
      const isMissed = isBeforeFeb ? true : (i < streak ? false : Math.random() < 0.75);

      let intensity = 0;
      let activeMinutes = 0;

      if (!isMissed) {
        // Random active time between 15 mins and 300 mins (5 hrs)
        activeMinutes = 15 + Math.floor(Math.random() * 285);
        if (activeMinutes < 60) intensity = 1;
        else if (activeMinutes < 120) intensity = 2;
        else if (activeMinutes < 240) intensity = 3;
        else intensity = 4;
      }

      const hours = Math.floor(activeMinutes / 60);
      const mins = activeMinutes % 60;
      let statusText = "No activity";
      if (activeMinutes > 0) {
        statusText = `Active for ${hours > 0 ? hours + 'h ' : ''}${mins}m`;
      }

      data.push({
        dateObj: d,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        intensity,
        color: colors[intensity],
        status: statusText,
        dayOfWeek: d.getDay()
      });
    }
    return data;
  });

  const monthLabels = [];
  let currentMonth = -1;
  const startDay = activityGrid[0]?.dayOfWeek || 0;

  activityGrid.forEach((day, index) => {
    const month = day.dateObj.getMonth();
    const colIndex = Math.floor((index + startDay) / 7);

    if (month !== currentMonth) {
      const lastLabel = monthLabels[monthLabels.length - 1];
      if (!lastLabel || (colIndex - lastLabel.colIndex > 2)) {
        const isFirstLabel = monthLabels.length === 0;
        const isJanuary = month === 0;
        let labelText = day.dateObj.toLocaleDateString('en-US', { month: 'short' });

        // Add the year if it's the start of the graph or the start of a new year
        if (isFirstLabel || isJanuary) {
          labelText += ` ${day.dateObj.getFullYear()}`;
        }

        monthLabels.push({
          label: labelText,
          colIndex
        });
      }
      currentMonth = month;
    }
  });


  // Onboarding
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardName, setOnboardName] = useState(user?.name || "");
  const [onboardUsername, setOnboardUsername] = useState("");
  const [onboardSchool, setOnboardSchool] = useState("");
  const [onboardBranch, setOnboardBranch] = useState("");
  const [onboardSkills, setOnboardSkills] = useState([]);

  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [branchSuggestions, setBranchSuggestions] = useState([]);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);

  // Sync state with parent user on mount or change
  useEffect(() => {
    if (user) {
      setTempName(user.name || "Arjun Sharma");
      setTempTrack(user.track || "Senior Frontend Engineer");
      setTempBio(user.bio || "Passionate about building performant, elegant digital products. My journey started with competitive programming, where I fell in love with algorithms and system thinking. Today I build at the intersection of engineering craftsmanship and user experience.");
      setTempUsername(user.username || "arjun_codes");
      setTempSchool(user.school || "IIT Delhi");
      setTempBranch(user.branch || "Computer Science");
      setTempPrivacy(user.privacy || "public");
      if (user.stats && Array.isArray(user.stats)) setTempStats(user.stats);
      if (user.contactInfo) setTempContact(user.contactInfo);
      if (user.socialLinks) setTempSocials(user.socialLinks);
      if (user.experience && Array.isArray(user.experience)) setTempExperience(user.experience);
      if (user.education && Array.isArray(user.education)) setTempEducation(user.education);
      if (user.roadmaps && Array.isArray(user.roadmaps)) setTempRoadmaps(user.roadmaps);
      if (user.skillsData && Array.isArray(user.skillsData)) {
        setTempSkills(user.skillsData);
      } else if (user.skills && Array.isArray(user.skills) && user.skills.length > 0) {
        setTempSkills(user.skills.map((s, idx) => ({
          label: s,
          pct: 80 - (idx * 5) > 50 ? 80 - (idx * 5) : 60,
          color: idx % 2 === 0 ? "linear-gradient(90deg, #2563eb, #60a5fa)" : "linear-gradient(90deg, #2563eb, #1e40af)"
        })));
      }
      if (user.softSkillsData && Array.isArray(user.softSkillsData)) setTempSoftSkills(user.softSkillsData);
      if (user.languages && Array.isArray(user.languages)) setTempLanguages(user.languages);
      if (user.certifications && Array.isArray(user.certifications)) setTempCertifications(user.certifications);
      if (user.projects && Array.isArray(user.projects)) setTempProjects(user.projects);

      if (user.name && !onboardName) {
        setOnboardName(user.name);
      }
    }
  }, [user]);

  // Dynamic username suggestions
  useEffect(() => {
    if (!onboardName) {
      setUsernameSuggestions([]);
      return;
    }
    const clean = onboardName.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
    const parts = clean.split(/\s+/);
    const first = parts[0] || "";
    const last = parts[1] || "";
    const base = parts.join("");

    const sug = [];
    if (first && last) {
      sug.push(`${first}_${last}`);
      sug.push(`${base}.dev`);
      sug.push(`${first}_codes`);
    } else if (first) {
      sug.push(`${first}_dev`);
      sug.push(`${first}.codes`);
      sug.push(`${first}_99`);
    }
    setUsernameSuggestions([...new Set(sug)]);
  }, [onboardName]);

  const handleSchoolChange = (val) => {
    setOnboardSchool(val);
    if (!val) {
      setSchoolSuggestions([]);
      return;
    }
    const filtered = FAMOUS_SCHOOLS.filter(s =>
      s.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5);
    setSchoolSuggestions(filtered);
  };

  const handleBranchChange = (val) => {
    setOnboardBranch(val);
    if (!val) {
      setBranchSuggestions([]);
      return;
    }
    const filtered = FAMOUS_BRANCHS.filter(b =>
      b.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5);
    setBranchSuggestions(filtered);
  };

  const handleSave = () => {
    if (onUpdateUser) {
      onUpdateUser({
        name: tempName,
        track: tempTrack,
        bio: tempBio,
        username: tempUsername,
        school: tempSchool,
        branch: tempBranch,
        privacy: tempPrivacy,
        stats: tempStats,
        contactInfo: tempContact,
        socialLinks: tempSocials,
        experience: tempExperience,
        education: tempEducation,
        roadmaps: tempRoadmaps,
        skillsData: tempSkills,
        softSkillsData: tempSoftSkills,
        languages: tempLanguages,
        certifications: tempCertifications,
        projects: tempProjects
      });
    }
    setEditMode(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      if (onUpdateUser) {
        onUpdateUser({ avatar: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      if (onUpdateUser) {
        onUpdateUser({ cover: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  // Dynamic GitHub Projects Fetch
  const fetchGitHubProjects = async () => {
    let targetUsername = tempUsername;
    // Extract from github social link if available
    if (tempSocials?.github && tempSocials.github.includes("github.com/")) {
      let urlStr = tempSocials.github.trim();
      if (urlStr.endsWith('/')) {
        urlStr = urlStr.slice(0, -1);
      }
      const parts = urlStr.split("/");
      targetUsername = parts[parts.length - 1] || tempUsername;
    }

    if (!targetUsername) {
      setGithubError("Please add a valid GitHub link.");
      return;
    }
    setGithubLoading(true);
    setGithubError("");
    try {
      const res = await fetch(`https://api.github.com/users/${targetUsername}/repos?sort=updated&per_page=6`);
      if (!res.ok) {
        throw new Error("GitHub user not found or API limit reached.");
      }
      const data = await res.json();
      if (!data || data.length === 0) {
        throw new Error("No public repositories found.");
      }
      const mapped = data.map(repo => {
        // stars count abbreviation
        let stars = String(repo.stargazers_count);
        if (repo.stargazers_count >= 1000) {
          stars = (repo.stargazers_count / 1000).toFixed(1) + "k";
        }
        return {
          name: repo.name,
          desc: repo.description || "No description provided.",
          tech: repo.language ? [repo.language] : ["JavaScript", "HTML"],
          stars: stars,
          link: repo.html_url
        };
      });
      setTempProjects(mapped);
      setGithubLoading(false);
    } catch (err) {
      console.warn("GitHub API error:", err);
      setGithubError(err.message || "Failed to fetch from GitHub.");
      setGithubLoading(false);
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile URL copied to clipboard!");
  };

  const addCustomSection = () => {
    setTempCustomSections([...tempCustomSections, { title: "New Section", content: "Section content goes here..." }]);
  };


  // Robust Scroll Listener on main container
  useEffect(() => {
    const scrollContainer = document.querySelector(".main-content-area") || window;
    const onScroll = () => {
      setScrollY(scrollContainer.scrollTop !== undefined ? scrollContainer.scrollTop : window.scrollY);
    };
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial trigger
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, []);

  const parallaxBg = -scrollY * 0.25;

  // Sync custom school schooling to education head
  const dynamicEducation = tempSchool
    ? [
      {
        title: tempBranch || "Specialization",
        org: tempSchool,
        period: "Present",
        desc: "Currently pursuing custom learning track and DSA roadmaps on RejexIQ.",
        tags: user?.skills || ["Algorithms", "Web Development"]
      },
      ...tempEducation
    ]
    : tempEducation;

  let isNew = false;
  if (user?.isNewUser !== undefined) {
    isNew = user.isNewUser && !user.onboarded;
  } else {
    const hasData = user?.school || (user?.skills && Object.keys(user.skills).length > 0) || user?.assessmentDone;
    isNew = !user?.onboarded && !hasData;
  }
  const showOnboarding = isNew && user?.email !== "demo@rejexiq.com";

  // Helper function to return background cover styling
  function tempCoverBackground() {
    if (user?.cover) {
      if (user.cover.startsWith("linear-gradient")) {
        return user.cover;
      }
      return `url(${user.cover}) center/cover no-repeat`;
    }
    return `linear-gradient(135deg, #070a1e 0%, #141b3d 75%, #1f2a55 100%)`;
  }

  // ─── CRUD Helper Functions ─────────────────────────────────────────────────

  // Stats
  const updateStatItem = (index, key, val) => {
    if (!tempStats || !tempStats[index]) return;
    const updated = [...tempStats];
    updated[index] = { ...updated[index], [key]: val };
    setTempStats(updated);
  };

  // Roadmaps
  const updateRoadmapItem = (index, key, val) => {
    if (!tempRoadmaps || !tempRoadmaps[index]) return;
    const updated = [...tempRoadmaps];
    updated[index] = { ...updated[index], [key]: val };
    setTempRoadmaps(updated);
  };

  // Experience
  const addExperience = () => {
    setTempExperience([
      ...(tempExperience || []),
      { title: "New Position", org: "Company / Project", period: "2026", desc: "Short description of accomplishments.", tags: ["React", "CSS"] }
    ]);
  };
  const deleteExperienceItem = (index) => {
    if (!tempExperience) return;
    setTempExperience(tempExperience.filter((_, idx) => idx !== index));
  };
  const updateExperienceItem = (index, updates) => {
    if (!tempExperience || !tempExperience[index]) return;
    const updated = [...tempExperience];
    updated[index] = { ...updated[index], ...updates };
    setTempExperience(updated);
  };

  // Education
  const addEducation = () => {
    setTempEducation([
      ...(tempEducation || []),
      { title: "Degree / Course", org: "School / Institution", period: "2026", desc: "Details or grade information.", tags: ["Learning"] }
    ]);
  };
  const deleteEducationItem = (index) => {
    if (!tempEducation) return;
    setTempEducation(tempEducation.filter((_, idx) => idx !== index));
  };
  const updateEducationItem = (index, updates) => {
    if (!tempEducation || !tempEducation[index]) return;
    const updated = [...tempEducation];
    updated[index] = { ...updated[index], ...updates };
    setTempEducation(updated);
  };

  // Technical Skills
  const addTechSkill = () => {
    setTempSkills([
      ...(tempSkills || []),
      { label: "New Tech Skill", pct: 75, color: "linear-gradient(90deg, #2563eb, #60a5fa)" }
    ]);
  };
  const deleteTechSkillItem = (index) => {
    if (!tempSkills) return;
    setTempSkills(tempSkills.filter((_, idx) => idx !== index));
  };
  const updateTechSkillItem = (index, key, val) => {
    if (!tempSkills || !tempSkills[index]) return;
    const updated = [...tempSkills];
    updated[index] = { ...updated[index], [key]: val };
    setTempSkills(updated);
  };

  // Soft Skills
  const addSoftSkill = () => {
    setTempSoftSkills([
      ...(tempSoftSkills || []),
      { label: "New Soft Skill", pct: 85, color: "linear-gradient(90deg, var(--g-mid), var(--g-light))" }
    ]);
  };
  const deleteSoftSkillItem = (index) => {
    if (!tempSoftSkills) return;
    setTempSoftSkills(tempSoftSkills.filter((_, idx) => idx !== index));
  };
  const updateSoftSkillItem = (index, key, val) => {
    if (!tempSoftSkills || !tempSoftSkills[index]) return;
    const updated = [...tempSoftSkills];
    updated[index] = { ...updated[index], [key]: val };
    setTempSoftSkills(updated);
  };

  // Languages
  const addLanguage = () => {
    setTempLanguages([...(tempLanguages || []), "New Language (Native)"]);
  };
  const deleteLanguageItem = (index) => {
    if (!tempLanguages) return;
    setTempLanguages(tempLanguages.filter((_, idx) => idx !== index));
  };
  const updateLanguageItem = (index, val) => {
    if (!tempLanguages || index >= tempLanguages.length) return;
    const updated = [...tempLanguages];
    updated[index] = val;
    setTempLanguages(updated);
  };

  // Certifications
  const addCertification = () => {
    setTempCertifications([
      ...(tempCertifications || []),
      { name: "New Certification", issuer: "Credential Issuer", year: "2026", color: "#3b82f6" }
    ]);
  };
  const deleteCertificationItem = (index) => {
    if (!tempCertifications) return;
    setTempCertifications(tempCertifications.filter((_, idx) => idx !== index));
  };
  const updateCertificationItem = (index, key, val) => {
    if (!tempCertifications || !tempCertifications[index]) return;
    const updated = [...tempCertifications];
    updated[index] = { ...updated[index], [key]: val };
    setTempCertifications(updated);
  };

  // Projects
  const addProject = () => {
    setTempProjects([
      ...(tempProjects || []),
      { name: "New Project", desc: "A brief, compelling description of your custom build.", tech: ["React", "HTML"], stars: "1", link: "https://github.com" }
    ]);
  };
  const deleteProjectItem = (index) => {
    if (!tempProjects) return;
    setTempProjects(tempProjects.filter((_, idx) => idx !== index));
  };
  const updateProjectItem = (index, key, val) => {
    if (!tempProjects || !tempProjects[index]) return;
    const updated = [...tempProjects];
    updated[index] = { ...updated[index], [key]: val };
    setTempProjects(updated);
  };

  const getThemeColors = () => {
    const cover = user?.cover || "";
    if (cover.includes("0a1e16")) return { dark: "#0a1e16", mid: "#113827", light: "#10b981", pale: "#6ee7b7", accent: "#34d399", purple: "#059669" };
    if (cover.includes("2d0e1b")) return { dark: "#2d0e1b", mid: "#5c1e36", light: "#f43f5e", pale: "#fda4af", accent: "#fb7185", purple: "#e11d48" };
    if (cover.includes("130a26")) return { dark: "#130a26", mid: "#291552", light: "#a855f7", pale: "#d8b4fe", accent: "#c084fc", purple: "#9333ea" };
    if (cover.includes("161824")) return { dark: "#161824", mid: "#282b3d", light: "#64748b", pale: "#cbd5e1", accent: "#94a3b8", purple: "#475569" };
    return { dark: "#070a1e", mid: "#0e1638", light: "#3b82f6", pale: "#93c5fd", accent: "#ff6b9d", purple: "#c084fc" };
  };

  const theme = getThemeColors();

  return (
    <div style={{ background: "#fdfdfb", minHeight: "100vh", color: "#2c2a27", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        :root {
          --g-dark: ${theme.dark}; --g-mid: ${theme.mid}; --g-light: ${theme.light}; --g-pale: ${theme.pale};
          --cream: #fdfdfb; --white: #ffffff;
          --gray-800: #2c2a27; --gray-400: #9a9590; --gray-600: #6b6560;
          --gray-200: #e8e4de; --gray-100: #f4f1ec;
          --card-shadow: 0 4px 20px rgba(7,10,30,0.06), 0 1px 6px rgba(7,10,30,0.04);
          --card-hover: 0 12px 36px rgba(7,10,30,0.12), 0 2px 10px rgba(7,10,30,0.08);
          --accent: ${theme.accent}; --purple: ${theme.purple}; --cyan: #22d3ee;
        }
        
        /* ─── Sticky Nav ─── */
        .prof-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 14px 32px; display: flex; align-items: center; justify-content: space-between;
          backdrop-filter: blur(16px);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-logo {
          font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 600;
          text-decoration: none;
          display: flex; align-items: center; gap: 8px;
          transition: color 0.3s;
        }
        .nav-logo-dot { width: 8px; height: 8px; border-radius: 50%; transition: background 0.3s; }
        .nav-actions { display: flex; gap: 10px; align-items: center; }
        .nav-btn {
          padding: 7px 18px; border-radius: 50px;
          font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }

        /* ─── Compact Hero Banner ─── */
        .hero-cover {
          position: relative; height: 220px;
          overflow: hidden; width: 100%;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          transition: background 0.3s;
        }
        .hero-bg-leaves {
          position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1;
        }
        .hero-leaf-big {
          position: absolute; color: rgba(255, 255, 255, 0.05);
          animation: heroLeaf 20s ease-in-out infinite;
        }
        .hero-leaf-big:nth-child(1) { width: 280px; right: -40px; top: -20px; animation-delay: 0s; }
        .hero-leaf-big:nth-child(2) { width: 180px; left: -30px; bottom: 10%; animation-delay: -8s; transform: rotate(160deg); }
        .hero-leaf-big:nth-child(3) { width: 120px; left: 35%; top: 15%; animation-delay: -4s; transform: rotate(45deg); opacity: 0.03; }
        @keyframes heroLeaf {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
        }
        .hero-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; pointer-events: none; }
        .hero-orb-1 { width: 300px; height: 300px; background: var(--accent); top: 10%; right: 10%; }
        .hero-orb-2 { width: 250px; height: 250px; background: var(--purple); bottom: 15%; left: 10%; }
        
        .hero-overlay {
          position: absolute; inset: 0; z-index: 1;
        }
        
        .hero-avatar-wrap {
          flex-shrink: 0; position: relative; cursor: pointer; transition: all 0.3s;
        }
        .hero-avatar {
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          color: white; overflow: hidden;
          position: relative; transition: all 0.25s;
        }
        .hero-avatar-hover-overlay {
          position: absolute; inset: 0; background: rgba(7, 10, 30, 0.8);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s; font-size: 0.8rem; font-weight: 600; color: white; gap: 4px;
        }
        .hero-avatar-wrap:hover .hero-avatar-hover-overlay { opacity: 1; }
        .hero-badge {
          position: absolute;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white; border-radius: 20px; padding: 3px 10px;
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.05em;
          box-shadow: 0 4px 12px rgba(249,115,22,0.35);
        }
        .hero-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .hero-tag {
          padding: 4px 12px; border-radius: 50px;
          font-size: 0.72rem; transition: all 0.2s;
        }
        .hero-btn {
          padding: 5px 12px; border-radius: 50px;
          font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 600;
          cursor: pointer; transition: all 0.25s; letter-spacing: 0.02em;
        }

        /* ─── Premium Unified Profile Header Card ─── */
        .profile-header-card {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 5;
          background: transparent;
          
          display: flex;
          align-items: flex-start;
          gap: 32px;
          padding: 0 32px;
        }

        .profile-header-avatar-container {
          position: relative;
          margin-top: -85px;
          z-index: 10;
        }

        .profile-header-avatar-inner {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: #e2e8f0;
          border: 6px solid var(--white);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          color: white;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .profile-header-avatar-inner:hover {
          transform: scale(1.03);
        }

        .profile-header-avatar-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-header-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          color: var(--gray-800);
          padding-top: 24px;
        }

        .profile-header-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 8px;
          margin-bottom: 12px;
          color: var(--gray-600);
          font-size: 0.85rem;
          font-weight: 400;
        }

        .profile-header-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .profile-header-meta-icon {
          font-size: 1rem;
          color: var(--g-light);
        }

        .profile-header-bio-tagline {
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--gray-600);
          margin-bottom: 16px;
          font-weight: 300;
          max-width: 750px;
        }

        /* ─── Main Body ─── */
        .profile-body { max-width: 1100px; margin: 0 auto; padding: 48px 32px 100px; }

        /* ─── Section Head ─── */
        .section-head { margin-bottom: 36px; }
        .section-label { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--g-light); font-weight: 600; margin-bottom: 6px; }
        .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: var(--gray-800); letter-spacing: -0.02em; }

        /* ─── Stats Row ─── */
        .stats-row { display: flex; gap: 20px; margin-bottom: 56px; flex-wrap: wrap; }
        .stat-card {
          flex: 1; min-width: 140px; background: var(--white); border-radius: 20px;
          padding: 24px 20px; text-align: center;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
          transition: all 0.3s ease;
        }
        .stat-card:hover { transform: translateY(-4px); border-color: var(--g-light); box-shadow: var(--card-hover); }
        .stat-icon { font-size: 1.5rem; margin-bottom: 8px; }
        .stat-num { font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; color: var(--g-light); line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 0.72rem; color: var(--gray-400); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }

        /* ─── About Grid ─── */
        .about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 56px; }
        .about-card {
          background: var(--white); border-radius: 20px; padding: 32px;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
          transition: all 0.3s;
        }
        .about-card:hover { transform: translateY(-4px); border-color: var(--g-light); box-shadow: var(--card-hover); }
        .about-card-bio { grid-column: 1 / -1; }
        .bio-text { font-size: 0.95rem; line-height: 1.8; color: var(--gray-600); font-weight: 300; }
        .bio-text strong { color: var(--gray-800); font-weight: 600; }
        .contact-row { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
        .contact-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--gray-600); }
        .contact-icon { width: 28px; height: 28px; border-radius: 8px; background: var(--gray-100); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; color: var(--g-light); }
        .social-btn {
          flex: 1; padding: 10px; border-radius: 12px; border: 1.5px solid var(--gray-200);
          background: var(--white); font-size: 0.75rem; font-weight: 500; color: var(--gray-600);
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;
          font-family: 'Inter', sans-serif; text-decoration: none;
        }
        .social-btn:hover { border-color: var(--g-light); color: var(--g-light); transform: translateY(-1px); }

        /* ─── Roadmap ─── */
        .roadmap-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 56px; }
        .roadmap-card {
          background: var(--white); border-radius: 18px; padding: 24px 20px;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
          transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .roadmap-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--g-mid), var(--g-light));
        }
        .roadmap-card:hover { transform: translateY(-6px); border-color: var(--g-light); box-shadow: var(--card-hover); }
        .roadmap-icon { font-size: 1.8rem; margin-bottom: 10px; }
        .roadmap-level { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--g-light); font-weight: 600; margin-bottom: 4px; }
        .roadmap-label { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--gray-800); margin-bottom: 14px; }
        .roadmap-items { display: flex; flex-direction: column; gap: 7px; }
        .roadmap-item { display: flex; align-items: center; gap: 6px; font-size: 0.76rem; color: var(--gray-600); }
        .roadmap-item::before { content: '→'; color: var(--g-light); font-size: 0.7rem; }

        /* ─── Timeline ─── */
        .timeline { position: relative; padding-left: 32px; margin-bottom: 56px; }
        .timeline::before {
          content: ''; position: absolute; left: 8px; top: 8px; bottom: 8px;
          width: 1.5px; background: linear-gradient(to bottom, var(--g-mid), var(--g-light), transparent);
        }
        .tl-item { position: relative; margin-bottom: 32px; }
        .tl-dot {
          position: absolute; left: -28px; top: 5px;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--g-light); border: 2px solid white;
          box-shadow: 0 0 0 2px var(--g-pale);
        }
        .tl-period { font-size: 0.7rem; color: var(--g-light); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 5px; }
        .tl-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 600; color: var(--gray-800); margin-bottom: 2px; }
        .tl-org { font-size: 0.8rem; color: var(--gray-400); margin-bottom: 8px; font-weight: 500; }
        .tl-desc { font-size: 0.82rem; color: var(--gray-600); line-height: 1.65; margin-bottom: 10px; font-weight: 300; }
        .tl-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag {
          padding: 3px 10px; border-radius: 50px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          font-size: 0.7rem; color: var(--g-light); font-weight: 500;
        }

        /* ─── Skills ─── */
        .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 56px; }
        .skills-card { background: var(--white); border-radius: 20px; padding: 32px; box-shadow: var(--card-shadow); border: 1px solid var(--gray-200); }

        /* ─── Certifications ─── */
        .cert-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; margin-bottom: 56px; }
        .cert-card {
          background: var(--white); border-radius: 16px; padding: 20px 22px;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
          display: flex; align-items: center; gap: 16px; transition: all 0.25s;
        }
        .cert-card:hover { transform: translateX(4px); border-color: var(--g-light); box-shadow: var(--card-hover); }
        .cert-badge { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        .cert-name { font-size: 0.85rem; font-weight: 600; color: var(--gray-800); margin-bottom: 3px; }
        .cert-meta { font-size: 0.72rem; color: var(--gray-400); }

        .dropdown-item {
          padding: 10px 14px; text-align: left; background: transparent; border: none;
          border-radius: 8px; font-size: 0.85rem; color: var(--gray-800);
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;
        }
        .dropdown-item:hover { background: var(--gray-100); color: var(--g-light); }

        /* ─── Projects ─── */
        .projects-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 56px; }
        .projects-grid > div { height: 100%; display: flex; flex-direction: column; }
        .project-card {
          background: var(--white); border-radius: 20px; padding: 26px 22px;
          box-shadow: var(--card-shadow); border: 1px solid var(--gray-200);
          transition: all 0.3s; display: flex; flex-direction: column; height: 100%;
        }
        .project-card:hover { transform: translateY(-6px); border-color: var(--g-light); box-shadow: var(--card-hover); }
        .project-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .project-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: 600; color: var(--gray-800); }
        .project-stars { font-size: 0.72rem; color: var(--gray-400); display: flex; align-items: center; gap: 3px; }
        .project-desc { font-size: 0.8rem; line-height: 1.6; color: var(--gray-600); flex: 1; margin-bottom: 14px; font-weight: 300; }
        .project-tech { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
        .project-link {
          display: inline-flex; align-items: center; gap: 5px; font-size: 0.75rem;
          color: var(--g-light); font-weight: 500; text-decoration: none; cursor: pointer;
          transition: gap 0.2s;
        }
        .project-link:hover { gap: 8px; }

        /* ─── Resume CTA ─── */
        .resume-cta {
          border-radius: 24px; padding: 48px 44px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; color: white; margin-bottom: 56px;
          box-shadow: 0 12px 40px rgba(7, 10, 30, 0.15);
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #070a1e 0%, #0f1638 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .resume-cta::before {
          content: ''; position: absolute; right: -60px; top: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: rgba(59, 130, 246, 0.08);
        }
        .resume-cta-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 600; margin-bottom: 6px; }
        .resume-cta-sub { font-size: 0.82rem; opacity: 0.65; font-weight: 300; }
        .resume-btn {
          padding: 13px 28px; border-radius: 50px;
          background: white; color: var(--g-dark); border: none;
          font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600;
          cursor: pointer; transition: all 0.25s; white-space: nowrap; letter-spacing: 0.03em;
          flex-shrink: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        .resume-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.25); }

        /* ─── Onboarding overlay ─── */
        .onboard-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(45, 10, 10, 0.85); backdrop-filter: blur(25px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .onboard-card {
          background: rgba(253, 245, 230, 0.98); border: 1px solid rgba(128, 0, 0, 0.15);
          border-radius: 24px; width: 100%; max-width: 580px; padding: 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); backdrop-filter: blur(16px);
          position: relative; color: #3d1b1b;
        }
        .onboard-input {
          width: 100%; padding: 14px 16px;
          background: rgba(255, 255, 255, 0.7); border: 1.5px solid rgba(128, 0, 0, 0.2);
          border-radius: 12px; color: #3d1b1b; margin-bottom: 16px; transition: all 0.3s;
        }
        .onboard-input:focus { border-color: #800000; box-shadow: 0 0 10px rgba(128, 0, 0, 0.2); outline: none; }
        .onboard-btn-primary {
          background: linear-gradient(135deg, #800000, #4a0404);
          border: none; color: #fdf5e6; padding: 14px; width: 100%; border-radius: 12px;
          cursor: pointer; font-weight: 600; font-size: 0.95rem; transition: all 0.25s;
          box-shadow: 0 4px 15px rgba(128, 0, 0, 0.25);
        }
        .onboard-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(128, 0, 0, 0.4); }
        .onboard-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .onboard-progress-bar { height: 6px; background: rgba(128,0,0,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 24px; }
        .onboard-progress-fill { height: 100%; background: linear-gradient(90deg, #800000, #4a0404); transition: width 0.4s cubic-bezier(0.22,1,0.36,1); }

        /* ─── Premium List Input Controls ─── */
        .crud-input {
          width: 100%; padding: 8px 12px; background: var(--gray-100); border: 1.5px solid var(--gray-200);
          border-radius: 8px; color: var(--gray-800); outline: none; font-size: 0.85rem; transition: all 0.2s;
        }
        .crud-input:focus { border-color: var(--g-light); background: var(--white); }
        .crud-btn-add {
          background: rgba(59, 130, 246, 0.1); color: var(--g-light); border: 1.5px dashed var(--g-light);
          padding: 10px 16px; border-radius: 12px; font-size: 0.82rem; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;
        }
        .crud-btn-add:hover { background: var(--g-light); color: white; transform: translateY(-1px); }
        
        .crud-btn-delete {
          background: rgba(248, 113, 113, 0.1); color: #ef4444; border: 1px solid rgba(248, 113, 113, 0.2);
          padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s;
        }
        .crud-btn-delete:hover { background: #ef4444; color: white; }

        /* ─── Responsive ─── */
        @media (max-width: 900px) {
          .roadmap-grid { grid-template-columns: repeat(2,1fr); }
          .projects-grid { grid-template-columns: repeat(2,1fr); }
          .about-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .profile-header-card {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 0 24px 24px 24px !important;
            gap: 16px !important;
          }
          .profile-header-avatar-container {
            margin-top: -80px !important;
            margin-bottom: 8px !important;
          }
          .profile-header-info {
            padding-top: 0 !important;
            align-items: center !important;
          }
          .profile-header-meta-row {
            justify-content: center !important;
            gap: 12px !important;
          }
          .profile-header-inputs {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .profile-header-text {
            width: 100%;
          }
          .hero-tags {
            justify-content: center !important;
          }
        }
        @media (max-width: 680px) {
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

      {/* Nav has been removed as requested */}

      {/* ─── Compact Hero Cover Photo ─── */}
      <section className="hero-cover" ref={heroRef}>
        <div
          className="hero-bg"
          style={{
            position: "absolute", inset: 0,
            transform: `translateY(${parallaxBg}px)`,
            background: tempCoverBackground()
          }}
        >
          <div className="hero-bg-leaves">
            {[1, 2, 3].map(i => (
              <svg key={i} viewBox="0 0 80 120" className="hero-leaf-big">
                <path d="M40 5 C10 20,-5 60,10 90 C20 110,40 118,40 118 C40 118,60 110,70 90 C85 60,70 20,40 5Z" fill="currentColor" />
              </svg>
            ))}
          </div>
          {!user?.cover && (
            <>
              <div className="hero-orb hero-orb-1" />
              <div className="hero-orb hero-orb-2" />
            </>
          )}
        </div>
        <div className="hero-overlay" style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(253, 253, 251, 0.15) 0%, transparent 100%)"
        }} />

        {/* Cover Background Customizer & Presets Bar (Visible in Edit Mode) */}
        {editMode && (
          <div style={{
            position: "absolute",
            top: "76px",
            right: "32px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(7, 10, 30, 0.75)",
            padding: "8px 16px",
            borderRadius: "50px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)"
          }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Presets:</span>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { name: "Cosmic Ocean", val: "linear-gradient(135deg, #070a1e 0%, #141b3d 75%, #1f2a55 100%)", color: "linear-gradient(135deg, #070a1e, #1f2a55)" },
                { name: "Emerald Garden", val: "linear-gradient(135deg, #0a1e16 0%, #113827 60%, #1e5c41 100%)", color: "linear-gradient(135deg, #0a1e16, #1e5c41)" },
                { name: "Sunset Glow", val: "linear-gradient(135deg, #2d0e1b 0%, #5c1e36 50%, #943d54 100%)", color: "linear-gradient(135deg, #2d0e1b, #943d54)" },
                { name: "Royal Amethyst", val: "linear-gradient(135deg, #130a26 0%, #291552 60%, #50279c 100%)", color: "linear-gradient(135deg, #130a26, #50279c)" },
                { name: "Modern Slate", val: "linear-gradient(135deg, #161824 0%, #282b3d 60%, #3e4461 100%)", color: "linear-gradient(135deg, #161824, #3e4461)" }
              ].map(p => (
                <button
                  key={p.name}
                  title={p.name}
                  onClick={() => {
                    if (onUpdateUser) onUpdateUser({ cover: p.val });
                  }}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: p.color,
                    border: user?.cover === p.val ? "2px solid white" : "1px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    padding: 0,
                    transform: user?.cover === p.val ? "scale(1.18)" : "scale(1)",
                    transition: "all 0.2s"
                  }}
                />
              ))}
            </div>
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
            <button
              className="hero-btn"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "50px",
                color: "white",
                padding: "3px 12px",
                fontSize: "0.7rem",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("cover-input-file").click()}
            >
              🖼️ Upload
            </button>
            <input type="file" id="cover-input-file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
          </div>
        )}
      </section>

      {/* ─── Premium Unified Profile Header Card (Floating squircle grid card) ─── */}
      <section className="profile-header-card">
        {/* Avatar Container in Column 1 */}
        <div className="profile-header-avatar-container">
          <div
            className="hero-avatar-wrap profile-header-avatar-inner"
            onClick={() => document.getElementById("avatar-input-file").click()}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" />
            ) : (
              tempName?.[0]?.toUpperCase() || "U"
            )}
            <div className="hero-avatar-hover-overlay">
              <span>📷</span>
              <span>Upload</span>
            </div>
          </div>
          {/* <div className="hero-badge" style={{ bottom: "-4px", right: "-4px" }}>⭐ Pro</div> */}
          <input type="file" id="avatar-input-file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>

        {/* Text and input details in Column 2 */}
        <div className="profile-header-info">
          {editMode ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%", marginTop: 8 }} className="profile-header-inputs">
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Full Name</label>
                <input
                  type="text"
                  value={tempName || ""}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="Full Name"
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Role / Track</label>
                <input
                  type="text"
                  value={tempTrack || ""}
                  onChange={e => setTempTrack(e.target.value)}
                  placeholder="Track e.g. Senior Frontend Engineer"
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>College / School</label>
                <input
                  type="text"
                  value={tempSchool || ""}
                  onChange={e => setTempSchool(e.target.value)}
                  placeholder="College"
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Branch</label>
                <input
                  type="text"
                  value={tempBranch || ""}
                  onChange={e => setTempBranch(e.target.value)}
                  placeholder="Branch"
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Profile Privacy</label>
                <select
                  value={tempPrivacy}
                  onChange={e => setTempPrivacy(e.target.value)}
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none", cursor: "pointer" }}
                >
                  <option value="public">🌍 Public (Discoverable)</option>
                  <option value="private">🔒 Private (Request to connect)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Location</label>
                <input
                  type="text"
                  value={tempContact?.location || ""}
                  onChange={e => setTempContact({ ...tempContact, location: e.target.value })}
                  placeholder="e.g. Bengaluru, India"
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Availability Status</label>
                <input
                  type="text"
                  value={tempContact?.availability || ""}
                  onChange={e => setTempContact({ ...tempContact, availability: e.target.value })}
                  placeholder="e.g. Available for freelance"
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Facebook URL</label>
                <input
                  type="text"
                  value={tempSocials?.facebook || ""}
                  onChange={e => setTempSocials({ ...tempSocials, facebook: e.target.value })}
                  placeholder="e.g. facebook.com/username"
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>LinkedIn URL</label>
                <input
                  type="text"
                  value={tempSocials?.linkedin || ""}
                  onChange={e => setTempSocials({ ...tempSocials, linkedin: e.target.value })}
                  placeholder="e.g. linkedin.com/in/username"
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Twitter URL</label>
                <input
                  type="text"
                  value={tempSocials?.twitter || ""}
                  onChange={e => setTempSocials({ ...tempSocials, twitter: e.target.value })}
                  placeholder="e.g. twitter.com/username"
                  style={{ background: "var(--gray-100)", border: "1.5px solid var(--gray-200)", borderRadius: 8, color: "var(--gray-800)", fontSize: "0.85rem", padding: "8px 12px", width: "100%", outline: "none" }}
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="hero-name" style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "2rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em",
                margin: 0, marginBottom: 4, color: "var(--gray-800)"
              }}>{tempName}</h1>

              {tempTrack && (
                <div style={{ fontSize: "0.95rem", color: "var(--gray-600)", marginBottom: "16px", fontWeight: "400" }}>
                  {tempTrack}
                </div>
              )}

              <div className="profile-header-meta-row">
                {tempContact?.location && (
                  <div className="profile-header-meta-item">
                    <span className="profile-header-meta-icon" style={{ color: "var(--gray-400)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </span>
                    <span>{tempContact.location}</span>
                  </div>
                )}
                {tempSocials?.facebook && (
                  <div className="profile-header-meta-item">
                    <span className="profile-header-meta-icon" style={{ color: "var(--gray-400)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </span>
                    <a href={tempSocials.facebook.startsWith('http') ? tempSocials.facebook : `https://${tempSocials.facebook}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gray-600)", textDecoration: "none" }} onMouseOver={e => e.currentTarget.style.color = "var(--g-light)"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-600)"}>{tempSocials.facebook.replace(/https?:\/\/(www\.)?facebook\.com\//, '')}</a>
                  </div>
                )}
                {tempSocials?.linkedin && (
                  <div className="profile-header-meta-item">
                    <span className="profile-header-meta-icon" style={{ color: "var(--gray-400)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </span>
                    <a href={tempSocials.linkedin.startsWith('http') ? tempSocials.linkedin : `https://${tempSocials.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gray-600)", textDecoration: "none" }} onMouseOver={e => e.currentTarget.style.color = "var(--g-light)"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-600)"}>{tempSocials.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a>
                  </div>
                )}
                {tempSocials?.twitter && (
                  <div className="profile-header-meta-item">
                    <span className="profile-header-meta-icon" style={{ color: "var(--gray-400)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    </span>
                    <a href={tempSocials.twitter.startsWith('http') ? tempSocials.twitter : `https://${tempSocials.twitter}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gray-600)", textDecoration: "none" }} onMouseOver={e => e.currentTarget.style.color = "var(--g-light)"} onMouseOut={e => e.currentTarget.style.color = "var(--gray-600)"}>{tempSocials.twitter.replace(/https?:\/\/(www\.)?twitter\.com\//, '')}</a>
                  </div>
                )}
              </div>

              {/* Social Stats & Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "8px" }}>
                <div style={{ display: "flex", gap: "16px", fontSize: "0.85rem", color: "var(--gray-600)" }}>
                  <div style={{ cursor: "pointer" }}><strong style={{ color: "var(--gray-800)" }}>{tempFollowers}</strong> Followers</div>
                  <div style={{ cursor: "pointer" }}><strong style={{ color: "var(--gray-800)" }}>{tempFollowing}</strong> Following</div>
                </div>
              </div>
            </>
          )}

          {editMode && (
            <div className="hero-tags" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: 16 }}>
              {Array.isArray(tempSkills) && tempSkills.slice(0, 5).map(s => (
                <span key={s.label} className="hero-tag" style={{
                  background: "var(--gray-100)", border: "1px solid var(--gray-200)", color: "var(--gray-600)",
                  fontSize: "0.72rem", padding: "4px 12px", borderRadius: "50px"
                }}>{s.label}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ paddingTop: "24px", position: "relative" }}>
          <button style={{
            width: "36px", height: "36px", borderRadius: "50%",
            border: "1px solid var(--gray-200)", background: showOptions ? "var(--gray-100)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--gray-400)", transition: "all 0.2s"
          }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--gray-100)'}
            onMouseOut={e => { if (!showOptions) e.currentTarget.style.background = 'transparent'; }}
            onClick={() => setShowOptions(!showOptions)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>

          {showOptions && (
            <div style={{
              position: "absolute", top: "65px", right: 0, width: "200px",
              background: "var(--white)", borderRadius: "12px", padding: "8px",
              boxShadow: "var(--card-hover)", border: "1px solid var(--gray-200)",
              zIndex: 100, display: "flex", flexDirection: "column", gap: "4px"
            }}>
              {editMode ? (
                <button className="dropdown-item" onClick={() => { setShowOptions(false); handleSave(); }}>✓ Save Profile</button>
              ) : (
                <button className="dropdown-item" onClick={() => { setShowOptions(false); setEditMode(true); }}>✏️ Edit Profile</button>
              )}
              <button className="dropdown-item" onClick={() => { setShowOptions(false); addCustomSection(); }}>➕ Add Section</button>
              <button className="dropdown-item" onClick={() => setShowOptions(false)}>🔗 Edit Custom URL</button>
              <div style={{ height: "1px", background: "var(--gray-200)", margin: "4px 0" }} />
              <button className="dropdown-item" onClick={() => { setShowOptions(false); handleShareProfile(); }}>📤 Share Profile</button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Creamish Body Container ─── */}
      <div className="profile-body">

        {/* Stats Row (Fully Editable in Place) */}
        <Section direction="up" delay={0}>
          <div className="stats-row">
            {Array.isArray(tempStats) && tempStats.map((s, idx) => (
              <StatCard
                key={idx}
                num={s?.num || ""}
                label={s?.label || ""}
                icon={s?.icon || ""}
                editMode={editMode}
                onNumChange={val => updateStatItem(idx, "num", val)}
                onLabelChange={val => updateStatItem(idx, "label", val)}
              />
            ))}
          </div>
        </Section>

        {/* About Section */}
        <Section direction="up" delay={0}>
          <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div className="section-label">About</div>
              <div className="section-title">Who I Am</div>
            </div>
          </div>
          <div className="about-grid">
            <div className="about-card about-card-bio">
              <p className="bio-text">
                {(editMode || editingSection === 'about') ? (
                  <textarea
                    value={tempBio}
                    onChange={e => setTempBio(e.target.value)}
                    rows={6}
                    style={{ width: "100%", background: "transparent", color: "var(--gray-800)", border: "1px solid var(--gray-200)", borderRadius: 8, padding: 10, outline: "none", fontFamily: "'Inter', sans-serif" }}
                  />
                ) : (
                  tempBio
                )}
              </p>
            </div>

            {/* User Profile Details Card */}
            <div className="about-card">
              <div className="section-label" style={{ marginBottom: 14 }}>User Profile Details</div>
              {editMode ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Username</label>
                    <input className="crud-input" value={tempUsername} onChange={e => setTempUsername(e.target.value)} placeholder="Username" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>College / School</label>
                    <input className="crud-input" value={tempSchool} onChange={e => setTempSchool(e.target.value)} placeholder="College" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Branch</label>
                    <input className="crud-input" value={tempBranch} onChange={e => setTempBranch(e.target.value)} placeholder="Branch" />
                  </div>
                </div>
              ) : (
                <div className="contact-row">
                  <div className="contact-item">
                    <div className="contact-icon">👤</div>
                    <span><strong>Username:</strong> @{tempUsername}</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">🎓</div>
                    <span><strong>School:</strong> {tempSchool}</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">🧪</div>
                    <span><strong>Branch:</strong> {tempBranch}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Details (Fully Editable in Edit Mode) */}
            <div className="about-card">
              <div className="section-label" style={{ marginBottom: 14 }}>Contact</div>
              {editMode ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Email</label>
                    <input className="crud-input" value={tempContact?.email || ""} onChange={e => setTempContact({ ...(tempContact || {}), email: e.target.value })} placeholder="Email Address" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Location</label>
                    <input className="crud-input" value={tempContact?.location || ""} onChange={e => setTempContact({ ...(tempContact || {}), location: e.target.value })} placeholder="Location" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Website</label>
                    <input className="crud-input" value={tempContact?.website || ""} onChange={e => setTempContact({ ...(tempContact || {}), website: e.target.value })} placeholder="Website Link" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Availability</label>
                    <input className="crud-input" value={tempContact?.availability || ""} onChange={e => setTempContact({ ...(tempContact || {}), availability: e.target.value })} placeholder="Availability Status" />
                  </div>
                </div>
              ) : (
                <div className="contact-row">
                  <div className="contact-item">
                    <div className="contact-icon">📧</div>
                    <span>{tempContact?.email || ""}</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">📍</div>
                    <span>{tempContact?.location || ""}</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">🌐</div>
                    <span><a href={`https://${tempContact?.website || ""}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--g-light)", textDecoration: "none" }}>{tempContact?.website || ""}</a></span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">📅</div>
                    <span>{tempContact?.availability || ""}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links (Fully Editable in Edit Mode) */}
            <div className="about-card">
              <div className="section-label" style={{ marginBottom: 14 }}>Socials</div>
              {editMode ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>GitHub URL</label>
                    <input className="crud-input" value={tempSocials?.github || ""} onChange={e => setTempSocials({ ...(tempSocials || {}), github: e.target.value })} placeholder="https://github.com/yourprofile" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>LinkedIn URL</label>
                    <input className="crud-input" value={tempSocials?.linkedin || ""} onChange={e => setTempSocials({ ...(tempSocials || {}), linkedin: e.target.value })} placeholder="https://linkedin.com/in/yourprofile" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Twitter URL</label>
                    <input className="crud-input" value={tempSocials?.twitter || ""} onChange={e => setTempSocials({ ...(tempSocials || {}), twitter: e.target.value })} placeholder="https://twitter.com/yourprofile" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Blog URL</label>
                    <input className="crud-input" value={tempSocials?.blog || ""} onChange={e => setTempSocials({ ...(tempSocials || {}), blog: e.target.value })} placeholder="https://medium.com/@yourprofile" />
                  </div>
                </div>
              ) : (
                <div className="social-row" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <a href={tempSocials?.github || "#"} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ flex: "1 1 calc(50% - 5px)", minWidth: "100px" }}>🐙 GitHub</a>
                  <a href={tempSocials?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ flex: "1 1 calc(50% - 5px)", minWidth: "100px" }}>💼 LinkedIn</a>
                  <a href={tempSocials?.twitter || "#"} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ flex: "1 1 calc(50% - 5px)", minWidth: "100px" }}>🐦 Twitter</a>
                  <a href={tempSocials?.blog || "#"} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ flex: "1 1 calc(50% - 5px)", minWidth: "100px" }}>📝 Blog</a>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Activity Status Section */}
        <Section direction="up" delay={0}>
          <div className="section-head">
            <div className="section-label">Engagement</div>
            <div className="section-title">Activity Status</div>
          </div>
          <div style={{ background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: 16, padding: 32, boxShadow: "0 10px 40px rgba(0,0,0,0.05)", marginBottom: 56 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "32px" }}>
              <div style={{ flex: 1, minWidth: "100%", overflowX: "auto" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ fontSize: "1rem", color: "#475569" }}>
                    <strong style={{ color: "#1e293b", fontSize: "1.2rem" }}>{activityGrid.reduce((sum, d) => sum + (d.intensity > 0 ? d.intensity * 2 + 1 : 0), 0)}</strong> submissions in the past one year
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", gap: "16px" }}>
                    <span>Total active days: <strong style={{ color: "#1e293b" }}>{activityGrid.filter(d => d.intensity > 0).length}</strong></span>
                    <span>Max streak: <strong style={{ color: "#1e293b" }}>{activityStats.maxStreak}</strong></span>
                    <span>Current streak: <strong style={{ color: "#1e293b" }}>{activityStats.currentStreak}</strong></span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", minWidth: "max-content", paddingBottom: "10px" }}>
                  {/* Y-axis labels */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: "0px", paddingBottom: "32px", fontSize: "0.75rem", color: "#64748b" }}>
                    <div style={{ height: "12px", visibility: "hidden" }}>Sun</div>
                    <div style={{ height: "12px", lineHeight: "12px" }}>Mon</div>
                    <div style={{ height: "12px", visibility: "hidden" }}>Tue</div>
                    <div style={{ height: "12px", lineHeight: "12px" }}>Wed</div>
                    <div style={{ height: "12px", visibility: "hidden" }}>Thu</div>
                    <div style={{ height: "12px", lineHeight: "12px" }}>Fri</div>
                    <div style={{ height: "12px", visibility: "hidden" }}>Sat</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

                    {/* 7-row grid (column flow) */}
                    <div style={{
                      display: "grid",
                      gridTemplateRows: "repeat(7, 12px)",
                      gridAutoFlow: "column",
                      gap: "4px"
                    }}>
                      {activityGrid.map((day, i) => (
                        <div key={i} title={`${day.status} on ${day.date}`} style={{
                          width: "12px", height: "12px", borderRadius: "2px",
                          background: day.color, transition: "transform 0.1s",
                          gridRow: i === 0 ? day.dayOfWeek + 1 : "auto",
                          cursor: "pointer", border: "1px solid rgba(27,31,35,0.06)"
                        }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.3)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        />
                      ))}
                    </div>

                    {/* Month labels and Badges row */}
                    <div style={{ position: "relative", height: "24px", marginTop: "4px" }}>
                      {monthLabels.map((m, i) => {
                        // Let's add badges for Feb, Mar, Apr
                        let badge = null;
                        if (m.label.includes("Feb")) badge = { text: "Noob", icon: "🌱", color: "#3b82f6" };
                        if (m.label.includes("Mar")) badge = { text: "Pro", icon: "⭐", color: "#8b5cf6" };
                        if (m.label.includes("Apr")) badge = { text: "Elite", icon: "🏆", color: "#f59e0b" };

                        return (
                          <div key={i} style={{
                            position: "absolute",
                            left: `${m.colIndex * 16}px`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                          }}>
                            {badge ? (
                              <div title={`Badge earned: ${badge.text} - Active whole month!`} style={{
                                background: badge.color, color: "white", fontSize: "0.6rem",
                                padding: "2px 6px", borderRadius: "8px", fontWeight: "bold",
                                whiteSpace: "nowrap", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                transform: "translateY(-2px)"
                              }}>
                                {badge.icon} {badge.text}
                              </div>
                            ) : (
                              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                {m.label}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer legend */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", minWidth: "max-content" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", cursor: "pointer", textDecoration: "underline" }}>Learn how we measure activity</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#64748b" }}>
                    <span>Less</span>
                    <div title="No activity" style={{ width: "12px", height: "12px", borderRadius: "2px", background: "#f8f6f0", border: "1px solid rgba(27,31,35,0.06)" }}></div>
                    <div title="< 1 hr" style={{ width: "12px", height: "12px", borderRadius: "2px", background: "#93c5fd", border: "1px solid rgba(27,31,35,0.06)" }}></div>
                    <div title="1-2 hrs" style={{ width: "12px", height: "12px", borderRadius: "2px", background: "#3b82f6", border: "1px solid rgba(27,31,35,0.06)" }}></div>
                    <div title="2-4 hrs" style={{ width: "12px", height: "12px", borderRadius: "2px", background: "#1e3a8a", border: "1px solid rgba(27,31,35,0.06)" }}></div>
                    <div title="> 4 hrs" style={{ width: "12px", height: "12px", borderRadius: "2px", background: "#0f172a", border: "1px solid rgba(27,31,35,0.06)" }}></div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Roadmap Paths Section (Fully Editable in Edit Mode) */}
        <Section direction="up" delay={0}>
          <div className="section-head">
            <div className="section-label">Career Paths</div>
            <div className="section-title">Learning Roadmap</div>
          </div>
          <div className="roadmap-grid">
            {Array.isArray(tempRoadmaps) && tempRoadmaps.map((r, i) => (
              <Section key={i} direction="up" delay={i * 80}>
                <div className="roadmap-card">
                  <div className="roadmap-icon">{r?.icon || ""}</div>
                  <div className="roadmap-level">{r?.level || ""}</div>
                  {(editMode || editingSection === 'roadmap') ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                      <input type="text" value={r?.label || ""} onChange={e => updateRoadmapItem(i, "label", e.target.value)} style={{ width: "100%", padding: 6, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.85rem", background: "var(--gray-100)" }} />
                      <textarea value={Array.isArray(r?.items) ? r.items.join("\n") : (typeof r?.items === "string" ? r.items : "")} onChange={e => updateRoadmapItem(i, "items", e.target.value.split("\n"))} rows={3} style={{ width: "100%", padding: 6, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.75rem", background: "var(--gray-100)", resize: "vertical" }} placeholder="One item per line" />
                    </div>
                  ) : (
                    <>
                      <div className="roadmap-label">{r?.label || ""}</div>
                      <div className="roadmap-items">
                        {Array.isArray(r?.items) && r.items.map((it, itemIdx) => <div key={itemIdx} className="roadmap-item">{it}</div>)}
                      </div>
                    </>
                  )}
                </div>
              </Section>
            ))}
          </div>
        </Section>

        {/* Experience Section */}
        <Section direction="left" delay={0}>
          <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div className="section-label">Career</div>
              <div className="section-title">Experience</div>
            </div>
            {editMode && (
              <button onClick={addExperience} className="crud-btn-add">➕ Add Experience</button>
            )}
          </div>
          <div className="timeline">
            {Array.isArray(tempExperience) && tempExperience.filter(Boolean).map((e, i) => (
              <TimelineItem
                key={i}
                {...e}
                index={i}
                editMode={editMode}
                onUpdate={updates => updateExperienceItem(i, updates)}
                onDelete={() => deleteExperienceItem(i)}
              />
            ))}
          </div>
        </Section>

        {/* Education Section */}
        <Section direction="left" delay={0}>
          <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div className="section-label">Academic</div>
              <div className="section-title">Education</div>
            </div>
            {editMode && (
              <button onClick={addEducation} className="crud-btn-add">➕ Add Education</button>
            )}
          </div>
          <div className="timeline">
            {(editMode || editingSection === 'experience') ? (
              Array.isArray(tempEducation) && tempEducation.filter(Boolean).map((e, i) => (
                <TimelineItem
                  key={i}
                  {...e}
                  index={i}
                  editMode={editMode}
                  onUpdate={updates => updateEducationItem(i, updates)}
                  onDelete={() => deleteEducationItem(i)}
                />
              ))
            ) : (
              Array.isArray(dynamicEducation) && dynamicEducation.filter(Boolean).map((e, i) => (
                <TimelineItem key={i} {...e} index={i} editMode={false} />
              ))
            )}
          </div>
        </Section>

        {/* Skills Section (Fully Interactive Range Sliders) */}
        <Section direction="up" delay={0}>
          <div className="section-head">
            <div className="section-label">Expertise</div>
            <div className="section-title">Skills & Capabilities</div>
          </div>
          <div className="skills-grid">
            {/* Technical Skills Card */}
            <div className="skills-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span className="section-label" style={{ margin: 0 }}>Technical Skills</span>
                {editMode && (
                  <button onClick={addTechSkill} className="crud-btn-add" style={{ padding: "4px 10px", borderRadius: 8 }}>➕ Add Skill</button>
                )}
              </div>
              {Array.isArray(tempSkills) && tempSkills.map((s, idx) => (
                <div key={idx}>
                  {editMode && (
                    <input
                      type="text"
                      value={s?.label || ""}
                      onChange={e => updateTechSkillItem(idx, "label", e.target.value)}
                      style={{ padding: 4, width: "100%", border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.8rem", marginBottom: 4, background: "var(--gray-100)", color: "var(--gray-800)" }}
                      placeholder="Skill Name"
                    />
                  )}
                  <SkillBar
                    label={s?.label || ""}
                    pct={s?.pct || 0}
                    color={s?.color}
                    editMode={editMode}
                    onChangePct={val => updateTechSkillItem(idx, "pct", val)}
                    onDelete={() => deleteTechSkillItem(idx)}
                  />
                </div>
              ))}
            </div>

            {/* Soft Skills & Languages Card */}
            <div className="skills-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span className="section-label" style={{ margin: 0 }}>Soft Skills</span>
                {editMode && (
                  <button onClick={addSoftSkill} className="crud-btn-add" style={{ padding: "4px 10px", borderRadius: 8 }}>➕ Add Skill</button>
                )}
              </div>
              {Array.isArray(tempSoftSkills) && tempSoftSkills.map((s, idx) => (
                <div key={idx}>
                  {editMode && (
                    <input
                      type="text"
                      value={s?.label || ""}
                      onChange={e => updateSoftSkillItem(idx, "label", e.target.value)}
                      style={{ padding: 4, width: "100%", border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.8rem", marginBottom: 4, background: "var(--gray-100)", color: "var(--gray-800)" }}
                      placeholder="Soft Skill Name"
                    />
                  )}
                  <SkillBar
                    label={s?.label || ""}
                    pct={s?.pct || 0}
                    color={s?.color}
                    editMode={editMode}
                    onChangePct={val => updateSoftSkillItem(idx, "pct", val)}
                    onDelete={() => deleteSoftSkillItem(idx)}
                  />
                </div>
              ))}

              <div style={{ marginTop: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="section-label" style={{ margin: 0 }}>Languages</span>
                  {editMode && (
                    <button onClick={addLanguage} className="crud-btn-add" style={{ padding: "3px 8px", borderRadius: 6, fontSize: "0.7rem" }}>➕ Add</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Array.isArray(tempLanguages) && tempLanguages.map((l, idx) => (
                    <span key={idx} className="tag" style={{ fontSize: "0.78rem", padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                      {(editMode || editingSection === 'education') ? (
                        <input
                          type="text"
                          value={l || ""}
                          onChange={e => updateLanguageItem(idx, e.target.value)}
                          style={{ border: "none", background: "transparent", width: "100px", color: "var(--g-light)", fontWeight: 500 }}
                        />
                      ) : (
                        l || ""
                      )}
                      {editMode && (
                        <button onClick={() => deleteLanguageItem(idx)} style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}>✕</button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Certifications Section */}
        <Section direction="up" delay={0}>
          <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div className="section-label">Credentials</div>
              <div className="section-title">Certifications</div>
            </div>
            {editMode && (
              <button onClick={addCertification} className="crud-btn-add">➕ Add Certification</button>
            )}
          </div>
          <div className="cert-grid">
            {Array.isArray(tempCertifications) && tempCertifications.map((c, i) => (
              <Section key={i} direction="up" delay={i * 80}>
                <div className="cert-card" style={{ position: "relative" }}>
                  {editMode && (
                    <button
                      onClick={() => deleteCertificationItem(i)}
                      style={{ position: "absolute", top: 8, right: 8, background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.78rem" }}
                    >
                      ❌
                    </button>
                  )}
                  <div className="cert-badge" style={{ background: (c?.color || "#3b82f6") + "18" }}>
                    <span style={{ fontSize: "1.1rem" }}>🏅</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    {(editMode || editingSection === 'education') ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "95%" }}>
                        <input type="text" value={c?.name || ""} onChange={e => updateCertificationItem(i, "name", e.target.value)} placeholder="Certification Name" style={{ width: "100%", padding: 4, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.8rem", background: "var(--gray-100)" }} />
                        <div style={{ display: "flex", gap: 6 }}>
                          <input type="text" value={c?.issuer || ""} onChange={e => updateCertificationItem(i, "issuer", e.target.value)} placeholder="Issuer" style={{ width: "65%", padding: 4, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.75rem", background: "var(--gray-100)" }} />
                          <input type="text" value={c?.year || ""} onChange={e => updateCertificationItem(i, "year", e.target.value)} placeholder="Year" style={{ width: "35%", padding: 4, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.75rem", background: "var(--gray-100)" }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="cert-name">{c?.name || ""}</div>
                        <div className="cert-meta">{c?.issuer || ""} · {c?.year || ""}</div>
                      </>
                    )}
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </Section>

        {/* Featured Projects Section (Dynamic & Manual Edit) */}
        <Section direction="up" delay={0}>
          <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="section-label">Portfolio</div>
              <div className="section-title">Featured Projects</div>
            </div>
            {editMode && (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={fetchGitHubProjects}
                  className="crud-btn-add"
                  disabled={githubLoading}
                  style={{ background: githubLoading ? "var(--gray-200)" : "rgba(59, 130, 246, 0.08)", borderColor: "var(--g-light)", borderStyle: "solid" }}
                >
                  {githubLoading ? "🔄 Fetching..." : "🐙 Import from GitHub"}
                </button>
                <button onClick={addProject} className="crud-btn-add">➕ Add Project Manually</button>
              </div>
            )}
          </div>

          {githubError && (
            <div style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: 16, background: "rgba(239,68,68,0.06)", padding: "10px 16px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
              ⚠️ {githubError} (Verify your Username in User Profile Details card)
            </div>
          )}

          <div className="projects-grid">
            {Array.isArray(tempProjects) && tempProjects.map((p, i) => (
              <Section key={i} direction="up" delay={i * 100}>
                <div className="project-card" style={{ position: "relative" }}>
                  {editMode && (
                    <button
                      onClick={() => deleteProjectItem(i)}
                      className="crud-btn-delete"
                      style={{ position: "absolute", top: 12, right: 12 }}
                    >
                      Delete
                    </button>
                  )}
                  {(editMode || editingSection === 'projects') ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase" }}>Project Name</label>
                        <input type="text" value={p?.name || ""} onChange={e => updateProjectItem(i, "name", e.target.value)} style={{ width: "100%", padding: 6, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.8rem", background: "var(--gray-100)" }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        <div>
                          <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase" }}>GitHub Stars</label>
                          <input type="text" value={p?.stars || "0"} onChange={e => updateProjectItem(i, "stars", e.target.value)} placeholder="e.g. 1.2k" style={{ width: "100%", padding: 6, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.8rem", background: "var(--gray-100)" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase" }}>Languages</label>
                          <input type="text" value={Array.isArray(p?.tech) ? p.tech.join(", ") : (typeof p?.tech === "string" ? p.tech : "")} onChange={e => updateProjectItem(i, "tech", e.target.value.split(",").map(x => x.trim()).filter(Boolean))} style={{ width: "100%", padding: 6, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.8rem", background: "var(--gray-100)" }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase" }}>Repository Link</label>
                        <input type="text" value={p?.link || ""} onChange={e => updateProjectItem(i, "link", e.target.value)} style={{ width: "100%", padding: 6, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.8rem", background: "var(--gray-100)" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", color: "var(--gray-400)", textTransform: "uppercase" }}>Description</label>
                        <textarea value={p?.desc || ""} onChange={e => updateProjectItem(i, "desc", e.target.value)} rows={3} style={{ width: "100%", padding: 6, border: "1px solid var(--gray-200)", borderRadius: 6, fontSize: "0.8rem", background: "var(--gray-100)", resize: "vertical" }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="project-header">
                        <div className="project-name">{p?.name || ""}</div>
                        <div className="project-stars">⭐ {p?.stars || "0"}</div>
                      </div>
                      <p className="project-desc">{p?.desc || ""}</p>
                      <div className="project-tech">
                        {Array.isArray(p?.tech) && p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                      <a className="project-link" href={p?.link || "#"} target="_blank" rel="noopener noreferrer">View project →</a>
                    </>
                  )}
                </div>
              </Section>
            ))}
          </div>
        </Section>

        {/* Custom Sections */}
        {tempCustomSections.map((sec, idx) => (
          <Section key={`custom-${idx}`} direction="up" delay={0}>
            <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div className="section-label">Custom</div>
                {(editMode || editingSection === 'skills') ? (
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => {
                      const newSecs = [...tempCustomSections];
                      newSecs[idx].title = e.target.value;
                      setTempCustomSections(newSecs);
                    }}
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2rem", fontWeight: 700, color: "var(--gray-800)", border: "none", borderBottom: "1px solid var(--gray-200)", outline: "none", background: "transparent" }}
                  />
                ) : (
                  <div className="section-title">{sec.title}</div>
                )}
              </div>
              {editMode && (
                <button
                  onClick={() => setTempCustomSections(tempCustomSections.filter((_, i) => i !== idx))}
                  style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: "50px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}
                >
                  Delete Section
                </button>
              )}
            </div>
            <div className="about-card" style={{ marginBottom: 56 }}>
              {(editMode || editingSection === 'certifications') ? (
                <textarea
                  value={sec.content}
                  onChange={(e) => {
                    const newSecs = [...tempCustomSections];
                    newSecs[idx].content = e.target.value;
                    setTempCustomSections(newSecs);
                  }}
                  rows={6}
                  style={{ width: "100%", background: "transparent", color: "var(--gray-800)", border: "1px solid var(--gray-200)", borderRadius: 8, padding: 10, outline: "none", fontFamily: "'Inter', sans-serif", resize: "vertical" }}
                />
              ) : (
                <p className="bio-text" style={{ whiteSpace: "pre-wrap" }}>{sec.content}</p>
              )}
            </div>
          </Section>
        ))}

        {/* Resume CTA Section (Themed Deep Cosmic Bluish) */}
        <Section direction="up" delay={0}>
          <div className="resume-cta">
            <div>
              <div className="resume-cta-title">Ready to collaborate?</div>
              <div className="resume-cta-sub">Download my full resume or reach out directly — let's build something great.</div>
            </div>
            <button className="resume-btn" onClick={() => alert("Resume downloaded successfully!")}>📄 Download Resume</button>
          </div>
        </Section>

      </div>

      {/* ─── Animated Onboarding Overlay Wizard ─── */}
      {showOnboarding && (
        <div className="onboard-overlay">
          <div className="onboard-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#3d1b1b", margin: 0 }}>
                Set Up Your Profile
              </h2>
              <span style={{ fontSize: "0.8rem", color: "#6b2c2c", fontWeight: 600 }}>Step {onboardStep} of 3</span>
            </div>

            <div className="onboard-progress-bar">
              <div className="onboard-progress-fill" style={{ width: `${(onboardStep / 3) * 100}%` }} />
            </div>

            {onboardStep === 1 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <p style={{ color: "#5a2222", fontSize: "0.88rem", marginBottom: 20 }}>Let's start by learning who you are and defining your public alias.</p>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: "0.75rem", color: "#4a1c1c", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Full Name</label>
                  <input className="onboard-input" style={{ margin: 0 }} placeholder="e.g. Arjun Sharma" value={onboardName} onChange={e => setOnboardName(e.target.value)} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: "0.75rem", color: "#4a1c1c", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Username</label>
                  <input className="onboard-input" style={{ margin: 0 }} placeholder="e.g. arjun_codes" value={onboardUsername} onChange={e => setOnboardUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))} />
                </div>

                {usernameSuggestions.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: "0.75rem", color: "#5a2222", marginBottom: 8 }}>Suggested usernames (click to choose):</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {usernameSuggestions.map(sug => (
                        <span
                          key={sug}
                          onClick={() => setOnboardUsername(sug)}
                          style={{
                            fontSize: "0.75rem",
                            background: onboardUsername === sug ? "rgba(128,0,0,0.1)" : "rgba(128,0,0,0.03)",
                            border: `1px solid ${onboardUsername === sug ? "#800000" : "rgba(128,0,0,0.1)"}`,
                            color: onboardUsername === sug ? "#800000" : "#5a2222",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          @{sug}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="onboard-btn-primary" disabled={!onboardName || !onboardUsername} onClick={() => setOnboardStep(2)}>
                  Continue to Education →
                </button>
              </div>
            )}

            {onboardStep === 2 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <p style={{ color: "#5a2222", fontSize: "0.88rem", marginBottom: 20 }}>Select your academic context to receive university learning roadmaps.</p>

                <div style={{ marginBottom: 16, position: "relative" }}>
                  <label style={{ fontSize: "0.75rem", color: "#4a1c1c", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>School / College</label>
                  <input className="onboard-input" style={{ margin: 0 }} placeholder="e.g. Chitkara University" value={onboardSchool} onChange={e => handleSchoolChange(e.target.value)} onFocus={() => { if (onboardSchool) handleSchoolChange(onboardSchool); }} />
                  {schoolSuggestions.length > 0 && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, right: 0,
                      background: "#fdf5e6", border: "1px solid rgba(128,0,0,0.15)",
                      borderRadius: "8px", zIndex: 10, maxHeight: "150px", overflowY: "auto",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}>
                      {schoolSuggestions.map(item => (
                        <div
                          key={item}
                          onClick={() => { setOnboardSchool(item); setSchoolSuggestions([]); }}
                          style={{
                            padding: "10px 14px", cursor: "pointer", color: "#3d1b1b", fontSize: "0.85rem",
                            borderBottom: "1px solid rgba(128,0,0,0.05)", transition: "background 0.2s"
                          }}
                          onMouseEnter={e => e.target.style.background = "rgba(128,0,0,0.05)"}
                          onMouseLeave={e => e.target.style.background = "transparent"}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 24, position: "relative" }}>
                  <label style={{ fontSize: "0.75rem", color: "#4a1c1c", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Branch / Specialization</label>
                  <input className="onboard-input" style={{ margin: 0 }} placeholder="e.g. Computer Science & Engineering" value={onboardBranch} onChange={e => handleBranchChange(e.target.value)} onFocus={() => { if (onboardBranch) handleBranchChange(onboardBranch); }} />
                  {branchSuggestions.length > 0 && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, right: 0,
                      background: "#fdf5e6", border: "1px solid rgba(128,0,0,0.15)",
                      borderRadius: "8px", zIndex: 10, maxHeight: "150px", overflowY: "auto",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}>
                      {branchSuggestions.map(item => (
                        <div
                          key={item}
                          onClick={() => { setOnboardBranch(item); setBranchSuggestions([]); }}
                          style={{
                            padding: "10px 14px", cursor: "pointer", color: "#3d1b1b", fontSize: "0.85rem",
                            borderBottom: "1px solid rgba(128,0,0,0.05)", transition: "background 0.2s"
                          }}
                          onMouseEnter={e => e.target.style.background = "rgba(128,0,0,0.05)"}
                          onMouseLeave={e => e.target.style.background = "transparent"}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button className="onboard-btn-primary" style={{ background: "rgba(128,0,0,0.05)", border: "1px solid rgba(128,0,0,0.1)", color: "#3d1b1b", boxShadow: "none" }} onClick={() => setOnboardStep(1)}>
                    ← Back
                  </button>
                  <button className="onboard-btn-primary" disabled={!onboardSchool || !onboardBranch} onClick={() => setOnboardStep(3)}>
                    Continue to Skills →
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 3 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <p style={{ color: "#5a2222", fontSize: "0.88rem", marginBottom: 20 }}>Select the programming concepts and technologies you want to master.</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, maxHeight: "250px", overflowY: "auto", padding: "4px" }}>
                  {POPULAR_SKILLS.map(s => {
                    const active = onboardSkills.includes(s);
                    return (
                      <span
                        key={s}
                        onClick={() => {
                          if (active) {
                            setOnboardSkills(onboardSkills.filter(x => x !== s));
                          } else {
                            setOnboardSkills([...onboardSkills, s]);
                          }
                        }}
                        style={{
                          fontSize: "0.8rem",
                          background: active ? "linear-gradient(135deg, #800000, #4a0404)" : "rgba(128,0,0,0.05)",
                          border: active ? "none" : "1px solid rgba(128,0,0,0.1)",
                          color: active ? "#fdf5e6" : "#5a2222",
                          padding: "8px 14px",
                          borderRadius: "20px",
                          cursor: "pointer",
                          boxShadow: active ? "0 0 10px rgba(128,0,0,0.2)" : "none",
                          transition: "all 0.2s"
                        }}
                      >
                        {s}
                      </span>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button className="onboard-btn-primary" style={{ background: "rgba(128,0,0,0.05)", border: "1px solid rgba(128,0,0,0.1)", color: "#3d1b1b", boxShadow: "none" }} onClick={() => setOnboardStep(2)}>
                    ← Back
                  </button>
                  <button className="onboard-btn-primary" disabled={onboardSkills.length === 0} onClick={() => {
                    if (onUpdateUser) {
                      onUpdateUser({
                        name: onboardName,
                        username: onboardUsername,
                        school: onboardSchool,
                        branch: onboardBranch,
                        skills: onboardSkills,
                        onboarded: true
                      });
                    }
                    if (onNav) {
                      onNav("dashboard");
                    }
                  }}>
                    ✨ Launch Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

}
