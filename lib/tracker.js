// lib/tracker.js
// Single source of truth for the portion tracker's data: exam pack,
// subject/topic tree, session log, and daily/weekly bonus log. These used
// to live under four separate localStorage keys (chintu-exam-pack,
// chintu-subjects, chintu-session-log, chintu-bonus-log), written from
// PortionTracker.jsx and StudyTimer.jsx and read from half a dozen other
// components — but Supabase only has one "tracker" jsonb column for all of
// it, so they're bundled into one blob here.
import { getData, setData } from "@/lib/storage";

const TRACKER_KEY = "tracker";
const LEGACY_EXAM_PACK_KEY = "chintu-exam-pack";
const LEGACY_SUBJECTS_KEY = "chintu-subjects";
const LEGACY_SESSION_LOG_KEY = "chintu-session-log";
const LEGACY_BONUS_LOG_KEY = "chintu-bonus-log";

function defaultTracker() {
  return { examPack: null, subjects: {}, sessionLog: [], bonusLog: {} };
}

function readLegacyJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Nothing under the new consolidated key yet — build it once from
// whatever's under the old, separate per-piece keys.
function buildFromLegacyKeys() {
  return {
    examPack: (() => { try { return localStorage.getItem(LEGACY_EXAM_PACK_KEY) || null; } catch { return null; } })(),
    subjects: readLegacyJSON(LEGACY_SUBJECTS_KEY, {}),
    sessionLog: readLegacyJSON(LEGACY_SESSION_LOG_KEY, []),
    bonusLog: readLegacyJSON(LEGACY_BONUS_LOG_KEY, {}),
  };
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    if (raw) return { ...defaultTracker(), ...JSON.parse(raw) };
  } catch {
    // fall through to legacy read below
  }
  return buildFromLegacyKeys();
}

function saveLocal(tracker) {
  try { localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker)); } catch {}
  setData(TRACKER_KEY, tracker); // fire-and-forget cloud sync
}

// Pulls the cloud tracker down (if signed in) so a returning user on a new
// device/browser doesn't see empty subjects/history.
export async function hydrateTracker() {
  try {
    const cloud = await getData(TRACKER_KEY, loadLocal());
    const tracker = { ...defaultTracker(), ...(cloud || {}) };
    localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker));
    return tracker;
  } catch {
    return loadLocal();
  }
}

export function getLocalTracker() {
  return loadLocal();
}

export function getExamPack() { return getLocalTracker().examPack; }
export function getSubjects() { return getLocalTracker().subjects; }
export function getSessionLog() { return getLocalTracker().sessionLog; }
export function getBonusLog() { return getLocalTracker().bonusLog; }

export function saveExamPackAndSubjects(examPack, subjects) {
  const tracker = getLocalTracker();
  tracker.examPack = examPack;
  tracker.subjects = subjects;
  saveLocal(tracker);
}

export function appendSessionLogEntry(entry) {
  const tracker = getLocalTracker();
  tracker.sessionLog = [...tracker.sessionLog, entry];
  saveLocal(tracker);
  return tracker.sessionLog;
}

export function saveBonusLog(bonusLog) {
  const tracker = getLocalTracker();
  tracker.bonusLog = bonusLog;
  saveLocal(tracker);
}
