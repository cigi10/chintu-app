// lib/toolPageContent.js
//
// Server-rendered descriptive copy for the quiz and Crumb tool pages, so
// each page carries real, unique text about what it covers instead of a
// client-only widget with a shared generic description. Every summary
// describes what is actually in that bank today (content/quiz/*.json,
// content/wordgame/*.json); update it when a bank changes. Crumb copy
// must never name a term, only topics, so it can't spoil a puzzle.
//
// lib/toolPageContent.test.js checks that every category and domain has
// an entry, descriptions are unique, and related links point at pages
// that exist.

import { getQuizCategory } from "@/lib/quiz";
import { getWordGameDomain } from "@/lib/wordGame";

export const QUIZ_INFO = {
  ece: {
    shortTopics: "circuits, analog and digital electronics, signals, communication and engineering maths",
    audience: "GATE ECE aspirants and electronics undergraduates revising their core subjects",
    covers: [
      "AC circuits and network basics",
      "Analog electronics: diodes and operational amplifiers",
      "Digital electronics: counters and flip-flops",
      "Signals and systems: Laplace transforms and stability",
      "Communication systems: amplitude modulation",
      "Electromagnetics: Gauss's law",
      "Engineering mathematics: eigenvalues",
      "One general aptitude question, since GATE's own paper has a General Aptitude section",
    ],
    related: [
      { label: "Laplace transforms, worked examples", href: "/resources/laplace-transforms" },
      { label: "Op-amp fundamentals", href: "/resources/op-amp-fundamentals" },
      { label: "Crumb: daily ECE term puzzle", href: "/games/crumb/ece" },
      { label: "GATE 2027 countdown", href: "/countdown/gate-2027" },
    ],
  },
  "neet-bio": {
    shortTopics: "cell biology, genetics, human and plant physiology, ecology, evolution and biotechnology",
    audience: "NEET UG aspirants and Class 11 and 12 biology students",
    covers: [
      "Cell biology: organelles and their roles",
      "Genetics: Mendel's laws",
      "Human physiology: the heart and human reproduction",
      "Plant physiology: photosynthetic pigments",
      "Ecology: energy pyramids",
      "Evolution: Darwin's theory",
      "Biotechnology: the enzymes used in genetic engineering",
      "Human health and disease, and taxonomy",
    ],
    related: [
      { label: "Is NCERT enough for NEET?", href: "/blog/is-ncert-enough-for-neet" },
      { label: "High-weightage NEET chapters", href: "/blog/11-neet-high-weightage-chapters" },
      { label: "Crumb: daily NEET term puzzle", href: "/games/crumb/neet" },
      { label: "NEET UG 2027 countdown", href: "/countdown/neet-2027" },
    ],
  },
  "jee-physics": {
    shortTopics: "mechanics, gravitation, oscillations, electrostatics, magnetism and semiconductors",
    audience: "JEE Main and JEE Advanced aspirants checking their Physics concepts",
    covers: [
      "Kinematics and Newton's laws of motion",
      "Work, energy and the work-energy theorem",
      "Rotational motion: moment of inertia",
      "Gravitation: Kepler's laws",
      "Kinetic theory of gases",
      "Oscillations: the simple pendulum",
      "Electrostatics and magnetism: Coulomb's law and solenoids",
      "Semiconductors: the p-n junction",
    ],
    related: [
      { label: "How many Physics numericals before JEE Main", href: "/blog/how-many-physics-numericals-before-jee-main" },
      { label: "PN junction diode, explained", href: "/resources/pn-junction-diode" },
      { label: "Crumb: daily JEE term puzzle", href: "/games/crumb/jee" },
      { label: "JEE Main 2027 Session 1 countdown", href: "/countdown/jee-2027" },
    ],
  },
  "general-math": {
    shortTopics: "percentages, discounts, ratios, simple equations and order of operations",
    audience: "school students and anyone warming up for placement or entrance-test aptitude sections",
    covers: [
      "Percentages, including discounts and percentage increase",
      "Ratios: simplifying and scaling",
      "Solving simple linear equations",
      "Mental arithmetic and order of operations",
    ],
    related: [
      { label: "Percentage shortcuts", href: "/resources/percentage-shortcuts" },
      { label: "Ratio, explained", href: "/resources/ratio" },
      { label: "Linear equations", href: "/resources/linear-equations" },
      { label: "Crumb: daily placements and aptitude puzzle", href: "/games/crumb/placements-aptitude" },
    ],
  },
  "verbal-reasoning": {
    shortTopics: "synonyms, antonyms, analogies and short reasoning questions",
    audience: "students preparing for the verbal sections of placement aptitude tests and entrance exams",
    covers: [
      "Synonyms: the word closest in meaning",
      "Antonyms: the word most opposite in meaning",
      "Analogies: completing a word relationship",
      "Short scenario questions that test careful reading",
    ],
    related: [
      { label: "Crumb: daily placements and aptitude puzzle", href: "/games/crumb/placements-aptitude" },
      { label: "Crumb: daily CLAT legal term puzzle", href: "/games/crumb/clat" },
      { label: "Deciding on a pre-placement offer", href: "/blog/pre-placement-offer-ppo-accept-or-not" },
    ],
  },
  "general-knowledge": {
    shortTopics: "the solar system, everyday chemistry and biology, world geography and calendar facts",
    audience: "school students and anyone who wants a quick general-knowledge warm-up",
    covers: [
      "The solar system and its planets",
      "Everyday chemistry: formulas, symbols and freezing points",
      "Everyday biology: photosynthesis and the human heart",
      "World geography: capitals and oceans",
      "Calendar facts",
    ],
    related: [
      { label: "All quizzes", href: "/quiz" },
      { label: "Crumb: daily Board Exams term puzzle", href: "/games/crumb/board-exams" },
      { label: "Studyloaf games", href: "/games" },
    ],
  },
};

