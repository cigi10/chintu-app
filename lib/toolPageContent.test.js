// @vitest-environment node
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getQuizCategorySlugs } from "@/lib/quiz";
import { getWordGameDomainSlugs, getWordGameDomain } from "@/lib/wordGame";
import { getExamSlugs } from "@/lib/examDates";
import { getQuizPageContent, getCrumbPageContent } from "@/lib/toolPageContent";

const quizPages = getQuizCategorySlugs().flatMap(slug =>
  ["daily", "practice"].map(mode => ({ id: `quiz/${slug}/${mode}`, content: getQuizPageContent(slug, mode) }))
);
const crumbPages = getWordGameDomainSlugs().map(slug => ({ id: `crumb/${slug}`, slug, content: getCrumbPageContent(slug) }));
const allPages = [...quizPages, ...crumbPages];

// Does an internal href point at a page that exists?
function resolves(href) {
  const [, section, a, b] = href.split("/");
  if (section === "quiz") return !a || (getQuizCategorySlugs().includes(a) && ["daily", "practice"].includes(b));
  if (section === "games") return a !== "crumb" || !b || getWordGameDomainSlugs().includes(b);
  if (section === "countdown") return !a || getExamSlugs().includes(a);
  if (section === "resources") return !a || fs.existsSync(path.join("app", "resources", a, "page.tsx")) || fs.existsSync(path.join("content", "resources", `${a}.json`));
  if (section === "blog") return fs.existsSync(path.join("content", "blog", `${a}.json`));
  return false;
}

describe("tool page content", () => {
  it("exists for every quiz page and Crumb domain", () => {
    for (const page of allPages) expect(page.content, page.id).not.toBeNull();
  });

  it("gives every page a unique meta description of a sensible length", () => {
    const descriptions = allPages.map(p => p.content.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const page of allPages) {
      expect(page.content.description.length, page.id).toBeGreaterThan(70);
      expect(page.content.description.length, page.id).toBeLessThanOrEqual(200);
    }
  });

  it("only links to pages that exist", () => {
    for (const page of allPages) {
      for (const link of page.content.related) expect(resolves(link.href), `${page.id} -> ${link.href}`).toBe(true);
    }
  });

  it("never names a Crumb answer on its page", () => {
    for (const page of crumbPages) {
      const text = JSON.stringify(page.content).toUpperCase();
      for (const { term } of getWordGameDomain(page.slug).terms) {
        expect(text.includes(term.toUpperCase()), `${page.id} reveals a term`).toBe(false);
      }
    }
  });

  it("uses no em or en dashes in user-facing copy", () => {
    for (const page of allPages) expect(JSON.stringify(page.content), page.id).not.toMatch(/[–—]/);
  });
});
