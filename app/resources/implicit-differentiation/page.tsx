import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Implicit Differentiation - Studyloaf",
  description: "How to differentiate an equation that isn't already solved for y, with worked examples including an inverse trig identity.",
  openGraph: {
    title: "Implicit Differentiation - Studyloaf",
    description: "How to differentiate an equation that isn't already solved for y, with worked examples including an inverse trig identity.",
  },
};

export default function ImplicitDifferentiationPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Implicit Differentiation",
        description: "How to differentiate an equation that isn't already solved for y, with worked examples including an inverse trig identity.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Implicit Differentiation" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Implicit Differentiation</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Explicit vs. implicit</h2>
            <p className="blog-post-p">
              A function given as <Katex>{"y = f(x)"}</Katex> is explicit. When{" "}
              <Katex>{"x"}</Katex> and <Katex>{"y"}</Katex> are tangled together in one equation
              instead, differentiate both sides with respect to <Katex>{"x"}</Katex>, treating{" "}
              <Katex>{"y"}</Katex> as a function of <Katex>{"x"}</Katex> (so every{" "}
              <Katex>{"y"}</Katex> term picks up a <Katex>{"\\frac{dy}{dx}"}</Katex> factor via the
              chain rule), then solve for <Katex>{"\\frac{dy}{dx}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\dfrac{dy}{dx}"}</Katex> if <Katex>{"2x + 3y = \\sin x"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Differentiate both sides with respect to{" "}
              <Katex>{"x"}</Katex>:
            </p>
            <Katex display>{"2 + 3\\dfrac{dy}{dx} = \\cos x \\;\\Rightarrow\\; \\dfrac{dy}{dx} = \\dfrac{\\cos x - 2}{3}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: an inverse trig identity</h2>
            <p className="blog-post-p">
              If <Katex>{"y = \\cos^{-1}\\!\\left(\\dfrac{1-x^2}{1+x^2}\\right)"}</Katex>, find{" "}
              <Katex>{"\\dfrac{dy}{dx}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Substituting <Katex>{"x = \\tan\\theta"}</Katex> turns the
              fraction into the double-angle identity{" "}
              <Katex>{"\\dfrac{1-\\tan^2\\theta}{1+\\tan^2\\theta} = \\cos 2\\theta"}</Katex>, so:
            </p>
            <Katex display>{"y = \\cos^{-1}(\\cos 2\\theta) = 2\\theta = 2\\tan^{-1}x"}</Katex>
            <p className="blog-post-p">
              Differentiating this simpler explicit form:
            </p>
            <Katex display>{"\\dfrac{dy}{dx} = \\dfrac{2}{1+x^2}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Implicit differentiation is exactly the tool used to find the slope of a tangent line
              on a curve whose equation isn&apos;t solved for y.
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
