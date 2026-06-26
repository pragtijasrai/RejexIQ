import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { signInWithGoogle, signOutFirebase } from "./firebase.js";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : "http://localhost:5000");
const TOKEN_KEY = "rejexiq_token";
const USER_KEY  = "rejexiq_user";

function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
function loadSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw   = localStorage.getItem(USER_KEY);
  if (!token || !raw) return null;
  try { return { token, user: JSON.parse(raw) }; } catch { return null; }
}

export function AuthProvider({ children, onLogin, onLogout }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token,       setToken]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [authError,   setAuthError]   = useState(null);

  
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setToken(session.token);
      setCurrentUser(session.user);
      
      if (onLogin) onLogin(session.user);
    }
    setLoading(false);
  }, []);

  const _setAuth = useCallback((token, user) => {
    saveSession(token, user);
    setToken(token);
    setCurrentUser(user);
    setAuthError(null);
    if (onLogin) onLogin(user);
  }, [onLogin]);

  
  const signup = useCallback(async ({ name, email, password }) => {
    setAuthError(null);
    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    _setAuth(data.token, data.user);
    return data.user;
  }, [_setAuth]);

  
  const signin = useCallback(async ({ email, password }) => {
    setAuthError(null);
    const res = await fetch(`${API}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sign in failed");
    _setAuth(data.token, data.user);
    return data.user;
  }, [_setAuth]);

  
  const googleLogin = useCallback(async () => {
    setAuthError(null);
    
    const { idToken, name, email, avatar, uid } = await signInWithGoogle();

    
    const res = await fetch(`${API}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, name, email, avatar, uid }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Google auth failed");
    _setAuth(data.token, data.user);
    return data.user;
  }, [_setAuth]);

  
  const logout = useCallback(async () => {
    try { await signOutFirebase(); } catch (_) {}
    clearSession();
    setToken(null);
    setCurrentUser(null);
    if (onLogout) onLogout();
  }, [onLogout]);

  
  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { logout(); return; }
      const data = await res.json();
      setCurrentUser(data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch (_) {}
  }, [token, logout]);

  const value = {
    currentUser, token, loading, authError,
    signup, signin, googleLogin, logout, refreshUser,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
