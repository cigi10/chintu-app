// lib/seo.js
//
// Shared crawl/index settings, so app/sitemap.ts, app/robots.ts, and the
// per-page metadata all agree on the same values.

// The one canonical origin. The apex domain and http:// both redirect here
// at the host level, so every canonical URL and sitemap entry uses it.
export const SITE_URL = "https://www.studyloaf.com";

// A tag-browse page is only a list of cards that already exist elsewhere,
// so with just one or two items it's a thin near-duplicate of those pages.
// Below this size a tag page is noindexed (links still followed) and kept
// out of the sitemap.
export const MIN_INDEXABLE_TAG_SIZE = 3;

// For pages that shouldn't appear in search results (thin tag pages,
// personal app views, the auth flow) but whose links are still worth
// following.
export const NOINDEX = { index: false, follow: true };
