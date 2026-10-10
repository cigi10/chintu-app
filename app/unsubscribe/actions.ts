"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { unsubscribeSecret, verifyUnsubscribeToken } from "@/lib/unsubscribeToken";

export type UnsubscribeState = { status: "idle" | "done" | "invalid" | "error" };

// Runs when the visitor presses the button on /unsubscribe. The token is
// checked again here because a server action is a public POST endpoint:
// anything the page checked at render time can be skipped by calling it
// directly. Setting unsubscribed_at only on rows where it is still null
// keeps the first unsubscribe time, and makes a repeat press harmless.
export async function unsubscribe(_prev: UnsubscribeState, formData: FormData): Promise<UnsubscribeState> {
  const id = verifyUnsubscribeToken(formData.get("token"), unsubscribeSecret());
  if (!id) return { status: "invalid" };

  const supabase = createAdminClient();
  if (!supabase) return { status: "error" };

  const { error } = await supabase
    .from("email_signups")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", id)
    .is("unsubscribed_at", null);
  if (error) {
    console.error("unsubscribe failed:", error.message);
    return { status: "error" };
  }
  return { status: "done" };
}
