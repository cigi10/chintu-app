import Navbar from "@/components/Navbar";
import Link from "next/link";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Prime Numbers - Studyloaf",
  description: "What a prime number is, why 0 and 1 are neither prime nor composite, and what twin primes are, with a worked example checking a number for primality.",
  openGraph: {
    title: "Prime Numbers - Studyloaf",
    description: "What a prime number is, why 0 and 1 are neither prime nor composite, and what twin primes are, with a worked example checking a number for primality.",
  },
};

export default function PrimeNumbersPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Prime Numbers",
        description: "What a prime number is, why 0 and 1 are neither prime nor composite, and what twin primes are, with a worked example checking a number for primality.",
        datePublished: "2026-09-23T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Prime Numbers", href: "/resources/prime-numbers" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Prime Numbers</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The definition, and two common exceptions</h2>
            <p className="blog-post-p">
              A <strong>prime number</strong> is a natural number greater than 1 whose only
              positive divisors are 1 and itself. A number greater than 1 that isn&apos;t prime is{" "}
              <strong>composite</strong>.
            </p>
            <p className="blog-post-p">
              <strong>0 is neither prime nor composite</strong> — every number times 0 is 0, so 0
              would have infinitely many factors, and primality requires a finite, specific set of
              divisors.
            </p>
            <p className="blog-post-p">
              <strong>1 is also neither</strong> — a prime needs exactly two distinct divisors (1
              and itself), but 1&apos;s only divisor is 1 itself, just one.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: checking primality</h2>
            <p className="blog-post-p">
              Is <Katex>{"91"}</Katex> prime?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> It&apos;s enough to test divisibility by every prime up to{" "}
              <Katex>{"\\sqrt{91} \\approx 9.5"}</Katex> — 2, 3, 5, and 7 — since any factor larger
              than the square root would have to pair with one smaller than it, already caught.{" "}
              <Katex>{"91"}</Katex> is odd (not divisible by 2), its digit sum 10 isn&apos;t
              divisible by 3, it doesn&apos;t end in 0 or 5 (not divisible by 5), but{" "}
              <Katex>{"91 = 7 \\times 13"}</Katex> — so <strong>91 is composite</strong>, not
              prime.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Twin primes</h2>
            <p className="blog-post-p">
              A pair of primes exactly 2 apart is called a <strong>twin prime</strong> pair — like{" "}
              <Katex>{"(17, 19)"}</Katex> or <Katex>{"(29, 31)"}</Katex>. The very first few pairs
              are <Katex>{"(3,5), (5,7), (11,13), (17,19), (29,31), (41,43)"}</Katex>.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Prime factorization is exactly the tool both divisibility rules and HCF/LCM
              calculations are built on.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/divisibility-rules">Divisibility Rules</Link></li>
              <li><Link href="/resources/real-numbers-hcf-lcm">Real Numbers: HCF and LCM</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
