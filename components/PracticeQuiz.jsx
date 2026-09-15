"use client";
import "@/styles/quiz.css";
import "@/styles/button.css";
import { useState, useEffect } from "react";
import Button from "@/components/Button";

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

  useEffect(() => {
    setQuestions(shuffle(category.questions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.questions]);

  if (!questions.length) {
    return <p className="quiz-empty">No questions are available for this category yet.</p>;
  }

  function handleRestart() {
    setQuestions(shuffle(category.questions));
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  }

  if (finished) {
    const score = answers.filter(a => a.selected === a.question.correctIndex).length;
    return (
      <div className="quiz-practice-results">
        <h1 className="quiz-title">{category.label} Practice Quiz</h1>
        <p className="quiz-score">You scored {score} out of {questions.length}.</p>

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

  const question = questions[current];
  const isLast = current === questions.length - 1;

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
        <p className="quiz-progress">Question {current + 1} of {questions.length}</p>
      </div>

      <div className="quiz-question-card">
        <p className="quiz-question-text">{question.question}</p>

        <div className="quiz-options">
          {question.options.map((option, i) => (
            <button
              key={i}
              type="button"
              className={`quiz-option${i === selected ? " quiz-option--selected" : ""}`}
              onClick={() => setSelected(i)}
            >
              {option}
            </button>
          ))}
        </div>

        <Button onClick={handleNext} disabled={selected == null} fullWidth>
          {isLast ? "Finish" : "Next question"}
        </Button>
      </div>
    </div>
  );
}
