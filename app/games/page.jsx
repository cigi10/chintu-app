import Link from "next/link";
import { GAME_FAMILIES } from "@/lib/games";
import "@/styles/quiz.css";
import { WORD_GAME_DOMAINS, getWordGameDomainSlugs } from "@/lib/wordGame";
import { CRUMB_INFO } from "@/lib/toolPageContent";
import "@/styles/tool-about.css";
import "@/styles/button.css";

export const metadata = {
  title: "Studyloaf: Games",
  description: "Studyloaf's study games: Crumb, a daily term-guessing game with colored letter feedback, for NEET, JEE, CLAT, and more.",
  openGraph: {
    title: "Studyloaf: Games",
    description: "Studyloaf's study games: Crumb, a daily term-guessing game with colored letter feedback, for NEET, JEE, CLAT, and more.",
  },
  alternates: { canonical: "/games" },
};

export default function GamesIndexPage() {
  const domains = getWordGameDomainSlugs().map(slug => WORD_GAME_DOMAINS[slug]);
  return (
    <div className="quiz-shell">
      <div className="quiz-header">
        <h1 className="quiz-title">Games</h1>
        <p className="quiz-subtitle">
          Quick, low-effort study games worth a minute a day.
        </p>
      </div>

      <div className="quiz-list">
        {GAME_FAMILIES.map(family => (
          <div key={family.slug} className="quiz-card">
            <h2 className="quiz-card-title">{family.label}</h2>
            <p className="quiz-card-desc">{family.description}</p>
            <div className="quiz-card-actions">
              <Link href={`/games/${family.slug}`} className="btn btn--primary btn--sm">
                {family.tagline}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="tool-about" aria-labelledby="games-crumb-heading">
        <h2 id="games-crumb-heading" className="tool-about__heading">Crumb: one daily puzzle per subject</h2>
        <p className="tool-about__p">
          Each Crumb puzzle hides one real term from a subject syllabus. You see the term&apos;s topic
          as a clue and get 6 guesses, and every guess shows which letters are in the right place,
          which are in the term but elsewhere, and which aren&apos;t in it at all. It takes a minute
          or two, and it&apos;s active recall of exam vocabulary rather than rereading a glossary.
          There are {domains.length} subject domains, each with its own puzzle every day:
        </p>
        <ul className="tool-about__links">
          {domains.map(d => (
            <li key={d.slug}>
              <Link href={`/games/crumb/${d.slug}`}>{d.label}</Link>
              {CRUMB_INFO[d.slug] && <span className="tool-about__p">{` · ${CRUMB_INFO[d.slug].noun} terms`}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
