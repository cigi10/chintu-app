// Single source of truth for blog post metadata + content. Each entry's
// `slug` is the URL segment under /blog/[slug] and must stay stable once
// published (it's the permalink) — treat renaming a slug as a breaking change.

export const BLOG_POSTS = [
  {
    slug: "jee-neet-study-timetable-without-burnout",
    title: "How to Build a JEE/NEET Study Timetable Without Burning Out",
    description:
      "A realistic, sustainable timetable structure for JEE and NEET aspirants — how to balance subjects, revision, and rest without crashing halfway through the year.",
    date: "2026-09-01",
    author: "Studyloaf Team",
    readingTime: "6 min read",
    content: [
      {
        heading: null,
        body: "Every JEE and NEET aspirant eventually builds a timetable that looks great on paper: five subjects a day, mock tests every weekend, revision slots stacked back to back. Most of these timetables collapse within two or three weeks — not because the student isn't disciplined, but because the schedule never accounted for being human. This post walks through a timetable structure that's built to survive contact with real life.",
      },
      {
        heading: "1. Start from your energy, not the clock",
        body: "Before assigning subjects to time slots, map out when you actually have the most focus during the day. Most students have one or two genuinely high-energy windows — often mid-morning and early evening — and everything else is medium or low energy. Put your hardest subject (usually Physics or Organic Chemistry, depending on who you ask) in a high-energy window, and reserve low-energy time for revision, flashcards, or reading rather than fresh problem-solving.",
      },
      {
        heading: "2. Fixed subject rotation beats daily improvisation",
        body: "Deciding what to study each morning burns willpower before you've even opened a book. Instead, fix a weekly rotation — for example, Physics and Maths on Monday/Thursday, Chemistry and Biology (or Maths) on Tuesday/Friday, and a mixed revision day on Wednesday. A fixed rotation means the only decision left each day is \"start,\" not \"what.\"",
      },
      {
        heading: "3. Build in slack, don't schedule every minute",
        body: "A timetable with zero buffer time guarantees failure the first time you're sick, tired, or a topic takes longer than expected. Leave at least one unscheduled block per day and a lighter day each week. That slack is what absorbs the inevitable disruptions without knocking the rest of your week off track.",
      },
      {
        heading: "4. Revision needs its own recurring slot, not leftovers",
        body: "It's tempting to treat revision as whatever's left over after \"real\" studying. In practice, revision is what actually moves your score — new content only matters if it survives to exam day. Give revision a fixed, recurring slot (for example, the last 45 minutes of each study day, or one whole evening a week) instead of hoping there's time left.",
      },
      {
        heading: "5. Protect one full day off",
        body: "A single full day off each week — genuinely off, not \"lighter\" — is what makes a 10+ month prep schedule sustainable instead of a slow burn toward exhaustion. Students who skip this almost always pay for it later with a multi-day crash that costs more time than the day off would have.",
      },
      {
        heading: "Putting it together",
        body: "A sustainable timetable isn't the one with the most hours crammed in — it's the one you can actually follow for months without rebuilding it from scratch every few weeks. Start with energy mapping, fix your subject rotation, leave real slack, give revision a permanent slot, and protect your day off. If you're using Studyloaf's Timetable and Tracker together, this structure maps directly onto recurring blocks plus a syllabus tracker, so you can see both your schedule and your actual coverage in one place.",
      },
    ],
  },
];

/**
 * Look up a single post by slug. Returns `undefined` if no post matches,
 * so callers (e.g. the [slug] route) can trigger notFound() explicitly
 * rather than rendering a half-populated page.
 */
export function getBlogPost(slug) {
  return BLOG_POSTS.find(post => post.slug === slug);
}

/** All post slugs, used to pre-render every post at build time. */
export function getBlogSlugs() {
  return BLOG_POSTS.map(post => post.slug);
}
