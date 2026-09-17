import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Maxima and Minima - Studyloaf",
  description: "Finding local maxima and minima and solving optimization problems using derivatives, with worked examples.",
  openGraph: {
    title: "Maxima and Minima - Studyloaf",
    description: "Finding local maxima and minima and solving optimization problems using derivatives, with worked examples.",
  },
};

export default function MaximaAndMinimaPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Maxima and Minima",
        description: "Finding local maxima and minima and solving optimization problems using derivatives, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Maxima and Minima" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Maxima and Minima</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The second derivative test</h2>
            <p className="blog-post-p">
              At a point where <Katex>{"f'(x) = 0"}</Katex>: if <Katex>{"f''(x) < 0"}</Katex>, it&apos;s
              a local maximum; if <Katex>{"f''(x) > 0"}</Katex>, it&apos;s a local minimum.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: local maximum of a cubic</h2>
            <p className="blog-post-p">
              Find the local maximum value of <Katex>{"g(x) = x^3 - 3x"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"g'(x) = 3x^2 - 3 = 0"}</Katex> at{" "}
              <Katex>{"x = \\pm 1"}</Katex>. Checking the second derivative,{" "}
              <Katex>{"g''(x) = 6x"}</Katex>:
            </p>
            <p className="blog-post-p">
              At <Katex>{"x=-1"}</Katex>: <Katex>{"g''(-1) = -6 < 0"}</Katex>, a local maximum, with
              value <Katex>{"g(-1) = -1 - (-3) = 2"}</Katex>.
            </p>
            <p className="blog-post-p">
              At <Katex>{"x=1"}</Katex>: <Katex>{"g''(1) = 6 > 0"}</Katex>, a local minimum. So the
              local maximum value is <strong>2</strong>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: an optimization problem</h2>
            <p className="blog-post-p">
              Find two positive numbers whose sum is 15 and whose sum of squares is as small as
              possible.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let the numbers be <Katex>{"x"}</Katex> and{" "}
              <Katex>{"15-x"}</Katex>. Minimize:
            </p>
            <Katex display>{"f(x) = x^2 + (15-x)^2 = 2x^2 - 30x + 225"}</Katex>
            <p className="blog-post-p">
              <Katex>{"f'(x) = 4x - 30 = 0"}</Katex> at <Katex>{"x = 7.5"}</Katex>, and{" "}
              <Katex>{"f''(x) = 4 > 0"}</Katex>, confirming a minimum. So the two numbers are{" "}
              <Katex>{"x = 7.5"}</Katex> and <Katex>{"15 - x = 7.5"}</Katex> — split evenly.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The intervals where a function is increasing and decreasing are exactly what
              determines whether a critical point is a maximum or a minimum.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/increasing-and-decreasing-functions">Increasing and Decreasing Functions</Link></li>
              <li><Link href="/resources/applications-of-derivatives">Applications of Derivatives</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
