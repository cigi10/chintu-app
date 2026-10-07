import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blogPosts";
import { getBlogCategories } from "@/lib/blogCategories";
import { getAllResources, getResourceHubs } from "@/lib/resources";
import { getQuizCategorySlugs } from "@/lib/quiz";
import { getExamSlugs } from "@/lib/examDates";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES = ["/", "/blog", "/quiz", "/games", "/games/crumb", "/resources", "/privacy", "/terms", "/tools/timetable-generator", "/countdown", "/gate", "/contact", "/tutorial"];

// lastModified is only set where there's a real content date behind it
// (a blog post's `updated` or publish date, a resource page's `updated`). Stamping every URL
// with the build time would claim the whole site changed on every deploy,
// which teaches Google to ignore the field entirely.
//
// Tag-browse pages (/blog/tag/*, /resources/tag/*) are deliberately left
// out. They're lists of cards that already exist elsewhere, so they only
// belong here once they carry their own distinguishing content (an intro
// per tag, say). The small ones are also noindexed, see
// MIN_INDEXABLE_TAG_SIZE in lib/seo.js.
//
// Pages served with noindex are left out too: listing a URL here while
// telling Google not to index it sends mixed signals. That covers the
// Crumb domain pages (/games/crumb/<domain>) and the quiz Daily
// Challenges (/quiz/<category>/daily), plus any resource marked
// `noindex` in lib/resources.js.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

  const staticEntries = STATIC_ROUTES.map(path => ({ url: url(path) }));

  // A post's `updated` date (its last content edit) when it has one,
  // otherwise its publish date.
  const blogEntries = getAllBlogPosts().map(post => ({
    url: url(`/blog/${post.slug}`),
    lastModified: new Date(post.updated ?? post.date),
  }));

  const resourceEntries = getAllResources().filter(resource => !resource.noindex).map(resource => ({
    url: url(`/resources/${resource.slug}`),
    lastModified: new Date(resource.updated),
  }));

  const blogCategoryEntries = getBlogCategories().map(c => ({ url: url(`/blog/category/${c.slug}`) }));

  const hubEntries = getResourceHubs().map(hub => ({ url: url(`/resources/${hub.slug}`) }));

  const quizEntries = getQuizCategorySlugs().map(category => ({ url: url(`/quiz/${category}/practice`) }));

  const countdownEntries = getExamSlugs().map(exam => ({ url: url(`/countdown/${exam}`) }));

  return [...staticEntries, ...blogEntries, ...resourceEntries, ...hubEntries, ...blogCategoryEntries, ...quizEntries, ...countdownEntries];
}
