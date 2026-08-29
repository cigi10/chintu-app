"use client";
import "@/styles/tutorial.css";
import Link from "next/link";
import {
  Cat, Coins, Flame, Timer, ListTodo, CalendarClock, Target, BookOpen,
  RotateCcw, ClipboardCheck, Users, NotebookPen, BarChart3, Trophy, ShoppingBag,
} from "lucide-react";
import Companion from "@/components/Companion";

const BASICS = [
  {
    icon: Cat,
    title: "Your companion",
    body: "The cat on your dashboard reflects how your day is going: happy once you've studied, waiting if you haven't yet. It never judges an off day.",
  },
  {
    icon: Coins,
    title: "Coins",
    body: "Finish a study session or check off a task and you earn coins. Spend them in the Shop on outfits for your companion.",
  },
  {
    icon: Flame,
    title: "Streaks",
    body: "Counts the days you've shown up to study. Miss a day and nothing breaks. It just waits for you to come back.",
  },
];

const FEATURES = [
  {
    icon: Timer,
    title: "Timer",
    href: "/timer",
    body: "Pomodoro style study and break sessions. Add focus sounds (white, pink, brown noise, rain, ocean) or paste a YouTube link for music while you work.",
  },
  {
    icon: ListTodo,
    title: "Todo",
    href: "/todo",
    body: "A kanban board: To Do, In Progress, Done. Drag cards between columns, set a priority and due date, and jump straight into a timed session from any task.",
  },
  {
    icon: CalendarClock,
    title: "Timetable",
    href: "/timetable",
    body: "Block out a weekly study schedule in fixed time slots, so you always know what's next.",
  },
  {
    icon: Target,
    title: "Goals",
    href: "/goals",
    body: "Set a single or repeating study goal and check it off as you hit it.",
  },
  {
    icon: BookOpen,
    title: "Tracker",
    href: "/tracker",
    body: "Track your syllabus subject by subject, topic by topic, so you can see how much is actually left.",
  },
  {
    icon: RotateCcw,
    title: "Revisions",
    href: "/revisions",
    body: "A spaced repetition queue that resurfaces topics right before you'd normally start forgetting them.",
  },
  {
    icon: ClipboardCheck,
    title: "Mock tests",
    href: "/mocktests",
    body: "Log practice test scores and watch how they trend over time.",
  },
  {
    icon: Users,
    title: "Rooms",
    href: "/rooms",
    body: "Study alongside other people in a shared virtual room.",
  },
  {
    icon: NotebookPen,
    title: "Journal & Mood",
    href: "/journal",
    body: "Jot down how a session went, or just log how you're feeling. No pressure to write much.",
  },
  {
    icon: BarChart3,
    title: "Digest",
    href: "/digest",
    body: "A weekly summary of how much you studied and what you focused on.",
  },
  {
    icon: Trophy,
    title: "Stats & Achievements",
    href: "/stats",
    body: "Charts of your study time over the long term, plus badges for milestones you hit along the way.",
  },
  {
    icon: ShoppingBag,
    title: "Shop",
    href: "/shop",
    body: "Spend the coins you've earned on outfits for your companion.",
  },
];

export default function TutorialGuide() {
  return (
    <div className="tutorial">
      <section className="tutorial__hero">
        <div className="tutorial__hero-companion">
          <Companion mood="happy" />
        </div>
        <h1 className="tutorial__hero-title">New here? Here&apos;s how Studyloaf works</h1>
        <p className="tutorial__hero-subtitle">
          A study companion, not a coach. Here&apos;s the quick version of what everything does.
          Come back to this page any time.
        </p>
      </section>

      <section className="tutorial__section">
        <h2 className="tutorial__section-title">The basics</h2>
        <div className="tutorial__basics-grid">
          {BASICS.map(b => (
            <div key={b.title} className="card tutorial__basic-card">
              <div className="tutorial__icon-circle">
                <b.icon size={20} />
              </div>
              <p className="card-title">{b.title}</p>
              <p className="card-sub">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tutorial__section">
        <h2 className="tutorial__section-title">Where things live</h2>
        <div className="tutorial__features-grid">
          {FEATURES.map(f => (
            <Link key={f.title} href={f.href} className="card tutorial__feature-card">
              <div className="tutorial__icon-circle">
                <f.icon size={20} />
              </div>
              <p className="card-title">{f.title}</p>
              <p className="card-sub">{f.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="tutorial__cta">
        <Link href="/dashboard" className="btn btn--primary btn--lg">
          Got it, take me to my dashboard
        </Link>
      </section>
    </div>
  );
}
