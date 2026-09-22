import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Linear Programming - Studyloaf",
  description: "Feasible regions, corner points, and finding the condition on an objective function's coefficients for it to be maximized at two corners at once.",
  openGraph: {
    title: "Linear Programming - Studyloaf",
    description: "Feasible regions, corner points, and finding the condition on an objective function's coefficients for it to be maximized at two corners at once.",
  },
};

export default function LinearProgrammingPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Linear Programming",
        description: "Feasible regions, corner points, and finding the condition on an objective function's coefficients for it to be maximized at two corners at once.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Linear Programming", href: "/resources/linear-programming" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Linear Programming</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The key fact</h2>
            <p className="blog-post-p">
              In a linear programming problem, the <strong>feasible region</strong> is the set of
              points satisfying every constraint at once, and a <strong>feasible solution</strong>{" "}
              is any point in it. The objective function <Katex>{"Z=ax+by"}</Katex> being linear
              means it can only reach its maximum or minimum at a{" "}
              <strong>corner point</strong> of that region — never somewhere in the interior.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a tie between two corners</h2>
            <p className="blog-post-p">
              The feasible region for <Katex>{"2x+y \\le 10"}</Katex>,{" "}
              <Katex>{"x+3y \\le 15"}</Katex>, <Katex>{"x,y \\ge 0"}</Katex> has corners{" "}
              <Katex>{"(0,0)"}</Katex>, <Katex>{"(5,0)"}</Katex>, <Katex>{"(3,4)"}</Katex>, and{" "}
              <Katex>{"(0,5)"}</Katex>. For <Katex>{"Z=ax+by"}</Katex> with{" "}
              <Katex>{"a,b>0"}</Katex>, what condition on <Katex>{"a"}</Katex> and{" "}
              <Katex>{"b"}</Katex> makes the maximum occur at <strong>both</strong>{" "}
              <Katex>{"(3,4)"}</Katex> and <Katex>{"(0,5)"}</Katex>?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The maximum can only be shared by two corners if{" "}
              <Katex>{"Z"}</Katex> takes the <em>same</em> value at both — otherwise one would beat
              the other. Set them equal:
            </p>
            <Katex display>{"Z(3,4) = 3a+4b, \\qquad Z(0,5) = 5b"}</Katex>
            <Katex display>{"3a+4b = 5b \\;\\Rightarrow\\; 3a = b \\;\\Rightarrow\\; b = 3a"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
