import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getAllResources, getResourceHubs, getResourcesByHub, getResourceHub } from "@/lib/resources";

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

