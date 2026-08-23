import { localDateStr } from "./date";
import { getData, setData } from "@/lib/storage";

export const GOALS_KEY = "goals";
const LEGACY_GOALS_KEY = "chintu-goals";
function legacyDoneKey(dateStr) { return `chintu-goal-done-${dateStr}`; }

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const GOAL_COLOR_SETS = {
  sunset:     [ { label: "Pink",   value: "#F2619C", text: "#7A1F45" }, { label: "Lilac",  value: "#E7BEF8", text: "#5B3A85" }, { label: "Blue",   value: "#93ABD9", text: "#2C4D77" }, { label: "Green",  value: "#7EC8A0", text: "#1F5C3F" }, { label: "Yellow", value: "#EDE986", text: "#6B6420" }, { label: "Orange", value: "#F9C060", text: "#7A4B10" } ],
  azure:      [ { label: "Blue",   value: "#367ADF", text: "#F1F8FE" }, { label: "Sky",    value: "#AED5F5", text: "#1E2A3D" }, { label: "Teal",   value: "#4FACE5", text: "#1E2A3D" }, { label: "Navy",   value: "#394988", text: "#F1F8FE" }, { label: "Green",  value: "#7EC8A0", text: "#1E2A3D" }, { label: "Gold",   value: "#F9C060", text: "#1E2A3D" } ],
  strawberry: [ { label: "Pink",   value: "#D5306D", text: "#FFF6F6" }, { label: "Blush",  value: "#FF92C1", text: "#4A2530" }, { label: "Soft",   value: "#FBE0E0", text: "#4A2530" }, { label: "Peach",  value: "#EEB17D", text: "#4A2530" }, { label: "Yellow", value: "#EFD47A", text: "#4A2530" }, { label: "Green",  value: "#7EC8A0", text: "#1D5C3E" } ],
  periwinkle: [ { label: "Mauve",  value: "#BCA4F5", text: "#2A2A45" }, { label: "Blue",   value: "#4A69CE", text: "#F3FBF8" }, { label: "Sky",    value: "#81CFFF", text: "#2A2A45" }, { label: "Lime",   value: "#ECFFBE", text: "#2A2A45" }, { label: "Mint",   value: "#E5F8F0", text: "#2A2A45" }, { label: "Green",  value: "#7EC8A0", text: "#1E3A32" } ],
  matcha:     [ { label: "Green",  value: "#84D175", text: "#0C2D45" }, { label: "Blue",   value: "#3E5BA3", text: "#F3FAEE" }, { label: "Mint",   value: "#E6FBDA", text: "#0C2D45" }, { label: "Cream",  value: "#FFF8D2", text: "#0C2D45" }, { label: "Gold",   value: "#F9C060", text: "#0C2D45" }, { label: "Rust",   value: "#D98A6B", text: "#FFFBFF" } ],
  forest:     [ { label: "Olive",  value: "#65743A", text: "#F9FDEE" }, { label: "Slate",  value: "#394F49", text: "#F9FDEE" }, { label: "Gold",   value: "#EFDD8D", text: "#210124" }, { label: "Lime",   value: "#F4FDAF", text: "#210124" }, { label: "Plum",   value: "#6B2E6E", text: "#F9FDEE" }, { label: "Cream",  value: "#F9FDCC", text: "#210124" } ],
  majorelle:  [ { label: "Purple", value: "#6E44FF", text: "#FFF0F7" }, { label: "Lilac",  value: "#BB92FF", text: "#2E1A4A" }, { label: "Pink",   value: "#FF90B3", text: "#2E1A4A" }, { label: "Coral",  value: "#EF7A85", text: "#FFF0F7" }, { label: "Yellow", value: "#EDE986", text: "#2E1A4A" }, { label: "Green",  value: "#7EC8A0", text: "#2E1A4A" } ],
  slate:      [ { label: "Slate",  value: "#4F5D75", text: "#FDECEF" }, { label: "Teal",   value: "#395756", text: "#FDECEF" }, { label: "Evergreen", value: "#1B3022", text: "#FDECEF" }, { label: "Pink",   value: "#D9507E", text: "#FDECEF" }, { label: "Yellow", value: "#EDE986", text: "#2C2528" }, { label: "Gold",   value: "#F9C060", text: "#2C2528" } ],
  cocoa:      [ { label: "Cream",  value: "#F1DABF", text: "#17120D" }, { label: "Taupe",  value: "#92817A", text: "#FFFBFF" }, { label: "Sage",   value: "#7A9B6E", text: "#17120D" }, { label: "Gold",   value: "#C9A876", text: "#17120D" }, { label: "Rust",   value: "#C46B5A", text: "#FFFBFF" }, { label: "Amber",  value: "#E8C69A", text: "#17120D" } ],
};

export function getGoalColors() {
  try {
    const theme = document.documentElement.getAttribute("data-theme") || "sunset";
    return GOAL_COLOR_SETS[theme] || GOAL_COLOR_SETS.sunset;
  } catch {
    return GOAL_COLOR_SETS.sunset;
  }
}

export const GOAL_COLORS = GOAL_COLOR_SETS.sunset;

function defaultState() { return { definitions: [], doneByDate: {} }; }

function sanitizeState(raw) {
  if (!raw || typeof raw !== "object") return defaultState();
  return {
    definitions: Array.isArray(raw.definitions) ? raw.definitions : [],
    doneByDate: (raw.doneByDate && typeof raw.doneByDate === "object") ? raw.doneByDate : {},
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (raw) return sanitizeState(JSON.parse(raw));
    const legacyDefs = localStorage.getItem(LEGACY_GOALS_KEY);
    return { definitions: legacyDefs ? JSON.parse(legacyDefs) : [], doneByDate: {} };
  } catch {
    return defaultState();
  }
}
function saveState(state) {
  try { localStorage.setItem(GOALS_KEY, JSON.stringify(state)); } catch {}
  setData(GOALS_KEY, state);
}

export async function hydrateGoals() {
  try {
    const local = loadState();
    const cloud = sanitizeState(await getData(GOALS_KEY, local));

    const merged = {
      definitions: local.definitions.length >= cloud.definitions.length ? local.definitions : cloud.definitions,
      doneByDate: { ...cloud.doneByDate, ...local.doneByDate },
    };

    localStorage.setItem(GOALS_KEY, JSON.stringify(merged));
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