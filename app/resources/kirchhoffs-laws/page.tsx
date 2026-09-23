import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Kirchhoff's Current and Voltage Laws - Studyloaf",
  description: "Kirchhoff's Current Law and Voltage Law explained, with a fully worked two-loop circuit solved for all three branch currents.",
  openGraph: {
    title: "Kirchhoff's Current and Voltage Laws - Studyloaf",
    description: "Kirchhoff's Current Law and Voltage Law explained, with a fully worked two-loop circuit solved for all three branch currents.",
  },
};

export default function KirchhoffsLawsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Kirchhoff's Current and Voltage Laws",
        description: "Kirchhoff's Current Law and Voltage Law explained, with a fully worked two-loop circuit solved for all three branch currents.",
        datePublished: "2026-09-24T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Kirchhoff's Current and Voltage Laws", href: "/resources/kirchhoffs-laws" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Kirchhoff&apos;s Current and Voltage Laws</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The two laws</h2>
            <p className="blog-post-p">
              <strong>Kirchhoff&apos;s Current Law (KCL)</strong> is just conservation of charge:
              at any junction, the current flowing in must equal the current flowing out — charge
              can&apos;t pile up at a point.
            </p>
            <p className="blog-post-p">
              <strong>Kirchhoff&apos;s Voltage Law (KVL)</strong> is conservation of energy: going
              all the way around any closed loop in a circuit, the total voltage gained (from
              sources) equals the total voltage dropped (across resistors) — you end up back where
              you started, at the same potential.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: a two-loop circuit</h2>
            <p className="blog-post-p">
              A circuit has two loops sharing a middle branch. The left loop has an 8V source in
              series with a 1Ω resistor, the right loop has an 8V source in series with a 2Ω
              resistor, and the shared middle branch has a 2Ω resistor. Current{" "}
              <Katex>{"I_1"}</Katex> flows from the left source into the shared node,{" "}
              <Katex>{"I_2"}</Katex> from the right source into the same node, and{" "}
              <Katex>{"I_3"}</Katex> flows out through the middle resistor. Find all three
              currents.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> KCL at the shared node gives{" "}
              <Katex>{"I_3 = I_1+I_2"}</Katex>. Applying KVL around each loop:
            </p>
            <Katex display>{"\\text{Left loop: } 8 = I_1(1) + I_3(2)"}</Katex>
            <Katex display>{"\\text{Right loop: } 8 = I_2(2) + I_3(2)"}</Katex>
            <p className="blog-post-p">Substituting <Katex>{"I_3 = I_1+I_2"}</Katex> into both:</p>
            <Katex display>{"8 = I_1 + 2(I_1+I_2) = 3I_1 + 2I_2 \\qquad\\text{(i)}"}</Katex>
            <Katex display>{"8 = 2I_2 + 2(I_1+I_2) = 2I_1 + 4I_2 \\qquad\\text{(ii)}"}</Katex>
            <p className="blog-post-p">
              From (ii): <Katex>{"I_1 = 4 - 2I_2"}</Katex>. Substituting into (i):
            </p>
            <Katex display>{"3(4-2I_2) + 2I_2 = 8 \\;\\Rightarrow\\; 12 - 4I_2 = 8 \\;\\Rightarrow\\; I_2 = 1\\text{ A}"}</Katex>
            <p className="blog-post-p">
              Then <Katex>{"I_1 = 4-2(1) = 2\\text{ A}"}</Katex>, and{" "}
              <Katex>{"I_3 = I_1+I_2 = 3\\text{ A}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Check:</strong> left loop: <Katex>{"2(1)+3(2)=2+6=8"}</Katex> ✓. Right loop:{" "}
              <Katex>{"1(2)+3(2)=2+6=8"}</Katex> ✓. Both match the source voltages.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Once a circuit is solved for its currents, the diode equation is what determines how
              current actually flows through any non-linear component you add to it. And for a
              circuit like this one, reducing everything except one branch down to a single
              equivalent source is often faster than solving the whole loop system directly.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/pn-junction-diode">PN Junction Diode: Forward and Reverse Bias</Link></li>
              <li><Link href="/resources/thevenin-norton-theorems">Thevenin's and Norton's Theorems</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
