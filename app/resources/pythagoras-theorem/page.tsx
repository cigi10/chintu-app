import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Pythagoras Theorem - Studyloaf",
  description: "The Pythagorean theorem explained, with a worked real-world distance example.",
  openGraph: {
    title: "Pythagoras Theorem - Studyloaf",
    description: "The Pythagorean theorem explained, with a worked real-world distance example.",
  },
};

export default function PythagorasTheoremPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Pythagoras Theorem",
        description: "The Pythagorean theorem explained, with a worked real-world distance example.",
        datePublished: "2026-09-16",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Pythagoras Theorem", href: "/resources/pythagoras-theorem" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Pythagoras Theorem</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The theorem</h2>
            <p className="blog-post-p">
              In a right triangle, the square of the length of the hypotenuse (the side opposite the
              right angle) equals the sum of the squares of the other two sides:
            </p>
            <Katex display>{"a^2 + b^2 = c^2"}</Katex>
            <p className="blog-post-p">
              where <Katex>{"c"}</Katex> is the hypotenuse and <Katex>{"a"}</Katex>,{" "}
              <Katex>{"b"}</Katex> are the two shorter sides.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              In a rectangular park that is 60 meters by 91 meters, a dog began in the northwest
              corner and ran south along the length of the park. Then the dog ran east along the
              width to the southeast corner. Finally, the dog ran back to the northwest corner. How
              far did the dog run in total?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The first two legs of the run are the two sides of the
              rectangle, 60 m and 91 m. The final leg, straight back to the start, is the diagonal of
              the rectangle, the hypotenuse of a right triangle with legs 60 and 91:
            </p>
            <Katex display>{"c = \\sqrt{60^2 + 91^2} = \\sqrt{3600 + 8281} = \\sqrt{11881} = 109 \\text{ m}"}</Katex>
            <p className="blog-post-p">
              Total distance run: <Katex>{"60 + 91 + 109 = 260"}</Katex> meters.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The Pythagorean theorem is the foundation trigonometry is built on: every sine, cosine,
              and tangent ratio comes from the same right-triangle relationship.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/trigonometry">Trigonometry Basics</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
