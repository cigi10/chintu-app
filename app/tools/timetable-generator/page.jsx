import Navbar from "@/components/Navbar";
import Link from "next/link";
import TimetableGenerator from "@/components/TimetableGenerator";
import BlogTable from "@/components/BlogTable";
import "@/styles/blog.css";

// The generator itself is a client component, so without this copy the
// server HTML is only a form. Everything below describes what
// buildTimetable in components/TimetableGenerator.jsx actually does
// (weights 5:4:3:2:1, split per day among the subjects free that day,
// quarter-hour rounding with the top-priority subject absorbing the
// remainder). Update it if that logic changes.
const EXAMPLE_WEEKDAY = {
  caption: "6 hours on a weekday, all three subjects free",
  columns: ["Subject", "Priority (weight)", "Share", "Time"],
  rows: [
    ["Physics", "Very High (5)", "5/12", "2h 30m"],
    ["Maths", "High (4)", "4/12", "2h"],
    ["Chemistry", "Medium (3)", "3/12", "1h 30m"],
  ],
};

const EXAMPLE_SATURDAY = {
  caption: "6 hours on Saturday, Chemistry not free",
  columns: ["Subject", "Priority (weight)", "Share", "Time"],
  rows: [
    ["Physics", "Very High (5)", "5/9", "3h 15m"],
    ["Maths", "High (4)", "4/9", "2h 45m"],
  ],
};

export const metadata = {
  title: "Free Timetable Generator - Studyloaf",
  description: "Enter your subjects, hours per day, and exam date to generate a simple weekly study timetable. No login required.",
  openGraph: {
    title: "Free Timetable Generator - Studyloaf",
    description: "Enter your subjects, hours per day, and exam date to generate a simple weekly study timetable. No login required.",
  },
  alternates: { canonical: "/tools/timetable-generator" },
};

export default function TimetableGeneratorPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="blog-shell">
          <div className="blog-header">
            <h1 className="blog-title">Timetable Generator</h1>
            <p className="blog-subtitle">
              Enter your subjects, hours available per day, and your exam date. Nothing is saved anywhere.
            </p>
          </div>
          <TimetableGenerator />

          <article className="blog-post">
            <div className="blog-post-section">
              <h2 className="blog-post-heading">How the timetable is worked out</h2>
              <ol className="blog-post-list">
                <li>Each priority level has a weight: Very High 5, High 4, Medium 3, Low 2, Very Low 1.</li>
                <li>
                  For each day of the week, only the subjects you marked free that day are scheduled.
                  A subject with no days ticked counts as free every day.
                </li>
                <li>
                  That day&apos;s hours are split between those subjects in proportion to their
                  weights, so a Very High subject gets five times the time of a Very Low one on the
                  same day.
                </li>
                <li>
                  Every block is rounded to the nearest 15 minutes. If rounding leaves the day a few
                  minutes over or under, the highest-priority subject that day takes up the
                  difference, so each day adds up to exactly the hours you entered.
                </li>
              </ol>
            </div>

            <div className="blog-post-section">
              <h2 className="blog-post-heading">Worked example</h2>
              <p className="blog-post-p">
                Say you have 6 hours a day, with Physics at Very High, Maths at High and Chemistry at
                Medium, and Chemistry coaching takes up your Saturdays. On a normal weekday the
                weights add up to 5 + 4 + 3 = 12, so each subject gets its weight out of 12:
              </p>
              <BlogTable table={EXAMPLE_WEEKDAY} id="timetable-example-weekday" />
              <p className="blog-post-p">
                On Saturday only Physics and Maths are free, so the same 6 hours are split 5 : 4
                between them instead. Physics works out to 3h 20m and Maths to 2h 40m, which round
                to the nearest quarter hour:
              </p>
              <BlogTable table={EXAMPLE_SATURDAY} id="timetable-example-saturday" />
            </div>

            <div className="blog-post-section">
              <h2 className="blog-post-heading">Choosing priorities</h2>
              <ul className="blog-post-list">
                <li>
                  <strong>Rank by marks at stake, then by weakness.</strong> A high-weightage subject
                  you&apos;re weak in deserves Very High. A subject you&apos;re already strong in can
                  drop a level even if it carries a lot of marks.
                </li>
                <li>
                  <strong>Keep the spread honest.</strong> If every subject is Very High, the split is
                  even and the priorities stop doing anything. Use at least two different levels.
                </li>
                <li>
                  <strong>Use free days for fixed commitments.</strong> Untick a subject on the days
                  coaching, school or a part-time job already covers it, rather than lowering its
                  priority for the whole week.
                </li>
                <li>
                  <strong>Enter the hours you will actually study.</strong> A realistic 4 hours you
                  keep beats an 8-hour plan you abandon by Wednesday. Raise it once the first week
                  holds.
                </li>
              </ul>
            </div>

            <div className="blog-post-section">
              <h2 className="blog-post-heading">What happens to your timetable</h2>
              <p className="blog-post-p">
                Nothing you enter is saved or sent anywhere: the timetable is built in your browser.
                You can copy it or download it as a text file. The exam date is optional and only
                adds a days-remaining line to the result, it doesn&apos;t change the split.
              </p>
            </div>

            <div className="blog-post-related">
              <h2 className="blog-post-heading">Continue learning</h2>
              <p className="blog-post-p">
                A timetable is only the plan. These cover making one you can keep to, and what to
                change as the exam gets close.
              </p>
              <ul className="blog-post-related-list">
                <li><Link href="/blog/5-rules-jee-neet-study-timetable-no-burnout">5 Rules for a JEE/NEET Study Timetable That Doesn&apos;t Burn You Out</Link></li>
                <li><Link href="/blog/jee-neet-last-30-days-revision-plan">How to Revise Your Entire JEE/NEET Syllabus in the Last 30 Days</Link></li>
                <li><Link href="/countdown">Exam countdowns</Link></li>
              </ul>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
