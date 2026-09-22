import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Inverse Trigonometric Functions - Studyloaf",
  description: "Principal values, domains of inverse trig functions, and the complementary identity between tan⁻¹ and cot⁻¹, with worked examples.",
  openGraph: {
    title: "Inverse Trigonometric Functions - Studyloaf",
    description: "Principal values, domains of inverse trig functions, and the complementary identity between tan⁻¹ and cot⁻¹, with worked examples.",
  },
};

export default function InverseTrigonometricFunctionsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Inverse Trigonometric Functions",
        description: "Principal values, domains of inverse trig functions, and the complementary identity between tan⁻¹ and cot⁻¹, with worked examples.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Inverse Trigonometric Functions", href: "/resources/inverse-trigonometric-functions" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Inverse Trigonometric Functions</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Principal value ranges</h2>
            <p className="blog-post-p">
              Since <Katex>{"\\sin"}</Katex>, <Katex>{"\\cos"}</Katex>, etc. repeat forever, their
              inverses are only defined by restricting to one <strong>principal value</strong>{" "}
              range. For <Katex>{"\\cot^{-1}x"}</Katex>, that range is the open interval{" "}
              <Katex>{"(0,\\pi)"}</Katex> — note it&apos;s open, unlike <Katex>{"\\tan^{-1}"}</Katex>{" "}
              which uses <Katex>{"\\left(-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}\\right)"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: evaluating a mixed expression</h2>
            <p className="blog-post-p">
              Find the value of <Katex>{"\\sin\\left(\\dfrac{\\pi}{2} + \\cos^{-1}\\dfrac{1}{\\sqrt5}\\right)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let <Katex>{"\\theta = \\cos^{-1}\\dfrac{1}{\\sqrt5}"}</Katex>,
              so <Katex>{"\\cos\\theta = \\dfrac{1}{\\sqrt5}"}</Katex>. Using{" "}
              <Katex>{"\\sin\\left(\\tfrac{\\pi}{2}+\\theta\\right) = \\cos\\theta"}</Katex>:
            </p>
            <Katex display>{"\\sin\\left(\\dfrac{\\pi}{2} + \\cos^{-1}\\dfrac{1}{\\sqrt5}\\right) = \\cos\\theta = \\dfrac{1}{\\sqrt5}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a principal value</h2>
            <p className="blog-post-p">
              Find the principal value of <Katex>{"\\cot^{-1}\\left(-\\dfrac{1}{\\sqrt3}\\right)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Look for an angle in <Katex>{"(0,\\pi)"}</Katex> whose
              cotangent is <Katex>{"-\\tfrac{1}{\\sqrt3}"}</Katex>. Since{" "}
              <Katex>{"\\cot\\tfrac{\\pi}{3} = \\tfrac{1}{\\sqrt3}"}</Katex> and cotangent is
              negative in the second quadrant:
            </p>
            <Katex display>{"\\cot\\left(\\pi - \\dfrac{\\pi}{3}\\right) = -\\cot\\dfrac{\\pi}{3} = -\\dfrac{1}{\\sqrt3} \\;\\Rightarrow\\; \\cot^{-1}\\left(-\\dfrac{1}{\\sqrt3}\\right) = \\dfrac{2\\pi}{3}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a domain fact</h2>
            <p className="blog-post-p">
              What is the domain of <Katex>{"y = \\sec^{-1}x"}</Katex>?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Secant only takes values with{" "}
              <Katex>{"|\\sec\\theta| \\ge 1"}</Katex>, so its inverse can only accept inputs with{" "}
              <Katex>{"|x|\\ge1"}</Katex>. The domain is <Katex>{"\\mathbb{R} - (-1,1)"}</Katex> —
              every real number except the open interval strictly between <Katex>{"-1"}</Katex> and{" "}
              <Katex>{"1"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: proving a complementary identity</h2>
            <p className="blog-post-p">
              Prove that <Katex>{"\\tan^{-1}x + \\cot^{-1}x = \\dfrac{\\pi}{2}"}</Katex> for every
              real <Katex>{"x"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let <Katex>{"\\theta = \\tan^{-1}x"}</Katex>, so{" "}
              <Katex>{"\\tan\\theta = x"}</Katex>. Using the co-function identity{" "}
              <Katex>{"\\tan\\theta = \\cot\\left(\\tfrac{\\pi}{2}-\\theta\\right)"}</Katex>:
            </p>
            <Katex display>{"\\cot\\left(\\dfrac{\\pi}{2}-\\theta\\right) = x \\;\\Rightarrow\\; \\dfrac{\\pi}{2}-\\theta = \\cot^{-1}x \\;\\Rightarrow\\; \\theta + \\cot^{-1}x = \\dfrac{\\pi}{2}"}</Katex>
            <p className="blog-post-p">
              Substituting back <Katex>{"\\theta = \\tan^{-1}x"}</Katex> gives exactly{" "}
              <Katex>{"\\tan^{-1}x + \\cot^{-1}x = \\dfrac{\\pi}{2}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The same standard-angle values used for direction cosines come up constantly when
              evaluating inverse trig expressions by hand.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/trigonometry">Trigonometry Basics</Link></li>
              <li><Link href="/resources/direction-cosines">Finding Direction Cosines</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
