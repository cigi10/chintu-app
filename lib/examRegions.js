// Country -> exam pack filtering for Onboarding's pack picker. Only used to
// narrow the list shown to the user; it never affects what RAW_PACKS holds.

export const COUNTRIES = [
  { key: "India",                 icon: "IN", desc: "JEE, NEET, UPSC, GATE, dental" },
  { key: "United States",         icon: "US", desc: "SAT, MCAT, CFA, CPA, dental" },
  { key: "United Kingdom",        icon: "UK", desc: "A-Levels, GCSEs" },
  { key: "China",                 icon: "CN", desc: "Gaokao" },
  { key: "Other / International", icon: "🌍", desc: "Show every pack" },
];

// Packs tied to a specific country's education/certification system.
const REGION_PACKS = {
  India: [
    "JEE", "NEET", "UPSC CSE", "GATE CS", "GATE ECE", "GATE ME", "GATE BT", "NEET-MDS",
    "PES CSE/AIML Sem 1", "PES CSE/AIML Sem 2", "PES CSE/AIML Sem 3",
    "PES CSE/AIML Sem 4", "PES CSE/AIML Sem 5", "PES CSE/AIML Sem 6",
    "PES ECE Sem 1", "PES ECE Sem 2", "PES ECE Sem 3",
    "PES ECE Sem 4", "PES ECE Sem 5", "PES ECE Sem 6",
  ],
  "United States": ["SAT/ACT", "MCAT", "CFA", "CPA", "INBDE"],
  "United Kingdom": ["A-Levels", "GCSEs"],
  China: ["Gaokao"],
};

// Packs relevant no matter where the user is studying from.
const UNIVERSAL_PACKS = ["Custom", "GRE/GMAT", "IELTS/TOEFL", "Placements"];

// Returns the subset of `allKeys` relevant to `country`. Unknown/unset
// country (including "Other / International") falls back to the full list
// since we have no basis to narrow it.
export function packsForCountry(country, allKeys) {
  if (!country || !REGION_PACKS[country]) return allKeys;
  const allowed = new Set([...REGION_PACKS[country], ...UNIVERSAL_PACKS]);
  return allKeys.filter(k => allowed.has(k));
}

// Onboarding shows the packs a region allows (packsForCountry) under these
// headings, in this order. Every pack in PACK_NAMES belongs to exactly one
// group (lib/examRegions.test.js checks), and any pack added later without
// a group falls into "Other exams" so it can never disappear. The order
// within a group is the display order. College semesters is long (12 PES
// packs), so onboarding collapses it by default.
export const PACK_GROUPS = [
  { id: "entrance", label: "Entrance exams", keys: ["JEE", "NEET", "NEET-MDS", "SAT/ACT", "Gaokao", "MCAT", "GRE/GMAT"] },
  { id: "gate", label: "GATE", keys: ["GATE CS", "GATE ECE", "GATE ME", "GATE BT"] },
  { id: "other", label: "Other exams", keys: ["UPSC CSE", "A-Levels", "GCSEs", "CFA", "CPA", "INBDE", "IELTS/TOEFL", "Placements"] },
  {
    id: "college",
    label: "College semesters",
    collapsedByDefault: true,
    keys: [
      "PES CSE/AIML Sem 1", "PES CSE/AIML Sem 2", "PES CSE/AIML Sem 3",
      "PES CSE/AIML Sem 4", "PES CSE/AIML Sem 5", "PES CSE/AIML Sem 6",
      "PES ECE Sem 1", "PES ECE Sem 2", "PES ECE Sem 3",
      "PES ECE Sem 4", "PES ECE Sem 5", "PES ECE Sem 6",
    ],
  },
];

// The groups for `country`, each holding only the packs that region allows,
// with empty groups dropped. Custom is handled by the caller and never
// appears here. Packs with no group are appended to "Other exams".
export function groupPacksForCountry(country, allKeys) {
  const allowed = packsForCountry(country, allKeys).filter(k => k !== "Custom");
  const grouped = new Set(PACK_GROUPS.flatMap(g => g.keys));
  const ungrouped = allowed.filter(k => !grouped.has(k));
  return PACK_GROUPS
    .map(g => ({
      id: g.id,
      label: g.label,
      collapsedByDefault: Boolean(g.collapsedByDefault),
      keys: [...g.keys.filter(k => allowed.includes(k)), ...(g.id === "other" ? ungrouped : [])],
    }))
    .filter(g => g.keys.length > 0);
}
