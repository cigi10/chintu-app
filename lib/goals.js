import { localDateStr } from "./date";

export const GOALS_KEY = "chintu-goals";
export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const GOAL_COLORS = [
  { label: "Red",    value: "#FECACA", text: "#991B1B" },
  { label: "Blue",   value: "#BFDBFE", text: "#1E40AF" },
  { label: "Green",  value: "#BBF7D0", text: "#166534" },
  { label: "Purple", value: "#E9D5FF", text: "#6B21A8" },
  { label: "Orange", value: "#FED7AA", text: "#9A3412" },
  { label: "Yellow", value: "#FEF08A", text: "#854D0E" },
];

export function loadGoals() {
  try { return JSON.parse(localStorage.getItem(GOALS_KEY) || "[]"); } catch { return []; }
}
export function saveGoals(goals) {
  try { localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); } catch {}
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

function doneKey(dateStr) { return `chintu-goal-done-${dateStr}`; }

export function getDoneMap(dateStr) {
  try { return JSON.parse(localStorage.getItem(doneKey(dateStr)) || "{}"); } catch { return {}; }
}
export function setGoalDone(goalId, dateStr, done) {
  const map = getDoneMap(dateStr);
  map[goalId] = done;
  try { localStorage.setItem(doneKey(dateStr), JSON.stringify(map)); } catch {}
}