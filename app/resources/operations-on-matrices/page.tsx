import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import "@/styles/blog.css";

export const metadata = {
  title: "Operations on Matrices - Studyloaf",
  description: "How matrix addition and multiplication work, with a worked multiplication example.",
  openGraph: {
    title: "Operations on Matrices - Studyloaf",
    description: "How matrix addition and multiplication work, with a worked multiplication example.",
  },
};

export default function OperationsOnMatricesPage() {
  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <article className="blog-post">
          <h1 className="blog-post-title">Operations on Matrices</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Addition</h2>
            <p className="blog-post-p">
              Two matrices can only be added if they have the same dimensions. Add them entry by
              entry:
            </p>
            <Katex display>{"\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + \\begin{bmatrix} e & f \\\\ g & h \\end{bmatrix} = \\begin{bmatrix} a+e & b+f \\\\ c+g & d+h \\end{bmatrix}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Multiplication</h2>
            <p className="blog-post-p">
              Two matrices can be multiplied when the number of columns in the first equals the
              number of rows in the second. Each entry of the product is the sum of the products of
              the corresponding row (from the first matrix) and column (from the second matrix).
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">Given:</p>
            <Katex display>{"A = \\begin{bmatrix} 0 & 6 & 7 \\\\ -6 & 0 & 8 \\\\ 7 & -8 & 0 \\end{bmatrix}, \\quad B = \\begin{bmatrix} 0 & 1 & 1 \\\\ 1 & 0 & 2 \\\\ 1 & 2 & 0 \\end{bmatrix}, \\quad C = \\begin{bmatrix} 2 \\\\ -2 \\\\ 3 \\end{bmatrix}"}</Katex>
            <p className="blog-post-p">
              Calculate <Katex>{"AB"}</Katex> and <Katex>{"AC"}</Katex>. (Note: <Katex>{"B"}</Katex>{" "}
              is 3&times;3 and <Katex>{"C"}</Katex> is 3&times;1, so <Katex>{"B + C"}</Katex> isn't a
              defined matrix operation, only <Katex>{"AB"}</Katex> and <Katex>{"AC"}</Katex> are
              computed here.)
            </p>
            <p className="blog-post-p"><strong>AB:</strong> multiplying each row of A by each column of B gives</p>
            <Katex display>{"AB = \\begin{bmatrix} 13 & 14 & 12 \\\\ 8 & 10 & -6 \\\\ -8 & 7 & -9 \\end{bmatrix}"}</Katex>
            <p className="blog-post-p"><strong>AC:</strong> multiplying each row of A by the column C gives</p>
            <Katex display>{"AC = \\begin{bmatrix} 0(2) + 6(-2) + 7(3) \\\\ -6(2) + 0(-2) + 8(3) \\\\ 7(2) + -8(-2) + 0(3) \\end{bmatrix} = \\begin{bmatrix} 9 \\\\ 12 \\\\ 30 \\end{bmatrix}"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
