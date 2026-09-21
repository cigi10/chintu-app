import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Solving a System of Equations with Matrices - Studyloaf",
  description: "How to solve a system of linear equations using the matrix method, with a fully worked three-variable example.",
  openGraph: {
    title: "Solving a System of Equations with Matrices - Studyloaf",
    description: "How to solve a system of linear equations using the matrix method, with a fully worked three-variable example.",
  },
};

export default function MatricesSystemOfEquationsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Solving a System of Equations with Matrices",
        description: "How to solve a system of linear equations using the matrix method, with a fully worked three-variable example.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Solving a System of Equations with Matrices", href: "/resources/matrices-system-of-equations" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Solving a System of Equations with Matrices</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The idea</h2>
            <p className="blog-post-p">
              A system of linear equations can be written as a single matrix equation{" "}
              <Katex>{"AX = B"}</Katex>, where <Katex>{"A"}</Katex> holds the coefficients,{" "}
              <Katex>{"X"}</Katex> the unknowns, and <Katex>{"B"}</Katex> the right-hand sides.
              Solving usually just means eliminating variables the same way you would without
              matrix notation — the matrix is just a compact way to organize the equations.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Solve the system:
            </p>
            <Katex display>{"x - y + z = 4, \\qquad x + y + z = 2, \\qquad 2x + y - 3z = 0"}</Katex>
            <p className="blog-post-p">
              <strong>Solution:</strong> Subtracting the first equation from the second eliminates{" "}
              <Katex>{"x"}</Katex> and <Katex>{"z"}</Katex> at once:
            </p>
            <Katex display>{"(x+y+z) - (x-y+z) = 2-4 \\;\\Rightarrow\\; 2y = -2 \\;\\Rightarrow\\; y=-1"}</Katex>
            <p className="blog-post-p">
              Substituting <Katex>{"y=-1"}</Katex> into the second equation gives{" "}
              <Katex>{"x+z=3"}</Katex>. Substituting into the third gives{" "}
              <Katex>{"2x-3z=1"}</Katex>. Using <Katex>{"x=3-z"}</Katex>:
            </p>
            <Katex display>{"2(3-z)-3z=1 \\;\\Rightarrow\\; 6-5z=1 \\;\\Rightarrow\\; z=1 \\;\\Rightarrow\\; x=2"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"x=2"}</Katex>, <Katex>{"y=-1"}</Katex>, <Katex>{"z=1"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The matrix method only produces a unique solution when the coefficient matrix isn&apos;t
              singular — checking that comes down to a basic square-matrix property.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/square-matrix">Square Matrix Properties</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
