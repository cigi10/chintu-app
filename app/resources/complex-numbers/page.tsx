import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Complex Numbers - Studyloaf",
  description: "What complex numbers are, the modulus-argument form, conjugates, and basic arithmetic on complex numbers, with worked examples.",
  openGraph: {
    title: "Complex Numbers - Studyloaf",
    description: "What complex numbers are, the modulus-argument form, conjugates, and basic arithmetic on complex numbers, with worked examples.",
  },
};

export default function ComplexNumbersPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Complex Numbers",
        description: "What complex numbers are, the modulus-argument form, conjugates, and basic arithmetic on complex numbers, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Complex Numbers" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Complex Numbers</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">What are complex numbers?</h2>
            <p className="blog-post-p">
              A negative number can&apos;t have a real square root, since squaring any real number
              gives a non-negative result. To handle this, we define the imaginary unit{" "}
              <Katex>{"i = \\sqrt{-1}"}</Katex>, so that:
            </p>
            <Katex display>{"\\sqrt{-25} = \\sqrt{-1}\\cdot\\sqrt{25} = 5i"}</Katex>
            <p className="blog-post-p">
              A <strong>complex number</strong> has the form <Katex>{"x + iy"}</Katex>, where{" "}
              <Katex>{"x"}</Katex> and <Katex>{"y"}</Katex> are real numbers: <Katex>{"x"}</Katex> is
              the real part, <Katex>{"y"}</Katex> is the imaginary part.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Modulus, argument, and conjugate</h2>
            <p className="blog-post-p">
              Every complex number can be written in polar form,{" "}
              <Katex>{"x + iy = r(\\cos\\theta + i\\sin\\theta)"}</Katex>, where:
            </p>
            <Katex display>{"r = \\sqrt{x^2 + y^2}, \\qquad \\theta = \\tan^{-1}\\!\\left(\\dfrac{y}{x}\\right)"}</Katex>
            <p className="blog-post-p">
              <Katex>{"r"}</Katex> is called the <strong>modulus</strong> of <Katex>{"x+iy"}</Katex>,
              written <Katex>{"|x+iy|"}</Katex>, and <Katex>{"\\theta"}</Katex> is its{" "}
              <strong>argument</strong>. The <strong>conjugate</strong> of <Katex>{"x+iy"}</Katex> is{" "}
              <Katex>{"x-iy"}</Katex>, and multiplying a complex number by its own conjugate always
              gives a real number:
            </p>
            <Katex display>{"(x+iy)(x-iy) = x^2 + y^2"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Arithmetic on complex numbers</h2>
            <p className="blog-post-p">
              Add or subtract complex numbers by combining their real and imaginary parts separately:{" "}
              <Katex>{"(1+2i) + (2+i) = 3+3i"}</Katex>.
            </p>
            <p className="blog-post-p">
              Multiplying two complex numbers <Katex>{"z_1 = x_1+iy_1"}</Katex> and{" "}
              <Katex>{"z_2 = x_2+iy_2"}</Katex> uses <Katex>{"i^2 = -1"}</Katex>:
            </p>
            <Katex display>{"z_1 z_2 = (x_1x_2 - y_1y_2) + i(x_1y_2 + x_2y_1)"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Complex numbers are exactly what shows up when a quadratic equation&apos;s discriminant
              is negative — the two roots become a conjugate pair like the ones above.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/quadratic-equations-solved-examples">Quadratic Equations: Solved Examples</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
