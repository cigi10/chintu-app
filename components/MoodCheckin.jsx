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

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function MoodCheckin() {
  const [log, setLog]       = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const today = todayStr();

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

  const past = log.filter(e => e.date !== today).slice(0, 14);

  return (
    <div className="mood">
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

      {todayMood && <p className="mood__saved">Logged for today.</p>}

      {past.length > 0 && (
        <div className="mood__history">
          <h2 className="mood__history-title">Last 14 days</h2>
          <div className="mood__history-grid">
            {past.map(e => {
              const m = MOODS.find(m => m.key === e.mood);
              return (
                <div key={e.date} className="mood__history-dot" style={{ background: m?.color || "#ccc" }} title={`${e.date}: ${m?.label}`} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}