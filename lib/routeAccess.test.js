import { describe, it, expect } from "vitest";
import { isGatedPath, GATED_PATHS } from "@/lib/routeAccess";

describe("isGatedPath", () => {
  it("gates each listed path and its subpaths", () => {
    for (const path of GATED_PATHS) {
      expect(isGatedPath(path)).toBe(true);
      expect(isGatedPath(`${path}/sub`)).toBe(true);
    }
  });

  it("does not gate a public path that merely starts with a gated path's string", () => {
    // /shop-items/bowtie.PNG starts with "/shop" as a string, but is a
    // separate, public route (see proxy.ts) — a naive prefix check would
    // wrongly redirect these image requests to /login.
    expect(isGatedPath("/shop-items/bowtie.PNG")).toBe(false);
    expect(isGatedPath("/roomservice")).toBe(false);
    expect(isGatedPath("/moody")).toBe(false);
  });

  it("does not gate unrelated public paths", () => {
    expect(isGatedPath("/dashboard")).toBe(false);
    expect(isGatedPath("/timer")).toBe(false);
  });
});
