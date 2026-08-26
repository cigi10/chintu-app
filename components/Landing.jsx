"use client";

import "@/styles/landing.css";
import { useRouter } from "next/navigation";
import Companion from "@/components/Companion";

const FEATURES = [
  {
    title: "A timer that keeps you company",
    desc: "Study sessions, breaks, and a companion who sits with you through both.",
  },
  {
    title: "No shame, ever",
    desc: "Miss a day and nothing breaks. Your companion just waits for you to come back.",
  },
  {
    title: "Everything in one place",
    desc: "Timetable, syllabus tracker, revision queue, mock scores, and to-dos, all connected.",
  },
  {
    title: "Built for real exam prep",
    desc: "JEE, NEET, SAT, ACT, A-Levels, GCSEs, Gaokao, GRE, GMAT, placements, or your own custom plan.",
  },
];

export default function Landing() {
  const router = useRouter();

  return (
    <div className="landing">
      <section className="landing__hero">

        <div className="landing__hero-text">

          <h1 className="landing__title">
            Studyloaf
          </h1>

          <p className="landing__tagline">
            A study companion, not a coach.
          </p>

          <div className="landing__hero-companion">
            <Companion mood="waiting" />
          </div>

          <p className="landing__subtext">
            Preparing for a big exam can feel lonely.
            Your companion quietly studies alongside you, remembers the small things,
            keeps track of the boring logistics, and never makes you feel bad
            for having an off day.
          </p>

          <button
            className="landing__cta"
            onClick={() => router.push("/login")}
          >
            Sign in to get started
          </button>

          <p className="landing__cta-note">
            Takes 10 seconds with Google. Your progress syncs across devices.
          </p>

        </div>

      </section>

      <section className="landing__features">

        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="landing__feature-card"
          >
            <h3 className="landing__feature-title">
              {feature.title}
            </h3>

            <p className="landing__feature-desc">
              {feature.desc}
            </p>
          </article>
        ))}

      </section>

      <footer className="landing__footer">
        <p className="landing__footer-note">
          Free to use. Sign in with Google to save your progress.
        </p>
      </footer>
    </div>
  );
}