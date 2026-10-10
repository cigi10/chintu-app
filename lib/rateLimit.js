// lib/rateLimit.js
//
// A small fixed-window rate limiter for public POST routes.
//
// State is in memory, so each server instance counts on its own: on
// Vercel a burst spread across several instances gets a few more tries
// than `limit`. That is enough to stop a single script hammering a form;
// it is not a substitute for a host-level firewall rule.

/**
 * Returns `check(key, now?)`, which is true when the request is allowed
 * and false once `key` has made `limit` requests inside `windowMs`.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 10_000 }) {
  const hits = new Map();

  return function check(key, now = Date.now()) {
    const entry = hits.get(key);
    if (!entry || now - entry.start >= windowMs) {
      // Drop expired windows before the map can grow without bound.
      if (hits.size >= maxKeys) {
        for (const [k, e] of hits) if (now - e.start >= windowMs) hits.delete(k);
        if (hits.size >= maxKeys) hits.clear();
      }
      hits.set(key, { start: now, count: 1 });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

/**
 * The caller's IP as Vercel reports it. Vercel sets x-real-ip and
 * overwrites x-forwarded-for, so neither can be spoofed there. Locally
 * both may be missing, and every request shares one bucket.
 */
export function clientIp(headers) {
  return (
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
