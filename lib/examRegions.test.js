import { describe, it, expect } from "vitest";
import { COUNTRIES, FEATURED_PACKS, splitPacksForCountry, packsForCountry } from "./examRegions";
import { PACK_NAMES } from "./examPacks";

describe("splitPacksForCountry", () => {
  it("leads India with JEE, NEET, GATE CS, GATE ECE, UPSC CSE and Placements", () => {
    expect(splitPacksForCountry("India", PACK_NAMES).featured).toEqual(["JEE", "NEET", "GATE CS", "GATE ECE", "UPSC CSE", "Placements"]);
  });

  it("keeps every pack the region allows reachable, featured or under More", () => {
    for (const { key } of COUNTRIES) {
      const { featured, more } = splitPacksForCountry(key, PACK_NAMES);
      const relevant = packsForCountry(key, PACK_NAMES).filter(k => k !== "Custom");
      expect([...featured, ...more].sort(), key).toEqual([...relevant].sort());
      expect(featured.length, key).toBeGreaterThanOrEqual(1);
      expect(featured.length, key).toBeLessThanOrEqual(6);
    }
  });

  it("only features packs that exist", () => {
    for (const keys of Object.values(FEATURED_PACKS)) for (const k of keys) expect(PACK_NAMES, k).toContain(k);
  });
});
