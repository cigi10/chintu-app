"use client";
import "@/styles/mood.css";
import { useState, useEffect } from "react";

const MOOD_KEY = "chintu-mood-log";

const MOODS = [
  { key: "great",   label: "Great",   color: "#7EC8A0" },
  { key: "good",    label: "Good",    color: "#EDE986" },
  { key: "okay",    label: "Okay",    color: "#93ABD9" },
  { key: "tired",   label: "Tired",   color: "#E7BEF8" },
  { key: "stressed",label: "Stressed",color: "#F9C060" },
  { key: "low",     label: "Low",     color: "#9A8C7A" },
];

function todayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function moodInfo(key) {
  return MOODS.find(m => m.key === key) || null;
}

export default function MoodCheckin() {
  const [log, setLog] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const today = todayStr();
  const yesterday = todayStr(-1);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MOOD_KEY) || "[]");
      setLog(saved);
      const todayEntry = saved.find(e => e.date === today);
      if (todayEntry) setTodayMood(todayEntry.mood);
    } catch {}
  }, []);

  function pickMood(moodKey) {
    const filtered = log.filter(e => e.date !== today);
    const updated  = [{ date: today, mood: moodKey }, ...filtered];
    setLog(updated);
    setTodayMood(moodKey);
    try { localStorage.setItem(MOOD_KEY, JSON.stringify(updated)); } catch {}
  }

  const yesterdayEntry = log.find(e => e.date === yesterday);
  const yesterdayMood  = yesterdayEntry ? moodInfo(yesterdayEntry.mood) : null;

  // Streak: consecutive days (including today, if logged) with an entry
  function computeStreak() {
    let streak = 0;
    let cursor = todayMood ? 0 : -1; // start from today if logged, else yesterday
    if (cursor === -1 && !yesterdayEntry) return 0;
    while (true) {
      const dateStr = todayStr(cursor);
      const entry = log.find(e => e.date === dateStr);
      if (!entry) break;
      streak += 1;
      cursor -= 1;
    }
    return streak;
  }
  const streak = computeStreak();

  // Last 14 days including today, oldest first, for the grid
  const days = Array.from({ length: 14 }, (_, i) => todayStr(-(13 - i)));

  return (
    <div className="mood">
      {yesterdayMood ? (
        <div className="mood__yesterday" style={{ "--mood-color": yesterdayMood.color }}>
          <span className="mood__yesterday-label">Yesterday</span>
          <span className="mood__yesterday-value">{yesterdayMood.label}</span>
        </div>
      ) : (
        <div className="mood__yesterday mood__yesterday--empty">
          <span className="mood__yesterday-label">Yesterday</span>
          <span className="mood__yesterday-value">No check-in</span>
        </div>
      )}

      <div className="mood__picker">
        {MOODS.map(m => (
          <button
            key={m.key}
            className={`mood__option${todayMood === m.key ? " mood__option--selected" : ""}`}
            style={{ "--mood-color": m.color }}
            onClick={() => pickMood(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {todayMood && (
        <p className="mood__saved">
          Logged for today.{streak > 1 ? ` ${streak}-day streak 🔥` : ""}
        </p>
      )}

      <div className="mood__history">
        <h2 className="mood__history-title">Last 14 days</h2>
        <div className="mood__history-grid">
          {days.map(date => {
            const entry = log.find(e => e.date === date);
            const m = entry ? moodInfo(entry.mood) : null;
            const isToday = date === today;
            return (
              <div
                key={date}
                className={`mood__history-dot${isToday ? " mood__history-dot--today" : ""}${!m ? " mood__history-dot--empty" : ""}`}
                style={m ? { background: m.color } : undefined}
                title={m ? `${date}: ${m.label}` : `${date}: no entry`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}