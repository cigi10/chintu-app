import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Trigonometry: Solved Examples - Studyloaf",
  description: "Worked examples finding trigonometric ratios, evaluating standard-angle expressions, proving identities, and using co-function identities.",
  openGraph: {
    title: "Trigonometry: Solved Examples - Studyloaf",
    description: "Worked examples finding trigonometric ratios, evaluating standard-angle expressions, proving identities, and using co-function identities.",
  },
};

export default function TrigonometrySolvedExamplesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Trigonometry: Solved Examples",
        description: "Worked examples finding trigonometric ratios, evaluating standard-angle expressions, proving identities, and using co-function identities.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Trigonometry: Solved Examples", href: "/resources/trigonometry-solved-examples" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Trigonometry: Solved Examples</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Finding all ratios from one</h2>
            <p className="blog-post-p">
              Given <Katex>{"\\sec\\theta = \\dfrac{13}{12}"}</Katex>, find all other trigonometric
              ratios.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"\\sec\\theta = \\dfrac{\\text{hypotenuse}}{\\text{adjacent}}"}</Katex>,
              so take hypotenuse = 13 and adjacent = 12. By the Pythagorean theorem, opposite ={" "}
              <Katex>{"\\sqrt{13^2 - 12^2} = 5"}</Katex>. That gives:
            </p>
            <Katex display>{"\\sin\\theta = \\dfrac{5}{13}, \\quad \\cos\\theta = \\dfrac{12}{13}, \\quad \\tan\\theta = \\dfrac{5}{12}, \\quad \\csc\\theta = \\dfrac{13}{5}, \\quad \\cot\\theta = \\dfrac{12}{5}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">An identity check</h2>
            <p className="blog-post-p">
              If <Katex>{"3\\cot A = 4"}</Katex>, check whether{" "}
              <Katex>{"\\dfrac{1-\\tan^2 A}{1+\\tan^2 A}"}</Katex> equals{" "}
              <Katex>{"\\cos^2 A - \\sin^2 A"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"\\cot A = \\dfrac{4}{3}"}</Katex>, so{" "}
              <Katex>{"\\tan A = \\dfrac{3}{4}"}</Katex>: a 3-4-5 triangle gives{" "}
              <Katex>{"\\sin A = \\dfrac{3}{5}"}</Katex>, <Katex>{"\\cos A = \\dfrac{4}{5}"}</Katex>.
            </p>
            <Katex display>{"\\dfrac{1-\\tan^2 A}{1+\\tan^2 A} = \\dfrac{1 - \\frac{9}{16}}{1 + \\frac{9}{16}} = \\dfrac{7}{25}, \\qquad \\cos^2 A - \\sin^2 A = \\dfrac{16}{25} - \\dfrac{9}{25} = \\dfrac{7}{25}"}</Katex>
            <p className="blog-post-p">Both sides equal <Katex>{"\\dfrac{7}{25}"}</Katex>, so the identity holds here.</p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Evaluating a standard-angle expression</h2>
            <p className="blog-post-p">
              Evaluate <Katex>{"\\dfrac{\\cos 45^\\circ}{\\sec 30^\\circ + \\csc 60^\\circ}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"\\cos 45^\\circ = \\dfrac{1}{\\sqrt{2}}"}</Katex>, and
              since <Katex>{"\\cos 30^\\circ = \\sin 60^\\circ = \\dfrac{\\sqrt{3}}{2}"}</Katex>, both{" "}
              <Katex>{"\\sec 30^\\circ"}</Katex> and <Katex>{"\\csc 60^\\circ"}</Katex> equal{" "}
              <Katex>{"\\dfrac{2}{\\sqrt{3}}"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{\\frac{1}{\\sqrt{2}}}{\\frac{2}{\\sqrt{3}} + \\frac{2}{\\sqrt{3}}} = \\dfrac{\\frac{1}{\\sqrt{2}}}{\\frac{4}{\\sqrt{3}}} = \\dfrac{\\sqrt{3}}{4\\sqrt{2}} = \\dfrac{\\sqrt{6}}{8}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Solving for two unknown angles</h2>
            <p className="blog-post-p">
              If <Katex>{"\\tan(A+B) = \\sqrt{3}"}</Katex> and{" "}
              <Katex>{"\\tan(A-B) = \\dfrac{1}{\\sqrt{3}}"}</Katex>, with{" "}
              <Katex>{"0^\\circ < A+B \\le 90^\\circ"}</Katex> and <Katex>{"A > B"}</Katex>, find{" "}
              <Katex>{"A"}</Katex> and <Katex>{"B"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"\\tan(A+B) = \\tan 60^\\circ \\Rightarrow A+B = 60^\\circ"}</Katex>,
              and <Katex>{"\\tan(A-B) = \\tan 30^\\circ \\Rightarrow A-B = 30^\\circ"}</Katex>. Adding
              the two equations gives <Katex>{"2A = 90^\\circ"}</Katex>, so{" "}
              <Katex>{"A = 45^\\circ"}</Katex> and <Katex>{"B = 15^\\circ"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Co-function identities</h2>
            <p className="blog-post-p">
              Every trig ratio has a complementary partner: <Katex>{"\\sin(90^\\circ-\\theta)=\\cos\\theta"}</Katex>,{" "}
              <Katex>{"\\tan(90^\\circ-\\theta)=\\cot\\theta"}</Katex>, and{" "}
              <Katex>{"\\csc(90^\\circ-\\theta)=\\sec\\theta"}</Katex>. Rewriting one ratio in terms
              of its complement often makes an expression collapse.
            </p>
            <p className="blog-post-p">
              Evaluate <Katex>{"\\dfrac{\\sin 18^\\circ}{\\cos 72^\\circ}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Since <Katex>{"18^\\circ = 90^\\circ - 72^\\circ"}</Katex>,{" "}
              <Katex>{"\\sin 18^\\circ = \\cos 72^\\circ"}</Katex>, so the ratio is{" "}
              <Katex>{"\\dfrac{\\cos 72^\\circ}{\\cos 72^\\circ} = 1"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Proving an identity</h2>
            <p className="blog-post-p">
              Prove that <Katex>{"\\left(\\csc\\theta - \\cot\\theta\\right)^2 = \\dfrac{1-\\cos\\theta}{1+\\cos\\theta}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Write both terms on the left over a common denominator,
              then simplify using the difference of squares:
            </p>
            <Katex display>{"\\left(\\dfrac{1}{\\sin\\theta} - \\dfrac{\\cos\\theta}{\\sin\\theta}\\right)^2 = \\dfrac{(1-\\cos\\theta)^2}{\\sin^2\\theta} = \\dfrac{(1-\\cos\\theta)^2}{(1-\\cos\\theta)(1+\\cos\\theta)} = \\dfrac{1-\\cos\\theta}{1+\\cos\\theta}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a product-to-sum calculation</h2>
            <p className="blog-post-p">
              Calculate <Katex>{"\\sin 65^\\circ \\sin 25^\\circ"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Since <Katex>{"25^\\circ = 90^\\circ - 65^\\circ"}</Katex>,{" "}
              <Katex>{"\\sin 25^\\circ = \\cos 65^\\circ"}</Katex>, turning the product into{" "}
              <Katex>{"\\sin 65^\\circ \\cos 65^\\circ"}</Katex>. Using the double-angle identity{" "}
              <Katex>{"2\\sin\\theta\\cos\\theta = \\sin 2\\theta"}</Katex>:
            </p>
            <Katex display>{"\\sin 65^\\circ \\cos 65^\\circ = \\dfrac{1}{2}\\sin 130^\\circ = \\dfrac{1}{2}\\sin 50^\\circ"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Every one of these ratios starts from the same right-triangle relationship the
              Pythagorean theorem describes.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/trigonometry">Trigonometry Basics</Link></li>
              <li><Link href="/resources/pythagoras-theorem">Pythagoras Theorem</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
