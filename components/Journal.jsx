"use client";
import "@/styles/journal.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";

const JOURNAL_KEY = "chintu-journal";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function Journal() {
  const [entries, setEntries] = useState({});
  const [text, setText]       = useState("");
  const today = todayStr();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(JOURNAL_KEY) || "{}");
      setEntries(saved);
      setText(saved[today] || "");
    } catch {}
  }, []);

  function save() {
    const updated = { ...entries, [today]: text };
    setEntries(updated);
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated)); } catch {}
  }

  const pastEntries = Object.entries(entries)
    .filter(([date]) => date !== today)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7);

  return (
    <div className="journal">
      <div className="journal__companion-wrap">
        <Companion mood="thoughtful" />
      </div>
      <textarea
        className="journal__textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What did you do today?"
        rows={6}
      />
      <button className="journal__save-btn" onClick={save}>Save</button>

      {pastEntries.length > 0 && (
        <div className="journal__past">
          <h2 className="journal__past-title">Past entries</h2>
          {pastEntries.map(([date, content]) => (
            <div key={date} className="journal__past-entry">
              <div className="journal__past-date">{date}</div>
              <div className="journal__past-content">{content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}