import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getAllResources } from "@/lib/resources";

// Resource pages are hand-written, one file each, so nothing structural
// stops a new one from shipping without its canonical or sitemap date.
// These checks are that guard.
describe("resource pages", () => {
  it("each sets a self-referencing canonical", () => {
    for (const { slug } of getAllResources()) {
      const source = fs.readFileSync(path.join("app", "resources", slug, "page.tsx"), "utf8");
      expect(source, slug).toContain(`alternates: { canonical: "/resources/${slug}" }`);
    }
  });

  it("each has a valid `updated` date for the sitemap", () => {
    for (const { slug, updated } of getAllResources()) {
      expect(updated, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(updated).getTime()), slug).toBe(false);
    }
  });
});