export const CRUMB_INFO = {
  neet: {
    noun: "NEET Biology",
    summary: "Terms come from NCERT Class 11 and 12 Biology, the vocabulary NEET questions are built on. Knowing a term well enough to spell it from its topic alone is the same recall that NEET's statement-based and matching questions test.",
    related: [
      { label: "NEET Biology Daily Challenge", href: "/quiz/neet-bio/daily" },
      { label: "Is NCERT enough for NEET?", href: "/blog/is-ncert-enough-for-neet" },
      { label: "NEET UG 2027 countdown", href: "/countdown/neet-2027" },
    ],
  },
  clat: {
    noun: "legal",
    summary: "Terms come from the areas of law that CLAT's legal reasoning passages draw on. Recognising a term like these on sight makes those passages faster to read, even though CLAT itself doesn't test memorised law.",
    related: [
      { label: "Verbal Reasoning Daily Challenge", href: "/quiz/verbal-reasoning/daily" },
      { label: "CLAT 2027 countdown", href: "/countdown/clat-2027" },
    ],
  },
  "board-exams": {
    noun: "Class 10 to 12 science and maths",
    summary: "Terms span the core science and maths chapters of Class 10 to 12 board syllabuses, the kind of exact vocabulary board answers are marked on.",
    related: [
      { label: "General Math Practice Quiz", href: "/quiz/general-math/practice" },
      { label: "Quick reference resources", href: "/resources" },
    ],
  },
  ece: {
    noun: "electronics and communication",
    summary: "Terms come from the core ECE syllabus shared by GATE ECE and most electronics degree programmes.",
    related: [
      { label: "GATE ECE Daily Challenge", href: "/quiz/ece/daily" },
      { label: "Op-amp fundamentals", href: "/resources/op-amp-fundamentals" },
      { label: "GATE 2027 countdown", href: "/countdown/gate-2027" },
    ],
  },
  cs: {
    noun: "computer science",
    summary: "Terms come from first and second-year computer science courses and the fundamentals placement interviews keep coming back to.",
    related: [
      { label: "Crumb: daily AIML term puzzle", href: "/games/crumb/aiml" },
      { label: "Deciding on a pre-placement offer", href: "/blog/pre-placement-offer-ppo-accept-or-not" },
    ],
  },
  aiml: {
    noun: "AI and machine learning",
    summary: "Terms cover the machine learning concepts that come up in AIML coursework and in ML interview questions.",
    related: [
      { label: "Crumb: daily CS term puzzle", href: "/games/crumb/cs" },
      { label: "Matrices: eigenvalues and eigenvectors", href: "/resources/matrices-eigenvalues-eigenvectors" },
    ],
  },
  jee: {
    noun: "JEE Physics, Chemistry and Maths",
    summary: "Terms come from across the JEE Main syllabus, mixing Physics, Chemistry and Maths so no single subject carries the week.",
    related: [
      { label: "JEE Physics Daily Challenge", href: "/quiz/jee-physics/daily" },
      { label: "JEE Main 2027 Session 1 countdown", href: "/countdown/jee-2027" },
    ],
  },
  "placements-aptitude": {
    noun: "placement aptitude",
    summary: "Terms come from the aptitude rounds most campus placement tests start with, weighted towards quantitative aptitude the way those tests usually are.",
    related: [
      { label: "General Math Practice Quiz", href: "/quiz/general-math/practice" },
      { label: "Verbal Reasoning Practice Quiz", href: "/quiz/verbal-reasoning/practice" },
      { label: "Deciding on a pre-placement offer", href: "/blog/pre-placement-offer-ppo-accept-or-not" },
    ],
  },
};

