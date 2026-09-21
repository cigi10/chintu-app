import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Ratio - Studyloaf",
  description: "What a ratio is and how to simplify one to its lowest terms, with a worked real-world example.",
  openGraph: {
    title: "Ratio - Studyloaf",
    description: "What a ratio is and how to simplify one to its lowest terms, with a worked real-world example.",
  },
};

export default function RatioPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Ratio",
        description: "What a ratio is and how to simplify one to its lowest terms, with a worked real-world example.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Ratio", href: "/resources/ratio" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Ratio</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What is a ratio?</h2>
            <p className="blog-post-p">
              A ratio compares two quantities of the same kind, showing how many times one contains
              the other. The ratio of <Katex>{"a"}</Katex> to <Katex>{"b"}</Katex> is written{" "}
              <Katex>{"a : b"}</Katex>, and it&apos;s simplified the same way a fraction is: by
              dividing both sides by their HCF.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              The length and breadth of a rectangular park are 75 m and 60 m respectively. What is
              the ratio of the length to the breadth?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The ratio is <Katex>{"75 : 60"}</Katex>. The HCF of 75 and 60
              is 15, so dividing both sides by 15:
            </p>
            <Katex display>{"75 : 60 = 5 : 4"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Ratio and proportion are the same NCERT chapter — proportion is simply two ratios set
              equal to each other.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/proportion">Proportion</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
