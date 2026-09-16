import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import "@/styles/blog.css";

export const metadata = {
  title: "Definite Integrals - Studyloaf",
  description: "What a definite integral is and how to evaluate one, with a worked trigonometric example.",
  openGraph: {
    title: "Definite Integrals - Studyloaf",
    description: "What a definite integral is and how to evaluate one, with a worked trigonometric example.",
  },
};

export default function DefiniteIntegralsPage() {
  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <article className="blog-post">
          <h1 className="blog-post-title">Definite Integrals</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What is a definite integral?</h2>
            <p className="blog-post-p">
              A definite integral <Katex>{"\\int_{a}^{b} f(x)\\, dx"}</Katex> gives the signed area
              under the curve <Katex>{"f(x)"}</Katex> between <Katex>{"x = a"}</Katex> and{" "}
              <Katex>{"x = b"}</Katex>. By the fundamental theorem of calculus, if{" "}
              <Katex>{"F(x)"}</Katex> is an antiderivative of <Katex>{"f(x)"}</Katex> (that is,{" "}
              <Katex>{"F'(x) = f(x)"}</Katex>), then
            </p>
            <Katex display>{"\\int_{a}^{b} f(x)\\, dx = F(b) - F(a)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Evaluate <Katex>{"\\displaystyle\\int_{0}^{\\pi/2} \\cos(2x)\\, dx"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> An antiderivative of <Katex>{"\\cos(2x)"}</Katex> is{" "}
              <Katex>{"\\dfrac{\\sin(2x)}{2}"}</Katex>. Applying the limits:
            </p>
            <Katex display>{"\\left[\\dfrac{\\sin(2x)}{2}\\right]_{0}^{\\pi/2} = \\dfrac{\\sin(\\pi)}{2} - \\dfrac{\\sin(0)}{2} = \\dfrac{0}{2} - \\dfrac{0}{2} = 0"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
