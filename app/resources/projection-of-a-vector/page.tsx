import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Projection of a Vector - Studyloaf",
  description: "What the projection of a vector onto a directed line means, including what happens at special angles, with a worked example.",
  openGraph: {
    title: "Projection of a Vector - Studyloaf",
    description: "What the projection of a vector onto a directed line means, including what happens at special angles, with a worked example.",
  },
};

export default function ProjectionOfAVectorPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Projection of a Vector",
        description: "What the projection of a vector onto a directed line means, including what happens at special angles, with a worked example.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Projection of a Vector", href: "/resources/projection-of-a-vector" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Projection of a Vector</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The idea</h2>
            <p className="blog-post-p">
              The projection of a vector <Katex>{"\\overrightarrow{AB}"}</Katex> onto a directed
              line <Katex>{"l"}</Katex> is how much of <Katex>{"\\overrightarrow{AB}"}</Katex>{" "}
              points along <Katex>{"l"}</Katex>&apos;s direction — its &quot;shadow&quot; cast onto that
              line, scaled by <Katex>{"\\cos\\theta"}</Katex> where <Katex>{"\\theta"}</Katex> is
              the angle between them.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a special angle</h2>
            <p className="blog-post-p">
              What is the projection of <Katex>{"\\overrightarrow{AB}"}</Katex> on a directed line{" "}
              <Katex>{"l"}</Katex> if the angle between them is <Katex>{"\\theta = \\pi"}</Katex>{" "}
              (180°)?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> An angle of <Katex>{"\\pi"}</Katex> means{" "}
              <Katex>{"\\overrightarrow{AB}"}</Katex> points exactly opposite to the direction of{" "}
              <Katex>{"l"}</Katex>. The projection is then a vector of the same length as{" "}
              <Katex>{"\\overrightarrow{AB}"}</Katex> but pointing the other way along{" "}
              <Katex>{"l"}</Katex> — exactly <Katex>{"\\overrightarrow{BA}"}</Katex>, the negative
              of the original vector.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Projection is really just a scaled unit vector along the target direction, so it
              leans directly on knowing how to build a unit vector.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/unit-vector">Finding a Unit Vector</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
