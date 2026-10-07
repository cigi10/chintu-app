import Link from "next/link";
import {
  GATE_2027_KEY_DATES, GATE_2027_IMPORTANT_DATES, GATE_2027_BROCHURE, GATE_2027_LAST_VERIFIED, getGate2027Stage,
} from "@/lib/gate2027";
import { formatExamDate } from "@/lib/examDates";
import "@/styles/countdown.css";
import "@/styles/gate.css";

// Server-rendered GATE 2027 blocks shared by /countdown/gate-2027 and the
// /gate hub. Registration is a link to the official deadline, never a date
// (see lib/gate2027.js for why).

export function GateRegistrationNotice() {
  return (
    <div className="exam-countdown-card__notice gate-registration">
      <p className="exam-countdown-card__notice-title">Registration deadlines change.</p>
      <p>
        GATE 2027 registration dates have been revised more than once.{" "}
        <a href={GATE_2027_IMPORTANT_DATES} target="_blank" rel="noopener noreferrer">
          Check the official site for the current deadline
        </a>{" "}
        before you plan around it.
      </p>
    </div>
  );
}

export function GateKeyDates({ headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;
  return (
    <section className="exam-about" aria-labelledby="gate-key-dates-heading">
      <Heading id="gate-key-dates-heading" className="exam-about__heading">GATE 2027 key dates</Heading>
      <table className="gate-dates">
        <tbody>
          {GATE_2027_KEY_DATES.map(row => (
            <tr key={row.id}>
              <th scope="row">{row.label}</th>
              <td>{row.display}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <GateRegistrationNotice />
      <p className="exam-about__source">
        Source:{" "}
        <a href={GATE_2027_IMPORTANT_DATES} target="_blank" rel="noopener noreferrer">GATE 2027 Important Dates</a>{" "}
        and the{" "}
        <a href={GATE_2027_BROCHURE} target="_blank" rel="noopener noreferrer">GATE 2027 information brochure</a>
        , IIT Madras. These dates apply to GATE 2027. Last verified {formatExamDate(GATE_2027_LAST_VERIFIED)}.
      </p>
    </section>
  );
}

function Step({ step }) {
  if (!step.href) return step.text;
  if (step.external) {
    return <a href={step.href} target="_blank" rel="noopener noreferrer">{step.text}</a>;
  }
  return <Link href={step.href}>{step.text}</Link>;
}

export function GateThisWeek({ now, headingLevel = 2 }) {
  const stage = getGate2027Stage(now);
  if (!stage) return null;
  const Heading = `h${headingLevel}`;
  return (
    <section className="exam-about gate-week" aria-labelledby="gate-week-heading">
      <Heading id="gate-week-heading" className="exam-about__heading">What to do this week</Heading>
      <p className="gate-week__stage">{stage.title}</p>
      <ul className="exam-about__list">
        {stage.steps.map(step => <li key={step.text}><Step step={step} /></li>)}
      </ul>
    </section>
  );
}
