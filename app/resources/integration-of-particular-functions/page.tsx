import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Integration of Particular Functions - Studyloaf",
  description: "Standard integration formulas for functions like 1/(x^2-a^2) and 1/(a^2-x^2), with worked examples.",
  openGraph: {
    title: "Integration of Particular Functions - Studyloaf",
    description: "Standard integration formulas for functions like 1/(x^2-a^2) and 1/(a^2-x^2), with worked examples.",
  },
};

export default function IntegrationOfParticularFunctionsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Integration of Particular Functions",
        description: "Standard integration formulas for functions like 1/(x^2-a^2) and 1/(a^2-x^2), with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Integration of Particular Functions", href: "/resources/integration-of-particular-functions" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Integration of Particular Functions</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Two standard forms</h2>
            <p className="blog-post-p">
              A handful of rational forms show up often enough in calculus that it&apos;s worth
              knowing their antiderivatives directly, rather than re-deriving them via partial
              fractions every time:
            </p>
            <Katex display>{"\\int \\dfrac{dx}{x^2-a^2} = \\dfrac{1}{2a}\\ln\\left|\\dfrac{x-a}{x+a}\\right| + C"}</Katex>
            <Katex display>{"\\int \\dfrac{dx}{a^2-x^2} = \\dfrac{1}{2a}\\ln\\left|\\dfrac{a+x}{a-x}\\right| + C"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\displaystyle\\int \\dfrac{x^2}{1-x^6}\\,dx"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Substitute <Katex>{"u = x^3"}</Katex>, so{" "}
              <Katex>{"du = 3x^2\\,dx"}</Katex>:
            </p>
            <Katex display>{"\\int \\dfrac{x^2}{1-x^6}\\,dx = \\dfrac{1}{3}\\int \\dfrac{du}{1-u^2} = \\dfrac{1}{3}\\cdot\\dfrac{1}{2}\\ln\\left|\\dfrac{1+u}{1-u}\\right| + C = \\dfrac{1}{6}\\ln\\left|\\dfrac{1+x^3}{1-x^3}\\right| + C"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              These standard forms usually come from splitting a rational function into partial
              fractions in the first place.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/integration-by-partial-fractions">Integration by Partial Fractions</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
