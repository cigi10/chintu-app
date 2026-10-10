import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBlogPost } from "@/lib/blogPosts";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import { SIGNUP_SUCCESS_MESSAGE, isValidEmail, normalizeEmail, resolveSignupSource } from "@/lib/emailSignup";

// POST /api/email-signup: adds an address to the optional email list
// (components/EmailSignupForm.jsx). Body: { email, consent, source_page }.
//
// The email_signups table has RLS on and no policies for anon or
// authenticated (see supabase/migrations/*_email_signups.sql), so this
// route, using the service-role key, is the only way in. That keeps the
// validation and rate limit below unskippable, and means nobody can learn
// whether an address is on the list: a repeat signup gets the same
// response as a new one.

// 5 attempts per IP per 10 minutes.
const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const MAX_BODY_BYTES = 2048;

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

  const { error } = await supabase.from("email_signups").insert({
    email,
    exam_interest: source.examInterest,
    source_page: source.sourcePage,
    consented_at: new Date().toISOString(),
  });

  // 23505 is a unique violation: the address is already on the list.
  // Answer exactly as for a new signup.
  if (error && error.code !== "23505") {
    console.error("email-signup insert failed:", error.message);
    return reply({ error: "Sign-ups aren't available right now. Please try again later." }, 500);
  }

  return reply({ message: SIGNUP_SUCCESS_MESSAGE }, 200);
}

function reply(body: { message?: string; error?: string }, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
