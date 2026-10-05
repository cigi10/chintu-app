import { notFound } from "next/navigation";
import CrumbGame from "@/components/CrumbGame";
import ToolAbout from "@/components/ToolAbout";
import { getWordGameDomain, getWordGameDomainSlugs } from "@/lib/wordGame";
import { getCrumbPageContent } from "@/lib/toolPageContent";
import { NOINDEX } from "@/lib/seo";

export function generateStaticParams() {
  return getWordGameDomainSlugs().map(domain => ({ domain }));
}

export async function generateMetadata({ params }) {
  const { domain: slug } = await params;
  const domain = getWordGameDomain(slug);
  if (!domain) return {};
  const description = getCrumbPageContent(slug)?.description;
  return {
    title: `Crumb: ${domain.label} - Studyloaf`,
    description,
    openGraph: { title: `Crumb: ${domain.label} - Studyloaf`, description },
    alternates: { canonical: `/games/crumb/${domain.slug}` },
    // Each domain's bank is only a handful of terms, and most of the page
    // copy is shared across domains, so these stay out of search (and the
    // sitemap) until the banks grow. /games/crumb itself stays indexed and
    // links here, and these pages' own links are still followed.
    robots: NOINDEX,
  };
}

export default async function CrumbDomainPage({ params }) {
  const { domain: slug } = await params;
  const domain = getWordGameDomain(slug);
  if (!domain) notFound();

  return (
    <div className="crumb-domain-page">
      {/* Today's puzzle. A future second game type for this domain (e.g.
          an equation-guessing puzzle) would add its own sibling section
          here rather than replacing this one. */}
      <section className="crumb-domain-game-section">
        {/* Only the slug and label go to the client. The terms stay on the
            server; the game fetches today's puzzle from /api/crumb. */}
        <CrumbGame domain={{ slug: domain.slug, label: domain.label }} />
      </section>
      <ToolAbout content={getCrumbPageContent(slug)} />
    </div>
  );
}
