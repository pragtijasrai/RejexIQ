<div align="center">
  <img src="src/signin.svg" alt="RejexIQ Logo" width="120" />
  <h1>RejexIQ</h1>
  <p><strong>Decode the Hiring Algorithm. Clarify your Career.</strong></p>
  <p>A next-generation career intelligence platform featuring real-time data, 3D WebGL interfaces, and predictive hiring analytics.</p>
</div>

---

## 🌟 Overview

People don't search for jobs the way they used to. They ask questions, run trade-offs, and read between the lines. **RejexIQ** decodes how AI engines, recruiters, and Applicant Tracking Systems (ATS) see your profile—providing complete clarity for a new kind of career discovery.

## ✨ Key Features

- **🌐 Cinematic 3D Experience:** A stunning, scroll-driven 3D WebGL landing page built with React Three Fiber, Three.js, and Framer Motion that dynamically reacts to user navigation.
- **⚡ Real-Time Global Chat:** Built with Socket.io, allowing instant, real-time communication and online-status tracking with anyone across the globe.
- **🔐 Secure Authentication:** Seamless integration with Firebase Google OAuth alongside secure Email/Password authentication using JWT.
- **📊 Real-Time Career Dashboard:** A live command center tracking your Visibility Index, Job Readiness, and Skill Coverage with rich data visualizations.
- **📄 Interactive Resume Builder:** A professional, drag-and-drop resume builder featuring Canva-style layouts, live previews, and high-quality PDF exports.
- **🧠 DSA & Learning Hub:** Interactive tutorials to master Data Structures and Algorithms right inside your browser.

## 🛠️ Technology Stack

**Frontend Architecture:**
- **Core Framework:** React 18 + Vite
- **3D & Animations:** Three.js, React Three Fiber, React Three Drei, Framer Motion
- **Styling:** Tailwind CSS (Responsive, Mobile-First), Lenis (Smooth Scrolling)
- **State & Data:** Context API, Recharts

**Backend Architecture:**
- **Server:** Node.js + Express
- **Real-Time Engine:** Socket.io
- **Auth & Security:** Firebase (Google Auth), JWT, Bcrypt

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have Node.js (v16+) and npm installed on your machine.

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd RejexIQ

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration
Create `.env` files in both your root directory and `backend/` directory based on the provided `.env.example` files. Make sure to include your Firebase config and backend connection strings:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start the Engines
You will need two terminal windows to run both the client and the server.

**Terminal 1 (Frontend):**
```bash
npm run dev
```
**Terminal 2 (Backend):**
```bash
cd backend
npm start
```
Navigate to `http://localhost:5173` to experience the platform!

## 🚢 Deployment

To unlock the global real-time chat and share RejexIQ with the world:
1. **Frontend:** Deploy the root directory to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). Set your build command to `npm run build` and output directory to `dist`.
2. **Backend:** Deploy the `backend/` directory to [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku](https://heroku.com/). 
3. **Connect:** Update your frontend's `VITE_API_URL` environment variable to point to your live backend URL!

## 🤝 Contributing

We welcome contributions to make RejexIQ even better! 
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
<div align="center">
  <p>Built to bridge the gap between human ambition and machine algorithms.</p>
</div>
