import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Finding the Equation of a Plane - Studyloaf",
  description: "The equation of a coordinate plane, and finding a plane through the intersection of two others and a given point, with a worked example.",
  openGraph: {
    title: "Finding the Equation of a Plane - Studyloaf",
    description: "The equation of a coordinate plane, and finding a plane through the intersection of two others and a given point, with a worked example.",
  },
};

export default function EquationOfAPlanePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Finding the Equation of a Plane",
        description: "The equation of a coordinate plane, and finding a plane through the intersection of two others and a given point, with a worked example.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Finding the Equation of a Plane", href: "/resources/equation-of-a-plane" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Finding the Equation of a Plane</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The coordinate planes</h2>
            <p className="blog-post-p">
              The <Katex>{"xy"}</Katex>-plane is every point where the height above it is zero, so
              its equation is simply <Katex>{"z=0"}</Katex>. Likewise the{" "}
              <Katex>{"yz"}</Katex>-plane is <Katex>{"x=0"}</Katex> and the{" "}
              <Katex>{"xz"}</Katex>-plane is <Katex>{"y=0"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a plane through an intersection</h2>
            <p className="blog-post-p">
              Find the vector equation of the plane through the intersection of{" "}
              <Katex>{"3x-y+2z-4=0"}</Katex> and <Katex>{"x+y+z-3=0"}</Katex>, passing through the
              point <Katex>{"(2,2,1)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Any plane through that intersection has the form{" "}
              <Katex>{"(3x-y+2z-4) + \\lambda(x+y+z-3) = 0"}</Katex> for some constant{" "}
              <Katex>{"\\lambda"}</Katex>. Plugging in <Katex>{"(2,2,1)"}</Katex> pins down{" "}
              <Katex>{"\\lambda"}</Katex>:
            </p>
            <Katex display>{"(6-2+2-4) + \\lambda(2+2+1-3) = 0 \\;\\Rightarrow\\; 2 + 2\\lambda = 0 \\;\\Rightarrow\\; \\lambda = -1"}</Katex>
            <p className="blog-post-p">Substituting back in:</p>
            <Katex display>{"(3x-y+2z-4) - (x+y+z-3) = 0 \\;\\Rightarrow\\; 2x-2y+z-1 = 0"}</Katex>
            <p className="blog-post-p">In vector form, this is:</p>
            <Katex display>{"\\vec{r}\\cdot(2\\hat{i}-2\\hat{j}+\\hat{k}) = 1"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Once a plane has an equation, finding where it crosses each axis is a natural next
              question.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/intercepts-of-a-plane">Finding the Intercepts of a Plane</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
