"use client";
import "@/styles/tools.css";
import "@/styles/button.css";
import { useState } from "react";
import Button from "@/components/Button";

// Standalone, no-login timetable generator for the public
// /tools/timetable-generator page. lib/timetable.js only stores a
// manually-built grid (components/TimetableGrid.jsx); there is no
// existing rule-based generator to reuse, so this implements a simple
// one: split each day's available hours evenly across the given
// subjects. Nothing here reads or writes lib/timetable.js or any other
// storage, cloud or local.
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MIN_HOURS_PER_DAY = 0.5;
const MAX_HOURS_PER_DAY = 16;

function roundToQuarterHour(n) {
  return Math.round(n * 4) / 4;
}

function buildTimetable(subjects, hoursPerDay) {
  const perSubject = roundToQuarterHour(hoursPerDay / subjects.length);
  // Rounding to the nearest quarter hour can drift the day's total off by
  // a few minutes, so the last subject absorbs whatever is left, keeping
  // each day's total exactly equal to hoursPerDay.
  const baseTotal = perSubject * (subjects.length - 1);
  const lastHours = roundToQuarterHour(hoursPerDay - baseTotal);

  return DAYS.map(day => ({
    day,
    blocks: subjects.map((subject, i) => ({
      subject,
      hours: i === subjects.length - 1 ? lastHours : perSubject,
    })),
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
  const lines = ["Studyloaf Weekly Timetable"];
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
    blocks.forEach(b => lines.push(`  ${b.subject}: ${formatHours(b.hours)}`));
    lines.push("");
  });
  return lines.join("\n");
}

export default function TimetableGenerator() {
  const [subjectsInput, setSubjectsInput] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("4");
  const [examDate, setExamDate] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [resultExamDate, setResultExamDate] = useState("");
  const [copied, setCopied] = useState(false);

  function handleGenerate(e) {
    e.preventDefault();
    const subjects = [...new Set(
      subjectsInput.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
    )];
    if (subjects.length === 0) return;

    const hours = Math.max(MIN_HOURS_PER_DAY, Math.min(MAX_HOURS_PER_DAY, parseFloat(hoursPerDay) || 0));
    setTimetable(buildTimetable(subjects, hours));
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
        <label className="tool-label">
          Subjects (comma or new line separated)
          <textarea
            className="tool-textarea"
            value={subjectsInput}
            onChange={e => setSubjectsInput(e.target.value)}
            placeholder={"Physics\nChemistry\nMaths"}
            rows={4}
          />
        </label>

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
                    <li key={i}>{b.subject}: {formatHours(b.hours)}</li>
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
