import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Slope of Tangent and Normal - Studyloaf",
  description: "How the derivative gives the tangent's slope and the normal's slope is its negative reciprocal, with a worked example.",
  openGraph: {
    title: "Slope of Tangent and Normal - Studyloaf",
    description: "How the derivative gives the tangent's slope and the normal's slope is its negative reciprocal, with a worked example.",
  },
};

export default function SlopeOfTangentAndNormalPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Slope of Tangent and Normal",
        description: "How the derivative gives the tangent's slope and the normal's slope is its negative reciprocal, with a worked example.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Slope of Tangent and Normal" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Slope of Tangent and Normal</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Two related slopes</h2>
            <p className="blog-post-p">
              At a point on a curve <Katex>{"y=f(x)"}</Katex>, the derivative{" "}
              <Katex>{"f'(x)"}</Katex> gives the slope of the <strong>tangent</strong> line — the
              line that just touches the curve there. The <strong>normal</strong> is perpendicular
              to the tangent at that same point, so its slope is the tangent slope&apos;s negative
              reciprocal:
            </p>
            <Katex display>{"m_{\\text{normal}} = -\\dfrac{1}{m_{\\text{tangent}}}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the slope of the normal to the curve <Katex>{"y = 2x^2 - 3\\sin x"}</Katex> at{" "}
              <Katex>{"x=0"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The tangent slope is the derivative:
            </p>
            <Katex display>{"y' = 4x - 3\\cos x"}</Katex>
            <p className="blog-post-p">
              At <Katex>{"x=0"}</Katex>: <Katex>{"y'(0) = 0 - 3(1) = -3"}</Katex>. The normal slope
              is the negative reciprocal:
            </p>
            <Katex display>{"m_{\\text{normal}} = -\\dfrac{1}{-3} = \\dfrac{1}{3}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Finding a tangent line&apos;s equation, not just its slope, is the natural next step.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/tangents-and-normals">Tangents and Normals</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
