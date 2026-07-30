"use client";
import "@/styles/digest.css";
import { useState, useEffect } from "react";
import { localDateStr as todayStr } from "@/lib/date";
import { getGoalsForDate, getDoneMap, hydrateGoals } from "@/lib/goals";
import { hydrateTracker, getSessionLog } from "@/lib/tracker";
import { hydrateMoodLog, getLocalMoodLog } from "@/lib/mood";
import { hydrateRevisionSchedule, getLocalRevisionSchedule } from "@/lib/revisions";
import { hydrateDdays, getLocalDdays } from "@/lib/ddays";

const MOODS = [
  { key: "great",    label: "Great",    color: "#7EC8A0" },
  { key: "good",     label: "Good",     color: "#EDE986" },
  { key: "okay",     label: "Okay",     color: "#93ABD9" },
  { key: "tired",    label: "Tired",    color: "#E7BEF8" },
  { key: "stressed", label: "Stressed", color: "#F9C060" },
  { key: "low",      label: "Low",      color: "#9A8C7A" },
];

function daysAgo(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}

function buildDigest() {
  const log = getSessionLog();
  const moodLog = getLocalMoodLog();
  const revisions = getLocalRevisionSchedule();
  const ddays = getLocalDdays();

  const minutesByDate = {};
  log.forEach(s => {
    if (!s.date) return;
    minutesByDate[s.date] = (minutesByDate[s.date] || 0) + (s.durationMinutes || 0);
  });

  // This week: today back 6 days. Last week: the 7 days before that.
  const thisWeekDates = [];
  for (let i = 6; i >= 0; i--) thisWeekDates.push(daysAgo(i));
  const lastWeekDates = [];
  for (let i = 13; i >= 7; i--) lastWeekDates.push(daysAgo(i));

  const days = thisWeekDates.map(d => {
    const ds = todayStr(d);
    return { date: ds, label: d.toLocaleDateString(undefined, { weekday: "short" }), minutes: minutesByDate[ds] || 0 };
  });
  const totalThisWeek = days.reduce((s, d) => s + d.minutes, 0);
  const totalLastWeek = lastWeekDates.reduce((s, d) => s + (minutesByDate[todayStr(d)] || 0), 0);
  const change = totalLastWeek > 0
    ? Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100)
    : (totalThisWeek > 0 ? 100 : 0);
  const maxMinutes = Math.max(1, ...days.map(d => d.minutes));

  // Top subjects this week
  const thisWeekDateSet = new Set(days.map(d => d.date));
  const bySubject = {};
  log.filter(s => thisWeekDateSet.has(s.date) && s.subject).forEach(s => {
    bySubject[s.subject] = (bySubject[s.subject] || 0) + (s.durationMinutes || 0);
  });
  const topSubjects = Object.entries(bySubject).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topSubjectsMax = Math.max(1, ...topSubjects.map(([, m]) => m));

  // Streak: walk back from today; an empty "today" doesn't break it (day isn't over yet)
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!(minutesByDate[todayStr(cursor)] > 0)) cursor.setDate(cursor.getDate() - 1);
  while (minutesByDate[todayStr(cursor)] > 0) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Goal consistency across this week
  let goalsTotal = 0, goalsDone = 0;
  let bestDay = null, bestDayDone = 0;
  days.forEach(d => {
    const goalsForDay = getGoalsForDate(new Date(d.date));
    const doneMap = getDoneMap(d.date);
    const doneCount = goalsForDay.filter(g => doneMap[g.id]).length;
    goalsTotal += goalsForDay.length;
    goalsDone += doneCount;
    if (goalsForDay.length > 0 && doneCount > bestDayDone) {
      bestDayDone = doneCount;
      bestDay = d.label;
    }
  });

  // Mood check-ins this week
  const moodThisWeek = moodLog.filter(e => thisWeekDateSet.has(e.date));
  const moodCounts = {};
  moodThisWeek.forEach(e => { moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });
  const dominantMoodKey = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const dominantMood = MOODS.find(m => m.key === dominantMoodKey) || null;

  // Forward look
  const upcomingDdays = ddays
    .map(d => ({ ...d, remaining: daysUntil(d.date) }))
    .filter(d => d.remaining >= 0)
    .sort((a, b) => a.remaining - b.remaining);
  const nextDday = upcomingDdays[0] || null;
  const revisionsDueCount = revisions.filter(r => r.dueDate <= todayStr()).length;

  return {
    days, totalThisWeek, totalLastWeek, change, maxMinutes,
    topSubjects, topSubjectsMax,
    streak,
    goalsTotal, goalsDone, bestDay,
    moodThisWeek, moodCounts, dominantMood,
    nextDday, revisionsDueCount,
  };
}

function summaryLine(d) {
  if (d.totalThisWeek === 0) return "No study sessions logged yet this week. Whenever you're ready, Chintu's waiting.";
  if (d.change > 10) return `Up ${d.change}% on last week. That's real momentum, keep riding it.`;
  if (d.change < -10) return `Down ${Math.abs(d.change)}% on last week. Slower weeks happen: pick one small session today.`;
  return "About the same pace as last week. Steady is good.";
}

