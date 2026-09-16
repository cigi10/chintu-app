// lib/resources.js
//
// Metadata for the standalone reference pages under app/resources/<slug>/.
// Unlike lib/blogPosts.js, resource pages are hand-written React pages
// (see app/resources/divisibility-rules/page.tsx) rather than JSON content,
// since these are one-off study reference pages, not a content feed. Add
// an entry here whenever a new resource page is created, so it shows up
// on the /resources index and in app/sitemap.ts.
//
// Every entry carries a `category` so the index page can group them —
// Math is the first category to exist ahead of a much larger batch of
// math reference content, with "Other Subjects" as the catch-all until
// there's enough in a subject to split it into its own category.
export const CATEGORIES = ["Math", "Other Subjects"];

export const RESOURCES = [
  {
    slug: "divisibility-rules",
    title: "Divisibility Rules",
    description: "Quick tests to check whether a number is divisible by 2 through 12, with worked examples.",
    category: "Math",
  },
  {
    slug: "squares-and-cubes",
    title: "Squares and Cubes Reference",
    description: "A quick-reference table of squares from 1 to 30 and cubes from 1 to 20.",
    category: "Math",
  },
  {
    slug: "percentage-shortcuts",
    title: "Percentage Shortcuts",
    description: "Common percentage calculation shortcuts and mental math tricks with worked examples.",
    category: "Math",
  },
  {
    slug: "unit-conversions",
    title: "Unit Conversions Reference",
    description: "Common unit conversions for physics and chemistry: length, mass, time, energy, and SI prefixes.",
    category: "Other Subjects",
  },
  {
    slug: "addition-of-fractions",
    title: "Addition of Fractions",
    description: "Practice questions on adding fractions and mixed numbers, with worked solutions.",
    category: "Math",
  },
  {
    slug: "percentage",
    title: "Percentage",
    description: "What percentage means, how to compute a combined percentage across subjects, with a worked example.",
    category: "Math",
  },
  {
    slug: "pythagoras-theorem",
    title: "Pythagoras Theorem",
    description: "The Pythagorean theorem explained, with a worked real-world distance example.",
    category: "Math",
  },
  {
    slug: "quadratic-equations",
    title: "Quadratic Equations",
    description: "What a quadratic equation is, solving by completing the square, the quadratic formula, and a real-life example.",
    category: "Math",
  },
  {
    slug: "trigonometry",
    title: "Trigonometry Basics",
    description: "Sine, cosine, tangent and their reciprocals, standard angle values, and the core trigonometric identities.",
    category: "Math",
  },
  {
    slug: "chain-rule",
    title: "Chain Rule",
    description: "The chain rule for differentiating composite functions, with two worked derivative examples.",
    category: "Math",
  },
  {
    slug: "definite-integrals",
    title: "Definite Integrals",
    description: "What a definite integral is and how to evaluate one, with a worked trigonometric example.",
    category: "Math",
  },
  {
    slug: "operations-on-matrices",
    title: "Operations on Matrices",
    description: "How matrix addition and multiplication work, with a worked multiplication example.",
    category: "Math",
  },
];

export function getAllResources() {
  return RESOURCES;
}

export function getResourceSlugs() {
  return RESOURCES.map(resource => resource.slug);
}

/** Resources grouped by category, in CATEGORIES order — only categories
 *  that actually have a resource in them are included. */
export function getResourcesByCategory() {
  return CATEGORIES
    .map(category => ({
      category,
      resources: RESOURCES.filter(resource => resource.category === category),
    }))
    .filter(group => group.resources.length > 0);
}
