// Blog content is stored as one JSON file per post under content/blog/,
// so publishing a new post is just dropping in a new file — no code
// changes needed even at hundreds/thousands of posts. Each file's `slug`
// must match its filename and stay stable once published (it's the
// permalink) — treat renaming a slug as a breaking change.
//
// This module uses Node's `fs`/`path` to read that directory at call time,
// so it must only ever be imported from server-side code (Server
// Components, route handlers, generateStaticParams/generateMetadata) —
// never from a "use client" component.
//
// `relatedResourceSlug` (optional, matches a lib/resources.js entry's
// `slug`) is a manually-curated cross-link, rendered as "Related
// Resources" at the bottom of the post (see app/blog/[slug]/page.tsx).
// Only set it where a resource page is genuinely topically related to
// the post — omit it otherwise rather than forcing an unrelated link.

import fs from "fs";
import path from "path";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/** Reads and parses every *.json file in content/blog/ into post objects. */
function readAllPosts() {
  let filenames;
  try {
    filenames = fs.readdirSync(BLOG_CONTENT_DIR);
  } catch {
    return [];
  }

  return filenames
    .filter(name => name.endsWith(".json"))
    .map(name => {
      const raw = fs.readFileSync(path.join(BLOG_CONTENT_DIR, name), "utf8");
      return JSON.parse(raw);
    });
}

/** All posts, newest first by `date`. */
function getAllBlogPosts() {
  return readAllPosts().sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Look up a single post by slug. Returns `undefined` if no post matches,
 * so callers (e.g. the [slug] route) can trigger notFound() explicitly
 * rather than rendering a half-populated page.
 */
export function getBlogPost(slug) {
  return readAllPosts().find(post => post.slug === slug);
}

/** All post slugs, used to pre-render every post at build time. */
export function getBlogSlugs() {
  return getAllBlogPosts().map(post => post.slug);
}

export { getAllBlogPosts };
