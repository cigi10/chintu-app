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
  {
    slug: "real-numbers-hcf-lcm",
    title: "Real Numbers: HCF and LCM",
    description: "Finding HCF using Euclid's division algorithm and prime factorization, plus verifying LCM x HCF = product of two numbers, with worked examples.",
    category: "Math",
  },
  {
    slug: "polynomials-zeroes-and-coefficients",
    title: "Polynomials: Zeroes and Coefficients",
    description: "How the zeroes of a quadratic polynomial relate to its coefficients, plus building a polynomial from a given sum and product of zeroes.",
    category: "Math",
  },
  {
    slug: "quadratic-equations-solved-examples",
    title: "Quadratic Equations: Solved Examples",
    description: "Worked examples for checking whether an equation is quadratic, turning word problems into quadratic equations, and solving by factorization.",
    category: "Math",
  },
  {
    slug: "trigonometry-solved-examples",
    title: "Trigonometry: Solved Examples",
    description: "Worked examples finding trigonometric ratios from a triangle's sides, evaluating standard-angle expressions, and solving for unknown angles.",
    category: "Math",
  },
  {
    slug: "arithmetic-progressions",
    title: "Arithmetic Progressions",
    description: "What makes a sequence an arithmetic progression, and how to tell whether a real-world situation forms one, with worked examples.",
    category: "Math",
  },
  {
    slug: "probability",
    title: "Probability",
    description: "What probability measures, independent vs dependent events, and conditional probability, with worked card, dice, and survey examples.",
    category: "Math",
  },
  {
    slug: "logarithms",
    title: "Logarithms",
    description: "What a logarithm is, common vs natural vs binary logarithms, and the core logarithm rules, with worked examples.",
    category: "Math",
  },
  {
    slug: "complex-numbers",
    title: "Complex Numbers",
    description: "What complex numbers are, the modulus-argument form, conjugates, and basic arithmetic on complex numbers, with worked examples.",
    category: "Math",
  },
  {
    slug: "permutations-and-combinations",
    title: "Permutations and Combinations",
    description: "How to count arrangements with permutations, with a worked dictionary-order example finding a specific word among all arrangements of a word's letters.",
    category: "Math",
  },
  {
    slug: "ratio",
    title: "Ratio",
    description: "What a ratio is and how to simplify one to its lowest terms, with a worked real-world example.",
    category: "Math",
  },
  {
    slug: "proportion",
    title: "Proportion",
    description: "How to check whether four numbers are in proportion, and how to solve for a missing term, with worked examples.",
    category: "Math",
  },
  {
    slug: "profit-and-loss",
    title: "Profit and Loss",
    description: "How to calculate profit and loss percent, and work backwards from a selling price or discount to find the cost price, with worked examples.",
    category: "Math",
  },
  {
    slug: "linear-equations",
    title: "Linear Equations",
    description: "How to solve a one-variable linear equation, including fractional coefficients, with worked examples translating word problems into equations.",
    category: "Math",
  },
  {
    slug: "differential-equations",
    title: "Differential Equations",
    description: "How to form a differential equation from a family of curves, and how to solve one by separating variables, with worked examples.",
    category: "Math",
  },
  {
    slug: "integration-by-parts",
    title: "Integration by Parts",
    description: "The integration by parts formula for integrating a product of two functions, with a worked example.",
    category: "Math",
  },
  {
    slug: "continuity",
    title: "Continuity",
    description: "Left-hand and right-hand derivatives, and how to spot a point where a function is continuous but not differentiable, with a worked example.",
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
