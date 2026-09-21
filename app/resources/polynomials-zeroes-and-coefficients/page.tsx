import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Polynomials: Zeroes and Coefficients - Studyloaf",
  description: "How the zeroes of a quadratic polynomial relate to its coefficients, plus building a polynomial from a given sum and product of zeroes.",
  openGraph: {
    title: "Polynomials: Zeroes and Coefficients - Studyloaf",
    description: "How the zeroes of a quadratic polynomial relate to its coefficients, plus building a polynomial from a given sum and product of zeroes.",
  },
};

export default function PolynomialsZeroesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Polynomials: Zeroes and Coefficients",
        description: "How the zeroes of a quadratic polynomial relate to its coefficients, plus building a polynomial from a given sum and product of zeroes.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Polynomials: Zeroes and Coefficients", href: "/resources/polynomials-zeroes-and-coefficients" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Polynomials: Zeroes and Coefficients</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The relationship</h2>
            <p className="blog-post-p">
              For a quadratic polynomial <Katex>{"ax^2 + bx + c"}</Katex> with zeroes{" "}
              <Katex>{"\\alpha"}</Katex> and <Katex>{"\\beta"}</Katex>:
            </p>
            <Katex display>{"\\alpha + \\beta = -\\dfrac{b}{a}, \\qquad \\alpha\\beta = \\dfrac{c}{a}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: finding zeroes and verifying the relationship</h2>
            <p className="blog-post-p">
              Find the zeroes of <Katex>{"6x^2 - 7x - 3"}</Katex> and verify the relationship between
              the zeroes and the coefficients.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Using the quadratic formula with <Katex>{"a=6, b=-7, c=-3"}</Katex>:
            </p>
            <Katex display>{"x = \\dfrac{7 \\pm \\sqrt{49 + 72}}{12} = \\dfrac{7 \\pm 11}{12}"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"x = \\dfrac{3}{2}"}</Katex> or <Katex>{"x = -\\dfrac{1}{3}"}</Katex>.
              Checking against the coefficients:
            </p>
            <Katex display>{"\\alpha + \\beta = \\dfrac{3}{2} - \\dfrac{1}{3} = \\dfrac{7}{6} = -\\dfrac{b}{a}, \\qquad \\alpha\\beta = \\dfrac{3}{2}\\times\\left(-\\dfrac{1}{3}\\right) = -\\dfrac{1}{2} = \\dfrac{c}{a}"}</Katex>
            <p className="blog-post-p">Both match, so the zeroes are verified.</p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: building a polynomial from sum and product</h2>
            <p className="blog-post-p">
              Find a quadratic polynomial whose zeroes have sum <Katex>{"\\sqrt{2}"}</Katex> and
              product <Katex>{"\\dfrac{1}{3}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> A quadratic with sum <Katex>{"S"}</Katex> and product{" "}
              <Katex>{"P"}</Katex> of zeroes is <Katex>{"x^2 - Sx + P"}</Katex>, so here:
            </p>
            <Katex display>{"x^2 - \\sqrt{2}x + \\dfrac{1}{3}"}</Katex>
            <p className="blog-post-p">
              Multiplying through by 3 to clear the fraction gives an equivalent polynomial,{" "}
              <Katex>{"3x^2 - 3\\sqrt{2}x + 1"}</Katex> — any nonzero multiple of a valid answer is
              also valid.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              A quadratic polynomial set equal to zero is exactly a quadratic equation, so the
              zero-finding technique here carries straight over.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/quadratic-equations">Quadratic Equations</Link></li>
              <li><Link href="/resources/quadratic-equations-solved-examples">Quadratic Equations: Solved Examples</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
