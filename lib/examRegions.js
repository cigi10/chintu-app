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

// The packs onboarding shows first for each region, in display order.
// Everything else packsForCountry allows stays one click away under
// "More exams", so nothing becomes unreachable. Keys must exist in
// PACK_NAMES (lib/examRegions.test.js checks).
export const FEATURED_PACKS = {
  India: ["JEE", "NEET", "GATE CS", "GATE ECE", "UPSC CSE", "Placements"],
  "United States": ["SAT/ACT", "MCAT", "GRE/GMAT", "CFA", "CPA"],
  "United Kingdom": ["A-Levels", "GCSEs", "IELTS/TOEFL"],
  China: ["Gaokao", "IELTS/TOEFL", "GRE/GMAT"],
};

// "Other / International" (or no region) has no basis for picking, so it
// leads with the packs that aren't tied to one country.
const DEFAULT_FEATURED = ["GRE/GMAT", "IELTS/TOEFL", "Placements"];

// Splits the packs relevant to `country` into the featured few and the
// rest. Custom is handled by the caller and never appears in either list.
export function splitPacksForCountry(country, allKeys) {
  const relevant = packsForCountry(country, allKeys).filter(k => k !== "Custom");
  const featured = (FEATURED_PACKS[country] ?? DEFAULT_FEATURED).filter(k => relevant.includes(k));
  const more = relevant.filter(k => !featured.includes(k));
  return { featured, more };
}
