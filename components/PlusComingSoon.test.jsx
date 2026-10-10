import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const trackPlusInterest = vi.fn();
vi.mock("@/lib/analytics", () => ({
  trackPlusInterest: (...args) => trackPlusInterest(...args),
  trackEmailSignup: vi.fn(),
}));

const { default: PlusComingSoon } = await import("./PlusComingSoon");

beforeEach(() => {
  trackPlusInterest.mockReset();
  global.fetch = vi.fn();
});

afterEach(() => {
  delete global.fetch;
});

function joinWaitlist(email = "student@example.com") {
  fireEvent.click(screen.getByRole("button", { name: "Notify me" }));
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
}

describe("PlusComingSoon", () => {
  it("is clearly labelled coming soon with nothing charged, and lists the proposed features", () => {
    render(<PlusComingSoon source="shop" />);
    expect(screen.getByText("Coming soon, nothing is charged")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Studyloaf Plus: coming soon" })).toBeInTheDocument();
    expect(screen.getByText(/Everything that.s free today stays free/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("records a view on mount and an open when Notify me is tapped", () => {
    render(<PlusComingSoon source="profile" />);
    expect(trackPlusInterest).toHaveBeenCalledWith("view", "profile");
    fireEvent.click(screen.getByRole("button", { name: "Notify me" }));
    expect(trackPlusInterest).toHaveBeenCalledWith("open", "profile");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByText(/I agree to receive study emails from Studyloaf/)).toBeInTheDocument();
  });

  it("joins the waitlist with source plus_waitlist and records the signup", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ message: "You're on the Plus waitlist." }) });
    render(<PlusComingSoon source="shop" />);
    joinWaitlist();
    expect(await screen.findByRole("status")).toHaveTextContent("Plus waitlist");
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toMatchObject({ source_page: "plus_waitlist", consent: true });
    expect(trackPlusInterest).toHaveBeenCalledWith("signup", "shop");
  });

  it("shows the friendly not-open message while the table doesn't exist, and records no signup", async () => {
    global.fetch.mockResolvedValue({ ok: false, json: async () => ({ error: "Sign-ups aren't open quite yet. Please check back in a few days." }) });
    render(<PlusComingSoon source="shop" />);
    joinWaitlist();
    expect(await screen.findByRole("alert")).toHaveTextContent("aren't open quite yet");
    expect(trackPlusInterest).not.toHaveBeenCalledWith("signup", "shop");
  });
});
