import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Operations on Sets - Studyloaf",
  description: "Union, intersection, and the inclusion-exclusion principle for counting overlapping groups, with a worked example.",
  openGraph: {
    title: "Operations on Sets - Studyloaf",
    description: "Union, intersection, and the inclusion-exclusion principle for counting overlapping groups, with a worked example.",
  },
};

export default function OperationsOnSetsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Operations on Sets",
        description: "Union, intersection, and the inclusion-exclusion principle for counting overlapping groups, with a worked example.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Operations on Sets", href: "/resources/operations-on-sets" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Operations on Sets</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Counting two overlapping groups</h2>
            <p className="blog-post-p">
              When two groups <Katex>{"A"}</Katex> and <Katex>{"B"}</Katex> overlap, simply adding
              their sizes double-counts whoever is in both. The <strong>inclusion-exclusion
              principle</strong> corrects for that:
            </p>
            <Katex display>{"|A \\cup B| = |A| + |B| - |A \\cap B|"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              In a class of 60 students, 25 play cricket and 20 play tennis, and 10 play both. How
              many play neither?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> First find how many play at least one sport:
            </p>
            <Katex display>{"|\\text{cricket} \\cup \\text{tennis}| = 25 + 20 - 10 = 35"}</Katex>
            <p className="blog-post-p">
              Out of 60 students total, the rest play neither:
            </p>
            <Katex display>{"60 - 35 = 25"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
