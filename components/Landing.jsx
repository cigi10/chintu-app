"use client";

import "@/styles/landing.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Companion from "@/components/Companion";

const THEME_KEY = "chintu-theme";

// Cycled in the hero via a plain sprite swap - same approach as the
// dashboard's IDLE_POSES and StudyTimer's mood art, no transition/remount.
// Kept to inviting/curious moods on purpose — no "worried" or "sleepy"
// here, this is the first thing a new visitor sees.
const HERO_MOODS = ["waiting", "curious", "happy", "thoughtful", "surprised", "celebrating"];
const HERO_MOOD_INTERVAL_MS = 3200;

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
    desc: "Timetable, syllabus tracker, revision queue, mock scores, and tasks, all connected.",
  },
  {
    title: "Built for real exam prep",
    desc: "JEE, NEET, SAT, ACT, A Levels, GCSEs, Gaokao, GRE, GMAT, placements, or your own custom plan.",
  },
];

export default function Landing() {
  const router = useRouter();
  const [heroMood, setHeroMood] = useState(HERO_MOODS[0]);

  useEffect(() => {
    let storedTheme = null;
    try {
      storedTheme = localStorage.getItem(THEME_KEY);
    } catch {}

    // Matches the palette landing.css already hardcodes (same lavender
    // primary, same indoor-bg.PNG), so a flash before the background image
    // paints is soft near-white instead of another theme's near-black.
    document.documentElement.setAttribute("data-theme", "sunset");

    return () => {
      try {
        document.documentElement.setAttribute("data-theme", storedTheme || "sunset");
      } catch {}
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % HERO_MOODS.length;
      setHeroMood(HERO_MOODS[i]);
    }, HERO_MOOD_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

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
            <Companion mood={heroMood} />
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
          Free to use. Takes 10 seconds with Google, your progress syncs across every device.
        </p>
      </footer>
    </div>
  );
}