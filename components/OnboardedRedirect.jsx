"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ONBOARDED_KEY, setOnboardedCookie } from "@/lib/onboardedFlag";

// Fallback for visitors who finished onboarding before the onboarded flag
// was mirrored into a cookie: proxy.ts can't see their localStorage, so /
// renders the landing page for them once. This backfills the cookie (so
// the proxy handles every later visit server-side) and moves them on to
// their dashboard. Fresh visitors, crawlers included, never trigger it.
export default function OnboardedRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem(ONBOARDED_KEY)) {
      setOnboardedCookie();
      router.replace("/dashboard");
    }
  }, [router]);
  return null;
}
