// lib/soundSettings.js
//
// Saving the timer sound settings. Kept apart from lib/timerSounds.js so
// the synthesis code doesn't pull in the storage and Supabase client.
import { setData } from "@/lib/storage";
import { trackSoundChange } from "@/lib/analytics";
import { SOUND_SETTINGS_KEY, SOUND_SETTINGS_EVENT, loadSoundSettings, sanitizeSoundSettings } from "@/lib/timerSounds";

// Saves settings locally (and to the cloud once user_data has a
// timer_sound column), tells the running timer to reschedule, and fires
// sound_change only when the chosen sound actually changed.
export function saveSoundSettings(next) {
  const before = loadSoundSettings();
  const clean = sanitizeSoundSettings(next);
  setData(SOUND_SETTINGS_KEY, clean);
  try { window.dispatchEvent(new Event(SOUND_SETTINGS_EVENT)); } catch {}
  if (clean.soundId !== before.soundId) trackSoundChange(clean.soundId);
  return clean;
}
