"use client";
import "@/styles/streak.css";
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
    <div className="streak-banner">
      <p className="streak-banner__pill">
        {info.streakCount} day{info.streakCount === 1 ? "" : "s"} — keep going
      </p>

      {info.message && (
        <p className="streak-banner__message">{info.message}</p>
      )}

      {info.showCheckIn && checkInAnswer === null && (
        <div className="streak-banner__checkin-card">
          <p className="streak-banner__checkin-title">Hey, everything okay?</p>
          <div className="streak-banner__checkin-btns">
            <button className="streak-banner__checkin-ok" onClick={() => handleCheckIn("okay")}>
              I'm okay, let's study
            </button>
            <button className="streak-banner__checkin-nope" onClick={() => handleCheckIn("not_really")}>
              Not really
            </button>
          </div>
        </div>
      )}

      {checkInAnswer === "not_really" && (
        <p className="streak-banner__support-card">
          That's okay. iCall is free, confidential, and just for talking:{" "}
          <strong>9152987821</strong>
        </p>
      )}
    </div>
  );
}