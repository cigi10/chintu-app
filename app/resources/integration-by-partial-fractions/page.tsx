import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Integration by Partial Fractions - Studyloaf",
  description: "Splitting a rational function into simpler fractions before integrating, with worked examples.",
  openGraph: {
    title: "Integration by Partial Fractions - Studyloaf",
    description: "Splitting a rational function into simpler fractions before integrating, with worked examples.",
  },
};

export default function IntegrationByPartialFractionsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Integration by Partial Fractions",
        description: "Splitting a rational function into simpler fractions before integrating, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Integration by Partial Fractions" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Integration by Partial Fractions</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The idea</h2>
            <p className="blog-post-p">
              When the denominator of a rational function factors into distinct linear pieces, the
              whole fraction can be rewritten as a sum of simpler fractions, each of which has a
              known antiderivative involving a logarithm:
            </p>
            <Katex display>{"\\int \\dfrac{1}{x-a}\\,dx = \\ln|x-a| + C"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\displaystyle\\int \\dfrac{x}{(x+1)(x+2)}\\,dx"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Write <Katex>{"\\dfrac{x}{(x+1)(x+2)} = \\dfrac{A}{x+1} + \\dfrac{B}{x+2}"}</Katex>,
              so <Katex>{"x = A(x+2) + B(x+1)"}</Katex>. Setting <Katex>{"x=-1"}</Katex> gives{" "}
              <Katex>{"A=-1"}</Katex>; setting <Katex>{"x=-2"}</Katex> gives <Katex>{"B=2"}</Katex>:
            </p>
            <Katex display>{"\\int \\left(\\dfrac{-1}{x+1} + \\dfrac{2}{x+2}\\right)dx = -\\ln|x+1| + 2\\ln|x+2| + C = \\ln\\dfrac{(x+2)^2}{|x+1|} + C"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\displaystyle\\int \\dfrac{2x}{x^2+3x+2}\\,dx"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The denominator factors as{" "}
              <Katex>{"(x+1)(x+2)"}</Katex>. Writing{" "}
              <Katex>{"\\dfrac{2x}{(x+1)(x+2)} = \\dfrac{A}{x+1} + \\dfrac{B}{x+2}"}</Katex> gives{" "}
              <Katex>{"2x = A(x+2)+B(x+1)"}</Katex>. Setting <Katex>{"x=-1"}</Katex>:{" "}
              <Katex>{"A=-2"}</Katex>. Setting <Katex>{"x=-2"}</Katex>: <Katex>{"B=4"}</Katex>:
            </p>
            <Katex display>{"\\int \\left(\\dfrac{-2}{x+1} + \\dfrac{4}{x+2}\\right)dx = 4\\ln|x+2| - 2\\ln|x+1| + C"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Partial fractions are one technique for a rational integrand — some standard rational
              forms have their own ready-made formulas instead.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/integration-of-particular-functions">Integration of Particular Functions</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
