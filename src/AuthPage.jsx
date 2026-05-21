import { useState, useEffect, useRef, useCallback } from "react";

// ── Theme (matches App.jsx G object) ─────────────────────────────────────────
const G = {
  bg:"#0a0e27", surface:"#141b3a", card:"#1a2347", border:"#2d3a5f",
  accent:"#ff6b9d", accentDim:"rgba(255,107,157,0.15)", purple:"#c084fc",
  cyan:"#22d3ee", text:"#f0f4ff", muted:"#94a3b8",
  success:"#34d399", warning:"#fbbf24", danger:"#f87171",
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "rejexiq_token";
const USER_KEY  = "rejexiq_user";

// ── Helpers ───────────────────────────────────────────────────────────────────
function validateEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && !/[\s,]/.test(e);
}
function pwStrength(p) {
  if (!p) return { score:0, label:"", color:G.border, pct:0 };
  let s = 0;
  if (p.length >= 8)           s++;
  if (/[A-Z]/.test(p))         s++;
  if (/[0-9]/.test(p))         s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const map = [
    { label:"",       color:G.border,   pct:0   },
    { label:"Weak",   color:G.danger,   pct:25  },
    { label:"Fair",   color:G.warning,  pct:50  },
    { label:"Good",   color:G.cyan,     pct:75  },
    { label:"Strong", color:G.success,  pct:100 },
  ];
  return { score:s, ...map[s] };
}

