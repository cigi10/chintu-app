"use client";
import "@/styles/email-signup.css";
import { useId, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { trackEmailSignup } from "@/lib/analytics";
import { SIGNUP_ENDPOINT, isValidEmail, normalizeEmail } from "@/lib/emailSignup";

// Optional email list signup. Shown on public content pages only (the
// homepage, /gate and the GATE posts), never inside the study app.
// `sourcePage` is the path of the page it sits on; the server route
// checks it against that list and derives the exam interest from it.
export default function EmailSignupForm({ sourcePage }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (sending) return;
    if (!isValidEmail(normalizeEmail(email))) { setError("Please enter a valid email address."); return; }
    if (!consent) { setError("Please tick the box to agree to receive emails."); return; }

    setSending(true);
    setError("");
    try {
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, source_page: sourcePage }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      trackEmailSignup(sourcePage);
      setDone(data.message);
      setEmail("");
      setConsent(false);
    } catch {
      setError("Couldn't reach Studyloaf. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="email-signup" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="email-signup__heading">
        Get a GATE/JEE study plan and exam updates by email
      </h2>
      {done ? (
        <p className="email-signup__done" role="status">{done}</p>
      ) : (
        <form className="email-signup__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor={`${id}-email`} className="email-signup__label">Email</label>
          <input
            id={`${id}-email`}
            type="email"
            name="email"
            autoComplete="email"
            className="email-signup__input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={sending}
            required
          />
          <label className="email-signup__consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              disabled={sending}
              required
            />
            <span>
              I agree to receive study emails from Studyloaf. I can unsubscribe any time.{" "}
              <Link href="/privacy" className="email-signup__link">Privacy policy</Link>
            </span>
          </label>
          {error && <p className="email-signup__error" role="alert">{error}</p>}
          <Button type="submit" disabled={sending}>
            {sending ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      )}
    </section>
  );
}
