// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const insert = vi.fn();
const createAdminClient = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => createAdminClient() }));

let ipCounter = 0;
function call(body: unknown, ip = `10.1.0.${++ipCounter}`) {
  const request = new NextRequest("http://localhost/api/feedback", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return POST(request);
}

const valid = { message: "A weekly summary email", email: "", page: "/dashboard" };

const { POST } = await import("./route");

beforeEach(() => {
  insert.mockReset();
  insert.mockResolvedValue({ error: null });
  createAdminClient.mockReset();
  createAdminClient.mockReturnValue({ from: () => ({ insert }) });
});

describe("POST /api/feedback", () => {
  it("stores the cleaned entry", async () => {
    const res = await call({ ...valid, email: " Me@Example.com " });
    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledWith({ message: "A weekly summary email", email: "me@example.com", page: "/dashboard" });
  });

  it("stores email as null when left blank", async () => {
    await call(valid);
    expect(insert.mock.calls[0][0].email).toBeNull();
  });

  it("rejects bad input without touching the database", async () => {
    for (const body of [
      { ...valid, message: "" },
      { ...valid, message: "x".repeat(501) },
      { ...valid, email: "nope" },
      { ...valid, page: "/gate" },
      "{oops",
      "null",
      { ...valid, padding: "x".repeat(5000) },
    ]) {
      expect((await call(body)).status).toBe(400);
    }
    expect(insert).not.toHaveBeenCalled();
  });

  it("rate-limits an IP after 5 entries in the window", async () => {
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await call(valid, "192.0.2.9")).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expect(insert).toHaveBeenCalledTimes(5);
  });

  it("returns 503 without the service-role key and a generic 500 on database errors", async () => {
    createAdminClient.mockReturnValueOnce(null);
    expect((await call(valid)).status).toBe(503);
    vi.spyOn(console, "error").mockImplementation(() => {});
    insert.mockResolvedValue({ error: { message: "relation \"feedback\" does not exist" } });
    const res = await call(valid);
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("relation");
  });
});
