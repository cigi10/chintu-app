"use client";
import { useActionState } from "react";
import Button from "@/components/Button";
import { unsubscribe } from "@/app/unsubscribe/actions";

// The confirm step on /unsubscribe. Opening the link only shows this
// button; the unsubscribe happens when it's pressed. Email security
// scanners open links in emails automatically, so a link that
// unsubscribed on load would unsubscribe people who never clicked it.
export default function UnsubscribeForm({ token }) {
  const [state, formAction, pending] = useActionState(unsubscribe, { status: "idle" });

  if (state.status === "done") {
    return (
      <p className="legal-p" role="status">
        You&apos;re unsubscribed. Studyloaf won&apos;t send you any more study emails.
      </p>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      {state.status === "invalid" && (
        <p className="legal-p" role="alert">This unsubscribe link isn&apos;t valid. Please use the link from your most recent email.</p>
      )}
      {state.status === "error" && (
        <p className="legal-p" role="alert">Something went wrong, so you&apos;re not unsubscribed yet. Please try again in a moment.</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Unsubscribing..." : "Unsubscribe"}
      </Button>
    </form>
  );
}
