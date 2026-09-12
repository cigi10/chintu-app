import { describe, it, expect } from "vitest";
import { ITEMS, CATEGORIES, itemById, migrateEquippedSlots } from "@/lib/shopItems";

describe("ITEMS / CATEGORIES", () => {
  it("every item belongs to a slot that has a category", () => {
    const categorySlots = new Set(CATEGORIES.map(c => c.slot));
    for (const item of ITEMS) {
      expect(categorySlots.has(item.slot)).toBe(true);
    }
  });

  it("itemById finds a real item and returns undefined for an unknown id", () => {
    expect(itemById("glasses")?.slot).toBe("face");
    expect(itemById("not-a-real-item")).toBeUndefined();
  });
});

describe("migrateEquippedSlots", () => {
  it("passes through an already-migrated, multi-slot equipped map unchanged", () => {
    const equipped = { face: "glasses", neck: "scarf" };
    expect(migrateEquippedSlots(equipped)).toEqual(equipped);
  });

  it("moves a legacy single 'wearable' slot into that item's real slot", () => {
    expect(migrateEquippedSlots({ wearable: "glasses" })).toEqual({ face: "glasses" });
    expect(migrateEquippedSlots({ wearable: "sweater_red" })).toEqual({ body: "sweater_red" });
  });

  it("does not let a legacy wearable item clobber a slot that's already equipped", () => {
    // Shouldn't happen in practice (equipped either has "wearable" or
    // per-slot keys, not both) but the migration must never silently
    // overwrite something already resolved into its proper slot.
    expect(migrateEquippedSlots({ wearable: "glasses", face: "headphones" }))
      .toEqual({ face: "headphones" });
  });

  it("drops a legacy wearable id that no longer matches any known item", () => {
    expect(migrateEquippedSlots({ wearable: "discontinued-item" })).toEqual({});
  });

  it("handles missing/malformed input without throwing", () => {
    expect(migrateEquippedSlots(null)).toEqual({});
    expect(migrateEquippedSlots(undefined)).toEqual({});
    expect(migrateEquippedSlots("not an object")).toEqual({});
  });
});
