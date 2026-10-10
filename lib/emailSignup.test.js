import { describe, it, expect } from "vitest";
import { isValidEmail, normalizeEmail, resolveSignupSource } from "./emailSignup";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Someone@Example.COM ")).toBe("someone@example.com");
  });

  it("returns an empty string for non-strings", () => {
    expect(normalizeEmail(undefined)).toBe("");
    expect(normalizeEmail({ email: "a@b.co" })).toBe("");
  });
});

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    for (const email of ["a@b.co", "first.last+gate@college.ac.in", "x_y@mail.example.org"]) {
      expect(isValidEmail(email)).toBe(true);
    }
  });

  it("rejects malformed addresses", () => {
    for (const email of ["", "plain", "a@b", "a@@b.co", "a b@c.co", "a@b..co", "a..b@c.co", "@b.co", "a@.co", "a@b.co."]) {
      expect(isValidEmail(email)).toBe(false);
    }
  });

  it("rejects addresses over 254 characters", () => {
    expect(isValidEmail(`${"a".repeat(250)}@b.co`)).toBe(false);
  });
});

describe("resolveSignupSource", () => {
  const isGatePost = slug => slug === "gate-normalization-explained";

  it("accepts the homepage with no exam interest", () => {
    expect(resolveSignupSource("/", isGatePost)).toEqual({ sourcePage: "/", examInterest: null });
  });

  it("accepts /gate and GATE posts as gate interest", () => {
    expect(resolveSignupSource("/gate", isGatePost)).toEqual({ sourcePage: "/gate", examInterest: "gate" });
    expect(resolveSignupSource("/blog/gate-normalization-explained", isGatePost))
      .toEqual({ sourcePage: "/blog/gate-normalization-explained", examInterest: "gate" });
  });

  it("rejects posts that aren't GATE posts, app screens and junk", () => {
    for (const page of ["/blog/some-neet-post", "/timer", "/dashboard", "https://evil.example", "/blog/../timer", null, 42]) {
      expect(resolveSignupSource(page, isGatePost)).toBeNull();
    }
  });
});
