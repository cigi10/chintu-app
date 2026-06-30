"use client";
import "@/styles/digest.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";

const LOG_KEY    = "chintu-session-log";
const MOCK_KEY   = "chintu-mock-scores";
const STREAK_KEY = "chintu-streak";
const NAME_KEY   = "chintu-companion-name";

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
}

export default function WeeklyDigest() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const name    = localStorage.getItem(NAME_KEY) || "Chintu";
    const log     = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    const mocks   = JSON.parse(localStorage.getItem(MOCK_KEY) || "[]");
    const streak  = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
    const week    = getLast7Days();

    const weekLog = log.filter(s => week.includes(s.date));
    const totalMins = weekLog.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const subjects = [...new Set(weekLog.map(s => s.subject).filter(Boolean))];
    const weekMocks = mocks.filter(m => week.includes(m.date));
    const studyDays = [...new Set(weekLog.map(s => s.date))].length;

    setData({ name, totalMins, subjects, streak, weekMocks: weekMocks.length, studyDays });
  }, []);

  if (!data) return null;

  const hours = Math.floor(data.totalMins / 60);
  const mins  = data.totalMins % 60;

  return (
    <div className="digest">
      <Companion mood="proud" />
      <h1 className="digest__title">This week with {data.name}</h1>
      <div className="digest__stats">
        <div className="digest__stat">
          <div className="digest__stat-value">{hours}h {mins}m</div>
          <div className="digest__stat-label">studied</div>
        </div>
        <div className="digest__stat">
          <div className="digest__stat-value">{data.studyDays}</div>
          <div className="digest__stat-label">days active</div>
        </div>
        <div className="digest__stat">
          <div className="digest__stat-value">{data.subjects.length}</div>
          <div className="digest__stat-label">subjects</div>
        </div>
        <div className="digest__stat">
          <div className="digest__stat-value">{data.streak}</div>
          <div className="digest__stat-label">day streak</div>
        </div>
        {data.weekMocks > 0 && (
          <div className="digest__stat">
            <div className="digest__stat-value">{data.weekMocks}</div>
            <div className="digest__stat-label">mock tests</div>
          </div>
        )}
      </div>
      {data.subjects.length > 0 && (
        <p className="digest__subjects">Subjects: {data.subjects.join(", ")}</p>
      )}
    </div>
  );
}