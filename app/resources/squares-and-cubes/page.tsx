import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getResourceBySlug } from "@/lib/resources";
import { getBlogPost } from "@/lib/blogPosts";
import "@/styles/blog.css";
import "@/styles/resources.css";

export const metadata = {
  title: "Squares and Cubes Reference - Studyloaf",
  description: "A quick-reference table of squares from 1 to 30 and cubes from 1 to 20.",
  openGraph: {
    title: "Squares and Cubes Reference - Studyloaf",
    description: "A quick-reference table of squares from 1 to 30 and cubes from 1 to 20.",
  },
};

// Computed at render time rather than hand-typed, so every value is exact
// by construction instead of relying on manually re-checked arithmetic.
const squares = Array.from({ length: 30 }, (_, i) => i + 1).map(n => ({ n, value: n * n }));
const cubes = Array.from({ length: 20 }, (_, i) => i + 1).map(n => ({ n, value: n * n * n }));

export default function SquaresAndCubesPage() {
  const resource = getResourceBySlug("squares-and-cubes");
  const relatedPost = resource?.relatedBlogSlug ? getBlogPost(resource.relatedBlogSlug) : null;

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <article className="blog-post">
          <h1 className="blog-post-title">Squares and Cubes Reference</h1>

          <div className="blog-post-section">
            <p className="blog-post-p">
              Knowing squares and cubes by heart saves time on arithmetic-heavy questions in exams
              like JEE, GATE, and general aptitude tests. This page lists squares from 1 to 30 and
              cubes from 1 to 20.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Squares (1 to 30)</h2>
            <div className="resource-number-grid">
              {squares.map(({ n, value }) => (
                <div key={n} className="resource-number-chip">{n}&sup2; = {value}</div>
              ))}
            </div>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Cubes (1 to 20)</h2>
            <div className="resource-number-grid">
              {cubes.map(({ n, value }) => (
                <div key={n} className="resource-number-chip">{n}&sup3; = {value}</div>
              ))}
            </div>
          </div>

          {relatedPost && (
            <div className="blog-post-section resource-related">
              <p className="blog-post-p">
                Related reading:{" "}
                <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
              </p>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
