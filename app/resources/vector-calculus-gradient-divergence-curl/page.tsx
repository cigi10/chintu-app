import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Vector Calculus: Gradient, Divergence, and Curl - Studyloaf",
  description: "The gradient, divergence, and curl operators explained, with worked examples computing each directly from a scalar and a vector field.",
  openGraph: {
    title: "Vector Calculus: Gradient, Divergence, and Curl - Studyloaf",
    description: "The gradient, divergence, and curl operators explained, with worked examples computing each directly from a scalar and a vector field.",
  },
};

export default function VectorCalculusPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Vector Calculus: Gradient, Divergence, and Curl",
        description: "The gradient, divergence, and curl operators explained, with worked examples computing each directly from a scalar and a vector field.",
        datePublished: "2026-09-25T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Vector Calculus: Gradient, Divergence, and Curl", href: "/resources/vector-calculus-gradient-divergence-curl" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Vector Calculus: Gradient, Divergence, and Curl</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Three operators, three different outputs</h2>
            <ul className="blog-post-list">
              <li>
                <strong>Gradient</strong> (<Katex>{"\\nabla f"}</Katex>) takes a <em>scalar</em>{" "}
                field and returns a <em>vector</em> field, pointing in the direction{" "}
                <Katex>{"f"}</Katex> increases fastest.
              </li>
              <li>
                <strong>Divergence</strong> (<Katex>{"\\nabla \\cdot F"}</Katex>) takes a{" "}
                <em>vector</em> field and returns a <em>scalar</em>, measuring how much the field
                spreads outward from a point.
              </li>
              <li>
                <strong>Curl</strong> (<Katex>{"\\nabla \\times F"}</Katex>) takes a{" "}
                <em>vector</em> field and returns another <em>vector</em>, measuring the field&apos;s
                local rotation.
              </li>
            </ul>
            <Katex display>{"\\nabla f = \\left(\\dfrac{\\partial f}{\\partial x}, \\dfrac{\\partial f}{\\partial y}, \\dfrac{\\partial f}{\\partial z}\\right)"}</Katex>
            <Katex display>{"\\nabla \\cdot F = \\dfrac{\\partial F_1}{\\partial x} + \\dfrac{\\partial F_2}{\\partial y} + \\dfrac{\\partial F_3}{\\partial z}"}</Katex>
            <Katex display>{"\\nabla \\times F = \\left(\\dfrac{\\partial F_3}{\\partial y}-\\dfrac{\\partial F_2}{\\partial z},\\; \\dfrac{\\partial F_1}{\\partial z}-\\dfrac{\\partial F_3}{\\partial x},\\; \\dfrac{\\partial F_2}{\\partial x}-\\dfrac{\\partial F_1}{\\partial y}\\right)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: gradient</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\nabla f"}</Katex> at the point <Katex>{"(1,2,1)"}</Katex> for{" "}
              <Katex>{"f(x,y,z) = x^2yz^3"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Take each partial derivative in turn:
            </p>
            <Katex display>{"\\nabla f = (2xyz^3,\\; x^2z^3,\\; 3x^2yz^2)"}</Katex>
            <p className="blog-post-p">Evaluating at <Katex>{"(1,2,1)"}</Katex>:</p>
            <Katex display>{"\\nabla f(1,2,1) = (2(1)(2)(1),\\; (1)(1),\\; 3(1)(2)(1)) = (4,\\,1,\\,6)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: divergence and curl</h2>
            <p className="blog-post-p">
              Find the divergence and curl of the rotating field{" "}
              <Katex>{"F = (y,\\, -x,\\, 0)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Divergence:</strong>
            </p>
            <Katex display>{"\\nabla\\cdot F = \\dfrac{\\partial}{\\partial x}(y) + \\dfrac{\\partial}{\\partial y}(-x) + \\dfrac{\\partial}{\\partial z}(0) = 0+0+0 = 0"}</Katex>
            <p className="blog-post-p">
              Zero divergence makes sense here — this field just rotates points around the origin
              without anything flowing in or out.
            </p>
            <p className="blog-post-p">
              <strong>Curl:</strong>
            </p>
            <Katex display>{"\\nabla\\times F = \\left(\\dfrac{\\partial(0)}{\\partial y}-\\dfrac{\\partial(-x)}{\\partial z},\\; \\dfrac{\\partial(y)}{\\partial z}-\\dfrac{\\partial(0)}{\\partial x},\\; \\dfrac{\\partial(-x)}{\\partial x}-\\dfrac{\\partial(y)}{\\partial y}\\right)"}</Katex>
            <Katex display>{"= (0-0,\\; 0-0,\\; -1-1) = (0,\\,0,\\,-2)"}</Katex>
            <p className="blog-post-p">
              A nonzero curl, entirely along the <Katex>{"z"}</Katex>-axis — exactly what you&apos;d
              expect from a field that rotates around that axis.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Every partial derivative used here follows the same rules covered on their own —
              worth a look if any step above wasn&apos;t obvious.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/partial-differentiation">Partial Differentiation</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
