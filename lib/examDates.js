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
  },
  {
    slug: "gate-2027",
    name: "GATE 2027",
    body: "IIT Madras, for the GATE organising committee",
    officialUrl: "https://gate2027.iitm.ac.in/",
    // gate2027.iitm.ac.in: 6, 7, 13, 14, 20 and 21 February 2027.
    date: "2027-02-06",
    time: "09:30",
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
