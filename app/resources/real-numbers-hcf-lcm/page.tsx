import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Real Numbers: HCF and LCM - Studyloaf",
  description: "Finding HCF using Euclid's division algorithm and prime factorization, plus verifying LCM x HCF = product of two numbers, with worked examples.",
  openGraph: {
    title: "Real Numbers: HCF and LCM - Studyloaf",
    description: "Finding HCF using Euclid's division algorithm and prime factorization, plus verifying LCM x HCF = product of two numbers, with worked examples.",
  },
};

export default function RealNumbersHcfLcmPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Real Numbers: HCF and LCM",
        description: "Finding HCF using Euclid's division algorithm and prime factorization, plus verifying LCM x HCF = product of two numbers, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Real Numbers: HCF and LCM", href: "/resources/real-numbers-hcf-lcm" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Real Numbers: HCF and LCM</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Euclid&apos;s division algorithm</h2>
            <p className="blog-post-p">
              To find the HCF of two positive integers <Katex>{"a"}</Katex> and <Katex>{"b"}</Katex>{" "}
              (with <Katex>{"a > b"}</Katex>), repeatedly apply <Katex>{"a = bq + r"}</Katex> where{" "}
              <Katex>{"0 \\le r < b"}</Katex>, replacing <Katex>{"a"}</Katex> and <Katex>{"b"}</Katex>{" "}
              with <Katex>{"b"}</Katex> and <Katex>{"r"}</Katex> each time, until the remainder is 0.
              The divisor at that final step is the HCF.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: HCF by Euclid&apos;s algorithm</h2>
            <p className="blog-post-p">Find the HCF of 867 and 255.</p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Since <Katex>{"867 > 255"}</Katex>:
            </p>
            <Katex display>{"867 = 255 \\times 3 + 102"}</Katex>
            <Katex display>{"255 = 102 \\times 2 + 51"}</Katex>
            <Katex display>{"102 = 51 \\times 2 + 0"}</Katex>
            <p className="blog-post-p">
              As the remainder is now 0, the HCF of 867 and 255 is <strong>51</strong>.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">HCF and LCM by prime factorization</h2>
            <p className="blog-post-p">
              Break both numbers into prime factors. The HCF is the product of the smallest power of
              each common prime factor; the LCM is the product of the greatest power of every prime
              factor that appears in either number. For any two positive integers, these always
              satisfy:
            </p>
            <Katex display>{"\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: HCF, LCM, and verification</h2>
            <p className="blog-post-p">Find the HCF and LCM of 336 and 54, and verify the relationship above.</p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Prime factorizing both numbers:
            </p>
            <Katex display>{"336 = 2^4 \\times 3 \\times 7, \\qquad 54 = 2 \\times 3^3"}</Katex>
            <p className="blog-post-p">
              The HCF takes the lowest power of each shared prime (<Katex>{"2^1"}</Katex> and{" "}
              <Katex>{"3^1"}</Katex>), and the LCM takes the highest power of every prime seen:
            </p>
            <Katex display>{"\\text{HCF}(336, 54) = 2 \\times 3 = 6, \\qquad \\text{LCM}(336, 54) = 2^4 \\times 3^3 \\times 7 = 3024"}</Katex>
            <p className="blog-post-p">
              <strong>Verification:</strong> <Katex>{"\\text{HCF} \\times \\text{LCM} = 6 \\times 3024 = 18144"}</Katex>,
              and <Katex>{"336 \\times 54 = 18144"}</Katex> too, so the relationship holds.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Real Numbers and Polynomials are back-to-back foundational chapters in the Class 10
              syllabus, both built on breaking expressions down into simpler factors.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/polynomials-zeroes-and-coefficients">Polynomials: Zeroes and Coefficients</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
