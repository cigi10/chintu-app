import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Symmetric and Skew-Symmetric Matrices - Studyloaf",
  description: "What symmetric and skew-symmetric matrices are, and how to split any square matrix into a sum of both, with a worked example.",
  openGraph: {
    title: "Symmetric and Skew-Symmetric Matrices - Studyloaf",
    description: "What symmetric and skew-symmetric matrices are, and how to split any square matrix into a sum of both, with a worked example.",
  },
};

export default function SymmetricSkewSymmetricPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Symmetric and Skew-Symmetric Matrices",
        description: "What symmetric and skew-symmetric matrices are, and how to split any square matrix into a sum of both, with a worked example.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Symmetric and Skew-Symmetric Matrices", href: "/resources/symmetric-and-skew-symmetric-matrices" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Symmetric and Skew-Symmetric Matrices</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The two definitions</h2>
            <p className="blog-post-p">
              A square matrix <Katex>{"A"}</Katex> is <strong>symmetric</strong> if{" "}
              <Katex>{"A^T = A"}</Katex>, and <strong>skew-symmetric</strong> if{" "}
              <Katex>{"A^T = -A"}</Katex>. Any square matrix can be split into a symmetric part
              plus a skew-symmetric part:
            </p>
            <Katex display>{"A = \\underbrace{\\dfrac{1}{2}(A+A^T)}_{\\text{symmetric}} + \\underbrace{\\dfrac{1}{2}(A-A^T)}_{\\text{skew-symmetric}}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Express <Katex>{"A = \\begin{bmatrix} 3 & 5 \\\\ 1 & -1 \\end{bmatrix}"}</Katex> as
              the sum of a symmetric and a skew-symmetric matrix.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> First find <Katex>{"A^T = \\begin{bmatrix} 3 & 1 \\\\ 5 & -1 \\end{bmatrix}"}</Katex>.
            </p>
            <Katex display>{"\\dfrac{1}{2}(A+A^T) = \\dfrac{1}{2}\\begin{bmatrix} 6 & 6 \\\\ 6 & -2 \\end{bmatrix} = \\begin{bmatrix} 3 & 3 \\\\ 3 & -1 \\end{bmatrix}"}</Katex>
            <Katex display>{"\\dfrac{1}{2}(A-A^T) = \\dfrac{1}{2}\\begin{bmatrix} 0 & 4 \\\\ -4 & 0 \\end{bmatrix} = \\begin{bmatrix} 0 & 2 \\\\ -2 & 0 \\end{bmatrix}"}</Katex>
            <p className="blog-post-p">
              Checking the two pieces: the first matrix is symmetric (it equals its own
              transpose), the second is skew-symmetric (its transpose is its negative), and adding
              them back together gives exactly <Katex>{"A"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              This decomposition only makes sense once you know which special matrix shapes
              (diagonal, scalar, identity) are already symmetric to begin with.
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
