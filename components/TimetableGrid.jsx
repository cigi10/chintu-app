"use client";
import "@/styles/timetable.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getGoalsForWeek, getGoalsForDate } from "@/lib/goals";
import { localDateStr } from "@/lib/date";
import { getSubjectColor, setSubjectColor, hydrateSubjectColors } from "@/lib/subjectColors";
import { getAllTrackerTopicNames } from "@/lib/trackerTopics";
import { getLocalTodos, hydrateTodos, saveTodos as persistTodos } from "@/lib/todos";
import { hydrateGoals } from "@/lib/goals";
import { hydrateTracker, getSessionLog } from "@/lib/tracker";
import { hydrateTimetable, saveTimetable } from "@/lib/timetable";

const DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = [
  "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
  "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
];

// 7 presets + a custom color picker in the modal.
const PRESET_COLORS = [
  { label: "Plum",      value: "#E9D9F7", text: "#5B3A85" },
  { label: "Lilac",     value: "#F3E3FB", text: "#7A4FA0" },
  { label: "Blueberry", value: "#DCE6F7", text: "#33507A" },
  { label: "Lemon",     value: "#FBF6C9", text: "#7A6E1E" },
  { label: "Mint",      value: "#DCF2E5", text: "#2E7A55" },
  { label: "Blush",     value: "#FBDCE7", text: "#A33E68" },
  { label: "Sky",       value: "#D6EFFB", text: "#2B6E8C" },
];
const DEFAULT_CUSTOM_COLOR = "#C9A6E8";

const PRIORITY_DOT = { high: "#F2619C", medium: "#F9C060", low: "#7EC8A0" };

// Computes readable text color for ANY hex, used for custom (non-preset) colors.
function getContrastText(hex) {
  if (!hex || hex[0] !== "#" || hex.length < 7) return "#241F3D";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#241F3D" : "#FBF3FF";
}
function textColorFor(hex) {
  const preset = PRESET_COLORS.find(c => c.value === hex);
  return preset ? preset.text : getContrastText(hex);
}

// JS getDay(): 0=Sun..6=Sat. Our DAYS array starts at Mon, so shift by 6.
function todayIndex() { return (new Date().getDay() + 6) % 7; }
function nowSlotIndex() {
  const d = new Date();
  return Math.floor((d.getHours() * 60 + d.getMinutes()) / 30);
}

function mondayOfThisWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function weekDateStrs() {
  const monday = mondayOfThisWeek();
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return localDateStr(d);
  });
}

function cellKey(day, slot) { return `${day}-${slot}`; }

function saveToStorage(data) { saveTimetable(data); }

function todaysTasks(todos) {
  const today = localDateStr(new Date());
  return todos.filter(t => !t.done && (!t.due || t.due <= today));
}

function buildMinutesIndex(log) {
  const idx = {};
  for (const s of log) {
    if (!s.subject) continue;
    const key = `${s.date}|${s.subject.toLowerCase()}`;
    idx[key] = (idx[key] || 0) + (s.durationMinutes || 0);
  }
  return idx;
}
function totalMinutesForDate(log, dateStr) {
  return log.filter(s => s.date === dateStr).reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
}

function getFillPercent(t) {
  return (Object.keys(t).length / (DAYS.length * SLOTS.length)) * 100;
}

