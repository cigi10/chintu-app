import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/storage", () => ({
  getData: vi.fn(async (_key, fallback) => fallback),
  setData: vi.fn(async () => {}),
}));

import { getData, setData } from "@/lib/storage";
import { getLocalTodos, hydrateTodos, saveTodos, getTaskStatus, STATUS, upsertTodoForTopic } from "@/lib/todos";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("getLocalTodos", () => {
  it("defaults to an empty list", () => {
    expect(getLocalTodos()).toEqual([]);
  });

  it("falls back to the legacy chintu-todos key", () => {
    localStorage.setItem("chintu-todos", JSON.stringify([{ id: 1, text: "a" }]));
    expect(getLocalTodos()).toEqual([{ id: 1, text: "a" }]);
  });

  it("prefers the new todos key over the legacy one", () => {
    localStorage.setItem("chintu-todos", JSON.stringify([{ id: 1, text: "old" }]));
    localStorage.setItem("todos", JSON.stringify([{ id: 2, text: "new" }]));
    expect(getLocalTodos()).toEqual([{ id: 2, text: "new" }]);
  });
});

describe("saveTodos", () => {
  it("writes through lib/storage's setData", async () => {
    await saveTodos([{ id: 1, text: "a" }]);
    expect(setData).toHaveBeenCalledWith("todos", [{ id: 1, text: "a" }]);
  });
});

describe("hydrateTodos", () => {
  it("writes the resolved cloud list into the local todos key", async () => {
    getData.mockResolvedValueOnce([{ id: 3, text: "cloud" }]);
    const result = await hydrateTodos();
    expect(result).toEqual([{ id: 3, text: "cloud" }]);
    expect(getLocalTodos()).toEqual([{ id: 3, text: "cloud" }]);
  });

  it("falls back to the local list if the cloud read fails", async () => {
    localStorage.setItem("todos", JSON.stringify([{ id: 4, text: "local" }]));
    getData.mockRejectedValueOnce(new Error("network error"));
    const result = await hydrateTodos();
    expect(result).toEqual([{ id: 4, text: "local" }]);
  });
});

describe("upsertTodoForTopic", () => {
  it("creates a new todo for a topic that isn't tracked yet", () => {
    const updated = upsertTodoForTopic("Kinematics", "Physics");
    expect(updated).toHaveLength(1);
    expect(updated[0]).toMatchObject({ text: "Kinematics", subject: "Physics", status: STATUS.TODO, done: false });
    expect(setData).toHaveBeenCalledWith("todos", updated);
  });

  it("does not create a duplicate when the same topic is added again", () => {
    localStorage.setItem("todos", JSON.stringify([
      { id: 1, text: "Kinematics", status: STATUS.TODO, done: false, subtasks: [], subject: "Physics" },
    ]));
    const updated = upsertTodoForTopic("Kinematics", "Physics");
    expect(updated).toHaveLength(1);
    expect(setData).not.toHaveBeenCalled();
  });

  it("matches existing topics case-insensitively and ignoring surrounding whitespace", () => {
    localStorage.setItem("todos", JSON.stringify([
      { id: 1, text: "Kinematics", status: STATUS.TODO, done: false, subtasks: [], subject: "Physics" },
    ]));
    const updated = upsertTodoForTopic("  kinematics  ", "Physics");
    expect(updated).toHaveLength(1);
    expect(setData).not.toHaveBeenCalled();
  });

  it("links an existing, subject-less todo instead of creating a duplicate", () => {
    localStorage.setItem("todos", JSON.stringify([
      { id: 1, text: "Kinematics", status: STATUS.TODO, done: false, subtasks: [] },
    ]));
    const updated = upsertTodoForTopic("Kinematics", "Physics");
    expect(updated).toHaveLength(1);
    expect(updated[0].subject).toBe("Physics");
    expect(setData).toHaveBeenCalledWith("todos", updated);
  });

  it("leaves an already-linked todo's subject alone", () => {
    localStorage.setItem("todos", JSON.stringify([
      { id: 1, text: "Kinematics", status: STATUS.TODO, done: false, subtasks: [], subject: "Physics" },
    ]));
    const updated = upsertTodoForTopic("Kinematics", "Advanced Physics");
    expect(updated[0].subject).toBe("Physics");
    expect(setData).not.toHaveBeenCalled();
  });

  it("does nothing for blank/whitespace-only topic names", () => {
    const updated = upsertTodoForTopic("   ", "Physics");
    expect(updated).toEqual([]);
    expect(setData).not.toHaveBeenCalled();
  });
});

describe("getTaskStatus", () => {
  it("returns the explicit status when present", () => {
    expect(getTaskStatus({ status: "in-progress", done: false })).toBe(STATUS.IN_PROGRESS);
    expect(getTaskStatus({ status: "done", done: false })).toBe(STATUS.DONE);
  });

  it("falls back to done when a legacy task has done:true and no status", () => {
    expect(getTaskStatus({ done: true })).toBe(STATUS.DONE);
  });

  it("falls back to todo when a legacy task has no status and isn't done", () => {
    expect(getTaskStatus({ done: false })).toBe(STATUS.TODO);
    expect(getTaskStatus({})).toBe(STATUS.TODO);
  });

  it("ignores an unrecognized status value and falls back on done", () => {
    expect(getTaskStatus({ status: "bogus", done: true })).toBe(STATUS.DONE);
  });
});
