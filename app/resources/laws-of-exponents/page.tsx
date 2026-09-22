import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Laws of Exponents - Studyloaf",
  description: "The core rules for combining and simplifying exponents, including negative exponents, with worked examples.",
  openGraph: {
    title: "Laws of Exponents - Studyloaf",
    description: "The core rules for combining and simplifying exponents, including negative exponents, with worked examples.",
  },
};

export default function LawsOfExponentsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Laws of Exponents",
        description: "The core rules for combining and simplifying exponents, including negative exponents, with worked examples.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Laws of Exponents", href: "/resources/laws-of-exponents" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Laws of Exponents</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The three core rules</h2>
            <ul className="blog-post-list">
              <li>
                <strong>Same base, multiplying:</strong> add the exponents —{" "}
                <Katex>{"x^m \\cdot x^n = x^{m+n}"}</Katex>. E.g.{" "}
                <Katex>{"2^4 \\cdot 2^3 = 2^{7} = 128"}</Katex>.
              </li>
              <li>
                <strong>A power raised to a power:</strong> multiply the exponents —{" "}
                <Katex>{"(x^m)^n = x^{mn}"}</Katex>. E.g.{" "}
                <Katex>{"(3^2)^5 = 3^{10} = 59049"}</Katex>.
              </li>
              <li>
                <strong>Negative exponent:</strong> take the reciprocal —{" "}
                <Katex>{"x^{-m} = \\dfrac{1}{x^m}"}</Katex>. E.g.{" "}
                <Katex>{"2^{-5} = \\dfrac{1}{32}"}</Katex>.
              </li>
            </ul>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a negative exponent on a fraction</h2>
            <p className="blog-post-p">
              Simplify <Katex>{"\\left(\\dfrac{-3}{4}\\right)^{-3}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> A negative exponent on a fraction flips it, then applies
              the (now positive) power:
            </p>
            <Katex display>{"\\left(\\dfrac{-3}{4}\\right)^{-3} = \\left(\\dfrac{4}{-3}\\right)^3 = \\left(\\dfrac{-4}{3}\\right)^3 = \\dfrac{-64}{27}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: combining rules to avoid big numbers</h2>
            <p className="blog-post-p">
              Simplify <Katex>{"\\dfrac{7^8 \\times 12^8}{14^8 \\times 6^8}"}</Katex> without
              computing any of these to the 8th power directly.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Notice <Katex>{"7 \\times 12 = 84 = 14 \\times 6"}</Katex>{" "}
              — the numerator and denominator are built from the same product, just split
              differently. Since <Katex>{"a^n b^n = (ab)^n"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{7^8 \\times 12^8}{14^8 \\times 6^8} = \\dfrac{(7\\times12)^8}{(14\\times6)^8} = \\dfrac{84^8}{84^8} = 1"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: solving for an exponent</h2>
            <p className="blog-post-p">
              If <Katex>{"\\left(\\dfrac{5}{3}\\right)^{-5} \\times \\left(\\dfrac{5}{3}\\right)^{11} = \\left(\\dfrac{5}{3}\\right)^{8x}"}</Katex>,
              find <Katex>{"x"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Same base on both sides, so just add the exponents on the
              left and match:
            </p>
            <Katex display>{"(-5) + 11 = 8x \\;\\Rightarrow\\; 6 = 8x \\;\\Rightarrow\\; x = \\dfrac{6}{8}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              These same rules are exactly what makes logarithms — the inverse operation of
              exponentiation — behave the way they do.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/logarithms">Logarithms</Link></li>
              <li><Link href="/resources/surds-and-radicals">Surds and Radicals</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
