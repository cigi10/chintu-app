import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("@/lib/shopOwnership", () => ({
  hydrateShop: vi.fn(async () => ({ owned: [], equipped: {} })),
  loadLocalShop: vi.fn(() => ({ owned: [], equipped: {} })),
  SHOP_CHANGE_EVENT: "chintu-shop-change",
}));
vi.mock("@/lib/storage", () => ({ setData: vi.fn(async () => null), readCloudValue: vi.fn(async () => ({ ok: true, value: null })) }));
vi.mock("@/lib/analytics", () => ({ trackSoundChange: vi.fn() }));
vi.mock("@/lib/timerAudio", () => ({ playSoundNow: vi.fn() }));

const { hydrateShop, loadLocalShop } = await import("@/lib/shopOwnership");
const { trackSoundChange } = await import("@/lib/analytics");
const { playSoundNow } = await import("@/lib/timerAudio");
const { setData } = await import("@/lib/storage");
const { default: TimerSoundSettings } = await import("./TimerSoundSettings");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  hydrateShop.mockResolvedValue({ owned: [], equipped: {} });
  loadLocalShop.mockReturnValue({ owned: [], equipped: {} });
});

describe("TimerSoundSettings", () => {
  it("only lets owned sounds be chosen, but lets any sound be previewed", async () => {
    render(<TimerSoundSettings />);
    expect(screen.getByLabelText("Default Ding")).toBeChecked();
    expect(screen.getByLabelText(/^Bell/)).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Preview Bell" }));
    expect(playSoundNow).toHaveBeenCalledWith("bell", 0.6);
  });

  it("selects an owned sound, saves it and fires sound_change once", async () => {
    hydrateShop.mockResolvedValue({ owned: ["sound_marimba"], equipped: {} });
    render(<TimerSoundSettings />);
    await waitFor(() => expect(screen.getByLabelText("Marimba")).not.toBeDisabled());

    fireEvent.click(screen.getByLabelText("Marimba"));

    expect(screen.getByLabelText("Marimba")).toBeChecked();
    expect(setData).toHaveBeenCalledWith("timer_sound", { soundId: "marimba", volume: 0.6, muted: false });
    expect(trackSoundChange).toHaveBeenCalledTimes(1);
    expect(trackSoundChange).toHaveBeenCalledWith("marimba");
  });

  it("shows the default as selected when the saved sound isn't owned on this device", () => {
    localStorage.setItem("timer_sound", JSON.stringify({ soundId: "bell", volume: 0.4, muted: false }));
    render(<TimerSoundSettings />);
    expect(screen.getByLabelText("Default Ding")).toBeChecked();
  });

  it("saves volume and mute without firing sound_change", () => {
    render(<TimerSoundSettings />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "30" } });
    fireEvent.click(screen.getByLabelText("Mute"));
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeDisabled();
    expect(trackSoundChange).not.toHaveBeenCalled();
  });
});
