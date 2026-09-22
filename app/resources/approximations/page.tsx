import Navbar from "@/components/Navbar";
import Link from "next/link";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Approximations Using Differentials - Studyloaf",
  description: "Using differentials to approximate square roots and estimate small changes, with worked examples including a percentage-change setup.",
  openGraph: {
    title: "Approximations Using Differentials - Studyloaf",
    description: "Using differentials to approximate square roots and estimate small changes, with worked examples including a percentage-change setup.",
  },
};

export default function ApproximationsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Approximations Using Differentials",
        description: "Using differentials to approximate square roots and estimate small changes, with worked examples including a percentage-change setup.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Approximations Using Differentials", href: "/resources/approximations" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Approximations Using Differentials</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The idea</h2>
            <p className="blog-post-p">
              Near a point where <Katex>{"f(x)"}</Katex> is already known, the differential{" "}
              <Katex>{"dy = f'(x)\\,dx"}</Katex> approximates how much <Katex>{"f"}</Katex> changes
              for a small change <Katex>{"dx"}</Katex> — without needing the exact value:
            </p>
            <Katex display>{"f(x+dx) \\approx f(x) + f'(x)\\,dx"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: approximating a square root</h2>
            <p className="blog-post-p">
              Use differentials to approximate <Katex>{"\\sqrt{36.6}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Take <Katex>{"f(x)=\\sqrt{x}"}</Katex>, with{" "}
              <Katex>{"x=36"}</Katex> (a perfect square close by) and <Katex>{"dx=0.6"}</Katex>.
              Then <Katex>{"f(36)=6"}</Katex> and <Katex>{"f'(x) = \\dfrac{1}{2\\sqrt{x}}"}</Katex>,
              so <Katex>{"f'(36) = \\dfrac{1}{12}"}</Katex>:
            </p>
            <Katex display>{"dy = f'(36) \\cdot dx = \\dfrac{1}{12}(0.6) = 0.05"}</Katex>
            <Katex display>{"\\sqrt{36.6} \\approx 6 + 0.05 = 6.05"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: percentage change in volume</h2>
            <p className="blog-post-p">
              Find the approximate change in the volume of a cube of side <Katex>{"x"}</Katex>{" "}
              meters caused by increasing the side by 3%.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"V=x^3"}</Katex>, so{" "}
              <Katex>{"dV = 3x^2\\,dx"}</Katex>. A 3% increase means{" "}
              <Katex>{"dx = 0.03x"}</Katex>:
            </p>
            <Katex display>{"dV = 3x^2(0.03x) = 0.09x^3 \\text{ m}^3"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: error in a measured quantity</h2>
            <p className="blog-post-p">
              A sphere&apos;s radius is measured as 7 m with a possible error of 0.02 m. Find the
              approximate error this causes in the computed volume.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"V = \\dfrac{4}{3}\\pi r^3"}</Katex>, so{" "}
              <Katex>{"dV = 4\\pi r^2\\,dr"}</Katex>. With <Katex>{"r=7"}</Katex> and{" "}
              <Katex>{"dr=0.02"}</Katex>:
            </p>
            <Katex display>{"dV = 4\\pi(49)(0.02) = 3.92\\pi \\text{ m}^3"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              This is a different use of the same derivative machinery covered in rates-of-change
              problems elsewhere.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/applications-of-derivatives">Applications of Derivatives</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