export default function WeeklyDigest() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      hydrateTracker(), hydrateMoodLog(), hydrateRevisionSchedule(), hydrateDdays(), hydrateGoals(),
    ]).then(() => setData(buildDigest()));
  }, []);

  if (!data) {
    return <div className="digest digest--loading">Loading your week…</div>;
  }

  const goalsPct = pct(data.goalsDone, data.goalsTotal);
  const hours = Math.floor(data.totalThisWeek / 60);
  const mins = data.totalThisWeek % 60;

  return (
    <div className="digest">
      <div className="digest__header">
        <p className="digest__eyebrow">Weekly digest</p>
        <h1 className="digest__title">Your week in review</h1>
        <p className="digest__summary">{summaryLine(data)}</p>
      </div>

      {/* Hero stats */}
      <div className="digest__hero">
        <div className="digest__hero-stat digest__hero-stat--primary">
          <div className="digest__hero-value">{hours}h {mins}m</div>
          <div className="digest__hero-label">Studied this week</div>
          {data.totalLastWeek > 0 && (
            <span className={`digest__trend digest__trend--${data.change >= 0 ? "up" : "down"}`}>
              {data.change >= 0 ? "▲" : "▼"} {Math.abs(data.change)}% vs last week
            </span>
          )}
        </div>
        <div className="digest__hero-stat">
          <div className="digest__hero-value">{data.streak}</div>
          <div className="digest__hero-label">{data.streak === 1 ? "day streak" : "day streak"}</div>
        </div>
        <div className="digest__hero-stat">
          <div className="digest__hero-value">{goalsPct}%</div>
          <div className="digest__hero-label">Goals completed</div>
        </div>
      </div>

      {/* Daily chart */}
      <div className="digest__section">
        <h2 className="digest__section-heading">Day by day</h2>
        <div className="digest__chart">
          {data.days.map((d, i) => (
            <div key={i} className="digest__chart-col">
              <div
                className="digest__chart-bar"
                style={{ height: `${Math.max(4, (d.minutes / data.maxMinutes) * 90)}px` }}
                title={`${d.minutes} min`}
              />
              <span className="digest__chart-label">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top subjects */}
      <div className="digest__section">
        <h2 className="digest__section-heading">Where your time went</h2>
        {data.topSubjects.length === 0 ? (
          <p className="digest__empty">No subjects logged this week.</p>
        ) : (
          <div className="digest__subject-list">
            {data.topSubjects.map(([subject, minutes]) => (
              <div key={subject} className="digest__subject-row">
                <span className="digest__subject-name">{subject}</span>
                <div className="digest__subject-bar-track">
                  <div
                    className="digest__subject-bar-fill"
                    style={{ width: `${Math.max(6, (minutes / data.topSubjectsMax) * 100)}%` }}
                  />
                </div>
                <span className="digest__subject-time">{minutes}m</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goal consistency + mood, side by side */}
      <div className="digest__row">
        <div className="digest__section digest__section--half">
          <h2 className="digest__section-heading">Goal consistency</h2>
          {data.goalsTotal === 0 ? (
            <p className="digest__empty">No goals were scheduled this week.</p>
          ) : (
            <>
              <div className="digest__ring-row">
                <div
                  className="digest__ring"
                  style={{ "--pct": goalsPct }}
                >
                  <span className="digest__ring-value">{goalsPct}%</span>
                </div>
                <div className="digest__ring-caption">
                  <p>{data.goalsDone} of {data.goalsTotal} goals done</p>
                  {data.bestDay && <p className="digest__ring-best">Best day: {data.bestDay}</p>}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="digest__section digest__section--half">
          <h2 className="digest__section-heading">
            Mood check-ins
            <span className="digest__pill">{data.moodThisWeek.length}/7 logged</span>
          </h2>
          {data.moodThisWeek.length === 0 ? (
            <p className="digest__empty">No moods logged this week.</p>
          ) : (
            <>
              {data.dominantMood && (
                <p className="digest__mood-dominant">
                  Mostly feeling{" "}
                  <span style={{ color: data.dominantMood.color, fontWeight: 800 }}>
                    {data.dominantMood.label.toLowerCase()}
                  </span>
                </p>
              )}
              <div className="digest__mood-bars">
                {MOODS.filter(m => data.moodCounts[m.key]).map(m => (
                  <div key={m.key} className="digest__mood-bar-row">
                    <span className="digest__mood-bar-label">{m.label}</span>
                    <div className="digest__mood-bar-track">
                      <div
                        className="digest__mood-bar-fill"
                        style={{
                          width: `${pct(data.moodCounts[m.key], data.moodThisWeek.length)}%`,
                          backgroundColor: m.color,
                        }}
                      />
                    </div>
                    <span className="digest__mood-bar-count">{data.moodCounts[m.key]}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Looking ahead */}
      {(data.nextDday || data.revisionsDueCount > 0) && (
        <div className="digest__section">
          <h2 className="digest__section-heading">Looking ahead</h2>
          <div className="digest__ahead-row">
            {data.nextDday && (
              <div className="digest__ahead-card">
                <div className="digest__ahead-value">
                  {data.nextDday.remaining === 0 ? "Today" : `${data.nextDday.remaining}d`}
                </div>
                <div className="digest__ahead-label">until {data.nextDday.label}</div>
              </div>
            )}
            {data.revisionsDueCount > 0 && (
              <div className="digest__ahead-card">
                <div className="digest__ahead-value">{data.revisionsDueCount}</div>
                <div className="digest__ahead-label">
                  {data.revisionsDueCount === 1 ? "revision due" : "revisions due"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}