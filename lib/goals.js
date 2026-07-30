import { localDateStr } from "./date";
import { getData, setData } from "@/lib/storage";

export const GOALS_KEY = "goals";
const LEGACY_GOALS_KEY = "chintu-goals"; // pre-cloud-sync key name (definitions only)
function legacyDoneKey(dateStr) { return `chintu-goal-done-${dateStr}`; }

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const GOAL_COLORS = [
  { label: "Red",    value: "#FECACA", text: "#991B1B" },
  { label: "Blue",   value: "#BFDBFE", text: "#1E40AF" },
  { label: "Green",  value: "#BBF7D0", text: "#166534" },
  { label: "Purple", value: "#E9D5FF", text: "#6B21A8" },
  { label: "Orange", value: "#FED7AA", text: "#9A3412" },
  { label: "Yellow", value: "#FEF08A", text: "#854D0E" },
];

function defaultState() { return { definitions: [], doneByDate: {} }; }

// Goal definitions and per-day "done" checkmarks are bundled into one blob
// under the "goals" column, since that's the only column Supabase has for
// this data. Per-day done-state used to live under one localStorage key
// per date (chintu-goal-done-<date>) — getDoneMap still falls back to
// those for dates recorded before cloud sync existed.
function loadState() {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (raw) return JSON.parse(raw);
    const legacyDefs = localStorage.getItem(LEGACY_GOALS_KEY);
    return { definitions: legacyDefs ? JSON.parse(legacyDefs) : [], doneByDate: {} };
  } catch {
    return defaultState();
  }
}
function saveState(state) {
  try { localStorage.setItem(GOALS_KEY, JSON.stringify(state)); } catch {}
  setData(GOALS_KEY, state); // fire-and-forget cloud sync
}

// Pulls the cloud goals (definitions + done history) down so a returning
// user on a new device/browser doesn't see an empty goal list.
export async function hydrateGoals() {
  try {
    const cloud = await getData(GOALS_KEY, loadState());
    localStorage.setItem(GOALS_KEY, JSON.stringify(cloud || defaultState()));
  } catch {}
}

export function loadGoals() {
  return loadState().definitions || [];
}
export function saveGoals(goals) {
  const state = loadState();
  state.definitions = goals;
  saveState(state);
}
export function deleteGoal(goalId) {
  saveGoals(loadGoals().filter(g => g.id !== goalId));
}

export function isGoalActiveOnDate(goal, dateObj) {
  const dateStr = localDateStr(dateObj);
  const r = goal.repeat || {};
  if (r.startDate && dateStr < r.startDate) return false;
  if (r.endDate && dateStr > r.endDate) return false;
  if (r.type === "once")   return r.startDate === dateStr;
  if (r.type === "daily")  return true;
  if (r.type === "weekly") return (r.days || []).includes(WEEK_DAYS[dateObj.getDay()]);
  return false;
}

export function getGoalsForDate(dateObj) {
  return loadGoals().filter(g => isGoalActiveOnDate(g, dateObj));
}

// Used by Timetable to show which goals fall on which day this week
export function getGoalsForWeek() {
  const today = new Date();
  const map = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    map[WEEK_DAYS[i]] = getGoalsForDate(d);
  }
  return map;
}

export function getDoneMap(dateStr) {
  const state = loadState();
  if (state.doneByDate && state.doneByDate[dateStr]) return state.doneByDate[dateStr];
  try {
    const raw = localStorage.getItem(legacyDoneKey(dateStr));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
export function setGoalDone(goalId, dateStr, done) {
  const state = loadState();
  const map = { ...getDoneMap(dateStr), [goalId]: done };
  state.doneByDate = { ...(state.doneByDate || {}), [dateStr]: map };
  saveState(state);
}
