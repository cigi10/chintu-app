// lib/quizStreak.js
// Storage key: "quiz_daily_streak" -- { "<categorySlug>": { playedDates: [...] } }
// Each Daily Challenge category (ece, neet-bio, jee-physics) keeps its own
// streak, since they are separate daily puzzles.
import { getData, setData } from "@/lib/storage";
import { localDateStr } from "@/lib/date";

const STREAK_KEY = "quiz_daily_streak";

function defaultState() { return {}; }

function sanitizeState(raw) {
  if (!raw || typeof raw !== "object") return defaultState();
  const state = {};
  for (const [slug, entry] of Object.entries(raw)) {
    if (!entry || !Array.isArray(entry.playedDates)) continue;
    state[slug] = { playedDates: entry.playedDates.filter(d => typeof d === "string") };
  }
  return state;
}

function load() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? sanitizeState(JSON.parse(raw)) : defaultState();
  } catch {
    return defaultState();
  }
}

function save(state) {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(state)); } catch {}
  setData(STREAK_KEY, state); // fire-and-forget cloud sync
}

// A day already recorded on either side stays recorded, the same OR merge
// used in lib/breadBasket.js, so switching devices never drops a streak day.
function mergeStates(a, b) {
  const merged = {};
  for (const slug of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const aDates = a[slug]?.playedDates || [];
    const bDates = b[slug]?.playedDates || [];
    merged[slug] = { playedDates: [...new Set([...aDates, ...bDates])].sort() };
  }
  return merged;
}

// Pulls the cloud streak down (if signed in) and merges it with whatever's
// local, so a returning player on a new device doesn't lose past streak
// days, and switching devices mid-day doesn't un-count today's play.
export async function hydrateQuizStreak() {
  try {
    const local = load();
    const cloud = sanitizeState(await getData(STREAK_KEY, local));
    const merged = mergeStates(local, cloud);
    localStorage.setItem(STREAK_KEY, JSON.stringify(merged));
  } catch {}
}

function computeStreak(playedDates) {
  if (!playedDates.length) return 0;
  const set = new Set(playedDates);
  const cursor = new Date();
  if (!set.has(localDateStr(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (set.has(localDateStr(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getDailyStreakInfo(slug) {
  const state = load();
  const playedDates = state[slug]?.playedDates || [];
  return {
    streakCount: computeStreak(playedDates),
    playedToday: playedDates.includes(localDateStr()),
  };
}

/**
 * Marks today as played for a category. Idempotent, so playing the daily
 * question again on the same day never double-counts. Returns the updated
 * streak info.
 */
export function recordDailyPlayed(slug) {
  const state = load();
  const today = localDateStr();
  const entry = state[slug] || { playedDates: [] };

  if (!entry.playedDates.includes(today)) {
    state[slug] = { playedDates: [...entry.playedDates, today] };
    save(state);
  }

  return getDailyStreakInfo(slug);
}
