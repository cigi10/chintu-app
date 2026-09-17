import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Percentage - Studyloaf",
  description: "What percentage means, how to compute a combined percentage across subjects, with a worked example.",
  openGraph: {
    title: "Percentage - Studyloaf",
    description: "What percentage means, how to compute a combined percentage across subjects, with a worked example.",
  },
};

export default function PercentagePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Percentage",
        description: "What percentage means, how to compute a combined percentage across subjects, with a worked example.",
        datePublished: "2026-09-16",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Percentage" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Percentage</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What is a percentage?</h2>
            <p className="blog-post-p">
              A percentage is a way of expressing a number as a fraction of 100. To turn a score of{" "}
              <Katex>{"a"}</Katex> out of <Katex>{"b"}</Katex> into a percentage, compute{" "}
              <Katex display>{"\\dfrac{a}{b} \\times 100"}</Katex>
              When combining scores from more than one test, add up all the marks scored and all the
              marks available first, and only then convert the totals to a percentage. Converting
              each test to a percentage and averaging those percentages gives a different (and
              usually wrong) answer whenever the tests are out of different totals.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              A girl scored 60 out of 75 in English, 60 out of 90 in Mathematics, and 80 out of 100 in
              Science. Find her combined score as a percentage across all three subjects.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Add up the marks scored: <Katex>{"60 + 60 + 80 = 200"}</Katex>.
              Add up the marks available: <Katex>{"75 + 90 + 100 = 265"}</Katex>. The combined
              percentage is
            </p>
            <Katex display>{"\\dfrac{200}{265} \\times 100 \\approx 75.47\\%"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              A percentage is just a fraction out of 100, so it helps to be solid on fraction addition
              first. Once the basics click, these shortcuts speed up percentage calculations in an
              exam.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/addition-of-fractions">Addition of Fractions</Link></li>
              <li><Link href="/resources/percentage-shortcuts">Percentage Shortcuts</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
