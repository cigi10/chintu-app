"use client";
import "@/styles/toast-progress.css";
import { useState, useEffect } from "react";

// Ambient decoration tied to the timer's running state — NOT a progress
// indicator (it isn't scaled to session %). Same plain image-swap
// mechanism Companion.jsx uses for mood art (a lookup index picks a src,
// no CSS animation/scale/glow).
//
// Behavior: static on bread.PNG until Start is pressed. While running,
// steps forward through all 6 real frames on a fixed interval, wrapping
// straight from the last frame back to bread and continuing — forward
// only, never reverse/ping-pong. Pausing freezes on whatever frame is
// showing. `resetKey` changing (Reset, switching modes, setting a new
// custom time, or restarting after Done) snaps it back to bread.
const TOAST_IMAGES = [
  "/toast-nutella-banana-strawberry-blueberry/bread.PNG",
  "/toast-nutella-banana-strawberry-blueberry/toast.PNG",
  "/toast-nutella-banana-strawberry-blueberry/toast-nutella.PNG",
  "/toast-nutella-banana-strawberry-blueberry/toast-nutella-banana.PNG",
  "/toast-nutella-banana-strawberry-blueberry/toast-nutella-banana-strawberry.PNG",
  "/toast-nutella-banana-strawberry-blueberry/toast-nutella-banana-strawberry-blueberry.PNG",
];

const STEP_MS = 2500;

export default function ToastProgress({ running, resetKey }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (!running) return; // paused or idle: freeze on the current frame
    const id = setInterval(() => setStep((s) => (s + 1) % TOAST_IMAGES.length), STEP_MS);
    return () => clearInterval(id);
  }, [running]);

  return <img src={TOAST_IMAGES[step]} alt="Toast" className="toast-progress__image" />;
}
