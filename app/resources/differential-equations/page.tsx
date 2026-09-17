import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Differential Equations - Studyloaf",
  description: "How to form a differential equation from a family of curves, and how to solve one by separating variables, with worked examples.",
  openGraph: {
    title: "Differential Equations - Studyloaf",
    description: "How to form a differential equation from a family of curves, and how to solve one by separating variables, with worked examples.",
  },
};

export default function DifferentialEquationsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Differential Equations",
        description: "How to form a differential equation from a family of curves, and how to solve one by separating variables, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Differential Equations" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Differential Equations</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: forming an equation from a family of curves</h2>
            <p className="blog-post-p">
              Form the differential equation representing the family of curves{" "}
              <Katex>{"y = mx"}</Katex>, where <Katex>{"m"}</Katex> is an arbitrary constant.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Differentiate <Katex>{"y = mx"}</Katex> with respect to{" "}
              <Katex>{"x"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{dy}{dx} = m"}</Katex>
            <p className="blog-post-p">
              Since <Katex>{"m = \\dfrac{y}{x}"}</Katex> from the original equation, substituting
              eliminates the arbitrary constant, giving the differential equation:
            </p>
            <Katex display>{"\\dfrac{dy}{dx} = \\dfrac{y}{x}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: solving by separating variables</h2>
            <p className="blog-post-p">
              Find the equation of the curve passing through <Katex>{"(-2, 3)"}</Katex>, given that
              the slope of the tangent at any point <Katex>{"(x, y)"}</Katex> is{" "}
              <Katex>{"\\dfrac{2x}{y^2}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The slope is <Katex>{"\\dfrac{dy}{dx} = \\dfrac{2x}{y^2}"}</Katex>.
              Separating variables and integrating both sides:
            </p>
            <Katex display>{"y^2\\,dy = 2x\\,dx \\;\\Rightarrow\\; \\int y^2\\,dy = \\int 2x\\,dx \\;\\Rightarrow\\; \\dfrac{y^3}{3} = x^2 + C"}</Katex>
            <p className="blog-post-p">
              Using the point <Katex>{"(-2, 3)"}</Katex> to find <Katex>{"C"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{27}{3} = 4 + C \\;\\Rightarrow\\; 9 = 4 + C \\;\\Rightarrow\\; C = 5"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"\\dfrac{y^3}{3} = x^2 + 5"}</Katex>, or equivalently:
            </p>
            <Katex display>{"y^3 = 3x^2 + 15"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Solving a differential equation almost always ends in integration — and separating
              variables here works the same way integration by parts handles a trickier product.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/integration-by-parts">Integration by Parts</Link></li>
              <li><Link href="/resources/logarithms">Logarithms</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
