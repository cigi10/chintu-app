// lib/timetable.js
// Single source of truth for the weekly timetable grid, written from
// TimetableGrid.jsx and read from DashboardContent.jsx.
import { getData, setData } from "@/lib/storage";

const TIMETABLE_KEY = "timetable";
const LEGACY_TIMETABLE_KEY = "chintu-timetable"; // pre-cloud-sync key name

export function getLocalTimetable() {
  try {
    const raw = localStorage.getItem(TIMETABLE_KEY) ?? localStorage.getItem(LEGACY_TIMETABLE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Pulls the cloud timetable down so a returning user on a new device/
// browser doesn't see an empty grid.
export async function hydrateTimetable() {
  try {
    const cloud = await getData(TIMETABLE_KEY, getLocalTimetable());
    const timetable = cloud || {};
    localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
    return timetable;
  } catch {
    return getLocalTimetable();
  }
}

export async function saveTimetable(timetable) {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
  await setData(TIMETABLE_KEY, timetable);
}
