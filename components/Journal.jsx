"use client";
import "@/styles/journal.css";
import { useState, useEffect, useMemo, useRef } from "react";
import Companion from "@/components/Companion";

const JOURNAL_KEY = "chintu-journal";

const MOODS = [
  { key: "great", label: "Great", color: "#4F9D6E" },
  { key: "good", label: "Good", color: "#9B6FD4" },
  { key: "okay", label: "Okay", color: "#C77B3F" },
  { key: "rough", label: "Rough", color: "#C0392B" },
  { key: "tired", label: "Tired", color: "#5B4E78" },
];

const PROMPTS = [
  "What's one thing that went better than expected today?",
  "What's been on your mind that you haven't said out loud?",
  "What's something small you're grateful for right now?",
  "What felt hardest today, and how did you handle it?",
  "If tomorrow could go perfectly, what would that look like?",
  "What's a habit you want to build or break?",
  "Who or what made today easier?",
  "What would you tell yourself from this morning?",
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function monthKey(dateStr) {
  return dateStr.slice(0, 7); // "2026-07"
}

function monthLabel(key) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function normalizeEntries(raw) {
  const out = {};
  Object.entries(raw || {}).forEach(([date, val]) => {
    if (typeof val === "string") {
      out[date] = { text: val, mood: null };
    } else if (val && typeof val === "object") {
      out[date] = { text: val.text || "", mood: val.mood || null };
    }
  });
  return out;
}

function loadEntries() {
  try {
    return normalizeEntries(JSON.parse(localStorage.getItem(JOURNAL_KEY) || "{}"));
  } catch {
    return {};
  }
}

export default function Journal() {
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState({ text: "", mood: null });
  const [saveState, setSaveState] = useState("idle");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(new Set());
  const [promptText, setPromptText] = useState(null);
  const saveTimeoutRef = useRef(null);
  const today = todayStr();

  useEffect(() => {
    const saved = loadEntries();
    setEntries(saved);
    const entry = saved[today] || { text: "", mood: null };
    setText(entry.text);
    setMood(entry.mood);
    setSavedSnapshot(entry);
  }, []);

  useEffect(() => () => saveTimeoutRef.current && clearTimeout(saveTimeoutRef.current), []);

  const isDirty = text !== savedSnapshot.text || mood !== savedSnapshot.mood;
  const isToday = selectedDate === today;

  function persist(updated) {
    setEntries(updated);
    try {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
    } catch {}
  }

  function save() {
    const updated = { ...entries };
    if (!text.trim()) {
      delete updated[selectedDate];
    } else {
      updated[selectedDate] = { text, mood };
    }
    persist(updated);
    setSavedSnapshot({ text, mood });
    setSaveState("saved");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => setSaveState("idle"), 2000);
  }

  function selectEntry(date) {
    if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) return;
    setSelectedDate(date);
    const entry = entries[date] || { text: "", mood: null };
    setText(entry.text);
    setMood(entry.mood);
    setSavedSnapshot(entry);
    setSaveState("idle");
    setPromptText(null);
  }

  function deleteEntry(date, e) {
    e.stopPropagation();
    if (!window.confirm(`Delete the entry from ${formatDate(date)}?`)) return;
    const updated = { ...entries };
    delete updated[date];
    persist(updated);
    if (date === selectedDate) {
      const entry = updated[today] || { text: "", mood: null };
      setSelectedDate(today);
      setText(entry.text);
      setMood(entry.mood);
      setSavedSnapshot(entry);
    }
  }

  function toggleExpand(date) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      save();
    }
  }

  function usePrompt() {
    const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPromptText(p);
    if (!text.trim()) setText(p + "\n\n");
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const allDates = Object.keys(entries).sort((a, b) => b.localeCompare(a));

  const totalEntries = allDates.length;
  const totalWords = Object.values(entries).reduce(
    (sum, e) => sum + (e.text.trim() ? e.text.trim().split(/\s+/).length : 0),
    0
  );

  // consecutive-day streak ending today or yesterday
  const streak = useMemo(() => {
    const dateSet = new Set(allDates);
    let count = 0;
    let cursor = new Date();
    if (!dateSet.has(today)) cursor.setDate(cursor.getDate() - 1);
    while (dateSet.has(cursor.toISOString().slice(0, 10))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [allDates.join(","), today]);

  const filteredDates = allDates.filter((date) => {
    if (date === today) return false;
    if (!search.trim()) return true;
    return entries[date].text.toLowerCase().includes(search.toLowerCase());
  });

  const groupedByMonth = useMemo(() => {
    const groups = {};
    filteredDates.forEach((date) => {
      const key = monthKey(date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(date);
    });
    return Object.entries(groups); // already in descending date order per group + insertion order
  }, [filteredDates.join(",")]);

  const companionMood = mood === "rough" ? "sad" : mood === "tired" ? "sleepy" : wordCount > 0 ? "thoughtful" : "idle";

  return (
    <div className="journal">
      <div className="journal__main">
        <div className="journal__sidebar">
          <div className="journal__companion-wrap">
            <Companion mood={companionMood} />
          </div>

          <div className="journal__stat-row">
            <div className="journal__stat-card">
              <div className="journal__stat-value">{streak}</div>
              <div className="journal__stat-label">Day streak</div>
            </div>
            <div className="journal__stat-card">
              <div className="journal__stat-value">{totalEntries}</div>
              <div className="journal__stat-label">Entries</div>
            </div>
          </div>

          <div className="journal__stat-card journal__stat-card--wide">
            <div className="journal__stat-value">{totalWords.toLocaleString()}</div>
            <div className="journal__stat-label">Words written</div>
          </div>

          <button className="journal__prompt-btn" onClick={usePrompt}>
            Give me a prompt
          </button>
          {promptText && <div className="journal__prompt-text">{promptText}</div>}
        </div>

        <div className="journal__content">
          {!isToday && (
            <div className="journal__editing-banner">
              <span>Editing entry from {formatDate(selectedDate)}</span>
              <button className="journal__back-btn" onClick={() => selectEntry(today)}>
                Back to today
              </button>
            </div>
          )}

          <div className="journal__mood-row">
            {MOODS.map((m) => (
              <button
                key={m.key}
                className={`journal__mood-btn ${mood === m.key ? "journal__mood-btn--selected" : ""}`}
                style={{ "--mood-color": m.color }}
                onClick={() => setMood(mood === m.key ? null : m.key)}
                title={m.label}
              >
                <span>{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>

          <textarea
            className="journal__textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What did you do today?"
            rows={8}
          />

          <div className="journal__toolbar">
            <span className="journal__word-count">{wordCount} words</span>
            <div className="journal__toolbar-right">
              {saveState === "saved" && <span className="journal__saved-badge">Saved ✓</span>}
              {isDirty && saveState !== "saved" && <span className="journal__unsaved-badge">Unsaved changes</span>}
              <button className="journal__save-btn" onClick={save} disabled={!isDirty}>
                Save
              </button>
            </div>
          </div>

          <div className="journal__past">
            <div className="journal__past-header">
              <h2 className="journal__past-title">All entries</h2>
              <input
                className="journal__search"
                type="text"
                placeholder="Search entries…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {groupedByMonth.length === 0 ? (
              <div className="journal__empty">
                {search
                  ? "No entries match your search."
                  : "No past entries yet: write about your day above and hit Save."}
              </div>
            ) : (
              groupedByMonth.map(([key, dates]) => (
                <div key={key} className="journal__month-group">
                  <div className="journal__month-label">{monthLabel(key)}</div>
                  {dates.map((date) => {
                    const entry = entries[date];
                    const moodInfo = MOODS.find((m) => m.key === entry.mood);
                    const isOpen = expanded.has(date);
                    const isLong = entry.text.length > 140;
                    return (
                      <div
                        key={date}
                        className={`journal__past-entry ${date === selectedDate ? "journal__past-entry--active" : ""}`}
                      >
                        <div className="journal__past-entry-header">
                          <div className="journal__past-date-row">
                            {moodInfo && <span title={moodInfo.label}>{moodInfo.emoji}</span>}
                            <span className="journal__past-date">{formatDate(date)}</span>
                          </div>
                          <div className="journal__past-actions">
                            <button className="journal__past-edit" onClick={() => selectEntry(date)}>
                              Edit
                            </button>
                            <button
                              className="journal__past-delete"
                              onClick={(e) => deleteEntry(date, e)}
                              aria-label="Delete entry"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <div
                          className={`journal__past-content ${isLong && !isOpen ? "journal__past-content--clamped" : ""}`}
                        >
                          {entry.text}
                        </div>
                        {isLong && (
                          <button className="journal__expand-btn" onClick={() => toggleExpand(date)}>
                            {isOpen ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 