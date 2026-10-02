"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORD_GAME_DOMAIN_META } from "@/lib/wordGameDomains";

// Lets you jump straight from one domain's puzzle to another without
// going back through the /games/crumb overview - the piece that keeps
// Crumb feeling like one game across its per-domain routes. Reads the
// active domain from the URL client-side rather than through layout
// params, since a layout at this segment would re-render on every switch
// anyway; usePathname keeps this in one small client component instead.
export default function CrumbDomainTabs() {
  const pathname = usePathname();
  return (
    <nav className="crumb-tabs" aria-label="Crumb domains">
      {WORD_GAME_DOMAIN_META.map(domain => {
        const active = pathname === `/games/crumb/${domain.slug}`;
        return (
          <Link
            key={domain.slug}
            href={`/games/crumb/${domain.slug}`}
            className={`crumb-tab${active ? " crumb-tab--active" : ""}`}
          >
            {domain.label}
          </Link>
        );
      })}
    </nav>
  );
}
