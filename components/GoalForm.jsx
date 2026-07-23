"use client";
import { useState, useEffect } from "react";
import { GOAL_COLORS, WEEK_DAYS } from "@/lib/goals";
import { getSubjectColor } from "@/lib/subjectColors";
import { newGoalId } from "@/lib/goalHelpers";

export default function GoalForm({ existing, onSave, onDelete, onCancel }) {
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
      id: existing?.id || newGoalId(),
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