import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { getBlogPost, getBlogSlugs } from "@/lib/blogPosts";
import "@/styles/blog.css";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

// A content section has either a `body` string or a `list` of strings,
// never both.
type BlogPostSection = {
  heading: string | null;
  body?: string;
  list?: string[];
};

// Pre-render every known post at build time; anything else 404s.
export function generateStaticParams() {
  return getBlogSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} - Studyloaf Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} - Studyloaf Blog`,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: { "@type": "Person", name: post.author },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-meta">
            <span>{post.author}</span>
            <span className="blog-card-meta-dot">•</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="blog-card-meta-dot">•</span>
            <span>{post.readingTime}</span>
          </div>

          {(post.content as BlogPostSection[]).map((section, i) => (
            <div key={i} className="blog-post-section">
              {section.heading && <h2 className="blog-post-heading">{section.heading}</h2>}
              {section.list ? (
                <ul className="blog-post-list">
                  {section.list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="blog-post-p">{section.body}</p>
              )}
            </div>
          ))}
        </article>
      </div>
    </>
  );
}
