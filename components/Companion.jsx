"use client";
import "@/styles/companion.css";
import { useState, useEffect } from "react";

const SHOP_KEY = "chintu-shop";
const SHOP_CHANGE_EVENT = "chintu-shop-change";

function readEquippedAccessories() {
  try {
    const raw = localStorage.getItem(SHOP_KEY);
    const wearable = raw ? JSON.parse(raw)?.equipped?.wearable : null;
    return wearable ? [wearable] : [];
  } catch {
    return [];
  }
}

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

// Drawn on the same 2048x2048 canvas as the mood art above, so they line up
// automatically as long as they share the same object-fit/object-position.
const ACCESSORY_IMAGES = {
  bowtie:     "/companion/bowtie.PNG",
  glasses:    "/companion/glasses.PNG",
  scarf:      "/companion/scarf.PNG",
  headphones: "/companion/headphones.PNG",
  book:       "/companion/book.PNG",
};

export default function Companion({ mood = "studying", accessories = null }) {
  const [imgError, setImgError] = useState(false);
  const [equipped, setEquipped] = useState([]);

  // When the caller doesn't pin down `accessories` explicitly, follow
  // whatever's equipped in the shop — so buying an outfit shows it
  // everywhere the companion appears, not just on the shop page.
  useEffect(() => {
    if (accessories) return;
    setEquipped(readEquippedAccessories());
    function handleChange() { setEquipped(readEquippedAccessories()); }
    window.addEventListener(SHOP_CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(SHOP_CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [accessories]);

  const activeAccessories = accessories || equipped;
  const src = MOOD_IMAGES[mood] || MOOD_IMAGES.studying;
  const fallbackBg = MOOD_FALLBACK_COLORS[mood] || "#9B6FD4";

  return (
    <div className="companion-float">
      {!imgError ? (
        <div className="companion-stage">
          <img
            src={src}
            alt={`Companion is ${mood}`}
            onError={() => setImgError(true)}
            className="companion-img"
          />
          {activeAccessories.filter(key => ACCESSORY_IMAGES[key]).map(key => (
            <img
              key={key}
              src={ACCESSORY_IMAGES[key]}
              alt=""
              className="companion-accessory-img"
            />
          ))}
        </div>
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