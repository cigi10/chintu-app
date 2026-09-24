import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { WORD_GAME_DOMAINS, getWordGameDomainSlugs } from "@/lib/wordGame";
import "@/styles/quiz.css";
import "@/styles/button.css";

export const metadata = {
  title: "Crumb - Studyloaf Games",
  description: "Crumb, Studyloaf's daily term-guessing game: one real domain-specific term a day, colored letter feedback, across 8 subject domains.",
  openGraph: {
    title: "Crumb - Studyloaf Games",
    description: "Crumb, Studyloaf's daily term-guessing game: one real domain-specific term a day, colored letter feedback, across 8 subject domains.",
  },
};

export default function CrumbFamilyPage() {
  const slugs = getWordGameDomainSlugs();

  return (
    <div className="quiz-shell">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Games", href: "/games" },
        { label: "Crumb", href: "/games/crumb" },
      ]} />
      <div className="quiz-header">
        <h1 className="quiz-title">Crumb</h1>
        <p className="quiz-subtitle">
          Crumb is a daily term-guessing game. Guess a real, domain-specific technical term in 6
          tries, not a common English word, so solving it actually takes subject knowledge. Every
          guess gets colored letter feedback: green for the right letter in the right spot, yellow
          for the right letter in the wrong spot, gray for a letter that isn't in the word. Each
          domain below gets its own puzzle, once a day, with a clue shown throughout so the
          challenge is knowing the term, not guessing blind.
        </p>
      </div>

      <div className="quiz-list">
        {slugs.map(slug => {
          const domain = WORD_GAME_DOMAINS[slug];
          return (
            <div key={slug} className="quiz-card">
              <h2 className="quiz-card-title">{domain.label}</h2>
              <p className="quiz-card-desc">{domain.terms.length} terms in the bank.</p>
              <div className="quiz-card-actions">
                <Link href={`/games/crumb/${slug}`} className="btn btn--primary btn--sm">
                  Play today's puzzle
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
