import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Wave Optics: Young's Double Slit Experiment - Studyloaf",
  description: "The path-difference conditions for bright and dark fringes, the fringe width formula, and worked examples finding fringe width and fringe position.",
  openGraph: {
    title: "Wave Optics: Young's Double Slit Experiment - Studyloaf",
    description: "The path-difference conditions for bright and dark fringes, the fringe width formula, and worked examples finding fringe width and fringe position.",
  },
};

export default function WaveOpticsYoungsDoubleSlitPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Wave Optics: Young's Double Slit Experiment",
        description: "The path-difference conditions for bright and dark fringes, the fringe width formula, and worked examples finding fringe width and fringe position.",
        datePublished: "2026-09-24T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Wave Optics: Young's Double Slit Experiment", href: "/resources/wave-optics-youngs-double-slit" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Wave Optics: Young&apos;s Double Slit Experiment</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Why fringes form</h2>
            <p className="blog-post-p">
              Light from two narrow, closely-spaced slits (separation <Katex>{"d"}</Katex>) spreads
              out and overlaps on a screen a distance <Katex>{"D"}</Katex> away. At a point on the
              screen a height <Katex>{"y"}</Katex> from the centre, the two waves have traveled
              slightly different distances — a <strong>path difference</strong> that, for{" "}
              <Katex>{"D \\gg d"}</Katex>, works out to:
            </p>
            <Katex display>{"\\Delta = \\dfrac{yd}{D}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Bright and dark fringes</h2>
            <p className="blog-post-p">
              Where the path difference is a whole number of wavelengths, the two waves arrive in
              phase and reinforce — a bright fringe. Where it&apos;s a half-integer number of
              wavelengths, they arrive out of phase and cancel — a dark fringe:
            </p>
            <Katex display>{"\\text{Bright: } \\Delta = n\\lambda, \\qquad \\text{Dark: } \\Delta = \\left(n+\\dfrac{1}{2}\\right)\\lambda \\qquad (n = 0, \\pm1, \\pm2, \\ldots)"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Fringe width</h2>
            <p className="blog-post-p">
              Setting <Katex>{"\\Delta = n\\lambda"}</Katex> and solving for <Katex>{"y"}</Katex>{" "}
              gives the position of the <Katex>{"n"}</Katex>th bright fringe,{" "}
              <Katex>{"y_n = \\tfrac{n\\lambda D}{d}"}</Katex>. Consecutive bright fringes are
              therefore evenly spaced, a distance apart called the <strong>fringe width</strong>:
            </p>
            <Katex display>{"\\beta = \\dfrac{\\lambda D}{d}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Two slits are 0.5 mm apart, the screen is 1 m away, and the light has a wavelength
              of 500 nm. Find the fringe width and the position of the 3rd bright fringe.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Convert to metres first: <Katex>{"d = 0.5\\times10^{-3}\\text{ m}"}</Katex>,{" "}
              <Katex>{"\\lambda = 500\\times10^{-9}\\text{ m}"}</Katex>, <Katex>{"D=1\\text{ m}"}</Katex>:
            </p>
            <Katex display>{"\\beta = \\dfrac{\\lambda D}{d} = \\dfrac{(500\\times10^{-9})(1)}{0.5\\times10^{-3}} = 1\\times10^{-3}\\text{ m} = 1\\text{ mm}"}</Katex>
            <p className="blog-post-p">
              The <Katex>{"n"}</Katex>th bright fringe sits at <Katex>{"n"}</Katex> fringe-widths
              from the centre, so the 3rd bright fringe is at:
            </p>
            <Katex display>{"y_3 = 3\\beta = 3\\text{ mm}"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
