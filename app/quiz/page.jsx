import Link from "next/link";
import Navbar from "@/components/Navbar";
import { QUIZ_CATEGORIES, getQuizCategorySlugs } from "@/lib/quiz";
import "@/styles/quiz.css";
import "@/styles/button.css";

export const metadata = {
  title: "Chintu: Quiz",
  description: "Pick a subject, then play today's Daily Challenge or start a Practice Quiz anytime.",
  openGraph: {
    title: "Chintu: Quiz",
    description: "Pick a subject, then play today's Daily Challenge or start a Practice Quiz anytime.",
  },
};

export default function QuizIndexPage() {
  const slugs = getQuizCategorySlugs();

  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="quiz-shell">
          <div className="quiz-header">
            <h1 className="quiz-title">Quiz</h1>
            <p className="quiz-subtitle">
              Pick a subject, then play today's Daily Challenge or start a Practice Quiz anytime.
            </p>
          </div>

          <div className="quiz-list">
            {slugs.map(slug => {
              const category = QUIZ_CATEGORIES[slug];
              return (
                <div key={slug} className="quiz-card">
                  <h2 className="quiz-card-title">{category.label}</h2>
                  <p className="quiz-card-desc">{category.questions.length} questions in the bank.</p>
                  <div className="quiz-card-actions">
                    <Link href={`/quiz/${slug}/daily`} className="btn btn--primary btn--sm">
                      Daily Challenge
                    </Link>
                    <Link href={`/quiz/${slug}/practice`} className="btn btn--secondary btn--sm">
                      Practice Quiz
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
