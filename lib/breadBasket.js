// lib/breadBasket.js
// "Bread Basket" — a weekly, no-shame streak tracker, reskinned from the
// earlier "Loaf Slices" concept: pure accumulation instead of a
// pass/fail slice grid. A week is a basket that gains one bun for every
// day with at least one real focus session — there is no "empty" or
// "missed" visual state, a day that hasn't been studied simply doesn't
// add a bun yet. Past weeks' baskets are kept forever (not cleared) so
// users can see their consistency over time without any week ever being
// marked a failure.
//
// Storage key and on-disk shape are unchanged from the Loaf Slices era
// on purpose — "loaf_slices" / { weeks: { "<mondayDateStr>": { Mon: bool,
// ... Sun: bool } } } — so existing users' history carries over with zero
// migration. Only the naming/API surface changed to bun/basket language.
import { localDateStr } from "./date";
import { getData, setData } from "@/lib/storage";
import { addCoins } from "@/lib/coins";

export const BASKET_KEY = "loaf_slices"; // unchanged storage key — see note above
export const BASKET_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COINS_PER_BUN = 3;

function defaultState() { return { weeks: {} }; }

function emptyWeek() {
  const week = {};
  BASKET_DAYS.forEach(day => { week[day] = false; });
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
    BASKET_DAYS.forEach(day => { clean[day] = !!days[day]; });
    weeks[weekStart] = clean;
  }
  return { weeks };
}

function load() {
  try {
    const raw = localStorage.getItem(BASKET_KEY);
    return raw ? sanitizeState(JSON.parse(raw)) : defaultState();
  } catch {
    return defaultState();
  }
}

function save(state) {
  try { localStorage.setItem(BASKET_KEY, JSON.stringify(state)); } catch {}
  setData(BASKET_KEY, state); // fire-and-forget cloud sync
}

// Once a bun's added, it's added for good: merge takes the OR of
// local/cloud per day, so a day already counted on one side can never
// revert to uncounted just because the other side hadn't seen it yet.
function mergeStates(a, b) {
  const weeks = {};
  for (const weekStart of new Set([...Object.keys(a.weeks), ...Object.keys(b.weeks)])) {
    const aw = a.weeks[weekStart] || {};
    const bw = b.weeks[weekStart] || {};
    const merged = {};
    BASKET_DAYS.forEach(day => { merged[day] = !!aw[day] || !!bw[day]; });
    weeks[weekStart] = merged;
  }
  return { weeks };
}

// Pulls the cloud basket history down (if signed in) and merges it with
// whatever's local, so a returning user on a new device doesn't lose past
// weeks, and switching devices mid-week doesn't un-count today's bun.
export async function hydrateBreadBasket() {
  try {
    const local = load();
    const cloud = sanitizeState(await getData(BASKET_KEY, local));
    const merged = mergeStates(local, cloud);
    localStorage.setItem(BASKET_KEY, JSON.stringify(merged));
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
  return BASKET_DAYS[(date.getDay() + 6) % 7]; // Mon=0 ... Sun=6
}

/** The current week's basket: { weekStart, days: { Mon: bool, ... Sun: bool } }. */
export function getCurrentBasket() {
  const state = load();
  const weekStart = getWeekStart();
  return { weekStart, days: { ...emptyWeek(), ...(state.weeks[weekStart] || {}) } };
}

/**
 * Past weeks' baskets, oldest first — for the scrollable "bakery shelf"
 * history. Excludes the current (still-filling) week, which is shown
 * separately as the active basket.
 */
export function getBasketHistory() {
  const state = load();
  const currentWeekStart = getWeekStart();
  return Object.keys(state.weeks)
    .filter(weekStart => weekStart !== currentWeekStart)
    .sort()
    .map(weekStart => ({ weekStart, days: { ...emptyWeek(), ...state.weeks[weekStart] } }));
}

/**
 * Adds today's bun to the basket if it isn't there yet, and awards coins
 * for it. Call this whenever a real focus timer session (not a break)
 * completes — it's idempotent, so a second session the same day just
 * no-ops instead of double-awarding coins or adding a second bun (the
 * basket counts at most one bun per day, never one per session). Returns
 * true if a bun was newly added for today.
 */
export function addBunForToday() {
  const state = load();
  const weekStart = getWeekStart();
  const today = dayLabelFor(new Date());
  const week = { ...emptyWeek(), ...(state.weeks[weekStart] || {}) };

  if (week[today]) return false;

  week[today] = true;
  state.weeks = { ...state.weeks, [weekStart]: week };
  save(state);
  addCoins(COINS_PER_BUN);
  return true;
}
