// lib/claimGuestData.js
//
// One-time "claim my guest data" routine for the guest-mode → account
// transition (Phase 1 of opening the login wall — see proxy.ts). Most of
// the app's `hydrateX()` functions already handle "cloud has data, local
// doesn't" (returning user, new device) by falling back to local when the
// cloud is empty. What none of them do is the reverse: on someone's very
// first sign-in, if the *cloud* is empty but *local* has real guest data,
// nothing ever pushes that local data up — it just keeps quietly
// rendering from localStorage until some unrelated save() call happens to
// sync that one feature's key. Until then, a second device sees nothing.
//
// This fills that gap directly: for every key a feature module actually
// syncs through lib/storage.js, if the cloud is empty and local has a
// value, push local up. It never overwrites a cloud value that's already
// there — an existing account's real data always wins over stray local
// scratch data that happened to be sitting in this browser.
import { getCloudValue, setData, getCurrentUser } from "@/lib/storage";

// Every localStorage key currently synced through getData/setData across
// the feature modules (grep for `@/lib/storage` imports in lib/ to keep
// this list honest if a new synced feature is added).
const SYNCED_KEYS = [
  "coins",
  "companion-name",
  "goals",
  "timetable",
  "mood_log",
  "todos",
  "journal",
  "revisions",
  "loaf_slices",
  "streak",
  "tracker",
  "ddays",
  "subject_colors",
  "mocktests",
  "quiz_daily_streak",
];

// companion-name is stored as a raw string (lib/companion.js writes it
// with a plain localStorage.setItem, no JSON.stringify) — every other key
// here is JSON-encoded. Getting this wrong would either throw on parse or
// silently coerce a numeric-looking name ("123") into a number.
const RAW_STRING_KEYS = new Set(["companion-name"]);

const CLAIM_FLAG_KEY = "chintu-guest-data-claimed";

function readLocalValue(key) {
  const raw = localStorage.getItem(key);
  if (raw == null) return { present: false };
  if (RAW_STRING_KEYS.has(key)) return { present: true, value: raw };
  try {
    return { present: true, value: JSON.parse(raw) };
  } catch {
    return { present: true, value: raw };
  }
}

/**
 * Call this once, right after the app can see an authenticated session
 * (see components/ConditionalNav.tsx, mounted on every page — this
 * covers login, signup, OAuth, and email-confirmation callback in one
 * place rather than duplicating the call at every auth entry point).
 *
 * Safe to call unconditionally and often: it no-ops instantly if there's
 * no session, and permanently no-ops after its first real run via the
 * chintu-guest-data-claimed flag, so it never re-scans on every page load
 * once a browser's local data has been claimed.
 */
export async function claimGuestDataForAccount() {
  if (typeof window === "undefined") return;

  try {
    if (localStorage.getItem(CLAIM_FLAG_KEY)) return;

    const user = await getCurrentUser();
    if (!user) return; // still a guest — nothing to claim yet

    for (const key of SYNCED_KEYS) {
      const local = readLocalValue(key);
      if (!local.present) continue; // this guest never touched that feature

      const cloudValue = await getCloudValue(key);
      if (cloudValue != null) continue; // cloud already has real data — never clobber it

      await setData(key, local.value);
    }

    localStorage.setItem(CLAIM_FLAG_KEY, "1");
  } catch {
    // Best-effort — a failed claim should never block using the app.
    // Deliberately doesn't set the flag on failure, so the next page
    // load/login gets to retry.
  }
}
