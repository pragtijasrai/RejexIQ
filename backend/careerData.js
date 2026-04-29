/**
 * Career Match System — static data & rule-based logic
 */

// ── ROLE DEFINITIONS ──────────────────────────────────────────────────────────
const ROLES = {
  frontend: {
    label: "Frontend Developer", icon: "🎨", color: "#00e5ff",
    requiredSkills: { JavaScript: 80, React: 75, CSS: 70, Communication: 60, DSA: 40, SystemDesign: 35 },
    avgSalary: "$85k–$130k", openings: 42000, growthRate: "+8%"
  },
  backend: {
    label: "Backend Developer", icon: "⚙️", color: "#c084fc",
    requiredSkills: { JavaScript: 75, DSA: 70, SystemDesign: 75, Communication: 55, React: 25, CSS: 20 },
    avgSalary: "$90k–$145k", openings: 38000, growthRate: "+11%"
  },
  fullstack: {
    label: "Full Stack Developer", icon: "🔥", color: "#f59e0b",
    requiredSkills: { JavaScript: 80, React: 70, DSA: 60, SystemDesign: 65, CSS: 60, Communication: 60 },
    avgSalary: "$95k–$155k", openings: 55000, growthRate: "+14%"
  },
  dataAnalyst: {
    label: "Data Analyst", icon: "📊", color: "#34d399",
    requiredSkills: { DSA: 75, Communication: 75, JavaScript: 45, SystemDesign: 55, React: 20, CSS: 15 },
    avgSalary: "$70k–$110k", openings: 29000, growthRate: "+18%"
  },
  devops: {
    label: "DevOps Engineer", icon: "🚀", color: "#f87171",
    requiredSkills: { SystemDesign: 85, DSA: 60, JavaScript: 50, Communication: 60, React: 20, CSS: 15 },
    avgSalary: "$100k–$160k", openings: 22000, growthRate: "+22%"
  }
};

