import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import StudyRooms from "@/components/StudyRooms";

// A fake presence channel: "sync" fires once on subscribe with a
// presenceState sized by PRESENCE_COUNT, simulating N people already in
// the room (including this client, once it tracks itself).
const PRESENCE_COUNT = 12;

function fakePresenceState() {
  const state = {};
  for (let i = 0; i < PRESENCE_COUNT; i++) state[`anon-${i}`] = [{}];
  return state;
}

// Only the "everyone" room is populated in this test — the per-tag rooms
// stay empty, so a tag's own count badge (0 -> hidden) can't be confused
// with the main headcount number.
function makeFakeChannel(name) {
  let syncHandler = null;
  const channel = {
    on: vi.fn((_type, _opts, handler) => {
      syncHandler = handler;
      return channel;
    }),
    subscribe: vi.fn((cb) => {
      cb("SUBSCRIBED");
      syncHandler?.();
      return channel;
    }),
    presenceState: vi.fn(() => (name === "room:everyone" ? fakePresenceState() : {})),
    track: vi.fn(),
    untrack: vi.fn(),
  };
  return channel;
}

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    channel: vi.fn((name) => makeFakeChannel(name)),
    removeChannel: vi.fn(),
  }),
}));

vi.mock("@/components/StudyTimer", () => ({
  default: () => <div data-testid="study-timer" />,
}));

beforeEach(() => {
  localStorage.clear();
});

describe("StudyRooms — headcount instead of per-person dots", () => {
  it("shows a single headcount number with no per-person orb indicators", async () => {
    const { container } = render(<StudyRooms />);

    await waitFor(() => expect(screen.getByText("studying now")).toBeInTheDocument());
    expect(screen.getByText(String(PRESENCE_COUNT))).toBeInTheDocument();

    // No leftover per-person visual indicators of any kind.
    expect(container.querySelector(".rooms__orb")).toBeNull();
    expect(container.querySelector(".rooms__orbs")).toBeNull();
    expect(container.querySelector(".rooms__orb-overflow")).toBeNull();
  });
});
