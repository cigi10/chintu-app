// lib/wordGameRules.js
//
// Crumb's pure game rules, safe to import from client components: no word
// banks in here. Answers live only in lib/wordGame.js, which is server-side
// (the scoring route app/api/crumb/[domain]/route.ts uses it), so the
// browser never receives a term until today's puzzle is over.
// lib/wordGameRules.test.js guards that no client component imports the
// banks directly.

export const MAX_GUESSES = 6;

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

const STATUS_RANK = { absent: 0, present: 1, correct: 2 };

/**
 * Aggregates every submitted guess into one status per letter, for the
 * on-screen keyboard, from the server's per-guess scores: a letter keeps
 * the best status it's ever earned across guesses (a letter marked
 * "present" in one guess and "correct" in a later one shows correct).
 */
export function keyStatusesFromScores(guesses, scoresList) {
  const statuses = {};
  guesses.forEach((guess, g) => {
    const scores = scoresList[g];
    if (!scores) return;
    guess.toUpperCase().split("").forEach((letter, i) => {
      const status = scores[i];
      if (!statuses[letter] || STATUS_RANK[status] > STATUS_RANK[statuses[letter]]) {
        statuses[letter] = status;
      }
    });
  });
  return statuses;
}

// Non-emoji block glyphs for the shareable grid (Geometric Shapes block,
// not the emoji ranges): ■ for correct, ▦ for present, ▢ for absent.
const SHARE_GLYPH = { correct: "■", present: "▦", absent: "▢" };

export function shareGridFromScores(scoresList) {
  return scoresList.map(scores => scores.map(s => SHARE_GLYPH[s]).join("")).join("\n");
}
