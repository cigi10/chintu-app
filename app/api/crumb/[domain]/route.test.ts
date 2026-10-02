// @vitest-environment node
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { getDailyTerm } from "@/lib/wordGame";
import { localDateStr } from "@/lib/date";

const SLUG = "neet";
const today = () => localDateStr();
const answer = () => getDailyTerm(SLUG, new Date()).term.toUpperCase();
const wrong = (len: number, ch = "Q") => ch.repeat(len);

function call(body: unknown, slug = SLUG) {
  const request = new NextRequest(`http://localhost/api/crumb/${slug}`, {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return POST(request, { params: Promise.resolve({ domain: slug }) } as never);
}

describe("POST /api/crumb/[domain]", () => {
  it("gives length and topic but never the term while the puzzle is in play", async () => {
    const res = await call({ date: today(), guesses: [wrong(answer().length)] });
    const data = await res.json();
    expect(data).toMatchObject({ length: answer().length, status: "playing" });
    expect(data.scores).toHaveLength(1);
    expect(data.term).toBeUndefined();
    expect(data.clue).toBeUndefined();
    expect(JSON.stringify(data)).not.toContain(answer());
  });

  it("reveals the term once solved", async () => {
    const data = await (await call({ date: today(), guesses: [answer()] })).json();
    expect(data).toMatchObject({ status: "won", term: answer() });
    expect(data.clue).toBeTruthy();
  });

  it("reveals the term after six wrong guesses", async () => {
    const data = await (await call({ date: today(), guesses: Array(6).fill(wrong(answer().length)) })).json();
    expect(data).toMatchObject({ status: "lost", term: answer() });
  });

  it("rejects dates more than a day from today", async () => {
    const far = new Date(); far.setDate(far.getDate() + 3);
    const res = await call({ date: localDateStr(far), guesses: [] });
    expect(res.status).toBe(400);
  });

  it("rejects guesses of the wrong length, more than six guesses, and guesses after a win", async () => {
    expect((await call({ date: today(), guesses: ["AB"] })).status).toBe(400);
    expect((await call({ date: today(), guesses: Array(7).fill(wrong(answer().length)) })).status).toBe(400);
    expect((await call({ date: today(), guesses: [answer(), wrong(answer().length)] })).status).toBe(400);
  });

  it("404s for an unknown domain", async () => {
    expect((await call({ date: today(), guesses: [] }, "nope")).status).toBe(404);
  });
});
