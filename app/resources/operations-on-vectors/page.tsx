import Navbar from "@/components/Navbar";
import Link from "next/link";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Operations on Vectors - Studyloaf",
  description: "The negative of a vector, the scalar triple product identity, and using the dot product on unit vectors, with worked examples.",
  openGraph: {
    title: "Operations on Vectors - Studyloaf",
    description: "The negative of a vector, the scalar triple product identity, and using the dot product on unit vectors, with worked examples.",
  },
};

export default function OperationsOnVectorsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Operations on Vectors",
        description: "The negative of a vector, the scalar triple product identity, and using the dot product on unit vectors, with worked examples.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Operations on Vectors", href: "/resources/operations-on-vectors" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Operations on Vectors</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The negative of a vector</h2>
            <p className="blog-post-p">
              The negative of a vector <Katex>{"\\vec{a}"}</Katex>, written{" "}
              <Katex>{"-\\vec{a}"}</Katex>, has the same magnitude as <Katex>{"\\vec{a}"}</Katex>{" "}
              but points in exactly the opposite direction. If{" "}
              <Katex>{"\\vec{a} = \\overrightarrow{AB}"}</Katex> (from point A to point B), then{" "}
              <Katex>{"-\\vec{a} = \\overrightarrow{BA}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a scalar triple product identity</h2>
            <p className="blog-post-p">
              For any three vectors <Katex>{"\\vec{a}, \\vec{b}, \\vec{c}"}</Katex>, prove that{" "}
              <Katex>{"[\\vec{a}+\\vec{b}\\;\\;\\vec{b}+\\vec{c}\\;\\;\\vec{c}+\\vec{a}] = 2[\\vec{a}\\;\\;\\vec{b}\\;\\;\\vec{c}]"}</Katex>,
              where <Katex>{"[\\vec{x}\\;\\vec{y}\\;\\vec{z}] = \\vec{x}\\cdot(\\vec{y}\\times\\vec{z})"}</Katex>{" "}
              is the scalar triple product.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Expand the cross product first:
            </p>
            <Katex display>{"(\\vec{b}+\\vec{c})\\times(\\vec{c}+\\vec{a}) = \\vec{b}\\times\\vec{c} + \\vec{b}\\times\\vec{a} + \\vec{c}\\times\\vec{a}"}</Katex>
            <p className="blog-post-p">
              (the <Katex>{"\\vec{c}\\times\\vec{c}"}</Katex> term vanishes). Dotting with{" "}
              <Katex>{"\\vec{a}+\\vec{b}"}</Katex> and dropping every term where a vector is dotted
              with a cross product containing itself (always zero):
            </p>
            <Katex display>{"(\\vec{a}+\\vec{b})\\cdot(\\vec{b}\\times\\vec{c}+\\vec{b}\\times\\vec{a}+\\vec{c}\\times\\vec{a}) = \\vec{a}\\cdot(\\vec{b}\\times\\vec{c}) + \\vec{b}\\cdot(\\vec{c}\\times\\vec{a})"}</Katex>
            <p className="blog-post-p">
              The scalar triple product is cyclic, so{" "}
              <Katex>{"\\vec{b}\\cdot(\\vec{c}\\times\\vec{a}) = \\vec{a}\\cdot(\\vec{b}\\times\\vec{c})"}</Katex>.
              Both terms are equal, so the sum is <Katex>{"2[\\vec{a}\\;\\vec{b}\\;\\vec{c}]"}</Katex>, as required.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: unit vectors summing to zero</h2>
            <p className="blog-post-p">
              If <Katex>{"\\vec{a}, \\vec{b}, \\vec{c}"}</Katex> are unit vectors with{" "}
              <Katex>{"\\vec{a}+\\vec{b}+\\vec{c}=\\vec{0}"}</Katex>, find{" "}
              <Katex>{"\\vec{a}\\cdot\\vec{b} + \\vec{b}\\cdot\\vec{c} + \\vec{c}\\cdot\\vec{a}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Square the magnitude of the sum, which is zero:
            </p>
            <Katex display>{"|\\vec{a}+\\vec{b}+\\vec{c}|^2 = \\vec{a}\\cdot\\vec{a}+\\vec{b}\\cdot\\vec{b}+\\vec{c}\\cdot\\vec{c} + 2(\\vec{a}\\cdot\\vec{b}+\\vec{b}\\cdot\\vec{c}+\\vec{c}\\cdot\\vec{a}) = 0"}</Katex>
            <p className="blog-post-p">
              Since each is a unit vector, <Katex>{"\\vec{a}\\cdot\\vec{a}=\\vec{b}\\cdot\\vec{b}=\\vec{c}\\cdot\\vec{c}=1"}</Katex>:
            </p>
            <Katex display>{"3 + 2(\\vec{a}\\cdot\\vec{b}+\\vec{b}\\cdot\\vec{c}+\\vec{c}\\cdot\\vec{a}) = 0 \\;\\Rightarrow\\; \\vec{a}\\cdot\\vec{b}+\\vec{b}\\cdot\\vec{c}+\\vec{c}\\cdot\\vec{a} = -\\dfrac{3}{2}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Once you can add and scale vectors, finding a unit vector in a given direction is the
              natural next step.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/unit-vector">Finding a Unit Vector</Link></li>
              <li><Link href="/resources/projection-of-a-vector">Projection of a Vector</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
