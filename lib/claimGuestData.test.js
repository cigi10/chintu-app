import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getCloudValue: vi.fn(async () => null),
  setData: vi.fn(async () => {}),
  getCurrentUser: vi.fn(async () => null),
}));

import { getCloudValue, setData, getCurrentUser } from "@/lib/storage";
import { claimGuestDataForAccount } from "@/lib/claimGuestData";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  getCloudValue.mockResolvedValue(null);
  setData.mockResolvedValue(undefined);
  getCurrentUser.mockResolvedValue(null);
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
    getCloudValue.mockImplementation(async (key) => (key === "todos" ? [{ id: "cloud" }] : null));
    localStorage.setItem("todos", JSON.stringify([{ id: "local-guest-scratch" }]));

    await claimGuestDataForAccount();

    expect(setData).not.toHaveBeenCalledWith("todos", expect.anything());
  });

  it("skips keys this guest never touched", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    await claimGuestDataForAccount();
    expect(setData).not.toHaveBeenCalled();
  });

  it("treats companion-name as a raw string rather than JSON", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    localStorage.setItem("companion-name", "Mochi");

    await claimGuestDataForAccount();

    expect(setData).toHaveBeenCalledWith("companion-name", "Mochi");
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
});
