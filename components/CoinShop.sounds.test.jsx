import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";

vi.mock("@/lib/storage", () => ({
  readCloudValue: vi.fn(async () => ({ ok: true, value: null })),
  setData: vi.fn(async () => true),
}));
vi.mock("@/lib/coins", () => ({ hydrateCoins: vi.fn(async () => 150), setCoins: vi.fn(async () => {}) }));
vi.mock("@/lib/timerAudio", () => ({ playSoundNow: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ trackSoundChange: vi.fn() }));
// Prices are pending approval, so give Bell one here to exercise buying.
vi.mock("@/lib/timerSounds", async importOriginal => {
  const real = await importOriginal();
  return { ...real, SOUND_PRICES: { bell: 100 }, isSoundForSale: id => id === "bell" };
});

const { setData } = await import("@/lib/storage");
const { setCoins } = await import("@/lib/coins");
const { trackSoundChange } = await import("@/lib/analytics");
const { default: CoinShop } = await import("./CoinShop");

const card = name => screen.getByText(name, { selector: ".shop__item-name" }).closest(".shop__item-card");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("CoinShop timer sounds", () => {
  it("shows Default Ding as free and in use, and unpriced sounds as not for sale", async () => {
    render(<CoinShop />);
    await waitFor(() => expect(screen.getByText("150 coins")).toBeInTheDocument());
    expect(within(card("Default Ding")).getByText("Free")).toBeInTheDocument();
    expect(within(card("Default Ding")).getByRole("button", { name: "In use" })).toBeDisabled();
    expect(within(card("Soft Chime")).getByText("Not for sale yet")).toBeInTheDocument();
    expect(within(card("Soft Chime")).getByRole("button", { name: "Locked" })).toBeDisabled();
  });

  it("buys a sound into shop_ownership with the same mechanism as items, then lets it be used", async () => {
    render(<CoinShop />);
    await waitFor(() => expect(screen.getByText("150 coins")).toBeInTheDocument());

    fireEvent.click(within(card("Bell")).getByRole("button", { name: "Buy" }));

    expect(setCoins).toHaveBeenCalledWith(50);
    await waitFor(() =>
      expect(setData).toHaveBeenCalledWith("shop_ownership", expect.objectContaining({ owned: ["sound_bell"] }))
    );
    expect(within(card("Bell")).getByText("Owned")).toBeInTheDocument();

    fireEvent.click(within(card("Bell")).getByRole("button", { name: "Use" }));
    expect(setData).toHaveBeenCalledWith("timer_sound", expect.objectContaining({ soundId: "bell" }));
    expect(trackSoundChange).toHaveBeenCalledWith("bell");
  });
});
