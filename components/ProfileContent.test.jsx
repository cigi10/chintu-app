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

  it("offers Sign out anyway only after a failed sync", async () => {
    flushPendingWrites.mockResolvedValue({ ok: false, failed: ["journal"] });
    render(<ProfileContent />);
    expect(screen.queryByRole("button", { name: "Sign out anyway" })).toBeNull();
    await clickSignOut();
    expect(await screen.findByRole("button", { name: "Sign out anyway" })).toBeInTheDocument();
  });

  it("asks for confirmation, with Cancel as the focused default, and cancelling keeps everything", async () => {
    flushPendingWrites.mockResolvedValue({ ok: false, failed: ["journal"] });
    render(<ProfileContent />);
    await clickSignOut();
    fireEvent.click(await screen.findByRole("button", { name: "Sign out anyway" }));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveTextContent(/haven't synced will be permanently deleted/);
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(auth.signOut).not.toHaveBeenCalled();
    expect(localStorage.getItem("journal")).toBe(JSON.stringify([{ id: 1 }]));
  });

  it("treats Escape like Cancel", async () => {
    flushPendingWrites.mockResolvedValue({ ok: false, failed: ["journal"] });
    render(<ProfileContent />);
    await clickSignOut();
    fireEvent.click(await screen.findByRole("button", { name: "Sign out anyway" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(auth.signOut).not.toHaveBeenCalled();
  });

  it("deletes local data and signs out when the user confirms", async () => {
    flushPendingWrites.mockResolvedValue({ ok: false, failed: ["journal"] });
    render(<ProfileContent />);
    await clickSignOut();
    fireEvent.click(await screen.findByRole("button", { name: "Sign out anyway" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete and sign out" }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/login"));
    expect(auth.signOut).toHaveBeenCalledTimes(1);
    expect(flushPendingWrites).toHaveBeenCalledTimes(1); // no second flush attempt
    expect(localStorage.getItem("journal")).toBeNull();
  });
});
