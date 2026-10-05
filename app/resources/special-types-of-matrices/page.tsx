import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Special Types of Matrices - Studyloaf",
  description: "Diagonal, scalar and identity matrices defined with examples, and finding missing values in a matrix from a stated type or matching determinants.",
  openGraph: {
    title: "Special Types of Matrices - Studyloaf",
    description: "Diagonal, scalar and identity matrices defined with examples, and finding missing values in a matrix from a stated type or matching determinants.",
  },
  alternates: { canonical: "/resources/special-types-of-matrices" },
};

export default function SpecialTypesOfMatricesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Special Types of Matrices",
        description: "Diagonal, scalar and identity matrices defined with examples, and finding missing values in a matrix from a stated type or matching determinants.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math: Matrices and Determinants", href: "/resources/math-matrices-determinants" },
          { label: "Special Types of Matrices", href: "/resources/special-types-of-matrices" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Special Types of Matrices</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Diagonal matrix</h2>
            <p className="blog-post-p">
              A square matrix is a <strong>diagonal matrix</strong> if every entry off the main
              diagonal is zero. The diagonal entries themselves can be anything, including zero.
            </p>
            <Katex display>{"\\begin{bmatrix} 4 & 0 & 0 \\\\ 0 & -1 & 0 \\\\ 0 & 0 & 7 \\end{bmatrix}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Scalar matrix</h2>
            <p className="blog-post-p">
              A <strong>scalar matrix</strong> is a diagonal matrix where every diagonal entry is
              equal to the same number <Katex>{"k"}</Katex>, a stricter version of &quot;diagonal.&quot;
            </p>
            <Katex display>{"\\begin{bmatrix} 5 & 0 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & 5 \\end{bmatrix}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Identity matrix</h2>
            <p className="blog-post-p">
              The <strong>identity matrix</strong>, written <Katex>{"I"}</Katex>, is the scalar
              matrix where that repeated diagonal value is specifically 1, the strictest of the
              three. It behaves like the number 1 does in ordinary multiplication:{" "}
              <Katex>{"AI = IA = A"}</Katex> for any compatible matrix <Katex>{"A"}</Katex>.
            </p>
            <Katex display>{"I = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}"}</Katex>
            <p className="blog-post-p">
              So every identity matrix is a scalar matrix, every scalar matrix is a diagonal
              matrix, but not the other way around.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Finding Missing Values in a Matrix</h2>
            <p className="blog-post-p">
              The definitions above are exactly what unknown-entry questions test: a stated matrix type, or an equation between determinants, pins down each missing value.
            </p>
            <h3 className="blog-post-subheading">Worked example: using a stated property</h3>
            <p className="blog-post-p">
              If <Katex>{"\\begin{bmatrix} x+2 & y-3 \\\\ 0 & 4 \\end{bmatrix}"}</Katex> is a{" "}
              <strong>scalar matrix</strong>, find <Katex>{"x"}</Katex> and <Katex>{"y"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> A scalar matrix needs every off-diagonal entry to be zero
              and both diagonal entries equal. The off-diagonal entry <Katex>{"y-3"}</Katex> must
              be zero:
            </p>
            <Katex display>{"y - 3 = 0 \\;\\Rightarrow\\; y = 3"}</Katex>
            <p className="blog-post-p">
              And the diagonal entries must match: <Katex>{"x+2 = 4"}</Katex>, so{" "}
              <Katex>{"x=2"}</Katex>.
            </p>
            <h3 className="blog-post-subheading">Worked example: matching determinants</h3>
            <p className="blog-post-p">
              If <Katex>{"\\begin{vmatrix} 3 & x \\\\ x & 1 \\end{vmatrix} = \\begin{vmatrix} 3 & 2 \\\\ 4 & 1 \\end{vmatrix}"}</Katex>,
              find <Katex>{"x"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Evaluate both determinants:
            </p>
            <Katex display>{"3(1) - x(x) = 3(1) - 2(4) \\;\\Rightarrow\\; 3-x^2 = -5"}</Katex>
            <Katex display>{"x^2 = 8 \\;\\Rightarrow\\; x = \\pm 2\\sqrt{2}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Once the types are clear, the next step is how these matrices behave under addition,
              multiplication and determinants.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/square-matrix">Square Matrix Properties</Link></li>
              <li><Link href="/resources/operations-on-matrices">Operations on Matrices</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
