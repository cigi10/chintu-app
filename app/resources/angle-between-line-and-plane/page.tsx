import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Angle Between a Line and a Plane - Studyloaf",
  description: "How to find the angle between a line and a plane using their direction vector and normal vector, with a worked example.",
  openGraph: {
    title: "Angle Between a Line and a Plane - Studyloaf",
    description: "How to find the angle between a line and a plane using their direction vector and normal vector, with a worked example.",
  },
};

export default function AngleBetweenLineAndPlanePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Angle Between a Line and a Plane",
        description: "How to find the angle between a line and a plane using their direction vector and normal vector, with a worked example.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Angle Between a Line and a Plane", href: "/resources/angle-between-line-and-plane" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Angle Between a Line and a Plane</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The formula</h2>
            <p className="blog-post-p">
              The angle <Katex>{"\\theta"}</Katex> between a line with direction vector{" "}
              <Katex>{"\\vec{b}"}</Katex> and a plane with normal vector <Katex>{"\\vec{n}"}</Katex>{" "}
              uses <Katex>{"\\sin"}</Katex>, not <Katex>{"\\cos"}</Katex> — because the angle is
              measured from the plane itself, which is perpendicular to <Katex>{"\\vec{n}"}</Katex>:
            </p>
            <Katex display>{"\\sin\\theta = \\dfrac{|\\vec{b}\\cdot\\vec{n}|}{|\\vec{b}||\\vec{n}|}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the angle between the line <Katex>{"\\dfrac{x+1}{2}=\\dfrac{y}{3}=\\dfrac{z-3}{6}"}</Katex>{" "}
              and the plane <Katex>{"10x+2y-11z=3"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The line&apos;s direction vector is{" "}
              <Katex>{"\\vec{b}=(2,3,6)"}</Katex>, and the plane&apos;s normal is{" "}
              <Katex>{"\\vec{n}=(10,2,-11)"}</Katex>.
            </p>
            <Katex display>{"\\vec{b}\\cdot\\vec{n} = 2(10)+3(2)+6(-11) = 20+6-66 = -40"}</Katex>
            <Katex display>{"|\\vec{b}| = \\sqrt{4+9+36}=7, \\qquad |\\vec{n}| = \\sqrt{100+4+121}=15"}</Katex>
            <Katex display>{"\\sin\\theta = \\dfrac{|-40|}{7 \\times 15} = \\dfrac{40}{105} = \\dfrac{8}{21} \\;\\Rightarrow\\; \\theta = \\sin^{-1}\\dfrac{8}{21}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              This uses the same direction vector that defines a line&apos;s equation in the first
              place.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/equation-of-a-line">Finding the Equation of a Line</Link></li>
              <li><Link href="/resources/equation-of-a-plane">Finding the Equation of a Plane</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
