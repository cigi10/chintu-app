import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getResourceHubs, getResourceHub, getResourcesByHub } from "@/lib/resources";
import "@/styles/blog.css";

// /resources/<slug>: the subject hub pages (e.g. /resources/math-calculus).
// Individual resource pages that still live in their own folders under
// app/resources/ take precedence over this dynamic route, so hubs and
// resources share the /resources/ namespace without clashing; hub slugs
// are checked never to collide with a resource slug. Anything that isn't
// a hub 404s (dynamicParams = false).
type HubPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getResourceHubs().map(hub => ({ slug: hub.slug }));
}

export async function generateMetadata({ params }: HubPageProps) {
  const { slug } = await params;
  const hub = getResourceHub(slug);
  if (!hub) return {};
  const title = `${hub.title} Resources - Studyloaf`;
  return {
    title,
    description: hub.description,
    openGraph: { title, description: hub.description },
    alternates: { canonical: `/resources/${hub.slug}` },
  };
}

export default async function ResourceHubPage({ params }: HubPageProps) {
  const { slug } = await params;
  const hub = getResourceHub(slug);
  if (!hub) notFound();
  const resources = getResourcesByHub(hub.slug);
  const siblings = getResourceHubs().filter(h => h.slug !== hub.slug);

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: hub.title, href: `/resources/${hub.slug}` },
        ]} />
        <div className="blog-header">
          <h1 className="blog-title">{hub.title}</h1>
          <p className="blog-subtitle">{hub.intro}</p>
        </div>

        <p className="blog-hub-count">{resources.length} reference pages</p>
        <div className="blog-list">
          {resources.map(resource => (
            <Link key={resource.slug} href={`/resources/${resource.slug}`} className="blog-card">
              <h2 className="blog-card-title">{resource.title}</h2>
              <p className="blog-card-desc">{resource.description}</p>
            </Link>
          ))}
        </div>

        <div className="blog-hub-siblings">
          <h2 className="blog-category-title">Other subjects</h2>
          <ul className="blog-hub-sibling-list">
            {siblings.map(h => (
              <li key={h.slug}><Link href={`/resources/${h.slug}`}>{h.title}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
