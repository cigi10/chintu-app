import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ResetPasswordPage from "./page";

let authStateCallback: ((event: string) => void) | undefined;
let getSessionResult: { data: { session: unknown } };

const mockSupabase = {
  auth: {
    onAuthStateChange: vi.fn((cb: (event: string) => void) => {
      authStateCallback = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }),
    getSession: vi.fn(async () => getSessionResult),
    updateUser: vi.fn(async () => ({ error: null })),
  },
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

let searchParamsValue = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParamsValue,
}));

beforeEach(() => {
  searchParamsValue = new URLSearchParams();
  authStateCallback = undefined;
  getSessionResult = { data: { session: null } };
  vi.clearAllMocks();
});

describe("ResetPasswordPage", () => {
  it("shows a checking state before the recovery session resolves", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByText(/checking your reset link/i)).toBeInTheDocument();
  });

  it("shows an invalid-link message when the URL carries an error param", async () => {
    searchParamsValue = new URLSearchParams("error=access_denied");
    render(<ResetPasswordPage />);
    await waitFor(() =>
      expect(screen.getByText(/invalid or has expired/i)).toBeInTheDocument()
    );
    expect(screen.queryByPlaceholderText(/new password/i)).not.toBeInTheDocument();
  });

  it("shows the password form once Supabase fires a PASSWORD_RECOVERY event", async () => {
    render(<ResetPasswordPage />);
    expect(authStateCallback).toBeDefined();
    authStateCallback!("PASSWORD_RECOVERY");
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument()
    );
  });

  it("shows the password form when a session already exists (event fired before mount)", async () => {
    getSessionResult = { data: { session: { user: { id: "u1" } } } };
    render(<ResetPasswordPage />);
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument()
    );
  });

  it("never shows the form without either a recovery event or a session", async () => {
    render(<ResetPasswordPage />);
    await waitFor(() =>
      expect(screen.getByText(/checking your reset link/i)).toBeInTheDocument()
    );
    expect(screen.queryByPlaceholderText(/new password/i)).not.toBeInTheDocument();
  });
});
