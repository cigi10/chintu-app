// lib/gate2027.js
//
// GATE 2027 facts shown on /countdown/gate-2027 and the /gate hub. Every
// value here is copied from docs/gate2027-facts.md, which records where on
// the official site or brochure it came from. Change that file first.
//
// Registration dates are deliberately absent. They have been revised twice
// and two official pages disagree on the late-fee closing date, so pages
// link the official Important Dates page instead of quoting a deadline.

export const GATE_2027_SITE = "https://gate2027.iitm.ac.in/";
export const GATE_2027_IMPORTANT_DATES = "https://gate2027.iitm.ac.in/important_dates";
export const GATE_2027_BROCHURE = "https://gate2027ib.iitm.ac.in/GATE2027-IB.pdf";
export const GATE_2027_LAST_VERIFIED = "2026-10-07";

// The main facts, in date order. `date` is ISO so pages can tell which
// have passed; `display` is what readers see.
export const GATE_2027_KEY_DATES = [
  { id: "city", label: "Exam city allotment notified", date: "2027-01-04", display: "Monday, 4 January 2027" },
  { id: "admit", label: "Admit card download", date: null, display: "To be announced on the official site" },
  { id: "exam-1", label: "Exam weekend 1", date: "2027-02-06", display: "Saturday 6 and Sunday 7 February 2027" },
  { id: "exam-2", label: "Exam weekend 2", date: "2027-02-13", display: "Saturday 13 and Sunday 14 February 2027" },
  { id: "exam-3", label: "Exam weekend 3", date: "2027-02-20", display: "Saturday 20 and Sunday 21 February 2027" },
  { id: "results", label: "Results announced", date: "2027-03-19", display: "Friday, 19 March 2027" },
];

const syllabusPdf = code => `https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/${code}_GATE2027_Syllabus.pdf`;

// Official 2027 syllabus PDFs for the papers Studyloaf has tracker packs
// for (lib/examPacks.js), plus IN, which the circuit pages cite.
export const GATE_2027_SYLLABI = [
  { code: "CS", name: "Computer Science and Information Technology", href: syllabusPdf("CS") },
  { code: "EC", name: "Electronics and Communication Engineering", href: syllabusPdf("EC") },
  { code: "EE", name: "Electrical Engineering", href: syllabusPdf("EE") },
  { code: "ME", name: "Mechanical Engineering", href: syllabusPdf("ME") },
  { code: "BT", name: "Biotechnology", href: syllabusPdf("BT") },
  { code: "IN", name: "Instrumentation Engineering", href: syllabusPdf("IN") },
];

// Resource pages whose exam note cites a GATE 2027 syllabus.
// lib/gate2027.test.js checks each one exists and cites GATE 2027.
export const GATE_TOPIC_PAGES = [
  "thevenin-norton-theorems",
  "kirchhoffs-laws",
  "fourier-series",
  "pn-junction-diode",
  "transistor-biasing",
  "op-amp-fundamentals",
  "ratio-and-proportion",
  "laws-of-exponents",
  "squares-and-cubes",
  "logic-gates",
  "boolean-algebra",
  "stack-data-structure",
  "data-interpretation-bar-graphs",
];

// "What to do this week", by stage of the GATE 2027 cycle. Each stage runs
// from its `from` date (IST) until the next one starts. No step quotes a
// registration date; the first stage links the official page instead.
export const GATE_2027_STAGES = [
  {
    from: "2026-09-02",
    title: "Registration period",
    steps: [
      { text: "Check the official Important Dates page for the current registration deadline before you plan around it.", href: GATE_2027_IMPORTANT_DATES, external: true },
      { text: "Already registered? Keep your enrollment ID safe and don't delete the DigiLocker account you applied with: GATE refers to it later." },
      { text: "Download the 2027 syllabus for your paper. The syllabi were revised for 2027, so don't work from an older copy." },
      { text: "Set up your paper's pack in the tracker and mark what you've already covered.", href: "/tracker" },
    ],
  },
  {
    from: "2026-11-01",
    title: "Preparation",
    steps: [
      { text: "Build a weekly timetable that fits around college or work, and keep it realistic.", href: "/tools/timetable-generator" },
      { text: "Work through your syllabus section by section, ticking off topics in the tracker as you finish them.", href: "/tracker" },
      { text: "Practise with the virtual calculator style of working: GATE allows no physical calculator." },
    ],
  },
  {
    from: "2027-01-04",
    title: "City allotment and admit card",
    steps: [
      { text: "Exam cities are notified on 4 January 2027. Check the official site for yours.", href: GATE_2027_SITE, external: true },
      { text: "Watch the official site for the admit card release. Its date hasn't been announced yet.", href: GATE_2027_SITE, external: true },
      { text: "Shift to revision and full-length timed papers. Every paper is 3 hours, so practise at that length." },
    ],
  },
  {
    from: "2027-02-01",
    title: "Exam weekends",
    steps: [
      { text: "Your admit card gives your exact date, session and centre. You sit only the session printed on it." },
      { text: "Exams run on 6 and 7, 13 and 14, and 20 and 21 February 2027." },
      { text: "Read the instructions on your admit card about what to bring to the centre, and follow them exactly." },
    ],
  },
  {
    from: "2027-02-22",
    title: "Waiting for results",
    steps: [
      { text: "Results are announced on Friday, 19 March 2027." },
      { text: "Read how a GATE score is calculated from your marks, so the scorecard makes sense when it arrives.", href: "/blog/gate-normalization-explained" },
    ],
  },
  {
    from: "2027-03-19",
    title: "Results are out",
    steps: [
      { text: "Get your scorecard through the official site. A GATE 2027 score is valid for three years from the results date." },
      { text: "Admission and recruitment are decided by each institute or employer, so check their own notices." },
    ],
  },
];

/** The stage covering `now` (a Date), or null before the first stage. */
export function getGate2027Stage(now = new Date()) {
  // Compare calendar dates in IST.
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
  let current = null;
  for (const stage of GATE_2027_STAGES) {
    if (stage.from <= today) current = stage;
  }
  return current;
}
