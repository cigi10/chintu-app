import { describe, it, expect } from "vitest";
import {
  SOUNDS, DEFAULT_SOUND_ID, isSoundOwned, resolveSoundId, sanitizeSoundSettings,
  shopIdForSound, scheduleSound, isSoundForSale, SOUND_PRICES, FREE_SOUND_IDS,
} from "./timerSounds";
import { FakeAudioContext } from "./test-utils/fakeAudioContext";

describe("timer sound ownership", () => {
  it("has five sounds with Default Ding free", () => {
    expect(SOUNDS.map(s => s.id)).toEqual(["ding", "chime", "bell", "marimba", "woodblock"]);
    expect(isSoundOwned("ding", [])).toBe(true);
  });

  it("gates the other four on shop ownership", () => {
    for (const id of ["chime", "bell", "marimba", "woodblock"]) {
      expect(isSoundOwned(id, []), id).toBe(false);
      expect(isSoundOwned(id, [shopIdForSound(id)]), id).toBe(true);
      expect(isSoundOwned(id, ["glasses", id]), id).toBe(false); // must be the sound_ id, not the bare id
    }
    expect(isSoundOwned("nope", ["sound_nope"])).toBe(false);
  });

  it("falls back to the default when the chosen sound isn't owned or doesn't exist", () => {
    expect(resolveSoundId("bell", [])).toBe(DEFAULT_SOUND_ID);
    expect(resolveSoundId("bell", ["sound_bell"])).toBe("bell");
    expect(resolveSoundId("made-up", ["sound_made-up"])).toBe(DEFAULT_SOUND_ID);
    expect(resolveSoundId(undefined, null)).toBe(DEFAULT_SOUND_ID);
  });

  it("never offers the free sound for sale", () => {
    expect(isSoundForSale("ding")).toBe(false);
  });

  it("prices every paid sound with a positive whole number of coins, in one place", () => {
    const paid = SOUNDS.map(s => s.id).filter(id => !FREE_SOUND_IDS.includes(id));
    expect(Object.keys(SOUND_PRICES).sort()).toEqual([...paid].sort());
    for (const id of paid) {
      expect(Number.isInteger(SOUND_PRICES[id]) && SOUND_PRICES[id] > 0, id).toBe(true);
      expect(isSoundForSale(id), id).toBe(true);
    }
    expect(SOUND_PRICES).toEqual({ chime: 60, woodblock: 60, marimba: 80, bell: 100 });
  });

  it("sanitizes saved settings", () => {
    expect(sanitizeSoundSettings(null)).toEqual({ soundId: "ding", volume: 0.6, muted: false });
    expect(sanitizeSoundSettings({ soundId: "bell", volume: 7, muted: 1 })).toEqual({ soundId: "bell", volume: 1, muted: true });
    expect(sanitizeSoundSettings({ soundId: "x", volume: "loud" })).toEqual({ soundId: "ding", volume: 0.6, muted: false });
  });
});

describe("timer sound synthesis", () => {
  for (const { id } of SOUNDS) {
    it(`"${id}" is under 2 seconds and every note starts and stops`, () => {
      const ctx = new FakeAudioContext();
      ctx.currentTime = 10;
      const h = scheduleSound(ctx, id, { when: 12, volume: 0.5 });
      expect(h.startTime).toBe(12);
      expect(h.endTime - h.startTime).toBeLessThan(2);
      expect(ctx.oscillators.length).toBeGreaterThan(0);
      for (const o of ctx.oscillators) {
        expect(o.startAt).toBeGreaterThanOrEqual(12);
        expect(o.stopAt).toBeLessThanOrEqual(h.endTime);
      }
    });
  }

  it("cancels a sound that hasn't started, but never one already ringing", () => {
    const ctx = new FakeAudioContext();
    const later = scheduleSound(ctx, "bell", { when: 5 });
    const stopsBefore = ctx.oscillators.map(o => o.stopCalls);
    later.cancel();
    expect(ctx.oscillators.map(o => o.stopCalls)).toEqual(stopsBefore.map(n => n + 1));

    const ctx2 = new FakeAudioContext();
    const now = scheduleSound(ctx2, "ding", { when: 0 });
    ctx2.currentTime = 0.3;
    now.cancel();
    expect(ctx2.oscillators.every(o => o.stopCalls === 1)).toBe(true); // only the original scheduled stop
  });

  it("never schedules in the past", () => {
    const ctx = new FakeAudioContext();
    ctx.currentTime = 4;
    expect(scheduleSound(ctx, "ding", { when: 1 }).startTime).toBe(4);
  });
});
