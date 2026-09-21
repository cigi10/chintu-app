import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Real Numbers: Irrational Numbers and Decimal Expansions - Studyloaf",
  description: "Proving a number is irrational by contradiction, and telling whether a fraction has a terminating or repeating decimal expansion, with worked examples.",
  openGraph: {
    title: "Real Numbers: Irrational Numbers and Decimal Expansions - Studyloaf",
    description: "Proving a number is irrational by contradiction, and telling whether a fraction has a terminating or repeating decimal expansion, with worked examples.",
  },
};

export default function RealNumbersIrrationalPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Real Numbers: Irrational Numbers and Decimal Expansions",
        description: "Proving a number is irrational by contradiction, and telling whether a fraction has a terminating or repeating decimal expansion, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Real Numbers: Irrational Numbers and Decimal Expansions", href: "/resources/real-numbers-irrational-numbers" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Real Numbers: Irrational Numbers and Decimal Expansions</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Proving a number is irrational</h2>
            <p className="blog-post-p">
              The standard technique is proof by contradiction: assume the number{" "}
              <em>is</em> rational (equal to some fraction <Katex>{"\\frac{a}{b}"}</Katex> of
              integers), then show that assumption forces something impossible.
            </p>
            <p className="blog-post-p">
              Prove that <Katex>{"3 + 2\\sqrt{5}"}</Katex> is irrational.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Suppose <Katex>{"3+2\\sqrt{5}"}</Katex> were rational,
              equal to <Katex>{"\\frac{a}{b}"}</Katex> for integers <Katex>{"a,b"}</Katex> (with{" "}
              <Katex>{"b \\ne 0"}</Katex>). Then:
            </p>
            <Katex display>{"\\dfrac{a}{b} - 3 = 2\\sqrt{5} \\;\\Rightarrow\\; \\sqrt{5} = \\dfrac{a-3b}{2b}"}</Katex>
            <p className="blog-post-p">
              The right side is a ratio of integers, so it&apos;s rational — but{" "}
              <Katex>{"\\sqrt{5}"}</Katex> is known to be irrational. That contradiction means the
              original assumption was false, so <Katex>{"3+2\\sqrt{5}"}</Katex> is irrational.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Spotting a terminating decimal</h2>
            <p className="blog-post-p">
              A fraction in lowest terms has a <strong>terminating</strong> decimal expansion
              exactly when its denominator&apos;s prime factorization contains only 2s and 5s.
              Otherwise the decimal is non-terminating and repeating.
            </p>
            <p className="blog-post-p">
              Without doing the division, decide whether <Katex>{"\\dfrac{15}{1600}"}</Katex> and{" "}
              <Katex>{"\\dfrac{29}{343}"}</Katex> terminate.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"1600 = 2^6 \\times 5^2"}</Katex> — only 2s and
              5s, so <Katex>{"\\dfrac{15}{1600}"}</Katex> terminates (it equals{" "}
              <Katex>{"0.009375"}</Katex>). But <Katex>{"343 = 7^3"}</Katex>, which has a prime
              factor other than 2 or 5, so <Katex>{"\\dfrac{29}{343}"}</Katex> is non-terminating
              and repeating.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Proving irrationality and simplifying surd arithmetic both come from the same set of
              properties of square roots.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/surds-and-radicals">Surds and Radicals</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
