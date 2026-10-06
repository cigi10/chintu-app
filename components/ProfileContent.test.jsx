import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const auth = vi.hoisted(() => ({ signOut: vi.fn(async () => ({})) }));
const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: async () => ({ data: { session: { user: { email: "a@b.co", created_at: "2026-09-01" } } } }),
      getUser: async () => ({ data: { user: null } }),
      signOut: auth.signOut,
    },
  }),
}));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Companion", () => ({ default: () => null }));
vi.mock("@/components/RenameCompanion", () => ({ default: () => null }));
vi.mock("@/lib/companion", () => ({ hydrateCompanionName: async () => "Pip", DEFAULT_NAME: "Biscuit" }));
vi.mock("@/lib/storage", () => ({ flushPendingWrites: vi.fn() }));

const { flushPendingWrites } = await import("@/lib/storage");
const { default: ProfileContent } = await import("./ProfileContent");

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  localStorage.setItem("journal", JSON.stringify([{ id: 1 }]));
});

async function clickSignOut(name = "Sign out") {
  fireEvent.click(await screen.findByRole("button", { name }));
}

describe("ProfileContent sign-out", () => {
  it("flushes first, then signs out and clears local data when everything synced", async () => {
    flushPendingWrites.mockResolvedValue({ ok: true, failed: [] });
    render(<ProfileContent />);
    await clickSignOut();

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/login"));
    expect(flushPendingWrites).toHaveBeenCalled();
    expect(flushPendingWrites.mock.invocationCallOrder[0]).toBeLessThan(auth.signOut.mock.invocationCallOrder[0]);
    expect(localStorage.getItem("journal")).toBeNull();
  });

  it("keeps the session and local data, and says so, when a flush fails", async () => {
    flushPendingWrites.mockResolvedValue({ ok: false, failed: ["journal"] });
    render(<ProfileContent />);
    await clickSignOut();

    expect(await screen.findByRole("alert")).toHaveTextContent(/haven't synced yet/);
    expect(auth.signOut).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
    expect(localStorage.getItem("journal")).toBe(JSON.stringify([{ id: 1 }]));
  });

  it("lets the user retry, and signs out once the retry syncs", async () => {
    flushPendingWrites.mockResolvedValueOnce({ ok: false, failed: ["journal"] }).mockResolvedValueOnce({ ok: true, failed: [] });
    render(<ProfileContent />);
    await clickSignOut();
    await clickSignOut("Try signing out again");

    await waitFor(() => expect(auth.signOut).toHaveBeenCalledTimes(1));
    expect(flushPendingWrites).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem("journal")).toBeNull();
  });
});
