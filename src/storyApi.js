/**
 * Story Mode API client
 * All calls go through Vite's proxy → http://localhost:5000
 */

const BASE = "/api";

export async function fetchWorlds() {
  const res = await fetch(`${BASE}/worlds`);
  if (!res.ok) throw new Error("Failed to fetch worlds");
  return res.json();
}

export async function fetchMissions(worldId) {
  const res = await fetch(`${BASE}/missions/${worldId}`);
  if (!res.ok) throw new Error(`Failed to fetch missions for ${worldId}`);
  return res.json();
}

export async function submitAnswer(userId, missionId, selectedOption) {
  const res = await fetch(`${BASE}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, missionId, selectedOption })
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}

export async function fetchProgress(userId) {
  const res = await fetch(`${BASE}/progress/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

export async function updateProgress(userId, xp, completedMissions) {
  const res = await fetch(`${BASE}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, xp, completedMissions })
  });
  if (!res.ok) throw new Error("Failed to update progress");
  return res.json();
}
