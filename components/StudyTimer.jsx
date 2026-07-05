"use client";
import "@/styles/timer.css";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Companion from "@/components/Companion";
import Button from "@/components/Button";
import { recordStudySession } from "@/lib/streakLogic";
import { localDateStr } from "@/lib/date";
import { setGoalDone } from "@/lib/goals";

const COIN_KEY        = "chintu-coins";
const SESSION_KEY     = "chintu-sessions";
const SESSION_LOG_KEY = "chintu-session-log";
const BONUS_LOG_KEY   = "chintu-bonus-log";
const RADIUS          = 88;
const CIRCUMFERENCE   = 2 * Math.PI * RADIUS;

const RING_COLORS = {
  study:      "var(--ring-study)",
  shortBreak: "var(--ring-short-break)",
  longBreak:  "var(--ring-long-break)",
  custom:     "var(--ring-study)",
};

function loadCoins()     { try { return parseInt(localStorage.getItem(COIN_KEY) || "0", 10); } catch { return 0; } }
function saveCoins(n)    { try { localStorage.setItem(COIN_KEY, String(n)); } catch {} }
function loadSessions()  { try { return parseInt(localStorage.getItem(SESSION_KEY) || "0", 10); } catch { return 0; } }
function saveSessions(n) { try { localStorage.setItem(SESSION_KEY, String(n)); } catch {} }

function fmt(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function isAfter10pm() { return new Date().getHours() >= 22; }

function logSession(modeKey, durationSeconds, coinsEarned, subject) {
  try {
    const raw = localStorage.getItem(SESSION_LOG_KEY);
    const log = raw ? JSON.parse(raw) : [];
    log.push({
      date: localDateStr(),
      mode: modeKey,
      durationMinutes: Math.round(durationSeconds / 60),
      coinsEarned,
      subject: subject || null,
    });
    localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(log));
  } catch {}
}

function getWeekStartKey() {
  const d = new Date();
  const day = d.getDay();
  const diff = (day === 0 ? 6 : day - 1);
  d.setDate(d.getDate() - diff);
  return localDateStr(d);
}

function getFirstSessionBonuses() {
  const today = localDateStr();
  const weekKey = getWeekStartKey();

  try {
    const raw = localStorage.getItem(BONUS_LOG_KEY);
    const bonusLog = raw ? JSON.parse(raw) : {};

    let dailyBonus = 0;
    let weeklyBonus = 0;

    if (!bonusLog.daily || bonusLog.daily !== today) {
      dailyBonus = 5;
      bonusLog.daily = today;
    }
    if (!bonusLog.weekly || bonusLog.weekly !== weekKey) {
      weeklyBonus = 10;
      bonusLog.weekly = weekKey;
    }

    localStorage.setItem(BONUS_LOG_KEY, JSON.stringify(bonusLog));
    return { dailyBonus, weeklyBonus };
  } catch {
    return { dailyBonus: 5, weeklyBonus: 10 };
  }
}

function CoinBurst({ amount, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="coin-burst-overlay">
      <div className="coin-burst-badge">+{amount} coins</div>
    </div>
  );
}

const PRESET_MODES = {
  study:      { label: "Study",       duration: 25 * 60, mood: "studying"  },
  shortBreak: { label: "Short break", duration:  5 * 60, mood: "happy"     },
  longBreak:  { label: "Long break",  duration: 15 * 60, mood: "sleepy"    },
};

