// lib/loafSlices.js
// "Loaf Slices" — a weekly, no-shame streak tracker. A week is a loaf of
// 7 slices (Mon-Sun); completing at least one real focus session on a day
// bakes that day's slice gold. A day with no session just stays a plain,
// neutral "unbaked" slice — never red, crossed out, or reset. Past weeks'
// loaves are kept forever (not cleared) so users can see their
// consistency over time without any week ever being marked a failure.
//
// Storage key: "loaf_slices" — { weeks: { "<mondayDateStr>": { Mon: bool, ... Sun: bool } } }
import { localDateStr } from "./date";
import { getData, setData } from "@/lib/storage";
import { addCoins } from "@/lib/coins";

export const LOAF_KEY = "loaf_slices";
export const LOAF_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COINS_PER_SLICE = 3;

function defaultState() { return { weeks: {} }; }

function emptyWeek() {
  const week = {};
  LOAF_DAYS.forEach(day => { week[day] = false; });
  return week;
}

function sanitizeState(raw) {
  if (!raw || typeof raw !== "object" || !raw.weeks || typeof raw.weeks !== "object") {
    return defaultState();
  }
  const weeks = {};
  for (const [weekStart, days] of Object.entries(raw.weeks)) {
    if (!days || typeof days !== "object") continue;
    const clean = emptyWeek();
    LOAF_DAYS.forEach(day => { clean[day] = !!days[day]; });
    weeks[weekStart] = clean;
  }
  return { weeks };
}

function load() {
  try {
    const raw = localStorage.getItem(LOAF_KEY);
    return raw ? sanitizeState(JSON.parse(raw)) : defaultState();
  } catch {
    return defaultState();
  }
}

function save(state) {
  try { localStorage.setItem(LOAF_KEY, JSON.stringify(state)); } catch {}
  setData(LOAF_KEY, state); // fire-and-forget cloud sync
}

// Once baked, always baked: merge takes the OR of local/cloud per slice so
// a slice already baked on one side can never revert to unbaked because
// the other side hadn't seen it yet.
function mergeStates(a, b) {
  const weeks = {};
  for (const weekStart of new Set([...Object.keys(a.weeks), ...Object.keys(b.weeks)])) {
    const aw = a.weeks[weekStart] || {};
    const bw = b.weeks[weekStart] || {};
    const merged = {};
    LOAF_DAYS.forEach(day => { merged[day] = !!aw[day] || !!bw[day]; });
    weeks[weekStart] = merged;
  }
  return { weeks };
}

// Pulls the cloud loaf history down (if signed in) and merges it with
// whatever's local, so a returning user on a new device doesn't lose past
// weeks, and switching devices mid-week doesn't un-bake today's slice.
export async function hydrateLoafSlices() {
  try {
    const local = load();
    const cloud = sanitizeState(await getData(LOAF_KEY, local));
    const merged = mergeStates(local, cloud);
    localStorage.setItem(LOAF_KEY, JSON.stringify(merged));
  } catch {}
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Monday of the week containing `date`, as a YYYY-MM-DD string — used as the week's key. */
export function getWeekStart(date = new Date()) {
  return localDateStr(getMonday(date));
}

function dayLabelFor(date) {
  return LOAF_DAYS[(date.getDay() + 6) % 7]; // Mon=0 ... Sun=6
}

/** The current week's loaf: { weekStart, days: { Mon: bool, ... Sun: bool } }. */
export function getCurrentWeekSlices() {
  const state = load();
  const weekStart = getWeekStart();
  return { weekStart, days: { ...emptyWeek(), ...(state.weeks[weekStart] || {}) } };
}

/**
 * Past weeks' loaves, oldest first — for the scrollable "bakery shelf"
 * history. Excludes the current (still-in-progress) week, which is shown
 * separately as the active loaf.
 */
export function getLoafHistory() {
  const state = load();
  const currentWeekStart = getWeekStart();
  return Object.keys(state.weeks)
    .filter(weekStart => weekStart !== currentWeekStart)
    .sort()
    .map(weekStart => ({ weekStart, days: { ...emptyWeek(), ...state.weeks[weekStart] } }));
}

/**
 * Bakes today's slice if it isn't baked yet, and awards coins for it.
 * Call this whenever a real focus timer session (not a break) completes —
 * it's idempotent, so a second session the same day just no-ops instead
 * of double-awarding coins. Returns true if today's slice was newly baked.
 */
export function bakeSliceForToday() {
  const state = load();
  const weekStart = getWeekStart();
  const today = dayLabelFor(new Date());
  const week = { ...emptyWeek(), ...(state.weeks[weekStart] || {}) };

  if (week[today]) return false;

  week[today] = true;
  state.weeks = { ...state.weeks, [weekStart]: week };
  save(state);
  addCoins(COINS_PER_SLICE);
  return true;
}
