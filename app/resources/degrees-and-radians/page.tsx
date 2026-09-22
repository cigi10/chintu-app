import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Degrees and Radians - Studyloaf",
  description: "What a radian actually measures, the standard-angle conversion table, and converting between degrees and radians, with worked examples.",
  openGraph: {
    title: "Degrees and Radians - Studyloaf",
    description: "What a radian actually measures, the standard-angle conversion table, and converting between degrees and radians, with worked examples.",
  },
};

export default function DegreesAndRadiansPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Degrees and Radians",
        description: "What a radian actually measures, the standard-angle conversion table, and converting between degrees and radians, with worked examples.",
        datePublished: "2026-09-23T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Degrees and Radians", href: "/resources/degrees-and-radians" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Degrees and Radians</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What a radian actually is</h2>
            <p className="blog-post-p">
              A degree is an arbitrary unit — 360 of them make a full circle, likely borrowed from
              the 360 days of an ancient calendar year. A <strong>radian</strong>, the SI unit for
              angles, is defined geometrically instead: it&apos;s the angle you sweep out when the
              arc length traveled equals the radius:
            </p>
            <Katex display>{"\\text{Radian} = \\dfrac{\\text{arc length}}{\\text{radius}}"}</Katex>
            <p className="blog-post-p">
              A full circle&apos;s circumference is <Katex>{"2\\pi r"}</Katex> — exactly{" "}
              <Katex>{"2\\pi"}</Katex> radius-lengths around — so a full <Katex>{"360^\\circ"}</Katex>{" "}
              turn is exactly <Katex>{"2\\pi"}</Katex> radians.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Standard-angle conversions</h2>
            <Katex display>{"0^\\circ=0, \\quad 30^\\circ=\\dfrac{\\pi}{6}, \\quad 45^\\circ=\\dfrac{\\pi}{4}, \\quad 60^\\circ=\\dfrac{\\pi}{3}, \\quad 90^\\circ=\\dfrac{\\pi}{2}, \\quad 180^\\circ=\\pi"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: degrees to radians</h2>
            <p className="blog-post-p">
              Convert <Katex>{"150^\\circ"}</Katex> to radians.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Multiply by <Katex>{"\\tfrac{\\pi}{180}"}</Katex>:
            </p>
            <Katex display>{"150 \\times \\dfrac{\\pi}{180} = \\dfrac{5\\pi}{6}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: radians to degrees</h2>
            <p className="blog-post-p">
              Convert <Katex>{"\\dfrac{5\\pi}{4}"}</Katex> radians to degrees.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Multiply by <Katex>{"\\tfrac{180}{\\pi}"}</Katex>:
            </p>
            <Katex display>{"\\dfrac{5\\pi}{4} \\times \\dfrac{180}{\\pi} = 5 \\times 45 = 225^\\circ"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
