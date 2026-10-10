"use client";
import "@/styles/feedback-box.css";
import { useId, useState } from "react";
import Button from "@/components/Button";
import { trackFeedbackSubmit } from "@/lib/analytics";
import { FEEDBACK_ENDPOINT, MAX_FEEDBACK_LENGTH, validateFeedback } from "@/lib/feedback";

// A small "What's missing?" button at the end of the timer, tracker and
// dashboard screens. It sits in the page flow rather than floating, so it
// never covers the timer controls or the mobile bottom nav. `page` is the
// screen's path, one of FEEDBACK_PAGES in lib/feedback.js.
export default function FeedbackBox({ page }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (sending) return;
    const check = validateFeedback({ message, email, page });
    if (!check.ok) { setError(check.error); return; }

    setSending(true);
    setError("");
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email, page }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      trackFeedbackSubmit(page, Boolean(check.row.email));
      setSent(true);
      setMessage("");
      setEmail("");
    } catch {
      setError("Couldn't reach Studyloaf. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <div className="feedback-box">
        <button type="button" className="feedback-box__toggle" onClick={() => { setOpen(true); setSent(false); }}>
          What&apos;s missing?
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-box">
      <div className="feedback-box__panel">
        {sent ? (
          <>
            <p className="feedback-box__sent" role="status">Thanks! We read every one.</p>
            <button type="button" className="feedback-box__link" onClick={() => setOpen(false)}>Close</button>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor={`${id}-message`} className="feedback-box__label">What&apos;s missing from Studyloaf?</label>
            <textarea
              id={`${id}-message`}
              className="feedback-box__input feedback-box__textarea"
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={MAX_FEEDBACK_LENGTH}
              rows={4}
              placeholder="A feature, a fix, anything that would help you study."
              disabled={sending}
            />
            <p className="feedback-box__count" aria-live="polite">{message.length}/{MAX_FEEDBACK_LENGTH}</p>
            <label htmlFor={`${id}-email`} className="feedback-box__label">Email (optional, only if you want a reply)</label>
            <input
              id={`${id}-email`}
              type="email"
              autoComplete="email"
              className="feedback-box__input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={sending}
            />
            {error && <p className="feedback-box__error" role="alert">{error}</p>}
            <div className="feedback-box__actions">
              <Button type="submit" size="sm" disabled={sending}>{sending ? "Sending..." : "Send"}</Button>
              <button type="button" className="feedback-box__link" onClick={() => setOpen(false)} disabled={sending}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
