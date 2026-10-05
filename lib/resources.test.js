import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import katex from "katex";
import { getAllResources, getResourceHubs, getResourcesByHub, getResourceHub, getResourceBySlug } from "@/lib/resources";
import { getResourceContent, getResourceContentSlugs } from "@/lib/resourceContent";
import { getBlogSlugs } from "@/lib/blogPosts";
import { getExamSlugs } from "@/lib/examDates";

const handWritten = slug => fs.existsSync(path.join("app", "resources", slug, "page.tsx"));
const jsonSlugs = new Set(getResourceContentSlugs());

// Resource pages are either hand-written (app/resources/<slug>/page.tsx)
// or JSON rendered by app/resources/[slug] (content/resources/<slug>.json).
// Nothing structural stops a hand-written one from shipping without its
// canonical or sitemap date, and a JSON one can only be checked here, so
// these tests are that guard.
describe("resource pages", () => {
  it("each exists in exactly one form", () => {
    for (const { slug } of getAllResources()) {
      expect(handWritten(slug) !== jsonSlugs.has(slug), slug).toBe(true);
    }
  });

  it("each hand-written page sets a self-referencing canonical", () => {
    for (const { slug } of getAllResources().filter(r => handWritten(r.slug))) {
      const source = fs.readFileSync(path.join("app", "resources", slug, "page.tsx"), "utf8");
      expect(source, slug).toContain(`alternates: { canonical: "/resources/${slug}" }`);
    }
  });

  it("each one marked noindex serves noindex,follow and stays out of the sitemap", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const urls = sitemap().map(e => e.url);
    const marked = getAllResources().filter(r => r.noindex);
    expect(marked.map(r => r.slug)).toContain("math-olympiad-grade-7");
    for (const { slug } of marked) {
      expect(urls.some(u => u.endsWith(`/resources/${slug}`)), slug).toBe(false);
      const source = fs.readFileSync(path.join("app", "resources", slug, "page.tsx"), "utf8");
      expect(source, slug).toContain("robots: NOINDEX");
    }
  });

  it("each has a valid `updated` date for the sitemap", () => {
    for (const { slug, updated } of getAllResources()) {
      expect(updated, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(updated).getTime()), slug).toBe(false);
    }
  });
});

describe("resource hubs", () => {
  const slugs = new Set(getAllResources().map(r => r.slug));

  it("gives every resource a hub that exists", () => {
    for (const r of getAllResources()) expect(getResourceHub(r.hub), r.slug).toBeTruthy();
  });

  it("never reuses a resource slug (or 'tag') as a hub slug", () => {
    for (const hub of getResourceHubs()) {
      expect(slugs.has(hub.slug), hub.slug).toBe(false);
      expect(hub.slug).not.toBe("tag");
    }
  });

  it("gives every hub at least two pages and its own description", () => {
    const descriptions = new Set();
    for (const hub of getResourceHubs()) {
      expect(getResourcesByHub(hub.slug).length, hub.slug).toBeGreaterThanOrEqual(2);
      expect(descriptions.has(hub.description), hub.slug).toBe(false);
      descriptions.add(hub.description);
    }
  });

  it("points each hand-written page's breadcrumb at its hub", () => {
    for (const r of getAllResources()) {
      const file = path.join("app", "resources", r.slug, "page.tsx");
      if (!fs.existsSync(file)) continue; // migrated to JSON: breadcrumb is generated
      expect(fs.readFileSync(file, "utf8"), r.slug).toContain(`href: "/resources/${r.hub}" }`);
    }
  });
});

// Inline maths, bold and links inside a rich-text string.
function richParts(text) {
  const plain = text.replace(/\\\$/g, "");
  const dollars = (plain.match(/\$/g) || []).length;
  const math = [...plain.matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
  const links = [...plain.matchAll(/\]\(([^)]+)\)/g)].map(m => m[1]);
  const outside = plain.replace(/\$[^$]*\$/g, "");
  return { dollars, math, links, outside };
}

function* richStrings(content) {
  if (content.h1) yield content.h1;
  for (const section of content.sections) {
    if (section.heading) yield section.heading;
    for (const block of section.blocks) {
      if (block.p) yield block.p;
      for (const item of block.list ?? block.steps ?? []) yield item;
      if (block.table) {
        yield* block.table.columns;
        for (const row of block.table.rows) yield* row;
        if (block.table.caption) yield block.table.caption;
      }
      if (block.figure?.caption) yield block.figure.caption;
    }
  }
  if (content.exam?.note) yield content.exam.note;
  if (content.related?.intro) yield content.related.intro;
  for (const link of content.related?.links ?? []) yield link.label;
}

