import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getResourceHubs, getResourcesByHub } from "@/lib/resources";
import "@/styles/blog.css";

const DESCRIPTION = "Quick-reference study guides with worked examples, organised by subject: calculus, algebra, vectors, trigonometry, engineering mathematics, physics, and electrical and electronics.";

export const metadata = {
  title: "Resources - Studyloaf",
  description: DESCRIPTION,
  openGraph: {
    title: "Resources - Studyloaf",
    description: DESCRIPTION,
  },
  alternates: { canonical: "/resources" },
};

// How many page titles to preview on each hub card before "and N more".
const PREVIEW_COUNT = 4;

// The top level of the resources section: one card per subject hub, each
// previewing a few of its pages. Every page is listed in full on its hub.
export default function ResourcesIndexPage() {
  const hubs = getResourceHubs();
  const groups = [...new Set(hubs.map(h => h.group))];
  const total = hubs.reduce((n, h) => n + getResourcesByHub(h.slug).length, 0);

  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <div className="blog-header">
          <h1 className="blog-title">Resources</h1>
          <p className="blog-subtitle">
            {total} quick-reference guides with worked examples, organised into {hubs.length} subjects.
            Pick a subject to see every page in it.
          </p>
        </div>

        {groups.map(group => (
          <section key={group} className="blog-category-section" aria-labelledby={`group-${group}`}>
            <h2 id={`group-${group}`} className="blog-category-title">{group}</h2>
            <div className="blog-list">
              {hubs.filter(h => h.group === group).map(hub => {
                const pages = getResourcesByHub(hub.slug);
                return (
                  <div key={hub.slug} className="blog-card blog-hub-card">
                    <h3 className="blog-card-title">
                      <Link href={`/resources/${hub.slug}`}>{hub.title}</Link>
                    </h3>
                    <p className="blog-card-desc">{hub.description}</p>
                    <p className="blog-hub-preview">
                      {pages.slice(0, PREVIEW_COUNT).map((p, i) => (
                        <span key={p.slug}>
                          {i > 0 && ", "}
                          <Link href={`/resources/${p.slug}`}>{p.title}</Link>
                        </span>
                      ))}
                      {pages.length > PREVIEW_COUNT && (
                        <>
                          {", and "}
                          <Link href={`/resources/${hub.slug}`}>{pages.length - PREVIEW_COUNT} more</Link>
                        </>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
