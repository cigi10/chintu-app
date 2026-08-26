"use client";
import "@/styles/timer.css";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Companion from "@/components/Companion";
import KeycapButton from "@/components/KeycapButton";
import { recordStudySession } from "@/lib/streakLogic";
import { localDateStr } from "@/lib/date";
import { setGoalDone } from "@/lib/goals";
import { getLocalCoins, hydrateCoins, addCoins } from "@/lib/coins";
import { getLocalTodos, hydrateTodos, saveTodos as persistTodos } from "@/lib/todos";
import { hydrateTracker, getSessionLog, appendSessionLogEntry, getBonusLog, saveBonusLog } from "@/lib/tracker";

const SESSION_KEY       = "chintu-sessions";
const TIMER_STATE_KEY   = "chintu-timer-state";
const AUTOCYCLE_KEY     = "chintu-autocycle";
const AUTOCYCLE_COUNT_KEY = "chintu-autocycle-count";
const SOUND_PREF_KEY    = "chintu-sound-pref";
const RADIUS            = 82;
const CIRCUMFERENCE     = 2 * Math.PI * RADIUS;
const MIN_EARLY_FINISH_SECONDS = 60;

const LONG_BREAK_TARGET_MINUTES = 100;

const RING_COLORS = {
  study:      "var(--ring-study)",
  shortBreak: "var(--ring-short-break)",
  longBreak:  "var(--ring-long-break)",
  custom:     "var(--ring-study)",
};

const SOUND_TYPES = [
  { key: "white", label: "White" },
  { key: "brown", label: "Brown" },
  { key: "rain",  label: "Rain"  },
];

const PRIORITY_DOT = { high: "#F2619C", medium: "#F9C060", low: "#7EC8A0" };

function todaysTasks(todos) {
  const today = localDateStr();
  return todos.filter(t => !t.done && (!t.due || t.due <= today));
}

function loadSessions()  { try { return parseInt(localStorage.getItem(SESSION_KEY) || "0", 10); } catch { return 0; } }
function saveSessions(n) { try { localStorage.setItem(SESSION_KEY, String(n)); } catch {} }

