# RejexIQ - Career Intelligence Platform

A skill evaluation and career readiness platform for students and professionals.

## 🚀 Features

- **Skill Assessment** - Rate yourself across 8 technical & soft skills
- **Career Readiness Score** - AI-powered analysis comparing your profile to real job requirements
- **Market Demand Analysis** - See which skills are trending in the industry
- **Interactive Resume Builder** - Drag-and-drop builder with live preview and PDF export
- **DSA Learning Hub** - Interactive tutorials for data structures and algorithms

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Recharts for data visualization
- Tailwind CSS
- Framer Motion for animations
- Lenis for smooth scrolling

**Backend:**
- Node.js + Express
- JWT authentication
- bcrypt for password hashing
- In-memory database (demo mode)

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd RejexIQ
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Start the development servers**

   **Terminal 1 - Frontend:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

   **Terminal 2 - Backend:**
   ```bash
   cd backend
   npm start
   ```
   Backend runs on `http://localhost:5000`

4. **Open the app**
   Navigate to `http://localhost:5173` in your browser

## 🎯 Usage

### For Team Members

1. Start both frontend and backend servers (see Installation above)
2. Create an account using email/password signup
3. Complete the skill assessment
4. Explore your career readiness dashboard
5. Build your resume using the interactive builder

### Demo Mode

Click "Try Demo Mode" on the landing page to explore all features without creating an account.

## 🔐 Authentication

This project uses **email/password authentication** for simplicity and team collaboration.

**Why no OAuth (Google/Microsoft)?**
- OAuth credentials are secrets that cannot be committed to Git
- Each team member would need to set up their own OAuth apps
- Email/password auth works perfectly for demos and team projects

If you need OAuth for production, see `OAUTH_SETUP.md` for detailed instructions.

## 📁 Project Structure

```
RejexIQ/
├── src/                    # Frontend React components
│   ├── App.jsx            # Main app component
│   ├── AuthPage.jsx       # Login/Signup page
│   ├── ProfilePage.jsx    # User profile & dashboard
│   ├── ResumeBuilder.jsx  # Resume builder component
│   └── DSA*.jsx           # DSA tutorial components
├── backend/
│   ├── server.js          # Express backend server
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
└── package.json           # Frontend dependencies
```

## 🧪 Testing

The app includes:
- Email validation (no spaces/commas allowed)
- Password strength indicator
- Form validation with real-time feedback
- JWT token-based authentication

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`

### Backend (Railway/Render/Heroku)
1. Deploy the `backend/` folder
2. Set environment variables:
   - `JWT_SECRET` (generate a random string)
   - `PORT` (usually auto-set by platform)
3. Start command: `npm start`

## 🤝 Contributing

This is a team project. To contribute:

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

3. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## 📝 License

This project is for educational purposes.

## 🐛 Known Issues

- Backend uses in-memory storage (data resets on server restart)
- For production, replace with MongoDB or PostgreSQL
- Resume PDF export works best in Chrome/Edge

## 💡 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social sharing of career scores
- [ ] More DSA tutorials
- [ ] Interview preparation module

## 📧 Support

For questions or issues, open a GitHub issue or contact the team.

---

**Built with ❤️ by the RejexIQ Team**
