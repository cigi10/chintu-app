import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import { validateFeedback } from "@/lib/feedback";

// POST /api/feedback: stores an entry from the in-app "What's missing?"
// box (components/FeedbackBox.jsx). Body: { message, email?, page }.
//
// Same access model as the email list: the feedback table has RLS on and
// no policies for anon or authenticated (supabase/migrations/*_feedback.sql),
// so this route, using the service-role key, is the only way in and its
// validation and rate limit can't be skipped.

// 5 entries per IP per 10 minutes.
const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const MAX_BODY_BYTES = 4096;

export async function POST(request: NextRequest) {
  if (!allow(clientIp(request.headers))) {
    return reply({ error: "That's a lot of feedback at once. Please try again in a few minutes." }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply({ error: "Please keep it under 500 characters." }, 400);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object") return reply({ error: "Invalid request." }, 400);

  // validateFeedback is plain JS, so TypeScript can't narrow its result on
  // `ok`; checking `row` directly gives it the non-undefined type.
  const result = validateFeedback(body);
  if (!result.row) return reply({ error: result.error ?? "Invalid request." }, 400);

  const supabase = createAdminClient();
  if (!supabase) return reply({ error: "Feedback isn't available right now. Please try again later." }, 503);

  const { error } = await supabase.from("feedback").insert(result.row);
  if (error) {
    console.error("feedback insert failed:", error.message);
    return reply({ error: "Feedback isn't available right now. Please try again later." }, 500);
  }

  return reply({ ok: true }, 200);
}

function reply(body: { ok?: boolean; error?: string }, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
