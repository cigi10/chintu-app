import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getResourcesByCategory } from "@/lib/resources";
import "@/styles/blog.css";

export const metadata = {
  title: "Resources - Studyloaf",
  description: "Quick-reference study guides and worked examples.",
  openGraph: {
    title: "Resources - Studyloaf",
    description: "Quick-reference study guides and worked examples.",
  },
};

export default function ResourcesIndexPage() {
  const groups = getResourcesByCategory();

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <div className="blog-header">
          <h1 className="blog-title">Resources</h1>
          <p className="blog-subtitle">Quick-reference guides and worked examples.</p>
        </div>

        {groups.map(group => (
          <div key={group.category} className="blog-category-section">
            <h2 className="blog-category-title">{group.category}</h2>
            <div className="blog-list">
              {group.resources.map(resource => (
                <Link key={resource.slug} href={`/resources/${resource.slug}`} className="blog-card">
                  <h3 className="blog-card-title">{resource.title}</h3>
                  <p className="blog-card-desc">{resource.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
