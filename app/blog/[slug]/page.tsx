import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import TagChips from "@/components/TagChips";
import BlogTable, { type BlogTableData } from "@/components/BlogTable";
import BlogViewCount from "@/components/BlogViewCount";
import { BlogFigure, BlogImage, type BlogFigureData, type BlogImageData } from "@/components/BlogFigure";
import { getBlogPost, getBlogSlugs } from "@/lib/blogPosts";
import { getBlogCategory } from "@/lib/blogCategories";
import "@/styles/blog.css";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

// A content section has exactly one of: a `body` string, a `list` of
// strings, a `table` (components/BlogTable.tsx), a named inline-SVG
// `figure` (components/blog-figures/), an `image` from /public, or a
// `links` list (internal pages, or official sources opened in a new tab).
// lib/blogPosts.test.js checks every post against this.
type BlogPostSection = {
  heading: string | null;
  body?: string;
  list?: string[];
  table?: BlogTableData;
  figure?: BlogFigureData;
  image?: BlogImageData;
  links?: BlogPostRelatedLink[];
};

// Optional: related pages (other posts, tools, resource pages), rendered as
// a small link list after the content. Server-rendered like the rest of the
// post; lib/blogPosts.test.js checks every href resolves.
type BlogPostRelatedLink = {
  label: string;
  href: string;
};

// A link list inside the content: site pages use <Link>, official sources
// (https://) open in a new tab. lib/blogPosts.test.js restricts external
// hosts to official exam bodies.
function SectionLinks({ links }: { links: BlogPostRelatedLink[] }) {
  return (
    <ul className="blog-post-list blog-post-links">
      {links.map((link, j) => (
        <li key={j}>
          {link.href.startsWith("https://")
            ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
            : <Link href={link.href}>{link.label}</Link>}
        </li>
      ))}
    </ul>
  );
}

function formatPostDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

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
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();
  const category = getBlogCategory(post.category);

  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        ...(post.updated && { dateModified: post.updated }),
        author: { "@type": "Person", name: post.author },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          ...(category ? [{ label: category.title, href: `/blog/category/${category.slug}` }] : []),
          { label: post.title, href: `/blog/${post.slug}` },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-meta">
            <span>{post.author}</span>
            <span className="blog-card-meta-dot">•</span>
            <span>
              {formatPostDate(post.date)}
            </span>
            {post.updated && (
              <>
                <span className="blog-card-meta-dot">•</span>
                <span>Updated {formatPostDate(post.updated)}</span>
              </>
            )}
            {post.lastVerified && (
              <>
                <span className="blog-card-meta-dot">•</span>
                <span>Last verified {formatPostDate(post.lastVerified)}</span>
              </>
            )}
            <span className="blog-card-meta-dot">•</span>
            <span>{post.readingTime}</span>
            <BlogViewCount slug={post.slug} />
          </div>

          {(post.content as BlogPostSection[]).map((section, i) => (
            <div key={i} className="blog-post-section">
              {section.heading && <h2 className="blog-post-heading">{section.heading}</h2>}
              {section.table ? (
                <BlogTable table={section.table} id={`${post.slug}-table-${i}`} />
              ) : section.figure ? (
                <BlogFigure figure={section.figure} />
              ) : section.image ? (
                <BlogImage image={section.image} />
              ) : section.links ? (
                <SectionLinks links={section.links} />
              ) : section.list ? (
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
              <strong>Keep going</strong>
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
