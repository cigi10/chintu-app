import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Polynomial Identities and the Remainder Theorem - Studyloaf",
  description: "Using the Remainder Theorem to find a remainder without dividing, and factoring with the sum/difference-of-cubes identities, with worked examples.",
  openGraph: {
    title: "Polynomial Identities and the Remainder Theorem - Studyloaf",
    description: "Using the Remainder Theorem to find a remainder without dividing, and factoring with the sum/difference-of-cubes identities, with worked examples.",
  },
};

export default function PolynomialIdentitiesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Polynomial Identities and the Remainder Theorem",
        description: "Using the Remainder Theorem to find a remainder without dividing, and factoring with the sum/difference-of-cubes identities, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Polynomial Identities and the Remainder Theorem" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Polynomial Identities and the Remainder Theorem</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The Remainder Theorem</h2>
            <p className="blog-post-p">
              When a polynomial <Katex>{"p(x)"}</Katex> is divided by <Katex>{"x-a"}</Katex>, the
              remainder is just <Katex>{"p(a)"}</Katex> — no long division required.
            </p>
            <p className="blog-post-p">
              The polynomials <Katex>{"ax^3+3x^2-3"}</Katex> and <Katex>{"2x^3-5x+a"}</Katex> leave
              the same remainder when divided by <Katex>{"x-4"}</Katex>. Find <Katex>{"a"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Both remainders equal the polynomial evaluated at{" "}
              <Katex>{"x=4"}</Katex>:
            </p>
            <Katex display>{"a(4)^3+3(4)^2-3 = 64a+45, \\qquad 2(4)^3-5(4)+a = 108+a"}</Katex>
            <p className="blog-post-p">Setting them equal:</p>
            <Katex display>{"64a+45 = 108+a \\;\\Rightarrow\\; 63a=63 \\;\\Rightarrow\\; a=1"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Factoring with the cube identities</h2>
            <p className="blog-post-p">
              Recognizing a sum or difference of cubes pattern turns a hard-looking factoring
              problem into a one-line answer:
            </p>
            <Katex display>{"(x+y)^3 = x^3+y^3+3xy(x+y), \\qquad x^3-y^3=(x-y)(x^2+xy+y^2)"}</Katex>
            <p className="blog-post-p">
              Factorize <Katex>{"64a^3 - 27b^3 - 144a^2b + 108ab^2"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> With <Katex>{"x=4a"}</Katex> and <Katex>{"y=3b"}</Katex>,{" "}
              <Katex>{"x^3=64a^3"}</Katex> and <Katex>{"y^3=27b^3"}</Katex>. The middle terms match{" "}
              <Katex>{"3xy(x-y) = 3(4a)(3b)(4a-3b) = 144a^2b - 108ab^2"}</Katex>, so the full
              expression is <Katex>{"(x-y)^3 = x^3-y^3-3xy(x-y)"}</Katex>:
            </p>
            <Katex display>{"64a^3-27b^3-144a^2b+108ab^2 = (4a-3b)^3"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: rectangle side lengths</h2>
            <p className="blog-post-p">
              A rectangle&apos;s area is <Katex>{"25a^2-35a+12"}</Katex>. Give possible expressions
              for its length and breadth.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Substituting <Katex>{"x=5a"}</Katex> turns the expression
              into <Katex>{"x^2-7x+12"}</Katex>, which factors as <Katex>{"(x-4)(x-3)"}</Katex>{" "}
              (since <Katex>{"-4\\times-3=12"}</Katex> and <Katex>{"-4+-3=-7"}</Katex>). Replacing{" "}
              <Katex>{"x"}</Katex> with <Katex>{"5a"}</Katex> again:
            </p>
            <Katex display>{"25a^2-35a+12 = (5a-4)(5a-3)"}</Katex>
            <p className="blog-post-p">
              So the length and breadth could be <Katex>{"(5a-4)"}</Katex> and{" "}
              <Katex>{"(5a-3)"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Dividing polynomials directly, rather than just evaluating one point via the Remainder
              Theorem, is the more general version of this same idea.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/polynomial-division-algorithm">Polynomial Division Algorithm</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
