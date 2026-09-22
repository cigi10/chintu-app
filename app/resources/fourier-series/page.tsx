import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Fourier Series - Studyloaf",
  description: "The Fourier series formulas for a periodic function, and a fully worked derivation of the Fourier series for f(x) = x on (-π, π).",
  openGraph: {
    title: "Fourier Series - Studyloaf",
    description: "The Fourier series formulas for a periodic function, and a fully worked derivation of the Fourier series for f(x) = x on (-π, π).",
  },
};

export default function FourierSeriesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Fourier Series",
        description: "The Fourier series formulas for a periodic function, and a fully worked derivation of the Fourier series for f(x) = x on (-π, π).",
        datePublished: "2026-09-24T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Fourier Series", href: "/resources/fourier-series" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Fourier Series</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The idea</h2>
            <p className="blog-post-p">
              Any reasonably well-behaved periodic function can be rebuilt out of sines and
              cosines. For a function <Katex>{"f(x)"}</Katex> with period <Katex>{"2\\pi"}</Katex>:
            </p>
            <Katex display>{"f(x) = \\dfrac{a_0}{2} + \\sum_{n=1}^{\\infty}\\left(a_n\\cos nx + b_n\\sin nx\\right)"}</Katex>
            <p className="blog-post-p">
              where the coefficients are found by integrating over one full period:
            </p>
            <Katex display>{"a_0 = \\dfrac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\,dx, \\qquad a_n = \\dfrac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\cos nx\\,dx, \\qquad b_n = \\dfrac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin nx\\,dx"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">A shortcut for odd and even functions</h2>
            <p className="blog-post-p">
              If <Katex>{"f(x)"}</Katex> is <strong>odd</strong> (symmetric about the origin),
              every <Katex>{"a_n"}</Katex> — including <Katex>{"a_0"}</Katex> — is automatically
              zero, since cosine is even and an odd-times-even integrand over a symmetric interval
              vanishes. Only the sine terms survive.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: the Fourier series of f(x) = x</h2>
            <p className="blog-post-p">
              Find the Fourier series of <Katex>{"f(x) = x"}</Katex> on{" "}
              <Katex>{"(-\\pi, \\pi)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"f(x)=x"}</Katex> is odd, so{" "}
              <Katex>{"a_0 = 0"}</Katex> and every <Katex>{"a_n = 0"}</Katex>. Only{" "}
              <Katex>{"b_n"}</Katex> needs computing, and since <Katex>{"x\\sin nx"}</Katex> is
              even, the integral over <Katex>{"(-\\pi,\\pi)"}</Katex> is twice the integral over{" "}
              <Katex>{"(0,\\pi)"}</Katex>:
            </p>
            <Katex display>{"b_n = \\dfrac{2}{\\pi}\\int_0^{\\pi} x\\sin nx\\,dx"}</Katex>
            <p className="blog-post-p">Integrating by parts (u = x, dv = sin nx dx):</p>
            <Katex display>{"\\int_0^\\pi x\\sin nx\\,dx = \\left[-\\dfrac{x\\cos nx}{n}\\right]_0^\\pi + \\dfrac{1}{n}\\int_0^\\pi \\cos nx\\,dx = -\\dfrac{\\pi\\cos n\\pi}{n} + \\dfrac{1}{n}\\left[\\dfrac{\\sin nx}{n}\\right]_0^\\pi"}</Katex>
            <p className="blog-post-p">
              The second term vanishes since <Katex>{"\\sin n\\pi = 0"}</Katex> for every integer{" "}
              <Katex>{"n"}</Katex>, and <Katex>{"\\cos n\\pi = (-1)^n"}</Katex>:
            </p>
            <Katex display>{"\\int_0^\\pi x\\sin nx\\,dx = -\\dfrac{\\pi(-1)^n}{n} = \\dfrac{\\pi(-1)^{n+1}}{n}"}</Katex>
            <p className="blog-post-p">So:</p>
            <Katex display>{"b_n = \\dfrac{2}{\\pi}\\cdot\\dfrac{\\pi(-1)^{n+1}}{n} = \\dfrac{2(-1)^{n+1}}{n}"}</Katex>
            <p className="blog-post-p">
              giving <Katex>{"b_1=2"}</Katex>, <Katex>{"b_2=-1"}</Katex>,{" "}
              <Katex>{"b_3=\\tfrac{2}{3}"}</Katex>, and so on, so the full series is:
            </p>
            <Katex display>{"x = 2\\sin x - \\sin 2x + \\dfrac{2}{3}\\sin 3x - \\dfrac{1}{2}\\sin 4x + \\cdots = \\sum_{n=1}^{\\infty} \\dfrac{2(-1)^{n+1}}{n}\\sin nx"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Fourier series and Laplace transforms are the two core tools engineering math uses
              to turn a hard problem in the time domain into an easier one somewhere else.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/laplace-transforms">Laplace Transforms</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
