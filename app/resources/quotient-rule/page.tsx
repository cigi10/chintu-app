import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Quotient Rule - Studyloaf",
  description: "The quotient rule for differentiating one function divided by another, with worked examples.",
  openGraph: {
    title: "Quotient Rule - Studyloaf",
    description: "The quotient rule for differentiating one function divided by another, with worked examples.",
  },
};

export default function QuotientRulePage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Quotient Rule",
        description: "The quotient rule for differentiating one function divided by another, with worked examples.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Quotient Rule", href: "/resources/quotient-rule" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Quotient Rule</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The rule</h2>
            <p className="blog-post-p">
              For a quotient of two functions, &quot;low d-high minus high d-low, over low squared&quot;:
            </p>
            <Katex display>{"\\dfrac{d}{dx}\\left[\\dfrac{u(x)}{v(x)}\\right] = \\dfrac{u'(x)v(x) - u(x)v'(x)}{v(x)^2}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Differentiate <Katex>{"y = \\dfrac{2x+1}{3x-4}"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> With <Katex>{"u=2x+1"}</Katex> (<Katex>{"u'=2"}</Katex>) and{" "}
              <Katex>{"v=3x-4"}</Katex> (<Katex>{"v'=3"}</Katex>):
            </p>
            <Katex display>{"y' = \\dfrac{2(3x-4) - (2x+1)(3)}{(3x-4)^2} = \\dfrac{6x-8-6x-3}{(3x-4)^2} = \\dfrac{-11}{(3x-4)^2}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">A function's derivative at a point</h2>
            <p className="blog-post-p">
              The functions <Katex>{"f(x)"}</Katex> and <Katex>{"g(x)"}</Katex> are differentiable,
              and <Katex>{"h(x) = \\dfrac{g(x)}{f(x)}"}</Katex>. Given{" "}
              <Katex>{"f(0)=-7"}</Katex>, <Katex>{"f'(0)=5"}</Katex>, <Katex>{"g(0)=3"}</Katex>, and{" "}
              <Katex>{"g'(0)=-6"}</Katex>, find <Katex>{"h'(0)"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> By the quotient rule,{" "}
              <Katex>{"h'(x) = \\dfrac{g'(x)f(x) - g(x)f'(x)}{f(x)^2}"}</Katex>. Substituting the
              values at <Katex>{"x=0"}</Katex>:
            </p>
            <Katex display>{"h'(0) = \\dfrac{(-6)(-7) - (3)(5)}{(-7)^2} = \\dfrac{42-15}{49} = \\dfrac{27}{49}"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The product rule is the quotient rule&apos;s counterpart for multiplying two functions
              instead of dividing them.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/product-rule">Product Rule</Link></li>
              <li><Link href="/resources/power-rule">Power Rule</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
