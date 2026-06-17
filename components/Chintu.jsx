// components/Chintu.jsx
// Displays a real Chintu image based on the "mood" prop.
// Images live directly in /public/ (not in a subfolder).
//
// Valid moods: "studying" | "happy" | "sleepy" | "waiting" | "sad"

"use client";
import { useState } from "react";

// Mood → image filename mapping (files are in /public/ root)
const MOOD_IMAGES = {
  studying: "/studying_chintu.PNG",
  happy:    "/happy_chintu.PNG",
  sleepy:   "/sleepy_chintu.PNG",
  waiting:  "/idle_chintu.PNG",
  sad:      "/sad_chintu.PNG",
};

// Fallback circle colors if image fails — warm tones matching the art
const MOOD_FALLBACK_COLORS = {
  studying: "#F97316",
  happy:    "#22C55E",
  sleepy:   "#8B5CF6",
  waiting:  "#FDF6EC",
  sad:      "#94A3B8",
};

export default function Chintu({ mood = "studying" }) {
  const [imgError, setImgError] = useState(false);

  const src = MOOD_IMAGES[mood] || MOOD_IMAGES.studying;
  const fallbackBg = MOOD_FALLBACK_COLORS[mood] || "#F97316";

  return (
    <>
    <style>{`
      @keyframes chintu-bob {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-6px); }
      }
      .chintu-float {
        animation: chintu-bob 2s ease-in-out infinite;
      }
      `}</style>

      <div className="chintu-float" style={{ display: "inline-block" }}>
      {!imgError ? (
        <img
        src={src}
        alt={`Chintu is ${mood}`}
        onError={() => setImgError(true)}
        style={{
          width: "400px",       /* bigger! */
          height: "auto",
          objectFit: "contain",
          display: "block",
          /* no glow/drop-shadow — letting the art speak for itself */
        }}
        />
      ) : (
        <div
        style={{
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          backgroundColor: fallbackBg,
          border: mood === "waiting" ? "3px solid #F97316" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        >
        <span style={{ fontSize: "6rem", lineHeight: 1 }}>🐿️</span>
        </div>
      )}
      </div>
      </>
  );
}
