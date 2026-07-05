"use client";
import "@/styles/timetable.css";
import { useState, useEffect, useRef } from "react";
import { getGoalsForWeek, getGoalsForDate } from "@/lib/goals";

const DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = [
  "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
  "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
];
const STORAGE_KEY = "chintu-timetable";

const PRESET_COLORS = [
  { label: "Plum",    value: "#E9D9F7", text: "#5B3A85" },
  { label: "Lilac",   value: "#F3E3FB", text: "#7A4FA0" },
  { label: "Blueberry", value: "#DCE6F7", text: "#33507A" },
  { label: "Lemon",   value: "#FBF6C9", text: "#7A6E1E" },
  { label: "Mint",    value: "#DCF2E5", text: "#2E7A55" },
  { label: "Blush",   value: "#FBDCE7", text: "#A33E68" },
];

// JS getDay(): 0=Sun..6=Sat. Our DAYS array starts at Mon, so shift by 6.
function todayIndex() { return (new Date().getDay() + 6) % 7; }

function cellKey(day, slot) { return `${day}-${slot}`; }

function loadFromStorage() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; }
  catch { return {}; }
}
function saveToStorage(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function getFillPercent(t) {
  return (Object.keys(t).length / (DAYS.length * SLOTS.length)) * 100;
}

function SlotModal({ day, slot, existing, onSave, onClear, onClose }) {
  const [subject, setSubject] = useState(existing?.subject || "");
  const [color, setColor]     = useState(existing?.color   || PRESET_COLORS[0].value);
  const [note, setNote]       = useState(existing?.note    || "");

  return (
    <div className="slot-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="slot-modal">
        <button className="slot-modal__close" onClick={onClose} aria-label="Close">×</button>

        <p className="slot-modal__day-slot">{day} · {slot}</p>
        <h2 className="slot-modal__title">{existing ? "Edit Slot" : "Add Subject"}</h2>

        <label className="slot-modal__label">Subject</label>
        <input
          autoFocus
          className="slot-modal__input"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="e.g. Physics, DSA, Maths..."
          onKeyDown={e => e.key === "Enter" && subject.trim() && onSave({ subject, color, note })}
        />

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
            Save
          </button>
          {existing && (
            <button className="slot-modal__clear-btn" onClick={onClear}>Clear</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TimetableGrid() {
  const [timetable, setTimetable]     = useState({});
  const [modal, setModal]             = useState(null);
  const [goalsByDay, setGoalsByDay]   = useState({});
  const [todaysGoals, setTodaysGoals] = useState([]);
  const scrollRef = useRef(null);
  const dayRefs   = useRef({});

  useEffect(() => {
    setTimetable(loadFromStorage());
    setGoalsByDay(getGoalsForWeek());
    setTodaysGoals(getGoalsForDate(new Date()));
  }, []);

  function handleSave(day, slot, data) {
    const updated = { ...timetable, [cellKey(day, slot)]: data };
    setTimetable(updated); saveToStorage(updated); setModal(null);
  }
  function handleClear(day, slot) {
    const updated = { ...timetable };
    delete updated[cellKey(day, slot)];
    setTimetable(updated); saveToStorage(updated); setModal(null);
  }

  function scrollToToday() {
    const idx = todayIndex();
    const node = dayRefs.current[DAYS[idx]];
    if (node) node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  const fillPercent = getFillPercent(timetable);
  const todayIdx = todayIndex();

  return (
    <div className="timetable__wrap">
      <div className="timetable__header-bar">
        <button className="timetable__pill-btn" onClick={scrollToToday}>Today</button>
        <span className="timetable__fill-badge">{Math.round(fillPercent)}% filled</span>
      </div>

      {todaysGoals.length > 0 && (
        <div className="timetable__today-goals">
          <span className="timetable__today-goals-label">Today's goals</span>
          <div className="timetable__today-goals-list">
            {todaysGoals.map(g => (
              <span key={g.id} className="timetable__today-goal-chip">
                <span className="timetable__goal-dot" style={{ backgroundColor: g.color }} />
                {g.subject}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="timetable__scroll-hint">Swipe sideways for more days →</p>

      <div className="timetable__scroll" ref={scrollRef}>
        <table className="timetable__table">
          <colgroup>
            <col className="timetable__time-col" />
            {DAYS.map(day => <col key={day} />)}
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: "52px" }} />
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
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(slot => (
              <tr key={slot}>
                <td className="timetable__time-label">{slot}</td>
                {DAYS.map((day, i) => {
                  const key = cellKey(day, slot);
                  const entry = timetable[key];
                  const textColor = entry
                    ? (PRESET_COLORS.find(c => c.value === entry.color)?.text || "#1C1917")
                    : undefined;

                  return (
                    <td
                      key={key}
                      className={`timetable__cell ${entry ? "timetable__cell--filled" : "timetable__cell--empty"}${i === todayIdx ? " timetable__cell--today" : ""}`}
                      style={{ backgroundColor: entry ? entry.color : undefined }}
                      onClick={() => setModal({ day, slot })}
                      title={entry ? `${entry.subject}${entry.note ? " — " + entry.note : ""}` : `Add ${day} ${slot}`}
                    >
                      {entry ? (
                        <span className="timetable__cell-subject" style={{ color: textColor }}>
                          {entry.subject}
                        </span>
                      ) : (
                        <span className="timetable__cell-plus">+</span>
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
          existing={timetable[cellKey(modal.day, modal.slot)] || null}
          onSave={(data) => handleSave(modal.day, modal.slot, data)}
          onClear={() => handleClear(modal.day, modal.slot)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}