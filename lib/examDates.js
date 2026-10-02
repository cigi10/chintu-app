// lib/examDates.js
//
// Single source of truth for exam dates: the /countdown flip-clock page
// and every /countdown/[exam] page read from here, so a date only ever
// needs updating in one place.
//
// Each exam has two possible dates:
//
//   date      The OFFICIAL date (ISO "YYYY-MM-DD"), confirmed by the
//             conducting body. Only fill this in from a sourced, official
//             notification, and note the source next to it. Once set, the
//             countdown runs to it with no "estimated" label.
//
//   estimate  Used only while `date` is null: a date derived from the
//             exam's historical timing (or a body's explicitly tentative
//             calendar), plus a `basis` sentence shown to visitors saying
//             where the estimate comes from. Pages always pair it with an
//             "Estimated date, official date yet to be announced" notice.
//
// `about` is the server-rendered description shown on the countdown pages:
// a one-line `summary`, who sits the exam, its format, what it leads to,
// and the `source` it was checked against. Re-check it when a new cycle's
// official bulletin comes out.
//
// `time` is the usual start time in IST (24h), so the countdown runs to
// the moment the paper starts, not midnight. For multi-day exams, `date`
// and `estimate.date` are the FIRST exam day.
//
// Last checked against official sources: 2 October 2026.

const SUNDAY = 0;