function saveTimerState(state) { try { localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state)); } catch {} }
function loadTimerState()      { try { const raw = localStorage.getItem(TIMER_STATE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
function clearTimerState()     { try { localStorage.removeItem(TIMER_STATE_KEY); } catch {} }

function loadAutoCycle()      { try { return localStorage.getItem(AUTOCYCLE_KEY) === "1"; } catch { return false; } }
function saveAutoCycle(v)     { try { localStorage.setItem(AUTOCYCLE_KEY, v ? "1" : "0"); } catch {} }
function loadAutoCycleCount() { try { return parseInt(localStorage.getItem(AUTOCYCLE_COUNT_KEY) || "0", 10); } catch { return 0; } }
function saveAutoCycleCount(n){ try { localStorage.setItem(AUTOCYCLE_COUNT_KEY, String(n)); } catch {} }

function loadSoundPref() {
  try {
    const raw = localStorage.getItem(SOUND_PREF_KEY);
    return raw ? JSON.parse(raw) : { on: false, type: "white" };
  } catch { return { on: false, type: "white" }; }
}
function saveSoundPref(pref) { try { localStorage.setItem(SOUND_PREF_KEY, JSON.stringify(pref)); } catch {} }

function loadHistory() {
  return getSessionLog().slice(-6).reverse();
}

function fmt(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function fmtHistoryDuration(mins) {
  if (mins < 1) return "<1 min";
  return `${mins} min`;
}

function isAfter10pm() { return new Date().getHours() >= 24; }

// Idle expressions cycled through while actively studying, so Chintu isn't
// frozen in one static pose for the whole session — reuses existing mood
// art (no new assets), just swapping frames like a sprite animation rather
// than a single fixed "studying" image. Uses the book-less pose as the base
// frame and layers the "book" accessory on top of all of them (same way
// bowtie/glasses/etc. layer over any mood in Companion.jsx), so the book
// stays put across every frame instead of popping in/out with the pose.
const STUDY_IDLE_POSES = ["studying_wo_book", "thoughtful", "curious", "determined"];
const STUDY_IDLE_FRAME_MS = 1000;

function logSession(modeKey, durationSeconds, coinsEarned, subject) {
  appendSessionLogEntry({
    date: localDateStr(),
    mode: modeKey,
    durationMinutes: Math.round(durationSeconds / 60),
    coinsEarned,
    subject: subject || null,
  });
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

  const bonusLog = getBonusLog();
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

  saveBonusLog(bonusLog);
  return { dailyBonus, weeklyBonus };
}

function roundTo5(n) { return Math.max(5, Math.round(n / 5) * 5); }
function computeBreakMinutes(studyMinutes) {
  const short = roundTo5(studyMinutes * 0.2);
  const long  = roundTo5(studyMinutes * 0.6);
  return { short, long };
}
function computeLongBreakEvery(studyMinutes) {
  return Math.max(2, Math.min(4, Math.round(LONG_BREAK_TARGET_MINUTES / studyMinutes)));
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

const MIN_CUSTOM_SECONDS = 5;
const AUTO_CYCLE_DELAY_MS = 1500;

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
  const [hydrated, setHydrated]       = useState(false);

  const [showCustom, setShowCustom]   = useState(!!durationFromParam);
  const [customMins, setCustomMins]   = useState(durationFromParam ? durationFromParam : "45");
  const [customSecs, setCustomSecs]   = useState("00");
  const [subject, setSubject]         = useState(subjectFromParam);

  const [autoCycle, setAutoCycle]     = useState(false);
  const [soundOn, setSoundOn]         = useState(false);
  const [soundType, setSoundType]     = useState("white");
  const [history, setHistory]         = useState([]);
  const [tasks, setTasks]             = useState([]);
  const [idlePoseIndex, setIdlePoseIndex] = useState(0);

  const intervalRef      = useRef(null);
  const endAtRef          = useRef(null);
  const subjectRef        = useRef(subject);
  const autoCycleRef      = useRef(false);
  const autoCycleCountRef = useRef(0);
  const lastStudyModeRef     = useRef("study");
  const lastStudyDurationRef = useRef(PRESET_MODES.study.duration);
  const audioCtxRef       = useRef(null);
  const noiseNodesRef     = useRef(null);

  useEffect(() => { subjectRef.current = subject; }, [subject]);
  useEffect(() => { autoCycleRef.current = autoCycle; }, [autoCycle]);

  useEffect(() => {
    hydrateCoins().then(setCoins);
    setSessions(loadSessions());
    hydrateTracker().then(() => setHistory(loadHistory()));
    hydrateTodos().then(todos => setTasks(todaysTasks(todos)));
    setAutoCycle(loadAutoCycle());
    autoCycleCountRef.current = loadAutoCycleCount();
    const pref = loadSoundPref();
    setSoundOn(false);
    setSoundType(pref.type || "white");
  }, []);

  useEffect(() => {
    document.title = running ? `${fmt(timeLeft)}: Chintu` : "Chintu: Timer";
    return () => { document.title = "Chintu"; };
  }, [timeLeft, running]);

  useEffect(() => {
    const saved = loadTimerState();
    if (saved) {
      const savedGoalId = goalIdFromParam || saved.goalId || null;
      if (saved.running && saved.endAt) {
        const remaining = Math.max(0, Math.round((saved.endAt - Date.now()) / 1000));
        setMode(saved.mode);
        setTotalDuration(saved.totalDuration);
        setSubject(subjectFromParam || saved.subject || "");
        if (remaining <= 0) {
          completeSession(saved.mode, saved.totalDuration, subjectFromParam || saved.subject || "", savedGoalId);
        } else {
          setTimeLeft(remaining);
          setRunning(true);
        }
      } else if (typeof saved.timeLeft === "number") {
        setMode(saved.mode);
        setTotalDuration(saved.totalDuration);
        setTimeLeft(saved.timeLeft);
        setSubject(subjectFromParam || saved.subject || "");
        setRunning(false);
      }
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (running) {
      endAtRef.current = Date.now() + timeLeft * 1000;
      saveTimerState({
        mode, totalDuration, subject: subjectRef.current,
        goalId: goalIdFromParam, running: true, endAt: endAtRef.current,
      });

      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          completeSession(mode, totalDuration, subjectRef.current, goalIdFromParam);
        }
      }, 250);
    } else {
      clearInterval(intervalRef.current);
      if (!done) {
        saveTimerState({
          mode, totalDuration, subject: subjectRef.current,
          goalId: goalIdFromParam, running: false, timeLeft,
        });
      } else {
        clearTimerState();
      }
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, hydrated]);

  // Watches for the URL params actually changing (e.g. clicking a different
  // "Study" button while already on this page) — Next.js doesn't remount
  // the component for a same-route navigation, so without this the mount-only
  // logic above never re-runs and the old subject/duration sticks around.
  const prevParamsRef = useRef({ subject: subjectFromParam, duration: durationFromParam, goalId: goalIdFromParam });
  useEffect(() => {
    if (!hydrated) return;
    const prev = prevParamsRef.current;
    const changed = prev.subject !== subjectFromParam || prev.duration !== durationFromParam || prev.goalId !== goalIdFromParam;
    prevParamsRef.current = { subject: subjectFromParam, duration: durationFromParam, goalId: goalIdFromParam };
    if (!changed || !subjectFromParam) return;

    clearInterval(intervalRef.current);
    clearTimerState();
    const newDuration = durationFromParam ? Math.max(60, parseInt(durationFromParam, 10) * 60) : PRESET_MODES.study.duration;
    const newMode = durationFromParam ? "custom" : "study";
    setMode(newMode);
    setTimeLeft(newDuration);
    setTotalDuration(newDuration);
    setSubject(subjectFromParam);
    setRunning(false);
    setDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectFromParam, durationFromParam, goalIdFromParam, hydrated]);

  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        handleStartPause();
      } else if (e.key.toLowerCase() === "r") {
        handleReset();
      } else if (e.key === "1") {
        switchMode("study");
      } else if (e.key === "2") {
        switchMode("shortBreak");
      } else if (e.key === "3") {
        switchMode("longBreak");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, done, totalDuration, mode]);

  useEffect(() => () => stopSound(), []);

  // Cycle the companion's expression once per second while actively
  // studying (running, in study/custom mode, not done) — a simple
  // frame-swap through STUDY_IDLE_POSES rather than a smooth transition.
  useEffect(() => {
    const isActivelyStudying = running && !done && (mode === "study" || mode === "custom");
    if (!isActivelyStudying) {
      setIdlePoseIndex(0);
      return;
    }
    const id = setInterval(() => {
      setIdlePoseIndex(i => (i + 1) % STUDY_IDLE_POSES.length);
    }, STUDY_IDLE_FRAME_MS);
    return () => clearInterval(id);
  }, [running, done, mode]);

  function coinsForSession(modeKey, durationSecs) {
    if (modeKey === "shortBreak") return 2;
    if (modeKey === "longBreak")  return 5;
    if (modeKey === "study")      return 10;
    return Math.floor(durationSecs / 180);
  }

  function coinsForEarlyFinish(durationSecs) {
    return Math.max(1, Math.floor(durationSecs / 180));
  }

  function completeSession(modeKey, durationSecs, subj, goalId, isEarly = false) {
    setRunning(false);
    setDone(true);
    setTimeLeft(0);

    const isStudyType = modeKey === "study" || modeKey === "custom";
    if (isStudyType) {
      lastStudyModeRef.current = modeKey;
      lastStudyDurationRef.current = durationSecs;
    }

    let baseEarned = isEarly ? coinsForEarlyFinish(durationSecs) : coinsForSession(modeKey, durationSecs);
    const { dailyBonus, weeklyBonus } = getFirstSessionBonuses();
    const totalEarned = baseEarned + dailyBonus + weeklyBonus;

    const newCoins = getLocalCoins() + totalEarned;
    addCoins(totalEarned);
    setCoins(newCoins);
    setBurst(totalEarned);
    setLastEarned(totalEarned);
    logSession(modeKey, durationSecs, totalEarned, subj);
    setHistory(loadHistory());

    if (goalId) {
      setGoalDone(goalId, localDateStr(), true);
    }

    if (isStudyType) {
      recordStudySession();
      const ns = loadSessions() + 1;
      saveSessions(ns);
      setSessions(ns);
    }

    clearTimerState();

    if (!isEarly && autoCycleRef.current) {
      let nextMode;
      let nextDurationSec;

      if (isStudyType) {
        const studyMinutes = Math.max(1, Math.round(durationSecs / 60));
        const { short, long } = computeBreakMinutes(studyMinutes);
        const longBreakEvery = computeLongBreakEvery(studyMinutes);

        const newCount = autoCycleCountRef.current + 1;
        autoCycleCountRef.current = newCount;
        saveAutoCycleCount(newCount);

        const isLongBreak = newCount % longBreakEvery === 0;
        nextMode = isLongBreak ? "longBreak" : "shortBreak";
        nextDurationSec = (isLongBreak ? long : short) * 60;
      } else {
        nextMode = lastStudyModeRef.current;
        nextDurationSec = lastStudyDurationRef.current;
      }

      setTimeout(() => startModeAuto(nextMode, nextDurationSec), AUTO_CYCLE_DELAY_MS);
    }
  }

  function handleFinishEarly() {
    const elapsed = totalDuration - timeLeft;
    clearInterval(intervalRef.current);
    if (elapsed < MIN_EARLY_FINISH_SECONDS) {
      setRunning(false);
      setTimeLeft(totalDuration);
      setDone(false);
      clearTimerState();
      return;
    }
    completeSession(mode, elapsed, subjectRef.current, goalIdFromParam, true);
  }

  function startModeAuto(newMode, durationSecOverride) {
    clearTimerState();
    const dur = durationSecOverride != null ? durationSecOverride : PRESET_MODES[newMode].duration;
    setMode(newMode);
    setTimeLeft(dur);
    setTotalDuration(dur);
    setDone(false);
    setRunning(true);
  }

  function switchMode(newMode) {
    clearInterval(intervalRef.current);
    clearTimerState();
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
    if (total < MIN_CUSTOM_SECONDS) return;
    clearInterval(intervalRef.current);
    clearTimerState();
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

  function completeTask(taskId) {
    const all = getLocalTodos();
    const updated = all.map(t => t.id === taskId ? { ...t, done: true } : t);
    persistTodos(updated);
    setTasks(todaysTasks(updated));
    const newCoins = getLocalCoins() + 2;
    addCoins(2);
    setCoins(newCoins);
  }

  function toggleAutoCycle() {
    const next = !autoCycle;
    setAutoCycle(next);
    saveAutoCycle(next);
    if (next) {
      autoCycleCountRef.current = 0;
      saveAutoCycleCount(0);
    }
  }

  function stopSound() {
    if (noiseNodesRef.current) {
      try { noiseNodesRef.current.source.stop(); } catch {}
      try { noiseNodesRef.current.source.disconnect(); } catch {}
      try { noiseNodesRef.current.gain.disconnect(); } catch {}
      if (noiseNodesRef.current.filter) {
        try { noiseNodesRef.current.filter.disconnect(); } catch {}
      }
      noiseNodesRef.current = null;
    }
  }

  function startSound(type) {
    stopSound();
    try {
      if (!audioCtxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === "brown") {
        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 3.5;
        }
      } else {
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.05;

      let filter = null;
      if (type === "rain") {
        filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 3200;
        filter.Q.value = 0.5;
        source.connect(filter);
        filter.connect(gain);
      } else {
        source.connect(gain);
      }
      gain.connect(ctx.destination);
      source.start();

      noiseNodesRef.current = { source, filter, gain };
    } catch {}
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    saveSoundPref({ on: next, type: soundType });
    if (next) startSound(soundType); else stopSound();
  }

  function changeSoundType(type) {
    setSoundType(type);
    saveSoundPref({ on: soundOn, type });
    if (soundOn) startSound(type);
  }

  const progress    = totalDuration > 0 ? timeLeft / totalDuration : 0;
  const dashOffset  = CIRCUMFERENCE * (1 - progress);

  function getChintuMood() {
    if (done) return "happy";
    if (isAfter10pm()) return "sleepy";
    if (running) {
      if (mode === "study" || mode === "custom") return STUDY_IDLE_POSES[idlePoseIndex];
      return PRESET_MODES[mode]?.mood || "studying";
    }
    return "waiting";
  }

  const chintuMood = getChintuMood();
  const isActivelyStudying = running && !done && (mode === "study" || mode === "custom");
  const hasProgress = !done && timeLeft < totalDuration;

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

        <div className="timer__layout">
          <div className="timer__companion-col">
            <Companion mood={chintuMood} extraAccessories={isActivelyStudying ? ["book"] : []} />
            <p className="timer__message">
              {done
                ? `+${lastEarned} coins earned`
                : running && (mode === "study" || mode === "custom")
                  ? "Stay focused"
                  : running
                    ? "Rest up, you earned it"
                    : "Press start when ready"}
            </p>
          </div>

          <div className="timer__info-col">
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
                <button className="timer__custom-set-btn" onClick={applyCustomTime}>
                  Set
                </button>
              </div>
            )}

            <div className="timer__toggles-row">
              <button
                className={`timer__toggle-chip${autoCycle ? " timer__toggle-chip--active" : ""}`}
                onClick={toggleAutoCycle}
                title="Automatically move from study to break and back, with break length matched to your study duration"
              >
                Auto-cycle
              </button>
              <button
                className={`timer__toggle-chip${soundOn ? " timer__toggle-chip--active" : ""}`}
                onClick={toggleSound}
                title="Play a focus sound while you work"
              >
                Focus sound
              </button>
            </div>

            {soundOn && (
              <div className="timer__sound-types">
                {SOUND_TYPES.map(t => (
                  <button
                    key={t.key}
                    className={`timer__sound-type-btn${soundType === t.key ? " timer__sound-type-btn--active" : ""}`}
                    onClick={() => changeSoundType(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
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
              <svg width="200" height="200" className="timer__svg">
                <circle cx="100" cy="100" r={RADIUS} className="timer__ring-bg" />
                <circle
                  cx="100" cy="100" r={RADIUS}
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

            <div className="timer__btn-row">
              <KeycapButton onClick={handleStartPause}>
                {done ? "Again" : running ? "Pause" : "Start"}
              </KeycapButton>
              {hasProgress && (
                <KeycapButton onClick={handleFinishEarly}>Finish</KeycapButton>
              )}
              <KeycapButton onClick={handleReset}>Reset</KeycapButton>
            </div>

            <p className="timer__kbd-hint">
              <kbd>Space</kbd> start/pause · <kbd>R</kbd> reset · <kbd>1</kbd>/<kbd>2</kbd>/<kbd>3</kbd> modes
            </p>

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
        </div>

        {tasks.length > 0 && (
          <div className="timer__todo-panel">
            <div className="timer__history-title">Today's tasks</div>
            <div className="timer__todo-list">
              {tasks.map(t => (
                <button key={t.id} className="timer__todo-chip" onClick={() => completeTask(t.id)} title="Mark as done">
                  <span className="timer__todo-dot" style={{ backgroundColor: PRIORITY_DOT[t.priority] || PRIORITY_DOT.medium }} />
                  {t.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="timer__history">
            <div className="timer__history-title">Recent sessions</div>
            <div className="timer__history-list">
              {history.map((h, i) => (
                <div className="timer__history-row" key={i}>
                  <span className="timer__history-mode">
                    {PRESET_MODES[h.mode]?.label || (h.mode === "custom" ? "Custom" : h.mode)}
                  </span>
                  {h.subject && <span className="timer__history-subject">{h.subject}</span>}
                  <span className="timer__history-duration">{fmtHistoryDuration(h.durationMinutes)}</span>
                  <span className="timer__history-coins">+{h.coinsEarned}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}