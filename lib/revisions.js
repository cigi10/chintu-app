// lib/revisions.js
// Single source of truth for the spaced-repetition revision schedule,
// written from RevisionQueue.jsx and read from DashboardContent.jsx and
// WeeklyDigest.jsx.
import { getData, setData } from "@/lib/storage";

const REVISION_KEY = "revisions";
const LEGACY_REVISION_KEY = "chintu-revisions"; // pre-cloud-sync key name

export function getLocalRevisionSchedule() {
  try {
    const raw = localStorage.getItem(REVISION_KEY) ?? localStorage.getItem(LEGACY_REVISION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Pulls the cloud schedule down so a returning user on a new device/
// browser doesn't see an empty queue.
export async function hydrateRevisionSchedule() {
  try {
    const cloud = await getData(REVISION_KEY, getLocalRevisionSchedule());
    const schedule = cloud || [];
    localStorage.setItem(REVISION_KEY, JSON.stringify(schedule));
    return schedule;
  } catch {
    return getLocalRevisionSchedule();
  }
}

export async function saveRevisionSchedule(data) {
  localStorage.setItem(REVISION_KEY, JSON.stringify(data));
  await setData(REVISION_KEY, data);
}
