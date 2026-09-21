import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Finding a Unit Vector - Studyloaf",
  description: "How to find the unit vector in a given direction, between two points, or scaled to a target magnitude, with worked examples.",
  openGraph: {
    title: "Finding a Unit Vector - Studyloaf",
    description: "How to find the unit vector in a given direction, between two points, or scaled to a target magnitude, with worked examples.",
  },
};

export default function UnitVectorPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Finding a Unit Vector",
        description: "How to find the unit vector in a given direction, between two points, or scaled to a target magnitude, with worked examples.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Finding a Unit Vector", href: "/resources/unit-vector" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Finding a Unit Vector</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The formula</h2>
            <p className="blog-post-p">
              A unit vector has magnitude 1. To find the unit vector pointing the same way as any
              vector <Katex>{"\\vec{a}"}</Katex>, divide by its own magnitude:
            </p>
            <Katex display>{"\\hat{a} = \\dfrac{\\vec{a}}{|\\vec{a}|}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the unit vector in the direction of <Katex>{"\\vec{a} = \\hat{i}+\\hat{j}+2\\hat{k}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"|\\vec{a}| = \\sqrt{1^2+1^2+2^2} = \\sqrt{6}"}</Katex>, so:
            </p>
            <Katex display>{"\\hat{a} = \\dfrac{1}{\\sqrt{6}}(\\hat{i}+\\hat{j}+2\\hat{k})"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: between two points</h2>
            <p className="blog-post-p">
              Find the unit vector in the direction of <Katex>{"\\overrightarrow{PQ}"}</Katex>{" "}
              where <Katex>{"P(1,2,3)"}</Katex> and <Katex>{"Q(4,5,6)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"\\overrightarrow{PQ}"}</Katex> is found by
              subtracting coordinates: <Katex>{"(4-1, 5-2, 6-3) = (3,3,3) = 3\\hat{i}+3\\hat{j}+3\\hat{k}"}</Katex>.
              Its magnitude is <Katex>{"\\sqrt{27} = 3\\sqrt{3}"}</Katex>, so:
            </p>
            <Katex display>{"\\hat{PQ} = \\dfrac{3(\\hat{i}+\\hat{j}+\\hat{k})}{3\\sqrt{3}} = \\dfrac{1}{\\sqrt{3}}(\\hat{i}+\\hat{j}+\\hat{k})"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: scaling to a target magnitude</h2>
            <p className="blog-post-p">
              Find a vector in the direction of <Katex>{"\\vec{a} = \\hat{i}-2\\hat{j}"}</Katex>{" "}
              with magnitude 7.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> First find the unit vector, then scale it up to
              magnitude 7. <Katex>{"|\\vec{a}| = \\sqrt{1+4} = \\sqrt{5}"}</Katex>:
            </p>
            <Katex display>{"7\\hat{a} = 7\\cdot\\dfrac{\\hat{i}-2\\hat{j}}{\\sqrt{5}} = \\dfrac{7}{\\sqrt{5}}\\hat{i} - \\dfrac{14}{\\sqrt{5}}\\hat{j}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Dividing by a vector&apos;s magnitude is the same normalization step used when finding
              the projection of one vector onto another.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/projection-of-a-vector">Projection of a Vector</Link></li>
              <li><Link href="/resources/operations-on-vectors">Operations on Vectors</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
