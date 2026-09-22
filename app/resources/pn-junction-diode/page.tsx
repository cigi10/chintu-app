import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "PN Junction Diode: Forward and Reverse Bias - Studyloaf",
  description: "How a PN junction diode behaves under forward and reverse bias, the diode equation, and a worked example on the 'roughly 60mV per decade' current rule.",
  openGraph: {
    title: "PN Junction Diode: Forward and Reverse Bias - Studyloaf",
    description: "How a PN junction diode behaves under forward and reverse bias, the diode equation, and a worked example on the 'roughly 60mV per decade' current rule.",
  },
};

export default function PnJunctionDiodePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "PN Junction Diode: Forward and Reverse Bias",
        description: "How a PN junction diode behaves under forward and reverse bias, the diode equation, and a worked example on the 'roughly 60mV per decade' current rule.",
        datePublished: "2026-09-24T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "PN Junction Diode: Forward and Reverse Bias", href: "/resources/pn-junction-diode" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">PN Junction Diode: Forward and Reverse Bias</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The junction and the depletion region</h2>
            <p className="blog-post-p">
              A PN junction diode is formed where P-type semiconductor (extra positive charge
              carriers, or &quot;holes&quot;) meets N-type semiconductor (extra electrons). Right at the
              junction, electrons and holes diffuse across and cancel each other out, leaving a
              thin <strong>depletion region</strong> with no free charge carriers — and a small
              built-in electric field that opposes any further diffusion, holding the junction in
              equilibrium.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Forward bias vs. reverse bias</h2>
            <p className="blog-post-p">
              <strong>Forward bias</strong> connects the positive terminal of a source to the
              P-side. This pushes against the built-in field, narrows the depletion region, and
              once the applied voltage exceeds a threshold (around 0.7V for silicon), current
              flows easily and grows rapidly with voltage.
            </p>
            <p className="blog-post-p">
              <strong>Reverse bias</strong> connects the positive terminal to the N-side instead.
              This widens the depletion region and reinforces the built-in field, blocking current
              almost entirely — only a tiny leakage current flows, largely independent of voltage
              until breakdown.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The diode equation</h2>
            <p className="blog-post-p">
              The current through a diode as a function of the voltage across it is:
            </p>
            <Katex display>{"I = I_0\\left(e^{V/\\eta V_T} - 1\\right)"}</Katex>
            <p className="blog-post-p">
              where <Katex>{"I_0"}</Katex> is the small reverse saturation current,{" "}
              <Katex>{"\\eta"}</Katex> is an ideality factor (1 for an ideal diode), and{" "}
              <Katex>{"V_T = kT/q"}</Katex> is the thermal voltage — about 26 mV at room
              temperature. Under forward bias, the exponential term dominates and the{" "}
              <Katex>{"-1"}</Katex> becomes negligible.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: the &quot;60mV per decade&quot; rule</h2>
            <p className="blog-post-p">
              For an ideal diode (<Katex>{"\\eta=1"}</Katex>) at room temperature, by what factor
              does the current increase when the forward voltage rises from 0.60V to 0.66V?
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Since forward current is approximately{" "}
              <Katex>{"I \\approx I_0 e^{V/V_T}"}</Katex>, the ratio between two currents depends
              only on the voltage difference:
            </p>
            <Katex display>{"\\dfrac{I_2}{I_1} = e^{(V_2-V_1)/V_T} = e^{0.06/0.026} = e^{2.31}"}</Katex>
            <p className="blog-post-p">
              which works out to about <strong>10</strong> — a 60 mV increase in forward voltage
              multiplies the current roughly tenfold. This is exactly why a diode&apos;s forward
              voltage barely moves even as the current through it changes by orders of magnitude:
              the relationship is logarithmic, not linear.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              A diode is a non-linear component sitting inside an otherwise linear circuit —
              Kirchhoff&apos;s laws still apply to the rest of the loop around it.
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
