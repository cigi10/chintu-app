import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));
vi.mock("@/lib/analytics", () => ({ trackTimerStart: vi.fn(), trackTimerComplete: vi.fn() }));

const { trackTimerStart, trackTimerComplete } = await import("@/lib/analytics");
const { default: StudyTimer } = await import("./StudyTimer");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

const button = name => screen.getByRole("button", { name });

describe("StudyTimer analytics", () => {
  it("fires timer_start on a fresh start but not when a paused session resumes", async () => {
    render(<StudyTimer />);
    await waitFor(() => expect(button("Start")).toBeInTheDocument());

    fireEvent.click(button("Start"));
    expect(trackTimerStart).toHaveBeenCalledTimes(1);
    expect(trackTimerStart).toHaveBeenCalledWith("study", 25 * 60);

    fireEvent.click(button("Pause"));
    fireEvent.click(button("Start"));
    expect(trackTimerStart).toHaveBeenCalledTimes(1);
    expect(trackTimerComplete).not.toHaveBeenCalled();
  });
});
