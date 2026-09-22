import Navbar from "@/components/Navbar";
import Link from "next/link";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Pair of Linear Equations: Graphical Method - Studyloaf",
  description: "Turning a word problem into a pair of linear equations, and checking whether two lines intersect, are parallel, or coincide by comparing coefficient ratios.",
  openGraph: {
    title: "Pair of Linear Equations: Graphical Method - Studyloaf",
    description: "Turning a word problem into a pair of linear equations, and checking whether two lines intersect, are parallel, or coincide by comparing coefficient ratios.",
  },
};

export default function LinearEquationsGraphicalPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Pair of Linear Equations: Graphical Method",
        description: "Turning a word problem into a pair of linear equations, and checking whether two lines intersect, are parallel, or coincide by comparing coefficient ratios.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Pair of Linear Equations: Graphical Method", href: "/resources/pair-of-linear-equations-graphical-method" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Pair of Linear Equations: Graphical Method</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: forming equations from a word problem</h2>
            <p className="blog-post-p">
              Aftab tells his daughter: &quot;Seven years ago, I was seven times as old as you
              were then. Three years from now, I&apos;ll be three times as old as you&apos;ll be.&quot;
              Represent this algebraically.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let Aftab&apos;s present age be <Katex>{"x"}</Katex> and his
              daughter&apos;s be <Katex>{"y"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Seven years ago:</strong> <Katex>{"x-7 = 7(y-7)"}</Katex>
            </p>
            <Katex display>{"x - 7 = 7y - 49 \\;\\Rightarrow\\; x - 7y = -42"}</Katex>
            <p className="blog-post-p">
              <strong>Three years from now:</strong> <Katex>{"x+3 = 3(y+3)"}</Katex>
            </p>
            <Katex display>{"x + 3 = 3y + 9 \\;\\Rightarrow\\; x - 3y = 6"}</Katex>
            <p className="blog-post-p">
              Each condition becomes one linear equation in <Katex>{"x"}</Katex> and{" "}
              <Katex>{"y"}</Katex> — turning the two equations into two lines and plotting them is
              exactly the graphical method.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Reading a pair of lines without plotting them</h2>
            <p className="blog-post-p">
              For <Katex>{"a_1x+b_1y+c_1=0"}</Katex> and <Katex>{"a_2x+b_2y+c_2=0"}</Katex>,
              comparing the ratios of coefficients tells you how the two lines relate, with no
              graph needed:
            </p>
            <ul className="blog-post-list">
              <li><Katex>{"\\dfrac{a_1}{a_2} \\ne \\dfrac{b_1}{b_2}"}</Katex>: the lines <strong>intersect</strong> at exactly one point (a unique solution).</li>
              <li><Katex>{"\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} = \\dfrac{c_1}{c_2}"}</Katex>: the lines are <strong>coincident</strong> (infinitely many solutions).</li>
              <li><Katex>{"\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} \\ne \\dfrac{c_1}{c_2}"}</Katex>: the lines are <strong>parallel</strong> (no solution).</li>
            </ul>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: intersecting lines</h2>
            <p className="blog-post-p">
              Do <Katex>{"5x-4y+8=0"}</Katex> and <Katex>{"7x+6y-9=0"}</Katex> intersect, or are
              they parallel or coincident?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"a_1=5, b_1=-4"}</Katex> and{" "}
              <Katex>{"a_2=7, b_2=6"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{a_1}{a_2} = \\dfrac{5}{7}, \\qquad \\dfrac{b_1}{b_2} = \\dfrac{-4}{6} = -\\dfrac{2}{3}"}</Katex>
            <p className="blog-post-p">
              Since <Katex>{"\\tfrac{5}{7} \\ne -\\tfrac{2}{3}"}</Katex>, the lines intersect at
              exactly one point — this pair has a unique solution.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: coincident lines</h2>
            <p className="blog-post-p">
              Do <Katex>{"2x+3y-6=0"}</Katex> and <Katex>{"4x+6y-12=0"}</Katex> intersect, or are
              they parallel or coincident?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The second equation is exactly twice the first, so every
              ratio matches:
            </p>
            <Katex display>{"\\dfrac{a_1}{a_2} = \\dfrac{2}{4}=\\dfrac{1}{2}, \\quad \\dfrac{b_1}{b_2} = \\dfrac{3}{6}=\\dfrac{1}{2}, \\quad \\dfrac{c_1}{c_2} = \\dfrac{-6}{-12}=\\dfrac{1}{2}"}</Katex>
            <p className="blog-post-p">
              All three ratios are equal, so the two equations describe the <em>same</em> line —
              coincident, with infinitely many solutions.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Once you know a pair of equations has a unique solution, substitution and elimination
              find it algebraically without needing a graph at all.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/pair-of-linear-equations-substitution-and-elimination">Pair of Linear Equations: Substitution and Elimination Methods</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
