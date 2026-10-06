import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// Cache the current user so we're not calling getUser() on every single
// get/set — refreshed on auth state change.
let cachedUser = null;
supabase.auth.onAuthStateChange((_event, session) => {
  cachedUser = session?.user || null;
});

async function getCurrentUser() {
  if (cachedUser) return cachedUser;
  const { data } = await supabase.auth.getUser();
  cachedUser = data.user || null;
  return cachedUser;
}

// The user_data columns that actually exist in the live schema. Each
// synced key is used as a column name, so a key with no column made every
// read and write return 400 (42703 "column does not exist" / PGRST204).
// Keys not listed here stay local-only and never hit the network; add a
// key here in the same change as the migration that creates its column.
//   journal, mocktests, loaf_slices and subject_colors gained columns in
//   October 2026, and timer_sound after them (NEWLY_SYNCED_KEYS below; the
//   login migration in lib/migrateSyncedKeys.js uploads existing local data
//   for each of them once).
//   companion-name lives in profiles.companion_name (see lib/companion.js).
export const NEWLY_SYNCED_KEYS = ["journal", "mocktests", "loaf_slices", "subject_colors", "timer_sound"];

export const CLOUD_COLUMNS = new Set([
  "timetable", "todos", "goals", "mood_log", "ddays", "tracker", "revisions",
  "coins", "shop_ownership", "streak", "quiz_daily_streak", "games_progress",
  ...NEWLY_SYNCED_KEYS,
]);

export function isCloudSynced(key) {
  return CLOUD_COLUMNS.has(key);
}

// One console warning per key per page load, so a broken sync is visible
// without flooding the console on every save.
const warnedKeys = new Set();
function warnSyncFailure(key, error) {
  if (warnedKeys.has(key)) return;
  warnedKeys.add(key);
  console.warn(`Cloud sync for "${key}" failed; the local copy is kept.`, error?.message ?? error);
}

// ---- Unsynced-write tracking (for a safe sign-out) ----
// Cloud writes are fire-and-forget, so sign-out needs to know two things:
// which writes are still in flight, and which keys' last cloud write
// failed (so the cloud is behind this browser). In-flight writes are kept
// in memory; failed keys (and failed profile fields) are persisted with
// the user's id, so a failure from an earlier page load still counts.
const UNSYNCED_STORE = "chintu-unsynced";
const inFlight = new Set();

function track(promise) {
  inFlight.add(promise);
  promise.finally(() => inFlight.delete(promise));
  return promise;
}

function readUnsynced(userId) {
  try {
    const u = JSON.parse(localStorage.getItem(UNSYNCED_STORE));
    if (u && u.userId === userId) return { userId, keys: u.keys ?? [], profile: u.profile ?? {} };
  } catch {}
  return { userId, keys: [], profile: {} };
}

function writeUnsynced(u) {
  try {
    if (u.keys.length === 0 && Object.keys(u.profile).length === 0) localStorage.removeItem(UNSYNCED_STORE);
    else localStorage.setItem(UNSYNCED_STORE, JSON.stringify(u));
  } catch {}
}

function markKey(userId, key, synced) {
  const u = readUnsynced(userId);
  const keys = new Set(u.keys);
  if (synced) keys.delete(key); else keys.add(key);
  writeUnsynced({ ...u, keys: [...keys] });
}

function markProfile(userId, fields, synced) {
  const u = readUnsynced(userId);
  const profile = { ...u.profile };
  for (const [k, v] of Object.entries(fields)) {
    if (synced) delete profile[k]; else profile[k] = v;
  }
  writeUnsynced({ ...u, profile });
}

// ---- Local (unchanged behavior when logged out) ----
function localGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function localSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Raw cloud read, with no local fallback — returns null for "no session",
// "no row yet", or "column is empty", indistinguishably. getData() uses
// this and then falls back to local, which hides the "was it actually
// empty in the cloud?" answer from ordinary callers. The guest-data claim
// (lib/claimGuestData.js) needs that distinction: it must never overwrite
// real cloud data with a stale local copy, so it has to know cloud was
// genuinely empty rather than just trusting getData()'s merged result.
export async function getCloudValue(key) {
  if (!isCloudSynced(key)) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from("user_data")
      .select(key)
      .eq("user_id", user.id)
      .single();

    // PGRST116 is "no row yet" for a new account, which is expected.
    if (error && error.code !== "PGRST116") warnSyncFailure(key, error);
    if (error || !data || data[key] == null) return null;
    return data[key];
  } catch (err) {
    warnSyncFailure(key, err);
    return null;
  }
}

