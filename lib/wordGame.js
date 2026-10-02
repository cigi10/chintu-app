// lib/wordGame.js
//
// Crumb's word banks: SERVER-SIDE ONLY. Each domain's terms live in
// content/wordgame/<slug>.json as a plain array of { term, clue, topic }
// objects. `topic` (e.g. "Cell Division") is the short hint shown
// throughout the puzzle; `clue` is the fuller definition, reserved for the
// post-game explanation so solving the puzzle still takes actually
// knowing the term, not just reading its definition.
//
// Never import this from a client component: anything it imports ends up
// in the browser bundle, which would ship every answer. Client code uses
// lib/wordGameRules.js (scoring) and lib/wordGameDomains.js (labels), and
// gets today's puzzle from app/api/crumb/[domain]/route.ts, which only
// reveals the term once the game is over. lib/wordGameRules.test.js
// enforces this.
import neet from "@/content/wordgame/neet.json";
import clat from "@/content/wordgame/clat.json";
import boardExams from "@/content/wordgame/board-exams.json";
import ece from "@/content/wordgame/ece.json";
import cs from "@/content/wordgame/cs.json";
import aiml from "@/content/wordgame/aiml.json";
import jee from "@/content/wordgame/jee.json";
import placementsAptitude from "@/content/wordgame/placements-aptitude.json";
import { WORD_GAME_DOMAIN_META } from "@/lib/wordGameDomains";

const BANKS = {
  neet, clat, "board-exams": boardExams, ece, cs, aiml, jee, "placements-aptitude": placementsAptitude,
};

export const WORD_GAME_DOMAINS = Object.fromEntries(
  WORD_GAME_DOMAIN_META.map(meta => [meta.slug, { ...meta, terms: BANKS[meta.slug] ?? [] }])
);

export function getWordGameDomainSlugs() {
  return Object.keys(WORD_GAME_DOMAINS);
}

export function getWordGameDomain(slug) {
  return WORD_GAME_DOMAINS[slug];
}

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

/**
 * Deterministic index into a domain's term bank for a given date, so
 * everyone playing that domain on the same calendar day gets the same
 * term, the same approach as lib/quiz.js's daily question picker.
 */
export function getDailyTermIndex(slug, date = new Date()) {
  const domain = getWordGameDomain(slug);
  if (!domain || !domain.terms.length) return 0;
  return dayOfYear(date) % domain.terms.length;
}

export function getDailyTerm(slug, date = new Date()) {
  const domain = getWordGameDomain(slug);
  if (!domain || !domain.terms.length) return null;
  return domain.terms[getDailyTermIndex(slug, date)];
}
