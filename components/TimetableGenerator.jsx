"use client";
import "@/styles/tools.css";
import "@/styles/button.css";
import { useState } from "react";
import Button from "@/components/Button";

// Standalone, no-login timetable generator for the public
// /tools/timetable-generator page. lib/timetable.js only stores a
// manually-built grid (components/TimetableGrid.jsx); there is no
// existing rule-based generator to reuse, so this implements a simple
// one: each subject gets a Very Low..Very High priority and its own set
// of free days, and each day's available hours are split proportionally
// to priority weight — among only the subjects actually free that day —
// rather than evenly across every subject on every day. Nothing here
// reads or writes lib/timetable.js or any other storage, cloud or local:
// this tool has no persistence layer at all (by design — see the
// create-an-account nudge below), so there's no schema to migrate for
// the two fields added here; they just live in this component's state
// alongside name/priority.
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MIN_HOURS_PER_DAY = 0.5;
const MAX_HOURS_PER_DAY = 16;

// Same plain, unembellished style as the tracker's status labels
// ("Not started" / "In progress" / "Done") rather than anything fancier.
const PRIORITY_WEIGHTS = { "very-low": 1, low: 2, medium: 3, high: 4, "very-high": 5 };
const PRIORITY_LABELS = { "very-high": "Very High", high: "High", medium: "Medium", low: "Low", "very-low": "Very Low" };
const PRIORITY_ORDER = ["very-high", "high", "medium", "low", "very-low"];

let nextRowId = 0;
function newRow(priority = "medium") {
  nextRowId += 1;
  // Free on every day by default — a fresh row shouldn't silently miss
  // the schedule just because no one's touched its day picker yet.
  return { id: nextRowId, name: "", priority, freeDays: [...DAYS] };
}

function roundToQuarterHour(n) {
  return Math.round(n * 4) / 4;
}

// A subject with no free days marked is treated as free every day rather
// than dropped from the schedule or blocked with a validation error —
// the least annoying reading of "no days selected yet" for a quick,
// no-login planning tool.
function effectiveFreeDays(subject) {
  return subject.freeDays && subject.freeDays.length > 0 ? subject.freeDays : DAYS;
}

// Each subject's daily hours are (its weight / sum of the weights of
// subjects actually free that day) * hoursPerDay — so a subject never
// gets scheduled on a day outside its own free-days set, and whichever
// subjects ARE competing for a given day still split it by priority.
// Rounding each share to the nearest quarter hour can drift the day's
// total off by a few minutes, so that day's highest-weight subject
// absorbs whatever's left, keeping each day's total exactly hoursPerDay.
function buildTimetable(subjects, hoursPerDay) {
  return DAYS.map((day) => {
    const eligible = subjects.filter((s) => effectiveFreeDays(s).includes(day));
    if (eligible.length === 0) return { day, blocks: [] };

    const totalWeight = eligible.reduce((sum, s) => sum + PRIORITY_WEIGHTS[s.priority], 0);
    const hours = eligible.map((s) => roundToQuarterHour((PRIORITY_WEIGHTS[s.priority] / totalWeight) * hoursPerDay));

    const roundedTotal = hours.reduce((a, b) => a + b, 0);
    const drift = roundToQuarterHour(hoursPerDay - roundedTotal);
    if (drift !== 0) {
      const biggestIndex = eligible.reduce(
        (maxI, s, i) => (PRIORITY_WEIGHTS[s.priority] > PRIORITY_WEIGHTS[eligible[maxI].priority] ? i : maxI),
        0
      );
      hours[biggestIndex] = roundToQuarterHour(hours[biggestIndex] + drift);
    }

    return {
      day,
      blocks: eligible.map((s, i) => ({ subject: s.name, priority: s.priority, hours: hours[i] })),
    };
  });
}

