import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Composition of Functions (gof and fog) - Studyloaf",
  description: "How to compute the composition of two functions in either order, with a worked example showing gof and fog can come out different.",
  openGraph: {
    title: "Composition of Functions (gof and fog) - Studyloaf",
    description: "How to compute the composition of two functions in either order, with a worked example showing gof and fog can come out different.",
  },
};

export default function CompositionOfFunctionsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Composition of Functions (gof and fog)",
        description: "How to compute the composition of two functions in either order, with a worked example showing gof and fog can come out different.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Composition of Functions (gof and fog)", href: "/resources/composition-of-functions" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Composition of Functions (gof and fog)</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Reading the notation</h2>
            <p className="blog-post-p">
              <Katex>{"gof"}</Katex> means &quot;first apply <Katex>{"f"}</Katex>, then apply{" "}
              <Katex>{"g"}</Katex> to the result&quot; — read right to left:{" "}
              <Katex>{"(g \\circ f)(x) = g(f(x))"}</Katex>. Likewise{" "}
              <Katex>{"fog(x) = f(g(x))"}</Katex>. There&apos;s no reason these have to match.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              <Katex>{"f,g: \\mathbb{R} \\to \\mathbb{R}"}</Katex> are given by{" "}
              <Katex>{"g(x) = x^{1/3}"}</Katex> and <Katex>{"f(x) = 8x^3"}</Katex>. Find{" "}
              <Katex>{"gof"}</Katex> and <Katex>{"fog"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution — gof:</strong> substitute <Katex>{"f(x)"}</Katex> into{" "}
              <Katex>{"g"}</Katex>:
            </p>
            <Katex display>{"gof(x) = g(8x^3) = (8x^3)^{1/3} = 8^{1/3} \\cdot x = 2x"}</Katex>
            <p className="blog-post-p">
              <strong>fog:</strong> substitute <Katex>{"g(x)"}</Katex> into <Katex>{"f"}</Katex>:
            </p>
            <Katex display>{"fog(x) = f(x^{1/3}) = 8(x^{1/3})^3 = 8x"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"gof(x) = 2x"}</Katex> but <Katex>{"fog(x) = 8x"}</Katex> — a clean
              reminder that composition order matters.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Composition is exactly how you&apos;d verify that a candidate inverse function
              actually undoes the original — check that both compositions give back <Katex>{"x"}</Katex>.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/types-of-functions">Types of Functions</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
