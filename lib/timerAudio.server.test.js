// @vitest-environment node
import { describe, it, expect } from "vitest";
import { getAudioContext, unlockAudio, playSoundNow, scheduleCompletionSound, ensureCompletionSound, cancelCompletionSound } from "./timerAudio";

describe("timer audio on the server", () => {
  it("does nothing and never throws without a window", () => {
    expect(typeof window).toBe("undefined");
    expect(getAudioContext()).toBeNull();
    expect(unlockAudio()).toBeNull();
    expect(playSoundNow("ding", 0.5)).toBeNull();
    expect(scheduleCompletionSound(Date.now() + 1000, "ding", 0.5)).toBe(false);
    expect(ensureCompletionSound("ding", 0.5)).toBe(false);
    expect(() => cancelCompletionSound()).not.toThrow();
  });
});
