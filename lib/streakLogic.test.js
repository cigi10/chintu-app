import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import {
  recordStudySession,
  getStreakInfo,
  clearCheckIn,
  hydrateStreak,
} from "@/lib/streakLogic";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("getStreakInfo", () => {
  it("starts at 0 with nothing recorded", () => {
    expect(getStreakInfo().streakCount).toBe(0);
  });

  it("counts a session recorded today as a 1-day streak", () => {
    recordStudySession();
    expect(getStreakInfo().streakCount).toBe(1);
  });

  it("does not double-count a second session on the same day", () => {
    recordStudySession();
    recordStudySession();
    expect(getStreakInfo().streakCount).toBe(1);
  });

  it("extends the streak across consecutive days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    recordStudySession();
    vi.setSystemTime(new Date("2026-01-02T12:00:00Z"));
    recordStudySession();
    vi.setSystemTime(new Date("2026-01-03T12:00:00Z"));
    expect(recordStudySession().streakCount).toBe(3);
  });

  it("resets to 0 after a missed day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    recordStudySession();
    // Skip 2026-01-02 entirely, then check on 2026-01-03 without studying.
    vi.setSystemTime(new Date("2026-01-03T12:00:00Z"));
    expect(getStreakInfo().streakCount).toBe(0);
  });

  it("reads existing progress from the legacy chintu-streak key when the new key is empty", () => {
    localStorage.setItem(
      "chintu-streak",
      JSON.stringify({ studyDates: ["2020-01-01"], resetLog: [] })
    );
    // A large gap proves lastDate came from the legacy data, not an empty default.
    expect(getStreakInfo().daysSinceLastStudy).toBeGreaterThan(1000);
  });

  it("prefers the new streak key over the legacy one when both exist", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-05T12:00:00Z"));
    localStorage.setItem(
      "chintu-streak",
      JSON.stringify({ studyDates: ["2020-01-01"], resetLog: [] })
    );
    localStorage.setItem(
      "streak",
      JSON.stringify({ studyDates: ["2026-01-05"], resetLog: [] })
    );
    expect(getStreakInfo().streakCount).toBe(1);
  });
});

describe("load() default object identity", () => {
  it("does not leak mutations from one empty-state call into the next", () => {
    // Regression test: load() must not return the same shared default
    // object on every empty-storage call, since callers mutate the
    // result in place (data.studyDates.push(...)) — a shared reference
    // would silently carry an old date over into a later, unrelated
    // "fresh storage" call.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2020-06-15T12:00:00Z"));
    recordStudySession(); // first "session" with nothing stored

    localStorage.clear(); // simulate a totally fresh user/session
    vi.setSystemTime(new Date("2026-07-30T12:00:00Z"));
    recordStudySession(); // second "session" with nothing stored, different day

    const raw = JSON.parse(localStorage.getItem("streak"));
    expect(raw.studyDates).toEqual(["2026-07-30"]);
  });
});

describe("clearCheckIn", () => {
  it("empties the reset log without touching study dates", () => {
    recordStudySession();
    clearCheckIn();
    const raw = JSON.parse(localStorage.getItem("streak"));
    expect(raw.resetLog).toEqual([]);
    expect(raw.studyDates.length).toBe(1);
  });
});

describe("recordStudySession / save", () => {
  it("fires a cloud sync write for every save", () => {
    recordStudySession();
    expect(setData).toHaveBeenCalledWith(
      "streak",
      expect.objectContaining({ studyDates: expect.any(Array) })
    );
  });
});

describe("hydrateStreak", () => {
  it("writes the resolved cloud value into the local streak key", async () => {
    getData.mockResolvedValueOnce({ studyDates: ["2026-01-01"], resetLog: [] });
    await hydrateStreak();
    expect(JSON.parse(localStorage.getItem("streak"))).toEqual({
      studyDates: ["2026-01-01"],
      resetLog: [],
    });
  });
});
