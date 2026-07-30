// lib/ddays.js
// Single source of truth for d-day countdowns — written from both
// Onboarding.jsx (initial exam date) and DashboardContent.jsx (add/remove).
import { getData, setData } from "@/lib/storage";

const DDAY_KEY = "ddays";
const LEGACY_DDAY_KEY = "chintu-ddays"; // pre-cloud-sync key name

export function getLocalDdays() {
  try {
    const raw = localStorage.getItem(DDAY_KEY) ?? localStorage.getItem(LEGACY_DDAY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Pulls the cloud d-days down so a returning user on a new device/browser
// doesn't see an empty list — this was previously write-only (Onboarding
// wrote to Supabase but nothing ever read it back).
export async function hydrateDdays() {
  try {
    const cloud = await getData(DDAY_KEY, getLocalDdays());
    const ddays = cloud || [];
    localStorage.setItem(DDAY_KEY, JSON.stringify(ddays));
    return ddays;
  } catch {
    return getLocalDdays();
  }
}

export async function saveDdays(ddays) {
  localStorage.setItem(DDAY_KEY, JSON.stringify(ddays));
  await setData(DDAY_KEY, ddays);
}
