import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Logarithms - Studyloaf",
  description: "What a logarithm is, common vs natural vs binary logarithms, and the core logarithm rules, with worked examples.",
  openGraph: {
    title: "Logarithms - Studyloaf",
    description: "What a logarithm is, common vs natural vs binary logarithms, and the core logarithm rules, with worked examples.",
  },
};

export default function LogarithmsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Logarithms",
        description: "What a logarithm is, common vs natural vs binary logarithms, and the core logarithm rules, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Logarithms" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Logarithms</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What is a logarithm?</h2>
            <p className="blog-post-p">
              A logarithm is the inverse of exponentiation: it asks what power a base must be raised
              to in order to produce a given number.
            </p>
            <Katex display>{"2^4 = 16 \\iff \\log_2 16 = 4"}</Katex>
            <p className="blog-post-p">
              In general, <Katex>{"\\log_b x"}</Katex> is the exponent you&apos;d raise{" "}
              <Katex>{"b"}</Katex> to, to get <Katex>{"x"}</Katex>. Try it yourself:{" "}
              <Katex>{"\\log_6 1296 = \\,?"}</Katex> (since <Katex>{"6^4 = 1296"}</Katex>, the
              answer is 4).
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Common, natural, and binary logarithms</h2>
            <p className="blog-post-p">
              The <strong>common logarithm</strong> uses base 10 (and is what&apos;s meant when no
              base is written): <Katex>{"\\log_{10} 1000 = 3"}</Katex>,{" "}
              <Katex>{"\\log_{10} 100 = 2"}</Katex>.
            </p>
            <p className="blog-post-p">
              The <strong>natural logarithm</strong>, written <Katex>{"\\ln x"}</Katex>, uses base{" "}
              <Katex>{"e \\approx 2.71828"}</Katex>, and shows up naturally in continuous growth: the
              value of an investment under continuous compounding follows{" "}
              <Katex>{"FV = PV \\cdot e^{it}"}</Katex>.
            </p>
            <p className="blog-post-p">
              The <strong>binary logarithm</strong> uses base 2 and appears throughout computer
              science — <Katex>{"\\log_2 16 = 4"}</Katex>, <Katex>{"\\log_2 8 = 3"}</Katex>.
            </p>
            <p className="blog-post-p">
              A logarithm of a number between 0 and 1 is negative (e.g.{" "}
              <Katex>{"\\log_{10} 0.01 = -2"}</Katex>, since <Katex>{"10^{-2} = 0.01"}</Katex>), and
              the logarithm of zero or a negative number is undefined for real numbers, since no
              real power of a positive base ever produces zero or a negative result.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Logarithm rules</h2>
            <Katex display>{"\\log_b(x) + \\log_b(y) = \\log_b(xy)"}</Katex>
            <Katex display>{"\\log_b(x) - \\log_b(y) = \\log_b\\!\\left(\\dfrac{x}{y}\\right)"}</Katex>
            <Katex display>{"y \\cdot \\log_b(x) = \\log_b(x^y)"}</Katex>
            <p className="blog-post-p">
              Since logarithms and exponentials with the same base are inverses of each other, they
              cancel:
            </p>
            <Katex display>{"b^{\\log_b x} = x, \\qquad \\log_b(b^x) = x"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Continuous growth and decay show up as differential equations, and logarithms are
              usually the tool that solves them.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/differential-equations">Differential Equations</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
