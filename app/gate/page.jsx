import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GateKeyDates, GateThisWeek } from "@/components/GateKeyFacts";
import { getAllBlogPosts } from "@/lib/blogPosts";
import { getResourceBySlug } from "@/lib/resources";
import { GATE_2027_SYLLABI, GATE_2027_SITE, GATE_TOPIC_PAGES } from "@/lib/gate2027";
import "@/styles/blog.css";
import "@/styles/gate.css";

const DESCRIPTION = "GATE 2027 in one place: the official exam weekends, city allotment and results dates, a live countdown, the official 2027 syllabus PDFs, a syllabus tracker, a timetable generator and every Studyloaf GATE guide.";

export const metadata = {
  title: "GATE 2027: Dates, Syllabus and Study Tools - Studyloaf",
  description: DESCRIPTION,
  openGraph: {
    title: "GATE 2027: Dates, Syllabus and Study Tools - Studyloaf",
    description: DESCRIPTION,
  },
  alternates: { canonical: "/gate" },
};

// Re-rendered daily so "what to do this week" keeps up with the calendar.
export const revalidate = 86400;

const TOOLS = [
  { href: "/countdown/gate-2027", title: "GATE 2027 countdown", desc: "Days, hours and minutes to the first exam weekend." },
  { href: "/tools/timetable-generator", title: "Timetable generator", desc: "Build a weekly study plan around college or work." },
  { href: "/tracker", title: "Syllabus tracker", desc: "Tick off topics with packs for GATE CS, ECE, ME and BT." },
];

/** Published posts tagged "gate", newest first. */
function getGatePosts() {
  return getAllBlogPosts().filter(post => (post.tags || []).includes("gate"));
}

export default function GateHubPage() {
  const posts = getGatePosts();
  const topics = GATE_TOPIC_PAGES.map(getResourceBySlug).filter(Boolean);

  return (
    <>
      <Navbar />
      <div className="blog-shell gate-hub">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "GATE 2027", href: "/gate" },
        ]} />
        <div className="blog-header">
          <h1 className="blog-title">GATE 2027: Dates, Syllabus and Study Tools</h1>
          <p className="blog-subtitle">
            The official dates, your branch&apos;s 2027 syllabus and the Studyloaf tools and guides for GATE, on one page.
            GATE 2027 is organised by IIT Madras; always confirm details on the{" "}
            <a href={GATE_2027_SITE} target="_blank" rel="noopener noreferrer">official GATE 2027 website</a>.
          </p>
        </div>

        <GateKeyDates />
        <GateThisWeek />

        <section className="exam-about" aria-labelledby="gate-tools-heading">
          <h2 id="gate-tools-heading" className="exam-about__heading">Study tools</h2>
          <div className="gate-hub__tools">
            {TOOLS.map(tool => (
              <Link key={tool.href} href={tool.href} className="gate-hub__tool">
                <span className="gate-hub__tool-title">{tool.title}</span>
                <span className="gate-hub__tool-desc">{tool.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="exam-about" aria-labelledby="gate-syllabus-heading">
          <h2 id="gate-syllabus-heading" className="exam-about__heading">Official GATE 2027 syllabi</h2>
          <p className="exam-about__p">
            The syllabi were revised for 2027. Work from these official PDFs, published by IIT Madras, rather than an older copy.
          </p>
          <ul className="exam-about__list">
            {GATE_2027_SYLLABI.map(paper => (
              <li key={paper.code}>
                <a href={paper.href} target="_blank" rel="noopener noreferrer">
                  {paper.code}: {paper.name} (PDF)
                </a>
              </li>
            ))}
          </ul>
        </section>

        {topics.length > 0 && (
          <section className="exam-about" aria-labelledby="gate-topics-heading">
            <h2 id="gate-topics-heading" className="exam-about__heading">Topic pages on the GATE 2027 syllabus</h2>
            <p className="exam-about__p">
              Each page says which GATE 2027 syllabus lists the topic and links to it.
            </p>
            <ul className="exam-about__list">
              {topics.map(resource => (
                <li key={resource.slug}><Link href={`/resources/${resource.slug}`}>{resource.title}</Link></li>
              ))}
            </ul>
          </section>
        )}

        {posts.length > 0 && (
          <section className="exam-about" aria-labelledby="gate-posts-heading">
            <h2 id="gate-posts-heading" className="exam-about__heading">GATE guides</h2>
            <ul className="exam-about__list">
              {posts.map(post => (
                <li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}</Link></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
