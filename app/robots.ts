import type { MetadataRoute } from "next";

const BASE_URL = "https://studyloaf.com";

// Either behind the real-session gate (see lib/routeAccess.js) or, like
// /dashboard, a personalized app view rather than public content, so
// neither is useful for search engines to crawl or index.
const DISALLOWED_ROUTES = ["/dashboard", "/journal", "/mood", "/rooms", "/shop", "/achievements", "/profile"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: DISALLOWED_ROUTES,
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
