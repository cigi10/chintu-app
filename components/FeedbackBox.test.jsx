import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const trackFeedbackSubmit = vi.fn();
vi.mock("@/lib/analytics", () => ({ trackFeedbackSubmit: (...args) => trackFeedbackSubmit(...args) }));

const { default: FeedbackBox } = await import("./FeedbackBox");

beforeEach(() => {
  trackFeedbackSubmit.mockReset();
  global.fetch = vi.fn();
});

afterEach(() => {
  delete global.fetch;
});

function openAndType(text, email = "") {
  fireEvent.click(screen.getByRole("button", { name: "What's missing?" }));
  fireEvent.change(screen.getByLabelText("What's missing from Studyloaf?"), { target: { value: text } });
  if (email) fireEvent.change(screen.getByLabelText(/Email \(optional/), { target: { value: email } });
}

describe("FeedbackBox", () => {
  it("starts as a small button and opens a form capped at 500 characters", () => {
    render(<FeedbackBox page="/timer" />);
    expect(screen.queryByRole("textbox")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "What's missing?" }));
    expect(screen.getByLabelText("What's missing from Studyloaf?")).toHaveAttribute("maxLength", "500");
    expect(screen.getByText("0/500")).toBeInTheDocument();
  });

  it("won't send empty text", async () => {
    render(<FeedbackBox page="/timer" />);
    openAndType("   ");
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Write something");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("sends the entry, thanks the user, and fires feedback_submit without the text", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    render(<FeedbackBox page="/tracker" />);
    openAndType("Mock test reminders", "me@example.com");
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Thanks!");
    const [url, init] = global.fetch.mock.calls[0];
    expect(url).toBe("/api/feedback");
    expect(JSON.parse(init.body)).toEqual({ message: "Mock test reminders", email: "me@example.com", page: "/tracker" });
    expect(trackFeedbackSubmit).toHaveBeenCalledWith("/tracker", true);
    expect(JSON.stringify(trackFeedbackSubmit.mock.calls)).not.toContain("Mock test");
  });

  it("shows the server's error and fires nothing on failure", async () => {
    global.fetch.mockResolvedValue({ ok: false, json: async () => ({ error: "That's a lot of feedback at once." }) });
    render(<FeedbackBox page="/dashboard" />);
    openAndType("Something");
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("a lot of feedback");
    expect(trackFeedbackSubmit).not.toHaveBeenCalled();
  });
});
