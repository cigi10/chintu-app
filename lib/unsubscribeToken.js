// lib/unsubscribeToken.js
//
// Signed unsubscribe tokens for the email list. A token is
// "<email_signups.id>.<signature>", so the link carries no email address
// and can't be forged or pointed at someone else's row without the
// secret. Tokens don't expire: an unsubscribe link has to keep working
// for as long as old emails sit in someone's inbox.
//
// Server-only in practice: it needs node:crypto and a secret that only
// exists on the server. Used by app/unsubscribe, and by whatever sends
// the emails to build each link (see unsubscribeUrl).

import { createHmac, timingSafeEqual } from "node:crypto";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * The signing secret: UNSUBSCRIBE_TOKEN_SECRET if set, otherwise derived
 * from the service-role key so no new variable is required. Note that
 * rotating the service-role key then invalidates links in emails already
 * sent; set UNSUBSCRIBE_TOKEN_SECRET before the first send to avoid that.
 * Returns null when neither is configured.
 */
export function unsubscribeSecret(env = process.env) {
  if (env.UNSUBSCRIBE_TOKEN_SECRET) return env.UNSUBSCRIBE_TOKEN_SECRET;
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createHmac("sha256", env.SUPABASE_SERVICE_ROLE_KEY).update("studyloaf-unsubscribe-v1").digest("hex");
}

function sign(id, secret) {
  return createHmac("sha256", secret).update(`unsubscribe:${id}`).digest("base64url");
}

export function createUnsubscribeToken(id, secret) {
  if (!secret || !UUID_PATTERN.test(id)) throw new Error("createUnsubscribeToken needs a row id and a secret");
  return `${id}.${sign(id, secret)}`;
}

/** The email_signups id the token was issued for, or null if it isn't valid. */
export function verifyUnsubscribeToken(token, secret) {
  if (!secret || typeof token !== "string" || token.length > 200) return null;
  const [id, signature, ...rest] = token.split(".");
  if (rest.length || !UUID_PATTERN.test(id ?? "") || !signature) return null;
  const expected = Buffer.from(sign(id, secret));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return id;
}

/** The full link to put in an email for this row. */
export function unsubscribeUrl(siteUrl, id, secret) {
  return `${siteUrl}/unsubscribe?token=${encodeURIComponent(createUnsubscribeToken(id, secret))}`;
}
