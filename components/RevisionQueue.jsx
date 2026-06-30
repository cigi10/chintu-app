"use client";
import "@/styles/revisions.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";

const REVISION_KEY = "chintu-revisions";
const SUBJECTS_KEY = "chintu-subjects";

// Spaced repetition intervals in days: first at 7, then 14, then 30
const INTERVALS = [7, 14, 30];

function getRevisionSchedule() {
  try { return JSON.parse(localStorage.getItem(REVISION_KEY) || "[]"); } catch { return []; }
}

function saveRevisionSchedule(data) {
  try { localStorage.setItem(REVISION_KEY, JSON.stringify(data)); } catch {}
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Call this when a topic is marked done in the tracker
export function scheduleRevision(subject, topicName) {
  const schedule = getRevisionSchedule();
  const existing = schedule.find(r => r.subject === subject && r.topic === topicName);
  if (existing) return; // already scheduled
  schedule.push({
    id: `${subject}-${topicName}-${Date.now()}`,
    subject,
    topic: topicName,
    dueDate: addDays(todayStr(), INTERVALS[0]),
    intervalIndex: 0,
    completedDates: [],
  });
  saveRevisionSchedule(schedule);
}

export default function RevisionQueue() {
  const [schedule, setSchedule] = useState([]);
  const [today] = useState(todayStr());

  useEffect(() => {
    setSchedule(getRevisionSchedule());
  }, []);

  const due    = schedule.filter(r => r.dueDate <= today);
  const upcoming = schedule.filter(r => r.dueDate > today).sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  function markDone(id) {
    const updated = schedule.map(r => {
      if (r.id !== id) return r;
      const nextIndex = r.intervalIndex + 1;
      if (nextIndex >= INTERVALS.length) {
        // fully revised — remove it
        return null;
      }
      return {
        ...r,
        intervalIndex: nextIndex,
        dueDate: addDays(today, INTERVALS[nextIndex]),
        completedDates: [...r.completedDates, today],
      };
    }).filter(Boolean);
    setSchedule(updated);
    saveRevisionSchedule(updated);
  }

  const mood = due.length === 0 ? "happy" : due.length > 5 ? "worried" : "studying";

  return (
    <div className="revisions">
      <div className="revisions__companion-wrap">
        <Companion mood={mood} />
      </div>

      {due.length === 0 ? (
        <p className="revisions__empty">Nothing due today. You are on top of it.</p>
      ) : (
        <>
          <h2 className="revisions__section-title">Due today — {due.length} topic{due.length > 1 ? "s" : ""}</h2>
          <div className="revisions__list">
            {due.map(r => (
              <div key={r.id} className="revisions__item">
                <div className="revisions__item-info">
                  <span className="revisions__item-subject">{r.subject}</span>
                  <span className="revisions__item-topic">{r.topic}</span>
                </div>
                <button className="revisions__done-btn" onClick={() => markDone(r.id)}>
                  Revised
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <h2 className="revisions__section-title revisions__section-title--upcoming">Coming up</h2>
          <div className="revisions__list revisions__list--muted">
            {upcoming.slice(0, 5).map(r => (
              <div key={r.id} className="revisions__item revisions__item--upcoming">
                <div className="revisions__item-info">
                  <span className="revisions__item-subject">{r.subject}</span>
                  <span className="revisions__item-topic">{r.topic}</span>
                </div>
                <span className="revisions__item-date">{r.dueDate}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}