import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Finding Direction Cosines - Studyloaf",
  description: "What direction cosines are and how to find them for a coordinate axis, a line through two points, or a line at given angles.",
  openGraph: {
    title: "Finding Direction Cosines - Studyloaf",
    description: "What direction cosines are and how to find them for a coordinate axis, a line through two points, or a line at given angles.",
  },
};

export default function DirectionCosinesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Finding Direction Cosines",
        description: "What direction cosines are and how to find them for a coordinate axis, a line through two points, or a line at given angles.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Finding Direction Cosines", href: "/resources/direction-cosines" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Finding Direction Cosines</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What they are</h2>
            <p className="blog-post-p">
              The direction cosines of a line are the cosines of the angles it makes with the{" "}
              <Katex>{"x"}</Katex>-, <Katex>{"y"}</Katex>-, and <Katex>{"z"}</Katex>-axes. For any
              direction ratios <Katex>{"(a,b,c)"}</Katex>, the direction cosines are found by
              dividing each by the overall magnitude:
            </p>
            <Katex display>{"(l,m,n) = \\left(\\dfrac{a}{\\sqrt{a^2+b^2+c^2}}, \\dfrac{b}{\\sqrt{a^2+b^2+c^2}}, \\dfrac{c}{\\sqrt{a^2+b^2+c^2}}\\right)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a coordinate axis</h2>
            <p className="blog-post-p">
              Write the direction cosines of the <Katex>{"x"}</Katex>-axis.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The <Katex>{"x"}</Katex>-axis points entirely along{" "}
              <Katex>{"x"}</Katex> with no <Katex>{"y"}</Katex> or <Katex>{"z"}</Katex> component,
              so its direction cosines are simply <Katex>{"(1,0,0)"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a line through two points</h2>
            <p className="blog-post-p">
              Find the direction cosines of the line joining <Katex>{"(1,0,0)"}</Katex> and{" "}
              <Katex>{"(0,1,1)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The direction ratios are the difference of coordinates:{" "}
              <Katex>{"(0-1, 1-0, 1-0) = (-1,1,1)"}</Katex>. The magnitude is{" "}
              <Katex>{"\\sqrt{1+1+1}=\\sqrt{3}"}</Katex>, so the direction cosines are:
            </p>
            <Katex display>{"\\left(-\\dfrac{1}{\\sqrt3}, \\dfrac{1}{\\sqrt3}, \\dfrac{1}{\\sqrt3}\\right)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: from given angles</h2>
            <p className="blog-post-p">
              A line makes angles of <Katex>{"90^\\circ"}</Katex>, <Katex>{"60^\\circ"}</Katex>,
              and <Katex>{"30^\\circ"}</Katex> with the positive <Katex>{"x"}</Katex>-,{" "}
              <Katex>{"y"}</Katex>-, and <Katex>{"z"}</Katex>-axes respectively. Find its
              direction cosines.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Direction cosines are literally the cosines of those
              angles:
            </p>
            <Katex display>{"(\\cos90^\\circ, \\cos60^\\circ, \\cos30^\\circ) = \\left(0, \\dfrac{1}{2}, \\dfrac{\\sqrt3}{2}\\right)"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Direction cosines (or the direction ratios behind them) are exactly what&apos;s needed
              to write down a line&apos;s equation in 3D.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/equation-of-a-line">Finding the Equation of a Line</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