// Like getCloudValue, but distinguishes "the cloud is empty" from "the read
// failed": { ok: true, value } for a successful read (value null when the
// column or row is empty), { ok: false } for an error. Anything that writes
// local data up "only if the cloud is empty" must use this, or a network
// blip would look like an empty cloud and get overwritten.
export async function readCloudValue(key) {
  if (!isCloudSynced(key)) return { ok: false };
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  try {
    const { data, error } = await supabase
      .from("user_data")
      .select(key)
      .eq("user_id", user.id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return { ok: true, value: null }; // no row yet
      warnSyncFailure(key, error);
      return { ok: false };
    }
    return { ok: true, value: data?.[key] ?? null };
  } catch (err) {
    warnSyncFailure(key, err);
    return { ok: false };
  }
}

// ---- Public API ----
// Mirrors the shape components already use, but async now since Supabase
// calls are network requests. Falls back to localStorage when logged out,
// so nothing breaks for people who haven't made an account.
export async function getData(key, fallback) {
  const user = await getCurrentUser();
  if (!user) return localGet(key, fallback);

  const cloudValue = await getCloudValue(key);
  return cloudValue == null ? localGet(key, fallback) : cloudValue;
}

// Resolves to true when the cloud write succeeded, false when it failed,
// and null when no cloud write was attempted (logged out, or a local-only
// key). Existing callers ignore the result; the login migration and
// sign-out flush use it.
export async function setData(key, value) {
  // Always write to localStorage too — acts as an offline cache and means
  // nothing breaks if the network request fails.
  localSet(key, value);

  if (!isCloudSynced(key)) return null;

  // Tracked from the moment it's called (before the user lookup), so a
  // sign-out flush started right after still waits for it. A failed cloud
  // write never throws and never touches the local copy written above, so
  // callers keep working offline or mid-outage. It is recorded as unsynced
  // so sign-out can retry it.
  return track((async () => {
    const user = await getCurrentUser();
    if (!user) return null;
    try {
      const { error } = await supabase
        .from("user_data")
        .upsert({ user_id: user.id, [key]: value, updated_at: new Date().toISOString() });
      if (error) {
        warnSyncFailure(key, error);
        markKey(user.id, key, false);
        return false;
      }
      markKey(user.id, key, true);
      return true;
    } catch (err) {
      warnSyncFailure(key, err);
      markKey(user.id, key, false);
      return false;
    }
  })());
}

export async function getProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
}

// Resolves true/false for success/failure, null when logged out. A failed
// write records its fields as unsynced so sign-out can retry them.
export async function setProfile(fields) {
  return track((async () => {
    const user = await getCurrentUser();
    if (!user) return null;
    try {
      const { error } = await supabase.from("profiles").upsert({ id: user.id, ...fields });
      if (error) {
        warnSyncFailure("profiles", error);
        markProfile(user.id, fields, false);
        return false;
      }
      markProfile(user.id, fields, true);
      return true;
    } catch (err) {
      warnSyncFailure("profiles", err);
      markProfile(user.id, fields, false);
      return false;
    }
  })());
}

// Makes sure the cloud has everything this browser wrote: waits for every
// in-flight write, then retries each key (and profile field) whose last
// cloud write failed, using the current local value. It deliberately does
// not re-upload keys that synced fine, since that could overwrite newer
// data written from another device. Resolves { ok, failed }; ok is true
// only if nothing is left unsynced. Sign-out clears local data only then.
export async function flushPendingWrites() {
  await Promise.allSettled([...inFlight]);
  const user = await getCurrentUser();
  if (!user) return { ok: true, failed: [] };

  const { keys, profile } = readUnsynced(user.id);
  const failed = [];
  for (const key of keys) {
    const raw = (() => { try { return localStorage.getItem(key); } catch { return null; } })();
    if (raw == null) { markKey(user.id, key, true); continue; } // nothing local to send
    const ok = await setData(key, localGet(key, null));
    if (!ok) failed.push(key);
  }
  if (Object.keys(profile).length > 0) {
    const ok = await setProfile(profile);
    if (!ok) failed.push("profile");
  }
  return { ok: failed.length === 0, failed };
}

export { getCurrentUser };