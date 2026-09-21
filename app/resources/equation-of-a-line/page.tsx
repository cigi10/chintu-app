import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Finding the Equation of a Line - Studyloaf",
  description: "Writing a line's equation in vector and Cartesian form, given two points or a point and a parallel vector, with worked examples.",
  openGraph: {
    title: "Finding the Equation of a Line - Studyloaf",
    description: "Writing a line's equation in vector and Cartesian form, given two points or a point and a parallel vector, with worked examples.",
  },
};

export default function EquationOfALinePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Finding the Equation of a Line",
        description: "Writing a line's equation in vector and Cartesian form, given two points or a point and a parallel vector, with worked examples.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Finding the Equation of a Line", href: "/resources/equation-of-a-line" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Finding the Equation of a Line</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Vector and Cartesian form</h2>
            <p className="blog-post-p">
              A line through a point with position vector <Katex>{"\\vec{a}"}</Katex>, parallel to
              direction vector <Katex>{"\\vec{b}"}</Katex>, has vector equation{" "}
              <Katex>{"\\vec{r} = \\vec{a} + \\lambda\\vec{b}"}</Katex>. If{" "}
              <Katex>{"\\vec{a}=(x_1,y_1,z_1)"}</Katex> and <Katex>{"\\vec{b}=(a,b,c)"}</Katex>,
              the same line in Cartesian form is:
            </p>
            <Katex display>{"\\dfrac{x-x_1}{a} = \\dfrac{y-y_1}{b} = \\dfrac{z-z_1}{c}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: through two points</h2>
            <p className="blog-post-p">
              Find the equation of the line through <Katex>{"(3,-2,-5)"}</Katex> and{" "}
              <Katex>{"(3,-2,6)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The direction ratios are the difference of the two
              points: <Katex>{"(3-3, -2-(-2), 6-(-5)) = (0,0,11)"}</Katex>.
            </p>
            <Katex display>{"\\vec{r} = (3\\hat{i}-2\\hat{j}-5\\hat{k}) + \\lambda(11\\hat{k})"}</Katex>
            <Katex display>{"\\dfrac{x-3}{0} = \\dfrac{y+2}{0} = \\dfrac{z+5}{11}"}</Katex>
            <p className="blog-post-p">
              The zeroes in the denominator just mean <Katex>{"x"}</Katex> and{" "}
              <Katex>{"y"}</Katex> stay fixed at 3 and -2 while <Katex>{"z"}</Katex> varies —
              matching a line running straight along the <Katex>{"z"}</Katex>-direction.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: point and parallel vector</h2>
            <p className="blog-post-p">
              Find the vector equation of the line through <Katex>{"2\\hat{i}+3\\hat{j}+\\hat{k}"}</Katex>{" "}
              and parallel to <Katex>{"4\\hat{i}-2\\hat{j}+3\\hat{k}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Plug directly into{" "}
              <Katex>{"\\vec{r}=\\vec{a}+\\lambda\\vec{b}"}</Katex>:
            </p>
            <Katex display>{"\\vec{r} = (2\\hat{i}+3\\hat{j}+\\hat{k}) + \\lambda(4\\hat{i}-2\\hat{j}+3\\hat{k}) = (2+4\\lambda)\\hat{i}+(3-2\\lambda)\\hat{j}+(1+3\\lambda)\\hat{k}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Once a line has an equation, finding the shortest distance between two such lines or
              the angle it makes with a plane both build directly on this same direction vector.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/shortest-distance-between-lines">Shortest Distance Between Two Lines</Link></li>
              <li><Link href="/resources/angle-between-line-and-plane">Angle Between a Line and a Plane</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
