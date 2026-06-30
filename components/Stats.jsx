"use client";
import "@/styles/stats.css";
import { useState, useEffect } from "react";

const LOG_KEY   = "chintu-session-log";
const STREAK_KEY = "chintu-streak";

function loadLog() { try { return JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch { return []; } }

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

export default function Stats() {
  const [log, setLog]       = useState([]);
  const [view, setView]     = useState("week");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setLog(loadLog());
    try { setStreak(parseInt(localStorage.getItem(STREAK_KEY) || "0", 10)); } catch {}
  }, []);

  const days = getLast7Days();

  const minutesByDay = {};
  log.forEach(s => {
    if (!minutesByDay[s.date]) minutesByDay[s.date] = 0;
    minutesByDay[s.date] += s.durationMinutes || 0;
  });

  const maxMinutes = Math.max(...days.map(d => minutesByDay[d] || 0), 1);

  const totalMinutes = log.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalSessions = log.length;

  const subjectMinutes = {};
  log.forEach(s => {
    const subj = s.subject || "General";
    if (!subjectMinutes[subj]) subjectMinutes[subj] = 0;
    subjectMinutes[subj] += s.durationMinutes || 0;
  });

  return (
    <div className="stats">
      <div className="stats__summary-row">
        <div className="stats__card">
          <div className="stats__card-value">{Math.round(totalMinutes / 60)}h</div>
          <div className="stats__card-label">Total hours</div>
        </div>
        <div className="stats__card">
          <div className="stats__card-value">{totalSessions}</div>
          <div className="stats__card-label">Sessions</div>
        </div>
        <div className="stats__card">
          <div className="stats__card-value">{streak}</div>
          <div className="stats__card-label">Day streak</div>
        </div>
      </div>

      <h2 className="stats__section-title">Study time — last 7 days</h2>
      <div className="stats__bar-chart">
        {days.map(day => {
          const mins = minutesByDay[day] || 0;
          const h = (mins / 60).toFixed(1);
          const heightPct = (mins / maxMinutes) * 100;
          return (
            <div key={day} className="stats__bar-col">
              <div className="stats__bar-value">{mins > 0 ? `${h}h` : ""}</div>
              <div className="stats__bar" style={{ height: `${Math.max(heightPct, 2)}%` }} />
              <div className="stats__bar-label">{day.slice(5)}</div>
            </div>
          );
        })}
      </div>

      {Object.keys(subjectMinutes).length > 0 && (
        <>
          <h2 className="stats__section-title">By subject</h2>
          <div className="stats__subject-list">
            {Object.entries(subjectMinutes).sort((a, b) => b[1] - a[1]).map(([subj, mins]) => (
              <div key={subj} className="stats__subject-row">
                <span className="stats__subject-name">{subj}</span>
                <div className="stats__subject-bar-bg">
                  <div className="stats__subject-bar-fill" style={{ width: `${(mins / totalMinutes) * 100}%` }} />
                </div>
                <span className="stats__subject-mins">{Math.round(mins / 60)}h {mins % 60}m</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}