"use client";
import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import "@/styles/crisis-support.css";

// Fires a privacy-safe, anonymous "this was shown" ping so trigger
// frequency can be monitored over time — no journal/mood text, no user
// identifier, just the event itself (GA records its own timestamp; a
// count is just how many of these landed in a given window). Reuses the
// GoogleAnalytics instance already mounted in app/layout.tsx rather than
// standing up separate analytics infra. No-ops quietly (with a console
// warning from the GA helper itself) if NEXT_PUBLIC_GA_ID isn't set, and
// never throws if a blocker drops the script.
function trackNoticeShown() {
  try {
    sendGAEvent("event", "crisis_notice_shown");
  } catch {}
}

// Shown when free-text input matches lib/crisisDetection.js. Fixed,
// pre-written copy only — no AI-generated content, no companion
// animation, no coins/streak tie-in for this interaction (per
// chintu-full-build-plan.md Part 3). Dismissible and never blocks the
// user from continuing to use the app normally afterward.
export default function CrisisSupportNotice({ onClose }) {
  // Runs once when the notice actually mounts (i.e. is shown), not once
  // per re-render or per parent that happens to import this component.
  useEffect(() => {
    trackNoticeShown();
  }, []);

  return (
    <div className="crisis-support" role="status">
      <p className="crisis-support__line">
        It sounds like things are really hard right now. You don&apos;t have to handle this alone.
      </p>
      <p className="crisis-support__resource">
        <strong>India, iCall:</strong> <a href="tel:9152987821">9152987821</a> (free, confidential)
      </p>
      <p className="crisis-support__resource crisis-support__resource--secondary">
        Outside India? Find a local helpline at{" "}
        <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">
          findahelpline.com
        </a>
      </p>
      <button className="crisis-support__dismiss" onClick={onClose} type="button">
        Close
      </button>
    </div>
  );
}
