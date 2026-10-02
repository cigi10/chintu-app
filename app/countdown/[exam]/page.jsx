import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import FlipClock from "@/components/FlipClock";
import { getExamBySlug, getExamSlugs, getCountdownTarget, formatExamDate, ESTIMATE_NOTICE } from "@/lib/examDates";
import "@/styles/blog.css";
import "@/styles/countdown.css";

export function generateStaticParams() {
  return getExamSlugs().map(exam => ({ exam }));
}

function describe(exam, countdown) {
  if (!countdown) return `Countdown to ${exam.name}.`;
  const when = formatExamDate(countdown.date);
  return countdown.isEstimate
    ? `Live countdown to ${exam.name}, estimated for ${when} until ${exam.body} announces the official date.`
    : `Live countdown to ${exam.name} on ${when}, the official date announced by ${exam.body}.`;
}

export async function generateMetadata({ params }) {
  const { exam: slug } = await params;
  const exam = getExamBySlug(slug);
  if (!exam) return {};
  const description = describe(exam, getCountdownTarget(exam));

  return {
    title: `${exam.name} Countdown - Studyloaf`,
    description,
    openGraph: {
      title: `${exam.name} Countdown - Studyloaf`,
      description,
    },
    alternates: { canonical: `/countdown/${exam.slug}` },
  };
}

export default async function ExamCountdownPage({ params }) {
  const { exam: slug } = await params;
  const exam = getExamBySlug(slug);
  if (!exam) notFound();
  const countdown = getCountdownTarget(exam);

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Exam Countdowns", href: "/countdown" },
          { label: exam.name, href: `/countdown/${exam.slug}` },
        ]} />
        <div className="blog-header">
          <h1 className="blog-title">{exam.name} Countdown</h1>
          <p className="blog-subtitle">{describe(exam, countdown)}</p>
        </div>

        {countdown ? (
          <section className="exam-countdown-card">
            <div className="exam-countdown-card__head">
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
              <a href={exam.officialUrl} target="_blank" rel="noopener noreferrer">Official website</a>
              <Link href="/countdown">All exam countdowns</Link>
            </p>
          </section>
        ) : (
          <p className="exam-countdown-card__source">
            {`The ${exam.name} date hasn't been announced yet. Check back once ${exam.body} confirms it.`}
          </p>
        )}

        {exam.about && (
          <section className="exam-about" aria-labelledby="exam-about-heading">
            <h2 id="exam-about-heading" className="exam-about__heading">About {exam.name}</h2>
            <p className="exam-about__summary">{exam.about.summary}</p>
            <h3 className="exam-about__subheading">Who takes it</h3>
            <ul className="exam-about__list">{exam.about.who.map(item => <li key={item}>{item}</li>)}</ul>
            <h3 className="exam-about__subheading">Format</h3>
            <ul className="exam-about__list">{exam.about.format.map(item => <li key={item}>{item}</li>)}</ul>
            <h3 className="exam-about__subheading">What it leads to</h3>
            <p className="exam-about__p">{exam.about.leadsTo}</p>
            <p className="exam-about__source">Source: {exam.about.source} Conducting body: {exam.body}.</p>
          </section>
        )}
      </div>
    </>
  );
}
