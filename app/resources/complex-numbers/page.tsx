import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Complex Numbers - Studyloaf",
  description: "What complex numbers are, the modulus-argument form, conjugates and arithmetic, plus the mathematical constants e, i, √2 and π, including powers of i.",
  openGraph: {
    title: "Complex Numbers - Studyloaf",
    description: "What complex numbers are, the modulus-argument form, conjugates and arithmetic, plus the mathematical constants e, i, √2 and π, including powers of i.",
  },
  alternates: { canonical: "/resources/complex-numbers" },
};

export default function ComplexNumbersPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Complex Numbers",
        description: "What complex numbers are, the modulus-argument form, conjugates and arithmetic, plus the mathematical constants e, i, √2 and π, including powers of i.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math: Algebra", href: "/resources/math-algebra" },
          { label: "Complex Numbers", href: "/resources/complex-numbers" },
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

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Mathematical Constants: e, i, √2, and π</h2>
            <p className="blog-post-p">
              The imaginary unit is one of four constants that turn up across school and JEE maths.
              Euler&apos;s identity, <Katex>{"e^{i\\pi} + 1 = 0"}</Katex>, links three of them in a
              single line. Here is what each one is, starting with <Katex>{"i"}</Katex> itself.
            </p>
            <h3 className="blog-post-subheading">The imaginary unit, i</h3>
            <p className="blog-post-p">
              <Katex>{"i"}</Katex> is defined by <Katex>{"i = \\sqrt{-1}"}</Katex>, so{" "}
              <Katex>{"i^2 = -1"}</Katex>. Higher powers of <Katex>{"i"}</Katex> repeat with a
              period of 4:
            </p>
            <Katex display>{"i^0=1, \\quad i^1=i, \\quad i^2=-1, \\quad i^3=-i, \\quad i^4=1, \\quad \\ldots"}</Katex>
            <p className="blog-post-p">
              To find <Katex>{"i^n"}</Katex> for a large <Katex>{"n"}</Katex>, divide by 4 and use
              the remainder.
            </p>
            <p className="blog-post-p">
              <strong>Worked example:</strong> find <Katex>{"i^{45}"}</Katex>.
            </p>
            <Katex display>{"45 = 4 \\times 11 + 1 \\quad\\Rightarrow\\quad i^{45} = i^1 = i"}</Katex>
            <p className="blog-post-p">
              Negative powers cycle the same way, just starting from{" "}
              <Katex>{"i^{-1}=\\tfrac{1}{i}=-i"}</Katex>:
            </p>
            <Katex display>{"i^{-1}=-i, \\quad i^{-2}=-1, \\quad i^{-3}=i, \\quad i^{-4}=1"}</Katex>
            <h3 className="blog-post-subheading">Euler&apos;s number, e</h3>
            <p className="blog-post-p">
              <Katex>{"e \\approx 2.71828\\ldots"}</Katex> is an irrational number that shows up
              constantly in growth and decay, including continuously compounded interest. One way
              to define it is as an infinite sum:
            </p>
            <Katex display>{"e = \\sum_{n=0}^{\\infty} \\dfrac{1}{n!} = \\dfrac{1}{0!} + \\dfrac{1}{1!} + \\dfrac{1}{2!} + \\cdots"}</Katex>
            <h3 className="blog-post-subheading">Pythagoras&apos; constant, √2</h3>
            <p className="blog-post-p">
              <Katex>{"\\sqrt{2} \\approx 1.41421\\ldots"}</Katex> is the diagonal length of a unit
              square, and was the first number ever proven irrational.
            </p>
            <h3 className="blog-post-subheading">Archimedes&apos; constant, π</h3>
            <p className="blog-post-p">
              <Katex>{"\\pi"}</Katex> is the ratio of a circle&apos;s circumference to its
              diameter, for <em>every</em> circle regardless of size:
            </p>
            <Katex display>{"\\pi = \\dfrac{C}{d} = \\dfrac{C}{2r} \\approx 3.14159\\ldots"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Complex numbers are exactly what shows up when a quadratic equation&apos;s discriminant
              is negative. The two roots become a conjugate pair like the ones above.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/quadratic-equations">Quadratic Equations</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
