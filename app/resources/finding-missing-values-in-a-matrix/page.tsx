import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Finding Missing Values in a Matrix - Studyloaf",
  description: "Solving for unknown entries in a matrix using a stated property or a matching determinant, with worked examples.",
  openGraph: {
    title: "Finding Missing Values in a Matrix - Studyloaf",
    description: "Solving for unknown entries in a matrix using a stated property or a matching determinant, with worked examples.",
  },
};

export default function FindingMissingValuesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Finding Missing Values in a Matrix",
        description: "Solving for unknown entries in a matrix using a stated property or a matching determinant, with worked examples.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Finding Missing Values in a Matrix", href: "/resources/finding-missing-values-in-a-matrix" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Finding Missing Values in a Matrix</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: using a stated property</h2>
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
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: matching determinants</h2>
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
              Recognizing a scalar matrix here relies on the same diagonal/scalar/identity
              distinctions covered on their own.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/special-types-of-matrices">Special Types of Matrices</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
