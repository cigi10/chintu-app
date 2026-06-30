"use client";
import "@/styles/dashboard.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";
import StreakBanner from "@/components/StreakBanner";

const TIMETABLE_KEY   = "chintu-timetable";
const SHOP_KEY        = "chintu-shop";
const SESSION_LOG_KEY = "chintu-session-log";
const TODO_KEY        = "chintu-todos";
const MOOD_KEY        = "chintu-mood-log";
const REVISION_KEY    = "chintu-revisions";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MOODS = [
  { key: "great",    label: "Great",    color: "#7EC8A0" },
  { key: "good",     label: "Good",     color: "#EDE986" },
  { key: "okay",     label: "Okay",     color: "#93ABD9" },
  { key: "tired",    label: "Tired",    color: "#E7BEF8" },
  { key: "stressed", label: "Stressed", color: "#F9C060" },
  { key: "low",      label: "Low",      color: "#9A8C7A" },
];

const PRIORITY_COLOR = { high: "#F2619C", medium: "#F9C060", low: "#7EC8A0" };

const WEARABLE_IMAGES = {
  glasses:    "/companion/glasses.PNG",
  scarf:      "/companion/scarf.PNG",
  bowtie:     "/companion/bowtie.PNG",
  headphones: "/companion/headphones.PNG",
};

