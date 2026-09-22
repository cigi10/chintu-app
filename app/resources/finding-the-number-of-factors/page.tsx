import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Finding the Number of Factors of a Number - Studyloaf",
  description: "The formula for counting how many divisors a number has from its prime factorization, with worked examples.",
  openGraph: {
    title: "Finding the Number of Factors of a Number - Studyloaf",
    description: "The formula for counting how many divisors a number has from its prime factorization, with worked examples.",
  },
};

export default function FindingTheNumberOfFactorsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Finding the Number of Factors of a Number",
        description: "The formula for counting how many divisors a number has from its prime factorization, with worked examples.",
        datePublished: "2026-09-22T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Finding the Number of Factors of a Number", href: "/resources/finding-the-number-of-factors" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Finding the Number of Factors of a Number</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The formula</h2>
            <p className="blog-post-p">
              Write a number as a product of prime powers,{" "}
              <Katex>{"N = p_1^{a_1} p_2^{a_2} \\cdots p_k^{a_k}"}</Katex>. Every factor of{" "}
              <Katex>{"N"}</Katex> is built by independently choosing an exponent from{" "}
              <Katex>{"0"}</Katex> to <Katex>{"a_i"}</Katex> for each prime — so the total count of
              factors (including 1 and <Katex>{"N"}</Katex> itself) is:
            </p>
            <Katex display>{"(a_1+1)(a_2+1)\\cdots(a_k+1)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              How many divisors does <Katex>{"9600"}</Katex> have, including 1 and 9600 itself?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Prime factorize first:
            </p>
            <Katex display>{"9600 = 2^7 \\times 3^1 \\times 5^2"}</Katex>
            <p className="blog-post-p">Add 1 to each exponent and multiply:</p>
            <Katex display>{"(7+1)(1+1)(2+1) = 8 \\times 2 \\times 3 = 48"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: already factored</h2>
            <p className="blog-post-p">
              How many positive divisors does <Katex>{"2^5 \\cdot 3^6 \\cdot 7^3"}</Katex> have?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The prime factorization is already given, so apply the
              formula directly:
            </p>
            <Katex display>{"(5+1)(6+1)(3+1) = 6 \\times 7 \\times 4 = 168"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              This same counting-by-independent-choices idea is exactly how permutations and
              combinations count arrangements more generally.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/permutations-and-combinations">Permutations and Combinations</Link></li>
              <li><Link href="/resources/real-numbers-hcf-lcm">Real Numbers: HCF and LCM</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
