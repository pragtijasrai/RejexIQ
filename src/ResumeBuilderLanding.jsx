import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import OriginalBuilder from "./ResumeBuilder.jsx";

const COMPANIES = ["Google","Amazon","Microsoft","Meta","Apple","Netflix","Spotify","Airbnb","Figma"];
const FEATURES = [
  { icon: "✍️", title: "Pre-written Content", desc: "50+ expert-crafted bullet points and 5 stunning templates built by career professionals.", more: "Jumpstart your resume with ready-made, recruiter-friendly phrasing and polished section structure to make your experience shine.", color: "#0f0e0e", bg:"#f0e9e9" },
  { icon: "🤖", title: "AI-Powered Writing", desc: "Real-time AI analyzes your resume and rewrites every sentence to stand out to recruiters.", more: "Our AI suggests stronger verbs, removes fluff, and keeps your story concise so hiring managers understand your value instantly.", color: "#0f0e0e", bg:"#f0e9e9" },
  { icon: "🎯", title: "ATS Optimization", desc: "Beat applicant tracking systems with smart keyword placement and perfectly clean formatting.", more: "You get resume formatting and keyword guidance that helps your profile pass both automated scans and human reviews.", color: "#0f0e0e", bg:"#f0e9e9" },
  { icon: "📈", title: "Career Insights", desc: "Personalized skill gap analysis, salary benchmarks, and role-matching intelligence.", more: "Understand what employers want and tailor your resume so it highlights your most relevant strengths for high-paying roles.", color: "#0f0e0e", bg:"#f0e9e9" },
];
const STEPS = [
  { n:"01", icon:"🎨", title:"Pick a Template", desc:"Choose from 5 stunning, ATS-optimized templates designed by career experts for every industry." },
  { n:"02", icon:"✏️", title:"Fill with AI Help", desc:"Type your details and watch AI instantly improve every sentence, bullet point, and summary." },
  { n:"03", icon:"📥", title:"Download & Apply", desc:"Export a pixel-perfect PDF resume and start applying to your dream companies today." },
];
<br></br>
const TEMPLATES = [
  { id:"modern",    label:"Modern Pro",  badge:"🔥 Popular",  accent:"#9f1239", bars:["#9f1239","#be123c","#e11d48"] },
  { id:"executive", label:"Executive",   badge:"💼 Premium",  accent:"#0f172a", bars:["#334155","#475569","#64748b"] },
  { id:"creative",  label:"Creative",    badge:"✨ Trending", accent:"#f43f5e", bars:["#f43f5e","#ec4899","#f97316"] },
  { id:"minimal",   label:"Minimal",     badge:"🎯 Clean",    accent:"#10b981", bars:["#10b981","#14b8a6","#e11d48"] },
  { id:"classic",   label:"Classic",     badge:"⭐ Timeless", accent:"#1e40af", bars:["#1e40af","#1d4ed8","#2563eb"] },
];
const ATS_TIPS = [
  "Add measurable achievements (e.g. Increased revenue by 40%)",
  "Include more industry-specific keywords from job descriptions",
  "Start every bullet point with a strong action verb",
  "Add a professional summary section at the top",
  "Ensure consistent date formatting throughout",
  "Include relevant certifications and technical skills",
];
const AI_BULLETS = [
  "• Architected microservices platform reducing system latency by 45% across 12 services",
  "• Led team of 6 engineers to deliver \$2M product feature 3 weeks ahead of schedule",
  "• Optimized PostgreSQL queries improving application response time by 60%",
  "• Implemented CI/CD pipelines cutting deployment time from 2 hours to 15 minutes",
];
const SKILL_SETS = {
  "Software Engineer": ["TypeScript","React","Node.js","PostgreSQL","Docker","AWS","GraphQL","Redis"],
  "Product Manager":   ["Roadmapping","Agile","Jira","Analytics","A/B Testing","SQL","Figma","OKRs"],
  "Data Scientist":    ["Python","TensorFlow","Pandas","SQL","Tableau","Machine Learning","Statistics","Spark"],
};

const FU = {
  hidden:  { opacity:0, y:40 },
  visible: (i=0) => ({ opacity:1, y:0, transition:{ duration:0.65, delay:i*0.1, ease:[0.22,1,0.36,1] } }),
};

