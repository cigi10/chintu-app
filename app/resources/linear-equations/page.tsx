import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Linear Equations - Studyloaf",
  description: "How to solve a one-variable linear equation, including fractional coefficients, with worked examples translating word problems into equations.",
  openGraph: {
    title: "Linear Equations - Studyloaf",
    description: "How to solve a one-variable linear equation, including fractional coefficients, with worked examples translating word problems into equations.",
  },
};

export default function LinearEquationsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Linear Equations",
        description: "How to solve a one-variable linear equation, including fractional coefficients, with worked examples translating word problems into equations.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Linear Equations" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Linear Equations</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: an equation with mixed fractions</h2>
            <p className="blog-post-p">
              Solve <Katex>{"x - 2\\frac{1}{3} = 5\\frac{1}{2}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Isolate <Katex>{"x"}</Katex> by adding{" "}
              <Katex>{"2\\frac{1}{3}"}</Katex> to both sides:
            </p>
            <Katex display>{"x = 5\\tfrac{1}{2} + 2\\tfrac{1}{3} = \\left(5+2\\right) + \\left(\\tfrac{1}{2}+\\tfrac{1}{3}\\right) = 7 + \\tfrac{3+2}{6} = 7\\tfrac{5}{6}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a word problem</h2>
            <p className="blog-post-p">
              One fourth of a number, added to one sixth of it, is 15. Find the number.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let the number be <Katex>{"n"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{n}{4} + \\dfrac{n}{6} = 15"}</Katex>
            <p className="blog-post-p">
              Using a common denominator of 12: <Katex>{"\\dfrac{3n}{12} + \\dfrac{2n}{12} = \\dfrac{5n}{12} = 15"}</Katex>,
              so:
            </p>
            <Katex display>{"n = \\dfrac{15 \\times 12}{5} = 36"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Linear equations are the entry point before quadratic equations — the same
              isolate-the-variable habit carries over once a squared term is involved.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/quadratic-equations-solved-examples">Quadratic Equations: Solved Examples</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
