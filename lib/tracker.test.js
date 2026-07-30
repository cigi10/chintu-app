import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import {
  getLocalTracker,
  hydrateTracker,
  getExamPack,
  getSubjects,
  getSessionLog,
  getBonusLog,
  saveExamPackAndSubjects,
  appendSessionLogEntry,
  saveBonusLog,
} from "@/lib/tracker";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalTracker defaults", () => {
  it("defaults to an empty tracker when nothing is stored", () => {
    expect(getLocalTracker()).toEqual({ examPack: null, subjects: {}, sessionLog: [], bonusLog: {} });
  });
});

describe("legacy key fallback", () => {
  it("builds the blob from the four separate legacy keys when the new key is absent", () => {
    localStorage.setItem("chintu-exam-pack", "JEE");
    localStorage.setItem("chintu-subjects", JSON.stringify({ Physics: [{ name: "Kinematics", status: "done" }] }));
    localStorage.setItem("chintu-session-log", JSON.stringify([{ date: "2026-01-01", durationMinutes: 30 }]));
    localStorage.setItem("chintu-bonus-log", JSON.stringify({ daily: "2026-01-01" }));

    expect(getExamPack()).toBe("JEE");
    expect(getSubjects()).toEqual({ Physics: [{ name: "Kinematics", status: "done" }] });
    expect(getSessionLog()).toEqual([{ date: "2026-01-01", durationMinutes: 30 }]);
    expect(getBonusLog()).toEqual({ daily: "2026-01-01" });
  });

  it("prefers the new tracker key over the legacy ones once it exists", () => {
    localStorage.setItem("chintu-exam-pack", "OLD");
    localStorage.setItem("tracker", JSON.stringify({ examPack: "NEW", subjects: {}, sessionLog: [], bonusLog: {} }));
    expect(getExamPack()).toBe("NEW");
  });
});

describe("saveExamPackAndSubjects", () => {
  it("updates examPack and subjects without dropping existing sessionLog/bonusLog", () => {
    appendSessionLogEntry({ date: "2026-01-01", durationMinutes: 20 });
    saveExamPackAndSubjects("NEET", { Biology: [] });

    const tracker = getLocalTracker();
    expect(tracker.examPack).toBe("NEET");
    expect(tracker.subjects).toEqual({ Biology: [] });
    expect(tracker.sessionLog).toEqual([{ date: "2026-01-01", durationMinutes: 20 }]);
  });
});

describe("appendSessionLogEntry", () => {
  it("appends without dropping examPack/subjects already set", () => {
    saveExamPackAndSubjects("JEE", { Physics: [] });
    appendSessionLogEntry({ date: "2026-01-01", durationMinutes: 10 });
    appendSessionLogEntry({ date: "2026-01-02", durationMinutes: 15 });

    const tracker = getLocalTracker();
    expect(tracker.examPack).toBe("JEE");
    expect(tracker.sessionLog.length).toBe(2);
  });

  it("syncs to the cloud on every append", () => {
    appendSessionLogEntry({ date: "2026-01-01", durationMinutes: 10 });
    expect(setData).toHaveBeenCalledWith(
      "tracker",
      expect.objectContaining({ sessionLog: [{ date: "2026-01-01", durationMinutes: 10 }] })
    );
  });
});

describe("saveBonusLog", () => {
  it("updates bonusLog without dropping sessionLog", () => {
    appendSessionLogEntry({ date: "2026-01-01", durationMinutes: 10 });
    saveBonusLog({ daily: "2026-01-01", weekly: "2026-01-01" });

    const tracker = getLocalTracker();
    expect(tracker.bonusLog).toEqual({ daily: "2026-01-01", weekly: "2026-01-01" });
    expect(tracker.sessionLog.length).toBe(1);
  });
});

describe("hydrateTracker", () => {
  it("writes the resolved cloud tracker into the local tracker key", async () => {
    getData.mockResolvedValueOnce({
      examPack: "GRE/GMAT", subjects: {}, sessionLog: [], bonusLog: {},
    });
    const result = await hydrateTracker();
    expect(result.examPack).toBe("GRE/GMAT");
    expect(getExamPack()).toBe("GRE/GMAT");
  });
});
