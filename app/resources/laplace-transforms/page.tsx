import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Laplace Transforms - Studyloaf",
  description: "The Laplace transform definition, a table of standard transforms, the first shifting theorem, and solving a linear ODE with initial conditions.",
  openGraph: {
    title: "Laplace Transforms - Studyloaf",
    description: "The Laplace transform definition, a table of standard transforms, the first shifting theorem, and solving a linear ODE with initial conditions.",
  },
};

export default function LaplaceTransformsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Laplace Transforms",
        description: "The Laplace transform definition, a table of standard transforms, the first shifting theorem, and solving a linear ODE with initial conditions.",
        datePublished: "2026-09-24T00:00:00+05:30",
        author: { "@type": "Organization", name: "Studyloaf Team", url: "https://www.studyloaf.com" },
        image: "https://www.studyloaf.com/companion/website_icon.PNG",
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Engineering Fundamentals" },
          { label: "Laplace Transforms", href: "/resources/laplace-transforms" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Laplace Transforms</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The definition</h2>
            <p className="blog-post-p">
              The Laplace transform turns a function of time <Katex>{"f(t)"}</Katex> into a
              function of a complex variable <Katex>{"s"}</Katex>, trading a differential
              equation in <Katex>{"t"}</Katex> for an algebraic one in <Katex>{"s"}</Katex>:
            </p>
            <Katex display>{"\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^\\infty e^{-st} f(t)\\, dt"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Standard transforms</h2>
            <Katex display>{"\\mathcal{L}\\{1\\} = \\dfrac{1}{s}, \\qquad \\mathcal{L}\\{t^n\\} = \\dfrac{n!}{s^{n+1}}, \\qquad \\mathcal{L}\\{e^{at}\\} = \\dfrac{1}{s-a}"}</Katex>
            <Katex display>{"\\mathcal{L}\\{\\sin at\\} = \\dfrac{a}{s^2+a^2}, \\qquad \\mathcal{L}\\{\\cos at\\} = \\dfrac{s}{s^2+a^2}"}</Katex>
            <p className="blog-post-p">
              The transform is <strong>linear</strong> — the transform of a sum is the sum of the
              transforms, and constants pull straight out — which is what makes it usable on
              multi-term expressions at all.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The first shifting theorem</h2>
            <p className="blog-post-p">
              Multiplying a function by <Katex>{"e^{at}"}</Katex> shifts its transform by{" "}
              <Katex>{"a"}</Katex>:
            </p>
            <Katex display>{"\\mathcal{L}\\{e^{at}f(t)\\} = F(s-a)"}</Katex>
            <p className="blog-post-p">
              <strong>Worked example:</strong> find <Katex>{"\\mathcal{L}\\{e^{3t}\\sin 4t\\}"}</Katex>.
            </p>
            <p className="blog-post-p">
              Start from <Katex>{"\\mathcal{L}\\{\\sin 4t\\} = \\dfrac{4}{s^2+16}"}</Katex>, then
              replace <Katex>{"s"}</Katex> with <Katex>{"s-3"}</Katex>:
            </p>
            <Katex display>{"\\mathcal{L}\\{e^{3t}\\sin 4t\\} = \\dfrac{4}{(s-3)^2+16}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: solving a linear ODE</h2>
            <p className="blog-post-p">
              Solve <Katex>{"\\dfrac{dy}{dt} + 2y = e^{-t}"}</Katex> given <Katex>{"y(0)=0"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Taking the Laplace transform of both sides (using{" "}
              <Katex>{"\\mathcal{L}\\{y'\\} = sY(s) - y(0)"}</Katex>) turns the ODE into an
              algebraic equation in <Katex>{"Y(s)"}</Katex>:
            </p>
            <Katex display>{"sY(s) - 0 + 2Y(s) = \\dfrac{1}{s+1} \\;\\Rightarrow\\; (s+2)Y(s) = \\dfrac{1}{s+1}"}</Katex>
            <Katex display>{"Y(s) = \\dfrac{1}{(s+1)(s+2)}"}</Katex>
            <p className="blog-post-p">
              Splitting into partial fractions, <Katex>{"\\dfrac{1}{(s+1)(s+2)} = \\dfrac{A}{s+1} + \\dfrac{B}{s+2}"}</Katex>.
              Setting <Katex>{"s=-1"}</Katex> gives <Katex>{"A=1"}</Katex>; setting{" "}
              <Katex>{"s=-2"}</Katex> gives <Katex>{"B=-1"}</Katex>:
            </p>
            <Katex display>{"Y(s) = \\dfrac{1}{s+1} - \\dfrac{1}{s+2}"}</Katex>
            <p className="blog-post-p">
              Each term is already a standard transform, so reading the inverse straight off the
              table:
            </p>
            <Katex display>{"y(t) = e^{-t} - e^{-2t}"}</Katex>
            <p className="blog-post-p">
              Checking: <Katex>{"y(0) = 1-1 = 0"}</Katex> as required, and{" "}
              <Katex>{"y' + 2y = (-e^{-t}+2e^{-2t}) + (2e^{-t}-2e^{-2t}) = e^{-t}"}</Katex>,
              matching the original equation.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Laplace transforms and Fourier series are the two core tools engineering math uses
              to turn a hard problem in the time domain into an easier one somewhere else.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/fourier-series">Fourier Series</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
