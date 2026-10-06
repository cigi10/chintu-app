import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  NEWLY_SYNCED_KEYS: ["journal", "mocktests", "loaf_slices", "subject_colors"],
  getCurrentUser: vi.fn(async () => null),
  readCloudValue: vi.fn(async () => ({ ok: true, value: null })),
  setData: vi.fn(async () => true),
}));

const { getCurrentUser, readCloudValue, setData } = await import("@/lib/storage");
const { migrateNewlySyncedKeys, MIGRATION_FLAG_PREFIX } = await import("./migrateSyncedKeys");

const FLAG = MIGRATION_FLAG_PREFIX + "u1";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  getCurrentUser.mockResolvedValue({ id: "u1" });
  readCloudValue.mockResolvedValue({ ok: true, value: null });
  setData.mockResolvedValue(true);
});

describe("migrateNewlySyncedKeys", () => {
  it("uploads a local value when the cloud is empty", async () => {
    localStorage.setItem("journal", JSON.stringify([{ id: 1, text: "Day one" }]));
    localStorage.setItem("loaf_slices", JSON.stringify({ weeks: { "2026-10-05": { Mon: true } } }));

    const r = await migrateNewlySyncedKeys();

    expect(setData).toHaveBeenCalledWith("journal", [{ id: 1, text: "Day one" }]);
    expect(setData).toHaveBeenCalledWith("loaf_slices", { weeks: { "2026-10-05": { Mon: true } } });
    expect(r.uploaded).toEqual(["journal", "loaf_slices"]);
    expect(localStorage.getItem(FLAG)).toBe("1");
  });

  it("never overwrites a non-empty cloud value", async () => {
    localStorage.setItem("mocktests", JSON.stringify([{ score: 10 }]));
    readCloudValue.mockResolvedValue({ ok: true, value: [{ score: 99 }] });

    const r = await migrateNewlySyncedKeys();

    expect(setData).not.toHaveBeenCalled();
    expect(r.skipped).toContain("mocktests");
    expect(localStorage.getItem(FLAG)).toBe("1");
  });

  it("treats an empty cloud array or object as empty", async () => {
    localStorage.setItem("subject_colors", JSON.stringify({ Physics: "#f00" }));
    readCloudValue.mockResolvedValue({ ok: true, value: {} });

    await migrateNewlySyncedKeys();

    expect(setData).toHaveBeenCalledWith("subject_colors", { Physics: "#f00" });
  });

  it("does not upload when the cloud read fails, and retries next time", async () => {
    localStorage.setItem("journal", JSON.stringify([{ id: 1 }]));
    readCloudValue.mockResolvedValue({ ok: false });

    const r = await migrateNewlySyncedKeys();

    expect(setData).not.toHaveBeenCalled();
    expect(r.failed).toEqual(["journal"]);
    expect(localStorage.getItem(FLAG)).toBeNull();
  });

  it("leaves the flag unset when an upload fails, then completes on a later run", async () => {
    localStorage.setItem("journal", JSON.stringify([{ id: 1 }]));
    setData.mockResolvedValueOnce(false);

    expect((await migrateNewlySyncedKeys()).done).toBe(false);
    expect(localStorage.getItem(FLAG)).toBeNull();

    expect((await migrateNewlySyncedKeys()).uploaded).toEqual(["journal"]);
    expect(localStorage.getItem(FLAG)).toBe("1");
  });

  it("reads values still stored under a legacy local key", async () => {
    localStorage.setItem("chintu-mock-scores", JSON.stringify([{ score: 7 }]));

    await migrateNewlySyncedKeys();

    expect(setData).toHaveBeenCalledWith("mocktests", [{ score: 7 }]);
  });

  it("skips keys with no or empty local data, and does nothing for guests", async () => {
    localStorage.setItem("journal", JSON.stringify([]));
    await migrateNewlySyncedKeys();
    expect(setData).not.toHaveBeenCalled();

    localStorage.clear();
    getCurrentUser.mockResolvedValue(null);
    localStorage.setItem("journal", JSON.stringify([{ id: 1 }]));
    const r = await migrateNewlySyncedKeys();
    expect(readCloudValue).not.toHaveBeenCalledWith("journal");
    expect(r.done).toBe(false);
  });

  it("runs once per user per browser", async () => {
    localStorage.setItem("journal", JSON.stringify([{ id: 1 }]));
    await migrateNewlySyncedKeys();
    vi.clearAllMocks();
    getCurrentUser.mockResolvedValue({ id: "u1" });

    await migrateNewlySyncedKeys();

    expect(readCloudValue).not.toHaveBeenCalled();
  });
});
