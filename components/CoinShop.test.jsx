import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CoinShop from "@/components/CoinShop";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));
vi.mock("@/lib/coins", () => ({
  hydrateCoins: vi.fn(async () => 1000),
  setCoins: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";

function equipBtnFor(name) {
  const card = screen.getByText(name).closest(".shop__item-card");
  return card.querySelector(".shop__item-equip-btn");
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("CoinShop — multi-slot equip", () => {
  it("equipping an item in one slot doesn't touch an item already equipped in a different slot", async () => {
    const seeded = { owned: ["glasses", "headphones"], equipped: { face: "glasses" } };
    getData.mockResolvedValueOnce(seeded);

    render(<CoinShop />);
    await waitFor(() => expect(equipBtnFor("Study headphones")).toHaveTextContent("Equip"));
    expect(equipBtnFor("Little glasses")).toHaveTextContent("Unequip");

    equipBtnFor("Study headphones").click();

    await waitFor(() =>
      expect(setData).toHaveBeenCalledWith(
        "shop_ownership",
        expect.objectContaining({ equipped: { face: "glasses", head: "headphones" } })
      )
    );
    // Glasses stays equipped and visibly so — headphones landing in "head"
    // never clobbers the unrelated "face" slot.
    expect(equipBtnFor("Little glasses")).toHaveTextContent("Unequip");
  });

  it("equipping a second item in the same slot replaces the first rather than stacking", async () => {
    const seeded = { owned: ["scarf", "bowtie"], equipped: { neck: "scarf" } };
    getData.mockResolvedValueOnce(seeded);

    render(<CoinShop />);
    await waitFor(() => expect(equipBtnFor("Dapper bowtie")).toHaveTextContent("Equip"));

    equipBtnFor("Dapper bowtie").click();

    await waitFor(() =>
      expect(setData).toHaveBeenCalledWith(
        "shop_ownership",
        expect.objectContaining({ equipped: { neck: "bowtie" } })
      )
    );
    expect(equipBtnFor("Tiny scarf")).toHaveTextContent("Equip");
  });

  it("migrates a legacy single-slot equipped item into its real slot on load", async () => {
    getData.mockResolvedValueOnce({ owned: ["glasses"], equipped: { wearable: "glasses" } });

    render(<CoinShop />);

    await waitFor(() => expect(equipBtnFor("Little glasses")).toHaveTextContent("Unequip"));
  });

  it("unequipping an item only clears its own slot", async () => {
    const seeded = { owned: ["glasses", "headphones"], equipped: { face: "glasses", head: "headphones" } };
    getData.mockResolvedValueOnce(seeded);

    render(<CoinShop />);
    await waitFor(() => expect(equipBtnFor("Little glasses")).toHaveTextContent("Unequip"));

    equipBtnFor("Little glasses").click();

    await waitFor(() =>
      expect(setData).toHaveBeenCalledWith(
        "shop_ownership",
        expect.objectContaining({ equipped: { head: "headphones" } })
      )
    );
    expect(equipBtnFor("Study headphones")).toHaveTextContent("Unequip");
  });
});