export default function StudyTimer({ roomName = null }) {
  const searchParams     = useSearchParams();
  const roomFromParam    = searchParams?.get("room") || roomName;
  const subjectFromParam = searchParams?.get("subject") || "";
  const durationFromParam = searchParams?.get("duration");
  const goalIdFromParam   = searchParams?.get("goalId") || null;

  const initialDuration = durationFromParam ? Math.max(60, parseInt(durationFromParam, 10) * 60) : PRESET_MODES.study.duration;
  const initialMode = durationFromParam ? "custom" : "study";

  const [mode, setMode]               = useState(initialMode);
  const [timeLeft, setTimeLeft]       = useState(initialDuration);
  const [totalDuration, setTotalDuration] = useState(initialDuration);
  const [running, setRunning]         = useState(false);
  const [sessions, setSessions]       = useState(0);
  const [coins, setCoins]             = useState(0);
  const [burst, setBurst]             = useState(null);
  const [done, setDone]               = useState(false);
  const [lastEarned, setLastEarned]   = useState(0);

  const [showCustom, setShowCustom]   = useState(false);
  const [customMins, setCustomMins]   = useState("45");
  const [customSecs, setCustomSecs]   = useState("00");
  const [subject, setSubject]         = useState(subjectFromParam);

  const intervalRef = useRef(null);

  useEffect(() => { setCoins(loadCoins()); setSessions(loadSessions()); }, []);

  useEffect(() => {
    document.title = running ? `${fmt(timeLeft)} — Chintu` : "Chintu — Timer";
    return () => { document.title = "Chintu"; };
  }, [timeLeft, running]);

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

  function coinsForSession(modeKey, durationSecs) {
    if (modeKey === "shortBreak") return 2;
    if (modeKey === "longBreak")  return 5;
    if (modeKey === "study")      return 10;
    return Math.floor(durationSecs / 180);
  }

  function handleSessionComplete() {
    setRunning(false);
    setDone(true);

    let baseEarned = coinsForSession(mode, totalDuration);
    const { dailyBonus, weeklyBonus } = getFirstSessionBonuses();
    const totalEarned = baseEarned + dailyBonus + weeklyBonus;

    const newCoins = loadCoins() + totalEarned;
    saveCoins(newCoins);
    setCoins(newCoins);
    setBurst(totalEarned);
    setLastEarned(totalEarned);
    logSession(mode, totalDuration, totalEarned, subject);

    if (goalIdFromParam) {
      setGoalDone(goalIdFromParam, localDateStr(), true);
    }

    if (mode === "study" || mode === "custom") {
      recordStudySession();
      const ns = loadSessions() + 1;
      saveSessions(ns);
      setSessions(ns);
    }
  }

  function switchMode(newMode) {
    clearInterval(intervalRef.current);
    const dur = PRESET_MODES[newMode].duration;
    setMode(newMode);
    setTimeLeft(dur);
    setTotalDuration(dur);
    setRunning(false);
    setDone(false);
    setShowCustom(false);
  }

  function applyCustomTime() {
    const m = parseInt(customMins || "0", 10);
    const s = parseInt(customSecs || "0", 10);
    const total = m * 60 + s;
    if (total < 60) return;
    clearInterval(intervalRef.current);
    setMode("custom");
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

  const progress    = totalDuration > 0 ? timeLeft / totalDuration : 0;
  const dashOffset  = CIRCUMFERENCE * (1 - progress);

  function getChintuMood() {
    if (done) return "happy";
    if (isAfter10pm()) return "sleepy";
    if (running) return PRESET_MODES[mode]?.mood || "studying";
    return "waiting";
  }

  const chintuMood = getChintuMood();

  return (
    <>
      {burst !== null && <CoinBurst amount={burst} onDone={() => setBurst(null)} />}

      <div className="timer">
        {roomFromParam && (
          <div className="timer__room-banner">Studying in: {roomFromParam}</div>
        )}

        {goalIdFromParam && subjectFromParam && (
          <div className="timer__goal-banner">
            Goal: {subjectFromParam} · {Math.round(initialDuration / 60)} min
          </div>
        )}

        <div className="timer__mode-bar">
          {Object.entries(PRESET_MODES).map(([key, val]) => (
            <button
              key={key}
              className={`timer__mode-btn${mode === key ? " timer__mode-btn--active" : ""}`}
              onClick={() => switchMode(key)}
            >
              {val.label}
            </button>
          ))}
          <button
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
              min="0"
              max="180"
              value={customMins}
              onChange={e => setCustomMins(e.target.value)}
              placeholder="min"
            />
            <span className="timer__custom-sep">:</span>
            <input
              className="timer__custom-input"
              type="number"
              min="0"
              max="59"
              value={customSecs}
              onChange={e => setCustomSecs(e.target.value)}
              placeholder="sec"
            />
            <button className="timer__custom-set-btn" onClick={applyCustomTime}>Set</button>
          </div>
        )}

        <div className="timer__subject-row">
          <input
            className="timer__subject-input"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="What are you studying? (optional)"
          />
        </div>

        <div className="timer__ring-wrap">
          <svg width="220" height="220" className="timer__svg">
            <circle cx="110" cy="110" r={RADIUS} className="timer__ring-bg" />
            <circle
              cx="110" cy="110" r={RADIUS}
              className="timer__ring-progress"
              stroke={RING_COLORS[mode] || RING_COLORS.study}
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

        <Companion mood={chintuMood} />

        <p className="timer__message">
          {done
            ? `+${lastEarned} coins earned`
            : running && (mode === "study" || mode === "custom")
              ? "Stay focused"
              : running
                ? "Rest up, you earned it"
                : "Press start when ready"}
        </p>

        <div className="timer__btn-row">
          <Button onClick={handleStartPause} variant={running ? "secondary" : "primary"} size="lg">
            {done ? "Again" : running ? "Pause" : "Start"}
          </Button>
          <Button onClick={handleReset} variant="secondary" size="lg">Reset</Button>
        </div>

        <div className="timer__stats-row">
          <div className="timer__stat-card">
            <div className="timer__stat-value">{sessions}</div>
            <div className="timer__stat-label">Sessions</div>
          </div>
          <div className="timer__stat-card">
            <div className="timer__stat-value">{coins}</div>
            <div className="timer__stat-label">Coins</div>
          </div>
        </div>
      </div>
    </>
  );
}