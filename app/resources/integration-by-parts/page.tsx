import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Integration by Parts - Studyloaf",
  description: "The integration by parts formula for integrating a product of two functions, with a worked example.",
  openGraph: {
    title: "Integration by Parts - Studyloaf",
    description: "The integration by parts formula for integrating a product of two functions, with a worked example.",
  },
};

export default function IntegrationByPartsPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Integration by Parts",
        description: "The integration by parts formula for integrating a product of two functions, with a worked example.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Integration by Parts", href: "/resources/integration-by-parts" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Integration by Parts</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The formula</h2>
            <p className="blog-post-p">
              When a function is a product of two simpler ones, integration by parts breaks it down:
            </p>
            <Katex display>{"\\int u\\,dv = uv - \\int v\\,du"}</Katex>
            <p className="blog-post-p">
              The trick is picking which factor is <Katex>{"u"}</Katex> (something that gets simpler
              when differentiated) and which is <Katex>{"dv"}</Katex> (something easy to integrate).
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Find <Katex>{"\\int x\\cos x\\,dx"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> Let <Katex>{"u = x"}</Katex> and{" "}
              <Katex>{"dv = \\cos x\\,dx"}</Katex>, so <Katex>{"du = dx"}</Katex> and{" "}
              <Katex>{"v = \\sin x"}</Katex>:
            </p>
            <Katex display>{"\\int x\\cos x\\,dx = x\\sin x - \\int \\sin x\\,dx = x\\sin x - (-\\cos x) + C"}</Katex>
            <Katex display>{"= x\\sin x + \\cos x + C"}</Katex>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              Integration by parts is one of two main techniques for evaluating an integral —
              definite integrals use the same antiderivative work, just with limits applied at the
              end.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/definite-integrals">Definite Integrals</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
