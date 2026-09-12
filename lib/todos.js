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

// Called when a topic/subject gets added to study elsewhere in the app
// (currently: the Portion Tracker's "add a topic" / "add a new subject"
// forms) so it also surfaces as something to actually do — otherwise
// adding a topic to a syllabus and having it show up nowhere on the Todo
// board or the dashboard's "today's top 3" feels like it silently did
// nothing. Idempotent by task text (case-insensitive, trimmed): adding
// the same topic twice never creates a duplicate card. If a matching
// card already exists but isn't yet linked to a subject, this links it
// rather than leaving it untouched or creating a second one.
export function upsertTodoForTopic(topicName, subject) {
  const name = (topicName || "").trim();
  if (!name) return getLocalTodos();

  const todos = getLocalTodos();
  const idx = todos.findIndex(t => (t.text || "").trim().toLowerCase() === name.toLowerCase());

  let updated;
  if (idx === -1) {
    const task = {
      id: `${name}-${Date.now()}`,
      text: name,
      priority: "medium",
      due: "",
      durationMinutes: null,
      done: false,
      status: STATUS.TODO,
      subtasks: [],
      subject: subject || null,
    };
    updated = [task, ...todos];
  } else if (subject && !todos[idx].subject) {
    updated = todos.map((t, i) => (i === idx ? { ...t, subject } : t));
  } else {
    return todos; // already tracked under this text — nothing to change
  }

  saveTodos(updated);
  return updated;
}
