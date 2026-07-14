// A tiny shared registry mapping subject name -> color hex, so the same
// subject looks the same color everywhere (Timetable, Goals, and anywhere
// else that wants to opt in). Stored under one localStorage key so every
// page reads/writes the same source of truth.
const KEY = "chintu-subject-colors";

function normalize(subject) {
  return (subject || "").trim().toLowerCase();
}

export function loadSubjectColors() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Returns the known color for a subject, or `fallback` if none is registered yet.
export function getSubjectColor(subject, fallback = null) {
  const key = normalize(subject);
  if (!key) return fallback;
  const map = loadSubjectColors();
  return map[key] || fallback;
}

export function setSubjectColor(subject, color) {
  const key = normalize(subject);
  if (!key || !color) return;
  try {
    const map = loadSubjectColors();
    map[key] = color;
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {}
}