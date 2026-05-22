/**
 * RejexIQ - Backend Server
 * Demonstrates: Client-Server Architecture, Express, Routing, JWT Auth,
 * Middleware, File Handling, HTTP Module, Route Parameters, Error Handling
 */

// ── MODULES & DEPENDENCIES ─────────────────────────────────────────────────
const http = require("http");          // Node.js HTTP module
const express = require("express");    // Express framework
const path = require("path");          // Path module
const fs = require("fs");              // File handling module
const jwt = require("jsonwebtoken");   // JWT authentication
const bcrypt = require("bcryptjs");    // Password hashing
const cors = require("cors");          // CORS middleware

// Load .env if present
try { require("dotenv").config({ path: path.join(__dirname, ".env") }); } catch (_) {}

const app = express();
const PORT = process.env.PORT || 5000;

// Story Mode routes
const storyRoutes = require("./storyRoutes");
// Career Match routes
const careerRoutes = require("./careerRoutes");
// New auth routes (JWT + MongoDB)
const { router: authRouter, authMiddleware: newAuthMiddleware } = require("./authRoutes");

const JWT_SECRET = process.env.JWT_SECRET || "rejexiq_dev_secret_2025";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const MONGO_URI  = process.env.MONGO_URI  || "";

// ── MongoDB connection (optional — falls back to in-memory) ──────────────────
if (MONGO_URI) {
  const mongoose = require("mongoose");
  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.warn("⚠️  MongoDB connection failed — using in-memory store:", err.message));
} else {
  console.log("ℹ️  No MONGO_URI set — using in-memory user store (data resets on restart)");
}

// ── IN-MEMORY DATABASE (legacy — kept for non-auth routes) ──────────────────
const users = [];          // Simulates user collection
const assessments = [];    // Simulates assessments collection

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving static files — demonstrates Node.js static file serving
app.use(express.static(path.join(__dirname, "../dist")));

