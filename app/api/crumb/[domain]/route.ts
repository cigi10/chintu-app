import type { NextRequest } from "next/server";
import { getWordGameDomain, getDailyTerm } from "@/lib/wordGame";
import { MAX_GUESSES, scoreGuess, isWinningGuess } from "@/lib/wordGameRules";

// POST /api/crumb/<domain> with { date: "YYYY-MM-DD", guesses: string[] }.
//
// Scores a day's guesses on the server so the browser never holds the
// answer. Returns the puzzle's length and topic plus a score per guess;
// the term and its definition are only included once the puzzle is over
// (solved, or all guesses used). `date` is the player's local calendar
// date, so the puzzle rolls over at their midnight as before. It must be
// within a day of the server's date, so tomorrow's answer can't be pulled
// early beyond what a timezone difference allows.
export async function POST(request: NextRequest, ctx: RouteContext<"/api/crumb/[domain]">) {
  const { domain: slug } = await ctx.params;
  if (!getWordGameDomain(slug)) return bad("Unknown domain.", 404);

  let body: { date?: unknown; guesses?: unknown };
  try {
    body = await request.json();
  } catch {
    return bad("Request body must be JSON.");
  }

  const date = parseDate(body.date);
  if (!date) return bad("date must be today's date as YYYY-MM-DD.");

  const term = getDailyTerm(slug, date);
  if (!term) return bad("No terms are available for this domain yet.", 404);

  const guesses = body.guesses ?? [];
  if (!Array.isArray(guesses) || guesses.length > MAX_GUESSES) return bad(`guesses must be a list of at most ${MAX_GUESSES}.`);
  const length = term.term.length;
  if (!guesses.every(g => typeof g === "string" && g.length === length && /^[A-Za-z]+$/.test(g))) {
    return bad(`Each guess must be ${length} letters.`);
  }

  const scores = guesses.map(g => scoreGuess(g, term.term));
  const winAt = scores.findIndex(isWinningGuess);
  if (winAt !== -1 && winAt !== scores.length - 1) return bad("No guesses are allowed after the puzzle is solved.");
  const status = winAt !== -1 ? "won" : guesses.length >= MAX_GUESSES ? "lost" : "playing";

  return Response.json(
    {
      length,
      topic: term.topic,
      scores,
      status,
      ...(status !== "playing" && { term: term.term, clue: term.clue }),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

// Parses YYYY-MM-DD as a local calendar date and accepts it only if it's
// within one day of the server's current date.
function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);
  return Math.abs(diffDays) <= 1 ? date : null;
}

function bad(error: string, status = 400) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}
