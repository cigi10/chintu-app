// lib/blogCategories.js
//
// Blog subject hubs, at /blog/category/<slug>. Each post names exactly one
// in its JSON `category` field (lib/blogPosts.test.js checks it exists).
// Hubs are the browse-by-subject layer; tags stay as the finer-grained,
// many-per-post cross-references at /blog/tag/<tag>.
export const BLOG_CATEGORIES = [
  {
    slug: "jee",
    title: "JEE Main and Advanced",
    description: "How JEE Main is marked, normalised and ranked, who's eligible, and how to prepare and practise for Main and Advanced.",
    intro: "The rules that decide a JEE result and the preparation that moves it: the marking scheme, percentile normalization and tie-breaking, eligibility, admit-card checks, mock test strategy, and how Advanced preparation differs from Main.",
  },
  {
    slug: "neet",
    title: "NEET UG",
    description: "What NEET UG tests, where the marks are, how negative marking works, and what the 2027 switch to computer-based testing changes.",
    intro: "NEET UG preparation: which chapters carry the most weight, how far NCERT takes you in each subject, when guessing is worth it under negative marking, and what changes now that NEET is moving to computer-based testing.",
  },
  {
    slug: "counselling",
    title: "Counselling and Admissions",
    description: "Turning a JEE or NEET rank into a seat: JoSAA and CSAB rounds, All India Quota and state counselling.",
    intro: "What happens after the result: how JoSAA and CSAB counselling work round by round, what to do if you don't get a seat, and how NEET's All India Quota and state counselling use your rank differently.",
  },
  {
    slug: "study-skills",
    title: "Study Plans and Exam Strategy",
    description: "Timetables that last, the final 30 days, avoiding silly mistakes, deciding on a drop year, and myths worth unlearning.",
    intro: "How to plan and sit the exam well, whichever exam it is: building a timetable that survives real life, structuring the last month, fixing the mistakes that cost easy marks, deciding whether to drop a year, and the advice that's outdated.",
  },
  {
    slug: "college-careers",
    title: "College, Careers and Other Exams",
    description: "First-year engineering, placements and pre-placement offers, GATE scoring, and preparing for the GMAT around a job.",
    intro: "Life after the entrance exam: what first-year engineering is really like, how to weigh a pre-placement offer, how GATE scores are normalised, and how to prepare for the GMAT around a full-time job.",
  },
];

export function getBlogCategories() {
  return BLOG_CATEGORIES;
}

export function getBlogCategory(slug) {
  return BLOG_CATEGORIES.find(c => c.slug === slug);
}
