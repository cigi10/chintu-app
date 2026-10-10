// @vitest-environment node
import { describe, it, expect } from "vitest";
import { createUnsubscribeToken, unsubscribeSecret, unsubscribeUrl, verifyUnsubscribeToken } from "./unsubscribeToken";

const ID = "3f2b8c1e-9a4d-4c6b-8e2f-1a2b3c4d5e6f";
const SECRET = "test-secret";

describe("unsubscribe tokens", () => {
  it("round-trips a row id", () => {
    const token = createUnsubscribeToken(ID, SECRET);
    expect(verifyUnsubscribeToken(token, SECRET)).toBe(ID);
  });

  it("never contains an email address", () => {
    expect(createUnsubscribeToken(ID, SECRET)).not.toContain("@");
  });

  it("rejects a token signed with another secret", () => {
    expect(verifyUnsubscribeToken(createUnsubscribeToken(ID, "other"), SECRET)).toBeNull();
  });

  it("rejects a valid signature moved onto a different id", () => {
    const signature = createUnsubscribeToken(ID, SECRET).split(".")[1];
    const otherId = "00000000-0000-4000-8000-000000000000";
    expect(verifyUnsubscribeToken(`${otherId}.${signature}`, SECRET)).toBeNull();
  });

  it("rejects malformed input and a missing secret", () => {
    const token = createUnsubscribeToken(ID, SECRET);
    for (const bad of ["", "abc", `${ID}.`, `${ID}.x.y`, `${token}x`, "student@example.com", null, undefined, 42, "a".repeat(500)]) {
      expect(verifyUnsubscribeToken(bad, SECRET)).toBeNull();
    }
    expect(verifyUnsubscribeToken(token, null)).toBeNull();
  });

  it("refuses to sign without a real id or a secret", () => {
    expect(() => createUnsubscribeToken("student@example.com", SECRET)).toThrow();
    expect(() => createUnsubscribeToken(ID, null)).toThrow();
  });

  it("builds the email link", () => {
    const url = unsubscribeUrl("https://www.studyloaf.com", ID, SECRET);
    expect(url.startsWith("https://www.studyloaf.com/unsubscribe?token=")).toBe(true);
    const token = decodeURIComponent(new URL(url).searchParams.get("token"));
    expect(verifyUnsubscribeToken(token, SECRET)).toBe(ID);
  });
});

describe("unsubscribeSecret", () => {
  it("prefers UNSUBSCRIBE_TOKEN_SECRET", () => {
    expect(unsubscribeSecret({ UNSUBSCRIBE_TOKEN_SECRET: "s", SUPABASE_SERVICE_ROLE_KEY: "k" })).toBe("s");
  });

  it("otherwise derives a stable secret from the service-role key that isn't the key itself", () => {
    const a = unsubscribeSecret({ SUPABASE_SERVICE_ROLE_KEY: "k" });
    expect(a).toBe(unsubscribeSecret({ SUPABASE_SERVICE_ROLE_KEY: "k" }));
    expect(a).not.toBe("k");
    expect(a).not.toBe(unsubscribeSecret({ SUPABASE_SERVICE_ROLE_KEY: "k2" }));
  });

  it("is null when nothing is configured", () => {
    expect(unsubscribeSecret({})).toBeNull();
  });
});
