"use client";

import "@/styles/landing.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Companion from "@/components/Companion";
import { NAV } from "@/lib/navItems";

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

// Free, no-signup tools — the guest-mode-first pitch: you can try the
// actual product before ever creating an account.
const TRY_IT_TOOLS = [
  { href: NAV.timetableGenerator.href, title: "Timetable Generator", desc: "Build a study timetable in a couple of minutes." },
  { href: NAV.countdown.href, title: "Exam Countdown", desc: "See exactly how many days are left until your exam." },
  { href: NAV.quiz.href, title: "Daily Quiz", desc: "A quick daily challenge for JEE, NEET, and more." },
  { href: NAV.resources.href, title: "Quick Resources", desc: "Formulas and shortcuts you keep having to look up." },
];

export default function Landing({ recentPosts = [] }) {
  const router = useRouter();
  const [heroMood, setHeroMood] = useState(HERO_MOODS[0]);

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
    <>
      <Navbar />
      <div className="landing">
      <section className="landing__hero">

        <div className="landing__hero-text">

          <h1 className="landing__title">
            Your study bestie that doesn&apos;t guilt-trip you
          </h1>

          <p className="landing__tagline">
            A study companion, not a coach.
          </p>

          <div className="landing__hero-companion">
            <Companion mood={heroMood} />
          </div>

          <p className="landing__subtext">
            Timers that keep you focused, portions of your syllabus you can actually
            track, and zero guilt when a day slips. Your companion quietly studies
            alongside you and never makes you feel bad for having an off day.
          </p>

          <button
            className="landing__cta"
            onClick={() => router.push(NAV.home.href)}
          >
            Start studying free
          </button>
          <p className="landing__cta-note">No account needed: your progress is saved on this device.</p>

        </div>

      </section>

      <section className="landing__try-it">
        <h2 className="landing__section-title">Try it now, no sign-up</h2>
        <div className="landing__try-it-grid">
          {TRY_IT_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="landing__try-it-card">
              <h3 className="landing__try-it-title">{tool.title}</h3>
              <p className="landing__try-it-desc">{tool.desc}</p>
            </Link>
          ))}
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

      {recentPosts.length > 0 && (
        <section className="landing__blog">
          <h2 className="landing__section-title">From the blog</h2>
          <div className="landing__blog-grid">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="landing__blog-card">
                <h3 className="landing__blog-card-title">{post.title}</h3>
                <p className="landing__blog-card-desc">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="landing__fuller">
        <h2 className="landing__section-title">Want the fuller experience?</h2>
        <p className="landing__fuller-text">
          Sign in with Google and your timer sessions, tracker, goals, and achievements
          sync across every device: still no shame system, still the same companion.
        </p>
        <Link href={NAV.login.href} className="landing__fuller-link">
          Sign in to sync your progress →
        </Link>
      </section>

      <footer className="landing__footer">
        <p className="landing__footer-note">
          Free to use. Takes 10 seconds with Google, your progress syncs across every device.
        </p>
      </footer>
      </div>
    </>
  );
}
