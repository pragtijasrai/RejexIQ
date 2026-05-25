const express = require("express");
const router = express.Router();
const { worlds, missions, getLevel, getOrCreateProgress } = require("./storyData");

router.get("/worlds", (req, res) => {
  res.json({ worlds });
});

router.get("/missions/:worldId", (req, res) => {
  const { worldId } = req.params;
  const worldMissions = missions[worldId];
  if (!worldMissions) {
    return res.status(404).json({ error: `No missions found for world: ${worldId}` });
  }
  
  const safe = worldMissions.map(({ correctAnswer, ...rest }) => rest);
  res.json({ missions: safe });
});

router.post("/answer", (req, res) => {
  const { userId, missionId, selectedOption } = req.body;
  if (!userId || !missionId || !selectedOption) {
    return res.status(400).json({ error: "userId, missionId, and selectedOption are required" });
  }

  
  let mission = null;
  for (const worldMissions of Object.values(missions)) {
    mission = worldMissions.find(m => m.id === missionId);
    if (mission) break;
  }
  if (!mission) return res.status(404).json({ error: "Mission not found" });

  const correct = selectedOption === mission.correctAnswer;
  const xpGained = correct ? mission.xp : 0;

  
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

router.get("/progress/:userId", (req, res) => {
  const progress = getOrCreateProgress(req.params.userId);
  res.json(progress);
});

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
