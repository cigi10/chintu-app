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

export default async function WordGameDomainPage({ params }) {
  const { domain: slug } = await params;
  const domain = getWordGameDomain(slug);
  if (!domain) notFound();

  return <CrumbGame domain={domain} />;
}
