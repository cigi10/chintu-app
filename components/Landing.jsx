"use client";

import "@/styles/landing.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import Companion from "@/components/Companion";
import Navbar from "@/components/Navbar";

const THEME_KEY = "chintu-theme";

// Cycled in the hero via a plain sprite swap - same approach as the
// dashboard's IDLE_POSES and StudyTimer's mood art, no transition/remount.
// Kept to inviting/curious moods on purpose — no "worried" or "sleepy"
// here, this is the first thing a new visitor sees.
const HERO_MOODS = ["waiting", "curious", "happy", "thoughtful", "surprised", "celebrating"];
const HERO_MOOD_INTERVAL_MS = 3200;

// The public, no-login tools — every one of these works instantly with
// nothing to sign up for, so the hero CTA's "no signup needed" promise
// holds even for a visitor who never creates an account.
const TRY_IT_TOOLS = [
  { href: "/timer", title: "Focus Timer", desc: "A companion-backed Pomodoro timer with a progress toast that browns as you study." },
  { href: "/tools/timetable-generator", title: "Timetable Generator", desc: "Enter your subjects and priorities, get a weekly plan in seconds." },
  { href: "/countdown", title: "Exam Countdown", desc: "A live countdown to JEE, NEET, or GATE." },
  { href: "/quiz", title: "Daily Quiz", desc: "A quick daily challenge or practice quiz across six subjects." },
];

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

export default function Landing({ recentPosts = [] }) {
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
    <>
      <Navbar />
      <div className="landing">
        <section className="landing__hero">

          <div className="landing__hero-text">

            <h1 className="landing__title">
              Studyloaf
            </h1>

            <p className="landing__tagline">
              Your study bestie that doesn&apos;t guilt-trip you.
            </p>

            <div className="landing__hero-companion">
              <Companion mood={heroMood} />
            </div>

            <p className="landing__subtext">
              Time your focus sessions, break your syllabus into portions you can actually
              finish, and never feel guilty about an off day. No signup needed to start,
              your companion is ready right now.
            </p>

            <Link href="/dashboard" className="landing__cta">
              Start studying
            </Link>

          </div>

        </section>

        <section className="landing__section">
          <h2 className="landing__section-heading">Try it now, no account needed</h2>
          <div className="landing__tools-grid">
            {TRY_IT_TOOLS.map(tool => (
              <Link key={tool.href} href={tool.href} className="landing__tool-card">
                <h3 className="landing__tool-title">{tool.title}</h3>
                <p className="landing__tool-desc">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {recentPosts.length > 0 && (
          <section className="landing__section">
            <h2 className="landing__section-heading">From the Blog</h2>
            <div className="landing__blog-grid">
              {recentPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="landing__blog-card">
                  <h3 className="landing__tool-title">{post.title}</h3>
                  <p className="landing__tool-desc">{post.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="landing__section">
          <h2 className="landing__section-heading">Want the fuller experience?</h2>
          <p className="landing__subtext landing__more-intro">
            Create a free account and your progress syncs across every device: streaks,
            coins, achievements, study rooms, and your companion&apos;s wardrobe all come with you.
          </p>
          <div className="landing__features">
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
          </div>
          <Link href="/login" className="landing__cta landing__cta--secondary">
            Create a free account
          </Link>
        </section>
      </div>
    </>
  );
}
