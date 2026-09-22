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
//
// "Engineering Fundamentals" (added as a pilot, batch 9) covers 1st-year
// engineering topics — Engineering Mathematics, Engineering Physics,
// Basic Electrical/Electronics — shared across most Indian AICTE/VTU-
// pattern colleges. Deliberately kept separate from "Math" so JEE/NEET
// students browsing exam-prep content aren't shown college-level
// material mixed in with it.
export const CATEGORIES = ["Math", "Engineering Fundamentals", "Other Subjects"];

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
    description: "Worked examples for checking whether an equation is quadratic, solving by factorization or completing the square, and using the discriminant.",
    category: "Math",
  },
  {
    slug: "trigonometry-solved-examples",
    title: "Trigonometry: Solved Examples",
    description: "Worked examples finding trigonometric ratios, evaluating standard-angle expressions, proving identities, and using co-function identities.",
    category: "Math",
  },
  {
    slug: "real-numbers-irrational-numbers",
    title: "Real Numbers: Irrational Numbers and Decimal Expansions",
    description: "Proving a number is irrational by contradiction, and telling whether a fraction has a terminating or repeating decimal expansion, with worked examples.",
    category: "Math",
  },
  {
    slug: "surds-and-radicals",
    title: "Surds and Radicals",
    description: "Simplifying and rationalizing expressions with square roots, with worked examples including a telescoping sum.",
    category: "Math",
  },
  {
    slug: "polynomial-division-algorithm",
    title: "Polynomial Division Algorithm",
    description: "Dividing one polynomial by another to find a quotient and remainder, and using that to find missing zeroes, with worked examples.",
    category: "Math",
  },
  {
    slug: "polynomial-identities-and-remainder-theorem",
    title: "Polynomial Identities and the Remainder Theorem",
    description: "Using the Remainder Theorem to find a remainder without dividing, and factoring with the sum/difference-of-cubes identities, with worked examples.",
    category: "Math",
  },
  {
    slug: "power-rule",
    title: "Power Rule",
    description: "The power rule for differentiating x to a fixed exponent, with a worked example on a square root.",
    category: "Math",
  },
  {
    slug: "product-rule",
    title: "Product Rule",
    description: "The product rule for differentiating a product of two functions, with worked examples including logarithmic differentiation.",
    category: "Math",
  },
  {
    slug: "quotient-rule",
    title: "Quotient Rule",
    description: "The quotient rule for differentiating one function divided by another, with worked examples.",
    category: "Math",
  },
  {
    slug: "applications-of-derivatives",
    title: "Applications of Derivatives",
    description: "Using derivatives as rates of change, with worked examples on a growing circle's area and a particle's velocity and acceleration.",
    category: "Math",
  },
  {
    slug: "implicit-differentiation",
    title: "Implicit Differentiation",
    description: "How to differentiate an equation that isn't already solved for y, with worked examples including an inverse trig identity.",
    category: "Math",
  },
  {
    slug: "increasing-and-decreasing-functions",
    title: "Increasing and Decreasing Functions",
    description: "How the sign of a function's derivative determines where it's increasing or decreasing, with worked examples including a cubic.",
    category: "Math",
  },
  {
    slug: "maxima-and-minima",
    title: "Maxima and Minima",
    description: "Finding local maxima and minima and solving optimization problems using derivatives, with worked examples.",
    category: "Math",
  },
  {
    slug: "rolles-theorem",
    title: "Rolle's Theorem",
    description: "What Rolle's theorem states and how to verify it for a function on a closed interval, with a worked example.",
    category: "Math",
  },
  {
    slug: "slope-of-tangent-and-normal",
    title: "Slope of Tangent and Normal",
    description: "How the derivative gives the tangent's slope and the normal's slope is its negative reciprocal, with a worked example.",
    category: "Math",
  },
  {
    slug: "tangents-and-normals",
    title: "Tangents and Normals",
    description: "Finding the slope of a tangent line to a curve at a given point, with worked examples on a cubic and a rational function.",
    category: "Math",
  },
  {
    slug: "integration-by-partial-fractions",
    title: "Integration by Partial Fractions",
    description: "Splitting a rational function into simpler fractions before integrating, with worked examples.",
    category: "Math",
  },
  {
    slug: "integration-of-particular-functions",
    title: "Integration of Particular Functions",
    description: "Standard integration formulas for functions like 1/(x^2-a^2) and 1/(a^2-x^2), with worked examples.",
    category: "Math",
  },
  {
    slug: "integration-using-trigonometric-identities",
    title: "Integration Using Trigonometric Identities",
    description: "Rewriting a trigonometric integrand with an identity before integrating, with worked examples on cos^2 x, sin^2 x, and a secant identity.",
    category: "Math",
  },
  {
    slug: "integral-of-ex-f-plus-fprime",
    title: "Integral of e^x[f(x) + f'(x)]",
    description: "A shortcut formula for integrating e^x times a function plus its own derivative, with a worked example.",
    category: "Math",
  },
  {
    slug: "area-bounded-by-a-curve",
    title: "Finding the Area Bounded by a Curve",
    description: "Using definite integrals to find area under a curve, including a full period of cosine and a classic circle-area derivation.",
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
    description: "Left-hand and right-hand derivatives, spotting a point that's continuous but not differentiable, and finding a function's domain, with worked examples.",
    category: "Math",
  },
  {
    slug: "special-types-of-matrices",
    title: "Special Types of Matrices",
    description: "Diagonal, scalar, and identity matrices explained, with examples showing how each one is a more specific case of the last.",
    category: "Math",
  },
  {
    slug: "symmetric-and-skew-symmetric-matrices",
    title: "Symmetric and Skew-Symmetric Matrices",
    description: "What symmetric and skew-symmetric matrices are, and how to split any square matrix into a sum of both, with a worked example.",
    category: "Math",
  },
  {
    slug: "square-matrix",
    title: "Square Matrix Properties",
    description: "Key facts about square matrices: the determinant scaling rule, idempotent matrices, and when a matrix equation has no solution.",
    category: "Math",
  },
  {
    slug: "matrices-system-of-equations",
    title: "Solving a System of Equations with Matrices",
    description: "How to solve a system of linear equations using the matrix method, with a fully worked three-variable example.",
    category: "Math",
  },
  {
    slug: "finding-missing-values-in-a-matrix",
    title: "Finding Missing Values in a Matrix",
    description: "Solving for unknown entries in a matrix using a stated property or a matching determinant, with worked examples.",
    category: "Math",
  },
  {
    slug: "operations-on-vectors",
    title: "Operations on Vectors",
    description: "The negative of a vector, the scalar triple product identity, and using the dot product on unit vectors, with worked examples.",
    category: "Math",
  },
  {
    slug: "unit-vector",
    title: "Finding a Unit Vector",
    description: "How to find the unit vector in a given direction, between two points, or scaled to a target magnitude, with worked examples.",
    category: "Math",
  },
  {
    slug: "projection-of-a-vector",
    title: "Projection of a Vector",
    description: "What the projection of a vector onto a directed line means, including what happens at special angles, with a worked example.",
    category: "Math",
  },
  {
    slug: "position-vector-of-a-point",
    title: "Finding the Position Vector of a Point",
    description: "The section formula for a point dividing a segment internally or externally, and finding a midpoint, with worked examples.",
    category: "Math",
  },
  {
    slug: "line-segment-ray-and-line",
    title: "Line Segment, Ray, and Line",
    description: "The differences between a line segment, a ray, and a line, and what makes points or lines collinear or concurrent.",
    category: "Math",
  },
  {
    slug: "direction-cosines",
    title: "Finding Direction Cosines",
    description: "What direction cosines are and how to find them for a coordinate axis, a line through two points, or a line at given angles.",
    category: "Math",
  },
  {
    slug: "equation-of-a-line",
    title: "Finding the Equation of a Line",
    description: "Writing a line's equation in vector and Cartesian form, given two points or a point and a parallel vector, with worked examples.",
    category: "Math",
  },
  {
    slug: "equation-of-a-plane",
    title: "Finding the Equation of a Plane",
    description: "The equation of a coordinate plane, and finding a plane through the intersection of two others and a given point, with a worked example.",
    category: "Math",
  },
  {
    slug: "intercepts-of-a-plane",
    title: "Finding the Intercepts of a Plane",
    description: "How to read a plane's intercepts on each axis straight from its equation, with a worked example.",
    category: "Math",
  },
  {
    slug: "angle-between-line-and-plane",
    title: "Angle Between a Line and a Plane",
    description: "How to find the angle between a line and a plane using their direction vector and normal vector, with a worked example.",
    category: "Math",
  },
  {
    slug: "shortest-distance-between-lines",
    title: "Shortest Distance Between Two Lines",
    description: "The formula for the shortest distance between two skew lines in vector form, with two fully worked examples.",
    category: "Math",
  },
  {
    slug: "area-of-a-triangle-determinants",
    title: "Area of a Triangle Using Determinants",
    description: "The determinant formula for the area of a triangle from its vertex coordinates, with a worked example.",
    category: "Math",
  },
  {
    slug: "area-of-a-triangle-and-parallelogram-vectors",
    title: "Area of a Triangle and Parallelogram Using Vectors",
    description: "Using the cross product to find the area of a triangle or parallelogram from vertex or side vectors, with worked examples.",
    category: "Math",
  },
  {
    slug: "types-of-relations",
    title: "Types of Relations",
    description: "Reflexive, symmetric, transitive, and equivalence relations defined and checked against worked examples.",
    category: "Math",
  },
  {
    slug: "types-of-functions",
    title: "Types of Functions",
    description: "One-one, onto, bijective, and invertible functions explained, with worked examples on checking each property and finding an inverse.",
    category: "Math",
  },
  {
    slug: "binary-operation",
    title: "Binary Operation",
    description: "What a binary operation is, and how to check whether one has an identity element, is commutative, or is associative, with worked examples.",
    category: "Math",
  },
  {
    slug: "composition-of-functions",
    title: "Composition of Functions (gof and fog)",
    description: "How to compute the composition of two functions in either order, with a worked example showing gof and fog can come out different.",
    category: "Math",
  },
  {
    slug: "approximations",
    title: "Approximations Using Differentials",
    description: "Using differentials to approximate square roots and estimate small changes, with worked examples including a percentage-change setup.",
    category: "Math",
  },
  {
    slug: "linear-programming",
    title: "Linear Programming",
    description: "Feasible regions, corner points, and finding the condition on an objective function's coefficients for it to be maximized at two corners at once.",
    category: "Math",
  },
  {
    slug: "inverse-trigonometric-functions",
    title: "Inverse Trigonometric Functions",
    description: "Principal values, domains of inverse trig functions, and the complementary identity between tan⁻¹ and cot⁻¹, with worked examples.",
    category: "Math",
  },
  {
    slug: "pair-of-linear-equations-graphical-method",
    title: "Pair of Linear Equations: Graphical Method",
    description: "Turning a word problem into a pair of linear equations, and checking whether two lines intersect, are parallel, or coincide by comparing coefficient ratios.",
    category: "Math",
  },
  {
    slug: "pair-of-linear-equations-substitution-and-elimination",
    title: "Pair of Linear Equations: Substitution and Elimination Methods",
    description: "Solving a pair of linear equations by substitution and by elimination, including recognizing when a system has infinitely many solutions.",
    category: "Math",
  },
  {
    slug: "pair-of-linear-equations-cross-multiplication",
    title: "Pair of Linear Equations: Cross-Multiplication and Reducible Equations",
    description: "The cross-multiplication formula for solving a pair of linear equations, and reducing an equation that isn't linear yet into one that is, with worked examples.",
    category: "Math",
  },
  {
    slug: "pair-of-linear-equations-word-problems",
    title: "Pair of Linear Equations: Word Problems",
    description: "Translating age and money word problems into a pair of linear equations and solving them, including a classic problem with two valid cases.",
    category: "Math",
  },
  {
    slug: "simple-and-compound-interest",
    title: "Simple and Compound Interest",
    description: "The simple interest and compound interest formulas, why compound interest grows faster, and worked examples for both.",
    category: "Math",
  },
  {
    slug: "laws-of-exponents",
    title: "Laws of Exponents",
    description: "The core rules for combining and simplifying exponents, including negative exponents, with worked examples.",
    category: "Math",
  },
  {
    slug: "math-olympiad-grade-7",
    title: "Grade 7 Math Olympiad Problems",
    description: "Five worked Math Olympiad-style problems for grade 7: a Fibonacci-like sequence, an exponent equation, percentages with overlap, consecutive integers, and clock arithmetic.",
    category: "Math",
  },
  {
    slug: "finding-the-number-of-factors",
    title: "Finding the Number of Factors of a Number",
    description: "The formula for counting how many divisors a number has from its prime factorization, with worked examples.",
    category: "Math",
  },
  {
    slug: "operations-on-sets",
    title: "Operations on Sets",
    description: "Union, intersection, and the inclusion-exclusion principle for counting overlapping groups, with a worked example.",
    category: "Math",
  },
  {
    slug: "area-and-perimeter-formulas",
    title: "Area and Perimeter Formulas Reference",
    description: "Area and perimeter formulas for rectangles, squares, circles, sectors, triangles, and regular pentagons, including Heron's formula, with a worked example.",
    category: "Math",
  },
  {
    slug: "surface-area-and-volume-formulas",
    title: "Surface Area and Volume Formulas Reference",
    description: "Surface area and volume formulas for cuboids, cubes, spheres, cylinders, cones, and frustums of a cone, with a worked example.",
    category: "Math",
  },
  {
    slug: "mathematical-constants",
    title: "Mathematical Constants: e, i, √2, and π",
    description: "What Euler's number, the imaginary unit, Pythagoras' constant, and pi actually represent, including the repeating cycle of powers of i, with a worked example.",
    category: "Math",
  },
  {
    slug: "degrees-and-radians",
    title: "Degrees and Radians",
    description: "What a radian actually measures, the standard-angle conversion table, and converting between degrees and radians, with worked examples.",
    category: "Math",
  },
  {
    slug: "polynomials-definitions-and-degree",
    title: "Polynomials: Definitions and Degree",
    description: "What makes an expression a polynomial, the monomial/binomial/trinomial distinction, and how to find the degree of a polynomial in one or more variables.",
    category: "Math",
  },
  {
    slug: "prime-numbers",
    title: "Prime Numbers",
    description: "What a prime number is, why 0 and 1 are neither prime nor composite, and what twin primes are, with a worked example checking a number for primality.",
    category: "Math",
  },
  {
    slug: "laplace-transforms",
    title: "Laplace Transforms",
    description: "The Laplace transform definition, a table of standard transforms, the first shifting theorem, and solving a linear ODE with initial conditions.",
    category: "Engineering Fundamentals",
  },
  {
    slug: "fourier-series",
    title: "Fourier Series",
    description: "The Fourier series formulas for a periodic function, and a fully worked derivation of the Fourier series for f(x) = x on (-π, π).",
    category: "Engineering Fundamentals",
  },
  {
    slug: "wave-optics-youngs-double-slit",
    title: "Wave Optics: Young's Double Slit Experiment",
    description: "The path-difference conditions for bright and dark fringes, the fringe width formula, and worked examples finding fringe width and fringe position.",
    category: "Engineering Fundamentals",
  },
  {
    slug: "kirchhoffs-laws",
    title: "Kirchhoff's Current and Voltage Laws",
    description: "Kirchhoff's Current Law and Voltage Law explained, with a fully worked two-loop circuit solved for all three branch currents.",
    category: "Engineering Fundamentals",
  },
  {
    slug: "pn-junction-diode",
    title: "PN Junction Diode: Forward and Reverse Bias",
    description: "How a PN junction diode behaves under forward and reverse bias, the diode equation, and a worked example on the 'roughly 60mV per decade' current rule.",
    category: "Engineering Fundamentals",
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
