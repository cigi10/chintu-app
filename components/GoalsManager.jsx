"use client";
import "@/styles/goals.css";
import { useState, useEffect } from "react";
import { loadGoals, saveGoals, GOAL_COLORS, WEEK_DAYS } from "@/lib/goals";

function newId() { return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

function GoalModal({ existing, onSave, onDelete, onClose }) {
  const [subject, setSubject] = useState(existing?.subject || "");
  const [color, setColor]     = useState(existing?.color || GOAL_COLORS[0].value);
  const [repeatType, setRepeatType] = useState(existing?.repeat?.type || "weekly");
  const [days, setDays]       = useState(existing?.repeat?.days || []);
  const [durationMinutes, setDurationMinutes] = useState(existing?.durationMinutes || 30);

  function toggleDay(day) {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  function handleSave() {
    if (!subject.trim()) return;
    onSave({
      id: existing?.id || newId(),
      subject: subject.trim(),
      color,
      durationMinutes: Number(durationMinutes) || 30,
      repeat: {
        type: repeatType,
        days: repeatType === "weekly" ? days : [],
        startDate: existing?.repeat?.startDate || null,
        endDate: existing?.repeat?.endDate || null,
      },
    });
  }

  return (
    <div className="goal-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="goal-modal">
        <button className="goal-modal__close" onClick={onClose} aria-label="Close">×</button>
        <h2 className="goal-modal__title">{existing ? "Edit Goal" : "Add Goal"}</h2>

        <label className="goal-modal__label">Subject</label>
        <input
          autoFocus
          className="goal-modal__input"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="e.g. Physics, DSA, Maths..."
        />

        <label className="goal-modal__label">Color</label>
        <div className="goal-modal__colors">
          {GOAL_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              title={c.label}
              className={`goal-modal__color-swatch${color === c.value ? " goal-modal__color-swatch--active" : ""}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        <label className="goal-modal__label">Repeats</label>
        <div className="goal-modal__repeat-row">
          {["once", "daily", "weekly"].map(t => (
            <button
              key={t}
              className={`goal-modal__repeat-btn${repeatType === t ? " goal-modal__repeat-btn--active" : ""}`}
              onClick={() => setRepeatType(t)}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {repeatType === "weekly" && (
          <div className="goal-modal__days-row">
            {WEEK_DAYS.map(d => (
              <button
                key={d}
                className={`goal-modal__day-chip${days.includes(d) ? " goal-modal__day-chip--active" : ""}`}
                onClick={() => toggleDay(d)}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        <label className="goal-modal__label">Target minutes / session</label>
        <input
          type="number"
          min="5"
          step="5"
          className="goal-modal__input"
          value={durationMinutes}
          onChange={e => setDurationMinutes(e.target.value)}
        />

        <div className="goal-modal__actions">
          <button className="goal-modal__save-btn" disabled={!subject.trim()} onClick={handleSave}>
            Save Goal
          </button>
          {existing && (
            <button className="goal-modal__delete-btn" onClick={onDelete}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GoalsManager() {
  const [goals, setGoals]         = useState([]);
  const [modalGoal, setModalGoal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setGoals(loadGoals()); }, []);

  function persist(list) { setGoals(list); saveGoals(list); }

  function handleSave(goal) {
    const exists = goals.some(g => g.id === goal.id);
    const updated = exists ? goals.map(g => g.id === goal.id ? goal : g) : [...goals, goal];
    persist(updated);
    setShowModal(false);
    setModalGoal(null);
  }

  function handleDelete() {
    if (modalGoal) persist(goals.filter(g => g.id !== modalGoal.id));
    setShowModal(false);
    setModalGoal(null);
  }

  return (
    <div className="goals__wrap">
      <div className="goals__header">
        <div>
          <h1 className="goals__title">Goals</h1>
          <p className="goals__subtitle">These show up automatically on your Timetable.</p>
        </div>
        <button className="goals__add-btn" onClick={() => { setModalGoal(null); setShowModal(true); }}>
          + New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="goals__empty">No goals yet — add one and it'll show up on your Timetable.</p>
      ) : (
        <div className="goals__list">
          {goals.map(g => (
            <button key={g.id} className="goals__card" onClick={() => { setModalGoal(g); setShowModal(true); }}>
              <span className="goals__card-dot" style={{ backgroundColor: g.color }} />
              <span className="goals__card-subject">{g.subject}</span>
              <span className="goals__card-meta">
                {g.repeat?.type === "weekly" ? (g.repeat.days || []).join(", ") : g.repeat?.type}
                {" · "}{g.durationMinutes}m
              </span>
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <GoalModal
          existing={modalGoal}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => { setShowModal(false); setModalGoal(null); }}
        />
      )}
    </div>
  );
}