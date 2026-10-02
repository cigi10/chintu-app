import Link from "next/link";
import Navbar from "@/components/Navbar";
import FlipClock from "@/components/FlipClock";
import { getExamDates, getCountdownTarget, formatExamDate, ESTIMATE_NOTICE } from "@/lib/examDates";
import "@/styles/blog.css";
import "@/styles/countdown.css";

const DESCRIPTION = "Live flip-clock countdowns to JEE Main, JEE Advanced, NEET UG, CLAT, GATE and UPSC Prelims, with official dates where announced and clearly marked estimates where not.";

export const metadata = {
  title: "Exam Countdowns - Studyloaf",
  description: DESCRIPTION,
  openGraph: {
    title: "Exam Countdowns - Studyloaf",
    description: DESCRIPTION,
  },
  alternates: { canonical: "/countdown" },
};

export default function CountdownIndexPage() {
  // Soonest exam first. Everything else on the card is server-rendered;
  // only the ticking tiles need the client.
  const exams = getExamDates()
    .map(exam => ({ exam, countdown: getCountdownTarget(exam) }))
    .filter(({ countdown }) => countdown)
    .sort((a, b) => a.countdown.target.localeCompare(b.countdown.target));

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <div className="blog-header">
          <h1 className="blog-title">Exam Countdowns</h1>
          <p className="blog-subtitle">
            Every major exam on one page, counting down to the minute the first paper starts (IST).
          </p>
        </div>

        <div className="exam-countdowns">
          {exams.map(({ exam, countdown }) => (
            <section key={exam.slug} className="exam-countdown-card" aria-labelledby={`${exam.slug}-title`}>
              <div className="exam-countdown-card__head">
                <h2 id={`${exam.slug}-title`} className="exam-countdown-card__title">
                  <Link href={`/countdown/${exam.slug}`}>{exam.name}</Link>
                </h2>
                <p className="exam-countdown-card__date">
                  {formatExamDate(countdown.date)}
                  {countdown.isEstimate && <span className="exam-countdown-card__badge">Estimated</span>}
                </p>
              </div>

              <div className="flip-clock-wrap">
                <FlipClock target={countdown.target} label={exam.name} />
              </div>

              {countdown.isEstimate ? (
                <div className="exam-countdown-card__notice">
                  <p className="exam-countdown-card__notice-title">{ESTIMATE_NOTICE}.</p>
                  <p>{countdown.basis}</p>
                </div>
              ) : (
                <p className="exam-countdown-card__source">Official date, announced by {exam.body}.</p>
              )}

              <p className="exam-countdown-card__links">
                <Link href={`/countdown/${exam.slug}`}>Full countdown</Link>
                <a href={exam.officialUrl} target="_blank" rel="noopener noreferrer">Official website</a>
              </p>
            </section>
          ))}
        </div>

        <div className="exam-countdowns__about">
          <h2 className="exam-countdowns__about-title">How these dates are kept</h2>
          <p>
            A countdown only runs to an official date once the conducting body (NTA, the IIT
            organising GATE or JEE Advanced, the Consortium of NLUs, or UPSC) has published it.
            Until then it runs to an estimate based on when the exam has been held in recent
            years, labelled as an estimate with the reasoning shown, and switches to the official
            date as soon as it is announced. For multi-day exams the countdown is to the first
            day. Always confirm your own exam date and shift on your admit card.
          </p>
        </div>
      </div>
    </>
  );
}
