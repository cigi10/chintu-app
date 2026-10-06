import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", async () => {
  const CLOUD = new Set(["timetable", "todos", "goals", "mood_log", "ddays", "tracker", "revisions",
    "coins", "shop_ownership", "streak", "quiz_daily_streak", "games_progress",
    "journal", "mocktests", "loaf_slices", "subject_colors"]);
  return {
    readCloudValue: vi.fn(async () => ({ ok: true, value: null })),
    setData: vi.fn(async () => {}),
    getCurrentUser: vi.fn(async () => null),
    getProfile: vi.fn(async () => null),
    setProfile: vi.fn(async () => {}),
    isCloudSynced: key => CLOUD.has(key),
  };
});

import { readCloudValue, setData, getCurrentUser, getProfile, setProfile } from "@/lib/storage";
import { claimGuestDataForAccount } from "@/lib/claimGuestData";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  readCloudValue.mockResolvedValue({ ok: true, value: null });
  setData.mockResolvedValue(undefined);
  getCurrentUser.mockResolvedValue(null);
  getProfile.mockResolvedValue(null);
});

describe("claimGuestDataForAccount", () => {
  it("does nothing while still a guest (no session)", async () => {
    localStorage.setItem("todos", JSON.stringify([{ id: 1 }]));
    await claimGuestDataForAccount();
    expect(setData).not.toHaveBeenCalled();
    expect(localStorage.getItem("chintu-guest-data-claimed")).toBeNull();
  });

  it("pushes local data up for keys the cloud doesn't have yet", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    localStorage.setItem("todos", JSON.stringify([{ id: 1, text: "Study" }]));
    localStorage.setItem("coins", JSON.stringify(50));

    await claimGuestDataForAccount();

    expect(setData).toHaveBeenCalledWith("todos", [{ id: 1, text: "Study" }]);
    expect(setData).toHaveBeenCalledWith("coins", 50);
  });

  it("never overwrites a key the cloud already has real data for", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    readCloudValue.mockImplementation(async (key) => ({ ok: true, value: key === "todos" ? [{ id: "cloud" }] : null }));
    localStorage.setItem("todos", JSON.stringify([{ id: "local-guest-scratch" }]));

    await claimGuestDataForAccount();

    expect(setData).not.toHaveBeenCalledWith("todos", expect.anything());
  });

  it("skips keys this guest never touched", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    await claimGuestDataForAccount();
    expect(setData).not.toHaveBeenCalled();
  });

  it("claims companion-name into profiles as a raw string rather than JSON", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    localStorage.setItem("companion-name", "Mochi");

    await claimGuestDataForAccount();

    expect(setProfile).toHaveBeenCalledWith({ companion_name: "Mochi" });
    expect(setData).not.toHaveBeenCalledWith("companion-name", expect.anything());
  });

  it("never overwrites a companion name the profile already has", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    getProfile.mockResolvedValue({ companion_name: "Pip" });
    localStorage.setItem("companion-name", "Mochi");

    await claimGuestDataForAccount();

    expect(setProfile).not.toHaveBeenCalled();
  });

  it("never sends the companion name through user_data", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    localStorage.setItem("companion-name", "Mochi");

    await claimGuestDataForAccount();

    expect(readCloudValue).not.toHaveBeenCalledWith("companion-name");
  });

  it("sets the claimed flag after a successful run and skips work on a later call", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    localStorage.setItem("todos", JSON.stringify([{ id: 1 }]));

    await claimGuestDataForAccount();
    expect(localStorage.getItem("chintu-guest-data-claimed")).toBe("1");

    vi.clearAllMocks();
    await claimGuestDataForAccount();
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(setData).not.toHaveBeenCalled();
  });

  it("skips a key whose cloud read failed instead of treating it as empty, and retries later", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    localStorage.setItem("todos", JSON.stringify([{ id: "guest" }]));
    localStorage.setItem("coins", JSON.stringify(40));
    readCloudValue.mockImplementation(async (key) => (key === "todos" ? { ok: false } : { ok: true, value: null }));

    await claimGuestDataForAccount();

    expect(setData).not.toHaveBeenCalledWith("todos", expect.anything());
    expect(setData).toHaveBeenCalledWith("coins", 40);
    expect(localStorage.getItem("chintu-guest-data-claimed")).toBeNull();

    readCloudValue.mockResolvedValue({ ok: true, value: null });
    await claimGuestDataForAccount();
    expect(setData).toHaveBeenCalledWith("todos", [{ id: "guest" }]);
    expect(localStorage.getItem("chintu-guest-data-claimed")).toBe("1");
  });

  it("leaves the claim unfinished when an upload fails", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    localStorage.setItem("todos", JSON.stringify([{ id: 1 }]));
    setData.mockResolvedValue(false);

    await claimGuestDataForAccount();

    expect(localStorage.getItem("chintu-guest-data-claimed")).toBeNull();
  });
});
