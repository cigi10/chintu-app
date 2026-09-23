import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Eigenvalues and Eigenvectors - Studyloaf",
  description: "The characteristic equation for finding eigenvalues and eigenvectors, with a fully worked 2x2 example verified two ways: by substitution and by the trace/determinant check.",
  openGraph: {
    title: "Eigenvalues and Eigenvectors - Studyloaf",
    description: "The characteristic equation for finding eigenvalues and eigenvectors, with a fully worked 2x2 example verified two ways: by substitution and by the trace/determinant check.",
  },
};

export default function EigenvaluesEigenvectorsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Eigenvalues and Eigenvectors",
        description: "The characteristic equation for finding eigenvalues and eigenvectors, with a fully worked 2x2 example verified two ways: by substitution and by the trace/determinant check.",
        datePublished: "2026-09-25T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Eigenvalues and Eigenvectors", href: "/resources/matrices-eigenvalues-eigenvectors" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Eigenvalues and Eigenvectors</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The defining equation</h2>
            <p className="blog-post-p">
              For a square matrix <Katex>{"A"}</Katex>, an eigenvector is a nonzero vector{" "}
              <Katex>{"v"}</Katex> that <Katex>{"A"}</Katex> only stretches or shrinks, never
              rotates off its own line — multiplying by <Katex>{"A"}</Katex> is the same as
              multiplying by a plain number <Katex>{"\\lambda"}</Katex>, the eigenvalue:
            </p>
            <Katex display>{"Av = \\lambda v \\quad\\Longleftrightarrow\\quad (A-\\lambda I)v = 0"}</Katex>
            <p className="blog-post-p">
              Since <Katex>{"v \\ne 0"}</Katex>, this only has a solution when{" "}
              <Katex>{"(A-\\lambda I)"}</Katex> is singular — giving the{" "}
              <strong>characteristic equation</strong> that pins down every eigenvalue:
            </p>
            <Katex display>{"\\det(A - \\lambda I) = 0"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the eigenvalues and eigenvectors of{" "}
              <Katex>{"A = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Set up the characteristic equation:
            </p>
            <Katex display>{"\\det\\begin{bmatrix} 2-\\lambda & 1 \\\\ 1 & 2-\\lambda \\end{bmatrix} = (2-\\lambda)^2 - 1 = 0"}</Katex>
            <Katex display>{"(2-\\lambda)^2 = 1 \\;\\Rightarrow\\; 2-\\lambda = \\pm1 \\;\\Rightarrow\\; \\lambda = 1 \\text{ or } \\lambda = 3"}</Katex>
            <p className="blog-post-p">
              <strong>For</strong> <Katex>{"\\lambda=1"}</Katex>: solve{" "}
              <Katex>{"(A-I)v=0"}</Katex>:
            </p>
            <Katex display>{"\\begin{bmatrix} 1 & 1 \\\\ 1 & 1 \\end{bmatrix}\\begin{bmatrix}v_1\\\\v_2\\end{bmatrix} = 0 \\;\\Rightarrow\\; v_1+v_2=0 \\;\\Rightarrow\\; v = \\begin{bmatrix}1\\\\-1\\end{bmatrix}"}</Katex>
            <p className="blog-post-p">
              <strong>For</strong> <Katex>{"\\lambda=3"}</Katex>: solve{" "}
              <Katex>{"(A-3I)v=0"}</Katex>:
            </p>
            <Katex display>{"\\begin{bmatrix} -1 & 1 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix}v_1\\\\v_2\\end{bmatrix} = 0 \\;\\Rightarrow\\; v_1=v_2 \\;\\Rightarrow\\; v = \\begin{bmatrix}1\\\\1\\end{bmatrix}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Checking the answer two ways</h2>
            <p className="blog-post-p">
              <strong>By direct substitution:</strong> <Katex>{"A\\begin{bmatrix}1\\\\-1\\end{bmatrix} = \\begin{bmatrix}2-1\\\\1-2\\end{bmatrix} = \\begin{bmatrix}1\\\\-1\\end{bmatrix} = 1\\cdot\\begin{bmatrix}1\\\\-1\\end{bmatrix}"}</Katex>{" "}
              — confirmed. <Katex>{"A\\begin{bmatrix}1\\\\1\\end{bmatrix} = \\begin{bmatrix}3\\\\3\\end{bmatrix} = 3\\cdot\\begin{bmatrix}1\\\\1\\end{bmatrix}"}</Katex> — confirmed.
            </p>
            <p className="blog-post-p">
              <strong>By trace and determinant:</strong> the sum of the eigenvalues always equals
              the trace of <Katex>{"A"}</Katex>, and their product always equals{" "}
              <Katex>{"\\det A"}</Katex>:
            </p>
            <Katex display>{"\\lambda_1+\\lambda_2 = 1+3 = 4 = \\text{trace}(A) = 2+2, \\qquad \\lambda_1\\lambda_2 = 1\\times3 = 3 = \\det A = (2)(2)-(1)(1)"}</Katex>
            <p className="blog-post-p">
              Both checks pass independently of the substitution check above — a fast way to catch
              an arithmetic slip in the characteristic equation itself.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The same partial derivatives used to build a Jacobian matrix are covered separately
              — eigenvalues of a Jacobian are exactly how stability of a system is analyzed near an
              equilibrium point.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/partial-differentiation">Partial Differentiation</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
