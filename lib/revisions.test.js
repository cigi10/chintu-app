import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import { getLocalRevisionSchedule, hydrateRevisionSchedule, saveRevisionSchedule } from "@/lib/revisions";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalRevisionSchedule", () => {
  it("defaults to an empty list", () => {
    expect(getLocalRevisionSchedule()).toEqual([]);
  });

  it("falls back to the legacy chintu-revisions key", () => {
    localStorage.setItem("chintu-revisions", JSON.stringify([{ subject: "Bio", topic: "Cells" }]));
    expect(getLocalRevisionSchedule()).toEqual([{ subject: "Bio", topic: "Cells" }]);
  });

  it("prefers the new revisions key over the legacy one", () => {
    localStorage.setItem("chintu-revisions", JSON.stringify([{ subject: "old" }]));
    localStorage.setItem("revisions", JSON.stringify([{ subject: "new" }]));
    expect(getLocalRevisionSchedule()).toEqual([{ subject: "new" }]);
  });
});

describe("saveRevisionSchedule", () => {
  it("writes through lib/storage's setData", async () => {
    const schedule = [{ subject: "Bio", topic: "Cells" }];
    await saveRevisionSchedule(schedule);
    expect(setData).toHaveBeenCalledWith("revisions", schedule);
  });
});

describe("hydrateRevisionSchedule", () => {
  it("writes the resolved cloud schedule into the local revisions key", async () => {
    getData.mockResolvedValueOnce([{ subject: "Chem", topic: "Bonds" }]);
    const result = await hydrateRevisionSchedule();
    expect(result).toEqual([{ subject: "Chem", topic: "Bonds" }]);
    expect(getLocalRevisionSchedule()).toEqual([{ subject: "Chem", topic: "Bonds" }]);
  });
});
