"use client";
import "@/styles/dashboard.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Companion from "@/components/Companion";
import StreakBanner from "@/components/StreakBanner";
import { localDateStr as todayStr } from "@/lib/date";
import {
  loadGoals, saveGoals, deleteGoal,
  getGoalsForDate, getDoneMap, setGoalDone,
  GOAL_COLORS, WEEK_DAYS,
} from "@/lib/goals";

const TIMETABLE_KEY   = "chintu-timetable";
const SESSION_LOG_KEY = "chintu-session-log";
const TODO_KEY        = "chintu-todos";
const MOOD_KEY        = "chintu-mood-log";
const REVISION_KEY    = "chintu-revisions";
const SUBJECTS_KEY    = "chintu-subjects";
const DDAY_KEY        = "chintu-ddays";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MOODS = [
  { key: "great",    label: "Great",    color: "#7EC8A0" },
  { key: "good",     label: "Good",     color: "#EDE986" },
  { key: "okay",     label: "Okay",     color: "#93ABD9" },
  { key: "tired",    label: "Tired",    color: "#E7BEF8" },
  { key: "stressed", label: "Stressed", color: "#F9C060" },
  { key: "low",      label: "Low",      color: "#9A8C7A" },
];

const DURATION_PRESETS = [15, 25, 45, 60, 90];
const PRIORITY_COLOR = { high: "#F2619C", medium: "#F9C060", low: "#7EC8A0" };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning!";
  if (h < 17) return "Good afternoon!";
  if (h < 21) return "Good evening!";
  return "Studying late?";
}

function loadJSON(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}

const DAILY_QUOTES = [
  "Small steps every day add up to big results.",
  "You don't have to be perfect, just consistent.",
  "Every expert was once a beginner.",
  "Focus on progress, not perfection.",
  "The work you put in today is the result you see tomorrow.",
  "One topic at a time. You've got this.",
  "Rest if you must, but don't quit.",
  "Your future self is cheering you on.",
  "Hard work beats talent when talent doesn't work hard.",
  "Show up. That's already half the battle.",
  "You are closer than you think.",
  "A little progress each day adds up to big results.",
  "Study like there's no tomorrow, rest like you earned it.",
  "Difficult roads often lead to beautiful destinations.",
];

function getDailyQuote() {
  const day = new Date().getDate() + new Date().getMonth() * 31;
  return DAILY_QUOTES[day % DAILY_QUOTES.length];
}

function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}

function repeatSummary(r) {
  if (!r) return "";
  if (r.type === "once")   return "One-time";
  if (r.type === "daily")  return "Every day";
  if (r.type === "weekly") return (r.days || []).length ? r.days.join(", ") : "Weekly";
  return "";
}

// Rolling last 7 days of study time + top subjects, from the session log Timer already writes to.
function computeWeeklyReport(log) {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = todayStr(d);
    const mins = log.filter(s => s.date === ds).reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    days.push({ label: d.toLocaleDateString(undefined, { weekday: "short" }), minutes: mins });
  }
  const cutoff = todayStr(new Date(today.getTime() - 6 * 86400000));
  const bySubject = {};
  log.filter(s => s.date >= cutoff).forEach(s => {
    if (!s.subject) return;
    bySubject[s.subject] = (bySubject[s.subject] || 0) + (s.durationMinutes || 0);
  });
  const topSubjects = Object.entries(bySubject).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const totalWeekMinutes = days.reduce((s, d) => s + d.minutes, 0);
  return { days, topSubjects, totalWeekMinutes };
}

