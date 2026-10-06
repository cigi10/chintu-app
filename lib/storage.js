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

// The user_data columns that actually exist in the live schema (checked
// against PostgREST's schema on 2026-10-06). Each synced key is used as a
// column name, so a key with no column made every read and write return
// 400 (42703 "column does not exist" / PGRST204). Keys not listed here
// stay local-only and never hit the network until a column is added for
// them; add the key here in the same change as the migration.
//   Local-only today: journal, mocktests, loaf_slices, subject_colors.
//   companion-name lives in profiles.companion_name (see lib/companion.js).
export const CLOUD_COLUMNS = new Set([
  "timetable", "todos", "goals", "mood_log", "ddays", "tracker", "revisions",
  "coins", "shop_ownership", "streak", "quiz_daily_streak", "games_progress",
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

export async function setData(key, value) {
  // Always write to localStorage too — acts as an offline cache and means
  // nothing breaks if the network request fails.
  localSet(key, value);

  if (!isCloudSynced(key)) return;
  const user = await getCurrentUser();
  if (!user) return;

  // A failed cloud write never throws and never touches the local copy
  // written above, so callers keep working offline or mid-outage.
  try {
    const { error } = await supabase
      .from("user_data")
      .upsert({ user_id: user.id, [key]: value, updated_at: new Date().toISOString() });
    if (error) warnSyncFailure(key, error);
  } catch (err) {
    warnSyncFailure(key, err);
  }
}

export async function getProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
}

export async function setProfile(fields) {
  const user = await getCurrentUser();
  if (!user) return;
  try {
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...fields });
    if (error) warnSyncFailure("profiles", error);
  } catch (err) {
    warnSyncFailure("profiles", err);
  }
}

export { getCurrentUser };