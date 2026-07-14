"use client";
import "@/styles/goals.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";
import { loadGoals, saveGoals, GOAL_COLORS, WEEK_DAYS, getGoalsForWeek } from "@/lib/goals";
import { getSubjectColor, setSubjectColor } from "@/lib/subjectColors";

function newId() { return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

// "once" goals aren't a recurring weekly commitment, so they don't count
// toward the "planned per week" stat — only daily/weekly ones do.
function weeklyMinutesFor(goal) {
  if (goal.repeat?.type === "daily") return goal.durationMinutes * 7;
  if (goal.repeat?.type === "weekly") return goal.durationMinutes * (goal.repeat.days?.length || 0);
  return 0;
}

function fmtWeeklyMinutes(mins) {
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? " " + m + "m" : ""}` : `${m}m`;
}

function moodFromGoals(count) {
  if (count === 0) return "waiting";
  if (count >= 4) return "happy";
  return "studying";
}

function GoalForm({ existing, onSave, onDelete, onCancel }) {
  const [subject, setSubject] = useState(existing?.subject || "");
  const [color, setColor]     = useState(existing?.color || GOAL_COLORS[0].value);
  const [repeatType, setRepeatType] = useState(existing?.repeat?.type || "weekly");
  const [days, setDays]       = useState(existing?.repeat?.days || []);
  const [durationMinutes, setDurationMinutes] = useState(existing?.durationMinutes || 30);

  // Same shared color registry the Timetable writes to — if this subject
  // already has a color elsewhere in the app, default to it here too.
  useEffect(() => {
    if (existing) return; // don't override an already-saved goal's chosen color
    const known = getSubjectColor(subject, null);
    if (known) setColor(known);
  }, [subject, existing]);

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
    <div className="goals__form">
      <label className="goals__form-label">Subject</label>
      <input
        autoFocus
        className="goals__form-input"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        placeholder="e.g. Physics, DSA, Maths..."
      />

      <label className="goals__form-label">Color</label>
      <div className="goals__form-colors">
        {GOAL_COLORS.map(c => (
          <button
            key={c.value}
            onClick={() => setColor(c.value)}
            title={c.label}
            className={`goals__form-swatch${color === c.value ? " goals__form-swatch--active" : ""}`}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>

      <label className="goals__form-label">Repeats</label>
      <div className="goals__form-repeat-row">
        {["once", "daily", "weekly"].map(t => (
          <button
            key={t}
            className={`goals__form-repeat-btn${repeatType === t ? " goals__form-repeat-btn--active" : ""}`}
            onClick={() => setRepeatType(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {repeatType === "weekly" && (
        <div className="goals__form-days-row">
          {WEEK_DAYS.map(d => (
            <button
              key={d}
              className={`goals__form-day-chip${days.includes(d) ? " goals__form-day-chip--active" : ""}`}
              onClick={() => toggleDay(d)}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      <label className="goals__form-label">Target minutes / session</label>
      <input
        type="number"
        min="5"
        step="5"
        className="goals__form-input"
        value={durationMinutes}
        onChange={e => setDurationMinutes(e.target.value)}
      />

      <div className="goals__form-actions">
        <button className="goals__form-save-btn" disabled={!subject.trim()} onClick={handleSave}>
          {existing ? "Save changes" : "Add goal"}
        </button>
        {existing && (
          <button className="goals__form-delete-btn" onClick={onDelete}>Delete</button>
        )}
        <button className="goals__form-cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default function GoalsManager() {
  const [goals, setGoals]           = useState([]);
  const [addingNew, setAddingNew]   = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [goalsByDay, setGoalsByDay] = useState({});

  useEffect(() => {
    setGoals(loadGoals());
    setGoalsByDay(getGoalsForWeek());
  }, []);

  function persist(list) {
    setGoals(list);
    saveGoals(list);
    setGoalsByDay(getGoalsForWeek());
  }

  function handleSave(goal) {
    const exists = goals.some(g => g.id === goal.id);
    const updated = exists ? goals.map(g => g.id === goal.id ? goal : g) : [...goals, goal];
    persist(updated);
    setSubjectColor(goal.subject, goal.color);
    setAddingNew(false);
    setEditingId(null);
  }

  function handleDelete(id) {
    persist(goals.filter(g => g.id !== id));
    setEditingId(null);
  }

  const weeklyTotal = goals.reduce((sum, g) => sum + weeklyMinutesFor(g), 0);
  const mood = moodFromGoals(goals.length);
  const hasWeekData = WEEK_DAYS.some(d => (goalsByDay[d] || []).length > 0);

  return (
    <div className="goals__wrap">
      <div className="goals__header">
        <div>
          <h1 className="goals__title">Goals</h1>
          <p className="goals__subtitle">These show up automatically on your Timetable and Tracker.</p>
        </div>
        <button
          className="goals__add-btn"
          onClick={() => { setAddingNew(v => !v); setEditingId(null); }}
        >
          {addingNew ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      <div className="goals__companion-wrap">
        <Companion mood={mood} />
      </div>

      {goals.length > 0 && (
        <div className="goals__stats-row">
          <div className="goals__stat-card">
            <span className="goals__stat-value">{goals.length}</span>
            <span className="goals__stat-label">Active goal{goals.length === 1 ? "" : "s"}</span>
          </div>
          <div className="goals__stat-card">
            <span className="goals__stat-value">{fmtWeeklyMinutes(weeklyTotal)}</span>
            <span className="goals__stat-label">Planned / week</span>
          </div>
        </div>
      )}

      {addingNew && (
        <div className="goals__form-card">
          <p className="goals__form-title">New goal</p>
          <GoalForm onSave={handleSave} onCancel={() => setAddingNew(false)} />
        </div>
      )}

      {goals.length === 0 && !addingNew ? (
        <div className="goals__empty-state">
          <p className="goals__empty">No goals yet: a goal is just a subject you want to hit regularly.</p>
          <p className="goals__empty-hint">
            Try something like "Maths, 30 minutes, every weekday": it'll show up on your Timetable and Tracker automatically.
          </p>
        </div>
      ) : (
        <div className="goals__list">
          {goals.map(g => (
            <div key={g.id} className="goals__item">
              <button
                className="goals__card"
                onClick={() => { setEditingId(editingId === g.id ? null : g.id); setAddingNew(false); }}
              >
                <span className="goals__card-dot" style={{ backgroundColor: g.color }} />
                <span className="goals__card-subject">{g.subject}</span>
                <span className="goals__card-meta">
                  {g.repeat?.type === "weekly" ? ((g.repeat.days || []).join(", ") || "Weekly") : g.repeat?.type}
                  {" · "}{g.durationMinutes}m
                </span>
              </button>
              {editingId === g.id && (
                <div className="goals__form-card goals__form-card--inline">
                  <GoalForm
                    existing={g}
                    onSave={handleSave}
                    onDelete={() => handleDelete(g.id)}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {hasWeekData && (
        <div className="goals__week-glance">
          <p className="goals__week-glance-title">This week at a glance</p>
          <div className="goals__week-glance-grid">
            {WEEK_DAYS.map(day => (
              <div key={day} className="goals__week-glance-day">
                <span className="goals__week-glance-day-label">{day}</span>
                <div className="goals__week-glance-dots">
                  {(goalsByDay[day] || []).length === 0 ? (
                    <span className="goals__week-glance-empty">—</span>
                  ) : (
                    goalsByDay[day].map(g => (
                      <span
                        key={g.id}
                        className="goals__week-glance-dot"
                        style={{ backgroundColor: g.color }}
                        title={`${g.subject} — ${g.durationMinutes}m`}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}