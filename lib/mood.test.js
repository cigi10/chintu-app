import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import { getLocalMoodLog, hydrateMoodLog, saveMoodLog } from "@/lib/mood";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalMoodLog", () => {
  it("defaults to an empty list", () => {
    expect(getLocalMoodLog()).toEqual([]);
  });

  it("falls back to the legacy chintu-mood-log key", () => {
    localStorage.setItem("chintu-mood-log", JSON.stringify([{ date: "2026-01-01", mood: "good" }]));
    expect(getLocalMoodLog()).toEqual([{ date: "2026-01-01", mood: "good" }]);
  });

  it("prefers the new mood_log key over the legacy one", () => {
    localStorage.setItem("chintu-mood-log", JSON.stringify([{ date: "2020-01-01", mood: "low" }]));
    localStorage.setItem("mood_log", JSON.stringify([{ date: "2026-01-01", mood: "great" }]));
    expect(getLocalMoodLog()).toEqual([{ date: "2026-01-01", mood: "great" }]);
  });
});

describe("saveMoodLog", () => {
  it("writes through lib/storage's setData", async () => {
    const entry = [{ date: "2026-01-01", mood: "good" }];
    await saveMoodLog(entry);
    expect(setData).toHaveBeenCalledWith("mood_log", entry);
  });
});

describe("hydrateMoodLog", () => {
  it("writes the resolved cloud log into the local mood_log key", async () => {
    getData.mockResolvedValueOnce([{ date: "2026-02-01", mood: "okay" }]);
    const result = await hydrateMoodLog();
    expect(result).toEqual([{ date: "2026-02-01", mood: "okay" }]);
    expect(getLocalMoodLog()).toEqual([{ date: "2026-02-01", mood: "okay" }]);
  });
});
