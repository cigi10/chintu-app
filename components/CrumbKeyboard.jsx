"use client";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const KEY_LABEL = { ENTER: "Enter", BACKSPACE: "⌫" };
const KEY_ARIA_LABEL = { ENTER: "Enter", BACKSPACE: "Backspace" };

/**
 * On-screen QWERTY keyboard for Crumb. `keyStatuses` is the letter ->
 * "correct" | "present" | "absent" map from lib/wordGame's
 * computeKeyStatuses, so a key's color reflects every guess submitted so
 * far, not just the most recent one. Tapping a key and pressing the same
 * physical key both funnel through the same `onKey` callback in
 * CrumbGame, so on-screen and physical input can never drift apart.
 */
export default function CrumbKeyboard({ keyStatuses, onKey, disabled }) {
  return (
    <div className="crumb-keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="crumb-keyboard-row">
          {row.map(key => {
            const isWide = key === "ENTER" || key === "BACKSPACE";
            const status = keyStatuses[key];
            return (
              <button
                key={key}
                type="button"
                className={`crumb-key${isWide ? " crumb-key--wide" : ""}${status ? ` crumb-key--${status}` : ""}`}
                onClick={() => onKey(key)}
                disabled={disabled}
                aria-label={KEY_ARIA_LABEL[key] || key}
              >
                {KEY_LABEL[key] || key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
