"use client";
import "@/styles/quiz.css";
import "@/styles/button.css";
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { getDailyQuestion } from "@/lib/quiz";
import { hydrateQuizStreak, getDailyStreakInfo, recordDailyPlayed } from "@/lib/quizStreak";

const POINTS_FOR_CORRECT = 10;

export default function DailyQuiz({ category }) {
  const question = getDailyQuestion(category.slug);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [streak, setStreak] = useState({ streakCount: 0, playedToday: false });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    hydrateQuizStreak().then(() => {
      if (active) setStreak(getDailyStreakInfo(category.slug));
    });
    return () => { active = false; };
  }, [category.slug]);

  if (!question) {
    return <p className="quiz-empty">No questions are available for this category yet.</p>;
  }

  const isCorrect = selected === question.correctIndex;
  const shareText = `I scored ${isCorrect ? "1/1" : "0/1"} on today's ${category.shareLabel} Daily Challenge, beat me at studyloaf.com/quiz/${category.slug}/daily.`;

  function handleSubmit() {
    if (selected == null || submitted) return;
    setSubmitted(true);
    setStreak(recordDailyPlayed(category.slug));
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="quiz-daily">
      <div className="quiz-daily-header">
        <h1 className="quiz-title">{category.label} Daily Challenge</h1>
        <div className="quiz-streak-card">
          <span className="quiz-streak-count">{streak.streakCount}</span>
          <span className="quiz-streak">day{streak.streakCount === 1 ? "" : "s"} streak</span>
        </div>
      </div>

      <div className="quiz-question-card">
        <p className="quiz-question-text">{question.question}</p>

        <div className="quiz-options">
          {question.options.map((option, i) => {
            let optionClass = "quiz-option";
            if (submitted) {
              if (i === question.correctIndex) optionClass += " quiz-option--correct quiz-option--pop";
              else if (i === selected) optionClass += " quiz-option--incorrect quiz-option--pop";
            } else if (i === selected) {
              optionClass += " quiz-option--selected";
            }
            return (
              <button
                key={i}
                type="button"
                className={optionClass}
                disabled={submitted}
                onClick={() => setSelected(i)}
              >
                {option}
                {submitted && i === question.correctIndex && (
                  <span className="quiz-option-icon quiz-option-icon--correct">✓</span>
                )}
                {submitted && i === selected && i !== question.correctIndex && (
                  <span className="quiz-option-icon quiz-option-icon--incorrect">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {!submitted && (
          <Button onClick={handleSubmit} disabled={selected == null} fullWidth>
            Submit answer
          </Button>
        )}

        {submitted && isCorrect && (
          <p className="quiz-points-popup">+{POINTS_FOR_CORRECT} points!</p>
        )}

        {submitted && (
          <div className="quiz-result">
            <p className={`quiz-result-banner ${isCorrect ? "quiz-result-banner--correct" : "quiz-result-banner--incorrect"}`}>
              {isCorrect ? "Correct." : "Not quite."}
            </p>
            <p className="quiz-explanation">{question.explanation}</p>

            <div className="quiz-share">
              <p className="quiz-share-text">{shareText}</p>
              <Button onClick={handleCopy} variant="soft" size="sm">
                {copied ? "Copied." : "Copy result"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
