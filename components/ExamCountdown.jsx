"use client";
import "@/styles/tools.css";
import { useState, useEffect } from "react";

function getTimeRemaining(targetDate) {
  const total = targetDate - new Date();
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0 };
  return {
    total,
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
  };
}

export default function ExamCountdown({ exam }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!exam.date) return;
    const target = new Date(`${exam.date}T00:00:00`);
    setRemaining(getTimeRemaining(target));
    const id = setInterval(() => setRemaining(getTimeRemaining(target)), 30000);
    return () => clearInterval(id);
  }, [exam.date]);

  if (!exam.date) {
    return (
      <div className="tool-panel">
        <p className="tool-result-meta">
          {`The official ${exam.name} exam date hasn't been announced yet. Check back once it's confirmed.`}
        </p>
      </div>
    );
  }

  if (!remaining) return null;

  if (remaining.total <= 0) {
    return (
      <div className="tool-panel">
        <p className="tool-result-meta">{`${exam.name} has arrived. Good luck!`}</p>
      </div>
    );
  }

  return (
    <div className="tool-panel">
      <div className="countdown-grid">
        <div className="countdown-unit">
          <div className="countdown-value">{remaining.days}</div>
          <div className="countdown-label">Days</div>
        </div>
        <div className="countdown-unit">
          <div className="countdown-value">{remaining.hours}</div>
          <div className="countdown-label">Hours</div>
        </div>
        <div className="countdown-unit">
          <div className="countdown-value">{remaining.minutes}</div>
          <div className="countdown-label">Minutes</div>
        </div>
      </div>
    </div>
  );
}
