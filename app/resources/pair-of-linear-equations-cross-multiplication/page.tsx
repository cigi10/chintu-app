import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Pair of Linear Equations: Cross-Multiplication and Reducible Equations - Studyloaf",
  description: "The cross-multiplication formula for solving a pair of linear equations, and reducing an equation that isn't linear yet into one that is, with worked examples.",
  openGraph: {
    title: "Pair of Linear Equations: Cross-Multiplication and Reducible Equations - Studyloaf",
    description: "The cross-multiplication formula for solving a pair of linear equations, and reducing an equation that isn't linear yet into one that is, with worked examples.",
  },
};

export default function LinearEquationsCrossMultiplicationPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Pair of Linear Equations: Cross-Multiplication and Reducible Equations",
        description: "The cross-multiplication formula for solving a pair of linear equations, and reducing an equation that isn't linear yet into one that is, with worked examples.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Pair of Linear Equations: Cross-Multiplication and Reducible Equations", href: "/resources/pair-of-linear-equations-cross-multiplication" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Pair of Linear Equations: Cross-Multiplication and Reducible Equations</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The formula</h2>
            <p className="blog-post-p">
              For <Katex>{"a_1x+b_1y+c_1=0"}</Katex> and <Katex>{"a_2x+b_2y+c_2=0"}</Katex> with a
              unique solution, cross-multiplication gives both variables in one line:
            </p>
            <Katex display>{"\\dfrac{x}{b_1c_2-b_2c_1} = \\dfrac{y}{c_1a_2-c_2a_1} = \\dfrac{1}{a_1b_2-a_2b_1}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Solve <Katex>{"2x+y=5"}</Katex> and <Katex>{"3x+2y=8"}</Katex> by
              cross-multiplication.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Rewrite as <Katex>{"2x+y-5=0"}</Katex> and{" "}
              <Katex>{"3x+2y-8=0"}</Katex>, so <Katex>{"a_1=2,b_1=1,c_1=-5"}</Katex> and{" "}
              <Katex>{"a_2=3,b_2=2,c_2=-8"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{x}{(1)(-8)-(2)(-5)} = \\dfrac{y}{(-5)(3)-(-8)(2)} = \\dfrac{1}{(2)(2)-(3)(1)}"}</Katex>
            <Katex display>{"\\dfrac{x}{2} = \\dfrac{y}{1} = \\dfrac{1}{1} \\;\\Rightarrow\\; x=2, \\; y=1"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: an equation that isn&apos;t linear yet</h2>
            <p className="blog-post-p">
              Solve <Katex>{"\\dfrac{1}{2x}+\\dfrac{1}{3y}=2"}</Katex> and{" "}
              <Katex>{"\\dfrac{1}{3x}+\\dfrac{1}{2y}=\\dfrac{13}{6}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Neither equation is linear in <Katex>{"x"}</Katex> and{" "}
              <Katex>{"y"}</Katex> — but substituting <Katex>{"p=\\tfrac{1}{x}"}</Katex> and{" "}
              <Katex>{"q=\\tfrac{1}{y}"}</Katex> makes them linear in <Katex>{"p"}</Katex> and{" "}
              <Katex>{"q"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{p}{2}+\\dfrac{q}{3}=2 \\;\\Rightarrow\\; 3p+2q-12=0, \\qquad \\dfrac{p}{3}+\\dfrac{q}{2}=\\dfrac{13}{6} \\;\\Rightarrow\\; 2p+3q-13=0"}</Katex>
            <p className="blog-post-p">Cross-multiplying:</p>
            <Katex display>{"\\dfrac{p}{(2)(-13)-(3)(-12)} = \\dfrac{q}{(-12)(2)-(-13)(3)} = \\dfrac{1}{(3)(3)-(2)(2)}"}</Katex>
            <Katex display>{"\\dfrac{p}{10} = \\dfrac{q}{15} = \\dfrac{1}{5} \\;\\Rightarrow\\; p=2, \\; q=3"}</Katex>
            <p className="blog-post-p">
              Converting back, <Katex>{"\\tfrac{1}{x}=2"}</Katex> gives <Katex>{"x=\\tfrac{1}{2}"}</Katex>,
              and <Katex>{"\\tfrac{1}{y}=3"}</Katex> gives <Katex>{"y=\\tfrac{1}{3}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              These same two equations, once set up, are exactly the kind of story problem worked
              through step by step elsewhere.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/pair-of-linear-equations-word-problems">Pair of Linear Equations: Word Problems</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
