/**
 * Story Mode API Routes
 * GET  /api/worlds
 * GET  /api/missions/:worldId
 * POST /api/answer
 * GET  /api/progress/:userId
 * POST /api/progress
 */

const express = require("express");
const router = express.Router();
const { worlds, missions, getLevel, getOrCreateProgress } = require("./storyData");

// GET /api/worlds
router.get("/worlds", (req, res) => {
  res.json({ worlds });
});

// GET /api/missions/:worldId
router.get("/missions/:worldId", (req, res) => {
  const { worldId } = req.params;
  const worldMissions = missions[worldId];
  if (!worldMissions) {
    return res.status(404).json({ error: `No missions found for world: ${worldId}` });
  }
  // Strip correctAnswer from response — validated server-side
  const safe = worldMissions.map(({ correctAnswer, ...rest }) => rest);
  res.json({ missions: safe });
});

// POST /api/answer  { userId, missionId, selectedOption }
router.post("/answer", (req, res) => {
  const { userId, missionId, selectedOption } = req.body;
  if (!userId || !missionId || !selectedOption) {
    return res.status(400).json({ error: "userId, missionId, and selectedOption are required" });
  }

  // Find mission across all worlds
  let mission = null;
  for (const worldMissions of Object.values(missions)) {
    mission = worldMissions.find(m => m.id === missionId);
    if (mission) break;
  }
  if (!mission) return res.status(404).json({ error: "Mission not found" });

  const correct = selectedOption === mission.correctAnswer;
  const xpGained = correct ? mission.xp : 0;

  // Update progress
  const progress = getOrCreateProgress(userId);
  if (correct && !progress.completedMissions.includes(missionId)) {
    progress.xp += xpGained;
    progress.completedMissions.push(missionId);
    progress.level = getLevel(progress.xp);
  }

  res.json({
    correct,
    xpGained,
    correctAnswer: mission.correctAnswer,
    explanation: mission.explanation,
    progress: { xp: progress.xp, level: progress.level }
  });
});

// GET /api/progress/:userId
router.get("/progress/:userId", (req, res) => {
  const progress = getOrCreateProgress(req.params.userId);
  res.json(progress);
});

// POST /api/progress  { userId, xp, completedMissions }
router.post("/progress", (req, res) => {
  const { userId, xp, completedMissions } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  const progress = getOrCreateProgress(userId);
  if (typeof xp === "number") progress.xp = xp;
  if (Array.isArray(completedMissions)) progress.completedMissions = completedMissions;
  progress.level = getLevel(progress.xp);

  res.json({ success: true, progress });
});

module.exports = router;
