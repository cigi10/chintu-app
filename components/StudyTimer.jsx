"use client";
// components/StudyTimer.jsx
// Pomodoro-style study timer with:
// - 25min study / 5min break / 15min long break cycles
// - Chintu mood changes based on timer state
// - Coins earned on session completion (saved to localStorage)
// - Animated circular progress ring
// - Session counter tracking

import { useState, useEffect, useRef } from "react";
import Chintu from "@/components/Chintu";
import { recordStudySession } from "@/lib/streakLogic";

// ── Constants ────────────────────────────────────────────────────────────────

const MODES = {
  study:      { label: "Study Time",   duration: 25 * 60, coins: 10, mood: "studying" },
  shortBreak: { label: "Short Break",  duration:  5 * 60, coins:  2, mood: "happy"    },
  longBreak:  { label: "Long Break",   duration: 15 * 60, coins:  5, mood: "sleepy"   },
};

const COIN_KEY    = "chintu-coins";
const SESSION_KEY = "chintu-sessions";

// Radius of the SVG progress circle
const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SESSION_LOG_KEY = "chintu-session-log";


// ── Helpers ──────────────────────────────────────────────────────────────────

function loadCoins() {
  try { return parseInt(localStorage.getItem(COIN_KEY) || "0", 10); }
  catch { return 0; }
}

function saveCoins(n) {
  try { localStorage.setItem(COIN_KEY, String(n)); } catch {}
}

function loadSessions() {
  try { return parseInt(localStorage.getItem(SESSION_KEY) || "0", 10); }
  catch { return 0; }
}

function saveSessions(n) {
  try { localStorage.setItem(SESSION_KEY, String(n)); } catch {}
}

// Format seconds → "MM:SS"
function fmt(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function logSession(modeKey, durationSeconds, coinsEarned) {
  try {
    const raw = localStorage.getItem(SESSION_LOG_KEY);
    const log = raw ? JSON.parse(raw) : [];
    log.push({
      date: new Date().toISOString().slice(0, 10),
      mode: modeKey,
      durationMinutes: Math.round(durationSeconds / 60),
      coinsEarned,
    });
    localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(log));
  } catch {}
}

// ── Coin burst animation component ───────────────────────────────────────────

function CoinBurst({ amount, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200,
    }}>
      <div style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 900, fontSize: "2rem",
        color: "#F97316",
        backgroundColor: "#FEF3C7",
        border: "3px solid #FDE68A",
        borderRadius: "999px",
        padding: "12px 28px",
        animation: "coinpop 1.8s ease-out forwards",
      }}>
        +{amount} 🪙
      </div>
      <style>{`
        @keyframes coinpop {
          0%   { opacity: 0; transform: scale(0.5) translateY(20px); }
          20%  { opacity: 1; transform: scale(1.1) translateY(-10px); }
          60%  { opacity: 1; transform: scale(1)   translateY(-30px); }
          100% { opacity: 0; transform: scale(0.9) translateY(-60px); }
        }
      `}</style>
    </div>
  );
}

// ── Main StudyTimer Component ─────────────────────────────────────────────────

