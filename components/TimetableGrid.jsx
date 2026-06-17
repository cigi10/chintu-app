"use client";
// components/TimetableGrid.jsx
// Weekly timetable grid with clickable cells, modal editor, localStorage persistence,
// mobile day-scroll, and a mood-aware Chintu in the bottom-right corner.

import { useState, useEffect } from "react";
import Chintu from "@/components/Chintu";

// ── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["5 AM", "7 AM", "9 AM", "11 AM", "1 PM", "3 PM", "6 PM", "9 PM"];
const STORAGE_KEY = "chintu-timetable";

// 6 preset subject colors (soft pastels that look great on cream bg)
const PRESET_COLORS = [
  { label: "Red",    value: "#FECACA", text: "#991B1B" },
  { label: "Blue",   value: "#BFDBFE", text: "#1E40AF" },
  { label: "Green",  value: "#BBF7D0", text: "#166534" },
  { label: "Purple", value: "#E9D5FF", text: "#6B21A8" },
  { label: "Orange", value: "#FED7AA", text: "#9A3412" },
  { label: "Yellow", value: "#FEF08A", text: "#854D0E" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

// Build a unique key for each cell: "Mon-5 AM"
function cellKey(day, slot) {
  return `${day}-${slot}`;
}

// Load timetable from localStorage, return empty object if nothing saved
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Save timetable object to localStorage
function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Calculate fill percentage (filled cells / total cells)
function getFillPercent(timetable) {
  const total = DAYS.length * SLOTS.length; // 56
  const filled = Object.keys(timetable).length;
  return (filled / total) * 100;
}

// Pick Chintu mood based on fill percentage
function getMood(percent) {
  if (percent >= 70) return "happy";
  if (percent >= 30) return "studying";
  return "waiting";
}

// ── Modal Component ──────────────────────────────────────────────────────────

function SlotModal({ day, slot, existing, onSave, onClear, onClose }) {
  const [subject, setSubject] = useState(existing?.subject || "");
  const [color, setColor]     = useState(existing?.color   || PRESET_COLORS[0].value);
  const [note, setNote]       = useState(existing?.note    || "");

  // Close modal when clicking the backdrop
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(28, 25, 23, 0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFBF5",
          borderRadius: "20px",
          padding: "1.75rem",
          width: "100%",
          maxWidth: "360px",
          boxShadow: "0 20px 60px rgba(249,115,22,0.15)",
          border: "2px solid #FEF3C7",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* Modal header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: "#F97316", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {day} · {slot}
            </p>
            <h2 style={{ margin: "2px 0 0", fontSize: "1.1rem", fontWeight: 800, color: "#1C1917" }}>
              {existing ? "Edit Slot" : "Add Subject"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#92400E", lineHeight: 1 }}
          >×</button>
        </div>

        {/* Subject name input */}
        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#92400E", marginBottom: "6px" }}>
          Subject
        </label>
        <input
          autoFocus
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="e.g. Physics, DSA, Maths..."
          style={{
            width: "100%", padding: "10px 14px",
            borderRadius: "10px", border: "2px solid #FEF3C7",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", fontWeight: 600,
            color: "#1C1917", backgroundColor: "#FDF6EC",
            outline: "none", boxSizing: "border-box",
            marginBottom: "1rem",
          }}
          onKeyDown={e => e.key === "Enter" && subject.trim() && onSave({ subject, color, note })}
        />

        {/* Color picker */}
        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#92400E", marginBottom: "8px" }}>
          Color
        </label>
        <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
          {PRESET_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              title={c.label}
              style={{
                width: "32px", height: "32px",
                borderRadius: "50%",
                backgroundColor: c.value,
                border: color === c.value ? `3px solid #F97316` : "3px solid transparent",
                cursor: "pointer",
                outline: "none",
                transition: "transform 0.15s",
                transform: color === c.value ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Optional note */}
        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#92400E", marginBottom: "6px" }}>
          Note <span style={{ fontWeight: 400, color: "#A8A29E" }}>(optional)</span>
        </label>
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Focus on thermodynamics"
          style={{
            width: "100%", padding: "10px 14px",
            borderRadius: "10px", border: "2px solid #FEF3C7",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem", fontWeight: 600,
            color: "#1C1917", backgroundColor: "#FDF6EC",
            outline: "none", boxSizing: "border-box",
            marginBottom: "1.25rem",
          }}
        />

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          {/* Save button */}
          <button
            onClick={() => subject.trim() && onSave({ subject: subject.trim(), color, note })}
            disabled={!subject.trim()}
            style={{
              flex: 1, padding: "10px",
              borderRadius: "12px", border: "none",
              backgroundColor: subject.trim() ? "#F97316" : "#FED7AA",
              color: "#FFFFFF",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "0.95rem",
              cursor: subject.trim() ? "pointer" : "not-allowed",
              transition: "background-color 0.2s",
            }}
          >
            Save ✓
          </button>

          {/* Clear slot — only shown when editing an existing slot */}
          {existing && (
            <button
              onClick={onClear}
              style={{
                padding: "10px 16px",
                borderRadius: "12px", border: "2px solid #FECACA",
                backgroundColor: "#FFF5F5",
                color: "#991B1B",
                fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main TimetableGrid Component ─────────────────────────────────────────────

export default function TimetableGrid() {
  // Full timetable data: { "Mon-5 AM": { subject, color, note }, ... }
  const [timetable, setTimetable] = useState({});

  // Which cell's modal is open: { day, slot } or null
  const [modal, setModal] = useState(null);

  // Mobile: which day index is the first visible (shows 3 days at a time)
  const [dayOffset, setDayOffset] = useState(0);

  // Whether we're on mobile (≤640px) — checked after mount
  const [isMobile, setIsMobile] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    setTimetable(loadFromStorage());
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Which days to show (all 7 on desktop, 3 at a time on mobile)
  const visibleDays = isMobile ? DAYS.slice(dayOffset, dayOffset + 3) : DAYS;

  // Save handler: update state + persist
  function handleSave(day, slot, data) {
    const updated = { ...timetable, [cellKey(day, slot)]: data };
    setTimetable(updated);
    saveToStorage(updated);
    setModal(null);
  }

  // Clear handler: remove cell + persist
  function handleClear(day, slot) {
    const updated = { ...timetable };
    delete updated[cellKey(day, slot)];
    setTimetable(updated);
    saveToStorage(updated);
    setModal(null);
  }

  const fillPercent = getFillPercent(timetable);
  const mood = getMood(fillPercent);

  return (
    <>
      {/* ── Inject CSS for hover effects ── */}
      <style>{`
        .cell-empty:hover { background-color: #FEF3C7 !important; }
        .cell-empty:hover .plus-icon { color: #F97316 !important; }
        .cell-filled:hover { opacity: 0.85; cursor: pointer; }
        .arrow-btn:hover { background-color: #FEF3C7 !important; }
      `}</style>

      {/* ── Mobile day navigation arrows ── */}
      {isMobile && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "0.75rem", padding: "0 0.25rem",
        }}>
          <button
            className="arrow-btn"
            onClick={() => setDayOffset(Math.max(0, dayOffset - 1))}
            disabled={dayOffset === 0}
            style={{
              padding: "6px 14px", borderRadius: "999px",
              border: "2px solid #FEF3C7", backgroundColor: "#FFFBF5",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1rem",
              color: dayOffset === 0 ? "#D1C5BD" : "#F97316",
              cursor: dayOffset === 0 ? "not-allowed" : "pointer",
            }}
          >← </button>

          <span style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 700,
            fontSize: "0.85rem", color: "#92400E",
          }}>
            {DAYS[dayOffset]} – {DAYS[Math.min(dayOffset + 2, 6)]}
          </span>

          <button
            className="arrow-btn"
            onClick={() => setDayOffset(Math.min(DAYS.length - 3, dayOffset + 1))}
            disabled={dayOffset >= DAYS.length - 3}
            style={{
              padding: "6px 14px", borderRadius: "999px",
              border: "2px solid #FEF3C7", backgroundColor: "#FFFBF5",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1rem",
              color: dayOffset >= DAYS.length - 3 ? "#D1C5BD" : "#F97316",
              cursor: dayOffset >= DAYS.length - 3 ? "not-allowed" : "pointer",
            }}
          > →</button>
        </div>
      )}

      {/* ── Grid container ── */}
      <div style={{ overflowX: "auto", borderRadius: "16px" }}>
        <table style={{
          width: "100%", borderCollapse: "separate", borderSpacing: "4px",
          minWidth: isMobile ? "0" : "600px",
        }}>
          <thead>
            <tr>
              {/* Empty corner cell */}
              <th style={{ width: "52px" }} />
              {visibleDays.map(day => (
                <th key={day} style={{
                  fontFamily: "'Nunito', sans-serif", fontWeight: 800,
                  fontSize: "0.8rem", color: "#F97316",
                  textAlign: "center", padding: "6px 4px",
                  letterSpacing: "0.05em",
                }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {SLOTS.map(slot => (
              <tr key={slot}>
                {/* Time label */}
                <td style={{
                  fontFamily: "'Nunito', sans-serif", fontWeight: 700,
                  fontSize: "0.7rem", color: "#A8A29E",
                  textAlign: "right", paddingRight: "8px",
                  whiteSpace: "nowrap", verticalAlign: "middle",
                }}>
                  {slot}
                </td>

                {/* Day cells */}
                {visibleDays.map(day => {
                  const key = cellKey(day, slot);
                  const entry = timetable[key];
                  // Find text color for this cell's bg color
                  const textColor = entry
                    ? (PRESET_COLORS.find(c => c.value === entry.color)?.text || "#1C1917")
                    : "#D1C5BD";

                  return (
                    <td
                      key={key}
                      className={entry ? "cell-filled" : "cell-empty"}
                      onClick={() => setModal({ day, slot })}
                      title={entry ? `${entry.subject}${entry.note ? " — " + entry.note : ""}` : `Add ${day} ${slot}`}
                      style={{
                        backgroundColor: entry ? entry.color : "#FFFBF5",
                        borderRadius: "10px",
                        border: entry ? "none" : "2px dashed #F5E6D3",
                        padding: "6px 4px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        minWidth: isMobile ? "80px" : "0",
                        height: "44px",
                      }}
                    >
                      {entry ? (
                        // Filled cell: show subject name
                        <span style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: 700, fontSize: "0.72rem",
                          color: textColor,
                          display: "block",
                          overflow: "hidden", textOverflow: "ellipsis",
                          whiteSpace: "nowrap", maxWidth: "100%",
                          lineHeight: 1.3,
                        }}>
                          {entry.subject}
                        </span>
                      ) : (
                        // Empty cell: soft "+" icon
                        <span className="plus-icon" style={{
                          fontSize: "1.1rem", color: "#D1C5BD",
                          transition: "color 0.15s",
                          lineHeight: 1,
                        }}>+</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Chintu mood indicator (bottom-right, fixed) ── */}
      <div style={{
        position: "fixed", bottom: "24px", right: "24px",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "4px", zIndex: 10,
      }}>
        {/* Mini fill % badge */}
        <span style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 700,
          fontSize: "0.65rem", color: "#92400E",
          backgroundColor: "#FEF3C7", borderRadius: "999px",
          padding: "2px 8px",
        }}>
          {Math.round(fillPercent)}% filled
        </span>
        {/* Scaled-down Chintu */}
        <div style={{ transform: "scale(0.45)", transformOrigin: "bottom center" }}>
          <Chintu mood={mood} />
        </div>
      </div>

      {/* ── Slot modal ── */}
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