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
  alternates: { canonical: "/resources/addition-of-fractions" },
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
          { label: "Math: Arithmetic and Number", href: "/resources/math-arithmetic-number" },
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
              Arjun painted <Katex>{"\\dfrac{3}{8}"}</Katex> of a classroom wall in the morning, and
              his friend Meera painted another <Katex>{"\\dfrac{1}{4}"}</Katex> of it in the afternoon.
              How much of the wall did they paint together?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> With a common denominator of 8,{" "}
              <Katex>{"\\dfrac{1}{4} = \\dfrac{2}{8}"}</Katex>, so{" "}
              <Katex>{"\\dfrac{3}{8} + \\dfrac{2}{8} = \\dfrac{5}{8}"}</Katex>. Together they painted
              five-eighths of the wall, leaving <Katex>{"\\dfrac{3}{8}"}</Katex> still to do.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">2. Sharing cake</h2>
            <p className="blog-post-p">
              At a party, Kabir ate <Katex>{"2\\dfrac{1}{4}"}</Katex> slices of cake and Riya ate{" "}
              <Katex>{"1\\dfrac{2}{3}"}</Katex> slices. How much cake did the two of them eat
              altogether?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Convert to improper fractions:{" "}
              <Katex>{"2\\dfrac{1}{4} = \\dfrac{9}{4}"}</Katex> and{" "}
              <Katex>{"1\\dfrac{2}{3} = \\dfrac{5}{3}"}</Katex>. With a common denominator of 12:{" "}
              <Katex>{"\\dfrac{9}{4} = \\dfrac{27}{12}"}</Katex> and{" "}
              <Katex>{"\\dfrac{5}{3} = \\dfrac{20}{12}"}</Katex>, so{" "}
              <Katex>{"\\dfrac{27}{12} + \\dfrac{20}{12} = \\dfrac{47}{12} = 3\\dfrac{11}{12}"}</Katex>{" "}
              slices of cake in total.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">3. Buying ribbon</h2>
            <p className="blog-post-p">
              For a craft project, Tara bought <Katex>{"\\dfrac{3}{10}"}</Katex> meter of red ribbon
              and <Katex>{"\\dfrac{5}{6}"}</Katex> meter of blue ribbon. What is the total length of
              ribbon she bought?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The LCM of 10 and 6 is 30:{" "}
              <Katex>{"\\dfrac{3}{10} = \\dfrac{9}{30}"}</Katex> and{" "}
              <Katex>{"\\dfrac{5}{6} = \\dfrac{25}{30}"}</Katex>, so{" "}
              <Katex>{"\\dfrac{9}{30} + \\dfrac{25}{30} = \\dfrac{34}{30} = \\dfrac{17}{15} = 1\\dfrac{2}{15}"}</Katex>{" "}
              meters of ribbon.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">4. Find the missing number</h2>
            <p className="blog-post-p">
              <Katex>{"? - \\dfrac{3}{10} = \\dfrac{2}{5}"}</Katex>
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Rearranging,{" "}
              <Katex>{"? = \\dfrac{2}{5} + \\dfrac{3}{10} = \\dfrac{4}{10} + \\dfrac{3}{10} = \\dfrac{7}{10}"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">5. Find the missing number</h2>
            <p className="blog-post-p">
              <Katex>{"? - \\dfrac{1}{6} = \\dfrac{3}{4}"}</Katex>
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Rearranging,{" "}
              <Katex>{"? = \\dfrac{3}{4} + \\dfrac{1}{6} = \\dfrac{9}{12} + \\dfrac{2}{12} = \\dfrac{11}{12}"}</Katex>.
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
