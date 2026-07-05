"use client";
import "@/styles/companion.css";
import { useState } from "react";

const MOOD_IMAGES = {
  studying:         "/companion/mood-studying.PNG",
  studying_wo_book: "/companion/mood-studying-wo-book.PNG",
  happy:            "/companion/mood-happy.PNG",
  sleepy:           "/companion/mood-sleepy.PNG",
  waiting:          "/companion/mood-waiting.PNG",
  worried:          "/companion/mood-worried.PNG",
  curious:          "/companion/mood-curious.PNG",
  determined:       "/companion/mood-determined.PNG",
  surprised:        "/companion/mood-surprised.PNG",
  thoughtful:       "/companion/mood-thoughtful.PNG",
  cozy:             "/companion/mood-cozy.PNG",
  celebrating:      "/companion/mood-celebrating-big1.PNG",
  celebrating2:     "/companion/mood-celebrating-big2.PNG",
  proud:            "/companion/mood-proud.PNG",
};

const MOOD_FALLBACK_COLORS = {
  studying: "#9B6FD4",
  happy:    "#7EC8A0",
  sleepy:   "#93ABD9",
  waiting:  "#E7BEF8",
  sad:      "#6E6688",
  proud:    "#F2619C",
};

export default function Companion({ mood = "studying" }) {
  const [imgError, setImgError] = useState(false);

  const src = MOOD_IMAGES[mood] || MOOD_IMAGES.studying;
  const fallbackBg = MOOD_FALLBACK_COLORS[mood] || "#9B6FD4";

  return (
    <div className="companion-float">
      {!imgError ? (
        <img
          src={src}
          alt={`Companion is ${mood}`}
          onError={() => setImgError(true)}
          className="companion-img"
        />
      ) : (
        <div
          className="companion-fallback"
          style={{ backgroundColor: fallbackBg, border: mood === "waiting" ? "3px solid #9B6FD4" : "none" }}
        >
          <span className="companion-fallback__emoji">🐱</span>
        </div>
      )}
    </div>
  );
}