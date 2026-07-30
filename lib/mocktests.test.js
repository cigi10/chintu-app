import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import { getLocalMockScores, hydrateMockScores, saveMockScores } from "@/lib/mocktests";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalMockScores", () => {
  it("defaults to an empty list", () => {
    expect(getLocalMockScores()).toEqual([]);
  });

  it("falls back to the legacy chintu-mock-scores key", () => {
    localStorage.setItem("chintu-mock-scores", JSON.stringify([{ id: 1, subject: "Physics", score: 80 }]));
    expect(getLocalMockScores()).toEqual([{ id: 1, subject: "Physics", score: 80 }]);
  });

  it("prefers the new mocktests key over the legacy one", () => {
    localStorage.setItem("chintu-mock-scores", JSON.stringify([{ id: 1, subject: "old" }]));
    localStorage.setItem("mocktests", JSON.stringify([{ id: 2, subject: "new" }]));
    expect(getLocalMockScores()).toEqual([{ id: 2, subject: "new" }]);
  });
});

describe("saveMockScores", () => {
  it("writes through lib/storage's setData", async () => {
    const scores = [{ id: 1, subject: "Physics", score: 80 }];
    await saveMockScores(scores);
    expect(setData).toHaveBeenCalledWith("mocktests", scores);
  });
});

describe("hydrateMockScores", () => {
  it("writes the resolved cloud scores into the local mocktests key", async () => {
    getData.mockResolvedValueOnce([{ id: 3, subject: "Chemistry", score: 90 }]);
    const result = await hydrateMockScores();
    expect(result).toEqual([{ id: 3, subject: "Chemistry", score: 90 }]);
    expect(getLocalMockScores()).toEqual([{ id: 3, subject: "Chemistry", score: 90 }]);
  });
});
