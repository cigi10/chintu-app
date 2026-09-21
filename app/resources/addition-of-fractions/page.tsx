import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Addition of Fractions - Studyloaf",
  description: "Practice questions on adding fractions and mixed numbers, with worked solutions.",
  openGraph: {
    title: "Addition of Fractions - Studyloaf",
    description: "Practice questions on adding fractions and mixed numbers, with worked solutions.",
  },
};

export default function AdditionOfFractionsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Addition of Fractions",
        description: "Practice questions on adding fractions and mixed numbers, with worked solutions.",
        datePublished: "2026-09-16",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Addition of Fractions", href: "/resources/addition-of-fractions" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Addition of Fractions</h1>

          <div className="blog-post-section">
            <p className="blog-post-p">
              To add two fractions, first give them a common denominator, then add the numerators.
              For mixed numbers, convert to an improper fraction first (or add the whole-number parts
              and fractional parts separately). Here are a few worked practice questions.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">1. Painting a wall together</h2>
            <p className="blog-post-p">
              Shubham painted <Katex>{"\\dfrac{2}{3}"}</Katex> of the wall space in his room. His
              sister Madhavi helped and painted <Katex>{"\\dfrac{1}{3}"}</Katex> of the wall space.
              How much did they paint together?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"\\dfrac{2}{3} + \\dfrac{1}{3} = \\dfrac{3}{3} = 1"}</Katex>.
              Together they painted the whole wall.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">2. Sharing cake</h2>
            <p className="blog-post-p">
              Naina was given <Katex>{"1\\dfrac{1}{2}"}</Katex> pieces of cake and Najma was given{" "}
              <Katex>{"1\\dfrac{1}{3}"}</Katex> pieces of cake. Find the total amount of cake given to
              both of them.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Convert to improper fractions:{" "}
              <Katex>{"1\\dfrac{1}{2} = \\dfrac{3}{2}"}</Katex> and{" "}
              <Katex>{"1\\dfrac{1}{3} = \\dfrac{4}{3}"}</Katex>. With a common denominator of 6:{" "}
              <Katex>{"\\dfrac{3}{2} = \\dfrac{9}{6}"}</Katex> and{" "}
              <Katex>{"\\dfrac{4}{3} = \\dfrac{8}{6}"}</Katex>, so{" "}
              <Katex>{"\\dfrac{9}{6} + \\dfrac{8}{6} = \\dfrac{17}{6} = 2\\dfrac{5}{6}"}</Katex>{" "}
              pieces of cake in total.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">3. Buying ribbon</h2>
            <p className="blog-post-p">
              Sarita bought <Katex>{"\\dfrac{2}{5}"}</Katex> meter of ribbon and Lalita bought{" "}
              <Katex>{"\\dfrac{3}{4}"}</Katex> meter of ribbon. What is the total length of ribbon
              they bought?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> With a common denominator of 20:{" "}
              <Katex>{"\\dfrac{2}{5} = \\dfrac{8}{20}"}</Katex> and{" "}
              <Katex>{"\\dfrac{3}{4} = \\dfrac{15}{20}"}</Katex>, so{" "}
              <Katex>{"\\dfrac{8}{20} + \\dfrac{15}{20} = \\dfrac{23}{20} = 1\\dfrac{3}{20}"}</Katex>{" "}
              meters of ribbon.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">4. Find the missing number</h2>
            <p className="blog-post-p">
              <Katex>{"? - \\dfrac{5}{8} = \\dfrac{1}{4}"}</Katex>
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Rearranging,{" "}
              <Katex>{"? = \\dfrac{1}{4} + \\dfrac{5}{8} = \\dfrac{2}{8} + \\dfrac{5}{8} = \\dfrac{7}{8}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">5. Find the missing number</h2>
            <p className="blog-post-p">
              <Katex>{"? - \\dfrac{1}{5} = \\dfrac{1}{2}"}</Katex>
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Rearranging,{" "}
              <Katex>{"? = \\dfrac{1}{2} + \\dfrac{1}{5} = \\dfrac{5}{10} + \\dfrac{2}{10} = \\dfrac{7}{10}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              A percentage is just a fraction out of 100, so the same adding-fractions skills carry
              straight over once you get to percentages.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/percentage">Percentage</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