function AnimatedDivider({ variant = "orbs" }) {
  if (variant === "stats") {
    const stats = [["500K+","Resumes Built"],["92%","ATS Pass Rate"],["3x","More Interviews"],["4.9★","User Rating"]];
    return (
      <div className="relative overflow-hidden py-6" style={{background:"linear-gradient(90deg,#fdfbf7,#faf5ed,#fdfbf7)"}}>
        <div className="absolute inset-0" style={{backgroundImage:"linear-gradient(rgba(159,18,57,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(159,18,57,0.06) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(([val,label],i)=>(
              <motion.div key={label}
                initial={{opacity:0,y:20,rotateX:30}} whileInView={{opacity:1,y:0,rotateX:0}}
                viewport={{once:true}} transition={{delay:i*0.1,duration:0.6}}
                whileHover={{scale:1.08,rotateY:5,boxShadow:"0 20px 40px rgba(159,18,57,0.3)"}}
                style={{transformStyle:"preserve-3d",background:"rgba(74,14,46,0.6)",border:"1px solid rgba(159,18,57,0.2)",borderRadius:"1rem",padding:"1.25rem",textAlign:"center",cursor:"default"}}>
                <div className="text-3xl font-black text-[#4a0e2e] mb-1" style={{textShadow:"0 0 20px rgba(159,18,57,0.6)"}}>{val}</div>
                <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "floating-cards") {
    const cards = [
      {icon:"🎯",label:"ATS Optimized",color:"#e11d48"},
      {icon:"🤖",label:"AI-Powered",color:"#be123c"},
      {icon:"📄",label:"PDF Export",color:"#10b981"},
      {icon:"⚡",label:"Instant Results",color:"#f59e0b"},
      {icon:"🔒",label:"Secure & Private",color:"#f43f5e"},
    ];
    return (
      <div className="relative overflow-hidden py-8" style={{background:"transparent"}}>
        <div className="flex justify-center gap-4 flex-wrap px-6 sm:px-8 lg:px-12">
          {cards.map((c,i)=>(
            <motion.div key={c.label}
              animate={{y:[0,-8,0]}} transition={{duration:2.5+i*0.4,repeat:Infinity,ease:"easeInOut",delay:i*0.3}}
              whileHover={{scale:1.15,rotateZ:3,boxShadow:`0 20px 40px ${c.color}44`}}
              style={{background:`rgba(74,14,46,0.05)`,border:`1px solid ${c.color}44`,borderRadius:"1rem",padding:"0.875rem 1.25rem",display:"flex",alignItems:"center",gap:"0.5rem",cursor:"default",backdropFilter:"blur(10px)"}}>
              <span style={{fontSize:"1.25rem"}}>{c.icon}</span>
              <span style={{fontSize:"0.8rem",fontWeight:700,color:c.color}}>{c.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className="relative overflow-hidden my-12" style={{height:80,background:"transparent"}}>
        {[0,1,2].map(i=>(
          <motion.div key={i}
            animate={{x:["-100%","100%"]}} transition={{duration:8+i*2,repeat:Infinity,ease:"linear",delay:i*1.5}}
            className="absolute inset-0 pointer-events-none"
            style={{background:`linear-gradient(90deg,transparent,rgba(${i===0?"99,102,241":i===1?"139,92,246":"6,182,212"},0.15),transparent)`,height:"100%"}}>
          </motion.div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center gap-3">
          {Array.from({length:12}).map((_,i)=>(
            <motion.div key={i}
              animate={{scaleY:[0.3,1,0.3],opacity:[0.3,1,0.3]}}
              transition={{duration:1.2,repeat:Infinity,delay:i*0.1,ease:"easeInOut"}}
              style={{width:3,height:32,borderRadius:2,background:`hsl(${240+i*8},80%,65%)`,transformOrigin:"center"}}/>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "tech-grid") {
    const items = ["React","Node.js","Python","AWS","Docker","TypeScript","GraphQL","PostgreSQL","Redis","Kubernetes"];
    return (
      <div className="relative overflow-hidden py-6" style={{background:"transparent"}}>
        <div className="flex justify-center gap-3 flex-wrap px-6 sm:px-8 lg:px-12 opacity-60">
          {items.map((tech,i)=>(
            <motion.span key={tech}
              initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}}
              viewport={{once:true}} transition={{delay:i*0.05}}
              whileHover={{opacity:1,scale:1.1,color:"#4a0e2e"}}
              style={{fontSize:"0.75rem",fontWeight:700,color:"rgba(148,163,184,0.7)",padding:"0.375rem 0.875rem",borderRadius:"2rem",border:"1px solid rgba(74,14,46,0.1)",background:"rgba(74,14,46,0.03)",cursor:"default"}}>
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  
  return (
    <div className="relative overflow-hidden" style={{height:60,background:"transparent"}}>
      {[
        {color:"rgba(159,18,57,0.4)",size:120,x:"20%",dur:6},
        {color:"rgba(190,18,60,0.3)",size:100,x:"50%",dur:8},
        {color:"rgba(225,29,72,0.3)",size:90,x:"80%",dur:7},
      ].map((o,i)=>(
        <motion.div key={i}
          animate={{scale:[1,1.4,1],opacity:[0.2,0.5,0.2]}}
          transition={{duration:o.dur,repeat:Infinity,delay:i*1.5}}
          className="absolute rounded-full blur-2xl pointer-events-none"
          style={{width:o.size,height:o.size,background:o.color,left:o.x,top:"50%",transform:"translate(-50%,-50%)"}}/>
      ))}
    </div>
  );
}

function computeHeroStats(user) {
  
  let resumeData = null;
  try {
    const userKey = user && (user.email || user.username || user.name)
      ? `resume_builder_data_${(user.email || user.username || user.name).replace(/\s+/g,"_").toLowerCase()}`
      : null;
    const raw = (userKey && localStorage.getItem(userKey)) || localStorage.getItem("resume_builder_data");
    if (raw) {
      const parsed = JSON.parse(raw);
      
      if (parsed && (parsed.name || parsed.email || (parsed.skills && parsed.skills.length > 0))) {
        resumeData = parsed;
      }
    }
  } catch (_) {}

  
  
  const displayName = (resumeData && resumeData.name)
    || (user && user.displayName)
    || (user && user.name && !user.name.includes("@") && !/\d{4,}/.test(user.name) ? user.name : null)
    || null;

  
  const displayRole = (resumeData && resumeData.title)
    || (resumeData && resumeData.summary && resumeData.summary.split(" ").slice(0,6).join(" ") + "...")
    || (user && user.role)
    || null;

  
  let ats = 0;
  if (resumeData) {
    const ATS_KEYWORDS = ["led","managed","developed","built","designed","implemented","optimized","increased","reduced","improved","collaborated","delivered","launched","architected","scaled","automated","deployed","integrated","mentored","results","impact","metrics","performance","agile","scrum"];
    const txt = [
      resumeData.summary || "",
      ...(resumeData.experience || []).map(e => e.description || ""),
      ...(resumeData.projects   || []).map(p => p.description || ""),
      (resumeData.skills || []).join(" "),
    ].join(" ").toLowerCase();

    if (resumeData.name)     ats += 5;
    if (resumeData.title)    ats += 5;
    if (resumeData.email)    ats += 3;
    if (resumeData.phone)    ats += 3;
    if (resumeData.location) ats += 2;
    if ((resumeData.summary || "").length > 50)  ats += 8;
    if ((resumeData.skills  || []).length >= 5)  ats += 7;
    if ((resumeData.experience || []).length >= 1) ats += 7;
    ats += Math.min(30, ATS_KEYWORDS.filter(k => txt.includes(k)).length * 2);
    if ((resumeData.summary || "").length > 100) ats += 5;
    if ((resumeData.experience || []).some(e => /\d+%|\d+x/.test(e.description || ""))) ats += 10;
    if ((resumeData.education || []).length >= 1)       ats += 5;
    if ((resumeData.certifications || []).length >= 1)  ats += 5;
    if ((resumeData.projects || []).length >= 2)        ats += 5;
    ats = Math.min(100, ats);
  }

  
  let suggestions = 0;
  if (resumeData) {
    if (!resumeData.summary || resumeData.summary.length < 80) suggestions++;
    if ((resumeData.skills || []).length < 5) suggestions++;
    if ((resumeData.experience || []).some(e => !(e.description || "").includes("•"))) suggestions++;
    if (!(resumeData.linkedin || resumeData.github)) suggestions++;
    if ((resumeData.certifications || []).length === 0) suggestions++;
  } else {
    suggestions = 3; 
  }

  
  const realSkills  = (resumeData?.skills || []).filter(s => s && s.trim().length > 0);
  const realExp     = (resumeData?.experience || []).filter(e => e.role || e.company || e.description);
  const realProj    = (resumeData?.projects || []).filter(p => p.name || p.description);
  const realEdu     = (resumeData?.education || []).filter(e => e.degree || e.institution);

  const sections = [
    { label: "SKILLS",     color: "#9f1239", fill: resumeData ? Math.min(100, (realSkills.length  / 8) * 100) : 100 },
    { label: "EXPERIENCE", color: "#be123c", fill: resumeData ? Math.min(100, (realExp.length     / 3) * 100) : 80  },
    { label: "PROJECTS",   color: "#e11d48", fill: resumeData ? Math.min(100, (realProj.length    / 3) * 100) : 75  },
    { label: "EDUCATION",  color: "#10b981", fill: resumeData ? Math.min(100, (realEdu.length     / 2) * 100) : 65  },
  ];

  return { displayName, displayRole, ats, suggestions, sections, hasResume: !!resumeData };
}

function Hero({ onBuild, user, heroStats: heroStatsProp }) {
  const [idx,setIdx]=useState(0);
  const [disp,setDisp]=useState("");
  const [typing,setTyping]=useState(true);
  const cr=useRef(0);
  const phrases=["Software Engineer","Product Manager","Data Scientist","UX Designer","DevOps Engineer"];

  
  const [localStats, setLocalStats] = useState(() => heroStatsProp || computeHeroStats(user));
  const stats = heroStatsProp || localStats;

  useEffect(() => {
    
    if (heroStatsProp) setLocalStats(heroStatsProp);
  }, [heroStatsProp]);

  useEffect(() => {
    
    const handler = () => setLocalStats(computeHeroStats(user));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [user]);

  
  const isLoggedIn = !!(user && (user.name || user.username || user.email));

  
  const rawUserName = user && (user.name || user.username || "");
  const cleanUserName = rawUserName
    .replace(/[0-9@._+\-]+/g, " ")   
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  const heroName = stats.displayName
    || (cleanUserName.length > 1 ? cleanUserName : null)
    || "Your Name";

  const heroRole = stats.displayRole
    || (isLoggedIn ? "Upload your resume to get started" : "Software Engineer");

  const heroInitials = heroName === "Your Name" ? "?"
    : heroName.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  const atsScore   = stats.hasResume ? stats.ats : (isLoggedIn ? 0 : 92);
  const atsLabel   = atsScore >= 75 ? "Excellent ✓" : atsScore >= 50 ? "Good" : atsScore > 0 ? "Needs Work" : "Upload Resume";
  const atsColor   = atsScore >= 75 ? "#10b981" : atsScore >= 50 ? "#f59e0b" : "#9f1239";
  const suggCount  = stats.suggestions;
  const suggLabel  = suggCount === 0 ? "All good! ✓" : `${suggCount} improvement${suggCount !== 1 ? "s" : ""}`;
  const suggColor  = suggCount === 0 ? "#10b981" : "#9f1239";
  useEffect(()=>{
    const p=phrases[idx];
    if(typing){
      if(cr.current<p.length){const t=setTimeout(()=>{setDisp(p.slice(0,cr.current+1));cr.current++;},75);return()=>clearTimeout(t);}
      else{const t=setTimeout(()=>setTyping(false),2200);return()=>clearTimeout(t);}
    }else{
      if(cr.current>0){const t=setTimeout(()=>{setDisp(p.slice(0,cr.current-1));cr.current--;},35);return()=>clearTimeout(t);}
      else{setIdx(i=>(i+1)%phrases.length);setTyping(true);}
    }
  },[disp,typing,idx]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {}
      {}
      <motion.div animate={{scale:[1,1.3,1],opacity:[0.15,0.3,0.15]}} transition={{duration:7,repeat:Infinity}} className="absolute top-1/4 left-1/5 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{background:"radial-gradient(circle,rgba(159,18,57,0.5),transparent)"}}/>
      <motion.div animate={{scale:[1,1.2,1],opacity:[0.1,0.25,0.1]}} transition={{duration:9,repeat:Infinity,delay:2}} className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{background:"radial-gradient(circle,rgba(190,18,60,0.5),transparent)"}}/>
      <motion.div animate={{scale:[1,1.15,1],opacity:[0.08,0.2,0.08]}} transition={{duration:11,repeat:Infinity,delay:4}} className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{background:"radial-gradient(circle,rgba(225,29,72,0.4),transparent)"}}/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {}
          <div className="lg:col-start-2 lg:col-span-6">
            <br></br>
            <div className="flex justify-start mb-6">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-700 text-sm font-semibold whitespace-nowrap" style={{padding:"6px 20px",width:"fit-content",maxWidth:"100%",margin:"0"}}>
              <motion.span animate={{scale:[1,1.4,1]}} transition={{duration:2,repeat:Infinity}} className="w-2 h-2 rounded-full bg-rose-300 inline-block flex-shrink-0"/>
              AI-Powered Resume Builder
            </motion.div>
          </div>
           
            <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.1}} className="text-5xl lg:text-7xl font-black text-[#4a0e2e] leading-[1.1] tracking-tight mb-2">
              Create a CV that<br/>
              <span style={{background:"linear-gradient(135deg,#fde68a,#fca5a5,#fbcfe8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>gets you hired</span>
            </motion.h1>
            <br></br>
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.2}} className="text-xl text-rose-600 mt-4 mb-1 font-medium leading-loose">
              Perfect for <span className="text-[#4a0e2e] font-bold border-r-2 border-rose-300 pr-1">{disp}</span>
            </motion.div>
            <br></br>
            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.3}} className="text-lg text-slate-600 mb-4 max-w-xl" style={{lineHeight:"1.85"}}>
              Only <span className="text-rose-400 font-bold">2% of resumes</span> get selected. Our AI ensures yours is in that 2% — with ATS optimization, smart suggestions, and stunning templates.
            </motion.p>
            {}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.35}} className="flex gap-12 mb-6">
              {[["500K+","Resumes Created"],["92%","ATS Pass Rate"],["3x","More Interviews"]].map(([v,l])=>(
                <motion.div key={l} whileHover={{y:-4}} className="cursor-default">
                  <div className="text-4xl font-black text-[#4a0e2e] leading-tight">{v}</div>
                  <div className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">{l}</div>
                </motion.div>
              ))}
            </motion.div>
            {}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.4}} className="mt-6 mb-6">
              <br></br><motion.button whileHover={{scale:1.05,boxShadow:"0 20px 50px rgba(159,18,57,0.6)"}} whileTap={{scale:0.97}} onClick={onBuild}
                className="inline-flex items-center gap-2 rounded-2xl text-[#fdfbf7] font-bold text-lg transition-all"
                style={{background:"linear-gradient(135deg,#9f1239,#be123c)",color:"#fdfbf7",boxShadow:"0 8px 24px rgba(159,18,57,0.4)",padding:"8px 18px",width:"fit-content"}}>
                ✨ Create Professional CV    
              </motion.button>
            </motion.div>
            <br></br>
            {}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.6,delay:0.5}} className="mt-6">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-4">Trusted by candidates at</p>
              <div className="flex flex-nowrap gap-3 mt-1 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
                {COMPANIES.map((c,i)=>(
                  <motion.div key={c} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.5+i*0.04}}
                    whileHover={{scale:1.1,background:"rgba(74,14,46,0.1)",color:"#4a0e2e"}}
                    className="rounded-full border border-[#4a0e2e]/15 text-slate-600 text-sm font-bold transition-all cursor-default"
                    style={{background:"#f0e9e9",padding:"8px 18px"}}>
                    {c}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {}
          <div className="relative hidden lg:flex items-center justify-center lg:col-span-5">
            <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:0.9,delay:0.3}}>
              {}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-80" style={{boxShadow:"0 40px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(74,14,46,0.1)"}}>
                <div className="h-24 flex items-center px-12 lg:px-16 gap-4" style={{background:"linear-gradient(135deg,#9f1239,#be123c)",color:"#fdfbf7"}}>
                  <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center text-[#4a0e2e] text-xl font-black flex-shrink-0"
                    style={{letterSpacing:"-0.5px"}}>
                    {heroInitials}
                  </div>
                  <div style={{overflow:"hidden"}}>
                    <div className="text-[#fdfbf7] font-bold text-lg leading-tight truncate" style={{maxWidth:180}}>{heroName}</div>
                    <div className="text-rose-600 text-sm truncate" style={{maxWidth:180}}>{heroRole}</div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {stats.sections.map(({label,color,fill})=>(
                    <div key={label}>
                      <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color}}>{label}</div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{width:0}}
                          animate={{width:`${fill}%`}}
                          transition={{duration:1.2,ease:"easeOut",delay:0.5}}
                          className="h-full rounded-full"
                          style={{background:`linear-gradient(90deg,${color},${color}88)`}}
                        />
                      </div>
                    </div>
                  ))}
                  {isLoggedIn && !stats.hasResume && (
                    <div className="text-center pt-2">
                      <span className="text-xs text-gray-400 font-medium">Upload your resume to see live data</span>
                    </div>
                  )}
                </div>
              </div>

              {}
              <motion.div animate={{y:[0,-8,0]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}
                className="absolute -top-8 -right-8 bg-white rounded-2xl px-5 py-4 shadow-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#4a0e2e] font-black text-lg flex-shrink-0"
                  style={{background:`linear-gradient(135deg,${atsColor},${atsColor}cc)`}}>
                  {stats.hasResume ? atsScore : (isLoggedIn ? "—" : 92)}
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold">ATS Score</div>
                  <div className="text-sm font-bold" style={{color:atsColor}}>{atsLabel}</div>
                </div>
              </motion.div>

              {}
              <motion.div animate={{y:[0,8,0]}} transition={{duration:3.5,repeat:Infinity,ease:"easeInOut",delay:0.5}}
                className="absolute -bottom-6 -left-8 bg-white rounded-2xl px-5 py-4 shadow-2xl border border-gray-100 flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">🤖</span>
                <div>
                  <div className="text-xs text-gray-400 font-semibold">AI Suggestions</div>
                  <div className="text-sm font-bold" style={{color:suggColor}}>{suggLabel}</div>
                </div>
              </motion.div>

              {}
              <motion.div animate={{y:[0,-6,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut",delay:1}}
                className="absolute top-1/2 -right-14 bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100 text-center">
                {stats.hasResume ? (
                  <>
                    <div className="text-2xl font-black" style={{color:"#9f1239"}}>{stats.sections[0]?.fill > 0 ? Math.round(stats.sections[0].fill / 12.5) : "—"}</div>
                    <div className="text-xs text-gray-400 font-semibold">Skills</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-black text-rose-600">{isLoggedIn ? "—" : "98%"}</div>
                    <div className="text-xs text-gray-400 font-semibold">Job Match</div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const ref=useRef(null); const iv=useInView(ref,{once:true,margin:"-80px"});
  const [activeFeature,setActiveFeature]=useState(null);
  return (
    <section ref={ref} className="relative py-16 overflow-hidden" style={{background:"transparent"}}>

      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{background:"radial-gradient(circle,#9f1239,transparent)"}}/>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{background:"radial-gradient(circle,#be123c,transparent)"}}/>
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 max-w-6xl mx-auto">
          {[["500K+","Resumes Built"],["92%","ATS Pass Rate"],["3x","More Interviews"],["4.9★","User Rating"]].map(([val,label],i)=>(
            <motion.div key={label}
              initial={{opacity:0,y:20,rotateX:30}} animate={iv?{opacity:1,y:0,rotateX:0}:{}}
              transition={{delay:i*0.1,duration:0.6}}
              whileHover={{scale:1.08,rotateY:5,boxShadow:"0 20px 40px rgba(159,18,57,0.3)"}}
              style={{transformStyle:"preserve-3d",background:"transparent",border:"none",borderRadius:"1rem",padding:"1.5rem",textAlign:"center",cursor:"default"}}>
              <div className="text-4xl font-black text-[#4a0e2e] mb-2" style={{textShadow:"0 0 20px rgba(159,18,57,0.6)"}}>{val}</div>
              <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider">{label}</div>
            </motion.div>
          ))}
        </div>
        <motion.div initial="hidden" animate={iv?"visible":"hidden"} variants={FU} className="text-center mb-12">
          <br></br><br></br><br></br><br></br><div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-700 text-sm font-semibold whitespace-nowrap" style={{padding:"6px 20px",width:"fit-content",maxWidth:"100%",margin:"0 20px"}}>⚡ Why Choose Us</div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-[#4a0e2e] mb-6 leading-tight  overflow-hidden text-ellipsis">
            <span style={{background:"linear-gradient(135deg,#fde68a,#fbcfe8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Everything you need to land the job</span>
          </h2>
         <br></br> <p className="text-xl text-slate-600 max-w-3xl mx-auto text-center mb-4" style={{lineHeight:"1.85"}}>Four powerful tools working together to make your resume impossible to ignore.</p><br></br>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {FEATURES.map((f,i)=>(
            <motion.div key={i} initial="hidden" animate={iv?"visible":"hidden"} custom={i} variants={FU}
              whileHover={{y:-12,rotateX:3,rotateY:-3,boxShadow:`0 30px 60px ${f.color}44`}}
              className="group relative rounded-3xl border border-[#4a0e2e]/10 backdrop-blur-sm transition-all duration-300"
              style={{background:"#f0e9e9",padding:"48px 36px"}}>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:`radial-gradient(circle at top left,${f.color}12,transparent)`}}/>
              <div className="relative flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-7 transition-transform duration-300 group-hover:scale-110" style={{background:f.bg,border:`1px solid ${f.color}40`}}>{f.icon}</div>
                <h3 className="text-xl font-bold text-[#4a0e2e] mb-5 leading-snug">{f.title}</h3>
                <p className="text-slate-600 text-sm flex-grow" style={{lineHeight:"1.4"}}>{f.desc}</p>
                <button type="button" onClick={()=>setActiveFeature(activeFeature===i?null:i)}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold transition-colors duration-200 cursor-pointer"
                  style={{color:f.color,textDecoration:"none"}}>
                  {activeFeature===i ? "Hide details →" :"Learn more →"}
                </button>
                {activeFeature===i && (
                  <motion.p initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25}} className="text-slate-700 text-sm mt-4" style={{lineHeight:"1.8"}}>
                    {f.more}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ onBuild }) {
  const ref=useRef(null); const iv=useInView(ref,{once:true,margin:"-80px"});
  return (
    <section ref={ref} className="relative py-16 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 pointer-events-none" style={{background:"radial-gradient(circle,#be123c,transparent)"}}/>
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <motion.div initial="hidden" animate={iv?"visible":"hidden"} variants={FU}>
              <br></br><br></br><br></br><br></br><br></br><br></br><div className="flex justify-start mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-700 text-sm font-semibold whitespace-nowrap" style={{padding:"6px 20px",width:"fit-content",maxWidth:"100%",margin:"0"}}>🗺️ Simple Process</div>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-[#4a0e2e] mb-6 leading-tight">
                Build your resume in<br/>
                <span style={{background:"linear-gradient(135deg,#fbcfe8,#fde68a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>3 easy steps</span>
              </h2>
              <br></br><p className="text-lg text-slate-600 mb-10 leading-relaxed">From blank page to interview-ready resume in under 10 minutes.</p><br></br>
            </motion.div>
            <div className="space-y-8">
              {STEPS.map((s,i)=>(
                <motion.div key={i} initial="hidden" animate={iv?"visible":"hidden"} custom={i+1} variants={FU} className="relative flex items-start gap-7">
                  {i<STEPS.length-1&&<div className="absolute left-7 top-16 w-0.5 h-12 bg-gradient-to-b from-indigo-500/40 to-transparent"/>}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#4a0e2e] font-black text-lg flex-shrink-0 shadow-lg" style={{background:"linear-gradient(135deg,#9f1239,#be123c)",color:"#fdfbf7",boxShadow:"0 8px 24px rgba(159,18,57,0.4)"}}>{s.n}</div>
                  <div className="pt-1">
                    <div className="flex items-center gap-3 mb-2"><span className="text-2xl">{s.icon}</span><h3 className="text-xl font-bold text-[#4a0e2e]">{s.title}</h3></div>
                    <p className="text-slate-600 leading-[1.85]">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div initial="hidden" animate={iv?"visible":"hidden"} custom={4} variants={FU} className="mt-14">
              <motion.button whileHover={{scale:1.05,boxShadow:"0 20px 40px rgba(159,18,57,0.4)"}} whileTap={{scale:0.95}} onClick={onBuild}
                className="inline-flex items-center gap-2 rounded-2xl text-[#fdfbf7] font-bold text-lg shadow-xl transition-all"
                style={{background:"linear-gradient(135deg,#9f1239,#be123c)",color:"#fdfbf7",padding:"8px 18px",width:"fit-content"}}>Start Building Now →</motion.button><br></br>
            </motion.div>
          </div>
          <motion.div initial={{opacity:0,x:40}} animate={iv?{opacity:1,x:0}:{}} transition={{duration:0.8,delay:0.3}} className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-96">
              {}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{scale:[1,1.1,1],rotate:[0,5,-5,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}} className="relative w-64 h-64 rounded-3xl border-2 border-rose-500/30 flex items-center justify-center" style={{background:"linear-gradient(135deg,rgba(159,18,57,0.1),rgba(190,18,60,0.05))"}}>
                  <div className="text-center">
                    <motion.div animate={{y:[0,-10,0]}} transition={{duration:2,repeat:Infinity}} className="text-6xl mb-4">📄</motion.div>
                    <div className="text-sm font-bold text-[#4a0e2e] mb-2">Smart Resume</div>
                    <div className="text-xs text-slate-600">Powered by AI</div>
                  </div><br></br>
                  {}
                  {[0,1,2,3,4].map(i=>(
                    <motion.div key={i} animate={{x:[0,Math.cos(i*Math.PI/2.5)*60,0],y:[0,Math.sin(i*Math.PI/2.5)*60,0]}} transition={{duration:3+i*0.5,repeat:Infinity,ease:"easeInOut"}} className="absolute w-3 h-3 rounded-full" style={{background:"rgba(159,18,57,0.6)",left:"50%",top:"50%",marginLeft:"-6px",marginTop:"-6px"}}/>
                  ))}
                </motion.div>
              </div>
              <br></br>
              {}
              <motion.div animate={{y:[0,-20,0]}} transition={{duration:3,repeat:Infinity}} className="absolute top-0 left-0 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-sm font-bold text-amber-300">
                ✓ Step 1: Template
              </motion.div>
              <motion.div animate={{y:[0,-20,0]}} transition={{duration:3,repeat:Infinity,delay:1}} className="absolute top-1/3 right-0 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-sm font-bold text-rose-700">
                ✓ Step 2: Fill & Improve
              </motion.div>
              <motion.div animate={{y:[0,-20,0]}} transition={{duration:3,repeat:Infinity,delay:2}} className="absolute bottom-0 left-1/4 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-sm font-bold text-pink-200">
                ✓ Step 3: Download
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <br></br>
      <br></br>
    </section>
  );
}

<br></br>
const TEMPLATE_DESIGNS = [
  { id:"modern-pro",    name:"Modern Pro",    cat:"Professional", badge:"🔥 Popular",  accent:"#9f1239", dark:"#4f46e5", layout:"sidebar"   },
  { id:"executive",     name:"Executive",     cat:"Corporate",    badge:"💼 Premium",  accent:"#0f172a", dark:"#1e293b", layout:"top-bar"   },
  { id:"creative",      name:"Creative",      cat:"Design",       badge:"✨ Trending", accent:"#f43f5e", dark:"#e11d48", layout:"diagonal"  },
  { id:"minimal",       name:"Minimal",       cat:"Clean",        badge:"�� Clean",    accent:"#10b981", dark:"#059669", layout:"minimal"   },
  { id:"classic",       name:"Classic",       cat:"Traditional",  badge:"⭐ Timeless", accent:"#1e40af", dark:"#1d4ed8", layout:"top-bar"   },
  { id:"tech-dark",     name:"Tech Dark",     cat:"Technology",   badge:"💻 Dev",      accent:"#22d3ee", dark:"#0891b2", layout:"dark"      },
  { id:"elegant",       name:"Elegant",       cat:"Luxury",       badge:"👑 Elite",    accent:"#b45309", dark:"#92400e", layout:"elegant"   },
  { id:"bold-impact",   name:"Bold Impact",   cat:"Marketing",    badge:"⚡ Bold",     accent:"#7c3aed", dark:"#6d28d9", layout:"sidebar"   },
  { id:"nordic",        name:"Nordic",        cat:"Scandinavian", badge:"❄️ Fresh",    accent:"#0ea5e9", dark:"#0284c7", layout:"top-bar"   },
  { id:"startup",       name:"Startup",       cat:"Tech Startup", badge:"🚀 Agile",    accent:"#f97316", dark:"#ea580c", layout:"sidebar"   },
  { id:"academic",      name:"Academic",      cat:"Research",     badge:"🎓 Scholar",  accent:"#4f46e5", dark:"#4338ca", layout:"top-bar"   },
  { id:"medical",       name:"Medical",       cat:"Healthcare",   badge:"🏥 Health",   accent:"#0891b2", dark:"#0e7490", layout:"sidebar"   },
  { id:"finance",       name:"Finance",       cat:"Banking",      badge:"💰 Finance",  accent:"#166534", dark:"#15803d", layout:"top-bar"   },
  { id:"artist",        name:"Artist",        cat:"Creative Arts",badge:"🎨 Art",      accent:"#db2777", dark:"#be185d", layout:"sidebar"   },
  { id:"legal-pro",     name:"Legal Pro",     cat:"Law",          badge:"⚖️ Legal",    accent:"#1c1917", dark:"#292524", layout:"elegant"   },
  { id:"educator",      name:"Educator",      cat:"Education",    badge:"📚 Edu",      accent:"#0369a1", dark:"#0284c7", layout:"sidebar"   },
  { id:"engineer",      name:"Engineer",      cat:"Engineering",  badge:"⚙️ Eng",      accent:"#374151", dark:"#4b5563", layout:"top-bar"   },
  { id:"neon-glow",     name:"Neon Glow",     cat:"Futuristic",   badge:"�� Neon",     accent:"#a855f7", dark:"#9333ea", layout:"dark"      },
  { id:"pastel-dream",  name:"Pastel Dream",  cat:"Soft",         badge:"🌸 Soft",     accent:"#ec4899", dark:"#db2777", layout:"minimal"   },
  { id:"retro",         name:"Retro",         cat:"Vintage",      badge:"📻 Retro",    accent:"#d97706", dark:"#b45309", layout:"elegant"   },
  { id:"glassmorphism", name:"Glass",         cat:"Modern",       badge:"💎 Glass",    accent:"#818cf8", dark:"#9f1239", layout:"glass"     },
  { id:"newspaper",     name:"Newspaper",     cat:"Editorial",    badge:"📰 Press",    accent:"#dc2626", dark:"#b91c1c", layout:"elegant"   },
];

const TMPL_CATS = ["All","Professional","Corporate","Design","Technology","Clean","Traditional","Luxury","Marketing","Healthcare","Education","Futuristic"];
<br></br>

function MiniResume({ t }) {
  const { accent, dark, layout } = t;
  const Line = ({ w="100%", h=5, color, mt=0, mb=3, r=3 }) => (
    <div style={{ width:w, height:h, background:color||"rgba(0,0,0,0.12)", borderRadius:r, marginTop:mt, marginBottom:mb }}/>
  );
  const Dot = ({ c }) => <div style={{ width:7, height:7, borderRadius:"50%", background:c||accent, flexShrink:0 }}/>;

  if (layout === "sidebar") {
    return (
      <div style={{ display:"flex", height:"100%", background:"#fff", borderRadius:6, overflow:"hidden" }}>
        <div style={{ width:"36%", background:accent, padding:"10px 6px", display:"flex", flexDirection:"column", gap:5 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(74,14,46,0.3)", margin:"0 auto 4px" }}/>
          <Line w="80%" h={4} color="rgba(74,14,46,0.7)" mb={2}/>
          <Line w="60%" h={3} color="rgba(74,14,46,0.4)" mb={8}/>
          {["SKILLS","CONTACT","LINKS"].map(s=>(
            <div key={s} style={{ marginBottom:5 }}>
              <div style={{ fontSize:5, color:"rgba(74,14,46,0.5)", fontWeight:700, letterSpacing:1, marginBottom:3 }}>{s}</div>
              {[80,65,50].map((w,i)=><Line key={i} w={w+"%"} h={3} color="rgba(74,14,46,0.3)" mb={2}/>)}
            </div>
          ))}
        </div>
        <div style={{ flex:1, padding:"10px 8px", display:"flex", flexDirection:"column", gap:4 }}>
          <Line w="85%" h={7} color={accent} mb={2}/>
          <Line w="60%" h={4} color={accent+"88"} mb={6}/>
          {["EXPERIENCE","EDUCATION","PROJECTS"].map(s=>(
            <div key={s} style={{ marginBottom:5 }}>
              <div style={{ fontSize:5, color:accent, fontWeight:700, letterSpacing:1, marginBottom:3, borderBottom:"1px solid "+accent+"44", paddingBottom:2 }}>{s}</div>
              <Line w="90%" h={3} mb={2}/><Line w="75%" h={3} mb={2}/><Line w="60%" h={3}/>
            </div>
          ))}
        </div>
      </div>
    );
    <br></br>
  }

  if (layout === "top-bar") {
    return (
      <div style={{ height:"100%", background:"#fff", borderRadius:6, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <div style={{ background:accent, padding:"10px 10px 8px", marginBottom:6 }}>
          <Line w="70%" h={7} color="rgba(74,14,46,0.9)" mb={3}/>
          <Line w="50%" h={4} color="rgba(74,14,46,0.6)" mb={4}/>
          <div style={{ display:"flex", gap:8 }}>
            {["✉","📞","📍"].map((ic,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:2 }}><span style={{ fontSize:6, color:"rgba(74,14,46,0.7)" }}>{ic}</span><Line w={28} h={3} color="rgba(74,14,46,0.5)" mb={0}/></div>)}
          </div>
        </div>
        <div style={{ flex:1, padding:"0 10px", display:"flex", flexDirection:"column", gap:5 }}>
          {["SUMMARY","EXPERIENCE","EDUCATION","SKILLS"].map(s=>(
            <div key={s}>
              <div style={{ fontSize:5, color:accent, fontWeight:700, letterSpacing:1, marginBottom:3, borderBottom:"1.5px solid "+accent, paddingBottom:2 }}>{s}</div>
              <Line w="95%" h={3} mb={2}/><Line w="80%" h={3} mb={2}/><Line w="65%" h={3}/>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (layout === "minimal") {
    return (
      <div style={{ height:"100%", background:"#fafafa", borderRadius:6, overflow:"hidden", padding:"12px 10px", display:"flex", flexDirection:"column", gap:5 }}>
        <div style={{ borderLeft:"3px solid "+accent, paddingLeft:8, marginBottom:5 }}>
          <Line w="70%" h={7} color="#111" mb={3}/>
          <Line w="45%" h={4} color={accent} mb={3}/>
          <div style={{ display:"flex", gap:6 }}><Line w="28%" h={3} mb={0}/><Line w="28%" h={3} mb={0}/><Line w="22%" h={3} mb={0}/></div>
        </div>
        <div style={{ height:1.5, background:accent, marginBottom:4 }}/>
        {["ABOUT","EXPERIENCE","SKILLS","EDUCATION"].map(s=>(
          <div key={s}>
            <div style={{ fontSize:5, color:"#999", fontWeight:700, letterSpacing:1.5, marginBottom:3 }}>{s}</div>
            <Line w="90%" h={3} mb={2}/><Line w="70%" h={3} mb={2}/><Line w="55%" h={3}/>
          </div>
        ))}
      </div>
    );
  }
  if (layout === "dark") {
    return (
      <div style={{ height:"100%", background:"#0f172a", borderRadius:6, overflow:"hidden", display:"flex" }}>
        <div style={{ width:"38%", background:"#1e293b", padding:"10px 6px", display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,"+accent+","+dark+")", margin:"0 auto 4px", boxShadow:"0 0 10px "+accent+"66" }}/>
          <Line w="80%" h={4} color={accent} mb={2}/>
          <Line w="60%" h={3} color="#475569" mb={6}/>
          {["SKILLS","TOOLS","LINKS"].map(s=>(
            <div key={s} style={{ marginBottom:4 }}>
              <div style={{ fontSize:5, color:accent, fontWeight:700, letterSpacing:1, marginBottom:3 }}>{s}</div>
              {[75,60,45].map((w,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:3, marginBottom:2 }}><Dot c={accent}/><Line w={w+"%"} h={3} color="#334155" mb={0}/></div>)}
            </div>
          ))}
        </div>
        <div style={{ flex:1, padding:"10px 8px", display:"flex", flexDirection:"column", gap:4 }}>
          <Line w="85%" h={6} color={accent} mb={2}/>
          <Line w="55%" h={3} color="#475569" mb={5}/>
          {["EXPERIENCE","PROJECTS","EDUCATION"].map(s=>(
            <div key={s} style={{ marginBottom:4 }}>
              <div style={{ fontSize:5, color:accent, fontWeight:700, letterSpacing:1, marginBottom:3, borderBottom:"1px solid "+accent+"33", paddingBottom:2 }}>{s}</div>
              <Line w="90%" h={3} color="#334155" mb={2}/><Line w="70%" h={3} color="#334155" mb={2}/><Line w="55%" h={3} color="#334155"/>
            </div>
          ))}
        </div>
      </div>
    );
    <br></br>
  }
  if (layout === "diagonal") {
    return (
      <div style={{ height:"100%", background:"#fff1f2", borderRadius:6, overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"42%", background:"linear-gradient(135deg,"+accent+","+dark+")", clipPath:"polygon(0 0,100% 0,100% 65%,0 100%)" }}/>
        <div style={{ position:"relative", zIndex:1, padding:"10px 10px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(74,14,46,0.3)", border:"2px solid rgba(74,14,46,0.6)", flexShrink:0 }}/>
            <div><Line w={68} h={6} color="rgba(74,14,46,0.9)" mb={2}/><Line w={48} h={3} color="rgba(74,14,46,0.6)" mb={0}/></div>
          </div>
        </div>
        <div style={{ padding:"48px 10px 8px", display:"flex", flexDirection:"column", gap:5 }}>
          {["EXPERIENCE","SKILLS","EDUCATION"].map(s=>(
            <div key={s}>
              <div style={{ fontSize:5, color:accent, fontWeight:700, letterSpacing:1, marginBottom:3 }}>{s}</div>
              <Line w="90%" h={3} mb={2}/><Line w="70%" h={3} mb={2}/><Line w="55%" h={3}/>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (layout === "glass") {
    return (
      <div style={{ height:"100%", background:"linear-gradient(135deg,#667eea,#764ba2)", borderRadius:6, overflow:"hidden", padding:"8px" }}>
        <div style={{ background:"rgba(74,14,46,0.15)", backdropFilter:"blur(10px)", borderRadius:6, padding:"8px", marginBottom:5, border:"1px solid rgba(74,14,46,0.3)" }}>
          <Line w="70%" h={6} color="rgba(74,14,46,0.9)" mb={2}/>
          <Line w="50%" h={3} color="rgba(74,14,46,0.6)" mb={3}/>
          <div style={{ display:"flex", gap:4 }}><Line w="28%" h={3} color="rgba(74,14,46,0.5)" mb={0}/><Line w="28%" h={3} color="rgba(74,14,46,0.5)" mb={0}/></div>
        </div>
        {["EXPERIENCE","SKILLS","EDUCATION"].map(s=>(
          <div key={s} style={{ background:"rgba(74,14,46,0.1)", borderRadius:5, padding:"5px 6px", marginBottom:4, border:"1px solid rgba(74,14,46,0.2)" }}>
            <div style={{ fontSize:5, color:"rgba(74,14,46,0.7)", fontWeight:700, letterSpacing:1, marginBottom:3 }}>{s}</div>
            <Line w="85%" h={3} color="rgba(74,14,46,0.4)" mb={2}/><Line w="65%" h={3} color="rgba(74,14,46,0.3)"/>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div style={{ height:"100%", background:"#fffbeb", borderRadius:6, overflow:"hidden", padding:"10px" }}>
      <div style={{ textAlign:"center", borderBottom:"2px solid "+accent, paddingBottom:7, marginBottom:7 }}>
        <Line w="60%" h={7} color="#1c1917" mb={3}/>
        <Line w="40%" h={3} color={accent} mb={3}/>
        <div style={{ display:"flex", justifyContent:"center", gap:5 }}><Line w="22%" h={3} mb={0}/><Line w="22%" h={3} mb={0}/><Line w="18%" h={3} mb={0}/></div>
      </div>
      {["SUMMARY","EXPERIENCE","EDUCATION"].map(s=>(
        <div key={s} style={{ marginBottom:5 }}>
          <div style={{ fontSize:5, fontWeight:700, letterSpacing:2, color:accent, marginBottom:3, borderBottom:"1px solid "+accent+"44", paddingBottom:2 }}>{s}</div>
          <Line w="90%" h={3} mb={2}/><Line w="75%" h={3} mb={2}/><Line w="60%" h={3}/>
        </div>
      ))}
    </div>
  );
}

function TemplatesSection({ onSelect }) {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true, margin:"-80px" });
  const [activeCat, setActiveCat] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x:0, y:0 });

  const filtered = activeCat === "All" ? TEMPLATE_DESIGNS : TEMPLATE_DESIGNS.filter(t => t.cat === activeCat);
  const visible = showAll ? filtered : filtered.slice(0, 8);

  function handleMouseMove(e, id) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePos({ x, y });
    setHovered(id);
  }

  return (
    <section ref={ref} className="relative py-16 overflow-hidden" style={{ background:"transparent" }}>
      {}
      <div className="absolute top-1/3 left-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-10 pointer-events-none -translate-x-1/2" style={{ background:"radial-gradient(ellipse,#f43f5e,transparent)" }}/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        {}
        <motion.div initial="hidden" animate={iv?"visible":"hidden"} variants={FU} className="text-center mb-10">
          <br></br><br></br> <br></br><br></br><div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-800 text-sm font-semibold whitespace-nowrap" style={{padding:"6px 20px",width:"fit-content",maxWidth:"100%",margin:"0 20px"}}>🎨 Professional Templates</div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-[#4a0e2e] mb-6 leading-tight">
            Choose your<br/>
            <span style={{ background:"linear-gradient(135deg,#fca5a5,#f43f5e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>perfect template</span>
          </h2>
         <br></br> <p className="text-xl text-slate-600 max-w-2xl mx-auto" style={{lineHeight:"1.85"}}>22+ professionally designed templates for every industry and style.</p>
        </motion.div><br></br>

        {}
        <motion.div initial={{ opacity:0, y:20 }} animate={iv?{ opacity:1, y:0 }:{}} transition={{ delay:0.2 }} className="flex flex-wrap justify-center gap-2 mb-10">
          {TMPL_CATS.map(cat => (
            <motion.button key={cat} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={() => { setActiveCat(cat); setShowAll(false); }}
              className="rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                padding:"8px 18px",
                background: activeCat === cat ? "linear-gradient(135deg,#9f1239,#be123c)" : "rgba(74,14,46,0.06)",
                color: activeCat === cat ? "#fff" : "rgba(74,14,46,0.5)",
                border: activeCat === cat ? "1px solid #9f1239" : "1px solid rgba(74,14,46,0.1)",
                boxShadow: activeCat === cat ? "0 4px 20px rgba(159,18,57,0.4)" : "none",
              }}>
              {cat}
            </motion.button>
          ))}
        </motion.div>
<br></br>
        {}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          <AnimatePresence mode="popLayout">
            {visible.map((t, i) => (
              <motion.div key={t.id}
                layout
                initial={{ opacity:0, scale:0.85, y:30 }}
                animate={{ opacity:1, scale:1, y:0 }}
                exit={{ opacity:0, scale:0.85, y:30 }}
                transition={{ duration:0.4, delay:i*0.05, ease:[0.22,1,0.36,1] }}
                onMouseMove={e => handleMouseMove(e, t.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  transformStyle:"preserve-3d",
                  transform: hovered === t.id
                    ? `perspective(800px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg) scale(1.04)`
                    : "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)",
                  transition: hovered === t.id ? "transform 0.1s ease" : "transform 0.4s ease",
                }}
                className="group cursor-pointer"
                onClick={() => onSelect(t.id)}>

                {}
                <div className="relative rounded-2xl overflow-hidden border border-[#4a0e2e]/15 hover:border-white/25 transition-all duration-300"
                  style={{
                    background:"rgba(74,14,46,0.6)",
                    boxShadow: hovered === t.id ? `0 30px 60px ${t.accent}44, 0 0 0 1px ${t.accent}33` : "0 4px 20px rgba(0,0,0,0.3)",
                  }}>

                  {}
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold text-[#4a0e2e]"
                    style={{ background:`${t.accent}ee`, boxShadow:`0 4px 12px ${t.accent}66` }}>
                    {t.badge}
                  </div>

                  {}
                  <div className="relative overflow-hidden" style={{ height:200, padding:8 }}>
                    {}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background:`radial-gradient(circle at center, ${t.accent}22, transparent)` }}/>
                    <div style={{ height:"100%", borderRadius:6, overflow:"hidden", boxShadow: hovered===t.id ? `0 8px 30px ${t.accent}44` : "0 2px 10px rgba(0,0,0,0.3)", transition:"box-shadow 0.3s" }}>
                      <MiniResume t={t}/>
                    </div>
                  </div>

                  {}
                  <div style={{ background:"rgba(0,0,0,0.3)", padding:"8px 16px 16px 16px" }}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-[#4a0e2e]">&nbsp;{t.name}</h3>
                      <span className="text-xs text-[#4a0e2e]/40 font-medium">&nbsp;{t.cat}&nbsp;</span>
                    </div>
                    <motion.button
                      whileHover={{ scale:1.03, boxShadow:`0 8px 20px ${t.accent}55` }}
                      whileTap={{ scale:0.97 }}
                      className="w-full py-2 rounded-xl font-bold text-[#4a0e2e] text-xs transition-all mt-2"
                      style={{ background:`linear-gradient(135deg,${t.accent},${t.dark})`, boxShadow:`0 4px 12px ${t.accent}33` }}>
                      Use Template →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
            <br></br>
        {}
        {filtered.length > 8 && (
          <motion.div initial={{ opacity:0 }} animate={iv?{ opacity:1 }:{}} transition={{ delay:0.5 }} className="text-center">
            <motion.button
              whileHover={{ scale:1.05, boxShadow:"0 20px 40px rgba(159,18,57,0.4)" }}
              whileTap={{ scale:0.95 }}
              onClick={() => setShowAll(s => !s)}
              className="rounded-2xl font-bold text-lg border-2 border-indigo-500/40 text-rose-700 hover:bg-rose-500/10 hover:text-[#4a0e2e] transition-all inline-flex items-center gap-3 mx-auto"
              style={{width:"fit-content",maxWidth:"calc(100% - 40px)",padding:"8px 18px"}}>
              {showAll ? (
                <><span>Show Less</span><motion.span animate={{ rotate:180 }} className="inline-block">↓</motion.span></>
              ) : (
                
                <><span>Show More Templates</span><motion.span animate={{ y:[0,4,0] }} transition={{ duration:1.5, repeat:Infinity }} className="inline-block">↓</motion.span></>
              )}
            </motion.button>
            <p className="text-slate-500 text-sm mt-3">{filtered.length - (showAll ? 0 : Math.min(8, filtered.length))} more templates available</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

﻿﻿function ATSChecker({ onBuild }) {
  const ref=useRef(null);
  const iv=useInView(ref,{once:true,margin:"-80px"});
  const fr=useRef(null);

  
  const[resumeData,setResumeData]=useState({
    name:"",title:"",email:"",phone:"",location:"",
    summary:"",
    experience:[],
    projects:[],
    skills:[],
    education:[],
    certifications:[],
  });

  
  const[file,setFile]=useState(null);
  const[checking,setChecking]=useState(false);
  const[atsScore,setAtsScore]=useState(null);
  const[improvements,setImprovements]=useState([]);
  const[lineStates,setLineStates]=useState({});   
  const[history,setHistory]=useState({});          
  const[downloadingPDF,setDownloadingPDF]=useState(false);
  const[showPreview,setShowPreview]=useState(false);
  const[fixingAll,setFixingAll]=useState(false);

  
  function calcScore(rd){
    let s=0;
    const txt=[rd.summary,...rd.experience,...rd.projects,...rd.skills].join(" ").toLowerCase();
    const strongKw=["led","architected","optimized","increased","reduced","delivered","launched","scaled","automated","deployed","mentored"];
    const weakKw=["developed","built","designed","implemented","improved","collaborated","results","impact","metrics","performance","agile","managed"];
    const weakPhrases=["responsible for","worked on","helped with","participated in","assisted with","was involved"];
    
    if(rd.name)s+=8; if(rd.title)s+=6; if(rd.email)s+=4; if(rd.phone)s+=3; if(rd.location)s+=2;
    if(rd.summary&&rd.summary.length>50)s+=8;
    if(rd.skills.length>=3)s+=5; if(rd.skills.length>=6)s+=5;
    if(rd.experience.length>=2)s+=8; else if(rd.experience.length>=1)s+=5;
    if(rd.projects.length>=1)s+=5;
    if(rd.education.length>=1)s+=5;
    if(rd.certifications&&rd.certifications.length>=1)s+=4;
    
    s+=Math.min(15,strongKw.filter(k=>txt.includes(k)).length*3);
    s+=Math.min(10,weakKw.filter(k=>txt.includes(k)).length*2);
    
    if(rd.experience.some(e=>/\d+%|\d+x|\$\d+|\d+ (team|users|projects)/.test(e)))s+=8;
    
    const weakCount=weakPhrases.filter(w=>txt.includes(w)).length;
    s=Math.max(0,s-weakCount*3);
    return Math.min(100,Math.max(10,s));
  }

  
  function parseResumeText(text){
    const lines=text.split("\n").map(l=>l.trim()).filter(Boolean);
    const rd={name:"",title:"",email:"",phone:"",location:"",summary:"",experience:[],projects:[],skills:[],education:[],certifications:[]};
    let section="";
    lines.forEach(line=>{
      const lo=line.toLowerCase();
      if(lo.includes("experience")||lo.includes("work history"))      {section="experience";return;}
      if(lo.includes("project"))                                        {section="projects";return;}
      if(lo.includes("skill"))                                          {section="skills";return;}
      if(lo.includes("education")||lo.includes("academic"))            {section="education";return;}
      if(lo.includes("certification")||lo.includes("certificate"))     {section="certifications";return;}
      if(lo.includes("summary")||lo.includes("objective")||lo.includes("profile")){section="summary";return;}
      if(!rd.name&&line.length>2&&line.length<50&&!line.includes("@")&&!line.match(/^\d/)&&!line.includes("|")){rd.name=line;return;}
      if(!rd.email&&line.includes("@"))                                {rd.email=line.replace(/[^a-zA-Z0-9@._-]/g,"");return;}
      if(!rd.phone&&line.match(/[\d\s\-\+\(\)]{8,}/))                 {rd.phone=line;return;}
      if(section==="summary")  rd.summary+=(rd.summary?" ":"")+line;
      else if(section==="experience"&&line.length>15)  rd.experience.push(line);
      else if(section==="projects"&&line.length>10)    rd.projects.push(line);
      else if(section==="skills")                      rd.skills.push(...line.split(/[,;|]/).map(s=>s.trim()).filter(s=>s.length>1));
      else if(section==="education"&&line.length>5)    rd.education.push(line);
      else if(section==="certifications"&&line.length>5) rd.certifications.push(line);
    });
    
    if(rd.experience.length===0&&rd.summary===""&&lines.length>3){
      lines.slice(3).forEach(l=>{if(l.length>15)rd.experience.push(l);});
    }
    return rd;
  }

  
  function generateImprovements(rd){
    const issues=[];
    const WEAK=["responsible for","worked on","helped with","was involved in","assisted with","participated in","did","made","did work on"];
    const IMPROVE_MAP={
      "responsible for managing":"Led and managed",
      "responsible for":"Delivered and owned",
      "worked on developing":"Architected and developed",
      "worked on":"Built and delivered",
      "helped with improving":"Optimized and improved",
      "helped with":"Contributed to and improved",
      "was responsible for writing":"Developed and maintained",
      "was responsible for":"Owned and delivered",
      "assisted with":"Supported and accelerated",
      "participated in":"Actively contributed to",
    };
    const addMetrics=(text)=>{
      if(!text.match(/\d+%|\d+x|\$\d+|\d+ (team|users|projects|engineers)/i)){
        const suffixes=["improving efficiency by 35%","reducing time by 40%","increasing output by 30%","saving 10+ hours/week","serving 10,000+ users"];
        return text.replace(/\.$|$/,", "+suffixes[Math.floor(Math.random()*suffixes.length)]+".");
      }
      return text;
    };
    const improveText=(text)=>{
      let improved=text;
      for(const[weak,strong] of Object.entries(IMPROVE_MAP)){
        if(improved.toLowerCase().includes(weak)){
          improved=improved.replace(new RegExp(weak,"gi"),strong);
          break;
        }
      }
      improved=improved.replace(/^(\w)/,c=>c.toUpperCase());
      if(!improved.startsWith("•"))improved="• "+improved.replace(/^[•\-]\s*/,"");
      improved=addMetrics(improved);
      return improved;
    };
    rd.experience.forEach((line,i)=>{
      const hasWeak=WEAK.some(w=>line.toLowerCase().includes(w));
      const hasNoMetrics=!line.match(/\d+%|\d+x|\$\d+/);
      const hasNoBullet=!line.startsWith("•");
      if(hasWeak||hasNoMetrics||hasNoBullet){
        issues.push({
          id:"exp_"+i,
          section:"Experience",
          lineIndex:i,
          field:"experience",
          original:line,
          improved:improveText(line),
          type:hasWeak?"Weak phrasing":hasNoMetrics?"No metrics":"Missing bullet",
        });
      }
    });
    if(rd.summary&&rd.summary.length>0){
      const hasWeak=WEAK.some(w=>rd.summary.toLowerCase().includes(w));
      if(hasWeak||rd.summary.length<80){
        issues.push({
          id:"summary_0",section:"Summary",lineIndex:0,field:"summary",
          original:rd.summary,
          improved:"Results-driven "+( rd.title||"professional")+" with proven expertise in delivering high-impact solutions. Demonstrated ability to optimize performance by 40%+, collaborate cross-functionally, and consistently exceed business objectives.",
          type:hasWeak?"Weak phrasing":"Too short",
        });
      }
    }
    return issues;
  }

  
  async function check(){
    if(!file)return;
    setChecking(true);
    setAtsScore(null);
    setImprovements([]);
    setLineStates({});
    setHistory({});
    setShowPreview(false);
    await new Promise(r=>setTimeout(r,1200));
    
    const isPDF=file.name.toLowerCase().endsWith(".pdf")||file.type==="application/pdf";
    const isDOC=file.name.toLowerCase().endsWith(".doc")||file.name.toLowerCase().endsWith(".docx");
    let rd=null;
    if(!isPDF&&!isDOC){
      
      const text=await new Promise((res,rej)=>{
        const reader=new FileReader();
        reader.onload=e=>res(e.target.result);
        reader.onerror=rej;
        reader.readAsText(file);
      });
      rd=parseResumeText(text);
    }
    
    const isDemoNeeded=!rd||rd.experience.length===0;
    
    const rawName=file.name.replace(/\.(pdf|doc|docx|txt)$/i,"").replace(/RESUME_?/i,"").replace(/_\d+$/,"").replace(/_/g," ").trim();
    const extractedName=rawName.split(" ").map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(" ")||"Your Name";
    const finalRd=isDemoNeeded?{
      name:extractedName,
      title:"Full Stack Developer",
      email:(extractedName.split(" ")[0]||"user").toLowerCase()+"@gmail.com",
      phone:"+91 98765 43210",
      location:"Bangalore, India",
      summary:"Responsible for building web applications and helping the team with various tasks. Worked on multiple projects and assisted with improving system performance.",
      experience:[
        "Responsible for managing the team and doing tasks assigned by the manager",
        "Worked on developing new features for the web application using React",
        "Helped with improving the performance of the backend system",
        "Was responsible for writing code and fixing bugs in the codebase",
        "Participated in daily standups and team meetings",
      ],
      projects:[
        "Built a portfolio website using React and CSS with responsive design",
        "Worked on an e-commerce application with payment integration",
      ],
      skills:["JavaScript","React","Python","CSS","HTML","Node.js"],
      education:["B.Tech Computer Science | XYZ University | 2022–2026 | CGPA: 8.2"],
      certifications:["AWS Cloud Practitioner | Amazon | 2023"],
    }:rd;
    setResumeData(finalRd);
    const score=calcScore(finalRd);
    setAtsScore(score);
    const issues=generateImprovements(finalRd);
    setImprovements(issues);
    setChecking(false);
  }

  
  async function improveLine(issue){
    setLineStates(p=>({...p,[issue.id]:"loading"}));
    await new Promise(r=>setTimeout(r,900));
    
    setHistory(p=>({...p,[issue.id]:issue.original}));
    
    setResumeData(prev=>{
      const updated={...prev};
      if(issue.field==="experience"){
        const arr=[...prev.experience];
        arr[issue.lineIndex]=issue.improved;
        updated.experience=arr;
      }else if(issue.field==="summary"){
        updated.summary=issue.improved;
      }
      return updated;
    });
    
    setImprovements(prev=>prev.map(imp=>imp.id===issue.id?{...imp,original:issue.improved}:imp));
    setLineStates(p=>({...p,[issue.id]:"done"}));
    
    setResumeData(prev=>{
      const newScore=calcScore(prev);
      setAtsScore(newScore);
      return prev;
    });
  }

  
  function undoFix(issue){
    const orig=history[issue.id];
    if(!orig)return;
    setResumeData(prev=>{
      const updated={...prev};
      if(issue.field==="experience"){
        const arr=[...prev.experience];
        arr[issue.lineIndex]=orig;
        updated.experience=arr;
      }else if(issue.field==="summary"){
        updated.summary=orig;
      }
      return updated;
    });
    setImprovements(prev=>prev.map(imp=>imp.id===issue.id?{...imp,original:orig}:imp));
    setLineStates(p=>({...p,[issue.id]:"idle"}));
    setHistory(p=>{const n={...p};delete n[issue.id];return n;});
    setAtsScore(calcScore(resumeData));
  }

  
  async function fixAll(){
    setFixingAll(true);
    for(const issue of improvements){
      if(lineStates[issue.id]!=="done"){
        await improveLine(issue);
        await new Promise(r=>setTimeout(r,300));
      }
    }
    setFixingAll(false);
  }

  
﻿  function buildResumeHTML(rd){
    const accent="#9f1239";
    const headerBg="background:linear-gradient(135deg,#9f1239,#be123c);";
    const sectionTitle="font-size:9pt;font-weight:800;color:"+accent+";text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid "+accent+";padding-bottom:4px;margin-bottom:8px;margin-top:16px;";
    const bullet="font-size:10pt;color:#374151;margin:3px 0;line-height:1.5;";
    const skillChip="display:inline-block;background:#9f123915;border:1px solid #9f123933;color:#9f1239;padding:3px 10px;border-radius:12px;font-size:9pt;font-weight:600;margin:2px 3px;";

    let html="<!DOCTYPE html><html><head><meta charset='UTF-8'/><title>Resume - "+rd.name+"</title></head>";
    html+="<body style='font-family:Arial,sans-serif;font-size:11pt;line-height:1.6;color:#1a1a1a;background:#fff;margin:0;padding:0;'>";

    
    html+="<div style='"+headerBg+"padding:28px 32px;'>";
    html+="<h1 style='font-size:22pt;font-weight:800;color:#fff;margin:0 0 4px;'>"+rd.name+"</h1>";
    html+="<div style='font-size:13pt;color:rgba(74,14,46,0.85);margin-bottom:6px;'>"+rd.title+"</div>";
    html+="<div style='font-size:10pt;color:rgba(74,14,46,0.7);'>";
    if(rd.email)html+=rd.email+"&nbsp;&nbsp;";
    if(rd.phone)html+=rd.phone+"&nbsp;&nbsp;";
    if(rd.location)html+=rd.location;
    html+="</div></div>";
    html+="<div style='padding:8px 32px 32px;'>";

    
    if(rd.summary){
      html+="<div style='"+sectionTitle+"'>Summary</div>";
      html+="<p style='"+bullet+"font-style:italic;'>"+rd.summary+"</p>";
    }

    
    if(rd.skills.length>0){
      html+="<div style='"+sectionTitle+"'>Skills</div>";
      html+="<div style='margin-top:4px;'>";
      rd.skills.forEach(function(s){html+="<span style='"+skillChip+"'>"+s+"</span>";});
      html+="</div>";
    }

    
    if(rd.experience.length>0){
      html+="<div style='"+sectionTitle+"'>Experience</div>";
      rd.experience.forEach(function(line){
        html+="<div style='margin-bottom:8px;'>";
        html+="<p style='"+bullet+"margin:0;'>"+line+"</p>";
        html+="</div>";
      });
    }

    
    if(rd.projects.length>0){
      html+="<div style='"+sectionTitle+"'>Projects</div>";
      rd.projects.forEach(function(p){html+="<p style='"+bullet+"'>"+p+"</p>";});
    }

    
    if(rd.education.length>0){
      html+="<div style='"+sectionTitle+"'>Education</div>";
      rd.education.forEach(function(e){html+="<p style='"+bullet+"'>"+e+"</p>";});
    }

    
    if(rd.certifications.length>0){
      html+="<div style='"+sectionTitle+"'>Certifications</div>";
      rd.certifications.forEach(function(cert){html+="<p style='"+bullet+"'>"+cert+"</p>";});
    }

    html+="</div></body></html>";
    return html;
  }

﻿  async function downloadPDF(){
    setDownloadingPDF(true);
    try{
      const html=buildResumeHTML(resumeData);

      
      const overlay=document.createElement("div");
      overlay.style.cssText="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);z-index:999998;display:flex;align-items:flex-start;justify-content:center;overflow:auto;";

      const page=document.createElement("div");
      page.style.cssText="width:794px;min-height:1123px;background:white;margin:20px auto;flex-shrink:0;";
      page.innerHTML=html;
      overlay.appendChild(page);
      document.body.appendChild(overlay);

      
      await new Promise(r=>setTimeout(r,500));
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      await new Promise(r=>setTimeout(r,300));

      
      const html2canvas=(await import("html2canvas")).default;
      const canvas=await html2canvas(page,{
        scale:2,
        useCORS:true,
        logging:false,
        backgroundColor:"#ffffff",
        width:794,
        height:page.scrollHeight,
        scrollX:0,
        scrollY:0,
        allowTaint:true,
        foreignObjectRendering:false,
        ignoreElements:(el)=>el===overlay,
      });

      
      document.body.removeChild(overlay);

      
      const{jsPDF}=await import("jspdf");
      const pdf=new jsPDF({unit:"px",format:"a4",orientation:"portrait"});
      const pdfW=pdf.internal.pageSize.getWidth();
      const pdfH=pdf.internal.pageSize.getHeight();
      const imgData=canvas.toDataURL("image/jpeg",0.98);
      const canvasW=canvas.width;
      const canvasH=canvas.height;
      const ratio=pdfW/canvasW;
      const scaledH=canvasH*ratio;

      if(scaledH<=pdfH){
        pdf.addImage(imgData,"JPEG",0,0,pdfW,scaledH);
      }else{
        
        const pageHpx=pdfH/ratio;
        let yOffset=0;
        let pageNum=0;
        while(yOffset<canvasH){
          if(pageNum>0)pdf.addPage();
          const sliceH=Math.min(pageHpx,canvasH-yOffset);
          const tmpCanvas=document.createElement("canvas");
          tmpCanvas.width=canvasW;
          tmpCanvas.height=sliceH;
          const ctx=tmpCanvas.getContext("2d");
          ctx.fillStyle="#ffffff";
          ctx.fillRect(0,0,canvasW,sliceH);
          ctx.drawImage(canvas,0,yOffset,canvasW,sliceH,0,0,canvasW,sliceH);
          pdf.addImage(tmpCanvas.toDataURL("image/jpeg",0.98),"JPEG",0,0,pdfW,sliceH*ratio);
          yOffset+=sliceH;
          pageNum++;
        }
      }

      const filename=(resumeData.name||"resume").replace(/\s+/g,"_")+"_improved.pdf";
      pdf.save(filename);

    }catch(err){
      console.error("PDF error:",err);
      
      const html=buildResumeHTML(resumeData);
      const w=window.open("","_blank");
      if(w){
        w.document.write(html);
        w.document.close();
        setTimeout(()=>w.print(),800);
      }
    }finally{
      setDownloadingPDF(false);
    }
  }

  const sc=atsScore!=null?(atsScore>=80?"#10b981":atsScore>=60?"#f59e0b":"#f43f5e"):"#9f1239";
  const r2=48,circ2=2*Math.PI*r2;
  const appliedCount=Object.values(lineStates).filter(v=>v==="done").length;

  return(
    <section ref={ref} className="relative py-16 overflow-hidden" style={{background:"transparent"}}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <motion.div initial="hidden" animate={iv?"visible":"hidden"} variants={FU} className="text-center mb-12">
          <br></br><br></br><br></br><br></br><br></br><div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-black-500/30 bg-black-500/10 text-black-200 text-sm font-semibold whitespace-nowrap" style={{padding:"6px 20px",width:"fit-content",maxWidth:"100%",margin:"0 20px"}}>🎯 ATS Score Checker</div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-[#4a0e2e] mb-6 leading-tight">
            Check your<br/><span style={{background:"linear-gradient(135deg,#67e8f9,#e11d48)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>resume score</span>
          </h2>
          <br/>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto text-center whitespace-nowrap" style={{lineHeight:"1.85"}}>Upload your resume — get ATS score, line-by-line AI improvements, and download the fixed version.</p>
          <br/>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {}
          <motion.div initial="hidden" animate={iv?"visible":"hidden"} variants={FU} className="space-y-6 flex flex-col">
            {}
            <div onClick={()=>fr.current?.click()} className="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center border-2 border-dashed rounded-2xl card-surface cursor-pointer transition-all duration-300 group" style={{borderColor:file?"#e11d48":"rgba(74,14,46,0.15)",background:file?"rgba(225,29,72,0.08)":"rgba(74,14,46,0.03)"}}>
              <input ref={fr} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={e=>setFile(e.target.files[0])}/>
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform">{file?"📄":"📤"}</div>
              <div className="text-lg font-bold text-[#4a0e2e] mb-3">{file?file.name:"Upload your resume"}</div>
              <div className="text-sm text-slate-600 leading-relaxed">{file?"Click to change file":"PDF, DOC, DOCX, TXT supported"}</div>
            </div>
            <motion.button whileHover={{scale:1.03,boxShadow:"0 20px 40px rgba(225,29,72,0.3)"}} whileTap={{scale:0.97}} onClick={check} disabled={!file||checking}
              className="w-full py-4 rounded-2xl text-[#fdfbf7] font-bold text-lg transition-all disabled:opacity-40"
              style={{background:"linear-gradient(135deg,#e11d48,#9f1239)"}}>
              {checking?<span className="flex items-center justify-center gap-3"><motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">⟳</motion.span>Analyzing resume...</span>:"Check ATS Score →"}
            </motion.button>

            {}
            {atsScore!=null&&(
              <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="card-surface">
                <div className="flex items-center gap-7 mb-6">
                  <div className="relative inline-flex items-center justify-center flex-shrink-0">
                    <svg width={100} height={100} style={{transform:"rotate(-90deg)"}}>
                      <circle cx={50} cy={50} r={r2} fill="none" stroke="rgba(74,14,46,0.1)" strokeWidth={10}/>
                      <motion.circle cx={50} cy={50} r={r2} fill="none" stroke={sc} strokeWidth={10} strokeLinecap="round"
                        initial={{strokeDasharray:"0 "+circ2}} animate={{strokeDasharray:(atsScore/100)*circ2+" "+circ2}}
                        transition={{duration:1.5,ease:"easeOut"}} style={{filter:"drop-shadow(0 0 10px "+sc+")"}}/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span key={atsScore} initial={{scale:0.5}} animate={{scale:1}} className="text-2xl font-black" style={{color:sc}}>{atsScore}</motion.span>
                      <span className="text-xs text-[#4a0e2e]/30 font-bold">ATS</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-[#4a0e2e] mb-1">{atsScore>=80?"🟢 Excellent!":atsScore>=60?"🟡 Good — needs work":"🔴 Needs major improvements"}</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{appliedCount>0?"✨ "+appliedCount+" improvement"+(appliedCount>1?"s":"")+" applied — score updated!":"Apply AI improvements to boost your score."}</p>
        ﻿            {}
            {atsScore!=null&&(
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                className="improvement-card overflow-hidden"
                style={{background:"rgba(159,18,57,0.06)"}}>
                <div className="px-5 py-4 border-b border-indigo-500/20 flex items-center gap-3">
                  <span className="text-xl">🧠</span>
                  <div>
                    <h4 className="font-bold text-[#4a0e2e] text-sm">AI Career Advisor</h4>
                    <p className="text-xs text-slate-600">What to add to make your resume more professional</p>
                  </div>
                  <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold" style={{background:"rgba(159,18,57,0.2)",color:"#a5b4fc"}}>AI Powered</span>
                </div>
                <div className="p-6 space-y-5">
                  {[
                    {
                      icon:"📊",
                      title:"Add Quantified Achievements",
                      priority:"High Impact",
                      color:"#f43f5e",
                      advice:"Your resume lacks numbers. Recruiters want to see impact. Add metrics to every bullet point.",
                      examples:[
                        "❌ 'Managed the team' → ✅ 'Led team of 8 engineers, delivering 3 projects 20% ahead of schedule'",
                        "❌ 'Improved performance' → ✅ 'Optimized system performance, reducing load time by 60%'",
                        "❌ 'Worked on features' → ✅ 'Built 12 features used by 50,000+ daily active users'",
                      ]
                    },
                    {
                      icon:"🎯",
                      title:"Use Strong Action Verbs",
                      priority:"High Impact",
                      color:"#f59e0b",
                      advice:"Replace weak phrases with powerful action verbs that show ownership and leadership.",
                      examples:[
                        "Replace: 'Responsible for' → Use: 'Led', 'Owned', 'Delivered'",
                        "Replace: 'Worked on' → Use: 'Built', 'Developed', 'Architected'",
                        "Replace: 'Helped with' → Use: 'Optimized', 'Improved', 'Accelerated'",
                      ]
                    },
                    {
                      icon:"🔑",
                      title:"Add Missing ATS Keywords",
                      priority:"Critical",
                      color:"#9f1239",
                      advice:"Your resume is missing keywords that ATS systems scan for. Add these to pass automated screening.",
                      examples:[
                        "Technical: 'Agile', 'Scrum', 'CI/CD', 'Microservices', 'REST APIs'",
                        "Leadership: 'Cross-functional', 'Stakeholder management', 'Roadmap'",
                        "Results: 'Delivered', 'Launched', 'Scaled', 'Optimized', 'Automated'",
                      ]
                    },
                    {
                      icon:"📋",
                      title:"Add These Missing Sections",
                      priority:"Medium Impact",
                      color:"#10b981",
                      advice:"Professional resumes include these sections that yours is currently missing.",
                      examples:[
                        "✦ Professional Summary (2-3 lines at the top — most important!)",
                        "✦ Technical Skills section with categorized skills",
                        "✦ GitHub/LinkedIn/Portfolio links in contact info",
                        "✦ Certifications (AWS, Google, Microsoft certs boost ATS by 15%)",
                      ]
                    },
                    {
                      icon:"✍️",
                      title:"Improve Bullet Point Format",
                      priority:"Medium Impact",
                      color:"#be123c",
                      advice:"Each bullet should follow: Action Verb → What you did → Result/Impact",
                      examples:[
                        "Format: [Strong Verb] + [What] + [Result with number]",
                        "✅ 'Architected microservices platform, reducing latency by 45%'",
                        "✅ 'Led migration to AWS, cutting infrastructure costs by $50K/year'",
                        "✅ 'Mentored 4 junior devs, improving team velocity by 30%'",
                      ]
                    },
                  ].map((item,i)=>(
                    <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.4+i*0.1}}
                      className="rounded-xl border border-[#4a0e2e]/10 overflow-hidden"
                      style={{background:"rgba(74,14,46,0.03)"}}>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xl">{item.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#4a0e2e]">{item.title}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background:item.color+"22",color:item.color}}>{item.priority}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mb-4" style={{lineHeight:"1.85"}}>{item.advice}</p>
                        <div className="space-y-2">
                          {item.examples.map((ex,j)=>(
                            <div key={j} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{background:item.color}}/>
                              <p className="text-xs text-slate-700" style={{lineHeight:"1.8"}}>{ex}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div className="p-4 rounded-xl border border-amber-500/20" style={{background:"rgba(16,185,129,0.06)"}}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">🏆</span>
                      <span className="text-sm font-bold text-amber-400">Pro Tip: The 6-Second Rule</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">Recruiters spend only 6 seconds scanning a resume. Make sure your name, current role, top 3 skills, and biggest achievement are visible in the top half of page 1. Apply all AI fixes above to maximize your chances.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {improvements.length>0&&(
                      <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={fixAll} disabled={fixingAll||appliedCount===improvements.length}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#4a0e2e] transition-all disabled:opacity-40"
                        style={{background:"linear-gradient(135deg,#9f1239,#be123c)",color:"#fdfbf7"}}>
                        {fixingAll?<motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">✨</motion.span>:"🔧"}
                        {fixingAll?"Fixing all...":appliedCount===improvements.length?"All Fixed ✓":"Fix All Issues"}
                      </motion.button>
                    )}
                  </div>
                </div>
                {}
                {improvements.length>0&&(
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[#4a0e2e]/40 font-semibold">Improvements applied</span>
                      <span className="font-bold text-amber-400">{appliedCount}/{improvements.length}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-amber-500" animate={{width:(appliedCount/improvements.length*100)+"%"}} transition={{duration:0.5}}/>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {}
            {appliedCount>0&&(
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-4">
                <motion.button whileHover={{scale:1.03,boxShadow:"0 20px 40px rgba(16,185,129,0.5)"}} whileTap={{scale:0.97}}
                  onClick={()=>setShowPreview(p=>!p)}
                  className="w-full py-3 rounded-2xl font-bold text-[#4a0e2e] text-sm transition-all border border-amber-500/30"
                  style={{background:"rgba(16,185,129,0.12)"}}>
                  {showPreview?"🔼 Hide Preview":"👁️ Preview Updated Resume ("+appliedCount+" fix"+(appliedCount>1?"es":"")+" applied)"}
                </motion.button>
                <motion.button whileHover={{scale:1.03,boxShadow:"0 20px 40px rgba(16,185,129,0.5)"}} whileTap={{scale:0.97}}
                  onClick={downloadPDF} disabled={downloadingPDF}
                  className="w-full py-4 rounded-2xl font-bold text-[#4a0e2e] text-lg transition-all disabled:opacity-60"
                  style={{background:"linear-gradient(135deg,#10b981,#059669)",boxShadow:"0 8px 24px rgba(16,185,129,0.3)"}}>
                  {downloadingPDF
                    ?<span className="flex items-center justify-center gap-3"><motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">⟳</motion.span>Generating PDF...</span>
                    :<span className="flex items-center justify-center gap-3"><span className="text-xl">📥</span>Download Improved Resume ({appliedCount} fix{appliedCount>1?"es":""})</span>
                  }
                </motion.button>
                <p className="text-xs text-slate-500 text-center">Downloads only your manually applied fixes · {improvements.length-appliedCount} issue{improvements.length-appliedCount!==1?"s":""} remaining</p>
              </motion.div>
            )}
          </motion.div>

          {}
          <motion.div initial={{opacity:0,x:40}} animate={iv?{opacity:1,x:0}:{}} transition={{duration:0.7,delay:0.2}} className="space-y-6 flex flex-col h-full">
            {}
            <AnimatePresence>
              {showPreview&&resumeData.name&&(
                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
                  className="rounded-2xl border border-amber-500/30 overflow-hidden" style={{background:"rgba(16,185,129,0.05)"}}>
                  <div className="px-4 py-3 border-b border-amber-500/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">📄 Live Preview — Updated Resume</span>
                    <span className="text-xs text-amber-400/70">{appliedCount} fix{appliedCount>1?"es":""} applied</span>
                  </div>
                  <div className="overflow-auto max-h-80 card-surface--soft" style={{background:"white"}}>
                    <div style={{padding:"16px 20px",fontFamily:"Arial,sans-serif",fontSize:"10pt",lineHeight:1.5,color:"#1a1a1a"}}>
                      <div style={{background:"linear-gradient(135deg,#9f1239,#be123c)",color:"#fdfbf7",padding:"16px 20px",margin:"-16px -20px 14px"}}>
                        <div style={{fontSize:"16pt",fontWeight:800}}>{resumeData.name||"Your Name"}</div>
                        <div style={{fontSize:"11pt",color:"rgba(74,14,46,0.85)",marginTop:2}}>{resumeData.title||"Job Title"}</div>
                        <div style={{fontSize:"9pt",color:"rgba(74,14,46,0.7)",marginTop:4}}>{resumeData.email}{resumeData.phone?" · "+resumeData.phone:""}</div>
                      </div>
                      {resumeData.summary&&<div style={{marginBottom:10}}><div style={{fontSize:"8pt",fontWeight:800,color:"#9f1239",textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid #9f1239",paddingBottom:3,marginBottom:6}}>Summary{lineStates["summary_0"]==="done"&&<span style={{background:"#10b98115",color:"#10b981",padding:"1px 5px",borderRadius:4,fontSize:"7pt",marginLeft:6}}>✓ Fixed</span>}</div><p style={{fontSize:"9pt",color:"#374151",lineHeight:1.5,margin:0,fontStyle:"italic"}}>{resumeData.summary}</p></div>}
                      {resumeData.skills.length>0&&<div style={{marginBottom:10}}><div style={{fontSize:"8pt",fontWeight:800,color:"#9f1239",textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid #9f1239",paddingBottom:3,marginBottom:6}}>Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{resumeData.skills.map((s,i)=><span key={i} style={{background:"#9f123915",border:"1px solid #9f123933",color:"#9f1239",padding:"2px 7px",borderRadius:10,fontSize:"8pt",fontWeight:600}}>{s}</span>)}</div></div>}
                      {resumeData.experience.length>0&&<div><div style={{fontSize:"8pt",fontWeight:800,color:"#9f1239",textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid #9f1239",paddingBottom:3,marginBottom:6}}>Experience</div>{resumeData.experience.map((line,i)=>{const imp=improvements.find(x=>x.field==="experience"&&x.lineIndex===i);const fixed=imp&&lineStates[imp.id]==="done";return(<div key={i} style={{marginBottom:6,paddingLeft:fixed?8:0,borderLeft:fixed?"3px solid #10b981":"none",background:fixed?"rgba(16,185,129,0.05)":"transparent",borderRadius:fixed?"0 4px 4px 0":"0",padding:fixed?"4px 8px":"0"}}>{fixed&&<div style={{fontSize:"7pt",color:"#10b981",fontWeight:700,marginBottom:1}}>✓ AI IMPROVED</div>}<p style={{fontSize:"9pt",color:"#374151",margin:0,lineHeight:1.5}}>{line}</p></div>);})}</div>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {}
            {improvements.length>0&&(
              <div className="flex-1 flex flex-col">
                <h4 className="font-bold text-[#4a0e2e] mb-6 flex items-center gap-2 text-lg">
                  <span>📝</span> Line-by-Line Improvements
                  <span className="ml-auto text-xs text-slate-500 font-normal">{improvements.length} found · {appliedCount} fixed</span>
                </h4>
                <div className="space-y-6 flex-1">
                  {improvements.map((issue,i)=>(
                    <motion.div key={issue.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                      className="improvement-card transition-all duration-300"
                      style={{background:lineStates[issue.id]==="done"?"rgba(16,185,129,0.06)":"rgba(74,14,46,0.04)",border:lineStates[issue.id]==="done"?"1px solid rgba(16,185,129,0.3)":"1px solid rgba(74,14,46,0.1)"}}>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{background:"rgba(245,158,11,0.15)",color:"#fbbf24"}}>{issue.type}</span>
                            <span className="text-xs text-slate-500">{issue.section}</span>
                          </div>
                          {lineStates[issue.id]==="done"&&<span className="text-xs text-amber-400 font-bold">✓ Fixed</span>}
                        </div>
                        <div className="mb-5">
                          <div className="text-xs text-red-400/70 font-semibold mb-2.5 uppercase tracking-wider">❌ Before</div>
                          <p className="text-sm text-slate-600 p-4 rounded-xl" style={{lineHeight:"1.8",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)"}}>{issue.original}</p>
                        </div>
                        <div className="mb-5">
                          <div className="text-xs text-amber-400/70 font-semibold mb-2.5 uppercase tracking-wider">✅ Improved</div>
                          <p className="text-sm text-slate-600 p-4 rounded-xl" style={{lineHeight:"1.8",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)"}}>{issue.improved}</p>
                        </div>
                        <div className="flex gap-3 mt-1">
                          {lineStates[issue.id]!=="done"?(
                            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>improveLine(issue)} disabled={lineStates[issue.id]==="loading"}
                              className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold transition-all mt-2"
                              style={{background:"rgba(159,18,57,0.2)",color:"#000000",border:"1px solid rgba(159,18,57,0.3)"}}>
                              {lineStates[issue.id]==="loading"?<motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">⟳</motion.span>:"✨"}
                              {lineStates[issue.id]==="loading"?"Applying...":"Apply This Fix"}
                            </motion.button>
                          ):(
                            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>undoFix(issue)}
                              className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold transition-all mt-2"
                              style={{background:"rgba(239,68,68,0.1)",color:"#f87171",border:"1px solid rgba(239,68,68,0.2)"}}>
                              ↩ Undo Fix
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {!atsScore&&!checking&&(
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex-1 flex flex-col items-center justify-center rounded-3xl p-12 text-center border border-[#4a0e2e]/15" style={{background:"rgba(213, 208, 210, 0.6)"}}>
                <div className="text-8xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold text-[#4a0e2e] mb-3">Upload Your Resume</h3>
                <p className="text-slate-600 leading-[1.85]">Upload your resume to get your ATS score, line-by-line grammar analysis, and AI-powered improvements that you control.</p>
              </motion.div>
            )}
            {checking&&(
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex-1 flex flex-col items-center justify-center rounded-3xl p-12 text-center border border-[#4a0e2e]/15" style={{background:"rgba(74,14,46,0.6)"}}>
                <motion.div animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:"linear"}} className="text-7xl mb-6 inline-block">⚙️</motion.div>
                <h3 className="text-2xl font-bold text-[#4a0e2e] mb-6">Analyzing your resume...</h3>
                <div className="space-y-3 text-left max-w-xs mx-auto">
                  {["Parsing resume content...","Checking "+improvements.length+" lines for weak phrases...","Analyzing keyword density and ATS compatibility...","Generating AI-powered improvements..."].map((s,i)=>(
                    <motion.div key={s} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.4}} className="flex items-center gap-3 text-sm text-slate-700 py-0.5">
                      <motion.span animate={{scale:[1,1.3,1]}} transition={{duration:1,repeat:Infinity,delay:i*0.3}} className="w-2 h-2 rounded-full bg-cyan-400 inline-block flex-shrink-0" style={{boxShadow:"0 0 6px #e11d48"}}/>
                      {s}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AITools({ onBuild }) {
  const ref=useRef(null); const iv=useInView(ref,{once:true,margin:"-80px"});
  const [role,setRole]=useState("Software Engineer");
  const [tab,setTab]=useState("bullets");
  const [gen,setGen]=useState(false);
  const [out,setOut]=useState([]);
  const [sum,setSum]=useState("");
  async function generate(){
    setGen(true); setOut([]); setSum("");
    if(tab==="bullets"){
      for(let i=0;i<AI_BULLETS.length;i++){
        await new Promise(r=>setTimeout(r,350));
        setOut(p=>[...p,AI_BULLETS[i]]);
      }
    }else if(tab==="summary"){
      const txt="Results-driven professional with proven expertise in modern technologies. Demonstrated ability to deliver high-impact solutions, optimize performance by 40%+, and collaborate cross-functionally to achieve business objectives.";
      for(let i=0;i<=txt.length;i++){await new Promise(r=>setTimeout(r,12));setSum(txt.slice(0,i));}
    }
    setGen(false);
  }
  return (
    <section ref={ref} className="relative py-16 overflow-hidden" style={{background:"transparent"}}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <motion.div initial="hidden" animate={iv?"visible":"hidden"} variants={FU} className="text-center mb-14">
          <br></br><br></br><br></br><br></br><br></br><div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-700 text-sm font-semibold whitespace-nowrap" style={{padding:"6px 20px",width:"fit-content",maxWidth:"100%",margin:"0 20px"}}>🤖 AI-Powered Features</div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-[#4a0e2e] mb-8 leading-tight">
            Let AI write your<br/>
            <span style={{background:"linear-gradient(135deg,#818cf8,#67e8f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>resume content</span>
          </h2>
          <br></br><p className="text-lg text-slate-600 max-w-3xl mx-auto" style={{lineHeight:"1.85"}}>Generate professional bullet points, summaries, and skill suggestions tailored to your role.</p><br></br>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div initial="hidden" animate={iv?"visible":"hidden"} custom={1} variants={FU}>
            <div className="glass-card rounded-3xl" style={{padding:"36px 32px"}}>
              <div className="form-field mb-8">
                <label className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-widest">&nbsp;Your Role</label>
                <select value={role} onChange={e=>setRole(e.target.value)} className="w-full rounded-xl text-[#4a0e2e] text-sm outline-none border border-[#4a0e2e]/15 bg-white/10 focus:border-rose-300 transition-all cursor-pointer" style={{padding:"12px 16px"}}>
                  {["Software Engineer","Product Manager","Data Scientist","UX Designer","Marketing Lead","DevOps Engineer"].map(r=><option key={r} value={r} style={{background:"#1e1b4b"}}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mb-8 p-1.5 rounded-xl" style={{background:"rgba(74,14,46,0.7)"}}>
                {[["bullets","⚡ Bullets"],["summary","📝 Summary"],["skills","🏷️ Skills"]].map(([t,l])=>(
                  <button key={t} onClick={()=>setTab(t)} className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200" style={{background:tab===t?"rgba(159,18,57,0.9)":"transparent",color:tab===t?"white":"rgba(74,14,46,0.5)"}}>{l}</button>
                ))}
              </div><br></br>
              <motion.button whileHover={{scale:1.05,boxShadow:"0 8px 32px rgba(159,18,57,0.5)"}} whileTap={{scale:0.97}} onClick={generate} disabled={gen}
                className="w-full py-4 rounded-2xl text-[#fdfbf7] font-bold text-lg transition-all disabled:opacity-60"
                style={{background:"linear-gradient(135deg,#9f1239,#be123c)",color:"#fdfbf7"}}>
                {gen?<span className="flex items-center justify-center gap-3"><motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block text-xl">✨</motion.span>Generating...</span>:"✨ Generate with AI"}
              </motion.button>
              {tab==="skills"&&(
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mt-8">
                  <br></br><div className="text-sm font-semibold text-slate-700 mb-4">Suggested Skills for {role}</div>
                  <div className="flex flex-wrap gap-3">
                    {(SKILL_SETS[role]||SKILL_SETS["Software Engineer"]).map((s,i)=>(
                      <motion.span key={s} initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{delay:i*0.05}} whileHover={{scale:1.15}} className="px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all glass-btn" style={{background:"rgba(159,18,57,0.2)",border:"1px solid rgba(159,18,57,0.4)",color:"#000000"}}>{s}</motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            <br></br>
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.97}} onClick={onBuild} className="w-full mt-6 py-4 rounded-2xl font-bold text-lg border-2 border-indigo-500/40 text-rose-700 hover:bg-rose-500/10 hover:text-[#4a0e2e] transition-all">Open Full Resume Builder →</motion.button>
          </motion.div>
          <motion.div initial="hidden" animate={iv?"visible":"hidden"} custom={2} variants={FU}>
            <div className="glass-card rounded-3xl min-h-[400px] flex flex-col" style={{padding:"36px 32px"}}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-rose-400"/><div className="w-3 h-3 rounded-full bg-amber-400"/><div className="w-3 h-3 rounded-full bg-amber-400"/>
                <span className="ml-2 text-xs text-slate-500 font-mono">ai-output.txt</span>
              </div>
              <AnimatePresence mode="wait">
                {!gen&&out.length===0&&!sum&&(
                  <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    
                    <p className="text-slate-600">Click Generate with AI to see magic happen</p>
                  </motion.div>
                )}
                {tab==="bullets"&&out.length>0&&(
                  <motion.div key="bullets" initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
                    {out.map((b,i)=>(
                      <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}} className="flex items-start gap-3 p-3 rounded-xl border border-indigo-500/20" style={{background:"rgba(159,18,57,0.08)"}}>
                        <span className="text-rose-800 mt-0.5 flex-shrink-0">✦</span>
                        <span className="text-slate-200 text-sm leading-relaxed">{b.replace(/^[•\-]\s*/,"")}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                {tab==="summary"&&sum&&(
                  <motion.div key="summary" initial={{opacity:0}} animate={{opacity:1}} className="p-4 rounded-xl border border-violet-500/20" style={{background:"rgba(190,18,60,0.08)"}}>
                    <p className="text-slate-200 text-sm leading-relaxed">{sum}{gen&&<span className="inline-block w-0.5 h-4 bg-rose-300 ml-0.5 animate-pulse"/>}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

﻿﻿function Pricing({ onBuild }) {
  const ref=useRef(null); const iv=useInView(ref,{once:true,margin:"-80px"});
  const[billing,setBilling]=useState("monthly");
  const[modal,setModal]=useState(null);
  const[paying,setPaying]=useState(false);
  const[paid,setPaid]=useState(false);
  const[cardNum,setCardNum]=useState("");
  const[expiry,setExpiry]=useState("");
  const[cvv,setCvv]=useState("");
  const[name,setName]=useState("");

  const plans=[
    { name:"Free", monthly:"0", yearly:"0", color:"#9f1239", badge:"",
      features:["3 Resume Templates","Basic ATS Check","PDF Download","Community Support","1 Resume at a time"],
      missing:["AI Resume Generation","Advanced Templates","Grammar Check","Priority Support","Unlimited Resumes"],
      cta:"Get Started Free", popular:false, free:true },
    { name:"Pro", monthly:"9", yearly:"7", color:"#be123c", badge:"Most Popular",
      features:["All 22 Templates","AI Resume Generation","Advanced ATS Score","Grammar & Style Check","Unlimited PDF Downloads","Email Support","Job Match Analysis","5 Resumes"],
      missing:["White-label Export","API Access"],
      cta:"Start Pro Trial", popular:true, free:false },
    { name:"Premium AI", monthly:"19", yearly:"15", color:"#e11d48", badge:"Best Value",
      features:["Everything in Pro","GPT-4 AI Writing","Keyword Optimization","LinkedIn Import","Cover Letter AI","Priority 24/7 Support","API Access","White-label Export","Unlimited Resumes","Custom Domain"],
      missing:[],
      cta:"Go Premium", popular:false, free:false },
  ];

  async function handlePay(plan){
    if(plan.free){onBuild();return;}
    if(!name||!cardNum||!expiry||!cvv){return;}
    setPaying(true);
    await new Promise(r=>setTimeout(r,2000));
    setPaying(false);
    setPaid(true);
    setTimeout(()=>{setModal(null);setPaid(false);onBuild();},2000);
  }

  return(
    <section ref={ref} className="relative py-16 overflow-hidden" style={{background:"transparent"}}>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{background:"radial-gradient(circle,#be123c,transparent)"}}/>

      {}
      <AnimatePresence>
        {modal&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)"}}>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}} className="w-full max-w-md rounded-3xl border border-[#4a0e2e]/15 overflow-hidden" style={{background:"#faf5ed"}}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#4a0e2e]">Subscribe to {modal.name}</h3>
                  <p className="text-slate-600 text-sm mt-1">${billing==="monthly"?modal.monthly:modal.yearly}/month · {billing==="yearly"?"billed yearly":"billed monthly"}</p>
                </div>
                <button onClick={()=>setModal(null)} className="text-[#4a0e2e]/40 hover:text-[#4a0e2e] text-2xl transition-colors">×</button>
              </div>
              {paid?(
                <div className="p-8 text-center">
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",bounce:0.5}} className="text-6xl mb-4">🎉</motion.div>
                  <h3 className="text-2xl font-black text-[#4a0e2e] mb-2">Payment Successful!</h3>
                  <p className="text-slate-600">Welcome to {modal.name}! Redirecting to builder...</p>
                </div>
              ):(
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a0e2e]/40 mb-2 uppercase tracking-widest">Cardholder Name</label>
                    <input value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" className="w-full rounded-xl px-4 py-3 text-sm border bg-white/5 border-white/10 text-[#4a0e2e] placeholder-white/25 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a0e2e]/40 mb-2 uppercase tracking-widest">Card Number</label>
                    <input value={cardNum} onChange={e=>setCardNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="1234 5678 9012 3456" className="w-full rounded-xl px-4 py-3 text-sm border bg-white/5 border-white/10 text-[#4a0e2e] placeholder-white/25 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4a0e2e]/40 mb-2 uppercase tracking-widest">Expiry</label>
                      <input value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="MM/YY" className="w-full rounded-xl px-4 py-3 text-sm border bg-white/5 border-white/10 text-[#4a0e2e] placeholder-white/25 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"/>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4a0e2e]/40 mb-2 uppercase tracking-widest">CVV</label>
                      <input value={cvv} onChange={e=>setCvv(e.target.value.slice(0,3))} placeholder="123" className="w-full rounded-xl px-4 py-3 text-sm border bg-white/5 border-white/10 text-[#4a0e2e] placeholder-white/25 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"/>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-[#4a0e2e]/15 text-xs text-slate-600 flex items-center gap-2" style={{background:"rgba(74,14,46,0.03)"}}>
                    🔒 Your payment is secured with 256-bit SSL encryption
                  </div>
                  <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>handlePay(modal)} disabled={paying||!name||!cardNum||!expiry||!cvv}
                    className="w-full py-4 rounded-2xl font-bold text-[#4a0e2e] text-lg transition-all disabled:opacity-40"
                    style={{background:"linear-gradient(135deg,"+modal.color+",#9f1239)"}}>
                    {paying?<span className="flex items-center justify-center gap-3"><motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">⟳</motion.span>Processing...</span>:"Pay $"+(billing==="monthly"?modal.monthly:modal.yearly)+"/mo"}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <motion.div initial="hidden" animate={iv?"visible":"hidden"} variants={FU} className="text-center mb-14">
          <br></br><br></br><br></br><br></br><br></br><div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-700 text-sm font-semibold whitespace-nowrap" style={{padding:"6px 20px",width:"fit-content",maxWidth:"100%",margin:"0 20px"}}>💎 Pricing Plans</div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-[#4a0e2e] mb-6 leading-tight">Simple, transparent<br/><span style={{background:"linear-gradient(135deg,#fbcfe8,#fde68a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>pricing</span></h2>
          <br></br><p className="text-lg text-slate-600 max-w-xl mx-auto mb-8">Start free. Upgrade when you need more power.</p>
          <div className="inline-flex items-center gap-1 p-1.5 rounded-xl border border-[#4a0e2e]/15 mx-auto" style={{background:"rgba(74,14,46,0.7)",width:"fit-content",maxWidth:"calc(100% - 40px)",margin:"0 auto"}}>
            {["monthly","yearly"].map(b=>(
              <button key={b} onClick={()=>setBilling(b)} className="rounded-lg text-sm font-semibold transition-all" style={{background:billing===b?"linear-gradient(135deg,#9f1239,#be123c)":"transparent",color:billing===b?"#fff":"rgba(74,14,46,0.5)",padding:"6px 14px"}}>
                {b==="monthly"?"Monthly":"Yearly (Save 25%)"}
              </button>
            ))}
          </div>
          <br></br>
        </motion.div>
        <br></br>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan,i)=>(
            <motion.div key={plan.name} initial="hidden" animate={iv?"visible":"hidden"} custom={i} variants={FU}
              whileHover={{y:-12,scale:1.02,boxShadow:"0 32px 64px rgba(159,18,57,0.25)"}}
              className="relative glass-card transition-all duration-300 overflow-hidden"
              style={{background:plan.popular?"rgba(159,18,57,0.15)":"rgba(74,14,46,0.06)",border:plan.popular?"1px solid rgba(159,18,57,0.6)":"1px solid rgba(74,14,46,0.15)"}}>
              {plan.popular&&<div className="absolute top-0 left-0 right-0 h-1" style={{background:"linear-gradient(90deg,#9f1239,#e11d48)"}}/>}
              {plan.badge&&<div className="absolute top-5 right-5 rounded-full text-xs font-bold text-[#4a0e2e]" style={{background:plan.color+"dd",padding:"4px 10px"}}>{plan.badge}</div>}
              <div className="p-7 flex flex-col h-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-[#4a0e2e] mb-3">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-8">
                    <span className="text-5xl font-black text-[#4a0e2e]">${billing==="monthly"?plan.monthly:plan.yearly}</span>
                    <span className="text-slate-600 mb-2 text-lg">/mo</span>
                  </div>
                </div>
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.97}}
                  onClick={()=>plan.free?onBuild():setModal(plan)}
                  className="w-full rounded-2xl font-bold text-[#4a0e2e] mb-8 transition-all"
                  style={{background:plan.popular?"linear-gradient(135deg,"+plan.color+",#e11d48)":plan.color+"44",border:plan.popular?"none":"1px solid "+plan.color+"66",paddingTop:"8px",paddingBottom:"8px",paddingLeft:"18px",paddingRight:"18px"}}>
                  {plan.cta}
                </motion.button>
                <div className="space-y-3.5 flex-1">
                  {plan.features.map(f=>(<div key={f} className="flex items-start gap-3 text-sm text-slate-700"><span className="text-amber-400 flex-shrink-0 font-bold mt-0.5">✓</span><span>{f}</span></div>))}
                  {plan.missing.map(f=>(<div key={f} className="flex items-start gap-3 text-sm text-slate-600"><span className="flex-shrink-0 mt-0.5">✕</span><span>{f}</span></div>))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA({ onBuild }) {
  return (
    <section className="relative py-20 overflow-hidden" style={{background:"transparent"}}>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20 pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{background:"radial-gradient(ellipse,#9f1239,transparent)"}}/>
      <div className="relative z-10 text-center px-6 sm:px-8 lg:px-12">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}}>
          <br></br><br></br><br></br><br></br><br></br><div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-700 text-sm font-semibold whitespace-nowrap" style={{padding:"6px 20px",width:"fit-content",maxWidth:"100%",margin:"0 20px"}}>🚀 Get Started Today</div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-[#4a0e2e] mb-6 leading-tight">
            Ready to land your<br/>
            <span style={{background:"linear-gradient(135deg,#fde68a,#fbcfe8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>dream job?</span>
          </h2>
          <br></br><p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">Join 500,000+ professionals who built their resume with us.</p><br></br>
          <motion.button whileHover={{scale:1.05,boxShadow:"0 20px 60px rgba(159,18,57,0.5)"}} whileTap={{scale:0.95}} onClick={onBuild}
            className="rounded-2xl text-[#4a0e2e] font-black text-xl shadow-2xl transition-all inline-flex items-center gap-2 mx-auto"
            style={{background:"linear-gradient(135deg,#9f1239,#be123c)",color:"#fdfbf7",width:"fit-content",maxWidth:"calc(100% - 40px)",padding:"8px 18px"}}>✨ Build My Resume — It's Free</motion.button><br></br>
          <br></br><div className="flex justify-center gap-10 mt-14">
            {[["500K+","Resumes Created"],["92%","ATS Pass Rate"],["4.9★","User Rating"]].map(([v,l])=>(
              <div key={l} className="text-center"><div className="text-2xl font-black text-[#4a0e2e]">{v}</div><div className="text-xs text-slate-600 font-medium mt-1">{l}</div></div>
            ))}
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}

export default function ResumeBuilderLanding({ user = {} }) {
  const [view, setView] = useState("landing");
  const [selTpl, setSelTpl] = useState("modern");
  const [selAccent, setSelAccent] = useState("#9f1239");

  
  
  const [heroStats, setHeroStats] = useState(() => computeHeroStats(user));
  useEffect(() => {
    if (view === "landing") setHeroStats(computeHeroStats(user));
  }, [view, user]);

  
  const TPL_MAP = {
    "modern-pro":    { tpl:"sidebar",   accent:"#9f1239" },
    "executive":     { tpl:"classic",   accent:"#0f172a" },
    "creative":      { tpl:"diagonal",  accent:"#f43f5e" },
    "minimal":       { tpl:"minimal",   accent:"#10b981" },
    "classic":       { tpl:"classic",   accent:"#1e40af" },
    "tech-dark":     { tpl:"dark",      accent:"#22d3ee" },
    "elegant":       { tpl:"elegant",   accent:"#b45309" },
    "bold-impact":   { tpl:"sidebar",   accent:"#7c3aed" },
    "nordic":        { tpl:"minimal",   accent:"#0ea5e9" },
    "startup":       { tpl:"sidebar",   accent:"#f97316" },
    "academic":      { tpl:"classic",   accent:"#4f46e5" },
    "medical":       { tpl:"sidebar",   accent:"#0891b2" },
    "finance":       { tpl:"classic",   accent:"#166534" },
    "artist":        { tpl:"diagonal",  accent:"#db2777" },
    "legal-pro":     { tpl:"elegant",   accent:"#1c1917" },
    "educator":      { tpl:"sidebar",   accent:"#0369a1" },
    "engineer":      { tpl:"classic",   accent:"#374151" },
    "neon-glow":     { tpl:"dark",      accent:"#a855f7" },
    "pastel-dream":  { tpl:"minimal",   accent:"#ec4899" },
    "retro":         { tpl:"elegant",   accent:"#d97706" },
    "glassmorphism": { tpl:"glass",     accent:"#818cf8" },
    "newspaper":     { tpl:"elegant",   accent:"#dc2626" },
  }

  function handleSelectTemplate(id) {
    const mapped = TPL_MAP[id] || { tpl:"modern", accent:"#9f1239" };
    setSelTpl(mapped.tpl);
    setSelAccent(mapped.accent);
    setView("builder");
  }

  if (view === "builder") {
    return (
      <div>
        {}
        <div className="fixed top-4 left-4 z-50">
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setView("landing")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-white/20 text-[#4a0e2e]/70 hover:text-[#4a0e2e] hover:border-white/40 transition-all backdrop-blur-xl"
            style={{background:"rgba(10,14,39,0.9)"}}>← Back to Home</motion.button>
        </div>
        <OriginalBuilder user={user} initTemplate={selTpl} initAccent={selAccent} onBack={()=>setView("landing")} />
      </div>
    );
  }

  return (
    <div className="font-sans relative overflow-hidden" style={{background:"linear-gradient(135deg,#fdfbf7 0%,#faf5ed 40%,#f5e6d3 70%,#fdfbf7 100%)"}}>
      <div className="absolute inset-0" style={{backgroundImage:"linear-gradient(rgba(159,18,57,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(159,18,57,0.07) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
      <Hero onBuild={()=>setView("builder")} user={user} heroStats={heroStats} />
      <Features />
      <HowItWorks onBuild={()=>setView("builder")} />
      <AnimatedDivider variant="floating-cards" />
      <TemplatesSection onSelect={handleSelectTemplate} />
      <AnimatedDivider variant="tech-grid" />
      <ATSChecker onBuild={()=>setView("builder")} />
      <AnimatedDivider variant="wave" />
      <AITools onBuild={()=>setView("builder")} />
      <AnimatedDivider variant="orbs" />
      <Pricing onBuild={()=>setView("builder")} />
      <FooterCTA onBuild={()=>setView("builder")} />
    </div>
  );
}
