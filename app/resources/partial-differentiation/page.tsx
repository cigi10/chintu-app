import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Partial Differentiation - Studyloaf",
  description: "How to take partial derivatives of a multivariable function, with a worked example that also verifies equality of mixed second partial derivatives by direct computation.",
  openGraph: {
    title: "Partial Differentiation - Studyloaf",
    description: "How to take partial derivatives of a multivariable function, with a worked example that also verifies equality of mixed second partial derivatives by direct computation.",
  },
};

export default function PartialDifferentiationPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Partial Differentiation",
        description: "How to take partial derivatives of a multivariable function, with a worked example that also verifies equality of mixed second partial derivatives by direct computation.",
        datePublished: "2026-09-25T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Partial Differentiation", href: "/resources/partial-differentiation" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Partial Differentiation</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The idea</h2>
            <p className="blog-post-p">
              For a function of several variables like <Katex>{"f(x,y)"}</Katex>, a{" "}
              <strong>partial derivative</strong> with respect to one variable treats every other
              variable as a fixed constant, then differentiates normally:
            </p>
            <Katex display>{"\\dfrac{\\partial f}{\\partial x} = \\lim_{h\\to0}\\dfrac{f(x+h,y)-f(x,y)}{h}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: first partial derivatives</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\dfrac{\\partial f}{\\partial x}"}</Katex> and{" "}
              <Katex>{"\\dfrac{\\partial f}{\\partial y}"}</Katex> for{" "}
              <Katex>{"f(x,y) = x^3y^2 + \\sin(xy)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Differentiating with respect to <Katex>{"x"}</Katex>{" "}
              (holding <Katex>{"y"}</Katex> fixed — the chain rule on{" "}
              <Katex>{"\\sin(xy)"}</Katex> picks up a factor of <Katex>{"y"}</Katex>, the
              derivative of <Katex>{"xy"}</Katex> with respect to <Katex>{"x"}</Katex>):
            </p>
            <Katex display>{"\\dfrac{\\partial f}{\\partial x} = 3x^2y^2 + y\\cos(xy)"}</Katex>
            <p className="blog-post-p">
              Differentiating with respect to <Katex>{"y"}</Katex> instead:
            </p>
            <Katex display>{"\\dfrac{\\partial f}{\\partial y} = 2x^3y + x\\cos(xy)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: mixed second partial derivatives agree</h2>
            <p className="blog-post-p">
              For a well-behaved function, the order of differentiation shouldn&apos;t matter:{" "}
              <Katex>{"\\dfrac{\\partial^2 f}{\\partial x\\partial y} = \\dfrac{\\partial^2 f}{\\partial y\\partial x}"}</Katex>.
              Check this for the same <Katex>{"f"}</Katex> above.
            </p>
            <p className="blog-post-p">
              Differentiating <Katex>{"\\dfrac{\\partial f}{\\partial x}"}</Katex> with respect to{" "}
              <Katex>{"y"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{\\partial^2 f}{\\partial y\\partial x} = 6x^2y + \\cos(xy) - xy\\sin(xy)"}</Katex>
            <p className="blog-post-p">
              and differentiating <Katex>{"\\dfrac{\\partial f}{\\partial y}"}</Katex> with respect
              to <Katex>{"x"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{\\partial^2 f}{\\partial x\\partial y} = 6x^2y + \\cos(xy) - xy\\sin(xy)"}</Katex>
            <p className="blog-post-p">
              Both routes land on the exact same expression — confirming the mixed partials agree
              for this <Katex>{"f"}</Katex>, not just asserting that they should.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The gradient — one of the three core vector calculus operators — is built entirely
              out of the same first partial derivatives covered here.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/vector-calculus-gradient-divergence-curl">Vector Calculus: Gradient, Divergence, and Curl</Link></li>
              <li><Link href="/resources/matrices-eigenvalues-eigenvectors">Eigenvalues and Eigenvectors</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
