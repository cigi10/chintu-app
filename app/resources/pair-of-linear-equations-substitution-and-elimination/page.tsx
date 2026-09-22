import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Pair of Linear Equations: Substitution and Elimination Methods - Studyloaf",
  description: "Solving a pair of linear equations by substitution and by elimination, including recognizing when a system has infinitely many solutions.",
  openGraph: {
    title: "Pair of Linear Equations: Substitution and Elimination Methods - Studyloaf",
    description: "Solving a pair of linear equations by substitution and by elimination, including recognizing when a system has infinitely many solutions.",
  },
};

export default function LinearEquationsSubstitutionEliminationPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Pair of Linear Equations: Substitution and Elimination Methods",
        description: "Solving a pair of linear equations by substitution and by elimination, including recognizing when a system has infinitely many solutions.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Pair of Linear Equations: Substitution and Elimination Methods", href: "/resources/pair-of-linear-equations-substitution-and-elimination" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Pair of Linear Equations: Substitution and Elimination Methods</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: substitution</h2>
            <p className="blog-post-p">
              Solve <Katex>{"x+y=14"}</Katex> and <Katex>{"x-y=4"}</Katex> by substitution.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> From the second equation, <Katex>{"x = y+4"}</Katex>.
              Substituting into the first:
            </p>
            <Katex display>{"(y+4) + y = 14 \\;\\Rightarrow\\; 2y = 10 \\;\\Rightarrow\\; y = 5"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"x = 5+4 = 9"}</Katex>. Checking: <Katex>{"9+5=14"}</Katex> and{" "}
              <Katex>{"9-5=4"}</Katex>, both correct.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: substitution revealing infinitely many solutions</h2>
            <p className="blog-post-p">
              Solve <Katex>{"3x-y=3"}</Katex> and <Katex>{"9x-3y=9"}</Katex> by substitution.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> From the first, <Katex>{"y = 3x-3"}</Katex>. Substituting
              into the second:
            </p>
            <Katex display>{"9x - 3(3x-3) = 9 \\;\\Rightarrow\\; 9x - 9x + 9 = 9 \\;\\Rightarrow\\; 9 = 9"}</Katex>
            <p className="blog-post-p">
              Every variable canceled out, leaving a statement that&apos;s always true. That&apos;s
              the signal that the second equation is just <Katex>{"3\\times"}</Katex> the first —
              the same line twice, with infinitely many solutions rather than one.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: elimination</h2>
            <p className="blog-post-p">
              Solve <Katex>{"x+y=5"}</Katex> and <Katex>{"2x-3y=4"}</Katex> by elimination.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Multiply the first equation by 2 so the{" "}
              <Katex>{"x"}</Katex> terms match:
            </p>
            <Katex display>{"2x + 2y = 10"}</Katex>
            <p className="blog-post-p">
              Subtracting <Katex>{"2x-3y=4"}</Katex> from this eliminates <Katex>{"x"}</Katex>:
            </p>
            <Katex display>{"(2x+2y) - (2x-3y) = 10 - 4 \\;\\Rightarrow\\; 5y = 6 \\;\\Rightarrow\\; y = \\dfrac{6}{5}"}</Katex>
            <p className="blog-post-p">
              Substituting back: <Katex>{"x + \\tfrac{6}{5} = 5 \\;\\Rightarrow\\; x = \\tfrac{19}{5}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Cross-multiplication packages the same elimination idea into one formula, and works
              even on equations that don&apos;t look linear at first, once you substitute for the
              messy part.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/pair-of-linear-equations-cross-multiplication">Pair of Linear Equations: Cross-Multiplication and Reducible Equations</Link></li>
              <li><Link href="/resources/pair-of-linear-equations-graphical-method">Pair of Linear Equations: Graphical Method</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
