import { useState, useEffect, useRef } from "react";

// ─── Floating Leaf SVG ───────────────────────────────────────────────────────
const Leaf = ({ style, className }) => (
  <svg viewBox="0 0 80 120" style={style} className={className}>
    <path
      d="M40 5 C10 20, -5 60, 10 90 C20 110, 40 118, 40 118 C40 118, 60 110, 70 90 C85 60, 70 20, 40 5Z"
      fill="currentColor"
      opacity="0.85"
    />
    <path d="M40 10 Q40 60, 40 115" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" />
    <path d="M40 30 Q25 45, 15 55" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none" />
    <path d="M40 30 Q55 45, 65 55" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none" />
    <path d="M40 50 Q22 62, 12 72" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none" />
    <path d="M40 50 Q58 62, 68 72" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none" />
  </svg>
);

// ─── Password Strength ───────────────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: "Easy", color: "#ef4444" };
  if (s <= 3) return { score: s, label: "Medium", color: "#f59e0b" };
  return { score: s, label: "Strong", color: "#22c55e" };
}

// ─── Eye Icon ────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AuthPage({ onLogin, onNav, initialMode } = {}) {
  const [mode, setMode] = useState(initialMode || "signin"); // "signin" | "signup"
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "",
  });

  const strength = getStrength(form.password);

  const switchMode = (next) => {
    if (next === mode) return;
    setAnimating(true);
    setErrors({});
    setTouched({});
    setForm({ name: "", email: "", phone: "", password: "", confirm: "" });
    setTimeout(() => {
      setMode(next);
      setAnimating(false);
    }, 350);
    if (onNav) onNav(next === "signin" ? "login" : "signup");
  };

  const validate = () => {
    const e = {};
    if (mode === "signup") {
      if (!form.name.trim()) e.name = "Full name is required";
      else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
      if (!form.phone.trim()) e.phone = "Phone number is required";
      else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number";
      if (form.password !== form.confirm) e.confirm = "Passwords do not match";
      if (strength.score < 2) e.password = "Password is too easy — use at least Medium strength";
    }
    if (!form.email.trim()) e.email = "Login, email or phone number is required";
    else if (form.email.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address";
    if (!form.password) e.password = e.password || "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleSubmit = async () => {
    setTouched({ name: true, email: true, phone: true, password: true, confirm: true });
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    if (mode === "signin") {
      showToast("Welcome back! Signed in successfully.", "success");
      if (onLogin) {
        setTimeout(() => onLogin({ name: form.email.split("@")[0], email: form.email, assessmentDone: false }), 800);
      }
    } else {
      showToast("Account created! Welcome aboard 🌿", "success");
      if (onLogin) {
        setTimeout(() => onLogin({ name: form.name, email: form.email, phone: form.phone, assessmentDone: false }), 800);
      }
    }
  };

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const e = validate();
    setErrors(e);
  };

  const handleChange = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (touched[field]) {
      const e = validate();
      setErrors(e);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green-dark: #1a3028;
          --green-mid: #2d5a45;
          --green-light: #4a8c6a;
          --green-pale: #8dbfa0;
          --cream: #f4f1ec;
          --white: #ffffff;
          --gray-100: #f8f7f5;
          --gray-200: #e8e4de;
          --gray-400: #9a9590;
          --gray-600: #6b6560;
          --gray-800: #2c2a27;
          --error: #c0392b;
          --success: #22c55e;
          --info: #3b82f6;
          --shadow-card: 0 32px 80px rgba(26,48,40,0.18), 0 8px 24px rgba(26,48,40,0.10);
          --shadow-input: 0 2px 8px rgba(26,48,40,0.07);
        }

        body { font-family: 'DM Sans', sans-serif; background: var(--cream); }

        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #e8f0eb 0%, #f4f1ec 40%, #dce8e0 100%);
        }

        /* ── Animated background leaves ── */
        .bg-leaves { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .bg-leaf {
          position: absolute;
          color: var(--green-mid);
          animation: floatLeaf linear infinite;
          opacity: 0.12;
        }
        .bg-leaf:nth-child(1) { width: 120px; left: -3%; top: 5%; animation-duration: 18s; animation-delay: 0s; }
        .bg-leaf:nth-child(2) { width: 80px; left: 8%; top: 60%; animation-duration: 22s; animation-delay: -6s; transform: rotate(40deg); }
        .bg-leaf:nth-child(3) { width: 160px; left: 88%; top: 10%; animation-duration: 26s; animation-delay: -3s; transform: rotate(-30deg); }
        .bg-leaf:nth-child(4) { width: 100px; left: 75%; top: 65%; animation-duration: 20s; animation-delay: -10s; transform: rotate(70deg); }
        .bg-leaf:nth-child(5) { width: 70px; left: 45%; top: -5%; animation-duration: 30s; animation-delay: -15s; transform: rotate(-15deg); }
        .bg-leaf:nth-child(6) { width: 90px; left: 60%; top: 80%; animation-duration: 24s; animation-delay: -8s; transform: rotate(110deg); }

        @keyframes floatLeaf {
          0%   { transform: translateY(0px) rotate(0deg); }
          33%  { transform: translateY(-18px) rotate(5deg); }
          66%  { transform: translateY(8px) rotate(-4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        /* ── Card ── */
        .auth-card {
          position: relative;
          z-index: 1;
          display: flex;
          width: min(900px, 96vw);
          min-height: 540px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Decorative Panel ── */
        .auth-deco {
          flex: 0 0 42%;
          background: linear-gradient(160deg, var(--green-dark) 0%, var(--green-mid) 55%, var(--green-light) 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
        }

        .deco-wave {
          position: absolute;
          right: -40px;
          top: -20px;
          width: 160px;
          height: 110%;
          background: rgba(255,255,255,0.06);
          border-radius: 60% 0 0 60%;
        }
        .deco-wave2 {
          position: absolute;
          right: -20px;
          bottom: -30px;
          width: 120px;
          height: 80%;
          background: rgba(255,255,255,0.04);
          border-radius: 60% 0 0 40%;
        }

        .deco-leaves-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .deco-leaf {
          position: absolute;
          color: rgba(255,255,255,0.18);
          animation: decoFloat linear infinite;
        }
        .deco-leaf:nth-child(1) { width: 90px; left: 10%; top: 8%; animation-duration: 14s; }
        .deco-leaf:nth-child(2) { width: 60px; left: 55%; top: 15%; animation-duration: 18s; animation-delay: -4s; transform: rotate(50deg); }
        .deco-leaf:nth-child(3) { width: 110px; left: 20%; top: 55%; animation-duration: 20s; animation-delay: -8s; transform: rotate(-25deg); }
        .deco-leaf:nth-child(4) { width: 50px; left: 65%; top: 70%; animation-duration: 16s; animation-delay: -6s; transform: rotate(80deg); }

        @keyframes decoFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-14px) rotate(6deg); }
        }

        .deco-content { position: relative; z-index: 1; text-align: center; color: white; }
        .deco-logo {
          width: 54px; height: 54px;
          background: rgba(255,255,255,0.15);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .deco-logo svg { width: 28px; height: 28px; }
        .deco-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 500;
          line-height: 1.2; margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        .deco-subtitle {
          font-size: 0.82rem; opacity: 0.7; line-height: 1.6;
          font-weight: 300; max-width: 200px; margin: 0 auto;
        }

        .deco-switch { margin-top: 40px; }
        .deco-switch p { font-size: 0.78rem; opacity: 0.6; margin-bottom: 10px; }
        .deco-switch-btn {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white; font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 500;
          padding: 9px 24px; border-radius: 50px;
          cursor: pointer; backdrop-filter: blur(8px);
          transition: all 0.25s ease;
          letter-spacing: 0.03em;
        }
        .deco-switch-btn:hover { background: rgba(255,255,255,0.25); transform: translateY(-1px); }

        /* ── Form Panel ── */
        .auth-form-wrap {
          flex: 1;
          background: var(--white);
          padding: 28px 36px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .auth-form-wrap.animating { opacity: 0; transform: translateX(16px); }

        .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 500;
          color: var(--gray-800); margin-bottom: 4px;
          letter-spacing: -0.03em;
        }
        .form-subtitle { font-size: 0.82rem; color: var(--gray-400); margin-bottom: 16px; }
        .form-subtitle a { color: var(--green-mid); text-decoration: none; font-weight: 500; cursor: pointer; }
        .form-subtitle a:hover { text-decoration: underline; }

        /* ── Fields ── */
        .field-wrap { margin-bottom: 10px; position: relative; }
        .field-label {
          display: block; font-size: 0.72rem; font-weight: 500;
          color: var(--gray-600); margin-bottom: 4px; letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .field-input {
          width: 100%; padding: 9px 12px;
          border: 1.5px solid var(--gray-200);
          border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-size: 0.87rem; color: var(--gray-800);
          background: var(--gray-100);
          box-shadow: var(--shadow-input);
          transition: all 0.2s ease; outline: none;
        }
        .field-input:focus { border-color: var(--green-light); background: white; box-shadow: 0 0 0 3px rgba(74,140,106,0.12); }
        .field-input.has-error { border-color: var(--error); background: #fff8f8; }
        .field-input.is-valid { border-color: var(--success); }
        .field-input-wrap { position: relative; }
        .field-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--gray-400);
          display: flex; align-items: center; padding: 0;
          transition: color 0.2s;
        }
        .field-eye:hover { color: var(--green-mid); }
        .field-error { font-size: 0.73rem; color: var(--error); margin-top: 4px; display: flex; align-items: center; gap: 4px; }
        .field-error::before { content: "⚠"; font-size: 0.68rem; }

        /* ── Password Strength Bar ── */
        .strength-bar-wrap { margin-top: 4px; }
        .strength-bar-track {
          height: 3px; border-radius: 2px; background: var(--gray-200); overflow: hidden;
        }
        .strength-bar-fill {
          height: 100%; border-radius: 2px;
          transition: width 0.4s ease, background 0.4s ease;
        }
        .strength-label { font-size: 0.7rem; margin-top: 2px; font-weight: 500; }

        /* ── Name row ── */
        .field-row { display: flex; gap: 12px; }
        .field-row .field-wrap { flex: 1; }

        /* ── Submit ── */
        .btn-submit {
          width: 100%; padding: 11px;
          background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%);
          color: white; font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; font-weight: 500; letter-spacing: 0.04em;
          border: none; border-radius: 12px; cursor: pointer;
          transition: all 0.25s ease; margin-top: 4px;
          position: relative; overflow: hidden;
        }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,48,40,0.28); }
        .btn-submit:active { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .btn-loader {
          display: inline-flex; align-items: center; gap: 8px;
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Forgot ── */
        .forgot-link {
          display: block; text-align: center; margin-top: 8px;
          font-size: 0.78rem; color: var(--green-mid); text-decoration: none;
          cursor: pointer; font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }

        /* ── Terms ── */
        .terms-text {
          font-size: 0.7rem; color: var(--gray-400); text-align: center;
          margin-top: 8px; line-height: 1.5;
        }
        .terms-text a { color: var(--green-mid); text-decoration: none; }

        /* ── Toast ── */
        .toast {
          position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
          z-index: 9999; padding: 12px 24px; border-radius: 50px;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          animation: toastIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
          white-space: nowrap; max-width: 90vw;
        }
        .toast.error   { background: #fee2e2; color: #991b1b; }
        .toast.success { background: #dcfce7; color: #166534; }
        .toast.info    { background: #dbeafe; color: #1e40af; }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 680px) {
          .auth-deco { display: none; }
          .auth-form-wrap { padding: 36px 28px 28px; }
          .auth-card { width: 96vw; min-height: auto; border-radius: 20px; }
          .field-row { flex-direction: column; gap: 0; }
        }
        @media (max-width: 400px) {
          .auth-form-wrap { padding: 28px 18px 20px; }
          .form-title { font-size: 1.8rem; }
        }
      `}</style>

      <div className="auth-root">
        {/* Background leaves */}
        <div className="bg-leaves">
          {[1, 2, 3, 4, 5, 6].map(i => <Leaf key={i} className="bg-leaf" />)}
        </div>

        {/* Card */}
        <div className="auth-card">
          {/* Decorative panel */}
          <div className="auth-deco">
            <div className="deco-wave" />
            <div className="deco-wave2" />
            <div className="deco-leaves-wrap">
              {[1, 2, 3, 4].map(i => <Leaf key={i} className="deco-leaf" />)}
            </div>
            <div className="deco-content">
              <div className="deco-logo">
                <svg viewBox="0 0 28 28" fill="none">
                  <path d="M14 2C8 2,4 8,4 14s4 12,10 12c3 0,5.5-1.2,7.2-3.1" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M14 2c3 4,5 8,5 12s-2 8-5 12" stroke="white" strokeWidth="1.5" fill="none" />
                  <path d="M6 10h16M6 18h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                </svg>
              </div>
              <div className="deco-title">
                {mode === "signin" ? "Welcome\nBack" : "Start Your\nJourney"}
              </div>
              <div className="deco-subtitle">
                {mode === "signin"
                  ? "Explore paths that lead you toward your goals and success"
                  : "Join thousands discovering their best career roadmap"}
              </div>
              <div className="deco-switch">
                <p>{mode === "signin" ? "Don't have an account?" : "Already have an account?"}</p>
                <button className="deco-switch-btn" onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}>
                  {mode === "signin" ? "Create account →" : "Sign in →"}
                </button>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className={`auth-form-wrap ${animating ? "animating" : ""}`}>
            <div className="form-title">{mode === "signin" ? "Log in" : "Create account"}</div>
            <div className="form-subtitle">
              {mode === "signin" ? (
                <>New here? <a onClick={() => switchMode("signup")}>Create an account</a></>
              ) : (
                <>Already have an account? <a onClick={() => switchMode("signin")}>Sign in</a></>
              )}
            </div>

            {/* Name fields (signup only) */}
            {mode === "signup" && (
              <div className="field-row">
                <div className="field-wrap">
                  <label className="field-label">Full Name *</label>
                  <input
                    className={`field-input ${touched.name && errors.name ? "has-error" : touched.name && !errors.name && form.name ? "is-valid" : ""}`}
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={e => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                  />
                  {touched.name && errors.name && <div className="field-error">{errors.name}</div>}
                </div>
              </div>
            )}

            {/* Email / Login */}
            <div className="field-wrap">
              <label className="field-label">{mode === "signup" ? "Email Address *" : "Login, email or phone number"}</label>
              <input
                className={`field-input ${touched.email && errors.email ? "has-error" : touched.email && !errors.email && form.email ? "is-valid" : ""}`}
                placeholder={mode === "signup" ? "you@example.com" : "Email or phone number"}
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                type="email"
              />
              {touched.email && errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            {/* Phone (signup only) */}
            {mode === "signup" && (
              <div className="field-wrap">
                <label className="field-label">Phone Number *</label>
                <input
                  className={`field-input ${touched.phone && errors.phone ? "has-error" : touched.phone && !errors.phone && form.phone ? "is-valid" : ""}`}
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  type="tel"
                />
                {touched.phone && errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>
            )}

            {/* Password */}
            <div className="field-wrap">
              <label className="field-label">Password *</label>
              <div className="field-input-wrap">
                <input
                  className={`field-input ${touched.password && errors.password ? "has-error" : touched.password && !errors.password && form.password ? "is-valid" : ""}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  type={showPass ? "text" : "password"}
                  style={{ paddingRight: "42px" }}
                />
                <button className="field-eye" type="button" onClick={() => setShowPass(v => !v)}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {mode === "signup" && form.password && (
                <div className="strength-bar-wrap">
                  <div className="strength-bar-track">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: `${(strength.score / 5) * 100}%`,
                        background: strength.color,
                      }}
                    />
                  </div>
                  <div className="strength-label" style={{ color: strength.color }}>
                    {strength.label} — {strength.score < 2 ? "Add uppercase, numbers or symbols" : strength.score < 4 ? "Getting better!" : "Great password!"}
                  </div>
                </div>
              )}
              {touched.password && errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            {/* Confirm password (signup only) */}
            {mode === "signup" && (
              <div className="field-wrap">
                <label className="field-label">Confirm Password *</label>
                <div className="field-input-wrap">
                  <input
                    className={`field-input ${touched.confirm && errors.confirm ? "has-error" : touched.confirm && !errors.confirm && form.confirm ? "is-valid" : ""}`}
                    placeholder="Re-enter password"
                    value={form.confirm}
                    onChange={e => handleChange("confirm", e.target.value)}
                    onBlur={() => handleBlur("confirm")}
                    type={showConfirm ? "text" : "password"}
                    style={{ paddingRight: "42px" }}
                  />
                  <button className="field-eye" type="button" onClick={() => setShowConfirm(v => !v)}>
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {touched.confirm && errors.confirm && <div className="field-error">{errors.confirm}</div>}
              </div>
            )}

            {/* Submit */}
            <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="btn-loader"><span className="spinner" />{mode === "signin" ? "Signing in…" : "Creating account…"}</span>
              ) : mode === "signin" ? "Log in" : "Create account"}
            </button>

            {mode === "signin" && (
              <a className="forgot-link" onClick={() => showToast("Password reset email sent!", "success")}>
                Forgot login or password?
              </a>
            )}

            {mode === "signup" && (
              <div className="terms-text">
                By creating an account you agree to our{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </div>
    </>
  );
}
