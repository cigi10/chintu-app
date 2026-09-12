"use client";
import "@/styles/bun-pop.css";
import { useEffect } from "react";

// Purely decorative "a bun just got added" flourish — reusable wherever a
// study session completes (currently: StudyTimer). It never touches the
// basket itself (see lib/breadBasket.js's addBunForToday, which is the
// only thing that actually adds a bun and is idempotent per day) — this
// is safe to fire on every session completion, including a second
// session on a day whose bun was already counted, since it doesn't
// represent "a bun was added," just "a session finished."
//
// Mount it conditionally (`{show && <BunPopAnimation onDone={...} />}`)
// the same way StudyTimer's CoinBurst works: it self-clears via onDone
// after the animation plays, so the parent just needs a boolean/counter
// to flip back off.
export default function BunPopAnimation({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="bun-pop-overlay">
      {/* Placeholder for bun-plain.png until the real asset is wired in. */}
      <div className="bun-pop-icon" aria-hidden="true" />
    </div>
  );
}
