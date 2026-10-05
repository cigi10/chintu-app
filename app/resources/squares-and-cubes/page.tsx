import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Katex from "@/components/Katex";
import BlogTable from "@/components/BlogTable";
import ExamSection from "@/components/ExamSection";
import "@/styles/blog.css";
import "@/styles/resources.css";

export const metadata = {
  title: "Squares and Cubes Reference - Studyloaf",
  description: "Squares from 1 to 30 and cubes from 1 to 20, with last-digit patterns, mental squaring shortcuts, and how to find square and cube roots of perfect powers.",
  openGraph: {
    title: "Squares and Cubes Reference - Studyloaf",
    description: "Squares from 1 to 30 and cubes from 1 to 20, with last-digit patterns, mental squaring shortcuts, and how to find square and cube roots of perfect powers.",
  },
  alternates: { canonical: "/resources/squares-and-cubes" },
};

// Computed at render time rather than hand-typed, so every value is exact
// by construction instead of relying on manually re-checked arithmetic.
const squares = Array.from({ length: 30 }, (_, i) => i + 1).map(n => ({ n, value: n * n }));
const cubes = Array.from({ length: 20 }, (_, i) => i + 1).map(n => ({ n, value: n * n * n }));

// Units digit of n, n² and n³ for each possible last digit of n, also
// computed rather than typed.
const LAST_DIGITS = {
  caption: "Last digit of a number, its square and its cube",
  columns: ["n ends in", "n² ends in", "n³ ends in"],
  rows: Array.from({ length: 10 }, (_, d) => [String(d), String((d * d) % 10), String((d * d * d) % 10)]),
};

export default function SquaresAndCubesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Squares and Cubes Reference",
        description: "Squares from 1 to 30 and cubes from 1 to 20, with last-digit patterns, mental squaring shortcuts, and how to find square and cube roots of perfect powers.",
        datePublished: "2026-09-15",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math: Arithmetic and Number", href: "/resources/math-arithmetic-number" },
          { label: "Squares and Cubes Reference", href: "/resources/squares-and-cubes" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Squares and Cubes Reference</h1>

          <div className="blog-post-section">
            <p className="blog-post-p">
              Knowing squares and cubes by heart saves time on any arithmetic-heavy question. This
              page lists squares from 1 to 30 and cubes from 1 to 20.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Squares (1 to 30)</h2>
            <div className="resource-number-grid">
              {squares.map(({ n, value }) => (
                <div key={n} className="resource-number-chip">{n}&sup2; = {value}</div>
              ))}
            </div>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Cubes (1 to 20)</h2>
            <div className="resource-number-grid">
              {cubes.map(({ n, value }) => (
                <div key={n} className="resource-number-chip">{n}&sup3; = {value}</div>
              ))}
            </div>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Last-digit patterns</h2>
            <p className="blog-post-p">
              The last digit of a square or cube depends only on the last digit of the number, which
              makes it a fast first check on any answer:
            </p>
            <BlogTable table={LAST_DIGITS} id="squares-last-digits" />
            <p className="blog-post-p">
              Two things stand out. A perfect square can never end in 2, 3, 7 or 8, so a number like
              4,567 is ruled out at a glance. And every digit appears exactly once in the cube column,
              so the last digit of a perfect cube tells you the last digit of its cube root for certain.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Shortcut: squaring a number ending in 5</h2>
            <p className="blog-post-p">
              For a number written as <Katex>{"n5"}</Katex>, multiply <Katex>{"n"}</Katex> by the
              next whole number and write 25 after the result:
            </p>
            <Katex display>{"35^2: \\; 3 \\times 4 = 12 \\;\\Rightarrow\\; 1225, \\qquad 85^2: \\; 8 \\times 9 = 72 \\;\\Rightarrow\\; 7225"}</Katex>
            <p className="blog-post-p">
              It works because <Katex>{"(10n+5)^2 = 100n(n+1) + 25"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Shortcut: squaring a number near 50</h2>
            <p className="blog-post-p">
              Write the number as <Katex>{"50 \\pm a"}</Katex> and expand. The middle term is always a
              round hundred, so it stays easy to do in your head:
            </p>
            <Katex display>{"(50 \\pm a)^2 = 2500 \\pm 100a + a^2"}</Katex>
            <Katex display>{"53^2 = 2500 + 300 + 9 = 2809, \\qquad 47^2 = 2500 - 300 + 9 = 2209"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: the square root of a perfect square</h2>
            <p className="blog-post-p">Find <Katex>{"\\sqrt{5476}"}</Katex>, given that it is a whole number.</p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The last digit is 6, so from the table the root ends in 4 or
              6. Ignoring the last two digits leaves 54, which sits between{" "}
              <Katex>{"7^2 = 49"}</Katex> and <Katex>{"8^2 = 64"}</Katex>, so the root is 74 or 76.
              Since <Katex>{"75^2 = 5625"}</Katex> is already bigger than 5476, it has to be the
              smaller one:
            </p>
            <Katex display>{"\\sqrt{5476} = 74"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: the cube root of a perfect cube</h2>
            <p className="blog-post-p">Find <Katex>{"\\sqrt[3]{474552}"}</Katex>, given that it is a whole number.</p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The last digit is 2, and only a number ending in 8 has a cube
              ending in 2, so the root ends in 8. Dropping the last three digits leaves 474, which
              sits between <Katex>{"7^3 = 343"}</Katex> and <Katex>{"8^3 = 512"}</Katex>, so the tens
              digit is 7:
            </p>
            <Katex display>{"\\sqrt[3]{474552} = 78"}</Katex>
            <p className="blog-post-p">
              This only works when you know the number is a perfect cube. For any other number the
              method still produces an answer, just a wrong one, with no warning.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Common mistakes</h2>
            <ul className="blog-post-list">
              <li>
                <strong>Taking a square root of a number that isn&apos;t a perfect square.</strong>{" "}
                5,477 ends in 7, which no square does, so it has no whole-number square root. Check
                the last digit before using the method.
              </li>
              <li>
                <strong>Stopping at one candidate for a square root.</strong> A square ending in 6
                comes from a number ending in 4 or 6, so there are always two candidates to compare.
                Cube roots never have this problem.
              </li>
              <li>
                <strong>Dropping the middle term near 50.</strong> <Katex>{"53^2"}</Katex> is not{" "}
                <Katex>{"2500 + 9"}</Katex>: the <Katex>{"100a"}</Katex> term, 300 here, carries most
                of the difference.
              </li>
              <li>
                <strong>Confusing <Katex>{"n^2"}</Katex> with <Katex>{"2n"}</Katex>.</strong>{" "}
                <Katex>{"3^2 = 9"}</Katex>, not 6. The two agree only at <Katex>{"n = 0"}</Katex> and <Katex>{"n = 2"}</Katex>.
              </li>
            </ul>
          </div>

          <ExamSection exam={{
            note: "Powers are listed under numerical computation and estimation in the General Aptitude syllabus, a section every GATE 2026 paper includes.",
            countdowns: ["gate-2027"],
            sources: ["gate-2026-brochure"],
          }} />
        </article>
      </div>
    </>
  );
}
