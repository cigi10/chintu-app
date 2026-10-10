import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
// A signed-out visitor: every hydrate* call falls back to localStorage.
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      getUser: async () => ({ data: { user: null } }),
      getSession: async () => ({ data: { session: null } }),
    },
  }),
}));

const { default: DashboardContent, NEUTRAL_GREETING, greetingForHour, getDailyQuote } = await import("./DashboardContent");

afterEach(() => vi.useRealTimers());

describe("greetingForHour", () => {
  it("picks the greeting for the visitor's local hour", () => {
    expect(greetingForHour(8)).toBe("Good morning!");
    expect(greetingForHour(14)).toBe("Good afternoon!");
    expect(greetingForHour(19)).toBe("Good evening!");
    expect(greetingForHour(23)).toBe("Studying late?");
  });
});

describe("dashboard greeting hydration", () => {
  it("server-renders the neutral greeting, whatever the server's clock says", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 10, 8, 0));
    const html = renderToString(<DashboardContent />);
    expect(html).toContain(NEUTRAL_GREETING);
    expect(html).not.toContain("Good morning!");
  });

  it("server-renders no daily quote, since the server's date can be a different day", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const now = new Date(2026, 9, 10, 8, 0);
    vi.setSystemTime(now);
    expect(renderToString(<DashboardContent />)).not.toContain(getDailyQuote(now).replace(/'/g, "&#x27;"));
  });

  it("switches to the time-based greeting after mounting in the browser", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 10, 19, 0));
    render(<DashboardContent />);
    expect(await screen.findByRole("heading", { level: 1, name: "Good evening!" })).toBeInTheDocument();
    expect(screen.getByText(`"${getDailyQuote(new Date(2026, 9, 10, 19, 0))}"`)).toBeInTheDocument();
  });
});
