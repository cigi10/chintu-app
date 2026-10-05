"use client";
import { useEffect, useRef } from "react";
import { trackSignUp } from "@/lib/analytics";

// Fires sign_up for a Google sign-up. app/auth/callback/route.ts adds
// ?signup=google only on a first Google login (no profile yet), so repeat
// logins never carry it. The param is removed from the address bar right
// away, so a reload, back navigation or shared link can't fire it again,
// and the ref stops React's development double-mount from firing twice.
// Reads window.location rather than useSearchParams so the onboarding page
// doesn't need a Suspense boundary for it.
export default function SignupTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("signup") !== "google") return;
    fired.current = true;
    trackSignUp("google");
    url.searchParams.delete("signup");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, []);

  return null;
}
