// lib/crisisPatterns.js
//
// The maintained phrase list for deterministic crisis-signal detection
// (see lib/crisisDetection.js). Kept separate from the matching logic so
// this list can be reviewed and expanded on its own — adding a phrase
// here is a content change, not a code change.
//
// Matching happens against normalized text: lowercased, apostrophes
// removed, all other punctuation collapsed to spaces, whitespace
// collapsed. So write every phrase here in that same normalized form —
// lowercase, no apostrophes, no punctuation, single spaces — and both
// "don't" and "dont", or "self-harm" and "self harm", match the one
// entry "dont"/"self harm" without needing separate variants.
//
// Calibration note: entries are deliberately specific, multi-word phrases
// naming suicidal intent, self-harm, or acute crisis — not single loaded
// words ("die", "hurt", "harm") and not generic stress/hopelessness
// phrasing ("can't do this anymore", "want it to be over", "giving up").
// Those are extremely common in ordinary exam-stress journaling for this
// app's audience, and a detector that fires on them would cry wolf on
// nearly every rough week — eroding trust in the real alert. If you add
// entries, keep them unambiguous; when in doubt, phrase it as a full
// sentence fragment rather than a single word.

export const CRISIS_PATTERNS = [
  // --- Suicidal ideation / intent ---
  "kill myself",
  "kill me",
  "killing myself",
  "want to die",
  "wanna die",
  "want to be dead",
  "wish i was dead",
  "wish i were dead",
  "wish i were never born",
  "end my life",
  "ending my life",
  "end it all",
  "ending it all",
  "take my own life",
  "taking my own life",
  "took my own life",
  "no reason to live",
  "no reason to keep living",
  "not worth living",
  "life isnt worth living",
  "life is not worth living",
  "better off dead",
  "better off without me",
  "everyone would be better off without me",
  "dont want to be here anymore",
  "dont want to be alive",
  "dont want to live anymore",
  "no point in living",
  "no point living",
  "give up on life",
  "ready to die",
  "ready to end it",
  "planning to kill myself",
  "going to kill myself",
  "im going to end my life",
  "im going to kill myself",
  "thinking about ending my life",
  "thinking about killing myself",
  "suicidal",
  "suicide",
  "thoughts of suicide",
  "final goodbye",
  "this is my goodbye",
  "wont be here much longer",
  "not going to be here much longer",
  "goodbye forever",

  // --- Self-harm ---
  "self harm",
  "selfharm",
  "hurting myself",
  "hurt myself on purpose",
  "cutting myself",
  "cut myself on purpose",
  "harming myself",
  "want to hurt myself",
  "want to cut myself",
  "want to self harm",

  // --- Method / acute crisis ---
  "overdose on pills",
  "take all the pills",
  "took all the pills",
  "how to kill myself",
  "how to end my life",
  "ways to kill myself",
  "ways to end my life",
];