// ── JOB SIMULATIONS ───────────────────────────────────────────────────────────
const SIMULATIONS = {
  frontend: {
    title: "Frontend Developer @ TechStartup",
    context: "You just joined a fast-moving startup. It's your first week. The CTO drops 3 tasks on your desk.",
    tasks: [
      {
        id: "fe_t1",
        title: "Fix a broken layout on mobile",
        description: "The product page breaks on screens < 768px. Users are complaining. Fix it fast.",
        choices: [
          { id: "a", text: "Use CSS Flexbox/Grid with media queries", skillImpact: { CSS: +8, JavaScript: +2 }, xp: 20, correct: true, feedback: "Perfect. Responsive design with Flexbox is the industry standard. Senior devs will respect this." },
          { id: "b", text: "Add inline styles with fixed pixel widths", skillImpact: { CSS: -5 }, xp: -5, correct: false, feedback: "Inline styles with fixed widths break on different devices. This creates tech debt." },
          { id: "c", text: "Tell the PM it's a design problem, not yours", skillImpact: { Communication: -8 }, xp: -10, correct: false, feedback: "Avoiding ownership destroys team trust. This is a red flag in any company." }
        ]
      },
      {
        id: "fe_t2",
        title: "The dashboard loads in 6 seconds",
        description: "Users are dropping off. The dashboard fetches 3 APIs sequentially. Improve it.",
        choices: [
          { id: "a", text: "Use Promise.all() to fetch APIs in parallel", skillImpact: { JavaScript: +10, React: +5 }, xp: 25, correct: true, feedback: "Excellent. Parallel fetching cuts load time by ~60%. This shows async mastery." },
          { id: "b", text: "Add a loading spinner and call it done", skillImpact: { React: -3 }, xp: -5, correct: false, feedback: "Hiding the problem isn't solving it. Performance issues compound over time." },
          { id: "c", text: "Cache results in localStorage", skillImpact: { JavaScript: +4 }, xp: 10, correct: false, feedback: "Caching helps but doesn't fix the root cause. Partial credit — shows initiative." }
        ]
      },
      {
        id: "fe_t3",
        title: "Client wants a feature by tomorrow",
        description: "A key client wants a data export button. You have 4 hours. What do you do?",
        choices: [
          { id: "a", text: "Build MVP: export to CSV using existing data", skillImpact: { JavaScript: +6, Communication: +5 }, xp: 20, correct: true, feedback: "Shipping a working MVP fast is a superpower. You managed scope and delivered value." },
          { id: "b", text: "Build a full export system with PDF, Excel, CSV", skillImpact: { JavaScript: +3, SystemDesign: -4 }, xp: 5, correct: false, feedback: "Over-engineering under time pressure is a common junior mistake. Scope management matters." },
          { id: "c", text: "Say it's not possible in 4 hours", skillImpact: { Communication: -10 }, xp: -15, correct: false, feedback: "Never say impossible without exploring options. This damages client relationships." }
        ]
      }
    ]
  },
  backend: {
    title: "Backend Developer @ FinTech Company",
    context: "You're a backend dev at a payments company. Security and performance are critical. Three incidents hit your queue.",
    tasks: [
      {
        id: "be_t1",
        title: "API endpoint returning user passwords in response",
        description: "A junior dev accidentally exposed password hashes in the /users endpoint. Fix it.",
        choices: [
          { id: "a", text: "Remove password field from response, add field whitelist", skillImpact: { JavaScript: +8, SystemDesign: +6 }, xp: 25, correct: true, feedback: "Correct. Never expose sensitive fields. Whitelisting is safer than blacklisting." },
          { id: "b", text: "Encrypt the password before sending", skillImpact: { JavaScript: +2, SystemDesign: -5 }, xp: -5, correct: false, feedback: "Sending encrypted passwords is still a security violation. Never send credentials in responses." },
          { id: "c", text: "Add auth middleware to the route", skillImpact: { JavaScript: +3 }, xp: 8, correct: false, feedback: "Auth helps but doesn't fix the data exposure. The field should never be in the response." }
        ]
      },
      {
        id: "be_t2",
        title: "Database query taking 8 seconds",
        description: "The /transactions endpoint is slow. It queries 2M rows without filtering.",
        choices: [
          { id: "a", text: "Add database index on userId + createdAt, add pagination", skillImpact: { DSA: +10, SystemDesign: +8 }, xp: 25, correct: true, feedback: "Indexing + pagination is the correct solution. This is fundamental backend optimization." },
          { id: "b", text: "Increase server RAM", skillImpact: { SystemDesign: -6 }, xp: -10, correct: false, feedback: "Throwing hardware at a query problem is expensive and doesn't scale. Fix the query." },
          { id: "c", text: "Cache the entire result in Redis", skillImpact: { SystemDesign: +4 }, xp: 10, correct: false, feedback: "Caching 2M rows is impractical. Indexing is the right first step." }
        ]
      },
      {
        id: "be_t3",
        title: "Design a rate limiter for the payment API",
        description: "The API is being hammered by bots. Design a rate limiting strategy.",
        choices: [
          { id: "a", text: "Implement sliding window rate limiter per IP + user token", skillImpact: { SystemDesign: +12, DSA: +5 }, xp: 30, correct: true, feedback: "Sliding window per IP + token is production-grade. This shows system design maturity." },
          { id: "b", text: "Block all requests over 100/min globally", skillImpact: { SystemDesign: -4 }, xp: -5, correct: false, feedback: "Global limits hurt legitimate users. Per-user/IP limits are the right approach." },
          { id: "c", text: "Add CAPTCHA to every request", skillImpact: { Communication: -5 }, xp: -8, correct: false, feedback: "CAPTCHA on every API call destroys UX. Rate limiting is the correct tool here." }
        ]
      }
    ]
  },
  fullstack: {
    title: "Full Stack Developer @ SaaS Company",
    context: "You're the only full-stack dev at a growing SaaS startup. You own the entire product.",
    tasks: [
      {
        id: "fs_t1",
        title: "Users can't log in after your last deploy",
        description: "JWT tokens are being rejected. 200 users are locked out. Production is down.",
        choices: [
          { id: "a", text: "Roll back deploy immediately, investigate in staging", skillImpact: { SystemDesign: +10, JavaScript: +5 }, xp: 25, correct: true, feedback: "Rolling back first is the right call. Restore service, then debug. This is incident response 101." },
          { id: "b", text: "Debug in production while users wait", skillImpact: { SystemDesign: -8, Communication: -5 }, xp: -15, correct: false, feedback: "Never debug in production during an outage. Every minute costs user trust." },
          { id: "c", text: "Email users to clear their cookies", skillImpact: { Communication: -10 }, xp: -10, correct: false, feedback: "Blaming users for your bug is a career-ending move. Own the problem." }
        ]
      },
      {
        id: "fs_t2",
        title: "Build a real-time notification system",
        description: "The PM wants users to see live updates without refreshing. You have 2 days.",
        choices: [
          { id: "a", text: "Implement WebSockets with Socket.io", skillImpact: { JavaScript: +10, SystemDesign: +8 }, xp: 25, correct: true, feedback: "WebSockets are the right tool for real-time bidirectional communication. Solid choice." },
          { id: "b", text: "Use polling every 2 seconds", skillImpact: { JavaScript: +2, SystemDesign: -5 }, xp: 5, correct: false, feedback: "Polling works but wastes bandwidth and server resources. WebSockets are more efficient." },
          { id: "c", text: "Tell PM it requires a backend rewrite", skillImpact: { Communication: -8, SystemDesign: -3 }, xp: -10, correct: false, feedback: "Overstating complexity is a trust killer. Socket.io can be added incrementally." }
        ]
      },
      {
        id: "fs_t3",
        title: "The React app re-renders 40 times on a single click",
        description: "Performance profiler shows excessive re-renders. Users report lag.",
        choices: [
          { id: "a", text: "Use React.memo, useMemo, useCallback to memoize", skillImpact: { React: +12, JavaScript: +5 }, xp: 25, correct: true, feedback: "Memoization is the correct React optimization. Shows deep understanding of the rendering model." },
          { id: "b", text: "Move everything to a single useState object", skillImpact: { React: -5 }, xp: -5, correct: false, feedback: "Consolidating state often causes more re-renders, not fewer. This is a common misconception." },
          { id: "c", text: "Rewrite in vanilla JS for performance", skillImpact: { React: -8, JavaScript: +2 }, xp: -10, correct: false, feedback: "Abandoning React for performance issues shows a lack of React knowledge. Optimize first." }
        ]
      }
    ]
  },
  dataAnalyst: {
    title: "Data Analyst @ E-Commerce Company",
    context: "You're a data analyst at a mid-size e-commerce company. Data quality and communication are everything.",
    tasks: [
      {
        id: "da_t1",
        title: "Sales report shows 30% revenue drop — is it real?",
        description: "The CEO is panicking. The dashboard shows a massive drop. Investigate.",
        choices: [
          { id: "a", text: "Check data pipeline for errors before reporting", skillImpact: { DSA: +8, Communication: +6 }, xp: 25, correct: true, feedback: "Always validate data before escalating. A pipeline bug caused the false alarm. You saved the CEO from a bad decision." },
          { id: "b", text: "Immediately send alert to all stakeholders", skillImpact: { Communication: -10 }, xp: -15, correct: false, feedback: "Sending unverified alerts causes panic and destroys your credibility as an analyst." },
          { id: "c", text: "Ignore it, wait to see if it self-corrects", skillImpact: { Communication: -8, DSA: -3 }, xp: -10, correct: false, feedback: "Ignoring anomalies is negligent. Always investigate data issues promptly." }
        ]
      },
      {
        id: "da_t2",
        title: "Build a churn prediction model without ML",
        description: "The PM wants to identify users likely to cancel. No ML tools available.",
        choices: [
          { id: "a", text: "Build rule-based scoring: login frequency + purchase recency", skillImpact: { DSA: +10, SystemDesign: +6 }, xp: 25, correct: true, feedback: "Rule-based scoring is practical and explainable. This is exactly what analysts do without ML." },
          { id: "b", text: "Say it's impossible without ML", skillImpact: { Communication: -8 }, xp: -10, correct: false, feedback: "Rule-based systems can be highly effective. Saying 'impossible' shows limited thinking." },
          { id: "c", text: "Export all data to Excel and sort manually", skillImpact: { DSA: -5 }, xp: -5, correct: false, feedback: "Manual sorting doesn't scale. Programmatic scoring is the right approach." }
        ]
      },
      {
        id: "da_t3",
        title: "Present findings to non-technical executives",
        description: "You have 10 minutes to present complex data insights to the board.",
        choices: [
          { id: "a", text: "Use 3 clear charts with plain-language takeaways", skillImpact: { Communication: +12, DSA: +3 }, xp: 25, correct: true, feedback: "Clarity over complexity. Executives need decisions, not data dumps. This is elite communication." },
          { id: "b", text: "Show all 15 charts with full technical detail", skillImpact: { Communication: -8 }, xp: -10, correct: false, feedback: "Information overload loses the audience. Tailor your presentation to the audience." },
          { id: "c", text: "Send a 20-page PDF report instead", skillImpact: { Communication: -5 }, xp: -5, correct: false, feedback: "Executives don't read 20-page reports. Verbal + visual communication is key." }
        ]
      }
    ]
  }
};

