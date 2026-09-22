import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Types of Functions - Studyloaf",
  description: "One-one, onto, bijective, and invertible functions explained, with worked examples on checking each property and finding an inverse.",
  openGraph: {
    title: "Types of Functions - Studyloaf",
    description: "One-one, onto, bijective, and invertible functions explained, with worked examples on checking each property and finding an inverse.",
  },
};

export default function TypesOfFunctionsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Types of Functions",
        description: "One-one, onto, bijective, and invertible functions explained, with worked examples on checking each property and finding an inverse.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Types of Functions", href: "/resources/types-of-functions" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Types of Functions</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The definitions, building on each other</h2>
            <p className="blog-post-p">
              A function <Katex>{"f"}</Katex> is <strong>one-one</strong> (injective) if different
              inputs always give different outputs, and <strong>onto</strong> (surjective) if every
              element of the codomain actually gets hit by something. A function that&apos;s{" "}
              <strong>both</strong> is called <strong>bijective</strong>. Bijective is exactly the
              condition a function needs to be <strong>invertible</strong> — to have a genuine
              inverse function that undoes it.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: checking one-one and onto</h2>
            <p className="blog-post-p">
              Let <Katex>{"f: \\mathbb{N} \\to \\mathbb{N}"}</Katex> be defined by{" "}
              <Katex>{"f(n) = \\dfrac{n+1}{2}"}</Katex> if <Katex>{"n"}</Katex> is odd, and{" "}
              <Katex>{"f(n) = \\dfrac{n}{2}"}</Katex> if <Katex>{"n"}</Katex> is even. Is{" "}
              <Katex>{"f"}</Katex> one-one, onto, both, or neither?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Check a couple of small inputs:{" "}
              <Katex>{"f(1) = \\tfrac{1+1}{2} = 1"}</Katex> and{" "}
              <Katex>{"f(2) = \\tfrac{2}{2} = 1"}</Katex>. Two different inputs, <Katex>{"1"}</Katex>{" "}
              and <Katex>{"2"}</Katex>, give the same output — so <Katex>{"f"}</Katex> is{" "}
              <strong>not one-one</strong>. But for any target <Katex>{"m \\in \\mathbb{N}"}</Katex>,
              the even input <Katex>{"n=2m"}</Katex> gives <Katex>{"f(2m) = m"}</Katex> — so every
              output is reachable, and <Katex>{"f"}</Katex> <strong>is onto</strong>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: finding an inverse</h2>
            <p className="blog-post-p">
              <Katex>{"f: \\mathbb{N} \\to \\mathbb{R}"}</Katex> is defined by{" "}
              <Katex>{"f(x) = 4x^2+12x+15"}</Katex>. Show <Katex>{"f: \\mathbb{N} \\to S"}</Katex>{" "}
              (where <Katex>{"S"}</Katex> is the range of <Katex>{"f"}</Katex>) is invertible, and
              find the inverse.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Complete the square first:
            </p>
            <Katex display>{"y = 4x^2+12x+15 = 4\\left(x+\\dfrac{3}{2}\\right)^2 + 6"}</Katex>
            <p className="blog-post-p">
              Since <Katex>{"x \\in \\mathbb{N}"}</Katex> means <Katex>{"x+\\tfrac{3}{2} > 0"}</Katex>,
              this squaring step is reversible — each <Katex>{"y"}</Katex> comes from exactly one{" "}
              <Katex>{"x"}</Katex>, so <Katex>{"f"}</Katex> is invertible on its range. Solving for{" "}
              <Katex>{"x"}</Katex>:
            </p>
            <Katex display>{"y-6 = 4\\left(x+\\dfrac{3}{2}\\right)^2 \\;\\Rightarrow\\; x+\\dfrac{3}{2} = \\dfrac{\\sqrt{y-6}}{2} \\;\\Rightarrow\\; x = \\dfrac{\\sqrt{y-6}-3}{2}"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"f^{-1}(y) = \\dfrac{\\sqrt{y-6}-3}{2}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a reflection is an inverse</h2>
            <p className="blog-post-p">
              <Katex>{"f(x) = (x+1)^2"}</Katex> for <Katex>{"x \\ge -1"}</Katex>. If{" "}
              <Katex>{"g(x)"}</Katex> is the reflection of <Katex>{"f(x)"}</Katex> in the line{" "}
              <Katex>{"y=x"}</Katex>, find <Katex>{"g(x)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Reflecting a graph in <Katex>{"y=x"}</Katex> is exactly
              what taking the inverse function does, so <Katex>{"g = f^{-1}"}</Katex>. Setting{" "}
              <Katex>{"y=(x+1)^2"}</Katex> and solving for <Katex>{"x"}</Katex> (taking the
              non-negative root since <Katex>{"x+1 \\ge 0"}</Katex>):
            </p>
            <Katex display>{"x+1 = \\sqrt{y} \\;\\Rightarrow\\; x = \\sqrt{y}-1 \\;\\Rightarrow\\; g(x) = \\sqrt{x}-1"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Composing two functions is the natural next skill once you can talk about a
              function&apos;s inverse, and the same reflexive/symmetric building blocks apply to
              relations more generally.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/composition-of-functions">Composition of Functions (gof and fog)</Link></li>
              <li><Link href="/resources/types-of-relations">Types of Relations</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
