import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Shortest Distance Between Two Lines - Studyloaf",
  description: "The formula for the shortest distance between two skew lines in vector form, with two fully worked examples.",
  openGraph: {
    title: "Shortest Distance Between Two Lines - Studyloaf",
    description: "The formula for the shortest distance between two skew lines in vector form, with two fully worked examples.",
  },
};

export default function ShortestDistanceBetweenLinesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Shortest Distance Between Two Lines",
        description: "The formula for the shortest distance between two skew lines in vector form, with two fully worked examples.",
        datePublished: "2026-09-18",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Shortest Distance Between Two Lines", href: "/resources/shortest-distance-between-lines" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Shortest Distance Between Two Lines</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The formula</h2>
            <p className="blog-post-p">
              For two lines <Katex>{"\\vec{r}=\\vec{a_1}+\\lambda\\vec{b_1}"}</Katex> and{" "}
              <Katex>{"\\vec{r}=\\vec{a_2}+\\mu\\vec{b_2}"}</Katex> that don&apos;t intersect, the
              shortest distance between them is:
            </p>
            <Katex display>{"d = \\dfrac{\\left|(\\vec{a_2}-\\vec{a_1})\\cdot(\\vec{b_1}\\times\\vec{b_2})\\right|}{|\\vec{b_1}\\times\\vec{b_2}|}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the shortest distance between{" "}
              <Katex>{"\\vec{r}=\\hat{i}+\\hat{j}+\\lambda(2\\hat{i}-\\hat{j}+\\hat{k})"}</Katex>{" "}
              and <Katex>{"\\vec{r}=2\\hat{i}+\\hat{j}-\\hat{k}+\\mu(3\\hat{i}-5\\hat{j}+2\\hat{k})"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Here <Katex>{"\\vec{a_2}-\\vec{a_1} = \\hat{i}-\\hat{k}"}</Katex>,{" "}
              <Katex>{"\\vec{b_1}=(2,-1,1)"}</Katex>, <Katex>{"\\vec{b_2}=(3,-5,2)"}</Katex>.
            </p>
            <Katex display>{"\\vec{b_1}\\times\\vec{b_2} = (3,-1,-7), \\qquad |\\vec{b_1}\\times\\vec{b_2}| = \\sqrt{9+1+49}=\\sqrt{59}"}</Katex>
            <Katex display>{"(\\vec{a_2}-\\vec{a_1})\\cdot(\\vec{b_1}\\times\\vec{b_2}) = (1)(3)+(0)(-1)+(-1)(-7) = 10"}</Katex>
            <Katex display>{"d = \\dfrac{10}{\\sqrt{59}}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">A second worked example</h2>
            <p className="blog-post-p">
              Find the shortest distance between{" "}
              <Katex>{"\\vec{r}=\\hat{i}+2\\hat{j}+\\hat{k}+\\lambda(\\hat{i}-\\hat{j}+\\hat{k})"}</Katex>{" "}
              and <Katex>{"\\vec{r}=2\\hat{i}-\\hat{j}-\\hat{k}+\\mu(2\\hat{i}+\\hat{j}+2\\hat{k})"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"\\vec{a_2}-\\vec{a_1} = \\hat{i}-3\\hat{j}-2\\hat{k}"}</Katex>,{" "}
              <Katex>{"\\vec{b_1}=(1,-1,1)"}</Katex>, <Katex>{"\\vec{b_2}=(2,1,2)"}</Katex>.
            </p>
            <Katex display>{"\\vec{b_1}\\times\\vec{b_2} = (-3,0,3), \\qquad |\\vec{b_1}\\times\\vec{b_2}| = \\sqrt{9+0+9}=3\\sqrt2"}</Katex>
            <Katex display>{"(\\vec{a_2}-\\vec{a_1})\\cdot(\\vec{b_1}\\times\\vec{b_2}) = (1)(-3)+(-3)(0)+(-2)(3) = -9"}</Katex>
            <Katex display>{"d = \\dfrac{9}{3\\sqrt2} = \\dfrac{3}{\\sqrt2}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Both examples here start from the vector form of a line&apos;s equation covered
              separately.
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
