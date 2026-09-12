import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import BunPopAnimation from "@/components/BunPopAnimation";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("BunPopAnimation", () => {
  it("renders immediately on mount", () => {
    const { container } = render(<BunPopAnimation onDone={() => {}} />);
    expect(container.querySelector(".bun-pop-overlay")).toBeTruthy();
  });

  it("calls onDone once the animation window elapses, and cleans up on unmount", () => {
    const onDone = vi.fn();
    const { unmount } = render(<BunPopAnimation onDone={onDone} />);

    act(() => { vi.advanceTimersByTime(1200); });
    expect(onDone).toHaveBeenCalledTimes(1);

    unmount(); // should not throw or call onDone again via a stray timer
    act(() => { vi.advanceTimersByTime(5000); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
