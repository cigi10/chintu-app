// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { getWordGameDomainSlugs } from "@/lib/wordGame";
import { generateMetadata as crumbMetadata } from "@/app/games/crumb/[domain]/page";
import { NOINDEX, SITE_URL } from "@/lib/seo";

// Only the pages' metadata is under test; their client widgets pull in
// Supabase, which needs env vars a test run doesn't have.
vi.mock("@/components/CrumbGame", () => ({ default: () => null }));

const paths = sitemap().map(e => e.url.replace(SITE_URL, "") || "/");

// Noindexed pages stay live but must never be listed in the sitemap, and
// must actually carry noindex,follow (not a bare noindex that would stop
// their links being followed).
describe("noindexed pages", () => {
  it("serve every Crumb domain page with noindex,follow and keep it out of the sitemap", async () => {
    for (const domain of getWordGameDomainSlugs()) {
      const meta = await crumbMetadata({ params: Promise.resolve({ domain }) });
      expect(meta.robots, domain).toEqual(NOINDEX);
      expect(paths, domain).not.toContain(`/games/crumb/${domain}`);
    }
    expect(paths).toContain("/games/crumb");
  });
});

describe("sitemap", () => {
  it("has no duplicate URLs", () => {
    expect(new Set(paths).size).toBe(paths.length);
  });
});
