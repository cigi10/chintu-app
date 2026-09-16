import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import "@/styles/blog.css";

export const metadata = {
  title: "Chain Rule - Studyloaf",
  description: "The chain rule for differentiating composite functions, with two worked derivative examples.",
  openGraph: {
    title: "Chain Rule - Studyloaf",
    description: "The chain rule for differentiating composite functions, with two worked derivative examples.",
  },
};

export default function ChainRulePage() {
  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <article className="blog-post">
          <h1 className="blog-post-title">Chain Rule</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The rule</h2>
            <p className="blog-post-p">
              The chain rule differentiates a composite function, one function applied to the output
              of another. If <Katex>{"y = f(g(x))"}</Katex>, then
            </p>
            <Katex display>{"\\dfrac{dy}{dx} = f'(g(x)) \\cdot g'(x)"}</Katex>
            <p className="blog-post-p">
              In words: differentiate the outer function (leaving the inner function alone), then
              multiply by the derivative of the inner function.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">1. Derivative of sin(ln(x))</h2>
            <p className="blog-post-p">
              Find the derivative of <Katex>{"f(x) = \\sin(\\ln(x))"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The outer function is <Katex>{"\\sin(u)"}</Katex>, the inner
              function is <Katex>{"u = \\ln(x)"}</Katex>. Since{" "}
              <Katex>{"\\dfrac{d}{du}\\sin(u) = \\cos(u)"}</Katex> and{" "}
              <Katex>{"\\dfrac{d}{dx}\\ln(x) = \\dfrac{1}{x}"}</Katex>,
            </p>
            <Katex display>{"f'(x) = \\cos(\\ln(x)) \\cdot \\dfrac{1}{x} = \\dfrac{\\cos(\\ln(x))}{x}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">2. Derivative of sec(tan(&#8730;x))</h2>
            <p className="blog-post-p">
              Find the derivative of <Katex>{"\\sec(\\tan(\\sqrt{x}))"}</Katex> with respect to{" "}
              <Katex>{"x"}</Katex>. This nests three functions, so the chain rule is applied twice.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let <Katex>{"u = \\sqrt{x}"}</Katex>,{" "}
              <Katex>{"v = \\tan(u)"}</Katex>, and differentiate <Katex>{"\\sec(v)"}</Katex> from the
              outside in:
            </p>
            <Katex display>{"\\dfrac{du}{dx} = \\dfrac{1}{2\\sqrt{x}}, \\qquad \\dfrac{dv}{du} = \\sec^2(u), \\qquad \\dfrac{d}{dv}\\sec(v) = \\sec(v)\\tan(v)"}</Katex>
            <p className="blog-post-p">Multiplying the three pieces together (the chain rule again):</p>
            <Katex display>{"\\dfrac{1}{2\\sqrt{x}} \\cdot \\sec(\\tan(\\sqrt{x})) \\cdot \\tan(\\tan(\\sqrt{x})) \\cdot \\sec^2(\\sqrt{x})"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
