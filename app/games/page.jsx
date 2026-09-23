import Link from "next/link";
import Navbar from "@/components/Navbar";
import { WORD_GAME_DOMAINS, getWordGameDomainSlugs } from "@/lib/wordGame";
import "@/styles/quiz.css";
import "@/styles/button.css";

export const metadata = {
  title: "Studyloaf: Games",
  description: "Crumb, Studyloaf's daily term-guessing game: one real domain-specific term a day, colored letter feedback, for NEET, CLAT, and Board Exams.",
  openGraph: {
    title: "Studyloaf: Games",
    description: "Crumb, Studyloaf's daily term-guessing game: one real domain-specific term a day, colored letter feedback, for NEET, CLAT, and Board Exams.",
  },
};

export default function GamesIndexPage() {
  const slugs = getWordGameDomainSlugs();

  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="quiz-shell">
          <div className="quiz-header">
            <h1 className="quiz-title">Games</h1>
            <p className="quiz-subtitle">
              Crumb is Studyloaf's daily term-guessing game. Every target word is a real,
              domain-specific technical term, not a common English word, so solving it actually
              takes subject knowledge. One puzzle per domain per day, colored letter feedback,
              and a shareable result grid once you're done.
            </p>
          </div>

          <div className="quiz-list">
            {slugs.map(slug => {
              const domain = WORD_GAME_DOMAINS[slug];
              return (
                <div key={slug} className="quiz-card">
                  <h2 className="quiz-card-title">Crumb: {domain.label}</h2>
                  <p className="quiz-card-desc">{domain.terms.length} terms in the bank.</p>
                  <div className="quiz-card-actions">
                    <Link href={`/games/${slug}`} className="btn btn--primary btn--sm">
                      Play today's puzzle
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
