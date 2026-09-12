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
  getImportedPacks,
  saveExamPackAndSubjects,
  appendSessionLogEntry,
  saveBonusLog,
  getAllTags,
  addCustomTag,
  setTopicTags,
  importPackTopics,
} from "@/lib/tracker";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalTracker defaults", () => {
  it("defaults to an empty tracker when nothing is stored", () => {
    expect(getLocalTracker()).toEqual({
      examPack: null, subjects: {}, sessionLog: [], bonusLog: {}, importedPacks: [], customTags: [],
    });
  });
});

describe("legacy key fallback", () => {
  it("builds the blob from the four separate legacy keys when the new key is absent", () => {
    localStorage.setItem("chintu-exam-pack", "JEE");
    localStorage.setItem("chintu-subjects", JSON.stringify({ Physics: [{ name: "Kinematics", status: "done" }] }));
    localStorage.setItem("chintu-session-log", JSON.stringify([{ date: "2026-01-01", durationMinutes: 30 }]));
    localStorage.setItem("chintu-bonus-log", JSON.stringify({ daily: "2026-01-01" }));

    expect(getExamPack()).toBe("JEE");
    // A pre-tags topic migrates to a tag matching the pack it was under.
    expect(getSubjects()).toEqual({ Physics: [{ name: "Kinematics", status: "done", tags: ["JEE"] }] });
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

describe("tag migration for existing single-pack users", () => {
  it("defaults importedPacks to [examPack] and tags every existing topic with it", () => {
    saveExamPackAndSubjects("NEET", {
      Physics: [{ id: "p1", name: "Kinematics", status: "done", subtopics: [] }],
    });
    expect(getImportedPacks()).toEqual(["NEET"]);
    expect(getSubjects().Physics[0].tags).toEqual(["NEET"]);
  });

  it("leaves an existing tags array alone rather than overwriting it", () => {
    localStorage.setItem("tracker", JSON.stringify({
      examPack: "NEET",
      subjects: { Physics: [{ id: "p1", name: "Kinematics", status: "done", subtopics: [], tags: ["Custom"] }] },
      sessionLog: [], bonusLog: {}, importedPacks: ["NEET"], customTags: [],
    }));
    expect(getSubjects().Physics[0].tags).toEqual(["Custom"]);
  });

  it("defaults to no tags at all when there was never an active exam pack", () => {
    localStorage.setItem("tracker", JSON.stringify({
      examPack: null,
      subjects: { Custom: [{ id: "c1", name: "My topic", status: "not-started", subtopics: [] }] },
      sessionLog: [], bonusLog: {},
    }));
    expect(getSubjects().Custom[0].tags).toEqual([]);
    expect(getImportedPacks()).toEqual([]);
  });
});

describe("getAllTags / addCustomTag", () => {
  it("collects tags from customTags, importedPacks, examPack, and topics", () => {
    saveExamPackAndSubjects("NEET", {
      Physics: [{ id: "p1", name: "Kinematics", status: "done", subtopics: [], tags: ["NEET", "Revision"] }],
    });
    addCustomTag("Personal");
    expect(getAllTags()).toEqual(["NEET", "Personal", "Revision"]);
  });

  it("does not add a duplicate tag, case-insensitively", () => {
    addCustomTag("Placements");
    addCustomTag("placements");
    expect(getAllTags().filter(t => t.toLowerCase() === "placements")).toHaveLength(1);
  });

  it("ignores a blank tag name", () => {
    addCustomTag("   ");
    expect(getAllTags()).toEqual([]);
  });
});

describe("setTopicTags", () => {
  it("replaces a topic's tags and dedupes the new list", () => {
    saveExamPackAndSubjects("NEET", {
      Physics: [{ id: "p1", name: "Kinematics", status: "done", subtopics: [], tags: ["NEET"] }],
    });
    setTopicTags("Physics", "p1", ["NEET", "NEET", "Revision", ""]);
    expect(getSubjects().Physics[0].tags).toEqual(["NEET", "Revision"]);
  });

  it("does not touch other topics in the same subject", () => {
    saveExamPackAndSubjects("NEET", {
      Physics: [
        { id: "p1", name: "Kinematics", status: "done", subtopics: [], tags: ["NEET"] },
        { id: "p2", name: "Optics", status: "not-started", subtopics: [], tags: ["NEET"] },
      ],
    });
    setTopicTags("Physics", "p1", ["Revision"]);
    expect(getSubjects().Physics[1].tags).toEqual(["NEET"]);
  });
});

describe("importPackTopics", () => {
  it("merges a new pack's subjects into the existing tracker rather than replacing it", () => {
    saveExamPackAndSubjects("JEE", {
      Physics: [{ id: "p1", name: "Kinematics", status: "done", subtopics: [], tags: ["JEE"] }],
    });
    importPackTopics("NEET");

    const subjects = getSubjects();
    expect(getImportedPacks()).toEqual(["JEE", "NEET"]);
    // "Kinematics" exists in both JEE and NEET Physics — same normalized
    // name, so it's tagged with both packs instead of duplicated.
    const kinematics = subjects.Physics.find(t => t.name === "Kinematics");
    expect(kinematics.tags.sort()).toEqual(["JEE", "NEET"]);
    expect(subjects.Physics.filter(t => t.name === "Kinematics")).toHaveLength(1);
    // A NEET-only topic (Biology) gets added as new, tagged with NEET.
    expect(subjects.Biology.some(t => t.name === "Cell Structure" && t.tags.includes("NEET"))).toBe(true);
  });

  it("does not duplicate an already-imported pack in importedPacks", () => {
    saveExamPackAndSubjects("JEE", { Physics: [] });
    importPackTopics("NEET");
    importPackTopics("NEET");
    expect(getImportedPacks()).toEqual(["JEE", "NEET"]);
  });

  it("preserves an existing topic's progress status when a later pack shares it", () => {
    saveExamPackAndSubjects("JEE", {
      Physics: [{ id: "p1", name: "Kinematics", status: "done", subtopics: [], tags: ["JEE"] }],
    });
    importPackTopics("NEET");
    const kinematics = getSubjects().Physics.find(t => t.name === "Kinematics");
    expect(kinematics.status).toBe("done");
    expect(kinematics.id).toBe("p1");
  });

  it("is a no-op for an unknown pack name", () => {
    saveExamPackAndSubjects("JEE", { Physics: [] });
    const before = getSubjects();
    importPackTopics("Not A Real Pack");
    expect(getSubjects()).toEqual(before);
    expect(getImportedPacks()).toEqual(["JEE"]);
  });
});
