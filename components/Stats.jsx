"use client";
import "@/styles/stats.css";
import { useState, useEffect } from "react";

const LOG_KEY = "chintu-session-log";
const STREAK_KEY = "chintu-streak";

function loadLog() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch {
    return [];
  }
}

function loadStreak() {
  const raw = localStorage.getItem(STREAK_KEY);
  if (raw == null) return 0;
  // Handles both a plain number string ("5") and a JSON-stringified
  // value ('"5"' or '5') so parseInt never chokes on a stray quote.
  let n;
  try {
    const parsed = JSON.parse(raw);
    n = typeof parsed === "number" ? parsed : parseInt(String(parsed), 10);
  } catch {
    n = parseInt(raw, 10);
  }
  return Number.isFinite(n) ? n : 0;
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Stats() {
  const [log, setLog] = useState([]);
  const [streak, setStreak] = useState(0);
  const [view, setView] = useState("week"); // "week" | "month"

  useEffect(() => {
    setLog(loadLog());
    setStreak(loadStreak());
  }, []);

  const days = getLast7Days();

  const minutesByDay = {};
  log.forEach((s) => {
    const mins = Number(s.durationMinutes) || 0;
    minutesByDay[s.date] = (minutesByDay[s.date] || 0) + mins;
  });

  const maxMinutes = Math.max(...days.map((d) => minutesByDay[d] || 0), 1);

  const totalMinutes = log.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
  const totalSessions = log.length;

  const subjectMinutes = {};
  log.forEach((s) => {
    const subj = s.subject || "General";
    subjectMinutes[subj] = (subjectMinutes[subj] || 0) + (Number(s.durationMinutes) || 0);
  });

  // Monthly view: bucket the log into ISO weeks over the last ~5 weeks
  const weeklyBuckets = (() => {
    const buckets = Array.from({ length: 5 }, (_, i) => ({ label: `W-${4 - i}`, mins: 0 }));
    const now = new Date();
    log.forEach((s) => {
      const d = new Date(s.date);
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      const weekIndex = 4 - Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex < 5) {
        buckets[weekIndex].mins += Number(s.durationMinutes) || 0;
      }
    });
    return buckets;
  })();

  const chartData =
    view === "week"
      ? days.map((day, i) => ({
          key: day,
          label: DAY_LABELS[new Date(day).getDay()],
          mins: minutesByDay[day] || 0,
          isToday: i === days.length - 1,
        }))
      : weeklyBuckets.map((b, i) => ({
          key: b.label,
          label: b.label,
          mins: b.mins,
          isToday: i === weeklyBuckets.length - 1,
        }));

  const chartMax = Math.max(...chartData.map((c) => c.mins), 1);

  const recentSessions = [...log]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8);

  if (totalSessions === 0) {
    return (
      <div className="stats">
        <div className="stats__empty">
          No study sessions logged yet — start a session to see your stats here.
        </div>
      </div>
    );
  }

  return (
    <div className="stats">
      <div className="stats__view-toggle">
        <button
          className={`stats__view-btn ${view === "week" ? "stats__view-btn--active" : ""}`}
          onClick={() => setView("week")}
        >
          Weekly
        </button>
        <button
          className={`stats__view-btn ${view === "month" ? "stats__view-btn--active" : ""}`}
          onClick={() => setView("month")}
        >
          Monthly
        </button>
      </div>

      <div className="stats__summary-row">
        <div className="stats__summary-card">
          <span className="stats__summary-value">{Math.round(totalMinutes / 60)}h</span>
          <span className="stats__summary-label">Total hours</span>
        </div>
        <div className="stats__summary-card">
          <span className="stats__summary-value">{totalSessions}</span>
          <span className="stats__summary-label">Sessions</span>
        </div>
        <div className="stats__summary-card">
          <span className="stats__summary-value">{streak}</span>
          <span className="stats__summary-label">Day streak</span>
        </div>
      </div>

      <div className="stats__streak-card">
        <span className="stats__streak-number">{streak}</span>
        <div>
          <span className="stats__streak-label">Day streak</span>
          <span className="stats__streak-sub">Keep it going — study today to extend it.</span>
        </div>
      </div>

      <div className="stats__section">
        <h2 className="stats__section-title">
          Study time: {view === "week" ? "last 7 days" : "last 5 weeks"}
        </h2>
        <div className="stats__bar-chart">
          {chartData.map((c) => {
            const heightPct = (c.mins / chartMax) * 100;
            const hrs = (c.mins / 60).toFixed(1);
            return (
              <div key={c.key} className="stats__bar-col" title={c.mins > 0 ? `${hrs}h` : "No study time"}>
                <div
                  className={`stats__bar ${c.isToday ? "stats__bar--today" : "stats__bar--past"}`}
                  style={{ height: `${Math.max(heightPct, 2)}%` }}
                />
                <span className="stats__bar-label">{c.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {Object.keys(subjectMinutes).length > 0 && (
        <div className="stats__section">
          <h2 className="stats__section-title">By subject</h2>
          <div className="stats__subject-list">
            {Object.entries(subjectMinutes)
              .sort((a, b) => b[1] - a[1])
              .map(([subj, mins]) => (
                <div key={subj} className="stats__subject-row">
                  <span className="stats__subject-name">{subj}</span>
                  <div className="stats__subject-bar-bg">
                    <div
                      className="stats__subject-bar-fill"
                      style={{ width: `${totalMinutes > 0 ? (mins / totalMinutes) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="stats__subject-hrs">
                    {Math.floor(mins / 60)}h {mins % 60}m
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="stats__section">
        <h2 className="stats__section-title">Mock score trend</h2>
        <div className="stats__mock-trend">
          <div className="stats__mock-empty">No mock scores logged yet.</div>
        </div>
      </div>

      <div className="stats__section">
        <h2 className="stats__section-title">Recent sessions</h2>
        <div className="stats__log-list">
          {recentSessions.map((s, i) => (
            <div key={i} className="stats__log-row">
              <span className="stats__log-subject">{s.subject || "General"}</span>
              <span className="stats__log-meta">
                {s.date} · {Math.floor((s.durationMinutes || 0) / 60)}h {(s.durationMinutes || 0) % 60}m
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}