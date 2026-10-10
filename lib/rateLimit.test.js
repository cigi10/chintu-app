import { describe, it, expect } from "vitest";
import { clientIp, createRateLimiter } from "./rateLimit";

describe("createRateLimiter", () => {
  it("allows up to the limit inside a window, then blocks", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check("ip", 0)).toBe(true);
    expect(check("ip", 10)).toBe(true);
    expect(check("ip", 20)).toBe(false);
  });

  it("counts each key separately", () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(check("a", 0)).toBe(true);
    expect(check("b", 0)).toBe(true);
    expect(check("a", 1)).toBe(false);
  });

  it("starts a fresh window once the old one expires", () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(check("ip", 0)).toBe(true);
    expect(check("ip", 999)).toBe(false);
    expect(check("ip", 1000)).toBe(true);
  });

  it("never holds more than maxKeys entries", () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 });
    check("a", 0);
    check("b", 0);
    // The map is full of live windows, so it is cleared to make room.
    expect(check("c", 1)).toBe(true);
    expect(check("a", 2)).toBe(true);
  });
});

describe("clientIp", () => {
  it("prefers x-real-ip, then the first x-forwarded-for entry", () => {
    expect(clientIp(new Headers({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" }))).toBe("1.1.1.1");
    expect(clientIp(new Headers({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" }))).toBe("2.2.2.2");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
