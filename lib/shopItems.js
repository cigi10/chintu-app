// lib/shopItems.js
//
// Shared item/slot metadata for the coin shop — needed both by
// CoinShop.jsx (the catalog/equip UI) and Companion.jsx (layering every
// currently-equipped item wherever the companion appears, and migrating
// old single-slot equip data). Kept in one place so the two can't drift
// out of sync on what slot an item belongs to.
//
// Each item has exactly one slot; only one item per slot can be equipped
// at a time, but different slots layer together freely (e.g. a head item
// and a face item at once).
export const ITEMS = [
  { id: "glasses",        name: "Little glasses",   cost: 75,  slot: "face",    art: "glasses"        },
  { id: "scarf",          name: "Tiny scarf",       cost: 100, slot: "neck",    art: "scarf"          },
  { id: "bowtie",         name: "Dapper bowtie",    cost: 90,  slot: "neck",    art: "bowtie"         },
  { id: "headphones",     name: "Study headphones", cost: 140, slot: "head",    art: "headphones"     },
  { id: "socks",          name: "Cozy socks",       cost: 70,  slot: "feet",    art: "socks"          },
  { id: "flowers_yellow", name: "Flower crown",     cost: 90,  slot: "head",    art: "flowers_yellow" },
  { id: "leaves",         name: "Falling leaves",   cost: 80,  slot: "ambient", art: "leaves"         },
  { id: "necktie_pink",   name: "Pink bow",         cost: 95,  slot: "neck",    art: "necktie_pink"   },
  { id: "pearls",         name: "Pearl necklace",   cost: 120, slot: "neck",    art: "pearls"         },
  { id: "sweater_red",    name: "Red sweater",      cost: 130, slot: "body",    art: "sweater_red"    },
];

export const CATEGORIES = [
  { slot: "head",    label: "Head" },
  { slot: "face",    label: "Face" },
  { slot: "neck",    label: "Neck" },
  { slot: "body",    label: "Body" },
  { slot: "feet",    label: "Feet" },
  { slot: "ambient", label: "Ambient" },
];

export function itemById(id) {
  return ITEMS.find((i) => i.id === id);
}

// Before multi-slot support, every item shared one "wearable" slot key
// regardless of what it actually was, so `equipped` looked like
// { wearable: "glasses" }. Moves that into the item's real slot — e.g.
// { face: "glasses" } — so upgrading doesn't silently un-equip whatever
// someone already had on. A no-op once a shop's data has already been
// migrated (no "wearable" key left to move).
export function migrateEquippedSlots(equipped) {
  if (!equipped || typeof equipped !== "object") return {};
  if (!("wearable" in equipped)) return equipped;

  const { wearable, ...rest } = equipped;
  const item = itemById(wearable);
  if (item && !(item.slot in rest)) rest[item.slot] = wearable;
  return rest;
}
