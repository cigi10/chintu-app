"use client";
import "@/styles/stats.css";
import { useState, useEffect } from "react";
import { getStreakInfo, hydrateStreak } from "@/lib/streakLogic";
import { hydrateTracker, getSessionLog } from "@/lib/tracker";
import { hydrateMockScores } from "@/lib/mocktests";
import { getWeekStart, BASKET_DAYS } from "@/lib/breadBasket";
import {
  SubjectPieChart,
  DaySubjectGrid,
  WeeklyTrendLine,
  ConsistencyHeatmap,
  MockScoreTrend,
} from "@/components/StatsCharts";

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TOP_SUBJECTS_FOR_GRID = 5;
const TREND_WEEKS = 8;
const HEATMAP_WEEKS = 10;

function subjectOf(session) {
  return session.subject || "General";
}

// Monday of the week containing `dateStr` (matches lib/breadBasket.js's
// week bucketing so this and the Bread Basket agree on where a week
// starts), as a plain YYYY-MM-DD string.
function weekStartOf(dateStr) {
  return getWeekStart(new Date(dateStr));
}

function formatWeekLabel(weekStartStr) {
  const d = new Date(weekStartStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Stats() {
  const [log, setLog] = useState([]);
  const [mockScores, setMockScores] = useState([]);
  const [streak, setStreak] = useState(0);
  const [view, setView] = useState("week"); // "week" | "month"

  useEffect(() => {
    let cancelled = false;
    hydrateTracker().then(() => { if (!cancelled) setLog(getSessionLog()); });
    hydrateStreak().then(() => { if (!cancelled) setStreak(getStreakInfo().streakCount); });
    hydrateMockScores().then((scores) => { if (!cancelled) setMockScores(scores); });
    return () => { cancelled = true; };
  }, []);

  const days = getLast7Days();

  const minutesByDay = {};
  log.forEach((s) => {
    const mins = Number(s.durationMinutes) || 0;
    minutesByDay[s.date] = (minutesByDay[s.date] || 0) + mins;
  });

  const totalMinutes = log.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
  const totalSessions = log.length;
  const avgSessionMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  const subjectMinutes = {};
  log.forEach((s) => {
    subjectMinutes[subjectOf(s)] = (subjectMinutes[subjectOf(s)] || 0) + (Number(s.durationMinutes) || 0);
  });

  // Best weekday: which day of the week has earned the most study time,
  // across the whole logged history (not just the last 7 days).
  const minutesByWeekday = new Array(7).fill(0); // 0=Sun..6=Sat, matches Date#getDay()
  log.forEach((s) => {
    const dow = new Date(s.date).getDay();
    minutesByWeekday[dow] += Number(s.durationMinutes) || 0;
  });
  const bestWeekdayIndex = minutesByWeekday.some((m) => m > 0)
    ? minutesByWeekday.indexOf(Math.max(...minutesByWeekday))
    : null;
  const bestWeekdayLabel = bestWeekdayIndex != null ? DAY_LABELS[bestWeekdayIndex] : "—";

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

  // ---- Chart data for StatsCharts.jsx ----

  const topSubjects = Object.entries(subjectMinutes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_SUBJECTS_FOR_GRID)
    .map(([subject]) => subject);

  const gridDays = days.map((key) => ({ key, label: DAY_LABELS[new Date(key).getDay()] }));

  function minutesForSubjectOnDay(subject, dateKey) {
    return log
      .filter((s) => subjectOf(s) === subject && s.date === dateKey)
      .reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
  }

  // Weekly trend: total minutes per Monday-start week, over the last
  // TREND_WEEKS weeks (including the current, in-progress one).
  const trendWeeks = (() => {
    const currentWeekStart = getWeekStart();
    const starts = Array.from({ length: TREND_WEEKS }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() - (TREND_WEEKS - 1 - i) * 7);
      return d.toISOString().slice(0, 10);
    });
    const totals = Object.fromEntries(starts.map((s) => [s, 0]));
    log.forEach((s) => {
      const ws = weekStartOf(s.date);
      if (ws in totals) totals[ws] += Number(s.durationMinutes) || 0;
    });
    return starts.map((weekStart) => ({
      label: formatWeekLabel(weekStart),
      mins: totals[weekStart],
    }));
  })();

  // Consistency heatmap: minutes per weekday for each of the last
  // HEATMAP_WEEKS Monday-start weeks.
  const heatmapWeeks = (() => {
    const currentWeekStart = getWeekStart();
    const starts = Array.from({ length: HEATMAP_WEEKS }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() - (HEATMAP_WEEKS - 1 - i) * 7);
      return d.toISOString().slice(0, 10);
    });
    const weeks = Object.fromEntries(
      starts.map((weekStart) => [weekStart, { weekStart, minutesByDay: {} }])
    );
    log.forEach((s) => {
      const ws = weekStartOf(s.date);
      if (!(ws in weeks)) return;
      const dow = BASKET_DAYS[(new Date(s.date).getDay() + 6) % 7];
      weeks[ws].minutesByDay[dow] = (weeks[ws].minutesByDay[dow] || 0) + (Number(s.durationMinutes) || 0);
    });
    return starts.map((weekStart) => weeks[weekStart]);
  })();

  if (totalSessions === 0) {
    return (
      <div className="stats">
        <div className="stats__empty">
          No study sessions logged yet. Start a session to see your stats here.
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
        <div className="stats__summary-card">
          <span className="stats__summary-value">{avgSessionMinutes}m</span>
          <span className="stats__summary-label">Avg. session</span>
        </div>
        <div className="stats__summary-card">
          <span className="stats__summary-value">{bestWeekdayLabel}</span>
          <span className="stats__summary-label">Best weekday</span>
        </div>
      </div>

      <div className="stats__streak-card">
        <span className="stats__streak-number">{streak}</span>
        <div>
          <span className="stats__streak-label">Day streak</span>
          <span className="stats__streak-sub">Keep it going. Study today to extend it.</span>
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
        <h2 className="stats__section-title">Time by subject</h2>
        <SubjectPieChart subjectMinutes={subjectMinutes} />
      </div>

      <div className="stats__section">
        <h2 className="stats__section-title">Subjects by day: last 7 days</h2>
        <DaySubjectGrid subjects={topSubjects} days={gridDays} minutesFor={minutesForSubjectOnDay} />
      </div>

      <div className="stats__section">
        <h2 className="stats__section-title">Weekly trend: last {TREND_WEEKS} weeks</h2>
        <WeeklyTrendLine weeks={trendWeeks} />
      </div>

      <div className="stats__section">
        <h2 className="stats__section-title">Consistency: last {HEATMAP_WEEKS} weeks</h2>
        <ConsistencyHeatmap weeks={heatmapWeeks} />
      </div>

      <div className="stats__section">
        <h2 className="stats__section-title">Mock score trend</h2>
        <MockScoreTrend scores={mockScores} />
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
