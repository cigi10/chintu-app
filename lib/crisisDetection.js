// lib/crisisDetection.js
//
// Deterministic, rule-based crisis-signal detection for free-text input
// (Journal, and any other free-text field wired up to it). This is the
// mental-health boundary described in chintu-full-build-plan.md Part 3 —
// no AI/LLM is used anywhere in this file, or anywhere in this feature:
// matching is plain string comparison against the maintained list in
// lib/crisisPatterns.js. That's a deliberate design constraint, not a
// placeholder for something smarter later.
//
// This module is pure and synchronous: it never makes a network call,
// never writes to storage, and never logs the text it's given. Callers
// are responsible for not persisting the input anywhere as a side effect
// of running this check — see components/Journal.jsx for the intended
// usage pattern (check in memory, show the support notice, let the
// user's own normal save action proceed unchanged).
import { CRISIS_PATTERNS } from "./crisisPatterns";

/**
 * Lowercases, strips apostrophes, collapses all other punctuation to
 * spaces, and collapses whitespace runs to a single space. This is what
 * makes matching tolerant of how people actually type in a journal —
 * "don't" / "dont", "self-harm" / "self harm", stray punctuation, extra
 * line breaks — without needing a separate pattern for every variant.
 */
export function normalizeForCrisisCheck(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns true if `text` contains a clear, matched crisis-signal phrase
 * from lib/crisisPatterns.js. Pure and synchronous — safe to call on
 * every keystroke (debounce in the caller if that matters for
 * performance, not for correctness).
 */
export function containsCrisisSignal(text) {
  const normalized = normalizeForCrisisCheck(text);
  if (!normalized) return false;
  return CRISIS_PATTERNS.some((phrase) => normalized.includes(phrase));
}
