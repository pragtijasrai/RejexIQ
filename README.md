# RejexIQ — Skill Evaluation & Career Readiness Platform

> 🎯 **Evaluate your skills. Discover your readiness. Build your career.**

[![Status](https://img.shields.io/badge/status-production--ready-success)]()
[![Stack](https://img.shields.io/badge/stack-React%20%2B%20Node.js%20%2B%20JWT-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## What is RejexIQ?

RejexIQ is a **full-stack Skill Evaluation & Career Readiness Platform** that helps students:

- Evaluate technical and soft skills across 8 dimensions
- Get a **Career Readiness Score** for 5 major tech roles
- Compare their profile with real market demand
- Receive a **personalized learning roadmap**
- Build a professional resume with live preview
- Interact with an AI career assistant

---

## Live Demo

The platform includes a **Demo Mode** — click "Try Demo" on the homepage to explore all features with pre-loaded data without creating an account.

---

## Feature Overview

| Feature | Description |
|---|---|
| 🎯 Skill Assessment | Rate yourself on 8 skills with interactive sliders |
| 🏆 Career Match | See readiness % for Frontend, Backend, Full Stack, Data Analyst, DevOps |
| 📊 Skill Gap Analysis | Bar chart comparison of your scores vs required |
| 📍 Learning Roadmap | Personalized step-by-step improvement plan |
| 📈 Market Demand | Industry charts for trending tech skills |
| 📄 Resume Builder | Live preview, 3 templates, PDF download |
| 🤖 AI Assistant | Chat-based career guidance with real suggestions |
| 🥇 Leaderboard | See how you rank among other students |
| 🗺️ Guided Tour | Step-by-step onboarding for new users |

---

## Tech Stack

### Frontend
- **React 18** (JavaScript, Vite)
- **TailwindCSS** — utility-first styling
- **Recharts** — RadarChart, BarChart, AreaChart
- **React Router** — client-side navigation
- **Custom Animations** — CSS keyframes + transitions

### Backend
- **Node.js** + **Express.js**
- **JWT** (jsonwebtoken) — authentication
- **bcryptjs** — password hashing
- **HTTP module** — server creation
- **fs module** — file handling and streaming
- **CORS** — cross-origin support

---

## NodeJS Concepts Demonstrated

| Concept | Where |
|---|---|
| Client-Server Architecture | Express server + React frontend |
| HTTP Module | `http.createServer(app)` in server.js |
| Express Framework | All routes |
| Routing | `/api/auth/*`, `/api/profile`, etc. |
| Route Parameters | `GET /api/skill-score/:userId` |
| Middleware | `authMiddleware`, logging, error handler |
| JWT Authentication | Login, register, protected routes |
| File Handling Module | Resume saving, access log writing |
| File Streaming | `fs.createReadStream()` for log download, `fs.createWriteStream()` for resume |
| Exception Handling | `app.use((err, req, res, next) => ...)` |
| Serving Static Files | `express.static(path.join(...))` |
| NPM Modules | express, jsonwebtoken, bcryptjs, cors |

---

## Project Structure

```
rejexiq/
├── backend/
│   ├── server.js          # Main Express server (all NodeJS concepts)
│   ├── access.log         # Auto-generated request log (file handling demo)
│   └── resumes/           # Saved resume JSON files (file streaming demo)
├── src/
│   ├── App.jsx            # Main React application
│   ├── main.jsx           # React entry point
│   └── index.css          # Base styles
├── public/
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## API Endpoints

### Authentication
```
POST /api/auth/register    — Create account
POST /api/auth/login       — Login, get JWT token
```

### Protected Routes (require Authorization: Bearer <token>)
```
GET  /api/profile                  — Get user profile
POST /api/assessment               — Submit skill scores, get readiness report
GET  /api/skill-score/:userId      — Get score by user ID (route parameters)
GET  /api/market-demand            — Get market demand data
POST /api/resume-data              — Save resume (file writing)
GET  /api/download-log             — Stream access log as file download
```

---

## Setup Instructions

### Prerequisites
- Node.js v16+
- npm

### Quick Start

**Option 1: Automated (Windows)**
```bash
# Run the installation script
install.bat

# Then start both servers
start-dev.bat
```

**Option 2: Manual Setup**

```bash
# 1. Clone the repository
git clone https://github.com/pragtijasrai/RejexIQ.git
cd RejexIQ

# 2. Install all dependencies
npm install

# 3. Install backend dependencies
cd backend
npm install
cd ..

# 4. Create .env file (optional)
echo PORT=5000 > .env
echo JWT_SECRET=rejexiq_secret_2025 >> .env
echo NODE_ENV=development >> .env

# 5. Start backend (Terminal 1)
npm run server

# 6. Start frontend (Terminal 2)
npm run dev

# 7. Open browser
# http://localhost:5173
```

### Demo Mode
No setup needed — just click "✨ Try Demo" on the homepage.

---

## User Flow

```
Landing Page
    ↓
Sign Up / Login (JWT issued)
    ↓
Dashboard (skill overview + guided tour for new users)
    ↓
Skill Assessment (rate 8 skills 0–100)
    ↓
Career Readiness Score + Best Role Match
    ↓
Career Match Page (skill gap analysis + learning roadmap)
    ↓
Market Demand (industry trend charts)
    ↓
Resume Builder (live preview + PDF download)
    ↓
AI Assistant (personalized career Q&A)
```

---

## Presentation Notes

**When asked how the system works:**

> "RejexIQ analyzes user skill inputs across 8 dimensions and compares them with real-world job role requirements using a weighted readiness algorithm. The system calculates a Career Readiness Score, identifies skill gaps, and generates a personalized learning roadmap. The backend uses Node.js and Express with JWT authentication, demonstrating client-server architecture, file handling, middleware, and RESTful API design."

**Key talking points:**
- The skill assessment engine calculates readiness per role using weighted comparisons
- JWT tokens are verified on every protected API call
- File streaming is demonstrated through resume saving and log download
- The radar chart visualizes multi-dimensional skill profiles
- Market data simulates real-time industry insights

---

## License

MIT — Built as a 2nd Year Computer Science Academic Project
