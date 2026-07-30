import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import { getLocalJournal, hydrateJournal, saveJournal } from "@/lib/journal";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalJournal", () => {
  it("defaults to an empty object", () => {
    expect(getLocalJournal()).toEqual({});
  });

  it("falls back to the legacy chintu-journal key", () => {
    localStorage.setItem("chintu-journal", JSON.stringify({ "2026-01-01": { text: "hi", mood: "good" } }));
    expect(getLocalJournal()).toEqual({ "2026-01-01": { text: "hi", mood: "good" } });
  });

  it("prefers the new journal key over the legacy one", () => {
    localStorage.setItem("chintu-journal", JSON.stringify({ "2020-01-01": { text: "old" } }));
    localStorage.setItem("journal", JSON.stringify({ "2026-01-01": { text: "new" } }));
    expect(getLocalJournal()).toEqual({ "2026-01-01": { text: "new" } });
  });
});

describe("saveJournal", () => {
  it("writes through lib/storage's setData", async () => {
    const entries = { "2026-01-01": { text: "hi", mood: "good" } };
    await saveJournal(entries);
    expect(setData).toHaveBeenCalledWith("journal", entries);
  });
});

describe("hydrateJournal", () => {
  it("writes the resolved cloud entries into the local journal key", async () => {
    getData.mockResolvedValueOnce({ "2026-02-01": { text: "cloud", mood: null } });
    const result = await hydrateJournal();
    expect(result).toEqual({ "2026-02-01": { text: "cloud", mood: null } });
    expect(getLocalJournal()).toEqual({ "2026-02-01": { text: "cloud", mood: null } });
  });
});
