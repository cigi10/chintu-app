import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getAchievementsContext, ACHIEVEMENTS, computeProgress } from "@/lib/achievements";
import { getWeekStart } from "@/lib/breadBasket";

beforeEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

describe("getAchievementsContext — new categories", () => {
  it("reads 0 for every new metric when nothing is logged", () => {
    const ctx = getAchievementsContext();
    expect(ctx.quizStreak).toBe(0);
    expect(ctx.fullBasketWeeks).toBe(0);
    expect(ctx.mockTestsCompleted).toBe(0);
    expect(ctx.revisionsReviewed).toBe(0);
  });

  it("computes the best current quiz streak across categories", () => {
    localStorage.setItem("quiz_daily_streak", JSON.stringify({
      ece: { playedDates: ["2026-09-14", "2026-09-15", "2026-09-16"] },
      "neet-bio": { playedDates: ["2026-09-16"] },
    }));
    vi.setSystemTime(new Date("2026-09-16T10:00:00"));
    const ctx = getAchievementsContext();
    expect(ctx.quizStreak).toBe(3);
    vi.useRealTimers();
  });

  it("counts full (7/7) bread basket weeks, current and past", () => {
    const currentWeekStart = getWeekStart(new Date());
    const fullWeek = { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: true };
    const partialWeek = { Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false };
    localStorage.setItem("loaf_slices", JSON.stringify({
      weeks: {
        [currentWeekStart]: fullWeek,
        "2026-08-03": fullWeek,
        "2026-08-10": partialWeek,
      },
    }));
    const ctx = getAchievementsContext();
    expect(ctx.fullBasketWeeks).toBe(2);
  });

  it("counts logged mock tests", () => {
    localStorage.setItem("mocktests", JSON.stringify([
      { id: 1, subject: "Physics", score: 80, scoreType: "percentile", date: "2026-09-01" },
      { id: 2, subject: "Chemistry", score: 70, scoreType: "percentile", date: "2026-09-05" },
    ]));
    const ctx = getAchievementsContext();
    expect(ctx.mockTestsCompleted).toBe(2);
  });

  it("counts mastered revisions", () => {
    localStorage.setItem("chintu-revisions-mastered", "7");
    const ctx = getAchievementsContext();
    expect(ctx.revisionsReviewed).toBe(7);
  });
});

describe("ACHIEVEMENTS — new definitions", () => {
  it("includes quiz, bread basket, mock test, and revision achievements", () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(ids).toEqual(expect.arrayContaining(["quizStreak", "fullBaskets", "mockTests", "revisionsReviewed"]));
  });

  it("computes tier progress correctly for a new achievement", () => {
    const mockTests = ACHIEVEMENTS.find(a => a.id === "mockTests");
    const progress = computeProgress(mockTests, { mockTestsCompleted: 6 });
    expect(progress.currentTier.name).toBe("Getting Serious");
    expect(progress.nextTier.name).toBe("Exam Ready");
  });
});
