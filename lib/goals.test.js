import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import { loadGoals, saveGoals, deleteGoal, getDoneMap, setGoalDone, hydrateGoals } from "@/lib/goals";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("loadGoals / saveGoals", () => {
  it("defaults to an empty list", () => {
    expect(loadGoals()).toEqual([]);
  });

  it("round-trips through saveGoals", () => {
    saveGoals([{ id: "g1", subject: "Physics" }]);
    expect(loadGoals()).toEqual([{ id: "g1", subject: "Physics" }]);
  });

  it("falls back to the legacy chintu-goals key for definitions", () => {
    localStorage.setItem("chintu-goals", JSON.stringify([{ id: "g1", subject: "Legacy" }]));
    expect(loadGoals()).toEqual([{ id: "g1", subject: "Legacy" }]);
  });

  it("syncs the whole state blob to the cloud on save", () => {
    saveGoals([{ id: "g1" }]);
    expect(setData).toHaveBeenCalledWith(
      "goals",
      expect.objectContaining({ definitions: [{ id: "g1" }] })
    );
  });
});

describe("deleteGoal", () => {
  it("removes just the matching goal", () => {
    saveGoals([{ id: "g1" }, { id: "g2" }]);
    deleteGoal("g1");
    expect(loadGoals()).toEqual([{ id: "g2" }]);
  });
});

describe("getDoneMap / setGoalDone", () => {
  it("defaults to an empty map for a date with nothing recorded", () => {
    expect(getDoneMap("2026-01-01")).toEqual({});
  });

  it("round-trips through setGoalDone without disturbing other dates", () => {
    setGoalDone("g1", "2026-01-01", true);
    setGoalDone("g2", "2026-01-02", true);
    expect(getDoneMap("2026-01-01")).toEqual({ g1: true });
    expect(getDoneMap("2026-01-02")).toEqual({ g2: true });
  });

  it("falls back to the legacy per-day chintu-goal-done-<date> key", () => {
    localStorage.setItem("chintu-goal-done-2020-06-01", JSON.stringify({ g1: true }));
    expect(getDoneMap("2020-06-01")).toEqual({ g1: true });
  });

  it("preserves goal definitions when only done-state changes", () => {
    saveGoals([{ id: "g1", subject: "Physics" }]);
    setGoalDone("g1", "2026-01-01", true);
    expect(loadGoals()).toEqual([{ id: "g1", subject: "Physics" }]);
  });
});

describe("hydrateGoals", () => {
  it("writes the resolved cloud state (definitions + done history) into the local goals key", async () => {
    getData.mockResolvedValueOnce({
      definitions: [{ id: "g1" }],
      doneByDate: { "2026-01-01": { g1: true } },
    });
    await hydrateGoals();
    expect(loadGoals()).toEqual([{ id: "g1" }]);
    expect(getDoneMap("2026-01-01")).toEqual({ g1: true });
  });
});
