import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllResourceTags, getResourcesByTag } from "@/lib/resources";
import "@/styles/blog.css";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllResourceTags().map(tag => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const resources = getResourcesByTag(tag);
  if (resources.length === 0) return {};
  return {
    title: `${tag} resources - Studyloaf`,
    description: `Studyloaf resource pages tagged "${tag}": ${resources.length} guide${resources.length === 1 ? "" : "s"}.`,
  };
}

export default async function ResourceTagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const resources = getResourcesByTag(tag);
  if (resources.length === 0) notFound();

  return (
    <div className="blog-shell">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Resources", href: "/resources" },
        { label: `#${tag}`, href: `/resources/tag/${tag}` },
      ]} />
      <div className="blog-header">
        <h1 className="blog-title">Resources tagged &ldquo;{tag}&rdquo;</h1>
        <p className="blog-subtitle">{resources.length} resource{resources.length === 1 ? "" : "s"}.</p>
      </div>

      <div className="blog-list">
        {resources.map(resource => (
          <Link key={resource.slug} href={`/resources/${resource.slug}`} className="blog-card">
            <h2 className="blog-card-title">{resource.title}</h2>
            <p className="blog-card-desc">{resource.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
