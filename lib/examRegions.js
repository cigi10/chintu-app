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
  India: ["JEE", "NEET", "UPSC CSE", "GATE CS", "GATE ECE", "GATE ME", "GATE BT", "NEET-MDS"],
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