export default function DashboardContent() {
  const router = useRouter();

  const [todaySlots, setTodaySlots]     = useState([]);
  const [todayStats, setTodayStats]     = useState({ minutes: 0, coins: 0 });
  const [todos, setTodos]               = useState([]);
  const [todayMood, setTodayMood]       = useState(null);
  const [revisionsDue, setRevisionsDue] = useState([]);
  const [nextSlot, setNextSlot]         = useState(null);
  const [ddays, setDdays]               = useState([]);
  const [newDdayLabel, setNewDdayLabel] = useState("");
  const [newDdayDate, setNewDdayDate]   = useState("");
  const [showAddDday, setShowAddDday]   = useState(false);

  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [subjectOptions, setSubjectOptions]       = useState([]);
  const [customSubject, setCustomSubject]         = useState("");

  const [report, setReport] = useState({ days: [], topSubjects: [], totalWeekMinutes: 0 });

  // Today's Goals (recurring templates)
  const [goalsToday, setGoalsToday]   = useState([]);
  const [doneMap, setDoneMap]         = useState({});
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalSubject, setNewGoalSubject]   = useState("");
  const [newGoalDuration, setNewGoalDuration] = useState(25);
  const [newGoalColor, setNewGoalColor]       = useState(GOAL_COLORS[0].value);
  const [newGoalRepeatType, setNewGoalRepeatType] = useState("once");
  const [newGoalDays, setNewGoalDays]         = useState([]);
  const [newGoalStartDate, setNewGoalStartDate] = useState(todayStr());
  const [newGoalHasEnd, setNewGoalHasEnd]     = useState(false);
  const [newGoalEndDate, setNewGoalEndDate]   = useState("");

  useEffect(() => {
    // Timetable
    const timetable = loadJSON(TIMETABLE_KEY, {});
    const today = DAYS[new Date().getDay()];
    const slots = Object.entries(timetable)
      .filter(([key]) => key.startsWith(`${today}-`))
      .map(([key, val]) => ({ time: key.split("-")[1], ...val }))
      .sort((a, b) => a.time.localeCompare(b.time));
    setTodaySlots(slots);

    const nowHour = new Date().getHours();
    const nowMin  = new Date().getMinutes();
    const upcoming = slots.find(s => {
      const parts = s.time.split(" ");
      const [h, mn = 0] = parts[0].split(":").map(Number);
      const period = parts[1];
      let hr = h;
      if (period === "PM" && hr !== 12) hr += 12;
      if (period === "AM" && hr === 12) hr = 0;
      return hr > nowHour || (hr === nowHour && mn > nowMin);
    });
    setNextSlot(upcoming || null);

    // Session log + weekly report
    const log = loadJSON(SESSION_LOG_KEY, []);
    const todays = log.filter(s => s.date === todayStr());
    setTodayStats({
      minutes: todays.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
      coins:   todays.reduce((sum, s) => sum + (s.coinsEarned || 0), 0),
    });
    setReport(computeWeeklyReport(log));

    // Todos
    const allTodos = loadJSON(TODO_KEY, []);
    setTodos(allTodos.filter(t => !t.done).slice(0, 4));

    // Mood
    const moodLog = loadJSON(MOOD_KEY, []);
    const todayMoodEntry = moodLog.find(e => e.date === todayStr());
    if (todayMoodEntry) setTodayMood(todayMoodEntry.mood);

    // Revisions
    const revisions = loadJSON(REVISION_KEY, []);
    setRevisionsDue(revisions.filter(r => r.dueDate <= todayStr()).slice(0, 3));

    // D-Days
    const savedDdays = loadJSON(DDAY_KEY, []);
    setDdays(savedDdays.sort((a, b) => a.date.localeCompare(b.date)));

    // Today's Goals
    setGoalsToday(getGoalsForDate(new Date()));
    setDoneMap(getDoneMap(todayStr()));

    // Subject options — subjects, tracker topic names, and timetable slots
    const subjects = loadJSON(SUBJECTS_KEY, {});
    const subjectNames = new Set(Object.keys(subjects));
    Object.values(subjects).forEach(topics => {
      (topics || []).forEach(t => subjectNames.add(t.name));
    });
    Object.values(timetable).forEach(slot => {
      if (slot.subject) subjectNames.add(slot.subject);
    });
    setSubjectOptions([...subjectNames]);
  }, []);

  function logMood(moodKey) {
    const moodLog = loadJSON(MOOD_KEY, []);
    const filtered = moodLog.filter(e => e.date !== todayStr());
    const updated = [{ date: todayStr(), mood: moodKey }, ...filtered];
    setTodayMood(moodKey);
    try { localStorage.setItem(MOOD_KEY, JSON.stringify(updated)); } catch {}
  }

  function addDday() {
    if (!newDdayLabel.trim() || !newDdayDate) return;
    const updated = [...ddays, { label: newDdayLabel.trim(), date: newDdayDate }]
      .sort((a, b) => a.date.localeCompare(b.date));
    setDdays(updated);
    try { localStorage.setItem(DDAY_KEY, JSON.stringify(updated)); } catch {}
    setNewDdayLabel(""); setNewDdayDate(""); setShowAddDday(false);
  }

  function removeDday(index) {
    const updated = ddays.filter((_, i) => i !== index);
    setDdays(updated);
    try { localStorage.setItem(DDAY_KEY, JSON.stringify(updated)); } catch {}
  }

  // ---- Goals ----
  function toggleGoalDay(day) {
    setNewGoalDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  function resetGoalForm() {
    setNewGoalSubject(""); setNewGoalDuration(25); setNewGoalColor(GOAL_COLORS[0].value);
    setNewGoalRepeatType("once"); setNewGoalDays([]); setNewGoalStartDate(todayStr());
    setNewGoalHasEnd(false); setNewGoalEndDate(""); setShowAddGoal(false);
  }

  function addGoal() {
    const subject = newGoalSubject.trim();
    if (!subject || !newGoalDuration) return;

    const goal = {
      id: `${Date.now()}`,
      subject,
      color: newGoalColor,
      durationMinutes: Number(newGoalDuration),
      repeat: {
        type: newGoalRepeatType,
        days: newGoalRepeatType === "weekly" ? newGoalDays : [],
        startDate: newGoalStartDate || todayStr(),
        endDate: newGoalRepeatType === "once"
          ? (newGoalStartDate || todayStr())
          : (newGoalHasEnd ? newGoalEndDate : null),
      },
    };

    saveGoals([...loadGoals(), goal]);
    setGoalsToday(getGoalsForDate(new Date()));
    resetGoalForm();
  }

  function removeGoal(id) {
    deleteGoal(id);
    setGoalsToday(getGoalsForDate(new Date()));
  }

  function toggleGoalDoneToday(id) {
    const today = todayStr();
    const current = !!doneMap[id];
    setGoalDone(id, today, !current);
    setDoneMap(getDoneMap(today));
  }

  function startGoal(goal) {
    const params = new URLSearchParams({
      subject: goal.subject,
      duration: String(goal.durationMinutes),
      goalId: goal.id,
    });
    router.push(`/timer?${params.toString()}`);
  }

  function startStudying(subject) {
    const q = subject ? `?subject=${encodeURIComponent(subject)}` : "";
    router.push(`/timer${q}`);
  }

  function getCompanionMood() {
    const hour = new Date().getHours();
    if (hour >= 24) return "sleepy";
    if (todayStats.minutes > 0) return "happy";
    return "waiting";
  }

  const todayMoodObj = MOODS.find(m => m.key === todayMood);
  const goalsDoneCount = goalsToday.filter(g => doneMap[g.id]).length;
  const maxReportMinutes = Math.max(1, ...report.days.map(d => d.minutes));

  return (
    <div className="dashboard">
      <img src="/companion/indoor-bg.PNG" alt="" className="dashboard__scene-bg" />

      <h1 className="dashboard__greeting">{greeting()}</h1>
      <StreakBanner />

      {/* D-Day strip */}
      <div className="dashboard__dday-strip">
        {ddays.length === 0 && !showAddDday && (
          <button className="dashboard__dday-empty-btn" onClick={() => setShowAddDday(true)}>
            No exam dates set: add one
          </button>
        )}

        {ddays.map((d, i) => {
          const remaining = daysUntil(d.date);
          return (
            <div key={i} className="dashboard__dday-card">
              <button className="dashboard__dday-remove" onClick={() => removeDday(i)}>×</button>
              <div className="dashboard__dday-number">
                {remaining > 0 ? remaining : remaining === 0 ? "Today" : "Past"}
              </div>
              <div className="dashboard__dday-label">{d.label}</div>
            </div>
          );
        })}

        {ddays.length > 0 && !showAddDday && (
          <button className="dashboard__dday-add-btn" onClick={() => setShowAddDday(true)}>+ Add date</button>
        )}

        {showAddDday && (
          <div className="dashboard__dday-form">
            <input
              className="dashboard__dday-input"
              placeholder="Exam name"
              value={newDdayLabel}
              onChange={e => setNewDdayLabel(e.target.value)}
            />
            <input
              className="dashboard__dday-input"
              type="date"
              value={newDdayDate}
              onChange={e => setNewDdayDate(e.target.value)}
            />
            <button className="dashboard__dday-save" onClick={addDday}>Save</button>
            <button className="dashboard__dday-cancel" onClick={() => setShowAddDday(false)}>Cancel</button>
          </div>
        )}
      </div>

      <div className="dashboard__main">

        <div className="dashboard__chintu-side">
          <div className="dashboard__companion-wrap">
            <Companion mood={getCompanionMood()} />
          </div>

          {!showSubjectPicker ? (
            <button className="dashboard__start-btn" onClick={() => setShowSubjectPicker(true)}>
              Start studying
            </button>
          ) : (
            <div className="dashboard__subject-picker">
              <p className="dashboard__subject-picker-title">What are you studying?</p>
              <div className="dashboard__subject-options">
                {subjectOptions.map(s => (
                  <button key={s} className="dashboard__subject-chip" onClick={() => startStudying(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="dashboard__subject-custom-row">
                <input
                  className="dashboard__subject-input"
                  placeholder="Or type a subject..."
                  value={customSubject}
                  onChange={e => setCustomSubject(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && startStudying(customSubject)}
                />
                <button className="dashboard__subject-go" onClick={() => startStudying(customSubject)}>Go</button>
              </div>
              <button className="dashboard__subject-skip" onClick={() => startStudying(null)}>
                Skip: just start
              </button>
            </div>
          )}
        </div>

        <div className="dashboard__info-side">

          <p className="dashboard__quote">"{getDailyQuote()}"</p>

          {/* Today's Goals */}
          <div className="dashboard__section">
            <h2 className="dashboard__section-heading">
              Today's goals
              {goalsToday.length > 0 && (
                <span className="dashboard__goal-progress-pill">
                  {goalsDoneCount}/{goalsToday.length} done
                </span>
              )}
            </h2>

            {goalsToday.length === 0 && !showAddGoal && (
              <p className="dashboard__plan-empty">
                No goals set for today. Add one: it can repeat automatically too.
              </p>
            )}

            {goalsToday.length > 0 && (
              <div className="dashboard__goal-list">
                {goalsToday.map(g => {
                  const isDone = !!doneMap[g.id];
                  return (
                    <div
                      key={g.id}
                      className={`dashboard__goal-card${isDone ? " dashboard__goal-card--done" : ""}`}
                      style={{ borderLeft: `4px solid ${g.color}` }}
                    >
                      <button
                        className="dashboard__goal-checkbox"
                        aria-label="Toggle done"
                        onClick={() => toggleGoalDoneToday(g.id)}
                      >
                        {isDone ? "✓" : ""}
                      </button>
                      <div className="dashboard__goal-info">
                        <span className="dashboard__goal-subject">{g.subject}</span>
                        <span className="dashboard__goal-duration">
                          {g.durationMinutes} min · {repeatSummary(g.repeat)}
                        </span>
                      </div>
                      <div className="dashboard__goal-actions">
                        {!isDone && (
                          <button className="dashboard__goal-start" onClick={() => startGoal(g)}>
                            Start
                          </button>
                        )}
                        <button className="dashboard__goal-remove" onClick={() => removeGoal(g.id)} title="Delete goal (all days)">×</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!showAddGoal ? (
              <button className="dashboard__goal-add-btn" onClick={() => setShowAddGoal(true)}>
                + Add a goal
              </button>
            ) : (
              <div className="dashboard__goal-form">
                <input
                  className="dashboard__goal-input"
                  placeholder="Subject or topic (e.g. Kinematics)"
                  value={newGoalSubject}
                  onChange={e => setNewGoalSubject(e.target.value)}
                  list="dashboard-goal-subject-options"
                />
                <datalist id="dashboard-goal-subject-options">
                  {subjectOptions.map(s => <option key={s} value={s} />)}
                </datalist>

                <div className="dashboard__goal-duration-row">
                  {DURATION_PRESETS.map(d => (
                    <button
                      key={d}
                      className={`dashboard__goal-duration-chip${newGoalDuration === d ? " dashboard__goal-duration-chip--selected" : ""}`}
                      onClick={() => setNewGoalDuration(d)}
                    >
                      {d}m
                    </button>
                  ))}
                  <input
                    className="dashboard__goal-duration-input"
                    type="number"
                    min="1"
                    value={newGoalDuration}
                    onChange={e => setNewGoalDuration(e.target.value)}
                  />
                </div>

                <p className="dashboard__goal-form-label">Color</p>
                <div className="dashboard__goal-color-row">
                  {GOAL_COLORS.map(c => (
                    <button
                      key={c.value}
                      className={`dashboard__goal-color-swatch${newGoalColor === c.value ? " dashboard__goal-color-swatch--active" : ""}`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                      onClick={() => setNewGoalColor(c.value)}
                    />
                  ))}
                </div>

                <p className="dashboard__goal-form-label">Repeat</p>
                <div className="dashboard__goal-repeat-row">
                  {["once", "daily", "weekly"].map(type => (
                    <button
                      key={type}
                      className={`dashboard__goal-repeat-chip${newGoalRepeatType === type ? " dashboard__goal-repeat-chip--selected" : ""}`}
                      onClick={() => setNewGoalRepeatType(type)}
                    >
                      {type === "once" ? "Just once" : type === "daily" ? "Every day" : "Specific days"}
                    </button>
                  ))}
                </div>

                {newGoalRepeatType === "weekly" && (
                  <div className="dashboard__goal-days-row">
                    {WEEK_DAYS.map(day => (
                      <button
                        key={day}
                        className={`dashboard__goal-day-chip${newGoalDays.includes(day) ? " dashboard__goal-day-chip--selected" : ""}`}
                        onClick={() => toggleGoalDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}

                <div className="dashboard__goal-date-row">
                  <label className="dashboard__goal-date-label">
                    Starts
                    <input
                      className="dashboard__goal-date-input"
                      type="date"
                      value={newGoalStartDate}
                      onChange={e => setNewGoalStartDate(e.target.value)}
                    />
                  </label>

                  {newGoalRepeatType !== "once" && (
                    <label className="dashboard__goal-end-toggle">
                      <input
                        type="checkbox"
                        checked={newGoalHasEnd}
                        onChange={e => setNewGoalHasEnd(e.target.checked)}
                      />
                      Ends on a date
                    </label>
                  )}

                  {newGoalRepeatType !== "once" && newGoalHasEnd && (
                    <input
                      className="dashboard__goal-date-input"
                      type="date"
                      value={newGoalEndDate}
                      onChange={e => setNewGoalEndDate(e.target.value)}
                    />
                  )}
                </div>

                <div className="dashboard__goal-form-actions">
                  <button className="dashboard__goal-save" onClick={addGoal}>Save goal</button>
                  <button className="dashboard__goal-cancel" onClick={resetGoalForm}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Weekly report */}
          <div className="dashboard__section">
            <h2 className="dashboard__section-heading">
              This week
              <span className="dashboard__goal-progress-pill">
                {Math.floor(report.totalWeekMinutes / 60)}h {report.totalWeekMinutes % 60}m
              </span>
            </h2>
            <div className="dashboard__report-chart">
              {report.days.map((d, i) => (
                <div key={i} className="dashboard__report-bar-col">
                  <div
                    className="dashboard__report-bar"
                    style={{ height: `${Math.max(4, (d.minutes / maxReportMinutes) * 80)}px` }}
                    title={`${d.minutes} min`}
                  />
                  <span className="dashboard__report-bar-label">{d.label}</span>
                </div>
              ))}
            </div>
            {report.topSubjects.length > 0 && (
              <div className="dashboard__report-subjects">
                {report.topSubjects.map(([subject, mins]) => (
                  <div key={subject} className="dashboard__report-subject-row">
                    <span className="dashboard__report-subject-name">{subject}</span>
                    <span className="dashboard__report-subject-time">{mins}m</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard__section">
            <h2 className="dashboard__section-heading">
              How are you feeling?
              {todayMood && (
                <span className="dashboard__mood-logged" style={{ background: todayMoodObj.color }}>
                  {todayMoodObj.label}
                </span>
              )}
            </h2>
            <div className="dashboard__mood-options">
              {MOODS.map(m => (
                <button
                  key={m.key}
                  className={`dashboard__mood-btn${todayMood === m.key ? " dashboard__mood-btn--selected" : ""}`}
                  style={{ "--mood-color": m.color }}
                  onClick={() => logMood(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {nextSlot && (
            <div className="dashboard__section">
              <h2 className="dashboard__section-heading">Next up</h2>
              <div className="dashboard__next-slot" style={{ borderColor: nextSlot.color || "var(--color-accent)" }}>
                <span className="dashboard__next-time">{nextSlot.time}</span>
                <span className="dashboard__next-subject">{nextSlot.subject}</span>
              </div>
            </div>
          )}

          <div className="dashboard__section">
            <h2 className="dashboard__section-heading">Today's plan</h2>
            {todaySlots.length === 0 ? (
              <p className="dashboard__plan-empty">Nothing scheduled: add slots in your timetable.</p>
            ) : (
              <div className="dashboard__plan-list">
                {todaySlots.map((slot, i) => (
                  <div key={i} className="dashboard__plan-slot" style={{ backgroundColor: slot.color || "var(--color-surface)" }}>
                    <span>{slot.time}</span>
                    <span>{slot.subject}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard__section">
            <h2 className="dashboard__section-heading">To-do</h2>
            {todos.length === 0 ? (
              <p className="dashboard__plan-empty">No pending tasks.</p>
            ) : (
              <div className="dashboard__todo-list">
                {todos.map(t => (
                  <div key={t.id} className="dashboard__todo-item">
                    <span className="dashboard__todo-dot" style={{ background: PRIORITY_COLOR[t.priority] }} />
                    <span className="dashboard__todo-text">{t.text}</span>
                    {t.due && <span className="dashboard__todo-due">{t.due}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {revisionsDue.length > 0 && (
            <div className="dashboard__section">
              <h2 className="dashboard__section-heading">Revisions due</h2>
              <div className="dashboard__todo-list">
                {revisionsDue.map(r => (
                  <div key={r.id} className="dashboard__todo-item">
                    <span className="dashboard__todo-dot" style={{ background: "#93ABD9" }} />
                    <span className="dashboard__todo-text">{r.subject} — {r.topic}</span>
                    <span className="dashboard__todo-due">{r.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="dashboard__stats-col">
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-value">{todayStats.minutes}m</div>
              <div className="dashboard__stat-label">Study time</div>
            </div>
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-value">{todayStats.coins}</div>
              <div className="dashboard__stat-label">Coins today</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}