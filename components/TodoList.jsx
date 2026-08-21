"use client";
import "@/styles/todo.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Companion from "@/components/Companion";
import { addCoins } from "@/lib/coins";
import { hydrateTodos, saveTodos as persistTodos } from "@/lib/todos";

const PRIORITY  = { high: "#F2619C", medium: "#F9C060", low: "#7EC8A0" };

function save(d) { persistTodos(d); }

export default function TodoList() {
  const router = useRouter();
  const [tasks, setTasks]       = useState([]);
  const [text, setText]         = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue]           = useState("");
  const [duration, setDuration] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [subtextMap, setSubtextMap] = useState({});

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
      subtasks: [],
    };
    const updated = [task, ...tasks];
    setTasks(updated); save(updated); setText(""); setDue(""); setDuration("");
  }

  function toggleDone(id) {
    const updated = tasks.map(t => {
      if (t.id !== id) return t;
      if (!t.done) addCoins(2);
      return { ...t, done: !t.done };
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

  const allDone = tasks.length > 0 && tasks.every(t => t.done);
  const pending = tasks.filter(t => !t.done);
  const done    = tasks.filter(t => t.done);

  return (
    <div className="todo">
      {allDone && (
        <div className="todo__all-done">
          <Companion mood="celebrating" />
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

      <div className="todo__list">
        {pending.map(task => (
          <div key={task.id} className="todo__task">
            <div className="todo__task-row">
              <span className="todo__priority-dot" style={{ background: PRIORITY[task.priority] }} />
              <button className="todo__check" onClick={() => toggleDone(task.id)}>○</button>
              <span className="todo__task-text">{task.text}</span>
              {task.durationMinutes && <span className="todo__duration-pill">{task.durationMinutes}m</span>}
              {task.due && <span className="todo__due">{task.due}</span>}
              <button className="todo__study-btn" onClick={() => startTaskInTimer(task)} title="Start in timer">
                Study
              </button>
              <button className="todo__expand-btn" onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}>
                {expandedId === task.id ? "−" : "+"}
              </button>
              <button className="todo__remove-btn" onClick={() => removeTask(task.id)}>×</button>
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

        {done.length > 0 && (
          <div className="todo__done-section">
            <p className="todo__done-label">Completed</p>
            {done.map(task => (
              <div key={task.id} className="todo__task todo__task--done">
                <div className="todo__task-row">
                  <span className="todo__priority-dot" style={{ background: PRIORITY[task.priority], opacity: 0.4 }} />
                  <button className="todo__check" onClick={() => toggleDone(task.id)}>●</button>
                  <span className="todo__task-text todo__task-text--done">{task.text}</span>
                  <button className="todo__remove-btn" onClick={() => removeTask(task.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}