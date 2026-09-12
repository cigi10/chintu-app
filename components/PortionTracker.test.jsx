import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PortionTracker from "@/components/PortionTracker";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/goals", () => ({
  hydrateGoals: vi.fn(async () => {}),
  getGoalsForDate: vi.fn(() => []),
}));

vi.mock("@/lib/coins", () => ({
  addCoins: vi.fn(),
}));

const trackerState = {
  examPack: "JEE",
  subjects: {
    Physics: [{ id: "p1", name: "Kinematics", status: "not-started", subtopics: [], tags: ["JEE"] }],
  },
};

vi.mock("@/lib/tracker", () => ({
  hydrateTracker: vi.fn(async () => trackerState),
  getSessionLog: vi.fn(() => []),
  saveExamPackAndSubjects: vi.fn(),
  getAllTags: vi.fn(() => ["JEE", "Placements"]),
  addCustomTag: vi.fn(),
  // Mirrors the real lib/tracker.js#setTopicTags return shape ({ subjects })
  // rather than an empty mock — the component reads `.subjects` off the
  // return value, so a bare vi.fn() here would throw on click and mask a
  // real production return value with a false-passing test.
  setTopicTags: vi.fn((subject, topicId, tags) => ({
    subjects: {
      ...trackerState.subjects,
      [subject]: trackerState.subjects[subject].map(t => (t.id === topicId ? { ...t, tags } : t)),
    },
  })),
  importPackTopics: vi.fn(),
}));

vi.mock("@/lib/todos", () => ({
  upsertTodoForTopic: vi.fn(),
}));

import { upsertTodoForTopic } from "@/lib/todos";
import { addCustomTag, setTopicTags } from "@/lib/tracker";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PortionTracker — Fix 1 regression under tags", () => {
  it("still creates a todo when adding a topic while a specific tag filter is active", async () => {
    render(<PortionTracker />);

    await waitFor(() => expect(screen.getByText("Kinematics")).toBeInTheDocument());

    // Switch the active filter away from "All" before adding a topic.
    fireEvent.click(screen.getByText("Placements"));

    const input = screen.getByPlaceholderText("Add a topic to Physics...");
    fireEvent.change(input, { target: { value: "New Topic" } });
    fireEvent.click(screen.getByText("Add"));

    expect(upsertTodoForTopic).toHaveBeenCalledWith("New Topic", "Physics");
  });
});

describe("PortionTracker — tag filtering", () => {
  it("hides a topic that doesn't match the active filter but keeps the subject (and its add-topic form) visible", async () => {
    render(<PortionTracker />);
    await waitFor(() => expect(screen.getByText("Kinematics")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Placements"));

    expect(screen.queryByText("Kinematics")).not.toBeInTheDocument();
    expect(screen.getByText("Physics")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add a topic to Physics...")).toBeInTheDocument();
    expect(screen.getByText(/Nothing tagged "Placements" in Physics yet/)).toBeInTheDocument();
  });

  it("shows the topic again after switching back to All", async () => {
    render(<PortionTracker />);
    await waitFor(() => expect(screen.getByText("Kinematics")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Placements"));
    fireEvent.click(screen.getByText("All"));

    expect(screen.getByText("Kinematics")).toBeInTheDocument();
  });
});

describe("PortionTracker — custom tags via UI", () => {
  it("lets a user create a brand-new custom tag from the per-topic tag editor, not just from an imported pack", async () => {
    render(<PortionTracker />);
    await waitFor(() => expect(screen.getByText("Kinematics")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Edit tags" }));

    const tagInput = screen.getByPlaceholderText("New tag...");
    fireEvent.change(tagInput, { target: { value: "Personal Project" } });
    fireEvent.click(tagInput.closest(".tracker__tag-editor-new").querySelector(".tracker__add-btn"));

    expect(addCustomTag).toHaveBeenCalledWith("Personal Project");
    expect(setTopicTags).toHaveBeenCalledWith("Physics", "p1", ["JEE", "Personal Project"]);
  });
});
