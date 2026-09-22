import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Navbar from "@/components/Navbar";

let mockPathname = "/dashboard";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

let authStateCallback = null;
let mockUser = null;
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: mockUser } })),
      onAuthStateChange: vi.fn((cb) => {
        authStateCallback = cb;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
    },
  }),
}));

vi.mock("@/lib/coins", () => ({
  getLocalCoins: vi.fn(() => 0),
  hydrateCoins: vi.fn(async () => 0),
}));

vi.mock("@/lib/companion", () => ({
  hydrateCompanionName: vi.fn(async () => "Whiskers"),
  DEFAULT_NAME: "Biscuit",
}));

beforeEach(() => {
  mockPathname = "/dashboard";
  mockUser = null;
  authStateCallback = null;
  localStorage.clear();
});

describe("Navbar — brand text", () => {
  it("shows 'Studyloaf' as the brand for a guest, even with a named companion", async () => {
    render(<Navbar />);
    await waitFor(() => expect(screen.getByText("Studyloaf")).toBeInTheDocument());
    expect(screen.queryByText("Whiskers")).not.toBeInTheDocument();
  });

  it("shows the companion's actual name once signed in", async () => {
    mockUser = { email: "test@example.com" };
    render(<Navbar />);
    await waitFor(() => expect(screen.getByText("Whiskers")).toBeInTheDocument());
    expect(screen.queryByText("Studyloaf")).not.toBeInTheDocument();
  });
});

describe("Navbar — Study active-state scoping", () => {
  it("does not highlight Study while on /dashboard (Home) or /timer, only Home/Timer themselves", () => {
    mockPathname = "/dashboard";
    const { unmount } = render(<Navbar />);
    expect(screen.getByRole("link", { name: /^Home/ })).toHaveClass("navbar__link--active");
    expect(screen.getByRole("button", { name: /^Study/ })).not.toHaveClass("navbar__link--active");
    unmount();

    mockPathname = "/timer";
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /^Timer/ })).toHaveClass("navbar__link--active");
    expect(screen.getByRole("button", { name: /^Study/ })).not.toHaveClass("navbar__link--active");
  });

  it("highlights Study for a route that is genuinely only a Study item, like /goals", () => {
    mockPathname = "/goals";
    render(<Navbar />);
    expect(screen.getByRole("button", { name: /^Study/ })).toHaveClass("navbar__link--active");
  });
});