// Request logging middleware — demonstrates middleware concept
app.use((req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.path}\n`;
  // File streaming — writing logs to file
  fs.appendFile(path.join(__dirname, "access.log"), log, (err) => {
    if (err) console.error("Log write error:", err);
  });
  console.log(log.trim());
  next();
});

// ── JWT AUTH MIDDLEWARE ───────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ── HELPER: Validate email format ─────────────────────────────────────────────
function isValidEmail(email) {
  if (/[,\s]/.test(email)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── CAREER READINESS ENGINE ──────────────────────────────────────────────────
const ROLES = {
  frontend: { label: "Frontend Developer", skills: { JavaScript: 85, React: 80, CSS: 75, ProblemSolving: 70 } },
  backend: { label: "Backend Developer", skills: { JavaScript: 75, Python: 80, SystemDesign: 80, DataStructures: 75 } },
  fullstack: { label: "Full Stack Developer", skills: { JavaScript: 85, React: 75, Python: 70, SystemDesign: 70 } },
  dataAnalyst: { label: "Data Analyst", skills: { Python: 85, DataStructures: 75, ProblemSolving: 80 } },
  devops: { label: "DevOps Engineer", skills: { SystemDesign: 90, ProblemSolving: 80, Python: 70 } }
};

function calcReadiness(userSkills, roleKey) {
  const role = ROLES[roleKey];
  if (!role) return 0;
  let total = 0, count = 0;
  for (const [skill, required] of Object.entries(role.skills)) {
    total += Math.min(100, ((userSkills[skill] || 0) / required) * 100);
    count++;
  }
  return Math.round(total / count);
}

function generateReport(userSkills) {
  const scores = {};
  let best = { key: null, score: 0 };
  for (const key of Object.keys(ROLES)) {
    const score = calcReadiness(userSkills, key);
    scores[key] = score;
    if (score > best.score) best = { key, score };
  }
  const avgScore = Math.round(Object.values(userSkills).reduce((a, b) => a + b, 0) / Object.values(userSkills).length);
  return { scores, bestRole: best, overallReadiness: avgScore };
}

// ── ROUTES ────────────────────────────────────────────────────────────────────

// NEW: Auth routes (signup, signin, google, me)
app.use("/api/auth", authRouter);

// Story Mode routes
app.use("/api", storyRoutes);
// Career Match routes
app.use("/api/career", careerRoutes);

// Root — demonstrates Express routing
app.get("/api", (req, res) => {
  res.json({
    message: "RejexIQ API v1.0",
    endpoints: ["/api/auth/register", "/api/auth/login", "/api/profile", "/api/assessment", "/api/market-demand"],
    status: "running",
    timestamp: new Date().toISOString()
  });
});

// ── AUTH ROUTES ───────────────────────────────────────────────────────────────

// POST /api/auth/register — Signup
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format. No spaces or commas allowed." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check existing user
    const existing = users.find(u => u.email === email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password (demonstrates bcrypt)
    const hashed = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;

    const newUser = { id: userId, name, email, password: hashed, skills: {}, createdAt: new Date().toISOString() };
    users.push(newUser);

    // Generate JWT
    const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: userId, name, email, skills: {} }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, skills: user.skills }
    });
  } catch (err) {
    next(err);
  }
});

// ── PROTECTED ROUTES (require JWT) ───────────────────────────────────────────

// GET /api/profile — demonstrates protected route + JWT middleware
app.get("/api/profile", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, name: user.name, email: user.email, skills: user.skills });
});

// POST /api/assessment — submit skill assessment
app.post("/api/assessment", authMiddleware, (req, res) => {
  const { skills } = req.body;
  if (!skills || typeof skills !== "object") {
    return res.status(400).json({ error: "Skills object is required" });
  }

  // Update user skills
  const user = users.find(u => u.id === req.user.id);
  if (user) user.skills = skills;

  // Generate report
  const report = generateReport(skills);

  // Save assessment record
  assessments.push({ userId: req.user.id, skills, report, date: new Date().toISOString() });

  res.json({
    message: "Assessment saved",
    report,
    bestRole: { key: report.bestRole.key, label: ROLES[report.bestRole.key]?.label, score: report.bestRole.score },
    overallReadiness: report.overallReadiness
  });
});

// GET /api/skill-score — route with route parameters
app.get("/api/skill-score/:userId", authMiddleware, (req, res) => {
  const { userId } = req.params;  // Demonstrates route parameters

  // Authorization check
  if (userId !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  const user = users.find(u => u.id === userId);
  if (!user || Object.keys(user.skills).length === 0) {
    return res.status(404).json({ error: "No assessment found for this user" });
  }

  const report = generateReport(user.skills);
  res.json({ userId, skills: user.skills, report });
});

// GET /api/market-demand — market data endpoint
app.get("/api/market-demand", authMiddleware, (req, res) => {
  const marketData = [
    { skill: "JavaScript", demand: 92, growth: "+5%" },
    { skill: "Python", demand: 88, growth: "+12%" },
    { skill: "React", demand: 85, growth: "+8%" },
    { skill: "Node.js", demand: 81, growth: "+6%" },
    { skill: "SQL", demand: 79, growth: "+3%" },
    { skill: "TypeScript", demand: 76, growth: "+22%" },
    { skill: "AWS", demand: 73, growth: "+18%" },
    { skill: "Docker", demand: 70, growth: "+25%" }
  ];
  res.json({ data: marketData, lastUpdated: new Date().toISOString() });
});

// POST /api/resume-data — save resume data
app.post("/api/resume-data", authMiddleware, (req, res) => {
  const { resumeData } = req.body;
  if (!resumeData) return res.status(400).json({ error: "Resume data required" });

  // File handling — save resume to file system
  const filename = `resume_${req.user.id}_${Date.now()}.json`;
  const filePath = path.join(__dirname, "resumes", filename);

  // Create resumes directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, "resumes"))) {
    fs.mkdirSync(path.join(__dirname, "resumes"), { recursive: true });
  }

  // File streaming — write resume data
  const writeStream = fs.createWriteStream(filePath);
  writeStream.write(JSON.stringify(resumeData, null, 2));
  writeStream.end();

  writeStream.on("finish", () => {
    res.json({ message: "Resume saved", filename, path: filePath });
  });
  writeStream.on("error", (err) => {
    res.status(500).json({ error: "Failed to save resume" });
  });
});

// GET /api/download-log — demonstrates file streaming (read stream)
app.get("/api/download-log", authMiddleware, (req, res) => {
  const logPath = path.join(__dirname, "access.log");
  if (!fs.existsSync(logPath)) {
    return res.status(404).json({ error: "Log file not found" });
  }
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", "attachment; filename=access.log");

  // File streaming — pipe file to response
  const readStream = fs.createReadStream(logPath);
  readStream.pipe(res);
  readStream.on("error", (err) => res.status(500).json({ error: "Stream error" }));
});

// ── RESUME PARSING ENDPOINT (NEW) ──────────────────────────────────────────────
app.post("/api/parse-resume", async (req, res, next) => {
  try {
    const { fileContent, fileName, mimeType } = req.body;
    
    if (!fileContent || !fileName) {
      return res.status(400).json({ error: "File content and name required" });
    }
    
    // Simulate resume parsing - extract structured data
    const lines = fileContent.split('\n').map(l => l.trim()).filter(Boolean);
    
    const resumeData = {
      name: lines[0] || "",
      title: lines.find(l => l.match(/engineer|developer|analyst|manager/i)) || "",
      email: lines.find(l => l.includes('@')) || "",
      phone: lines.find(l => /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(l)) || "",
      location: "",
      summary: "",
      skills: [],
      experience: [],
      projects: [],
      education: [],
      certifications: []
    };
    
    // Extract sections based on keywords
    let currentSection = '';
    for (const line of lines) {
      const lower = line.toLowerCase();
      
      if (lower.includes('experience') || lower.includes('professional')) currentSection = 'experience';
      else if (lower.includes('project')) currentSection = 'projects';
      else if (lower.includes('skill')) currentSection = 'skills';
      else if (lower.includes('education')) currentSection = 'education';
      else if (lower.includes('certification')) currentSection = 'certifications';
      else if (lower.includes('summary') || lower.includes('about')) currentSection = 'summary';
      else if (line && currentSection) {
        if (currentSection === 'skills' && line.length < 50) {
          resumeData.skills.push(line);
        } else if (currentSection === 'summary') {
          resumeData.summary += (resumeData.summary ? ' ' : '') + line;
        } else if (currentSection === 'experience' && line.length > 10) {
          resumeData.experience.push({
            id: 'e' + Date.now(),
            role: line,
            company: "",
            duration: "",
            description: ""
          });
        }
      }
    }
    
    res.json({
      success: true,
      data: resumeData,
      message: "Resume parsed successfully"
    });
  } catch (err) {
    next(err);
  }
});

// ── CODE ARENA — AI HINT ──────────────────────────────────────────────────────
app.post("/api/ai/hint", async (req, res) => {
  try {
    const { problemTitle, problemDescription, userCode, language } = req.body;
    if (!problemTitle) return res.status(400).json({ error: "Problem title required" });

    const GROQ_KEY = process.env.GROQ_API_KEY || "";
    if (!GROQ_KEY) return res.status(503).json({ error: "AI not configured" });

    const prompt = `You are a coding mentor helping a student solve: "${problemTitle}"

Problem: ${problemDescription || ""}

Student's current code (${language || "JavaScript"}):
\`\`\`
${userCode || "(empty)"}
\`\`\`

Give a helpful hint WITHOUT giving away the full solution. Point them in the right direction. Keep it under 3 sentences. Be encouraging.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.5
      })
    });
    const data = await groqRes.json();
    if (!groqRes.ok) return res.status(502).json({ error: data.error?.message || "AI error" });
    res.json({ hint: data.choices?.[0]?.message?.content || "Think about the time complexity. Can you use a hash map?" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CODE ARENA — AI SOLUTION EXPLANATION ─────────────────────────────────────
app.post("/api/ai/explain", async (req, res) => {
  try {
    const { problemTitle, solution, language } = req.body;
    const GROQ_KEY = process.env.GROQ_API_KEY || "";
    if (!GROQ_KEY) return res.status(503).json({ error: "AI not configured" });

    const prompt = `Explain this ${language || "JavaScript"} solution for "${problemTitle}" in simple terms. Cover: 1) The approach/algorithm, 2) Time complexity, 3) Space complexity. Keep it concise (under 5 sentences).

