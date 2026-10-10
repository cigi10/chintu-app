// lib/feedback.js
//
// Rules for the in-app "What's missing?" box, shared by the server route
// (app/api/feedback/route.ts) and the form (components/FeedbackBox.jsx).
// Rows live in the feedback table (supabase/migrations/*_feedback.sql).

import { isValidEmail, normalizeEmail } from "@/lib/emailSignup";

export const FEEDBACK_ENDPOINT = "/api/feedback";
export const MAX_FEEDBACK_LENGTH = 500;

// The app screens that show the box. The route rejects anything else.
export const FEEDBACK_PAGES = ["/timer", "/tracker", "/dashboard"];

/**
 * Checks a submission. Returns { ok: true, row } with the cleaned values,
 * or { ok: false, error } with a message for the visitor.
 */
export function validateFeedback({ message, email, page }) {
  const text = typeof message === "string" ? message.trim() : "";
  if (!text) return { ok: false, error: "Write something before sending." };
  if (text.length > MAX_FEEDBACK_LENGTH) return { ok: false, error: `Please keep it under ${MAX_FEEDBACK_LENGTH} characters.` };

  // Email is optional: blank means anonymous, anything else must be valid.
  const address = normalizeEmail(email);
  if (address && !isValidEmail(address)) return { ok: false, error: "That email doesn't look right. Leave it blank to stay anonymous." };

  if (!FEEDBACK_PAGES.includes(page)) return { ok: false, error: "Invalid request." };

  return { ok: true, row: { message: text, email: address || null, page } };
}
