import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Pair of Linear Equations: Word Problems - Studyloaf",
  description: "Translating age and money word problems into a pair of linear equations and solving them, including a classic problem with two valid cases.",
  openGraph: {
    title: "Pair of Linear Equations: Word Problems - Studyloaf",
    description: "Translating age and money word problems into a pair of linear equations and solving them, including a classic problem with two valid cases.",
  },
};

export default function LinearEquationsWordProblemsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Pair of Linear Equations: Word Problems",
        description: "Translating age and money word problems into a pair of linear equations and solving them, including a classic problem with two valid cases.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Pair of Linear Equations: Word Problems", href: "/resources/pair-of-linear-equations-word-problems" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Pair of Linear Equations: Word Problems</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: an age problem with two cases</h2>
            <p className="blog-post-p">
              Ani and Biju&apos;s ages differ by 3 years. Ani&apos;s father Dharam is twice as old
              as Ani, and Biju is twice as old as his sister Cathy. Cathy and Dharam&apos;s ages
              differ by 30 years. Find Ani and Biju&apos;s ages.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let Ani&apos;s age be <Katex>{"x"}</Katex> and
              Biju&apos;s be <Katex>{"y"}</Katex>. &quot;Differ by 3 years&quot; doesn&apos;t say
              who&apos;s older, so there are genuinely two cases to check.
            </p>
            <p className="blog-post-p">
              <strong>Case 1: Ani is older.</strong> Then <Katex>{"x-y=3"}</Katex>. Dharam&apos;s
              age is <Katex>{"2x"}</Katex>, Cathy&apos;s is <Katex>{"\\tfrac{y}{2}"}</Katex>, and
              their ages differ by 30:
            </p>
            <Katex display>{"2x - \\dfrac{y}{2} = 30 \\;\\Rightarrow\\; 4x-y=60"}</Katex>
            <p className="blog-post-p">Subtracting <Katex>{"x-y=3"}</Katex> from this:</p>
            <Katex display>{"3x = 57 \\;\\Rightarrow\\; x=19, \\quad y = 19-3=16"}</Katex>
            <p className="blog-post-p">
              <strong>Case 2: Biju is older.</strong> Then <Katex>{"y-x=3"}</Katex>, and the same
              age-difference equation <Katex>{"4x-y=60"}</Katex> still holds. Adding the two
              equations this time:
            </p>
            <Katex display>{"3x = 63 \\;\\Rightarrow\\; x=21, \\quad y=21+3=24"}</Katex>
            <p className="blog-post-p">
              Both <Katex>{"(19,16)"}</Katex> and <Katex>{"(21,24)"}</Katex> are valid — the
              problem&apos;s wording alone doesn&apos;t rule either out.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a classic money problem</h2>
            <p className="blog-post-p">
              Two friends have some money each. The first says: &quot;Give me ₹100 and I&apos;ll
              have twice what you have left.&quot; The second says: &quot;Give me ₹10 instead and
              I&apos;ll have six times what you have left.&quot; Find how much each friend has.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let the first friend have <Katex>{"\\text{₹}x"}</Katex> and
              the second have <Katex>{"\\text{₹}y"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>First condition</strong> (second friend gives ₹100 to the first):
            </p>
            <Katex display>{"x+100 = 2(y-100) \\;\\Rightarrow\\; x-2y=-300"}</Katex>
            <p className="blog-post-p">
              <strong>Second condition</strong> (first friend gives ₹10 to the second):
            </p>
            <Katex display>{"y+10 = 6(x-10) \\;\\Rightarrow\\; 6x-y=70"}</Katex>
            <p className="blog-post-p">Multiplying the second equation by 2 and subtracting the first:</p>
            <Katex display>{"12x-2y=140, \\qquad (12x-2y)-(x-2y) = 140-(-300) \\;\\Rightarrow\\; 11x=440 \\;\\Rightarrow\\; x=40"}</Katex>
            <p className="blog-post-p">
              Substituting back: <Katex>{"40-2y=-300 \\;\\Rightarrow\\; y=170"}</Katex>. Checking
              the first condition: <Katex>{"40+100=140"}</Katex> and{" "}
              <Katex>{"2(170-100)=140"}</Katex> — matches.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Once a word problem gives you a pair of equations, any of the methods covered
              separately — graphing, substitution, elimination, or cross-multiplication — solves it
              from there.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/pair-of-linear-equations-substitution-and-elimination">Pair of Linear Equations: Substitution and Elimination Methods</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
