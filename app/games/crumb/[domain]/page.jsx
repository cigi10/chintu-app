import { notFound } from "next/navigation";
import CrumbGame from "@/components/CrumbGame";
import { getWordGameDomain, getWordGameDomainSlugs } from "@/lib/wordGame";

export function generateStaticParams() {
  return getWordGameDomainSlugs().map(domain => ({ domain }));
}

export async function generateMetadata({ params }) {
  const { domain: slug } = await params;
  const domain = getWordGameDomain(slug);
  if (!domain) return {};
  return {
    title: `Crumb: ${domain.label} - Studyloaf`,
    description: `Today's ${domain.label} term-guessing challenge. One puzzle a day, colored letter feedback, real ${domain.label} terminology.`,
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
        <CrumbGame domain={domain} />
      </section>
    </div>
  );
}
