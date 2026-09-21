import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Power Rule - Studyloaf",
  description: "The power rule for differentiating x to a fixed exponent, with a worked example on a square root.",
  openGraph: {
    title: "Power Rule - Studyloaf",
    description: "The power rule for differentiating x to a fixed exponent, with a worked example on a square root.",
  },
};

export default function PowerRulePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Power Rule",
        description: "The power rule for differentiating x to a fixed exponent, with a worked example on a square root.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Power Rule", href: "/resources/power-rule" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Power Rule</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The rule</h2>
            <p className="blog-post-p">
              For any fixed exponent <Katex>{"n"}</Katex>, the derivative of{" "}
              <Katex>{"x^n"}</Katex> brings the exponent down as a multiplier and reduces it by one:
            </p>
            <Katex display>{"\\dfrac{d}{dx}\\left[x^n\\right] = nx^{n-1}"}</Katex>
            <p className="blog-post-p">
              This works for negative and fractional exponents too, not just positive whole numbers.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the derivative of <Katex>{"f(x) = \\sqrt{x}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Rewrite the square root as a fractional exponent,{" "}
              <Katex>{"f(x) = x^{1/2}"}</Katex>, then apply the power rule with{" "}
              <Katex>{"n = \\frac{1}{2}"}</Katex>:
            </p>
            <Katex display>{"f'(x) = \\dfrac{1}{2}x^{\\frac{1}{2} - 1} = \\dfrac{1}{2}x^{-\\frac{1}{2}}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The power rule only differentiates a single power of x — once two functions are
              multiplied or divided together, the product rule or quotient rule takes over.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/product-rule">Product Rule</Link></li>
              <li><Link href="/resources/quotient-rule">Quotient Rule</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
