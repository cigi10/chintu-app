// lib/wordGameDomains.js
//
// Crumb's domain list (slug and label only), safe for client components
// such as the domain tab switcher. The terms themselves are attached in
// lib/wordGame.js, which must stay server-side so answers never reach the
// browser. Order here is display order everywhere.

export const WORD_GAME_DOMAIN_META = [
  { slug: "neet", label: "NEET" },
  { slug: "clat", label: "CLAT" },
  { slug: "board-exams", label: "Board Exams" },
  { slug: "ece", label: "ECE" },
  { slug: "cs", label: "CS" },
  { slug: "aiml", label: "AIML" },
  { slug: "jee", label: "JEE" },
  { slug: "placements-aptitude", label: "Placements & Aptitude" },
];

export function getWordGameDomainMeta(slug) {
  return WORD_GAME_DOMAIN_META.find(d => d.slug === slug);
}
