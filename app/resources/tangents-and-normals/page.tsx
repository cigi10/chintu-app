import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Tangents and Normals - Studyloaf",
  description: "Finding the slope of a tangent line to a curve at a given point, with worked examples on a cubic and a rational function.",
  openGraph: {
    title: "Tangents and Normals - Studyloaf",
    description: "Finding the slope of a tangent line to a curve at a given point, with worked examples on a cubic and a rational function.",
  },
};

export default function TangentsAndNormalsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Tangents and Normals",
        description: "Finding the slope of a tangent line to a curve at a given point, with worked examples on a cubic and a rational function.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Tangents and Normals" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Tangents and Normals</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Finding a tangent's slope</h2>
            <p className="blog-post-p">
              The slope of the tangent to <Katex>{"y=f(x)"}</Katex> at a specific point is just{" "}
              <Katex>{"f'(x)"}</Katex> evaluated at that point&apos;s <Katex>{"x"}</Katex>-value.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a cubic curve</h2>
            <p className="blog-post-p">
              Find the slope of the tangent to <Katex>{"y = x^3 - x"}</Katex> at <Katex>{"x=2"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"y' = 3x^2 - 1"}</Katex>. At{" "}
              <Katex>{"x=2"}</Katex>:
            </p>
            <Katex display>{"y'(2) = 3(4) - 1 = 11"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a rational function</h2>
            <p className="blog-post-p">
              Find the slope of the tangent to <Katex>{"y = \\dfrac{x-1}{x-2}"}</Katex> (for{" "}
              <Katex>{"x \\ne 2"}</Katex>) at <Katex>{"x=10"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> By the quotient rule:
            </p>
            <Katex display>{"y' = \\dfrac{(1)(x-2) - (x-1)(1)}{(x-2)^2} = \\dfrac{-1}{(x-2)^2}"}</Katex>
            <p className="blog-post-p">
              At <Katex>{"x=10"}</Katex>:
            </p>
            <Katex display>{"y'(10) = \\dfrac{-1}{(10-2)^2} = -\\dfrac{1}{64}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The normal line at the same point is perpendicular to the tangent, and its slope
              follows directly from the tangent slope found here.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/slope-of-tangent-and-normal">Slope of Tangent and Normal</Link></li>
              <li><Link href="/resources/implicit-differentiation">Implicit Differentiation</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
