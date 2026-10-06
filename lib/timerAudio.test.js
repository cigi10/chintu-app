import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getAudioContext, unlockAudio, playSoundNow, scheduleCompletionSound,
  cancelCompletionSound, ensureCompletionSound, _resetAudioForTests,
} from "./timerAudio";
import { FakeAudioContext } from "./test-utils/fakeAudioContext";

let made;
beforeEach(() => {
  _resetAudioForTests();
  made = [];
  window.AudioContext = class extends FakeAudioContext { constructor() { super(); made.push(this); } };
});
afterEach(() => { delete window.AudioContext; delete window.webkitAudioContext; });

describe("timer audio without Web Audio", () => {
  it("no-ops safely when AudioContext is unavailable", () => {
    delete window.AudioContext;
    expect(getAudioContext()).toBeNull();
    expect(unlockAudio()).toBeNull();
    expect(playSoundNow("ding", 0.5)).toBeNull();
    expect(scheduleCompletionSound(Date.now() + 1000, "ding", 0.5)).toBe(false);
    expect(() => cancelCompletionSound()).not.toThrow();
    expect(ensureCompletionSound("ding", 0.5)).toBe(false);
  });

  it("no-ops safely when constructing the context throws", () => {
    window.AudioContext = class { constructor() { throw new Error("blocked"); } };
    expect(getAudioContext()).toBeNull();
    expect(playSoundNow("ding", 0.5)).toBeNull();
  });
});

describe("timer audio", () => {
  it("creates one shared context and resumes it on a gesture", () => {
    const a = unlockAudio();
    const b = unlockAudio();
    expect(a).toBe(b);
    expect(made).toHaveLength(1);
    expect(a.state).toBe("running");
  });

  it("schedules the completion sound ahead on the audio clock", () => {
    const ctx = unlockAudio();
    ctx.currentTime = 100;
    expect(scheduleCompletionSound(Date.now() + 60_000, "bell", 0.5)).toBe(true);
    const starts = ctx.oscillators.map(o => o.startAt);
    expect(Math.min(...starts)).toBeGreaterThanOrEqual(159.9);
    expect(Math.min(...starts)).toBeLessThanOrEqual(160.1);
  });

  it("pause cancels a pending sound that hasn't started", () => {
    const ctx = unlockAudio();
    scheduleCompletionSound(Date.now() + 30_000, "ding", 0.5);
    cancelCompletionSound();
    expect(ctx.oscillators.every(o => o.stopCalls === 2)).toBe(true);
  });

  it("doesn't play twice when the scheduled sound already rang (background tab)", () => {
    const ctx = unlockAudio();
    scheduleCompletionSound(Date.now() + 1000, "ding", 0.5);
    const count = ctx.oscillators.length;
    ctx.currentTime = 70; // the throttled interval noticed the end a minute late
    expect(ensureCompletionSound("ding", 0.5)).toBe(true);
    expect(ctx.oscillators).toHaveLength(count);
  });

  it("leaves a scheduled sound alone when the timer reports the end slightly early", () => {
    const ctx = unlockAudio();
    ctx.currentTime = 10;
    scheduleCompletionSound(Date.now() + 5000, "ding", 0.5);   // rings at audio time ~15
    const count = ctx.oscillators.length;
    ctx.currentTime = 14.6; // countdown rounded to 0 with 0.4 s still to go
    expect(ensureCompletionSound("ding", 0.5)).toBe(true);
    expect(ctx.oscillators).toHaveLength(count);
    expect(ctx.oscillators.every(o => o.stopCalls === 1)).toBe(true); // not cancelled
  });

  it("plays immediately when the context was suspended and the sound never rang", () => {
    const ctx = unlockAudio();
    scheduleCompletionSound(Date.now() + 5000, "ding", 0.5);
    const count = ctx.oscillators.length;
    ctx.state = "suspended"; // e.g. iOS Safari in a background tab; audio clock frozen
    expect(ensureCompletionSound("ding", 0.5)).toBe(true);
    expect(ctx.resumeCalls).toBeGreaterThanOrEqual(2);
    expect(ctx.oscillators.length).toBeGreaterThan(count);
  });
});
