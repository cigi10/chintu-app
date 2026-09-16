"use client";
import "@/styles/tools.css";
import "@/styles/button.css";
import { useState, useRef } from "react";
import Button from "@/components/Button";

// Standalone, no-login timetable generator for the public
// /tools/timetable-generator page. lib/timetable.js only stores a
// manually-built grid (components/TimetableGrid.jsx); there is no
// existing rule-based generator to reuse, so this implements a simple
// one: each subject's daily time is proportional to its priority weight
// out of the total. Nothing here reads or writes lib/timetable.js or any
// other storage, cloud or local.
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MIN_HOURS_PER_DAY = 0.5;
const MAX_HOURS_PER_DAY = 16;

const PRIORITY_WEIGHTS = { low: 1, medium: 2, high: 3 };
const PRIORITY_LABELS = { low: "Low", medium: "Medium", high: "High" };
const PRIORITY_ORDER = ["high", "medium", "low"];

function roundToQuarterHour(n) {
  return Math.round(n * 4) / 4;
}

function buildTimetable(subjects, hoursPerDay) {
  const totalWeight = subjects.reduce((sum, s) => sum + PRIORITY_WEIGHTS[s.priority], 0);
  const rounded = subjects.map(s => roundToQuarterHour((PRIORITY_WEIGHTS[s.priority] / totalWeight) * hoursPerDay));
  // Rounding to the nearest quarter hour can drift the day's total off by
  // a few minutes, so the last subject absorbs whatever is left, keeping
  // each day's total exactly equal to hoursPerDay.
  const baseTotal = rounded.slice(0, -1).reduce((a, b) => a + b, 0);
  const lastHours = roundToQuarterHour(hoursPerDay - baseTotal);
  const hoursList = [...rounded.slice(0, -1), lastHours];

  return DAYS.map(day => ({
    day,
    blocks: subjects.map((s, i) => ({ subject: s.name, priority: s.priority, hours: hoursList[i] })),
  }));
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

function timetableToText(timetable, examDate, daysRemaining) {
  const lines = ["Studyloaf Weekly Timetable", "Priority weights: High : Medium : Low = 3 : 2 : 1"];
  if (examDate && daysRemaining != null) {
    lines.push(
      daysRemaining >= 0
        ? `Exam date: ${examDate} (${daysRemaining} day${daysRemaining === 1 ? "" : "s"} away)`
        : `Exam date: ${examDate} (already passed)`
    );
  }
  lines.push("");
  timetable.forEach(({ day, blocks }) => {
    lines.push(day);
    blocks.forEach(b => lines.push(`  ${b.subject} (${PRIORITY_LABELS[b.priority]}): ${formatHours(b.hours)}`));
    lines.push("");
  });
  return lines.join("\n");
}

function makeEmptySubject(id) {
  return { id, name: "", priority: "medium" };
}

export default function TimetableGenerator() {
  const nextId = useRef(3);
  const [subjects, setSubjects] = useState([
    makeEmptySubject(0), makeEmptySubject(1), makeEmptySubject(2),
  ]);
  const [hoursPerDay, setHoursPerDay] = useState("4");
  const [examDate, setExamDate] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [resultExamDate, setResultExamDate] = useState("");
  const [copied, setCopied] = useState(false);

  function updateSubject(id, field, value) {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function addSubject() {
    setSubjects(prev => [...prev, makeEmptySubject(nextId.current++)]);
  }

  function removeSubject(id) {
    setSubjects(prev => (prev.length > 1 ? prev.filter(s => s.id !== id) : prev));
  }

  function handleGenerate(e) {
    e.preventDefault();
    const seen = new Set();
    const cleaned = [];
    for (const s of subjects) {
      const name = s.name.trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      cleaned.push({ name, priority: s.priority });
    }
    if (cleaned.length === 0) return;

    const hours = Math.max(MIN_HOURS_PER_DAY, Math.min(MAX_HOURS_PER_DAY, parseFloat(hoursPerDay) || 0));
    setTimetable(buildTimetable(cleaned, hours));
    setResultExamDate(examDate);
    setCopied(false);
  }

  const daysRemaining = daysUntil(resultExamDate);
  const text = timetable ? timetableToText(timetable, resultExamDate, daysRemaining) : "";

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
          Subjects and priority
          <div className="tool-subject-rows">
            {subjects.map(s => (
              <div key={s.id} className="tool-subject-row">
                <input
                  className="tool-input tool-subject-name"
                  value={s.name}
                  onChange={e => updateSubject(s.id, "name", e.target.value)}
                  placeholder="Subject name"
                />
                <select
                  className="tool-input tool-subject-priority"
                  value={s.priority}
                  onChange={e => updateSubject(s.id, "priority", e.target.value)}
                >
                  {PRIORITY_ORDER.map(p => (
                    <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="tool-subject-remove"
                  onClick={() => removeSubject(s.id)}
                  disabled={subjects.length <= 1}
                  aria-label="Remove subject"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="tool-add-subject-btn" onClick={addSubject}>
            + Add subject
          </button>
          <p className="tool-hint">Priority weights: High : Medium : Low = 3 : 2 : 1</p>
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

          <div className="tool-grid">
            {timetable.map(({ day, blocks }) => (
              <div key={day} className="tool-day-card">
                <h3 className="tool-day-title">{day}</h3>
                <ul className="tool-day-list">
                  {blocks.map((b, i) => (
                    <li key={i}>{b.subject} ({PRIORITY_LABELS[b.priority]}): {formatHours(b.hours)}</li>
                  ))}
                </ul>
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
