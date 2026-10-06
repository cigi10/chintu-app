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
// Done-flags are per user and per key, set only once that key is settled
// (uploaded, or nothing to upload, or the cloud already had data), so a
// failed or offline key retries on the next page load, and a key added to
// NEWLY_SYNCED_KEYS later migrates for users who finished the earlier ones.
// The first version used one flag per user for the first four keys; that
// flag still counts as done for exactly those four.
import { getCurrentUser, readCloudValue, setData, NEWLY_SYNCED_KEYS } from "@/lib/storage";

// Older builds stored some of these under a pre-cloud-sync name; the
// feature modules still read them as a fallback, so the migration does too.
const LEGACY_LOCAL_KEYS = {
  journal: "chintu-journal",
  mocktests: "chintu-mock-scores",
  subject_colors: "chintu-subject-colors",
};

export const MIGRATION_FLAG_PREFIX = "chintu-synced-keys-migrated:";
const FIRST_BATCH = ["journal", "mocktests", "loaf_slices", "subject_colors"];

const keyFlag = (userId, key) => `${MIGRATION_FLAG_PREFIX}${userId}:${key}`;

function isKeyDone(userId, key) {
  if (localStorage.getItem(keyFlag(userId, key))) return true;
  return FIRST_BATCH.includes(key) && Boolean(localStorage.getItem(MIGRATION_FLAG_PREFIX + userId));
}

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
    const markDone = key => localStorage.setItem(keyFlag(user.id, key), "1");

    for (const key of NEWLY_SYNCED_KEYS) {
      if (isKeyDone(user.id, key)) continue;

      const local = readLocal(key);
      if (!local.present || isEmpty(local.value)) { result.skipped.push(key); markDone(key); continue; }

      const cloud = await readCloudValue(key);
      if (!cloud.ok) { result.failed.push(key); continue; }                          // can't tell, so don't risk it
      if (!isEmpty(cloud.value)) { result.skipped.push(key); markDone(key); continue; } // never overwrite real cloud data

      const ok = await setData(key, local.value);
      if (ok) { result.uploaded.push(key); markDone(key); } else result.failed.push(key);
    }

    result.done = result.failed.length === 0;
  } catch {
    // Best-effort: never block the app. No flag, so the next load retries.
  }
  return result;
}
