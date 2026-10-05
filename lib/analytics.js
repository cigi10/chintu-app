// lib/analytics.js
//
// The custom GA4 events the app fires, in one place, so the names and
// parameters registered in GA4 can't drift from the code. Every helper:
//   - no-ops when NEXT_PUBLIC_GA_ID is unset (local dev, previews without
//     the variable) or on the server, so callers never need to guard;
//   - builds its parameters only from fixed values (mode keys, rounded
//     durations, fixed action and method names), never from anything a
//     user typed or anything that identifies them, so no PII can reach GA;
//   - swallows errors, so a blocked or failed GA script never breaks the UI;
//   - adds traffic_type: "internal" for the owner's flagged browser (see
//     lib/internalTraffic.js).
//
// GA itself is mounted once in components/ThirdPartyScripts.tsx.

import { sendGAEvent } from "@next/third-parties/google";
import { isInternalVisitor } from "@/lib/internalTraffic";

export const TRACKER_ACTIONS = ["pick_exam", "topic_status", "subtopic_status"];
export const SIGNUP_METHODS = ["email", "google"];

export function trackEvent(name, params) {
  if (!process.env.NEXT_PUBLIC_GA_ID || typeof window === "undefined") return;
  try {
    sendGAEvent("event", name, isInternalVisitor() ? { ...params, traffic_type: "internal" } : params);
  } catch {}
}

const toMinutes = seconds => Math.max(0, Math.round(seconds / 60));

// `mode` is a StudyTimer mode key: study, shortBreak, longBreak or custom.
export function trackTimerStart(mode, durationSeconds) {
  trackEvent("timer_start", { mode, duration_min: toMinutes(durationSeconds) });
}

// `early` is true when the session was finished before the timer ran out,
// in which case duration_min is the time actually studied.
export function trackTimerComplete(mode, durationSeconds, early) {
  trackEvent("timer_complete", { mode, duration_min: toMinutes(durationSeconds), early: Boolean(early) });
}

export function trackTrackerUse(action) {
  if (!TRACKER_ACTIONS.includes(action)) return;
  trackEvent("tracker_use", { action });
}

export function trackSignUp(method) {
  if (!SIGNUP_METHODS.includes(method)) return;
  trackEvent("sign_up", { method });
}
