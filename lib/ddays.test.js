import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import { getLocalDdays, hydrateDdays, saveDdays } from "@/lib/ddays";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalDdays", () => {
  it("defaults to an empty list", () => {
    expect(getLocalDdays()).toEqual([]);
  });

  // Regression coverage: Onboarding.jsx used to write ddays only to Supabase
  // under the "ddays" column while every reader (Dashboard, Weekly Digest)
  // read the "chintu-ddays" localStorage key — so cloud writes never showed
  // up anywhere. This locks in that both keys resolve consistently now.
  it("falls back to the legacy chintu-ddays key", () => {
    localStorage.setItem("chintu-ddays", JSON.stringify([{ label: "JEE Exam", date: "2026-05-01" }]));
    expect(getLocalDdays()).toEqual([{ label: "JEE Exam", date: "2026-05-01" }]);
  });

  it("prefers the new ddays key over the legacy one", () => {
    localStorage.setItem("chintu-ddays", JSON.stringify([{ label: "old" }]));
    localStorage.setItem("ddays", JSON.stringify([{ label: "new" }]));
    expect(getLocalDdays()).toEqual([{ label: "new" }]);
  });
});

describe("saveDdays", () => {
  it("writes through lib/storage's setData", async () => {
    const ddays = [{ label: "JEE Exam", date: "2026-05-01" }];
    await saveDdays(ddays);
    expect(setData).toHaveBeenCalledWith("ddays", ddays);
  });
});

describe("hydrateDdays", () => {
  it("writes the resolved cloud list into the local ddays key, closing the write-only gap", async () => {
    getData.mockResolvedValueOnce([{ label: "NEET Exam", date: "2026-06-01" }]);
    const result = await hydrateDdays();
    expect(result).toEqual([{ label: "NEET Exam", date: "2026-06-01" }]);
    expect(getLocalDdays()).toEqual([{ label: "NEET Exam", date: "2026-06-01" }]);
  });
});
