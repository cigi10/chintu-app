import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@next/third-parties/google", () => ({ sendGAEvent: vi.fn() }));
const { sendGAEvent } = await import("@next/third-parties/google");
const { trackEvent, trackTimerStart, trackTimerComplete, trackTrackerUse, trackSignUp, trackSoundChange } = await import("./analytics");

describe("analytics", () => {
  beforeEach(() => vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST"));
  afterEach(() => {
    vi.unstubAllEnvs();
    sendGAEvent.mockReset();
  });

  it("does nothing when NEXT_PUBLIC_GA_ID is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    trackTimerStart("study", 1500);
    trackSignUp("google");
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it("never throws if the GA helper does", () => {
    sendGAEvent.mockImplementation(() => { throw new Error("blocked"); });
    expect(() => trackEvent("timer_start", {})).not.toThrow();
  });

  it("sends timer_start with the mode and whole minutes", () => {
    trackTimerStart("study", 25 * 60);
    expect(sendGAEvent).toHaveBeenCalledWith("event", "timer_start", { mode: "study", duration_min: 25 });
  });

  it("sends timer_complete with minutes and whether it ended early", () => {
    trackTimerComplete("custom", 610, true);
    expect(sendGAEvent).toHaveBeenCalledWith("event", "timer_complete", { mode: "custom", duration_min: 10, early: true });
  });

  it("only sends known tracker actions and sign-up methods", () => {
    trackTrackerUse("topic_status");
    trackTrackerUse("someone@example.com");
    trackSignUp("email");
    trackSignUp("someone@example.com");
    expect(sendGAEvent.mock.calls).toEqual([
      ["event", "tracker_use", { action: "topic_status" }],
      ["event", "sign_up", { method: "email" }],
    ]);
  });

  it("sends sound_change only for known sound ids", () => {
    trackSoundChange("bell");
    trackSoundChange("<script>");
    expect(sendGAEvent.mock.calls).toEqual([["event", "sound_change", { sound_id: "bell" }]]);
  });
});
