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

let mockCompanionName = "Whiskers";
vi.mock("@/lib/companion", () => ({
  hydrateCompanionName: vi.fn(async () => mockCompanionName),
  DEFAULT_NAME: "Biscuit",
  COMPANION_NAME_CHANGE_EVENT: "companion-name-change",
}));

beforeEach(() => {
  mockPathname = "/dashboard";
  mockUser = null;
  authStateCallback = null;
  mockCompanionName = "Whiskers";
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

  it("picks up a rename made elsewhere on the page via the companion-name-change event", async () => {
    mockUser = { email: "test@example.com" };
    render(<Navbar />);
    await waitFor(() => expect(screen.getByText("Whiskers")).toBeInTheDocument());

    mockCompanionName = "Sushi";
    window.dispatchEvent(new Event("companion-name-change"));

    await waitFor(() => expect(screen.getByText("Sushi")).toBeInTheDocument());
    expect(screen.queryByText("Whiskers")).not.toBeInTheDocument();
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