/** ISO date of the nth `weekday` (0 = Sunday) of `month` (1-12) in `year`. */
export function nthWeekdayOfMonth(year, month, weekday, n) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export const EXAM_DATES = [
  {
    slug: "clat-2027",
    name: "CLAT 2027",
    body: "Consortium of National Law Universities",
    officialUrl: "https://consortiumofnlus.ac.in/",
    // Consortium press release, 22 July 2026: "Sunday, 6th December, 2026,
    // from 2:00 p.m. to 4:00 p.m."
    date: "2026-12-06",
    time: "14:00",
    about: {
      summary: "The entrance test for five-year integrated law degrees and the LLM at member National Law Universities.",
      who: [
        "UG: students who have passed Class 12, or are appearing for it in 2027, with at least 45% (40% for SC and ST candidates). There is no upper age limit",
        "PG: law graduates applying for the one-year LLM",
      ],
      format: [
        "UG: 120 one-mark multiple-choice questions in 2 hours, on paper, built around reading passages",
        "Five sections: English Language, Current Affairs including General Knowledge, Legal Reasoning, Logical Reasoning and Quantitative Techniques",
        "A wrong answer costs 0.25 marks",
      ],
      leadsTo: "Admission to five-year integrated LLB programmes (BA LLB and similar) and the LLM at the Consortium's member National Law Universities, plus other universities that accept CLAT scores. NLU Delhi is not a member and admits through its own test, AILET.",
      source: "Consortium of NLUs press release (22 July 2026) for the date; the format is the CLAT 2026 pattern, since the full CLAT 2027 notification is still to come.",
    },
  },
  {
    // Slug predates the session split and is already indexed, so it stays.
    slug: "jee-2027",
    name: "JEE Main 2027 (Session 1)",
    body: "National Testing Agency (NTA)",
    officialUrl: "https://jeemain.nta.nic.in/",
    // NTA's exam calendar (16 Sept 2026) lists 22-24 and 28-30 Jan 2027 but
    // explicitly calls its dates tentative, so it stays an estimate until
    // the JEE Main 2027 information bulletin confirms it.
    date: null,
    time: "09:00",
    estimate: {
      date: "2027-01-22",
      basis: "NTA's tentative exam calendar (published 16 September 2026) lists 22 to 24 and 28 to 30 January 2027.",
    },
    about: {
      summary: "NTA's national engineering entrance test, sat in January and again in April, and the gateway to JEE Advanced.",
      who: [
        "Students who passed Class 12 in 2025 or 2026, or are appearing for it in 2027. There is no age limit",
        "You can sit one session or both; only the better of your two scores counts",
      ],
      format: [
        "Paper 1 (B.E./B.Tech): 75 questions in 3 hours, 25 each in Physics, Chemistry and Mathematics, for 300 marks, on a computer at a test centre",
        "Each subject has 20 multiple-choice questions and 5 numerical-answer questions, all compulsory",
        "+4 for a correct answer and -1 for a wrong one, numericals included. Paper 2A (B.Arch) and 2B (B.Planning) are separate papers",
      ],
      leadsTo: "Admission to NITs, IIITs and other centrally funded institutes through JoSAA, to many state and private engineering colleges, and eligibility for JEE Advanced, which is open to roughly the top 2,50,000 Paper 1 candidates.",
      source: "NTA JEE (Main) information bulletin and exam calendar; the JEE Advanced cutoff is from the JEE (Advanced) 2026 brochure.",
    },
  },
  {
    slug: "gate-2027",
    name: "GATE 2027",
    body: "IIT Madras, for the GATE organising committee",
    officialUrl: "https://gate2027.iitm.ac.in/",
    // gate2027.iitm.ac.in: 6, 7, 13, 14, 20 and 21 February 2027.
    date: "2027-02-06",
    time: "09:30",
    about: {
      summary: "The national postgraduate engineering and science test, used for M.Tech, MS and PhD admissions and by several public sector employers.",
      who: [
        "Students in the third or higher year of any undergraduate degree, or graduates, in engineering, technology, architecture, science, commerce, arts or humanities",
        "There is no age limit, and you can sit one paper or an approved combination of two",
      ],
      format: [
        "3 hours, 65 questions, 100 marks, on a computer",
        "10 General Aptitude questions (15 marks) plus 55 subject questions; most engineering papers include 13 marks of engineering mathematics",
        "Multiple-choice, multiple-select and numerical-answer questions, across 30 subject papers",
      ],
      leadsTo: "Master's and direct PhD admissions at IITs, IISc, NITs and other institutes, usually with a government scholarship, plus recruitment by several public sector undertakings. A GATE score stays valid for three years.",
      source: "GATE 2027 information brochure, IIT Madras (revised 27 September 2026).",
    },
  },
  {
    slug: "jee-main-2027-session-2",
    name: "JEE Main 2027 (Session 2)",
    body: "National Testing Agency (NTA)",
    officialUrl: "https://jeemain.nta.nic.in/",
    date: null,
    time: "09:00",
    estimate: {
      date: "2027-04-02",
      basis: "Session 2 began on 2 April in both 2025 and 2026, and has run in the first half of April every year since 2024.",
    },
    about: {
      summary: "The April sitting of JEE Main: the same exam as Session 1, and a second chance, since only your better score counts.",
      who: [
        "The same candidates as Session 1, whether or not they sat it",
        "Taking it can't lower your result: NTA ranks you on the better of your two NTA Scores",
      ],
      format: [
        "Identical to Session 1: 75 compulsory questions in 3 hours for 300 marks, on a computer",
        "20 multiple-choice and 5 numerical-answer questions per subject, +4 for correct and -1 for wrong",
        "Scores are normalised by percentile within each shift, then merged with Session 1",
      ],
      leadsTo: "After Session 2, NTA publishes the final All India Ranks from both sessions combined. Those ranks drive JoSAA counselling for NITs and IIITs and decide who qualifies for JEE Advanced.",
      source: "NTA JEE (Main) information bulletin; the date is estimated from 2025 and 2026, when Session 2 began on 2 April.",
    },
  },
  {
    slug: "neet-2027",
    name: "NEET UG 2027",
    body: "National Testing Agency (NTA)",
    officialUrl: "https://neet.nta.nic.in/",
    date: null,
    time: "14:00",
    estimate: {
      date: nthWeekdayOfMonth(2027, 5, SUNDAY, 1),
      basis: "NEET UG is held on the first Sunday of May: 7 May 2023, 5 May 2024, 4 May 2025 and 3 May 2026.",
    },
    about: {
      summary: "The single national entrance test for MBBS, BDS and AYUSH degrees in India, moving to computer-based testing from 2027.",
      who: [
        "Students who have passed Class 12, or are appearing for it, with Physics, Chemistry, Biology or Biotechnology, and English",
        "At least 50% in Physics, Chemistry and Biology together (40% for SC, ST and OBC, 45% for General PwD), and at least 17 years old by 31 December of the admission year. There is no upper age limit",
      ],
      format: [
        "180 questions in 3 hours for 720 marks: 45 Physics, 45 Chemistry and 90 Biology, all compulsory",
        "+4 for a correct answer and -1 for a wrong one",
        "Computer-based from 2027, after the Union Education Minister announced the switch from pen and paper in May 2026",
      ],
      leadsTo: "Admission to MBBS, BDS and AYUSH degrees (BAMS, BUMS, BSMS, BHMS) through All India Quota counselling by MCC and state counselling, and to some veterinary and nursing courses.",
      source: "NTA NEET (UG) 2026 information bulletin for eligibility and format; the 2027 bulletin is still to come.",
    },
  },
  {
    slug: "jee-advanced-2027",
    name: "JEE Advanced 2027",
    body: "IIT Delhi, for the Joint Admission Board",
    officialUrl: "https://jeeadv.ac.in/",
    date: null,
    time: "09:00",
    estimate: {
      date: nthWeekdayOfMonth(2027, 5, SUNDAY, 3),
      basis: "JEE Advanced has moved earlier each year (4 June 2023, 26 May 2024) and was held on the third Sunday of May in both 2025 and 2026.",
    },
    about: {
      summary: "The IIT entrance exam, open only to the top JEE Main candidates and conducted by one IIT in rotation.",
      who: [
        "Roughly the top 2,50,000 candidates in JEE Main Paper 1, across all categories",
        "Under the 2026 rules: born on or after 1 October 2001 (five years' relaxation for SC, ST and PwD), and no more than two attempts in two consecutive years. The birth-date cutoff usually moves forward a year each cycle",
      ],
      format: [
        "Two compulsory papers of 3 hours each, on the same day, on a computer",
        "Question count and marking change every year and are only revealed in the paper itself",
        "Multiple-correct questions have carried partial marks in recent papers",
      ],
      leadsTo: "Admission to the IITs through JoSAA, which also needs 75% in Class 12 (65% for SC, ST and PwD) or a place in your board's top 20 percentile. IISc Bengaluru, several IISERs, IIST, RGIPT and IIPE also use JEE Advanced ranks.",
      source: "JEE (Advanced) 2026 information brochure, IIT Roorkee. IIT Delhi organises the 2027 exam.",
    },
  },
  {
    slug: "upsc-prelims-2027",
    name: "UPSC CSE Prelims 2027",
    body: "Union Public Service Commission (UPSC)",
    officialUrl: "https://upsc.gov.in/",
    // UPSC Annual Calendar 2027 (released 20 May 2026): Civil Services
    // (Preliminary) Examination on 23 May 2027.
    date: "2027-05-23",
    time: "09:30",
    about: {
      summary: "The first stage of UPSC's Civil Services Examination, which recruits for the IAS, IPS, IFS and other central services.",
      who: [
        "Graduates (or final-year students) aged 21 to 32 on 1 August of the exam year, with age relaxation for reserved categories",
        "Six attempts for General and EWS candidates, nine for OBC, and unlimited within the age limit for SC and ST",
      ],
      format: [
        "Two objective papers on the same day, 2 hours each: General Studies Paper I (100 questions, 200 marks) and CSAT Paper II (80 questions, 200 marks)",
        "CSAT is qualifying only: you need 33%, and your General Studies score decides who moves on",
        "A wrong answer costs a third of the marks for that question",
      ],
      leadsTo: "Prelims only decides who goes on to the Mains written exam and then the personality test; its marks don't count towards the final rank. The final list fills the IAS, IPS, IFS and other Group A and B central services.",
      source: "UPSC Annual Calendar 2027 for the date, and the Civil Services Examination rules for the scheme.",
    },
  },
];

export function getExamDates() {
  return EXAM_DATES;
}

export function getExamBySlug(slug) {
  return EXAM_DATES.find(exam => exam.slug === slug);
}

export function getExamSlugs() {
  return EXAM_DATES.map(exam => exam.slug);
}

/**
 * What a countdown should run to: the official date if there is one,
 * otherwise the estimate. Returns null if the exam has neither.
 * `target` is the ISO instant (IST) the paper starts.
 */
export function getCountdownTarget(exam) {
  const isEstimate = !exam.date;
  const date = exam.date ?? exam.estimate?.date;
  if (!date) return null;
  return {
    date,
    target: `${date}T${exam.time ?? "00:00"}:00+05:30`,
    isEstimate,
    basis: isEstimate ? exam.estimate.basis : null,
  };
}

/** e.g. "Sunday, 6 December 2026", formatted for IST regardless of server timezone. */
export function formatExamDate(isoDate) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
  }).format(new Date(`${isoDate}T12:00:00+05:30`));
}

export const ESTIMATE_NOTICE = "Estimated date, official date yet to be announced";
