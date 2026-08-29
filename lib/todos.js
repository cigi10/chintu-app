// lib/todos.js
// Single source of truth for todos, written from TodoList, StudyTimer, and
// TimetableGrid — consolidated here so those three can't drift out of sync
// now that writes also need to reach Supabase.
import { getData, setData } from "@/lib/storage";

const TODO_KEY = "todos";
const LEGACY_TODO_KEY = "chintu-todos"; // pre-cloud-sync key name

// Kanban status. Older tasks (and anything written before this field
// existed) won't have `status` set, so callers should read it through
// getTaskStatus() rather than `task.status` directly.
export const STATUS = { TODO: "todo", IN_PROGRESS: "in-progress", DONE: "done" };

export function getTaskStatus(task) {
  if (task.status === STATUS.TODO || task.status === STATUS.IN_PROGRESS || task.status === STATUS.DONE) {
    return task.status;
  }
  return task.done ? STATUS.DONE : STATUS.TODO;
}

export function getLocalTodos() {
  try {
    const raw = localStorage.getItem(TODO_KEY) ?? localStorage.getItem(LEGACY_TODO_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Pulls the cloud list down (if signed in) so a returning user on a new
// device/browser doesn't see a stale/empty list.
export async function hydrateTodos() {
  try {
    const cloud = await getData(TODO_KEY, getLocalTodos());
    const list = cloud || [];
    localStorage.setItem(TODO_KEY, JSON.stringify(list));
    return list;
  } catch {
    return getLocalTodos();
  }
}

export async function saveTodos(list) {
  await setData(TODO_KEY, list);
}
