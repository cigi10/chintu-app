import Link from "next/link";
import RichText from "@/components/RichText";
import { getExamBySlug } from "@/lib/examDates";
import { getSyllabusSource } from "@/lib/syllabusSources";
import { NAV } from "@/lib/navItems";

export type ExamInfo = {
  // Only what the cited sources actually list (see lib/syllabusSources.js).
  note: string;
  // lib/examDates slugs. Empty when no countdown fits (e.g. a board-only
  // topic); the countdown index is linked instead.
  countdowns: string[];
  // lib/syllabusSources keys the note was checked against.
  sources: string[];
};

// The standard "Where this comes up in exams" section on resource pages:
// the sourced note, the official documents it was checked against, and
// the same three planning links on every page (timetable generator,
// syllabus tracker, exam countdowns).
export default function ExamSection({ exam }: { exam: ExamInfo }) {
  const countdowns = exam.countdowns.map(slug => getExamBySlug(slug)!);
  const sources = exam.sources.map(key => getSyllabusSource(key)!);

  return (
    <div className="blog-post-section resource-section">
      <h2 className="blog-post-heading">Where this comes up in exams</h2>
      <p className="blog-post-p"><RichText text={exam.note} /></p>
      <p className="blog-post-p">
        Checked against{" "}
        {sources.map((source, i) => (
          <span key={source.href}>
            {i > 0 && (i === sources.length - 1 ? " and " : ", ")}
            <a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a>
          </span>
        ))}
        . Syllabi can change from year to year, so confirm with the latest official notification
        for your exam.
      </p>
      <ul className="blog-post-list">
        <li>
          Fit it into your week with the free{" "}
          <Link href={NAV.timetableGenerator.href}>timetable generator</Link>.
        </li>
        <li>
          Mark it off as you revise in the <Link href={NAV.tracker.href}>syllabus tracker</Link>.
        </li>
        <li>
          See how long you have left:{" "}
          {countdowns.length === 0 ? (
            <Link href={NAV.countdown.href}>exam countdowns</Link>
          ) : (
            countdowns.map((countdown, i) => (
              <span key={countdown.slug}>
                {i > 0 && (i === countdowns.length - 1 ? " and " : ", ")}
                <Link href={`/countdown/${countdown.slug}`}>{countdown.name} countdown</Link>
              </span>
            ))
          )}
          .
        </li>
      </ul>
    </div>
  );
}
