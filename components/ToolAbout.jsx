import Link from "next/link";
import "@/styles/tool-about.css";

// Server-rendered "about this tool" section under an interactive quiz or
// game, so the page has real, crawlable text describing what it covers.
// Content comes from lib/toolPageContent.js.
export default function ToolAbout({ content }) {
  if (!content) return null;
  return (
    <section className="tool-about" aria-labelledby="tool-about-heading">
      <h2 id="tool-about-heading" className="tool-about__heading">{content.heading}</h2>
      <p className="tool-about__p">{content.intro}</p>

      <h3 className="tool-about__subheading">{content.coversHeading}</h3>
      <ul className="tool-about__list">
        {content.covers.map(item => <li key={item}>{item}</li>)}
      </ul>

      <p className="tool-about__p">{content.howItWorks}</p>

      {content.related.length > 0 && (
        <>
          <h3 className="tool-about__subheading">Keep going</h3>
          <ul className="tool-about__links">
            {content.related.map(link => (
              <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
