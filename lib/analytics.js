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

// Fired when the user picks a different timer completion sound. sound_id
// is one of the fixed ids in lib/timerSounds.js, nothing user-entered.
const SOUND_IDS = ["ding", "chime", "bell", "marimba", "woodblock"];
export function trackSoundChange(soundId) {
  if (!SOUND_IDS.includes(soundId)) return;
  trackEvent("sound_change", { sound_id: soundId });
}

// Fired after a successful email list signup. source_page is the path the
// form sat on ("/", "/gate" or a GATE post), never the address itself.
export function trackEmailSignup(sourcePage) {
  if (typeof sourcePage !== "string" || !/^\/[a-z0-9/-]*$/.test(sourcePage)) return;
  trackEvent("email_signup", { source_page: sourcePage });
}

// Fired after the in-app feedback box sends. Only which screen it came
// from and whether an email was left: never the text or the address.
const FEEDBACK_PAGES = ["/timer", "/tracker", "/dashboard"];
export function trackFeedbackSubmit(page, hasEmail) {
  if (!FEEDBACK_PAGES.includes(page)) return;
  trackEvent("feedback_submit", { page, has_email: Boolean(hasEmail) });
}

// Fired when a quiz is finished: the daily challenge on submit, a
// practice quiz on its results screen. category is a quiz slug from
// lib/quiz.js; score and total are question counts.
const QUIZ_MODES = ["daily", "practice"];
export function trackQuizComplete(quizMode, category, score, total) {
  if (!QUIZ_MODES.includes(quizMode) || typeof category !== "string" || !/^[a-z0-9-]+$/.test(category)) return;
  trackEvent("quiz_complete", { quiz_mode: quizMode, category, score: Number(score) || 0, total: Number(total) || 0 });
}

// Fired when coins are spent in the shop. spend_virtual_currency is a GA4
// recommended event, so GA treats it as in-app currency, not revenue.
// item_name is a fixed shop id (lib/shopItems.js, or "sound_<id>" from
// lib/timerSounds.js); item_type says which shelf it came from.
const SHOP_ITEM_TYPES = ["accessory", "sound"];
export function trackCoinSpend(itemType, itemId, cost) {
  if (!SHOP_ITEM_TYPES.includes(itemType) || typeof itemId !== "string" || !/^[a-z0-9_]+$/.test(itemId)) return;
  trackEvent("spend_virtual_currency", { virtual_currency_name: "coins", value: Number(cost) || 0, item_name: itemId, item_type: itemType });
}
