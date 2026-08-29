"use client";
import "@/styles/mocktests.css";
import { useState, useEffect } from "react";
import { hydrateMockScores, saveMockScores } from "@/lib/mocktests";

const SUBJECTS = ["Physics", "Chemistry", "Maths", "Biology", "Reading & Writing", "Verbal", "Quant", "DSA", "Other"];

export default function MockTests() {
  const [scores, setScores]   = useState([]);
  const [subject, setSubject] = useState("Physics");
  const [score, setScore]     = useState("");
  const [scoreType, setScoreType] = useState("raw");
  const [date, setDate]       = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes]     = useState("");

  useEffect(() => { hydrateMockScores().then(setScores); }, []);

  function addEntry() {
    if (!score.trim()) return;
    const entry = { id: Date.now(), subject, score: parseFloat(score), scoreType, date, notes: notes.trim() };
    const updated = [entry, ...scores];
    setScores(updated);
    saveMockScores(updated);
    setScore(""); setNotes("");
  }

  function removeEntry(id) {
    const updated = scores.filter(s => s.id !== id);
    setScores(updated);
    saveMockScores(updated);
  }

  // Group by subject for charts
  const bySubject = {};
  scores.forEach(s => {
    if (!bySubject[s.subject]) bySubject[s.subject] = [];
    bySubject[s.subject].push(s);
  });

  return (
    <div className="mocktests">
      <div className="mocktests__form">
        <h2 className="mocktests__form-title">Log a score</h2>
        <div className="mocktests__form-row">
          <select className="mocktests__select" value={subject} onChange={e => setSubject(e.target.value)}>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <input className="mocktests__input" type="number" placeholder="Score" value={score} onChange={e => setScore(e.target.value)} />
          <select className="mocktests__select" value={scoreType} onChange={e => setScoreType(e.target.value)}>
            <option value="raw">Raw</option>
            <option value="percentile">Percentile</option>
          </select>
        </div>
        <div className="mocktests__form-row">
          <input className="mocktests__input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input className="mocktests__input mocktests__input--notes" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <button className="mocktests__add-btn" onClick={addEntry}>Log score</button>
      </div>

      {Object.entries(bySubject).map(([subj, entries]) => {
        const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
        const max = Math.max(...sorted.map(e => e.score), 1);
        return (
          <div key={subj} className="mocktests__subject-block">
            <h3 className="mocktests__subject-title">{subj}</h3>
            <div className="mocktests__chart">
              {sorted.map((e) => (
                <div key={e.id} className="mocktests__bar-col">
                  <div className="mocktests__bar-value">{e.score}</div>
                  <div className="mocktests__bar" style={{ height: `${(e.score / max) * 100}px` }} />
                  <div className="mocktests__bar-date">{e.date.slice(5)}</div>
                </div>
              ))}
            </div>
            <div className="mocktests__entry-list">
              {entries.map(e => (
                <div key={e.id} className="mocktests__entry-row">
                  <span>{e.date}</span>
                  <span>{e.score} {e.scoreType === "percentile" ? "%" : "pts"}</span>
                  {e.notes && <span className="mocktests__entry-notes">{e.notes}</span>}
                  <button className="mocktests__remove-btn" onClick={() => removeEntry(e.id)} aria-label="Delete entry">×</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {scores.length === 0 && (
        <p className="mocktests__empty">No scores logged yet. Add your first mock test result above.</p>
      )}
    </div>
  );
}