import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Area of a Triangle Using Determinants - Studyloaf",
  description: "The determinant formula for the area of a triangle from its vertex coordinates, with a worked example.",
  openGraph: {
    title: "Area of a Triangle Using Determinants - Studyloaf",
    description: "The determinant formula for the area of a triangle from its vertex coordinates, with a worked example.",
  },
};

export default function AreaOfATriangleDeterminantsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Area of a Triangle Using Determinants",
        description: "The determinant formula for the area of a triangle from its vertex coordinates, with a worked example.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Area of a Triangle Using Determinants", href: "/resources/area-of-a-triangle-determinants" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Area of a Triangle Using Determinants</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The formula</h2>
            <p className="blog-post-p">
              For a triangle with vertices <Katex>{"(x_1,y_1)"}</Katex>,{" "}
              <Katex>{"(x_2,y_2)"}</Katex>, and <Katex>{"(x_3,y_3)"}</Katex>, the area is half the
              absolute value of this determinant:
            </p>
            <Katex display>{"\\text{Area} = \\dfrac{1}{2} \\left| \\begin{vmatrix} x_1 & y_1 & 1 \\\\ x_2 & y_2 & 1 \\\\ x_3 & y_3 & 1 \\end{vmatrix} \\right|"}</Katex>
            <p className="blog-post-p">
              The absolute value matters because the determinant itself can come out negative
              depending on the order the vertices are listed in — area is never negative.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the area of the triangle with vertices <Katex>{"(2,7)"}</Katex>,{" "}
              <Katex>{"(1,1)"}</Katex>, and <Katex>{"(10,8)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Expanding along the first row:
            </p>
            <Katex display>{"\\begin{vmatrix} 2 & 7 & 1 \\\\ 1 & 1 & 1 \\\\ 10 & 8 & 1 \\end{vmatrix} = 2(1-8) - 7(1-10) + 1(8-10)"}</Katex>
            <Katex display>{"= 2(-7) - 7(-9) + (-2) = -14 + 63 - 2 = 47"}</Katex>
            <p className="blog-post-p">
              So the area is:
            </p>
            <Katex display>{"\\text{Area} = \\dfrac{1}{2}|47| = \\dfrac{47}{2} \\text{ sq. units}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The same triangle in 3D coordinates instead needs the vector (cross-product) version
              of this formula, not this determinant one.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/area-of-a-triangle-and-parallelogram-vectors">Area of a Triangle and Parallelogram Using Vectors</Link></li>
              <li><Link href="/resources/matrices-system-of-equations">Solving a System of Equations with Matrices</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
