"use client";
import "@/styles/todo.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Companion from "@/components/Companion";
import { addCoins } from "@/lib/coins";
import { hydrateTodos, saveTodos as persistTodos, getTaskStatus, STATUS } from "@/lib/todos";

const PRIORITY = { high: "#F2619C", medium: "#F9C060", low: "#7EC8A0" };
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const COLUMNS = [
  { id: STATUS.TODO,        label: "To Do" },
  { id: STATUS.IN_PROGRESS, label: "In Progress" },
  { id: STATUS.DONE,        label: "Done" },
];

function save(d) { persistTodos(d); }

function sortTasks(list, mode) {
  const arr = [...list];
  if (mode === "due") {
    arr.sort((a, b) => {
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due < b.due ? -1 : a.due > b.due ? 1 : 0;
    });
  } else {
    arr.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1));
  }
  return arr;
}

export default function TodoList() {
  const router = useRouter();
  const [tasks, setTasks]       = useState([]);
  const [text, setText]         = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue]           = useState("");
  const [duration, setDuration] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [subtextMap, setSubtextMap] = useState({});
  const [sortBy, setSortBy]     = useState({ [STATUS.TODO]: "priority", [STATUS.IN_PROGRESS]: "priority", [STATUS.DONE]: "priority" });
  const [dragTaskId, setDragTaskId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  useEffect(() => { hydrateTodos().then(setTasks); }, []);

  function addTask() {
    if (!text.trim()) return;
    const task = {
      id: Date.now(),
      text: text.trim(),
      priority,
      due,
      durationMinutes: duration ? parseInt(duration, 10) : null,
      done: false,
      status: STATUS.TODO,
      subtasks: [],
    };
    const updated = [task, ...tasks];
    setTasks(updated); save(updated); setText(""); setDue(""); setDuration("");
  }

  // Moving a card to Done keeps the legacy `done: true` flag in sync so
  // every other page's !t.done filter (dashboard, timer, timetable) still
  // works; moving it out of Done clears that flag again.
  function moveTask(id, newStatus) {
    const updated = tasks.map(t => {
      if (t.id !== id) return t;
      const wasDone = getTaskStatus(t) === STATUS.DONE;
      const nowDone = newStatus === STATUS.DONE;
      if (!wasDone && nowDone) addCoins(2);
      return { ...t, status: newStatus, done: nowDone };
    });
    setTasks(updated); save(updated);
  }

  function removeTask(id) {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated); save(updated);
  }

  function addSubtask(taskId) {
    const text = (subtextMap[taskId] || "").trim();
    if (!text) return;
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: [...(t.subtasks || []), { id: Date.now(), text, done: false }] };
    });
    setTasks(updated); save(updated);
    setSubtextMap(prev => ({ ...prev, [taskId]: "" }));
  }

  function toggleSubtaskDone(taskId, subtaskId) {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: (t.subtasks || []).map(s => s.id === subtaskId ? { ...s, done: !s.done } : s) };
    });
    setTasks(updated); save(updated);
  }

  function startTaskInTimer(task) {
    const params = new URLSearchParams({ subject: task.text });
    if (task.durationMinutes) params.set("duration", String(task.durationMinutes));
    router.push(`/timer?${params.toString()}`);
  }

  function handleDragStart(e, taskId) {
    setDragTaskId(taskId);
    try {
      e.dataTransfer.setData("text/plain", String(taskId));
      e.dataTransfer.effectAllowed = "move";
    } catch {}
  }
  function handleDragEnd() {
    setDragTaskId(null);
    setDragOverCol(null);
  }
  function handleDragOver(e, colId) {
    e.preventDefault();
    try { e.dataTransfer.dropEffect = "move"; } catch {}
    setDragOverCol(colId);
  }
  function handleDrop(e, colId) {
    e.preventDefault();
    let id = dragTaskId;
    try {
      const raw = e.dataTransfer.getData("text/plain");
      if (raw) id = Number(raw);
    } catch {}
    if (id != null) moveTask(id, colId);
    setDragTaskId(null);
    setDragOverCol(null);
  }

  const allDone = tasks.length > 0 && tasks.every(t => getTaskStatus(t) === STATUS.DONE);

  const columnTasks = {};
  for (const col of COLUMNS) {
    columnTasks[col.id] = sortTasks(tasks.filter(t => getTaskStatus(t) === col.id), sortBy[col.id]);
  }

  return (
    <div className="todo">
      {allDone && (
        <div className="todo__all-done">
          <div className="todo__all-done-companion">
            <Companion mood="celebrating" />
          </div>
          <p>All done! You crushed it.</p>
        </div>
      )}

      <div className="todo__form">
        <input className="todo__input" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add a task..." />
        <select className="todo__select" value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input className="todo__date" type="date" value={due} onChange={e => setDue(e.target.value)} />
        <input
          className="todo__duration-input"
          type="number"
          min="1"
          max="300"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          placeholder="min"
        />
        <button className="todo__add-btn" onClick={addTask}>Add</button>
      </div>

      <div className="todo__board">
        {COLUMNS.map(col => (
          <div
            key={col.id}
            className={`todo__column${dragOverCol === col.id ? " todo__column--drag-over" : ""}`}
            onDragOver={e => handleDragOver(e, col.id)}
            onDragLeave={() => setDragOverCol(prev => (prev === col.id ? null : prev))}
            onDrop={e => handleDrop(e, col.id)}
          >
            <div className="todo__column-header">
              <h3 className="todo__column-title">{col.label}</h3>
              <span className="todo__column-count">{columnTasks[col.id].length}</span>
              <select
                className="todo__sort-select"
                value={sortBy[col.id]}
                onChange={e => setSortBy(prev => ({ ...prev, [col.id]: e.target.value }))}
                title="Sort this column"
              >
                <option value="priority">By priority</option>
                <option value="due">By due date</option>
              </select>
            </div>

            <div className="todo__column-body">
              {columnTasks[col.id].length === 0 && (
                <p className="todo__column-empty">Nothing here yet</p>
              )}

              {columnTasks[col.id].map(task => (
                <div
                  key={task.id}
                  className={`todo__card${dragTaskId === task.id ? " todo__card--dragging" : ""}${col.id === STATUS.DONE ? " todo__card--done" : ""}`}
                  draggable
                  onDragStart={e => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="todo__card-row">
                    <span className="todo__priority-dot" style={{ background: PRIORITY[task.priority] }} />
                    <span className={`todo__task-text${col.id === STATUS.DONE ? " todo__task-text--done" : ""}`}>{task.text}</span>
                    <button className="todo__remove-btn" onClick={() => removeTask(task.id)} title="Delete" aria-label="Delete task">×</button>
                  </div>

                  {(task.durationMinutes || task.due) && (
                    <div className="todo__card-meta">
                      {task.durationMinutes && <span className="todo__duration-pill">{task.durationMinutes}m</span>}
                      {task.due && <span className="todo__due">{task.due}</span>}
                    </div>
                  )}

                  <div className="todo__card-actions">
                    <select
                      className="todo__move-select"
                      value={col.id}
                      onChange={e => moveTask(task.id, e.target.value)}
                      title="Move to column"
                    >
                      {COLUMNS.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                    <button className="todo__study-btn" onClick={() => startTaskInTimer(task)} title="Start in timer">
                      Study
                    </button>
                    <button
                      className="todo__expand-btn"
                      onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
                      aria-label={expandedId === task.id ? "Hide subtasks" : "Show subtasks"}
                    >
                      {expandedId === task.id ? "−" : "+"}
                    </button>
                  </div>

                  {expandedId === task.id && (
                    <div className="todo__subtasks">
                      {(task.subtasks || []).map(s => (
                        <div key={s.id} className="todo__subtask-row">
                          <button className="todo__check todo__check--small" onClick={() => toggleSubtaskDone(task.id, s.id)}>
                            {s.done ? "●" : "○"}
                          </button>
                          <span className={s.done ? "todo__task-text todo__task-text--done" : "todo__task-text"}>{s.text}</span>
                        </div>
                      ))}
                      <div className="todo__subtask-add">
                        <input
                          className="todo__input todo__input--small"
                          value={subtextMap[task.id] || ""}
                          onChange={e => setSubtextMap(prev => ({ ...prev, [task.id]: e.target.value }))}
                          onKeyDown={e => e.key === "Enter" && addSubtask(task.id)}
                          placeholder="Add subtask..."
                        />
                        <button className="todo__add-btn todo__add-btn--small" onClick={() => addSubtask(task.id)}>Add</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
