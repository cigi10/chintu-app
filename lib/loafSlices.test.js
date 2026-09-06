import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }),
}));

import { getData, setData } from "@/lib/storage";
import {
  getWeekStart,
  getCurrentWeekSlices,
  getLoafHistory,
  bakeSliceForToday,
  hydrateLoafSlices,
  LOAF_KEY,
  LOAF_DAYS,
} from "@/lib/loafSlices";
import { getLocalCoins } from "@/lib/coins";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("getWeekStart", () => {
  it("returns the same date when given a Monday", () => {
    expect(getWeekStart(new Date("2026-09-07T12:00:00"))).toBe("2026-09-07");
  });

  it("rolls a Sunday back to the preceding Monday", () => {
    expect(getWeekStart(new Date("2026-09-13T12:00:00"))).toBe("2026-09-07");
  });

  it("rolls a mid-week date back to that week's Monday", () => {
    expect(getWeekStart(new Date("2026-09-10T12:00:00"))).toBe("2026-09-07");
  });
});

describe("getCurrentWeekSlices", () => {
  it("defaults every slice to unbaked when nothing is stored", () => {
    const { days } = getCurrentWeekSlices();
    LOAF_DAYS.forEach(day => expect(days[day]).toBe(false));
  });
});

describe("bakeSliceForToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T10:00:00")); // a Wednesday
  });

  it("bakes today's slice and leaves other days unbaked", () => {
    bakeSliceForToday();
    const { days } = getCurrentWeekSlices();
    expect(days.Wed).toBe(true);
    LOAF_DAYS.filter(d => d !== "Wed").forEach(day => expect(days[day]).toBe(false));
  });

  it("awards coins for a newly baked slice", () => {
    bakeSliceForToday();
    expect(getLocalCoins()).toBeGreaterThan(0);
  });

  it("is idempotent: a second bake the same day doesn't double-award coins", () => {
    bakeSliceForToday();
    const coinsAfterFirst = getLocalCoins();
    const result = bakeSliceForToday();
    expect(result).toBe(false);
    expect(getLocalCoins()).toBe(coinsAfterFirst);
  });

  it("returns true only when the slice was newly baked", () => {
    expect(bakeSliceForToday()).toBe(true);
    expect(bakeSliceForToday()).toBe(false);
  });

  it("persists through lib/storage's setData", () => {
    bakeSliceForToday();
    expect(setData).toHaveBeenCalledWith(
      LOAF_KEY,
      expect.objectContaining({ weeks: expect.objectContaining({ "2026-09-07": expect.objectContaining({ Wed: true }) }) })
    );
  });
});

describe("getLoafHistory", () => {
  it("excludes the current week and sorts past weeks oldest first", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T10:00:00")); // current week starts 2026-09-07
    bakeSliceForToday();

    localStorage.setItem(LOAF_KEY, JSON.stringify({
      weeks: {
        "2026-09-07": { Mon: false, Tue: false, Wed: true, Thu: false, Fri: false, Sat: false, Sun: false },
        "2026-08-24": { Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
        "2026-08-31": { Mon: false, Tue: true, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
      },
    }));

    const history = getLoafHistory();
    expect(history.map(w => w.weekStart)).toEqual(["2026-08-24", "2026-08-31"]);
  });

  it("is empty when only the current week has any data", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T10:00:00"));
    bakeSliceForToday();
    expect(getLoafHistory()).toEqual([]);
  });
});

describe("hydrateLoafSlices", () => {
  it("merges baked slices from cloud and local without un-baking either", async () => {
    localStorage.setItem(LOAF_KEY, JSON.stringify({
      weeks: { "2026-09-07": { Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
    }));
    getData.mockResolvedValueOnce({
      weeks: { "2026-09-07": { Mon: false, Tue: true, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
    });

    await hydrateLoafSlices();

    const merged = JSON.parse(localStorage.getItem(LOAF_KEY));
    expect(merged.weeks["2026-09-07"].Mon).toBe(true);
    expect(merged.weeks["2026-09-07"].Tue).toBe(true);
  });

  it("falls back to local data if the cloud read fails", async () => {
    localStorage.setItem(LOAF_KEY, JSON.stringify({
      weeks: { "2026-09-07": { Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
    }));
    getData.mockRejectedValueOnce(new Error("network error"));

    await hydrateLoafSlices();

    const result = JSON.parse(localStorage.getItem(LOAF_KEY));
    expect(result.weeks["2026-09-07"].Mon).toBe(true);
  });
});
