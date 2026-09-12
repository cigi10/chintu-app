// lib/routeAccess.js
//
// Single source of truth for which routes require a signed-in session —
// shared between proxy.ts (the actual enforcement, at the edge) and any
// client component that needs to know the same thing without duplicating
// the list (e.g. GuestModeBanner shouldn't nudge someone to "sign in" on
// a page that already requires it). See proxy.ts for why each of these
// stays gated while the rest of the app works in guest mode.
export const GATED_PATHS = [
  "/rooms",
  "/journal",
  "/mood",
  "/shop",
  "/achievements",
  "/profile",
];

export function isGatedPath(pathname) {
  return GATED_PATHS.some((path) => pathname.startsWith(path));
}
