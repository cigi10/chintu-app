"use client";
// components/StreakBanner.jsx
// Never shows a "broken streak" message — guilt-free by design.

import { useState, useEffect } from "react";
import { getStreakInfo, clearCheckIn } from "@/lib/streakLogic";

export default function StreakBanner() {
  const [info, setInfo] = useState(null);
  const [checkInAnswer, setCheckInAnswer] = useState(null);

  useEffect(() => { setInfo(getStreakInfo()); }, []);

  if (!info) return null;

  function handleCheckIn(answer) {
    setCheckInAnswer(answer);
    clearCheckIn();
  }

  return (
    <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
      <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#92400E", backgroundColor: "#FEF3C7", borderRadius: "999px", display: "inline-block", padding: "5px 14px", margin: "0 0 8px" }}>
        {info.streakCount} day{info.streakCount === 1 ? "" : "s"} with Chintu 🐿️
      </p>

      {info.message && (
        <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1C1917", margin: "0 0 8px" }}>
          {info.message}
        </p>
      )}

      {info.showCheckIn && checkInAnswer === null && (
        <div style={{ backgroundColor: "#FFFBF5", border: "2px solid #FEF3C7", borderRadius: "16px", padding: "14px", maxWidth: "300px", margin: "0 auto" }}>
          <p style={{ fontWeight: 700, fontSize: "0.92rem", margin: "0 0 10px" }}>Hey, everything okay?</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button onClick={() => handleCheckIn("okay")} style={{ padding: "8px 14px", borderRadius: "999px", border: "none", backgroundColor: "#F97316", color: "#fff", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
              I'm okay, let's study
            </button>
            <button onClick={() => handleCheckIn("not_really")} style={{ padding: "8px 14px", borderRadius: "999px", border: "2px solid #FEF3C7", backgroundColor: "transparent", color: "#92400E", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
              Not really
            </button>
          </div>
        </div>
      )}

      {checkInAnswer === "not_really" && (
        <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#92400E", backgroundColor: "#FEF3C7", borderRadius: "14px", padding: "12px 16px", maxWidth: "300px", margin: "0 auto" }}>
          That's okay. iCall is free, confidential, and just for talking: <strong>9152987821</strong>
        </p>
      )}
    </div>
  );
}