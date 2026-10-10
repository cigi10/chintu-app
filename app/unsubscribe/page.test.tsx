import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createUnsubscribeToken } from "@/lib/unsubscribeToken";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/app/unsubscribe/actions", () => ({ unsubscribe: vi.fn() }));

const { default: UnsubscribePage, metadata } = await import("./page");

const ID = "3f2b8c1e-9a4d-4c6b-8e2f-1a2b3c4d5e6f";
const SECRET = "test-secret";

async function renderWith(token?: string) {
  render(await UnsubscribePage({ searchParams: Promise.resolve(token === undefined ? {} : { token }) }));
}

beforeEach(() => vi.stubEnv("UNSUBSCRIBE_TOKEN_SECRET", SECRET));
afterEach(() => vi.unstubAllEnvs());

describe("/unsubscribe", () => {
  it("is noindex and sends no referrer", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.referrer).toBe("no-referrer");
  });

  it("shows a confirm button, not an automatic unsubscribe, for a valid token", async () => {
    await renderWith(createUnsubscribeToken(ID, SECRET));
    expect(screen.getByRole("button", { name: "Unsubscribe" })).toBeInTheDocument();
  });

  it("shows no button for a missing or forged token", async () => {
    await renderWith(createUnsubscribeToken(ID, "wrong-secret"));
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText(/isn.t valid/)).toBeInTheDocument();
  });

  it("shows no button with no token at all", async () => {
    await renderWith();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
