// lib/timerAudio.js
//
// One shared AudioContext for the timer (completion sounds and the focus
// noise), plus scheduling of the completion sound.
//
// Browsers only let an AudioContext start after a user gesture, so
// unlockAudio() is called from the Start/Resume click. Once running, the
// context keeps its own clock even when the tab is in the background,
// where setInterval is throttled (to once a minute in Chrome after a
// while). So the completion sound is scheduled ahead of time on the audio
// clock for the moment the session ends; it rings on time even if the
// timer's interval only notices the end a minute later. Pause, reset or a
// mode switch cancel the pending sound, and resuming schedules a new one.
//
// When the context was suspended instead (iOS Safari suspends audio in
// background tabs; a restored session after reload has no gesture yet),
// the scheduled time hasn't been reached on the audio clock, so
// ensureCompletionSound() cancels it and plays immediately once the page
// can, which is as soon as the tab regains control.
//
// Everything here is a no-op on the server or where Web Audio is missing.
import { scheduleSound } from "@/lib/timerSounds";

let ctx = null;

export function getAudioContext({ create = true } = {}) {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  if (!create) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    ctx = null;
  }
  return ctx;
}

// Call from a user gesture (click, key press). Safe to call repeatedly.
export function unlockAudio() {
  const c = getAudioContext();
  if (c && c.state === "suspended") {
    try { c.resume(); } catch {}
  }
  return c;
}

// Plays a sound right away, e.g. the settings Preview button.
export function playSoundNow(soundId, volume) {
  const c = unlockAudio();
  if (!c) return null;
  try {
    return scheduleSound(c, soundId, { volume });
  } catch {
    return null;
  }
}

// The one pending completion sound, if any.
let pending = null;

// Schedules the completion sound for epoch time `endAtMs`, replacing any
// earlier one. Returns false when audio isn't available.
export function scheduleCompletionSound(endAtMs, soundId, volume) {
  cancelCompletionSound();
  const c = getAudioContext({ create: false }) ?? unlockAudio();
  if (!c) return false;
  try {
    const when = c.currentTime + Math.max(0, (endAtMs - Date.now()) / 1000);
    pending = { handle: scheduleSound(c, soundId, { when, volume }), soundId, volume };
    return true;
  } catch {
    pending = null;
    return false;
  }
}

// Cancels the pending completion sound unless it is already ringing.
export function cancelCompletionSound() {
  if (pending) {
    try { pending.handle.cancel(); } catch {}
    pending = null;
  }
}

// Called when the timer completes a session. If the scheduled sound has
// started, or is about to, on a running audio clock, nothing more is
// needed. Otherwise (context was suspended, or nothing was scheduled) it
// plays now.
export function ensureCompletionSound(soundId, volume) {
  const c = getAudioContext({ create: false });
  const p = pending;
  pending = null;
  if (!c) return false;
  // The timer rounds its countdown, so it can report the end up to half a
  // second early. A running context whose scheduled sound starts within
  // the next second will ring on time by itself; leave it.
  if (p && c.state === "running" && p.handle.startTime <= c.currentTime + 1) return true;
  if (p) { try { p.handle.cancel(); } catch {} }
  if (c.state === "suspended") { try { c.resume(); } catch {} }
  try {
    scheduleSound(c, soundId, { volume });
    return true;
  } catch {
    return false;
  }
}

// For tests only.
export function _resetAudioForTests() {
  ctx = null;
  pending = null;
}
