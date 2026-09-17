import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Integral of e^x[f(x) + f'(x)] - Studyloaf",
  description: "A shortcut formula for integrating e^x times a function plus its own derivative, with a worked example.",
  openGraph: {
    title: "Integral of e^x[f(x) + f'(x)] - Studyloaf",
    description: "A shortcut formula for integrating e^x times a function plus its own derivative, with a worked example.",
  },
};

export default function IntegralExFPlusFPrimePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Integral of e^x[f(x) + f'(x)]",
        description: "A shortcut formula for integrating e^x times a function plus its own derivative, with a worked example.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Integral of e^x[f(x) + f'(x)]" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Integral of e<sup>x</sup>[f(x) + f&apos;(x)]</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The shortcut formula</h2>
            <p className="blog-post-p">
              Whenever an integrand has the exact shape <Katex>{"e^x"}</Katex> times{" "}
              <Katex>{"[f(x) + f'(x)]"}</Katex>, it integrates instantly, no substitution or parts
              needed:
            </p>
            <Katex display>{"\\int e^x\\left[f(x) + f'(x)\\right]dx = e^x f(x) + C"}</Katex>
            <p className="blog-post-p">
              This follows directly from the product rule run in reverse:{" "}
              <Katex>{"\\frac{d}{dx}\\left[e^xf(x)\\right] = e^xf(x) + e^xf'(x) = e^x[f(x)+f'(x)]"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\displaystyle\\int e^x\\left(\\dfrac{1}{x} - \\dfrac{1}{x^2}\\right)dx"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let <Katex>{"f(x) = \\dfrac{1}{x}"}</Katex>. Then{" "}
              <Katex>{"f'(x) = -\\dfrac{1}{x^2}"}</Katex> — exactly matching the second term. So the
              integrand is <Katex>{"e^x[f(x)+f'(x)]"}</Katex>, and:
            </p>
            <Katex display>{"\\int e^x\\left(\\dfrac{1}{x} - \\dfrac{1}{x^2}\\right)dx = e^xf(x) + C = \\dfrac{e^x}{x} + C"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              This trick is really integration by parts in disguise — recognizing the pattern
              upfront just skips having to run the parts formula.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/integration-by-parts">Integration by Parts</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
