"use client";
import "@/styles/flip-clock.css";
import { useEffect, useRef, useState } from "react";

function getRemaining(targetMs) {
  const total = Math.max(0, targetMs - Date.now());
  return {
    total,
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

// One flipping tile. The static halves show the new value on top and the
// previous value underneath; two flaps animate over them (old top half
// folding down, then new bottom half landing), and once the second flap
// lands the static bottom catches up to the new value.
function FlipDigit({ value }) {
  const [previous, setPrevious] = useState(value);
  const flipping = previous !== value;

  return (
    <span className="flip-digit" aria-hidden="true">
      <span className="flip-digit__half flip-digit__half--top"><span>{value}</span></span>
      <span className="flip-digit__half flip-digit__half--bottom"><span>{previous}</span></span>
      {flipping && (
        <>
          <span key={`top-${value}`} className="flip-digit__half flip-digit__half--top flip-digit__flap-top"><span>{previous}</span></span>
          <span
            key={`bottom-${value}`}
            className="flip-digit__half flip-digit__half--bottom flip-digit__flap-bottom"
            onAnimationEnd={() => setPrevious(value)}
          >
            <span>{value}</span>
          </span>
        </>
      )}
    </span>
  );
}

function FlipUnit({ value, label, minDigits = 2 }) {
  const digits = value === null ? "-".repeat(minDigits) : String(value).padStart(minDigits, "0");
  return (
    <div className="flip-unit">
      <div className="flip-unit__digits">
        {digits.split("").map((d, i) => (
          // Keyed by position from the right, so the ones digit stays the
          // same element when days drop from 100 to 99.
          <FlipDigit key={digits.length - i} value={d} />
        ))}
      </div>
      <span className="flip-unit__label">{label}</span>
    </div>
  );
}

/**
 * Flip-clock countdown to `target` (an ISO instant). Renders placeholder
 * tiles on the server and until mount, so the layout doesn't jump and
 * the server HTML never shows a stale time.
 */
export default function FlipClock({ target, label }) {
  const targetMs = useRef(new Date(target).getTime());
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    targetMs.current = new Date(target).getTime();
    const tick = () => setRemaining(getRemaining(targetMs.current));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (remaining && remaining.total === 0) {
    return <p className="flip-clock__done">{`${label} is underway or has already happened. Good luck!`}</p>;
  }

  const r = remaining ?? { days: null, hours: null, minutes: null, seconds: null };
  const plural = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"}`;
  const srText = remaining
    ? `${plural(r.days, "day")}, ${plural(r.hours, "hour")}, ${plural(r.minutes, "minute")} until ${label}`
    : `Countdown to ${label}`;

  return (
    <div className="flip-clock" role="timer" aria-label={srText}>
      <FlipUnit value={r.days} label="Days" minDigits={r.days !== null && r.days >= 100 ? 3 : 2} />
      <FlipUnit value={r.hours} label="Hours" />
      <FlipUnit value={r.minutes} label="Minutes" />
      <FlipUnit value={r.seconds} label="Seconds" />
    </div>
  );
}
