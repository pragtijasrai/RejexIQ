import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

// ── Your Firebase project config ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDFPAHHTZX98eLm7MiV8Jd0B7otUHpolQQ",
  authDomain:        "rejxiq.firebaseapp.com",
  projectId:         "rejxiq",
  storageBucket:     "rejxiq.firebasestorage.app",
  messagingSenderId: "58710090518",
  appId:             "1:58710090518:web:400be3d6c95e063552a637",
  measurementId:     "G-GFRCJRTJFH",
};

// ── Initialize ────────────────────────────────────────────────────────────────
const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const analytics = getAnalytics(app);

// ── Google provider ───────────────────────────────────────────────────────────
const provider = new GoogleAuthProvider();
provider.addScope("profile");
provider.addScope("email");
provider.setCustomParameters({ prompt: "select_account" });

// ── signInWithGoogle — called from AuthPage ───────────────────────────────────
export async function signInWithGoogle() {
  const result  = await signInWithPopup(auth, provider);
  const user    = result.user;
  const idToken = await user.getIdToken();
  return {
    idToken,
    name:   user.displayName || "",
    email:  user.email       || "",
    avatar: user.photoURL    || "",
    uid:    user.uid,
  };
}

// ── Sign out ──────────────────────────────────────────────────────────────────
export async function signOutFirebase() {
  await firebaseSignOut(auth);
}

export { auth, analytics, onAuthStateChanged };
export default app;
