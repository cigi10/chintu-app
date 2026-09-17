import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const SITE_URL = "https://www.studyloaf.com";

// Renders both the visible breadcrumb trail (for users) and a matching
// BreadcrumbList JSON-LD block (Google surfaces these directly in search
// results). `items` is the full trail including "Home" and the current
// page — the last item is rendered as plain text, not a link, since it's
// the page you're already on.
//
// Google requires every ListItem to have both `name` and `item` (a URL),
// except the very last one, which may omit `item` since it represents
// the current page. Some visible trails include a level with no real URL
// of its own — e.g. a category label like "Math" that's just a grouping
// on the /resources index, not a standalone page — so those levels are
// included in the rendered <nav> for context but left out of the
// structured data entirely, which keeps every schema ListItem valid
// without inventing a URL for something that isn't actually a page.
export default function Breadcrumbs({ items }) {
  const lastItem = items[items.length - 1];
  const schemaItems = items.filter(item => item.href);
  if (lastItem && !lastItem.href) schemaItems.push(lastItem);

  const listItems = schemaItems.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.label,
    ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: listItems,
        }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={item.label} className="breadcrumbs__item">
              {isLast || !item.href ? (
                <span className="breadcrumbs__current" aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href} className="breadcrumbs__link">{item.label}</Link>
              )}
              {!isLast && <span className="breadcrumbs__sep" aria-hidden="true">›</span>}
            </span>
          );
        })}
      </nav>
    </>
  );
}
