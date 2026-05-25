const express = require("express");
const router = express.Router();
const {
  ROLES, SIMULATIONS,
  calculateRejection, calculateTimeToJob, calculateROI, evaluateSimulation
} = require("./careerData");

router.get("/roles", (req, res) => {
  const safe = Object.entries(ROLES).map(([key, r]) => ({
    key, label: r.label, icon: r.icon, color: r.color,
    avgSalary: r.avgSalary, openings: r.openings, growthRate: r.growthRate,
    requiredSkills: r.requiredSkills
  }));
  res.json({ roles: safe });
});

router.get("/simulation/:roleKey", (req, res) => {
  const sim = SIMULATIONS[req.params.roleKey];
  if (!sim) return res.status(404).json({ error: "Simulation not found" });
  
  const safe = {
    ...sim,
    tasks: sim.tasks.map(t => ({
      ...t,
      choices: t.choices.map(({ id, text }) => ({ id, text }))
    }))
  };
  res.json({ simulation: safe });
});

router.post("/evaluate-simulation", (req, res) => {
  const { roleKey, answers } = req.body;
  if (!roleKey || !answers) return res.status(400).json({ error: "roleKey and answers required" });
  const result = evaluateSimulation(roleKey, answers);
  if (!result) return res.status(404).json({ error: "Simulation not found for role" });
  res.json(result);
});

router.post("/calculate-rejection", (req, res) => {
  const { skills, projects, roleKey } = req.body;
  if (!skills || !roleKey) return res.status(400).json({ error: "skills and roleKey required" });
  const result = calculateRejection(skills, projects || 0, roleKey);
  res.json(result);
});

router.post("/calculate-time", (req, res) => {
  const { skills, projects, roleKey, hoursPerDay } = req.body;
  if (!skills || !roleKey) return res.status(400).json({ error: "skills and roleKey required" });
  const result = calculateTimeToJob(skills, projects || 0, roleKey, hoursPerDay || 2);
  res.json(result);
});

router.post("/calculate-roi", (req, res) => {
  const { skills, roleKey } = req.body;
  if (!skills || !roleKey) return res.status(400).json({ error: "skills and roleKey required" });
  const result = calculateROI(skills, roleKey);
  res.json(result);
});

module.exports = router;
