import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Achievements from "@/components/Achievements";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("Achievements — expanded categories", () => {
  it("renders the new Quiz, Bread Basket, Mock Tests, and Revisions category blocks", async () => {
    render(<Achievements />);

    await waitFor(() => expect(screen.getByText("Quiz")).toBeInTheDocument());
    expect(screen.getByText("Bread Basket")).toBeInTheDocument();
    expect(screen.getByText("Mock Tests")).toBeInTheDocument();
    expect(screen.getByText("Revisions")).toBeInTheDocument();

    // and the card titles within them
    expect(screen.getByText("Quiz Streak")).toBeInTheDocument();
    expect(screen.getByText("Full Baskets")).toBeInTheDocument();
    expect(screen.getByText("Mock Test Taker")).toBeInTheDocument();
    expect(screen.getByText("Revision Master")).toBeInTheDocument();
  });
});
