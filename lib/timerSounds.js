// lib/timerSounds.js
//
// Timer completion sounds: the catalogue, who may use which, the saved
// settings, and the synthesis itself. Every sound is built from Web Audio
// oscillators and gain envelopes at play time, so there are no audio
// files to download or license. Each lasts under 2 seconds.
//
// Default Ding is free. The others are unlocked in the coin shop and
// recorded in shop_ownership.owned as "sound_<id>", the same list
// cosmetic items use (lib/shopOwnership.js), so purchases sync and merge
// the same way.

export const SOUNDS = [
  { id: "ding",      name: "Default Ding" },
  { id: "chime",     name: "Soft Chime" },
  { id: "bell",      name: "Bell" },
  { id: "marimba",   name: "Marimba" },
  { id: "woodblock", name: "Wood Block" },
];

export const DEFAULT_SOUND_ID = "ding";
export const FREE_SOUND_IDS = ["ding"];

// Coin prices for the locked sounds. Empty until the prices are approved:
// a sound with no price can be previewed but not bought.
export const SOUND_PRICES = {};

export const shopIdForSound = id => `sound_${id}`;

export function soundById(id) {
  return SOUNDS.find(s => s.id === id);
}

export function isSoundOwned(id, owned = []) {
  if (!soundById(id)) return false;
  return FREE_SOUND_IDS.includes(id) || (Array.isArray(owned) && owned.includes(shopIdForSound(id)));
}

export function isSoundForSale(id) {
  return !FREE_SOUND_IDS.includes(id) && Number.isFinite(SOUND_PRICES[id]);
}

// The sound that should actually play: the selected one if it exists and
// is owned, otherwise the free default.
export function resolveSoundId(selectedId, owned) {
  return isSoundOwned(selectedId, owned) ? selectedId : DEFAULT_SOUND_ID;
}

// ---- Settings ----
// { soundId, volume (0..1), muted }. Stored with lib/storage's setData under
// "timer_sound". user_data has no timer_sound column yet, so it stays
// local-only (storage never sends keys without a column) until one exists.
export const SOUND_SETTINGS_KEY = "timer_sound";
export const SOUND_SETTINGS_EVENT = "timer-sound-change";
export const DEFAULT_SOUND_SETTINGS = { soundId: DEFAULT_SOUND_ID, volume: 0.6, muted: false };

export function sanitizeSoundSettings(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  const volume = Number(s.volume);
  return {
    soundId: soundById(s.soundId) ? s.soundId : DEFAULT_SOUND_ID,
    volume: Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : DEFAULT_SOUND_SETTINGS.volume,
    muted: Boolean(s.muted),
  };
}

export function loadSoundSettings() {
  try {
    return sanitizeSoundSettings(JSON.parse(localStorage.getItem(SOUND_SETTINGS_KEY)));
  } catch {
    return { ...DEFAULT_SOUND_SETTINGS };
  }
}

// ---- Synthesis ----
// Each recipe schedules its notes on `ctx` starting at `start` (audio-clock
// seconds) into `out`, and returns the time its last note is silent.
// `tone` adds one enveloped oscillator: a fast attack to `peak`, then an
// exponential decay to silence over `decay` seconds.
function tone(ctx, out, { freq, type = "sine", start, peak, decay, attack = 0.005, endFreq }) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + decay);
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(peak, start + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
  osc.connect(env);
  env.connect(out);
  const end = start + attack + decay + 0.02;
  osc.start(start);
  osc.stop(end);
  return { node: osc, end };
}

const RECIPES = {
  // A clear sine "ding" with a quieter octave above.
  ding: (ctx, out, t) => [
    tone(ctx, out, { freq: 880, start: t, peak: 0.5, decay: 1.2 }),
    tone(ctx, out, { freq: 1760, start: t, peak: 0.12, decay: 0.6 }),
  ],
  // Three soft sine notes of a C major chord, rolled upward.
  chime: (ctx, out, t) => [
    tone(ctx, out, { freq: 1046.5, start: t, peak: 0.3, decay: 1.3, attack: 0.02 }),
    tone(ctx, out, { freq: 1318.5, start: t + 0.09, peak: 0.25, decay: 1.25, attack: 0.02 }),
    tone(ctx, out, { freq: 1568.0, start: t + 0.18, peak: 0.22, decay: 1.2, attack: 0.02 }),
  ],
  // Inharmonic partials, as a struck bell has, decaying at different rates.
  bell: (ctx, out, t) =>
    [[1, 0.4, 1.7], [2.0, 0.2, 1.3], [2.76, 0.15, 1.0], [5.4, 0.08, 0.6], [8.93, 0.04, 0.35]].map(
      ([ratio, peak, decay]) => tone(ctx, out, { freq: 523.25 * ratio, start: t, peak, decay, attack: 0.002 })
    ),
  // Two short mallet notes: a fundamental plus a fast-fading 4th partial.
  marimba: (ctx, out, t) => [
    tone(ctx, out, { freq: 659.25, start: t, peak: 0.45, decay: 0.55 }),
    tone(ctx, out, { freq: 2637.0, start: t, peak: 0.1, decay: 0.08 }),
    tone(ctx, out, { freq: 880.0, start: t + 0.16, peak: 0.45, decay: 0.6 }),
    tone(ctx, out, { freq: 3520.0, start: t + 0.16, peak: 0.1, decay: 0.08 }),
  ],
  // Two dry knocks: a short triangle pulse with a quick downward pitch drop.
  woodblock: (ctx, out, t) => [
    tone(ctx, out, { freq: 1100, endFreq: 700, type: "triangle", start: t, peak: 0.6, decay: 0.09, attack: 0.001 }),
    tone(ctx, out, { freq: 1100, endFreq: 700, type: "triangle", start: t + 0.14, peak: 0.45, decay: 0.09, attack: 0.001 }),
  ],
};

// Schedules `soundId` on `ctx` at audio-clock time `when` (default: now) at
// `volume` (0..1). Returns a handle: { startTime, endTime, cancel() }.
// cancel() silences it only if it hasn't started yet, so a sound that is
// already ringing is never cut off. Unknown ids fall back to the default.
export function scheduleSound(ctx, soundId, { when, volume = DEFAULT_SOUND_SETTINGS.volume } = {}) {
  const start = Math.max(when ?? ctx.currentTime, ctx.currentTime);
  const master = ctx.createGain();
  master.gain.value = Math.min(1, Math.max(0, volume));
  master.connect(ctx.destination);
  const recipe = RECIPES[soundId] ?? RECIPES[DEFAULT_SOUND_ID];
  const tones = recipe(ctx, master, start);
  const endTime = Math.max(...tones.map(n => n.end));
  return {
    startTime: start,
    endTime,
    cancel() {
      if (ctx.currentTime >= start) return; // already playing: let it ring
      for (const { node } of tones) { try { node.stop(); } catch {} }
      try { master.disconnect(); } catch {}
    },
  };
}
