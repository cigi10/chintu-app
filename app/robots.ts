import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Behind the real-session gate (see lib/routeAccess.js), so there's
// nothing for a crawler to see. Public-but-personal app views like
// /dashboard are deliberately NOT listed: they carry a noindex meta tag
// instead, and a crawler blocked here would never read it.
const DISALLOWED_ROUTES = ["/journal", "/mood", "/rooms", "/shop", "/achievements", "/profile"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: DISALLOWED_ROUTES,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
