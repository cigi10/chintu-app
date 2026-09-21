import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Square Matrix Properties - Studyloaf",
  description: "Key facts about square matrices: the determinant scaling rule, idempotent matrices, and when a matrix equation has no solution.",
  openGraph: {
    title: "Square Matrix Properties - Studyloaf",
    description: "Key facts about square matrices: the determinant scaling rule, idempotent matrices, and when a matrix equation has no solution.",
  },
};

export default function SquareMatrixPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Square Matrix Properties",
        description: "Key facts about square matrices: the determinant scaling rule, idempotent matrices, and when a matrix equation has no solution.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Square Matrix Properties", href: "/resources/square-matrix" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Square Matrix Properties</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Scaling a determinant</h2>
            <p className="blog-post-p">
              Multiplying every entry of an <Katex>{"n \\times n"}</Katex> matrix by a constant{" "}
              <Katex>{"k"}</Katex> scales the determinant by <Katex>{"k^n"}</Katex>, not just{" "}
              <Katex>{"k"}</Katex>:
            </p>
            <Katex display>{"|kA| = k^n|A|"}</Katex>
            <p className="blog-post-p">
              If <Katex>{"A"}</Katex> is a <Katex>{"3\\times3"}</Katex> matrix with{" "}
              <Katex>{"|A|=5"}</Katex>, then <Katex>{"|2A| = 2^3(5) = 40"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: an idempotent matrix</h2>
            <p className="blog-post-p">
              If <Katex>{"A"}</Katex> is a square matrix with <Katex>{"A^2 = A"}</Katex> (called{" "}
              <strong>idempotent</strong>), simplify <Katex>{"(I-A)^3 + A"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> First find <Katex>{"(I-A)^2"}</Katex>:
            </p>
            <Katex display>{"(I-A)^2 = I - 2A + A^2 = I - 2A + A = I - A"}</Katex>
            <p className="blog-post-p">
              So squaring <Katex>{"(I-A)"}</Katex> gives back <Katex>{"(I-A)"}</Katex> itself —{" "}
              <Katex>{"(I-A)"}</Katex> is idempotent too. That means:
            </p>
            <Katex display>{"(I-A)^3 = (I-A)^2(I-A) = (I-A)(I-A) = I-A"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"(I-A)^3 + A = (I-A) + A = I"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Building a matrix from a formula</h2>
            <p className="blog-post-p">
              For a <Katex>{"2\\times2"}</Katex> matrix <Katex>{"A = [a_{ij}]"}</Katex> where{" "}
              <Katex>{"a_{ij} = \\dfrac{i}{j}"}</Katex>, find <Katex>{"A"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Compute each entry directly from its row/column index:
            </p>
            <Katex display>{"a_{11}=\\dfrac{1}{1}=1,\\quad a_{12}=\\dfrac{1}{2},\\quad a_{21}=\\dfrac{2}{1}=2,\\quad a_{22}=\\dfrac{2}{2}=1"}</Katex>
            <Katex display>{"A = \\begin{bmatrix} 1 & \\frac{1}{2} \\\\ 2 & 1 \\end{bmatrix}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">A singular matrix and no solution</h2>
            <p className="blog-post-p">
              For a matrix equation <Katex>{"AX=B"}</Katex> with square matrix{" "}
              <Katex>{"A"}</Katex>: if <Katex>{"|A|=0"}</Katex> (A is singular) and{" "}
              <Katex>{"(\\text{adj }A)B \\ne 0"}</Katex>, the system has{" "}
              <strong>no solution</strong> at all — it&apos;s inconsistent. (If instead{" "}
              <Katex>{"(\\text{adj }A)B = 0"}</Katex>, the system has infinitely many solutions.)
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Whether a matrix is singular is exactly what decides whether a system of equations
              solved by the matrix method has a unique solution in the first place.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/matrices-system-of-equations">Solving a System of Equations with Matrices</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
