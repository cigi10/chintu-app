// @vitest-environment node
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import nextConfig from "@/next.config";
import sitemap from "@/app/sitemap";
import { getResourceBySlug, getResourceHub } from "@/lib/resources";
import { SITE_URL } from "@/lib/seo";

const redirects = await nextConfig.redirects();
const sources = new Set(redirects.map(r => r.source));
const sitemapPaths = new Set(sitemap().map(e => e.url.replace(SITE_URL, "") || "/"));

// Does a redirect destination point at a page that exists?
function resolves(dest) {
  const [, section, slug] = dest.split("/");
  if (dest === "/") return true;
  if (section === "resources") return Boolean(getResourceBySlug(slug) || getResourceHub(slug));
  if (section === "blog") return fs.existsSync(path.join("content", "blog", `${slug}.json`));
  // Anything else (e.g. /games/crumb/<domain>) must be in the sitemap.
  return sitemapPaths.has(dest);
}

// Merged and moved pages redirect permanently. Google follows chains, but
// each extra hop costs crawl budget and dilutes the signal, so every
// redirect has to land on a live page in exactly one hop.
describe("redirects", () => {
  it("are all permanent", () => {
    for (const r of redirects) expect(r.permanent, r.source).toBe(true);
  });

  it("resolve in one hop: no destination is itself redirected", () => {
    for (const r of redirects) expect(sources.has(r.destination), `${r.source} -> ${r.destination}`).toBe(false);
  });

  it("land on a page that exists", () => {
    for (const r of redirects) expect(resolves(r.destination), `${r.source} -> ${r.destination}`).toBe(true);
  });

  it("keep their old URLs out of the sitemap", () => {
    for (const r of redirects) expect(sitemapPaths.has(r.source), r.source).toBe(false);
  });

  it("aren't shadowed by a page still living at the old URL", () => {
    for (const r of redirects) {
      const [, section, slug] = r.source.split("/");
      if (section !== "resources") continue;
      expect(getResourceBySlug(slug), r.source).toBeUndefined();
      expect(fs.existsSync(path.join("app", "resources", slug)), r.source).toBe(false);
    }
  });
});
