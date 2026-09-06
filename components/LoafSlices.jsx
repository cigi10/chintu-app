"use client";
import "@/styles/loaf-slices.css";
import { useState, useEffect } from "react";
import {
  hydrateLoafSlices,
  getCurrentWeekSlices,
  getLoafHistory,
  getWeekStart,
  LOAF_DAYS,
} from "@/lib/loafSlices";

const DAY_INITIAL = { Mon: "M", Tue: "T", Wed: "W", Thu: "T", Fri: "F", Sat: "S", Sun: "S" };

function formatWeekRange(weekStart) {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const startLabel = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString(undefined, {
    month: start.getMonth() === end.getMonth() ? undefined : "short",
    day: "numeric",
  });
  return `${startLabel}–${endLabel}`;
}

function bakedCount(days) {
  return LOAF_DAYS.filter(day => days[day]).length;
}

function Loaf({ days, size = "regular" }) {
  return (
    <div className={`loaf-slices__loaf loaf-slices__loaf--${size}`}>
      {LOAF_DAYS.map(day => (
        <div
          key={day}
          className={`loaf-slices__slice${days[day] ? " loaf-slices__slice--baked" : ""}`}
          title={`${day}${days[day] ? " — baked" : ""}`}
        >
          {size === "regular" && <span className="loaf-slices__slice-label">{DAY_INITIAL[day]}</span>}
          {days[day] && <span className="loaf-slices__slice-icon">🍞</span>}
        </div>
      ))}
    </div>
  );
}

export default function LoafSlices() {
  const [currentWeek, setCurrentWeek] = useState({ weekStart: getWeekStart(), days: {} });
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    hydrateLoafSlices().then(() => {
      setCurrentWeek(getCurrentWeekSlices());
      setHistory(getLoafHistory());
      setLoaded(true);
    });
  }, []);

  const baked = bakedCount(currentWeek.days || {});

  return (
    <div className="dashboard__section">
      <h2 className="dashboard__section-heading">
        Loaf Slices
        <span className="dashboard__goal-progress-pill">{baked}/7 baked this week</span>
      </h2>
      <p className="loaf-slices__subtitle">
        Finish a focus session to bake today&apos;s slice. Missed days just stay unbaked — no streak to lose.
      </p>

      <Loaf days={{ ...currentWeek.days }} />

      {loaded && history.length > 0 && (
        <div className="loaf-slices__shelf-wrap">
          <p className="loaf-slices__shelf-label">Bakery shelf</p>
          <div className="loaf-slices__shelf">
            {history.map(week => (
              <div key={week.weekStart} className="loaf-slices__shelf-item">
                <Loaf days={week.days} size="mini" />
                <span className="loaf-slices__shelf-range">{formatWeekRange(week.weekStart)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
