"use client";
// components/DashboardContent.jsx
// Greeting, Chintu in his decorated room, today's timetable, quick stats, streak.

import { useState, useEffect } from "react";
import Chintu from "@/components/Chintu";
import StreakBanner from "@/components/StreakBanner";

const TIMETABLE_KEY = "chintu-timetable";
const SHOP_KEY = "chintu-shop";
const SESSION_LOG_KEY = "chintu-session-log";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning! 🌤️";
  if (hour < 17) return "Good afternoon! ☀️";
  if (hour < 21) return "Good evening! 🌆";
  return "Studying late? 🌙";
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

const ITEM_EMOJI = {
  chai: "🍵", succulent: "🌱", books: "📚", lamp: "🪔",
  starchart: "⭐", poster: "📋", rainwindow: "🌧️",
  glasses: "👓", scarf: "🧣", gradcap: "🎓", diwali: "✨", headband: "🏹",
};

export default function DashboardContent() {
  const [shop, setShop] = useState({ owned: [], equipped: {} });
  const [todaySlots, setTodaySlots] = useState([]);
  const [todayStats, setTodayStats] = useState({ minutes: 0, coins: 0 });

  useEffect(() => {
    setShop(loadJSON(SHOP_KEY, { owned: [], equipped: {} }));

    const timetable = loadJSON(TIMETABLE_KEY, {});
    const today = DAYS[new Date().getDay()];
    const slots = Object.entries(timetable)
      .filter(([key]) => key.startsWith(`${today}-`))
      .map(([key, val]) => ({ time: key.split("-")[1], ...val }));
    setTodaySlots(slots);

    const log = loadJSON(SESSION_LOG_KEY, []);
    const todayStr = new Date().toISOString().slice(0, 10);
    const todays = log.filter(s => s.date === todayStr);
    setTodayStats({
      minutes: todays.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
      coins: todays.reduce((sum, s) => sum + (s.coinsEarned || 0), 0),
    });
  }, []);

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "1.5rem 1.25rem 6rem", textAlign: "center" }}>
      <h1 style={{ fontWeight: 800, fontSize: "1.4rem", margin: "0 0 1rem" }}>{greeting()}</h1>

      <StreakBanner />

      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "1.6rem" }}>{shop.equipped?.wall ? ITEM_EMOJI[shop.equipped.wall] : ""}</div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Chintu mood="studying" />
          {shop.equipped?.wearable && (
            <span style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", fontSize: "2.6rem" }}>
              {ITEM_EMOJI[shop.equipped.wearable]}
            </span>
          )}
        </div>
        <div style={{ fontSize: "1.6rem" }}>{shop.equipped?.desk ? ITEM_EMOJI[shop.equipped.desk] : ""}</div>
      </div>

      <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "8px" }}>Today's plan</h2>
        {todaySlots.length === 0 ? (
          <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#A8A29E" }}>
            Nothing scheduled yet — add slots in your timetable.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {todaySlots.map((slot, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", backgroundColor: slot.color || "#FFFBF5", borderRadius: "10px", padding: "8px 12px", fontWeight: 700, fontSize: "0.82rem" }}>
                <span>{slot.time}</span>
                <span>{slot.subject}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <div style={{ flex: 1, backgroundColor: "#FFFBF5", border: "2px solid #FEF3C7", borderRadius: "14px", padding: "12px" }}>
          <div style={{ fontWeight: 900, fontSize: "1.3rem", color: "#F97316" }}>{todayStats.minutes}m</div>
          <div style={{ fontWeight: 700, fontSize: "0.7rem", color: "#92400E" }}>Today's study time</div>
        </div>
        <div style={{ flex: 1, backgroundColor: "#FFFBF5", border: "2px solid #FEF3C7", borderRadius: "14px", padding: "12px" }}>
          <div style={{ fontWeight: 900, fontSize: "1.3rem", color: "#F97316" }}>{todayStats.coins} 🪙</div>
          <div style={{ fontWeight: 700, fontSize: "0.7rem", color: "#92400E" }}>Coins earned today</div>
        </div>
      </div>
    </div>
  );
}