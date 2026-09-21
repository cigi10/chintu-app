import Link from "next/link";
import Navbar from "@/components/Navbar";
import Katex from "@/components/Katex";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import "@/styles/blog.css";

export const metadata = {
  title: "Rolle's Theorem - Studyloaf",
  description: "What Rolle's theorem states and how to verify it for a function on a closed interval, with a worked example.",
  openGraph: {
    title: "Rolle's Theorem - Studyloaf",
    description: "What Rolle's theorem states and how to verify it for a function on a closed interval, with a worked example.",
  },
};

export default function RollesTheoremPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: "Rolle's Theorem",
        description: "What Rolle's theorem states and how to verify it for a function on a closed interval, with a worked example.",
        datePublished: "2026-09-17",
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Math" },
          { label: "Rolle's Theorem", href: "/resources/rolles-theorem" },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">Rolle&apos;s Theorem</h1>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">The theorem</h2>
            <p className="blog-post-p">
              If <Katex>{"f"}</Katex> is continuous on <Katex>{"[a,b]"}</Katex>, differentiable on{" "}
              <Katex>{"(a,b)"}</Katex>, and <Katex>{"f(a) = f(b)"}</Katex>, then there exists at
              least one point <Katex>{"c \\in (a,b)"}</Katex> where <Katex>{"f'(c) = 0"}</Katex> —
              intuitively, if a smooth curve starts and ends at the same height, it must have a flat
              point somewhere in between.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Worked example</h2>
            <p className="blog-post-p">
              Verify Rolle&apos;s theorem for <Katex>{"f(x) = x^2 + 2x - 8"}</Katex> on{" "}
              <Katex>{"[-4, 2]"}</Katex>.
            </p>
            <p className="blog-post-p">
              <strong>Solution:</strong> <Katex>{"f"}</Katex> is a polynomial, so it&apos;s
              continuous and differentiable everywhere. Checking the endpoints:
            </p>
            <Katex display>{"f(-4) = 16 - 8 - 8 = 0, \\qquad f(2) = 4 + 4 - 8 = 0"}</Katex>
            <p className="blog-post-p">
              Since <Katex>{"f(-4) = f(2)"}</Katex>, Rolle&apos;s theorem guarantees a point{" "}
              <Katex>{"c \\in (-4, 2)"}</Katex> with <Katex>{"f'(c)=0"}</Katex>. Since{" "}
              <Katex>{"f'(x) = 2x+2"}</Katex>:
            </p>
            <Katex display>{"2c + 2 = 0 \\;\\Rightarrow\\; c = -1"}</Katex>
            <p className="blog-post-p">
              <Katex>{"c=-1"}</Katex> does lie in <Katex>{"(-4,2)"}</Katex>, so the theorem is
              verified.
            </p>
          </div>

          <div className="blog-post-related">
            <h2 className="blog-post-heading">Continue learning</h2>
            <p className="blog-post-p">
              The point Rolle&apos;s theorem guarantees is exactly the kind of critical point that
              shows up when hunting for a local maximum or minimum.
            </p>
            <ul className="blog-post-related-list">
              <li><Link href="/resources/maxima-and-minima">Maxima and Minima</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
