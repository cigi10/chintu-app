import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blogPosts";
import { getAllResources } from "@/lib/resources";
import { getQuizCategorySlugs } from "@/lib/quiz";
import { getWordGameDomainSlugs } from "@/lib/wordGame";
import { getExamSlugs } from "@/lib/examDates";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES = ["/", "/blog", "/quiz", "/games", "/games/crumb", "/resources", "/privacy", "/terms", "/tools/timetable-generator", "/countdown", "/contact"];

// lastModified is only set where there's a real content date behind it
// (a blog post's date, a resource page's `updated`). Stamping every URL
// with the build time would claim the whole site changed on every deploy,
// which teaches Google to ignore the field entirely.
//
// Tag-browse pages (/blog/tag/*, /resources/tag/*) are deliberately left
// out. They're lists of cards that already exist elsewhere, so they only
// belong here once they carry their own distinguishing content (an intro
// per tag, say). The small ones are also noindexed, see
// MIN_INDEXABLE_TAG_SIZE in lib/seo.js.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

  const staticEntries = STATIC_ROUTES.map(path => ({ url: url(path) }));

  const blogEntries = getAllBlogPosts().map(post => ({
    url: url(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
  }));

  const resourceEntries = getAllResources().map(resource => ({
    url: url(`/resources/${resource.slug}`),
    lastModified: new Date(resource.updated),
  }));

  const quizEntries = getQuizCategorySlugs().flatMap(category => [
    { url: url(`/quiz/${category}/daily`) },
    { url: url(`/quiz/${category}/practice`) },
  ]);

  const countdownEntries = getExamSlugs().map(exam => ({ url: url(`/countdown/${exam}`) }));

  const gameEntries = getWordGameDomainSlugs().map(domain => ({ url: url(`/games/crumb/${domain}`) }));

  return [...staticEntries, ...blogEntries, ...resourceEntries, ...quizEntries, ...countdownEntries, ...gameEntries];
}
