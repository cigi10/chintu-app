// lib/companion.js
import { getProfile, setProfile } from "@/lib/storage";

const COMPANION_NAME_KEY = "companion-name";
const LEGACY_LOCAL_KEY = "chintu-companion-name"; // pre-cloud-sync key
// Falls back to this only if a user somehow reaches a companion-name read
// before ever completing onboarding (which always collects a real name,
// see Onboarding.jsx's NAME_CHIPS). Deliberately one of those same
// suggested names, not "Studyloaf" — the site's own name in this slot
// reads like the pet is called Studyloaf, exactly the site-name-vs-
// companion-name mixup the Navbar brand link guards against elsewhere.
export const DEFAULT_NAME = "Biscuit";

// Shared with Onboarding.jsx (initial naming) and RenameCompanion.jsx
// (renaming after the fact), so both offer the same suggestions.
export const NAME_CHIPS = [
  "Pip", "Mochi", "Tofu", "Walnut", "Biscuit", "Bun",
  "Kiwi", "Sushi", "Coco", "Pepper", "Noodle", "Waffle",
  "Peanut", "Mango", "Olive", "Sprout",
];

// Fired whenever setCompanionName saves a new name, so any mounted
// component showing the name (e.g. Navbar's brand link) can refresh
// without a page navigation. Mirrors the chintu-shop-change pattern
// CoinShop.jsx/Companion.jsx already use for the same kind of same-tab
// sync — a "storage" event alone doesn't fire in the tab that made the
// change, only in other tabs.
export const COMPANION_NAME_CHANGE_EVENT = "companion-name-change";

export function getLocalCompanionName() {
  try {
    return localStorage.getItem(COMPANION_NAME_KEY) || localStorage.getItem(LEGACY_LOCAL_KEY) || DEFAULT_NAME;
  } catch {
    return DEFAULT_NAME;
  }
}

// Pulls the cloud name down so a returning user (or one who just signed
// back in after a localStorage.clear() on sign-out) gets their chosen
// name back instead of falling to the default. The cloud copy is
// profiles.companion_name: user_data has no companion-name column, which
// made every read and write of it a 400.
export async function hydrateCompanionName() {
  try {
    const local = getLocalCompanionName();
    const profile = await getProfile();
    const cloud = profile?.companion_name;
    const name = (typeof cloud === "string" && cloud.trim()) ? cloud : local;
    localStorage.setItem(COMPANION_NAME_KEY, name);
    return name;
  } catch {
    return getLocalCompanionName();
  }
}

// The local copy is a raw string (not JSON), written before the cloud call
// so a failed or offline save never loses the name.
export function setCompanionName(name) {
  const clean = (name || "").trim() || DEFAULT_NAME;
  try { localStorage.setItem(COMPANION_NAME_KEY, clean); } catch {}
  setProfile({ companion_name: clean });
  try { window.dispatchEvent(new Event(COMPANION_NAME_CHANGE_EVENT)); } catch {}
  return clean;
}