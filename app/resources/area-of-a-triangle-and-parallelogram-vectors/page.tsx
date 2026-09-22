import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Area of a Triangle and Parallelogram Using Vectors - Studyloaf",
  description: "Using the cross product to find the area of a triangle or parallelogram from vertex or side vectors, with worked examples.",
  openGraph: {
    title: "Area of a Triangle and Parallelogram Using Vectors - Studyloaf",
    description: "Using the cross product to find the area of a triangle or parallelogram from vertex or side vectors, with worked examples.",
  },
};

export default function AreaOfATriangleAndParallelogramVectorsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Area of a Triangle and Parallelogram Using Vectors",
        description: "Using the cross product to find the area of a triangle or parallelogram from vertex or side vectors, with worked examples.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Area of a Triangle and Parallelogram Using Vectors", href: "/resources/area-of-a-triangle-and-parallelogram-vectors" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Area of a Triangle and Parallelogram Using Vectors</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The idea</h2>
            <p className="blog-post-p">
              The magnitude of the cross product of two vectors equals the area of the
              parallelogram they form as adjacent sides. A triangle is just half of that
              parallelogram, so it uses the same cross product, halved:
            </p>
            <Katex display>{"\\text{Area of parallelogram} = |\\vec{a} \\times \\vec{b}|, \\qquad \\text{Area of triangle} = \\dfrac{1}{2}|\\vec{a} \\times \\vec{b}|"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a triangle from three points</h2>
            <p className="blog-post-p">
              Find the area of the triangle with vertices <Katex>{"A(1,1,1)"}</Katex>,{" "}
              <Katex>{"B(1,2,3)"}</Katex>, and <Katex>{"C(2,3,1)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Build two side vectors from the same corner,{" "}
              <Katex>{"A"}</Katex>:
            </p>
            <Katex display>{"\\overrightarrow{AB} = (0,1,2), \\qquad \\overrightarrow{AC} = (1,2,0)"}</Katex>
            <Katex display>{"\\overrightarrow{AB} \\times \\overrightarrow{AC} = (1(0)-2(2),\\; 2(1)-0(0),\\; 0(2)-1(1)) = (-4,2,-1)"}</Katex>
            <p className="blog-post-p">
              The magnitude is <Katex>{"\\sqrt{16+4+1}=\\sqrt{21}"}</Katex>, so the triangle&apos;s
              area is:
            </p>
            <Katex display>{"\\text{Area} = \\dfrac{1}{2}\\sqrt{21} = \\dfrac{\\sqrt{21}}{2}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a parallelogram from its sides</h2>
            <p className="blog-post-p">
              Find the area of a parallelogram whose adjacent sides are{" "}
              <Katex>{"\\vec{a} = \\hat{i}-\\hat{j}+3\\hat{k}"}</Katex> and{" "}
              <Katex>{"\\vec{b} = 2\\hat{i}-7\\hat{j}+\\hat{k}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong>
            </p>
            <Katex display>{"\\vec{a}\\times\\vec{b} = ((-1)(1)-(3)(-7),\\; (3)(2)-(1)(1),\\; (1)(-7)-(-1)(2)) = (20,5,-5)"}</Katex>
            <p className="blog-post-p">The magnitude gives the area directly:</p>
            <Katex display>{"|\\vec{a}\\times\\vec{b}| = \\sqrt{400+25+25} = \\sqrt{450} = 15\\sqrt{2}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              This cross product is the same tool used for the scalar triple product, and the same
              vertices could just as easily be plugged into the 2D determinant version of this
              formula when there&apos;s no third coordinate to worry about.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/operations-on-vectors">Operations on Vectors</Link></li>
              <li><Link href="/resources/area-of-a-triangle-determinants">Area of a Triangle Using Determinants</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
