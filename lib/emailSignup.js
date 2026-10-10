// lib/emailSignup.js
//
// Rules for the optional email list, shared by the server route
// (app/api/email-signup/route.ts) and the form
// (components/EmailSignupForm.jsx). Rows live in the email_signups table
// (supabase/migrations/*_email_signups.sql).

export const SIGNUP_ENDPOINT = "/api/email-signup";

// The route returns this for every accepted request, whether the address
// was new or already on the list, so the endpoint can't be used to check
// who has signed up.
export const SIGNUP_SUCCESS_MESSAGE = "You're on the list. We'll send study plans and exam updates to this address.";
export const PLUS_WAITLIST_SUCCESS_MESSAGE = "You're on the Plus waitlist. We'll email you when it's ready. Nothing is charged.";

// Returned while the email_signups table doesn't exist yet (its SQL hasn't
// been run), instead of a generic failure.
export const SIGNUP_NOT_OPEN_MESSAGE = "Sign-ups aren't open quite yet. Please check back in a few days.";

// source_page for the "Studyloaf Plus: coming soon" card
// (components/PlusComingSoon.jsx). It isn't a path: the card appears on
// more than one page and what matters is which list the person joined.
export const PLUS_WAITLIST_SOURCE = "plus_waitlist";

export const MAX_EMAIL_LENGTH = 254;

// Deliberately simple: one @, no spaces, a dot in the domain, no leading,
// trailing or doubled dots. Anything stricter rejects real addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** Trimmed and lowercased, or "" for anything that isn't a string. */
export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(email) {
  return (
    typeof email === "string" &&
    email.length > 0 &&
    email.length <= MAX_EMAIL_LENGTH &&
    EMAIL_PATTERN.test(email) &&
    !email.includes("..")
  );
}

/**
 * Where a signup came from, checked against the pages that actually show
 * the form. Returns { sourcePage, examInterest, plusWaitlist? } or null.
 *
 * `isGatePost(slug)` is injected because the post list is read from disk,
 * which only the server can do.
 */
export function resolveSignupSource(sourcePage, isGatePost) {
  if (sourcePage === PLUS_WAITLIST_SOURCE) return { sourcePage, examInterest: null, plusWaitlist: true };
  if (sourcePage === "/") return { sourcePage, examInterest: null };
  if (sourcePage === "/gate") return { sourcePage, examInterest: "gate" };
  const match = typeof sourcePage === "string" && sourcePage.match(/^\/blog\/([a-z0-9-]+)$/);
  if (match && isGatePost(match[1])) return { sourcePage, examInterest: "gate" };
  return null;
}
