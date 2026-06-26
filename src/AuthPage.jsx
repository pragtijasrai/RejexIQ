import React, { useState, useEffect, useCallback } from "react";
import log from "./signin.svg";
import register from "./signup.svg";

const TOKEN_KEY = "rejexiq_token";
const USER_KEY = "rejexiq_user";
const LOCAL_USERS_KEY = "rejexiq_local_users";

function validateEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && !/[\s,]/.test(e);
}

function pwStrength(p) {
  if (!p) return { score: 0, label: "", color: "rgba(255,255,255,0.1)", pct: 0 };
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const map = [
    { label: "", color: "#e5e7eb", pct: 0 },
    { label: "Weak", color: "#ef4444", pct: 25 },
    { label: "Fair", color: "#f59e0b", pct: 50 },
    { label: "Good", color: "#06b6d4", pct: 75 },
    { label: "Strong", color: "#10b981", pct: 100 },
  ];
  return { score: s, ...map[s] };
}

const API = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : "http://localhost:5000");

export default function AuthPage({ onLogin, onNav, type, initialMode }) {
  const [isSignUpMode, setIsSignUpMode] = useState(() => (initialMode || type) === "signup");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const strength = pwStrength(form.password);

  const mode = isSignUpMode ? "signup" : "signin";

  useEffect(() => {
    setIsSignUpMode((initialMode || type) === "signup");
  }, [type, initialMode]);

  const toggleSignUpMode = () => {
    const next = !isSignUpMode;
    setIsSignUpMode(next);
    setForm({ name: "", email: "", password: "", confirm: "", terms: false });
    setErrors({}); setTouched({});
    if (onNav) onNav(next ? "signup" : "login");
  };

  const validate = useCallback((f = form, m = isSignUpMode ? "signup" : "signin") => {
    const e = {};
    if (m === "signup") {
      if (!f.name.trim()) e.name = "Full name is required";
      else if (f.name.trim().length < 2) e.name = "Name must be at least 2 characters";
      if (f.password && f.confirm && f.password !== f.confirm) e.confirm = "Passwords do not match";
      if (f.password && pwStrength(f.password).score < 2) e.password = "Password is too weak";
      if (!f.terms) e.terms = "You must agree to the Terms of Service & Privacy Policy";
    }
    if (!f.email.trim()) e.email = "Email is required";
    else if (!validateEmail(f.email)) e.email = "Enter a valid email address";
    if (!f.password) e.password = e.password || "Password is required";
    else if (f.password.length < 8) e.password = e.password || "Password must be at least 8 characters";
    return e;
  }, [form, isSignUpMode]);

  function handleChange(field, val) {
    const next = { ...form, [field]: val };
    setForm(next);
    if (touched[field]) setErrors(validate(next, mode));
  }

  function handleBlur(field) {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate(form, mode));
  }

  function showToast(msg, type = "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function _onSuccess(user) {
    showToast(mode === "signin" ? "Welcome back! Redirecting..." : "Account created! Welcome aboard!", "success");
    setTimeout(() => { if (onLogin) onLogin({ ...user, assessmentDone: user.assessmentDone || false }); }, 900);
  }

  async function handleSubmit(e) {
    e && e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true, terms: true });
    const errs = validate(form, mode);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    
    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/signin";
      const body = mode === "signup"
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };
        
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");
      
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      _onSuccess(data.user);
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  }

  async function handleGoogle() {
    setGLoading(true);
    try {
      const { signInWithGoogle } = await import("./firebase.js");
      const { idToken, name, email, avatar, uid } = await signInWithGoogle();
      
      const res = await fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, name, email, avatar, uid }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-in failed");
      
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      _onSuccess(data.user);
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") { }
      else if (err.code === "auth/unauthorized-domain") showToast("Add localhost to Firebase authorized domains", "info");
      else showToast(err.message || "Google sign-in failed", "error");
    } finally { setGLoading(false); }
  }

  const buttonClasses =
    `w-full text-white bg-gradient-to-r from-brightColor to-backgroundColor hover:opacity-90 focus:ring-4 focus:outline-none 
    focus:ring-brightColor/30 font-bold rounded-lg text-sm px-5 py-3 text-center transition-all 
    duration-200 transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(255,77,109,0.4)] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer border border-white/20`;
  const buttonForGFT =
    `inline-flex w-full justify-center items-center rounded-lg border border-gray-200 bg-white/60 
    py-2.5 px-4 text-sm font-medium text-gray-600 hover:bg-white/80 shadow-sm transition-all 
    duration-200 hover:shadow disabled:opacity-70 cursor-pointer backdrop-blur-sm`;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateX(-50%) translateY(16px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
      `}</style>
      <div
        className={`relative w-full bg-white min-h-screen overflow-hidden font-sans
             before:content-[''] before:absolute before:w-[1500px] before:h-[1500px] lg:before:h-[2000px] 
             lg:before:w-[2000px] lg:before:top-[-10%]  before:top-[initial] lg:before:right-[48%] 
             before:right-[initial]  max-lg:before:left-[30%] max-sm:bottom-[72%]   max-md:before:left-1/2 
              max-lg:before:bottom-[75%]  before:z-[6] before:rounded-[50%]    max-md:p-6     
              lg:before:-translate-y-1/2  max-lg:before:-translate-x-1/2  before:bg-backgroundColor 
              before:transition-all before:duration-[2000ms] lg:before:duration-[1800ms] ease-in-out  ${isSignUpMode
            ? `lg:before:translate-x-full before:-translate-x-1/2 
            before:translate-y-full lg:before:right-[52%] before:right-[initial]  sm:max-lg:before:bottom-[22%]
             max-sm:before:bottom-[20%]  max-md:before:left-1/2`
            : ""
          }`}
      >
        <button
          onClick={() => onNav && onNav("home")}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-[100] p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100/50 rounded-full transition-all duration-200 cursor-pointer"
          aria-label="Back to home"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="absolute w-full h-full top-0 left-0">
          <div
            className={` absolute top-[95%] lg:top-1/2 left-1/2 grid grid-cols-1 z-[5] -translate-x-1/2 
               -translate-y-full lg:-translate-y-1/2 lg:w-1/2 w-full transition-all duration-[1000ms] 
               lg:duration-[700ms] ease-in-out   ${isSignUpMode
                ? "lg:left-1/4   max-lg:top-[-10%]   max-lg:-translate-x-2/4   max-lg:translate-y-0"
                : "lg:left-3/4 "
              } `}
          >
            {}
            <div
              className={` flex items-center justify-center flex-col transition-all duration-[500ms] delay-[400ms] 
                overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 px-6 max-lg:mt-60  z-20 max-md:px-4 
                max-md:py-0 ${isSignUpMode
                  ? "opacity-0 z-10 pointer-events-none -translate-x-12 scale-95"
                  : "opacity-100 pointer-events-auto translate-x-0 scale-100"
                }`}
            >
              {}
              <div className="w-full md:mt-0 sm:max-w-md relative">
                <div className="py-8 px-8 flex flex-col gap-6 md:gap-7 sm:py-10 sm:px-10">
                  <div className="text-center">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-backgroundColor md:text-2xl">
                      Welcome Back
                    </h1>
                    <p className="text-sm font-normal text-gray-500 mt-1">
                      Sign in to your account
                    </p>
                  </div>

                  <form className="flex flex-col px-2" style={{ gap: '16px' }} onSubmit={handleSubmit}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#6b7280', width: '20px', height: '20px' }}>
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={form.email} onChange={e => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")}
                        className="bg-[#fff5f5]/60 border border-rose-200/60 text-gray-900 placeholder-gray-500 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full transition-all duration-200 shadow-sm outline-none backdrop-blur-sm" style={{ height: '48px', paddingLeft: '50px', paddingTop: '12px', paddingBottom: '12px' }}
                        placeholder="Email address"
                      />
                      {touched.email && errors.email && <div className="text-red-500 text-xs mt-1 font-medium">{errors.email}</div>}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#6b7280', width: '20px', height: '20px' }}>
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={form.password} onChange={e => handleChange("password", e.target.value)} onBlur={() => handleBlur("password")}
                        className="bg-[#fff5f5]/60 border border-rose-200/60 text-gray-900 placeholder-gray-500 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full transition-all duration-200 shadow-sm outline-none backdrop-blur-sm" style={{ height: '48px', paddingLeft: '50px', paddingTop: '12px', paddingBottom: '12px' }}
                        placeholder="Password"
                      />
                      {touched.password && errors.password && <div className="text-red-500 text-xs mt-1 font-medium">{errors.password}</div>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brightColor focus:ring-brightColor cursor-pointer" />
                        </div>
                        <div className="text-sm" style={{ marginLeft: '12px' }}>
                          <label className="text-gray-500 cursor-pointer" style={{ color: '#6b7280' }}>Remember me</label>
                        </div>
                      </div>
                      <button type="button" onClick={() => showToast("Password reset email sent!", "success")} className="text-sm font-medium text-brightColor hover:underline transition-colors bg-transparent border-none cursor-pointer">
                        Forgot password?
                      </button>
                    </div>

                    <button type="submit" disabled={loading} className={buttonClasses} style={{ height: '48px' }}>
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </form>

                  <div className="relative px-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 text-gray-500 bg-white/60 backdrop-blur-md rounded-full border border-white/50">Or continue with</span>
                    </div>
                  </div>

                  <div className="px-2">
                    <button type="button" onClick={handleGoogle} disabled={gLoading} className={`${buttonForGFT} w-full gap-3`} style={{ height: '44px' }}>
                      {gLoading ? <div className="w-5 h-5 border-2 border-gray-300 border-t-backgroundColor rounded-full animate-spin" /> :
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                        </svg>}
                      <span className="text-sm font-medium text-gray-600">Continue with Google</span>
                    </button>
                  </div>

                  <p className="text-sm text-center text-gray-600 mt-4 border-t border-gray-200 pt-4">
                    If you don&apos;t have an account, <button type="button" onClick={toggleSignUpMode} className="text-brightColor font-medium cursor-pointer bg-transparent border-none">Do Sign Up</button>
                  </p>
                </div>
              </div>
            </div>

            {}
            <div
              className={`flex items-center justify-center flex-col px-6 transition-all duration-[500ms]
                 delay-[400ms] overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 py-0 z-10 max-md:px-4 
                 max-md:py-0 ${isSignUpMode
                  ? "opacity-100 z-20 pointer-events-auto translate-x-0 scale-100"
                  : "opacity-0 pointer-events-none translate-x-12 scale-95"
                }`}
            >
              {}
              <div className="w-full md:mt-0 sm:max-w-md relative">
                <div className="py-8 px-10 flex flex-col gap-6 md:gap-7 sm:py-10 sm:px-14">
                  <div className="text-center">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-backgroundColor md:text-2xl">
                      Create Account
                    </h1>
                    <p className="text-sm font-normal text-gray-500 mt-1">
                      Sign up to get started
                    </p>
                  </div>

                  <form className="flex flex-col" style={{ gap: '16px' }} onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 lg:grid-cols-1" style={{ gap: '16px' }}>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#6b7280', width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <input
                          type="text" value={form.name} onChange={e => handleChange("name", e.target.value)} onBlur={() => handleBlur("name")}
                          className="bg-[#fff5f5]/60 border border-rose-200/60 text-gray-900 placeholder-gray-500 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full transition-all duration-200 shadow-sm outline-none backdrop-blur-sm" style={{ height: '48px', paddingLeft: '50px', paddingTop: '12px', paddingBottom: '12px' }}
                          placeholder="Full name"
                        />
                        {touched.name && errors.name && <div className="text-red-500 text-xs mt-1 font-medium">{errors.name}</div>}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#6b7280', width: '20px', height: '20px' }}>
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                          </svg>
                        </div>
                        <input
                          type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")}
                          className="bg-[#fff5f5]/60 border border-rose-200/60 text-gray-900 placeholder-gray-500 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full transition-all duration-200 shadow-sm outline-none backdrop-blur-sm" style={{ height: '48px', paddingLeft: '50px', paddingTop: '12px', paddingBottom: '12px' }}
                          placeholder="Email address"
                        />
                        {touched.email && errors.email && <div className="text-red-500 text-xs mt-1 font-medium">{errors.email}</div>}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#6b7280', width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <input
                          type="password" value={form.password} onChange={e => handleChange("password", e.target.value)} onBlur={() => handleBlur("password")}
                          className="bg-[#fff5f5]/60 border border-rose-200/60 text-gray-900 placeholder-gray-500 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full transition-all duration-200 shadow-sm outline-none backdrop-blur-sm" style={{ height: '48px', paddingLeft: '50px', paddingTop: '12px', paddingBottom: '12px' }}
                          placeholder="Password"
                        />
                        {touched.password && errors.password && <div className="text-red-500 text-xs mt-1 font-medium">{errors.password}</div>}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#6b7280', width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <input
                          type="password" value={form.confirm} onChange={e => handleChange("confirm", e.target.value)} onBlur={() => handleBlur("confirm")}
                          className="bg-[#fff5f5]/60 border border-rose-200/60 text-gray-900 placeholder-gray-500 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full transition-all duration-200 shadow-sm outline-none backdrop-blur-sm" style={{ height: '48px', paddingLeft: '50px', paddingTop: '12px', paddingBottom: '12px' }}
                          placeholder="Confirm password"
                        />
                        {touched.confirm && errors.confirm && <div className="text-red-500 text-xs mt-1 font-medium">{errors.confirm}</div>}
                      </div>
                    </div>

                    {form.password && isSignUpMode && (
                      <div className="mt-2">
                        <div className="h-[5px] bg-gray-200 rounded-full overflow-hidden mb-[3px]">
                          <div style={{ width: `${strength.pct}%`, background: strength.color }} className="h-full rounded-full transition-all duration-400" />
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span style={{ color: strength.color }} className="font-semibold">{strength.label}</span>
                          <span className="text-gray-400">{strength.score < 2 ? "Add uppercase, numbers & symbols" : strength.score < 4 ? "Getting stronger!" : "Great password!"}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input type="checkbox" checked={form.terms} onChange={e => handleChange("terms", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brightColor focus:ring-brightColor cursor-pointer" />
                      </div>
                      <div className="text-sm" style={{ marginLeft: '12px' }}>
                        <label className="text-gray-500 cursor-pointer" style={{ color: '#6b7280' }} onClick={() => handleChange("terms", !form.terms)}>
                          I agree to the <span className="text-brightColor font-medium">Terms of Service</span> and <span className="text-brightColor font-medium">Privacy Policy</span>
                        </label>
                        {touched.terms && errors.terms && <div className="text-red-500 text-xs mt-1 font-medium">{errors.terms}</div>}
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className={buttonClasses} style={{ height: '48px' }}>
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 text-gray-500 bg-white/60 backdrop-blur-md rounded-full border border-white/50">Or sign up with</span>
                    </div>
                  </div>

                  <div className="px-2">
                    <button type="button" onClick={handleGoogle} disabled={gLoading} className={`${buttonForGFT} w-full gap-3`} style={{ height: '44px' }}>
                      {gLoading ? <div className="w-5 h-5 border-2 border-gray-300 border-t-backgroundColor rounded-full animate-spin" /> :
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                        </svg>}
                      <span className="text-sm font-medium text-gray-600">Continue with Google</span>
                    </button>
                  </div>

                  <p className="text-sm text-center text-gray-600 mt-4 border-t border-gray-200 pt-4">
                    Already have an account? <button type="button" onClick={toggleSignUpMode} className="text-brightColor font-medium cursor-pointer bg-transparent border-none">Sign in</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="absolute h-full w-full top-0 left-0 grid grid-cols-1   max-lg:grid-rows-[1fr_2fr_1fr]  
        lg:grid-cols-2">
          {}
          <div
            className={`flex flex-row justify-around lg:flex-col items-center  max-lg:col-start-1 max-lg:col-end-2  
              max-lg:px-[8%]   max-lg:py-10 lg:items-center  text-center z-[6]   max-lg:row-start-1 max-lg:row-end-2    
               px-[10%] pt-12 pb-0 ${isSignUpMode ? "pointer-events-none" : " pointer-events-auto"
              }`}
          >
            <div
              className={`text-white transition-transform duration-[900ms] lg:duration-[1100ms] ease-in-out 
                 delay-[800ms] lg:delay-[400ms] max-lg:pr-[15%] max-md:px-4 max-md:py-2 ${isSignUpMode
                  ? "lg:translate-x-[-800px]   max-lg:translate-y-[-300px]"
                  : ""
                }`}
            >
              <h3 className="font-semibold leading-none text-[1.2rem] lg:text-[1.5rem] text-white">
                New here ?
              </h3>
              <p className="text-[0.7rem] lg:text-[0.95rem] px-0 py-2 lg:py-[0.7rem] text-white/80">
                Sign up and discover our platform
              </p>
              <button
                className="bg-transparent w-[110px] h-[35px] text-white text-[0.7rem] lg:w-[130px] lg:h-[41px] 
                lg:text-[0.8rem]  font-semibold   border-2 border-white rounded-full transition-colors duration-300 
                hover:bg-white hover:text-backgroundColor cursor-pointer"
                onClick={toggleSignUpMode}
              >
                Sign up
              </button>
            </div>

            <img
              src={log}
              className={`  max-md:hidden max-lg:translate-y-[-40px] w-[200px] lg:w-[380px] mt-auto transition-transform 
                duration-[900ms] lg:duration-[1100ms] ease-in-out delay-[600ms] lg:delay-[400ms] ${isSignUpMode
                  ? "lg:translate-x-[-800px]   max-lg:translate-y-[-300px]"
                  : ""
                }`}
              alt="login"
            />
          </div>

          {}
          <div
            className={`flex flex-row   max-lg:row-start-3 max-lg:row-end-4 lg:flex-col items-center lg:items-center 
              justify-around text-center z-[6]   max-lg:col-start-1 max-lg:col-end-2  max-lg:px-[8%]   max-lg:py-10 
               px-[10%] pt-12 pb-0 ${isSignUpMode ? " pointer-events-auto" : "pointer-events-none"
              }`}
          >
            <div
              className={`text-white transition-transform duration-[900ms] lg:duration-[1100ms] ease-in-out delay-[800ms]
                 lg:delay-[400ms] max-lg:pr-[15%] max-md:px-4 max-md:py-2 ${isSignUpMode
                  ? ""
                  : "lg:translate-x-[800px]   max-lg:translate-y-[300px]"
                }`}
            >
              <h3 className="font-semibold leading-none text-[1.2rem] lg:text-[1.5rem] text-white">
                One of us ?
              </h3>
              <p className=" py-2 text-[0.7rem] lg:text-[0.95rem] px-0  lg:py-[0.7rem] text-white/80">
                Sign in to your account to have hassle free experience
              </p>
              <button
                className=" text-white bg-transparent w-[110px] h-[35px]  text-[0.7rem] lg:w-[130px] 
                lg:h-[41px] lg:text-[0.8rem]  font-semibold   border-2 border-white rounded-full 
                transition-colors duration-300 hover:bg-white hover:text-backgroundColor cursor-pointer"
                onClick={toggleSignUpMode}
              >
                Sign in
              </button>
            </div>

            <img
              src={register}
              className={`  max-md:hidden w-[200px] lg:w-[450px] transition-transform duration-[900ms] 
                lg:duration-[1100ms] ease-in-out delay-[600ms] lg:delay-[400ms] ${isSignUpMode
                  ? ""
                  : "lg:translate-x-[800px]  max-lg:translate-y-[300px]"
                }`}
              alt="register"
            />
          </div>
        </div>

        {}
        {toast && (
          <div className={`fixed bottom-7 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full text-[13px] font-medium shadow-xl whitespace-nowrap max-w-[90vw] animate-[fadeUp_0.3s_ease] ${toast.type === "success" ? "bg-[#34d399]/15 border border-[#10b981]/40 text-[#10b981]" :
            toast.type === "info" ? "bg-[#22d3ee]/15 border border-[#06b6d4]/40 text-[#06b6d4]" :
              "bg-[#f87171]/15 border border-[#ef4444]/40 text-[#ef4444]"
            }`}>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}
