// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createUnsubscribeToken } from "@/lib/unsubscribeToken";

const is = vi.fn();
const eq = vi.fn(() => ({ is }));
const update = vi.fn(() => ({ eq }));
const createAdminClient = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => createAdminClient() }));

const { unsubscribe } = await import("./actions");

const ID = "3f2b8c1e-9a4d-4c6b-8e2f-1a2b3c4d5e6f";
const SECRET = "test-secret";

function form(token: string) {
  const data = new FormData();
  data.set("token", token);
  return data;
}

beforeEach(() => {
  vi.stubEnv("UNSUBSCRIBE_TOKEN_SECRET", SECRET);
  is.mockReset();
  is.mockResolvedValue({ error: null });
  update.mockClear();
  eq.mockClear();
  createAdminClient.mockReset();
  createAdminClient.mockReturnValue({ from: () => ({ update }) });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("unsubscribe action", () => {
  it("sets unsubscribed_at on the token's row, only if it isn't already set", async () => {
    const result = await unsubscribe({ status: "idle" }, form(createUnsubscribeToken(ID, SECRET)));
    expect(result).toEqual({ status: "done" });
    expect(Number.isNaN(Date.parse((update.mock.calls[0] as unknown as [{ unsubscribed_at: string }])[0].unsubscribed_at))).toBe(false);
    expect(eq).toHaveBeenCalledWith("id", ID);
    expect(is).toHaveBeenCalledWith("unsubscribed_at", null);
  });

  it("rejects a forged or malformed token without touching the database", async () => {
    for (const token of [createUnsubscribeToken(ID, "wrong-secret"), "student@example.com", ""]) {
      expect(await unsubscribe({ status: "idle" }, form(token))).toEqual({ status: "invalid" });
    }
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it("reports an error when the update fails or the key is missing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    is.mockResolvedValue({ error: { message: "boom" } });
    expect(await unsubscribe({ status: "idle" }, form(createUnsubscribeToken(ID, SECRET)))).toEqual({ status: "error" });
    createAdminClient.mockReturnValue(null);
    expect(await unsubscribe({ status: "idle" }, form(createUnsubscribeToken(ID, SECRET)))).toEqual({ status: "error" });
  });
});
