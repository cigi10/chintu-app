import { describe, it, expect, beforeEach, vi } from "vitest";

// Fakes just enough of the supabase-js client shape that lib/storage.js
// actually calls (auth.getUser, auth.onAuthStateChange, from().select()
// .eq().single(), from().upsert()) so the real getData/setData/
// getCloudValue logic runs against it — not a mock of storage.js itself.
// vi.hoisted() avoids the TDZ trap of a `vi.mock` factory (hoisted above
// imports) closing over a `let` declared later in this file.
const state = vi.hoisted(() => ({
  user: null,
  row: null,
  selectError: null,
  upsertCalls: [],
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      getUser: async () => ({ data: { user: state.user } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () =>
            state.selectError ? { data: null, error: state.selectError } : { data: state.row, error: null },
        }),
      }),
      upsert: async (payload) => {
        state.upsertCalls.push(payload);
        return { data: null, error: null };
      },
    }),
  }),
}));

import { getData, setData, getCloudValue } from "@/lib/storage";

beforeEach(() => {
  localStorage.clear();
  state.user = null;
  state.row = null;
  state.selectError = null;
  state.upsertCalls = [];
});

describe("getData — logged out (guest mode)", () => {
  it("returns the fallback without throwing when there's no local value either", async () => {
    await expect(getData("todos", [])).resolves.toEqual([]);
  });

  it("returns the local value when present, without touching the network", async () => {
    localStorage.setItem("todos", JSON.stringify([{ id: 1 }]));
    await expect(getData("todos", [])).resolves.toEqual([{ id: 1 }]);
    expect(state.upsertCalls).toEqual([]);
  });
});

describe("setData — logged out (guest mode)", () => {
  it("writes to localStorage and resolves without throwing", async () => {
    await expect(setData("todos", [{ id: 1 }])).resolves.toBeUndefined();
    expect(JSON.parse(localStorage.getItem("todos"))).toEqual([{ id: 1 }]);
  });

  it("does not attempt a cloud write while logged out", async () => {
    await setData("todos", [{ id: 1 }]);
    expect(state.upsertCalls).toEqual([]);
  });
});

describe("getData — logged in", () => {
  it("returns the cloud value when the cloud has one", async () => {
    state.user = { id: "u1" };
    state.row = { todos: [{ id: "cloud" }] };
    await expect(getData("todos", [])).resolves.toEqual([{ id: "cloud" }]);
  });

  it("falls back to local when the cloud column is null", async () => {
    state.user = { id: "u1" };
    state.row = { todos: null };
    localStorage.setItem("todos", JSON.stringify([{ id: "local" }]));
    await expect(getData("todos", [])).resolves.toEqual([{ id: "local" }]);
  });

  it("falls back to local when the row doesn't exist yet (select errors)", async () => {
    state.user = { id: "u1" };
    state.selectError = { message: "no rows" };
    localStorage.setItem("todos", JSON.stringify([{ id: "local" }]));
    await expect(getData("todos", [])).resolves.toEqual([{ id: "local" }]);
  });
});

describe("setData — logged in", () => {
  it("writes to both localStorage and the cloud", async () => {
    state.user = { id: "u1" };
    await setData("todos", [{ id: 1 }]);
    expect(JSON.parse(localStorage.getItem("todos"))).toEqual([{ id: 1 }]);
    expect(state.upsertCalls).toEqual([
      { user_id: "u1", todos: [{ id: 1 }], updated_at: expect.any(String) },
    ]);
  });
});

describe("getCloudValue", () => {
  it("returns null when logged out", async () => {
    await expect(getCloudValue("todos")).resolves.toBeNull();
  });

  it("returns null when the cloud column is empty — distinct from getData's local fallback", async () => {
    state.user = { id: "u1" };
    state.row = { todos: null };
    await expect(getCloudValue("todos")).resolves.toBeNull();
  });

  it("returns the raw cloud value when present, ignoring any local value", async () => {
    state.user = { id: "u1" };
    state.row = { todos: [{ id: "cloud" }] };
    localStorage.setItem("todos", JSON.stringify([{ id: "local" }]));
    await expect(getCloudValue("todos")).resolves.toEqual([{ id: "cloud" }]);
  });
});
