"use client";
import "@/styles/plus-coming-soon.css";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import EmailSignupForm from "@/components/EmailSignupForm";
import { trackPlusInterest } from "@/lib/analytics";
import { PLUS_WAITLIST_SOURCE } from "@/lib/emailSignup";

// Fake-door test for Studyloaf Plus (see docs/plus-design.md). Nothing is
// sold or charged; the card says so. It measures interest in three steps
// (shown, "Notify me" tapped, waitlist joined) via GA4 plus_interest, and
// the waitlist reuses the email list with source_page "plus_waitlist".
// Remove it when the test ends.
const FEATURES = [
  "Syllabus analytics: your pace against exam day and your weakest topics",
  "Mock-score trends: rolling averages and targets across subjects",
  "A smarter revision queue that plans your reviews for you",
  "Plus-only outfits for your companion",
];

export default function PlusComingSoon({ source }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    trackPlusInterest("view", source);
  }, [source]);

  return (
    <section className="plus-soon" aria-labelledby={`plus-soon-${source}`}>
      <p className="plus-soon__badge">Coming soon, nothing is charged</p>
      <h2 id={`plus-soon-${source}`} className="plus-soon__title">Studyloaf Plus: coming soon</h2>
      <p className="plus-soon__intro">
        We&apos;re thinking about a Plus plan with deeper study tools. Everything that&apos;s free today stays free.
      </p>
      <ul className="plus-soon__list">
        {FEATURES.map(feature => <li key={feature}>{feature}</li>)}
      </ul>
      {open ? (
        <EmailSignupForm
          sourcePage={PLUS_WAITLIST_SOURCE}
          heading={null}
          className="plus-soon__form"
          onSuccess={() => trackPlusInterest("signup", source)}
        />
      ) : (
        <Button onClick={() => { setOpen(true); trackPlusInterest("open", source); }}>
          Notify me
        </Button>
      )}
    </section>
  );
}
