import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Integration Using Trigonometric Identities - Studyloaf",
  description: "Rewriting a trigonometric integrand with an identity before integrating, with worked examples on cos^2 x, sin^2 x, and a secant identity.",
  openGraph: {
    title: "Integration Using Trigonometric Identities - Studyloaf",
    description: "Rewriting a trigonometric integrand with an identity before integrating, with worked examples on cos^2 x, sin^2 x, and a secant identity.",
  },
};

export default function IntegrationUsingTrigIdentitiesPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Integration Using Trigonometric Identities",
        description: "Rewriting a trigonometric integrand with an identity before integrating, with worked examples on cos^2 x, sin^2 x, and a secant identity.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Integration Using Trigonometric Identities", href: "/resources/integration-using-trigonometric-identities" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Integration Using Trigonometric Identities</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The idea</h2>
            <p className="blog-post-p">
              Functions like <Katex>{"\\cos^2 x"}</Katex> and <Katex>{"\\sin^2 x"}</Katex> have no
              direct antiderivative, but the double-angle identities rewrite them as something that
              does:
            </p>
            <Katex display>{"\\cos^2 x = \\dfrac{1+\\cos 2x}{2}, \\qquad \\sin^2 x = \\dfrac{1-\\cos 2x}{2}"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\displaystyle\\int \\cos^2 x\\,dx"}</Katex> and{" "}
              <Katex>{"\\displaystyle\\int \\sin^2 x\\,dx"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Substituting the identities above and integrating term by
              term:
            </p>
            <Katex display>{"\\int \\cos^2 x\\,dx = \\int \\dfrac{1+\\cos 2x}{2}\\,dx = \\dfrac{x}{2} + \\dfrac{\\sin 2x}{4} + C"}</Katex>
            <Katex display>{"\\int \\sin^2 x\\,dx = \\int \\dfrac{1-\\cos 2x}{2}\\,dx = \\dfrac{x}{2} - \\dfrac{\\sin 2x}{4} + C"}</Katex>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example: splitting into known antiderivatives</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\displaystyle\\int \\dfrac{1-\\sin x}{\\cos^2 x}\\,dx"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Split the fraction into two terms:
            </p>
            <Katex display>{"\\int \\dfrac{1}{\\cos^2 x}\\,dx - \\int \\dfrac{\\sin x}{\\cos^2 x}\\,dx = \\int \\sec^2 x\\,dx - \\int \\sec x\\tan x\\,dx"}</Katex>
            <p className="blog-post-p">
              Both are standard forms:
            </p>
            <Katex display>{"= \\tan x - \\sec x + C"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Every trigonometric identity used here comes from the same core right-triangle
              relationships covered in trigonometry basics.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/trigonometry">Trigonometry Basics</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
