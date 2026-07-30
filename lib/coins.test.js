import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }),
}));

import { getData, setData } from "@/lib/storage";
import { getLocalCoins, hydrateCoins, setCoins, addCoins } from "@/lib/coins";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalCoins", () => {
  it("defaults to 0 when nothing is stored", () => {
    expect(getLocalCoins()).toBe(0);
  });

  it("falls back to the legacy chintu-coins key", () => {
    localStorage.setItem("chintu-coins", "42");
    expect(getLocalCoins()).toBe(42);
  });

  it("prefers the new coins key over the legacy one", () => {
    localStorage.setItem("chintu-coins", "42");
    localStorage.setItem("coins", "7");
    expect(getLocalCoins()).toBe(7);
  });
});

describe("setCoins / addCoins", () => {
  it("writes through lib/storage's setData", async () => {
    await setCoins(25);
    expect(setData).toHaveBeenCalledWith("coins", 25);
  });

  it("adds to the existing local balance", async () => {
    localStorage.setItem("coins", "10");
    const next = await addCoins(5);
    expect(next).toBe(15);
    expect(getLocalCoins()).toBe(15);
  });

  it("adds on top of a legacy balance the first time it's called", async () => {
    localStorage.setItem("chintu-coins", "10");
    const next = await addCoins(5);
    expect(next).toBe(15);
  });
});

describe("hydrateCoins", () => {
  it("writes the resolved cloud balance into the local coins key", async () => {
    getData.mockResolvedValueOnce(99);
    const result = await hydrateCoins();
    expect(result).toBe(99);
    expect(getLocalCoins()).toBe(99);
  });

  it("falls back to the local balance if the cloud read fails", async () => {
    localStorage.setItem("coins", "13");
    getData.mockRejectedValueOnce(new Error("network error"));
    const result = await hydrateCoins();
    expect(result).toBe(13);
  });
});
