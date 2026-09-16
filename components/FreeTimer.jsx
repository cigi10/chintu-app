"use client";
import "@/styles/timer.css";
import { useState, useEffect, useRef } from "react";
import KeycapButton from "@/components/KeycapButton";

// Standalone Pomodoro-style countdown for the public /timer/free page.
// Deliberately has no account/coins/streak/companion coupling and no
// storage of any kind, local or cloud, unlike components/StudyTimer.jsx
// which the logged-in app uses. Reuses the same drift-resistant countdown
// approach (an end timestamp diffed against Date.now() on each tick,
// rather than decrementing a counter) and the timer.css ring/button
// classes for a consistent look.
const RADIUS = 82;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PRESETS = {
  study: { label: "Study", duration: 25 * 60 },
  shortBreak: { label: "Short break", duration: 5 * 60 },
  longBreak: { label: "Long break", duration: 15 * 60 },
};

const MIN_CUSTOM_MINUTES = 1;
const MAX_CUSTOM_MINUTES = 180;

function fmt(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function FreeTimer() {
  const [mode, setMode] = useState("study");
  const [totalDuration, setTotalDuration] = useState(PRESETS.study.duration);
  const [timeLeft, setTimeLeft] = useState(PRESETS.study.duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customMins, setCustomMins] = useState("45");

  const intervalRef = useRef(null);
  const endAtRef = useRef(null);

  useEffect(() => {
    if (running) {
      endAtRef.current = Date.now() + timeLeft * 1000;
      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
        }
      }, 250);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function switchMode(key) {
    clearInterval(intervalRef.current);
    const dur = PRESETS[key].duration;
    setMode(key);
    setTimeLeft(dur);
    setTotalDuration(dur);
    setRunning(false);
    setDone(false);
    setShowCustom(false);
  }

  function applyCustomTime() {
    const m = Math.max(MIN_CUSTOM_MINUTES, Math.min(MAX_CUSTOM_MINUTES, parseInt(customMins || "0", 10) || 0));
    const total = m * 60;
    clearInterval(intervalRef.current);
    setMode("custom");
    setCustomMins(String(m));
    setTimeLeft(total);
    setTotalDuration(total);
    setRunning(false);
    setDone(false);
    setShowCustom(false);
  }

  function handleStartPause() {
    if (done) {
      setTimeLeft(totalDuration);
      setDone(false);
      setRunning(true);
    } else {
      setRunning(r => !r);
    }
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    setTimeLeft(totalDuration);
    setRunning(false);
    setDone(false);
  }

  const progress = totalDuration > 0 ? timeLeft / totalDuration : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="timer">
      <div className="timer__layout">
        <div className="timer__info-col">
          <div className="timer__mode-bar">
            {Object.entries(PRESETS).map(([key, val]) => (
              <button
                key={key}
                type="button"
                className={`timer__mode-btn${mode === key ? " timer__mode-btn--active" : ""}`}
                onClick={() => switchMode(key)}
              >
                {val.label}
              </button>
            ))}
            <button
              type="button"
              className={`timer__mode-btn${mode === "custom" ? " timer__mode-btn--active" : ""}`}
              onClick={() => setShowCustom(v => !v)}
            >
              Custom
            </button>
          </div>

          {showCustom && (
            <div className="timer__custom-row">
              <input
                className="timer__custom-input"
                type="number"
                min={MIN_CUSTOM_MINUTES}
                max={MAX_CUSTOM_MINUTES}
                value={customMins}
                onChange={e => setCustomMins(e.target.value)}
                placeholder="min"
              />
              <span className="timer__custom-sep">min</span>
              <button type="button" className="timer__custom-set-btn" onClick={applyCustomTime}>
                Set
              </button>
            </div>
          )}

          <div className="timer__ring-wrap">
            <svg width="200" height="200" className="timer__svg">
              <circle cx="100" cy="100" r={RADIUS} className="timer__ring-bg" />
              <circle
                cx="100" cy="100" r={RADIUS}
                className="timer__ring-progress"
                stroke="var(--ring-study)"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="timer__ring-inner">
              <span className={`timer__time${done ? " timer__time--done" : ""}`}>
                {done ? "Done" : fmt(timeLeft)}
              </span>
            </div>
          </div>

          <div className="timer__btn-row">
            <KeycapButton onClick={handleStartPause}>
              {done ? "Again" : running ? "Pause" : "Start"}
            </KeycapButton>
            <KeycapButton onClick={handleReset}>Reset</KeycapButton>
          </div>
        </div>
      </div>
    </div>
  );
}
