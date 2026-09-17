import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogPosts } from "@/lib/blogPosts";
import "@/styles/blog.css";

export const metadata = {
  title: "Blog - Studyloaf",
  description: "Study tips, timetable guides, and exam prep advice from the Studyloaf team.",
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]} />
        <div className="blog-header">
          <h1 className="blog-title">Studyloaf Blog</h1>
          <p className="blog-subtitle">Study tips, timetable guides, and exam prep advice.</p>
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