function formatHours(h) {
  const wholeHours = Math.floor(h);
  const minutes = Math.round((h - wholeHours) * 60);
  if (wholeHours === 0) return `${minutes}m`;
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00`);
  return Math.round((target - today) / 86400000);
}

// "Physics : Math : Chemistry = 3 : 2 : 1" — each subject's own weight,
// in the order they were entered, so it's clear why the time split out
// the way it did.
function priorityRatioLine(subjects) {
  return `${subjects.map((s) => s.name).join(" : ")} = ${subjects.map((s) => PRIORITY_WEIGHTS[s.priority]).join(" : ")}`;
}

// "Mon, Wed, Fri" for a subject with specific free days, or "Every day"
// once it's been defaulted/left at all seven (see effectiveFreeDays).
function freeDaysLine(subject) {
  const days = effectiveFreeDays(subject);
  return days.length === DAYS.length ? "Every day" : days.join(", ");
}

function timetableToText(timetable, subjects, examDate, daysRemaining) {
  const lines = ["Studyloaf Weekly Timetable"];
  if (examDate && daysRemaining != null) {
    lines.push(
      daysRemaining >= 0
        ? `Exam date: ${examDate} (${daysRemaining} day${daysRemaining === 1 ? "" : "s"} away)`
        : `Exam date: ${examDate} (already passed)`
    );
  }
  lines.push(`Priority ratio: ${priorityRatioLine(subjects)}`);
  subjects.forEach((s) => lines.push(`${s.name}: ${PRIORITY_LABELS[s.priority]} priority, free ${freeDaysLine(s)}`));
  lines.push("");
  timetable.forEach(({ day, blocks }) => {
    lines.push(day);
    if (blocks.length === 0) {
      lines.push("  No subject is free today.");
    } else {
      blocks.forEach((b) => lines.push(`  ${b.subject} (${PRIORITY_LABELS[b.priority]}): ${formatHours(b.hours)}`));
    }
    lines.push("");
  });
  return lines.join("\n");
}

export default function TimetableGenerator() {
  const [subjects, setSubjects] = useState([newRow("high"), newRow("medium"), newRow("low")]);
  const [hoursPerDay, setHoursPerDay] = useState("4");
  const [examDate, setExamDate] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [resultSubjects, setResultSubjects] = useState([]);
  const [resultExamDate, setResultExamDate] = useState("");
  const [copied, setCopied] = useState(false);

  function updateSubjectName(id, name) {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }

  function updateSubjectPriority(id, priority) {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, priority } : s)));
  }

  function toggleSubjectDay(id, day) {
    setSubjects((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      const has = s.freeDays.includes(day);
      return { ...s, freeDays: has ? s.freeDays.filter((d) => d !== day) : [...s.freeDays, day] };
    }));
  }

  function addSubjectRow() {
    setSubjects((prev) => [...prev, newRow()]);
  }

  function removeSubjectRow(id) {
    setSubjects((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  }

  function handleGenerate(e) {
    e.preventDefault();
    const named = subjects.map((s) => ({ ...s, name: s.name.trim() })).filter((s) => s.name);
    if (named.length === 0) return;

    const hours = Math.max(MIN_HOURS_PER_DAY, Math.min(MAX_HOURS_PER_DAY, parseFloat(hoursPerDay) || 0));
    setTimetable(buildTimetable(named, hours));
    setResultSubjects(named);
    setResultExamDate(examDate);
    setCopied(false);
  }

  const daysRemaining = daysUntil(resultExamDate);
  const text = timetable ? timetableToText(timetable, resultSubjects, resultExamDate, daysRemaining) : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function handleDownload() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studyloaf-timetable.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="tool-panel">
      <form onSubmit={handleGenerate} className="tool-form">
        <div className="tool-label">
          Subjects, priority, and free days
          <p className="tool-priority-legend">
            {PRIORITY_ORDER.map((p) => PRIORITY_LABELS[p]).join(" : ")} = {PRIORITY_ORDER.map((p) => PRIORITY_WEIGHTS[p]).join(" : ")}.
            {" "}Higher priority gets a proportionally bigger share of each day it's free.
          </p>

          <div className="tool-subject-rows">
            {subjects.map((s) => (
              <div key={s.id} className="tool-subject-row-group">
                <div className="tool-subject-row">
                  <input
                    className="tool-input tool-subject-name-input"
                    value={s.name}
                    onChange={(e) => updateSubjectName(s.id, e.target.value)}
                    placeholder="Subject (e.g. Physics)"
                  />
                  <select
                    className="tool-input tool-priority-select"
                    value={s.priority}
                    onChange={(e) => updateSubjectPriority(s.id, e.target.value)}
                    aria-label={`Priority for ${s.name || "this subject"}`}
                  >
                    {PRIORITY_ORDER.map((p) => (
                      <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="tool-remove-btn"
                    onClick={() => removeSubjectRow(s.id)}
                    disabled={subjects.length === 1}
                    aria-label={`Remove ${s.name || "subject"}`}
                  >
                    ×
                  </button>
                </div>

                <div className="tool-day-picker" role="group" aria-label={`Free days for ${s.name || "this subject"}`}>
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`tool-day-chip${s.freeDays.includes(day) ? " tool-day-chip--active" : ""}`}
                      onClick={() => toggleSubjectDay(s.id, day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {s.freeDays.length === 0 && (
                  <p className="tool-day-hint">No days picked yet, so this one's scheduled every day for now.</p>
                )}
              </div>
            ))}
          </div>

          <button type="button" className="tool-add-btn" onClick={addSubjectRow}>
            + Add subject
          </button>
        </div>

        <label className="tool-label">
          Hours available per day
          <input
            className="tool-input"
            type="number"
            min={MIN_HOURS_PER_DAY}
            max={MAX_HOURS_PER_DAY}
            step="0.5"
            value={hoursPerDay}
            onChange={e => setHoursPerDay(e.target.value)}
          />
        </label>

        <label className="tool-label">
          Exam date (optional)
          <input
            className="tool-input"
            type="date"
            value={examDate}
            onChange={e => setExamDate(e.target.value)}
          />
        </label>

        <Button type="submit">Generate timetable</Button>
      </form>

      {timetable && (
        <div className="tool-result">
          {resultExamDate && daysRemaining != null && (
            <p className="tool-result-meta">
              {daysRemaining >= 0
                ? `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} until your exam.`
                : "That exam date has already passed."}
            </p>
          )}

          <p className="tool-ratio-line">Priority ratio: {priorityRatioLine(resultSubjects)}</p>

          <ul className="tool-subject-summary">
            {resultSubjects.map((s) => (
              <li key={s.id}>
                <span className={`tool-priority-tag tool-priority-tag--${s.priority}`}>{PRIORITY_LABELS[s.priority]}</span>
                {" "}{s.name} · free {freeDaysLine(s)}
              </li>
            ))}
          </ul>

          <div className="tool-grid">
            {timetable.map(({ day, blocks }) => (
              <div key={day} className="tool-day-card">
                <h3 className="tool-day-title">{day}</h3>
                {blocks.length === 0 ? (
                  <p className="tool-day-empty">No subject is free today.</p>
                ) : (
                  <ul className="tool-day-list">
                    {blocks.map((b, i) => (
                      <li key={i}>
                        <span className={`tool-priority-tag tool-priority-tag--${b.priority}`}>{PRIORITY_LABELS[b.priority]}</span>
                        {" "}{b.subject}: {formatHours(b.hours)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="tool-actions">
            <Button onClick={handleCopy} variant="soft" size="sm">
              {copied ? "Copied." : "Copy as text"}
            </Button>
            <Button onClick={handleDownload} variant="secondary" size="sm">
              Download .txt
            </Button>
          </div>

          <p className="tool-cta">
            Want this saved and synced across your devices?{" "}
            <a href="/login">Create a free Studyloaf account.</a>
          </p>
        </div>
      )}
    </div>
  );
}
