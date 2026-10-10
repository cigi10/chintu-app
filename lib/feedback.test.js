import { describe, it, expect } from "vitest";
import { validateFeedback } from "./feedback";

describe("validateFeedback", () => {
  it("accepts text with no email as anonymous", () => {
    expect(validateFeedback({ message: "  A dark mode timer  ", email: "", page: "/timer" }))
      .toEqual({ ok: true, row: { message: "A dark mode timer", email: null, page: "/timer" } });
  });

  it("normalizes an optional email", () => {
    expect(validateFeedback({ message: "hi", email: " Me@Example.com ", page: "/tracker" }).row.email).toBe("me@example.com");
  });

  it("rejects empty text, text over 500 characters, a bad email and other pages", () => {
    expect(validateFeedback({ message: "   ", page: "/timer" }).ok).toBe(false);
    expect(validateFeedback({ message: "x".repeat(501), page: "/timer" }).ok).toBe(false);
    expect(validateFeedback({ message: "x".repeat(500), page: "/timer" }).ok).toBe(true);
    expect(validateFeedback({ message: "hi", email: "nope", page: "/timer" }).ok).toBe(false);
    for (const page of ["/", "/gate", "/shop", undefined]) {
      expect(validateFeedback({ message: "hi", page }).ok).toBe(false);
    }
  });

  it("rejects non-string text", () => {
    expect(validateFeedback({ message: { text: "hi" }, page: "/timer" }).ok).toBe(false);
  });
});
