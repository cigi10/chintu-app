"use client";
import { usePathname } from "next/navigation";
import TagChips from "@/components/TagChips";
import { getResourceBySlug } from "@/lib/resources";

// Resource pages are 101 individually hand-written files (see
// lib/resources.js's own comment on why), not one shared [slug] template
// like blog posts - editing every single one just to render a tags list
// isn't practical. Injecting from app/resources/layout.jsx instead means
// every resource page picks up its chips automatically, current and
// future, with zero per-page changes. usePathname (rather than a layout
// param) is what makes that possible: this runs client-side and re-reads
// the URL on every navigation, including into resource subpages this
// layout doesn't own the segment for.
export default function ResourceTagsAuto() {
  const pathname = usePathname();
  const match = pathname.match(/^\/resources\/([^/]+)\/?$/);
  if (!match) return null;

  const resource = getResourceBySlug(match[1]);
  if (!resource) return null;

  return (
    <div className="blog-shell resource-tags-shell">
      <TagChips tags={resource.tags} basePath="/resources/tag" />
    </div>
  );
}
