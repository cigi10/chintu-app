// @vitest-environment node
import { describe, it, expect } from "vitest";
import { getAllBlogPosts } from "@/lib/blogPosts";

// Posts are hand-written JSON, so this is the guard that every content
// section matches what app/blog/[slug]/page.tsx knows how to render.
describe("blog post content", () => {
  const posts = getAllBlogPosts();

  it("finds the posts", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it("gives every section exactly one of body, list or table", () => {
    for (const post of posts) {
      post.content.forEach((section, i) => {
        const kinds = ["body", "list", "table"].filter(k => section[k] !== undefined);
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
});