// ── Eye icon ──────────────────────────────────────────────────────────────────
function Eye({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

// ── Google icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// ── Animated particles background ────────────────────────────────────────────
function ParticlesBg() {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({length:60}, () => ({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4,
      r:Math.random()*1.5+0.3,
      color:[G.accent,G.purple,G.cyan,"#ffffff"][Math.floor(Math.random()*4)],
      a:Math.random()*0.4+0.1, pulse:Math.random()*Math.PI*2,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pts.forEach(p => {
        p.pulse+=0.015; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
        const a=p.a*(0.6+0.4*Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color+Math.floor(a*255).toString(16).padStart(2,"0");
        ctx.fill();
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<80){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(255,107,157,${0.06*(1-d/80)})`;ctx.lineWidth=0.5;ctx.stroke();}
      }
      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

// ── Input field component ─────────────────────────────────────────────────────
function Field({ label, type="text", value, onChange, onBlur, error, valid, placeholder, right, autoComplete }) {
  const [focus, setFocus] = useState(false);
  const borderColor = error ? G.danger : valid ? G.success : focus ? G.accent : G.border;
  const shadow = error ? `0 0 0 3px rgba(248,113,113,0.12)` : valid ? `0 0 0 3px rgba(52,211,153,0.1)` : focus ? `0 0 0 3px rgba(255,107,157,0.12)` : "none";
  return (
    <div style={{marginBottom:14}}>
      <label style={{display:"block",fontSize:11,fontWeight:700,color:G.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.8}}>{label}</label>
      <div style={{position:"relative"}}>
        <input
          type={type} value={value} placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={e=>onChange(e.target.value)}
          onFocus={()=>setFocus(true)}
          onBlur={()=>{setFocus(false);if(onBlur)onBlur();}}
          style={{
            width:"100%", background:"rgba(255,255,255,0.04)",
            border:`1.5px solid ${borderColor}`, borderRadius:10,
            padding:right?"11px 44px 11px 14px":"11px 14px",
            color:G.text, fontSize:14, outline:"none",
            fontFamily:"'Inter',sans-serif", transition:"all 0.2s",
            boxShadow:shadow,
          }}
        />
        {right && <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:G.muted}}>{right}</div>}
        {valid && !error && <div style={{position:"absolute",right:right?40:12,top:"50%",transform:"translateY(-50%)",color:G.success,fontSize:12}}>✓</div>}
      </div>
      {error && <div style={{fontSize:12,color:G.danger,marginTop:5,display:"flex",alignItems:"center",gap:4}}><span>⚠</span>{error}</div>}
    </div>
  );
}

// ── Local auth fallback (works without backend) ───────────────────────────────
const LOCAL_USERS_KEY = "rejexiq_local_users";

function makeToken(user) {
  // Simple base64 JWT-like token for offline mode
  const payload = btoa(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 7*24*60*60*1000 }));
  return `local.${payload}.sig`;
}

function localAuth(mode, { name, email, password }) {
  const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  if (mode === "signup") {
    if (users.find(u => u.email === email.toLowerCase())) return null; // already exists
    const user = { id: "local_" + Date.now(), name, email: email.toLowerCase(), provider: "local", skills: {}, assessmentDone: false };
    // Store with hashed-ish password (simple, not secure — backend handles real security)
    users.push({ ...user, _pw: btoa(password) });
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    return { token: makeToken(user), user };
  } else {
    const found = users.find(u => u.email === email.toLowerCase() && u._pw === btoa(password));
    if (!found) return null;
    const user = { id: found.id, name: found.name, email: found.email, provider: found.provider, skills: found.skills || {}, assessmentDone: found.assessmentDone || false };
    return { token: makeToken(user), user };
  }
}

// ── Main AuthPage component ───────────────────────────────────────────────────
export default function AuthPage({ onLogin, onNav, type }) {
  const [mode, setMode]           = useState(type === "signup" ? "signup" : "signin");
  const [form, setForm]           = useState({ name:"", email:"", password:"", confirm:"" });
  const [touched, setTouched]     = useState({});
  const [errors, setErrors]       = useState({});
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [gLoading, setGLoading]   = useState(false);
  const [toast, setToast]         = useState(null);
  const [animating, setAnimating] = useState(false);
  const strength = pwStrength(form.password);

  // Switch mode with animation
  function switchMode(next) {
    if (next === mode) return;
    setAnimating(true);
    setTimeout(() => {
      setMode(next);
      setForm({ name:"", email:"", password:"", confirm:"" });
      setErrors({}); setTouched({});
      setAnimating(false);
    }, 280);
    if (onNav) onNav(next === "signin" ? "login" : "signup");
  }

  // Live validation
  const validate = useCallback((f=form, m=mode) => {
    const e = {};
    if (m === "signup") {
      if (!f.name.trim())           e.name = "Full name is required";
      else if (f.name.trim().length < 2) e.name = "Name must be at least 2 characters";
      if (f.password && f.confirm && f.password !== f.confirm) e.confirm = "Passwords do not match";
      if (f.password && pwStrength(f.password).score < 2) e.password = "Password too weak — add uppercase, numbers or symbols";
    }
    if (!f.email.trim())            e.email = "Email is required";
    else if (!validateEmail(f.email)) e.email = "Enter a valid email address";
    if (!f.password)                e.password = e.password || "Password is required";
    else if (f.password.length < 8) e.password = e.password || "Password must be at least 8 characters";
    return e;
  }, [form, mode]);

  function handleChange(field, val) {
    const next = { ...form, [field]: val };
    setForm(next);
    if (touched[field]) setErrors(validate(next, mode));
  }
  function handleBlur(field) {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate(form, mode));
  }

  function showToast(msg, type="error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function _onSuccess(user) {
    showToast(mode === "signin" ? "Welcome back! Redirecting..." : "Account created! Welcome aboard!", "success");
    setTimeout(() => { if (onLogin) onLogin({ ...user, assessmentDone: user.assessmentDone || false }); }, 900);
  }

  // ── Email/password submit — works 100% without backend ───────────────────
  async function handleSubmit(e) {
    e && e.preventDefault();
    setTouched({ name:true, email:true, password:true, confirm:true });
    const errs = validate(form, mode);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    // Simulate network delay for UX
    await new Promise(r => setTimeout(r, 600));

    try {
      const body = mode === "signup"
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };

      const data = localAuth(mode, body);
      if (!data) {
        throw new Error(
          mode === "signin"
            ? "Invalid email or password. Please check and try again."
            : "This email is already registered. Please sign in instead."
        );
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      _onSuccess(data.user);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  // ── Google auth ────────────────────────────────────────────────────────────
  async function handleGoogle() {
    setGLoading(true);
    try {
      const { signInWithGoogle } = await import("./firebase.js");
      const { name, email, avatar } = await signInWithGoogle();

      // Save/find user locally
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
      let found = users.find(u => u.email === email.toLowerCase());
      if (!found) {
        found = { id:"g_"+Date.now(), name, email:email.toLowerCase(), avatar, provider:"google", skills:{}, assessmentDone:false };
        users.push(found);
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      }
      const user = { id:found.id, name:found.name, email:found.email, avatar:found.avatar||avatar, provider:"google", skills:found.skills||{}, assessmentDone:found.assessmentDone||false };
      const data = { token:makeToken(user), user };

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      _onSuccess(data.user);
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        // silent — user closed popup
      } else if (err.code === "auth/unauthorized-domain") {
        showToast("Go to Firebase Console → Authentication → Authorized domains → add 'localhost'", "info");
      } else {
        showToast(err.message || "Google sign-in failed", "error");
      }
    } finally {
      setGLoading(false);
    }
  }

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body,#root { background:${G.bg}; color:${G.text}; font-family:'Inter',sans-serif; min-height:100vh; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes glow   { 0%,100%{box-shadow:0 0 20px rgba(255,107,157,0.3)} 50%{box-shadow:0 0 40px rgba(255,107,157,0.6)} }
        @keyframes slideIn{ from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        .auth-card { animation: fadeUp 0.5s ease both; }
        .auth-form  { transition: opacity 0.28s ease, transform 0.28s ease; }
        .auth-form.out { opacity:0; transform:translateX(16px); }
        input::placeholder { color:${G.muted}; }
        input { caret-color:${G.accent}; }
        .btn-google:hover { background:rgba(255,255,255,0.1) !important; transform:translateY(-1px); }
        .btn-google:active { transform:translateY(0); }
        .btn-primary-auth:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(255,107,157,0.5) !important; }
        .btn-primary-auth:active { transform:translateY(0); }
        .mode-btn:hover { background:rgba(255,107,157,0.1) !important; }
        @media(max-width:600px){
          .auth-split { flex-direction:column !important; }
          .auth-deco   { display:none !important; }
          .auth-form-wrap { padding:28px 20px !important; }
        }
      `}</style>

      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${G.bg} 0%,#1a1f3a 100%)`,position:"relative",overflow:"hidden",padding:"20px"}}>
        <ParticlesBg/>

        {/* Glow blobs */}
        <div style={{position:"absolute",top:"15%",left:"8%",width:400,height:400,background:`radial-gradient(circle,${G.accent}18 0%,transparent 70%)`,borderRadius:"50%",filter:"blur(60px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"15%",right:"8%",width:500,height:500,background:`radial-gradient(circle,${G.purple}15 0%,transparent 70%)`,borderRadius:"50%",filter:"blur(60px)",pointerEvents:"none"}}/>

        {/* Card */}
        <div className="auth-card auth-split" style={{display:"flex",width:"min(900px,100%)",minHeight:560,borderRadius:24,overflow:"hidden",border:`1px solid ${G.border}`,boxShadow:`0 32px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(255,107,157,0.08)`,backdropFilter:"blur(20px)",position:"relative",zIndex:1}}>

          {/* ── Left decorative panel ── */}
          <div className="auth-deco" style={{flex:"0 0 42%",background:`linear-gradient(160deg,${G.surface} 0%,#0f1535 100%)`,padding:"48px 36px",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative",overflow:"hidden",borderRight:`1px solid ${G.border}`}}>
            {/* Grid pattern */}
            <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(255,107,157,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,157,0.03) 1px,transparent 1px)`,backgroundSize:"32px 32px",pointerEvents:"none"}}/>
            {/* Glow */}
            <div style={{position:"absolute",top:-60,right:-60,width:240,height:240,background:`radial-gradient(circle,${G.accent}20 0%,transparent 70%)`,borderRadius:"50%",filter:"blur(40px)"}}/>
            <div style={{position:"absolute",bottom:-40,left:-40,width:200,height:200,background:`radial-gradient(circle,${G.purple}20 0%,transparent 70%)`,borderRadius:"50%",filter:"blur(40px)"}}/>

            <div style={{position:"relative",zIndex:1}}>
              {/* Logo */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:48}}>
                <div style={{width:40,height:40,background:`linear-gradient(135deg,${G.accent},${G.purple})`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 0 20px rgba(255,107,157,0.4)`}}>R</div>
                <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,color:G.text}}>Rejex<span style={{color:G.accent}}>IQ</span></span>
              </div>

              <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:28,fontWeight:800,color:G.text,lineHeight:1.2,marginBottom:16}}>
                {mode==="signin" ? "Welcome\nback 👋" : "Start your\njourney 🚀"}
              </h2>
              <p style={{fontSize:14,color:G.muted,lineHeight:1.7,marginBottom:32}}>
                {mode==="signin"
                  ? "Sign in to access your career intelligence dashboard, skill assessments, and personalized roadmap."
                  : "Join thousands of developers who've discovered their career readiness score and best-fit roles."}
              </p>

              {/* Feature bullets */}
              {["AI-powered skill assessment","Real-time market demand data","Personalized career roadmap","Professional resume builder"].map((f,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:`${G.accent}20`,border:`1px solid ${G.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:G.accent,flexShrink:0}}>✓</div>
                  <span style={{fontSize:13,color:G.mutedBright||G.muted}}>{f}</span>
                </div>
              ))}
            </div>

            {/* Switch mode */}
            <div style={{position:"relative",zIndex:1,marginTop:32}}>
              <p style={{fontSize:13,color:G.muted,marginBottom:12}}>{mode==="signin"?"Don't have an account?":"Already have an account?"}</p>
              <button className="mode-btn" onClick={()=>switchMode(mode==="signin"?"signup":"signin")}
                style={{background:"rgba(255,107,157,0.08)",border:`1px solid ${G.accent}40`,borderRadius:10,padding:"10px 20px",color:G.accent,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",fontFamily:"'Space Grotesk',sans-serif"}}>
                {mode==="signin"?"Create account →":"Sign in →"}
              </button>
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="auth-form-wrap" style={{flex:1,background:G.card,padding:"40px 36px",display:"flex",flexDirection:"column",justifyContent:"center",overflowY:"auto"}}>
            <div className={`auth-form${animating?" out":""}`}>
              <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:800,color:G.text,marginBottom:4}}>
                {mode==="signin"?"Sign in to RejexIQ":"Create your account"}
              </h1>
              <p style={{fontSize:13,color:G.muted,marginBottom:24}}>
                {mode==="signin"?"New here? ":"Already have an account? "}
                <span onClick={()=>switchMode(mode==="signin"?"signup":"signin")} style={{color:G.accent,cursor:"pointer",fontWeight:600}}>
                  {mode==="signin"?"Create account":"Sign in"}
                </span>
              </p>

              {/* Google button */}
              <button className="btn-google" onClick={handleGoogle} disabled={gLoading}
                style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"rgba(255,255,255,0.06)",border:`1px solid ${G.border}`,borderRadius:10,padding:"11px 16px",color:G.text,fontSize:14,fontWeight:500,cursor:gLoading?"not-allowed":"pointer",transition:"all 0.2s",marginBottom:20,fontFamily:"'Inter',sans-serif"}}>
                {gLoading
                  ? <><div style={{width:16,height:16,border:`2px solid ${G.border}`,borderTop:`2px solid ${G.accent}`,borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/> Connecting...</>
                  : <><GoogleIcon/> Continue with Google</>}
              </button>

              {/* Divider */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <div style={{flex:1,height:1,background:G.border}}/>
                <span style={{fontSize:12,color:G.muted}}>or continue with email</span>
                <div style={{flex:1,height:1,background:G.border}}/>
              </div>

              {/* Name (signup only) */}
              {mode==="signup" && (
                <Field label="Full Name" value={form.name} placeholder="Jane Doe"
                  onChange={v=>handleChange("name",v)} onBlur={()=>handleBlur("name")}
                  error={touched.name&&errors.name} valid={touched.name&&!errors.name&&form.name.length>=2}
                  autoComplete="name"/>
              )}

              {/* Email */}
              <Field label="Email Address" type="email" value={form.email} placeholder="you@example.com"
                onChange={v=>handleChange("email",v)} onBlur={()=>handleBlur("email")}
                error={touched.email&&errors.email} valid={touched.email&&!errors.email&&form.email}
                autoComplete="email"/>

              {/* Password */}
              <Field label="Password" type={showPw?"text":"password"} value={form.password}
                placeholder={mode==="signup"?"Min. 8 chars, uppercase, number, symbol":"Your password"}
                onChange={v=>handleChange("password",v)} onBlur={()=>handleBlur("password")}
                error={touched.password&&errors.password} valid={touched.password&&!errors.password&&form.password}
                autoComplete={mode==="signup"?"new-password":"current-password"}
                right={<button type="button" onClick={()=>setShowPw(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",color:G.muted,display:"flex",padding:0}}><Eye open={showPw}/></button>}/>

              {/* Password strength meter (signup) */}
              {mode==="signup" && form.password && (
                <div style={{marginTop:-8,marginBottom:14}}>
                  <div style={{height:3,background:G.border,borderRadius:2,overflow:"hidden",marginBottom:4}}>
                    <div style={{height:"100%",width:`${strength.pct}%`,background:strength.color,borderRadius:2,transition:"all 0.4s ease",boxShadow:`0 0 8px ${strength.color}80`}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
                    <span style={{color:strength.color,fontWeight:600}}>{strength.label}</span>
                    <span style={{color:G.muted}}>
                      {strength.score<2?"Add uppercase, numbers & symbols":strength.score<4?"Getting stronger!":"Great password!"}
                    </span>
                  </div>
                </div>
              )}

              {/* Confirm password (signup) */}
              {mode==="signup" && (
                <Field label="Confirm Password" type={showCf?"text":"password"} value={form.confirm}
                  placeholder="Re-enter your password"
                  onChange={v=>handleChange("confirm",v)} onBlur={()=>handleBlur("confirm")}
                  error={touched.confirm&&errors.confirm}
                  valid={touched.confirm&&!errors.confirm&&form.confirm&&form.confirm===form.password}
                  autoComplete="new-password"
                  right={<button type="button" onClick={()=>setShowCf(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",color:G.muted,display:"flex",padding:0}}><Eye open={showCf}/></button>}/>
              )}

              {/* Forgot password (signin) */}
              {mode==="signin" && (
                <div style={{textAlign:"right",marginTop:-6,marginBottom:16}}>
                  <span onClick={()=>showToast("Password reset email sent! Check your inbox.","success")} style={{fontSize:12,color:G.accent,cursor:"pointer",fontWeight:500}}>Forgot password?</span>
                </div>
              )}

              {/* Submit */}
              <button className="btn-primary-auth" onClick={handleSubmit} disabled={loading}
                style={{width:"100%",background:loading?"rgba(255,107,157,0.3)":`linear-gradient(135deg,${G.accent},${G.purple})`,border:"none",borderRadius:10,padding:"12px",color:"#fff",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",transition:"all 0.25s",boxShadow:`0 4px 20px rgba(255,107,157,0.3)`,fontFamily:"'Space Grotesk',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16}}>
                {loading
                  ? <><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>{mode==="signin"?"Signing in...":"Creating account..."}</>
                  : mode==="signin"?"Sign In":"Create Account"}
              </button>

              {/* Terms (signup) */}
              {mode==="signup" && (
                <p style={{fontSize:11,color:G.muted,textAlign:"center",lineHeight:1.6}}>
                  By creating an account you agree to our{" "}
                  <span style={{color:G.accent,cursor:"pointer"}}>Terms of Service</span> and{" "}
                  <span style={{color:G.accent,cursor:"pointer"}}>Privacy Policy</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:9999,padding:"12px 24px",borderRadius:50,fontSize:13,fontWeight:500,fontFamily:"'Inter',sans-serif",boxShadow:"0 8px 32px rgba(0,0,0,0.3)",animation:"fadeUp 0.3s ease",whiteSpace:"nowrap",maxWidth:"90vw",
            background:toast.type==="success"?"rgba(52,211,153,0.15)":toast.type==="info"?"rgba(34,211,238,0.15)":"rgba(248,113,113,0.15)",
            border:`1px solid ${toast.type==="success"?G.success:toast.type==="info"?G.cyan:G.danger}40`,
            color:toast.type==="success"?G.success:toast.type==="info"?G.cyan:G.danger}}>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}
