// A tiny shared registry mapping subject name -> color hex, so the same
// subject looks the same color everywhere (Timetable, Goals, and anywhere
// else that wants to opt in). Stored under one localStorage key so every
// page reads/writes the same source of truth.
import { getData, setData } from "@/lib/storage";

const KEY = "subject_colors";
const LEGACY_KEY = "chintu-subject-colors"; // pre-cloud-sync key name

function normalize(subject) {
  return (subject || "").trim().toLowerCase();
}

export function loadSubjectColors() {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Pulls the cloud color map down so a returning user on a new device/
// browser doesn't lose their subject-color associations.
export async function hydrateSubjectColors() {
  try {
    const cloud = await getData(KEY, loadSubjectColors());
    const map = cloud || {};
    localStorage.setItem(KEY, JSON.stringify(map));
    return map;
  } catch {
    return loadSubjectColors();
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
  const map = loadSubjectColors();
  map[key] = color;
  try { localStorage.setItem(KEY, JSON.stringify(map)); } catch {}
  setData(KEY, map); // fire-and-forget cloud sync
}