import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Grade 7 Math Olympiad Problems - Studyloaf",
  description: "Five worked Math Olympiad-style problems for grade 7: a Fibonacci-like sequence, an exponent equation, percentages with overlap, consecutive integers, and clock arithmetic.",
  openGraph: {
    title: "Grade 7 Math Olympiad Problems - Studyloaf",
    description: "Five worked Math Olympiad-style problems for grade 7: a Fibonacci-like sequence, an exponent equation, percentages with overlap, consecutive integers, and clock arithmetic.",
  },
};

export default function MathOlympiadGrade7Page() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Grade 7 Math Olympiad Problems",
        description: "Five worked Math Olympiad-style problems for grade 7: a Fibonacci-like sequence, an exponent equation, percentages with overlap, consecutive integers, and clock arithmetic.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Grade 7 Math Olympiad Problems", href: "/resources/math-olympiad-grade-7" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Grade 7 Math Olympiad Problems</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Problem 1: a sequence built from its own past terms</h2>
            <p className="blog-post-p">
              A sequence starts <Katex>{"3, 5"}</Katex>, and every term after that is the sum of
              the previous two. Find the 8th term.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Just build it term by term:
            </p>
            <Katex display>{"3,\\; 5,\\; 8,\\; 13,\\; 21,\\; 34,\\; 55,\\; 89"}</Katex>
            <p className="blog-post-p">
              Each term is the sum of the two before it (e.g. <Katex>{"21+34=55"}</Katex>), so the
              8th term is <strong>89</strong>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Problem 2: matching bases in disguise</h2>
            <p className="blog-post-p">
              If <Katex>{"2^n \\times 3^n = 216"}</Katex>, find <Katex>{"n"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Combine the two powers first, since they share an
              exponent:
            </p>
            <Katex display>{"2^n \\times 3^n = (2\\times3)^n = 6^n"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"6^n = 216 = 6^3"}</Katex>, giving <Katex>{"n=3"}</Katex>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Problem 3: two overlapping groups</h2>
            <p className="blog-post-p">
              In a class, 60% of students play basketball, 50% play soccer, and 30% play both.
              What percentage play neither?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Add the two sports, then subtract the overlap once so it
              isn&apos;t double-counted:
            </p>
            <Katex display>{"\\text{Play at least one} = 60\\% + 50\\% - 30\\% = 80\\%"}</Katex>
            <p className="blog-post-p">
              So <Katex>{"100\\% - 80\\% = 20\\%"}</Katex> play neither sport.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Problem 4: three consecutive integers</h2>
            <p className="blog-post-p">
              Three consecutive integers add up to 333. Find the largest one.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Call the smallest <Katex>{"n"}</Katex>, so the three are{" "}
              <Katex>{"n, n+1, n+2"}</Katex>:
            </p>
            <Katex display>{"n + (n+1) + (n+2) = 333 \\;\\Rightarrow\\; 3n+3=333 \\;\\Rightarrow\\; n=110"}</Katex>
            <p className="blog-post-p">
              The three integers are 110, 111, 112 — the largest is <strong>112</strong>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Problem 5: a clock that wraps around</h2>
            <p className="blog-post-p">
              A 12-hour clock shows 3:00. What will it show 100 hours later?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Only the <em>remainder</em> after dividing by 12 matters,
              since every full 12 hours brings the clock back to the same position:
            </p>
            <Katex display>{"100 = 8 \\times 12 + 4 \\quad \\Rightarrow \\quad \\text{remainder } 4"}</Katex>
            <p className="blog-post-p">
              Adding just the remaining 4 hours to 3:00 gives <strong>7:00</strong>.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
