// lib/wordGame.js
//
// Question-bank access and scoring logic for Crumb, Studyloaf's daily
// term-guessing game. Each domain's terms live in content/wordgame/<slug>.json
// as a plain array of { term, clue } objects, imported directly (same
// pattern as lib/quiz.js) so this works from both server and client
// components.
import neet from "@/content/wordgame/neet.json";
import clat from "@/content/wordgame/clat.json";
import boardExams from "@/content/wordgame/board-exams.json";

export const MAX_GUESSES = 6;

export const WORD_GAME_DOMAINS = {
  neet: { slug: "neet", label: "NEET", terms: neet },
  clat: { slug: "clat", label: "CLAT", terms: clat },
  "board-exams": { slug: "board-exams", label: "Board Exams", terms: boardExams },
};

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
 * term — same approach as lib/quiz.js's daily question picker.
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

/**
 * Scores one guess against the target term, letter by letter, returning
 * "correct" | "present" | "absent" per letter. Handles repeated letters
 * the same way Wordle does: a letter is only marked "present" as many
 * times as it actually appears in the (not-yet-matched) target, so
 * guessing extra copies of a letter beyond what the target has doesn't
 * over-credit the guess.
 */
export function scoreGuess(guess, target) {
  const guessLetters = guess.toUpperCase().split("");
  const targetLetters = target.toUpperCase().split("");
  const result = new Array(guessLetters.length).fill("absent");
  const pool = [...targetLetters];

  guessLetters.forEach((letter, i) => {
    if (letter === targetLetters[i]) {
      result[i] = "correct";
      pool[i] = null;
    }
  });

  guessLetters.forEach((letter, i) => {
    if (result[i] === "correct") return;
    const idx = pool.indexOf(letter);
    if (idx !== -1) {
      result[i] = "present";
      pool[idx] = null;
    }
  });

  return result;
}

export function isWinningGuess(scores) {
  return scores.every(s => s === "correct");
}

// Non-emoji block glyphs for the shareable grid (Geometric Shapes block,
// not the emoji ranges) — ■ for correct, ▦ for present, ▢ for absent.
const SHARE_GLYPH = { correct: "■", present: "▦", absent: "▢" };

export function buildShareGrid(guesses, target) {
  return guesses
    .map(guess => scoreGuess(guess, target).map(s => SHARE_GLYPH[s]).join(""))
    .join("\n");
}
