import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Polynomials: Definitions and Degree - Studyloaf",
  description: "What makes an expression a polynomial, the monomial/binomial/trinomial distinction, and how to find the degree of a polynomial in one or more variables.",
  openGraph: {
    title: "Polynomials: Definitions and Degree - Studyloaf",
    description: "What makes an expression a polynomial, the monomial/binomial/trinomial distinction, and how to find the degree of a polynomial in one or more variables.",
  },
};

export default function PolynomialsDefinitionsAndDegreePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Polynomials: Definitions and Degree",
        description: "What makes an expression a polynomial, the monomial/binomial/trinomial distinction, and how to find the degree of a polynomial in one or more variables.",
        datePublished: "2026-09-23T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Polynomials: Definitions and Degree", href: "/resources/polynomials-definitions-and-degree" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Polynomials: Definitions and Degree</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What makes an expression a polynomial</h2>
            <p className="blog-post-p">
              A polynomial is an algebraic expression where every variable is raised only to a
              non-negative whole-number power. That single rule is what disqualifies some
              expressions that otherwise look similar:
            </p>
            <ul className="blog-post-list">
              <li><Katex>{"4x^2 - 15x + 9"}</Katex> is a polynomial (powers 2, 1, 0 — all non-negative whole numbers).</li>
              <li><Katex>{"5x + 2y^{-1} - 120"}</Katex> is <em>not</em> a polynomial — <Katex>{"y"}</Katex> has a negative power.</li>
              <li><Katex>{"y^{6/7} + 2z - \\tfrac{1}{2}"}</Katex> is <em>not</em> a polynomial — <Katex>{"6/7"}</Katex> isn&apos;t a whole number.</li>
            </ul>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Monomial, binomial, trinomial</h2>
            <p className="blog-post-p">
              The parts of a polynomial separated by <Katex>{"+"}</Katex> or <Katex>{"-"}</Katex>{" "}
              are its <strong>terms</strong>. The number of terms names the expression:
            </p>
            <ul className="blog-post-list">
              <li><strong>Monomial</strong> — one term, e.g. <Katex>{"5z"}</Katex> or <Katex>{"4x^2"}</Katex>.</li>
              <li><strong>Binomial</strong> — two terms, e.g. <Katex>{"3p - 2q"}</Katex>.</li>
              <li><strong>Trinomial</strong> — three terms, e.g. <Katex>{"4x^2 + 6x + 7"}</Katex>.</li>
            </ul>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Finding the degree</h2>
            <p className="blog-post-p">
              In one variable, the degree is just the highest power present. With multiple
              variables, add the exponents <em>within</em> each term, then take the highest total
              across all terms.
            </p>
            <p className="blog-post-p">
              <strong>Worked example:</strong> find the degree of{" "}
              <Katex>{"5x^2y^3 + 2x^2y^2 - 8xy"}</Katex>.
            </p>
            <p className="blog-post-p">Add exponents within each term:</p>
            <Katex display>{"5x^2y^3: 2+3=5, \\qquad 2x^2y^2: 2+2=4, \\qquad -8xy: 1+1=2"}</Katex>
            <p className="blog-post-p">
              The highest total is 5, so the polynomial has degree <strong>5</strong>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Once you can identify a polynomial and its degree, finding its zeroes and dividing
              one polynomial by another build directly on these same definitions.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/polynomials-zeroes-and-coefficients">Polynomials: Zeroes and Coefficients</Link></li>
              <li><Link href="/resources/polynomial-division-algorithm">Polynomial Division Algorithm</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
