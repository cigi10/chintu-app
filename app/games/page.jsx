import Link from "next/link";
import { GAME_FAMILIES } from "@/lib/games";
import "@/styles/quiz.css";
import "@/styles/button.css";

export const metadata = {
  title: "Studyloaf: Games",
  description: "Studyloaf's study games: Crumb, a daily term-guessing game with colored letter feedback, for NEET, JEE, CLAT, and more.",
  openGraph: {
    title: "Studyloaf: Games",
    description: "Studyloaf's study games: Crumb, a daily term-guessing game with colored letter feedback, for NEET, JEE, CLAT, and more.",
  },
};

export default function GamesIndexPage() {
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
    </div>
  );
}