/** Copy for one quiz page. `mode` is "daily" or "practice". */
export function getQuizPageContent(slug, mode) {
  const category = getQuizCategory(slug);
  const info = QUIZ_INFO[slug];
  if (!category || !info) return null;
  const n = category.questions.length;
  const daily = mode === "daily";
  const otherMode = daily
    ? { label: `${category.label} Practice Quiz: all ${n} questions in one go`, href: `/quiz/${slug}/practice` }
    : { label: `${category.label} Daily Challenge: one question a day`, href: `/quiz/${slug}/daily` };

  return {
    heading: daily ? `About the ${category.label} Daily Challenge` : `About the ${category.label} Practice Quiz`,
    description: daily
      ? `One ${category.label} question a day, the same for everyone, covering ${info.shortTopics}. Instant explanations and a daily streak.`
      : `A ${n}-question ${category.label} practice quiz on ${info.shortTopics}, shuffled every attempt, with a scored review and explanations.`,
    intro: daily
      ? `The Daily Challenge gives you one question a day from the ${category.label} bank, and everyone playing today gets the same one. Pick an answer and you see straight away whether it was right, with a short explanation of why. Answering on consecutive days builds a streak. It's built for ${info.audience} who want a two-minute daily check rather than a full test.`
      : `The Practice Quiz runs through all ${n} questions in the ${category.label} bank in a shuffled order, so a second attempt doesn't come in the same sequence. Answer each one, then get your score out of ${n} and a review of every question with its explanation, including the ones you got right. It's built for ${info.audience} who want to test a whole topic area in one sitting.`,
    coversHeading: `What the ${n} questions cover`,
    covers: info.covers,
    howItWorks: daily
      ? `The question changes every day and works through the bank in turn, so the same question comes back about every ${n} days. If you'd rather see the whole bank now, the Practice Quiz is the better fit.`
      : `There's no time limit and no account needed. Your score isn't compared with anyone else's, so it's an honest read on what you know right now. For a lighter daily habit on the same material, use the Daily Challenge.`,
    related: [otherMode, ...info.related],
  };
}

/** Copy for one Crumb domain page. Topics come from the bank itself. */
export function getCrumbPageContent(slug) {
  const domain = getWordGameDomain(slug);
  const info = CRUMB_INFO[slug];
  if (!domain || !info) return null;
  // In the game each topic is shown only on its own term's day. Listed
  // together, a topic can contain another day's answer (CLAT's "Law of
  // Torts" vs a 4-letter term), so any topic containing a term is left out.
  const terms = domain.terms.map(t => t.term.toUpperCase());
  const topics = [...new Set(domain.terms.map(t => t.topic))]
    .filter(topic => !terms.some(term => topic.toUpperCase().includes(term)));
  const lengths = domain.terms.map(t => t.term.length);
  const minLen = Math.min(...lengths), maxLen = Math.max(...lengths);
  const n = domain.terms.length;
  const named = topics.slice(0, 2).map(t => t.split(": ").pop().toLowerCase());
  const shortTopics = topics.length > 2 ? `${named.join(", ")} and more` : named.join(" and ");

  return {
    heading: `About Crumb: ${domain.label}`,
    description: `Daily ${domain.label} Crumb: guess ${/^[aeiou]/i.test(info.noun) ? "an" : "a"} ${info.noun} term in 6 tries from its topic, with letter-by-letter feedback. Covers ${shortTopics}.`,
    intro: `Each day this puzzle hides one ${info.noun} term. You get the term's topic as a clue and 6 guesses, and every guess shows which letters are in the right place, which are in the term but elsewhere, and which aren't in it at all. ${info.summary}`,
    coversHeading: "Topics in this word bank include",
    covers: topics,
    howItWorks: `The bank currently holds ${n} terms between ${minLen} and ${maxLen} letters long, and the puzzle works through them in turn, one a day, so it's the same puzzle for everyone today. Your streak and today's progress are saved on this device. When you finish, you can copy a result grid that shows your guess pattern without giving away the term.`,
    related: info.related,
  };
}
