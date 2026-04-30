const BASE = "/api/career";

export const getRoles = () =>
  fetch(`${BASE}/roles`).then(r => r.json());

export const getSimulation = (roleKey) =>
  fetch(`${BASE}/simulation/${roleKey}`).then(r => r.json());

export const evaluateSimulation = (roleKey, answers) =>
  fetch(`${BASE}/evaluate-simulation`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roleKey, answers })
  }).then(r => r.json());

export const calculateRejection = (skills, projects, roleKey) =>
  fetch(`${BASE}/calculate-rejection`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skills, projects, roleKey })
  }).then(r => r.json());

export const calculateTime = (skills, projects, roleKey, hoursPerDay) =>
  fetch(`${BASE}/calculate-time`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skills, projects, roleKey, hoursPerDay })
  }).then(r => r.json());

export const calculateROI = (skills, roleKey) =>
  fetch(`${BASE}/calculate-roi`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skills, roleKey })
  }).then(r => r.json());
