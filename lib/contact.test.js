import { describe, it, expect, beforeEach, vi } from "vitest";

// Fakes just enough of the supabase-js client shape that lib/contact.js
// actually calls (from().insert()) so the real submitContactMessage logic
// runs against it — not a mock of contact.js itself.
const state = vi.hoisted(() => ({
  insertCalls: [],
  insertError: null,
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      insert: async (payload) => {
        state.insertCalls.push(payload);
        return { data: null, error: state.insertError };
      },
    }),
  }),
}));

const userState = vi.hoisted(() => ({ user: null }));
vi.mock("@/lib/storage", () => ({
  getCurrentUser: async () => userState.user,
}));

import { submitContactMessage } from "@/lib/contact";

beforeEach(() => {
  state.insertCalls = [];
  state.insertError = null;
  userState.user = null;
});

describe("submitContactMessage", () => {
  it("rejects an empty or whitespace-only message without calling Supabase", async () => {
    const result = await submitContactMessage("   ");
    expect(result.error).toBeTruthy();
    expect(state.insertCalls).toHaveLength(0);
  });

  it("inserts a trimmed message with a null user_id when signed out", async () => {
    const result = await submitContactMessage("  Found a bug on the timer page.  ");
    expect(result.error).toBeNull();
    expect(state.insertCalls).toEqual([
      { message: "Found a bug on the timer page.", user_id: null },
    ]);
  });

  it("attaches the signed-in user's id when there is one", async () => {
    userState.user = { id: "user-123" };
    await submitContactMessage("Love the streaks!");
    expect(state.insertCalls[0]).toEqual({ message: "Love the streaks!", user_id: "user-123" });
  });

  it("surfaces a Supabase error message instead of throwing", async () => {
    state.insertError = { message: "network error" };
    const result = await submitContactMessage("Hello");
    expect(result.error).toBe("network error");
  });
});
