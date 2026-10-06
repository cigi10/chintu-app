import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/components/Companion", () => ({ default: () => null }));
vi.mock("@/lib/storage", () => ({ setProfile: vi.fn() }));
vi.mock("@/lib/companion", () => ({ setCompanionName: vi.fn(), NAME_CHIPS: ["Pip"] }));
vi.mock("@/lib/tracker", () => ({ saveExamPackAndSubjects: vi.fn(), getSubjects: () => ({}) }));
vi.mock("@/lib/ddays", () => ({ getLocalDdays: () => [], saveDdays: vi.fn() }));
vi.mock("@/lib/onboardedFlag", () => ({ markOnboarded: vi.fn() }));

const { default: Onboarding } = await import("./Onboarding");

function pickRegion(name) {
  render(<Onboarding />);
  fireEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
}

describe("Onboarding pack groups", () => {
  it("shows India's groups, with every group open except College semesters", () => {
    pickRegion("India");
    const headings = screen.getAllByRole("heading", { level: 2 }).map(h => h.textContent);
    expect(headings).toEqual(["Entrance exams", "GATE", "Other exams", "College semesters (12)+"]);

    const toggle = screen.getByRole("button", { name: /College semesters \(12\)/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById(toggle.getAttribute("aria-controls"));
    expect(panel).not.toBeVisible();
    expect(screen.getByRole("button", { name: /^GE\s*GATE ECE/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /GRE\/GMAT/ })).toBeVisible();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(panel).toBeVisible();
    expect(within(panel).getAllByRole("button")).toHaveLength(12);
  });

  it("ends with Custom and hides groups the region has no packs for", () => {
    pickRegion("United Kingdom");
    const headings = screen.getAllByRole("heading", { level: 2 }).map(h => h.textContent);
    expect(headings).toEqual(["Entrance exams", "Other exams"]);
    const packs = screen.getAllByRole("button").filter(b => b.className.includes("onboarding__exam-btn"));
    expect(packs.at(-1)).toHaveTextContent("Custom");
  });
});
