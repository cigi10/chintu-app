import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogTags, getBlogPostsByTag } from "@/lib/blogPosts";
import "@/styles/blog.css";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllBlogTags().map(tag => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getBlogPostsByTag(tag);
  if (posts.length === 0) return {};
  return {
    title: `${tag} posts - Studyloaf Blog`,
    description: `Studyloaf blog posts tagged "${tag}": ${posts.length} post${posts.length === 1 ? "" : "s"}.`,
  };
}

export default async function BlogTagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getBlogPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: `#${tag}`, href: `/blog/tag/${tag}` },
        ]} />
        <div className="blog-header">
          <h1 className="blog-title">Posts tagged &ldquo;{tag}&rdquo;</h1>
          <p className="blog-subtitle">{posts.length} post{posts.length === 1 ? "" : "s"}.</p>
        </div>

        <div className="blog-list">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-desc">{post.description}</p>
              <div className="blog-card-meta">
                <span>{post.author}</span>
                <span className="blog-card-meta-dot">•</span>
                <span>{post.readingTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
