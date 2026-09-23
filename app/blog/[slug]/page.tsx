import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import TagChips from "@/components/TagChips";
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

// Optional: a post can point at one or more pages it's introducing (e.g. a
// feature-announcement post linking to the feature itself), rendered as a
// small link list after the content.
type BlogPostRelatedLink = {
  label: string;
  href: string;
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
          { label: post.title, href: `/blog/${post.slug}` },
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

          <TagChips tags={post.tags} basePath="/blog/tag" />

          {post.relatedLinks && (post.relatedLinks as BlogPostRelatedLink[]).length > 0 && (
            <div className="blog-post-related">
              <strong>Try it yourself</strong>
              <ul className="blog-post-related-list">
                {(post.relatedLinks as BlogPostRelatedLink[]).map((link, i) => (
                  <li key={i}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
