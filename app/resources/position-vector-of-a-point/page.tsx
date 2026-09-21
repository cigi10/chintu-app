import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Finding the Position Vector of a Point - Studyloaf",
  description: "The section formula for a point dividing a segment internally or externally, and finding a midpoint, with worked examples.",
  openGraph: {
    title: "Finding the Position Vector of a Point - Studyloaf",
    description: "The section formula for a point dividing a segment internally or externally, and finding a midpoint, with worked examples.",
  },
};

export default function PositionVectorPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Finding the Position Vector of a Point",
        description: "The section formula for a point dividing a segment internally or externally, and finding a midpoint, with worked examples.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Finding the Position Vector of a Point", href: "/resources/position-vector-of-a-point" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Finding the Position Vector of a Point</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The section formula</h2>
            <p className="blog-post-p">
              A point <Katex>{"R"}</Katex> dividing the segment from <Katex>{"P"}</Katex> to{" "}
              <Katex>{"Q"}</Katex> in the ratio <Katex>{"m:n"}</Katex> has position vector:
            </p>
            <Katex display>{"\\text{Internally: } \\dfrac{m\\vec{q}+n\\vec{p}}{m+n}, \\qquad \\text{Externally: } \\dfrac{m\\vec{q}-n\\vec{p}}{m-n}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the position vector of <Katex>{"R"}</Katex>, which divides the segment joining{" "}
              <Katex>{"P"}</Katex> (position vector <Katex>{"\\hat{i}+2\\hat{j}-\\hat{k}"}</Katex>)
              and <Katex>{"Q"}</Katex> (position vector <Katex>{"-\\hat{i}+\\hat{j}+\\hat{k}"}</Katex>)
              in the ratio 2:1, both internally and externally.
            </p>
            <p className="blog-post-p">
              <strong>Solution — internally</strong> (<Katex>{"m=2, n=1"}</Katex>):
            </p>
            <Katex display>{"R = \\dfrac{2(-\\hat{i}+\\hat{j}+\\hat{k}) + 1(\\hat{i}+2\\hat{j}-\\hat{k})}{3} = \\dfrac{-\\hat{i}+4\\hat{j}+\\hat{k}}{3}"}</Katex>
            <p className="blog-post-p">
              <strong>Externally:</strong>
            </p>
            <Katex display>{"R = \\dfrac{2(-\\hat{i}+\\hat{j}+\\hat{k}) - 1(\\hat{i}+2\\hat{j}-\\hat{k})}{1} = -3\\hat{i}+3\\hat{k}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a midpoint</h2>
            <p className="blog-post-p">
              Find the position vector of the midpoint of the segment joining{" "}
              <Katex>{"P(2,3,4)"}</Katex> and <Katex>{"Q(4,1,-2)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> A midpoint is just the 1:1 case of the section formula —
              average each coordinate:
            </p>
            <Katex display>{"\\left(\\dfrac{2+4}{2}, \\dfrac{3+1}{2}, \\dfrac{4-2}{2}\\right) = (3,2,1) = 3\\hat{i}+2\\hat{j}+\\hat{k}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Combining position vectors like this is the same vector arithmetic covered more
              generally elsewhere.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/operations-on-vectors">Operations on Vectors</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
