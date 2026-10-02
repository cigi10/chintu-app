// lib/blogViews.js
//
// Shared rules for the blog view counter, used by both the server route
// (app/api/blog-views/[slug]/route.ts) and the display component
// (components/BlogViewCount.jsx).

// Below this, the count isn't shown at all, so a brand-new post doesn't
// look unpopular.
export const MIN_DISPLAYED_VIEWS = 10;

// A visitor counts once per post per 24 hours. Refreshes inside that
// window read the count without incrementing it.
export const VIEW_DEDUP_SECONDS = 60 * 60 * 24;

// One cookie per post, scoped to the API route's path so it is never sent
// with ordinary page requests.
export const VIEW_COOKIE_PATH = "/api/blog-views";

export function viewCookieName(slug) {
  return `bv_${slug}`;
}

/** "1,204 views", or null when the count shouldn't be shown. */
export function formatViewCount(views) {
  if (typeof views !== "number" || views < MIN_DISPLAYED_VIEWS) return null;
  return `${views.toLocaleString("en-US")} views`;
}