// ── REJECTION LOGIC ───────────────────────────────────────────────────────────
function calculateRejection(skills, projects, roleKey) {
  const role = ROLES[roleKey];
  if (!role) return { probability: 50, factors: [] };

  let penalty = 0;
  const factors = [];

  // Core skill gaps
  for (const [skill, required] of Object.entries(role.requiredSkills)) {
    const userVal = skills[skill] || 0;
    if (userVal < required) {
      const gap = required - userVal;
      const p = Math.round(gap * 0.4);
      penalty += p;
      if (p > 5) factors.push({ label: `${skill} below requirement`, impact: p, type: "skill" });
    }
  }

  // Projects penalty
  if (!projects || projects < 2) {
    const p = projects === 0 ? 20 : 10;
    penalty += p;
    factors.push({ label: projects === 0 ? "No portfolio projects" : "Only 1 project", impact: p, type: "project" });
  }

  // Communication penalty
  const comm = skills.Communication || 0;
  if (comm < 60) {
    const p = Math.round((60 - comm) * 0.3);
    penalty += p;
    factors.push({ label: "Low communication score", impact: p, type: "soft" });
  }

  const probability = Math.min(95, Math.max(5, penalty));

  // Improvement scenario
  const improvements = [];
  const topGaps = Object.entries(role.requiredSkills)
    .map(([s, r]) => ({ skill: s, gap: Math.max(0, r - (skills[s] || 0)) }))
    .filter(x => x.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 2);

  let improvedPenalty = penalty;
  topGaps.forEach(g => {
    const reduction = Math.round(g.gap * 0.4 * 0.6);
    improvedPenalty -= reduction;
    improvements.push(`${g.skill} +${Math.round(g.gap * 0.5)}`);
  });
  if (!projects || projects < 2) { improvedPenalty -= 12; improvements.push("Add 2 projects"); }

  const improvedProbability = Math.min(95, Math.max(5, improvedPenalty));

  return { probability, improvedProbability, factors, improvements };
}

