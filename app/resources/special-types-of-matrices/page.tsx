import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Special Types of Matrices - Studyloaf",
  description: "Diagonal, scalar, and identity matrices explained, with examples showing how each one is a more specific case of the last.",
  openGraph: {
    title: "Special Types of Matrices - Studyloaf",
    description: "Diagonal, scalar, and identity matrices explained, with examples showing how each one is a more specific case of the last.",
  },
};

export default function SpecialTypesOfMatricesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Special Types of Matrices",
        description: "Diagonal, scalar, and identity matrices explained, with examples showing how each one is a more specific case of the last.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
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
              equal to the same number <Katex>{"k"}</Katex> — a stricter version of &quot;diagonal.&quot;
            </p>
            <Katex display>{"\\begin{bmatrix} 5 & 0 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & 5 \\end{bmatrix}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Identity matrix</h2>
            <p className="blog-post-p">
              The <strong>identity matrix</strong>, written <Katex>{"I"}</Katex>, is the scalar
              matrix where that repeated diagonal value is specifically 1 — the strictest of the
              three. It behaves like the number 1 does in ordinary multiplication:{" "}
              <Katex>{"AI = IA = A"}</Katex> for any compatible matrix <Katex>{"A"}</Katex>.
            </p>
            <Katex display>{"I = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}"}</Katex>
            <p className="blog-post-p">
              So every identity matrix is a scalar matrix, every scalar matrix is a diagonal
              matrix, but not the other way around.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Recognizing a scalar matrix is exactly the skill needed to solve for unknown entries
              that are required to make a given matrix scalar.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/finding-missing-values-in-a-matrix">Finding Missing Values in a Matrix</Link></li>
              <li><Link href="/resources/operations-on-matrices">Operations on Matrices</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
