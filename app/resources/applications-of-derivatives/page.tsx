import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Applications of Derivatives - Studyloaf",
  description: "Using derivatives as rates of change, with worked examples on a growing circle's area and a particle's velocity and acceleration.",
  openGraph: {
    title: "Applications of Derivatives - Studyloaf",
    description: "Using derivatives as rates of change, with worked examples on a growing circle's area and a particle's velocity and acceleration.",
  },
};

export default function ApplicationsOfDerivativesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Applications of Derivatives",
        description: "Using derivatives as rates of change, with worked examples on a growing circle's area and a particle's velocity and acceleration.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Applications of Derivatives" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Applications of Derivatives</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">A derivative is a rate of change</h2>
            <p className="blog-post-p">
              If <Katex>{"y"}</Katex> depends on <Katex>{"x"}</Katex>, then{" "}
              <Katex>{"\\dfrac{dy}{dx}"}</Katex> measures how fast <Katex>{"y"}</Katex> changes as{" "}
              <Katex>{"x"}</Katex> changes — this is the idea behind every physical rate-of-change
              problem, from growing areas to moving particles.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: rate of change of an area</h2>
            <p className="blog-post-p">
              Find the rate of change of the area of a circle with respect to its radius{" "}
              <Katex>{"r"}</Katex>, when <Katex>{"r=4"}</Katex> cm.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Area is <Katex>{"A = \\pi r^2"}</Katex>, so:
            </p>
            <Katex display>{"\\dfrac{dA}{dr} = 2\\pi r"}</Katex>
            <p className="blog-post-p">
              At <Katex>{"r=4"}</Katex>: <Katex>{"\\dfrac{dA}{dr} = 2\\pi(4) = 8\\pi"}</Katex> sq. cm
              per cm of radius.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: velocity and acceleration</h2>
            <p className="blog-post-p">
              A particle&apos;s position is <Katex>{"s = 4t^3 - 2t^2 + 3t + 7"}</Katex>. Find its
              velocity and acceleration at <Katex>{"t=2"}</Katex> seconds.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Velocity is the first derivative of position, and
              acceleration is the derivative of velocity:
            </p>
            <Katex display>{"v = \\dfrac{ds}{dt} = 12t^2 - 4t + 3, \\qquad a = \\dfrac{dv}{dt} = 24t - 4"}</Katex>
            <p className="blog-post-p">
              At <Katex>{"t=2"}</Katex>:
            </p>
            <Katex display>{"v = 12(4) - 4(2) + 3 = 43 \\text{ units/s}, \\qquad a = 24(2) - 4 = 44 \\text{ units/s}^2"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Rate-of-change problems and optimization problems both start from the same
              derivative-as-rate idea — one asks how fast something changes, the other asks where
              that rate hits zero.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/maxima-and-minima">Maxima and Minima</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
