import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Continuity - Studyloaf",
  description: "Left-hand and right-hand derivatives, spotting a point that's continuous but not differentiable, and finding a function's domain, with worked examples.",
  openGraph: {
    title: "Continuity - Studyloaf",
    description: "Left-hand and right-hand derivatives, spotting a point that's continuous but not differentiable, and finding a function's domain, with worked examples.",
  },
};

export default function ContinuityPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Continuity",
        description: "Left-hand and right-hand derivatives, spotting a point that's continuous but not differentiable, and finding a function's domain, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Continuity" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Continuity</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">A function can be continuous but not differentiable</h2>
            <p className="blog-post-p">
              A function is continuous at a point if there&apos;s no break or jump there, but it&apos;s
              only <strong>differentiable</strong> at that point if the slope approaching from the
              left matches the slope approaching from the right. The left-hand derivative is:
            </p>
            <Katex display>{"f'(a^-) = \\lim_{h \\to 0^-} \\dfrac{f(a+h) - f(a)}{h}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the left-hand derivative of <Katex>{"f(x) = |x|"}</Katex> at <Katex>{"x = 0"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Just to the left of 0, <Katex>{"x < 0"}</Katex>, so{" "}
              <Katex>{"f(x) = |x| = -x"}</Katex>. Differentiating this piece:
            </p>
            <Katex display>{"f'(x) = -1 \\quad \\text{for } x < 0"}</Katex>
            <p className="blog-post-p">
              So the left-hand derivative at <Katex>{"x=0"}</Katex> is <strong>-1</strong>. (The
              right-hand derivative there is <Katex>{"+1"}</Katex>, since <Katex>{"f(x)=x"}</Katex> for{" "}
              <Katex>{"x>0"}</Katex> — the two don&apos;t match, which is exactly why{" "}
              <Katex>{"|x|"}</Katex> is continuous at 0 but has a sharp corner there instead of a
              smooth tangent.)
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">A function can only be continuous where it's defined</h2>
            <p className="blog-post-p">
              Before asking whether a function is continuous at a point, it has to actually be
              defined there — so finding a function&apos;s domain is usually the first step.
            </p>
            <p className="blog-post-p">
              Find the domain of <Katex>{"f(x) = \\sqrt{\\cos x}"}</Katex> over one full period,{" "}
              <Katex>{"[0, 2\\pi]"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> A square root is only defined for a non-negative input, so{" "}
              <Katex>{"f(x)"}</Katex> requires <Katex>{"\\cos x \\ge 0"}</Katex>. Over{" "}
              <Katex>{"[0, 2\\pi]"}</Katex>, cosine is non-negative on the first and last quarters of
              the circle:
            </p>
            <Katex display>{"\\left[0, \\dfrac{\\pi}{2}\\right] \\cup \\left[\\dfrac{3\\pi}{2}, 2\\pi\\right]"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              A function has to be differentiable, in the sense checked here, before the chain rule
              can be applied to it.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/chain-rule">Chain Rule</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
