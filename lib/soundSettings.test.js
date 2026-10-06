import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/storage", () => ({
  setData: vi.fn(async () => true),
  readCloudValue: vi.fn(async () => ({ ok: true, value: null })),
}));
vi.mock("@/lib/analytics", () => ({ trackSoundChange: vi.fn() }));

const { setData, readCloudValue } = await import("@/lib/storage");
const { trackSoundChange } = await import("@/lib/analytics");
const { saveSoundSettings, hydrateSoundSettings } = await import("./soundSettings");
const { SOUND_SETTINGS_EVENT } = await import("./timerSounds");

const local = v => localStorage.setItem("timer_sound", JSON.stringify(v));
const stored = () => JSON.parse(localStorage.getItem("timer_sound"));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  readCloudValue.mockResolvedValue({ ok: true, value: null });
});

describe("saveSoundSettings", () => {
  it("syncs choice, volume and mute through timer_sound and fires sound_change only on a new sound", () => {
    saveSoundSettings({ soundId: "bell", volume: 0.3, muted: true });
    expect(setData).toHaveBeenCalledWith("timer_sound", { soundId: "bell", volume: 0.3, muted: true });
    expect(trackSoundChange).toHaveBeenCalledWith("bell");

    localStorage.setItem("timer_sound", JSON.stringify({ soundId: "bell", volume: 0.3, muted: true }));
    saveSoundSettings({ soundId: "bell", volume: 0.8, muted: false });
    expect(trackSoundChange).toHaveBeenCalledTimes(1);
  });
});

describe("hydrateSoundSettings", () => {
  it("takes non-empty cloud settings and tells the timer", async () => {
    local({ soundId: "ding", volume: 0.6, muted: false });
    readCloudValue.mockResolvedValue({ ok: true, value: { soundId: "marimba", volume: 0.2, muted: true } });
    const heard = vi.fn();
    window.addEventListener(SOUND_SETTINGS_EVENT, heard);

    await expect(hydrateSoundSettings()).resolves.toEqual({ soundId: "marimba", volume: 0.2, muted: true });

    expect(stored()).toEqual({ soundId: "marimba", volume: 0.2, muted: true });
    expect(heard).toHaveBeenCalledTimes(1);
    window.removeEventListener(SOUND_SETTINGS_EVENT, heard);
  });

  it("keeps local settings when the cloud is empty", async () => {
    local({ soundId: "bell", volume: 0.4, muted: false });
    for (const value of [null, {}]) {
      readCloudValue.mockResolvedValue({ ok: true, value });
      await expect(hydrateSoundSettings()).resolves.toEqual({ soundId: "bell", volume: 0.4, muted: false });
    }
    expect(stored()).toEqual({ soundId: "bell", volume: 0.4, muted: false });
  });

  it("keeps local settings when the cloud read fails", async () => {
    local({ soundId: "bell", volume: 0.4, muted: false });
    readCloudValue.mockResolvedValue({ ok: false });
    await expect(hydrateSoundSettings()).resolves.toEqual({ soundId: "bell", volume: 0.4, muted: false });
    expect(setData).not.toHaveBeenCalled();
  });
});
