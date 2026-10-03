import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import TagChips from "@/components/TagChips";
import { getBlogPostsByCategory } from "@/lib/blogPosts";
import { getBlogCategories, getBlogCategory } from "@/lib/blogCategories";
import "@/styles/blog.css";

// /blog/category/<slug>: one subject hub, listing every post in it.
type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogCategories().map(c => ({ category: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getBlogCategory(slug);
  if (!category) return {};
  const title = `${category.title} - Studyloaf Blog`;
  return {
    title,
    description: category.description,
    openGraph: { title, description: category.description },
    alternates: { canonical: `/blog/category/${category.slug}` },
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getBlogCategory(slug);
  if (!category) notFound();
  const posts = getBlogPostsByCategory(category.slug);
  const siblings = getBlogCategories().filter(c => c.slug !== category.slug);

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: category.title, href: `/blog/category/${category.slug}` },
        ]} />
        <div className="blog-header">
          <h1 className="blog-title">{category.title}</h1>
          <p className="blog-subtitle">{category.intro}</p>
        </div>

        <p className="blog-hub-count">{posts.length} posts</p>
        <div className="blog-list">
          {posts.map(post => (
            <div key={post.slug} className="blog-card">
              <Link href={`/blog/${post.slug}`} className="blog-card-link">
                <h2 className="blog-card-title">{post.title}</h2>
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

        <div className="blog-hub-siblings">
          <h2 className="blog-category-title">Other subjects</h2>
          <ul className="blog-hub-sibling-list">
            {siblings.map(c => (
              <li key={c.slug}><Link href={`/blog/category/${c.slug}`}>{c.title}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
