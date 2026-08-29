// Gentle motivational quotes shown by the companion during active study
// sessions. Tone matches the app's "no shame, ever" philosophy — no
// achievement pressure, no guilt, nothing that implies falling behind.

export const QUOTES = [
  "Small steps still move you forward.",
  "You showed up. That's the hard part.",
  "Rest is part of the work too.",
  "One page at a time is still progress.",
  "You don't have to feel ready to begin.",
  "This session counts, however it goes.",
  "Focus doesn't have to be perfect to be real.",
  "You're allowed to go at your own pace.",
  "A little bit today adds up more than you think.",
  "You're here. That's enough for now.",
  "Progress is quiet most of the time.",
  "It's okay if today feels slow.",
  "Every session is its own fresh start.",
  "You're doing better than you're giving yourself credit for.",
  "Keep going gently.",
  "There's no rush hidden in this moment.",
  "You get to try again as many times as you need.",
  "Just this next bit. That's all.",
  "Whatever you get done today is enough.",
  "You're building something, even when it's hard to see.",
  "It's okay to take this slow.",
  "Showing up tired still counts as showing up.",
  "You're not behind. You're exactly where you are.",
  "Some days are just about staying in the chair.",
  "Be as patient with yourself as you'd be with a friend.",
  "This is one page of a much longer story.",
  "You don't owe anyone a perfect streak.",
  "Steady is still moving.",
];

export function getRandomQuote(exclude) {
  if (QUOTES.length <= 1) return QUOTES[0];
  let pick = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  while (pick === exclude) {
    pick = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }
  return pick;
}