// ── TIME TO JOB LOGIC ─────────────────────────────────────────────────────────
function calculateTimeToJob(skills, projects, roleKey, hoursPerDay) {
  const role = ROLES[roleKey];
  if (!role) return { months: 6, breakdown: [] };

  let totalGapPoints = 0;
  const breakdown = [];

  for (const [skill, required] of Object.entries(role.requiredSkills)) {
    const gap = Math.max(0, required - (skills[skill] || 0));
    if (gap > 0) {
      // Each skill point requires ~2 hours of focused study
      const hoursNeeded = gap * 2;
      totalGapPoints += hoursNeeded;
      breakdown.push({ skill, gap, hoursNeeded });
    }
  }

  // Projects: each project ~40 hours
  const projectsNeeded = Math.max(0, 2 - (projects || 0));
  const projectHours = projectsNeeded * 40;
  if (projectsNeeded > 0) {
    breakdown.push({ skill: "Portfolio Projects", gap: projectsNeeded, hoursNeeded: projectHours });
    totalGapPoints += projectHours;
  }

  const totalHours = totalGapPoints;
  const daysNeeded = totalHours / hoursPerDay;
  const months = daysNeeded / 30;

  // Simulate different study paces
  const scenarios = [1, 2, 3, 4].map(h => ({
    hoursPerDay: h,
    months: parseFloat((totalHours / (h * 30)).toFixed(1))
  }));

  return {
    months: parseFloat(months.toFixed(1)),
    totalHours: Math.round(totalHours),
    breakdown: breakdown.sort((a, b) => b.hoursNeeded - a.hoursNeeded).slice(0, 5),
    scenarios
  };
}

