/**
 * RejexIQ — Auth Routes
 * POST /api/auth/signup
 * POST /api/auth/signin
 * POST /api/auth/google
 * GET  /api/auth/me
 */

const express = require("express");
const jwt     = require("jsonwebtoken");
const router  = express.Router();

const JWT_SECRET  = process.env.JWT_SECRET  || "rejexiq_dev_secret_2025";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// ── Try to use MongoDB; fall back to in-memory if not connected ───────────────
let User = null;
let inMemoryUsers = [];   // fallback store

try {
  User = require("./models/User");
} catch (_) {}

// ── JWT helper ────────────────────────────────────────────────────────────────
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// ── Auth middleware (exported for use in server.js) ───────────────────────────
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ error: "Authorization token required" });
  try {
    req.user = jwt.verify(header.split(" ")[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ── Validation helpers ────────────────────────────────────────────────────────
function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && !/[\s,]/.test(e);
}
function isStrongPassword(p) {
  return p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);
}

// ── In-memory helpers (fallback when MongoDB is not available) ────────────────
const bcrypt = require("bcryptjs");

async function findUserByEmail(email) {
  if (User) return User.findOne({ email: email.toLowerCase() }).select("+password");
  return inMemoryUsers.find(u => u.email === email.toLowerCase()) || null;
}

async function createLocalUser({ fullName, email, password }) {
  if (User) {
    const u = new User({ fullName, email, password, provider: "local" });
    await u.save();
    return u;
  }
  const hashed = await bcrypt.hash(password, 12);
  const u = {
    _id: "u_" + Date.now(),
    fullName, email: email.toLowerCase(),
    password: hashed, provider: "local",
    avatar: "", role: "user", skills: {}, assessmentDone: false,
    onboarded: false, school: "", branch: "", username: "",
    track: "", trackSelected: false,
    createdAt: new Date().toISOString(),
    toPublic() {
      return { id: this._id, name: this.fullName, username: this.username, email: this.email, avatar: this.avatar, provider: this.provider, role: this.role, skills: this.skills, assessmentDone: this.assessmentDone, onboarded: this.onboarded, school: this.school, branch: this.branch, track: this.track, trackSelected: this.trackSelected };
    },
    comparePassword(plain) { return bcrypt.compare(plain, this.password); },
  };
  inMemoryUsers.push(u);
  return u;
}

async function findOrCreateGoogleUser({ name, email, avatar, uid }) {
  if (User) {
    let u = await User.findOne({ email: email.toLowerCase() });
    if (u) {
      // Update avatar if changed
      if (avatar && u.avatar !== avatar) { u.avatar = avatar; await u.save(); }
      u.isNewUser = false;
      return u;
    }
    u = new User({ fullName: name, email, avatar, provider: "google", googleUid: uid });
    await u.save();
    u.isNewUser = true;
    return u;
  }
  // In-memory fallback
  let u = inMemoryUsers.find(x => x.email === email.toLowerCase());
  if (u) {
    u.isNewUser = false;
    return u;
  }
  u = {
    _id: "g_" + Date.now(),
    fullName: name, email: email.toLowerCase(),
    avatar, provider: "google", googleUid: uid,
    role: "user", skills: {}, assessmentDone: false,
    onboarded: false, school: "", branch: "", username: "",
    track: "", trackSelected: false,
    isNewUser: true,
    createdAt: new Date().toISOString(),
    toPublic() {
      return { id: this._id, name: this.fullName, username: this.username, email: this.email, avatar: this.avatar, provider: this.provider, role: this.role, skills: this.skills, assessmentDone: this.assessmentDone, onboarded: this.onboarded, school: this.school, branch: this.branch, track: this.track, trackSelected: this.trackSelected, isNewUser: this.isNewUser };
    },
  };
  inMemoryUsers.push(u);
  return u;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/signup
// ─────────────────────────────────────────────────────────────────────────────
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });
    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid email address" });
    if (password.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters" });

    const existing = await findUserByEmail(email);
    if (existing)
      return res.status(409).json({ error: "Email already registered. Please sign in." });

    const user  = await createLocalUser({ fullName: name, email, password });
    user.isNewUser = true;
    const token = signToken({ id: user._id.toString(), email: user.email });

    res.status(201).json({ message: "Account created successfully", token, user: user.toPublic() });
  } catch (err) { next(err); }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/signin
