import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import { getSubjectColor, setSubjectColor, hydrateSubjectColors, loadSubjectColors } from "@/lib/subjectColors";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getSubjectColor / setSubjectColor", () => {
  it("returns the fallback when nothing is registered", () => {
    expect(getSubjectColor("Physics", "#fff")).toBe("#fff");
  });

  it("round-trips through setSubjectColor, normalizing case/whitespace", () => {
    setSubjectColor("  Physics ", "#123456");
    expect(getSubjectColor("physics")).toBe("#123456");
  });

  it("falls back to the legacy chintu-subject-colors key", () => {
    localStorage.setItem("chintu-subject-colors", JSON.stringify({ physics: "#abcdef" }));
    expect(getSubjectColor("Physics")).toBe("#abcdef");
  });

  it("prefers the new subject_colors key over the legacy one", () => {
    localStorage.setItem("chintu-subject-colors", JSON.stringify({ physics: "#old" }));
    localStorage.setItem("subject_colors", JSON.stringify({ physics: "#new" }));
    expect(getSubjectColor("Physics")).toBe("#new");
  });

  it("syncs to the cloud on every write", () => {
    setSubjectColor("Physics", "#123456");
    expect(setData).toHaveBeenCalledWith("subject_colors", { physics: "#123456" });
  });
});

describe("hydrateSubjectColors", () => {
  it("writes the resolved cloud map into the local subject_colors key", async () => {
    getData.mockResolvedValueOnce({ chemistry: "#00ff00" });
    const result = await hydrateSubjectColors();
    expect(result).toEqual({ chemistry: "#00ff00" });
    expect(loadSubjectColors()).toEqual({ chemistry: "#00ff00" });
  });
});
