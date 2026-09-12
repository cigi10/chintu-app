"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/storage";
import { isGatedPath } from "@/lib/routeAccess";
import "@/styles/guest-mode.css";

// Pages where a "sign in to save progress" nudge doesn't make sense even
// though they're public: the auth flow itself, marketing/legal pages, and
// onboarding (which already has its own account-or-continue-locally
// framing as part of the flow).
const NO_BANNER_ON = [
  "/",
  "/login",
  "/landing",
  "/onboarding",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/privacy",
  "/terms",
  "/blog",
];

const DISMISS_KEY = "chintu-guest-banner-dismissed";

// Non-intrusive nudge shown on guest-capable pages (dashboard, timer,
// timetable, tracker, todo, goals, stats, mocktests, revisions, digest,
// tutorial) when there's no signed-in session — see proxy.ts /
// lib/routeAccess.js for the full public/private split. Dismissible for
// the rest of the browser session (sessionStorage), reappearing on the
// next visit since that's when the reminder is actually useful again.
export default function GuestModeBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isGatedPath(pathname) || NO_BANNER_ON.some((p) => pathname === p || (p !== "/" && pathname?.startsWith(p)))) {
      return;
    }
    let cancelled = false;
    getCurrentUser().then((user) => {
      if (cancelled) return;
      const dismissed = (() => {
        try { return sessionStorage.getItem(DISMISS_KEY) === "1"; } catch { return false; }
      })();
      if (!user && !dismissed) setVisible(true);
    });
    return () => { cancelled = true; };
  }, [pathname]);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch {}
  }

  return (
    <div className="guest-banner">
      <span className="guest-banner__text">
        You&apos;re using Studyloaf as a guest — progress is only saved on this device.
      </span>
      <div className="guest-banner__actions">
        <Link href="/login" className="guest-banner__link">Sign in to save across devices</Link>
        <button className="guest-banner__dismiss" onClick={dismiss} aria-label="Dismiss" type="button">
          ×
        </button>
      </div>
    </div>
  );
}
