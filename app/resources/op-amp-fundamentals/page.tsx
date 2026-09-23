import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Op-Amp Fundamentals: Inverting and Non-Inverting Amplifiers - Studyloaf",
  description: "The ideal op-amp assumptions, the inverting and non-inverting amplifier gain formulas, and worked examples computing the output voltage for each configuration.",
  openGraph: {
    title: "Op-Amp Fundamentals: Inverting and Non-Inverting Amplifiers - Studyloaf",
    description: "The ideal op-amp assumptions, the inverting and non-inverting amplifier gain formulas, and worked examples computing the output voltage for each configuration.",
  },
};

export default function OpAmpFundamentalsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Op-Amp Fundamentals: Inverting and Non-Inverting Amplifiers",
        description: "The ideal op-amp assumptions, the inverting and non-inverting amplifier gain formulas, and worked examples computing the output voltage for each configuration.",
        datePublished: "2026-09-25T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Op-Amp Fundamentals: Inverting and Non-Inverting Amplifiers", href: "/resources/op-amp-fundamentals" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Op-Amp Fundamentals: Inverting and Non-Inverting Amplifiers</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The two ideal-op-amp rules</h2>
            <p className="blog-post-p">
              An op-amp has two inputs, <Katex>{"V_+"}</Katex> and <Katex>{"V_-"}</Katex>, and
              (with negative feedback) two assumptions make circuit analysis almost algebra-free:
            </p>
            <ul className="blog-post-list">
              <li>No current flows into either input terminal (infinite input impedance).</li>
              <li>
                The op-amp drives its output to force <Katex>{"V_+ = V_-"}</Katex> — the{" "}
                <strong>virtual short</strong>, even though the two inputs aren&apos;t actually
                connected.
              </li>
            </ul>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Inverting amplifier</h2>
            <p className="blog-post-p">
              The input signal drives <Katex>{"R_{in}"}</Katex> into the{" "}
              <Katex>{"V_-"}</Katex> terminal, with a feedback resistor <Katex>{"R_f"}</Katex> from
              output back to that same terminal, while <Katex>{"V_+"}</Katex> is grounded. Since{" "}
              <Katex>{"V_-"}</Katex> is forced to <Katex>{"0"}</Katex>V (a &quot;virtual
              ground&quot;) and no current enters the input, the current through{" "}
              <Katex>{"R_{in}"}</Katex> must equal the current through <Katex>{"R_f"}</Katex>,
              giving:
            </p>
            <Katex display>{"\\text{Gain} = \\dfrac{V_{out}}{V_{in}} = -\\dfrac{R_f}{R_{in}}"}</Katex>
            <p className="blog-post-p">
              <strong>Worked example:</strong> <Katex>{"R_{in}=1\\text{k}\\Omega"}</Katex>,{" "}
              <Katex>{"R_f=10\\text{k}\\Omega"}</Katex>, <Katex>{"V_{in}=0.5\\text{V}"}</Katex>:
            </p>
            <Katex display>{"V_{out} = -\\dfrac{10\\text{k}}{1\\text{k}} \\times 0.5 = -5\\text{V}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Non-inverting amplifier</h2>
            <p className="blog-post-p">
              The input signal now drives <Katex>{"V_+"}</Katex> directly, and{" "}
              <Katex>{"R_1"}</Katex> plus <Katex>{"R_f"}</Katex> form a voltage divider from output
              back to <Katex>{"V_-"}</Katex>, forcing <Katex>{"V_- = V_{in}"}</Katex> by the
              virtual-short rule:
            </p>
            <Katex display>{"\\text{Gain} = \\dfrac{V_{out}}{V_{in}} = 1+\\dfrac{R_f}{R_1}"}</Katex>
            <p className="blog-post-p">
              always positive (no inversion) and always at least 1, even if <Katex>{"R_f=0"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Worked example:</strong> <Katex>{"R_1=1\\text{k}\\Omega"}</Katex>,{" "}
              <Katex>{"R_f=9\\text{k}\\Omega"}</Katex>, <Katex>{"V_{in}=0.5\\text{V}"}</Katex>:
            </p>
            <Katex display>{"V_{out} = \\left(1+\\dfrac{9\\text{k}}{1\\text{k}}\\right) \\times 0.5 = 10 \\times 0.5 = 5\\text{V}"}</Katex>
            <p className="blog-post-p">
              Same resistor ratio magnitude as the inverting example above, but the output here is
              positive and one unit of gain higher — a direct consequence of the{" "}
              <Katex>{"+1"}</Katex> in the formula.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              An op-amp is itself built from biased transistor stages internally, though it&apos;s
              normally treated as a single ideal block rather than analyzed transistor by
              transistor.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/transistor-biasing">Transistor Biasing</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
