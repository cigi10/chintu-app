import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import { getLocalTimetable, hydrateTimetable, saveTimetable } from "@/lib/timetable";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalTimetable", () => {
  it("defaults to an empty object", () => {
    expect(getLocalTimetable()).toEqual({});
  });

  it("falls back to the legacy chintu-timetable key", () => {
    localStorage.setItem("chintu-timetable", JSON.stringify({ "Mon-09:00": { subject: "Physics" } }));
    expect(getLocalTimetable()).toEqual({ "Mon-09:00": { subject: "Physics" } });
  });

  it("prefers the new timetable key over the legacy one", () => {
    localStorage.setItem("chintu-timetable", JSON.stringify({ "Mon-09:00": { subject: "old" } }));
    localStorage.setItem("timetable", JSON.stringify({ "Tue-10:00": { subject: "new" } }));
    expect(getLocalTimetable()).toEqual({ "Tue-10:00": { subject: "new" } });
  });
});

describe("saveTimetable", () => {
  it("writes through lib/storage's setData", async () => {
    const grid = { "Mon-09:00": { subject: "Maths" } };
    await saveTimetable(grid);
    expect(setData).toHaveBeenCalledWith("timetable", grid);
  });
});

describe("hydrateTimetable", () => {
  it("writes the resolved cloud grid into the local timetable key", async () => {
    getData.mockResolvedValueOnce({ "Wed-11:00": { subject: "Chemistry" } });
    const result = await hydrateTimetable();
    expect(result).toEqual({ "Wed-11:00": { subject: "Chemistry" } });
    expect(getLocalTimetable()).toEqual({ "Wed-11:00": { subject: "Chemistry" } });
  });
});
