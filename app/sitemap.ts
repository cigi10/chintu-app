import type { MetadataRoute } from "next";
import { getAllBlogPosts, getAllBlogTags } from "@/lib/blogPosts";
import { getResourceSlugs, getAllResourceTags } from "@/lib/resources";
import { getQuizCategorySlugs } from "@/lib/quiz";
import { getWordGameDomainSlugs } from "@/lib/wordGame";
import { getExamSlugs } from "@/lib/examDates";

const BASE_URL = "https://www.studyloaf.com";

const STATIC_ROUTES = ["/", "/blog", "/quiz", "/games", "/games/crumb", "/resources", "/privacy", "/terms", "/tools/timetable-generator", "/countdown"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map(path => ({
    url: `${BASE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
  }));

  const blogEntries = getAllBlogPosts().map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const blogTagEntries = getAllBlogTags().map(tag => ({
    url: `${BASE_URL}/blog/tag/${tag}`,
    lastModified: new Date(),
  }));

  const resourceEntries = getResourceSlugs().map(slug => ({
    url: `${BASE_URL}/resources/${slug}`,
    lastModified: new Date(),
  }));

  const resourceTagEntries = getAllResourceTags().map(tag => ({
    url: `${BASE_URL}/resources/tag/${tag}`,
    lastModified: new Date(),
  }));

  const quizEntries = getQuizCategorySlugs().flatMap(category => [
    { url: `${BASE_URL}/quiz/${category}/daily`, lastModified: new Date() },
    { url: `${BASE_URL}/quiz/${category}/practice`, lastModified: new Date() },
  ]);

  const countdownEntries = getExamSlugs().map(exam => ({
    url: `${BASE_URL}/countdown/${exam}`,
    lastModified: new Date(),
  }));

  const gameEntries = getWordGameDomainSlugs().map(domain => ({
    url: `${BASE_URL}/games/crumb/${domain}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...blogEntries, ...blogTagEntries, ...resourceEntries, ...resourceTagEntries, ...quizEntries, ...countdownEntries, ...gameEntries];
}
