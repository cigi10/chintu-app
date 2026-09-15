// lib/examDates.js
//
// Target dates for the /countdown/[exam] pages. Only fill in `date` once
// it is an officially confirmed date from the exam's conducting body. A
// wrong, confident-looking date is worse than an honest "not yet
// announced" state, since visitors would plan around it.
//
// As of this writing (September 2026), none of JEE Main 2027, NEET 2027,
// or GATE 2027 have an officially confirmed exam date yet. NTA has not
// even released the 2027 syllabi for JEE/NEET yet (see the syllabus
// review notes elsewhere in this project), so their exact exam dates are
// well out of reach of a confident guess. GATE dates are normally
// announced a few months ahead of the exam via the official portal, and
// that announcement hadn't happened as of this writing either. Update
// `date` to a real ISO date string (e.g. "2027-02-06") only once you have
// a sourced, official notification. The page already handles a `null`
// date by showing "not yet announced" instead of a countdown.
export const EXAM_DATES = [
  {
    slug: "jee-2027",
    name: "JEE Main 2027",
    date: null, // TODO: not yet officially announced by NTA
  },
  {
    slug: "neet-2027",
    name: "NEET 2027",
    date: null, // TODO: not yet officially announced by NTA
  },
  {
    slug: "gate-2027",
    name: "GATE 2027",
    date: null, // TODO: not yet officially announced by IIT Madras (host institute for GATE 2027)
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
