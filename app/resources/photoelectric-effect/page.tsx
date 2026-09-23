import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Photoelectric Effect - Studyloaf",
  description: "Einstein's photoelectric equation, the work function and threshold frequency, and a worked example finding the maximum kinetic energy of emitted electrons.",
  openGraph: {
    title: "Photoelectric Effect - Studyloaf",
    description: "Einstein's photoelectric equation, the work function and threshold frequency, and a worked example finding the maximum kinetic energy of emitted electrons.",
  },
};

export default function PhotoelectricEffectPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Photoelectric Effect",
        description: "Einstein's photoelectric equation, the work function and threshold frequency, and a worked example finding the maximum kinetic energy of emitted electrons.",
        datePublished: "2026-09-25T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Photoelectric Effect", href: "/resources/photoelectric-effect" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Photoelectric Effect</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Einstein&apos;s photoelectric equation</h2>
            <p className="blog-post-p">
              When light hits a metal surface, each photon can knock out at most one electron —
              and only if the photon carries enough energy to first overcome the metal&apos;s{" "}
              <strong>work function</strong> <Katex>{"\\phi"}</Katex>, the minimum energy binding an
              electron to the surface. Whatever energy is left over becomes the electron&apos;s
              kinetic energy:
            </p>
            <Katex display>{"h\\nu = \\phi + KE_{max}"}</Katex>
            <p className="blog-post-p">
              where <Katex>{"h\\nu"}</Katex> is the photon&apos;s energy (<Katex>{"h"}</Katex>{" "}
              is Planck&apos;s constant, <Katex>{"6.626\\times10^{-34}"}</Katex> J·s). Below the{" "}
              <strong>threshold frequency</strong> <Katex>{"\\nu_0 = \\phi/h"}</Katex>, no electrons
              are emitted at all, no matter how intense the light is — a single low-energy photon
              still can&apos;t individually clear the work function.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Sodium has a work function of 2.3 eV. Light of wavelength 400 nm shines on it. Find
              the maximum kinetic energy of the emitted electrons, and the threshold wavelength
              below which no electrons are emitted.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Working in electron-volts and nanometres, photon energy is{" "}
              <Katex>{"E = hc/\\lambda"}</Katex>, and <Katex>{"hc \\approx 1240\\text{ eV}\\cdot\\text{nm}"}</Katex>{" "}
              is a convenient constant to keep on hand:
            </p>
            <Katex display>{"E = \\dfrac{1240}{400} = 3.1\\text{ eV}"}</Katex>
            <p className="blog-post-p">Subtracting the work function gives the maximum kinetic energy:</p>
            <Katex display>{"KE_{max} = E - \\phi = 3.1 - 2.3 = 0.8\\text{ eV}"}</Katex>
            <p className="blog-post-p">
              The threshold wavelength is where <Katex>{"KE_{max}=0"}</Katex> — the photon energy
              exactly equals the work function:
            </p>
            <Katex display>{"\\lambda_0 = \\dfrac{hc}{\\phi} = \\dfrac{1240}{2.3} \\approx 539\\text{ nm}"}</Katex>
            <p className="blog-post-p">
              Any wavelength longer than this (lower photon energy) produces no photoelectrons at
              all from sodium, regardless of the light&apos;s intensity.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The photoelectric effect treats light as particles; the de Broglie relation runs the
              same idea in reverse, treating particles like electrons as waves.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/de-broglie-wavelength">de Broglie Wavelength and Matter Waves</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
