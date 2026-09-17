import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Quadratic Equations: Solved Examples - Studyloaf",
  description: "Worked examples for checking whether an equation is quadratic, turning word problems into quadratic equations, and solving by factorization.",
  openGraph: {
    title: "Quadratic Equations: Solved Examples - Studyloaf",
    description: "Worked examples for checking whether an equation is quadratic, turning word problems into quadratic equations, and solving by factorization.",
  },
};

export default function QuadraticEquationsSolvedExamplesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Quadratic Equations: Solved Examples",
        description: "Worked examples for checking whether an equation is quadratic, turning word problems into quadratic equations, and solving by factorization.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Quadratic Equations: Solved Examples" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Quadratic Equations: Solved Examples</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Is it actually quadratic?</h2>
            <p className="blog-post-p">
              An equation is quadratic only once it&apos;s simplified: expand both sides fully and
              collect like terms first, then check the degree. Two examples with different outcomes:
            </p>
            <p className="blog-post-p">
              <Katex>{"(x+1)^2 = 2(x-3)"}</Katex> expands to <Katex>{"x^2+2x+1=2x-6"}</Katex>, which
              simplifies to <Katex>{"x^2 + 7 = 0"}</Katex> — degree 2, so this <strong>is</strong>{" "}
              a quadratic equation.
            </p>
            <p className="blog-post-p">
              <Katex>{"(x-2)(x+1) = (x-1)(x+3)"}</Katex> expands to{" "}
              <Katex>{"x^2 - x - 2 = x^2 + 2x - 3"}</Katex>, and the <Katex>{"x^2"}</Katex> terms
              cancel, leaving <Katex>{"-3x + 1 = 0"}</Katex> — only degree 1, so this{" "}
              <strong>is not</strong> a quadratic equation, despite looking like one before expanding.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Turning a word problem into a quadratic equation</h2>
            <p className="blog-post-p">
              The product of two consecutive positive integers is 306. Represent this as a quadratic
              equation.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let the first integer be <Katex>{"x"}</Katex>, so the next
              consecutive integer is <Katex>{"x+1"}</Katex>. Their product is 306:
            </p>
            <Katex display>{"x(x+1) = 306 \\;\\Rightarrow\\; x^2 + x - 306 = 0"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Solving by factorization</h2>
            <p className="blog-post-p">
              Solve <Katex>{"2x^2 + x - 6 = 0"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Split the middle term into two parts whose product matches{" "}
              <Katex>{"2 \\times (-6) = -12"}</Katex> and whose sum is <Katex>{"1"}</Katex>: that&apos;s{" "}
              <Katex>{"4"}</Katex> and <Katex>{"-3"}</Katex>.
            </p>
            <Katex display>{"2x^2 + 4x - 3x - 6 = 0 \\;\\Rightarrow\\; 2x(x+2) - 3(x+2) = 0 \\;\\Rightarrow\\; (x+2)(2x-3) = 0"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"x = -2"}</Katex> or <Katex>{"x = \\dfrac{3}{2}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">A word problem solved end to end</h2>
            <p className="blog-post-p">
              The altitude of a right triangle is 7 cm less than its base. If the hypotenuse is 13
              cm, find the other two sides.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let the base be <Katex>{"x"}</Katex> cm, so the altitude is{" "}
              <Katex>{"x - 7"}</Katex> cm. By the Pythagorean theorem:
            </p>
            <Katex display>{"13^2 = x^2 + (x-7)^2 \\;\\Rightarrow\\; 169 = 2x^2 - 14x + 49 \\;\\Rightarrow\\; x^2 - 7x - 60 = 0"}</Katex>
            <Katex display>{"x^2 - 12x + 5x - 60 = 0 \\;\\Rightarrow\\; (x-12)(x+5) = 0 \\;\\Rightarrow\\; x = 12 \\text{ or } x = -5"}</Katex>
            <p className="blog-post-p">
              A side length can&apos;t be negative, so <Katex>{"x = 12"}</Katex>: the base is 12 cm and
              the altitude is <Katex>{"12 - 7 = 5"}</Katex> cm — a 5-12-13 right triangle, and{" "}
              <Katex>{"5^2 + 12^2 = 13^2"}</Katex> checks out.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Every quadratic equation here has real roots because its discriminant is positive —
              when the discriminant is negative instead, the roots become a conjugate pair of
              complex numbers.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/quadratic-equations">Quadratic Equations</Link></li>
              <li><Link href="/resources/complex-numbers">Complex Numbers</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
