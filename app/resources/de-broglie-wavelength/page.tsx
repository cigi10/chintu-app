import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "de Broglie Wavelength and Matter Waves - Studyloaf",
  description: "The de Broglie relation between a particle's momentum and its wavelength, and a worked example deriving the wavelength of an electron accelerated through a known voltage.",
  openGraph: {
    title: "de Broglie Wavelength and Matter Waves - Studyloaf",
    description: "The de Broglie relation between a particle's momentum and its wavelength, and a worked example deriving the wavelength of an electron accelerated through a known voltage.",
  },
};

export default function DeBroglieWavelengthPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "de Broglie Wavelength and Matter Waves",
        description: "The de Broglie relation between a particle's momentum and its wavelength, and a worked example deriving the wavelength of an electron accelerated through a known voltage.",
        datePublished: "2026-09-25T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "de Broglie Wavelength and Matter Waves", href: "/resources/de-broglie-wavelength" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">de Broglie Wavelength and Matter Waves</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Every moving particle has a wavelength</h2>
            <p className="blog-post-p">
              If light — normally a wave — can behave like a stream of particles (photons), de
              Broglie proposed the reverse should hold too: every moving particle has an associated
              wavelength, set by its momentum <Katex>{"p=mv"}</Katex>:
            </p>
            <Katex display>{"\\lambda = \\dfrac{h}{p} = \\dfrac{h}{mv}"}</Katex>
            <p className="blog-post-p">
              For everyday objects this wavelength is absurdly small and unobservable — it only
              becomes significant for very light, fast particles like electrons, which is exactly
              why electron microscopes work.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find the de Broglie wavelength of an electron accelerated from rest through a
              potential difference of 100 V.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> The accelerating field does work <Katex>{"eV"}</Katex> on
              the electron, which becomes its kinetic energy:
            </p>
            <Katex display>{"eV = \\dfrac{1}{2}mv^2 \\;\\Rightarrow\\; mv = \\sqrt{2meV}"}</Katex>
            <p className="blog-post-p">
              Substituting <Katex>{"p=mv=\\sqrt{2meV}"}</Katex> into the de Broglie relation:
            </p>
            <Katex display>{"\\lambda = \\dfrac{h}{\\sqrt{2meV}}"}</Katex>
            <p className="blog-post-p">
              Plugging in <Katex>{"h=6.626\\times10^{-34}"}</Katex> J·s,{" "}
              <Katex>{"m=9.11\\times10^{-31}"}</Katex> kg, and{" "}
              <Katex>{"e=1.6\\times10^{-19}"}</Katex> C gives a clean, commonly-used shortcut for
              electrons specifically:
            </p>
            <Katex display>{"\\lambda \\approx \\dfrac{1.226}{\\sqrt{V}}\\text{ nm} \\qquad (V \\text{ in volts})"}</Katex>
            <p className="blog-post-p">For <Katex>{"V=100"}</Katex> V:</p>
            <Katex display>{"\\lambda \\approx \\dfrac{1.226}{\\sqrt{100}} = \\dfrac{1.226}{10} \\approx 0.1226\\text{ nm}"}</Katex>
            <p className="blog-post-p">
              That&apos;s comparable to the spacing between atoms in a crystal — which is exactly
              why fast electrons diffract off crystal lattices the same way X-rays do.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