function SlotModal({ day, slot, rangeSlots, existing, rangeHasFilled, suggestions, onSave, onClear, onClearRange, onClose }) {
  const [subject, setSubject] = useState(existing?.subject || "");
  const [color, setColor]     = useState(existing?.color   || PRESET_COLORS[0].value);
  const [note, setNote]       = useState(existing?.note    || "");

  const isRange = rangeSlots && rangeSlots.length > 1;
  const dayLabel = isRange ? `${day} · ${rangeSlots[0]}–${rangeSlots[rangeSlots.length - 1]}` : `${day} · ${slot}`;
  const isPresetColor = PRESET_COLORS.some(c => c.value === color);

  useEffect(() => {
    if (existing) return;
    const known = getSubjectColor(subject, null);
    if (known) setColor(known);
  }, [subject, existing]);

  return (
    <div className="slot-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="slot-modal">
        <button className="slot-modal__close" onClick={onClose} aria-label="Close">×</button>

        <p className="slot-modal__day-slot">{dayLabel}</p>
        <h2 className="slot-modal__title">
          {isRange ? `Fill ${rangeSlots.length} blocks` : (existing ? "Edit Slot" : "Add Subject")}
        </h2>

        <label className="slot-modal__label">Subject</label>
        <input
          autoFocus
          className="slot-modal__input"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="e.g. Physics, DSA, Maths..."
          list="tt-subject-suggestions"
          onKeyDown={e => e.key === "Enter" && subject.trim() && onSave({ subject, color, note })}
        />
        {/* Pulled live from the Tracker's topics/subtopics — deleting one there
            removes it from this list automatically, nothing else to sync. */}
        <datalist id="tt-subject-suggestions">
          {suggestions.map(s => <option key={s} value={s} />)}
        </datalist>

        <label className="slot-modal__label">Color</label>
        <div className="slot-modal__colors">
          {PRESET_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              title={c.label}
              className={`slot-modal__color-swatch${color === c.value ? " slot-modal__color-swatch--active" : ""}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          <label
            className={`slot-modal__color-custom${!isPresetColor ? " slot-modal__color-custom--active" : ""}`}
            style={!isPresetColor ? { background: color } : undefined}
            title="Custom color"
          >
            <input
              type="color"
              value={isPresetColor ? DEFAULT_CUSTOM_COLOR : color}
              onChange={e => setColor(e.target.value)}
            />
          </label>
        </div>

        <label className="slot-modal__label">
          Note <span className="slot-modal__label-optional">(optional)</span>
        </label>
        <input
          className="slot-modal__input"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Focus on thermodynamics"
        />

        <div className="slot-modal__actions">
          <button
            className="slot-modal__save-btn"
            disabled={!subject.trim()}
            onClick={() => subject.trim() && onSave({ subject: subject.trim(), color, note })}
          >
            {isRange ? `Save to all ${rangeSlots.length}` : "Save"}
          </button>
          {existing && !isRange && (
            <button className="slot-modal__clear-btn" onClick={onClear}>Clear</button>
          )}
          {isRange && rangeHasFilled && (
            <button className="slot-modal__clear-btn" onClick={onClearRange}>Clear range</button>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyDayModal({ sourceDay, onCopy, onClose }) {
  const [targets, setTargets] = useState([]);
  function toggle(d) {
    setTargets(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }
  return (
    <div className="slot-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="slot-modal">
        <button className="slot-modal__close" onClick={onClose} aria-label="Close">×</button>
        <p className="slot-modal__day-slot">Copy {sourceDay}'s plan</p>
        <h2 className="slot-modal__title">Which days should get it?</h2>
        <p className="timetable__copy-day-note">This replaces whatever is already on the days you pick.</p>
        <div className="timetable__copy-day-list">
          {DAYS.filter(d => d !== sourceDay).map(d => (
            <button
              key={d}
              className={`timetable__copy-day-chip${targets.includes(d) ? " timetable__copy-day-chip--active" : ""}`}
              onClick={() => toggle(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="slot-modal__actions">
          <button
            className="slot-modal__save-btn"
            disabled={targets.length === 0}
            onClick={() => onCopy(targets)}
          >
            Copy to {targets.length || ""} day{targets.length === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WeekInsights({ timetable, sessionLog }) {
  const dateStrs = weekDateStrs();
  const rows = DAYS.map((day, i) => {
    const planned = SLOTS.filter(slot => timetable[cellKey(day, slot)]).length * 30;
    const actual = totalMinutesForDate(sessionLog, dateStrs[i]);
    return { day, planned, actual };
  });
  const max = Math.max(1, ...rows.map(r => r.planned), ...rows.map(r => r.actual));

  return (
    <div className="timetable__insights">
      <div className="timetable__insights-header">
        <span className="timetable__insights-title">This week: planned vs. actual</span>
        <div className="timetable__insights-legend">
          <span className="timetable__insights-legend-item">
            <span className="timetable__insights-swatch timetable__insights-swatch--planned" /> Planned
          </span>
          <span className="timetable__insights-legend-item">
            <span className="timetable__insights-swatch timetable__insights-swatch--actual" /> Actual
          </span>
        </div>
      </div>
      <div className="timetable__insights-bars">
        {rows.map(r => (
          <div key={r.day} className="timetable__insights-day">
            <div className="timetable__insights-track">
              <div
                className="timetable__insights-bar timetable__insights-bar--planned"
                style={{ height: `${(r.planned / max) * 100}%` }}
                title={`Planned: ${r.planned}m`}
              />
              <div
                className="timetable__insights-bar timetable__insights-bar--actual"
                style={{ height: `${(r.actual / max) * 100}%` }}
                title={`Actual: ${r.actual}m`}
              />
            </div>
            <span className="timetable__insights-day-label">{r.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TimetableGrid() {
  const router = useRouter();
  const [timetable, setTimetable]     = useState({});
  const [modal, setModal]             = useState(null);
  const [copySourceDay, setCopySourceDay] = useState(null);
  const [goalsByDay, setGoalsByDay]   = useState({});
  const [todaysGoals, setTodaysGoals] = useState([]);
  const [tasks, setTasks]             = useState([]);
  const [tasksByDay, setTasksByDay]   = useState({});
  const [sessionLog, setSessionLog]   = useState([]);
  const [minutesIndex, setMinutesIndex] = useState({});
  const [nowTick, setNowTick]         = useState(0);

  const [dragDay, setDragDay]         = useState(null);
  const [dragStartIdx, setDragStartIdx] = useState(null);
  const [dragEndIdx, setDragEndIdx]   = useState(null);
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);

  const scrollRef = useRef(null);
  const dayRefs   = useRef({});

  useEffect(() => {
    hydrateSubjectColors();
    hydrateTimetable().then(setTimetable);
    hydrateGoals().then(() => {
      setGoalsByDay(getGoalsForWeek());
      setTodaysGoals(getGoalsForDate(new Date()));
    });
    hydrateTodos().then(todos => {
      setTasks(todaysTasks(todos));
      setTasksByDay(buildTasksByDay(todos));
    });
    hydrateTracker().then(() => {
      const log = getSessionLog();
      setSessionLog(log);
      setMinutesIndex(buildMinutesIndex(log));
    });
  }, []);

  function buildTasksByDay(todos) {
    const dateStrs = weekDateStrs();
    const byDay = {};
    for (let i = 0; i < DAYS.length; i++) {
      const dateStr = dateStrs[i];
      const matches = todos.filter(t => !t.done && t.due === dateStr);
      if (matches.length > 0) byDay[DAYS[i]] = matches;
    }
    return byDay;
  }

  useEffect(() => {
    const id = setInterval(() => setNowTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (dragMovedRef.current && dragDay != null && dragStartIdx != null && dragEndIdx != null && dragStartIdx !== dragEndIdx) {
        const lo = Math.min(dragStartIdx, dragEndIdx);
        const hi = Math.max(dragStartIdx, dragEndIdx);
        const rangeSlots = SLOTS.slice(lo, hi + 1);
        const rangeHasFilled = rangeSlots.some(s => timetable[cellKey(dragDay, s)]);
        setModal({
          day: dragDay, slot: SLOTS[lo], rangeSlots, existing: null, rangeHasFilled,
          suggestions: getAllTrackerTopicNames(),
        });
      }
      setTimeout(() => {
        setDragDay(null);
        setDragStartIdx(null);
        setDragEndIdx(null);
      }, 0);
    }
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [dragDay, dragStartIdx, dragEndIdx, timetable]);

  function handleCellMouseDown(day, idx) {
    draggingRef.current = true;
    dragMovedRef.current = false;
    setDragDay(day);
    setDragStartIdx(idx);
    setDragEndIdx(idx);
  }
  function handleCellMouseEnter(day, idx) {
    if (!draggingRef.current || day !== dragDay) return;
    dragMovedRef.current = true;
    setDragEndIdx(idx);
  }
  function handleCellClick(day, slot) {
    if (dragMovedRef.current) { dragMovedRef.current = false; return; }
    const entry = timetable[cellKey(day, slot)];
    if (entry) {
      router.push(`/timer?subject=${encodeURIComponent(entry.subject)}`);
    } else {
      setModal({
        day, slot, rangeSlots: null, existing: null, rangeHasFilled: false,
        suggestions: getAllTrackerTopicNames(),
      });
    }
  }
  function handleEditClick(e, day, slot) {
    e.stopPropagation();
    setModal({
      day, slot, rangeSlots: null, existing: timetable[cellKey(day, slot)] || null, rangeHasFilled: false,
      suggestions: getAllTrackerTopicNames(),
    });
  }

  function handleSave(data) {
    if (!modal) return;
    const slots = modal.rangeSlots && modal.rangeSlots.length > 0 ? modal.rangeSlots : [modal.slot];
    const updated = { ...timetable };
    for (const s of slots) updated[cellKey(modal.day, s)] = data;
    setTimetable(updated); saveToStorage(updated); setModal(null);
    setSubjectColor(data.subject, data.color);
  }
  function handleClear() {
    if (!modal) return;
    const updated = { ...timetable };
    delete updated[cellKey(modal.day, modal.slot)];
    setTimetable(updated); saveToStorage(updated); setModal(null);
  }
  function handleClearRange() {
    if (!modal || !modal.rangeSlots) return;
    const updated = { ...timetable };
    for (const s of modal.rangeSlots) delete updated[cellKey(modal.day, s)];
    setTimetable(updated); saveToStorage(updated); setModal(null);
  }

  function copyDayTo(sourceDay, targetDays) {
    const updated = { ...timetable };
    for (const slot of SLOTS) {
      const src = updated[cellKey(sourceDay, slot)];
      for (const td of targetDays) {
        const key = cellKey(td, slot);
        if (src) updated[key] = src; else delete updated[key];
      }
    }
    setTimetable(updated); saveToStorage(updated); setCopySourceDay(null);
  }

  function completeTask(taskId) {
    const all = getLocalTodos();
    const updated = all.map(t => t.id === taskId ? { ...t, done: true } : t);
    persistTodos(updated);
    setTasks(todaysTasks(updated));
    setTasksByDay(buildTasksByDay(updated));
  }

  function scrollToToday() {
    const idx = todayIndex();
    const node = dayRefs.current[DAYS[idx]];
    if (node) node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  const fillPercent = getFillPercent(timetable);
  const todayIdx = todayIndex();
  const nowIdx = nowSlotIndex();
  const isEmpty = Object.keys(timetable).length === 0;
  const dateStrs = weekDateStrs();

  const selLo = dragStartIdx != null && dragEndIdx != null ? Math.min(dragStartIdx, dragEndIdx) : null;
  const selHi = dragStartIdx != null && dragEndIdx != null ? Math.max(dragStartIdx, dragEndIdx) : null;

  return (
    <div className="timetable__wrap">
      <div className="timetable__header-bar">
        <button className="timetable__pill-btn" onClick={scrollToToday}>Today</button>
        <span className="timetable__fill-badge">{Math.round(fillPercent)}% filled</span>
      </div>

      {(todaysGoals.length > 0 || tasks.length > 0) && (
        <div className="timetable__today-panels">
          {todaysGoals.length > 0 && (
            <div className="timetable__today-goals">
              <span className="timetable__today-goals-label">Today's goals</span>
              <div className="timetable__today-goals-list">
                {todaysGoals.map(g => (
                  <button
                    key={g.id}
                    className="timetable__today-goal-chip"
                    onClick={() => router.push(`/timer?subject=${encodeURIComponent(g.subject)}&duration=${g.durationMinutes}&goalId=${g.id}`)}
                    title={`Study ${g.subject} for ${g.durationMinutes}m`}
                  >
                    <span className="timetable__goal-dot" style={{ backgroundColor: g.color }} />
                    {g.subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tasks.length > 0 && (
            <div className="timetable__today-goals">
              <span className="timetable__today-goals-label">Today's tasks</span>
              <div className="timetable__today-goals-list">
                {tasks.map(t => (
                  <button
                    key={t.id}
                    className="timetable__today-goal-chip"
                    onClick={() => completeTask(t.id)}
                    title="Mark as done"
                  >
                    <span className="timetable__goal-dot" style={{ backgroundColor: PRIORITY_DOT[t.priority] || PRIORITY_DOT.medium }} />
                    {t.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <WeekInsights timetable={timetable} sessionLog={sessionLog} />

      <p className="timetable__scroll-hint">
        {isEmpty ? "Tap a block to add a subject: or click and drag to fill several at once →" : "Swipe sideways for more days →"}
      </p>

      <div className="timetable__scroll" ref={scrollRef}>
        <table className="timetable__table">
          <colgroup>
            <col className="timetable__time-col" />
            {DAYS.map(day => <col key={day} />)}
          </colgroup>
          <thead>
            <tr>
              <th className="timetable__corner" style={{ width: "52px" }} />
              {DAYS.map((day, i) => (
                <th
                  key={day}
                  ref={el => (dayRefs.current[day] = el)}
                  className={`timetable__th${i === todayIdx ? " timetable__th--today" : ""}`}
                >
                  <div>{day}</div>
                  {goalsByDay[day]?.length > 0 && (
                    <div className="timetable__th-goals">
                      {goalsByDay[day].slice(0, 5).map(g => (
                        <span
                          key={g.id}
                          className="timetable__goal-dot"
                          style={{ backgroundColor: g.color }}
                          title={`${g.subject} — ${g.durationMinutes}m`}
                        />
                      ))}
                    </div>
                  )}
                  {tasksByDay[day]?.length > 0 && (
                    <div className="timetable__th-goals" title={tasksByDay[day].map(t => t.text).join(", ")}>
                      {tasksByDay[day].slice(0, 5).map(t => (
                        <span
                          key={t.id}
                          className="timetable__th-task-dot"
                          style={{ backgroundColor: PRIORITY_DOT[t.priority] || PRIORITY_DOT.medium }}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    className="timetable__th-copy-btn"
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); setCopySourceDay(day); }}
                  >
                    Copy
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, slotIdx) => (
              <tr key={slot}>
                <td className="timetable__time-label">{slot}</td>
                {DAYS.map((day, i) => {
                  const key = cellKey(day, slot);
                  const entry = timetable[key];
                  const textColor = entry ? textColorFor(entry.color) : undefined;
                  const isToday = i === todayIdx;
                  const isNow = isToday && slotIdx === nowIdx;
                  const isSelecting = dragDay === day && selLo != null && slotIdx >= selLo && slotIdx <= selHi;
                  const studiedMinutes = entry
                    ? (minutesIndex[`${dateStrs[i]}|${entry.subject.toLowerCase()}`] || 0)
                    : 0;

                  return (
                    <td
                      key={key}
                      className={
                        `timetable__cell ${entry ? "timetable__cell--filled" : "timetable__cell--empty"}` +
                        `${isToday ? " timetable__cell--today" : ""}` +
                        `${isNow ? " timetable__cell--now" : ""}` +
                        `${isSelecting ? " timetable__cell--selecting" : ""}`
                      }
                      style={{ backgroundColor: entry && !isSelecting ? entry.color : undefined }}
                      onMouseDown={() => handleCellMouseDown(day, slotIdx)}
                      onMouseEnter={() => handleCellMouseEnter(day, slotIdx)}
                      onClick={() => handleCellClick(day, slot)}
                      title={entry ? `${entry.subject}${entry.note ? " — " + entry.note : ""} (tap to study)` : `Add ${day} ${slot}`}
                    >
                      {entry ? (
                        <span className="timetable__cell-subject" style={{ color: textColor }}>
                          {entry.subject}
                        </span>
                      ) : (
                        <span className="timetable__cell-plus">+</span>
                      )}
                      {entry && (
                        <button
                          className="timetable__cell-edit"
                          style={{ color: textColor }}
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => handleEditClick(e, day, slot)}
                        >
                          Edit
                        </button>
                      )}
                      {entry && studiedMinutes > 0 && (
                        <span className="timetable__cell-progress-dot" title={`${studiedMinutes}m actually studied`} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <SlotModal
          day={modal.day}
          slot={modal.slot}
          rangeSlots={modal.rangeSlots}
          existing={modal.existing}
          rangeHasFilled={modal.rangeHasFilled}
          suggestions={modal.suggestions}
          onSave={handleSave}
          onClear={handleClear}
          onClearRange={handleClearRange}
          onClose={() => setModal(null)}
        />
      )}

      {copySourceDay && (
        <CopyDayModal
          sourceDay={copySourceDay}
          onCopy={(targets) => copyDayTo(copySourceDay, targets)}
          onClose={() => setCopySourceDay(null)}
        />
      )}
    </div>
  );
}