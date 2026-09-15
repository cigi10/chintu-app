// lib/resources.js
//
// Metadata for the standalone reference pages under app/resources/<slug>/.
// Unlike lib/blogPosts.js, resource pages are hand-written React pages
// (see app/resources/divisibility-rules/page.tsx) rather than JSON content,
// since these are one-off study reference pages, not a content feed. Add
// an entry here whenever a new resource page is created, so it shows up
// on the /resources index and in app/sitemap.ts.
export const RESOURCES = [
  {
    slug: "divisibility-rules",
    title: "Divisibility Rules",
    description: "Quick tests to check whether a number is divisible by 2 through 12, with worked examples.",
  },
  {
    slug: "squares-and-cubes",
    title: "Squares and Cubes Reference",
    description: "A quick-reference table of squares from 1 to 30 and cubes from 1 to 20.",
  },
  {
    slug: "percentage-shortcuts",
    title: "Percentage Shortcuts",
    description: "Common percentage calculation shortcuts and mental math tricks with worked examples.",
  },
  {
    slug: "unit-conversions",
    title: "Unit Conversions Reference",
    description: "Common unit conversions for physics and chemistry: length, mass, time, energy, and SI prefixes.",
  },
];

export function getAllResources() {
  return RESOURCES;
}

export function getResourceSlugs() {
  return RESOURCES.map(resource => resource.slug);
}
