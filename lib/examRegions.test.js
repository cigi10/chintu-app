import { describe, it, expect } from "vitest";
import { COUNTRIES, PACK_GROUPS, groupPacksForCountry, packsForCountry } from "./examRegions";
import { PACK_NAMES } from "./examPacks";

const flat = groups => groups.flatMap(g => g.keys);

describe("PACK_GROUPS", () => {
  it("puts every pack in exactly one group", () => {
    const all = flat(PACK_GROUPS);
    expect(new Set(all).size).toBe(all.length);
    expect([...all].sort()).toEqual([...PACK_NAMES].sort());
  });

  it("collapses only College semesters by default", () => {
    expect(PACK_GROUPS.filter(g => g.collapsedByDefault).map(g => g.id)).toEqual(["college"]);
  });
});

describe("groupPacksForCountry", () => {
  it("shows, across all groups, exactly the packs each region allows today", () => {
    for (const { key } of [...COUNTRIES, { key: "" }]) {
      const allowed = packsForCountry(key, PACK_NAMES).filter(k => k !== "Custom");
      const shown = flat(groupPacksForCountry(key, PACK_NAMES));
      expect(new Set(shown).size, key).toBe(shown.length);
      expect([...shown].sort(), key).toEqual([...allowed].sort());
    }
  });

  it("hides empty groups", () => {
    for (const { key } of COUNTRIES) {
      for (const g of groupPacksForCountry(key, PACK_NAMES)) expect(g.keys.length, `${key}: ${g.id}`).toBeGreaterThan(0);
    }
    expect(groupPacksForCountry("United Kingdom", PACK_NAMES).map(g => g.id)).toEqual(["entrance", "other"]);
  });

  it("groups India's packs with JEE and NEET first and the PES semesters collapsed", () => {
    const groups = groupPacksForCountry("India", PACK_NAMES);
    expect(groups.map(g => g.id)).toEqual(["entrance", "gate", "other", "college"]);
    expect(groups[0].keys.slice(0, 2)).toEqual(["JEE", "NEET"]);
    expect(groups[0].keys).toContain("GRE/GMAT");
    const college = groups.find(g => g.id === "college");
    expect(college.collapsedByDefault).toBe(true);
    expect(college.keys).toHaveLength(12);
  });

  it("never drops a pack that has no group", () => {
    const groups = groupPacksForCountry("Other / International", [...PACK_NAMES, "New Exam"]);
    expect(groups.find(g => g.id === "other").keys).toContain("New Exam");
  });
});
