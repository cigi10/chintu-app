// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { PLUS_WAITLIST_SUCCESS_MESSAGE, SIGNUP_NOT_OPEN_MESSAGE, SIGNUP_SUCCESS_MESSAGE } from "@/lib/emailSignup";

const insert = vi.fn();
const is = vi.fn();
const eq = vi.fn(() => ({ is }));
const update = vi.fn(() => ({ eq }));
const createAdminClient = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => createAdminClient() }));

const GATE_POST = "gate-normalization-explained";

let ipCounter = 0;
// Each test gets its own IP so the module-level rate limiter doesn't
// carry over between tests, unless a test passes one explicitly.
function call(body: unknown, ip = `10.0.0.${++ipCounter}`) {
  const request = new NextRequest("http://localhost/api/email-signup", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return POST(request);
}

const valid = { email: " Student@Example.com ", consent: true, source_page: "/gate" };

const { POST } = await import("./route");

beforeEach(() => {
  insert.mockReset();
  insert.mockResolvedValue({ error: null });
  createAdminClient.mockReset();
  is.mockReset();
  is.mockResolvedValue({ error: null });
  update.mockClear();
  eq.mockClear();
  createAdminClient.mockReturnValue({ from: () => ({ insert, update }) });
});

describe("POST /api/email-signup", () => {
  it("stores a normalized address with consent time, source page and exam interest", async () => {
    const res = await call(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: SIGNUP_SUCCESS_MESSAGE });
    expect(res.headers.get("cache-control")).toBe("no-store");
    const row = insert.mock.calls[0][0];
    expect(row).toMatchObject({ email: "student@example.com", exam_interest: "gate", source_page: "/gate" });
    expect(Number.isNaN(Date.parse(row.consented_at))).toBe(false);
    expect(row).not.toHaveProperty("unsubscribed_at");
  });

  it("accepts the homepage (no exam interest) and GATE posts", async () => {
    await call({ ...valid, source_page: "/" });
    expect(insert.mock.calls[0][0]).toMatchObject({ source_page: "/", exam_interest: null });
    await call({ ...valid, source_page: `/blog/${GATE_POST}` });
    expect(insert.mock.calls[1][0]).toMatchObject({ source_page: `/blog/${GATE_POST}`, exam_interest: "gate" });
  });

  it("answers an existing address exactly like a new one", async () => {
    const fresh = await call(valid);
    insert.mockResolvedValue({ error: { code: "23505", message: "duplicate key" } });
    const repeat = await call(valid);
    expect(repeat.status).toBe(fresh.status);
    expect(await repeat.json()).toEqual(await fresh.json());
  });

  it("rejects invalid emails, missing consent and unknown source pages without touching the database", async () => {
    for (const body of [
      { ...valid, email: "not-an-email" },
      { ...valid, consent: false },
      { ...valid, consent: "true" },
      { ...valid, source_page: "/timer" },
      { ...valid, source_page: "/blog/not-a-real-post" },
      "{not json",
      "null",
    ]) {
      const res = await call(body);
      expect(res.status).toBe(400);
    }
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects oversized bodies", async () => {
    const res = await call({ ...valid, padding: "x".repeat(5000) });
    expect(res.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rate-limits an IP after 5 attempts in the window", async () => {
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await call(valid, "192.0.2.1")).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expect(insert).toHaveBeenCalledTimes(5);
  });

  it("adds a new address to the Plus waitlist with its own row", async () => {
    const res = await call({ ...valid, source_page: "plus_waitlist" });
    expect(await res.json()).toEqual({ message: PLUS_WAITLIST_SUCCESS_MESSAGE });
    const row = insert.mock.calls[0][0];
    expect(row).toMatchObject({ email: "student@example.com", source_page: "plus_waitlist", exam_interest: null });
    expect(row.plus_waitlist_at).toBe(row.consented_at);
    expect(update).not.toHaveBeenCalled();
  });

  it("marks an address already on the list as Plus-interested, answering exactly like a new one", async () => {
    const fresh = await call({ ...valid, source_page: "plus_waitlist" });
    insert.mockResolvedValue({ error: { code: "23505", message: "duplicate key" } });
    const repeat = await call({ ...valid, source_page: "plus_waitlist" });
    expect(update).toHaveBeenCalledWith({ plus_waitlist_at: expect.any(String) });
    expect(eq).toHaveBeenCalledWith("email", "student@example.com");
    expect(is).toHaveBeenCalledWith("plus_waitlist_at", null);
    expect(repeat.status).toBe(fresh.status);
    expect(await repeat.json()).toEqual(await fresh.json());
  });

  it("never touches plus_waitlist_at for an ordinary repeat signup", async () => {
    insert.mockResolvedValue({ error: { code: "23505", message: "duplicate key" } });
    expect((await call(valid)).status).toBe(200);
    expect(update).not.toHaveBeenCalled();
  });

  it("says sign-ups aren't open yet while the table doesn't exist", async () => {
    for (const code of ["PGRST205", "42P01"]) {
      insert.mockResolvedValue({ error: { code, message: "missing" } });
      for (const source_page of ["/gate", "plus_waitlist"]) {
        const res = await call({ ...valid, source_page });
        expect(res.status).toBe(503);
        expect(await res.json()).toEqual({ error: SIGNUP_NOT_OPEN_MESSAGE });
      }
    }
  });

  it("returns 503 when the service-role key isn't configured", async () => {
    createAdminClient.mockReturnValue(null);
    expect((await call(valid)).status).toBe(503);
  });

  it("returns a generic 500 on other database errors", async () => {
    insert.mockResolvedValue({ error: { code: "XX000", message: "internal relation failure" } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await call(valid);
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("relation");
  });
});
