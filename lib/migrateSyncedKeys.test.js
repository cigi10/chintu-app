import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  NEWLY_SYNCED_KEYS: ["journal", "mocktests", "loaf_slices", "subject_colors", "timer_sound"],
  getCurrentUser: vi.fn(async () => null),
  readCloudValue: vi.fn(async () => ({ ok: true, value: null })),
  setData: vi.fn(async () => true),
}));

const { getCurrentUser, readCloudValue, setData } = await import("@/lib/storage");
const { migrateNewlySyncedKeys, MIGRATION_FLAG_PREFIX } = await import("./migrateSyncedKeys");

const LEGACY_FLAG = MIGRATION_FLAG_PREFIX + "u1";
const flag = key => `${MIGRATION_FLAG_PREFIX}u1:${key}`;

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
    expect(localStorage.getItem(flag("journal"))).toBe("1");
    expect(localStorage.getItem(flag("loaf_slices"))).toBe("1");
  });

  it("never overwrites a non-empty cloud value", async () => {
    localStorage.setItem("mocktests", JSON.stringify([{ score: 10 }]));
    readCloudValue.mockResolvedValue({ ok: true, value: [{ score: 99 }] });

    const r = await migrateNewlySyncedKeys();

    expect(setData).not.toHaveBeenCalled();
    expect(r.skipped).toContain("mocktests");
    expect(localStorage.getItem(flag("mocktests"))).toBe("1");
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
    expect(localStorage.getItem(flag("journal"))).toBeNull();
  });

  it("leaves the flag unset when an upload fails, then completes on a later run", async () => {
    localStorage.setItem("journal", JSON.stringify([{ id: 1 }]));
    setData.mockResolvedValueOnce(false);

    expect((await migrateNewlySyncedKeys()).done).toBe(false);
    expect(localStorage.getItem(flag("journal"))).toBeNull();

    expect((await migrateNewlySyncedKeys()).uploaded).toEqual(["journal"]);
    expect(localStorage.getItem(flag("journal"))).toBe("1");
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

  it("uploads local timer_sound settings when the cloud is empty", async () => {
    localStorage.setItem("timer_sound", JSON.stringify({ soundId: "bell", volume: 0.4, muted: false }));

    await migrateNewlySyncedKeys();

    expect(setData).toHaveBeenCalledWith("timer_sound", { soundId: "bell", volume: 0.4, muted: false });
  });

  it("never overwrites non-empty cloud timer_sound settings", async () => {
    localStorage.setItem("timer_sound", JSON.stringify({ soundId: "bell", volume: 0.4, muted: false }));
    readCloudValue.mockImplementation(async key =>
      key === "timer_sound" ? { ok: true, value: { soundId: "chime", volume: 1, muted: true } } : { ok: true, value: null });

    const r = await migrateNewlySyncedKeys();

    expect(setData).not.toHaveBeenCalledWith("timer_sound", expect.anything());
    expect(r.skipped).toContain("timer_sound");
  });

  it("still migrates timer_sound for users who finished the earlier four-key migration", async () => {
    localStorage.setItem(LEGACY_FLAG, "1");
    localStorage.setItem("journal", JSON.stringify([{ id: 1 }]));
    localStorage.setItem("timer_sound", JSON.stringify({ soundId: "ding", volume: 0.6, muted: true }));

    const r = await migrateNewlySyncedKeys();

    expect(readCloudValue).not.toHaveBeenCalledWith("journal"); // already done under the old flag
    expect(r.uploaded).toEqual(["timer_sound"]);
  });

  it("retries only the key that failed", async () => {
    localStorage.setItem("journal", JSON.stringify([{ id: 1 }]));
    localStorage.setItem("timer_sound", JSON.stringify({ soundId: "ding", volume: 0.5, muted: false }));
    readCloudValue.mockImplementation(async key => (key === "timer_sound" ? { ok: false } : { ok: true, value: null }));

    await migrateNewlySyncedKeys();
    vi.clearAllMocks();
    getCurrentUser.mockResolvedValue({ id: "u1" });
    readCloudValue.mockResolvedValue({ ok: true, value: null });
    setData.mockResolvedValue(true);

    const r = await migrateNewlySyncedKeys();
    expect(readCloudValue).not.toHaveBeenCalledWith("journal");
    expect(r.uploaded).toEqual(["timer_sound"]);
  });
});