\`\`\`
${solution}
\`\`\``;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.3
      })
    });
    const data = await groqRes.json();
    if (!groqRes.ok) return res.status(502).json({ error: data.error?.message || "AI error" });
    res.json({ explanation: data.choices?.[0]?.message?.content || "No explanation available." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, userName, skills } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const skillsText = skills
      ? Object.entries(skills).map(([k,v]) => `${k}: ${v}%`).join(", ")
      : "Not assessed";

    const prompt = `You are an expert AI Career Assistant for RejexIQ platform helping ${userName || "a user"} with career guidance.\n\nUser Skills: ${skillsText}\n\nQuestion: ${message}\n\nGive helpful, actionable career advice. Use bullet points for lists. Be concise but thorough.`;

    const GROQ_KEY   = process.env.GROQ_API_KEY  || "";
    const GEMINI_KEY = process.env.GEMINI_API_KEY || "";

    // ── Try Groq first (free, fast) ──────────────────────────────────────────
    if (GROQ_KEY) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            temperature: 0.7
          })
        });
        const groqData = await groqRes.json();
        if (groqRes.ok && groqData.choices?.[0]?.message?.content) {
          return res.json({ text: groqData.choices[0].message.content });
        }
        console.warn("Groq error:", groqData.error?.message || JSON.stringify(groqData));
      } catch (groqErr) {
        console.warn("Groq fetch failed:", groqErr.message);
      }
    }

    // ── Fallback to Gemini ────────────────────────────────────────────────────
    if (GEMINI_KEY) {
      try {
        const gemRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
            })
          }
        );
        const gemData = await gemRes.json();
        if (gemRes.ok && gemData.candidates?.[0]?.content?.parts?.[0]?.text) {
          return res.json({ text: gemData.candidates[0].content.parts[0].text });
        }
        console.warn("Gemini error:", gemData.error?.message || JSON.stringify(gemData));
      } catch (gemErr) {
        console.warn("Gemini fetch failed:", gemErr.message);
      }
    }

    return res.status(503).json({ error: "AI service unavailable. Please try again in a moment." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// ── ERROR HANDLING MIDDLEWARE ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    path: req.path,
    method: req.method
  });
});

// ── SERVER CREATION (HTTP module) ────────────────────────────────────────────
const server = http.createServer(app);  // Using Node.js HTTP module

// ── SOCKET.IO ─────────────────────────────────────────────────────────────────
const { initSocket } = require("./socket/index");
const io = initSocket(server, CLIENT_URL);
app.set("io", io); // make io accessible in routes if needed

server.listen(PORT, () => {
  console.log(`\n🚀 RejexIQ Server running at http://localhost:${PORT}`);
  console.log(`⚡ Socket.IO realtime server active`);
  console.log(`📋 API available at http://localhost:${PORT}/api\n`);
});

module.exports = app;
