import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initInternalTraffic, internalTrafficScript, isInternalVisitor, INTERNAL_KEY } from "./internalTraffic";

vi.mock("@next/third-parties/google", () => ({ sendGAEvent: vi.fn() }));

// A stand-in window with its own URL and storage, so each case starts clean.
function fakeWindow(search, stored = {}) {
  const store = { ...stored };
  return {
    URLSearchParams,
    location: { search },
    localStorage: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: k => { delete store[k]; },
    },
    store,
  };
}

const commands = win => (win.dataLayer ?? []).map(entry => Array.from(entry));

describe("initInternalTraffic", () => {
  it("?internal=1 sets the flag and queues traffic_type before GA config", () => {
    const win = fakeWindow("?internal=1");
    initInternalTraffic(win);
    expect(win.store[INTERNAL_KEY]).toBe("1");
    expect(commands(win)).toEqual([["set", { traffic_type: "internal" }]]);
    // gtag ignores plain arrays, so the entry must be an Arguments object.
    expect(Object.prototype.toString.call(win.dataLayer[0])).toBe("[object Arguments]");
  });

  it("keeps marking later visits without the param", () => {
    const win = fakeWindow("", { [INTERNAL_KEY]: "1" });
    initInternalTraffic(win);
    expect(commands(win)).toEqual([["set", { traffic_type: "internal" }]]);
  });

  it("?internal=0 clears the flag and marks nothing", () => {
    const win = fakeWindow("?internal=0", { [INTERNAL_KEY]: "1" });
    initInternalTraffic(win);
    expect(win.store[INTERNAL_KEY]).toBeUndefined();
    expect(win.dataLayer).toBeUndefined();
  });

  it("does nothing for an ordinary visitor", () => {
    const win = fakeWindow("?utm_source=x");
    initInternalTraffic(win);
    expect(win.store).toEqual({});
    expect(win.dataLayer).toBeUndefined();
  });

  it("never throws when storage is blocked", () => {
    const win = fakeWindow("?internal=1");
    win.localStorage.setItem = () => { throw new Error("blocked"); };
    expect(() => initInternalTraffic(win)).not.toThrow();
  });

  it("works as the serialized inline script that actually ships", () => {
    const win = fakeWindow("?internal=1");
    new Function("window", internalTrafficScript)(win);
    expect(commands(win)).toEqual([["set", { traffic_type: "internal" }]]);
  });
});

describe("custom events from an internal visitor", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST");
    localStorage.clear();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("carry traffic_type only while the flag is set", async () => {
    const { sendGAEvent } = await import("@next/third-parties/google");
    const { trackSignUp } = await import("./analytics");
    trackSignUp("email");
    localStorage.setItem(INTERNAL_KEY, "1");
    expect(isInternalVisitor()).toBe(true);
    trackSignUp("email");
    expect(sendGAEvent.mock.calls).toEqual([
      ["event", "sign_up", { method: "email" }],
      ["event", "sign_up", { method: "email", traffic_type: "internal" }],
    ]);
  });
});
