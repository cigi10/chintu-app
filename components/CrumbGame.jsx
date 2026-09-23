"use client";
import "@/styles/crumb.css";
import "@/styles/button.css";
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { getDailyTerm, scoreGuess, isWinningGuess, buildShareGrid, MAX_GUESSES } from "@/lib/wordGame";
import { hydrateWordGameProgress, getTodayProgress, getWordGameStreakInfo, recordGuess } from "@/lib/wordGameProgress";

export default function CrumbGame({ domain }) {
  const term = getDailyTerm(domain.slug);
  const [progress, setProgress] = useState({ date: "", guesses: [], status: "playing" });
  const [streakCount, setStreakCount] = useState(0);
  const [input, setInput] = useState("");
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

  if (!term) {
    return <p className="crumb-empty">No terms are available for this domain yet.</p>;
  }

  const targetLength = term.term.length;
  const done = progress.status !== "playing";

  function handleSubmit(e) {
    e.preventDefault();
    if (done) return;
    const guess = input.trim().toUpperCase();

    if (guess.length !== targetLength) {
      setError(`Your guess needs to be exactly ${targetLength} letters.`);
      return;
    }
    if (!/^[A-Z]+$/.test(guess)) {
      setError("Letters only.");
      return;
    }

    setError("");
    const won = guess === term.term;
    const result = recordGuess(domain.slug, guess, won);
    setProgress(result.today);
    setStreakCount(result.streakCount);
    setInput("");
  }

  async function handleShare() {
    const grid = buildShareGrid(progress.guesses, term.term);
    const guessCount = progress.status === "won" ? progress.guesses.length : "X";
    const shareText = `Crumb: ${domain.label} ${guessCount}/${MAX_GUESSES}\n${grid}\nstudyloaf.com/games/${domain.slug}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

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
          const guess = progress.guesses[rowIndex];
          const scores = guess ? scoreGuess(guess, term.term) : null;
          const letters = guess ? guess.split("") : Array.from({ length: targetLength }).fill("");
          return (
            <div key={rowIndex} className="crumb-row">
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className={`crumb-tile${scores ? ` crumb-tile--${scores[i]}` : ""}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {!done && (
        <form className="crumb-form" onSubmit={handleSubmit}>
          <input
            className="crumb-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Type a ${targetLength}-letter term...`}
            maxLength={targetLength}
            autoFocus
          />
          <Button type="submit" size="sm">Guess</Button>
        </form>
      )}
      {error && <p className="crumb-error">{error}</p>}

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
