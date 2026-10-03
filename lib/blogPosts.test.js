// @vitest-environment node
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getAllBlogPosts } from "@/lib/blogPosts";
import { getExamSlugs } from "@/lib/examDates";
import { getQuizCategorySlugs } from "@/lib/quiz";
import { getBlogCategories, getBlogCategory } from "@/lib/blogCategories";

// Posts are hand-written JSON, so this is the guard that every content
// section matches what app/blog/[slug]/page.tsx knows how to render.
describe("blog post content", () => {
  const posts = getAllBlogPosts();

  it("finds the posts", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it("gives every section exactly one of body, list, table, figure or image", () => {
    for (const post of posts) {
      post.content.forEach((section, i) => {
        const kinds = ["body", "list", "table", "figure", "image"].filter(k => section[k] !== undefined);
        expect(kinds, `${post.slug} section ${i}`).toHaveLength(1);
      });
    }
  });

  it("keeps every table row the same width as its header", () => {
    for (const post of posts) {
      post.content.forEach((section, i) => {
        if (!section.table) return;
        const { columns, rows } = section.table;
        expect(columns.length, `${post.slug} section ${i} columns`).toBeGreaterThan(0);
        expect(rows.length, `${post.slug} section ${i} rows`).toBeGreaterThan(0);
        for (const row of rows) {
          expect(row, `${post.slug} section ${i}`).toHaveLength(columns.length);
          for (const cell of row) expect(typeof cell).toBe("string");
        }
      });
    }
  });

  it("only uses figure names that exist", async () => {
    const { BLOG_FIGURES } = await import("@/components/blog-figures");
    for (const post of posts) {
      for (const section of post.content) {
        if (section.figure) expect(BLOG_FIGURES[section.figure.name], `${post.slug}: ${section.figure.name}`).toBeDefined();
      }
    }
  });

  it("only uses images that exist in /public, with alt text and dimensions", () => {
    for (const post of posts) {
      for (const section of post.content) {
        if (!section.image) continue;
        const { src, alt, width, height } = section.image;
        expect(fs.existsSync(path.join("public", src)), `${post.slug}: ${src}`).toBe(true);
        expect(alt, `${post.slug}: ${src} alt`).toBeTruthy();
        expect(width > 0 && height > 0, `${post.slug}: ${src} size`).toBe(true);
      }
    }
  });

  it("only links to pages that exist", () => {
    const slugs = new Set(posts.map(p => p.slug));
    for (const post of posts) {
      for (const { href } of post.relatedLinks ?? []) {
        const [, section, a, b] = href.split("/");
        const ok =
          (section === "blog" && slugs.has(a)) ||
          (section === "resources" && fs.existsSync(path.join("app", "resources", a, "page.tsx"))) ||
          (section === "countdown" && (!a || getExamSlugs().includes(a))) ||
          (section === "quiz" && getQuizCategorySlugs().includes(a) && ["daily", "practice"].includes(b)) ||
          (section === "games" && (!b || fs.existsSync(path.join("content", "wordgame", `${b}.json`)))) ||
          (section === "tools" && fs.existsSync(path.join("app", "tools", a)));
        expect(ok, `${post.slug} -> ${href}`).toBe(true);
      }
    }
  });

  it("gives any updated date a valid ISO date no earlier than the publish date", () => {
    for (const post of posts) {
      if (post.updated === undefined) continue;
      expect(post.updated, post.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.updated >= post.date, post.slug).toBe(true);
    }
  });

  it("puts every post in exactly one existing subject hub, and no hub is thin", () => {
    for (const post of posts) expect(getBlogCategory(post.category), post.slug).toBeTruthy();
    for (const c of getBlogCategories()) {
      expect(posts.filter(p => p.category === c.slug).length, c.slug).toBeGreaterThanOrEqual(3);
    }
  });
});