describe("JSON resource content", () => {
  const all = [...jsonSlugs].map(slug => getResourceContent(slug));
  const BLOCK_KINDS = ["p", "math", "list", "steps", "table", "figure"];

  it("matches a registry entry and has a valid publish date", () => {
    for (const content of all) {
      expect(getResourceBySlug(content.slug), content.slug).toBeTruthy();
      expect(Number.isNaN(new Date(content.datePublished).getTime()), content.slug).toBe(false);
    }
  });

  it("gives every block exactly one known kind", () => {
    for (const content of all) {
      expect(content.sections.length, content.slug).toBeGreaterThan(0);
      for (const section of content.sections) {
        expect(section.blocks.length, `${content.slug}: ${section.heading}`).toBeGreaterThan(0);
        for (const block of section.blocks) {
          expect(Object.keys(block), `${content.slug}: ${JSON.stringify(block).slice(0, 80)}`).toHaveLength(1);
          expect(BLOCK_KINDS, content.slug).toContain(Object.keys(block)[0]);
        }
      }
    }
  });

  it("has balanced markup and LaTeX that KaTeX can parse", () => {
    const parse = (expr, displayMode, where) => {
      expect(() => katex.renderToString(expr, { throwOnError: true, displayMode }), `${where}: ${expr}`).not.toThrow();
    };
    for (const content of all) {
      for (const text of richStrings(content)) {
        const { dollars, math, outside } = richParts(text);
        expect(dollars % 2, `${content.slug}: unbalanced $ in ${text}`).toBe(0);
        expect((outside.match(/\*\*/g) || []).length % 2, `${content.slug}: unbalanced ** in ${text}`).toBe(0);
        for (const expr of math) parse(expr, false, content.slug);
      }
      for (const section of content.sections) {
        for (const block of section.blocks) if (block.math) parse(block.math, true, content.slug);
      }
    }
  });

  it("never uses an em dash in rendered copy", () => {
    for (const content of all) {
      for (const text of richStrings(content)) expect(richParts(text).outside, content.slug).not.toContain("\u2014");
    }
  });

  it("only uses figure names that exist", async () => {
    const { BLOG_FIGURES } = await import("@/components/blog-figures");
    for (const content of all) {
      for (const section of content.sections) {
        for (const block of section.blocks) {
          if (block.figure) expect(BLOG_FIGURES[block.figure.name], `${content.slug}: ${block.figure.name}`).toBeDefined();
        }
      }
    }
  });

  it("gives every exam block a note and at least one real countdown", () => {
    const exams = new Set(getExamSlugs());
    for (const content of all.filter(c => c.exam)) {
      expect(content.exam.note.length, content.slug).toBeGreaterThan(40);
      expect(content.exam.countdowns.length, content.slug).toBeGreaterThan(0);
      for (const slug of content.exam.countdowns) expect(exams.has(slug), `${content.slug}: ${slug}`).toBe(true);
    }
  });

  // The Phase 0 standard for the physics and electronics pages that get
  // search impressions: a worked example, common mistakes and an exam note.
  it("holds physics and electronics pages to the worked-example, mistakes and exam-note standard", () => {
    for (const content of all) {
      const { hub } = getResourceBySlug(content.slug);
      if (hub !== "physics" && hub !== "electrical-electronics") continue;
      const headings = content.sections.map(s => s.heading ?? "");
      expect(headings.some(h => /worked example/i.test(h)), content.slug).toBe(true);
      expect(headings, content.slug).toContain("Common mistakes");
      expect(content.exam, content.slug).toBeDefined();
    }
  });

  it("only links to pages that exist", () => {
    const blog = new Set(getBlogSlugs());
    const resolves = href => {
      const m = href.match(/^\/(resources|blog)\/([a-z0-9-]+)$/);
      if (!m) return false;
      return m[1] === "blog" ? blog.has(m[2]) : Boolean(getResourceBySlug(m[2]) || getResourceHub(m[2]));
    };
    for (const content of all) {
      const hrefs = [...(content.related?.links ?? []).map(l => l.href)];
      for (const text of richStrings(content)) hrefs.push(...richParts(text).links);
      for (const href of hrefs) expect(resolves(href), `${content.slug}: ${href}`).toBe(true);
      expect(hrefs, content.slug).not.toContain(`/resources/${content.slug}`);
    }
  });
});
