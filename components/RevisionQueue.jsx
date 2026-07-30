"use client";
import "@/styles/revisions.css";
import { useState, useEffect, useMemo } from "react";
import Companion from "@/components/Companion";
import { getSubjectColor } from "@/lib/subjectColors";
import { addCoins } from "@/lib/coins";

const REVISION_KEY = "chintu-revisions";
const SEEN_KEY      = "chintu-revisions-seen";
const MASTERED_KEY  = "chintu-revisions-mastered";
const SUBJECTS_KEY  = "chintu-subjects";

// Suggested spaced-repetition ladder — used only to highlight a recommended
// pill when re-reviewing. The user can always pick a different interval, or
// mark the topic mastered outright, so this is guidance, not a hard rule.
const SUGGESTED_LADDER = [7, 14, 30];

// Interval choices offered both when first adding a topic and when
// re-reviewing one. 0 = same-day.
const REVIEW_OPTIONS = [
  { days: 0,  label: "Today" },
  { days: 3,  label: "3 days" },
  { days: 7,  label: "7 days" },
  { days: 14, label: "14 days" },
  { days: 30, label: "30 days" },
];

const FALLBACK_PALETTE = ["#9B6FD4", "#E8A445", "#4FA8D8", "#5FBF8F", "#E06C8C", "#7C6CE8"];

/* ---------- storage helpers ---------- */

function getRevisionSchedule() {
  try { return JSON.parse(localStorage.getItem(REVISION_KEY) || "[]"); } catch { return []; }
}
function saveRevisionSchedule(data) {
  try { localStorage.setItem(REVISION_KEY, JSON.stringify(data)); } catch {}
}
function getSeen() {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"); } catch { return []; }
}
function markSeen(subject, topic) {
  const seen = getSeen();
  const key = `${subject}::${topic}`;
  if (!seen.includes(key)) {
    seen.push(key);
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch {}
  }
}
function getMasteredCount() {
  try { return parseInt(localStorage.getItem(MASTERED_KEY) || "0", 10); } catch { return 0; }
}
function bumpMasteredCount() {
  try { localStorage.setItem(MASTERED_KEY, String(getMasteredCount() + 1)); } catch {}
}
function loadTrackerSubjects() {
  try { return JSON.parse(localStorage.getItem(SUBJECTS_KEY) || "{}"); } catch { return {}; }
}

/* ---------- date helpers ---------- */

function todayStr() { return new Date().toISOString().slice(0, 10); }
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function daysFromToday(dateStr, today) {
  return Math.round((new Date(dateStr) - new Date(today)) / 86400000);
}
function formatDueLabel(dateStr, today) {
  const diff = daysFromToday(dateStr, today);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7) return `In ${diff} days`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ---------- derived data from the tracker ---------- */

function getDoneTopicsFromTracker() {
  const subjects = loadTrackerSubjects();
  const out = [];
  for (const [subject, topics] of Object.entries(subjects)) {
    for (const t of topics || []) {
      if (t.status === "done") out.push({ subject, topic: t.name });
      for (const s of t.subtopics || []) {
        if (s.status === "done") out.push({ subject, topic: s.name });
      }
    }
  }
  return out;
}

function colorFor(subject) {
  const known = getSubjectColor(subject, null);
  if (known) return known;
  let hash = 0;
  for (let i = 0; i < subject.length; i++) hash = (hash * 31 + subject.charCodeAt(i)) >>> 0;
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}

/* ---------- schedule mutation ---------- */

