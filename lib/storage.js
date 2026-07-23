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

// ---- Public API ----
// Mirrors the shape components already use, but async now since Supabase
// calls are network requests. Falls back to localStorage when logged out,
// so nothing breaks for people who haven't made an account.
export async function getData(key, fallback) {
  const user = await getCurrentUser();
  if (!user) return localGet(key, fallback);

  const { data, error } = await supabase
    .from("user_data")
    .select(key)
    .eq("user_id", user.id)
    .single();

  if (error || !data || data[key] == null) return localGet(key, fallback);
  return data[key];
}

export async function setData(key, value) {
  // Always write to localStorage too — acts as an offline cache and means
  // nothing breaks if the network request fails.
  localSet(key, value);

  const user = await getCurrentUser();
  if (!user) return;

  await supabase
    .from("user_data")
    .upsert({ user_id: user.id, [key]: value, updated_at: new Date().toISOString() });
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
  await supabase.from("profiles").upsert({ id: user.id, ...fields });
}

export { getCurrentUser };