import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Proportion - Studyloaf",
  description: "How to check whether four numbers are in proportion, and how to solve for a missing term, with worked examples.",
  openGraph: {
    title: "Proportion - Studyloaf",
    description: "How to check whether four numbers are in proportion, and how to solve for a missing term, with worked examples.",
  },
};

export default function ProportionPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Proportion",
        description: "How to check whether four numbers are in proportion, and how to solve for a missing term, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Proportion", href: "/resources/proportion" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Proportion</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What is a proportion?</h2>
            <p className="blog-post-p">
              Four numbers <Katex>{"a, b, c, d"}</Katex> are said to be in proportion, written{" "}
              <Katex>{"a : b :: c : d"}</Katex>, when the ratio of the first pair equals the ratio of
              the second pair:
            </p>
            <Katex display>{"\\dfrac{a}{b} = \\dfrac{c}{d} \\iff a \\times d = b \\times c"}</Katex>
            <p className="blog-post-p">
              That cross-multiplied form — the product of the outer (extreme) terms equals the
              product of the inner (middle) terms — is the fastest way to test or solve a proportion.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: testing a proportion</h2>
            <p className="blog-post-p">Are 20, 18, 5, 6 in proportion?</p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Check whether <Katex>{"20 \\times 6 = 18 \\times 5"}</Katex>:
            </p>
            <Katex display>{"20 \\times 6 = 120, \\qquad 18 \\times 5 = 90"}</Katex>
            <p className="blog-post-p">
              120 ≠ 90, so <strong>20, 18, 5, 6 are not in proportion</strong>.
            </p>
            <p className="blog-post-p">Compare that with 30, 40, 45, 60:</p>
            <Katex display>{"30 \\times 60 = 1800, \\qquad 40 \\times 45 = 1800"}</Katex>
            <p className="blog-post-p">
              These match, so <strong>30, 40, 45, 60 are in proportion</strong>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: solving for a missing term</h2>
            <p className="blog-post-p">
              If <Katex>{"36 : 81 :: x : 63"}</Katex>, find <Katex>{"x"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Cross-multiplying, <Katex>{"36 \\times 63 = 81 \\times x"}</Katex>:
            </p>
            <Katex display>{"x = \\dfrac{36 \\times 63}{81} = \\dfrac{2268}{81} = 28"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              A proportion is just two equal ratios, so simplifying ratios is the first skill this
              builds on.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/ratio">Ratio</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