const ITEM_EMOJI = {
  chai:"🍵", succulent:"🌱", books:"📚", lamp:"🪔",
  starchart:"⭐", poster:"📋", rainwindow:"🌧️",
  gradcap:"🎓", diwali:"✨", headband:"🏹",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning!";
  if (h < 17) return "Good afternoon!";
  if (h < 21) return "Good evening!";
  return "Studying late?";
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function loadJSON(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}

const DAILY_QUOTES = [
  "Small steps every day add up to big results.",
  "You don't have to be perfect, just consistent.",
  "Every expert was once a beginner.",
  "Focus on progress, not perfection.",
  "The work you put in today is the result you see tomorrow.",
  "One topic at a time. You've got this.",
  "Rest if you must, but don't quit.",
  "Your future self is cheering you on.",
  "Hard work beats talent when talent doesn't work hard.",
  "Show up. That's already half the battle.",
  "You are closer than you think.",
  "A little progress each day adds up to big results.",
  "Study like there's no tomorrow, rest like you earned it.",
  "Difficult roads often lead to beautiful destinations.",
];

function getDailyQuote() {
  const day = new Date().getDate() + new Date().getMonth() * 31;
  return DAILY_QUOTES[day % DAILY_QUOTES.length];
}

export default function DashboardContent() {
  const [shop, setShop]                 = useState({ owned: [], equipped: {} });
  const [todaySlots, setTodaySlots]     = useState([]);
  const [todayStats, setTodayStats]     = useState({ minutes: 0, coins: 0 });
  const [todos, setTodos]               = useState([]);
  const [todayMood, setTodayMood]       = useState(null);
  const [sliderVal, setSliderVal]       = useState(0);
  const [revisionsDue, setRevisionsDue] = useState([]);
  const [nextSlot, setNextSlot]         = useState(null);

  useEffect(() => {
    setShop(loadJSON(SHOP_KEY, { owned: [], equipped: {} }));

    // Timetable
    const timetable = loadJSON(TIMETABLE_KEY, {});
    const today = DAYS[new Date().getDay()];
    const slots = Object.entries(timetable)
      .filter(([key]) => key.startsWith(`${today}-`))
      .map(([key, val]) => ({ time: key.split("-")[1], ...val }))
      .sort((a, b) => a.time.localeCompare(b.time));
    setTodaySlots(slots);

    // Next upcoming slot
    const nowHour = new Date().getHours();
    const nowMin  = new Date().getMinutes();
    const upcoming = slots.find(s => {
      const parts = s.time.split(" ");
      const [h, mn = 0] = parts[0].split(":").map(Number);
      const period = parts[1];
      let hr = h;
      if (period === "PM" && hr !== 12) hr += 12;
      if (period === "AM" && hr === 12) hr = 0;
      return hr > nowHour || (hr === nowHour && mn > nowMin);
    });
    setNextSlot(upcoming || null);

    // Session log
    const log = loadJSON(SESSION_LOG_KEY, []);
    const todays = log.filter(s => s.date === todayStr());
    setTodayStats({
      minutes: todays.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
      coins:   todays.reduce((sum, s) => sum + (s.coinsEarned || 0), 0),
    });

    // Todos — pending only, max 4
    const allTodos = loadJSON(TODO_KEY, []);
    setTodos(allTodos.filter(t => !t.done).slice(0, 4));

    // Mood
    const moodLog = loadJSON(MOOD_KEY, []);
    const todayMoodEntry = moodLog.find(e => e.date === todayStr());
    if (todayMoodEntry) {
      setTodayMood(todayMoodEntry.mood);
      const idx = MOODS.findIndex(m => m.key === todayMoodEntry.mood);
      if (idx !== -1) setSliderVal(idx);
    }

    // Revisions due today
    const revisions = loadJSON(REVISION_KEY, []);
    setRevisionsDue(revisions.filter(r => r.dueDate <= todayStr()).slice(0, 3));
  }, []);

  function logMood(moodKey) {
    const moodLog = loadJSON(MOOD_KEY, []);
    const filtered = moodLog.filter(e => e.date !== todayStr());
    const updated = [{ date: todayStr(), mood: moodKey }, ...filtered];
    setTodayMood(moodKey);
    try { localStorage.setItem(MOOD_KEY, JSON.stringify(updated)); } catch {}
  }

  function handleSliderChange(val) {
    setSliderVal(val);
  }

  function handleSliderCommit(val) {
    logMood(MOODS[val].key);
  }

  const wearableKey = shop.equipped?.wearable;
  const hasWearableImage = wearableKey && WEARABLE_IMAGES[wearableKey];
  const todayMoodObj = MOODS.find(m => m.key === todayMood);
  const activeMood = MOODS[sliderVal];

  return (
    <div className="dashboard">
      <img src="/companion/indoor-bg.PNG" alt="" className="dashboard__scene-bg" />

      <h1 className="dashboard__greeting">{greeting()}</h1>
      <StreakBanner />

      <div className="dashboard__main">

        {/* LEFT — Chintu */}
        <div className="dashboard__chintu-side">
          <div className="dashboard__companion-wrap">
            <Companion mood="studying" />
            {hasWearableImage ? (
              <img src={WEARABLE_IMAGES[wearableKey]} alt={wearableKey} className="dashboard__wearable-img" />
            ) : wearableKey ? (
              <span className="dashboard__wearable">{ITEM_EMOJI[wearableKey]}</span>
            ) : null}
          </div>
        </div>

        {/* RIGHT — info */}
        <div className="dashboard__info-side">

          {/* Daily quote */}
          <p className="dashboard__quote">"{getDailyQuote()}"</p>

          {/* Mood check-in */}
          <div className="dashboard__section">
            <h2 className="dashboard__section-heading">
              How are you feeling?
              {todayMood && (
                <span className="dashboard__mood-logged" style={{ background: todayMoodObj.color }}>
                  {todayMoodObj.label}
                </span>
              )}
            </h2>
            <div className="dashboard__mood-slider-wrap">
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={sliderVal}
                className="dashboard__mood-slider"
                style={{
                  background: `linear-gradient(to right, ${MOODS[0].color}, ${activeMood.color})`
                }}
                onChange={e => handleSliderChange(Number(e.target.value))}
                onMouseUp={e => handleSliderCommit(Number(e.target.value))}
                onTouchEnd={e => handleSliderCommit(Number(e.target.value))}
              />
              <span className="dashboard__mood-slider-label" style={{ color: activeMood.color }}>
                {activeMood.label}
              </span>
            </div>
          </div>

          {/* Next up */}
          {nextSlot && (
            <div className="dashboard__section">
              <h2 className="dashboard__section-heading">Next up</h2>
              <div className="dashboard__next-slot" style={{ borderColor: nextSlot.color || "var(--color-accent)" }}>
                <span className="dashboard__next-time">{nextSlot.time}</span>
                <span className="dashboard__next-subject">{nextSlot.subject}</span>
              </div>
            </div>
          )}

          {/* Today's plan */}
          <div className="dashboard__section">
            <h2 className="dashboard__section-heading">Today's plan</h2>
            {todaySlots.length === 0 ? (
              <p className="dashboard__plan-empty">Nothing scheduled — add slots in your timetable.</p>
            ) : (
              <div className="dashboard__plan-list">
                {todaySlots.map((slot, i) => (
                  <div key={i} className="dashboard__plan-slot" style={{ backgroundColor: slot.color || "var(--color-surface)" }}>
                    <span>{slot.time}</span>
                    <span>{slot.subject}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* To-do */}
          <div className="dashboard__section">
            <h2 className="dashboard__section-heading">To-do</h2>
            {todos.length === 0 ? (
              <p className="dashboard__plan-empty">No pending tasks.</p>
            ) : (
              <div className="dashboard__todo-list">
                {todos.map(t => (
                  <div key={t.id} className="dashboard__todo-item">
                    <span className="dashboard__todo-dot" style={{ background: PRIORITY_COLOR[t.priority] }} />
                    <span className="dashboard__todo-text">{t.text}</span>
                    {t.due && <span className="dashboard__todo-due">{t.due}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revisions due */}
          {revisionsDue.length > 0 && (
            <div className="dashboard__section">
              <h2 className="dashboard__section-heading">Revisions due</h2>
              <div className="dashboard__todo-list">
                {revisionsDue.map(r => (
                  <div key={r.id} className="dashboard__todo-item">
                    <span className="dashboard__todo-dot" style={{ background: "#93ABD9" }} />
                    <span className="dashboard__todo-text">{r.subject} — {r.topic}</span>
                    <span className="dashboard__todo-due">{r.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="dashboard__stats-col">
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-value">{todayStats.minutes}m</div>
              <div className="dashboard__stat-label">Study time</div>
            </div>
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-value">{todayStats.coins} 🪙</div>
              <div className="dashboard__stat-label">Coins today</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}