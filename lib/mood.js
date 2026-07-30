// lib/mood.js
// Single source of truth for the mood log — written from both
// MoodCheckin.jsx and DashboardContent.jsx's quick mood picker, so it's
// centralized here rather than duplicated in both places.
import { getData, setData } from "@/lib/storage";

const MOOD_KEY = "mood_log";
const LEGACY_MOOD_KEY = "chintu-mood-log"; // pre-cloud-sync key name

export function getLocalMoodLog() {
  try {
    const raw = localStorage.getItem(MOOD_KEY) ?? localStorage.getItem(LEGACY_MOOD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Pulls the cloud mood log down so a returning user on a new device/
// browser doesn't see an empty history.
export async function hydrateMoodLog() {
  try {
    const cloud = await getData(MOOD_KEY, getLocalMoodLog());
    const log = cloud || [];
    localStorage.setItem(MOOD_KEY, JSON.stringify(log));
    return log;
  } catch {
    return getLocalMoodLog();
  }
}

export async function saveMoodLog(log) {
  localStorage.setItem(MOOD_KEY, JSON.stringify(log));
  await setData(MOOD_KEY, log);
}
