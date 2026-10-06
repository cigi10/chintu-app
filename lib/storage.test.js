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
  upsertError: null,
  upsertThrows: false,
  selectCalls: [],
  upsertCalls: [],
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      getUser: async () => ({ data: { user: state.user } }),
    },
    from: () => ({
      select: (cols) => ({
        eq: () => (state.selectCalls.push(cols), {
          single: async () =>
            state.selectError ? { data: null, error: state.selectError } : { data: state.row, error: null },
        }),
      }),
      upsert: async (payload) => {
        state.upsertCalls.push(payload);
        if (state.upsertThrows) throw new Error("network down");
        return { data: null, error: state.upsertError };
      },
    }),
  }),
}));

import { getData, setData, getCloudValue, readCloudValue, CLOUD_COLUMNS } from "@/lib/storage";

beforeEach(() => {
  localStorage.clear();
  state.user = null;
  state.row = null;
  state.selectError = null;
  state.upsertError = null;
  state.upsertThrows = false;
  state.selectCalls = [];
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
    await expect(setData("todos", [{ id: 1 }])).resolves.toBeNull();
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

// The 400s on onboarding: keys with no user_data column were sent as
// column names. companion-name still has none (it syncs via profiles), and
// any unknown key must stay local and never reach PostgREST.
describe("keys without a user_data column", () => {
  beforeEach(() => { state.user = { id: "u1" }; });

  for (const key of ["companion-name", "not_a_column"]) {
    it(`never requests "${key}" from the cloud and keeps it locally`, async () => {
      await setData(key, { v: 1 });
      await expect(getData(key, null)).resolves.toEqual({ v: 1 });
      await expect(getCloudValue(key)).resolves.toBeNull();
      expect(state.selectCalls).toEqual([]);
      expect(state.upsertCalls).toEqual([]);
    });
  }

  it("lists only real user_data columns as cloud-synced", () => {
    expect([...CLOUD_COLUMNS].some(k => k.includes("-"))).toBe(false);
    expect(CLOUD_COLUMNS.has("companion-name")).toBe(false);
  });
});

// journal, mocktests, loaf_slices and subject_colors got user_data
// columns, so they now read from and write to the cloud like the rest.
describe("newly synced keys", () => {
  beforeEach(() => { state.user = { id: "u1" }; });

  for (const key of ["journal", "mocktests", "loaf_slices", "subject_colors"]) {
    it(`syncs "${key}" to user_data and keeps a local copy`, async () => {
      expect(CLOUD_COLUMNS.has(key)).toBe(true);
      await setData(key, { v: 1 });
      expect(state.upsertCalls.at(-1)).toMatchObject({ user_id: "u1", [key]: { v: 1 } });
      expect(JSON.parse(localStorage.getItem(key))).toEqual({ v: 1 });
      state.row = { [key]: { v: 2 } };
      await expect(getCloudValue(key)).resolves.toEqual({ v: 2 });
      expect(state.selectCalls.at(-1)).toBe(key);
    });
  }
});

describe("failed cloud syncs", () => {
  beforeEach(() => {
    state.user = { id: "u1" };
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("keeps the local copy and doesn't throw when the upsert returns an error", async () => {
    state.upsertError = { code: "PGRST204", message: "Could not find the column" };
    await expect(setData("coins", 42)).resolves.toBe(false);
    expect(JSON.parse(localStorage.getItem("coins"))).toBe(42);
  });

  it("keeps the local copy and doesn't throw when the request itself fails", async () => {
    state.upsertThrows = true;
    await expect(setData("todos", [{ id: 1 }])).resolves.toBe(false);
    expect(JSON.parse(localStorage.getItem("todos"))).toEqual([{ id: 1 }]);
  });

  it("reports true when the cloud write succeeds", async () => {
    await expect(setData("coins", 5)).resolves.toBe(true);
  });

  it("readCloudValue tells an empty cloud apart from a failed read", async () => {
    state.row = { journal: null };
    await expect(readCloudValue("journal")).resolves.toEqual({ ok: true, value: null });
    state.selectError = { code: "PGRST116", message: "no rows" };
    await expect(readCloudValue("journal")).resolves.toEqual({ ok: true, value: null });
    state.selectError = { code: "500", message: "network" };
    await expect(readCloudValue("journal")).resolves.toEqual({ ok: false });
  });

  it("falls back to local when the cloud read errors", async () => {
    localStorage.setItem("coins", JSON.stringify(7));
    state.selectError = { code: "42703", message: "column does not exist" };
    await expect(getData("coins", 0)).resolves.toBe(7);
  });
});
