"use client";
import "@/styles/quiz.css";
import "@/styles/button.css";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";

const POINTS_PER_CORRECT = 10;

// Purely a front-end flourish for the results screen — not a real score,
// currency, or achievement; nothing here is persisted anywhere. Modeled
// on the tiered-milestone feel of lib/achievements.js without touching it.
const SCORE_TIERS = [
  { min: 0.9, name: "Sharp Shooter" },
  { min: 0.6, name: "Solid Effort" },
  { min: 0, name: "Keep Practicing" },
];

function tierFor(score, total) {
  const ratio = total > 0 ? score / total : 0;
  return SCORE_TIERS.find(t => ratio >= t.min).name;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Counts a number up from its previous value to `value` over a fixed
// short duration — purely cosmetic, no data behind it.
function useCountUp(value, durationMs = 500) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;
    if (from === to) return;

    const start = performance.now();
    let frame;
    function tick(now) {
      const t = Math.min(1, (now - start) / durationMs);
      setDisplay(Math.round(from + (to - from) * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return display;
}

export default function PracticeQuiz({ category }) {
  // Starts in bank order (matching the server-rendered markup exactly) and
  // only shuffles once mounted on the client, since Math.random() would
  // otherwise produce a different order during SSR than during hydration
  // and trigger a hydration mismatch.
  const [questions, setQuestions] = useState(category.questions);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setQuestions(shuffle(category.questions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.questions]);

  const currentQuestion = questions[current];
  const currentAnswered = selected != null;
  // Includes the just-answered current question immediately, before it's
  // committed to `answers` on "Next" — otherwise the running point total
  // would lag a full question behind its own "+10 points!" popup.
  const score =
    answers.filter(a => a.selected === a.question.correctIndex).length +
    (!finished && currentAnswered && currentQuestion && selected === currentQuestion.correctIndex ? 1 : 0);
  const points = score * POINTS_PER_CORRECT;
  const displayedPoints = useCountUp(points);

  if (!questions.length) {
    return <p className="quiz-empty">No questions are available for this category yet.</p>;
  }

  function handleRestart() {
    setQuestions(shuffle(category.questions));
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setCopied(false);
  }

  if (finished) {
    const tier = tierFor(score, questions.length);
    const shareText = `I scored ${score}/${questions.length} (${tier}) on the ${category.label} Practice Quiz, beat me at studyloaf.com/quiz/${category.slug}/practice.`;

    async function handleShare() {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }

    return (
      <div className="quiz-practice-results">
        <h1 className="quiz-title">{category.label} Practice Quiz</h1>

        <div className="quiz-score-card">
          <p className="quiz-score-card-value">{score}<span className="quiz-score-card-total">/{questions.length}</span></p>
          <p className="quiz-score-card-points">{displayedPoints} pts</p>
          <span className="quiz-tier-badge">{tier}</span>
        </div>

        <div className="quiz-share">
          <p className="quiz-share-text">{shareText}</p>
          <Button onClick={handleShare} variant="soft" size="sm">
            {copied ? "Copied." : "Copy result"}
          </Button>
        </div>

        <div className="quiz-review-list">
          {answers.map((a, i) => {
            const correct = a.selected === a.question.correctIndex;
            return (
              <div key={i} className={`quiz-review-card ${correct ? "quiz-review-card--correct" : "quiz-review-card--incorrect"}`}>
                <p className="quiz-review-question">{i + 1}. {a.question.question}</p>
                <p className="quiz-review-answer">Your answer: {a.question.options[a.selected]}</p>
                {!correct && (
                  <p className="quiz-review-answer quiz-review-answer--correct">
                    Correct answer: {a.question.options[a.question.correctIndex]}
                  </p>
                )}
                <p className="quiz-explanation">{a.question.explanation}</p>
              </div>
            );
          })}
        </div>

        <Button onClick={handleRestart}>Play again</Button>
      </div>
    );
  }

  const question = currentQuestion;
  const isLast = current === questions.length - 1;
  const answered = currentAnswered;

  function handleSelect(i) {
    if (answered) return;
    setSelected(i);
  }

  function handleNext() {
    const nextAnswers = [...answers, { question, selected }];
    setAnswers(nextAnswers);
    if (isLast) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  }

  return (
    <div className="quiz-practice">
      <div className="quiz-daily-header">
        <h1 className="quiz-title">{category.label} Practice Quiz</h1>
        <div className="quiz-progress-row">
          <p className="quiz-progress">Question {current + 1} of {questions.length}</p>
          <p className="quiz-progress-points">{displayedPoints} pts</p>
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-bar-fill"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="quiz-question-card">
        <p className="quiz-question-text">{question.question}</p>

        <div className="quiz-options">
          {question.options.map((option, i) => {
            let cls = "quiz-option";
            if (answered) {
              if (i === question.correctIndex) cls += " quiz-option--correct quiz-option--pop";
              else if (i === selected) cls += " quiz-option--incorrect quiz-option--pop";
            } else if (i === selected) {
              cls += " quiz-option--selected";
            }
            return (
              <button
                key={i}
                type="button"
                className={cls}
                disabled={answered}
                onClick={() => handleSelect(i)}
              >
                {option}
                {answered && i === question.correctIndex && (
                  <span className="quiz-option-icon quiz-option-icon--correct">✓</span>
                )}
                {answered && i === selected && i !== question.correctIndex && (
                  <span className="quiz-option-icon quiz-option-icon--incorrect">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && selected === question.correctIndex && (
          <p className="quiz-points-popup" key={current}>+{POINTS_PER_CORRECT} points!</p>
        )}

        <Button onClick={handleNext} disabled={!answered} fullWidth>
          {isLast ? "Finish" : "Next question"}
        </Button>
      </div>
    </div>
  );
}
