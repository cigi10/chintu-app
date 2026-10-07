import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import TagChips from "@/components/TagChips";
import { getAllBlogPosts, getBlogPostsByCategory } from "@/lib/blogPosts";
import { getBlogCategories } from "@/lib/blogCategories";
import "@/styles/blog.css";

const DESCRIPTION = "Exam guides and study advice from the Studyloaf team, organised by subject: JEE, NEET, counselling and admissions, study plans, and college and careers.";

export const metadata = {
  title: "Blog - Studyloaf",
  description: DESCRIPTION,
  openGraph: { title: "Blog - Studyloaf", description: DESCRIPTION },
  alternates: { canonical: "/blog" },
};

const LATEST_COUNT = 6;
const PREVIEW_COUNT = 3;

// The blog's top level: subject hubs first (every post lives in exactly
// one, listed in full on its hub page), then the newest posts so recent
// writing stays one click from here.
export default function BlogIndexPage() {
  const categories = getBlogCategories();
  const latest = getAllBlogPosts().slice(0, LATEST_COUNT);

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
        ]} />
        <div className="blog-header">
          <h1 className="blog-title">Studyloaf Blog</h1>
          <p className="blog-subtitle">Exam guides and study advice, organised by subject.</p>
        </div>

        <aside className="blog-callout" aria-labelledby="blog-gate-callout">
          <h2 id="blog-gate-callout" className="blog-callout-title">GATE 2027</h2>
          <p className="blog-callout-text">
            Official dates, the 2027 syllabi, study plans and every GATE guide in one place.
          </p>
          <Link href="/gate" className="blog-callout-link">Open the GATE 2027 hub</Link>
        </aside>

        <section className="blog-category-section" aria-labelledby="blog-subjects">
          <h2 id="blog-subjects" className="blog-category-title">Browse by subject</h2>
          <div className="blog-list">
            {categories.map(category => {
              const posts = getBlogPostsByCategory(category.slug);
              return (
                <div key={category.slug} className="blog-card blog-hub-card">
                  <h3 className="blog-card-title">
                    <Link href={`/blog/category/${category.slug}`}>{category.title}</Link>
                  </h3>
                  <p className="blog-card-desc">{category.description}</p>
                  <p className="blog-hub-preview">
                    {posts.slice(0, PREVIEW_COUNT).map((p, i) => (
                      <span key={p.slug}>
                        {i > 0 && " · "}
                        <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                      </span>
                    ))}
                    {posts.length > PREVIEW_COUNT && (
                      <>
                        {" · "}
                        <Link href={`/blog/category/${category.slug}`}>All {posts.length} posts</Link>
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="blog-category-section" aria-labelledby="blog-latest">
          <h2 id="blog-latest" className="blog-category-title">Latest posts</h2>
          <div className="blog-list">
            {latest.map(post => (
              <div key={post.slug} className="blog-card">
                <Link href={`/blog/${post.slug}`} className="blog-card-link">
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-desc">{post.description}</p>
                  <div className="blog-card-meta">
                    <span>{post.author}</span>
                    <span className="blog-card-meta-dot">•</span>
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
                <TagChips tags={post.tags} basePath="/blog/tag" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
