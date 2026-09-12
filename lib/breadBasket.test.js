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
  getCurrentBasket,
  getBasketHistory,
  addBunForToday,
  hydrateBreadBasket,
  BASKET_KEY,
  BASKET_DAYS,
} from "@/lib/breadBasket";
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

describe("getCurrentBasket", () => {
  it("starts with no buns when nothing is stored", () => {
    const { days } = getCurrentBasket();
    BASKET_DAYS.forEach(day => expect(days[day]).toBe(false));
  });
});

describe("addBunForToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T10:00:00")); // a Wednesday
  });

  it("adds today's bun and leaves other days without one", () => {
    addBunForToday();
    const { days } = getCurrentBasket();
    expect(days.Wed).toBe(true);
    BASKET_DAYS.filter(d => d !== "Wed").forEach(day => expect(days[day]).toBe(false));
  });

  it("awards coins for a newly added bun", () => {
    addBunForToday();
    expect(getLocalCoins()).toBeGreaterThan(0);
  });

  it("is idempotent: a second session the same day doesn't add a second bun or double-award coins", () => {
    addBunForToday();
    const coinsAfterFirst = getLocalCoins();
    const result = addBunForToday();
    expect(result).toBe(false);
    expect(getLocalCoins()).toBe(coinsAfterFirst);
  });

  it("returns true only when a bun was newly added", () => {
    expect(addBunForToday()).toBe(true);
    expect(addBunForToday()).toBe(false);
  });

  it("persists through lib/storage's setData", () => {
    addBunForToday();
    expect(setData).toHaveBeenCalledWith(
      BASKET_KEY,
      expect.objectContaining({ weeks: expect.objectContaining({ "2026-09-07": expect.objectContaining({ Wed: true }) }) })
    );
  });
});

describe("getBasketHistory", () => {
  it("excludes the current week and sorts past weeks oldest first", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T10:00:00")); // current week starts 2026-09-07
    addBunForToday();

    localStorage.setItem(BASKET_KEY, JSON.stringify({
      weeks: {
        "2026-09-07": { Mon: false, Tue: false, Wed: true, Thu: false, Fri: false, Sat: false, Sun: false },
        "2026-08-24": { Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
        "2026-08-31": { Mon: false, Tue: true, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
      },
    }));

    const history = getBasketHistory();
    expect(history.map(w => w.weekStart)).toEqual(["2026-08-24", "2026-08-31"]);
  });

  it("is empty when only the current week has any data", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T10:00:00"));
    addBunForToday();
    expect(getBasketHistory()).toEqual([]);
  });
});

describe("hydrateBreadBasket", () => {
  it("merges buns from cloud and local without ever un-counting either", async () => {
    localStorage.setItem(BASKET_KEY, JSON.stringify({
      weeks: { "2026-09-07": { Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
    }));
    getData.mockResolvedValueOnce({
      weeks: { "2026-09-07": { Mon: false, Tue: true, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
    });

    await hydrateBreadBasket();

    const merged = JSON.parse(localStorage.getItem(BASKET_KEY));
    expect(merged.weeks["2026-09-07"].Mon).toBe(true);
    expect(merged.weeks["2026-09-07"].Tue).toBe(true);
  });

  it("falls back to local data if the cloud read fails", async () => {
    localStorage.setItem(BASKET_KEY, JSON.stringify({
      weeks: { "2026-09-07": { Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
    }));
    getData.mockRejectedValueOnce(new Error("network error"));

    await hydrateBreadBasket();

    const result = JSON.parse(localStorage.getItem(BASKET_KEY));
    expect(result.weeks["2026-09-07"].Mon).toBe(true);
  });
});
