import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Product Rule - Studyloaf",
  description: "The product rule for differentiating a product of two functions, with worked examples including logarithmic differentiation.",
  openGraph: {
    title: "Product Rule - Studyloaf",
    description: "The product rule for differentiating a product of two functions, with worked examples including logarithmic differentiation.",
  },
};

export default function ProductRulePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Product Rule",
        description: "The product rule for differentiating a product of two functions, with worked examples including logarithmic differentiation.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Product Rule", href: "/resources/product-rule" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Product Rule</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The rule</h2>
            <p className="blog-post-p">
              To differentiate a product of two functions, differentiate each one in turn while
              holding the other fixed, then add the results:
            </p>
            <Katex display>{"\\dfrac{d}{dx}\\left[u(x)v(x)\\right] = u'(x)v(x) + u(x)v'(x)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the derivative of <Katex>{"f(x) = (x^2+1)(x^3-3x)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> With <Katex>{"u=x^2+1"}</Katex> (so{" "}
              <Katex>{"u'=2x"}</Katex>) and <Katex>{"v=x^3-3x"}</Katex> (so{" "}
              <Katex>{"v'=3x^2-3"}</Katex>):
            </p>
            <Katex display>{"f'(x) = 2x(x^3-3x) + (x^2+1)(3x^2-3)"}</Katex>
            <Katex display>{"= (2x^4-6x^2) + (3x^4-3) = 5x^4 - 6x^2 - 3"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Logarithmic differentiation, a product-rule cousin</h2>
            <p className="blog-post-p">
              When a variable appears in both the base and the exponent, taking a logarithm first
              turns the problem into one the product rule can handle.
            </p>
            <p className="blog-post-p">
              If <Katex>{"y = x^{\\sin x}"}</Katex> for <Katex>{"x > 0"}</Katex>, find{" "}
              <Katex>{"\\dfrac{dy}{dx}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Take the natural log of both sides:{" "}
              <Katex>{"\\ln y = \\sin x \\ln x"}</Katex>. Differentiate both sides — the right side
              is now a product:
            </p>
            <Katex display>{"\\dfrac{y'}{y} = \\cos x \\ln x + \\sin x \\cdot \\dfrac{1}{x}"}</Katex>
            <p className="blog-post-p">
              Multiplying back through by <Katex>{"y = x^{\\sin x}"}</Katex>:
            </p>
            <Katex display>{"y' = x^{\\sin x}\\left[\\dfrac{\\sin x}{x} + \\ln x \\cos x\\right]"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The quotient rule is the product rule&apos;s counterpart for dividing two functions
              instead of multiplying them.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/quotient-rule">Quotient Rule</Link></li>
              <li><Link href="/resources/power-rule">Power Rule</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
