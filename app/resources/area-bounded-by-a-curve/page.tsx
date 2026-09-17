import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Finding the Area Bounded by a Curve - Studyloaf",
  description: "Using definite integrals to find area under a curve, including a full period of cosine and a classic circle-area derivation.",
  openGraph: {
    title: "Finding the Area Bounded by a Curve - Studyloaf",
    description: "Using definite integrals to find area under a curve, including a full period of cosine and a classic circle-area derivation.",
  },
};

export default function AreaBoundedByACurvePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Finding the Area Bounded by a Curve",
        description: "Using definite integrals to find area under a curve, including a full period of cosine and a classic circle-area derivation.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Finding the Area Bounded by a Curve" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Finding the Area Bounded by a Curve</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Area needs absolute value, not a signed integral</h2>
            <p className="blog-post-p">
              A definite integral gives <em>signed</em> area — positive above the x-axis, negative
              below it. To find the actual (unsigned) area enclosed by a curve that dips below the
              axis, integrate over each piece where the sign doesn&apos;t change, and add the
              absolute values together.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a full period of cosine</h2>
            <p className="blog-post-p">
              Find the area bounded by <Katex>{"y=\\cos x"}</Katex> between{" "}
              <Katex>{"x=0"}</Katex> and <Katex>{"x=2\\pi"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"\\cos x \\ge 0"}</Katex> on{" "}
              <Katex>{"[0,\\frac{\\pi}{2}]\\cup[\\frac{3\\pi}{2},2\\pi]"}</Katex> and{" "}
              <Katex>{"\\cos x \\le 0"}</Katex> on <Katex>{"[\\frac{\\pi}{2},\\frac{3\\pi}{2}]"}</Katex>.
              By symmetry, the total area is 4 times the area of one quarter-period:
            </p>
            <Katex display>{"4\\int_0^{\\pi/2}\\cos x\\,dx = 4\\left[\\sin x\\right]_0^{\\pi/2} = 4(1-0) = 4"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: deriving the area of a circle</h2>
            <p className="blog-post-p">
              Find the area of the circle <Katex>{"x^2+y^2=a^2"}</Katex> by integration.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The circle&apos;s upper half is{" "}
              <Katex>{"y=\\sqrt{a^2-x^2}"}</Katex>. By symmetry, the full circle&apos;s area is 4
              times the area in the first quadrant:
            </p>
            <Katex display>{"4\\int_0^a \\sqrt{a^2-x^2}\\,dx = 4\\left[\\dfrac{x}{2}\\sqrt{a^2-x^2} + \\dfrac{a^2}{2}\\sin^{-1}\\dfrac{x}{a}\\right]_0^a"}</Katex>
            <p className="blog-post-p">
              At <Katex>{"x=a"}</Katex> the square-root term vanishes and{" "}
              <Katex>{"\\sin^{-1}(1) = \\frac{\\pi}{2}"}</Katex>, while both terms vanish at{" "}
              <Katex>{"x=0"}</Katex>:
            </p>
            <Katex display>{"= 4\\left(\\dfrac{a^2}{2}\\cdot\\dfrac{\\pi}{2}\\right) = \\pi a^2"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Area calculations are a direct application of definite integrals — the same
              evaluate-the-antiderivative-at-the-limits process used here shows up in any definite
              integral.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/definite-integrals">Definite Integrals</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
