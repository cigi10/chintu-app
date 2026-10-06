// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { getAdsenseClient, adsenseScriptSrc } from "./adsense";

afterEach(() => vi.unstubAllEnvs());

describe("getAdsenseClient", () => {
  it("is off when NEXT_PUBLIC_ADSENSE_CLIENT is unset or malformed", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "");
    expect(getAdsenseClient()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "pub-123");
    expect(getAdsenseClient()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-1234567890123456\"><script>");
    expect(getAdsenseClient()).toBeNull();
  });

  it("returns a well-formed publisher ID", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", " ca-pub-4680201738326151 ");
    expect(getAdsenseClient()).toBe("ca-pub-4680201738326151");
    expect(adsenseScriptSrc("ca-pub-4680201738326151")).toBe(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4680201738326151"
    );
  });
});

// Which routes load AdSense, worked out from the app directory: a page
// gets the script exactly when one of its ancestor layouts renders
// <AdSenseScript />. Only /blog/* and /resources/* may.
const APP = path.join(process.cwd(), "app");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(APP);
const read = f => fs.readFileSync(f, "utf8");
const isLayout = f => /[\\/]layout\.(t|j)sx?$/.test(f);
const isPage = f => /[\\/]page\.(t|j)sx?$/.test(f);
const adLayouts = files.filter(f => isLayout(f) && read(f).includes("<AdSenseScript"));

function routeOf(pageFile) {
  const rel = path.relative(APP, path.dirname(pageFile)).split(path.sep).filter(s => s && !/^\(.*\)$/.test(s));
  return "/" + rel.join("/");
}

function hasAds(pageFile) {
  return adLayouts.some(layout => pageFile.startsWith(path.dirname(layout) + path.sep));
}

describe("AdSense routes", () => {
  const routes = files.filter(isPage).map(f => ({ route: routeOf(f), ads: hasAds(f) }));

  it("loads only from the /blog and /resources layouts", () => {
    expect(adLayouts.map(f => path.relative(APP, f)).sort()).toEqual(["blog/layout.tsx", "resources/layout.jsx"]);
  });

  it("covers every /blog and /resources page and nothing else", () => {
    for (const { route, ads } of routes) {
      const content = route === "/blog" || route.startsWith("/blog/") || route === "/resources" || route.startsWith("/resources/");
      expect(ads, route).toBe(content);
    }
  });

  it("stays off the app routes", () => {
    const byRoute = Object.fromEntries(routes.map(r => [r.route, r.ads]));
    for (const route of ["/", "/onboarding", "/dashboard", "/timer", "/tracker", "/login", "/shop", "/games", "/games/crumb", "/quiz"]) {
      expect(byRoute[route], route).toBe(false);
    }
  });

  // components/AdSenseScript.tsx (the one sanctioned loader) and the
  // ads.txt route are the only places allowed to mention AdSense.
  it("has no other AdSense code anywhere in the app, components or root layout", () => {
    const sources = [...files, ...walk(path.join(process.cwd(), "components"))].filter(f => /\.(t|j)sx?$/.test(f) && !/\.test\./.test(f));
    const offenders = sources.filter(f => /pagead2\.googlesyndication|adsbygoogle/.test(read(f)) && !f.endsWith("ads.txt/route.ts") && !f.endsWith("components/AdSenseScript.tsx"));
    expect(offenders.map(f => path.relative(process.cwd(), f))).toEqual([]);
  });
});