function addToSchedule(schedule, subject, topic, daysUntilFirstReview = 7) {
  const exists = schedule.some(r => r.subject === subject && r.topic === topic);
  if (exists) return schedule;
  markSeen(subject, topic);
  return [
    ...schedule,
    {
      id: `${subject}-${topic}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      subject,
      topic,
      dueDate: addDays(todayStr(), daysUntilFirstReview),
      reviewCount: 0,
      completedDates: [],
    },
  ];
}

// Exported so it can be called elsewhere (e.g. from the Tracker, right when a
// topic is marked "done") to auto-queue it for revision. Not required for
// this page to work — it also finds done topics on its own as suggestions.
export function scheduleRevision(subject, topic) {
  const updated = addToSchedule(getRevisionSchedule(), subject, topic);
  saveRevisionSchedule(updated);
}

/* ---------- component ---------- */

export default function RevisionQueue() {
  const [schedule, setSchedule]   = useState([]);
  const [seen, setSeen]           = useState([]);
  const [mastered, setMastered]   = useState(0);
  const [trackerDone, setTrackerDone] = useState([]);
  const [today] = useState(todayStr());

  const [subjectInput, setSubjectInput] = useState("");
  const [topicInput, setTopicInput]     = useState("");
  const [intervalChoice, setIntervalChoice] = useState(7);

  // id of the item whose "pick next interval" row is currently expanded
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    setSchedule(getRevisionSchedule());
    setSeen(getSeen());
    setMastered(getMasteredCount());
    setTrackerDone(getDoneTopicsFromTracker());
  }, []);

  function persist(updated) {
    setSchedule(updated);
    saveRevisionSchedule(updated);
  }

  const due      = schedule.filter(r => r.dueDate <= today);
  const upcoming = schedule.filter(r => r.dueDate > today).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const dueThisWeek = schedule.filter(r => daysFromToday(r.dueDate, today) <= 7).length;

  // Subjects seen in the Tracker as "done". Derived from trackerDone (state,
  // starts empty on both server & client, populated only in useEffect) — not
  // read directly from localStorage during render, which would cause a
  // hydration mismatch.
  const trackerSubjects = useMemo(
    () => [...new Set(trackerDone.map(d => d.subject))],
    [trackerDone]
  );

  // Chips should reflect every subject you've ever used here, not just the
  // ones from the Tracker — otherwise custom subjects you type in never show
  // up as quick-pick chips later.
  const chipSubjects = useMemo(() => {
    const set = new Set(trackerSubjects);
    schedule.forEach(r => set.add(r.subject));
    return [...set];
  }, [trackerSubjects, schedule]);

  const suggestions = useMemo(() => {
    return trackerDone.filter(d => {
      const key = `${d.subject}::${d.topic}`;
      const inSchedule = schedule.some(r => r.subject === d.subject && r.topic === d.topic);
      return !inSchedule && !seen.includes(key);
    });
  }, [trackerDone, schedule, seen]);

  function addSuggestion(subject, topic) {
    const updated = addToSchedule(schedule, subject, topic);
    persist(updated);
    setSeen(getSeen());
  }

  function addAllSuggestions() {
    let updated = schedule;
    for (const s of suggestions) updated = addToSchedule(updated, s.subject, s.topic);
    persist(updated);
    setSeen(getSeen());
  }

  // User picks the next interval themselves. The "recommended" pill (shown
  // via isRecommended below) just follows the suggested ladder based on how
  // many times this topic has been reviewed already — it's a hint, not a rule.
  function applyReview(id, days) {
    const updated = schedule.map(r =>
      r.id === id
        ? {
            ...r,
            dueDate: addDays(today, days),
            reviewCount: (r.reviewCount || 0) + 1,
            completedDates: [...r.completedDates, today],
          }
        : r
    );
    persist(updated);
    addCoins(3);
    setReviewingId(null);
  }

  // Explicit, user-driven mastery — click whenever you feel confident on a
  // topic, regardless of how many times it's been reviewed.
  function markMastered(id) {
    persist(schedule.filter(r => r.id !== id));
    bumpMasteredCount();
    setMastered(getMasteredCount());
    addCoins(15);
    setReviewingId(null);
  }

  function snooze(id, days = 2) {
    const updated = schedule.map(r => r.id === id ? { ...r, dueDate: addDays(r.dueDate, days) } : r);
    persist(updated);
  }

  function removeItem(id) {
    persist(schedule.filter(r => r.id !== id));
    setReviewingId(null);
  }

  function handleManualAdd() {
    const subject = subjectInput.trim();
    const topic = topicInput.trim();
    if (!subject || !topic) return;
    const updated = addToSchedule(schedule, subject, topic, intervalChoice);
    persist(updated);
    setSeen(getSeen());
    setTopicInput("");
  }

  const mood = due.length === 0 ? "happy" : due.length > 5 ? "worried" : "studying";
  const statusMsg =
    due.length === 0
      ? "Nothing due today :) you're on top of it."
      : due.length === 1
      ? "One topic due today."
      : `${due.length} topics due today.`;

  return (
    <div className="revisions">
      <div className="revisions__header">
        <div>
          <h1 className="revisions__title">Revision Queue</h1>
          <p className="revisions__subtitle">Spaced review for what you've already learned</p>
        </div>
        <div className="revisions__companion-mini">
          <div className="revisions__companion-img">
            <Companion mood={mood} />
          </div>
          <p className="revisions__companion-msg">{statusMsg}</p>
        </div>
      </div>

      <div className="revisions__stats-row">
        <div className="revisions__stat-card">
          <span className="revisions__stat-value">{due.length}</span>
          <span className="revisions__stat-label">Due today</span>
        </div>
        <div className="revisions__stat-card">
          <span className="revisions__stat-value">{dueThisWeek}</span>
          <span className="revisions__stat-label">Due this week</span>
        </div>
        <div className="revisions__stat-card">
          <span className="revisions__stat-value">{mastered}</span>
          <span className="revisions__stat-label">Mastered</span>
        </div>
      </div>

      <div className="revisions__columns">
        <div className="revisions__main-col">
          {suggestions.length > 0 && (
            <div className="revisions__section">
              <div className="revisions__section-header">
                <h2 className="revisions__section-title">From your tracker</h2>
                <button className="revisions__add-all-btn" onClick={addAllSuggestions}>Add all</button>
              </div>
              <p className="revisions__section-hint">
                Marked done in your Tracker, not yet queued for revision.
              </p>
              <div className="revisions__list">
                {suggestions.map(s => (
                  <div key={`${s.subject}-${s.topic}`} className="revisions__item revisions__item--suggestion">
                    <span className="revisions__dot" style={{ backgroundColor: colorFor(s.subject) }} />
                    <div className="revisions__item-info">
                      <span className="revisions__item-subject">{s.subject}</span>
                      <span className="revisions__item-topic">{s.topic}</span>
                    </div>
                    <button className="revisions__suggest-btn" onClick={() => addSuggestion(s.subject, s.topic)}>
                      Add to revisions
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="revisions__section">
            <h2 className="revisions__section-title">Due today</h2>
            {due.length === 0 ? (
              <p className="revisions__empty">
                Nothing due today. Mark a topic done in your Tracker or add one yourself to build your queue.
              </p>
            ) : (
              <div className="revisions__list">
                {due.map(r => {
                  const reviewCount = r.reviewCount || 0;
                  const recommendedDays = SUGGESTED_LADDER[Math.min(reviewCount, SUGGESTED_LADDER.length - 1)];
                  const isReviewing = reviewingId === r.id;
                  return (
                    <div key={r.id} className="revisions__item revisions__item--stacked">
                      <div className="revisions__item-row">
                        <span className="revisions__dot" style={{ backgroundColor: colorFor(r.subject) }} />
                        <div className="revisions__item-info">
                          <span className="revisions__item-subject">{r.subject}</span>
                          <span className="revisions__item-topic">{r.topic}</span>
                          <span className="revisions__item-round">
                            {reviewCount === 0 ? "First review" : `Review #${reviewCount + 1}`}
                          </span>
                        </div>
                        <div className="revisions__item-actions">
                          <button className="revisions__snooze-btn" onClick={() => snooze(r.id)} title="Push back 2 days">
                            Snooze
                          </button>
                          <button
                            className="revisions__done-btn"
                            onClick={() => setReviewingId(isReviewing ? null : r.id)}
                          >
                            Revised {isReviewing ? "▴" : "▾"}
                          </button>
                          <button className="revisions__mastered-btn" onClick={() => markMastered(r.id)}>
                            Mastered
                          </button>
                          <button className="revisions__remove-btn" onClick={() => removeItem(r.id)} title="Remove from queue">
                            ×
                          </button>
                        </div>
                      </div>

                      {isReviewing && (
                        <div className="revisions__review-options">
                          <span className="revisions__review-options-label">Next review:</span>
                          {REVIEW_OPTIONS.map(opt => (
                            <button
                              key={opt.days}
                              className={`revisions__review-pill${opt.days === recommendedDays ? " revisions__review-pill--recommended" : ""}`}
                              onClick={() => applyReview(r.id, opt.days)}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="revisions__side-col">
          <div className="revisions__section">
            <h2 className="revisions__section-title">Add your own</h2>
            {chipSubjects.length > 0 && (
              <div className="revisions__chip-row">
                {chipSubjects.map(s => (
                  <button key={s} className="revisions__chip" onClick={() => setSubjectInput(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <input
              className="revisions__input"
              value={subjectInput}
              onChange={e => setSubjectInput(e.target.value)}
              placeholder="Subject (e.g. Physics)"
            />
            <input
              className="revisions__input"
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleManualAdd()}
              placeholder="Topic to revise"
            />
            <div className="revisions__form-label">First review in</div>
            <div className="revisions__chip-row">
              {REVIEW_OPTIONS.filter(o => o.days !== 30).map(opt => (
                <button
                  key={opt.days}
                  className={`revisions__chip revisions__chip--interval${intervalChoice === opt.days ? " revisions__chip--active" : ""}`}
                  onClick={() => setIntervalChoice(opt.days)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              className="revisions__add-btn"
              disabled={!subjectInput.trim() || !topicInput.trim()}
              onClick={handleManualAdd}
            >
              Add to queue
            </button>
          </div>

          {upcoming.length > 0 && (
            <div className="revisions__section">
              <h2 className="revisions__section-title">Coming up</h2>
              <div className="revisions__list revisions__list--muted">
                {upcoming.slice(0, 8).map(r => (
                  <div key={r.id} className="revisions__item revisions__item--upcoming">
                    <span className="revisions__dot" style={{ backgroundColor: colorFor(r.subject) }} />
                    <div className="revisions__item-info">
                      <span className="revisions__item-subject">{r.subject}</span>
                      <span className="revisions__item-topic">{r.topic}</span>
                    </div>
                    <span className="revisions__item-date">{formatDueLabel(r.dueDate, today)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}