// ─────────────────────────────────────────────────────────────────────────────
router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });
    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid email address" });

    const user = await findUserByEmail(email);
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });
    if (user.provider === "google")
      return res.status(400).json({ error: "This account uses Google Sign-In. Please continue with Google." });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken({ id: user._id.toString(), email: user.email });
    user.isNewUser = false;
    res.json({ message: "Signed in successfully", token, user: user.toPublic() });
  } catch (err) { next(err); }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/google
// ─────────────────────────────────────────────────────────────────────────────
router.post("/google", async (req, res, next) => {
  try {
    const { idToken, name, email, avatar, uid } = req.body;

    if (!email)
      return res.status(400).json({ error: "Google auth data missing" });

    // NOTE: In production, verify idToken with Firebase Admin SDK.
    // For now we trust the data since it comes from Firebase client SDK.
    // To add verification: npm install firebase-admin, then:
    //   const admin = require("firebase-admin");
    //   const decoded = await admin.auth().verifyIdToken(idToken);

    const user  = await findOrCreateGoogleUser({ name, email, avatar, uid });
    const token = signToken({ id: user._id.toString(), email: user.email });

    res.json({ message: "Google auth successful", token, user: user.toPublic() });
  } catch (err) { next(err); }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    let user;
    if (User) {
      user = await User.findById(req.user.id);
    } else {
      user = inMemoryUsers.find(u => u._id === req.user.id);
    }
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: user.toPublic() });
  } catch (err) { next(err); }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/auth/profile
// ─────────────────────────────────────────────────────────────────────────────
router.put("/profile", authMiddleware, async (req, res, next) => {
  try {
    const { fullName, bio, avatar, skills, privacy, onboarded, school, branch, username, track, trackSelected } = req.body;
    let user;
    if (User) {
      user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      if (fullName !== undefined) user.fullName = fullName;
      if (bio !== undefined) user.bio = bio;
      if (avatar !== undefined) user.avatar = avatar;
      if (skills !== undefined) user.skills = skills;
      if (privacy !== undefined) user.privacy = privacy;
      if (onboarded !== undefined) user.onboarded = onboarded;
      if (school !== undefined) user.school = school;
      if (branch !== undefined) user.branch = branch;
      if (username !== undefined) user.username = username;
      if (track !== undefined) user.track = track;
      if (trackSelected !== undefined) user.trackSelected = trackSelected;
      await user.save();
    } else {
      user = inMemoryUsers.find(u => u._id === req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      if (fullName !== undefined) user.fullName = fullName;
      if (bio !== undefined) user.bio = bio;
      if (avatar !== undefined) user.avatar = avatar;
      if (skills !== undefined) user.skills = skills;
      if (privacy !== undefined) user.privacy = privacy;
      if (onboarded !== undefined) user.onboarded = onboarded;
      if (school !== undefined) user.school = school;
      if (branch !== undefined) user.branch = branch;
      if (username !== undefined) user.username = username;
      if (track !== undefined) user.track = track;
      if (trackSelected !== undefined) user.trackSelected = trackSelected;
    }
    
    // Broadcast the update to all connected clients
    if (req.app.get("io")) {
      req.app.get("io").emit("userProfileUpdated", { userId: req.user.id });
    }

    res.json({ message: "Profile updated successfully", user: user.toPublic() });
  } catch (err) { next(err); }
});

module.exports = { router, authMiddleware };
