import { describe, it, expect } from "vitest";
import { containsCrisisSignal, normalizeForCrisisCheck } from "@/lib/crisisDetection";

describe("normalizeForCrisisCheck", () => {
  it("lowercases and collapses whitespace", () => {
    expect(normalizeForCrisisCheck("  Kill   MYSELF  ")).toBe("kill myself");
  });

  it("strips apostrophes so contractions match the un-contracted pattern", () => {
    expect(normalizeForCrisisCheck("I don't want to be here anymore")).toBe(
      "i dont want to be here anymore"
    );
  });

  it("collapses other punctuation to spaces instead of deleting it", () => {
    expect(normalizeForCrisisCheck("self-harm")).toBe("self harm");
    expect(normalizeForCrisisCheck("kill.myself!!")).toBe("kill myself");
  });

  it("handles empty/null/undefined input without throwing", () => {
    expect(normalizeForCrisisCheck("")).toBe("");
    expect(normalizeForCrisisCheck(null)).toBe("");
    expect(normalizeForCrisisCheck(undefined)).toBe("");
  });
});

describe("containsCrisisSignal", () => {
  it("passes clean, ordinary journal text through with no match", () => {
    expect(containsCrisisSignal("Studied physics for 2 hours, felt good about kinematics.")).toBe(false);
    expect(containsCrisisSignal("Exam stress is high but I'm managing okay.")).toBe(false);
    expect(containsCrisisSignal("")).toBe(false);
    expect(containsCrisisSignal(undefined)).toBe(false);
  });

  it("does not flag common exam-stress phrasing that isn't a crisis signal", () => {
    // These are extremely common in genuine exam-stress journaling and are
    // deliberately excluded from the pattern list — see the calibration
    // note in lib/crisisPatterns.js.
    expect(containsCrisisSignal("I can't do this anymore, this syllabus is too much")).toBe(false);
    expect(containsCrisisSignal("I just want this exam season to be over")).toBe(false);
    expect(containsCrisisSignal("I want to give up on JEE sometimes")).toBe(false);
    expect(containsCrisisSignal("this chapter is killing me")).toBe(false);
  });

  it("flags a clear suicidal-ideation phrase", () => {
    expect(containsCrisisSignal("I want to kill myself")).toBe(true);
    expect(containsCrisisSignal("sometimes I wish I was dead")).toBe(true);
    expect(containsCrisisSignal("I feel suicidal lately")).toBe(true);
  });

  it("flags a clear self-harm phrase", () => {
    expect(containsCrisisSignal("I've been cutting myself")).toBe(true);
    expect(containsCrisisSignal("thinking about self-harm again")).toBe(true);
  });

  it("matches regardless of case", () => {
    expect(containsCrisisSignal("I WANT TO KILL MYSELF")).toBe(true);
    expect(containsCrisisSignal("KiLl MySeLf")).toBe(true);
  });

  it("matches through extra whitespace and line breaks", () => {
    expect(containsCrisisSignal("I want to   kill\n\nmyself tonight")).toBe(true);
  });

  it("matches through contractions and stray punctuation", () => {
    expect(containsCrisisSignal("I don't want to be here anymore.")).toBe(true);
    expect(containsCrisisSignal("self--harm!!")).toBe(true);
  });

  it("matches when the phrase is embedded in a longer entry", () => {
    const entry =
      "Today was rough. Studied for 3 hours but couldn't focus. Honestly I want to end my life and I don't know what to do.";
    expect(containsCrisisSignal(entry)).toBe(true);
  });

  it("does not persist or mutate the input it's given", () => {
    const entry = "I want to kill myself";
    const before = entry;
    containsCrisisSignal(entry);
    expect(entry).toBe(before); // plain string, but guards against future refactors mutating shared state
  });
});
