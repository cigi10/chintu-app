import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Transistor Biasing - Studyloaf",
  description: "Why a transistor needs a DC bias point before it can amplify, the fixed-bias circuit equations, and a fully worked example finding the operating point.",
  openGraph: {
    title: "Transistor Biasing - Studyloaf",
    description: "Why a transistor needs a DC bias point before it can amplify, the fixed-bias circuit equations, and a fully worked example finding the operating point.",
  },
};

export default function TransistorBiasingPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Transistor Biasing",
        description: "Why a transistor needs a DC bias point before it can amplify, the fixed-bias circuit equations, and a fully worked example finding the operating point.",
        datePublished: "2026-09-25T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Transistor Biasing", href: "/resources/transistor-biasing" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Transistor Biasing</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Why biasing comes first</h2>
            <p className="blog-post-p">
              A transistor amplifies an AC signal by riding it on top of a steady DC current —
              without that DC baseline (the <strong>Q-point</strong>, or operating point), a signal
              that dips negative would just cut the transistor off instead of being amplified.
              Biasing circuitry exists purely to set that DC baseline before any signal is
              applied.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Fixed-bias circuit equations</h2>
            <p className="blog-post-p">
              In the simplest bias circuit, a resistor <Katex>{"R_B"}</Katex> feeds base current
              from the supply, and a resistor <Katex>{"R_C"}</Katex> sits between the supply and
              the collector:
            </p>
            <Katex display>{"I_B = \\dfrac{V_{CC}-V_{BE}}{R_B}, \\qquad I_C = \\beta I_B, \\qquad V_{CE} = V_{CC} - I_CR_C"}</Katex>
            <p className="blog-post-p">
              where <Katex>{"V_{BE}\\approx0.7\\text{V}"}</Katex> for a silicon transistor and{" "}
              <Katex>{"\\beta"}</Katex> (also written <Katex>{"h_{FE}"}</Katex>) is the
              transistor&apos;s current gain.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              A fixed-bias circuit has <Katex>{"V_{CC}=12\\text{V}"}</Katex>,{" "}
              <Katex>{"R_B=470\\text{k}\\Omega"}</Katex>,{" "}
              <Katex>{"R_C=2.2\\text{k}\\Omega"}</Katex>, and <Katex>{"\\beta=100"}</Katex>. Find{" "}
              <Katex>{"I_B"}</Katex>, <Katex>{"I_C"}</Katex>, and <Katex>{"V_{CE}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong>
            </p>
            <Katex display>{"I_B = \\dfrac{12-0.7}{470{,}000} = \\dfrac{11.3}{470{,}000} \\approx 24.0\\,\\mu\\text{A}"}</Katex>
            <Katex display>{"I_C = \\beta I_B = 100 \\times 24.0\\,\\mu\\text{A} = 2.40\\text{ mA}"}</Katex>
            <Katex display>{"V_{CE} = V_{CC} - I_CR_C = 12 - (2.40\\times10^{-3})(2200) = 12 - 5.29 \\approx 6.71\\text{V}"}</Katex>
            <p className="blog-post-p">
              Since <Katex>{"V_{CE}"}</Katex> lands comfortably between 0V and{" "}
              <Katex>{"V_{CC}"}</Katex>, the transistor is biased in its active region, ready to
              amplify a signal riding on top of this DC point.
            </p>
            <p className="blog-post-p">
              Fixed bias like this is simple but sensitive to <Katex>{"\\beta"}</Katex>, which
              varies between individual transistors and with temperature — voltage-divider bias is
              the more common practical alternative specifically because it holds the Q-point
              stable even when <Katex>{"\\beta"}</Katex> drifts.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Once biased into its active region, a transistor becomes the building block behind
              op-amp circuits — though an op-amp is normally analyzed as a single ideal component
              rather than transistor by transistor.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/op-amp-fundamentals">Op-Amp Fundamentals: Inverting and Non-Inverting Amplifiers</Link></li>
              <li><Link href="/resources/pn-junction-diode">PN Junction Diode: Forward and Reverse Bias</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
