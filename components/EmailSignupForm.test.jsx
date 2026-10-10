import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const trackEmailSignup = vi.fn();
vi.mock("@/lib/analytics", () => ({ trackEmailSignup: (...args) => trackEmailSignup(...args) }));

const { default: EmailSignupForm } = await import("./EmailSignupForm");

function fill(email, consent = true) {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  if (consent) fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
}

beforeEach(() => {
  trackEmailSignup.mockReset();
  global.fetch = vi.fn();
});

afterEach(() => {
  delete global.fetch;
});

describe("EmailSignupForm", () => {
  it("renders an unticked consent checkbox with a privacy policy link", () => {
    render(<EmailSignupForm sourcePage="/gate" />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByText(/I agree to receive study emails from Studyloaf\. I can unsubscribe any time\./)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/privacy");
  });

  it("won't submit without consent", async () => {
    render(<EmailSignupForm sourcePage="/gate" />);
    fill("student@example.com", false);
    expect(await screen.findByRole("alert")).toHaveTextContent("tick the box");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("won't submit an invalid address", async () => {
    render(<EmailSignupForm sourcePage="/gate" />);
    fill("not-an-email");
    expect(await screen.findByRole("alert")).toHaveTextContent("valid email");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("posts the address, consent and source page, then shows the server's message and fires email_signup", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ message: "You're on the list." }) });
    render(<EmailSignupForm sourcePage="/gate" />);
    fill("student@example.com");
    expect(await screen.findByRole("status")).toHaveTextContent("You're on the list.");
    const [url, init] = global.fetch.mock.calls[0];
    expect(url).toBe("/api/email-signup");
    expect(JSON.parse(init.body)).toEqual({ email: "student@example.com", consent: true, source_page: "/gate" });
    expect(trackEmailSignup).toHaveBeenCalledWith("/gate");
  });

  it("shows the server's error and fires no event when the request fails", async () => {
    global.fetch.mockResolvedValue({ ok: false, json: async () => ({ error: "Too many attempts." }) });
    render(<EmailSignupForm sourcePage="/" />);
    fill("student@example.com");
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts.");
    await waitFor(() => expect(screen.getByRole("button", { name: "Sign up" })).not.toBeDisabled());
    expect(trackEmailSignup).not.toHaveBeenCalled();
  });
});
