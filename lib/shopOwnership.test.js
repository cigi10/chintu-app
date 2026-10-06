import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/storage", () => ({
  readCloudValue: vi.fn(async () => ({ ok: false })),
  setData: vi.fn(async () => true),
}));
const { readCloudValue, setData } = await import("@/lib/storage");
const { hydrateShop, mergeShops, loadLocalShop, SHOP_KEY } = await import("./shopOwnership");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

const local = shop => localStorage.setItem(SHOP_KEY, JSON.stringify(shop));

describe("shop ownership", () => {
  it("keeps a purchase whose cloud sync failed, and re-uploads it", async () => {
    local({ owned: ["glasses", "sound_bell"], equipped: {} });
    readCloudValue.mockResolvedValue({ ok: true, value: { owned: ["glasses"], equipped: { face: "glasses" } } });

    const shop = await hydrateShop();

    expect(shop.owned).toEqual(["glasses", "sound_bell"]);
    expect(setData).toHaveBeenCalledWith(SHOP_KEY, { owned: ["glasses", "sound_bell"], equipped: { face: "glasses" } });
    expect(loadLocalShop().owned).toContain("sound_bell");
  });

  it("adds cloud purchases made on another device without dropping local ones", () => {
    expect(mergeShops({ owned: ["scarf"] }, { owned: ["sound_chime"] }).owned).toEqual(["scarf", "sound_chime"]);
  });

  it("doesn't write back when the cloud already has everything", async () => {
    local({ owned: ["glasses"], equipped: {} });
    readCloudValue.mockResolvedValue({ ok: true, value: { owned: ["glasses", "scarf"], equipped: {} } });

    const shop = await hydrateShop();

    expect(shop.owned).toEqual(["glasses", "scarf"]);
    expect(setData).not.toHaveBeenCalled();
  });

  it("uses the local copy unchanged when the cloud read fails", async () => {
    local({ owned: ["sound_marimba"], equipped: {} });
    readCloudValue.mockResolvedValue({ ok: false });

    expect((await hydrateShop()).owned).toEqual(["sound_marimba"]);
    expect(setData).not.toHaveBeenCalled();
  });

  it("drops junk entries and duplicates", () => {
    expect(mergeShops({ owned: ["a", 3, null, "a"] }, null).owned).toEqual(["a"]);
  });
});
