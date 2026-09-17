import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Increasing and Decreasing Functions - Studyloaf",
  description: "How the sign of a function's derivative determines where it's increasing or decreasing, with worked examples including a cubic.",
  openGraph: {
    title: "Increasing and Decreasing Functions - Studyloaf",
    description: "How the sign of a function's derivative determines where it's increasing or decreasing, with worked examples including a cubic.",
  },
};

export default function IncreasingDecreasingPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Increasing and Decreasing Functions",
        description: "How the sign of a function's derivative determines where it's increasing or decreasing, with worked examples including a cubic.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Increasing and Decreasing Functions" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Increasing and Decreasing Functions</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Reading the sign of the derivative</h2>
            <p className="blog-post-p">
              Where <Katex>{"f'(x) > 0"}</Katex>, the function is increasing. Where{" "}
              <Katex>{"f'(x) < 0"}</Katex>, it&apos;s decreasing. Finding the intervals just means
              solving <Katex>{"f'(x) = 0"}</Katex> for the boundary points, then checking the sign
              of <Katex>{"f'"}</Katex> in each region between them.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the intervals in which <Katex>{"f(x) = x^2 - 4x + 6"}</Katex> is strictly
              increasing or decreasing.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"f'(x) = 2x - 4"}</Katex>, which is zero at{" "}
              <Katex>{"x=2"}</Katex>. For <Katex>{"x<2"}</Katex>, <Katex>{"f'(x)<0"}</Katex>; for{" "}
              <Katex>{"x>2"}</Katex>, <Katex>{"f'(x)>0"}</Katex>. So <Katex>{"f"}</Katex> is
              strictly increasing on <Katex>{"(2, \\infty)"}</Katex> and strictly decreasing on{" "}
              <Katex>{"(-\\infty, 2)"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a cubic with two turning points</h2>
            <p className="blog-post-p">
              Find the intervals in which <Katex>{"f(x) = 4x^3 - 6x^2 - 72x + 30"}</Katex> is
              strictly increasing or decreasing.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"f'(x) = 12x^2 - 12x - 72 = 12(x-3)(x+2)"}</Katex>,
              zero at <Katex>{"x=-2"}</Katex> and <Katex>{"x=3"}</Katex>. Testing a point in each of
              the three regions:
            </p>
            <ul className="blog-post-list">
              <li>At <Katex>{"x=-3"}</Katex>: <Katex>{"f'(-3) = 12(-6)(-1) = 72 > 0"}</Katex></li>
              <li>At <Katex>{"x=0"}</Katex>: <Katex>{"f'(0) = 12(-3)(2) = -72 < 0"}</Katex></li>
              <li>At <Katex>{"x=4"}</Katex>: <Katex>{"f'(4) = 12(1)(6) = 72 > 0"}</Katex></li>
            </ul>
            <p className="blog-post-p">
              So <Katex>{"f"}</Katex> is strictly increasing on{" "}
              <Katex>{"(-\\infty, -2) \\cup (3, \\infty)"}</Katex> and strictly decreasing on{" "}
              <Katex>{"(-2, 3)"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The same turning points where a function switches from increasing to decreasing are
              exactly its local maxima and minima.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/maxima-and-minima">Maxima and Minima</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
