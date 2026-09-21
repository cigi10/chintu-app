import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Finding the Intercepts of a Plane - Studyloaf",
  description: "How to read a plane's intercepts on each axis straight from its equation, with a worked example.",
  openGraph: {
    title: "Finding the Intercepts of a Plane - Studyloaf",
    description: "How to read a plane's intercepts on each axis straight from its equation, with a worked example.",
  },
};

export default function InterceptsOfAPlanePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Finding the Intercepts of a Plane",
        description: "How to read a plane's intercepts on each axis straight from its equation, with a worked example.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Finding the Intercepts of a Plane", href: "/resources/intercepts-of-a-plane" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Finding the Intercepts of a Plane</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Intercept form</h2>
            <p className="blog-post-p">
              A plane&apos;s equation can be rewritten in <strong>intercept form</strong>,{" "}
              <Katex>{"\\dfrac{x}{a}+\\dfrac{y}{b}+\\dfrac{z}{c}=1"}</Katex>, where{" "}
              <Katex>{"a"}</Katex>, <Katex>{"b"}</Katex>, and <Katex>{"c"}</Katex> are exactly
              where the plane crosses the <Katex>{"x"}</Katex>-, <Katex>{"y"}</Katex>-, and{" "}
              <Katex>{"z"}</Katex>-axes.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the sum of the intercepts cut off by the plane <Katex>{"2x+y-z=5"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Divide through by 5 to get the right-hand side to 1:
            </p>
            <Katex display>{"\\dfrac{2x}{5}+\\dfrac{y}{5}-\\dfrac{z}{5}=1 \\;\\Rightarrow\\; \\dfrac{x}{5/2}+\\dfrac{y}{5}+\\dfrac{z}{-5}=1"}</Katex>
            <p className="blog-post-p">
              So the intercepts are <Katex>{"a=\\dfrac{5}{2}"}</Katex>, <Katex>{"b=5"}</Katex>, and{" "}
              <Katex>{"c=-5"}</Katex>. Their sum:
            </p>
            <Katex display>{"\\dfrac{5}{2}+5-5 = \\dfrac{5}{2}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Intercept form is just one way to write a plane&apos;s equation — worth comparing
              against the general form used elsewhere.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/equation-of-a-plane">Finding the Equation of a Plane</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
