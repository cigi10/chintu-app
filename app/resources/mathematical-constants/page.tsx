import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Mathematical Constants: e, i, √2, and π - Studyloaf",
  description: "What Euler's number, the imaginary unit, Pythagoras' constant, and pi actually represent, including the repeating cycle of powers of i, with a worked example.",
  openGraph: {
    title: "Mathematical Constants: e, i, √2, and π - Studyloaf",
    description: "What Euler's number, the imaginary unit, Pythagoras' constant, and pi actually represent, including the repeating cycle of powers of i, with a worked example.",
  },
};

export default function MathematicalConstantsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Mathematical Constants: e, i, √2, and π",
        description: "What Euler's number, the imaginary unit, Pythagoras' constant, and pi actually represent, including the repeating cycle of powers of i, with a worked example.",
        datePublished: "2026-09-23T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Mathematical Constants: e, i, √2, and π", href: "/resources/mathematical-constants" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Mathematical Constants: e, i, √2, and π</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Euler&apos;s number, e</h2>
            <p className="blog-post-p">
              <Katex>{"e \\approx 2.71828\\ldots"}</Katex> is an irrational number that shows up
              constantly in growth and decay — including continuously compounded interest. One way
              to define it is as an infinite sum:
            </p>
            <Katex display>{"e = \\sum_{n=0}^{\\infty} \\dfrac{1}{n!} = \\dfrac{1}{0!} + \\dfrac{1}{1!} + \\dfrac{1}{2!} + \\cdots"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The imaginary unit, i</h2>
            <p className="blog-post-p">
              <Katex>{"i"}</Katex> is defined by <Katex>{"i = \\sqrt{-1}"}</Katex>, so{" "}
              <Katex>{"i^2 = -1"}</Katex>. Higher powers of <Katex>{"i"}</Katex> repeat with a
              period of 4:
            </p>
            <Katex display>{"i^0=1, \\quad i^1=i, \\quad i^2=-1, \\quad i^3=-i, \\quad i^4=1, \\quad \\ldots"}</Katex>
            <p className="blog-post-p">
              To find <Katex>{"i^n"}</Katex> for a large <Katex>{"n"}</Katex>, divide by 4 and use
              the remainder.
            </p>
            <p className="blog-post-p">
              <strong>Worked example:</strong> find <Katex>{"i^{45}"}</Katex>.
            </p>
            <Katex display>{"45 = 4 \\times 11 + 1 \\quad\\Rightarrow\\quad i^{45} = i^1 = i"}</Katex>
            <p className="blog-post-p">
              Negative powers cycle the same way, just starting from{" "}
              <Katex>{"i^{-1}=\\tfrac{1}{i}=-i"}</Katex>:
            </p>
            <Katex display>{"i^{-1}=-i, \\quad i^{-2}=-1, \\quad i^{-3}=i, \\quad i^{-4}=1"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Pythagoras&apos; constant, √2</h2>
            <p className="blog-post-p">
              <Katex>{"\\sqrt{2} \\approx 1.41421\\ldots"}</Katex> is the diagonal length of a unit
              square, and was the first number ever proven irrational.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Archimedes&apos; constant, π</h2>
            <p className="blog-post-p">
              <Katex>{"\\pi"}</Katex> is the ratio of a circle&apos;s circumference to its
              diameter, for <em>every</em> circle regardless of size:
            </p>
            <Katex display>{"\\pi = \\dfrac{C}{d} = \\dfrac{C}{2r} \\approx 3.14159\\ldots"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
