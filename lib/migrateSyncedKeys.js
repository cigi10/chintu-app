// lib/migrateSyncedKeys.js
//
// One-time upload for existing accounts when keys start syncing.
// journal, mocktests, loaf_slices and subject_colors had no user_data
// column until October 2026, so a signed-in user's data for them only ever
// lived in this browser. On the first page load after login, push each
// local value up, but only where the cloud is confirmed empty. A cloud
// value that already exists (another device got there first) always wins.
//
// The guest-data claim (lib/claimGuestData.js) doesn't cover this: it runs
// once per browser, and existing users have long since passed it.
//
// The done-flag is per user and only set when every needed upload
// succeeded, so a failed or offline run retries on the next page load.
import { getCurrentUser, readCloudValue, setData, NEWLY_SYNCED_KEYS } from "@/lib/storage";

// Older builds stored some of these under a pre-cloud-sync name; the
// feature modules still read them as a fallback, so the migration does too.
const LEGACY_LOCAL_KEYS = {
  journal: "chintu-journal",
  mocktests: "chintu-mock-scores",
  subject_colors: "chintu-subject-colors",
};

export const MIGRATION_FLAG_PREFIX = "chintu-synced-keys-migrated:";

function readLocal(key) {
  const raw = localStorage.getItem(key) ?? (LEGACY_LOCAL_KEYS[key] ? localStorage.getItem(LEGACY_LOCAL_KEYS[key]) : null);
  if (raw == null) return { present: false };
  try {
    return { present: true, value: JSON.parse(raw) };
  } catch {
    return { present: false }; // unreadable local data isn't worth uploading
  }
}

function isEmpty(value) {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

// Returns a summary for tests and debugging: which keys were uploaded,
// skipped, or failed, and whether the run is complete.
export async function migrateNewlySyncedKeys() {
  const result = { uploaded: [], skipped: [], failed: [], done: false };
  if (typeof window === "undefined") return result;

  try {
    const user = await getCurrentUser();
    if (!user) return result;
    const flag = MIGRATION_FLAG_PREFIX + user.id;
    if (localStorage.getItem(flag)) return { ...result, done: true };

    for (const key of NEWLY_SYNCED_KEYS) {
      const local = readLocal(key);
      if (!local.present || isEmpty(local.value)) { result.skipped.push(key); continue; }

      const cloud = await readCloudValue(key);
      if (!cloud.ok) { result.failed.push(key); continue; }           // can't tell, so don't risk it
      if (!isEmpty(cloud.value)) { result.skipped.push(key); continue; } // never overwrite real cloud data

      const ok = await setData(key, local.value);
      (ok ? result.uploaded : result.failed).push(key);
    }

    if (result.failed.length === 0) {
      localStorage.setItem(flag, "1");
      result.done = true;
    }
  } catch {
    // Best-effort: never block the app. No flag, so the next load retries.
  }
  return result;
}