export default function StudyTimer() {
  const [mode, setMode]           = useState("study");
  const [timeLeft, setTimeLeft]   = useState(MODES.study.duration);
  const [running, setRunning]     = useState(false);
  const [sessions, setSessions]   = useState(0);
  const [coins, setCoins]         = useState(0);
  const [burst, setBurst]         = useState(null); // coins to show in burst
  const [done, setDone]           = useState(false); // session just finished

  const intervalRef = useRef(null);

  // Load coins + sessions from localStorage on mount
  useEffect(() => {
    setCoins(loadCoins());
    setSessions(loadSessions());
  }, []);

  // Update page title with timer
  useEffect(() => {
    document.title = running
      ? `${fmt(timeLeft)} — ${MODES[mode].label} | Chintu`
      : "Chintu 🐿️ — Study Timer";
    return () => { document.title = "Chintu 🐿️ — Your Study Companion"; };
  }, [timeLeft, running, mode]);

  // Countdown tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            handleSessionComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  // Called when timer hits 0
  function handleSessionComplete() {
    setRunning(false);
    setDone(true);

    const earned = MODES[mode].coins;
    const newCoins = loadCoins() + earned;
    saveCoins(newCoins);
    setCoins(newCoins);
    setBurst(earned);
    logSession(mode, MODES[mode].duration, earned);

    if (mode === "study") {
      recordStudySession();
      const newSessions = loadSessions() + 1;
      saveSessions(newSessions);
      setSessions(newSessions);
    }
  }

  // Switch between study / short break / long break
  function switchMode(newMode) {
    clearInterval(intervalRef.current);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setRunning(false);
    setDone(false);
  }

  function handleStartPause() {
    if (done) {
      // Reset after completion
      setTimeLeft(MODES[mode].duration);
      setDone(false);
      setRunning(true);
    } else {
      setRunning(r => !r);
    }
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    setTimeLeft(MODES[mode].duration);
    setRunning(false);
    setDone(false);
  }

  // Progress ring calculation
  const progress  = timeLeft / MODES[mode].duration;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  // Ring color per mode
  const ringColor = {
    study:      "#F97316",
    shortBreak: "#22C55E",
    longBreak:  "#8B5CF6",
  }[mode];

  // Chintu mood: done → happy, running study → studying, break → sleepy/happy, idle → waiting
  const chintuMood = done
    ? "happy"
    : running
      ? MODES[mode].mood
      : "waiting";

  return (
    <>
      <style>{`
        .mode-btn { transition: all 0.2s; }
        .mode-btn:hover { background-color: #FEF3C7 !important; }
        .mode-btn.active { background-color: #F97316 !important; color: #fff !important; }
        .timer-action:hover { filter: brightness(0.93); }
        .timer-action:active { transform: scale(0.97); }
      `}</style>

      {/* Coin burst animation */}
      {burst !== null && (
        <CoinBurst amount={burst} onDone={() => setBurst(null)} />
      )}

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1rem 0 6rem",
        fontFamily: "'Nunito', sans-serif",
      }}>

        {/* ── Mode selector tabs ── */}
        <div style={{
          display: "flex", gap: "8px",
          backgroundColor: "#FFFBF5",
          border: "2px solid #FEF3C7",
          borderRadius: "999px",
          padding: "4px",
        }}>
          {Object.entries(MODES).map(([key, val]) => (
            <button
              key={key}
              className={`mode-btn${mode === key ? " active" : ""}`}
              onClick={() => switchMode(key)}
              style={{
                padding: "7px 16px",
                borderRadius: "999px",
                border: "none",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: mode === key ? "#fff" : "#92400E",
                backgroundColor: mode === key ? "#F97316" : "transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* ── Circular timer ring ── */}
        <div style={{ position: "relative", width: "220px", height: "220px" }}>
          <svg
            width="220" height="220"
            style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}
          >
            {/* Track */}
            <circle
              cx="110" cy="110" r={RADIUS}
              fill="none" stroke="#FEF3C7" strokeWidth="10"
            />
            {/* Progress */}
            <circle
              cx="110" cy="110" r={RADIUS}
              fill="none"
              stroke={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.9s ease, stroke 0.4s ease" }}
            />
          </svg>

          {/* Time display centered in ring */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontSize: "2.6rem", fontWeight: 900,
              color: done ? "#22C55E" : "#1C1917",
              letterSpacing: "-1px",
              transition: "color 0.3s",
            }}>
              {done ? "🎉" : fmt(timeLeft)}
            </span>
            {done && (
              <span style={{
                fontSize: "0.75rem", fontWeight: 700,
                color: "#22C55E", marginTop: "2px",
              }}>
                Done!
              </span>
            )}
          </div>
        </div>

        {/* ── Chintu reacting to timer state ── */}
        <div style={{ marginTop: "-8px" }}>
          <Chintu mood={chintuMood} />
        </div>

        {/* ── Chintu's message ── */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700, fontSize: "1rem",
          color: "#92400E",
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "8px 20px",
          margin: 0,
          textAlign: "center",
          maxWidth: "280px",
        }}>
          {done
            ? `Great job! +${MODES[mode].coins} 🪙 coins earned!`
            : running && mode === "study"
              ? "Stay focused, you've got this! 💪"
              : running
                ? "Rest up, you've earned it! ☕"
                : "Press start when you're ready!"}
        </p>

        {/* ── Start / Pause + Reset buttons ── */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="timer-action"
            onClick={handleStartPause}
            style={{
              padding: "14px 40px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: running ? "#FEF3C7" : "#F97316",
              color: running ? "#F97316" : "#FFFFFF",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800, fontSize: "1.05rem",
              cursor: "pointer",
              boxShadow: running ? "none" : "0 4px 16px rgba(249,115,22,0.3)",
              transition: "all 0.2s",
              minWidth: "130px",
            }}
          >
            {done ? "Again?" : running ? "⏸ Pause" : "▶ Start"}
          </button>

          <button
            className="timer-action"
            onClick={handleReset}
            style={{
              padding: "14px 20px",
              borderRadius: "999px",
              border: "2px solid #FEF3C7",
              backgroundColor: "#FFFBF5",
              color: "#92400E",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700, fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            ↺
          </button>
        </div>

        {/* ── Session stats ── */}
        <div style={{
          display: "flex", gap: "16px",
          marginTop: "0.5rem",
        }}>
          {/* Sessions completed */}
          <div style={{
            textAlign: "center",
            backgroundColor: "#FFFBF5",
            border: "2px solid #FEF3C7",
            borderRadius: "14px",
            padding: "10px 20px",
          }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#F97316" }}>
              {sessions}
            </div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#92400E" }}>
              Sessions
            </div>
          </div>

          {/* Total coins */}
          <div style={{
            textAlign: "center",
            backgroundColor: "#FFFBF5",
            border: "2px solid #FEF3C7",
            borderRadius: "14px",
            padding: "10px 20px",
          }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#F97316" }}>
              {coins} 🪙
            </div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#92400E" }}>
              Total Coins
            </div>
          </div>
        </div>

      </div>
    </>
  );
}