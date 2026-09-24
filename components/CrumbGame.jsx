"use client";
import "@/styles/crumb.css";
import "@/styles/button.css";
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import CrumbKeyboard from "@/components/CrumbKeyboard";
import { getDailyTerm, scoreGuess, computeKeyStatuses, buildShareGrid, MAX_GUESSES } from "@/lib/wordGame";
import { hydrateWordGameProgress, getTodayProgress, getWordGameStreakInfo, recordGuess } from "@/lib/wordGameProgress";

export default function CrumbGame({ domain }) {
  const term = getDailyTerm(domain.slug);
  const [progress, setProgress] = useState({ date: "", guesses: [], status: "playing" });
  const [streakCount, setStreakCount] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    hydrateWordGameProgress().then(() => {
      if (!active) return;
      setProgress(getTodayProgress(domain.slug));
      setStreakCount(getWordGameStreakInfo(domain.slug).streakCount);
    });
    return () => { active = false; };
  }, [domain.slug]);

  const targetLength = term ? term.term.length : 0;
  const done = progress.status !== "playing";

  function submitGuess() {
    if (done) return;
    const guess = currentGuess.trim().toUpperCase();

    if (guess.length !== targetLength) {
      setError(`Your guess needs to be exactly ${targetLength} letters.`);
      return;
    }

    setError("");
    const won = guess === term.term;
    const result = recordGuess(domain.slug, guess, won);
    setProgress(result.today);
    setStreakCount(result.streakCount);
    setCurrentGuess("");
  }

  function handleKey(key) {
    if (done) return;
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
    if (done || !term) return;
    function onKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") { handleKey("ENTER"); return; }
      if (e.key === "Backspace") { handleKey("BACKSPACE"); return; }
      if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, currentGuess, targetLength, term]);

  if (!term) {
    return <p className="crumb-empty">No terms are available for this domain yet.</p>;
  }

  async function handleShare() {
    const grid = buildShareGrid(progress.guesses, term.term);
    const guessCount = progress.status === "won" ? progress.guesses.length : "X";
    const shareText = `Crumb: ${domain.label} ${guessCount}/${MAX_GUESSES}\n${grid}\nstudyloaf.com/games/crumb/${domain.slug}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const keyStatuses = computeKeyStatuses(progress.guesses, term.term);

  return (
    <div className="crumb-game">
      <div className="crumb-header">
        <h1 className="crumb-title">Crumb: {domain.label}</h1>
        <div className="crumb-streak-card">
          <span className="crumb-streak-count">{streakCount}</span>
          <span className="crumb-streak-label">day{streakCount === 1 ? "" : "s"} streak</span>
        </div>
      </div>

      <p className="crumb-clue">{term.clue}</p>

      <div className="crumb-grid" style={{ "--crumb-cols": targetLength }}>
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
          const submittedGuess = progress.guesses[rowIndex];
          const isActiveRow = !done && rowIndex === progress.guesses.length;
          const scores = submittedGuess ? scoreGuess(submittedGuess, term.term) : null;
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
        <CrumbKeyboard keyStatuses={keyStatuses} onKey={handleKey} disabled={done} />
      )}

      {done && (
        <div className="crumb-result">
          <p className={`crumb-result-banner ${progress.status === "won" ? "crumb-result-banner--won" : "crumb-result-banner--lost"}`}>
            {progress.status === "won"
              ? `Solved in ${progress.guesses.length}/${MAX_GUESSES}.`
              : `Not this time. The term was ${term.term}.`}
          </p>
          <p className="crumb-explanation">{term.clue}</p>
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
