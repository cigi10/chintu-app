import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Arithmetic Progressions - Studyloaf",
  description: "What makes a sequence an arithmetic progression, how to tell whether a real-world situation forms one, and finding three terms in AP from their sum and product, with worked examples.",
  openGraph: {
    title: "Arithmetic Progressions - Studyloaf",
    description: "What makes a sequence an arithmetic progression, how to tell whether a real-world situation forms one, and finding three terms in AP from their sum and product, with worked examples.",
  },
};

export default function ArithmeticProgressionsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Arithmetic Progressions",
        description: "What makes a sequence an arithmetic progression, how to tell whether a real-world situation forms one, and finding three terms in AP from their sum and product, with worked examples.",
        datePublished: "2026-09-17T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Arithmetic Progressions", href: "/resources/arithmetic-progressions" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Arithmetic Progressions</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What is an arithmetic progression?</h2>
            <p className="blog-post-p">
              An arithmetic progression (AP) is a list of numbers where the difference between any
              term and the one before it is always the same. That constant difference is called the
              common difference, <Katex>{"d"}</Katex>:
            </p>
            <Katex display>{"a,\\; a+d,\\; a+2d,\\; a+3d,\\; \\ldots"}</Katex>
            <p className="blog-post-p">
              A sequence only counts as an AP if <em>every</em> consecutive pair shares that same
              difference — not just the first pair.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: does a situation form an AP?</h2>
            <p className="blog-post-p">
              Which of these situations produce an arithmetic progression?
            </p>
            <ul className="blog-post-list">
              <li>The taxi fare after each km, when the fare is ₹20 for the first km and rises by ₹8 for each additional km.</li>
              <li>The amount of air left in a cylinder, when a vacuum pump removes <Katex>{"\\frac{1}{4}"}</Katex> of the air remaining at each step.</li>
              <li>The cost of digging a well, when it costs ₹150 for the first metre and rises by ₹50 for each subsequent metre.</li>
              <li>The amount in an account each year, when ₹10,000 is deposited at 8% per annum compound interest.</li>
            </ul>
            <p className="blog-post-p"><strong>Solution:</strong></p>
            <p className="blog-post-p">
              <strong>Taxi fare:</strong> ₹20, ₹28, ₹36, ₹44, … — each term is 8 more than the last.
              The difference is constant (<Katex>{"d = 8"}</Katex>), so this <strong>is</strong> an AP.
            </p>
            <p className="blog-post-p">
              <strong>Air in the cylinder:</strong> each step keeps <Katex>{"\\frac{3}{4}"}</Katex> of
              the previous amount, so the amounts shrink by a shared <em>ratio</em>, not a shared
              difference — the gaps between consecutive terms keep getting smaller. This{" "}
              <strong>is not</strong> an AP (it&apos;s a geometric progression instead).
            </p>
            <p className="blog-post-p">
              <strong>Well-digging cost:</strong> ₹150, ₹200, ₹250, ₹300, … — a constant difference
              of <Katex>{"d = 50"}</Katex>, so this <strong>is</strong> an AP.
            </p>
            <p className="blog-post-p">
              <strong>Compound interest:</strong> each year&apos;s amount is the previous amount times
              1.08, so it&apos;s growing by a shared ratio again, not a shared amount — the yearly
              increase itself keeps growing. This <strong>is not</strong> an AP.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: three numbers in AP, given sum and product</h2>
            <p className="blog-post-p">
              Find three numbers in AP whose sum is 15 and whose product is 80.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Instead of calling the three numbers{" "}
              <Katex>{"a, a+d, a+2d"}</Katex>, it&apos;s easier to center them around the middle
              term: <Katex>{"a-d, \\; a, \\; a+d"}</Katex>. Their sum collapses nicely:
            </p>
            <Katex display>{"(a-d) + a + (a+d) = 3a = 15 \\;\\Rightarrow\\; a = 5"}</Katex>
            <p className="blog-post-p">
              The product is a difference of squares, <Katex>{"(a-d)(a+d) = a^2-d^2"}</Katex>,
              times the middle term:
            </p>
            <Katex display>{"a(a^2-d^2) = 80 \\;\\Rightarrow\\; 5(25-d^2) = 80 \\;\\Rightarrow\\; 25-d^2 = 16 \\;\\Rightarrow\\; d^2=9 \\;\\Rightarrow\\; d=\\pm3"}</Katex>
            <p className="blog-post-p">
              Either sign gives the same three numbers, just in reverse order:{" "}
              <Katex>{"2, \\; 5, \\; 8"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Real Numbers and Arithmetic Progressions are both core Class 10 chapters built on
              spotting a pattern in how numbers are constructed.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/real-numbers-hcf-lcm">Real Numbers: HCF and LCM</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
