import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const SITE_URL = "https://www.studyloaf.com";

// Renders both the visible breadcrumb trail (for users) and a matching
// BreadcrumbList JSON-LD block (Google surfaces these directly in search
// results). `items` is the full trail including "Home" and the current
// page — the last item is rendered as plain text, not a link, since it's
// the page you're already on.
export default function Breadcrumbs({ items }) {
  const listItems = items.map((item, i) => ({
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
