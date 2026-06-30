"use client";
import "@/styles/timetable.css";
import { useState, useEffect } from "react";

const DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["5 AM", "7 AM", "9 AM", "11 AM", "1 PM", "3 PM", "6 PM", "9 PM"];
const STORAGE_KEY = "chintu-timetable";

const PRESET_COLORS = [
  { label: "Red",    value: "#FECACA", text: "#991B1B" },
  { label: "Blue",   value: "#BFDBFE", text: "#1E40AF" },
  { label: "Green",  value: "#BBF7D0", text: "#166534" },
  { label: "Purple", value: "#E9D5FF", text: "#6B21A8" },
  { label: "Orange", value: "#FED7AA", text: "#9A3412" },
  { label: "Yellow", value: "#FEF08A", text: "#854D0E" },
];

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
        <div className="slot-modal__header">
          <div>
            <p className="slot-modal__day-slot">{day} · {slot}</p>
            <h2 className="slot-modal__title">{existing ? "Edit Slot" : "Add Subject"}</h2>
          </div>
          <button className="slot-modal__close" onClick={onClose}>Close</button>
        </div>

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
  const [timetable, setTimetable] = useState({});
  const [modal, setModal]         = useState(null);
  const [dayOffset, setDayOffset] = useState(0);
  const [isMobile, setIsMobile]   = useState(false);

  useEffect(() => {
    setTimetable(loadFromStorage());
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visibleDays = isMobile ? DAYS.slice(dayOffset, dayOffset + 3) : DAYS;

  function handleSave(day, slot, data) {
    const updated = { ...timetable, [cellKey(day, slot)]: data };
    setTimetable(updated); saveToStorage(updated); setModal(null);
  }
  function handleClear(day, slot) {
    const updated = { ...timetable };
    delete updated[cellKey(day, slot)];
    setTimetable(updated); saveToStorage(updated); setModal(null);
  }

  const fillPercent = getFillPercent(timetable);

  return (
    <>
      {isMobile && (
        <div className="timetable__nav">
          <button
            className="timetable__nav-btn"
            onClick={() => setDayOffset(Math.max(0, dayOffset - 1))}
            disabled={dayOffset === 0}
          >Prev</button>
          <span className="timetable__nav-range">
            {DAYS[dayOffset]} – {DAYS[Math.min(dayOffset + 2, 6)]}
          </span>
          <button
            className="timetable__nav-btn"
            onClick={() => setDayOffset(Math.min(DAYS.length - 3, dayOffset + 1))}
            disabled={dayOffset >= DAYS.length - 3}
          >Next</button>
        </div>
      )}

      <div className="timetable__scroll">
        <table className="timetable__table" style={{ minWidth: isMobile ? 0 : "600px" }}>
          <thead>
            <tr>
              <th style={{ width: "52px" }} />
              {visibleDays.map(day => (
                <th key={day} className="timetable__th">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(slot => (
              <tr key={slot}>
                <td className="timetable__time-label">{slot}</td>
                {visibleDays.map(day => {
                  const key = cellKey(day, slot);
                  const entry = timetable[key];
                  const textColor = entry
                    ? (PRESET_COLORS.find(c => c.value === entry.color)?.text || "#1C1917")
                    : undefined;

                  return (
                    <td
                      key={key}
                      className={`timetable__cell ${entry ? "timetable__cell--filled" : "timetable__cell--empty"}`}
                      style={{
                        backgroundColor: entry ? entry.color : undefined,
                        minWidth: isMobile ? "80px" : undefined,
                      }}
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

      <div className="timetable__companion-corner">
        <span className="timetable__fill-badge">{Math.round(fillPercent)}% filled</span>
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
    </>
  );
}