import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Polynomial Division Algorithm - Studyloaf",
  description: "Dividing one polynomial by another to find a quotient and remainder, and using that to find missing zeroes, with worked examples.",
  openGraph: {
    title: "Polynomial Division Algorithm - Studyloaf",
    description: "Dividing one polynomial by another to find a quotient and remainder, and using that to find missing zeroes, with worked examples.",
  },
};

export default function PolynomialDivisionAlgorithmPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Polynomial Division Algorithm",
        description: "Dividing one polynomial by another to find a quotient and remainder, and using that to find missing zeroes, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Polynomial Division Algorithm", href: "/resources/polynomial-division-algorithm" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Polynomial Division Algorithm</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The algorithm</h2>
            <p className="blog-post-p">
              Dividing polynomial <Katex>{"p(x)"}</Katex> by <Katex>{"g(x)"}</Katex> (with{" "}
              <Katex>{"g(x) \\ne 0"}</Katex>) always produces a quotient and remainder satisfying:
            </p>
            <Katex display>{"p(x) = g(x)q(x) + r(x), \\qquad r(x)=0 \\text{ or } \\deg r(x) < \\deg g(x)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Divide <Katex>{"p(x) = x^3 - 3x^2 + 5x - 3"}</Katex> by{" "}
              <Katex>{"g(x) = x^2 - 2"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"x^3"}</Katex> divided by <Katex>{"x^2"}</Katex>{" "}
              gives <Katex>{"x"}</Katex>; subtracting <Katex>{"x(x^2-2) = x^3-2x"}</Katex> leaves{" "}
              <Katex>{"-3x^2+7x-3"}</Katex>. Then <Katex>{"-3x^2"}</Katex> divided by{" "}
              <Katex>{"x^2"}</Katex> gives <Katex>{"-3"}</Katex>; subtracting{" "}
              <Katex>{"-3(x^2-2)=-3x^2+6"}</Katex> leaves <Katex>{"7x-9"}</Katex>, whose degree is
              now below the divisor&apos;s:
            </p>
            <Katex display>{"\\text{Quotient} = x - 3, \\qquad \\text{Remainder} = 7x - 9"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: finding remaining zeroes</h2>
            <p className="blog-post-p">
              Two zeroes of <Katex>{"3x^4+6x^3-2x^2-10x-5"}</Katex> are{" "}
              <Katex>{"\\pm\\sqrt{5/3}"}</Katex>. Find the other zeroes.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Since <Katex>{"\\pm\\sqrt{5/3}"}</Katex> are zeroes,{" "}
              <Katex>{"\\left(x-\\sqrt{5/3}\\right)\\left(x+\\sqrt{5/3}\\right) = x^2-\\frac{5}{3}"}</Katex>{" "}
              is a factor. Dividing the original polynomial by this factor gives quotient{" "}
              <Katex>{"3x^2+6x+3"}</Katex>, which factors as:
            </p>
            <Katex display>{"3x^2+6x+3 = 3(x+1)^2"}</Katex>
            <p className="blog-post-p">
              So the remaining two zeroes are both <strong>-1</strong> (a repeated root).
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Dividing out a known factor to uncover the remaining zeroes only works because of the
              same sum/product relationship between a polynomial&apos;s zeroes and its coefficients.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/polynomials-zeroes-and-coefficients">Polynomials: Zeroes and Coefficients</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
