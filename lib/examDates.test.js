import { describe, it, expect } from "vitest";
import { EXAM_DATES, nthWeekdayOfMonth, getCountdownTarget, formatExamDate } from "@/lib/examDates";

describe("nthWeekdayOfMonth", () => {
  it("matches past NEET dates (first Sunday of May)", () => {
    expect(nthWeekdayOfMonth(2023, 5, 0, 1)).toBe("2023-05-07");
    expect(nthWeekdayOfMonth(2024, 5, 0, 1)).toBe("2024-05-05");
    expect(nthWeekdayOfMonth(2025, 5, 0, 1)).toBe("2025-05-04");
    expect(nthWeekdayOfMonth(2026, 5, 0, 1)).toBe("2026-05-03");
  });

  it("matches past JEE Advanced dates (third Sunday of May)", () => {
    expect(nthWeekdayOfMonth(2025, 5, 0, 3)).toBe("2025-05-18");
    expect(nthWeekdayOfMonth(2026, 5, 0, 3)).toBe("2026-05-17");
  });
});

describe("getCountdownTarget", () => {
  it("uses the official date with no estimate label once one is set", () => {
    const exam = { date: "2026-12-06", time: "14:00", estimate: { date: "2026-12-01", basis: "x" } };
    expect(getCountdownTarget(exam)).toEqual({
      date: "2026-12-06",
      target: "2026-12-06T14:00:00+05:30",
      isEstimate: false,
      basis: null,
    });
  });

  it("falls back to the estimate, flagged, while there's no official date", () => {
    const exam = { date: null, time: "09:00", estimate: { date: "2027-05-16", basis: "pattern" } };
    expect(getCountdownTarget(exam)).toMatchObject({ date: "2027-05-16", isEstimate: true, basis: "pattern" });
  });

  it("returns null when there's neither", () => {
    expect(getCountdownTarget({ date: null })).toBeNull();
  });

  it("gives every listed exam a countdown, and every estimate a basis", () => {
    for (const exam of EXAM_DATES) {
      const countdown = getCountdownTarget(exam);
      expect(countdown, exam.slug).not.toBeNull();
      expect(Number.isNaN(new Date(countdown.target).getTime()), exam.slug).toBe(false);
      if (countdown.isEstimate) expect(countdown.basis, exam.slug).toBeTruthy();
    }
  });
});

describe("formatExamDate", () => {
  it("formats in IST", () => {
    expect(formatExamDate("2026-12-06")).toBe("Sunday, 6 December 2026");
  });
});

describe("exam descriptions", () => {
  it("gives every exam a complete about block for the server-rendered page", () => {
    for (const exam of EXAM_DATES) {
      const a = exam.about;
      expect(a, exam.slug).toBeTruthy();
      expect(a.summary.length, exam.slug).toBeGreaterThan(40);
      expect(a.who.length, exam.slug).toBeGreaterThan(0);
      expect(a.format.length, exam.slug).toBeGreaterThan(0);
      expect(a.leadsTo.length, exam.slug).toBeGreaterThan(40);
      expect(a.source.length, exam.slug).toBeGreaterThan(10);
      expect(JSON.stringify(a), exam.slug).not.toMatch(/[–—]/);
    }
  });
});
