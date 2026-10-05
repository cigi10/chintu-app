import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Katex from "@/components/Katex";
import RichText from "@/components/RichText";
import BlogTable, { type BlogTableData } from "@/components/BlogTable";
import { BlogFigure, type BlogFigureData } from "@/components/BlogFigure";
import { getResourceHubs, getResourceHub, getResourcesByHub, getResourceBySlug } from "@/lib/resources";
import { getResourceContent, getResourceContentSlugs } from "@/lib/resourceContent";
import { getExamBySlug } from "@/lib/examDates";
import { NAV } from "@/lib/navItems";
import "@/styles/blog.css";

// /resources/<slug> serves two kinds of page:
//   - subject hubs (e.g. /resources/math-calculus), from RESOURCE_HUBS
//   - resource pages migrated to JSON (content/resources/<slug>.json)
// Resource pages still hand-written in their own app/resources/<slug>/
// folder take precedence over this dynamic route. Hub slugs are checked
// never to collide with a resource slug, and anything else 404s.
type PageProps = {
  params: Promise<{ slug: string }>;
};

type Block =
  | { p: string }
  | { math: string }
  | { list: string[] }
  | { steps: string[] }
  | { table: BlogTableData }
  | { figure: BlogFigureData };

type ResourceContent = {
  slug: string;
  datePublished: string;
  h1?: string;
  sections: { heading: string | null; blocks: Block[] }[];
  // Which exams test this topic, and the countdowns to link (lib/examDates
  // slugs). Rendered as a standard section that also points at the
  // timetable generator and tracker, so every page planning-links the same way.
  exam?: { note: string; countdowns: string[] };
  related?: { intro?: string; links: { label: string; href: string }[] };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...getResourceHubs().map(hub => ({ slug: hub.slug })),
    ...getResourceContentSlugs().map(slug => ({ slug })),
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const hub = getResourceHub(slug);
  if (hub) {
    const title = `${hub.title} Resources - Studyloaf`;
    return {
      title,
      description: hub.description,
      openGraph: { title, description: hub.description },
      alternates: { canonical: `/resources/${hub.slug}` },
    };
  }
  const resource = getResourceBySlug(slug);
  if (!resource || !getResourceContent(slug)) return {};
  const title = `${resource.title} - Studyloaf`;
  return {
    title,
    description: resource.description,
    openGraph: { title, description: resource.description },
    alternates: { canonical: `/resources/${resource.slug}` },
  };
}

export default async function ResourceSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const hub = getResourceHub(slug);
  if (hub) return <HubPage slug={hub.slug} />;
  const resource = getResourceBySlug(slug);
  const content = getResourceContent(slug) as ResourceContent | undefined;
  if (!resource || !content) notFound();
  return <ResourcePage slug={slug} content={content} />;
}

function HubPage({ slug }: { slug: string }) {
  const hub = getResourceHub(slug)!;
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

const renderCell = (cell: string) => <RichText text={cell} />;

function ResourcePage({ slug, content }: { slug: string; content: ResourceContent }) {
  const resource = getResourceBySlug(slug)!;
  const hub = getResourceHub(resource.hub)!;

  return (
    <>
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["Article", "LearningResource"],
        headline: resource.title,
        description: resource.description,
        datePublished: content.datePublished,
        dateModified: resource.updated,
        author: { "@type": "Organization", name: "Studyloaf Team" },
      }} />
      <div className="blog-shell">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: hub.title, href: `/resources/${hub.slug}` },
          { label: resource.title, href: `/resources/${resource.slug}` },
        ]} />
        <article className="blog-post">
          <h1 className="blog-post-title">
            {content.h1 ? <RichText text={content.h1} /> : resource.title}
          </h1>

          {content.sections.map((section, i) => (
            <div key={i} className="blog-post-section resource-section">
              {section.heading && (
                <h2 className="blog-post-heading"><RichText text={section.heading} /></h2>
              )}
              {section.blocks.map((block, j) => (
                <ContentBlock key={j} block={block} id={`${slug}-${i}-${j}`} />
              ))}
            </div>
          ))}

          {content.exam && <ExamSection exam={content.exam} />}

          {content.related && content.related.links.length > 0 && (
            <div className="blog-post-related">
              <h2 className="blog-post-heading">Continue learning</h2>
              {content.related.intro && (
                <p className="blog-post-p"><RichText text={content.related.intro} /></p>
              )}
              <ul className="blog-post-related-list">
                {content.related.links.map(link => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
    </>
  );
}

function ExamSection({ exam }: { exam: NonNullable<ResourceContent["exam"]> }) {
  const countdowns = exam.countdowns.map(slug => getExamBySlug(slug)!);
  return (
    <div className="blog-post-section resource-section">
      <h2 className="blog-post-heading">Where this comes up in exams</h2>
      <p className="blog-post-p"><RichText text={exam.note} /></p>
      <ul className="blog-post-list">
        <li>
          Fit it into your week with the free{" "}
          <Link href={NAV.timetableGenerator.href}>timetable generator</Link>.
        </li>
        <li>
          Mark it off as you revise in the <Link href={NAV.tracker.href}>syllabus tracker</Link>.
        </li>
        <li>
          See how long you have left:{" "}
          {countdowns.map((countdown, i) => (
            <span key={countdown.slug}>
              {i > 0 && (i === countdowns.length - 1 ? " and " : ", ")}
              <Link href={`/countdown/${countdown.slug}`}>{countdown.name} countdown</Link>
            </span>
          ))}
          .
        </li>
      </ul>
    </div>
  );
}

function ContentBlock({ block, id }: { block: Block; id: string }) {
  if ("p" in block) return <p className="blog-post-p"><RichText text={block.p} /></p>;
  if ("math" in block) return <Katex display>{block.math}</Katex>;
  if ("list" in block) {
    return (
      <ul className="blog-post-list">
        {block.list.map((item, k) => <li key={k}><RichText text={item} /></li>)}
      </ul>
    );
  }
  if ("steps" in block) {
    return (
      <ol className="blog-post-list">
        {block.steps.map((item, k) => <li key={k}><RichText text={item} /></li>)}
      </ol>
    );
  }
  if ("table" in block) return <BlogTable table={block.table} id={id} renderCell={renderCell} />;
  return <BlogFigure figure={block.figure} />;
}
