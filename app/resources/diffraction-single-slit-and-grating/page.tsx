import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Diffraction: Single Slit and Diffraction Grating - Studyloaf",
  description: "Why single-slit diffraction minima and double-slit interference maxima use the exact same-looking formula for opposite reasons, plus a worked diffraction grating example.",
  openGraph: {
    title: "Diffraction: Single Slit and Diffraction Grating - Studyloaf",
    description: "Why single-slit diffraction minima and double-slit interference maxima use the exact same-looking formula for opposite reasons, plus a worked diffraction grating example.",
  },
};

export default function DiffractionPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Diffraction: Single Slit and Diffraction Grating",
        description: "Why single-slit diffraction minima and double-slit interference maxima use the exact same-looking formula for opposite reasons, plus a worked diffraction grating example.",
        datePublished: "2026-09-25T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Diffraction: Single Slit and Diffraction Grating", href: "/resources/diffraction-single-slit-and-grating" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Diffraction: Single Slit and Diffraction Grating</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">A single slit produces minima where two slits produce maxima</h2>
            <p className="blog-post-p">
              This is the part that trips people up: for a single slit of width{" "}
              <Katex>{"a"}</Katex>, the condition <Katex>{"a\\sin\\theta = n\\lambda"}</Katex>{" "}
              gives <strong>dark</strong> fringes — the opposite of the double-slit formula on{" "}
              <Link href="/resources/wave-optics-youngs-double-slit">Young&apos;s Double Slit</Link>,
              where the same-looking condition gives <em>bright</em> fringes. The reason: a single
              slit isn&apos;t two point sources interfering — it&apos;s infinitely many point sources
              across the slit width interfering with <em>each other</em>, and at these specific
              angles they cancel out in pairs.
            </p>
            <Katex display>{"\\text{Single-slit minima: } a\\sin\\theta = n\\lambda \\qquad (n = \\pm1, \\pm2, \\ldots)"}</Katex>
            <p className="blog-post-p">
              The central band between the first minima on either side is the{" "}
              <strong>central maximum</strong> — far brighter and wider than any of the side bands.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: single-slit minimum</h2>
            <p className="blog-post-p">
              Light of wavelength 600 nm passes through a slit 0.2 mm wide. Find the angle to the
              first minimum, and its position on a screen 1.5 m away.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> For the first minimum, <Katex>{"n=1"}</Katex>:
            </p>
            <Katex display>{"\\sin\\theta = \\dfrac{\\lambda}{a} = \\dfrac{600\\times10^{-9}}{0.2\\times10^{-3}} = 3\\times10^{-3}"}</Katex>
            <p className="blog-post-p">
              For such a small angle, <Katex>{"\\sin\\theta \\approx \\theta"}</Katex> in radians,
              and the position on screen is <Katex>{"y \\approx D\\sin\\theta"}</Katex>:
            </p>
            <Katex display>{"y \\approx (1.5)(3\\times10^{-3}) = 4.5\\times10^{-3}\\text{ m} = 4.5\\text{ mm}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Diffraction grating</h2>
            <p className="blog-post-p">
              A grating is many equally-spaced slits, spacing <Katex>{"d"}</Katex> apart. Unlike a
              single slit, this produces sharp, bright <strong>principal maxima</strong> — the same
              form as the double-slit condition, just with far more slits reinforcing each other:
            </p>
            <Katex display>{"d\\sin\\theta = n\\lambda"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: diffraction grating</h2>
            <p className="blog-post-p">
              A grating has 5000 lines per centimetre. Find the angle of the first-order maximum
              for sodium light, <Katex>{"\\lambda = 589\\text{ nm}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The line spacing is the reciprocal of the line density:
            </p>
            <Katex display>{"d = \\dfrac{1}{5000\\text{ lines/cm}} = 2\\times10^{-4}\\text{ cm} = 2000\\text{ nm}"}</Katex>
            <p className="blog-post-p">For the first order, <Katex>{"n=1"}</Katex>:</p>
            <Katex display>{"\\sin\\theta = \\dfrac{n\\lambda}{d} = \\dfrac{589}{2000} \\approx 0.2945 \\;\\Rightarrow\\; \\theta \\approx 17.1^\\circ"}</Katex>
          </div>
        </article>
      </div>
    </>
  );
}
