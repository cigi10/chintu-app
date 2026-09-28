"use client";
import "@/styles/contact.css";
import { useState } from "react";
import Button from "@/components/Button";
import Companion from "@/components/Companion";
import { submitContactMessage } from "@/lib/contact";

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    setError("");
    const { error } = await submitContactMessage(message);
    setSending(false);
    if (error) { setError(error); return; }
    setSent(true);
    setMessage("");
  }

  if (sent) {
    return (
      <div className="contact-card">
        <div className="contact-card__companion">
          <Companion mood="happy" />
        </div>
        <p className="contact-card__sent">Got it, thank you! We read every message.</p>
        <button className="contact-card__again" onClick={() => setSent(false)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="contact-card">
      <div className="contact-card__companion">
        <Companion mood="curious" />
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="contact-card__textarea"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Bug reports, feature ideas, or just saying hi. We read all of it."
          rows={7}
          disabled={sending}
        />
        {error && <p className="contact-card__error">{error}</p>}
        <Button type="submit" disabled={!message.trim() || sending} fullWidth>
          {sending ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
