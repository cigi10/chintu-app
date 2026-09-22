import Navbar from "@/components/Navbar";
import Link from "next/link";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Types of Relations - Studyloaf",
  description: "Reflexive, symmetric, transitive, and equivalence relations defined and checked against worked examples.",
  openGraph: {
    title: "Types of Relations - Studyloaf",
    description: "Reflexive, symmetric, transitive, and equivalence relations defined and checked against worked examples.",
  },
};

export default function TypesOfRelationsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Types of Relations",
        description: "Reflexive, symmetric, transitive, and equivalence relations defined and checked against worked examples.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Types of Relations", href: "/resources/types-of-relations" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Types of Relations</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The four definitions</h2>
            <p className="blog-post-p">
              A relation <Katex>{"R"}</Katex> on a set <Katex>{"A"}</Katex> is a collection of
              ordered pairs from <Katex>{"A"}</Katex>. It is:
            </p>
            <ul className="blog-post-list">
              <li><strong>Reflexive</strong> if <Katex>{"(a,a) \\in R"}</Katex> for every <Katex>{"a \\in A"}</Katex>.</li>
              <li><strong>Symmetric</strong> if <Katex>{"(a,b) \\in R"}</Katex> always forces <Katex>{"(b,a) \\in R"}</Katex> too.</li>
              <li><strong>Transitive</strong> if <Katex>{"(a,b) \\in R"}</Katex> and <Katex>{"(b,c) \\in R"}</Katex> together force <Katex>{"(a,c) \\in R"}</Katex>.</li>
              <li>An <strong>equivalence relation</strong> if it&apos;s all three at once — reflexive, symmetric, and transitive.</li>
            </ul>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: reflexive and transitive, but not symmetric</h2>
            <p className="blog-post-p">
              Show that the relation <Katex>{"R = \\{(a,b) : a \\le b\\}"}</Katex> on the real
              numbers is reflexive and transitive, but not symmetric.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"a \\le a"}</Katex> is always true, so{" "}
              <Katex>{"R"}</Katex> is reflexive. If <Katex>{"a \\le b"}</Katex> and{" "}
              <Katex>{"b \\le c"}</Katex>, then <Katex>{"a \\le c"}</Katex> — so it&apos;s transitive
              too. But <Katex>{"a \\le b"}</Katex> doesn&apos;t force <Katex>{"b \\le a"}</Katex>{" "}
              (e.g. <Katex>{"1 \\le 2"}</Katex>, but <Katex>{"2 \\le 1"}</Katex> is false) — so{" "}
              <Katex>{"R"}</Katex> is not symmetric, and therefore not an equivalence relation.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: checking symmetry directly</h2>
            <p className="blog-post-p">
              Is <Katex>{"R = \\{(a,b) : a-b \\text{ is divisible by } 5\\}"}</Katex> symmetric on{" "}
              <Katex>{"\\mathbb{Z}"}</Katex>?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> If <Katex>{"5"}</Katex> divides <Katex>{"a-b"}</Katex>,
              then it also divides <Katex>{"b-a = -(a-b)"}</Katex> (a divisor of a number always
              divides its negative). So <Katex>{"R"}</Katex> is symmetric.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: fixing a relation to make it symmetric</h2>
            <p className="blog-post-p">
              On <Katex>{"A=\\{a,b,c\\}"}</Katex>, let{" "}
              <Katex>{"R = \\{(a,a),(a,b),(a,c),(b,c),(c,a)\\}"}</Katex>. Which pairs need to be
              added to make <Katex>{"R"}</Katex> symmetric?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Check each pair for its reverse: <Katex>{"(a,a)"}</Katex>{" "}
              is its own reverse, fine. <Katex>{"(a,b)"}</Katex> needs <Katex>{"(b,a)"}</Katex> —
              missing. <Katex>{"(a,c)"}</Katex> needs <Katex>{"(c,a)"}</Katex> — already there.{" "}
              <Katex>{"(b,c)"}</Katex> needs <Katex>{"(c,b)"}</Katex> — missing.{" "}
              <Katex>{"(c,a)"}</Katex> needs <Katex>{"(a,c)"}</Katex> — already there. So{" "}
              <Katex>{"(b,a)"}</Katex> and <Katex>{"(c,b)"}</Katex> are exactly what&apos;s missing.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Relations and functions are covered together in the same NCERT chapter — a function
              is really just a special kind of relation.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/types-of-functions">Types of Functions</Link></li>
              <li><Link href="/resources/binary-operation">Binary Operation</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
