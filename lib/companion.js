// lib/companion.js
import { getData, setData } from "@/lib/storage";

const COMPANION_NAME_KEY = "companion-name";
const LEGACY_LOCAL_KEY = "chintu-companion-name"; // pre-cloud-sync key
const DEFAULT_NAME = "Chintu";

export function getLocalCompanionName() {
  try {
    return localStorage.getItem(COMPANION_NAME_KEY) || localStorage.getItem(LEGACY_LOCAL_KEY) || DEFAULT_NAME;
  } catch {
    return DEFAULT_NAME;
  }
}

// Pulls the cloud name down so a returning user (or one who just signed
// back in after a localStorage.clear() on sign-out) gets their chosen
// name back instead of falling to the default.
export async function hydrateCompanionName() {
  try {
    const local = getLocalCompanionName();
    const cloud = await getData(COMPANION_NAME_KEY, local);
    const name = (typeof cloud === "string" && cloud.trim()) ? cloud : local;
    localStorage.setItem(COMPANION_NAME_KEY, name);
    return name;
  } catch {
    return getLocalCompanionName();
  }
}

export function setCompanionName(name) {
  const clean = (name || "").trim() || DEFAULT_NAME;
  try { localStorage.setItem(COMPANION_NAME_KEY, clean); } catch {}
  setData(COMPANION_NAME_KEY, clean);
  return clean;
}