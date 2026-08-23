"use client";
import "@/styles/timer.css";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Companion from "@/components/Companion";
import Button from "@/components/Button";
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
// Below this, finishing early earns nothing — avoids gaming the coin system
// with a tap-and-immediately-finish loop.
const MIN_EARLY_FINISH_SECONDS = 60;

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

  const intervalRef      = useRef(null);
  const endAtRef          = useRef(null);
  const subjectRef        = useRef(subject);
  const autoCycleRef      = useRef(false);
  const autoCycleCountRef = useRef(0);
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

  function coinsForSession(modeKey, durationSecs) {
    if (modeKey === "shortBreak") return 2;
    if (modeKey === "longBreak")  return 5;
    if (modeKey === "study")      return 10;
    return Math.floor(durationSecs / 180);
  }

  // Partial credit for a session ended early: same "1 coin per 3 minutes"
  // rate custom timers already use, so leaving after 10 minutes of a 25-minute
  // study block earns roughly what a 10-minute custom timer would.
  function coinsForEarlyFinish(durationSecs) {
    return Math.max(1, Math.floor(durationSecs / 180));
  }

  function completeSession(modeKey, durationSecs, subj, goalId, isEarly = false) {
    setRunning(false);
    setDone(true);
    setTimeLeft(0);

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

    if (modeKey === "study" || modeKey === "custom") {
      recordStudySession();
      const ns = loadSessions() + 1;
      saveSessions(ns);
      setSessions(ns);
    }

    clearTimerState();

    if (!isEarly && autoCycleRef.current && modeKey !== "custom") {
      let nextMode;
      if (modeKey === "study") {
        const newCount = autoCycleCountRef.current + 1;
        autoCycleCountRef.current = newCount;
        saveAutoCycleCount(newCount);
        nextMode = newCount % 4 === 0 ? "longBreak" : "shortBreak";
      } else {
        nextMode = "study";
      }
      setTimeout(() => startModeAuto(nextMode), AUTO_CYCLE_DELAY_MS);
    }
  }

  // Ends the session now instead of waiting for the countdown to hit zero,
  // awarding partial coins for whatever time actually elapsed. Below
  // MIN_EARLY_FINISH_SECONDS this just resets — too short to be worth logging.
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

  function startModeAuto(newMode) {
    clearTimerState();
    const dur = PRESET_MODES[newMode].duration;
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
    if (running) return PRESET_MODES[mode]?.mood || "studying";
    return "waiting";
  }

  const chintuMood = getChintuMood();
  // Show Finish whenever there's real progress to bank — running, or paused
  // partway through — but not before starting or after it's already done.
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
                title="Automatically move from study to break and back"
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
              <Button onClick={handleStartPause} variant={running ? "secondary" : "primary"} size="lg">
                {done ? "Again" : running ? "Pause" : "Start"}
              </Button>
              {hasProgress && (
                <Button onClick={handleFinishEarly} variant="done" size="lg">
                  Finish
                </Button>
              )}
              <Button onClick={handleReset} variant="secondary" size="lg">Reset</Button>
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