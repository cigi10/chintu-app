// lib/wordGameProgress.js
// Storage key: "games_progress" -- shared across every Studyloaf game
// (Crumb's three domains today, future formats like the equation-guessing
// game later), keyed internally by domain slug so a new domain or game
// format never needs its own column. Maps to a JSONB column on the
// Supabase user_data table for cross-device sync, same as coins/streak/
// todos/etc. Falls back to localStorage-only behavior (same as a logged-
// out guest) if there's no session.
//
// Shape: { "<domainSlug>": { playedDates: [...], today: { date, guesses, status } } }
// playedDates powers the streak count, same OR-merge approach as
// lib/quizStreak.js. `today` holds the in-progress/completed state for
// the current calendar day only — it's just discarded (not merged) once
// its date is no longer today, since restarting today's puzzle fresh on
// a new device is an acceptable edge case, unlike losing streak history.
import { getData, setData } from "@/lib/storage";
import { localDateStr } from "@/lib/date";
import { MAX_GUESSES } from "@/lib/wordGame";

const PROGRESS_KEY = "games_progress";

function defaultState() { return {}; }

function sanitizeState(raw) {
  if (!raw || typeof raw !== "object") return defaultState();
  const state = {};
  for (const [slug, entry] of Object.entries(raw)) {
    if (!entry || typeof entry !== "object") continue;
    const playedDates = Array.isArray(entry.playedDates)
      ? entry.playedDates.filter(d => typeof d === "string")
      : [];
    let today = null;
    if (entry.today && typeof entry.today === "object" && typeof entry.today.date === "string") {
      today = {
        date: entry.today.date,
        guesses: Array.isArray(entry.today.guesses) ? entry.today.guesses.filter(g => typeof g === "string") : [],
        status: ["playing", "won", "lost"].includes(entry.today.status) ? entry.today.status : "playing",
      };
    }
    state[slug] = { playedDates, today };
  }
  return state;
}

function load() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? sanitizeState(JSON.parse(raw)) : defaultState();
  } catch {
    return defaultState();
  }
}

function save(state) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(state)); } catch {}
  setData(PROGRESS_KEY, state); // fire-and-forget cloud sync
}

function mergeStates(a, b) {
  const merged = {};
  for (const slug of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const aEntry = a[slug] || { playedDates: [], today: null };
    const bEntry = b[slug] || { playedDates: [], today: null };
    const playedDates = [...new Set([...aEntry.playedDates, ...bEntry.playedDates])].sort();
    // Prefer whichever "today" is actually for today; if both are, prefer
    // the one with more guesses (further progress) rather than guessing.
    const today = new Date();
    const todayStr = localDateStr(today);
    let mergedToday = null;
    const aToday = aEntry.today?.date === todayStr ? aEntry.today : null;
    const bToday = bEntry.today?.date === todayStr ? bEntry.today : null;
    if (aToday && bToday) {
      mergedToday = aToday.guesses.length >= bToday.guesses.length ? aToday : bToday;
    } else {
      mergedToday = aToday || bToday || null;
    }
    merged[slug] = { playedDates, today: mergedToday };
  }
  return merged;
}

export async function hydrateWordGameProgress() {
  try {
    const local = load();
    const cloud = sanitizeState(await getData(PROGRESS_KEY, local));
    const merged = mergeStates(local, cloud);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));
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

/**
 * Today's in-progress/completed state for a domain, or a fresh "playing"
 * state with no guesses if today's puzzle hasn't been started (or the
 * stored state is from a previous day).
 */
export function getTodayProgress(slug) {
  const state = load();
  const entry = state[slug];
  const todayStr = localDateStr();
  if (entry?.today?.date === todayStr) return entry.today;
  return { date: todayStr, guesses: [], status: "playing" };
}

export function getWordGameStreakInfo(slug) {
  const state = load();
  const playedDates = state[slug]?.playedDates || [];
  return { streakCount: computeStreak(playedDates) };
}

/**
 * Appends a guess to today's progress for a domain, updating status once
 * the puzzle is won or all guesses are used. Marks today as played (for
 * streak purposes) the moment the puzzle ends, win or lose — matching
 * how Wordle-style streaks count "played", not just "won".
 */
export function recordGuess(slug, guess, won) {
  const state = load();
  const todayStr = localDateStr();
  const entry = state[slug] || { playedDates: [], today: null };
  const current = entry.today?.date === todayStr ? entry.today : { date: todayStr, guesses: [], status: "playing" };

  const guesses = [...current.guesses, guess];
  const status = won ? "won" : guesses.length >= MAX_GUESSES ? "lost" : "playing";
  const today = { date: todayStr, guesses, status };

  const playedDates = status === "playing"
    ? entry.playedDates
    : [...new Set([...entry.playedDates, todayStr])].sort();

  state[slug] = { playedDates, today };
  save(state);

  return { today, streakCount: computeStreak(playedDates) };
}
