import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBlogPost } from "@/lib/blogPosts";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import {
  PLUS_WAITLIST_SUCCESS_MESSAGE,
  SIGNUP_NOT_OPEN_MESSAGE,
  SIGNUP_SUCCESS_MESSAGE,
  isValidEmail,
  normalizeEmail,
  resolveSignupSource,
} from "@/lib/emailSignup";

// POST /api/email-signup: adds an address to the optional email list
// (components/EmailSignupForm.jsx). Body: { email, consent, source_page }.
//
// The email_signups table has RLS on and no policies for anon or
// authenticated (see supabase/migrations/*_email_signups.sql), so this
// route, using the service-role key, is the only way in. That keeps the
// validation and rate limit below unskippable, and means nobody can learn
// whether an address is on the list: a repeat signup gets the same
// response as a new one.
//
// The Plus waitlist (source_page "plus_waitlist") shares the table. A new
// address gets its own row; an address already on the list just gets
// plus_waitlist_at set, so each person still has one row and one
// unsubscribe.

// 5 attempts per IP per 10 minutes.
const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const MAX_BODY_BYTES = 2048;

// PostgREST's "table not in schema cache" and Postgres's "relation does not
// exist": the email_signups SQL hasn't been run yet.
const TABLE_MISSING_CODES = new Set(["PGRST205", "42P01"]);

function isGatePost(slug: string) {
  return Boolean(getBlogPost(slug)?.tags?.includes("gate"));
}

export async function POST(request: NextRequest) {
  if (!allow(clientIp(request.headers))) {
    return reply({ error: "Too many attempts. Please try again in a few minutes." }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply({ error: "Invalid request." }, 400);
  let body: { email?: unknown; consent?: unknown; source_page?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object") return reply({ error: "Invalid request." }, 400);

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) return reply({ error: "Please enter a valid email address." }, 400);
  if (body.consent !== true) return reply({ error: "Please tick the box to agree to receive emails." }, 400);
  const source = resolveSignupSource(body.source_page, isGatePost);
  if (!source) return reply({ error: "Invalid request." }, 400);

  const supabase = createAdminClient();
  if (!supabase) return reply({ error: "Sign-ups aren't available right now. Please try again later." }, 503);

  const now = new Date().toISOString();
  let { error } = await supabase.from("email_signups").insert({
    email,
    exam_interest: source.examInterest,
    source_page: source.sourcePage,
    consented_at: now,
    ...(source.plusWaitlist && { plus_waitlist_at: now }),
  });

  // 23505 is a unique violation: the address is already on the list.
  // Answer exactly as for a new signup. For the Plus waitlist, record the
  // interest on the existing row, keeping the first time if already set.
  if (error?.code === "23505") {
    error = source.plusWaitlist
      ? (await supabase.from("email_signups").update({ plus_waitlist_at: now }).eq("email", email).is("plus_waitlist_at", null)).error
      : null;
  }

  if (error) {
    if (TABLE_MISSING_CODES.has(error.code ?? "")) return reply({ error: SIGNUP_NOT_OPEN_MESSAGE }, 503);
    console.error("email-signup write failed:", error.message);
    return reply({ error: "Sign-ups aren't available right now. Please try again later." }, 500);
  }

  return reply({ message: source.plusWaitlist ? PLUS_WAITLIST_SUCCESS_MESSAGE : SIGNUP_SUCCESS_MESSAGE }, 200);
}

function reply(body: { message?: string; error?: string }, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
