import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@next/third-parties/google", () => ({ sendGAEvent: vi.fn() }));
const { sendGAEvent } = await import("@next/third-parties/google");
const { trackEvent, trackTimerStart, trackTimerComplete, trackTrackerUse, trackSignUp, trackSoundChange, trackEmailSignup, trackFeedbackSubmit, trackQuizComplete, trackCoinSpend, trackPlusInterest } = await import("./analytics");

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

  it("sends email_signup with only the source page, never an address", () => {
    trackEmailSignup("/blog/gate-normalization-explained");
    trackEmailSignup("someone@example.com");
    trackEmailSignup(undefined);
    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(sendGAEvent).toHaveBeenCalledWith("event", "email_signup", { source_page: "/blog/gate-normalization-explained" });
  });

  it("sends feedback_submit with the screen and whether an email was left, and nothing else", () => {
    trackFeedbackSubmit("/timer", "me@example.com");
    trackFeedbackSubmit("/gate", false);
    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(sendGAEvent).toHaveBeenCalledWith("event", "feedback_submit", { page: "/timer", has_email: true });
  });

  it("sends quiz_complete with mode, category slug and counts, dropping anything unexpected", () => {
    trackQuizComplete("practice", "jee-physics", 7, 10);
    trackQuizComplete("exam", "jee-physics", 1, 1);
    trackQuizComplete("daily", "Someone@Example.com", 1, 1);
    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(sendGAEvent).toHaveBeenCalledWith("event", "quiz_complete", { quiz_mode: "practice", category: "jee-physics", score: 7, total: 10 });
  });

  it("sends coin spends as the GA4 spend_virtual_currency event", () => {
    trackCoinSpend("accessory", "glasses", 75);
    trackCoinSpend("sound", "sound_bell", 100);
    trackCoinSpend("hat", "glasses", 75);
    trackCoinSpend("accessory", "me@example.com", 75);
    expect(sendGAEvent).toHaveBeenCalledTimes(2);
    expect(sendGAEvent).toHaveBeenCalledWith("event", "spend_virtual_currency", { virtual_currency_name: "coins", value: 75, item_name: "glasses", item_type: "accessory" });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "spend_virtual_currency", { virtual_currency_name: "coins", value: 100, item_name: "sound_bell", item_type: "sound" });
  });

  it("sends plus_interest with only a known step and source", () => {
    trackPlusInterest("open", "shop");
    trackPlusInterest("buy", "shop");
    trackPlusInterest("view", "someone@example.com");
    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(sendGAEvent).toHaveBeenCalledWith("event", "plus_interest", { step: "open", source: "shop" });
  });
});
