// lib/internalTraffic.js
//
// Marks the site owner's own visits as internal so GA4 can filter them
// out. Visiting any page with ?internal=1 sets a flag in this browser's
// localStorage, ?internal=0 clears it, and while it's set every GA hit
// (page_view included) carries traffic_type: "internal", which GA4's
// "Internal traffic" data filter matches on.
//
// initInternalTraffic runs as an inline <head> script (see
// components/ThirdPartyScripts.tsx) so it executes before GA's config call
// sends the first page_view. It's serialized with toString(), so it must
// stay self-contained (no imports, no outer variables) and use only syntax
// every supported browser runs untranspiled. The key
// is repeated inside it for that reason; INTERNAL_KEY must match.

export const INTERNAL_KEY = "studyloaf-internal";

export function initInternalTraffic(win) {
  try {
    var key = "studyloaf-internal";
    var value = new win.URLSearchParams(win.location.search).get("internal");
    if (value === "1") win.localStorage.setItem(key, "1");
    else if (value === "0") win.localStorage.removeItem(key);
    if (win.localStorage.getItem(key) !== "1") return;
    win.dataLayer = win.dataLayer || [];
    // gtag only processes Arguments objects, so push through the same
    // wrapper GA's own init script defines.
    var gtag = function () { win.dataLayer.push(arguments); };
    gtag("set", { traffic_type: "internal" });
  } catch {}
}

export const internalTrafficScript = `(${initInternalTraffic.toString()})(window);`;

// lib/analytics.js also adds traffic_type to each custom event directly,
// so those stay marked even if the head script's "set" were ever lost.
export function isInternalVisitor() {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(INTERNAL_KEY) === "1";
  } catch {
    return false;
  }
}
