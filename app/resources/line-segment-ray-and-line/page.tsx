import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import "@/styles/blog.css";

export const metadata = {
  title: "Line Segment, Ray, and Line - Studyloaf",
  description: "The differences between a line segment, a ray, and a line, and what makes points or lines collinear or concurrent.",
  openGraph: {
    title: "Line Segment, Ray, and Line - Studyloaf",
    description: "The differences between a line segment, a ray, and a line, and what makes points or lines collinear or concurrent.",
  },
};

export default function LineSegmentRayLinePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Line Segment, Ray, and Line",
        description: "The differences between a line segment, a ray, and a line, and what makes points or lines collinear or concurrent.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Line Segment, Ray, and Line", href: "/resources/line-segment-ray-and-line" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Line Segment, Ray, and Line</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Three related but different objects</h2>
            <ul className="blog-post-list">
              <li>A <strong>line segment</strong> has two endpoints and a fixed, definite length.</li>
              <li>A <strong>ray</strong> has one endpoint and extends infinitely in a single direction, so it has no definite length.</li>
              <li>A <strong>line</strong> has no endpoints at all — it extends infinitely in both directions, so a complete line can only be represented on paper (with arrowheads showing it continues), not fully drawn.</li>
            </ul>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Collinear points and concurrent lines</h2>
            <p className="blog-post-p">
              Three or more points that all lie on the same line are called <strong>collinear</strong>.
              Three or more lines that all pass through the same single point are called{" "}
              <strong>concurrent</strong>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Quick true/false check</h2>
            <p className="blog-post-p">
              <strong>&quot;A ray has no end point.&quot;</strong> — False. A ray has exactly one
              endpoint (where it starts); it&apos;s only unbounded on the other end.
            </p>
            <p className="blog-post-p">
              <strong>&quot;A line can be drawn on paper.&quot;</strong> — False, strictly speaking:
              since a line is infinite in both directions, what actually gets drawn is only a
              segment that <em>represents</em> the line.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              These are the basic building blocks behind writing an actual equation for a line in
              coordinate geometry.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/equation-of-a-line">Finding the Equation of a Line</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
