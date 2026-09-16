import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import BreadBasket from "@/components/BreadBasket";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  // setSystemTime alone (no useFakeTimers) fixes "today" for consistent
  // week bucketing without touching setTimeout — waitFor below still
  // needs real timers to poll.
  vi.setSystemTime(new Date("2026-09-09T10:00:00")); // a Wednesday, week starting 2026-09-07
});

afterEach(() => {
  vi.useRealTimers();
});

describe("BreadBasket", () => {
  it("renders one bun per day studied so far, no placeholder for missing days", async () => {
    localStorage.setItem("loaf_slices", JSON.stringify({
      weeks: { "2026-09-07": { Mon: true, Tue: true, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
    }));

    const { container } = render(<BreadBasket />);

    await waitFor(() => expect(screen.getByText("2/7 this week")).toBeInTheDocument());
    expect(container.querySelectorAll(".bread-basket__bun")).toHaveLength(2);
    expect(container.querySelector(".bread-basket__basket-art--full")).toBeFalsy();
  });

  it("applies the celebration state once every day this week has a bun", async () => {
    localStorage.setItem("loaf_slices", JSON.stringify({
      weeks: { "2026-09-07": { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: true } },
    }));

    const { container } = render(<BreadBasket />);

    await waitFor(() => expect(screen.getByText("7/7 this week")).toBeInTheDocument());
    expect(container.querySelectorAll(".bread-basket__bun")).toHaveLength(7);
    expect(container.querySelector(".bread-basket__basket-art--full")).toBeTruthy();
    expect(container.querySelector(".bread-basket__celebration")).toBeTruthy();
  });

  it("packs past weeks away on the bakery shelf as a mini icon + final count, excluding the current week", async () => {
    localStorage.setItem("loaf_slices", JSON.stringify({
      weeks: {
        "2026-09-07": { Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
        "2026-08-31": { Mon: true, Tue: true, Wed: true, Thu: false, Fri: false, Sat: false, Sun: false },
      },
    }));

    render(<BreadBasket />);

    await waitFor(() => expect(screen.getByText("Bakery shelf")).toBeInTheDocument());
    expect(screen.getByText("3")).toBeInTheDocument(); // last week's final bun count
    expect(screen.queryByText("1")).not.toBeInTheDocument(); // current week isn't shelved
  });
});
