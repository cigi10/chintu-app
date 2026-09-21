import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Surds and Radicals - Studyloaf",
  description: "Simplifying and rationalizing expressions with square roots, with worked examples including a telescoping sum.",
  openGraph: {
    title: "Surds and Radicals - Studyloaf",
    description: "Simplifying and rationalizing expressions with square roots, with worked examples including a telescoping sum.",
  },
};

export default function SurdsAndRadicalsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Surds and Radicals",
        description: "Simplifying and rationalizing expressions with square roots, with worked examples including a telescoping sum.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Surds and Radicals", href: "/resources/surds-and-radicals" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Surds and Radicals</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Rationalizing a denominator</h2>
            <p className="blog-post-p">
              To simplify a fraction with a surd in the denominator, multiply top and bottom by the
              conjugate — this uses the difference-of-squares identity{" "}
              <Katex>{"(a-b)(a+b) = a^2-b^2"}</Katex> to clear the square root from the bottom.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              If <Katex>{"x = 2+\\sqrt{3}"}</Katex>, find <Katex>{"x^2 + \\dfrac{1}{x^2}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Rationalize <Katex>{"\\frac{1}{x}"}</Katex> first:
            </p>
            <Katex display>{"\\dfrac{1}{x} = \\dfrac{1}{2+\\sqrt{3}} \\times \\dfrac{2-\\sqrt{3}}{2-\\sqrt{3}} = \\dfrac{2-\\sqrt{3}}{4-3} = 2-\\sqrt{3}"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"x + \\frac{1}{x} = (2+\\sqrt{3})+(2-\\sqrt{3}) = 4"}</Katex>, and squaring
              both sides:
            </p>
            <Katex display>{"\\left(x+\\dfrac{1}{x}\\right)^2 = x^2 + \\dfrac{1}{x^2} + 2 = 16 \\;\\Rightarrow\\; x^2+\\dfrac{1}{x^2} = 14"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a telescoping sum</h2>
            <p className="blog-post-p">
              Show that <Katex>{"\\dfrac{1}{3-\\sqrt{8}} - \\dfrac{1}{\\sqrt{8}-\\sqrt{7}} + \\dfrac{1}{\\sqrt{7}-\\sqrt{6}} - \\dfrac{1}{\\sqrt{6}-\\sqrt{5}} + \\dfrac{1}{\\sqrt{5}-2} = 5"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Every denominator here is a difference of consecutive
              square roots, and each has the form <Katex>{"(a-b)(a+b)=a^2-b^2"}</Katex>, always
              equal to exactly 1 once rationalized (e.g.{" "}
              <Katex>{"3^2 - (\\sqrt{8})^2 = 9-8=1"}</Katex>). Rationalizing each term:
            </p>
            <Katex display>{"(3+\\sqrt{8}) - (\\sqrt{8}+\\sqrt{7}) + (\\sqrt{7}+\\sqrt{6}) - (\\sqrt{6}+\\sqrt{5}) + (\\sqrt{5}+2)"}</Katex>
            <p className="blog-post-p">
              Every surd term cancels with its neighbor, leaving only <Katex>{"3+2=5"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Rationalizing a denominator is the same tool used to prove that expressions like{" "}
              <Katex>{"\\frac{1}{\\sqrt{2}}"}</Katex> are irrational.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/real-numbers-irrational-numbers">Real Numbers: Irrational Numbers and Decimal Expansions</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
