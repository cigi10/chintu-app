// Resource pages migrated to JSON live in content/resources/<slug>.json and
// are rendered by app/resources/[slug]/page.tsx. The page's title,
// description, hub, tags and `updated` date stay in lib/resources.js (the
// registry the index, hubs, sitemap and tag pages already read), so the
// JSON holds only the page body.
//
// Uses fs, so server-only, like lib/blogPosts.js. lib/resources.test.js
// checks every file against the shape below.
//
// {
//   "slug": "chain-rule",
//   "datePublished": "2026-09-16",
//   "h1": "optional rich-text heading, when the plain title can't show it",
//   "sections": [{ "heading": "The rule" | null, "blocks": [
//     { "p": "rich text" }            components/RichText.tsx markup
//     { "math": "\\LaTeX" }           display maths
//     { "list": ["rich text"] }       bulleted
//     { "steps": ["rich text"] }      numbered
//     { "table": BlogTableData }      cells are rich text
//     { "figure": { "name", "caption" } }  components/blog-figures
//   ]}],
//   "exam": { "note": "rich text", "countdowns": ["gate-2027"] },  optional
//   "related": { "intro": "rich text", "links": [{ "label", "href" }] }
// }

import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content", "resources");

export function getResourceContentSlugs() {
  try {
    return fs.readdirSync(DIR).filter(n => n.endsWith(".json")).map(n => n.slice(0, -5));
  } catch {
    return [];
  }
}

export function getResourceContent(slug) {
  const file = path.join(DIR, `${slug}.json`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
