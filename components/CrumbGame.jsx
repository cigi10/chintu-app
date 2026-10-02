"use client";
import "@/styles/crumb.css";
import "@/styles/button.css";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";
import CrumbKeyboard from "@/components/CrumbKeyboard";
import { MAX_GUESSES, keyStatusesFromScores, shareGridFromScores } from "@/lib/wordGameRules";
import { hydrateWordGameProgress, getTodayProgress, getWordGameStreakInfo, recordGuess } from "@/lib/wordGameProgress";
import { localDateStr } from "@/lib/date";

// Asks the server to score today's guesses. The response carries the
// puzzle's length, topic and per-guess scores, and the term itself only
// once the puzzle is over, so the answer is never in the page or bundle.
async function fetchPuzzle(slug, guesses) {
  const res = await fetch(`/api/crumb/${encodeURIComponent(slug)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: localDateStr(), guesses }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Request failed");
  return res.json();
}

export default function CrumbGame({ domain }) {
  const [progress, setProgress] = useState({ date: "", guesses: [], status: "playing" });
  const [puzzle, setPuzzle] = useState(null); // { length, topic, scores, status, term?, clue? }
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(0);

  useEffect(() => {
    let active = true;
    hydrateWordGameProgress()
      .then(() => {
        const today = getTodayProgress(domain.slug);
        if (!active) return null;
        setProgress(today);
        setStreakCount(getWordGameStreakInfo(domain.slug).streakCount);
        return fetchPuzzle(domain.slug, today.guesses);
      })
      .then(result => { if (active && result) { setPuzzle(result); setLoadError(false); } })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [domain.slug, attempt]);

  const targetLength = puzzle ? puzzle.length : 0;
  const status = puzzle ? puzzle.status : "playing";
  const done = status !== "playing";

  async function submitGuess() {
    if (done || submitting || !puzzle) return;
    const guess = currentGuess.trim().toUpperCase();

    if (guess.length !== targetLength) {
      setError(`Your guess needs to be exactly ${targetLength} letters.`);
      return;
    }

    setError("");
    setSubmitting(true);
    const request = ++latest.current;
    try {
      const result = await fetchPuzzle(domain.slug, [...progress.guesses, guess]);
      if (request !== latest.current) return;
      const saved = recordGuess(domain.slug, guess, result.status === "won");
      setProgress(saved.today);
      setStreakCount(saved.streakCount);
      setPuzzle(result);
      setCurrentGuess("");
    } catch {
      setError("Couldn't check that guess. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleKey(key) {
    if (done || !puzzle) return;
    if (key === "ENTER") {
      submitGuess();
      return;
    }
    if (key === "BACKSPACE") {
      setError("");
      setCurrentGuess(g => g.slice(0, -1));
      return;
    }
    setError("");
    setCurrentGuess(g => (g.length < targetLength ? g + key : g));
  }

  // Physical keyboard support, alongside the on-screen one below - both
  // funnel through the same handleKey so they can never fall out of sync.
  // Re-subscribing whenever currentGuess/done change (cheap for a text
  // listener) keeps the closure's view of state fresh without needing a
  // ref.
  useEffect(() => {
    if (done || !puzzle) return;
    function onKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") { handleKey("ENTER"); return; }
      if (e.key === "Backspace") { handleKey("BACKSPACE"); return; }
      if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, currentGuess, targetLength, puzzle, submitting]);

  async function handleShare() {
    const grid = shareGridFromScores(puzzle.scores);
    const guessCount = status === "won" ? puzzle.scores.length : "X";
    const shareText = `Crumb: ${domain.label} ${guessCount}/${MAX_GUESSES}\n${grid}\nstudyloaf.com/games/crumb/${domain.slug}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const header = (
    <div className="crumb-header">
      <h1 className="crumb-title">Crumb: {domain.label}</h1>
      <div className="crumb-streak-card">
        <span className="crumb-streak-count">{streakCount}</span>
        <span className="crumb-streak-label">day{streakCount === 1 ? "" : "s"} streak</span>
      </div>
    </div>
  );

  if (!puzzle) {
    return (
      <div className="crumb-game">
        {header}
        {loadError ? (
          <div className="crumb-result">
            <p className="crumb-error">Couldn&apos;t load today&apos;s puzzle. Check your connection and try again.</p>
            <div className="crumb-share">
              <Button onClick={() => setAttempt(a => a + 1)} variant="soft" size="sm">Try again</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="crumb-clue">Loading today&apos;s puzzle…</p>
            {/* The keyboard is fixed UI, so it renders (disabled) on the
                server and while loading, keeping the layout from jumping
                when the board arrives. */}
            <CrumbKeyboard keyStatuses={{}} onKey={() => {}} disabled />
          </>
        )}
      </div>
    );
  }

  const guesses = progress.guesses.slice(0, puzzle.scores.length);
  const keyStatuses = keyStatusesFromScores(guesses, puzzle.scores);

  return (
    <div className="crumb-game">
      {header}

      <p className="crumb-clue"><span className="crumb-clue-label">Topic:</span> {puzzle.topic}</p>

      <div className="crumb-grid" style={{ "--crumb-cols": targetLength }}>
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
          const submittedGuess = guesses[rowIndex];
          const isActiveRow = !done && rowIndex === guesses.length;
          const scores = submittedGuess ? puzzle.scores[rowIndex] : null;
          const letters = submittedGuess
            ? submittedGuess.split("")
            : isActiveRow
              ? currentGuess.padEnd(targetLength, " ").split("")
              : Array.from({ length: targetLength }).fill(" ");
          return (
            <div key={rowIndex} className="crumb-row">
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className={`crumb-tile${scores ? ` crumb-tile--${scores[i]}` : ""}${isActiveRow && letter.trim() ? " crumb-tile--filled" : ""}`}
                >
                  {letter.trim()}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {error && <p className="crumb-error">{error}</p>}

      {!done && (
        <CrumbKeyboard keyStatuses={keyStatuses} onKey={handleKey} disabled={done || submitting} />
      )}

      {done && (
        <div className="crumb-result">
          <p className={`crumb-result-banner ${status === "won" ? "crumb-result-banner--won" : "crumb-result-banner--lost"}`}>
            {status === "won"
              ? `Solved in ${puzzle.scores.length}/${MAX_GUESSES}.`
              : `Not this time. The term was ${puzzle.term}.`}
          </p>
          <p className="crumb-explanation">{puzzle.clue}</p>
          <div className="crumb-share">
            <Button onClick={handleShare} variant="soft" size="sm">
              {copied ? "Copied." : "Copy result"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
