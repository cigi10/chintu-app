// lib/soundSettings.js
//
// Saving the timer sound settings. Kept apart from lib/timerSounds.js so
// the synthesis code doesn't pull in the storage and Supabase client.
import { setData, readCloudValue } from "@/lib/storage";
import { trackSoundChange } from "@/lib/analytics";
import { SOUND_SETTINGS_KEY, SOUND_SETTINGS_EVENT, loadSoundSettings, sanitizeSoundSettings } from "@/lib/timerSounds";

// Saves settings locally and to user_data.timer_sound, tells the running
// timer to reschedule, and fires sound_change only when the chosen sound
// actually changed.
export function saveSoundSettings(next) {
  const before = loadSoundSettings();
  const clean = sanitizeSoundSettings(next);
  setData(SOUND_SETTINGS_KEY, clean);
  try { window.dispatchEvent(new Event(SOUND_SETTINGS_EVENT)); } catch {}
  if (clean.soundId !== before.soundId) trackSoundChange(clean.soundId);
  return clean;
}

// Brings this device in line with settings saved on another device. Uses
// the strict read: a non-empty cloud value replaces the local one; an empty
// cloud or a failed read leaves local settings untouched (the login
// migration uploads local settings to an empty cloud). Returns the settings
// now in effect, and notifies the timer if they changed.
export async function hydrateSoundSettings() {
  const local = loadSoundSettings();
  const cloud = await readCloudValue(SOUND_SETTINGS_KEY);
  if (!cloud.ok || cloud.value == null || typeof cloud.value !== "object" || Object.keys(cloud.value).length === 0) {
    return local;
  }
  const next = sanitizeSoundSettings(cloud.value);
  if (JSON.stringify(next) !== JSON.stringify(local)) {
    try { localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(next)); } catch {}
    try { window.dispatchEvent(new Event(SOUND_SETTINGS_EVENT)); } catch {}
  }
  return next;
}
