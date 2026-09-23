import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Thevenin's and Norton's Theorems - Studyloaf",
  description: "How to reduce any linear two-terminal network to a single source and resistor, with a worked example finding the Thevenin and Norton equivalents of the same circuit.",
  openGraph: {
    title: "Thevenin's and Norton's Theorems - Studyloaf",
    description: "How to reduce any linear two-terminal network to a single source and resistor, with a worked example finding the Thevenin and Norton equivalents of the same circuit.",
  },
};

export default function TheveninNortonTheoremsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Thevenin's and Norton's Theorems",
        description: "How to reduce any linear two-terminal network to a single source and resistor, with a worked example finding the Thevenin and Norton equivalents of the same circuit.",
        datePublished: "2026-09-25T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Thevenin's and Norton's Theorems", href: "/resources/thevenin-norton-theorems" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Thevenin&apos;s and Norton&apos;s Theorems</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Reducing a whole network to two numbers</h2>
            <p className="blog-post-p">
              <strong>Thevenin&apos;s theorem:</strong> any linear circuit, viewed from just two
              terminals, behaves exactly like a single voltage source{" "}
              <Katex>{"V_{th}"}</Katex> in series with a single resistor{" "}
              <Katex>{"R_{th}"}</Katex> — no matter how complicated the actual network behind those
              terminals is.
            </p>
            <p className="blog-post-p">
              <strong>Norton&apos;s theorem</strong> is the same idea with a current source instead:
              a current source <Katex>{"I_N"}</Katex> in <em>parallel</em> with{" "}
              <Katex>{"R_N"}</Katex>. The two are directly related — same resistance, and:
            </p>
            <Katex display>{"R_N = R_{th}, \\qquad I_N = \\dfrac{V_{th}}{R_{th}}"}</Katex>
            <p className="blog-post-p">
              <Katex>{"V_{th}"}</Katex> is the open-circuit voltage across the terminals (nothing
              connected). <Katex>{"R_{th}"}</Katex> is the resistance seen from the terminals with
              every independent source turned off (voltage sources shorted, current sources
              opened).
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              A 12V source feeds a 4Ω resistor in series, which then splits into a 6Ω resistor to
              the return path. Find the Thevenin and Norton equivalents seen from the terminals of
              that 6Ω resistor (with the 6Ω itself removed, as the external load being analyzed).
            </p>
            <p className="blog-post-p">
              <strong><Katex>{"V_{th}"}</Katex>:</strong> with the load removed, no current flows
              anywhere except through the 4Ω and 6Ω in series, so the terminal voltage is just the
              voltage-divider result across the 6Ω:
            </p>
            <Katex display>{"V_{th} = 12 \\times \\dfrac{6}{4+6} = 12 \\times 0.6 = 7.2\\text{ V}"}</Katex>
            <p className="blog-post-p">
              <strong><Katex>{"R_{th}"}</Katex>:</strong> shorting the 12V source and looking back
              into the terminals, the 4Ω and 6Ω are now simply in parallel with each other:
            </p>
            <Katex display>{"R_{th} = \\dfrac{4\\times6}{4+6} = \\dfrac{24}{10} = 2.4\\,\\Omega"}</Katex>
            <p className="blog-post-p">
              <strong>Norton equivalent:</strong>
            </p>
            <Katex display>{"I_N = \\dfrac{V_{th}}{R_{th}} = \\dfrac{7.2}{2.4} = 3\\text{ A}, \\qquad R_N = 2.4\\,\\Omega"}</Katex>
            <p className="blog-post-p">
              <strong>Cross-check:</strong> the Norton current should also equal the{" "}
              <em>short-circuit</em> current at the terminals. Shorting the terminals shorts out
              the 6Ω branch entirely, leaving only the 4Ω resistor across the 12V source:
            </p>
            <Katex display>{"I_{sc} = \\dfrac{12}{4} = 3\\text{ A}"}</Katex>
            <p className="blog-post-p">
              Matches <Katex>{"I_N"}</Katex> exactly, confirming both equivalents independently.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              This same circuit could be solved directly with Kirchhoff&apos;s laws instead of
              reducing it first — useful for checking a Thevenin/Norton reduction against a
              from-scratch calculation.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/kirchhoffs-laws">Kirchhoff&apos;s Current and Voltage Laws</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