// ── ROI LOGIC ─────────────────────────────────────────────────────────────────
function calculateROI(skills, roleKey) {
  const role = ROLES[roleKey];
  if (!role) return [];

  const currentReadiness = calcReadiness(skills, role.requiredSkills);
  const BOOST = 20;

  const results = Object.keys(role.requiredSkills).map(skill => {
    const boosted = { ...skills, [skill]: Math.min(100, (skills[skill] || 0) + BOOST) };
    const newReadiness = calcReadiness(boosted, role.requiredSkills);
    return {
      skill,
      currentScore: skills[skill] || 0,
      readinessDelta: parseFloat((newReadiness - currentReadiness).toFixed(1)),
      hoursRequired: BOOST * 2,
      roi: parseFloat(((newReadiness - currentReadiness) / (BOOST * 2) * 100).toFixed(2))
    };
  });

  return results.sort((a, b) => b.readinessDelta - a.readinessDelta);
}

function calcReadiness(skills, requiredSkills) {
  let total = 0, count = 0;
  for (const [skill, required] of Object.entries(requiredSkills)) {
    total += Math.min(100, ((skills[skill] || 0) / required) * 100);
    count++;
  }
  return count > 0 ? Math.round(total / count) : 0;
}

// ── SIMULATION EVALUATOR ──────────────────────────────────────────────────────
function evaluateSimulation(roleKey, answers) {
  const sim = SIMULATIONS[roleKey];
  if (!sim) return null;

  let totalXp = 0;
  const skillDeltas = {};
  const taskResults = [];

  sim.tasks.forEach(task => {
    const choiceId = answers[task.id];
    const choice = task.choices.find(c => c.id === choiceId);
    if (!choice) return;

    totalXp += choice.xp;
    Object.entries(choice.skillImpact).forEach(([skill, delta]) => {
      skillDeltas[skill] = (skillDeltas[skill] || 0) + delta;
    });
    taskResults.push({
      taskId: task.id,
      taskTitle: task.title,
      choiceText: choice.text,
      correct: choice.correct,
      xp: choice.xp,
      feedback: choice.feedback,
      skillImpact: choice.skillImpact
    });
  });

  const correctCount = taskResults.filter(r => r.correct).length;
  const performance = correctCount === 3 ? "Excellent" : correctCount === 2 ? "Good" : correctCount === 1 ? "Needs Work" : "Poor";

  return { totalXp, skillDeltas, taskResults, correctCount, performance, totalTasks: sim.tasks.length };
}

module.exports = { ROLES, SIMULATIONS, calculateRejection, calculateTimeToJob, calculateROI, evaluateSimulation, calcReadiness };
