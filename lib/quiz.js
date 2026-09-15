// lib/quiz.js
//
// Question bank access for the Daily Challenge and Practice Quiz features.
// Each category's questions live in content/quiz/<slug>.json as a plain
// array, imported directly so this module works from both server and
// client components (no fs, unlike lib/blogPosts.js).
import ece from "@/content/quiz/ece.json";
import neetBio from "@/content/quiz/neet-bio.json";
import jeePhysics from "@/content/quiz/jee-physics.json";

export const QUIZ_CATEGORIES = {
  ece: { slug: "ece", label: "GATE ECE", shareLabel: "ECE", questions: ece },
  "neet-bio": { slug: "neet-bio", label: "NEET Biology", shareLabel: "NEET Biology", questions: neetBio },
  "jee-physics": { slug: "jee-physics", label: "JEE Physics", shareLabel: "JEE Physics", questions: jeePhysics },
};

export function getQuizCategorySlugs() {
  return Object.keys(QUIZ_CATEGORIES);
}

export function getQuizCategory(slug) {
  return QUIZ_CATEGORIES[slug];
}

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

/**
 * Deterministic index into a category's question bank for a given date, so
 * everyone playing that category on the same calendar day sees the same
 * question, similar to how Wordle picks its daily word.
 */
export function getDailyQuestionIndex(slug, date = new Date()) {
  const category = getQuizCategory(slug);
  if (!category || !category.questions.length) return 0;
  return dayOfYear(date) % category.questions.length;
}

export function getDailyQuestion(slug, date = new Date()) {
  const category = getQuizCategory(slug);
  if (!category || !category.questions.length) return null;
  return category.questions[getDailyQuestionIndex(slug, date)];
}
